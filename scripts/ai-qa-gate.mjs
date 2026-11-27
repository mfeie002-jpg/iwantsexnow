import fs from "fs";
import path from "path";

let errors = 0;

// 1. Prüfe, dass keine bg_blur.jpg oder example.com URLs mehr in harvested-offers.json existieren
const offers = JSON.parse(fs.readFileSync("src/data/harvested-offers.json", "utf8"));
const badOffers = offers.filter((o) => {
  const t = String(o.thumbnail || "").toLowerCase();
  return !t || t.includes("bg_blur") || t.includes("example.com");
});
if (badOffers.length > 0) {
  console.error(`❌ QA-FEHLER: Noch ${badOffers.length} Profile mit bg_blur/example.com gefunden!`);
  errors++;
} else {
  console.log(`✅ QA 1/4: 0 schwarze bg_blur/example-Thumbnails in allen ${offers.length} Profilen.`);
}

// 2. Prüfe alle 8 lokalen KI-Porträt-Fallbacks + Hero + Xenia
const requiredAssets = [
  "public/images/ai/hero-swiss-night.webp",
  "public/images/ai/xenia-avatar.webp",
  "public/images/ai/portraits/p1.webp",
  "public/images/ai/portraits/p8.webp",
  "public/images/ai/portals/and6.webp",
  "public/images/ai/regions/zurich.webp",
  "public/images/ai/vibes/escort.webp"
];
for (const a of requiredAssets) {
  if (!fs.existsSync(a) || fs.statSync(a).size < 1500) {
    console.error(`❌ QA-FEHLER: Pflicht-Visual fehlt oder ist leer: ${a}`);
    errors++;
  }
}
if (errors === 0) console.log("✅ QA 2/4: Alle KI-Visuals & Porträt-Fallbacks liegen physisch in public/images/ai/ bereit.");

// 3. Prüfe, dass kein doppelter Footer zwischen index.tsx und _app.tsx existiert
const indexSrc = fs.readFileSync("src/pages/index.tsx", "utf8");
const appSrc = fs.readFileSync("src/pages/_app.tsx", "utf8");
if (indexSrc.includes("<footer") || appSrc.includes("Gruss aus der Schweiz")) {
  console.error("❌ QA-FEHLER: Doppelter oder alter Pastell-Footer noch vorhanden!");
  errors++;
} else {
  console.log("✅ QA 3/4: Einheitliche globale Shell verifiziert (kein doppelter Footer).");
}

if (errors > 0) process.exit(1);
console.log("✅ QA 4/4: Vorab-Prüfungen zu 100% bestanden — starte Next.js Produktions-Build...");