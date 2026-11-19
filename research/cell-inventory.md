# What's inside a generic human cell, at each scale

Research for issue #2. It answers: what does a generic human **cell** contain, from the whole cell down to molecules? For each thing it gives its real size, how many a cell holds, where it sits, its job in plain language, and its shape, grouped by **scale**.

Numbers are cited as `[S#]`; sources are listed at the end. Where I worked out a number myself from cited figures, it is marked *(derived)*.

## Read this first

- **There is no single "generic human cell".** Cells in your body range from small white blood cells about 7 µm across to liver cells of 50–100 µm and nerve cells with arms over a metre long [S5]. The textbook "generic cell" is a composite: one cell holding every common organelle, with sizes taken from well-studied examples. Most hard counts come from three of those: the **HeLa** cell (a human cell line grown in labs), the **liver cell (hepatocyte)**, and the **COS-7** cell (a monkey cell line used for imaging). Each number below says which one it came from.
- **Units.** 1 millimetre (mm) = 1000 micrometres (µm). 1 µm = 1000 nanometres (nm). A human hair is roughly 70 µm thick, so a whole cell is a fraction of a hair's width. Molecules are measured in nm.
- **The size range is huge.** From a whole cell (~15 µm) down to a single protein (~4–5 nm) is a factor of about **3,000** *(derived from [S1], [S4])*. Down to small molecules such as ATP (well under 1 nm) is a factor of over 10,000.

## The scale ladder at a glance

| Scale | Typical size | Examples | How many in one cell |
|---|---|---|---|
| Cell | 10–30 µm across; "typical animal cell" 15 µm [S1] | the whole cell | 1 |
| Organelle | ~0.05–10 µm | nucleus, mitochondria, ER, Golgi, lysosomes | 1 to a few thousand of each |
| Macromolecular machine / polymer | ~5–120 nm (filaments can be µm long) | ribosome, nuclear pore, cytoskeleton filaments, vesicles | hundreds to millions |
| Single protein | 4–5 nm mean diameter [S4] | enzymes, motor proteins | ~10¹⁰ total [S1][S4] |
| Small molecule / ion | under ~1 nm; 100–1000 daltons [S1] | water, ATP, glucose, K⁺, Ca²⁺ | far more than proteins |

---

## Scale 1: the whole cell

| Property | Value | Source |
|---|---|---|
| Diameter | "a typical animal cell is 15 µm in diameter" | Alberts 7e [S1] |
| Volume, HeLa | 1,000–10,000 µm³ | Milo & Phillips / Alon table [S4] |
| Volume, HeLa (one measured study) | cytoplasm 0.94 pL (= 940 µm³) + nucleus 0.22 pL (= 220 µm³) | Fujioka 2006 via BioNumbers 104990 [S6] |
| Volume, liver cell | ~5,000 µm³ | Alberts Table 12-2 footnote [S2] |
| What it's made of (by weight) | water 70%, protein 18%, phospholipids 3%, other lipids 2%, small metabolites 3%, inorganic ions 1%, RNA 1.1%, DNA 0.25% | Alberts via Palsson Table 7.1 (BioNumbers 107131) [S7] |
| Protein molecules | ~10¹⁰ (10 billion) of perhaps 10,000 kinds | Alberts 7e ch. 12 [S1]; Milo & Phillips table [S4] |
| Protein crowding | 2–4 million proteins per µm³ | Milo 2013 [S8]; [S4] |

**Plain language.** A cell is a bag of watery gel about 15 µm wide. Its skin is the **plasma membrane**. Inside it is very crowded: millions of proteins in every cubic micrometre. About half the volume is the open gel (**cytosol**) and about half is walled-off rooms (**organelles**) [S1][S2].

**Shape.** Cells grown on a dish are flattened, spread "fried egg" shapes; cells floating freely are round. The textbook diagram is a rounded blob with the nucleus near the middle.

### The plasma membrane (the cell's skin)

