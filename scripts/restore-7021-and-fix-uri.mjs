import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");

// Entfernt kaputte UTF-16 Surrogate-Hälften (Ursache für URIError: URI malformed bei encodeURIComponent!)
function sanitizeStr(input) {
  if (!input) return "";
  const s = String(input);
  if (typeof s.toWellFormed === "function") {
    return s.toWellFormed().trim();
  }
  return s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "").trim();
}

const VALID_CH_PREFIXES = new Set([
  "75", "76", "77", "78", "79",
  "21", "22", "24", "26", "27",
  "31", "32", "33", "34",
  "41", "43", "44",
  "52", "55", "56", "58",
  "61", "62", "71", "81", "91"
]);

function validateSwissPhone(raw) {
  if (!raw) return null;
  const s = sanitizeStr(raw);
  if (s.includes("07x") || s.includes("123456") || s.includes("234567") || s.includes("000000")) return null;
  if (s.startsWith("+") && !s.startsWith("+41")) return null;

  let d = s.replace(/\D/g, "");
  if (d.startsWith("0041")) d = "41" + d.slice(4);
  else if (d.startsWith("0") && d.length === 10) d = "41" + d.slice(1);
  else if (d.length === 9 && VALID_CH_PREFIXES.has(d.slice(0, 2))) d = "41" + d;

  if (!d.startsWith("41") || d.length !== 11) return null;
  const prefix = d.slice(2, 4);
  const sub = d.slice(4);
  if (!VALID_CH_PREFIXES.has(prefix) || /^(\d)\1{5,}$/.test(sub) || sub === "1234567") return null;

  return {
    waDigits: d,
    formatted: `+41 ${prefix} ${sub.slice(0, 3)} ${sub.slice(3, 5)} ${sub.slice(5, 7)}`,
    isMobile: ["75", "76", "77", "78", "79"].includes(prefix),
  };
}

function readJsonSafe(file, fb) {
  const p = path.join(dataDir, file);
  try { return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fb; } catch { return fb; }
}

function readJsonlSafe(file) {
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return [];
  const out = [];
  for (const line of fs.readFileSync(p, "utf8").split("\n").filter(Boolean)) {
    try { out.push(JSON.parse(line)); } catch {}
  }
  return out;
}

const unlockedMap = readJsonSafe("unlocked-subpage-phones.json", {});
const existingClaims = readJsonSafe("ready-whatsapp-claims.json", []);

// Baue Lookup-Map für alle entschlüsselten Telefonnummern (nach URL & Name)
const phoneByUrl = new Map();
const phoneByName = new Map();

for (const [u, val] of Object.entries(unlockedMap)) {
  if (val && val.realPhone) {
    const chk = validateSwissPhone(val.realPhone);
    if (chk) {
      phoneByUrl.set(u.trim(), chk.formatted);
      if (val.rawName) phoneByName.set(sanitizeStr(val.rawName).toLowerCase(), chk.formatted);
    }
  }
}
for (const c of existingClaims) {
  const chk = validateSwissPhone(c.phoneDisplay || c.waDigits);
  if (chk) {
    if (c.sourceUrl) phoneByUrl.set(String(c.sourceUrl).trim(), chk.formatted);
    if (c.rawTitle) phoneByName.set(sanitizeStr(c.rawTitle).toLowerCase(), chk.formatted);
    if (c.name) phoneByName.set(sanitizeStr(c.name).toLowerCase(), chk.formatted);
  }
}

// Lade die vollen 7.021 Listings aus Wave 2 + aktuelle Listings
const wave2Vault = readJsonlSafe("vault-wave2-7021.jsonl");
const currentVault = readJsonlSafe("rosalon-scale-vault.jsonl");
const baseVault = wave2Vault.length >= currentVault.length ? wave2Vault : currentVault;

const fullRestoredVault = [];
for (const item of baseVault) {
  if (!item || !item.rawName) continue;
  item.rawName = sanitizeStr(item.rawName);
  item.city = sanitizeStr(item.city || "Zürich");
  item.bio = sanitizeStr(item.bio || "");
  item.sourceUrl = sanitizeStr(item.sourceUrl || "");

  const u = item.sourceUrl;
  const nKey = item.rawName.toLowerCase();

  if (phoneByUrl.has(u)) {
    item.rawPhone = phoneByUrl.get(u);
  } else if (phoneByName.has(nKey)) {
    item.rawPhone = phoneByName.get(nKey);
  }

  const validP = validateSwissPhone(item.rawPhone);
  item.rawPhone = validP ? validP.formatted : "";

  fullRestoredVault.push(item);
}

