import { expect, test } from "vitest";
import { type DescentRecord, loadContent, sentences } from "../src/logic/content";
import { contentFiles } from "./content-on-disk";

// The loader checks that each beat's focus is something in the cell. What it can't know is the story
// this one tells: the order of its beats, how long each is, and where it leaves the learner.

const set = loadContent(contentFiles());
const descent = set.byId.get("build-a-protein") as DescentRecord;

// Spec 1: cell → nucleus → DNA → pore → rough ER → ribosome. DNA and the nuclear pore have no content
// of their own, so the DNA beat focuses on the transcription site, where a gene is read, and the pore
// beat on the nucleus, where the making-a-protein process plays the mRNA's exit.
const FOCUS = ["cell", "nucleus", "transcription-site", "nucleus", "rough-er", "ribosome"];

test("is the guided descent at content/descent/build-a-protein.md", () => {
	expect(descent).toMatchObject({ kind: "descent", file: "content/descent/build-a-protein.md" });
	expect(descent.name).toBe("How your cell builds a protein");
});

test("runs cell → nucleus → DNA → pore → rough ER → ribosome", () => {
	expect(descent.beats.map((b) => b.focus)).toEqual(FOCUS);
});

test("every beat's focus resolves to something in the cell", () => {
	for (const b of descent.beats) {
		expect(["cell", "organelle", "site", "machine", "part"], b.focus).toContain(set.byId.get(b.focus)?.kind);
	}
});

test.each(FOCUS.map((focus, i) => [i, focus]))("beat %i (%s) narrates in one to three sentences", (i) => {
	const n = sentences(descent.beats[i as number]?.narration ?? "").length;
	expect(n).toBeGreaterThanOrEqual(1);
	expect(n).toBeLessThanOrEqual(3);
});

test("ends by offering the energy story", () => {
	expect(descent.offer).toBe("atp-synthesis");
	expect(sentences(descent.beats.at(-1)?.narration ?? "").at(-1)).toMatch(/ATP.*\?/);
});
