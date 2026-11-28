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

import { emptyXeniaChoice, restoreXeniaChoice, storeXeniaChoice, XENIA_DEVICE_KEY, XENIA_STORAGE_KEY } from "../src/lib/xenia-guide.ts";

function memoryStore() {
  const items = new Map();
  return { getItem: key => items.get(key) ?? null, setItem: (key, value) => items.set(key, value), removeItem: key => items.delete(key) };
}

test("an old automatic choice expires, each tab is independent until explicit opt-in, and opt-out clears the device", () => {
  const device = memoryStore();
  const tab = {localStorage:device, sessionStorage:memoryStore()};
  const freshTab = () => ({localStorage:device, sessionStorage:memoryStore()});
  const choice = {canton:"ZH",category:"massage",budget:"250"};
  device.setItem(XENIA_STORAGE_KEY, JSON.stringify(choice));
  assert.deepEqual(restoreXeniaChoice(tab), {choice:emptyXeniaChoice(),remember:false});
  assert.equal(device.getItem(XENIA_STORAGE_KEY), null);
  assert.ok(storeXeniaChoice(tab,choice,false));
  assert.deepEqual(restoreXeniaChoice(tab).choice,choice);
  assert.deepEqual(restoreXeniaChoice(freshTab()).choice,emptyXeniaChoice());
  assert.equal(xeniaSearchHref(choice),"/search?canton=ZH&category=massage&max=250");
  assert.ok(storeXeniaChoice(tab,choice,true));
  assert.deepEqual(restoreXeniaChoice(freshTab()),{choice,remember:true});
  assert.ok(storeXeniaChoice(tab,choice,false));
  assert.equal(device.getItem(XENIA_DEVICE_KEY),null);
  assert.deepEqual(restoreXeniaChoice(freshTab()).choice,emptyXeniaChoice());
});
