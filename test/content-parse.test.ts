import { describe, expect, test } from "vitest";
import { ContentError, type ContentRecord, parseContent } from "../src/logic/content";

const LAYERS = `
## Label
The cell's power station.

## Paragraph
Mitochondria make most of the ATP your cell runs on.

## Go deeper
They have their own small loop of DNA.
`;

const INVENTORY = `sources:
  - key: inv
    file: research/cell-inventory.md
    section: Organelle inventory`;

const ORGANELLE_FM = `id: mitochondrion
kind: organelle
name: Mitochondrion
stop: Organelle
parent: cell
colour: "#E07A5F"
size_nm: { value: 1000, source: inv }
count: { min: 100, max: 1000, source: inv }
diveable: true
${INVENTORY}`;

function file(frontmatter: string, body = LAYERS): string {
	return `---\n${frontmatter}\n---\n${body}`;
}

const ORGANELLE = file(ORGANELLE_FM);

function parse(path: string, text: string): ContentRecord {
	return parseContent(path, text);
}

/** Replaces one frontmatter line (matched by its key) or drops it when `line` is empty. */
function withLine(fm: string, key: string, line: string): string {
	return fm
		.split("\n")
		.map((l) => (l.startsWith(`${key}:`) ? line : l))
		.filter((l) => l !== "")
		.join("\n");
}

function rejection(path: string, text: string): ContentError {
	try {
		parseContent(path, text);
	} catch (e) {
		if (e instanceof ContentError) return e;
		throw e;
	}
	throw new Error(`${path} parsed but should have been rejected`);
}

describe("valid files parse to typed records", () => {
	test("cell", () => {
		const r = parse(
			"content/cell.md",
			file(`id: cell
kind: cell
name: Your cell
stop: Cell
size_nm: { value: 15000, source: inv }
${INVENTORY}`),
		);
		expect(r).toEqual({
			file: "content/cell.md",
			id: "cell",
			kind: "cell",
			name: "Your cell",
			stop: "Cell",
			sizeNm: { value: 15000, source: "inv" },
			sources: [{ key: "inv", file: "research/cell-inventory.md", section: "Organelle inventory" }],
			layers: {
				label: "The cell's power station.",
				paragraph: "Mitochondria make most of the ATP your cell runs on.",
				goDeeper: "They have their own small loop of DNA.",
			},
			sections: {
				Label: "The cell's power station.",
				Paragraph: "Mitochondria make most of the ATP your cell runs on.",
				"Go deeper": "They have their own small loop of DNA.",
			},
		});
	});

	test("organelle", () => {
		const r = parse("content/organelles/mitochondrion.md", ORGANELLE);
		expect(r).toMatchObject({
			kind: "organelle",
			id: "mitochondrion",
			parent: "cell",
			stop: "Organelle",
			colour: "#e07a5f",
			sizeNm: { value: 1000, source: "inv" },
			count: { min: 100, max: 1000, source: "inv" },
			diveable: true,
		});
		expect(r).not.toHaveProperty("comingLater");
	});

	test("organelle that is not diveable keeps its coming_later note", () => {
		const fm = withLine(ORGANELLE_FM, "diveable", "diveable: false\ncoming_later: Inside a lysosome, soon.");
		expect(parse("content/organelles/lysosome.md", file(fm))).toMatchObject({
			diveable: false,
			comingLater: "Inside a lysosome, soon.",
		});
	});

	test("site, with and without its process", () => {
		const fm = `id: crista
kind: site
name: Mitochondrial crista
stop: Machinery
parent: mitochondrion
machine: atp-synthase
${INVENTORY}`;
		expect(parse("content/sites/crista.md", file(fm))).not.toHaveProperty("process");
		expect(parse("content/sites/crista.md", file(`${fm}\nprocess: atp-synthesis`))).toMatchObject({
			kind: "site",
			parent: "mitochondrion",
			machine: "atp-synthase",
			process: "atp-synthesis",
		});
	});

	test("machine", () => {
		const r = parse(
			"content/machines/atp-synthase.md",
			file(`id: atp-synthase
kind: machine
name: ATP synthase
stop: Molecule
parent: crista
pdb: { id: 6j5k, source: pdb }
sources:
  - key: pdb
    url: https://www.rcsb.org/structure/6J5K`),
		);
		expect(r).toMatchObject({
			kind: "machine",
			parent: "crista",
			pdb: { id: "6J5K", source: "pdb" },
			sources: [{ key: "pdb", url: "https://www.rcsb.org/structure/6J5K" }],
		});
	});

	test("part", () => {
		const r = parse(
			"content/parts/c-ring.md",
			file(`id: c-ring
kind: part
name: c-ring
stop: Molecule
parent: atp-synthase
${INVENTORY}`),
		);
		expect(r).toMatchObject({ kind: "part", id: "c-ring", parent: "atp-synthase", stop: "Molecule" });
	});

	test("cytoplasm", () => {
		const r = parse(
			"content/cytoplasm.md",
			file(`id: cytoplasm
kind: cytoplasm
name: Cytoplasm
stop: Machinery
parent: cell
${INVENTORY}`),
		);
		expect(r).toMatchObject({ kind: "cytoplasm", parent: "cell", stop: "Machinery" });
	});

	test("process", () => {
		const r = parse(
			"content/processes/atp-synthesis.md",
			file(`id: atp-synthesis
kind: process
name: Making ATP
steps:
  - { stop: Machinery, machine: atp-synthase }
  - { stop: Molecule, machine: atp-synthase }
real_rate: { value: 100, unit: rotations/s, source: proc }
shown_rate: { value: 1, unit: rotations/s }
sources:
  - key: proc
    file: research/processes.md
    section: ATP synthase`),
		);
		expect(r).toMatchObject({
			kind: "process",
			steps: [
				{ stop: "Machinery", machine: "atp-synthase" },
				{ stop: "Molecule", machine: "atp-synthase" },
			],
			realRate: { value: 100, unit: "rotations/s", source: "proc" },
			shownRate: { value: 1, unit: "rotations/s" },
		});
	});

	test("descent needs no explanation layers", () => {
		const r = parse(
			"content/descent/build-a-protein.md",
			file(
				`id: build-a-protein
kind: descent
name: How your cell builds a protein
beats:
  - focus: cell
    narration: This is your cell.
  - focus: nucleus
    narration: Its instructions live here.
${INVENTORY}`,
				"",
			),
		);
		expect(r).toMatchObject({
			kind: "descent",
			beats: [
				{ focus: "cell", narration: "This is your cell." },
				{ focus: "nucleus", narration: "Its instructions live here." },
			],
		});
		expect(r).not.toHaveProperty("layers");
	});

	test("page keeps its whole body", () => {
		const r = parse(
			"content/pages/about.md",
			file(
				`id: about
kind: page
name: About this cell
${INVENTORY}`,
				"\nThis cell is based on a HeLa cell.\n\n## What we left out\n\nWater and ions.\n",
			),
		);
		expect(r).toMatchObject({
			kind: "page",
			name: "About this cell",
			body: "This cell is based on a HeLa cell.\n\n## What we left out\n\nWater and ions.",
			sections: { "What we left out": "Water and ions." },
		});
	});

	test("comparisons", () => {
		const r = parse(
			"content/comparisons.md",
			file(
				`id: comparisons
kind: comparisons
name: Things to compare
items:
  - id: hair
    name: A human hair's width
    size_nm: { value: 70000, source: inv }
${INVENTORY}`,
				"",
			),
		);
		expect(r).toMatchObject({
			kind: "comparisons",
			items: [{ id: "hair", name: "A human hair's width", sizeNm: { value: 70000, source: "inv" } }],
		});
	});
});

