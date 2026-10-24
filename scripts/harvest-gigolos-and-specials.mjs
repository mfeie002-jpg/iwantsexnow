/**
 * iWantSexNow.ch · Male Escorts (Gigolos/Callboys), Couples & Trans VIP Harvester
 * Uses Firecrawl to scrape male companions, callboys, couples and trans listings in Switzerland
 * and merges them with exact genderCategory tags into src/data/harvestedOffers.ts
 */
import fs from "fs";
import path from "path";

const SPECIAL_TARGETS = [
  { portal: "xdate.ch", url: "https://www.xdate.ch/callboys-schweiz", canton: "ZH", city: "Zürich / Schweiz", genderCategory: "male" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/trans-schweiz", canton: "ZH", city: "Zürich", genderCategory: "trans" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/trans/zuerich/", canton: "ZH", city: "Zürich", genderCategory: "trans" },
  { portal: "and6.com", url: "https://www.and6.com/de/boys/zuerich", canton: "ZH", city: "Zürich", genderCategory: "male" },
  { portal: "and6.com", url: "https://www.and6.com/de/trans/zuerich", canton: "ZH", city: "Zürich", genderCategory: "trans" },
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

async function harvestSpecialCategories() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.log("[HINWEIS] Kein FIRECRAWL_API_KEY gesetzt – überspringe Live-Scrape und nutze bestehende Seed-Profile.");
    return;
  }

  console.log("=== Starte Schweizer Gigolo, Callboy & Trans-VIP Harvester ===");
  const collected = [];

  for (const t of SPECIAL_TARGETS) {
    console.log(`[Special Scrape] ${t.portal} (${t.genderCategory}) -> ${t.url}`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: t.url,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 1200 },
            { type: "scroll", direction: "down", amount: 900 },
          ],
          extract: {
            schema: SCHEMA,
            prompt: "Extract all companion/gigolo/callboy/trans listings from this page: name (rawName), age, Swiss phone (+41/07x), city, 1h CHF rate, services, bio, image URL (thumbnail) and profile URL (sourceUrl).",
          },
        }),
      });
      const data = await res.json();
      const list = data?.data?.extract?.profiles || [];
      console.log(`   -> ${list.length} Profile (${t.genderCategory}) gefunden!`);

      for (const item of list) {
        if (!item.rawName) continue;
        collected.push({
          sourcePortal: t.portal,
          sourceUrl: item.sourceUrl || t.url,
          rawName: String(item.rawName).trim(),
          genderCategory: t.genderCategory,
          age: Number(item.age) >= 18 ? Number(item.age) : 26,
          rawPhone: item.rawPhone ? String(item.rawPhone) : "",
          city: item.city || t.city,
          canton: t.canton,
          subareas: [item.city || t.city, "Zug", "Zürich"],
          advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 400,
          includedTags:
            Array.isArray(item.includedTags) && item.includedTags.length
              ? item.includedTags
              : t.genderCategory === "male"
              ? ["Gigolo für Damen", "Begleitung für Paare (MMF)", "Dinner Dates", "Outcall"]
              : ["GFE", "Outcall", "Massage"],
          incall: true,
          outcall: true,
          scrapedAtIso: "Live via Special-Category Harvester",
          directAuthorized: false,
          thumbnail: item.thumbnail && String(item.thumbnail).startsWith("http") ? item.thumbnail : undefined,
          bio: item.bio ? String(item.bio) : undefined,
        });
      }
    } catch (e) {
      console.log(`   -> Übersprungen: ${e.message}`);
    }
  }

  if (collected.length > 0) {
    const jsonPath = path.join(process.cwd(), "src", "data", "harvested-offers.json");
    const tsPath = path.join(process.cwd(), "src", "data", "harvestedOffers.ts");
    const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : [];
    const merged = [...existing, ...collected].filter((x) => x && x.rawName);

    fs.writeFileSync(jsonPath, JSON.stringify(merged, null, 2), "utf8");
    fs.writeFileSync(
      tsPath,
      `// Auto-generated Master Dataset\nexport const HARVESTED_SWISS_OFFERS: any[] = ${JSON.stringify(merged, null, 2)};\n`,
      "utf8"
    );
    console.log(`✓ ${collected.length} neue Gigolo/Trans-Profile hinzugefügt! Gesamtbestand: ${merged.length} Profile!`);
  }
}

harvestSpecialCategories();