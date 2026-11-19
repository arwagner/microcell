import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parse as parseYaml } from "yaml";

// The loader only checks that a source names a research/<name>.md file. A reviewer following a
// citation needs the file and the section to exist, so that is checked here against the notes on disk.

const ROOT = join(import.meta.dirname, "..");

function contentPaths(dir = "content"): string[] {
	const abs = join(ROOT, dir);
	if (!existsSync(abs)) return [];
	return readdirSync(abs, { recursive: true, encoding: "utf8" })
		.filter((name) => name.endsWith(".md"))
		.map((name) => join(dir, name).split("\\").join("/"))
		.sort();
}

function read(path: string): string {
	return readFileSync(join(ROOT, path), "utf8");
}

interface SourceEntry {
	key?: unknown;
	file?: unknown;
	section?: unknown;
	url?: unknown;
}

function sourcesOf(path: string): SourceEntry[] {
	const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(read(path));
	if (!m) throw new Error(`${path}: no frontmatter`);
	const data = parseYaml(m[1] ?? "") as { sources?: SourceEntry[] };
	return data.sources ?? [];
}

function headings(path: string): Set<string> {
	return new Set(
		read(path)
			.split(/\r?\n/)
			.flatMap((line) => /^#{1,6}\s+(.+?)\s*$/.exec(line)?.[1] ?? []),
	);
}

const paths = contentPaths();

describe("content sources", () => {
	test("there is content to check", () => {
		expect(paths.length).toBeGreaterThan(0);
	});

	test.each(paths)("every research source in %s names a section that exists", (path) => {
		for (const s of sourcesOf(path)) {
			if (s.url !== undefined) {
				expect(String(s.url), `${path}: [${String(s.key)}]`).toMatch(/^https:\/\//);
				continue;
			}
			const file = String(s.file);
			expect(existsSync(join(ROOT, file)), `${path}: [${String(s.key)}] ${file} exists`).toBe(true);
			expect([...headings(file)], `${path}: [${String(s.key)}] section in ${file}`).toContain(String(s.section));
		}
	});
});

// The learner can't tell where the numbers come from unless the app says so, in both places they
// might look: the cell's own explanation and the About page.
test.each(["content/cell.md", "content/pages/about.md"])("%s says the reference cell is HeLa", (path) => {
	const text = read(path).replace(/\s+/g, " ");
	expect(text).toMatch(/\bHeLa\b/);
	expect(text).toMatch(/gaps (are )?filled from other mammalian cells/);
});
