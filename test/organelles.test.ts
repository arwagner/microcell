import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parse as parseYaml } from "yaml";

// The all-content checks (the parser and the citation-key test) belong to the content tickets this
// one depends on. This file pins what only this ticket fixes: which twelve organelles exist, which
// three can be dived into, and that figures research/ marks unconfirmed are never told to the
// learner as fact.

const ROOT = join(import.meta.dirname, "..");
const DIR = "content/organelles";

const ORGANELLES = [
	"plasma-membrane",
	"nucleus",
	"nucleolus",
	"rough-er",
	"smooth-er",
	"golgi",
	"mitochondrion",
	"lysosome",
	"peroxisome",
	"vesicle",
	"microtubule",
	"centrosome",
];
const DIVEABLE = ["nucleus", "mitochondrion", "rough-er"];
// research/cell-inventory.md has no measured per-cell count for these, so the count is a drawing
// placeholder that must be flagged and kept out of the text.
const UNCONFIRMED_COUNT = ["vesicle", "microtubule"];

interface Sourced {
	value?: number;
	min?: number;
	max?: number;
	source?: string;
}

interface Organelle {
	id: string;
	kind: string;
	stop: string;
	parent: string;
	colour: string;
	size_nm: Sourced;
	count: Sourced;
	diveable: boolean;
	coming_later?: string;
	uncertain?: string[];
	sources: { key: string; file?: string; section?: string; url?: string }[];
	body: string;
}

function read(id: string): Organelle {
	const text = readFileSync(join(ROOT, DIR, `${id}.md`), "utf8");
	const m = /^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/.exec(text);
	if (!m) throw new Error(`${id}: no frontmatter`);
	return { ...(parseYaml(m[1] ?? "") as Omit<Organelle, "body">), body: m[2] ?? "" };
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

function words(text: string): number {
	return text.split(/\s+/).filter((w) => w !== "" && !/^\[[\w-]+\]+$/.test(w)).length;
}

const all = ORGANELLES.map(read);

test("content/organelles holds exactly the twelve organelles", () => {
	const files = existsSync(join(ROOT, DIR)) ? readdirSync(join(ROOT, DIR)) : [];
	expect(files.sort()).toEqual(ORGANELLES.map((id) => `${id}.md`).sort());
	expect(all.map((o) => o.id)).toEqual(ORGANELLES);
});

describe.each(all)("$id", (o) => {
	test("is an organelle at the Cell stop, inside the cell (the nucleolus inside the nucleus)", () => {
		expect(o.kind).toBe("organelle");
		expect(o.stop).toBe("Cell");
		expect(o.parent).toBe(o.id === "nucleolus" ? "nucleus" : "cell");
	});

	test("has a real size and a whole-number count range, each citing a listed source", () => {
		const keys = o.sources.map((s) => s.key);
		expect(o.size_nm.value).toBeGreaterThan(0);
		expect(keys).toContain(o.size_nm.source);
		const { min = 0, max = 0 } = o.count;
		expect(Number.isInteger(min) && Number.isInteger(max) && min >= 1 && min <= max).toBe(true);
		expect(keys).toContain(o.count.source);
	});

	test("cites only research sections that exist", () => {
		for (const s of o.sources) {
			expect(s.url, `[${s.key}] is a research file, not a url`).toBeUndefined();
			expect(headings(String(s.file)), `[${s.key}] in ${s.file}`).toContain(s.section);
		}
	});

	test("has the three explanation layers, in the voice limits", () => {
		const label = section(o.body, "Label");
		expect(label).not.toBe("");
		expect(label).not.toContain("\n");
		expect(words(label)).toBeLessThanOrEqual(8);
		expect(words(section(o.body, "Paragraph"))).toBeGreaterThan(0);
		expect(words(section(o.body, "Paragraph"))).toBeLessThanOrEqual(60);
		expect(section(o.body, "Go deeper")).not.toBe("");
	});

	test("is diveable only if it is the nucleus, a mitochondrion or the rough ER; otherwise says what is coming", () => {
		expect(o.diveable).toBe(DIVEABLE.includes(o.id));
		if (o.diveable) expect(o.coming_later).toBeUndefined();
		else expect(o.coming_later?.trim()).toBeTruthy();
	});

	test("flags its count as uncertain exactly when research has no measured count, and never states it", () => {
		const unconfirmed = UNCONFIRMED_COUNT.includes(o.id);
		expect(o.uncertain ?? []).toEqual(unconfirmed ? ["count"] : []);
		if (!unconfirmed) return;
		const prose = `${o.body}\n${o.coming_later ?? ""}`.replace(/,(?=\d{3})/g, "");
		for (const n of [o.count.min, o.count.max]) expect(prose).not.toMatch(new RegExp(`\\b${n}\\b`));
	});
});

test("every organelle has its own colour", () => {
	const colours = all.map((o) => o.colour.toLowerCase());
	for (const c of colours) expect(c).toMatch(/^#[0-9a-f]{6}$/);
	expect(new Set(colours).size).toBe(colours.length);
});

// The table the sizes and counts cite must keep marking these counts unconfirmed, so a reviewer
// following the citation sees the same warning the frontmatter carries.
test("research marks the vesicle and microtubule counts unconfirmed", () => {
	const inventory = readFileSync(join(ROOT, "research/cell-inventory.md"), "utf8");
	for (const row of ["| Transport vesicle |", "| Microtubule |"]) {
		const line = inventory.split("\n").find((l) => l.startsWith(row));
		expect(line, row).toMatch(/\*\*unconfirmed\*\*/);
	}
});
