import { type ContentSet, contentFilesFromGlob, loadContent } from "../logic/content";

// Bundled at build time so the static site needs no fetches for its words. Vite resolves the glob,
// so a new file under content/ is picked up without touching this module.
const rawTextByGlobKey = import.meta.glob<string>("/content/**/*.md", {
	query: "?raw",
	import: "default",
	eager: true,
});

let validated: ContentSet | undefined;

/**
 * The validated content set. Throws the validator's ContentError (naming the file and field) if any
 * file is invalid, so the caller can show it at startup instead of failing at module load.
 */
export function bundledContent(): ContentSet {
	validated ??= loadContent(contentFilesFromGlob(rawTextByGlobKey));
	return validated;
}
