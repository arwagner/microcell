import { defineConfig } from "vite";

// Served as a GitHub Pages project site at /microcell/. Load files from public/ via import.meta.env.BASE_URL.
export default defineConfig({
	base: "/microcell/",
});