- **Size:** a lipid bilayer about 4–5 nm thick (3.4–4.4 nm by X-ray; 5 nm rule of thumb); whole membranes with their proteins measure thicker, 7.5–10 nm [S9].
- **Job:** keeps the inside in and the outside out, and controls what crosses. It holds very different salt levels on each side: inside 140 mM potassium and 5–15 mM sodium; outside 5 mM potassium and 145 mM sodium [S10].
- **Shape:** a continuous two-layer sheet of fat-like molecules (lipids) with proteins floating in it.
- **Surprise:** in a liver cell the plasma membrane is only **2%** of all the cell's membrane. The rest is internal: ER, mitochondria, Golgi [S2].

---

## Scale 2: organelles

### How the space is divided (liver cell, Alberts Table 12-1 [S2])

| Compartment | % of cell volume |
|---|---|
| Cytosol | 54 |
| Mitochondria | 22 |
| Rough ER (inside space) | 9 |
| Smooth ER + Golgi (inside space) | 6 |
| Nucleus | 6 |
| Peroxisomes | 1 |
| Lysosomes | 1 |
| Endosomes | 1 |

### How the membrane is divided (liver cell, Alberts Table 12-2 [S2])

Total membrane about 110,000 µm² in a 5,000 µm³ liver cell. Rough ER 35%, mitochondrial inner membrane 32%, smooth ER 16%, mitochondrial outer membrane 7%, Golgi 7%, plasma membrane 2%, lysosome / peroxisome / endosome 0.4% each, inner nuclear membrane 0.2%. The ER's membrane area is 25× the plasma membrane's [S1][S2].

### Organelle inventory

Priority: **A** = a beginner must meet it; **B** = worth meeting; **C** = "go deeper" only.

| Organelle | Size | Count per cell | Where | Job (plain language) | Shape | Priority |
|---|---|---|---|---|---|---|
| **Nucleus** | HeLa ~220 µm³, ≈7.5 µm across *(derived from [S6])*; 6% of a liver cell's volume [S2] | 1 | near the centre | Holds the DNA, the cell's instruction book; copies instructions out as RNA | Sphere or oval wrapped in a double membrane (the nuclear envelope) pierced by pores | A |
| **Nucleolus** | up to "a micrometer or more" [S1] | usually 1 to a few (small ones fuse into one large one after division) [S1] | inside the nucleus | Factory where ribosomes are assembled [S1] | Dense blob with no membrane (a "condensate") [S1] | B |
| **Nuclear pores** | ~120 nm outer diameter [S12]; ~40 nm inner channel [S1]; 125 million daltons [S1] | 2,000–5,000 in a dividing human cell [S13] | studded across the nuclear envelope | Gates controlling what enters and leaves the nucleus. Small molecules pass freely; proteins bigger than ~5 nm need an escort [S1] | Ring with eightfold symmetry, built from 500–1000 protein copies [S1] | B |
| **Mitochondria** | ~0.5–1 µm wide, ~1–2 µm long (rule of thumb; varies) [S14] | ~1,665 in a (rat) liver cell [S15]; "hundreds" in a typical cell [S16] | scattered through the cytoplasm | Power plants: burn sugar and fat with oxygen to make ATP, the cell's energy currency [S1] | Bean or tube with two membranes; the inner one folds into shelves called cristae [S1] | A |
| **Endoplasmic reticulum (ER), rough** | flattened sacs with an inside space 20–30 nm wide [S1] | 1 connected network | wraps out from the nuclear envelope | Studded with ribosomes; makes proteins destined for membranes or for export [S1] | Stacks of flat sacs (cisternae) [S1] | A |
| **ER, smooth** | tubes 30–60 nm in diameter [S1] | part of the same network | spreads through the cytoplasm | Makes lipids; stores calcium; touches other organelles to swap lipids [S1] | Fine network of tubes [S1] | B (show as part of ER) |
| **Golgi apparatus** | each stack ~0.6–1 µm across (median mini-stack 0.61 µm in human endothelial cells [S35]; ~1 µm stacks of 7 cisternae in rat kidney cells [S36]); ER volume is ~37× Golgi volume in COS-7 [S17] | 1 (made of several stacks) | next to the nucleus | Post office: finishes, labels and sorts proteins from the ER and ships them in vesicles | Stack of curved flat sacs | A |
| **Lysosomes** | ~0.5 µm (0.5–1 µm) [S18] | ~90–190 in a COS-7 cell [S17]; 1% of liver-cell volume [S2] | scattered | Recycling bins: acid-filled sacs of enzymes that break down worn-out parts and swallowed material | Small round sacs | B |
| **Peroxisomes** | 0.1–0.2 µm typical; some tubular [S19] | ~90–190 in a COS-7 cell [S17] | scattered | Break down fatty acids and toxic chemicals using oxidation reactions [S1] | Small round sacs | C |
| **Endosomes** | typical ~250 nm (Luby-Phelps 2000, via [S38]); early endosomes mix ~60 nm tubes and ~400 nm sacs [S37]; late endosomes ~0.76 µm in HeLa [S38] | 1% of liver-cell volume [S2] | near the plasma membrane and inward | Sorting stations for material brought in from outside | Irregular sacs and tubes | C |
| **Transport vesicles** | 40–80 nm (cryo-EM mean ~45 nm) [S20]; 50 nm rule of thumb [S20] | many thousands (unconfirmed: no primary per-cell count found) | travelling between ER, Golgi and membrane | Delivery bubbles carrying cargo between organelles | Tiny spheres | A (they are how processes become visible) |
| **Cytoskeleton** | see Scale 3 | networks | throughout | The cell's scaffolding and its roads | Filaments | A |
| **Centrosome** | two centrioles, each ~440 nm long and ~200–250 nm wide [S39][S40], in a cloud of pericentriolar material; that cloud's overall size is not confirmed here (reviews summarising super-resolution work put interphase rings at up to ~0.5 µm across) | 1 (2 before division) | beside the nucleus | Organises microtubules; pulls chromosomes apart in division | Two small barrels at right angles | C |

