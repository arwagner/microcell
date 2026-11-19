# Web 3D stack for continuous multi-scale zoom

Research for issue #6. Question: which browser 3D stack best fits a continuous zoom from a ~10–30 µm **Cell** down to ~1 nm molecules, with many instanced objects, built by agents whose logic modules are tested with Vitest in a container with no GPU?

Versions checked 2026-11-19 against the npm registry: three 0.187.0, @react-three/fiber 9.8.2 (v10 still alpha), @react-three/test-renderer 9.1.1, @babylonjs/core 9.37.1, playcanvas 2.24.2, molstar 5.13.1, vite 8.3.8, vitest 5.1.1.

"Measured" below means I ran it myself in a scratch project; the script is shown in the appendix.

## Recommendation (short)

- **Use plain three.js 0.187 in TypeScript, without react-three-fiber.** Build with **Vite 8**, test with **Vitest 5** in the `node` environment, and deploy to GitHub Pages with Vite's official Actions workflow.
- **Use 1 scene unit = 1 nm.** The whole cell then fits in float32 at about 0.002 nm resolution, so v1 does **not** need a floating origin for vertex positions. The real problem at these scales is **depth precision**. Fix it with `reversedDepthBuffer: true` plus `logarithmicDepthBuffer: true`: three uses reversed-Z where the GPU supports it and falls back to logarithmic depth otherwise. Also set the camera's near/far planes from the zoom distance.
- **Put all decisions in pure TypeScript modules** that import three's math only, never a renderer: the **Scale** ladder, camera/zoom state, near/far choice, level-of-detail choice, instance layout, picking and the **Process** timeline. A thin view layer turns their output into three objects.

## The precision problem, quantified

There are two separate problems, and they are often confused.

1. **Vertex/position precision (float32 mantissa).** GPUs store positions as float32, which has a 24-bit significand. With 1 unit = 1 nm, a 20 µm cell spans about 20,000 units. The float32 spacing there is 2^-9 ≈ 0.002 nm (measured: `Math.fround(20000+0.002)-Math.fround(20000) = 0.00195`). That is about 500× finer than the 1 nm detail we need. Positions only break down when absolute magnitudes are large compared with the detail, as with planets plus people (the case floating origin exists for). Our *dynamic range* is about 10^4–10^5, not 10^10+.
   - three already computes `modelViewMatrix = camera.matrixWorldInverse × object.matrixWorld` on the CPU for each object (`src/renderers/WebGLRenderer.js` line 2173). JS numbers are float64 (`Matrix4.elements` is a plain Array, `src/math/Matrix4.js` line 86). So each object's transform is uploaded already relative to the camera, which is effectively per-object "relative to eye".
   - The float32 data are the vertex buffers and `InstancedMesh.instanceMatrix` (`new Float32Array(count*16)`, `src/objects/InstancedMesh.js` line 57). Keep each instanced group's local coordinates small (for example, one group per organelle region) and precision is a non-issue.
   - Choosing nm as the unit is the "scale-relative scene" technique in its simplest form: pick units so the finest feature is about 1 and the largest is about 10^4.
2. **Depth-buffer precision.** At molecule scale the camera may sit 5 nm from a ribosome while the cell membrane is still visible 10,000 nm away. With a standard perspective depth buffer, precision is roughly proportional to near/far, so z-fighting appears quickly.
   - three's `logarithmicDepthBuffer` is documented as "may be necessary … if dealing with huge differences in scale in a single scene". It "uses `gl_FragDepth` if available which disables the Early Fragment Test optimization and can cause a decrease in performance" (JSDoc in `src/renderers/WebGLRenderer.js`).
   - `reversedDepthBuffer` "requires the `EXT_clip_control` extension" and is "a more faster and accurate version than logarithmic depth buffer" (same file). `WebGLCapabilities.js` lines 95–96 enable reversed only when the extension exists, and log depth only when reversed is off. **Setting both flags therefore gives a safe fallback.** WebGPURenderer accepts the same two options (`src/renderers/webgpu/WebGPURenderer.js` lines 34–35).
   - three ships demos for both: `examples/webgl_camera_logarithmicdepthbuffer.html` uses NEAR = 1e-6 and FAR = 1e27, labelled "microscopic (1µm)" through "solar system-sized"; there is also `examples/webgl_reversed_depth_buffer.html`.
   - Complementary technique, **dynamic near/far**: set `near ≈ k·distanceToFocus` and `far` to cover the cell, as a pure function of zoom state. This is cheap and works with any depth mode.

