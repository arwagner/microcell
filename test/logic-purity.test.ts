import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";
import { expect, test } from "vitest";

// src/logic must run under Vitest with no GPU and no DOM, so it may use three's math and
// scene-graph classes but never a renderer, a loader, the addons, or browser globals.
const FORBIDDEN = [
	/from\s+["']three\/(addons|examples|webgpu)/,
	/from\s+["']\.\.?\/.*view\//,
	/\bWebGL(Renderer|RenderTarget)\b/,
	/\bWebGPURenderer\b/,
	/\b\w*Loader\b/,
	/\b(document|window|requestAnimationFrame|navigator|localStorage)\b/,
];

function files(dir: string): string[] {
	return readdirSync(dir).flatMap((name) => {
		const p = join(dir, name);
		return statSync(p).isDirectory() ? files(p) : /\.tsx?$/.test(name) ? [p] : [];
	});
}

test("src/logic touches no renderer, loader, view code or browser global", () => {
	const offenders = files("src/logic").flatMap((f) => {
		const src = readFileSync(f, "utf8").replace(/\/\/.*$|\/\*[\s\S]*?\*\//gm, "");
		return FORBIDDEN.filter((re) => re.test(src)).map((re) => `${f}: ${re}`);
	});
	expect(offenders).toEqual([]);
});
