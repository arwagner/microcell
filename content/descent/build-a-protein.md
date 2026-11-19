---
id: build-a-protein
kind: descent
name: How your cell builds a protein
# The beats run cell → nucleus → DNA → pore → rough ER → ribosome. DNA and the nuclear pore have no
# content files of their own: the DNA beat focuses on the transcription site, where a gene is read,
# and the pore beat focuses back on the nucleus at the Organelle stop, where the making-a-protein
# process also plays the mRNA's exit.
beats:
  - focus: cell
    narration: >-
      This is your cell. Right now it is building proteins, following its own built-in
      instructions [proc]. Let's follow one protein from start to finish.
  - focus: nucleus
    narration: >-
      This is the nucleus. It holds your DNA, your cell's instruction book [inv].
  - focus: transcription-site
    narration: >-
      Here, a machine called RNA polymerase II reads one gene, a stretch of DNA with the instructions
      for a protein [proc]. It copies the gene into messenger RNA (mRNA), a working copy that can leave
      the nucleus [proc].
  - focus: nucleus
    narration: >-
      The finished mRNA heads for the nucleus's wall. It slips out through a nuclear pore, one of the
      gates that control what enters and leaves the nucleus [proc][inv].
  - focus: rough-er
    narration: >-
      Out in the cell, the mRNA meets ribosomes, the machines that build proteins [proc]. Some of
      them stud the rough ER (endoplasmic reticulum), a network of flat sacs, and the proteins they
      make there end up in a membrane or are sent out of the cell [inv].
  - focus: ribosome
    narration: >-
      A ribosome reads the mRNA three letters at a time and adds one amino acid, a protein building
      block, for each [proc]. The chain grows, then folds into a working protein [proc]. Next, want to
      see how your mitochondria, the cell's power plants, make ATP, your cell's energy currency [inv]?
offer: atp-synthesis
sources:
  - key: proc
    file: research/processes.md
    section: "1. Making a protein: transcription, then translation"
  - key: inv
    file: research/cell-inventory.md
    section: Organelle inventory
---
