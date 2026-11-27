import fs from "fs";
import path from "path";

const offersPath = path.join("src", "data", "harvested-offers.json");
const vaultPath = path.join("src", "data", "rosalon-scale-vault.jsonl");
const unlockedPath = path.join("src", "data", "unlocked-subpage-phones.json");

const BAD_TOKENS = [
  "bg_blur",
  "example.com",
  "placeholder",
  "default",
  "no-image",
  "noimage",
  "spacer",
  "pixel",
  "favicon",
  "escort-portrait",
  "/logo",
  "_logo",
  "-logo",
  ".svg"
];

function cleanUrl(raw) {
  if (!raw || typeof raw !== "string") return "";
  let s = raw.trim();
  const idx1 = s.indexOf("?iwsn_clean=");
  if (idx1 > 0) s = s.slice(0, idx1);
  const idx2 = s.indexOf("&iwsn_clean=");
  if (idx2 > 0) s = s.slice(0, idx2);
  return s;
}

function isGenuinePortraitUrl(raw) {
  const s = cleanUrl(raw);
  if (!s.startsWith("http://") && !s.startsWith("https://")) return false;
  const low = s.toLowerCase();
  for (const bad of BAD_TOKENS) {
    if (low.includes(bad)) return false;
  }
  return true;
}

function isRealPortalHost(raw) {
  if (!isGenuinePortraitUrl(raw)) return false;
  const low = raw.toLowerCase();
  return !low.includes("unsplash.com") && !low.includes("pexels.com");
}

// Zusätzliche echte Galerie-URLs aus Vault & Subpages indizieren
const extraByUrl = new Map();
if (fs.existsSync(vaultPath)) {
  for (const line of fs.readFileSync(vaultPath, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      const row = JSON.parse(line);
      const cands = [row.thumbnail, row.photoUrl, ...(row.gallery || [])].map(cleanUrl).filter(isRealPortalHost);
      if (cands.length && row.sourceUrl) extraByUrl.set(String(row.sourceUrl).trim(), cands);
    } catch {}
  }
}
if (fs.existsSync(unlockedPath)) {
  try {
    const un = JSON.parse(fs.readFileSync(unlockedPath, "utf8"));
    for (const [srcUrl, obj] of Object.entries(un)) {
      const cands = ((obj && obj.gallery) || []).map(cleanUrl).filter(isRealPortalHost);
      if (cands.length) extraByUrl.set(srcUrl.trim(), cands);
    }
  } catch {}
}

const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
let purgedBlur = 0;
let realPortalCount = 0;
let fallbackAssigned = 0;

for (let i = 0; i < offers.length; i++) {
  const o = offers[i];
  const pid = String(o.id || o.dedupClusterId || `ch-${i}`);
  let h = 0;
  for (let k = 0; k < pid.length; k++) h = (h * 31 + pid.charCodeAt(k)) >>> 0;
  const localPortrait = `/images/ai/portraits/p${(h % 8) + 1}.webp`;

  const rawCandidates = [
    o.thumbnail,
    o.photoUrl,
    o.imageUrl,
    ...(Array.isArray(o.gallery) ? o.gallery : []),
    ...(extraByUrl.get(String(o.sourceUrl || "").trim()) || [])
  ];

  const hadBadThumb = String(o.thumbnail || "").toLowerCase().includes("bg_blur") || String(o.thumbnail || "").toLowerCase().includes("example.com");
  if (hadBadThumb) purgedBlur++;

  const validPortalPics = [];
  for (const c of rawCandidates) {
    const cu = cleanUrl(c);
    if (isRealPortalHost(cu) && !validPortalPics.includes(cu)) validPortalPics.push(cu);
  }

  if (validPortalPics.length > 0) {
    o.thumbnail = validPortalPics[0];
    o.gallery = validPortalPics.slice(0, 8);
    o.hasRealPortalPhoto = true;
    realPortalCount++;
  } else {
    o.thumbnail = localPortrait;
    o.gallery = [localPortrait];
    o.hasRealPortalPhoto = false;
    fallbackAssigned++;
  }
}

// Sortierung: 1. Echte Portal-Porträts zuerst, 2. Verifizierte +41 Nummer, 3. Kurations-Score
offers.sort((a, b) => {
  const pa = a.hasRealPortalPhoto ? 1 : 0;
  const pb = b.hasRealPortalPhoto ? 1 : 0;
  if (pa !== pb) return pb - pa;
  const pha = String(a.rawPhone || "").replace(/\D/g, "").length >= 9 ? 1 : 0;
  const phb = String(b.rawPhone || "").replace(/\D/g, "").length >= 9 ? 1 : 0;
  if (pha !== phb) return phb - pha;
  return Number(b.curationScore || 0) - Number(a.curationScore || 0);
});

fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
console.log(`✓ Foto-Heilung abgeschlossen: ${purgedBlur} schwarze bg_blur/example-Links entfernt | ${realPortalCount} echte Portal-Porträts ganz oben | ${fallbackAssigned} auf lokale KI-Porträts gelegt.`);