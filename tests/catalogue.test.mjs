import test from "node:test";
import assert from "node:assert/strict";
import { parseCatalogueFilters as parse, filterCatalogue as filter, demoListings, catalogueHref, normalizeCatalogueText } from "../src/lib/marketplace/catalogue.ts";

test("demo inventory is explicit and all fixture IDs are unique", () => {
  assert.equal(filter(parse({})).length, 8);
  assert(demoListings.every(item => item.demo === true && item.id.startsWith("demo-")));
  assert.equal(new Set(demoListings.map(item => item.id)).size, demoListings.length);
});
test("city and category combine with AND", () => {
  assert.deepEqual(filter(parse({city:"zurich",category:"escort"})).map(x=>x.id), ["demo-zurich-escort"]);
  assert.equal(filter(parse({city:"basel",category:"escort"})).length, 0);
});
test("category spans cities while city includes several categories", () => {
  assert.equal(filter(parse({category:"escort"})).length, 3);
  assert.equal(filter(parse({city:"zurich"})).length, 2);
});
test("text query actually filters and combines with city/category", () => {
  assert.equal(filter(parse({q:"Begleitung"})).length, 3);
  assert.equal(filter(parse({q:"Begleitung",city:"zurich"})).length, 1);
  assert.equal(filter(parse({q:"Begleitung",city:"zurich",category:"escort"})).length, 0);
  assert.equal(filter(parse({q:"zzzz-no-match"})).length, 0);
});
test("Swiss city spellings, accents and whitespace are normalized", () => {
  for(const q of ["Zürich","Zurich","Zuerich","  ZÜRICH  "]) assert.equal(filter(parse({q})).length,2,q);
  for(const q of ["Genève","Geneve","Genf","Geneva"]) assert.equal(filter(parse({q})).length,1,q);
  assert.equal(normalizeCatalogueText("Genève Zürich"),"geneve zurich");
});
test("all text tokens must match", () => {
  assert.equal(filter(parse({q:"zurich begleitung"})).length,1);
  assert.equal(filter(parse({q:"zurich basel"})).length,0);
});
test("unknown and duplicated filters fail closed rather than showing everything", () => {
  for(const query of [{city:"unknown"},{category:"unknown"},{view:"private"},{city:["zurich","basel"]},{category:["escort"]},{q:["a","b"]},{view:["demo","approved"]},{q:"x".repeat(101)}]) {
    assert.equal(parse(query).invalid,true);
    assert.equal(filter(parse(query)).length,0);
  }
});
test("approved inventory never falls back to demo data", () => {
  for(const query of [{view:"approved"},{view:"approved",city:"zurich"},{view:"approved",category:"escort",q:"demo"}]) assert.equal(filter(parse(query)).length,0);
});
test("filter links round-trip with safe query encoding", () => {
  const filters=parse({city:"geneva",category:"escort",q:'Genève & <demo>'});
  const href=catalogueHref(filters);
  assert(href.startsWith("/search?"));
  assert(!href.includes("<"));
  assert.deepEqual(parse(Object.fromEntries(new URL(href,"https://preview.invalid").searchParams)),filters);
  assert.equal(catalogueHref(parse({})), "/search");
  assert.equal(catalogueHref(parse({view:"approved"})), "/search?view=approved");
});
