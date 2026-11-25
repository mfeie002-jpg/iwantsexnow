import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");

// A) Preise in harvested-offers.json und managed-profile-states.json auf realistische CHF-Werte (100 - 1200) begrenzen
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
const statesPath = path.join(dataDir, "managed-profile-states.json");

const sanitizeRate60 = (val) => {
  const n = Number(val);
  if (!Number.isFinite(n) || n < 100 || n > 1200) return 350;
  return Math.round(n / 10) * 10;
};

const sanitizeRate30 = (val, r60) => {
  const n = Number(val);
  if (!Number.isFinite(n) || n < 80 || n > 800 || n >= r60) {
    return Math.round((r60 * 0.6) / 10) * 10;
  }
  return Math.round(n / 10) * 10;
};

if (fs.existsSync(offersPath)) {
  const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
  let fixedPrices = 0;
  for (const o of offers) {
    const old60 = Number(o.advertisedBaseChf);
    const r60 = sanitizeRate60(old60);
    const r30 = sanitizeRate30(o.rate30Chf, r60);
    if (old60 !== r60) fixedPrices++;
    o.advertisedBaseChf = r60;
    o.rate30Chf = r30;
    o.priceLabel = `CHF ${r60} / 60 Min. (CHF ${r30} / 30 Min.)`;
  }
  fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
  fs.writeFileSync(
    offersTsPath,
    `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\nexport default HARVESTED_SWISS_OFFERS;\n`,
    "utf8"
  );
  console.log(`✓ Preis-Bereinigung: ${fixedPrices} fehlerhafte Preis-Ausreisser (PLZ/Telefonnummern) auf reale CHF-Werte korrigiert.`);
}

if (fs.existsSync(statesPath)) {
  const states = JSON.parse(fs.readFileSync(statesPath, "utf8"));
  for (const pid of Object.keys(states)) {
    const st = states[pid];
    st.rate60Chf = sanitizeRate60(st.rate60Chf);
    st.rate30Chf = sanitizeRate30(st.rate30Chf, st.rate60Chf);
  }
  fs.writeFileSync(statesPath, JSON.stringify(states, null, 2), "utf8");
}

// B) Club-Verzeichnis bereinigen (Einzelanzeigen & doppelte Rufnummern zusammenführen)
const clubsPath = path.join(dataDir, "swiss-establishments-vault.json");
if (fs.existsSync(clubsPath)) {
  const rawClubs = JSON.parse(fs.readFileSync(clubsPath, "utf8"));
  const seenPhones = new Set();
  const seenNames = new Set();
  const cleanClubs = [];

  for (const c of rawClubs) {
    const name = String(c.name || "").trim();
    const phoneDigits = String(c.phone || "").replace(/\D/g, "");
    const nameKey = `${name.toLowerCase()}-${String(c.city || "").toLowerCase()}`;

    if (!name || name.length < 3 || seenNames.has(nameKey)) continue;
    if (phoneDigits.length >= 9 && seenPhones.has(phoneDigits)) continue;

    seenNames.add(nameKey);
    if (phoneDigits.length >= 9) seenPhones.add(phoneDigits);
    cleanClubs.push(c);
  }
  fs.writeFileSync(clubsPath, JSON.stringify(cleanClubs, null, 2), "utf8");
  console.log(`✓ Club-Bereinigung: ${rawClubs.length} -> ${cleanClubs.length} eindeutige Etablissements (Duplikate entfernt).`);
}