Note on mitochondria: in many living cells they fuse and split, forming branching networks rather than separate beans (Alberts notes new mitochondria arise by growth and fission [S1]). The liver-cell count of ~1,665 is from rat [S15]. Mitochondria take up 22% of a liver cell [S2], far more than in most cells.

---

## Scale 3: macromolecules and molecular machines

| Thing | Size | Count per cell | Where | Job | Shape | Priority |
|---|---|---|---|---|---|---|
| **DNA** | 3.2 billion base pairs per genome copy [S4]; two copies per cell ≈ 2 m of DNA if stretched out [S21]; double helix ~2 nm wide (20.4 Å for B-DNA) [S41] | 46 chromosomes; ~21,000 protein-coding genes [S4] | nucleus | The instruction book | Very long double helix, wound up | A |
| **Nucleosome** | ~10 nm across [S21]; ~147 base pairs of DNA wrapped around it [S22] | millions [S22] | along all DNA in the nucleus | Spools that package DNA and control which genes can be read [S22] | Disk of 8 histone proteins with DNA wrapped twice around [S22] | B |
| **mRNA** (messenger RNA) | gene copy, thousands of nucleotides | 10⁵–10⁶ molecules [S4] | made in nucleus, read in cytosol | Working copy of one gene, carried to a ribosome | Single-stranded thread | A |
| **Ribosome** | ~30 nm diameter [S1]; 4.3 million daltons [S23] | ~3.3 × 10⁶ [S24] to ~9.5 × 10⁶ [S25] in HeLa; ~10⁶–10⁷ typical [S4][S26] | free in cytosol, or on rough ER | Reads mRNA and builds the protein it codes for | Two unequal lumps (large and small subunits) clamped around the mRNA [S27] | A |
| **Proteins (in general)** | mean ~4–5 nm diameter [S4] | ~10¹⁰ [S1][S4] | everywhere | Do almost every job in the cell | Folded chains of amino acids; very varied | A (as a class) |
| **Microtubules** | 24–25 nm diameter [S28][S29]; can be many µm long | network | radiating from the centrosome | Roads for motor proteins; pull chromosomes apart | Hollow tube | A |
| **Actin filaments** | ~7–8 nm diameter [S28] | dense network | mostly just under the plasma membrane | Give the cell its shape and let it crawl | Thin twisted rope (two strands) | B |
| **Intermediate filaments** | ~10 nm (8–10 nm) [S28][S30] | network | throughout; lamins line the nucleus | Tough cables that give mechanical strength | Rope | C |
| **Kinesin (motor protein)** | single protein; size unconfirmed: heads are reported ~8 nm long and the whole molecule ~75–80 nm in rotary-shadowing EM, but the primary papers were not read | many | walks on microtubules | Carries vesicles and organelles along microtubule roads, 8 nm per step, one ATP per step [S31], up to ~0.8 µm per second [S32] | Two "feet" that walk hand-over-hand | B (great for a **process**) |
| **ATP synthase** | ~20 nm tall, ~10 nm wide (bacterial enzyme) [S42] | unconfirmed for human cells: ~15,000 per liver mitochondrion is quoted but rests on a course web page [S43]; scaling estimates for single-celled eukaryotes give ~100–5,000 [S44]. Best reading: thousands | inner mitochondrial membrane | Spinning motor that makes ATP: hydrogen ions flowing through it turn a rotor, which drives a second motor that builds ATP [S33] | Membrane rotor + shaft + knob | B (great for a **process**) |
| **Nuclear pore complex** | see organelle table | 2,000–5,000 [S13] | nuclear envelope | Gate | Ring | B |
| **Mitochondrial DNA** | 16,569 base pairs, codes 13 proteins [S1] | >6,000 copies in HeLa [S16]; varies ~100 (blood) to ~7,000 (heart) [S16] | inside mitochondria | Mitochondria's own small genome, a leftover from their bacterial ancestor [S1] | Small circle | C |

