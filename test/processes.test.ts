import { describe, expect, test } from "vitest";
import {
	type ContentRecord,
	loadContent,
	type ProcessRecord,
	type Stop,
	sentences,
	slowedFactor,
} from "../src/logic/content";
import { contentFiles, headings, MARKER, readRepoFile, words } from "./content-on-disk";

// The loader checks that each step's machine exists and that the rates compare. What it can't know
// is what this ticket fixes: exactly two processes, their steps in order and where each plays, which
// sites run which process, and that every rate rests on a research section that is really there.

const set = loadContent(contentFiles());
const byKind = <K extends ContentRecord["kind"]>(kind: K) =>
	set.records.filter((r): r is Extract<ContentRecord, { kind: K }> => r.kind === kind);
const processes = byKind("process");
const get = (id: string): ContentRecord => {
	const r = set.byId.get(id);
	if (!r) throw new Error(`no content file has id "${id}"`);
	return r;
};

// Each step as [stop, machine, the focus it plays at], in order. The ticket names the steps but not
// their tuples, which repeat, so each row says which named step it is.
const STEPS: Record<string, [Stop, string, string][]> = {
	"atp-synthesis": [
		["Machinery", "atp-synthase", "crista"], // the proton gradient
		["Molecule", "atp-synthase", "atp-synthase"], // protons through the c-ring
		["Molecule", "atp-synthase", "atp-synthase"], // the stalk turns
		["Molecule", "atp-synthase", "atp-synthase"], // F1 makes ATP
		["Molecule", "atp-synthase", "atp-synthase"], // 3 ATP per turn
	],
	"making-a-protein": [
		["Machinery", "rna-polymerase-ii", "transcription-site"], // transcription, a short lead-in
		["Organelle", "rna-polymerase-ii", "nucleus"], // the mRNA leaves through a nuclear pore
		["Machinery", "ribosome", "rough-er-surface"], // translation in full: arriving
		["Molecule", "ribosome", "ribosome"], // translation starts
		["Molecule", "ribosome", "ribosome"], // one codon at a time
		["Molecule", "ribosome", "ribosome"], // a stop codon ends it
		["Molecule", "ribosome", "ribosome"], // the chain folds
	],
};

const SITE_PROCESS = {
	"transcription-site": "making-a-protein",
	"rough-er-surface": "making-a-protein",
	crista: "atp-synthesis",
};

/**
 * Where a step plays: what the learner is focused on at that step's stop, walking up the tree from
 * its machine. At the Molecule stop that is the machine; at Machinery, its site; at Organelle, the
 * organelle the site is in; at Cell, the cell.
 */
function stepFocus(stop: Stop, machineId: string): ContentRecord {
	const machine = get(machineId);
	if (machine.kind !== "machine") throw new Error(`${machineId} is not a machine`);
	if (stop === "Molecule") return machine;
	const site = get(machine.parent);
	if (stop === "Machinery") return site;
	if (site.kind !== "site") throw new Error(`${machine.parent} is not a site`);
	const organelle = get(site.parent);
	return stop === "Organelle" ? organelle : get("cell");
}

// The `## Steps` section narrates the steps as an ordered list, one item per step, in order.
function stepTexts(p: ProcessRecord): string[] {
	return (p.sections.Steps ?? "").split(/\r?\n/).flatMap((line) => /^\d+\.\s+(.+)$/.exec(line)?.[1] ?? []);
}

// Whitespace and Markdown emphasis folded away, so a reflowed or re-bolded research file still matches.
const plain = (text: string) => text.replace(/[*_]/g, "").replace(/\s+/g, " ");
const research = plain(readRepoFile("research/processes.md"));
const cited = (sentence: string) => [...sentence.matchAll(MARKER)].length > 0;

test("content holds exactly the two processes", () => {
	expect(processes.map((p) => p.file).sort()).toEqual([
		"content/processes/atp-synthesis.md",
		"content/processes/making-a-protein.md",
	]);
	expect(processes.map((p) => p.id).sort()).toEqual(Object.keys(STEPS).sort());
});

describe.each(processes)("process $id", (p) => {
	test("has its steps in order, each at its stop with a machine that resolves", () => {
		expect(p.steps.map((s) => [s.stop, s.machine])).toEqual(STEPS[p.id]?.map(([stop, machine]) => [stop, machine]));
		for (const s of p.steps) expect(get(s.machine).kind).toBe("machine");
	});

	test("narrates one step per item in its Steps section", () => {
		expect(stepTexts(p)).toHaveLength(p.steps.length);
	});

	test("is slowed by a finite factor greater than 1", () => {
		const n = slowedFactor(p);
		expect(Number.isFinite(n)).toBe(true);
		expect(n).toBeGreaterThan(1);
	});

	test("cites its real rate to a declared source", () => {
		const source = p.sources.find((s) => s.key === p.realRate.source);
		expect(source, `real_rate.source "${p.realRate.source}"`).toBeDefined();
		if (source && !("file" in source)) expect(source.url).toMatch(/^https:\/\//);
	});

	test("cites only research sections that exist", () => {
		for (const s of p.sources) {
			if ("file" in s) expect(headings(s.file), `[${s.key}] in ${s.file}`).toContain(s.section);
		}
	});

	test("keeps to the voice limits: a short label, a paragraph of at most 60 words", () => {
		expect(words(p.layers.label)).toBeLessThanOrEqual(8);
		expect(words(p.layers.paragraph)).toBeLessThanOrEqual(60);
	});

	// The loader only insists on a citation where there is a number; every step is a factual claim.
	test("cites every step", () => {
		for (const step of stepTexts(p)) {
			expect(cited(sentences(step).at(-1) ?? ""), step).toBe(true);
		}
	});
});

test("each step plays inside its machine's own branch of the cell", () => {
	for (const steps of Object.values(STEPS)) {
		expect(steps.map(([stop, machine]) => stepFocus(stop, machine).id)).toEqual(steps.map(([, , focus]) => focus));
	}
});

test("every site names its process, and it resolves", () => {
	const sites = byKind("site");
	expect(Object.fromEntries(sites.map((s) => [s.id, s.process]))).toEqual(SITE_PROCESS);
	for (const s of sites) {
		expect(s.process, s.id).toBeDefined();
		if (s.process) expect(get(s.process).kind).toBe("process");
	}
});

// The real ATP synthase rate is a range nobody has measured in human cells, so real_rate holds the
// floor research derives and the prose must state the range rather than one confident number.
test("ATP synthesis states its real rate as the honest range", () => {
	const atp = processes.find((p) => p.id === "atp-synthesis");
	expect(atp?.realRate).toEqual({ value: 33, unit: "turns/s", source: "proc" });
	expect(atp?.layers.goDeeper).toContain("tens to a few hundred turns per second");
	expect(research).toContain("tens to a few hundred turns per second");
	expect(research).toContain("more than ~33 rev/s");
});

test("making a protein runs at translation's measured rate", () => {
	const protein = processes.find((p) => p.id === "making-a-protein");
	expect(protein?.realRate).toEqual({ value: 5.6, unit: "amino acids/s", source: "proc" });
	expect(research).toContain("(5.6 aa/s)");
});
