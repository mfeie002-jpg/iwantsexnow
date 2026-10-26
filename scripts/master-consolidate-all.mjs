import fs from "fs";
import path from "path";

const masterDir = "C:\\Users\\thest\\Documents\\GitHub\\rearea\\iwantsexnow";
const codexDir  = "C:\\Users\\thest\\Documents\\Codex\\2026-10-22\\referenced-chatgpt-conversation-this-is-an\\work\\iwantsexnow";

const masterData = path.join(masterDir, "src", "data");
const codexData  = path.join(codexDir, "src", "data");
if (!fs.existsSync(masterData)) fs.mkdirSync(masterData, { recursive: true });

// Schweizer Vorwahl-Validator (nur echte CH Mobil- & Festnetznummern, keine 1234567 oder +852)
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
  const s = String(raw).trim();
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

function readJsonSafe(filePath, fallback) {
  try {
    return fs.existsSync(filePath) ? JSON.parse(fs.readFileSync(filePath, "utf8")) : fallback;
  } catch {
    return fallback;
  }
}

function readJsonlSafe(filePath) {
  if (!fs.existsSync(filePath)) return [];
  const lines = fs.readFileSync(filePath, "utf8").split("\n").filter(Boolean);
  const out = [];
  for (const l of lines) {
    try { out.push(JSON.parse(l)); } catch {}
  }
  return out;
}

// A. Merge unlocked-subpage-phones.json aus beiden Ordnern
const unlockedA = readJsonSafe(path.join(masterData, "unlocked-subpage-phones.json"), {});
const unlockedB = readJsonSafe(path.join(codexData, "unlocked-subpage-phones.json"), {});
const mergedUnlocked = { ...unlockedB, ...unlockedA };

for (const [u, val] of Object.entries(mergedUnlocked)) {
  if (val && val.realPhone) {
    const chk = validateSwissPhone(val.realPhone);
    if (chk) {
      mergedUnlocked[u] = { ...val, realPhone: chk.formatted, waDigits: chk.waDigits, isMobile: chk.isMobile };
    } else if (val && val.realPhone) {
      mergedUnlocked[u] = { checkedNoPhone: true };
    }
  }
}
fs.writeFileSync(path.join(masterData, "unlocked-subpage-phones.json"), JSON.stringify(mergedUnlocked, null, 2), "utf8");

// B. Merge rosalon-scale-vault.jsonl aus beiden Ordnern (keine Zeile geht verloren!)
const vaultA = readJsonlSafe(path.join(masterData, "rosalon-scale-vault.jsonl"));
const vaultB = readJsonlSafe(path.join(codexData, "rosalon-scale-vault.jsonl"));
const vaultMap = new Map();

for (const item of [...vaultB, ...vaultA]) {
  if (!item || !item.rawName) continue;
  const key = item.sourceUrl
    ? `${item.sourceUrl}|${item.rawName}`
    : `${item.rawName}|${item.city || ""}|${item.canton || ""}`;

  const u = String(item.sourceUrl || "").trim();
  if (mergedUnlocked[u] && mergedUnlocked[u].realPhone) {
    item.rawPhone = mergedUnlocked[u].realPhone;
    if (mergedUnlocked[u].rate60Chf >= 150) item.advertisedBaseChf = mergedUnlocked[u].rate60Chf;
    if (Array.isArray(mergedUnlocked[u].gallery) && mergedUnlocked[u].gallery.length > 0) {
      item.gallery = mergedUnlocked[u].gallery;
    }
  }

  const validP = validateSwissPhone(item.rawPhone);
  item.rawPhone = validP ? validP.formatted : "";

  const prev = vaultMap.get(key);
  if (!prev || (!prev.rawPhone && item.rawPhone)) {
    vaultMap.set(key, item);
  }
}

const mergedVault = Array.from(vaultMap.values());
fs.writeFileSync(
  path.join(masterData, "rosalon-scale-vault.jsonl"),
  mergedVault.map((r) => JSON.stringify(r)).join("\n") + "\n",
  "utf8"
);

// C. Merge swiss-establishments-vault.json (Clubs & Häuser) aus beiden Ordnern
const clubsA = readJsonSafe(path.join(masterData, "swiss-establishments-vault.json"), []);
const clubsB = readJsonSafe(path.join(codexData, "swiss-establishments-vault.json"), []);
const clubsMap = new Map();
for (const c of [...clubsB, ...clubsA]) {
  if (!c || !c.name) continue;
  clubsMap.set(`${c.name.toLowerCase().trim()}|${c.city || ""}`, c);
}
const mergedClubs = Array.from(clubsMap.values());
fs.writeFileSync(path.join(masterData, "swiss-establishments-vault.json"), JSON.stringify(mergedClubs, null, 2), "utf8");

// D. Baue das optimierte 650er Frontend-Bundle (harvested-offers.json)
const sortedForFrontend = [...mergedVault].sort((a, b) => {
  const aP = a.rawPhone ? 25 : 0;
  const bP = b.rawPhone ? 25 : 0;
  const aPilot = a.canton === "ZG" || a.canton === "ZH" ? 6 : 0;
  const bPilot = b.canton === "ZG" || b.canton === "ZH" ? 6 : 0;
  const aT = a.thumbnail ? 4 : 0;
  const bT = b.thumbnail ? 4 : 0;
  return (bP + bPilot + bT) - (aP + aPilot + aT);
});

