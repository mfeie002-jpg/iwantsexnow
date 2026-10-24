/**
 * iWantSexNow.ch · Firecrawl v2 API (/v2/search & /v2/scrape) Swiss Discreet Hotel & Day-Use Harvester
 * Uses the new Firecrawl v2 API from your documentation to discover Swiss day-use hotels & serviced apartments.
 */
import fs from "fs";
import path from "path";

const HOTEL_SEARCH_QUERIES = [
  "dayuse hotel zürich tageszimmer diskret",
  "dayuse hotel zug baar cham",
  "serviced apartments zürich self check in",
  "boutique hotel basel day use",
];

async function runFirecrawlV2HotelSearch() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  console.log("=== Testing Firecrawl v2 API (/v2/search) for Swiss Discreet Day-Use Hotels & Apartments ===");

  const headers = { "Content-Type": "application/json" };
  if (apiKey) headers["Authorization"] = `Bearer ${apiKey}`;

  const discoveredHotels = [];

  for (const query of HOTEL_SEARCH_QUERIES) {
    try {
      const res = await fetch("https://api.firecrawl.dev/v2/search", {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          limit: 5,
        }),
      });
      const json = await res.json();
      const webHits = json?.data?.web || json?.data || [];
      if (Array.isArray(webHits)) {
        console.log(`✓ [v2/search] "${query}" -> ${webHits.length} Schweizer Hotel-Treffer geladen`);
        for (const h of webHits) {
          if (h?.url && h?.title) {
            discoveredHotels.push({
              title: h.title,
              url: h.url,
              description: h.description || "",
              query,
            });
          }
        }
      }
    } catch (e) {
      console.log(`   -> v2/search Hinweis: ${e.message}`);
    }
  }

  if (discoveredHotels.length > 0) {
    const outPath = path.join(process.cwd(), "src", "data", "harvested-hotels-v2.json");
    fs.writeFileSync(outPath, JSON.stringify(discoveredHotels, null, 2), "utf8");
    console.log(`✓ ${discoveredHotels.length} Live-Hotel-Quellen in src/data/harvested-hotels-v2.json gespeichert!`);
  }
}

runFirecrawlV2HotelSearch();