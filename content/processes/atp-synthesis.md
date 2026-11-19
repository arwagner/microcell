---
id: atp-synthesis
kind: process
name: Making ATP
steps:
  - { stop: Machinery, machine: atp-synthase }
  - { stop: Molecule, machine: atp-synthase }
  - { stop: Molecule, machine: atp-synthase }
  - { stop: Molecule, machine: atp-synthase }
  - { stop: Molecule, machine: atp-synthase }
# Nobody has measured the turning rate in human mitochondria; research gives "tens to a few hundred
# turns per second". A rate holds one number, so this is the floor research derives (over 100 ATP/s
# at 3 ATP per turn is more than about 33 turns/s), which makes slowed ×N a lower bound.
real_rate: { value: 33, unit: turns/s, source: proc }
# A design choice, not a fact: one turn every two seconds, slow enough to follow each one-third step.
shown_rate: { value: 0.5, unit: turns/s }
sources:
  - key: proc
    file: research/processes.md
    section: 2. Making ATP in mitochondria (ATP synthase)
---

## Label
Flowing protons spin a motor that makes ATP

## Paragraph
Your mitochondria pile up protons (hydrogen ions) on one side of their inner membrane, like water behind a dam. The protons flow back through ATP synthase and turn it like a water wheel. Each full turn makes 3 ATP, the small molecule your cell spends as energy [proc].

## Go deeper
In mammals like you, the rotor's ring has 8 pieces, so 8 protons pass for each turn: about 2.7 protons for every ATP [proc].

Nobody has timed this motor inside a human cell. Studies of the enzyme find it makes more than 100 ATP per second, so it turns more than about 33 times a second; the honest range is tens to a few hundred turns per second [proc]. What you see is slowed down a lot.

## Steps
1. Protein complexes in the inner membrane use energy from your food to pump protons to one side, so they pile up there [proc].
2. A proton hops onto the c-ring, the rotor's ring in the membrane, which turns it one notch; the proton hops off on the far side [proc].
3. The c-ring is fixed to the central stalk, an off-center axle, so the axle turns with it [proc].
4. The turning axle squeezes each of the F1 head's three working spots in turn: grab ADP and phosphate, press them into ATP, let the ATP go [proc].
5. Each one-third turn makes one ATP, so one full turn makes 3 ATP [proc].
