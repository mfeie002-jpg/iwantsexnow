import test from "node:test";
import assert from "node:assert/strict";
import { parseXeniaChoice, xeniaContextChips, xeniaSearchHref } from "../src/lib/xenia-guide.ts";

test("three choices become a search link without a live-availability flag", () => {
  const href = xeniaSearchHref({ canton: "ZH", category: "massage", budget: "under300" });
  assert.equal(href, "/search?canton=ZH&category=massage&under60=300");
  assert.equal(href.includes("available"), false);
  assert.equal(xeniaSearchHref({ canton: "ALL", category: "all", budget: "open" }), "/search");
});

test("stored choices ignore junk and context chips stay within four", () => {
  assert.deepEqual(parseXeniaChoice('{"canton":"ZG","category":"bdsm","budget":"400"}'), { canton: "ZG", category: "bdsm", budget: "400" });
  assert.equal(parseXeniaChoice("{").budget, "open");
  assert.equal(parseXeniaChoice('{"budget":"heute-frei"}').budget, "open");
  for (const path of ["/", "/search", "/profile/abc", "/clubs", "/reviews"]) {
    const chips = xeniaContextChips(path);
    assert.ok(chips.length >= 3 && chips.length <= 4, path);
  }
});
