import { parse as parseYaml } from "yaml";
import {
	type Comparison,
	type ContentRecord,
	type DescentBeat,
	KINDS,
	type Kind,
	LAYERED_KINDS,
	type Layers,
	PLACED_KINDS,
	type ProcessStep,
	type Rate,
	type Source,
	type SourcedRange,
	type SourcedRate,
	type SourcedValue,
	STOPS,
	type Stop,
} from "./types";

/** A content file that fails validation. The message always starts with the file path and the field. */
export class ContentError extends Error {
	constructor(
		readonly file: string,
		readonly field: string,
		detail: string,
	) {
		super(`${file}: ${field}: ${detail}`);
		this.name = "ContentError";
	}
}

const ID = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const SOURCE_KEY = /^[A-Za-z0-9][\w-]*$/;
const HEX = /^#[0-9a-fA-F]{6}$/;
// PDB ids are four characters, the first a digit 1-9.
const PDB = /^[1-9][A-Za-z0-9]{3}$/;
const RESEARCH_FILE = /^research\/[\w.-]+\.md$/;
const FRONTMATTER = /^---\r?\n([\s\S]*?)\r?\n---[ \t]*(?:\r?\n([\s\S]*))?$/;
const LAYER_HEADINGS = { label: "Label", paragraph: "Paragraph", goDeeper: "Go deeper" } as const;

type Obj = Record<string, unknown>;

function isObj(v: unknown): v is Obj {
	return typeof v === "object" && v !== null && !Array.isArray(v);
}

// A type guard, so checking a kind against a kind list also narrows it for the switches that follow.
function isOneOf<T extends string>(v: unknown, allowed: readonly T[]): v is T {
	return typeof v === "string" && (allowed as readonly string[]).includes(v);
}

// Reads typed fields out of one YAML mapping, naming the full field path (e.g. `steps[1].stop`) in errors.
class Fields {
	constructor(
		readonly file: string,
		readonly obj: Obj,
		readonly at = "",
		readonly sourceKeys: ReadonlySet<string> = new Set(),
	) {}

	path(key: string): string {
		return this.at ? `${this.at}.${key}` : key;
	}

	fail(key: string, detail: string): never {
		throw new ContentError(this.file, this.path(key), detail);
	}

	has(key: string): boolean {
		return this.obj[key] !== undefined && this.obj[key] !== null;
	}

	raw(key: string): unknown {
		if (!this.has(key)) this.fail(key, "is missing");
		return this.obj[key];
	}

	text(key: string): string {
		const v = this.raw(key);
		if (typeof v !== "string" || v.trim() === "") this.fail(key, "must be non-empty text");
		return v.trim();
	}

	id(key: string): string {
		const v = this.text(key);
		if (!ID.test(v)) this.fail(key, `"${v}" is not an id (lowercase letters, digits and hyphens)`);
		return v;
	}

	oneOf<T extends string>(key: string, allowed: readonly T[]): T {
		const v = this.raw(key);
		if (!isOneOf(v, allowed)) this.fail(key, `"${String(v)}" is not one of ${allowed.join(", ")}`);
		return v;
	}

	stop(key: string): Stop {
		return this.oneOf(key, STOPS);
	}

	boolean(key: string): boolean {
		const v = this.raw(key);
		if (typeof v !== "boolean") this.fail(key, "must be true or false");
		return v;
	}

	positive(key: string): number {
		const v = this.raw(key);
		if (typeof v !== "number" || !Number.isFinite(v) || v <= 0) this.fail(key, "must be a positive number");
		return v;
	}

	colour(key: string): string {
		// The likeliest mistake: unquoted, `colour: #3a7bd5` is a YAML comment, so the field reads as empty.
		if (!this.has(key))
			this.fail(key, 'is missing (quote hex colours, like "#3a7bd5": an unquoted # starts a YAML comment)');
		const v = this.text(key);
		if (!HEX.test(v)) this.fail(key, `"${v}" is not a hex colour like #3a7bd5`);
		return v.toLowerCase();
	}

	/** A key into this file's `sources` list. */
	sourceKey(key: string): string {
		const v = this.text(key);
		if (!this.sourceKeys.has(v)) this.fail(key, `"${v}" is not a key in sources`);
		return v;
	}