describe("invalid files are rejected naming the file and the field", () => {
	const path = "content/organelles/mitochondrion.md";
	const cases: [string, string, string][] = [
		["missing id", file(withLine(ORGANELLE_FM, "id", "")), "id"],
		["unknown kind", file(withLine(ORGANELLE_FM, "kind", "kind: blob")), "kind"],
		["unknown stop", file(withLine(ORGANELLE_FM, "stop", "stop: Atom")), "stop"],
		["malformed colour", file(withLine(ORGANELLE_FM, "colour", 'colour: "#12345"')), "colour"],
		["colour that is a name", file(withLine(ORGANELLE_FM, "colour", "colour: red")), "colour"],
		["count that is a single number", file(withLine(ORGANELLE_FM, "count", "count: 500")), "count"],
		["count with no max", file(withLine(ORGANELLE_FM, "count", "count: { min: 1, source: inv }")), "count.max"],
		[
			"count with min above max",
			file(withLine(ORGANELLE_FM, "count", "count: { min: 9, max: 1, source: inv }")),
			"count",
		],
		["missing ## Label", ORGANELLE.replace("## Label\nThe cell's power station.\n", ""), "## Label"],
		["missing ## Paragraph", ORGANELLE.replace("## Paragraph", "## Para"), "## Paragraph"],
		["missing ## Go deeper", ORGANELLE.replace("## Go deeper", "## More"), "## Go deeper"],
		["multi-line label", ORGANELLE.replace("power station.", "power\nstation."), "## Label"],
		[
			"non-diveable organelle without coming_later",
			file(withLine(ORGANELLE_FM, "diveable", "diveable: false")),
			"coming_later",
		],
		[
			"size citing a source key that is not listed",
			file(withLine(ORGANELLE_FM, "size_nm", "size_nm: { value: 1000, source: nope }")),
			"size_nm.source",
		],
		["size with no source", file(withLine(ORGANELLE_FM, "size_nm", "size_nm: { value: 1000 }")), "size_nm.source"],
		["no frontmatter", "## Label\nhi\n", "frontmatter"],
	];

	test.each(cases)("%s", (_, text, field) => {
		const e = rejection(path, text);
		expect(e.message).toContain(path);
		expect(e.message).toContain(field);
		expect(e.field).toBe(field);
	});

	test("a process rate without a source", () => {
		const text = file(`id: atp-synthesis
kind: process
name: Making ATP
steps:
  - { stop: Molecule, machine: atp-synthase }
real_rate: { value: 100, unit: rotations/s }
shown_rate: { value: 1, unit: rotations/s }
${INVENTORY}`);
		expect(rejection("content/processes/atp-synthesis.md", text).field).toBe("real_rate.source");
	});

	test("a process step with an unknown stop names the step", () => {
		const text = file(`id: atp-synthesis
kind: process
name: Making ATP
steps:
  - { stop: Molecule, machine: atp-synthase }
  - { stop: Inside, machine: atp-synthase }
real_rate: { value: 100, unit: rotations/s, source: inv }
shown_rate: { value: 1, unit: rotations/s }
${INVENTORY}`);
		expect(rejection("content/processes/atp-synthesis.md", text).field).toBe("steps[1].stop");
	});

	test("a source that is neither a research file nor an https URL", () => {
		const text = file(ORGANELLE_FM.replace(INVENTORY, "sources:\n  - key: inv\n    url: http://example.com"));
		expect(rejection(path, text).field).toBe("sources[0].url");
	});
});
