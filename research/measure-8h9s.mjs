// Reproduces the ATP synthase measurements in research/machines.md from the deposited human
// structure. Usage: download https://files.rcsb.org/download/8H9S.cif, then
//   node research/measure-8h9s.mjs path/to/8H9S.cif
// Rotor axis: from the centre of the c-ring atoms to the centre of the α₃β₃ atoms. Heights are the
// spread of protein atoms along that axis; "rmax" is the farthest atom from it. Units: ångström.
import { readFileSync } from "node:fs";

const lines = readFileSync(process.argv[2], "utf8").split("\n");
const cols = [];
let i = lines.findIndex((l) => l.startsWith("_atom_site."));
while (lines[i].startsWith("_atom_site.")) cols.push(lines[i++].trim().slice("_atom_site.".length));
const col = (name) => cols.indexOf(name);

const atoms = [];
for (; i < lines.length && !lines[i].startsWith("#"); i++) {
	const f = lines[i].trim().split(/\s+/);
	if (f[col("group_PDB")] !== "ATOM") continue; // protein atoms only, no ligands or lipids
	atoms.push({ entity: +f[col("label_entity_id")], p: [+f[col("Cartn_x")], +f[col("Cartn_y")], +f[col("Cartn_z")]] });
}

// Entity numbers as listed in the 8H9S file's _entity table.
const E = { b: 1, f6: 2, d: 3, alpha: 4, beta: 5, gamma: 6, oscp: 8, c: 9 };
const pick = (...es) => atoms.filter((a) => es.includes(a.entity)).map((a) => a.p);
const centre = (ps) => ps.reduce((s, p) => s.map((v, k) => v + p[k] / ps.length), [0, 0, 0]);

const origin = centre(pick(E.c));
const head = centre(pick(E.alpha, E.beta));
const len = Math.hypot(...head.map((v, k) => v - origin[k]));
const axis = head.map((v, k) => (v - origin[k]) / len);
const along = (p) => p.reduce((s, v, k) => s + (v - origin[k]) * axis[k], 0);
const radial = (p) => Math.hypot(...p.map((v, k) => v - origin[k] - along(p) * axis[k]));

function report(name, ps) {
	const t = ps.map(along);
	const lo = Math.min(...t);
	const hi = Math.max(...t);
	const rmax = Math.max(...ps.map(radial));
	console.log(`${name}: from ${lo.toFixed(0)} to ${hi.toFixed(0)}, height ${(hi - lo).toFixed(0)}, rmax ${rmax.toFixed(0)}`);
}

report("whole enzyme", atoms.map((a) => a.p));
report("F1 head (alpha3 beta3)", pick(E.alpha, E.beta));
report("c-ring", pick(E.c));
report("central stalk (gamma)", pick(E.gamma));
report("peripheral stalk (b, d, F6, OSCP)", pick(E.b, E.d, E.f6, E.oscp));
