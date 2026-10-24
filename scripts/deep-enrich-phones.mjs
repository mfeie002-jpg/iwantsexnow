/**
 * iWantSexNow.ch · Deep Profile & Hidden Swiss Phone Enricher
 * Visits individual detail pages (sourceUrl) inside src/data/harvested-offers.json
 * to extract hidden Swiss phone numbers (+41 79 / 078 / 076), exact rates and full gallery images.
 *
 * Usage:
 *   $env:FIRECRAWL_API_KEY="fc-YOUR_KEY"
 *   node scripts/deep-enrich-phones.mjs
 */
import fs from "fs";
import path from "path";

const filePath = path.join(process.cwd(), "src", "data", "harvested-offers.json");

const DETAIL_SCHEMA = {
  type: "object",
  properties: {
    rawPhone: { type: "string" },
    advertisedBaseChf: { type: "number" },
    age: { type: "number" },
    subareas: { type: "array", items: { type: "string" } },
    includedTags: { type: "array", items: { type: "string" } },
    thumbnail: { type: "string" },
  },
};

async function enrichMissingPhones() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!fs.existsSync(filePath)) {
    console.log("Keine src/data/harvested-offers.json gefunden.");
    return;
  }

  const offers = JSON.parse(fs.readFileSync(filePath, "utf8"));
  console.log(`Prüfe ${offers.length} gespeicherte Profile auf fehlende Rufnummern...`);

  if (!apiKey) {
    console.log("[HINWEIS] Setze $env:FIRECRAWL_API_KEY, um Detail-Seiten live abzurufen.");
    return;
  }

  let enrichedCount = 0;
  for (const offer of offers) {
    if (offer.rawPhone && offer.rawPhone.replace(/\D/g, "").length >= 9) continue;
    if (!offer.sourceUrl || !offer.sourceUrl.startsWith("http")) continue;
    if (enrichedCount >= 15) break; // Batch limit per run to save API credits

    console.log(`Deep-Crawl für ${offer.rawName} (${offer.sourceUrl}) ...`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: offer.sourceUrl,
          formats: ["extract"],
          extract: {
            schema: DETAIL_SCHEMA,
            prompt: "Extract the Swiss phone/WhatsApp number (+41 or 07x), 1h price in CHF, age, services and main photo URL.",
          },
        }),
      });
      const data = await res.json();
      const ext = data?.data?.extract;
      if (ext) {
        if (ext.rawPhone) offer.rawPhone = ext.rawPhone;
        if (ext.advertisedBaseChf >= 150) offer.advertisedBaseChf = ext.advertisedBaseChf;
        if (ext.thumbnail && ext.thumbnail.startsWith("http")) offer.thumbnail = ext.thumbnail;
        enrichedCount++;
        console.log(` -> Rufnummer gefunden: ${offer.rawPhone || "auf Seite geschützt"}`);
      }
    } catch (e) {
      console.log(` -> Übersprungen: ${e.message}`);
    }
  }

  fs.writeFileSync(filePath, JSON.stringify(offers, null, 2), "utf8");
  console.log(`✓ Deep-Enrichment abgeschlossen (${enrichedCount} Profile angereichert).`);
}

enrichMissingPhones();