---

## Scale 4: small molecules and ions

| Molecule | Size | Amount in the cell | Job | Priority |
|---|---|---|---|---|
| **Water** | 18 daltons [S1] | 70% of the cell's weight [S1][S7] | The medium everything happens in | A (as background) |
| **ATP** | small molecule (100–1000 daltons class) [S1] | about 2 mM [S1]; review average 3.15 mM (±1.7) across ~600 measurements [S34] | Energy currency: spent to power almost every process | A |
| **Glucose** | 180 daltons [S1] | blood plasma held at ~3–9 mM (low after fasting, high after meals) [S45]; free glucose inside cells is much lower, ~0.07–1 mM in cultured mammalian cells bathed in 10 mM [S46] | Sugar fuel that mitochondria burn | B |
| **Potassium (K⁺)** | ion | 140 mM inside vs 5 mM outside [S10] | Main positive ion inside cells | C |
| **Sodium (Na⁺)** | ion | 5–15 mM inside vs 145 mM outside [S10] | Kept out; its pull powers transport | C |
| **Calcium (Ca²⁺)** | ion | free: 0.0001 mM inside vs 1–2 mM outside; most stored in organelles [S10] | Signal: a burst of it tells the cell to act | C |
| **Amino acids, nucleotides, sugars, fatty acids** | 100–1000 daltons, up to ~30 carbons [S1] | 3% of cell weight together with other metabolites [S7] | Building blocks for proteins, DNA/RNA, membranes | B |

Molecular-motion scale (useful for animation pacing): a protein takes ~1–10 s to drift across a mammalian cell by diffusion; a small molecule ~0.1–1 s [S4]. Making one protein takes ~30 min including export of its mRNA; a typical protein lasts 10–100 h [S4].

---

## What a beginner most needs

Ranked by what a textbook-style first tour must show:

1. **Cell & plasma membrane**: the bag and its skin.
2. **Nucleus + DNA**: the instruction book and where it's kept.
3. **Ribosome**: where instructions become proteins.
4. **Rough ER → Golgi → vesicles**: the protein production and shipping line.
5. **Mitochondria + ATP**: power and the energy currency.
6. **Cytoskeleton (microtubules) + motor proteins**: the roads and the trucks.
7. Second tier: nucleolus, nuclear pores, lysosomes, actin, nucleosomes.
8. Go-deeper tier: peroxisomes, endosomes, centrosome, intermediate filaments, mitochondrial DNA, ions.

---

## Implications for microcell

