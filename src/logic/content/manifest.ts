// Validator for assets/manifest.json: one entry per external asset, so the Credits page can be built from it
// and nothing ships without a known source and license (see research/3d-assets.md, "Recommendation", item 4).

export type AssetUse = "required" | "courtesy";

export interface AssetEntry {
	id: string;
	/** Where the asset came from: an http(s) URL. */
	source: string;
	license: string;
	/** The credit line shown on the Credits page. */
	credit: string;
	/** "required" when the license demands credit; "courtesy" when we credit anyway (e.g. CC0 PDB data). */
	use: AssetUse;
}

const STRING_FIELDS = ["id", "source", "license", "credit", "use"] as const;
const USES: readonly string[] = ["required", "courtesy"] satisfies AssetUse[];

export class ManifestError extends Error {
	readonly problems: string[];
	constructor(problems: string[]) {
		super(`assets/manifest.json is invalid:\n${problems.map((p) => `- ${p}`).join("\n")}`);
		this.name = "ManifestError";
		this.problems = problems;
	}
}

function isWebUrl(text: string): boolean {
	try {
		const url = new URL(text);
		return url.protocol === "https:" || url.protocol === "http:";
	} catch {
		return false;
	}
}

// Name an entry by its position and, when it has one, its id, so a message points at the right line.
function label(index: number, raw: Record<string, unknown>): string {
	const id = raw.id;
	return typeof id === "string" && id.trim() !== "" ? `entry ${index} ("${id}")` : `entry ${index}`;
}

/**
 * Checks parsed manifest JSON and returns its typed entries, or throws a ManifestError listing every problem.
 */
export function parseManifest(data: unknown): AssetEntry[] {
	if (!Array.isArray(data)) throw new ManifestError(["the manifest must be an array of entries"]);

	const problems: string[] = [];
	const firstIndexOfId = new Map<string, number>();

	data.forEach((item: unknown, index) => {
		if (typeof item !== "object" || item === null || Array.isArray(item)) {
			problems.push(`entry ${index} must be an object`);
			return;
		}
		const raw = item as Record<string, unknown>;
		const where = label(index, raw);

		for (const field of STRING_FIELDS) {
			const value = raw[field];
			if (value === undefined || (typeof value === "string" && value.trim() === "")) {
				problems.push(`${where}: field "${field}" is missing`);
			} else if (typeof value !== "string") {
				problems.push(`${where}: field "${field}" must be a string`);
			}
		}

		if (typeof raw.source === "string" && raw.source.trim() !== "" && !isWebUrl(raw.source)) {
			problems.push(`${where}: field "source" is not an http(s) URL: "${raw.source}"`);
		}
		if (typeof raw.use === "string" && raw.use.trim() !== "" && !USES.includes(raw.use)) {
			problems.push(`${where}: field "use" must be "required" or "courtesy", not "${raw.use}"`);
		}
		if (typeof raw.id === "string" && raw.id.trim() !== "") {
			const first = firstIndexOfId.get(raw.id);
			if (first === undefined) firstIndexOfId.set(raw.id, index);
			else problems.push(`${where}: field "id" is a duplicate of entry ${first}`);
		}
	});

	if (problems.length > 0) throw new ManifestError(problems);
	// Copy only the known fields so stray keys never reach the view.
	return (data as AssetEntry[]).map(({ id, source, license, credit, use }) => ({ id, source, license, credit, use }));
}
