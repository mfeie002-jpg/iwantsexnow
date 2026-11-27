import test from "node:test";
import assert from "node:assert/strict";
import { filtersFromQuery as parse, filterOffers, searchHref } from "../src/lib/night-catalogue.ts";

// Test-only records, supplied explicitly to the real catalogue engine. They are
// never imported by a page, bundled with the app, or used as fallback inventory.
const inventory = Object.freeze([
  Object.freeze({ id: "ch-test-zh-female", rawName: "Fixture A", city: "Zürich", canton: "ZH", rubric: "female", includedTags: ["Begleitung"] }),
  Object.freeze({ id: "ch-test-zh-massage", rawName: "Fixture B", city: "Zürich", canton: "ZH", rubric: "massage", includedTags: ["Ruhe"] }),
  Object.freeze({ id: "ch-test-bs-female", rawName: "Fixture C", city: "Basel", canton: "BS", rubric: "female", includedTags: ["Begleitung"] }),
  Object.freeze({ id: "ch-test-ge-female", rawName: "Fixture D", city: "Genève", canton: "GE", rubric: "female", includedTags: ["Begleitung"] }),
]);
const filter = (query, states = {}, blocked = []) => filterOffers(inventory, parse(query), states, blocked);
const ids = rows => rows.map(row => row.id);

test("catalogue uses only caller-supplied inventory and never seeds replacements", () => {
  assert.deepEqual(filterOffers([], parse({})), []);
  assert.deepEqual(filterOffers([], parse({ canton: "ZH", category: "female" })), []);
  assert.deepEqual(ids(filter({})), inventory.map(row => row.id));
  assert(filter({}).every(row => inventory.includes(row)));
});

test("canton and category combine with AND", () => {
  assert.deepEqual(ids(filter({ canton: "ZH", category: "female" })), ["ch-test-zh-female"]);
  assert.deepEqual(filter({ canton: "BS", category: "massage" }), []);
});

test("category spans cantons while a canton contains several categories", () => {
  assert.equal(filter({ category: "female" }).length, 3);
  assert.equal(filter({ canton: "ZH" }).length, 2);
});

test("optional text search combines with touch filters", () => {
  assert.equal(filter({ q: "BEGLEITUNG" }).length, 3);
  assert.deepEqual(ids(filter({ q: "Begleitung", canton: "ZH" })), ["ch-test-zh-female"]);
  assert.deepEqual(filter({ q: "Begleitung", canton: "ZH", category: "massage" }), []);
  assert.deepEqual(filter({ q: "zzzz-no-match" }), []);
});

test("Swiss city spellings, accents and whitespace retain the existing search contract", () => {
  for (const q of ["Zürich", "Zurich", "Zuerich", "  ZÜRICH  "]) assert.equal(filter({ q }).length, 2, q);
  for (const q of ["Genève", "Geneve", "Genf", "Geneva"]) assert.equal(filter({ q }).length, 1, q);
});

test("all search tokens match regardless of field or token order", () => {
  assert.deepEqual(ids(filter({ q: "zuerich begleitung" })), ["ch-test-zh-female"]);
  assert.deepEqual(ids(filter({ q: "begleitung geneva" })), ["ch-test-ge-female"]);
  assert.deepEqual(filter({ q: "zurich basel" }), []);
});

test("invalid or duplicated selectors never silently broaden the requested result", () => {
  const invalid = [
    { canton: "unknown" }, { category: "unknown" },
    { canton: ["ZH", "BS"] }, { category: ["female"] }, { q: ["a", "b"] },
    { max: ["100", "200"] }, { available: ["1", "0"] },
    { q: "x".repeat(151) }, { max: "Infinity" }, { max: "-1" },
  ];
  for (const query of invalid) assert.deepEqual(filter(query), [], JSON.stringify(query));
});

test("hidden, paused, reported or blocked entries never receive fallback inventory", () => {
  for (const state of [{ hidden: true }, { paused: true }, { removedByReport: true }]) {
    assert.deepEqual(filter({ canton: "ZH", category: "female" }, { "ch-test-zh-female": state }), []);
  }
  assert.deepEqual(filter({ canton: "ZH", category: "female" }, {}, ["ch-test-zh-female"]), []);
  const before = JSON.stringify(inventory);
  filter({ sort: "region" });
  assert.equal(JSON.stringify(inventory), before, "search and sorting do not mutate source entries");
});

test("filter links round-trip all supported touch choices with safe query encoding", () => {
  const filters = parse({ canton: "GE", category: "female", q: "Genève & <test>", max: "400", available: "1", wa: "1", sort: "price" });
  const href = searchHref(filters);
  assert(href.startsWith("/search?"));
  assert(!href.includes("<"));
  assert.deepEqual(parse(Object.fromEntries(new URL(href, "https://preview.invalid").searchParams)), filters);
  assert.equal(searchHref(parse({})), "/search");
});
