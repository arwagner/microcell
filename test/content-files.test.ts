import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";
import { type ContentFile, loadContent } from "../src/logic/content";

// The real content set, read from disk here so src/logic never touches the filesystem.
function contentFiles(dir: string): ContentFile[] {
	if (!existsSync(dir)) return [];
	return readdirSync(dir, { recursive: true, encoding: "utf8" })
		.filter((name) => name.endsWith(".md"))
		.sort()
		.map((name) => {
			const path = join(dir, name).split("\\").join("/");
			return { path, text: readFileSync(path, "utf8") };
		});
}

test("every content/**/*.md file parses and the set validates", () => {
	const files = contentFiles("content");
	const set = loadContent(files);
	expect(set.records.map((r) => r.file)).toEqual(files.map((f) => f.path));
});
