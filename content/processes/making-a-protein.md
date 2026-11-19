---
id: making-a-protein
kind: process
name: Making a protein
steps:
  - { stop: Machinery, machine: rna-polymerase-ii }
  # The nuclear pore has no content file of its own. This step plays at the Organelle stop, inside
  # the nucleus, which is the organelle RNA polymerase II's site sits in.
  - { stop: Organelle, machine: rna-polymerase-ii }
  - { stop: Machinery, machine: ribosome }
  - { stop: Molecule, machine: ribosome }
  - { stop: Molecule, machine: ribosome }
  - { stop: Molecule, machine: ribosome }
  - { stop: Molecule, machine: ribosome }
# Translation's rate, since translation is the part shown in full: 5.6 amino acids per second,
# measured in mouse stem cells, inside the eukaryotic range of 1 to 8.
real_rate: { value: 5.6, unit: amino acids/s, source: proc }
# A design choice, not a fact: one amino acid every two seconds, slow enough to watch each tRNA.
shown_rate: { value: 0.5, unit: amino acids/s }
sources:
  - key: proc
    file: research/processes.md
    section: "1. Making a protein: transcription, then translation"
  - key: inv
    file: research/cell-inventory.md
    section: Organelle inventory
---

## Label
A gene copied, then built into a protein

## Paragraph
In the nucleus, your cell copies one gene from DNA into messenger RNA (mRNA), a working copy. The mRNA leaves through a nuclear pore, a gateway in the nucleus's wall. Out on the rough ER, a ribosome reads it and strings amino acids, protein building blocks, into a protein [proc][inv].

## Go deeper
Measured in mouse stem cells, a ribosome adds about 6 amino acids per second (5.6) [proc]. At that pace, one ribosome takes roughly 70 seconds to make a protein 400 amino acids long [proc]. Many ribosomes read the same mRNA at once, spaced along it like beads [proc].

For the copying step, RNA polymerase II adds roughly 20 to 100 RNA letters (nucleotides) per second [proc]. What you see is slowed down.

## Steps
1. At the transcription site, RNA polymerase II copies a gene from DNA into RNA [proc]. The RNA gets a protective cap and tail and loses the stretches that don't code for protein, which makes it finished mRNA [proc].
2. The mRNA leaves the nucleus through a nuclear pore, out into the rest of the cell [proc].
3. On the surface of the rough ER, the mRNA meets ribosomes; the ones here make proteins bound for a membrane or for outside the cell [inv].
4. A ribosome comes in two pieces, called subunits: the small one grabs the mRNA and slides to the start signal, then the large one joins it [proc].
5. The ribosome reads the mRNA one codon (three letters) at a time; for each codon, a tRNA, a small adapter molecule, brings one amino acid, which the ribosome adds to the growing chain [proc].
6. At a stop codon, the finished chain is let go and the ribosome splits apart [proc].
7. The chain folds into its working shape, often helped by other proteins called chaperones [proc].
