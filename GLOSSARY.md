# microcell

An app for a curious beginner to explore the inside of a cell by zooming through it and watching its machinery work.

## Language

**Cell**:
The single cell the app is set inside: in v1, the **Reference cell**, holding every common organelle.
_Avoid_: model cell, specimen, generic cell

**Reference cell**:
The real cell the Cell's numbers come from: a HeLa cell (a human cell line grown in labs) wherever HeLa data exists, with gaps filled from other mammalian cells, each borrowed figure saying which cell it came from.
_Avoid_: generic cell, textbook composite, average cell

**Organelle**:
A structure inside the cell with a job of its own, such as the nucleus or a mitochondrion.
_Avoid_: part, component

**Machine**:
A single molecular machine, a protein complex the learner meets at the Molecule stop, such as ATP synthase or the ribosome.
_Avoid_: enzyme, complex, protein, molecule

**Part**:
A named piece of a Machine with its own explanation layers, such as the c-ring of ATP synthase.
_Avoid_: subunit, component, domain, chain

**Cytoplasm filler**:
The crowded stand-in drawn at the Machinery stop anywhere away from a Site, showing how packed the inside of the cell really is, without being explorable.
_Avoid_: background, crowd, cytosol, padding

**Process**:
Something the cell's machinery does over time, shown as motion, such as a protein being made.
_Avoid_: animation, simulation, pathway

**Scale**:
How far the learner has zoomed in, from the whole cell down to single molecules.
_Avoid_: zoom level, magnification

**Explanation layer**:
One of the depths a thing is explained at: a one-line label, a paragraph, then "go deeper".
_Avoid_: tooltip, description, info panel

**Stop**:
One of four named bands of scale the cell is organised into: Cell, Organelle, Machinery, Molecule.
_Avoid_: level, rung, zoom level

**Focus**:
The thing the learner is currently inside or looking at, which the view orbits around.
_Avoid_: selection, target

**Dive**:
Moving into a thing so it becomes the focus at the next stop down.
_Avoid_: drill down, zoom into

**Site**:
A hand-built place where the cell can be explored all the way down to the Molecule stop, usually where a process happens.
_Avoid_: hotspot, location, scene

**Guided descent**:
An optional narrated flight down through the stops that tells one story.
_Avoid_: tour, tutorial, walkthrough

**Page**:
A piece of plain reading outside the cell itself, such as "About this cell", which says what the app simplifies.
_Avoid_: screen, modal, article, about box

**Comparison**:
A familiar object shown against the scale bar with its real size, so the learner can judge how big something is, such as a hair's width or a flu virus.
_Avoid_: reference object, benchmark, landmark

**Content file**:
One Markdown file in `content/` about one thing (or, for Comparisons, one list of them): YAML frontmatter holds its facts and sources, and the body holds its explanation layers. Its kind is one of `cell`, `organelle`, `site`, `machine`, `part`, `process`, `descent` (a Guided descent), `page`, `cytoplasm` (the Cytoplasm filler) or `comparisons`.
_Avoid_: data file, entry

**Asset manifest**:
The list in `assets/manifest.json` of every outside file the app uses, such as a protein structure, each with its source, license, credit line, and whether credit is required or a courtesy.
_Avoid_: credits file, asset list, attributions
