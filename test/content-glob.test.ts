import { expect, test } from "vitest";
import { contentFilesFromGlob } from "../src/logic/content";

// The bundler keys each file from the project root with a leading slash and in no promised order; the
// validator's messages and the tests name files "content/cell.md", in path order.
test("glob keys become root-relative paths, sorted by path", () => {
	const files = contentFilesFromGlob({
		"/content/organelles/nucleus.md": "n",
		"/content/cell.md": "c",
		"/content/Z.md": "z",
	});
	expect(files).toEqual([
		{ path: "content/Z.md", text: "z" },
		{ path: "content/cell.md", text: "c" },
		{ path: "content/organelles/nucleus.md", text: "n" },
	]);
});

test("a key with no leading slash is kept as it is", () => {
	expect(contentFilesFromGlob({ "content/cell.md": "c" })).toEqual([{ path: "content/cell.md", text: "c" }]);
});
