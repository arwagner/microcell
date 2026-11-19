import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parse as parseYaml } from "yaml";

// The content loader checks the shape of each file and that every number is cited. What it can't
// know is the inventory this ticket fixes: which three sites, machines and parts exist, how they hang
// together, that each machine's structure is one the asset manifest credits, and that the ATP
// synthase size rests on the mammalian measurement rather than the older bacterial figure.

const ROOT = join(import.meta.dirname, "..");

// Each site sits in the organelle it belongs to and holds the one machine shown there.
const SITES = {
	"transcription-site": { parent: "nucleus", machine: "rna-polymerase-ii" },
	"rough-er-surface": { parent: "rough-er", machine: "ribosome" },
	crista: { parent: "mitochondrion", machine: "atp-synthase" },
};
const MACHINES = {
	"rna-polymerase-ii": { parent: "transcription-site", pdb: "5FLM" },
	ribosome: { parent: "rough-er-surface", pdb: "4V6X" },
	"atp-synthase": { parent: "crista", pdb: "8H9S" },
};
const PARTS = {
	"c-ring": "atp-synthase",
	"central-stalk": "atp-synthase",
	"f1-head": "atp-synthase",
	"peripheral-stalk": "atp-synthase",
	"ribosome-small-subunit": "ribosome",
	"ribosome-large-subunit": "ribosome",
	"polymerase-clamp": "rna-polymerase-ii",
	"polymerase-active-site": "rna-polymerase-ii",
	"polymerase-jaw": "rna-polymerase-ii",
};

interface Source {
	key: string;
	file?: string;
	section?: string;
	url?: string;
}

interface Entry {
	id: string;
	kind: string;
	name: string;
	stop: string;
	parent: string;
	machine?: string;
	process?: string;
	count?: unknown;
	pdb?: { id: string; source: string };
	size_nm?: { value: number; source: string };
	sources: Source[];
	body: string;
}

function read(dir: string, id: string): Entry {
	const text = readFileSync(join(ROOT, "content", dir, `${id}.md`), "utf8");
	const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
	if (!m) throw new Error(`${dir}/${id}: no frontmatter`);
	return { ...(parseYaml(m[1] ?? "") as Omit<Entry, "body">), body: m[2] ?? "" };
}

function filesIn(dir: string): string[] {
	const path = join(ROOT, "content", dir);
	return existsSync(path) ? readdirSync(path).sort() : [];
}

function section(body: string, heading: string): string {
	const m = new RegExp(`^## ${heading}\\r?\\n([\\s\\S]*?)(?=^## |(?![\\s\\S]))`, "m").exec(body);
	return m?.[1]?.trim() ?? "";
}

