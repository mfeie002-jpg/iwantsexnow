import test from "node:test";
import assert from "node:assert/strict";
import { demoListings, filterCatalogue, parseCatalogueFilters } from "../src/lib/marketplace/catalogue.ts";
test("No fictional catalogue inventory is exposed",()=> {
 assert.deepEqual(demoListings, []);
 for (const query of [{},{view:"demo"},{view:"approved"},{city:"zurich",category:"escort"},{q:"Demo"}]) assert.deepEqual(filterCatalogue(parseCatalogueFilters(query)),[]);
});