- **Zoom range is about 4 orders of magnitude** (15 µm cell → ~1 nm molecules). No single scene or level-of-detail can hold it; this argues for discrete **scale** levels with hand-offs, not one continuous model at full detail.
- **Counts force representation choices.** Organelles number 1 to ~2,000 each: renderable as real objects. Ribosomes (~10⁶–10⁷) and proteins (~10¹⁰) are not; they must be shown by instancing, sampling, or texture/particle stand-ins at the scales where they're individually visible, and only near the camera.
- **Crowding is the truth.** At molecular scale the cytoplasm is packed (2–4 million proteins per µm³). Honest visuals look dense, like David Goodsell's paintings; sparse "floating in empty space" is a misconception worth avoiding.
- **Pick one reference cell and say so.** Numbers vary widely by cell type. Using HeLa/"typical 15 µm animal cell" proportions for sizes and the liver-cell volume table for proportions is defensible, but note that liver cells are unusually rich in mitochondria (22% of volume) and ER.
- **Membrane is mostly internal.** ER and mitochondrial inner membrane dwarf the plasma membrane. Showing the ER as a big network around the nucleus is accurate, not exaggeration.
- **Best first processes** (motion that teaches): ribosome translating mRNA; vesicle travelling ER → Golgi → membrane; kinesin walking a microtubule (8 nm steps); ATP synthase spinning. Each has well-known structures in PDB.
- **Timing needs compression.** Real processes span microseconds (molecular motion) to hours (protein lifetimes); animation will need per-process time scaling, flagged to the learner.

---

## Familiar objects for the scale bar

Sizes for the comparisons the scale bar shows. Where the app needs one number from a measured range, the number it uses is marked *(derived)* and the reason given.

| Object | Measured size | Number the app uses | Source |
|---|---|---|---|
| Human scalp hair, width | 60–80 µm ("Scalp hair is a fiber 60 to 80 μm in diameter") | 70 µm *(derived: middle of the range)* | Wolfram 2003 via BioNumbers 114258 [S47] |
| Human red blood cell, width | 7.7 µm (mean of 8 measurements); about 2 µm thick | 7.7 µm | Cell Size Database via BioNumbers 108239 [S48]; thickness Rosen 1967 via BioNumbers 100799 [S48] |
| Bacterium (*E. coli*), width | 1.0–1.1 µm for 92% of wild-type cells; length 2.62–4.00 µm across growth conditions | 1 µm (width) | Nelson & Young 2000 via BioNumbers 100002 [S49]; Zaritsky & Woldringh 1978 via BioNumbers 104113 [S50] |
| Flu (influenza) virus particle | 85–120 nm across, by electron microscopy | 100 nm *(derived: a round figure inside the measured range)* | Roy et al. 2000 via BioNumbers 101585 [S51] |
| Ribosome | ~30 nm | 30 nm | Alberts 7e [S1] |
| DNA double helix, width | 20.4 Å (≈2 nm) for B-DNA | 2 nm | Arnott & Hukins 1972 via BioNumbers 105243 [S41] |

---

## Sources

