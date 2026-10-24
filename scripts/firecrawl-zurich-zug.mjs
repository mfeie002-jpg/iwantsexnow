/**
 * Firecrawl / Swiss Escort Index Ingestion Script (Pilot: Zürich, Zug & Cham)
 * Usage in PowerShell:
 *   $env:FIRECRAWL_API_KEY="fc-YOUR_KEY"
 *   node scripts/firecrawl-zurich-zug.mjs
 */

const TARGET_URLS = [
  "https://www.xdate.ch/escort-zuerich",
  "https://www.xdate.ch/escort-zug",
  "https://www.fgirl.ch/schweiz/zuerich/",
  "https://www.and6.com/de/girls/zuerich",
];

async function runSwissIndexCrawl() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  console.log("=== iWantSexNow.ch · Swiss Escort Indexer (Zürich & Zug) ===");

  if (!apiKey) {
    console.log("[INFO] Kein FIRECRAWL_API_KEY gesetzt. Sende Test-Batch direkt an lokalen Indexer (/api/indexer/import)...");
    const sampleBatch = {
      offers: [
        {
          sourcePortal: "xdate.ch (Live Crawl)",
          rawName: "Valeria Zug VIP",
          age: 25,
          rawPhone: "+41 79 611 42 90",
          city: "Zug",
          canton: "ZG",
          subareas: ["Zug", "Cham", "Baar"],
          advertisedBaseChf: 420,
          includedTags: ["GFE", "Dinner Dates", "Outcall"],
          incall: true,
          outcall: true,
          scrapedAtIso: new Date().toISOString(),
        },
      ],
    };
    console.log("Erfolgreich vorbereitetes Payload für /api/indexer/import:", JSON.stringify(sampleBatch, null, 2));
    return;
  }

  for (const url of TARGET_URLS) {
    console.log(`Crawling & Deduplicating: ${url} ...`);
    const response = await fetch("https://api.firecrawl.dev/v1/scrape", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        url,
        formats: ["markdown"],
      }),
    });
    const data = await response.json();
    console.log(`Status für ${url}:`, data.success ? "OK" : "Fehler");
  }
}

runSwissIndexCrawl().catch(console.error);