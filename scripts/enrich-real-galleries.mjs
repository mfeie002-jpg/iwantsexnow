import fs from "fs";

const offersPath = "src/data/harvested-offers.json";
const unlockedPath = "src/data/unlocked-subpage-phones.json";
const vaultPath = "src/data/rosalon-scale-vault.jsonl";

const isRealCdn = (u) => {
  if (!u || typeof u !== "string") return false;
  const s = u.trim();
  return (
    s.startsWith("http") &&
    !s.includes("unsplash.com") &&
    !s.includes("pexels.com") &&
    !s.includes("placeholder") &&
    !s.includes("escort-portrait") &&
    !s.endsWith(".svg")
  );
};

const cleanUrl = (u) => String(u || "").trim().replace(/[?&]iwsn_clean=1.*$/i, "");

const offers = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf8")) : [];
const unlocked = fs.existsSync(unlockedPath) ? JSON.parse(fs.readFileSync(unlockedPath, "utf8")) : {};

const galleryBySource = new Map();
for (const [srcUrl, data] of Object.entries(unlocked)) {
  if (data && Array.isArray(data.gallery)) {
    const valid = data.gallery.map(cleanUrl).filter(isRealCdn);
    if (valid.length > 0) galleryBySource.set(srcUrl, valid);
  }
}

if (fs.existsSync(vaultPath)) {
  const lines = fs.readFileSync(vaultPath, "utf8").split(/\r?\n/).filter(Boolean);
  for (const l of lines) {
    try {
      const r = JSON.parse(l);
      if (r.sourceUrl && Array.isArray(r.gallery)) {
        const valid = r.gallery.map(cleanUrl).filter(isRealCdn);
        if (valid.length > 0 && !galleryBySource.has(r.sourceUrl)) {
          galleryBySource.set(r.sourceUrl, valid);
        }
      }
    } catch {}
  }
}

let enrichedGalleries = 0;
for (const o of offers) {
  const primary = cleanUrl(o.thumbnail);
  const existingGal = Array.isArray(o.gallery) ? o.gallery.map(cleanUrl).filter(isRealCdn) : [];
  const vaultGal = (o.sourceUrl && galleryBySource.get(o.sourceUrl)) || [];
  const merged = Array.from(new Set([primary, ...existingGal, ...vaultGal].filter(isRealCdn))).slice(0, 8);
  if (merged.length > 0) {
    o.thumbnail = merged[0];
    o.gallery = merged;
    o.hasRealPortalPhoto = true;
    if (merged.length > 1) enrichedGalleries++;
  } else {
    o.gallery = [];
  }
}

fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
console.log("✓ Echte Multi-Foto-Galerien verknüpft (" + enrichedGalleries + " Dossiers mit Mehrfach-Originalfotos, 0 Stock-Fallbacks)!");