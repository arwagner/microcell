# Which processes suit v1, and how each really works

Research for [#3](https://github.com/arwagner/microcell/issues/3). Vocabulary follows [GLOSSARY.md](../GLOSSARY.md).

For each candidate **process**: what really happens, step by step; the molecules involved; how fast it goes; which **scale** it plays at; and how well it reads as motion to a beginner. A ranked recommendation is at the end.

Numbers are for human or other mammalian cells unless marked otherwise. Cellular speeds vary a lot with conditions, so most are ranges. Sources are listed at the bottom; `[n]` points to them.

## A sense of scale first

| Thing | Rough size |
|---|---|
| Whole human cell | ~10–30 µm across |
| Mitochondrion | ~1 µm long |
| Transport vesicle | ~50–100 nm |
| Ribosome | ~25–30 nm |
| ATP synthase | ~25 nm tall (the human enzyme measures about 23 nm: see `research/machines.md`) |
| Single small molecule (ATP, water) | < 1 nm |

The candidates fall into three tiers by scale. Mitosis plays at whole-cell scale. Vesicle trafficking plays at organelle scale. Protein-making, ATP synthesis and membrane transport play at molecular scale (protein-making also spans the nucleus-to-cytoplasm trip).

---

## 1. Making a protein: transcription, then translation

**The idea in one line.** The cell copies one gene from DNA into a messenger molecule (mRNA), carries it out of the nucleus, and a ribosome reads it to string amino acids into a protein.

### Steps

1. **Transcription starts (nucleus).** Proteins called transcription factors gather at the start of a gene and recruit **RNA polymerase II**, an enzyme that copies DNA into RNA [1].
2. **Elongation.** RNA polymerase unwinds a short stretch of the DNA double helix (a "bubble"), reads one strand, and builds a matching RNA chain one nucleotide at a time, rewinding the DNA behind it [1].
3. **Processing.** The new RNA gets a protective cap on its front end and a long tail of A's on its back end. Non-coding stretches (introns) are cut out ("splicing"). The result is mature mRNA [1].
4. **Export.** The mRNA leaves the nucleus through a nuclear pore into the cytoplasm [1].
5. **Translation starts.** The small ribosomal subunit binds the mRNA and scans to the start codon (AUG); the large subunit then joins to make a full ribosome [1][2].
6. **Elongation.** The mRNA is read three letters (one **codon**) at a time. For each codon, a matching **tRNA** arrives carrying one amino acid. The ribosome links that amino acid onto the growing chain, then shifts one codon along. The tRNA moves through three slots in the ribosome (A, P, E sites) and leaves [1][2].
7. **Termination.** A stop codon is reached; a release factor frees the finished chain and the ribosome splits apart [1].
8. **Folding.** The chain folds into its working 3D shape, often helped by chaperone proteins [1].

### Molecules

DNA, RNA polymerase II, mRNA, nuclear pore, ribosome (two subunits, ~25–30 nm), tRNAs, amino acids. PDB-101 has ready-made structure tours for RNA polymerase [3] and the ribosome [2].

### Speeds

- **RNA polymerase II:** ~1–6 kb per minute across studies (≈ 20–100 nucleotides per second); a commonly cited mammalian value is 50–100 nt/s, with pauses pulling some averages much lower [4][5].
- **Ribosome (mammalian):** ~6 amino acids per second in mouse stem cells (5.6 aa/s); eukaryotic range 1–8 aa/s. Bacteria are about three times faster (~20 aa/s) [5][6].
- **Worked example:** a 400-amino-acid protein takes roughly 70 seconds for one ribosome to make. Many ribosomes read one mRNA at once, spaced along it like beads (a "polysome") [1].

### Scale

Starts at nucleus/organelle scale (mRNA leaving the nucleus), lands at molecular scale (ribosome reading codons). It naturally rewards zooming.

### How it reads as motion

**Very well.** It has a clear story with a beginning, a middle and an end, and a visible product (a chain that grows, then folds). The ribosome chugging along a strand is easy to follow at ~6 steps per second, slowed down. The one hard part for a beginner is the code (codon → amino acid). That can stay in a "go deeper" **explanation layer**.

---

## 2. Making ATP in mitochondria (ATP synthase)

**The idea in one line.** Mitochondria pump protons (hydrogen ions) to one side of their inner membrane. The protons flow back through ATP synthase, a real rotary motor, and the spinning drives the making of ATP, the cell's energy currency.

### Steps

1. **Build up a gradient.** Burning food fuels the electron transport chain, a set of protein complexes in the mitochondrial inner membrane. They pump protons out of the inner compartment, so protons pile up on one side, like water behind a dam [1][7].
2. **Protons flow back through F₀.** The membrane part of ATP synthase (**F₀**) contains a ring of small subunits (the **c-ring**). Each proton hops onto a c-subunit, which lets the ring turn one notch; it hops off on the other side [7].
3. **The ring turns an axle.** The c-ring is fixed to a central stalk (the **γ subunit**), which pokes up into the knob above (**F₁**) [7].
4. **The axle squeezes F₁ into making ATP.** F₁ has three catalytic sites arranged around the axle. The off-centre axle forces each site in turn through three shapes: grab ADP + phosphate, press them together into ATP, release ATP [7][8].
5. **Count per turn.** One full turn (360°) makes **3 ATP**, one per 120° step [8][9]. In mammals the c-ring has **8** subunits, so 8 protons pass per turn, about **2.7 protons per ATP** [10].

### Molecules

ATP synthase (F₀ c-ring, γ stalk, F₁ knob of α₃β₃, a stator arm holding F₁ still), protons, ADP, phosphate, ATP. Electron transport chain complexes upstream. Mitochondrial ATP synthases sit in bent pairs along the folds (cristae) of the inner membrane [7].

### Speeds

- **Rotation:** the fastest directly measured rate is for the bacterial enzyme running in reverse (burning ATP) in single-molecule experiments: Vmax ~230 rev/s at 25 °C, ~350 rev/s at 37 °C and ~650 rev/s at 45 °C, for FoF1 from the heat-loving bacterium *Bacillus* PS3 [11][12]. There is no direct measurement in human mitochondria. At >100 ATP per second [13] and 3 ATP per turn, that is more than ~33 rev/s. The honest range for the app is **tens to a few hundred turns per second**.
- **Output:** over 100 ATP per second per enzyme [13].
- **For context:** a mammalian cell uses about 10⁹ ATP per second [14].

### Scale

Molecular, inside an organelle (mitochondrion). It pairs naturally with a zoom from cell → mitochondrion → inner membrane → one enzyme.

### How it reads as motion

**Excellent, the best "wow" of the set.** It is a true rotary motor; the spinning is literally how it works, not an artist's metaphor, and it was filmed directly with attached fluorescent filaments [8][9]. It loops by nature, so it can play forever at a stop. The real rate (tens to hundreds of turns per second) must be shown heavily slowed, and the app should say so. Risk: the upstream electron transport chain is complicated; keep it as "something pumps protons up" and push detail into deeper layers.

---

## 3. Membrane transport

**The idea in one line.** The cell membrane is a wall; proteins in it act as doors and pumps that let specific things in or out.

### Three kinds, very different speeds

| Kind | Example | How it works | Speed |
|---|---|---|---|
| **Channel** (open door) | Potassium channel, aquaporin (water) | A pore that, when open, lets the right ion or water rush through downhill | 10⁶–10⁸ ions/s, typically ~10⁷ [15]; aquaporin-1 ~2 × 10⁹ water molecules/s per pore (each aquaporin has four pores) [16] |
| **Transporter** (revolving door) | Glucose transporter | Binds the molecule, changes shape, releases it on the other side | in between (much slower than channels) [15] |
| **Pump** (powered door) | Sodium-potassium pump | Burns one ATP to push 3 Na⁺ out and 2 K⁺ in, against the gradient | a few hundred cycles/s (~450/s cited for mammalian) [17][18] |

### Steps (sodium-potassium pump, the classic)

1. Pump opens to the inside; 3 sodium ions bind [1][18].
2. ATP hands over a phosphate; the pump flips to face outside and releases the sodium [1][18].
3. 2 potassium ions bind from outside; the phosphate drops off; the pump flips back and releases potassium inside [1][18].

This pump alone can use a large share of a cell's ATP (famously about a third in many animal cells) [1][18].

### Scale

Molecular, at the cell's outer membrane.

### How it reads as motion

**Good but short.** The pump cycle is a clear, loopable, four-beat motion with countable ions. Channels are too fast and featureless to watch (just a blur of things through a hole). Best used as one pump plus a contrasting channel. It is less of a story than protein-making, and its value overlaps with ATP synthase (both are "membrane machine with ions").

---

## 4. Vesicle trafficking (shipping)

**The idea in one line.** The cell packs proteins into small bubbles (vesicles) that bud off one organelle, ride along protein tracks, and fuse with another organelle or the outer membrane.

### Steps (the secretion route)

1. **Proteins made at the rough ER** (ribosomes attached to the endoplasmic reticulum) [1].
2. **Budding.** Coat proteins (COPII for ER → Golgi; clathrin at the outer membrane) bend a patch of membrane into a bud and pinch it off as a vesicle ~50–100 nm across [1]. A clathrin-coated pit lives ~40 s on average before pinching off [19].
3. **Riding the tracks.** Motor proteins carry vesicles along microtubules. **Kinesin** walks with two "feet" in 8 nm steps, one ATP per step, ~100 steps per second (~0.8 µm/s in the test tube, up to ~2 µm/s in cells) [20][21].
4. **Golgi processing.** Proteins are modified and sorted in the stack of Golgi compartments. Moving material from ER to Golgi takes minutes to tens of minutes (measured ~2.8% of cargo per minute) [22].
5. **Docking and fusion.** **SNARE** proteins on the vesicle and target zip together and pull the two membranes into one, releasing the cargo [1].

### Scale

Organelle scale (ER, Golgi, membrane) with a molecular detail (kinesin walking).

### How it reads as motion

**Strong for a beginner.** Bubbles moving between places is instantly readable, and kinesin's "walking" is one of the most charming real molecular motions. It ties organelles together, which helps the "tour of the cell" feel. Cost: many moving parts (coats, motors, tracks, SNAREs, Golgi), and the honest timescale is minutes, so it needs time compression and simplification.

---

## 5. Mitosis (cell division)

**The idea in one line.** The cell copies its chromosomes, lines them up, pulls the copies apart with a spindle of fibres, and splits in two.

### Steps

1. **Prophase.** Already-copied chromosomes condense into the familiar X shapes; the spindle starts forming from two centrosomes [1].
2. **Prometaphase.** The nuclear envelope breaks down; spindle fibres (microtubules) catch chromosomes at their kinetochores [1].
3. **Metaphase.** Chromosomes line up across the middle [1].
4. **Anaphase.** The two copies of each chromosome are pulled to opposite poles, at about 1 µm per minute (range 0.2–5 µm/min) [23][24].
5. **Telophase and cytokinesis.** New nuclear envelopes form; a ring of actin and myosin pinches the cell in two. Anaphase to cytokinesis takes ~10 minutes in HeLa cells [25].

### Speeds

Mitosis takes roughly 20–60 minutes in human cells: 19 ± 3 min in normal human RPE-1 cells and 46 ± 19 min in HeLa cancer cells [26], inside a cell cycle of ~24 hours [1].

### Scale

Whole-cell. It changes the whole scene: the nucleus disappears and the cell becomes two.

### How it reads as motion

**Iconic and readable from far away, but a poor fit for v1.** It is the most recognisable cell motion and the only candidate at whole-cell scale. But it breaks the app's premise: v1 is a single, steady cell that the learner zooms around inside. Mitosis dismantles the nucleus and duplicates the cell, so every other stop would have to cope with a cell mid-division. It also needs the DNA-copying (S phase) story to make sense, and its molecular detail (kinetochores, motor proteins on the spindle) is hard to show well.

---

## Comparison

| Process | Scale | Real tempo | Readable as motion | Story clarity | Build effort | Fits "one steady cell" |
|---|---|---|---|---|---|---|
| Protein-making | nucleus → molecule | seconds–minutes | high | high (start, middle, end, product) | medium–high | yes |
| ATP synthase | molecule (in mitochondrion) | milliseconds (loop) | very high | high (motor makes fuel) | low–medium | yes |
| Membrane transport | molecule (at membrane) | ms (pump), ns (channel) | medium–high | medium | low | yes |
| Vesicle trafficking | organelle | seconds–minutes | high | medium (many parts) | high | yes |
| Mitosis | whole cell | ~1 hour | high | high | high | **no** |

## Recommendation for v1

1. **ATP synthase in a mitochondrion.** The best value for effort. One machine, one looping motion, and the motion *is* the mechanism, so the animation is honest. Clean zoom path: cell → mitochondrion → inner membrane → motor. Real numbers make good "go deeper" content (3 ATP per turn, 8 protons per turn, up to hundreds of turns per second).
2. **Making a protein (transcription → translation).** The central story of molecular biology and the best use of zooming: it starts at the nucleus and ends at a ribosome. Its product links to everything else. If effort must be cut, show translation in full and transcription/export as a shorter lead-in.
3. **Optional third: vesicle trafficking (kinesin carrying a vesicle).** Ties organelles together and kinesin walking is very appealing. It is the costliest of the three, so make it the one to drop if scope is tight. If a cheaper third is wanted, the **sodium-potassium pump** is a small, loopable stand-in, though it partly repeats the ATP synthase "membrane machine" idea.

**Not for v1: mitosis.** It conflicts with a single steady cell to explore, and needs the most story and animation work.

### Things that affect other decisions

- **Time must be slowed, and the app should say so.** Real speeds run from hundreds of turns per second (ATP synthase) to an hour (mitosis). Every process needs a speed control or a visible "slowed down ×N" label so the motion stays honest.
- **Picked processes fix which organelles need detail:** mitochondrion (with folded inner membrane), nucleus with pores, ribosomes/rough ER, and (if the third is chosen) ER, Golgi and microtubules.
- **Molecular-scale models are available.** PDB-101 and the PDB have real structures for ATP synthase, ribosome, RNA polymerase, kinesin and the sodium-potassium pump [2][3][7][18][21], which may inform how 3D assets are sourced.
- **Processes chain together.** ATP synthase makes the fuel that ribosomes, kinesin and pumps spend. That gives a natural thread linking the stops.

---

## Sources

1. Alberts B et al. *Molecular Biology of the Cell*, 4th ed. (NCBI Bookshelf). Ch. 6 "How Cells Read the Genome" (transcription, RNA processing, export, translation); Ch. 11 "Membrane Transport" (channels, pumps, Na⁺/K⁺ pump); Ch. 13 "Intracellular Vesicular Traffic"; Ch. 14 "Energy Conversion: Mitochondria"; Ch. 18 "The Mechanics of Cell Division". https://www.ncbi.nlm.nih.gov/books/NBK21054/
2. PDB-101 Molecule of the Month: Ribosome (#121) and Ribosomal Subunits (#10). https://pdb101.rcsb.org/motm/121 , https://pdb101.rcsb.org/motm/10
3. PDB-101 Molecule of the Month: RNA Polymerase (#40). https://pdb101.rcsb.org/motm/40
4. BioNumbers: comparison of Pol II elongation-rate estimates, 1.1–6 kb/min (BNID 105569). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=105569
5. Milo R, Phillips R. *Cell Biology by the Numbers*, "What is faster, transcription or translation?" (mammalian transcription 50–100 nt/s; mouse ES translation ~6 aa/s; *E. coli* ~20 aa/s). http://book.bionumbers.org/what-is-faster-transcription-or-translation/
6. BioNumbers: rate of ribosome progression in eukaryotic cells, 1–8 aa/s (BNID 107783); from Ingolia NT et al., *Cell* 147:789 (2011), 5.6 aa/s in mouse ES cells. https://bionumbers.hms.harvard.edu/bionumber.aspx?id=107783
7. PDB-101 Molecule of the Month: ATP Synthase (#72) (two rotary motors, 12-chain rotor in the bacterial example, three conformations, bent mitochondrial dimers). https://pdb101.rcsb.org/motm/72
8. Noji H, Yasuda R, Yoshida M, Kinosita K. "Direct observation of the rotation of F1-ATPase." *Nature* 386:299–302 (1997). https://doi.org/10.1038/386299a0
9. Yasuda R et al. "Resolution of distinct rotational substeps by submillisecond kinetic analysis of F1-ATPase." *Nature* 410:898–904 (2001) (120° steps, one ATP per step). https://doi.org/10.1038/35073513
10. Watt IN, Montgomery MG, Runswick MJ, Leslie AGW, Walker JE. "Bioenergetic cost of making an adenosine triphosphate molecule in animal mitochondria." *PNAS* 107:16823–16827 (2010) (bovine c8 ring, 8 H⁺/turn, 2.7 H⁺/ATP). https://pmc.ncbi.nlm.nih.gov/articles/PMC2947889/
11. Ueno H, Suzuki T, Kinosita K Jr, Yoshida M. "ATP-driven stepwise rotation of FoF1-ATP synthase." *PNAS* 102:1333–1338 (2005) (thermophilic *Bacillus* PS3 FoF1 expressed in *E. coli*; Vmax ~350 rps at 37 °C in the abstract; ~230 and ~650 rps at 25 °C and 45 °C in the Discussion). https://pmc.ncbi.nlm.nih.gov/articles/PMC545493/
12. BioNumbers: maximal rotation rate of ATP synthase, ~350 rev/s at 37 °C (BNID 104890); ~230 rev/s at 25 °C (BNID 104894); both from [11]. BioNumbers labels the organism *E. coli*, but that is only the host strain; the enzyme is from *Bacillus* PS3. https://bionumbers.hms.harvard.edu/bionumber.aspx?id=104890
13. BioNumbers: synthesis rate of ATP by F₀F₁ ATP synthase, >100 ATP/s (BNID 111975; from Senior AE, *Cell* 130:220 (2007)). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=111975
14. Milo R, Phillips R. *Cell Biology by the Numbers*, "What is the power consumption of a cell?" (~10⁹ ATP/s per mammalian cell). http://book.bionumbers.org/what-is-the-power-consumption-of-a-cell/
15. Gennis RB. *Biomembranes: Molecular Structure and Function* (Springer, 1989), pp. 273–275, Table 8.3 ("An ion channel in its open configuration typically can allow the passage of 10^6-10^8 ions/sec"; lactose permease only ~30/s), via BioNumbers BNID 103163. https://bionumbers.hms.harvard.edu/bionumber.aspx?id=103163 ; Milo R, Phillips R. *Cell Biology by the Numbers*, "How many ions pass through an ion channel per second?" (~1 pA ≈ 10⁷ ions/s). http://book.bionumbers.org/how-many-ions-pass-through-an-ion-channel-per-second/
16. Agre P et al. "Aquaporin water channels: from atomic structure to clinical medicine." *J Physiol* 542:3–16 (2002) (unit permeability "∼2 × 10⁹ water molecules per subunit per second", from Zeidel et al. 1992, 1994). https://pmc.ncbi.nlm.nih.gov/articles/PMC2290382/ . BioNumbers BNID 100479 gives an older textbook figure of 5 × 10⁸/s (Lehninger, 3rd ed.).
17. BioNumbers: rate of transport of Na⁺/K⁺ ATPase, ~450/s (BNID 103161). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=103161
18. PDB-101 Molecule of the Month: Sodium-Potassium Pump (#118). https://pdb101.rcsb.org/motm/118
19. BioNumbers: clathrin-coated pit mean lifetime ~40 s in BSC-1 cells (BNID 112147; BNID 112142). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=112147
20. Milo R, Phillips R. *Cell Biology by the Numbers*, "How fast do molecular motors move on cytoskeletal filaments?" (kinesin 8 nm steps, 1 ATP/step, ~800 nm/s in vitro, ~2000 nm/s in vivo). http://book.bionumbers.org/how-fast-do-molecular-motors-move-on-cytoskeletal-filaments/
21. PDB-101 Molecule of the Month: Kinesin (#64). https://pdb101.rcsb.org/motm/64
22. Hirschberg K et al. "Kinetic analysis of secretory protein traffic and characterization of Golgi to plasma membrane transport intermediates in living cells." *J Cell Biol* 143:1485 (1998) (ER→Golgi rate constant ~2.8%/min for VSVG-GFP). https://pmc.ncbi.nlm.nih.gov/articles/PMC2132993/
23. Betterton MD, McIntosh JR. "Regulation of chromosome speeds in mitosis." *Cell Mol Bioeng* 6:418–430 (2013) ("Chromosome motion in anaphase is usually at ~1 µm/min (~16 nm/sec), though some cells beat this by as much as a factor of 5"). https://pmc.ncbi.nlm.nih.gov/articles/PMC4578309/
24. Maiato H, Lince-Faria M. "The perpetual movements of anaphase." *Cell Mol Life Sci* 67:2251–2269 (2010) (anaphase speed "varies from 0.2 to 5 μm/min"). https://pmc.ncbi.nlm.nih.gov/articles/PMC11115923/
25. BioNumbers: time from anaphase initiation to cytokinesis, ~10 ± 2 min in HeLa (BNID 102581). https://bionumbers.hms.harvard.edu/bionumber.aspx?id=102581
26. Yang Z, Lončarek J, Khodjakov A, Rieder CL. "Extra centrosomes and/or chromosomes prolong mitosis in human cells." *Nat Cell Biol* 10:748–751 (2008) (HeLa 46 ± 19 min, n = 200; RPE-1 19 ± 3 min). https://pmc.ncbi.nlm.nih.gov/articles/PMC2430725/ . Cross-checks: BioNumbers BNID 109226 (HeLa M phase ~50 min; Hahn AT et al., *Cell Cycle* 8:1044 (2009)); BNID 112373 ("Mitosis typically is completed in 30-60 min").

### Caveats on sourcing

- NCBI Bookshelf pages blocked automated fetches during this research, so Alberts [1] is cited at chapter level from the standard textbook account rather than quoted line by line. Every numeric claim instead rests on BioNumbers, *Cell Biology by the Numbers*, or a primary paper.
- The figures from [11], [15], [16], [23], [24] and [26], first taken from search summaries, were confirmed against the sources now listed for them (issue #13). That check corrected the ATP synthase rotation range: the earlier "100–650 rps in biology" came from a secondary 2025 paper, and its 650 rps is a bacterial enzyme at 45 °C running in reverse, not a human rate.
- The "~⅓ of ATP spent on the Na⁺/K⁺ pump" figure is the textbook claim [1]; the true share varies widely by cell type.
