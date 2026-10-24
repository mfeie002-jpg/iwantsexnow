/**
 * iWantSexNow.ch · Google Top-50 SERP & Domain-Map Harvester (Firecrawl /search + /map + /scrape)
 * 1. Searches Google.ch for top Swiss escort queries (Zürich, Zug, Cham, Basel, Bern, Luzern, St. Gallen, Geneva, etc.)
 * 2. Discovers all ranking portals, agency sites, and independent escort pages
 * 3. Extracts structured profiles, +41 phones, rates, galleries & bios and merges them into harvestedOffers.ts
 */
import fs from "fs";
import path from "path";

const SWISS_GOOGLE_QUERIES = [
  "escort zug",
  "escort cham baar",
  "escort zürich",
  "escort oerlikon kloten",
  "escort winterthur",
  "escort luzern",
  "escort basel",
  "escort bern",
  "escort st gallen",
  "escort aargau baden",
  "escort lugano ticino",
  "escort geneve lausanne",
  "sex4u.ch escort",
  "6navi.ch girls",
  "bemygirl.ch zurich",
  "facegirl.ch geneve",
];

const EXTRA_PORTAL_URLS = [
  { portal: "sex4u.ch", url: "https://www.sex4u.ch/de/escort", canton: "ZH", city: "Zürich" },
  { portal: "6navi.ch", url: "https://www.6navi.ch/escort-service", canton: "ZH", city: "Zürich" },
  { portal: "bemygirl.ch", url: "https://www.bemygirl.ch/de/escorts-zurich/", canton: "ZH", city: "Zürich" },
  { portal: "facegirl.ch", url: "https://www.facegirl.ch/", canton: "GE", city: "Genève" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-zuerich?page=3", canton: "ZH", city: "Zürich" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-zuerich?page=4", canton: "ZH", city: "Zürich" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/zuerich/?page=2", canton: "ZH", city: "Zürich" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/zuerich?page=2", canton: "ZH", city: "Zürich" },
];

const PROFILE_SCHEMA = {
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
          canton: { type: "string" },
          advertisedBaseChf: { type: "number" },
          includedTags: { type: "array", items: { type: "string" } },
          bio: { type: "string" },
          thumbnail: { type: "string" },
          sourceUrl: { type: "string" },
        },
        required: ["rawName"],
      },
    },
  },
};

async function runGoogleSerpAndPortalHarvest() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.log("[HINWEIS] Bitte setze $env:FIRECRAWL_API_KEY='fc-...' um den Google-SERP Harvester zu starten.");
    return;
  }

  console.log("=== iWantSexNow.ch · Google Top-50 SERP & Multi-Portal Discovery Harvester ===");
  const discoveredUrls = new Set();
  const discoveredDomains = new Set();

  // Step 1: Query Firecrawl /v1/search across Swiss Google queries
  for (const q of SWISS_GOOGLE_QUERIES.slice(0, 8)) {
    console.log(`[Google SERP Scan] Suche Top-Ergebnisse für: "${q}" ...`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/search", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          query: q,
          limit: 10,
          lang: "de",
          country: "ch",
        }),
      });
      const data = await res.json();
      const hits = data?.data || [];
      for (const hit of hits) {
        if (hit.url && hit.url.startsWith("http")) {
          discoveredUrls.add(hit.url);
          try {
            discoveredDomains.add(new URL(hit.url).hostname.replace(/^www\./, ""));
          } catch {}
        }
      }
      console.log(`   -> ${hits.length} Google-Seiten gefunden (Gesamt-Domains: ${discoveredDomains.size})`);
    } catch (e) {
      console.log(`   -> SERP Info: ${e.message}`);
    }
  }

  // Save discovered SERP competitor domains for Admin Dashboard
  const serpReportPath = path.join(process.cwd(), "src", "data", "googleSerpDomains.json");
  fs.writeFileSync(
    serpReportPath,
    JSON.stringify(
      {
        scannedAt: new Date().toISOString(),
        totalDomainsFound: discoveredDomains.size,
        domains: Array.from(discoveredDomains),
        sampleUrls: Array.from(discoveredUrls).slice(0, 50),
      },
      null,
      2
    ),
    "utf8"
  );
  console.log(`✓ ${discoveredDomains.size} Schweizer Escort-Domains in src/data/googleSerpDomains.json protokolliert!`);

  // Step 2: Scrape the newly discovered portal pages + deep pagination targets
  const newOffers = [];
  for (const target of EXTRA_PORTAL_URLS) {
    console.log(`[Deep Portal Scrape] ${target.portal} -> ${target.url}`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: target.url,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 1500 },
            { type: "scroll", direction: "down", amount: 1200 },
          ],
          extract: {
            schema: PROFILE_SCHEMA,
            prompt: "Extract all escort/companion profiles from this page: name (rawName), age, Swiss phone (+41/07x), city, 1h CHF rate, services, short bio, main image URL (thumbnail) and profile link (sourceUrl).",
          },
        }),
      });
      const data = await res.json();
      const list = data?.data?.extract?.profiles || [];
      console.log(`   -> ${list.length} neue Profile extrahiert!`);

      for (const item of list) {
        if (!item.rawName) continue;
        newOffers.push({
          sourcePortal: target.portal,
          sourceUrl: item.sourceUrl || target.url,
          rawName: String(item.rawName).trim(),
          age: Number(item.age) >= 18 ? Number(item.age) : 25,
          rawPhone: item.rawPhone ? String(item.rawPhone) : "",
          city: item.city || target.city,
          canton: target.canton,
          subareas: [item.city || target.city],
          advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 400,
          includedTags: Array.isArray(item.includedTags) && item.includedTags.length ? item.includedTags : ["GFE", "Outcall"],
          incall: true,
          outcall: true,
          scrapedAtIso: "Live via Google-SERP Harvester",
          directAuthorized: false,
          thumbnail: item.thumbnail && String(item.thumbnail).startsWith("http") ? item.thumbnail : undefined,
          bio: item.bio ? String(item.bio) : undefined,
        });
      }
    } catch (e) {
      console.log(`   -> Übersprungen: ${e.message}`);
    }
  }

  // Merge with existing dataset without losing anything
  const jsonPath = path.join(process.cwd(), "src", "data", "harvested-offers.json");
  const tsPath = path.join(process.cwd(), "src", "data", "harvestedOffers.ts");
  const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : [];
  const merged = [...existing, ...newOffers].filter((x) => x && x.rawName);

  fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), "utf8");
  fs.writeFileSync(
    tsPath,
    `// Auto-generated Master Dataset\nexport const HARVESTED_SWISS_OFFERS: any[] = ${JSON.stringify(merged, null, 2)};\n`,
    "utf8"
  );
  console.log(`=== GOOGLE SERP & PORTAL MERGE KOMPLETT: Jetzt ${merged.length} Profile in harvestedOffers.ts! ===`);
}

runGoogleSerpAndPortalHarvest();