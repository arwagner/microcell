import { ContentError, parseContent } from "./parse";
import {
	type ContentRecord,
	type Kind,
	PLACED_KINDS,
	type PlacedKind,
	type ProcessRecord,
	type Rate,
	type Source,
} from "./types";

/** Every content record, checked as a whole, with a lookup by id. */
export interface ContentSet {
	records: readonly ContentRecord[];
	byId: ReadonlyMap<string, ContentRecord>;
}

/** One content file as the bundler or a test hands it over: its path and its text. */
export interface ContentFile {
	path: string;
	text: string;
}

// The place tree runs cell → organelle → site → machine → part. The cytoplasm filler hangs off the cell.
const PARENT_KIND: Record<Exclude<PlacedKind, "cell">, Kind> = {
	organelle: "cell",
	site: "organelle",
	machine: "site",
	part: "machine",
	cytoplasm: "cell",
};

// The one exception to the tree: the nucleolus sits inside the nucleus, so its parent is an organelle.
const NESTED_ORGANELLES: Readonly<Record<string, string>> = { nucleolus: "nucleus" };

const PLACED: ReadonlySet<Kind> = new Set<Kind>(PLACED_KINDS);

/** Parses every file, then validates the set. Throws a ContentError naming the file and field. */
export function loadContent(files: readonly ContentFile[]): ContentSet {
	return validateContent(files.map((f) => parseContent(f.path, f.text)));
}

/**
 * Checks what no single file can check on its own, and throws a ContentError naming the file and
 * field at the first problem:
 * - ids are unique across all files;
 * - every `parent` exists and is the right kind for the tree (see PARENT_KIND, NESTED_ORGANELLES);
 * - a site's `process`/`machine`, a process step's `machine` and a descent beat's `focus` exist and
 *   are the right kind;
 * - no two organelles share a `colour`;
 * - a process's `real_rate` and `shown_rate` units can be compared (see slowedFactor);
 * - every number in the prose is cited (see checkCitations).
 */
export function validateContent(records: readonly ContentRecord[]): ContentSet {
	const byId = new Map<string, ContentRecord>();
	for (const r of records) {
		const first = byId.get(r.id);
		if (first) throw new ContentError(r.file, "id", `"${r.id}" is already used by ${first.file}`);
		byId.set(r.id, r);
	}

	const ref = (r: ContentRecord, field: string, id: string, want: (k: Kind) => boolean, wantName: string) => {
		const referenced = byId.get(id);
		if (!referenced) throw new ContentError(r.file, field, `"${id}" names no content file`);
		if (!want(referenced.kind)) {
			throw new ContentError(
				r.file,
				field,
				`"${id}" is ${article(referenced.kind)} ${referenced.kind}, but this must name ${wantName}`,
			);
		}
	};

	const colours = new Map<string, ContentRecord>();
	for (const r of records) {
		switch (r.kind) {
			case "cell":
				break;
			case "organelle": {
				const nestedIn = NESTED_ORGANELLES[r.id];
				if (nestedIn !== undefined && r.parent !== nestedIn) {
					throw new ContentError(r.file, "parent", `the ${r.id}'s parent must be "${nestedIn}"`);
				}
				const parentKind = nestedIn !== undefined ? "organelle" : PARENT_KIND.organelle;
				ref(r, "parent", r.parent, (k) => k === parentKind, parentKind === "cell" ? "the cell" : "an organelle");
				const other = colours.get(r.colour);
				if (other) throw new ContentError(r.file, "colour", `${r.colour} is already used by ${other.file}`);
				colours.set(r.colour, r);
				break;
			}
			case "site":
				ref(r, "parent", r.parent, (k) => k === PARENT_KIND.site, "an organelle");
				ref(r, "machine", r.machine, (k) => k === "machine", "a machine");
				if (r.process !== undefined) ref(r, "process", r.process, (k) => k === "process", "a process");
				break;
			case "machine":
				ref(r, "parent", r.parent, (k) => k === PARENT_KIND.machine, "a site");
				break;
			case "part":
				ref(r, "parent", r.parent, (k) => k === PARENT_KIND.part, "a machine");
				break;
			case "cytoplasm":
				ref(r, "parent", r.parent, (k) => k === PARENT_KIND.cytoplasm, "the cell");
				break;
			case "process":
				slowedFactor(r);
				r.steps.forEach((s, i) => {
					ref(r, `steps[${i}].machine`, s.machine, (k) => k === "machine", "a machine");
				});
				break;
			case "descent":
				r.beats.forEach((b, i) => {
					ref(r, `beats[${i}].focus`, b.focus, (k) => PLACED.has(k), "something in the cell");
				});
				break;
			case "page":
			case "comparisons":
				break;
		}
		checkCitations(r);
	}
	return { records, byId };
}

