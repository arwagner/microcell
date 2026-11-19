import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import {
	type ContentRecord,
	loadContent,
	type ProcessRecord,
	type SiteRecord,
	type Stop,
	sentences,
	slowedFactor,
} from "../src/logic/content";
import { contentFiles, ROOT } from "./content-on-disk";

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

// Each step as [stop, machine], in order.
const STEPS: Record<string, [Stop, string][]> = {
	"atp-synthesis": [
		["Machinery", "atp-synthase"], // the proton gradient across the crista
		["Molecule", "atp-synthase"], // protons through the c-ring
		["Molecule", "atp-synthase"], // the central stalk turns
		["Molecule", "atp-synthase"], // F1 makes ATP
		["Molecule", "atp-synthase"], // 3 ATP per turn
	],
	"making-a-protein": [
		["Machinery", "rna-polymerase-ii"], // transcription, a short lead-in
		["Organelle", "rna-polymerase-ii"], // the mRNA leaves through a nuclear pore
		["Machinery", "ribosome"], // arriving at the rough ER surface
		["Molecule", "ribosome"], // translation starts
		["Molecule", "ribosome"], // one codon at a time
		["Molecule", "ribosome"], // a stop codon ends it
		["Molecule", "ribosome"], // the chain folds
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
	const organelle = get((site as SiteRecord).parent);
	return stop === "Organelle" ? organelle : get("cell");
}

// The `## Steps` section narrates the steps as an ordered list, one item per step, in order.
function stepTexts(p: ProcessRecord): string[] {
	return (p.sections.Steps ?? "").split(/\r?\n/).flatMap((line) => /^\d+\.\s+(.+)$/.exec(line)?.[1] ?? []);
}

function headings(file: string): string[] {
	return readFileSync(join(ROOT, file), "utf8")
		.split(/\r?\n/)
		.flatMap((line) => /^#{1,6}\s+(.+?)\s*$/.exec(line)?.[1] ?? []);
}

const MARKER = /\[[\w-]+\](?!\()/g;
const words = (text: string) => text.replace(MARKER, "").split(/\s+/).filter(Boolean).length;

test("content holds exactly the two processes", () => {
	expect(processes.map((p) => p.file).sort()).toEqual([
		"content/processes/atp-synthesis.md",
		"content/processes/making-a-protein.md",
	]);
	expect(processes.map((p) => p.id).sort()).toEqual(Object.keys(STEPS).sort());
});

describe.each(processes)("process $id", (p) => {
	test("has its steps in order, each at its stop with a machine that resolves", () => {
		expect(p.steps.map((s) => [s.stop, s.machine])).toEqual(STEPS[p.id]);
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

	test("cites its real rate to a research section that exists", () => {
		const source = p.sources.find((s) => s.key === p.realRate.source);
		expect(source, `real_rate.source "${p.realRate.source}"`).toBeDefined();
		if (source && "file" in source) expect(headings(source.file)).toContain(source.section);
		else expect(source?.url).toMatch(/^https:\/\//);
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
			for (const s of sentences(step).slice(-1)) expect(s, step).toMatch(MARKER);
		}
	});
});

test("each step plays inside its machine's own branch of the cell", () => {
	const where = (id: string) => (STEPS[id] ?? []).map(([stop, machine]) => `${stop}: ${stepFocus(stop, machine).id}`);
	expect(where("atp-synthesis")).toEqual([
		"Machinery: crista",
		"Molecule: atp-synthase",
		"Molecule: atp-synthase",
		"Molecule: atp-synthase",
		"Molecule: atp-synthase",
	]);
	expect(where("making-a-protein")).toEqual([
		"Machinery: transcription-site",
		"Organelle: nucleus",
		"Machinery: rough-er-surface",
		"Molecule: ribosome",
		"Molecule: ribosome",
		"Molecule: ribosome",
		"Molecule: ribosome",
	]);
});

test("every site names its process, and it resolves", () => {
	const sites = byKind("site");
	expect(Object.fromEntries(sites.map((s) => [s.id, s.process]))).toEqual(SITE_PROCESS);
	for (const s of sites) expect(get(String(s.process)).kind).toBe("process");
});

// The real ATP synthase rate is a range nobody has measured in human cells, so real_rate holds the
// floor research derives and the prose must state the range rather than one confident number.
test("ATP synthesis states its real rate as the honest range", () => {
	const atp = processes.find((p) => p.id === "atp-synthesis");
	expect(atp?.realRate).toEqual({ value: 33, unit: "turns/s", source: "proc" });
	expect(atp?.layers.goDeeper).toContain("tens to a few hundred turns per second");
	const research = readFileSync(join(ROOT, "research/processes.md"), "utf8");
	expect(research).toContain("**tens to a few hundred turns per second**");
	expect(research).toContain("more than ~33 rev/s");
});

test("making a protein runs at translation's measured rate", () => {
	const protein = processes.find((p) => p.id === "making-a-protein");
	expect(protein?.realRate).toEqual({ value: 5.6, unit: "amino acids/s", source: "proc" });
	expect(readFileSync(join(ROOT, "research/processes.md"), "utf8")).toContain("(5.6 aa/s)");
});
