---
id: ribosome
kind: machine
name: Ribosome
stop: Molecule
parent: rough-er-surface
size_nm: { value: 30, source: mol }
pdb: { id: 4V6X, source: pdb }
sources:
  - key: mol
    file: research/cell-inventory.md
    section: "Scale 3: macromolecules and molecular machines"
  - key: proc
    file: research/processes.md
    section: "1. Making a protein: transcription, then translation"
  - key: parts
    file: research/machines.md
    section: Ribosome parts
  - key: pdb
    file: research/3d-assets.md
    section: RCSB PDB (structures)
---

## Label
A ribosome, your cell's protein builder

## Paragraph
This is a ribosome, the machine that builds proteins. It reads an mRNA, a gene's working copy, three letters at a time; for each three-letter word, called a codon, it adds one amino acid (a protein building block) to a growing chain [proc]. It is about 30 nm across, in two parts: a small and a large subunit [mol].

## Go deeper
Each amino acid arrives on a tRNA, a small adapter molecule that matches one codon [proc]. A HeLa cell holds roughly 3 million to 9.5 million ribosomes [mol].

The model you see is the human ribosome, from entry 4V6X of the Protein Data Bank (PDB), a free public archive of molecule structures [pdb][parts].
