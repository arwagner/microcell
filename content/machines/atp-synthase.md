---
id: atp-synthase
kind: machine
name: ATP synthase
stop: Molecule
parent: crista
size_nm: { value: 23, source: size }
pdb: { id: 8H9S, source: pdb }
sources:
  - key: proc
    file: research/processes.md
    section: 2. Making ATP in mitochondria (ATP synthase)
  - key: size
    file: research/machines.md
    section: ATP synthase size, measured in the human structure
  - key: pdb
    file: research/3d-assets.md
    section: RCSB PDB (structures)
---

## Label
ATP synthase, a spinning motor that makes ATP

## Paragraph
This is ATP synthase, a real rotary motor. Protons flowing back across the membrane turn its rotor, and the spinning drives its head to make ATP, your cell's energy currency [proc]. Each full turn makes 3 ATP [proc]. The human enzyme is about 23 nm tall [size].

## Go deeper
In mammals like you, the ring in its rotor has 8 pieces, so 8 protons pass through for each turn [proc]. Nobody has measured its speed in human mitochondria [proc]. It makes more than 100 ATP per second, so it likely turns tens to a few hundred times a second [proc].

The model you see is the human enzyme, from PDB entry 8H9S [pdb].
