import { type ContentSet, loadContent } from "../logic/content";

// Bundled at build time so the static site needs no fetches for its words. Vite resolves the glob,
// so a new file under content/ is picked up without touching this module.
const raw = import.meta.glob<string>("/content/**/*.md", { query: "?raw", import: "default", eager: true });

// Vite keys files from the project root with a leading slash; the logic names them relative to the
// root ("content/cell.md"), as the tests do, so its error messages read the same everywhere.
const files = Object.entries(raw)
	.map(([key, text]) => ({ path: key.replace(/^\//, ""), text }))
	.sort((a, b) => (a.path < b.path ? -1 : a.path > b.path ? 1 : 0));

let loaded: ContentSet | undefined;

/**
 * The validated content set. Throws the validator's ContentError (naming the file and field) if any
 * file is invalid, so the caller can show it at startup instead of failing at module load.
 */
export function bundledContent(): ContentSet {
	loaded ??= loadContent(files);
	return loaded;
}
