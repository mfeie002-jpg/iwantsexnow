import fs from "fs";
import path from "path";

const jsonPath = path.join(process.cwd(), "src", "data", "harvested-offers.json");
let raw = [];
try {
  raw = JSON.parse(fs.readFileSync(jsonPath, "utf8"));
} catch {
  raw = [];
}

const seen = new Set();
const cleaned = [];
for (const item of raw) {
  if (!item || !item.rawName) continue;
  const key = `${String(item.rawName).toLowerCase().trim()}|${String(item.sourcePortal || "")}|${String(item.city || "")}`;
  if (seen.has(key)) continue;
  seen.add(key);
  cleaned.push({
    sourcePortal: String(item.sourcePortal || "xdate.ch"),
    sourceUrl: item.sourceUrl ? String(item.sourceUrl) : undefined,
    rawName: String(item.rawName).trim().slice(0, 60),
    genderCategory: item.genderCategory || "female",
    age: Number(item.age) >= 18 && Number(item.age) <= 65 ? Number(item.age) : 25,
    rawPhone: item.rawPhone ? String(item.rawPhone).slice(0, 30) : "",
    city: String(item.city || "Zürich").slice(0, 40),
    canton: String(item.canton || "ZH").slice(0, 4),
    subareas: Array.isArray(item.subareas) ? item.subareas.slice(0, 4).map(String) : [String(item.city || "Zürich")],
    advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 400,
    rate30Chf: Number(item.rate30Chf) >= 100 ? Number(item.rate30Chf) : undefined,
    rate120Chf: Number(item.rate120Chf) >= 250 ? Number(item.rate120Chf) : undefined,
    hairColor: item.hairColor ? String(item.hairColor) : "Brünett",
    bust: item.bust ? String(item.bust) : "75C (Natur)",
    height: item.height ? String(item.height) : "168 cm",
    languages: Array.isArray(item.languages) ? item.languages.slice(0, 4).map(String) : ["Deutsch", "English"],
    includedTags: Array.isArray(item.includedTags) ? item.includedTags.slice(0, 6).map(String) : ["GFE", "Outcall"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Live im Schweizer Index",
    directAuthorized: Boolean(item.directAuthorized),
    thumbnail: item.thumbnail && String(item.thumbnail).startsWith("http") ? String(item.thumbnail) : undefined,
    gallery: Array.isArray(item.gallery) ? item.gallery.filter((u) => String(u).startsWith("http")).slice(0, 5) : [],
    bio: item.bio ? String(item.bio).slice(0, 420) : undefined,
  });
}

const finalSlice = cleaned.slice(0, 260);
fs.writeFileSync(jsonPath, JSON.stringify(finalSlice, null, 2), "utf8");

// Write ultra-lightweight TS wrapper so TypeScript compiler never runs out of memory!
const tsWrapper = `import rawOffers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = Array.isArray(rawOffers) ? (rawOffers as any[]) : [];\n`;
fs.writeFileSync(path.join(process.cwd(), "src", "data", "harvestedOffers.ts"), tsWrapper, "utf8");
console.log(`✓ JSON bereinigt (${finalSlice.length} eindeutige Profile) & TypeScript-Speicherbremse gelöst!`);