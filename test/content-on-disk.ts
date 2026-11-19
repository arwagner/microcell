import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import { type ContentFile, contentFilesFromGlob } from "../src/logic/content";

export const ROOT = join(import.meta.dirname, "..");

// The real content set, read from disk here so src/logic never touches the filesystem. Keyed and
// shaped the way the bundler's glob is, so the tests load content exactly as the app does.
export function contentFiles(dir = join(ROOT, "content")): ContentFile[] {
	if (!existsSync(dir)) return [];
	const byKey: Record<string, string> = {};
	for (const name of readdirSync(dir, { recursive: true, encoding: "utf8" })) {
		if (!name.endsWith(".md")) continue;
		const full = join(dir, name);
		byKey[`/${relative(ROOT, full).split("\\").join("/")}`] = readFileSync(full, "utf8");
	}
	return contentFilesFromGlob(byKey);
}
