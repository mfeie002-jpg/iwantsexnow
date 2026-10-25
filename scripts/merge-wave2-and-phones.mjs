import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");
const vaultPath = path.join(dataDir, "rosalon-scale-vault.jsonl");
const unlockedPath = path.join(dataDir, "unlocked-subpage-phones.json");
const clubsPath = path.join(dataDir, "swiss-establishments-vault.json");
const offersPath = path.join(dataDir, "harvested-offers.json");
const statsPath = path.join(dataDir, "index-stats.json");
const claimsPath = path.join(dataDir, "ready-whatsapp-claims.json");

const unlockedMap = fs.existsSync(unlockedPath)
  ? JSON.parse(fs.readFileSync(unlockedPath, "utf8"))
  : {};

const clubs = fs.existsSync(clubsPath)
  ? JSON.parse(fs.readFileSync(clubsPath, "utf8"))
  : [];

function isValidSwissPhone(raw) {
  if (!raw) return false;
  const s = String(raw);
  if (s.includes("07x") || s.includes("1234567") || s.includes("000000")) return false;
  const digits = s.replace(/\D/g, "");
  return digits.length >= 9 && digits.length <= 13;
}

function toWhatsAppE164Digits(raw) {
  let d = String(raw || "").replace(/\D/g, "");
  if (d.startsWith("0041")) d = "41" + d.slice(4);
  else if (d.startsWith("0") && d.length === 10) d = "41" + d.slice(1);
  return d;
}

const lines = fs.existsSync(vaultPath)
  ? fs.readFileSync(vaultPath, "utf8").split("\n").filter(Boolean)
  : [];

const records = [];
let mergedFromParallel = 0;

for (const l of lines) {
  try {
    const r = JSON.parse(l);
    if (!isValidSwissPhone(r.rawPhone)) r.rawPhone = "";

    const u = String(r.sourceUrl || "").trim();
    if (unlockedMap[u] && isValidSwissPhone(unlockedMap[u].realPhone)) {
      r.rawPhone = unlockedMap[u].realPhone;
      if (unlockedMap[u].rate60Chf >= 150) r.advertisedBaseChf = unlockedMap[u].rate60Chf;
      if (Array.isArray(unlockedMap[u].gallery) && unlockedMap[u].gallery.length > 0) {
        r.gallery = unlockedMap[u].gallery;
      }
      mergedFromParallel++;
    }
    records.push(r);
  } catch {}
}

// Zurückschreiben des bereinigten & angereicherten 7.021+ JSONL-Tresors
fs.writeFileSync(vaultPath, records.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");

// Sortiere für Frontend (echte +41 Nummer & ZG/ZH zuerst)
const sorted = [...records].sort((a, b) => {
  const aPhone = isValidSwissPhone(a.rawPhone) ? 20 : 0;
  const bPhone = isValidSwissPhone(b.rawPhone) ? 20 : 0;
  const aPilot = a.canton === "ZG" || a.canton === "ZH" ? 5 : 0;
  const bPilot = b.canton === "ZG" || b.canton === "ZH" ? 5 : 0;
  const aThumb = a.thumbnail ? 3 : 0;
  const bThumb = b.thumbnail ? 3 : 0;
  return (bPhone + bPilot + bThumb) - (aPhone + aPilot + aThumb);
});

const seenCluster = new Set();
const frontendOffers = [];
for (const item of sorted) {
  if (!item.rawName) continue;
  const key = isValidSwissPhone(item.rawPhone)
    ? toWhatsAppE164Digits(item.rawPhone)
    : `${String(item.rawName).toLowerCase().trim()}|${String(item.canton || "")}`;
  if (seenCluster.has(key)) continue;
  seenCluster.add(key);
  frontendOffers.push(item);
}

fs.writeFileSync(offersPath, JSON.stringify(frontendOffers.slice(0, 650), null, 2), "utf8");

// Generiere die 1-Klick WhatsApp-Akquise-Liste (eindeutige echte +41 Nummern)
const seenPhones = new Set();
const readyClaims = [];

for (const item of sorted) {
  if (!isValidSwissPhone(item.rawPhone)) continue;
  const waDigits = toWhatsAppE164Digits(item.rawPhone);
  if (seenPhones.has(waDigits)) continue;
  seenPhones.add(waDigits);

  const cleanName = String(item.rawName || "Model").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim() || "VIP Model";
  const city = String(item.city || "Zürich").split("/")[0].trim();
  const claimUrl = `https://iwantsexnow.ch/create-post?claim=${encodeURIComponent(cleanName)}`;
  const msgDe = `Hallo ${cleanName} 👋 Dein Profil in ${city} wurde in den neuen Schweizer Escort-Index auf iWantSexNow.ch aufgenommen. Übernimm dein Direktprofil jetzt kostenlos (inkl. 2 Gratis Lead-Credits im Wert von CHF 50 & eigenem VIP-Video-Tresor mit 80% Direkt-Auszahlung): ${claimUrl}`;

  readyClaims.push({
    name: cleanName,
    rawTitle: item.rawName,
    city,
    canton: item.canton || "ZH",
    phoneDisplay: item.rawPhone,
    waDigits,
    waClickUrl: `https://wa.me/${waDigits}?text=${encodeURIComponent(msgDe)}`,
    claimUrl,
    portal: item.sourcePortal,
    rateChf: item.advertisedBaseChf || 400,
    sourceUrl: item.sourceUrl,
  });
}

fs.writeFileSync(claimsPath, JSON.stringify(readyClaims, null, 2), "utf8");

const stats = {
  updatedAt: new Date().toISOString(),
  portalsIndexed: 27,
  totalRawListingsInVault: records.length,
  totalEstablishmentsInVault: clubs.length,
  uniqueFrontendProfiles: Math.min(650, frontendOffers.length),
  unlockedRealPhones: readyClaims.length,
};
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf8");

console.log("\n========================================================");
console.log(`✓ MASTER-TRESOR SYNCHRONISIERT: ${records.length} Schweizer Listings!`);
console.log(`✓ ETABLISSEMENTS / CLUBS:      ${clubs.length} Schweizer Häuser & Studios!`);
console.log(`✓ EINDEUTIGE +41 MOBILNUMMERN: ${readyClaims.length} sofort per 1-Klick WhatsApp anschreibbar!`);
console.log("========================================================\n");

console.log("Top 15 sofort verfügbare WhatsApp-Claims (Zug, Cham, Zürich & CH):");
for (const c of readyClaims.slice(0, 15)) {
  console.log(`  📞 ${c.phoneDisplay.padEnd(16)} | ${c.name.slice(0, 22).padEnd(22)} | ${c.city} (${c.canton}) -> ${c.claimUrl}`);
}