import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { ContentFile } from "../src/logic/content";

export const ROOT = join(import.meta.dirname, "..");

// The real content set, read from disk here so src/logic never touches the filesystem. Paths are
// relative to the repository root, as the bundler hands them over.
export function contentFiles(dir = join(ROOT, "content")): ContentFile[] {
	if (!existsSync(dir)) return [];
	return readdirSync(dir, { recursive: true, encoding: "utf8" })
		.filter((name) => name.endsWith(".md"))
		.sort()
		.map((name) => {
			const full = join(dir, name);
			return { path: relative(ROOT, full).split("\\").join("/"), text: readFileSync(full, "utf8") };
		});
}
