import fs from "fs";

const offersPath = "src/data/harvested-offers.json";
const vaultPath = "src/data/rosalon-scale-vault.jsonl";
const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));

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

const beforeReal = offers.filter((o) => isRealCdn(o.thumbnail)).length;

const vaultPhotos = new Map();
if (fs.existsSync(vaultPath)) {
  const lines = fs.readFileSync(vaultPath, "utf8").split(/\r?\n/).filter(Boolean);
  for (const l of lines) {
    try {
      const r = JSON.parse(l);
      const img = r.thumbnail || r.imageUrl || (Array.isArray(r.gallery) ? r.gallery[0] : "");
      if (isRealCdn(img)) {
        if (r.sourceUrl) vaultPhotos.set(r.sourceUrl, img);
        if (r.rawName) vaultPhotos.set(String(r.rawName).toLowerCase().trim(), img);
      }
    } catch {}
  }
}

let restored = 0;
for (const o of offers) {
  if (o.thumbnail) {
    o.thumbnail = String(o.thumbnail).replace(/[?&]iwsn_clean=1.*$/i, "");
  }
  if (!isRealCdn(o.thumbnail)) {
    const rec =
      (o.sourceUrl && vaultPhotos.get(o.sourceUrl)) ||
      vaultPhotos.get(String(o.rawName || "").toLowerCase().trim()) ||
      (Array.isArray(o.gallery) ? o.gallery.find(isRealCdn) : null);
    if (rec) {
      o.thumbnail = String(rec).replace(/[?&]iwsn_clean=1.*$/i, "");
      restored++;
    }
  }
  o.hasRealPortalPhoto = isRealCdn(o.thumbnail);
  if (o.hasRealPortalPhoto) {
    o.curationScore = Math.max(Number(o.curationScore || 80), 95);
  } else {
    o.curationScore = 15;
  }
}

offers.sort((a, b) => {
  if (Boolean(a.hasRealPortalPhoto) !== Boolean(b.hasRealPortalPhoto)) {
    return a.hasRealPortalPhoto ? -1 : 1;
  }
  return Number(b.curationScore || 0) - Number(a.curationScore || 0);
});

fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
const afterReal = offers.filter((o) => isRealCdn(o.thumbnail));

console.log("==============================================================");
console.log("   ECHTHEITS-CHECK DEINER PROFILE (harvested-offers.json)");
console.log("==============================================================");
console.log("• Gesamt-Profile im Index:                    " + offers.length);
console.log("• Vorher mit echter Original-Foto-URL:        " + beforeReal);
console.log("• Aus Roh-Tresor wiederhergestellte Fotos:   +" + restored);
console.log("• JETZT mit echter Original-Foto-URL (CDN):   " + afterReal.length);
console.log("• Mit lokalem Platzhalter (ans Ende sortiert): " + (offers.length - afterReal.length));
console.log("==============================================================\n");