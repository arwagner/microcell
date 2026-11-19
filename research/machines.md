# The three machines: sizes and named parts

Research for the content of the three machines (RNA polymerase II, the 80S ribosome, ATP synthase) and their parts. Vocabulary follows [GLOSSARY.md](../GLOSSARY.md). Checked 2026-11-19. `[Mn]` points to the sources at the bottom.

## ATP synthase size, measured in the human structure

The other notes disagree: `research/processes.md` gives ATP synthase as "~25 nm tall", and `research/cell-inventory.md` gives "~20 nm tall, ~10 nm wide" for the bacterial enzyme. Neither is a measurement of the mammalian enzyme, and the papers that might state one (Rubinstein 2003, Davies 2011) could not be read in full here. The bovine cryo-EM paper [M2] was read in full and states no overall dimension.

So the figure was measured directly in the deposited atomic model of the human enzyme, PDB 8H9S ("Human ATP synthase state 1 (combined)", cryo-EM, 2.53 Å) [M1]. 8H9S is one complete monomer: 28 protein chains, including α₃β₃ (the F₁ head), γ, δ, ε, a c₈ ring, the peripheral stalk subunits b, d, F6 and OSCP, and the membrane subunits. Method: take the line from the centre of the c-ring atoms to the centre of the α₃β₃ atoms as the rotor axis, then take the spread of every protein atom along it (height) and the largest distance of any atom from it.

| Measured in 8H9S [M1] | Ångström | Rounded for the app |
|---|---|---|
| Whole enzyme, bottom of the c-ring to the top of the peripheral stalk, along the rotor axis | 233 | **about 23 nm tall** |
| F₁ head (α₃β₃), height along the axis | 104 | about 10 nm tall |
| F₁ head, farthest atom from the axis | 64 | about 13 nm across |
| c-ring, height along the axis | 67 | about 7 nm tall |
| c-ring, farthest atom from the axis | 27 | about 5 nm across |
| Central stalk (γ), length along the axis | 116 | about 12 nm long |
| Peripheral stalk (b, d, F6, OSCP), length along the axis | 213 | about 21 nm long |

The peripheral stalk is the tallest part: it runs from the membrane region (its bottom is 22 Å below the centre of the c-ring) to above the top of the F₁ head (191 Å, against 174 Å for the head). The mammalian figure, about 23 nm, sits between the two earlier figures. It is one monomer; in the membrane, mitochondrial ATP synthases sit in bent pairs (`research/processes.md`, [7]).

**ATP synthases per mitochondrion: still unconfirmed.** Nothing new was found. `research/cell-inventory.md` (ATP synthase row, [S43], [S44]) remains the best reading, "thousands", with no human measurement; the content leaves the count out.

## ATP synthase parts

- **c-ring.** A ring of c subunits in the membrane part (F₀). Each proton that crosses the membrane rides one c subunit and turns the ring one notch (`research/processes.md` step 2, [7]). In mammals the ring has 8 c subunits, so 8 protons pass per turn [10]; 8H9S has 8 c chains [M1].
- **Central stalk.** The γ subunit, fixed to the c-ring, pokes up into the F₁ head like an off-centre axle (`research/processes.md` step 3, [7]). In 8H9S the central stalk is γ with δ and ε [M1].
- **F₁ head.** α₃β₃: three catalytic sites around the axle; turning the axle pushes each site in turn through grab ADP + phosphate, press into ATP, release ATP. One full turn makes 3 ATP (`research/processes.md` step 4–5, [7][8][9]).
- **Peripheral stalk.** "The F₁ and F_O regions are linked by a peripheral stalk composed of subunits OSCP, d, F6, and the hydrophilic portion of subunit b" [M2]. It holds the head still while the rotor turns inside it; `research/processes.md` calls it "a stator arm holding F₁ still" [7].

## RNA polymerase II parts

