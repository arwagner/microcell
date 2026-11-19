import { describe, expect, test } from "vitest";
import {
	ContentError,
	type ContentFile,
	loadContent,
	type ProcessRecord,
	sentences,
	slowedFactor,
} from "../src/logic/content";

const SOURCES = `sources:
  - key: inv
    file: research/cell-inventory.md
    section: Organelle inventory
  - key: proc
    file: research/processes.md
    section: ATP synthase`;

function layers(paragraph = "It does a job for your cell.", goDeeper = "There is more to learn."): string {
	return `
## Label
A thing in your cell.

## Paragraph
${paragraph}

## Go deeper
${goDeeper}
`;
}

function md(frontmatter: string, body = layers()): string {
	return `---\n${frontmatter}\n${SOURCES}\n---\n${body}`;
}

function organelle(id: string, parent: string, colour: string): string {
	return md(`id: ${id}
kind: organelle
name: ${id}
stop: Organelle
parent: ${parent}
colour: "${colour}"
size_nm: { value: 1000, source: inv }
count: { min: 1, max: 1, source: inv }
diveable: true`);
}

// A small set of files that is valid as a whole: one of every kind, with the nucleolus exception.
function validSet(): Record<string, string> {
	return {
		"content/cell.md": md(`id: cell
kind: cell
name: Your cell
stop: Cell
size_nm: { value: 20000, source: inv }`),
		"content/organelles/nucleus.md": organelle("nucleus", "cell", "#3a7bd5"),
		"content/organelles/nucleolus.md": organelle("nucleolus", "nucleus", "#5b2a86"),
		"content/organelles/mitochondrion.md": organelle("mitochondrion", "cell", "#e07a5f"),
		"content/sites/crista.md": md(`id: crista
kind: site
name: Mitochondrial crista
stop: Machinery
parent: mitochondrion
machine: atp-synthase
process: atp-synthesis`),
		"content/machines/atp-synthase.md": md(
			`id: atp-synthase
kind: machine
name: ATP synthase
stop: Molecule
parent: crista
pdb: { id: 6J5K, source: inv }`,
			layers(
				"It spins more than 100 times a second [proc].",
				"Its F1 head makes ATP. The 80S ribosome is elsewhere. Each turn makes 3 ATP.[proc]",
			),
		),
		"content/parts/c-ring.md": md(`id: c-ring
kind: part
name: c-ring
stop: Molecule
parent: atp-synthase`),
		"content/processes/atp-synthesis.md": md(`id: atp-synthesis
kind: process
name: Making ATP
steps:
  - { stop: Molecule, machine: atp-synthase }
real_rate: { value: 100, unit: turns/s, source: proc }
shown_rate: { value: 1, unit: turns/s }`),
		"content/cytoplasm.md": md(`id: cytoplasm
kind: cytoplasm
name: Cytoplasm
stop: Machinery
parent: cell`),
		"content/descent/build-a-protein.md": md(
			`id: build-a-protein
kind: descent
name: How your cell builds a protein
beats:
  - { focus: cell, narration: This is your cell. }
  - { focus: crista, narration: "Here, 3 ATP come from each turn [proc]." }`,
			"",
		),
		"content/pages/about.md": md(
			`id: about
kind: page
name: About this cell`,
			"This cell is a HeLa cell [inv].\n\n## Simplified\n\n- No water.\n- Time is slowed.\n",
		),
		"content/comparisons.md": md(
			`id: comparisons
kind: comparisons
name: Comparisons
items:
  - { id: hair, name: A hair's width, size_nm: { value: 70000, source: inv } }`,
			"",
		),
	};
}

function files(set: Record<string, string>): ContentFile[] {
	return Object.entries(set).map(([path, text]) => ({ path, text }));
}

function rejection(set: Record<string, string>): ContentError {
	try {
		loadContent(files(set));
	} catch (e) {
		if (e instanceof ContentError) return e;
		throw e;
	}
	throw new Error("the set loaded but should have been rejected");
}

function edit(set: Record<string, string>, path: string, from: string | RegExp, to: string): Record<string, string> {
	const text = set[path];
	if (text === undefined) throw new Error(`no fixture ${path}`);
	const next = text.replace(from, to);
	if (next === text) throw new Error(`edit did not change ${path}`);
	return { ...set, [path]: next };
}

describe("a valid set loads", () => {
	test("every record is there, by id", () => {
		const set = loadContent(files(validSet()));
		expect(set.records).toHaveLength(Object.keys(validSet()).length);
		expect(set.byId.get("nucleolus")).toMatchObject({ kind: "organelle", parent: "nucleus" });
	});

	test("an empty set is valid", () => {
		expect(loadContent([]).records).toEqual([]);
	});
});

