import { expect, test } from "vitest";
import { bundledContent } from "../src/view/content";
import { contentFiles } from "./content-on-disk";

// The view's glob is the only way content reaches the app, so check it bundles every file on disk,
// named the same way the validator's messages name them.
test("the bundled content set holds every content/**/*.md file, validated", () => {
	const set = bundledContent();
	expect(set.records.map((r) => r.file)).toEqual(contentFiles().map((f) => f.path));
	expect(set.byId.get("cell")?.kind).toBe("cell");
});
