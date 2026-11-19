import { readFileSync } from "node:fs";
import { describe, expect, test } from "vitest";
import { ManifestError, parseManifest } from "../src/logic/content/manifest";

function good() {
	return [
		{
			id: "pdb-1abc",
			source: "https://www.rcsb.org/structure/1ABC",
			license: "CC0 1.0",
			credit: "Someone, A. (2020). RCSB PDB.",
			use: "courtesy",
		},
		{
			id: "pdb-2def",
			source: "https://www.rcsb.org/structure/2DEF",
			license: "CC BY 4.0",
			credit: "Someone, B. (2021).",
			use: "required",
		},
	];
}

function problemsOf(data: unknown): string[] {
	try {
		parseManifest(data);
	} catch (e) {
		if (e instanceof ManifestError) return e.problems;
		throw e;
	}
	throw new Error("expected the manifest to be rejected");
}

describe("parseManifest", () => {
	test("accepts a good manifest and returns its entries", () => {
		const entries = parseManifest(good());
		expect(entries.map((e) => e.id)).toEqual(["pdb-1abc", "pdb-2def"]);
		expect(entries[1]?.use).toBe("required");
	});

	test("rejects a missing field, naming the entry and the field", () => {
		const data = good();
		const { credit: _dropped, ...rest } = data[1] as Record<string, string>;
		const problems = problemsOf([data[0], rest]);
		expect(problems).toHaveLength(1);
		expect(problems[0]).toContain('"pdb-2def"');
		expect(problems[0]).toContain('"credit"');
		expect(problems[0]).toMatch(/missing/);
	});

	test("names a missing id by the entry's position", () => {
		const data = good();
		const { id: _dropped, ...rest } = data[0] as Record<string, string>;
		const problems = problemsOf([rest, data[1]]);
		expect(problems).toEqual([expect.stringMatching(/entry 0\b.*"id".*missing/)]);
	});

	test("rejects a source that is not a URL, naming the entry and the field", () => {
		const data = good();
		(data[0] as { source: string }).source = "rcsb.org/structure/1ABC";
		const problems = problemsOf(data);
		expect(problems).toHaveLength(1);
		expect(problems[0]).toContain('"pdb-1abc"');
		expect(problems[0]).toContain('"source"');
		expect(problems[0]).toMatch(/URL/);
	});

	test("rejects a non-web URL scheme as a source", () => {
		const data = good();
		(data[0] as { source: string }).source = "ftp://files.rcsb.org/1abc.cif";
		expect(problemsOf(data)[0]).toContain('"source"');
	});

	test("rejects a duplicate id, naming both entries and the field", () => {
		const data = good();
		(data[1] as { id: string }).id = "pdb-1abc";
		const problems = problemsOf(data);
		expect(problems).toHaveLength(1);
		expect(problems[0]).toContain("entry 1");
		expect(problems[0]).toContain("entry 0");
		expect(problems[0]).toContain('"id"');
		expect(problems[0]).toMatch(/duplicate/);
	});

	test("rejects a use other than required or courtesy", () => {
		const data = good();
		(data[0] as { use: string }).use = "optional";
		expect(problemsOf(data)).toEqual([expect.stringMatching(/"pdb-1abc".*"use"/)]);
	});

	test("rejects an empty string as a missing field", () => {
		const data = good();
		(data[0] as { license: string }).license = "  ";
		expect(problemsOf(data)).toEqual([expect.stringMatching(/"pdb-1abc".*"license".*missing/)]);
	});

	test("reports every problem at once, and the error message lists them", () => {
		const data = good();
		(data[0] as { source: string }).source = "nope";
		(data[1] as { use: string }).use = "maybe";
		let message = "";
		try {
			parseManifest(data);
		} catch (e) {
			message = (e as Error).message;
		}
		expect(message).toContain('"source"');
		expect(message).toContain('"use"');
	});

	test("rejects a manifest that is not an array, or an entry that is not an object", () => {
		expect(problemsOf({ entries: [] })[0]).toMatch(/array/);
		expect(problemsOf([good()[0], "pdb-x"])).toEqual([expect.stringMatching(/entry 1\b.*object/)]);
	});
});

describe("assets/manifest.json", () => {
	const entries = parseManifest(JSON.parse(readFileSync("assets/manifest.json", "utf8")));

	test("passes the validator with exactly the three PDB structures", () => {
		expect(entries).toHaveLength(3);
	});

	test("every entry's source is on rcsb.org", () => {
		for (const e of entries) {
			const host = new URL(e.source).hostname;
			expect(host === "rcsb.org" || host.endsWith(".rcsb.org"), `${e.id}: ${e.source}`).toBe(true);
		}
	});
});