describe("the set is rejected, naming the file and the field", () => {
	test("a parent that names no file", () => {
		const e = rejection(edit(validSet(), "content/parts/c-ring.md", "parent: atp-synthase", "parent: atp-synth"));
		expect(e.file).toBe("content/parts/c-ring.md");
		expect(e.field).toBe("parent");
		expect(e.message).toMatch(/^content\/parts\/c-ring\.md: parent: "atp-synth" names no content file/);
	});

	test("a parent out of tree order", () => {
		const e = rejection(edit(validSet(), "content/parts/c-ring.md", "parent: atp-synthase", "parent: crista"));
		expect(e.message).toMatch(/^content\/parts\/c-ring\.md: parent: "crista" is a site.*a machine/);
	});

	test("an organelle inside an organelle, unless it is the nucleolus", () => {
		const e = rejection(edit(validSet(), "content/organelles/mitochondrion.md", "parent: cell", "parent: nucleus"));
		expect(e.message).toMatch(/^content\/organelles\/mitochondrion\.md: parent: "nucleus" is an organelle/);
	});

	test("a nucleolus outside the nucleus", () => {
		const e = rejection(edit(validSet(), "content/organelles/nucleolus.md", "parent: nucleus", "parent: cell"));
		expect(e.message).toMatch(/^content\/organelles\/nucleolus\.md: parent: .*"nucleus"/);
	});

	test("two files with one id", () => {
		const e = rejection({
			...validSet(),
			"content/organelles/nucleus-2.md": organelle("nucleus", "cell", "#123456"),
		});
		expect(e.file).toBe("content/organelles/nucleus-2.md");
		expect(e.field).toBe("id");
		expect(e.message).toContain("content/organelles/nucleus.md");
	});

	test("a number in the body without a citation", () => {
		const e = rejection(
			edit(validSet(), "content/machines/atp-synthase.md", "a second [proc].", "a second. It weighs 600 kDa [proc]."),
		);
		expect(e.file).toBe("content/machines/atp-synthase.md");
		expect(e.field).toBe("## Paragraph");
		expect(e.message).toContain('"It spins more than 100 times a second." has a number but no citation');
	});

	test("a number in a page's body without a citation", () => {
		const e = rejection(edit(validSet(), "content/pages/about.md", "- No water.", "- About 70% of it is water."));
		expect(e.message).toMatch(/^content\/pages\/about\.md: ## Simplified: .*70%/);
	});

	test("a number in a descent beat without a citation", () => {
		const e = rejection(edit(validSet(), "content/descent/build-a-protein.md", " [proc].", "."));
		expect(e.message).toMatch(/^content\/descent\/build-a-protein\.md: beats\[1\]\.narration: /);
	});

	test("a citation key that is not in sources", () => {
		const e = rejection(edit(validSet(), "content/machines/atp-synthase.md", "a second [proc]", "a second [bio]"));
		expect(e.message).toBe("content/machines/atp-synthase.md: ## Paragraph: citation [bio] is not a key in sources");
	});

	test("a citation key not in sources, even in a sentence with no number", () => {
		const e = rejection(edit(validSet(), "content/pages/about.md", "HeLa cell [inv]", "HeLa cell [hela]"));
		expect(e.message).toBe("content/pages/about.md: body: citation [hela] is not a key in sources");
	});

	test("two organelles with one colour", () => {
		const e = rejection(edit(validSet(), "content/organelles/mitochondrion.md", "#e07a5f", "#3A7BD5"));
		expect(e.file).toBe("content/organelles/mitochondrion.md");
		expect(e.field).toBe("colour");
		expect(e.message).toContain("content/organelles/nucleus.md");
	});

	test("a site's machine that names no file", () => {
		const e = rejection(edit(validSet(), "content/sites/crista.md", "machine: atp-synthase", "machine: atpase"));
		expect(e.message).toBe('content/sites/crista.md: machine: "atpase" names no content file');
	});

	test("a site's process that names no file", () => {
		const e = rejection(edit(validSet(), "content/sites/crista.md", "process: atp-synthesis", "process: atp"));
		expect(e.message).toBe('content/sites/crista.md: process: "atp" names no content file');
	});

	test("a site's machine that names something that is not a machine", () => {
		const e = rejection(edit(validSet(), "content/sites/crista.md", "machine: atp-synthase", "machine: c-ring"));
		expect(e.message).toMatch(/^content\/sites\/crista\.md: machine: "c-ring" is a part/);
	});

	test("a process step's machine that names no file", () => {
		const e = rejection(
			edit(validSet(), "content/processes/atp-synthesis.md", "machine: atp-synthase }", "machine: rotor }"),
		);
		expect(e.message).toBe('content/processes/atp-synthesis.md: steps[0].machine: "rotor" names no content file');
	});

	test("a process whose shown rate cannot be compared with its real rate", () => {
		const e = rejection(
			edit(validSet(), "content/processes/atp-synthesis.md", "{ value: 1, unit: turns/s }", "{ value: 1, unit: aa/s }"),
		);
		expect(e.message).toBe(
			'content/processes/atp-synthesis.md: shown_rate.unit: "aa/s" cannot be compared with real_rate.unit "turns/s"',
		);
	});

	test("a process whose rates are the same thing over different times", () => {
		const set = edit(
			validSet(),
			"content/processes/atp-synthesis.md",
			"{ value: 1, unit: turns/s }",
			"{ value: 60, unit: turns/min }",
		);
		expect(slowedFactor(loadContent(files(set)).byId.get("atp-synthesis") as ProcessRecord)).toBe(100);
	});

	test("a descent beat's focus that names no file", () => {
		const e = rejection(edit(validSet(), "content/descent/build-a-protein.md", "focus: crista", "focus: pore"));
		expect(e.message).toBe('content/descent/build-a-protein.md: beats[1].focus: "pore" names no content file');
	});

	test("a descent beat that offers something other than a process", () => {
		const e = rejection(
			edit(validSet(), "content/descent/build-a-protein.md", "focus: crista,", "focus: crista, offer: crista,"),
		);
		expect(e.message).toBe(
			'content/descent/build-a-protein.md: beats[1].offer: "crista" is a site, but this must name a process',
		);
	});

	test("a descent beat may offer a process", () => {
		const set = edit(
			validSet(),
			"content/descent/build-a-protein.md",
			"focus: crista,",
			"focus: crista, offer: atp-synthesis,",
		);
		expect(loadContent(files(set)).byId.get("build-a-protein")).toMatchObject({
			beats: [{ focus: "cell" }, { focus: "crista", offer: "atp-synthesis" }],
		});
	});
});

describe("what counts as a number that needs a citation", () => {
	test("names with digits in them are not numbers", () => {
		const set = edit(
			validSet(),
			"content/parts/c-ring.md",
			"There is more to learn.",
			"F1, CO2, 3D and 80S are names.",
		);
		expect(() => loadContent(files(set))).not.toThrow();
	});

	test("ordered-list numbers and link targets are not numbers", () => {
		const set = edit(
			validSet(),
			"content/parts/c-ring.md",
			"There is more to learn.",
			"1. See [the notes](https://example.org/id=105569).\n2. Then read on.",
		);
		expect(() => loadContent(files(set))).not.toThrow();
	});

	test.each(["It works best at 37C.", "It weighs about 10K.", "It is 2X faster.", "It sits in 1M salt."])(
		"digits with a capital that is not a name are still a number: %s",
		(sentence) => {
			const set = edit(validSet(), "content/parts/c-ring.md", "There is more to learn.", sentence);
			expect(rejection(set).field).toBe("## Go deeper");
		},
	);

	test("a unit glued to a number is still a number", () => {
		const set = edit(validSet(), "content/parts/c-ring.md", "There is more to learn.", "It is 10nm wide.");
		expect(rejection(set).field).toBe("## Go deeper");
	});

	test("a marker after the full stop cites the sentence before it", () => {
		expect(sentences("It turns 100 times.[proc] Then it rests. It makes 3 [proc].")).toEqual([
			"It turns 100 times.[proc]",
			"Then it rests.",
			"It makes 3 [proc].",
		]);
	});

	test("a lowercase abbreviation does not end a sentence", () => {
		expect(sentences("It is approx. 5 nm wide, e.g. in yeast [inv]. Next.")).toEqual([
			"It is approx. 5 nm wide, e.g. in yeast [inv].",
			"Next.",
		]);
	});

	test("a decimal point does not end a sentence", () => {
		expect(sentences("It adds 5.6 a second. Next.")).toEqual(["It adds 5.6 a second.", "Next."]);
	});
});

describe("slowed ×N", () => {
	const process = (real: string, shown: string, realValue = 100, shownValue = 1) => ({
		file: "content/processes/p.md",
		realRate: { value: realValue, unit: real, source: "proc" },
		shownRate: { value: shownValue, unit: shown },
	});

	test("is the real rate over the shown rate for a sample process", () => {
		const set = loadContent(files(validSet()));
		expect(slowedFactor(set.byId.get("atp-synthesis") as ProcessRecord)).toBe(100);
	});

	test("converts between times of the same thing", () => {
		expect(slowedFactor(process("nt/min", "nt/s", 3000, 5))).toBe(10);
		expect(slowedFactor(process("turns per second", "turns per minute", 100, 60))).toBe(100);
	});

	test("rejects units that measure different things", () => {
		expect(() => slowedFactor(process("rev/s", "aa/s"))).toThrow(
			'content/processes/p.md: shown_rate.unit: "aa/s" cannot be compared with real_rate.unit "rev/s"',
		);
		expect(() => slowedFactor(process("rev/s", "rev"))).toThrow(ContentError);
	});
});
