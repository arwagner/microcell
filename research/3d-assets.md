# Public 3D data and assets for a static web app

Research for issue #5. Question: which scientific 3D sources can microcell (public repo, static site on GitHub Pages, no backend) legally and practically use? For each source: license, formats, sizes, the route to web-ready meshes, and attribution.

Checked 2026-11-19 against each source's own terms page, repo, or docs. Links are inline.

## Summary

| Source | License | Formats | Usable by microcell? |
|---|---|---|---|
| RCSB PDB structures | CC0 1.0 | mmCIF, BinaryCIF, PDB (small entries only) | **Yes.** Best source for the molecule **Scale** |
| PDB-101 Molecule of the Month illustrations | CC BY 4.0 | 2D images | Yes, with credit (2D reference art only) |
| PDB-101 / RCSB article text | Copyrighted | text | No, unless RCSB gives permission |
| AlphaFold DB | CC BY 4.0 | mmCIF, PDB | Yes, with credit |
| PubChem 3D conformers (small molecules) | Mostly public domain (NCBI). Some submitter data may carry rights | SDF | Yes for common molecules (ATP, glucose); credit NLM |
| Mol* (software) | MIT | reads mmCIF/BCIF/PDB/SDF; exports GLB/OBJ/STL/USDZ | **Yes.** Main tool for converting molecules to glTF |
| cellPACK (software, recipes) | MIT | JSON recipes; referenced meshes are OBJ | Code yes. Allen meshes it references fall under Allen terms |
| Allen Cell data, images, meshes | Allen Institute Terms of Use: **noncommercial only**, citation required | OME-TIFF/Zarr, OBJ meshes | Allowed only while microcell stays noncommercial. Avoid as a core dependency |
| NIH 3D | Set per entry by the uploader (often CC BY or public domain, sometimes stricter) | GLB, STL, X3D, WRL | Case by case. Check each entry's license |
| Sketchfab | Per model: CC BY / CC BY-SA / CC BY-NC / CC0 / Standard | original + auto-converted glTF/USDZ | Case by case. CC0/CC BY fine. Avoid NC/SA |
| BioRender | Proprietary ToS | none exportable | **No** |
| ChimeraX (tool) | UCSF non-commercial license | exports GLB/STL/OBJ/VRML | Allowed as a local conversion tool for noncommercial work. Mol* is the cleaner choice |

## Sources

### RCSB PDB (structures)

