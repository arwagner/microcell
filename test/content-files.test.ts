import { expect, test } from "vitest";
import { loadContent } from "../src/logic/content";
import { contentFiles } from "./content-on-disk";

test("every content/**/*.md file parses and the set validates", () => {
	const files = contentFiles();
	expect(files.length).toBeGreaterThan(0);
	const set = loadContent(files);
	expect(set.records.map((r) => r.file)).toEqual(files.map((f) => f.path));
});
