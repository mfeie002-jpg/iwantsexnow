/**
 * iWantSexNow.ch · Option 2: Deep-Profile Subpage Enricher (Galleries + +41 Phones + Exact Rates)
 * Visits individual profile URLs (sourceUrl) inside src/data/harvested-offers.json,
 * triggers browser actions to reveal hidden phone numbers & lazy-loaded gallery images,
 * and enriches your existing profiles in-place without bloating bundle memory!
 */
import fs from "fs";
import path from "path";

const DETAIL_SCHEMA = {
  type: "object",
  properties: {
    revealedPhone: { type: "string" },
    galleryUrls: { type: "array", items: { type: "string" } },
    fullBio: { type: "string" },
    rate30Chf: { type: "number" },
    rate60Chf: { type: "number" },
    rate120Chf: { type: "number" },
    hairColor: { type: "string" },
    bust: { type: "string" },
    height: { type: "string" },
    languages: { type: "array", items: { type: "string" } },
    allServices: { type: "array", items: { type: "string" } },
  },
};

// Extra direct discovery pages to pull fresh profile detail links if some items only had category URLs
const DISCOVERY_LINK_PAGES = [
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-zug", canton: "ZG", city: "Zug" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-zuerich", canton: "ZH", city: "Zürich" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/zuerich/", canton: "ZH", city: "Zürich" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/zentralschweiz", canton: "ZG", city: "Zug / Cham" },
];

async function runDeepProfileEnricher() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  const jsonPath = path.join(process.cwd(), "src", "data", "harvested-offers.json");

  if (!fs.existsSync(jsonPath)) {
    console.log("Keine harvested-offers.json gefunden.");
    return;
  }

  const offers = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
  console.log(`=== Deep-Profile Gallery & +41 Phone Enricher · Prüfe ${offers.length} Schweizer Profile ===`);

  if (!apiKey) {
    console.log("[HINWEIS] Bitte setze $env:FIRECRAWL_API_KEY='fc-...' in diesem PowerShell-Fenster für den Live-Deep-Scrape!");
    return;
  }

  // Step 1: Find profiles that have a specific profile sourceUrl and still need more gallery photos or a +41 phone
  const candidates = offers.filter((o) => {
    const url = String(o.sourceUrl || "");
    const isSpecificSubpage =
      url.startsWith("http") &&
      url.split("/").filter(Boolean).length >= 3 &&
      !url.endsWith("/escort-zuerich") &&
      !url.endsWith("/zuerich/");
    const needsGallery = !Array.isArray(o.gallery) || o.gallery.length < 3;
    const needsPhone = !o.rawPhone || String(o.rawPhone).replace(/\D/g, "").length < 8;
    return isSpecificSubpage && (needsGallery || needsPhone);
  });

  console.log(`-> ${candidates.length} Einzelprofil-Unterseiten für Deep-Enrichment (Galerie + Telefon) ausgewählt...`);

  let enrichedCount = 0;
  // Process up to 30 deep subpages per run so it finishes within ~45-60 seconds
  for (const item of candidates.slice(0, 30)) {
    console.log(`[Deep Subpage Scrape] ${item.rawName} (${item.city}) -> ${item.sourceUrl}`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          url: item.sourceUrl,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 1200 },
            { type: "scroll", direction: "down", amount: 900 },
            { type: "wait", milliseconds: 600 },
          ],
          extract: {
            schema: DETAIL_SCHEMA,
            prompt:
              "Extract from this individual escort profile page: 1) Swiss phone number (+41 or 079/078/077/076) as revealedPhone, 2) all high-resolution profile photo URLs as galleryUrls (up to 8 images), 3) full description text as fullBio, 4) rates in CHF for 30min, 60min, 120min, 5) hairColor, bust, height, languages, and all offered services.",
          },
        }),
      });

      const data = await res.json();
      const ext = data?.data?.extract;
      if (!ext) continue;

      if (ext.revealedPhone && String(ext.revealedPhone).replace(/\D/g, "").length >= 8) {
        item.rawPhone = String(ext.revealedPhone).trim().slice(0, 30);
      }

      if (Array.isArray(ext.galleryUrls) && ext.galleryUrls.length > 0) {
        const validImgs = ext.galleryUrls
          .filter((u) => typeof u === "string" && u.startsWith("http") && !u.includes("logo") && !u.includes("icon"))
          .slice(0, 6);
        if (validImgs.length > 0) {
          item.gallery = Array.from(new Set([item.thumbnail, ...validImgs].filter(Boolean))).slice(0, 6);
          if (!item.thumbnail) item.thumbnail = validImgs[0];
        }
      }

      if (ext.fullBio && String(ext.fullBio).length > 40) {
        item.bio = String(ext.fullBio).trim().slice(0, 420);
      }
      if (Number(ext.rate30Chf) >= 100 && Number(ext.rate30Chf) <= 1000) item.rate30Chf = Number(ext.rate30Chf);
      if (Number(ext.rate60Chf) >= 150 && Number(ext.rate60Chf) <= 1500) item.advertisedBaseChf = Number(ext.rate60Chf);
      if (Number(ext.rate120Chf) >= 250 && Number(ext.rate120Chf) <= 3000) item.rate120Chf = Number(ext.rate120Chf);
      if (ext.hairColor) item.hairColor = String(ext.hairColor).slice(0, 25);
      if (ext.bust) item.bust = String(ext.bust).slice(0, 25);
      if (ext.height) item.height = String(ext.height).slice(0, 20);
      if (Array.isArray(ext.allServices) && ext.allServices.length >= 2) {
        item.includedTags = ext.allServices.slice(0, 7).map(String);
      }

      enrichedCount++;
      console.log(
        `   ✓ Angereichert: Tel=${item.rawPhone || "maskiert"} | Galerie=${(item.gallery || []).length} Fotos | 1h=CHF ${item.advertisedBaseChf}`
      );
    } catch (e) {
      console.log(`   -> Übersprungen: ${e.message}`);
    }
  }

  // Save enriched dataset cleanly back to harvested-offers.json and keep lightweight TS wrapper
  fs.writeFileSync(jsonPath, JSON.stringify(offers, null, 2), "utf8");
  const tsWrapper = `import rawOffers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = Array.isArray(rawOffers) ? (rawOffers as any[]) : [];\n`;
  fs.writeFileSync(path.join(process.cwd(), "src", "data", "harvestedOffers.ts"), tsWrapper, "utf8");

  console.log(`=== DEEP ENRICHMENT KOMPLETT: ${enrichedCount} Profile mit echten Galerien, +41 Nummern & Detail-Tarifen aufgerüstet! ===`);
}

runDeepProfileEnricher();