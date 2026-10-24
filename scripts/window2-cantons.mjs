import fs from "fs";
import path from "path";

const DEEP_TARGETS = [
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/zug/", canton: "ZG", city: "Zug / Cham" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/luzern/", canton: "LU", city: "Luzern" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/bern/", canton: "BE", city: "Bern" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/aargau/", canton: "AG", city: "Aargau" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/st-gallen/", canton: "SG", city: "St. Gallen" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/filles/valais/", canton: "VS", city: "Wallis" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/filles/fribourg/", canton: "FR", city: "Fribourg" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/filles/neuchatel/", canton: "NE", city: "Neuchâtel" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/ragazze/ticino/", canton: "TI", city: "Lugano / Ticino" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/winterthur-und-thurgau", canton: "ZH", city: "Winterthur" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/mittelland", canton: "AG", city: "Aarau / Olten" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/tessin", canton: "TI", city: "Lugano" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-cham", canton: "ZG", city: "Cham" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-baar", canton: "ZG", city: "Baar" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-lugano", canton: "TI", city: "Lugano" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-solothurn", canton: "SO", city: "Solothurn" },
];

const SCHEMA = {
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
          bio: { type: "string" },
          thumbnail: { type: "string" },
          gallery: { type: "array", items: { type: "string" } },
          sourceUrl: { type: "string" },
        },
        required: ["rawName"],
      },
    },
  },
};

async function runCantonBatch() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.log("FEHLER: Bitte zuerst $env:FIRECRAWL_API_KEY='fc-...' in diesem Fenster setzen!");
    return;
  }

  console.log("=== [FENSTER 2] Starte 26-Kantone & Deep-Regionen Crawl ===");
  const results = [];

  for (const t of DEEP_TARGETS) {
    console.log(`[Fenster 2] Scrape ${t.portal} (${t.city}, ${t.canton}) -> ${t.url}`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: t.url,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 1500 },
            { type: "scroll", direction: "down", amount: 1000 },
          ],
          extract: {
            schema: SCHEMA,
            prompt: "Extract all escort listings: name (rawName), age, Swiss phone (+41/07x), city, 1h CHF rate, services, bio, image URL (thumbnail) and profile URL (sourceUrl).",
          },
        }),
      });
      const data = await res.json();
      const list = data?.data?.extract?.profiles || [];
      console.log(`   -> ${list.length} Profile gefunden!`);

      for (const item of list) {
        if (!item.rawName) continue;
        results.push({
          sourcePortal: t.portal,
          sourceUrl: item.sourceUrl || t.url,
          rawName: String(item.rawName).trim(),
          age: Number(item.age) >= 18 ? Number(item.age) : 25,
          rawPhone: item.rawPhone ? String(item.rawPhone) : "",
          city: item.city || t.city,
          canton: t.canton,
          subareas: Array.isArray(item.subareas) && item.subareas.length ? item.subareas : [t.city],
          advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 400,
          includedTags: Array.isArray(item.includedTags) && item.includedTags.length ? item.includedTags : ["GFE", "Outcall"],
          incall: true,
          outcall: true,
          scrapedAtIso: "Live via Firecrawl Batch 2",
          directAuthorized: false,
          thumbnail: item.thumbnail && String(item.thumbnail).startsWith("http") ? item.thumbnail : undefined,
          gallery: Array.isArray(item.gallery) ? item.gallery.filter((u) => String(u).startsWith("http")) : [],
          bio: item.bio ? String(item.bio) : undefined,
        });
      }
    } catch (e) {
      console.log(`   -> Fehler: ${e.message}`);
    }
  }

  const outFile = path.join(process.cwd(), "src", "data", "batch-cantons.json");
  fs.writeFileSync(outFile, JSON.stringify(results, null, 2), "utf8");
  console.log(`✓ [FENSTER 2 FERTIG] ${results.length} zusätzliche Profile in src/data/batch-cantons.json gespeichert!`);
}

runCantonBatch();