// Speichere alle 7.021+ Listings ohne Zeilenverlust!
fs.writeFileSync(
  path.join(dataDir, "rosalon-scale-vault.jsonl"),
  fullRestoredVault.map((r) => JSON.stringify(r)).join("\n") + "\n",
  "utf8"
);

// Stelle alle 216 Schweizer Clubs wieder her
const wave2Clubs = readJsonSafe("clubs-wave2-216.json", []);
const currentClubs = readJsonSafe("swiss-establishments-vault.json", []);
const clubsMergedMap = new Map();
for (const c of [...wave2Clubs, ...currentClubs]) {
  if (!c || !c.name) continue;
  c.name = sanitizeStr(c.name);
  c.city = sanitizeStr(c.city || "Zürich");
  clubsMergedMap.set(`${c.name.toLowerCase()}|${c.city.toLowerCase()}`, c);
}
const finalClubs = Array.from(clubsMergedMap.values());
fs.writeFileSync(path.join(dataDir, "swiss-establishments-vault.json"), JSON.stringify(finalClubs, null, 2), "utf8");

// Räume temporäre Git-Restore-Dateien auf
try { fs.unlinkSync(path.join(dataDir, "vault-wave2-7021.jsonl")); } catch {}
try { fs.unlinkSync(path.join(dataDir, "clubs-wave2-216.json")); } catch {}

// Baue das 650er Frontend-Bundle (harvested-offers.json & harvestedOffers.ts) mit 100% sauberen UTF-16 Strings
const sortedFront = [...fullRestoredVault].sort((a, b) => {
  const aP = a.rawPhone ? 25 : 0;
  const bP = b.rawPhone ? 25 : 0;
  const aLoc = a.canton === "ZG" || a.canton === "ZH" ? 6 : 0;
  const bLoc = b.canton === "ZG" || b.canton === "ZH" ? 6 : 0;
  const aT = a.thumbnail ? 4 : 0;
  const bT = b.thumbnail ? 4 : 0;
  return (bP + bLoc + bT) - (aP + aLoc + aT);
});

const seenFront = new Set();
const frontendOffers = [];
for (const item of sortedFront) {
  const validP = validateSwissPhone(item.rawPhone);
  const key = validP ? validP.waDigits : `${item.rawName.toLowerCase()}|${item.canton || ""}`;
  if (seenFront.has(key)) continue;
  seenFront.add(key);
  frontendOffers.push(item);
}

const top650 = frontendOffers.slice(0, 650);
fs.writeFileSync(path.join(dataDir, "harvested-offers.json"), JSON.stringify(top650, null, 2), "utf8");
fs.writeFileSync(
  path.join(dataDir, "harvestedOffers.ts"),
  `export const HARVESTED_SWISS_OFFERS: any[] = ${JSON.stringify(top650, null, 2)};\n`,
  "utf8"
);

// Aktualisiere index-stats.json auf die echten 7.021 Listings, 216+ Clubs & 364+ Nummern
const stats = {
  updatedAt: new Date().toISOString(),
  portalsIndexed: 27,
  totalRawListingsInVault: fullRestoredVault.length,
  totalEstablishmentsInVault: finalClubs.length,
  uniqueFrontendProfiles: top650.length,
  unlockedRealPhones: existingClaims.length,
  mobileWhatsappReadyPhones: existingClaims.filter((c) => c.isMobile).length,
};
fs.writeFileSync(path.join(dataDir, "index-stats.json"), JSON.stringify(stats, null, 2), "utf8");

console.log("\n===================================================================");
console.log("   ✅ VOLLE DATEN-WIEDERHERSTELLUNG & UTF-16 SANITIZATION FERTIG!");
console.log("===================================================================");
console.log(` • Master-Vault Listings:       ${stats.totalRawListingsInVault} Schweizer Inserate`);
console.log(` • Schweizer Clubs & Häuser:    ${stats.totalEstablishmentsInVault} Etablissements`);
console.log(` • Frontend Top-Profile:        ${stats.uniqueFrontendProfiles} Profile`);
console.log(` • Geprüfte echte +41 Nummern:  ${stats.unlockedRealPhones} (davon ${stats.mobileWhatsappReadyPhones} Mobilfunk 075-079)`);
console.log("===================================================================\n");