- **License.** "Data files contained in the PDB archive … are available under the CC0 1.0 Universal (CC0 1.0) Public Domain Dedication." The same applies to RCSB API data and to images on Structure Summary pages. Attribution to the original authors and RCSB is "encouraged" but not required. Site text and articles are copyrighted. Software is MIT/Apache 2.0. ([RCSB usage policy](https://www.rcsb.org/pages/usage-policy))
- **Formats.** mmCIF (canonical), BinaryCIF (from `models.rcsb.org`, compact and fast for Mol*), and legacy PDB format. Large entries have no legacy PDB file: `files.rcsb.org/download/4v6x.pdb.gz` returns 404.
- **Sizes** (measured 2026-11-19 with `curl`):

  | Entry | What | `.cif` | `.cif.gz` | `.bcif` |
  |---|---|---|---|---|
  | 1CRN | crambin, tiny protein | 69 KB | 18 KB | 151 KB |
  | 1UBQ | ubiquitin | — | 27 KB | — |
  | 6LU7 | SARS-CoV-2 protease | — | 81 KB | — |
  | 7K00 | ribosome | — | 3.5 MB | — |
  | 4V6X | human 80S ribosome | 28.8 MB | 5.7 MB | 12.3 MB |

  Raw coordinates are small for single proteins but several MB for large complexes. Converted surface meshes are usually larger than the coordinates unless they are simplified (see Pipeline).
- **Runtime fetch.** Both `files.rcsb.org` and `models.rcsb.org` send `access-control-allow-origin: *`, so a static page could fetch structures live. Bundling pre-converted meshes is still better: it works offline, is reproducible, and never breaks because a third-party server is down.

### PDB-101

- **Molecule of the Month illustrations** (David Goodsell): CC BY 4.0. Credit "David S. Goodsell and the RCSB PDB". ([RCSB usage policy](https://www.rcsb.org/pages/usage-policy))
- **Article text**: copyrighted by RCSB and the authors. Reprinting needs permission (info@rcsb.org). The same page applies.
- PDB-101 asks to be cited as "PDB-101: Educational resources supporting molecular explorations through biology and medicine." Its suggested illustration credit is "Illustration by David S. Goodsell, B-HIVE Center, RCSB Protein Data Bank and Scripps Research." ([About PDB-101](https://pdb101.rcsb.org/more/about-pdb-101))
- **Use for microcell:** style reference and possibly 2D art in **Explanation layers**. PDB-101 has no 3D assets. Its 3D content is the PDB itself.

### AlphaFold DB

- "Data is available for academic and commercial use, under a CC-BY-4.0 licence." EMBL-EBI expects attribution. ([AlphaFold DB](https://alphafold.ebi.ac.uk/))
- Useful only when a protein has no experimental structure. For a generic cell, the PDB should cover almost everything.

### PubChem (small molecules: ATP, glucose, water…)

- NCBI: "Information that is created by or for the US government on this site is within the public domain." NLM asks for acknowledgment. PubChem is listed as possibly containing third-party protected material. ([NCBI policies](https://www.ncbi.nlm.nih.gov/home/about/policies/))
- 3D conformers download as SDF via PUG REST (`/rest/pug/compound/cid/<cid>/SDF?record_type=3d`), with CORS `*`. Mol*'s `glb-export` example converts exactly this to GLB (see Pipeline).

### Mol* (molstar)

- MIT license ([LICENSE](https://github.com/molstar/molstar/blob/master/LICENSE)).
- The `geo-export` extension has GLB, OBJ, STL, and USDZ exporters (`packages/extensions/geo-export/src/{glb,obj,stl,usdz}-exporter.ts`). The repo also ships `examples/glb-export`, a headless Node CLI that loads a structure, builds a representation, and writes `.glb` ([source](https://github.com/molstar/molstar/tree/master/examples/glb-export)). It can be scripted for a batch build step.
- Mol* could also be embedded as a live viewer, but it is a large dependency with its own visual style. For a simplified-style app, exporting meshes from it is the better fit.

### cellPACK

- Code is MIT ([LICENSE](https://github.com/mesoscope/cellpack/blob/main/LICENSE)). Python, `pack -r recipe.json`. Recipes are JSON (v1 legacy and v2), e.g. `examples/recipes/v2/peroxisome.json`, `er_peroxisome.json`, `endosome.json`, and blood plasma. ([README](https://github.com/mesoscope/cellpack))
- The v2 organelle recipes point to container meshes hosted by Allen as OBJ (e.g. `mem_mesh_743916.obj` and `nuc_mesh_743916.obj` "derived from a segmented hiPS cell"). Those meshes come under Allen terms, not MIT.
- **Use for microcell:** cellPACK solves a real problem: packing many molecules into a compartment so the cytoplasm looks crowded. But it's a Python offline tool that outputs instance positions, not a drop-in asset. At most, use it later to bake a "crowded cytoplasm" positions file. Doing the same in JS with simple random or Poisson packing plus `InstancedMesh` is probably enough for v1.

### Allen Institute for Cell Science

- Terms of Use name no open license. You may use, copy, distribute, and make derivative works "for research or other noncommercial purposes". Commercial use needs written permission. Copyright notices must not be removed, and citation follows the Allen citation policy. ([Terms of use](https://www.allencell.org/terms-of-use.html))
- The citation policy requires the citation "on the same page where the Allen Institute data or image appears". Images take the credit "Image credit: Allen Institute for Cell Science." plus a URL. ([Allen citation policy](https://alleninstitute.org/citation-policy))
- Data: real segmented hiPS cells (membrane, nucleus, organelle structures), as images and some OBJ meshes (see cellPACK above). Realistic, not textbook-generic.
- **Use for microcell:** legally OK while the app stays a free educational project, but the noncommercial clause is a one-way door. Those shapes are also real, irregular cells, not the textbook composite **Cell** the glossary defines. Don't depend on them.

### NIH 3D (formerly NIH 3D Print Exchange)

- The uploader chooses the license per entry. The terms say "many" entries are public domain or Creative Commons (e.g. CC BY) and others more restrictive. NIH 3D does not enforce licenses. Users "must review and comply with the licensing terms associated with each file before use." ([Terms](https://3d.nih.gov/terms))
- "Most models are downloadable in .glb, .stl, .x3d, and .wrl". .glb/.x3d are recommended for web use. QuickSubmit generates models from PDB, AlphaFold, PubChem, and EMDB IDs using ChimeraX and Blender. The WebXR viewer refuses models of 50 MB or more. ([FAQ](https://3d.nih.gov/faqs))
- **Use for microcell:** handy for ready-made GLBs of molecules and some cell or organelle models, but these are print-oriented: heavy, unsimplified, and inconsistent in style. QuickSubmit output is essentially the same as running ChimeraX ourselves, with less control.

### Sketchfab

- Each downloadable model is under a Standard license or a Creative Commons license (CC BY, BY-SA, BY-NC, CC0, etc.). Sketchfab auto-converts downloads to glTF/USDZ alongside the original. ([Sketchfab glTF](https://sketchfab.com/features/gltf), [CC intro](https://sketchfab.com/blogs/community/an-introduction-to-creative-commons-licenses))
- Attribution for CC models: "By downloading a CC model from a Sketchfab user, you agree to credit that user wherever you publicly reuse their work". Example: "This work is based on *Model* by *Author* licensed under CC BY 4.0." CC0 and Standard need no credit. ([Crediting users](https://help.sketchfab.com/en/articles/16152215-crediting-users-for-3d-model-downloads))
- Sketchfab's store has been migrating to Epic's Fab. CC BY models carry over, but BY-SA and BY-NC do not ([Fab migration](https://dev.epicgames.com/documentation/fab/migrating-assets-to-fab)). Expect links to move.
- **Use for microcell:** possible for one-off organelle models under CC0 or CC BY, but quality and style vary, and mixing artists breaks the visual consistency of a simplified style. Avoid NC (a one-way door) and SA (forces the same license on derivatives).

### BioRender

- No. "You may not use BioRender Content outside the BioRender application". The terms also forbid scraping, bulk export, or extracting content, including by vectorization. Free plans can't publish figures that contain BioRender content. ([BioRender ToS](https://www.biorender.com/terms-of-service))

### ChimeraX (tool, for completeness)

- `save file.glb` supports options `center`, `size`, `textureColors`, `floatColors`, `preserveTransparency`, and `instancing` ("Instancing can significantly reduce file size"). It also saves STL, OBJ (no colors), and VRML. ([save docs](https://www.cgl.ucsf.edu/chimerax/docs/user/commands/save.html))
- License: UCSF Non-Commercial Software License. Free for academic, non-profit, and government research. Commercial use needs a separate license. It is silent on output files. ([license](https://www.rbvi.ucsf.edu/chimerax/docs/license.html))
- Its exports are good, but Mol* (MIT, scriptable in Node) avoids any licensing question about the tool.

## Pipeline: molecule → web-ready glTF

Offline build step, committed outputs (or generated in CI):

1. **Fetch** structure: `https://models.rcsb.org/<id>.bcif` or `files.rcsb.org/download/<id>.cif` (CC0). For small molecules, PubChem SDF.
2. **Represent** in Mol*, headless (`examples/glb-export` pattern): choose a simplified representation, such as molecular surface or gaussian surface for a blobby, friendly look, or cartoon for proteins. Color by chain or entity. **Export GLB** with `GlbExporter`.
   - Alternative: ChimeraX `surface; save x.glb` (noncommercial license).
3. **Optimize** with glTF Transform (MIT, [CLI docs](https://gltf-transform.dev/cli)): `weld` → `simplify` (reduce vertices to a target ratio) → `dedup` → `instance` → `meshopt` (or `draco`). `gltf-transform optimize` chains these. Aim for well under 1 MB per molecule. Big complexes such as the ribosome can drop to a low-poly blob plus a detailed version loaded when the learner zooms in.
4. **Load** in three.js (MIT) with `GLTFLoader` plus `meshopt_decoder.module.js` (or the Draco decoder). Draw repeated molecules (ribosomes, ATP) with `InstancedMesh`.
5. **Record attribution** per asset in a manifest (`id, source URL, license, credit line`) and render a Credits page from it.

(three.js also ships `PDBLoader` for live ball-and-stick from PDB files. Live parsing isn't needed if meshes are baked.)

## Procedural geometry for organelles

Yes, generating organelles in code is the simpler route for the simplified style:

- No public source offers a consistent, openly licensed, textbook-style set of organelles. The candidates are Allen (noncommercial, realistic), Sketchfab (mixed licenses and styles), and NIH 3D (mixed, print-oriented).
- The simplified style is mostly primitives plus deformation, all available in three.js core or addons (MIT):
  - **Cell membrane and nucleus:** a sphere or ellipsoid with low-frequency noise displacement. The nuclear envelope is a double shell with pore instances.
  - **Mitochondrion:** `CapsuleGeometry` outer shell, with cristae as stacked, displaced planes or sine folds inside.
  - **ER and Golgi:** stacked, curved, flattened discs or sheets (Golgi). Rough ER is folded sheets with instanced ribosome dots.
  - **Vesicles, lysosomes, peroxisomes:** instanced spheres.
  - **Cytoskeleton:** `TubeGeometry` along random splines, instanced.
  - **Blobby forms:** `MarchingCubes` addon, or metaballs baked offline.
- Upsides: tiny download (code instead of MB of meshes), any level of detail, one coherent art style, no attribution burden, and easy to animate (a **Process** needs moving parts anyway).
- Molecular data (PDB → Mol* → GLB) is only needed at the molecule **Scale**, where real structures help understanding and the license is CC0.

## Recommendation

1. **Organelles and cell: procedural geometry in three.js.** No external assets.
2. **Molecules: RCSB PDB (CC0)**, plus PubChem for small molecules and AlphaFold (CC BY) only if needed. Convert offline with a **Mol* headless GLB export → glTF Transform (simplify + meshopt)** script. Commit the outputs and serve them as static files.
3. **Avoid** BioRender (forbidden), Allen Cell data (noncommercial lock-in, realistic shapes), and NC/SA-licensed Sketchfab/NIH 3D models. Use CC0 or CC BY models from NIH 3D or Sketchfab only as a deliberate exception, logged in the manifest.
4. **Attribution:** keep an asset manifest and a Credits page. Even where not required (CC0), credit the PDB entry authors and RCSB, as RCSB encourages. Required credits: AlphaFold DB (CC BY), Goodsell illustrations (CC BY), any CC BY model's author, and NLM for PubChem (requested).
5. Keep tooling permissively licensed (Mol*, glTF Transform, three.js are all MIT). This keeps every option open, including a later commercial use.
