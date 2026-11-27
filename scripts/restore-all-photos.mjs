import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();
const offersPath = path.join(root, "src", "data", "harvested-offers.json");
const offersTsPath = path.join(root, "src", "data", "harvestedOffers.ts");
const vaultPath = path.join(root, "src", "data", "rosalon-scale-vault.jsonl");
const unlockedPath = path.join(root, "src", "data", "unlocked-subpage-phones.json");

function cleanUrl(u) {
  if (!u || typeof u !== "string") return "";
  let s = u.trim();
  const qIdx = s.indexOf("?iwsn_clean=");
  if (qIdx > 0) s = s.slice(0, qIdx);
  const aIdx = s.indexOf("&iwsn_clean=");
  if (aIdx > 0) s = s.slice(0, aIdx);
  return s;
}

function isValidHttpImage(u) {
  const s = cleanUrl(u);
  if (!s.startsWith("http")) return false;
  const low = s.toLowerCase();
  if (
    low.includes("placeholder") ||
    low.includes("escort-portrait") ||
    low.includes("default-avatar") ||
    low.endsWith(".svg")
  ) {
    return false;
  }
  return true;
}

function isRealPortalCdn(u) {
  return isValidHttpImage(u) && !u.includes("unsplash.com") && !u.includes("pexels.com");
}

const photoMap = new Map();

function indexList(list) {
  if (!Array.isArray(list)) return;
  for (const item of list) {
    if (!item) continue;
    const candidates = [
      item.thumbnail,
      item.photoUrl,
      item.imageUrl,
      item.image,
      ...(Array.isArray(item.gallery) ? item.gallery : []),
      ...(Array.isArray(item.galleryUrls) ? item.galleryUrls : []),
    ]
      .map(cleanUrl)
      .filter(isValidHttpImage);

    if (!candidates.length) continue;
    // Bevorzuge echte Portal-CDN-Fotos gegenüber Stock-Fotos
    candidates.sort((a, b) => (isRealPortalCdn(b) ? 1 : 0) - (isRealPortalCdn(a) ? 1 : 0));
    const rec = { thumb: candidates[0], gallery: Array.from(new Set(candidates)).slice(0, 8) };

    const keys = [
      item.id ? "id:" + item.id : null,
      item.dedupClusterId ? "id:" + item.dedupClusterId : null,
      item.sourceUrl ? "url:" + String(item.sourceUrl).trim() : null,
      item.rawName ? "name:" + String(item.rawName).toLowerCase().trim() : null,
    ].filter(Boolean);

    for (const k of keys) {
      const prev = photoMap.get(k);
      if (!prev || (!isRealPortalCdn(prev.thumb) && isRealPortalCdn(rec.thumb))) {
        photoMap.set(k, rec);
      }
    }
  }
}

// A) Scanne wichtige Git-Commits & Branches nach früheren Original-Foto-URLs
let revs = [];
try {
  revs = execSync("git rev-list --all -n 25 -- src/data/harvested-offers.json", { encoding: "utf8" })
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter(Boolean);
} catch {}

for (const rev of revs) {
  try {
    const raw = execSync(`git show ${rev}:src/data/harvested-offers.json`, {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    });
    const parsed = JSON.parse(raw);
    indexList(Array.isArray(parsed) ? parsed : parsed.offers || []);
  } catch {}
}

// B) Scanne rosalon-scale-vault.jsonl & unlocked-subpage-phones.json
if (fs.existsSync(vaultPath)) {
  for (const line of fs.readFileSync(vaultPath, "utf8").split(/\r?\n/)) {
    if (!line.trim()) continue;
    try {
      indexList([JSON.parse(line)]);
    } catch {}
  }
}

if (fs.existsSync(unlockedPath)) {
  try {
    const un = JSON.parse(fs.readFileSync(unlockedPath, "utf8"));
    for (const [u, val] of Object.entries(un)) {
      if (val && Array.isArray(val.gallery)) {
        indexList([{ sourceUrl: u, gallery: val.gallery }]);
      }
    }
  } catch {}
}

// C) Scanne falls vorhanden den zweiten lokalen Ordner iwantsexnow-live
for (const extra of [
  "C:\\Users\\thest\\iwantsexnow-live\\src\\data\\harvested-offers.json",
  "C:\\Users\\thest\\iwantsexnow-live\\src\\data\\rosalon-scale-vault.jsonl",
]) {
  if (fs.existsSync(extra)) {
    try {
      if (extra.endsWith(".jsonl")) {
        for (const l of fs.readFileSync(extra, "utf8").split(/\r?\n/)) {
          if (l.trim()) indexList([JSON.parse(l)]);
        }
      } else {
        const p = JSON.parse(fs.readFileSync(extra, "utf8"));
        indexList(Array.isArray(p) ? p : p.offers || []);
      }
    } catch {}
  }
}

const rawCurrent = JSON.parse(fs.readFileSync(offersPath, "utf8"));
const offers = Array.isArray(rawCurrent) ? rawCurrent : rawCurrent.offers || [];

let restored = 0;
let portalPhotoCount = 0;

for (let i = 0; i < offers.length; i++) {
  const o = offers[i];
  const curThumb = cleanUrl(o.thumbnail || o.photoUrl || "");
  const match =
    (o.id && photoMap.get("id:" + o.id)) ||
    (o.dedupClusterId && photoMap.get("id:" + o.dedupClusterId)) ||
    (o.sourceUrl && photoMap.get("url:" + String(o.sourceUrl).trim())) ||
    (o.rawName && photoMap.get("name:" + String(o.rawName).toLowerCase().trim()));

  if (!isRealPortalCdn(curThumb) && match && isValidHttpImage(match.thumb)) {
    o.thumbnail = match.thumb;
    o.gallery = match.gallery;
    restored++;
  } else if (isValidHttpImage(curThumb)) {
    o.thumbnail = curThumb;
    const gal = Array.isArray(o.gallery) ? o.gallery.map(cleanUrl).filter(isValidHttpImage) : [];
    o.gallery = Array.from(new Set([curThumb, ...gal])).slice(0, 8);
  }

  o.hasRealPortalPhoto = isRealPortalCdn(o.thumbnail);
  if (o.hasRealPortalPhoto) portalPhotoCount++;
}

// Sortiere Profile MIT echten Portal-Fotos + Direktnummer nach ganz oben
offers.sort((a, b) => {
  if (Boolean(a.hasRealPortalPhoto) !== Boolean(b.hasRealPortalPhoto)) {
    return a.hasRealPortalPhoto ? -1 : 1;
  }
  const hasPhoneA = String(a.rawPhone || "").length >= 9 ? 1 : 0;
  const hasPhoneB = String(b.rawPhone || "").length >= 9 ? 1 : 0;
  if (hasPhoneA !== hasPhoneB) return hasPhoneB - hasPhoneA;
  return Number(b.curationScore || 0) - Number(a.curationScore || 0);
});

fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
fs.writeFileSync(
  offersTsPath,
  `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = Array.isArray(offers) ? (offers as any[]) : [];\nexport default HARVESTED_SWISS_OFFERS;\n`,
  "utf8"
);

console.log(`✓ Foto-Tresor synchronisiert: ${portalPhotoCount} echte Portal-CDN-Profile oben (+${restored} wiederhergestellt) von ${offers.length} Gesamtprofilen.`);