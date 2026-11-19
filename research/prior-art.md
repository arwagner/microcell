# Prior art: existing cell-exploration apps and visualizations

Resolves [#4](https://github.com/arwagner/microcell/issues/4). Researched 2026-11-19.

**Question:** What already exists for exploring the cell interactively or visually? What works for beginners, and what is missing that microcell could do?

**Method:** Each entry was checked against its first-party page where that page was reachable. Where it was not (dead TLS certificate, 403, a JS-only page with no readable text), the entry says so and names the fallback source. No screenshots were captured; the entries describe the visuals in words.

**Short answer:** The prior art falls into four groups, and none of them combines all of microcell's ingredients:

- **2D scale sliders** (Utah *Cell Size and Scale*, *Scale of the Universe*) teach **scale** well but have no inside, no **process**, and one line of text per object.
- **3D organelle models** (Allen *Visual Guide*, Gurdon *Cell Explorer*, Visible Body, Harvard CellXplorer) teach **organelles** but stop at organelle **scale**, and most of them are paywalled, gated behind a form, or tied to a course.
- **Cinematic animations** (*Inner Life of the Cell*, Goodsell's paintings) show crowded, moving molecular **processes** beautifully but can't be explored.
- **Research tools** (cellPACK/cellVIEW, Mesoscale Explorer, Simularium, Nanome) handle molecular **scale** with real data, but they are built for experts, need a strong GPU, and give no beginner guidance.

---

## 1. Univ. of Utah, *Cell Size and Scale* (Learn.Genetics)

- **What:** A free 2D web interactive from the Genetic Science Learning Center. It is the ancestor of the whole "zoom slider" genre: *Scale of the Universe* names it as its inspiration ([htwins.net/scale2](https://htwins.net/scale2/)).
- **Interaction:** A slider along the bottom, or moving the mouse left and right over the picture, changes the **scale**. Objects grow and shrink in a single continuous line-up.
- **Scale:** Runs from a coffee bean (about 12 mm) down to a carbon atom. On the way it passes skin and red blood cells, bacteria, a chromosome, a flu virus, a ribosome and a nucleotide ([NIH SEPA summary](https://science.education.nih.gov/resource-materials/11), [Utah "Coffee to Carbon" activity PDF](https://teach.genetics.utah.edu/content/cells/files/Coffee-to-Carbon.pdf)). The companion text explains where light and electron microscopy stop being able to resolve things, and how DNA is packed by histones and protamines ([page](https://learn.genetics.utah.edu/content/cells/scale/)).
- **Beginner wins:** One control, no way to get lost, and familiar reference objects (coffee bean, grain of salt) that anchor the abstract sizes. It is widely used in classrooms.
- **Limits:** Objects sit side by side, not inside one another, so you never go *into* a cell. Nothing moves. Each object gets one line of explanation. It has no 3D.
- **Note:** The interactive renders only with JS. A text fetch of the first-party page returns the reference table but not the widget, so the description of the controls comes from NIH and Discover write-ups.
- **Related:** Learn.Genetics also has *Inside a Cell*, a labeled 2D cell you click to see each organelle. Its page also rendered no readable text ([page](https://learn.genetics.utah.edu/content/cells/insideacell/)).

## 2. *Scale of the Universe 2* (Cary and Michael Huang, htwins.net)

- **What:** A free web zoom covering everything from the Planck length to the observable universe. It was originally Flash; the current version is a port to Pixi.js by Matthew Martori, and there is also an iOS app ([htwins.net/scale2](https://htwins.net/scale2/)).
- **Interaction:** A slider or scroll wheel zooms continuously. Clicking an object opens a short blurb about it.
- **Scale:** Spans about 60 orders of magnitude, so a cell is one brief stop on the way.
- **Beginner wins:** Continuous, smooth zoom makes "how much smaller" something you feel. Clicking for a short fact is a light first **explanation layer**. The tone is playful, and it is translated into many languages.
- **Limits:** It is a line-up of objects, not a place. There are no processes and no inside of anything, and the blurbs have only one depth.

## 3. Allen Institute for Cell Science, *Visual Guide to Human Cells* and the Allen Cell Explorer

- **What:** The Allen Cell Explorer is a portal of free web tools built on the Institute's gene-edited human iPS cell lines: Cell Feature Explorer, Integrated Mitotic Stem Cell, the Vol-E volume viewer, the Simularium viewer, and more ([allencell.org](https://www.allencell.org/)). The tool closest to microcell is the **Visual Guide to Human Cells**, which the Allen Institute lists among its "online tools popular with teachers."
- **Interaction (Visual Guide):** You rotate, zoom and pan a 3D cell by mouse or touch, and hovering over a structure shows its name. A menu offers a visual map, a search box, and lists of *Cell Functions* and *Cell Structures* arranged as trees. Buttons around the cell step through interphase and each phase of mitosis. An information panel holds scrolling text, time-lapse movies and visuals you can enlarge ([tutorial](https://www.allencell.org/visual-guide-tutorial.html)).
- **Scale:** Organelle level only. The models are segmented from real spinning-disc confocal images, so there is no molecular detail. The guide even shows how a microscope blurs fine structures such as microtubules.
- **Beginner wins:** The cell is a real human cell built from real data. Hovering gives a label and the panel gives a paragraph, which is close to microcell's **explanation layers**. The mitosis buttons are a simple way to step through a **process** in stages. A tutorial is included.
- **Limits:** The tutorial itself warns that the color-coded surfaces can confuse first-time users. The deepest **scale** is the organelle. Organelles are smooth blobs, with no machinery inside and no molecular motion. The wider portal is research-oriented.

## 4. Gurdon Institute / Cambridge, *The Cell Explorer* (SCoPE)

- **What:** A free online 3D model of a eukaryotic cell made for UK GCSE and A-level biology. It was developed in the SCoPE programme with the Cambridge Faculty of Education.
- **Interaction:** You rotate and zoom the cell, recolor organelles, and switch labels on and off. It includes mitosis and meiosis animations, slides you can download, teacher notes and worksheets, and each organelle links to examples of real research.
- **Scale:** Organelle level.
- **Beginner wins:** It was designed around a curriculum, and the classroom framing is explicit. Linking each organelle to "real research" is a good way to "go deeper."
- **Limits:** You must fill in a form to get access. It stops at organelle **scale**.
- **Note:** The first-party page returned 403 to fetching ([gurdon.cam.ac.uk](https://www.gurdon.cam.ac.uk/programmes/the-cell-explorer/)). These details come from search excerpts of that page and of the SCoPE site, so treat them as medium confidence.

## 5. Harvard BioVisions and XVIVO, *The Inner Life of the Cell* (2006)

- **What:** A cinematic 3D animation of a white blood cell sensing its surroundings and responding. It was made by XVIVO with Harvard's Robert Lue and Alan Viel for Harvard molecular biology students and premiered at SIGGRAPH 2006. Follow-ups are *Powering the Cell: Mitochondria* (ATP synthesis) and *Protein Packing* (2013), which shows the crowding and Brownian motion inside a cell ([XVIVO](https://xvivo.com/examples/the-inner-life-of-the-cell/)).
- **Interaction:** None; it is a video. The best-known cut is a 3-minute teaser set to music, with more than 3.5 million YouTube views. Teachers often record their own narration over it.
- **Scale:** Moves continuously from the cell surface down to single motor proteins. The famous shot is kinesin "walking" along a microtubule while hauling a vesicle.
- **Beginner wins:** The emotional hook. Watching machinery move makes "the cell is a busy factory" feel real, and the kinesin walk is the single most-shared image in this genre.
- **Limits:** It can't be explored or paused to ask "what is that?", and it has no text. XVIVO itself notes that the original deliberately left out the crowding (more space, less clutter), which is why *Protein Packing* was made later. Some of the depicted mechanics reflect "the science as understood at the time."
- **Note:** biovisions.mcb.harvard.edu currently serves an expired TLS certificate, which is a sign of a neglected site.

## 6. Visible Body, *Visible Biology* (now inside VB Suite)

- **What:** Commercial 3D biology content. It started as a standalone *Visible Biology* mobile app and is now available only inside the paid **VB Suite** and its courseware, through institutional and group licenses ([visiblebody.com](https://www.visiblebody.com/), [support: what's in the app](https://support.visiblebody.com/hc/en-us/articles/4402249361435-What-s-in-the-App)). Eight of its cell models have also appeared as free 3D/AR results in Google Search on mobile: animal cell, plant cell, bacterial cell, mitochondria, Golgi apparatus, ER, and others ([blog](https://www.visiblebody.com/blog/visible-body-launches-3d-and-ar-biology-cell-models-in-partnership-with-google-search)).
- **Interaction:** You zoom, rotate and select 3D models. Animal and plant cells can be "dissected." Animated models have a slider to pause and scrub and a speed control in the info box. A "related content" box links to neighboring models ([preview](https://www.visiblebody.com/blog/a-preview-of-visible-biology-from-the-big-picture-to-the-molecular-level)).
- **Scale:** Has explicit scale steps for DNA only: double helix, then nucleosome, then chromatin fiber, then chromosome, each a separate animated model. Processes include photosynthesis, cellular respiration, mitosis, transcription and translation.
- **Beginner wins:** Clean, labeled models with brief text. Being able to scrub and slow animated processes is exactly the right control. The DNA packing sequence is a good model for a guided zoom from one **scale** to the next.
- **Limits:** Paywalled and built around courseware and quizzes. The scale levels are *separate models* joined by menu links, not one continuous space. The cell models are textbook-cartoon in style, with no molecular crowding.

## 7. cellPACK, cellVIEW, Mesoscope and CellPAINT (Scripps CCSB, Goodsell/Olson labs, TU Wien)

- **What:** A research toolchain for building and rendering 3D models of whole cellular environments, molecule by molecule ([ccsb.scripps.edu/cellpack](https://ccsb.scripps.edu/cellpack/)).
  - **cellPACK** packs proteins, membranes and soluble molecules into a volume from a "recipe." Its showcase is a whole *Mycoplasma* cell.
  - **cellVIEW** (built in Unity) renders the results: "billions of atoms" in an illustrative style inspired by Goodsell, smoothly at up to 15 billion atoms and 60 Hz, using level of detail to cut clutter ([cellVIEW paper, VCBM 2015](https://diglib.eg.org/bitstream/handle/10.2312/vcbm20151209/061-070.pdf)). It is open source on GitHub, with a Windows build and a GPU-streamed web session capped at 10 minutes ([TU Wien project page](https://www.cg.tuwien.ac.at/research/projects/illvisation/cellview/cellview.php)).
  - **Mesoscope** is a web tool for curating recipes.
  - **CellPAINT** (web and desktop) lets you "paint" molecules into a scene; their sizes and shapes come from real structures, and membrane rules are enforced as you paint ([ccsb.scripps.edu/cellpaint](https://ccsb.scripps.edu/cellpaint/)).
- **Scale:** Truly molecular, and true to scale and crowding.
- **Beginner wins:** CellPAINT is playful and hands-on. cellVIEW shows that a whole crowded cell can be rendered in real time, and that the Goodsell look works in 3D.
- **Limits:** Built for researchers and illustrators, and the cellPACK page itself warns of a "steep learning curve." cellVIEW needs a powerful GPU and does not run in the browser. None of the tools explain anything to the viewer.
- **For microcell:** These are the obvious source of *molecular-scale content*. A browser app could render baked or simplified cellPACK-style scenes rather than the raw atom counts.

## 8. Mol* Mesoscale Explorer (RCSB / Mol* team)

- **What:** A beta web app built on Mol* for exploring mesoscale models, meaning integrative 3D models of viruses, bacteria and organelles built from cryo-EM, cryo-ET and computational modeling ([molstar.org/me](https://molstar.org/me/)). It runs in the browser.
- **Interaction:** Free 3D navigation with quality settings. The page lists sections for "Guided Tours" and "Interactive Examples."
- **Scale:** From the organelle or virus down to atoms, in one scene.
- **Limits:** The page warns that large models can crash a browser with an out-of-memory error and recommends a desktop with a dedicated GPU. It is aimed at researchers and gives no beginner explanations.
- **For microcell:** Mol* is the best existing proof that browser WebGL can hold mesoscale molecular scenes. Its limits on memory and devices are a warning for a GitHub Pages app that has to run on school laptops and phones.

## 9. Allen Institute, Simularium

- **What:** An Apache-2.0 web viewer for biological *simulation* trajectories, such as agent-based molecular simulations, played back in 3D ([GitHub](https://github.com/simularium/simularium-website)).
- **Beginner relevance:** Low on its own, but it shows the pattern of separating the simulation data from the viewer, which could feed microcell's **process** animations later.

## 10. David Goodsell's molecular watercolors (RCSB PDB-101)

- **What:** About 48 watercolor paintings (1999 to 2024) showing cells and viruses at molecular **scale**, built from structural biology, microscopy and biophysics data ([PDB-101 Goodsell gallery](https://pdb101.rcsb.org/sci-art/goodsell-gallery)). Proteins, nucleic acids and membranes are drawn; water, ions and small molecules are left out for clarity. Each molecule type gets a flat, consistent color.
- **Interaction:** None; they are still images. PDB-101 does have a separate "Interactive Animations" section.
- **Beginner wins:** The clearest picture anywhere of *how crowded* a cell is. The color coding and omissions show how to simplify honestly.
- **License:** **CC-BY-4.0**, with a required credit line for each image. microcell could use them directly, for example as "go deeper" images, with attribution.
- **Limits:** Static, a 2D slice, and you have to bring your own explanation.

## 11. Molecular Flipbook (Harvard Medical School / Univ. of Utah)

- **What:** A free, open-source tool for scientists to make molecular animations. It was built on the Blender Game Engine, funded by NSF, and launched in 2014 (co-PIs Gael McGill and Piotr Sliz, with Janet Iwasa) ([MedCity News, 2014](https://medcitynews.com/2014/08/molecular-flipbook-uses-animation-help-researchers-visualize-microscopic-processes/)).
- **Status: dead.** The project's last homepage said it was "not currently in development." Today molecularflipbook.org 301-redirects to an unrelated commercial site.
- **For microcell:** Its idea of a keyframed, simplified, "blobby" molecular animation is still relevant to how microcell shows **processes**. It is also a reminder that tools from grant-funded academic projects decay. A static site with no backend, which microcell already plans, is the right defense.

## 12. Nanome

- **What:** A commercial XR and web platform for drug-discovery teams to view protein and ligand structures together. It runs on Quest, Vision Pro and the web, includes an AI copilot, and lists customers such as Genentech and Novartis ([nanome.ai](https://nanome.ai/)). It mentions an EDU offering but gives no detail.
- **Beginner relevance:** Low. It shows single molecules for experts and has no cell context. Its one useful idea is shared, multi-user viewing.

## 13. Harvard CellXplorer (HarvardX MCB64.1x)

- **What:** A zoomable, annotated graphic of 3D-rendered illustrations showing a prokaryotic cell beside a eukaryotic cell. Zoom buttons and an "annotation list" link each part to its lesson in the edX course ([standalone](https://iiif.harvard.edu/CellX/cellx_standalone.html)). It is built on IIIF, a deep-zoom image standard.
- **Beginner wins:** Deep-zoom on a single richly detailed picture is cheap and smooth, and every structure leads to a lesson, which is a "go deeper" link.
- **Limits:** A 2D image, only a few zoom levels, no motion, and the page warns that it loads slowly.

---

## Patterns to borrow

1. **One continuous zoom control** (Utah, *Scale of the Universe*). A single slider or scroll axis for **scale** is the most beginner-proof way to navigate. Pair it with free 3D orbiting, but keep scale on its own control.
2. **Familiar reference objects for scale** (Utah's coffee bean and grain of salt). Show a persistent scale bar or "this is as wide as..." comparison so the learner always knows how far in they are.
3. **Hover for a label, click for a panel** (Allen *Visual Guide*). This maps directly onto microcell's first two **explanation layers**. Gurdon's per-organelle "real research" links and CellXplorer's lesson links show what "go deeper" can be.
4. **Processes you can scrub and slow down** (Visible Body). Animated **processes** need play, pause, scrub and speed controls. Stepped stages, like the Allen mitosis buttons, suit processes with named phases.
5. **Guided scale descents** (Visible Body's DNA packing, *Inner Life*'s camera moves). Offer an optional "take me in" path that flies through the scales of one story, for example DNA from nucleus to double helix. Free exploration stays available.
6. **Honest simplification, in the Goodsell style.** Flat, consistent colors per molecule type, with water and ions left out and that choice stated. Show crowding at molecular scale (*Protein Packing* exists because the spacious original misled viewers).
7. **Level of detail per scale** (cellVIEW). Render what matters at the current **scale** and swap in simpler forms as you zoom out. Simplified or instanced geometry, not atoms, is what keeps it running in a browser.
8. **Labels and colors the learner can toggle** (Gurdon, Allen). Reduces clutter and the "color soup" confusion Allen warns about.
9. **Static, no backend, openly licensed assets** (the lesson of Flipbook and BioVisions decaying). GitHub Pages and CC-BY content such as Goodsell's are a good fit.

## Gaps microcell could fill

1. **One continuous space from the whole cell to molecules.** The beginner tools stop at organelles (Allen, Gurdon, Visible Body); the tools that reach molecules are expert tools (Mesoscale Explorer, cellVIEW); and the scale sliders have no inside. Nothing free lets a beginner fly *into* a cell, then into an organelle, then down to moving molecules.
2. **Explorable processes at molecular scale.** *Inner Life* proved that moving molecular machinery hooks people, but it is a fixed video. No free tool lets you arrive somewhere in the cell and watch a **process** happening there, then ask "what is that?"
3. **Layered explanations everywhere.** Existing tools offer one depth (a label, *or* a paragraph, *or* a linked lesson). A consistent label, then paragraph, then "go deeper" on every object at every **scale** is not done anywhere we found.
4. **Free, open, no gate, runs anywhere.** Visible Body is paid, Gurdon needs a form, CellXplorer is tied to a course, and the research tools need a strong GPU. A static WebGL site that runs well on a school Chromebook or a phone is open territory.
5. **A generic human cell that is actually a whole cell.** Allen's cell is real but has smooth organelles; Visible Body's is a textbook cartoon. A textbook composite cell (see GLOSSARY: **Cell**) whose organelles open up into crowded machinery done in the Goodsell style would be new.

## Implications for other decisions

- **Rendering and tech:** Mesoscale Explorer's out-of-memory warning and cellVIEW's GPU requirements mean molecular scenes must be heavily simplified, baked or instanced, with level of detail tied to **scale**. Raw atomic data won't work on target devices.
- **Content sourcing:** Goodsell's PDB-101 images are CC-BY-4.0 and usable with attribution. cellPACK recipes could seed molecular-scale layouts. Mol* and Simularium are open source (Apache-2.0 for Simularium) if we ever need a viewer component.
- **Scope:** Each beginner tool covers one or two of microcell's pillars (zoom, 3D, process, layered text). The combination of all four is the differentiator, so the v1 scope should keep all four, even if each is thin.
