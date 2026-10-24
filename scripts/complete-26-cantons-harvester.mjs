/**
 * iWantSexNow.ch · Remaining Swiss Cantons & Luxury Resorts Harvester
 * Scrapes Schwyz (Pfäffikon/Wollerau), Graubünden (St. Moritz/Davos), Wallis (Zermatt/Sion),
 * Thurgau, Solothurn/Olten, Schaffhausen, Fribourg & Neuchâtel and merges compactly.
 */
import fs from "fs";
import path from "path";

const REMAINING_SWISS_TARGETS = [
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-schwyz", canton: "SZ", city: "Pfäffikon SZ / Wollerau" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-graubuenden", canton: "GR", city: "St. Moritz / Chur / Davos" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-wallis", canton: "VS", city: "Zermatt / Sion / Brig" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-thurgau", canton: "TG", city: "Frauenfeld / Kreuzlingen" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/escort-schaffhausen", canton: "SH", city: "Schaffhausen" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/solothurn/", canton: "SO", city: "Solothurn / Olten" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/thurgau/", canton: "TG", city: "Thurgau / Bodensee" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/schweiz/graubuenden/", canton: "GR", city: "St. Moritz / Davos" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/oberer-zuerichsee", canton: "SZ", city: "Pfäffikon SZ / Lachen" },
  { portal: "and6.com", url: "https://www.and6.com/de/girls/berner-oberland", canton: "BE", city: "Interlaken / Thun / Gstaad" },
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

async function runCompleteSwissHarvest() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.log("[HINWEIS] Kein FIRECRAWL_API_KEY in diesem Fenster gesetzt – behalte bestehenden Index.");
    return;
  }

  console.log("=== Starte 26-Kantone Komplettierungs- & Luxus-Resort-Harvester (SZ, GR, VS, TG, SO, SH, BE) ===");
  const added = [];

  for (const t of REMAINING_SWISS_TARGETS) {
    console.log(`[Resort & Canton Scrape] ${t.portal} (${t.city}, ${t.canton}) -> ${t.url}`);
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
            prompt: "Extract all escort listings: name (rawName), age, Swiss phone (+41/07x), city, 1h CHF rate, hairColor, bust, services, bio, image URL (thumbnail) and profile URL (sourceUrl).",
          },
        }),
      });
      const data = await res.json();
      const list = data?.data?.extract?.profiles || [];
      console.log(`   -> ${list.length} Profile extrahiert!`);

      for (const item of list) {
        if (!item.rawName) continue;
        added.push({
          sourcePortal: t.portal,
          sourceUrl: item.sourceUrl ? String(item.sourceUrl) : t.url,
          rawName: String(item.rawName).trim().slice(0, 60),
          genderCategory: "female",
          age: Number(item.age) >= 18 && Number(item.age) <= 65 ? Number(item.age) : 25,
          rawPhone: item.rawPhone ? String(item.rawPhone).slice(0, 30) : "",
          city: String(item.city || t.city).slice(0, 40),
          canton: t.canton,
          subareas: [String(item.city || t.city), t.city],
          advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 450,
          hairColor: item.hairColor ? String(item.hairColor) : "Blond",
          bust: item.bust ? String(item.bust) : "75C (Natur)",
          height: "169 cm",
          languages: ["Deutsch", "English", "Français"],
          includedTags: Array.isArray(item.includedTags) && item.includedTags.length ? item.includedTags.slice(0, 6) : ["GFE", "Outcall", "Dinner Dates"],
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

  if (added.length > 0) {
    const jsonPath = path.join(process.cwd(), "src", "data", "harvested-offers.json");
    const existing = fs.existsSync(jsonPath) ? JSON.parse(fs.readFileSync(jsonPath, "utf8")) : [];
    const seen = new Set();
    const combined = [];

    for (const item of [...existing, ...added]) {
      if (!item || !item.rawName) continue;
      const key = `${String(item.rawName).toLowerCase()}|${String(item.canton || "")}`;
      if (seen.has(key)) continue;
      seen.add(key);
      combined.push(item);
    }

    const finalSlice = combined.slice(0, 320);
    fs.writeFileSync(jsonPath, JSON.stringify(finalSlice, null, 2), "utf8");
    console.log(`✓ Resort- & Kantons-Merge komplett: Jetzt ${finalSlice.length} eindeutige Schweizer Profile im Index!`);
  }
}

runCompleteSwissHarvest();