- **[S1]** Alberts B et al. *Molecular Biology of the Cell*, 7th ed. (W. W. Norton, 2022). Chapter 1 (mitochondrial genome 16,569 bp, 13 proteins); Chapter 2 (70% water; typical animal cell 15 µm; ATP ~2 mM; small organic molecules 100–1000 daltons; glucose 180 daltons); Chapter 12 (~10¹⁰ proteins of ~10,000 kinds; organelle descriptions; ER cisternae 20–30 nm, smooth ER tubules 30–60 nm; condensates ~50 nm to ≥1 µm; nucleolus; NPC 125 MDa, ~40 nm internal diameter, 500–1000 proteins; ribosomes ~30 nm; ~5 nm / 40 kDa passive-diffusion limit). Online sample chapters: https://nerd.wwnorton.com/ebooks/epub/mboc7/EPUB/content/4.3.1-chapter12.xhtml (and sibling files 1.1.x-chapter01, 1.2.x-chapter02, 4.3.x-chapter12).
- **[S2]** Alberts B et al. *Molecular Biology of the Cell*, 5th ed. (Garland, 2008), p. 697, Tables 12-1 and 12-2 (compartment volumes and membrane amounts in a liver cell; hepatocyte ~5,000 µm³, ~110,000 µm² membrane). Scans via BioNumbers 110373 / 110374: https://bionumbers.hms.harvard.edu/bionumber.aspx?id=110373, https://bionumbers.hms.harvard.edu/bionumber.aspx?id=110374
- **[S4]** Milo R, Phillips R. *Cell Biology by the Numbers*, table adapted from Alon U, *Introduction to Systems Biology* (BioNumbers 111494): HeLa volume 1,000–10,000 µm³, 2–4×10⁶ proteins/µm³, ~10¹⁰ proteins, 10⁵–10⁶ mRNA, ~10⁶ ribosomes, protein diameter 4–5 nm, 3.2 Gbp genome, 21,000 genes, timescales. https://bionumbers.hms.harvard.edu/bionumber.aspx?id=111494
- **[S5]** BioNumbers 109546, lymphocyte diameter (human cells span ~7 µm lymphocytes to 50–100 µm liver cells and >1 m neurons). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=109546
- **[S6]** Fujioka A et al. *J Biol Chem* 2006;281:8917, via BioNumbers 104990 (HeLa nucleus 0.22 pL, cytoplasm 0.94 pL). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=104990
- **[S7]** Palsson BO, *Systems Biology* (2011) Table 7.1, from Alberts 1983, via BioNumbers 107131 (cell composition by weight). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=107131
- **[S8]** Milo R. "What is the total number of protein molecules per cell volume?" *BioEssays* 2013;35:1050. https://pmc.ncbi.nlm.nih.gov/articles/PMC3910158/
- **[S9]** BioNumbers 105298 (lipid bilayer 3.4–4.4 nm), 101835 (5 nm rule of thumb), 100787 (cell membrane 7.5–10 nm). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=105298, https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101835, https://bionumbers.hms.harvard.edu/bionumber.aspx?id=100787
- **[S10]** Alberts et al. *Molecular Biology of the Cell*, 3rd ed., Table 11-1, via BioNumbers 106428 (ion concentrations). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=106428
- **[S12]** Hoelz A, Glavy JS, Beck M. "Toward the atomic structure of the nuclear pore complex: when top down meets bottom up." *Nat Struct Mol Biol* 2016;23:624 (outer diameter ~120 nm, ~110 MDa; other papers give 110–125 MDa). https://pmc.ncbi.nlm.nih.gov/articles/PMC5156573/
- **[S13]** Lim RYH, Aebi U, Fahrenkrog B. "Towards reconciling structure and function in the nuclear pore complex." *Histochem Cell Biol* 2008 (proliferating human cells: 10–20 NPCs/µm², 2,000–5,000 per nucleus). https://pmc.ncbi.nlm.nih.gov/articles/PMC2228380/
- **[S14]** BioNumbers 100436 (mitochondrion length ~1 µm, mammalian culture cells), 101798 (2 µm rule of thumb), 110892 (typical size 500 nm). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=100436, https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101798, https://bionumbers.hms.harvard.edu/bionumber.aspx?id=110892
- **[S15]** Weibel ER et al. *J Cell Biol* 1969;42:68, Table III, via BioNumbers 105783 (1,665 mitochondria per rat hepatocyte). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=105783
- **[S16]** BioNumbers 105937 (>6,000 mtDNA copies per HeLa cell; "hundreds of mitochondria"; Clayton 1982) and 116471 (mtDNA copies by cell type). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=105937, https://bionumbers.hms.harvard.edu/bionumber.aspx?id=116471
- **[S17]** Valm AM et al. "Applying systems-level spectral imaging and analysis to reveal the organelle interactome." *Nature* 2017;546:162, via BioNumbers 113930 (COS-7: peroxisomes, lysosomes, lipid droplets ~90–190 each per cell; ER ≈ 37× Golgi and 9× mitochondria by volume). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=113930
- **[S18]** BioNumbers 106078 (lysosome diameter 0.5 µm, human mammary epithelial cell). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=106078
- **[S19]** BioNumbers 113108 (peroxisome diameter 0.1–0.2 µm; tubular forms in mammals). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=113108
- **[S20]** BioNumbers 102727 (trafficking vesicles 40–80 nm, mean 45 nm) and 101799 (50 nm rule of thumb, *Physical Biology of the Cell*). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=102727, https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101799
- **[S21]** BioNumbers 102980 (≈2 m of DNA packed into a ~10 µm nucleus; Lodish); Nature Scitable, "DNA Packaging: Nucleosomes and Chromatin" (nucleosome ~10 nm). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=102980, https://www.nature.com/scitable/topicpage/dna-packaging-nucleosomes-and-chromatin-310
- **[S22]** PDB-101 Molecule of the Month: Nucleosome (8 histones, DNA wrapped twice, millions per cell). https://pdb101.rcsb.org/motm/7 ; PDB 1KX5 (147 bp nucleosome core). https://www.rcsb.org/structure/1KX5
- **[S23]** Human 80S ribosome, calculated mass 4.3 MDa (*Nucleic Acids Res* gkt1404, Fig. 1). https://pmc.ncbi.nlm.nih.gov/articles/PMC3973290/ ; structure: Anger AM et al. *Nature* 2013;497:80 (PDB 4V6X).
- **[S24]** Duncan R, Hershey JW 1983, via BioNumbers 107552 (~3.3×10⁶ ribosomes per HeLa cell). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=107552
- **[S25]** Wolf SF, Schlessinger D 1977, via BioNumbers 107347 (9.5×10⁶ ribosomes per HeLa cell). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=107347
- **[S26]** Yewdell JW. *Trends Cell Biol* 2001;11:294, via BioNumbers 113834 (10⁷ ribosomes per HeLa cell). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=113834
- **[S27]** PDB-101 Molecule of the Month: Ribosome. https://pdb101.rcsb.org/motm/10
- **[S28]** Turgay Y et al. *Nature* 2017;543:261, via BioNumbers 114288 (microtubule 24 nm, F-actin 8 nm, vimentin 10 nm, lamin ~3.5 nm). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=114288
- **[S29]** Nature Scitable, cytoskeleton (microtubule ~25 nm, actin ~6 nm, intermediate filaments ~10 nm). https://www.nature.com/scitable/topicpage/the-cytoskeleton-14673315/
- **[S30]** BioNumbers 106125 (intermediate filaments 8–10 nm). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=106125
- **[S31]** BioNumbers 101857 (kinesin moves 8 nm per ATP). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101857
- **[S32]** BioNumbers 105241 (kinesin-1 max speed ~814 nm/s at low load). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=105241
- **[S33]** PDB-101 Molecule of the Month: ATP Synthase. https://pdb101.rcsb.org/motm/72
- **[S34]** Traut TW. "Physiological concentrations of purines and pyrimidines." *Mol Cell Biochem* 1994;140:1 (ATP 3,152 ± 1,698 µM), via BioNumbers 106639. https://bionumbers.hms.harvard.edu/bionumber.aspx?id=106639
- **[S35]** Page KM et al. "Structure modeling hints at a granular organization of the Golgi ribbon." *BMC Biol* 2022;20:111 ("the median diameter of a Golgi mini-stack in HUVECs as measured in electron micrographs is 0.612 μm"). https://pmc.ncbi.nlm.nih.gov/articles/PMC9102599/
- **[S36]** Ladinsky MS, Mastronarde DN, McIntosh JR, Howell KE, Staehelin LA. "Golgi structure in three dimensions: functional insights from the normal rat kidney cell." *J Cell Biol* 1999;144:1135 (a ~1 × 1 × 4 µm tomogram holding two stacks of seven cisternae). https://pmc.ncbi.nlm.nih.gov/articles/PMC2150572/
- **[S37]** Jovic M, Sharma M, Rahajeng J, Caplan S. "The early endosome: a busy sorting station for proteins at the crossroads." *Histol Histopathol* 2010;25:99 ("thin tubular extensions (∼60 nm diameter) and large vesicles (∼400 nm diameter)", citing Gruenberg 2001). https://pmc.ncbi.nlm.nih.gov/articles/PMC2810677/
- **[S38]** Ganley IG et al. *Mol Biol Cell* 2004;15:5420, via BioNumbers 104378 (late endosome 0.76 µm in HeLa; the entry also cites a typical endosome diameter of 250 nm from Luby-Phelps K, *Int Rev Cytol* 2000;192:189). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=104378
- **[S39]** Laporte MH et al. "Time-series reconstruction of the molecular architecture of human centriole assembly." *Cell* 2024;187:2158 (mature human centriole "about 400–450 nm long and 200–250 nm wide"; measured mean length 439 ± 47 nm). https://pmc.ncbi.nlm.nih.gov/articles/PMC11060037/
- **[S40]** Loncarek J, Bettencourt-Dias M. "Building the right centriole for each cell type." *J Cell Biol* 2018;217:823 (diameter ∼200–220 nm; length up to 500 nm in human somatic cells). https://pmc.ncbi.nlm.nih.gov/articles/PMC5839779/
- **[S41]** Arnott S, Hukins DW. *Biochem Biophys Res Commun* 1972;47:1504, via BioNumbers 105243 (B-DNA diameter 20.4 Å from fibre diffraction; 22–26 Å hydrodynamic). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=105243
- **[S42]** Boyer PD, *Annu Rev Biochem* 1997;66:717, and Yoshida M et al., *Nat Rev Mol Cell Biol* 2001;2:669, via BioNumbers 111322 (*E. coli* F₀F₁ ~20 nm tall, ~10 nm wide). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=111322
- **[S43]** Olgun A. "Biological effects of deuteronation: ATP synthase as an example." *Theor Biol Med Model* 2007;4:9, Table 1 ("~15000" ATP synthases per liver mitochondrion, citing only a university course web page). https://pmc.ncbi.nlm.nih.gov/articles/PMC1808445/ . For scale: a rat liver mitochondrion has ~6.5 µm² of inner membrane holding redox complexes and ATP synthase at a combined ~7,500/µm² (Schwerzmann K et al., *J Cell Biol* 1986;102:97; https://pmc.ncbi.nlm.nih.gov/articles/PMC2114063/), so tens of thousands of complexes in all.
- **[S44]** Fahimi P, Matta CF. "On the power per mitochondrion and the number of associated active ATP synthases." *Phys Biol* 2021;18(4), Table 4, via BioNumbers 117334–117336 (~100 in *Amoeba proteus* to 1,000–5,000 in *Ochromonas*). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=117334
- **[S45]** Gerich JE, *Baillieres Clin Endocrinol Metab* 1993;7:551, and Nuttall FQ et al., *Diabetes Metab Res Rev* 2008;24:438, via BioNumbers 110776 (human plasma glucose ~3 mM after prolonged fasting to ~9 mM after meals). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=110776
- **[S46]** John SA, Ottolia M, Weiss JN, Ribalet B. "Dynamic modulation of intracellular glucose imaged in single cells using a FRET-based glucose nanosensor." *Pflugers Arch* 2008;456:307 ("intracellular glucose level typically reaches 0.5–1 mM when extracellular glucose is 10 mM" in high-uptake cells; below the 0.07 mM detection limit in slow-uptake cells). https://pmc.ncbi.nlm.nih.gov/articles/PMC4339035/
- **[S47]** Wolfram LJ. "Human hair: a unique physicochemical composite." *J Am Acad Dermatol* 2003, via BioNumbers 114258 (scalp hair 60–80 µm in diameter). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=114258
- **[S48]** Gregory TR, Cell Size Database (2001–2005), via BioNumbers 108239 (human red blood cell diameter 7.7 µm). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=108239 ; Rosen R, *Optimality Principles in Biology* (Plenum, 1967) p. 56, via BioNumbers 100799 (red blood cell thickness 2 µm). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=100799
- **[S49]** Nelson DE, Young KD. "Penicillin binding protein 5 affects cell diameter, contour, and morphology of *Escherichia coli*." *J Bacteriol* 2000;182:1714, via BioNumbers 100002 (diameters of 92% of wild-type cells between 1.0 and 1.1 µm). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=100002
- **[S50]** Zaritsky A, Woldringh CL. "Chromosome replication rate and cell shape in *Escherichia coli*: lack of coupling." *J Bacteriol* 1978;135:581, Table 1, via BioNumbers 104113 (diameter 0.68–1.04 µm, length 2.62–4.00 µm). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=104113
- **[S51]** Roy AM, Parker JS, Parrish CR, Whittaker GR. "Early stages of influenza virus entry into Mv-1 lung cells: involvement of dynamin." *Virology* 2000;267:17, p. 19, via BioNumbers 101585 (influenza virions 85–120 nm by negative-stain electron microscopy). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=101585

Not used: NCBI Bookshelf's free Alberts 4th edition blocked automated access (captcha), so the 5th/7th-edition copies above were used instead.
