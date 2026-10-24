/**
 * iWantSexNow.ch · Full Profile, Image & Tariff Harvester
 * Extracts complete profile objects (Name, Age, Phone, Rates, Services, Bio, Image URLs)
 * via Firecrawl Structured LLM Extraction and pushes them into /api/indexer/import.
 *
 * Usage in PowerShell:
 *   $env:FIRECRAWL_API_KEY="fc-YOUR_KEY"
 *   $env:TARGET_API_URL="https://iwantsexnow.ch/api/indexer/import"
 *   node scripts/full-harvester.mjs
 */

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
        required: ["rawName", "rawPhone"],
      },
    },
  },
};

async function harvestAllPlatforms() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  const targetEndpoint = process.env.TARGET_API_URL || "http://localhost:3000/api/indexer/import";

  console.log("=== iWantSexNow.ch · Full Swiss Portal Harvester ===");
  const collectedOffers = [];

  if (!apiKey) {
    console.log("[INFO] Kein FIRECRAWL_API_KEY gefunden – generiere vollständigen Test-Import-Batch...");
    collectedOffers.push(
      {
        sourcePortal: "xdate.ch",
        rawName: "Alessia VIP",
        age: 24,
        rawPhone: "+41 79 518 44 02",
        city: "Zug",
        canton: "ZG",
        subareas: ["Zug Zentrum", "Cham", "Baar"],
        advertisedBaseChf: 450,
        includedTags: ["GFE", "Dinner Dates", "Outcall"],
        incall: true,
        outcall: true,
        scrapedAtIso: "Gerade importiert",
        directAuthorized: false,
        thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      },
      {
        sourcePortal: "and6.com",
        rawName: "Alessia ZG/ZH",
        age: 24,
        rawPhone: "079 518 44 02",
        city: "Cham",
        canton: "ZG",
        subareas: ["Cham", "Zug"],
        advertisedBaseChf: 520,
        includedTags: ["GFE"],
        incall: true,
        outcall: true,
        scrapedAtIso: "Gerade importiert",
        directAuthorized: false,
        thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      }
    );
  } else {
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
                "Extract all escort/companion listings from this page including name, age, Swiss phone number (+41 or 07x), city/subareas, 1-hour price in CHF, services, incall/outcall, and main profile image URL.",
            },
          }),
        });
        const data = await res.json();
        const extracted = data?.data?.extract?.profiles || [];
        console.log(`-> ${extracted.length} Profile auf ${target.portal} gefunden.`);

        for (const item of extracted) {
          collectedOffers.push({
            sourcePortal: target.portal,
            sourceUrl: item.sourceUrl || target.url,
            rawName: item.rawName || "Unbekannt",
            age: item.age || 25,
            rawPhone: item.rawPhone || "+41 79 000 00 00",
            city: item.city || target.defaultCity,
            canton: target.defaultCanton,
            subareas: Array.isArray(item.subareas) && item.subareas.length ? item.subareas : [target.defaultCity],
            advertisedBaseChf: Number(item.advertisedBaseChf) || 400,
            includedTags: Array.isArray(item.includedTags) && item.includedTags.length ? item.includedTags : ["GFE"],
            incall: item.incall ?? true,
            outcall: item.outcall ?? true,
            scrapedAtIso: new Date().toLocaleTimeString("de-CH"),
            directAuthorized: false,
            thumbnail: item.thumbnail,
          });
        }
      } catch (err) {
        console.error(`Fehler bei ${target.url}:`, err.message);
      }
    }
  }

  console.log(`Sende ${collectedOffers.length} gescrapte Inserate zur Deduplizierung & Datenbank-Speicherung an ${targetEndpoint} ...`);
  try {
    const pushRes = await fetch(targetEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ offers: collectedOffers }),
    });
    const result = await pushRes.json();
    console.log("Import-Ergebnis:", {
      status: result.status,
      rawCount: result.rawCount,
      deduplicatedCount: result.deduplicatedCount,
      duplicatesEliminated: result.duplicatesEliminated,
      syncedToSupabase: result.syncedToSupabase,
    });
  } catch (err) {
    console.log("Lokales Payload bereit (Server nicht erreichbar):", collectedOffers.length, "Einträge.");
  }
}

harvestAllPlatforms();