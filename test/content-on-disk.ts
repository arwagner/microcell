import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, relative } from "node:path";
import type { ContentFile } from "../src/logic/content";

export const ROOT = join(import.meta.dirname, "..");

/** A file's text, by its path from the repository root. */
export function readRepoFile(path: string): string {
	return readFileSync(join(ROOT, path), "utf8");
}

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

/** Every Markdown heading in a file, so a test can check that a cited section really exists. */
export function headings(path: string): string[] {
	return readRepoFile(path)
		.split(/\r?\n/)
		.flatMap((line) => /^#{1,6}\s+(.+?)\s*$/.exec(line)?.[1] ?? []);
}

/** A citation marker such as `[proc]`; the lookahead leaves Markdown links `[text](url)` alone. */
export const MARKER = /\[([A-Za-z0-9][\w-]*)\](?!\()/g;

/** Words as the voice limits count them: citation markers are not words. */
export function words(text: string): number {
	return text.replace(MARKER, "").split(/\s+/).filter(Boolean).length;
}
