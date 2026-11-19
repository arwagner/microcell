# Agents in microcell

microcell is a static web app for a curious beginner to explore a human cell: zoom from the whole cell down to
single molecules and watch its machinery work. Read `GLOSSARY.md` first and name things in its words. The spec
issues on GitHub are the plan; `research/` holds the sourced facts behind them.

## Checks

`npm ci`, `npm run typecheck`, `npm run lint` (Biome), `npm test` (Vitest) and `npm run build` must pass before
every commit. Tests run in Node with no GPU and no DOM.

## How code is laid out

- `src/logic/`: pure modules, each behind an entry point a test calls. They may use three's math and scene-graph
  classes (`Vector3`, `Quaternion`, `Object3D`, ...) but never a renderer, a loader, the addons, view code or a
  browser global; `test/logic-purity.test.ts` enforces this. Time, input and viewport size come in as plain data
  (`step(state, input, dt)`); randomness comes from a seeded generator so layouts are reproducible.
- `src/view/`: three.js and the DOM. Thin: it turns logic output into meshes and UI, and is not unit tested.
- `content/`: one Markdown file per thing (organelle, machine, site, process, guided descent) with frontmatter
  and the three explanation layers. Text is data, never hard-coded in views.
- `public/`: built assets (meshes, images), loaded relative to `import.meta.env.BASE_URL` (the site lives at
  `/microcell/`). Every asset has an entry in `assets/manifest.json` (source, license, credit line).
- Units: 1 scene unit = 1 nanometre.

## Facts

The learner can't check the science, so the app must be right. Every number and factual claim in `content/`
cites a source in `research/` (or a primary source added there). Never invent a figure; if one is missing, say
so in the pull request instead.

## Rules

- Test first, at a seam. Comments say why, not what.
- Plain American English in the app; jargon defined on first use.
- Honour `prefers-reduced-motion`. Keep 60 fps on a ~2020 laptop; never below 30.
- No AI attribution anywhere: no co-author trailers, no "generated with" lines.
