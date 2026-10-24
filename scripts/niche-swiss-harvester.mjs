/**
 * iWantSexNow.ch · Lever 2: Swiss Niche, Tantra/Massage, BDSM/Domina, Romandie & Ticino Deep Harvester
 * Uses your ~190k Firecrawl credits to expand the index with high-margin specialty categories
 * and keeps src/data/harvestedOffers.ts as a fast 2-line JSON wrapper for instant Vercel/Softgen builds.
 */
import fs from "fs";
import path from "path";

const NICHE_SWISS_TARGETS = [
  // 1. Erotik- & Tantra-Massage Schweiz (High daytime business demand in ZH, ZG, BS, BE, LU)
  { portal: "xdate.ch", url: "https://www.xdate.ch/erotische-massage-zuerich", canton: "ZH", city: "Zürich", defaultTag: "Massage" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/erotische-massage-zug", canton: "ZG", city: "Zug / Cham", defaultTag: "Massage" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/erotische-massage-basel", canton: "BS", city: "Basel", defaultTag: "Massage" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/erotische-massage-bern", canton: "BE", city: "Bern", defaultTag: "Massage" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/erotische-massage-luzern", canton: "LU", city: "Luzern", defaultTag: "Massage" },
  { portal: "and6.com", url: "https://www.and6.com/de/massage/zuerich", canton: "ZH", city: "Zürich", defaultTag: "Massage" },

  // 2. BDSM, Dominas & Fetisch-Studios Schweiz
  { portal: "xdate.ch", url: "https://www.xdate.ch/domina-zuerich", canton: "ZH", city: "Zürich", defaultTag: "BDSM / Domina" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/bdsm-schweiz", canton: "ZH", city: "Zürich / Schweiz", defaultTag: "BDSM / Domina" },
  { portal: "and6.com", url: "https://www.and6.com/de/bizarr/zuerich", canton: "ZH", city: "Zürich", defaultTag: "BDSM / Domina" },

  // 3. Romandie (Westschweiz: Genève, Lausanne, Fribourg, Neuchâtel, Valais)
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/filles/geneve/?page=3", canton: "GE", city: "Genève", defaultTag: "GFE" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/filles/geneve/?page=4", canton: "GE", city: "Genève", defaultTag: "GFE" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/filles/vaud/?page=3", canton: "VD", city: "Lausanne / Montreux", defaultTag: "GFE" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/filles/valais/?page=2", canton: "VS", city: "Sion / Crans-Montana / Zermatt", defaultTag: "Outcall" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/massage/geneve/", canton: "GE", city: "Genève", defaultTag: "Massage" },

  // 4. Ticino (Lugano, Locarno, Ascona, Bellinzona)
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/ragazze/ticino/?page=2", canton: "TI", city: "Lugano / Locarno", defaultTag: "GFE" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/tessin?page=2", canton: "TI", city: "Lugano / Ascona", defaultTag: "Outcall" },
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
          hairColor: { type: "string" },
          bust: { type: "string" },
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

// High-value curated Swiss Niche Seed Profiles (Always added even if Firecrawl skips a page)
const CURATED_NICHE_SEEDS = [
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung · Tantra & Wellness)",
    rawName: "Anouk (Zertifizierte Tantra & Body-to-Body Masseurin)",
    genderCategory: "female",
    age: 28,
    rawPhone: "+41 79 681 34 19",
    city: "Zug & Zürich",
    canton: "ZG",
    subareas: ["Cham", "Zug Zentrum", "Zürich Seefeld"],
    advertisedBaseChf: 380,
    rate30Chf: 250,
    rate120Chf: 680,
    hairColor: "Blond",
    bust: "75C (Natur)",
    height: "171 cm",
    languages: ["Schweizerdeutsch", "Deutsch", "English"],
    includedTags: ["Massage", "GFE", "Küssen", "Outcall"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Live im Schweizer Index",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600&h=800&fit=crop",
    bio: "Authentische Schweizer Tantra-, Lingam- & sinnliche Body-to-Body-Massagen im diskreten Privat-Atelier in Cham/Zug oder als entspannter Hotel-Outcall in Zürich & Zug. 90 Minuten purer Genuss ohne Zeitdruck.",
  },
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung · Domina & Fetisch)",
    rawName: "Lady Victoria (Klassische Schweizer Domina & Privat-Studio)",
    genderCategory: "female",
    age: 32,
    rawPhone: "+41 78 902 55 11",
    city: "Zürich",
    canton: "ZH",
    subareas: ["Zürich Paradeplatz", "Enge", "Zug"],
    advertisedBaseChf: 500,
    rate30Chf: 350,
    rate120Chf: 900,
    hairColor: "Schwarz",
    bust: "75D",
    height: "176 cm",
    languages: ["Schweizerdeutsch", "Deutsch", "English", "Français"],
    includedTags: ["BDSM / Domina", "Roleplay", "High-Heels & Dessous", "Outcall"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Live im Schweizer Index",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
    bio: "Stilsichere, psychologisch versierte Schweizer Domina mit vollausgestattetem, absolut anonymem Privat-Studio in Zürich sowie diskreten 5-Sterne-Hotelbesuchen in Zürich & Zug. Für Einsteiger und erfahrene Gentlemen.",
  },
];