// A citation marker is a source key in square brackets, such as `[inv]`, not followed by `(` (which
// would make it a Markdown link). Several may follow one another: `[inv][proc]`.
const MARKER = /\[([A-Za-z0-9][\w-]*)\](?!\()/g;
// A number is a run of digits that is not part of a name. Names start with a letter (F1, CO2), are a
// sedimentation label (80S ribosome, 18S rRNA) or are 2D/3D. Anything else with a digit in it (5.6, 100nm,
// 10-fold, 37C, 10K, 2X) is a number: a looser rule such as "digits plus any capital" lets those through uncited.
const TOKEN = /[\p{L}\p{N}]+/gu;
const NAME = /^(?:\p{L}[\p{L}\p{N}]*|\d+S|[23]D)$/u;
// Ordered-list numbers, bullets and heading marks are layout, not facts.
const LINE_LAYOUT = /^\s*(?:[-*+]|\d+[.)]|#+)\s+/;

function hasNumber(sentence: string): boolean {
	const text = sentence.replace(MARKER, " ");
	for (const [token] of text.matchAll(TOKEN)) {
		if (/\d/.test(token) && !NAME.test(token)) return true;
	}
	return false;
}

// A sentence ends at . ! or ? (plus closing quotes and citation markers) and a space, except after a
// lowercase abbreviation, so "about 5 nm, e.g. in yeast [inv]." stays one cited sentence.
const SENTENCE_END = /(?<=[.!?]["”')]*(?:\[[\w-]+\])*)(?<!\b(?:e\.g|i\.e|approx|ca|cf|vs)\.)\s+/;

/** Splits prose into sentences. Citation markers right after a full stop belong to the sentence before. */
export function sentences(prose: string): string[] {
	const paragraphs: string[] = [];
	let current: string[] = [];
	const flush = () => {
		if (current.length) paragraphs.push(current.join(" "));
		current = [];
	};
	for (const line of prose.split(/\r?\n/)) {
		if (line.trim() === "") {
			flush();
			continue;
		}
		if (LINE_LAYOUT.test(line)) flush();
		current.push(line.replace(LINE_LAYOUT, "").trim());
	}
	flush();
	return paragraphs
		.map((p) => p.replace(/\]\([^)]*\)/g, "]")) // drop link targets: a URL's digits are not facts
		.flatMap((p) => p.split(SENTENCE_END))
		.map((s) => s.trim())
		.filter((s) => s !== "");
}

/**
 * The citation rule: in every piece of prose the learner reads (each body section, a page's body, a
 * descent beat's narration, an organelle's `coming_later` note), every sentence that contains a number
 * must carry at least one citation marker such as `[inv]`, and every marker anywhere must match a
 * `key` in that file's `sources`. What counts as a number is defined by TOKEN and NAME above.
 */
export function checkCitations(r: ContentRecord): void {
	const keys = new Set(r.sources.map((s: Source) => s.key));
	for (const [field, prose] of proseOf(r)) {
		for (const sentence of sentences(prose)) {
			const cited = [...sentence.matchAll(MARKER)].map((m) => m[1] as string);
			for (const key of cited) {
				if (!keys.has(key)) throw new ContentError(r.file, field, `citation [${key}] is not a key in sources`);
			}
			if (cited.length === 0 && hasNumber(sentence)) {
				throw new ContentError(r.file, field, `"${sentence}" has a number but no citation like [key]`);
			}
		}
	}
}

function proseOf(r: ContentRecord): [field: string, prose: string][] {
	const out: [string, string][] = Object.entries(r.sections).map(([h, text]) => [`## ${h}`, text]);
	if (r.kind === "page") {
		// A page's body is also split into sections; check text outside any section once, as the body.
		const outside = r.body.split(/^##\s/m)[0] ?? "";
		out.push(["body", outside]);
	}
	if (r.kind === "descent") {
		for (const [i, b] of r.beats.entries()) out.push([`beats[${i}].narration`, b.narration]);
	}
	if (r.kind === "organelle" && r.comingLater !== undefined) out.push(["coming_later", r.comingLater]);
	return out;
}

// Seconds per unit of time, for rates written as `<thing>/<time>` or `<thing> per <time>`.
const SECONDS: Readonly<Record<string, number>> = {
	ms: 0.001,
	millisecond: 0.001,
	s: 1,
	sec: 1,
	second: 1,
	min: 60,
	minute: 60,
	h: 3600,
	hr: 3600,
	hour: 3600,
};
const PER_TIME = /^(.+?)\s*(?:\/|\bper\b)\s*([a-z]+?)s?$/i;

function perSecond(rate: Rate): { thing: string; value: number } | undefined {
	const m = PER_TIME.exec(rate.unit.trim());
	const thing = m?.[1];
	const time = m?.[2];
	if (thing === undefined || time === undefined) return undefined;
	const seconds = SECONDS[time.toLowerCase()] ?? SECONDS[`${time.toLowerCase()}s`];
	return seconds === undefined ? undefined : { thing: thing.trim(), value: rate.value / seconds };
}

/**
 * How many times slower the app shows a process than it really runs: the "slowed ×N" the learner
 * sees, N = real rate ÷ shown rate. Rates in the same unit divide directly; rates of the same thing
 * over different times (nt/min and nt/s) are converted to per second first. Any other pair of units
 * cannot be compared, and throws a ContentError on `shown_rate.unit`.
 */
export function slowedFactor(process: Pick<ProcessRecord, "file" | "realRate" | "shownRate">): number {
	const { realRate: real, shownRate: shown } = process;
	if (real.unit.trim() === shown.unit.trim()) return real.value / shown.value;
	const r = perSecond(real);
	const s = perSecond(shown);
	if (r && s && r.thing === s.thing) return r.value / s.value;
	throw new ContentError(
		process.file,
		"shown_rate.unit",
		`"${shown.unit}" cannot be compared with real_rate.unit "${real.unit}"`,
	);
}

function article(word: string): string {
	return /^[aeiou]/.test(word) ? "an" : "a";
}
