// The typed shape of one content file. Field names are camelCase here; the frontmatter uses
// snake_case (`size_nm`, `coming_later`, `real_rate`), and error messages name the frontmatter field.

export const STOPS = ["Cell", "Organelle", "Machinery", "Molecule"] as const;
export type Stop = (typeof STOPS)[number];

export const KINDS = [
	"cell",
	"organelle",
	"site",
	"machine",
	"part",
	"process",
	"cytoplasm",
	"descent",
	"page",
	"comparisons",
] as const;
export type Kind = (typeof KINDS)[number];

// Kinds that are things the learner can point at, so they need all three explanation layers
// (`## Label`, `## Paragraph`, `## Go deeper`). The rest are exempt: a guided descent speaks through
// its beats, a page is free reading, and the comparisons list labels each item by name.
export const LAYERED_KINDS = ["cell", "organelle", "site", "machine", "part", "process", "cytoplasm"] as const;
export type LayeredKind = (typeof LAYERED_KINDS)[number];
export type UnlayeredKind = Exclude<Kind, LayeredKind>;

// Kinds that sit in the place tree (cell → organelle → site → machine → part) and so carry a stop
// and a parent. A process spans stops (each step names its own), so it is not placed in the tree.
export const PLACED_KINDS = ["cell", "organelle", "site", "machine", "part", "cytoplasm"] as const;
export type PlacedKind = (typeof PLACED_KINDS)[number];

/** A citation the body and the sourced fields refer to by `key`. */
export type Source = { key: string; file: string; section: string } | { key: string; url: string };

/** A real measurement in nanometres, with the key of the source it came from. */
export interface SourcedValue {
	value: number;
	source: string;
}

export interface SourcedRange {
	min: number;
	max: number;
	source: string;
}

export interface Rate {
	value: number;
	unit: string;
	/** Required on real rates. A shown rate is a design choice, so its source is optional. */
	source?: string;
}

export type SourcedRate = Rate & { source: string };

export interface Layers {
	label: string;
	paragraph: string;
	goDeeper: string;
}

interface Common {
	/** Path of the content file, as given to the parser. */
	file: string;
	id: string;
	kind: Kind;
	name: string;
	sources: Source[];
	/** Every `## Heading` section in the body, by heading text, including the layer sections. */
	sections: Record<string, string>;
}

interface Placed extends Common {
	stop: Stop;
	colour?: string;
	layers: Layers;
}

export interface CellRecord extends Placed {
	kind: "cell";
	/** The cell is the root of the tree. */
	parent?: undefined;
	sizeNm: SourcedValue;
}

export interface OrganelleRecord extends Placed {
	kind: "organelle";
	parent: string;
	colour: string;
	sizeNm: SourcedValue;
	count: SourcedRange;
	diveable: boolean;
	/** Present whenever `diveable` is false: what the learner will find here in a later version. */
	comingLater?: string;
}

export interface SiteRecord extends Placed {
	kind: "site";
	parent: string;
	machine: string;
	/** May be absent while processes are still being written; the content inventory requires it. */
	process?: string;
}

export interface MachineRecord extends Placed {
	kind: "machine";
	parent: string;
	pdb: { id: string; source: string };
}

export interface PartRecord extends Placed {
	kind: "part";
	parent: string;
}

export interface CytoplasmRecord extends Placed {
	kind: "cytoplasm";
	parent: string;
}

export interface ProcessStep {
	stop: Stop;
	machine: string;
}

export interface ProcessRecord extends Common {
	kind: "process";
	layers: Layers;
	steps: ProcessStep[];
	realRate: SourcedRate;
	shownRate: Rate;
}

export interface DescentBeat {
	focus: string;
	narration: string;
}

export interface DescentRecord extends Common {
	kind: "descent";
	beats: DescentBeat[];
}

export interface PageRecord extends Common {
	kind: "page";
	/** The whole Markdown body. */
	body: string;
}

export interface Comparison {
	id: string;
	name: string;
	sizeNm: SourcedValue;
}

export interface ComparisonsRecord extends Common {
	kind: "comparisons";
	items: Comparison[];
}

export type ContentRecord =
	| CellRecord
	| OrganelleRecord
	| SiteRecord
	| MachineRecord
	| PartRecord
	| CytoplasmRecord
	| ProcessRecord
	| DescentRecord
	| PageRecord
	| ComparisonsRecord;