**Floating origin, if ever needed** (for example a later "compare" view placing several cells side by side): keep positions in float64 in the logic layer. Each frame, subtract the camera/focus position before writing to three objects, or periodically re-centre the world when the camera drifts more than N units away. This is a pure function `(worldPos: float64, origin) → renderPos` and easy to unit-test.
- Babylon builds this in. Engine option `useLargeWorldRendering` "will also set high precision matrices" and enables `floatingOriginMode` on all scenes, "offsetting position-related uniform and attribute values … so that active camera is centered at origin" (`@babylonjs/core/Engines/abstractEngine.pure.d.ts` lines ~103–114; `scene.pure.d.ts` ~102). The older manual approach (`OriginCamera` with `doublepos`, regions of about 10,000 units) is in the Babylon docs at https://doc.babylonjs.com/features/featuresDeepDive/scene/floating_origin.
- We don't need it for v1 (see point 1).

## Comparison

| | three.js 0.187 | react-three-fiber 9.8 (on three) | Babylon.js 9.37 | PlayCanvas 2.24 | Mol* 5.13 |
|---|---|---|---|---|---|
| Depth over large scale ranges | log depth + reversed-Z with automatic fallback (WebGL and WebGPU renderers) | same as three | log depth (`useLogarithmicDepth` on materials), reverse depth, built-in floating origin/large-world mode | log/reverse depth less documented | molecule-scale only |
| Floating origin | DIY (simple; see above) | DIY | **built-in** (`useLargeWorldRendering`, `floatingOriginMode`) | DIY | n/a |
| LOD | `LOD` object with per-level `hysteresis` "to avoid flickering at LOD boundaries" (`src/objects/LOD.js` line 113); `BatchedMesh` + `examples/webgl_batch_lod_bvh.html`; progressive glTF LOD example | three's, plus drei `<Detailed>` | `mesh.addLODLevel`, automatic LOD | LOD via engine | its own representation switching |
| Instancing | `InstancedMesh`, `BatchedMesh`, many examples (`webgl_instancing_performance`, `webgpu_instance_*`) | `<Instances>` (drei) | thin instances, instances | hardware instancing | custom, very high counts |
| Tested without a GPU | **Measured:** `Scene`, `PerspectiveCamera`, `LOD.update(camera)`, `InstancedMesh.setMatrixAt`/`computeBoundingSphere`, `Frustum` all run in Vitest `node` env with no DOM. Only `WebGLRenderer` needs a context | `@react-three/test-renderer` builds the scene graph and can `fireEvent`/`advanceFrames` (https://r3f.docs.pmnd.rs/api/testing), but logic tends to live inside components and hooks | **Measured:** `NullEngine` + `Scene.render()` + `isInFrustum` in Vitest `node` env | engine is less modular to import headless | not relevant |
| Bundle (measured, esbuild minified ESM, gzip -9; minimal scene) | **136 KB gz** (542 KB min) | three + React 19 + r3f (adds React, ~60 KB+ gz) | 356 KB gz (1.53 MB min) with deep `@babylonjs/core/...` imports | 557 KB gz (2.14 MB min) | large; molecules-only app framework |
| TS types | `@types/three` 0.187 released in step with three | yes | written in TS | written in TS | TS |
| Ecosystem / agent familiarity | largest; most examples and training data | large | large, strong docs | smaller | niche |

All are static client-side libraries, so all work on GitHub Pages. Pages only needs static files; no option needs special headers.
- r3f 9.8.2 peers: `react >=19 <19.4` (npm `peerDependencies`). The upper bound is one more upgrade constraint.
- Others considered and rejected: OGL, regl and Use.GPU are lower-level or have small communities (OGL last published 2025-01, regl 2024-11).
- Mol* (molstar) is the reference molecular viewer, MIT licensed. It is worth revisiting as a *data/representation* source for molecule-scale shapes (PDB → simplified geometry, done offline), not as the scene engine.

### Why not react-three-fiber

The factory cuts work into logic modules behind entry points, tested in Vitest, with view code last.
- r3f's idiom puts state and per-frame logic in components and `useFrame` hooks. That pulls logic into the view, which works against the factory's seam.
- It adds React and a peer-version window to every ticket.
- Its test renderer exists, but asserting on props of a React-rendered scene graph is a weaker test than calling a pure function.
- If the UI shell (explanation-layer panels, labels) later wants React, r3f can still be added as the view layer over the same logic modules. Nothing below depends on that choice.

### Why not Babylon

- Babylon's built-in large-world mode is real and well designed, but our scale range doesn't need it (see the precision section).
- It is about 2.6× the gzipped size for a minimal scene (measured).
- three's `LOD`, `InstancedMesh` and math classes run headless with no engine object at all, which suits pure modules slightly better than Babylon's `NullEngine` (though that also works, measured).
- Babylon remains the fallback if a later spec needs true astronomical-style ranges.

### WebGL2 vs WebGPU

- three 0.187 ships `three/webgpu` (`WebGPURenderer`), which falls back to a WebGL 2 backend (`forceWebGL` option; `src/renderers/webgpu/WebGPURenderer.js` line 41).
- Recommend starting on `WebGLRenderer` (most mature, most examples). Keep the renderer construction in one view file so swapping to `WebGPURenderer` later is a single-file change. Both accept the same depth options.

## Build tooling and hosting

- **Vite 8** (docs at vite.dev show v8.3.7). GitHub Pages guide: set `base: '/microcell/'` for a project site. The official workflow uses `actions/checkout` → `actions/setup-node` → `npm ci` → `npm run build` → `actions/configure-pages` → `actions/upload-pages-artifact` (`./dist`) → `actions/deploy-pages`, with permissions `pages: write` and `id-token: write`, and Pages source set to "GitHub Actions" (https://vite.dev/guide/static-deploy). This belongs to the "Deploy pipeline" item on the map.
- **Vitest 5**, default `node` environment. No jsdom and no headless GL are needed for logic tests (measured). Don't try `headless-gl`/`gl` in the container. Keep `WebGLRenderer` out of anything a unit test imports.
- **Assets**: put glTF/derived meshes in `public/` and load them relative to `import.meta.env.BASE_URL` so the `/microcell/` base path works.

## How to keep scene logic testable without WebGL

1. **Rule**: modules under `src/logic/**` may import `three`'s math and scene-graph classes (`Vector3`, `Matrix4`, `Quaternion`, `Box3`, `Sphere`, `Frustum`, `Ray`, `LOD`, `Object3D`). They may never import `WebGLRenderer`, `WebGPURenderer`, loaders, `document` or `window`. This can be enforced with an ESLint `no-restricted-imports` rule.
   - An option for even stricter purity: logic returns plain data (`{ position: [x,y,z], level: 2 }`) and only the view touches three objects. Recommended for the most important modules (Scale ladder, zoom).
2. **Inputs/outputs are data**: time (`dtSeconds`), pointer/wheel events as plain objects, and viewport size. No `requestAnimationFrame` inside logic; the view's loop calls `step(state, input, dt)`.
3. **Determinism**: seedable RNG for instance scattering, so tests can snapshot layouts.
4. **View layer is thin and untested by unit tests**. Check it manually or with a later Playwright smoke test outside the GPU-less container.

## Architecture sketch

```
src/
  logic/                    (pure; Vitest in node env)
    units.ts                1 unit = 1 nm; helpers µm↔nm
    scale.ts                Scale ladder: stops, ranges, "which stop am I at" (fed by #7)
    camera/zoom.ts          zoom state machine: log-space distance, smooth easing, focus target,
                            wheel/pinch → state; returns {position, target, near, far}
    camera/depth.ts         near/far from distance; floating-origin offset fn (unused in v1)
    lod.ts                  per-Organelle detail level from screen-space size, with hysteresis
    instances.ts            deterministic layouts (ribosomes, proteins) → Float32Array matrices
    picking.ts              ray vs bounding spheres → which Organelle/molecule is under pointer
    process/timeline.ts     Process playback: keyframes/state at time t
    content/                loads content data (organelles, explanation layers): see data-model spec
  view/                     (three.js; not unit tested)
    renderer.ts             WebGLRenderer({ reversedDepthBuffer: true, logarithmicDepthBuffer: true })
    sceneBuilder.ts         content + logic output → Mesh / InstancedMesh / LOD objects
    loop.ts                 rAF: input → logic.step → apply to three objects → render
    ui/                     labels, Explanation layer panels (DOM)
  main.ts
```

Ticket shape for the factory: each `logic/*` file is one ticket with an entry point and Vitest tests. `view/*` comes last, as the decompose prompt requires.

## Effects on other tickets

- **#7 Scale ladder**: no engine limit forces discrete stops. Continuous zoom is technically fine with nm units plus reversed/log depth. Stops can be a UX choice.
- **#9 Visual style**: log depth disables early-Z, which costs some fill rate, so heavy translucency stacked across scales should be budgeted. Prototype on three with `WebGLRenderer`.
- **Testing strategy (map item)**: adopt the `src/logic` vs `src/view` import rule above as the definition of a logic module.
- **Deploy pipeline (map item)**: Vite's official Pages workflow, `base: '/microcell/'`.

## Sources

- npm registry metadata (`npm view <pkg> version|peerDependencies|dist-tags`), 2026-11-19.
- three.js r187 source: `src/renderers/WebGLRenderer.js` (JSDoc for `logarithmicDepthBuffer`/`reversedDepthBuffer`; line 2173 modelView), `src/renderers/webgl/WebGLCapabilities.js` lines 95–104, `src/renderers/webgpu/WebGPURenderer.js` lines 34–41, `src/objects/LOD.js`, `src/objects/InstancedMesh.js`, `src/math/Matrix4.js`.
- three.js examples: https://github.com/mrdoob/three.js/tree/dev/examples (`webgl_camera_logarithmicdepthbuffer.html`, `webgl_reversed_depth_buffer.html`, `webgl_lod.html`, `webgl_batch_lod_bvh.html`, `webgl_instancing_performance.html`).
- Babylon.js 9.37.1 typings: `Engines/abstractEngine.pure.d.ts`, `scene.pure.d.ts`. Floating origin docs: https://doc.babylonjs.com/features/featuresDeepDive/scene/floating_origin
- r3f testing: https://r3f.docs.pmnd.rs/api/testing
- Vite static deploy: https://vite.dev/guide/static-deploy

## Appendix: measurements

Bundle: a minimal scene per engine (renderer + camera + instanced sphere + material), bundled with `esbuild --bundle --minify --format=esm`, then `gzip -9`. three 135,519 B; Babylon (deep `@babylonjs/core/...` imports) 355,817 B; PlayCanvas 557,325 B.

No-GPU test (Vitest 5.1.1, `node` env, all passed):

```js
test('three scene graph without GPU', () => {
  const s = new Scene(), c = new PerspectiveCamera(50, 1, 1e-3, 1e5); c.position.set(0, 0, 10); s.add(c);
  const lod = new LOD(); lod.addLevel(new Mesh(new SphereGeometry(1, 64, 64)), 0);
  lod.addLevel(new Mesh(new SphereGeometry(1, 8, 8)), 50); s.add(lod);
  const im = new InstancedMesh(new SphereGeometry(), new MeshBasicMaterial(), 3);
  const o = new Object3D(); o.position.set(5, 0, 0); o.updateMatrix(); im.setMatrixAt(1, o.matrix); s.add(im);
  s.updateMatrixWorld(); c.updateMatrixWorld(); lod.update(c); expect(lod.getCurrentLevel()).toBe(0);
  c.position.set(0, 0, 100); c.updateMatrixWorld(); lod.update(c); expect(lod.getCurrentLevel()).toBe(1);
  const f = new Frustum().setFromProjectionMatrix(new Matrix4().multiplyMatrices(c.projectionMatrix, c.matrixWorldInverse));
  expect(f.containsPoint(new Vector3())).toBe(true);
  im.computeBoundingSphere(); expect(im.boundingSphere.radius).toBeGreaterThan(3);
});
test('babylon NullEngine', () => {
  const e = new NullEngine(); const s = new BScene(e); new FreeCamera('c', new BV(0, 0, -10), s);
  const m = CreateSphere('s', {}, s); s.render(); expect(m.isInFrustum(s.frustumPlanes)).toBe(true);
});
```
