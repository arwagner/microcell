import { describe, expect, test } from "vitest";
import { type ContentRecord, type Kind, loadContent } from "../src/logic/content";
import { contentFiles } from "./content-on-disk";

// Spec 1 lists exactly what v1's content holds. Later specs draw these ids, so a file that goes
// missing, or one that sneaks in beyond the spec, should fail here rather than in the app.

const set = loadContent(contentFiles());

const EXPECTED: Record<Kind, string[]> = {
	cell: ["cell"],
	cytoplasm: ["cytoplasm"],
	page: ["about"],
	comparisons: ["comparisons"],
	organelle: [
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
	],
	site: ["transcription-site", "rough-er-surface", "crista"],
	machine: ["rna-polymerase-ii", "ribosome", "atp-synthase"],
	part: [
		"polymerase-active-site",
		"polymerase-clamp",
		"polymerase-jaw",
		"ribosome-large-subunit",
		"ribosome-small-subunit",
		"c-ring",
		"central-stalk",
		"f1-head",
		"peripheral-stalk",
	],
	process: ["atp-synthesis", "making-a-protein"],
	descent: ["build-a-protein"],
};

// Each machine's named parts, so a part can't drift to the wrong machine unnoticed.
const PARTS_OF: Record<string, string[]> = {
	"rna-polymerase-ii": ["polymerase-active-site", "polymerase-clamp", "polymerase-jaw"],
	ribosome: ["ribosome-large-subunit", "ribosome-small-subunit"],
	"atp-synthase": ["c-ring", "central-stalk", "f1-head", "peripheral-stalk"],
};

const idsOf = (kind: Kind) =>
	set.records
		.filter((r) => r.kind === kind)
		.map((r) => r.id)
		.sort();

describe("the content tree holds exactly the spec's items", () => {
	test.each(Object.entries(EXPECTED))("%s", (kind, ids) => {
		expect(idsOf(kind as Kind)).toEqual([...ids].sort());
	});

	test("the counts the spec gives: 12 organelles, 3 sites, 3 machines, 2 processes, 1 descent", () => {
		expect(
			[idsOf("organelle"), idsOf("site"), idsOf("machine"), idsOf("process"), idsOf("descent")].map((l) => l.length),
		).toEqual([12, 3, 3, 2, 1]);
	});

	test.each(Object.entries(PARTS_OF))("%s has its named parts", (machine, parts) => {
		const children = set.records.filter((r) => r.kind === "part" && r.parent === machine).map((r) => r.id);
		expect(children.sort()).toEqual([...parts].sort());
	});
});

describe.each(EXPECTED.site)("site %s", (id) => {
	const site = set.byId.get(id) as Extract<ContentRecord, { kind: "site" }>;

	test("names a process and a machine", () => {
		expect(site.process, "process").toBeDefined();
		expect(set.byId.get(site.process ?? "")?.kind).toBe("process");
		expect(set.byId.get(site.machine)?.kind).toBe("machine");
	});
});