function headings(file: string): string[] {
	return readFileSync(join(ROOT, file), "utf8")
		.split(/\r?\n/)
		.flatMap((line) => /^#{1,6}\s+(.+?)\s*$/.exec(line)?.[1] ?? []);
}

const MARKER = /\[([A-Za-z0-9][\w-]*)\](?!\()/g;

function words(text: string): number {
	return text.replace(MARKER, "").split(/\s+/).filter(Boolean).length;
}

// A digit anywhere outside a name (F1, RPB5, 80S) counts as a figure. Stricter than the loader's rule
// on purpose: these files are short, and a false alarm costs one citation.
function hasFigure(sentence: string): boolean {
	return sentence
		.replace(MARKER, " ")
		.split(/[^\p{L}\p{N}]+/u)
		.some((t) => /\d/.test(t) && !/^\p{L}/u.test(t) && !/^\d+S$/.test(t));
}

const sites = Object.keys(SITES).map((id) => read("sites", id));
const machines = Object.keys(MACHINES).map((id) => read("machines", id));
const parts = Object.keys(PARTS).map((id) => read("parts", id));
const all = [...sites, ...machines, ...parts];

test("content holds exactly the three sites, three machines and their parts", () => {
	expect(filesIn("sites")).toEqual(
		Object.keys(SITES)
			.map((id) => `${id}.md`)
			.sort(),
	);
	expect(filesIn("machines")).toEqual(
		Object.keys(MACHINES)
			.map((id) => `${id}.md`)
			.sort(),
	);
	expect(filesIn("parts")).toEqual(
		Object.keys(PARTS)
			.map((id) => `${id}.md`)
			.sort(),
	);
	expect(new Set(all.map((e) => e.id)).size).toBe(all.length);
});

describe.each(sites)("site $id", (s) => {
	const want = SITES[s.id as keyof typeof SITES];

	test("is a site at the Machinery stop, inside its organelle, naming its machine", () => {
		expect([s.kind, s.stop, s.parent, s.machine]).toEqual(["site", "Machinery", want.parent, want.machine]);
	});

	// The process files, and each site's link to one, come in a later ticket.
	test("does not name a process yet", () => {
		expect(s.process).toBeUndefined();
	});
});

describe.each(machines)("machine $id", (m) => {
	const want = MACHINES[m.id as keyof typeof MACHINES];

	test("is a machine at the Molecule stop, inside its site", () => {
		expect([m.kind, m.stop, m.parent]).toEqual(["machine", "Molecule", want.parent]);
	});

	test("has a cited PDB id that the asset manifest credits", () => {
		const manifest = JSON.parse(readFileSync(join(ROOT, "assets/manifest.json"), "utf8")) as { id: string }[];
		expect(m.pdb?.id).toBe(want.pdb);
		expect(manifest.map((a) => a.id)).toContain(`pdb-${String(m.pdb?.id).toLowerCase()}`);
		expect(m.sources.map((s) => s.key)).toContain(m.pdb?.source);
	});

	test("cites any size it gives", () => {
		if (m.size_nm === undefined) return;
		expect(m.size_nm.value).toBeGreaterThan(0);
		expect(m.sources.map((s) => s.key)).toContain(m.size_nm.source);
	});
});

describe.each(parts)("part $id", (p) => {
	test("is a part at the Molecule stop, inside its machine", () => {
		expect([p.kind, p.stop, p.parent]).toEqual(["part", "Molecule", PARTS[p.id as keyof typeof PARTS]]);
	});
});

describe.each(all)("$id", (e) => {
	test("cites only research sections that exist", () => {
		for (const s of e.sources) {
			expect(s.url, `[${s.key}] is a research file, not a url`).toBeUndefined();
			expect(headings(String(s.file)), `[${s.key}] in ${s.file}`).toContain(s.section);
		}
	});

	test("has the three explanation layers, in the voice limits", () => {
		const label = section(e.body, "Label");
		expect(label).not.toBe("");
		expect(label).not.toContain("\n");
		expect(words(label)).toBeLessThanOrEqual(8);
		expect(words(section(e.body, "Paragraph"))).toBeGreaterThan(0);
		expect(words(section(e.body, "Paragraph"))).toBeLessThanOrEqual(60);
		expect(section(e.body, "Go deeper")).not.toBe("");
	});

	test("cites every figure in its text, using only its own source keys", () => {
		const keys = e.sources.map((s) => s.key);
		const prose = ["Label", "Paragraph", "Go deeper"].map((h) => section(e.body, h)).join("\n\n");
		for (const sentence of prose.split(/(?<=[.!?](?:\[[\w-]+\])*)\s+/)) {
			const cited = [...sentence.matchAll(MARKER)].map((m) => m[1]);
			for (const key of cited) expect(keys, `[${key}] in "${sentence}"`).toContain(key);
			if (hasFigure(sentence)) expect(cited.length, `"${sentence}" needs a citation`).toBeGreaterThan(0);
		}
	});
});

// The two older notes disagree (about 25 nm, and about 20 nm for the bacterial enzyme). The app uses
// the figure measured in the human structure, so the citation has to land on that measurement.
test("ATP synthase's size cites the measurement in the human structure", () => {
	const atp = machines.find((m) => m.id === "atp-synthase");
	const source = atp?.sources.find((s) => s.key === atp.size_nm?.source);
	expect(source).toEqual({
		key: atp?.size_nm?.source,
		file: "research/machines.md",
		section: "ATP synthase size, measured in the human structure",
	});
	const research = readFileSync(join(ROOT, "research/machines.md"), "utf8");
	expect(research).toContain(`**about ${atp?.size_nm?.value} nm tall**`);
	expect(section(atp?.body ?? "", "Paragraph")).toContain(`about ${atp?.size_nm?.value} nm tall`);
});

// research/ has no confirmed count of ATP synthases per mitochondrion, so the content must not state one.
test("no unconfirmed ATP synthase count is stated", () => {
	for (const e of [...machines, ...sites]) {
		expect(e.count, e.id).toBeUndefined();
		expect(e.body, e.id).not.toMatch(/\d[\d,]*\s+ATP synthases/);
		expect(e.body, e.id).not.toMatch(/(thousands|hundreds) of ATP synthases/i);
	}
});
