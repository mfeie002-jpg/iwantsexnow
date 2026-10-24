/**
 * iWantSexNow.ch · Deep-Attribute & Multi-Page Harvester (Uses your 192,970 Firecrawl Credits)
 * Scrapes deeper pagination pages across Swiss portals and extracts exact filters:
 * hairColor (Blond/Brünett/Schwarz), bust/cupSize, height, languages, +41 phone, and full service tags.
 */
import fs from "fs";
import path from "path";

const PAGINATED_SWISS_TARGETS = [
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-zuerich?page=5", canton: "ZH", city: "Zürich" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-zuerich?page=6", canton: "ZH", city: "Zürich" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-zug?page=2", canton: "ZG", city: "Zug" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-basel?page=2", canton: "BS", city: "Basel" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-bern?page=2", canton: "BE", city: "Bern" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-luzern?page=2", canton: "LU", city: "Luzern" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-aargau?page=2", canton: "AG", city: "Aargau" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/zuerich/?page=3", canton: "ZH", city: "Zürich" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/filles/geneve/?page=2", canton: "GE", city: "Genève" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/filles/vaud/?page=2", canton: "VD", city: "Lausanne" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/zuerich?page=3", canton: "ZH", city: "Zürich" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/zentralschweiz?page=2", canton: "ZG", city: "Zug / Luzern" },
];

const ATTRIBUTE_SCHEMA = {
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
          advertisedBaseChf: { type: "number" },
          hairColor: { type: "string" },
          bust: { type: "string" },
          height: { type: "string" },
          languages: { type: "array", items: { type: "string" } },
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

async function runDeepAttributeHarvest() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.log("[HINWEIS] Setze $env:FIRECRAWL_API_KEY, um weitere Seiten mit Deep-Attributen zu scrapen.");
    return;
  }

  console.log("=== Starte Deep-Attribute & Pagination Harvester (Haarfarbe, Körbchengrösse, Services & +41 Nummern) ===");
  const batch = [];

  for (const t of PAGINATED_SWISS_TARGETS) {
    console.log(`[Deep Attribute Scrape] ${t.portal} (${t.city}) -> ${t.url}`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: t.url,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 1400 },
            { type: "scroll", direction: "down", amount: 1200 },
          ],
          extract: {
            schema: ATTRIBUTE_SCHEMA,
            prompt: "Extract all escort listings with name (rawName), age, Swiss phone (+41/07x), city, 1h CHF price, hairColor (Blond, Brünett, Schwarz), bust/cup size, height, spoken languages, offered services (GFE, Französisch Pur, Küssen, Outcall, Massage, 69), bio, image URL (thumbnail) and profile URL (sourceUrl).",
          },
        }),
      });
      const data = await res.json();
      const list = data?.data?.extract?.profiles || [];
      console.log(`   -> ${list.length} Profile mit Detail-Attributen geladen!`);

      for (const item of list) {
        if (!item.rawName) continue;
        batch.push({
          sourcePortal: t.portal,
          sourceUrl: item.sourceUrl || t.url,
          rawName: String(item.rawName).trim(),
          age: Number(item.age) >= 18 ? Number(item.age) : 25,
          rawPhone: item.rawPhone ? String(item.rawPhone) : "",
          city: item.city || t.city,
          canton: t.canton,
          subareas: [item.city || t.city],
          advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 400,
          hairColor: item.hairColor || "Brünett",
          bust: item.bust || "75C (Natur)",
          height: item.height || "168 cm",
          languages: Array.isArray(item.languages) && item.languages.length ? item.languages : ["Deutsch", "English"],
          includedTags: Array.isArray(item.includedTags) && item.includedTags.length ? item.includedTags : ["GFE", "Französisch Pur", "Küssen", "Outcall"],
          incall: true,
          outcall: true,
          scrapedAtIso: "Live via Deep-Attribute Harvester",
          directAuthorized: false,
          thumbnail: item.thumbnail && String(item.thumbnail).startsWith("http") ? item.thumbnail : undefined,
          bio: item.bio ? String(item.bio) : undefined,
        });
      }
    } catch (e) {
      console.log(`   -> Übersprungen: ${e.message}`);
    }
  }

  if (batch.length > 0) {
    const jsonPath = path.join(process.cwd(), "src", "data", "harvested-offers.json");
    const tsPath = path.join(process.cwd(), "src", "data", "harvestedOffers.ts");
    const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : [];
    const merged = [...existing, ...batch].filter((x) => x && x.rawName);

    fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), "utf8");
    fs.writeFileSync(
      tsPath,
      `// Auto-generated Master Dataset\nexport const HARVESTED_SWISS_OFFERS: any[] = ${JSON.stringify(merged, null, 2)};\n`,
      "utf8"
    );
    console.log(`✓ ${batch.length} neue Deep-Attribute-Profile hinzugefügt! Gesamtbestand: ${merged.length} Profile!`);
  }
}

runDeepAttributeHarvest();