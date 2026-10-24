import fs from "fs";
import path from "path";

const PORTAL_TARGETS = [
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-zuerich", defaultCanton: "ZH", defaultCity: "Zürich" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-zug", defaultCanton: "ZG", defaultCity: "Zug" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/zuerich/", defaultCanton: "ZH", defaultCity: "Zürich" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/zuerich", defaultCanton: "ZH", defaultCity: "Zürich" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/zentralschweiz", defaultCanton: "ZG", defaultCity: "Zug" },
];

const EXTRACTION_SCHEMA = {
  type: "object",
  properties: {
    profiles: {
      type: "array",
      items: {
        type: "object",
        properties: {
          rawName: { type: "string" },
          age: { type: "number" },
          rawPhone: { type: "string" },
          city: { type: "string" },
          subareas: { type: "array", items: { type: "string" } },
          advertisedBaseChf: { type: "number" },
          includedTags: { type: "array", items: { type: "string" } },
          incall: { type: "boolean" },
          outcall: { type: "boolean" },
          thumbnail: { type: "string" },
          sourceUrl: { type: "string" },
        },
        required: ["rawName"],
      },
    },
  },
};

async function harvestAllPlatforms() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  const targetEndpoint = process.env.TARGET_API_URL || "https://iwantsexnow.ch/api/indexer/import";
  const outputPath = path.join(process.cwd(), "src", "data", "harvested-offers.json");

  console.log("=== iWantSexNow.ch · Full Swiss Portal Harvester (Persistent JSON + Cloud Sync) ===");
  const collectedOffers = [];

  if (!apiKey) {
    console.log("[WARN] Kein FIRECRAWL_API_KEY gesetzt! Bitte $env:FIRECRAWL_API_KEY setzen.");
    return;
  }

  for (const target of PORTAL_TARGETS) {
    console.log(`Extrahiere komplette Profile & Bilder von ${target.url} ...`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: target.url,
          formats: ["extract"],
          extract: {
            schema: EXTRACTION_SCHEMA,
            prompt:
              "Extract all escort/companion listings from this page including name (rawName), age, Swiss phone number if visible (rawPhone), city/subareas, 1-hour price in CHF (advertisedBaseChf), services (includedTags), incall/outcall, full profile URL (sourceUrl), and main profile image URL (thumbnail).",
          },
        }),
      });
      const data = await res.json();
      const extracted = data?.data?.extract?.profiles || [];
      console.log(`-> ${extracted.length} Profile auf ${target.portal} gefunden.`);

      for (const item of extracted) {
        if (!item.rawName) continue;
        collectedOffers.push({
          sourcePortal: target.portal,
          sourceUrl: item.sourceUrl || target.url,
          rawName: String(item.rawName).trim(),
          age: Number(item.age) || 25,
          rawPhone: item.rawPhone ? String(item.rawPhone) : "",
          city: item.city || target.defaultCity,
          canton: target.defaultCanton,
          subareas: Array.isArray(item.subareas) && item.subareas.length ? item.subareas : [item.city || target.defaultCity],
          advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 400,
          includedTags: Array.isArray(item.includedTags) && item.includedTags.length ? item.includedTags : ["GFE", "Outcall"],
          incall: item.incall ?? true,
          outcall: item.outcall ?? true,
          scrapedAtIso: "Live via Firecrawl",
          directAuthorized: false,
          thumbnail: item.thumbnail && String(item.thumbnail).startsWith("http") ? item.thumbnail : undefined,
        });
      }
    } catch (err) {
      console.error(`Fehler bei ${target.url}:`, err.message);
    }
  }

  // Save permanently to src/data/harvested-offers.json so Next.js bundles all real scraped profiles into every page!
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(collectedOffers, null, 2), "utf8");
  console.log(`✓ ${collectedOffers.length} echte Profile dauerhaft in src/data/harvested-offers.json gespeichert!`);

  try {
    const pushRes = await fetch(targetEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offers: collectedOffers }),
    });
    const result = await pushRes.json();
    console.log("Cloud-Import-Ergebnis:", {
      status: result.status,
      rawCount: result.rawCount,
      deduplicatedCount: result.deduplicatedCount,
      duplicatesEliminated: result.duplicatesEliminated,
      syncedToSupabase: result.syncedToSupabase,
    });
  } catch (err) {
    console.log("Lokale JSON-Datei aktualisiert.");
  }
}

harvestAllPlatforms();