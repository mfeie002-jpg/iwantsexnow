import fs from "fs";
import path from "path";

const root = process.cwd();
const offersPath = path.join(root, "src", "data", "harvested-offers.json");
const clubsPath = path.join(root, "src", "data", "swiss-establishments-vault.json");

console.log("\n==============================================================");
console.log("   IWANTSEXNOW.CH — AKTUELLER FIRECRAWL DATEN-TRESOR AUDIT");
console.log("==============================================================");

if (fs.existsSync(offersPath)) {
  const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
  const byPortal = {};
  const byCanton = {};
  let withPrice = 0;
  let withPhone = 0;

  for (const item of offers) {
    const p = item.sourcePortal || "Unbekannt";
    const c = item.canton || "ZH";
    byPortal[p] = (byPortal[p] || 0) + 1;
    byCanton[c] = (byCanton[c] || 0) + 1;
    if (item.advertisedBaseChf) withPrice++;
    if (item.rawPhone && String(item.rawPhone).includes("+41")) withPhone++;
  }

  console.log(`• Gespeicherte Schnellstart-Profile (harvested-offers.json): ${offers.length}`);
  console.log(`• Davon mit veröffentlichtem Preis (CHF):                  ${withPrice} (${Math.round((withPrice / Math.max(1, offers.length)) * 100)}%)`);
  console.log(`• Davon mit verifizierter +41 Telefonnummer:               ${withPhone}`);
  console.log("\nAufschlüsselung nach Quell-Portal:");
  Object.entries(byPortal)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`  - ${k.padEnd(22)}: ${v} Profile`));

  console.log("\nAufschlüsselung nach Schweizer Kanton:");
  Object.entries(byCanton)
    .sort((a, b) => b[1] - a[1])
    .forEach(([k, v]) => console.log(`  - Kanton ${k.padEnd(6)}: ${v} Profile`));
}

if (fs.existsSync(clubsPath)) {
  const clubs = JSON.parse(fs.readFileSync(clubsPath, "utf8"));
  console.log(`\n• Stationäre Clubs, Studios & Laufhäuser:                  ${clubs.length} Adressen`);
}

console.log("==============================================================\n");