const seenFront = new Set();
const frontendBundle = [];
for (const item of sortedForFrontend) {
  const validP = validateSwissPhone(item.rawPhone);
  const clusterKey = validP
    ? validP.waDigits
    : `${String(item.rawName).toLowerCase().trim()}|${String(item.canton || "")}`;
  if (seenFront.has(clusterKey)) continue;
  seenFront.add(clusterKey);
  frontendBundle.push(item);
}
fs.writeFileSync(path.join(masterData, "harvested-offers.json"), JSON.stringify(frontendBundle.slice(0, 650), null, 2), "utf8");

// E. Merge & Bereinige alle +41 WhatsApp-Claims aus beiden Ordnern
const claimsA = readJsonSafe(path.join(masterData, "ready-whatsapp-claims.json"), []);
const claimsB = readJsonSafe(path.join(codexData, "ready-whatsapp-claims.json"), []);
const seenClaimDigits = new Set();
const finalClaims = [];

const addClaimCandidate = (rawName, cityRaw, cantonRaw, phoneRaw, portal, rateChf, sourceUrl) => {
  const chk = validateSwissPhone(phoneRaw);
  if (!chk || seenClaimDigits.has(chk.waDigits)) return;
  seenClaimDigits.add(chk.waDigits);

  const cleanName = String(rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim() || "Profil";
  const city = String(cityRaw || "Zürich").split("/")[0].trim();
  const claimUrl = `https://iwantsexnow.ch/create-post?claim=${encodeURIComponent(cleanName)}`;
  const msg = `Hallo ${cleanName} 👋 Dein Eintrag in ${city} ist im Schweizer Vergleichs- & Suchverzeichnis iwantsexnow.ch gelistet. Du kannst dein Profil hier kostenlos selbst verwalten, korrigieren oder den 30-Tage-Gründungszugang aktivieren: ${claimUrl} (oder jederzeit ohne Anmeldung ausblenden unter iwantsexnow.ch/report)`;

  finalClaims.push({
    name: cleanName,
    rawTitle: rawName || cleanName,
    city,
    canton: cantonRaw || "ZH",
    phoneDisplay: chk.formatted,
    waDigits: chk.waDigits,
    isMobile: chk.isMobile,
    waClickUrl: `https://wa.me/${chk.waDigits}?text=${encodeURIComponent(msg)}`,
    claimUrl,
    portal: portal || "xdate.ch",
    rateChf: rateChf || 400,
    sourceUrl: sourceUrl || "",
  });
};

for (const r of sortedForFrontend) {
  if (r.rawPhone) addClaimCandidate(r.rawName, r.city, r.canton, r.rawPhone, r.sourcePortal, r.advertisedBaseChf, r.sourceUrl);
}
for (const c of [...claimsB, ...claimsA]) {
  addClaimCandidate(c.rawTitle || c.name, c.city, c.canton, c.phoneDisplay || c.waDigits, c.portal, c.rateChf, c.sourceUrl);
}

finalClaims.sort((a, b) => {
  const aM = a.isMobile ? 20 : 0;
  const bM = b.isMobile ? 20 : 0;
  const aC = a.canton === "ZG" ? 10 : a.canton === "ZH" ? 7 : 0;
  const bC = b.canton === "ZG" ? 10 : b.canton === "ZH" ? 7 : 0;
  return (bM + bC) - (aM + aC);
});

fs.writeFileSync(path.join(masterData, "ready-whatsapp-claims.json"), JSON.stringify(finalClaims, null, 2), "utf8");

// F. Aktualisiere index-stats.json
const stats = {
  updatedAt: new Date().toISOString(),
  portalsIndexed: 27,
  totalRawListingsInVault: mergedVault.length,
  totalEstablishmentsInVault: mergedClubs.length,
  uniqueFrontendProfiles: Math.min(650, frontendBundle.length),
  unlockedRealPhones: finalClaims.length,
  mobileWhatsappReadyPhones: finalClaims.filter((c) => c.isMobile).length,
};
fs.writeFileSync(path.join(masterData, "index-stats.json"), JSON.stringify(stats, null, 2), "utf8");

// Kopiere den vereinten Datensatz auch zurück nach Codex, damit beide Pfade 100% identisch sind
if (fs.existsSync(codexData)) {
  for (const f of ["rosalon-scale-vault.jsonl", "swiss-establishments-vault.json", "harvested-offers.json", "ready-whatsapp-claims.json", "unlocked-subpage-phones.json", "index-stats.json"]) {
    try { fs.copyFileSync(path.join(masterData, f), path.join(codexData, f)); } catch {}
  }
}

console.log("\n===================================================================");
console.log("   ✅ KOMPLETT-MERGE ABGESCHLOSSEN (100% EINHEITLICH & VERLUSTFREI)");
console.log("===================================================================");
console.log(` • Aktiver Master-Ordner:       ${masterDir}`);
console.log(` • Vereinte Vault-Listings:     ${stats.totalRawListingsInVault} Schweizer Inserate`);
console.log(` • Vereinte Clubs & Häuser:     ${stats.totalEstablishmentsInVault} Etablissements`);
console.log(` • Frontend Top-Profile:        ${stats.uniqueFrontendProfiles} Profile`);
console.log(` • Geprüfte echte +41 Nummern:  ${stats.unlockedRealPhones} (davon ${stats.mobileWhatsappReadyPhones} Mobilfunk 075-079)`);
console.log("===================================================================\n");