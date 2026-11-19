import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, test } from "vitest";
import { parse as parseYaml } from "yaml";
import { contentFiles, headings, ROOT, readRepoFile as read } from "./content-on-disk";

// A citation is only useful if a reviewer can follow it: the key must be declared in the file's
// sources, and the research file and section it names must exist on disk.

interface SourceEntry {
	key?: unknown;
	file?: unknown;
	section?: unknown;
	url?: unknown;
}

function split(path: string): { data: { sources?: SourceEntry[] }; body: string } {
	const text = read(path);
	const m = /^---\r?\n([\s\S]*?)\r?\n---/.exec(text);
	if (!m) throw new Error(`${path}: no frontmatter`);
	return { data: parseYaml(m[1] ?? "") ?? {}, body: text.slice(m[0].length) };
}

function sourcesOf(path: string): SourceEntry[] {
	return split(path).data.sources ?? [];
}

// Keys cited inline as [key] in the text, and as `source: key` on any figure in the frontmatter.
function citedKeys(path: string): string[] {
	const { data, body } = split(path);
	const keys = [...body.matchAll(/\[([a-z][a-z0-9-]*)\](?!\()/g)].map((m) => m[1] ?? "");
	const walk = (node: unknown): void => {
		if (Array.isArray(node)) node.forEach(walk);
		else if (node !== null && typeof node === "object") {
			for (const [k, v] of Object.entries(node)) {
				if (k === "source" && typeof v === "string") keys.push(v);
				else walk(v);
			}
		}
	};
	walk(data);
	return keys;
}

const paths = contentFiles().map((f) => f.path);

describe("content sources", () => {
	test("there is content to check", () => {
		expect(paths.length).toBeGreaterThan(0);
	});

	test.each(paths)("every citation in %s uses a declared source key", (path) => {
		const declared = sourcesOf(path).map((s) => String(s.key));
		for (const key of citedKeys(path)) {
			expect(declared, `${path}: [${key}]`).toContain(key);
		}
	});

	test.each(paths)("every research source in %s names a section that exists", (path) => {
		for (const s of sourcesOf(path)) {
			if (s.url !== undefined) {
				expect(String(s.url), `${path}: [${String(s.key)}]`).toMatch(/^https:\/\//);
				continue;
			}
			const file = String(s.file);
			expect(existsSync(join(ROOT, file)), `${path}: [${String(s.key)}] ${file} exists`).toBe(true);
			expect(headings(file), `${path}: [${String(s.key)}] section in ${file}`).toContain(String(s.section));
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
