import { bundledContent } from "./view/content";

// Entry point. The view is wired up here once the specs build it.
const app = document.getElementById("app");
try {
	bundledContent();
	if (app) app.textContent = "microcell: under construction";
} catch (error) {
	// A broken content file is an authoring mistake; show the validator's message rather than a blank page.
	if (app) app.textContent = `microcell could not load its content. ${error instanceof Error ? error.message : error}`;
	throw error;
}