- **The structure in the manifest, 5FLM, is the cow (*Bos taurus*) enzyme,** which "is identical to the human enzyme except for seven amino-acid residues" [M3]. Its 12 protein chains are the 12 Pol II subunits (RPB1 to RPB12), on a scaffold of DNA and RNA [M3][M6].
- **Clamp.** A mobile part that swings over the active site [M4]. It is open when the enzyme is free and closes over the DNA and RNA during transcription [M5] (both shown in the yeast enzyme); it shifts again ("induced fit") when nucleic acids bind in the mammalian enzyme [M3].
- **Active site (active centre).** Where RNA is built. It holds two metal ions [M4]. DNA enters the main cleft and unwinds before the active site; nine base pairs of DNA-RNA hybrid extend from it, with the growing end of the RNA in the nucleotide addition site [M5]. [M4] and [M5] are structures of the yeast enzyme. PDB-101 describes the same thing as "a small transcription bubble, composed of two DNA strands and an RNA strand, ... bound in the active site" [M7].
- **Jaw.** DNA downstream of the transcription bubble (the stretch still to be read) contacts the jaw domain of subunit RPB5, "an interaction that is apparently already established during transcription initiation" [M3].

## Ribosome parts

- **Small subunit.** "In charge of information flow during protein synthesis": it holds the mRNA and makes sure each codon is paired with the right tRNA [M8]. In translation it binds the mRNA first and scans to the start codon (`research/processes.md` step 5).
- **Large subunit.** "Contains the active site of the ribosome", the site that makes the new peptide bonds [M8]. It joins the small subunit at the start codon (`research/processes.md` step 5).
- **Both subunits are mostly long strands of RNA,** with dozens of proteins bound on the surface [M8].
- The structure in the manifest, 4V6X, is the human 80S ribosome [M9] (`research/3d-assets.md`, RCSB PDB).

## Sources

- **[M1]** RCSB PDB entry 8H9S, "Human ATP synthase state 1 (combined)", electron microscopy, 2.53 Å; coordinates from https://files.rcsb.org/download/8H9S.cif , entry metadata from https://data.rcsb.org/rest/v1/core/entry/8H9S . Paper: Lai Y et al. "Structure of the human ATP synthase." *Mol Cell* 83:2137–2147 (2023), doi:10.1016/j.molcel.2023.04.029. Measurements above made 2026-11-19 from the coordinates by the method described.
- **[M2]** Zhou A, Rohou A, Schep DG, Bason JV, Montgomery MG, Walker JE, Grigorieff N, Rubinstein JL. "Structure and conformational states of the bovine mitochondrial ATP synthase by cryo-EM." *eLife* 4:e10180 (2015). https://elifesciences.org/articles/10180 (full text read via Europe PMC, PMC4718723).
- **[M3]** Bernecky C, Herzog F, Baumeister W, Plitzko JM, Cramer P. "Structure of transcribing mammalian RNA polymerase II." *Nature* 529:551–554 (2016), doi:10.1038/nature16482 (abstract).
- **[M4]** Cramer P, Bushnell DA, Kornberg RD. "Structural basis of transcription: RNA polymerase II at 2.8 Å resolution." *Science* 292:1863–1876 (2001), doi:10.1126/science.1059493 (abstract; yeast enzyme).
- **[M5]** Gnatt AL, Cramer P, Fu J, Bushnell DA, Kornberg RD. "Structural basis of transcription: an RNA polymerase II elongation complex at 3.3 Å resolution." *Science* 292:1876–1882 (2001), doi:10.1126/science.1059495 (abstract; yeast enzyme).
- **[M6]** RCSB PDB entry 5FLM, polymer entities 1–15 (12 *Bos taurus* Pol II subunits plus DNA and RNA scaffold strands). https://data.rcsb.org/rest/v1/core/polymer_entity/5FLM/1
- **[M7]** PDB-101 Molecule of the Month: RNA Polymerase (#40). https://pdb101.rcsb.org/motm/40
- **[M8]** PDB-101 Molecule of the Month: Ribosome (#10). https://pdb101.rcsb.org/motm/10
- **[M9]** Anger AM et al. "Structures of the human and Drosophila 80S ribosome." *Nature* 497:80–85 (2013), doi:10.1038/nature12104.
