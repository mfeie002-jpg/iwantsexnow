import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import { buildPortalFacts, countEstablishments, halfHourPriceLine, hourlyPriceLine, isDefaultHourly, isDerivedHalfHour, latestDataStandIso } from "../src/lib/honesty.ts";

const read = (path) => fs.readFileSync(new URL(path, import.meta.url), "utf8");

test("club count is the establishment file, not the stale vault headline", () => {
  const clubs = JSON.parse(read("../src/data/swiss-establishments-vault.json"));
  const stats = JSON.parse(read("../src/data/index-stats.json"));
  assert.equal(countEstablishments(clubs), 108);
  assert.notEqual(countEstablishments(clubs), stats.totalEstablishmentsInVault);
});

test("default hourly and derived half-hour prices are marked geschätzt", () => {
  assert.equal(isDerivedHalfHour(400, 240), true);
  assert.equal(isDerivedHalfHour(350, 210), true);
  assert.equal(isDefaultHourly(400, 240), true);
  assert.equal(isDefaultHourly(350, 210), false);
  assert.match(hourlyPriceLine({ harvested: 400, halfHour: 240 }).label, /geschätzt/);
  assert.match(halfHourPriceLine({ harvested: 210, hourly: 350 }).label, /geschätzt/);
  assert.doesNotMatch(hourlyPriceLine({ confirmed: 350, harvested: 400, halfHour: 240 }).label, /geschätzt/);
  assert.match(hourlyPriceLine({ harvested: 180, halfHour: 110 }).label, /nicht bestätigt/);
});

test("data stand uses a scrape timestamp from the stats file", () => {
  const stats = JSON.parse(read("../src/data/index-stats.json"));
  const latest = ["lastDeltaScrapeAt", "lastCantonHarvestAt", "lastStudioCrawlAt", "lastDeepNightAuditAt"]
    .map((key) => stats[key]).sort().at(-1);
  assert.equal(latestDataStandIso(stats), latest);
});

test("portal comparison has ten names, no rating, and statements only with a date", () => {
  const offers = JSON.parse(read("../src/data/harvested-offers.json"));
  const facts = buildPortalFacts(offers);
  assert.equal(facts.length, 10);
  assert.deepEqual(facts.map((item) => item.name), ["and6", "6navi", "sex.ch", "ladies.ch", "saferchoice", "Lolla", "Megaescort", "Target Escorts", "Ladama", "Girls Deluxe"]);
  for (const fact of facts) {
    assert.equal(fact.status, "in Prüfung");
    assert.equal(fact.rating, null);
    if (fact.statement) {
      assert.ok(fact.datedCount > 0);
      assert.ok(fact.latestScrapedAt);
    }
  }
  assert.equal(facts.find((item) => item.id === "sexch").statement, null);
  assert.ok(facts.find((item) => item.id === "and6").statement);
});

test("rendered cards do not claim scraped live availability", () => {
  const files = [
    "../src/components/VisualProfileCard.tsx",
    "../src/components/PostcardProfileCard.tsx",
    "../src/components/LuxuryPhotoCard.tsx",
    "../src/pages/profile/[id].tsx",
    "../src/lib/brand/doorplateTokens.ts",
    "../src/components/MobileBottomNav.tsx",
  ];
  for (const file of files) {
    const source = read(file);
    assert.equal(source.includes("FREI · 4H LIVE"), false, file);
    assert.equal(source.includes("· Aktiv"), false, file);
    assert.equal(source.includes("Heute frei"), false, file);
  }
});