	child(key: string, shape: string): Fields {
		const v = this.raw(key);
		if (!isObj(v)) this.fail(key, `must be ${shape}`);
		return new Fields(this.file, v, this.path(key), this.sourceKeys);
	}

	list(key: string, opts: { nonEmpty?: boolean } = {}): Fields[] {
		const v = this.raw(key);
		if (!Array.isArray(v)) this.fail(key, "must be a list");
		if (opts.nonEmpty && v.length === 0) this.fail(key, "must not be empty");
		return v.map((item, i) => {
			const at = `${this.path(key)}[${i}]`;
			if (!isObj(item)) throw new ContentError(this.file, at, "must be a mapping of fields");
			return new Fields(this.file, item, at, this.sourceKeys);
		});
	}

	/** Counts are of whole things, so a fractional bound is a typo. */
	wholeCount(key: string): number {
		const v = this.positive(key);
		if (!Number.isInteger(v)) this.fail(key, "must be a whole number");
		return v;
	}

	sourcedValue(key: string): SourcedValue {
		const f = this.child(key, "a sourced value {value, source}");
		return { value: f.positive("value"), source: f.sourceKey("source") };
	}

	sourcedRange(key: string): SourcedRange {
		const f = this.child(key, "a range {min, max, source}");
		const min = f.wholeCount("min");
		const max = f.wholeCount("max");
		if (min > max) this.fail(key, `min (${min}) is greater than max (${max})`);
		return { min, max, source: f.sourceKey("source") };
	}

	rate(key: string): Rate {
		const f = this.child(key, "a rate {value, unit, source}");
		const rate: Rate = { value: f.positive("value"), unit: f.text("unit") };
		if (f.has("source")) rate.source = f.sourceKey("source");
		return rate;
	}

	sourcedRate(key: string): SourcedRate {
		const f = this.child(key, "a rate {value, unit, source}");
		return { value: f.positive("value"), unit: f.text("unit"), source: f.sourceKey("source") };
	}
}

function readSources(f: Fields): Source[] {
	const seen = new Set<string>();
	return f.list("sources", { nonEmpty: true }).map((s) => {
		const key = s.text("key");
		if (!SOURCE_KEY.test(key)) s.fail("key", `"${key}" is not a short key (letters, digits, - and _)`);
		if (seen.has(key)) s.fail("key", `"${key}" is used twice`);
		seen.add(key);
		if (s.has("url")) {
			const url = s.text("url");
			if (!url.startsWith("https://")) s.fail("url", `"${url}" must start with https://`);
			return { key, url };
		}
		if (!s.has("file")) s.fail("file", "is missing (give a research file and section, or a url)");
		const file = s.text("file");
		if (!RESEARCH_FILE.test(file)) s.fail("file", `"${file}" is not a research/<name>.md file`);
		return { key, file, section: s.text("section") };
	});
}