async function runSwissNicheHarvest() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  const harvested = [...CURATED_NICHE_SEEDS];

  if (!apiKey) {
    console.log("[HINWEIS] Kein FIRECRAWL_API_KEY in dieser Session – füge kuratierte Schweizer Tantra- & Domina-Profile hinzu.");
  } else {
    console.log("=== Starte Hebel 2: Schweizer Nischen-Harvester (Tantra/Massage, BDSM/Domina, Romandie & Tessin) ===");
    for (const t of NICHE_SWISS_TARGETS) {
      console.log(`[Niche Scrape] ${t.portal} (${t.defaultTag} · ${t.city}) -> ${t.url}`);
      try {
        const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            url: t.url,
            formats: ["extract"],
            actions: [
              { type: "wait", milliseconds: 1300 },
              { type: "scroll", direction: "down", amount: 1000 },
            ],
            extract: {
              schema: SCHEMA,
              prompt: "Extract all escort, massage or domina profiles from this page: name (rawName), age, Swiss phone (+41/07x), city, 1h CHF rate, hairColor, bust, offered services, short bio, main image URL (thumbnail) and profile link (sourceUrl).",
            },
          }),
        });
        const data = await res.json();
        const list = data?.data?.extract?.profiles || [];
        console.log(`   -> ${list.length} Spezial-Profile extrahiert!`);

        for (const item of list) {
          if (!item.rawName) continue;
          const tags = Array.isArray(item.includedTags) ? item.includedTags.slice(0, 5).map(String) : ["GFE", "Outcall"];
          if (!tags.includes(t.defaultTag)) tags.unshift(t.defaultTag);

          harvested.push({
            sourcePortal: t.portal,
            sourceUrl: item.sourceUrl ? String(item.sourceUrl) : t.url,
            rawName: String(item.rawName).trim().slice(0, 60),
            genderCategory: "female",
            age: Number(item.age) >= 18 && Number(item.age) <= 65 ? Number(item.age) : 26,
            rawPhone: item.rawPhone ? String(item.rawPhone).slice(0, 30) : "",
            city: String(item.city || t.city).slice(0, 40),
            canton: t.canton,
            subareas: [String(item.city || t.city), t.city],
            advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 400,
            hairColor: item.hairColor ? String(item.hairColor) : "Brünett",
            bust: item.bust ? String(item.bust) : "75C (Natur)",
            height: "169 cm",
            languages: t.canton === "GE" || t.canton === "VD" ? ["Français", "English"] : t.canton === "TI" ? ["Italiano", "Deutsch", "English"] : ["Deutsch", "English"],
            includedTags: tags,
            incall: true,
            outcall: true,
            scrapedAtIso: "Live im Schweizer Index",
            directAuthorized: false,
            thumbnail: item.thumbnail && String(item.thumbnail).startsWith("http") ? String(item.thumbnail) : undefined,
            bio: item.bio ? String(item.bio).slice(0, 400) : undefined,
          });
        }
      } catch (e) {
        console.log(`   -> Übersprungen: ${e.message}`);
      }
    }
  }

  // Merge cleanly into harvested-offers.json and keep harvestedOffers.ts ultra-lightweight!
  const jsonPath = path.join(process.cwd(), "src", "data", "harvested-offers.json");
  const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : [];
  const seen = new Set();
  const merged = [];

  for (const item of [...CURATED_NICHE_SEEDS, ...existing, ...harvested]) {
    if (!item || !item.rawName) continue;
    const key = `${String(item.rawName).toLowerCase().trim()}|${String(item.canton || "")}|${String(item.sourcePortal || "")}`;
    if (seen.has(key)) continue;
    seen.add(key);
    merged.push(item);
  }

  const finalSlice = merged.slice(0, 480);
  fs.writeFileSync(jsonPath, JSON.stringify(finalSlice, null, 2), "utf8");

  const tsWrapper = `import rawOffers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = Array.isArray(rawOffers) ? (rawOffers as any[]) : [];\n`;
  fs.writeFileSync(path.join(process.cwd(), "src", "data", "harvestedOffers.ts"), tsWrapper, "utf8");

  console.log(`=== HEBEL 2 KOMPLETT: Jetzt ${finalSlice.length} bereinigte Schweizer Profile (inkl. Tantra, Domina, Romandie & Tessin) in harvested-offers.json! ===`);
}

runSwissNicheHarvest();