// Splits the body into `## Heading` sections. Text before the first heading is ignored.
function readSections(file: string, body: string): Record<string, string> {
	const sections: Record<string, string> = {};
	let heading: string | undefined;
	let lines: string[] = [];
	// A "## " line inside a fenced code block is code, not a heading.
	let inFence = false;
	const flush = () => {
		if (heading === undefined) return;
		if (heading in sections) throw new ContentError(file, `## ${heading}`, "appears twice");
		sections[heading] = lines.join("\n").trim();
	};
	for (const line of body.split(/\r?\n/)) {
		if (/^\s*(```|~~~)/.test(line)) inFence = !inFence;
		const m = inFence ? null : /^##\s+(.+?)\s*$/.exec(line);
		if (m?.[1] !== undefined) {
			flush();
			heading = m[1];
			lines = [];
		} else {
			lines.push(line);
		}
	}
	flush();
	return sections;
}

function readLayers(file: string, sections: Record<string, string>): Layers {
	const get = (heading: string): string => {
		const v = sections[heading];
		if (v === undefined) throw new ContentError(file, `## ${heading}`, "section is missing");
		if (v === "") throw new ContentError(file, `## ${heading}`, "section is empty");
		return v;
	};
	const label = get(LAYER_HEADINGS.label);
	if (label.includes("\n")) throw new ContentError(file, `## ${LAYER_HEADINGS.label}`, "must be a single line");
	return { label, paragraph: get(LAYER_HEADINGS.paragraph), goDeeper: get(LAYER_HEADINGS.goDeeper) };
}

/**
 * Parses one `content/**\/*.md` file into a typed record. Throws a ContentError naming the file and
 * field on anything invalid. Checks that span files (parents exist, ids unique) are not done here.
 */
export function parseContent(file: string, text: string): ContentRecord {
	// Some editors save a byte order mark first; it is not part of the frontmatter fence.
	const m = FRONTMATTER.exec(text.replace(/^\uFEFF/, ""));
	if (!m) throw new ContentError(file, "frontmatter", "file must start with a --- fenced YAML block");
	let data: unknown;
	try {
		data = parseYaml(m[1] ?? "");
	} catch (e) {
		throw new ContentError(file, "frontmatter", `is not valid YAML (${(e as Error).message})`);
	}
	if (!isObj(data)) throw new ContentError(file, "frontmatter", "must be a mapping of fields");
	const body = m[2] ?? "";

	const top = new Fields(file, data);
	const id = top.id("id");
	const kind: Kind = top.oneOf("kind", KINDS);
	const name = top.text("name");
	const sources = readSources(top);
	const f = new Fields(file, data, "", new Set(sources.map((s) => s.key)));
	const sections = readSections(file, body);
	const common = { file, id, name, sources, sections };

	const layered = isOneOf(kind, LAYERED_KINDS);
	const layers = layered ? readLayers(file, sections) : undefined;

	if (isOneOf(kind, PLACED_KINDS)) {
		const stop = f.stop("stop");
		const colour = f.has("colour") ? f.colour("colour") : undefined;
		const placed = { ...common, stop, layers: layers as Layers, ...(colour ? { colour } : {}) };
		if (kind === "cell") {
			if (f.has("parent")) f.fail("parent", "the cell is the root and has no parent");
			return { ...placed, kind, sizeNm: f.sourcedValue("size_nm") };
		}
		const parent = f.id("parent");
		switch (kind) {
			case "organelle": {
				const diveable = f.boolean("diveable");
				const comingLater = f.has("coming_later") ? f.text("coming_later") : undefined;
				if (!diveable && comingLater === undefined) {
					f.fail("coming_later", "is required when diveable is false");
				}
				return {
					...placed,
					kind,
					parent,
					colour: f.colour("colour"),
					sizeNm: f.sourcedValue("size_nm"),
					count: f.sourcedRange("count"),
					diveable,
					...(comingLater !== undefined ? { comingLater } : {}),
				};
			}
			case "site":
				return {
					...placed,
					kind,
					parent,
					machine: f.id("machine"),
					...(f.has("process") ? { process: f.id("process") } : {}),
				};
			case "machine": {
				const pdb = f.child("pdb", "a PDB entry {id, source}");
				const pdbId = pdb.text("id");
				if (!PDB.test(pdbId)) pdb.fail("id", `"${pdbId}" is not a four-character PDB id`);
				return { ...placed, kind, parent, pdb: { id: pdbId.toUpperCase(), source: pdb.sourceKey("source") } };
			}
			case "part":
			case "cytoplasm":
				return { ...placed, kind, parent };
		}
	}

	switch (kind) {
		case "process": {
			const steps: ProcessStep[] = f
				.list("steps", { nonEmpty: true })
				.map((s) => ({ stop: s.stop("stop"), machine: s.id("machine") }));
			const realRate = f.sourcedRate("real_rate");
			const shownRate = f.rate("shown_rate");
			// The app shows "slowed ×N" as real ÷ shown, which only means something in one unit.
			if (shownRate.unit !== realRate.unit) {
				f.fail("shown_rate.unit", `"${shownRate.unit}" must match real_rate.unit "${realRate.unit}"`);
			}
			return { ...common, kind, layers: layers as Layers, steps, realRate, shownRate };
		}
		case "descent": {
			const beats: DescentBeat[] = f
				.list("beats", { nonEmpty: true })
				.map((b) => ({ focus: b.id("focus"), narration: b.text("narration") }));
			return { ...common, kind, beats };
		}
		case "page":
			if (body.trim() === "") f.fail("body", "a page needs some text");
			return { ...common, kind, body: body.trim() };
		case "comparisons": {
			const items: Comparison[] = f
				.list("items", { nonEmpty: true })
				.map((c) => ({ id: c.id("id"), name: c.text("name"), sizeNm: c.sourcedValue("size_nm") }));
			return { ...common, kind, items };
		}
	}
}
