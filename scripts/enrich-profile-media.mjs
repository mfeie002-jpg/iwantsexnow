import fs from "fs";
import path from "path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
const unlockedPath = path.join(dataDir, "unlocked-subpage-phones.json");
const statePath = path.join(dataDir, "managed-profile-states.json");
const pilotPath = path.join(dataDir, "pilot-20-cohort.json");

const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
const unlocked = fs.existsSync(unlockedPath) ? JSON.parse(fs.readFileSync(unlockedPath, "utf8")) : {};
const states = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};
const pilots = fs.existsSync(pilotPath) ? JSON.parse(fs.readFileSync(pilotPath, "utf8")) : [];

const FALLBACK_GALLERY = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=85"
];

let enrichedGalleries = 0;
for (let i = 0; i < offers.length; i++) {
  const o = offers[i];
  const un = o.sourceUrl && unlocked[o.sourceUrl] ? unlocked[o.sourceUrl] : null;
  let gal = Array.isArray(o.gallery) ? o.gallery.filter((u) => String(u).startsWith("http")) : [];
  if (gal.length === 0 && un && Array.isArray(un.gallery)) {
    gal = un.gallery.filter((u) => String(u).startsWith("http"));
  }
  if (o.thumbnail && String(o.thumbnail).startsWith("http") && !gal.includes(o.thumbnail)) {
    gal.unshift(o.thumbnail);
  }
  if (gal.length === 0) {
    gal = [FALLBACK_GALLERY[i % FALLBACK_GALLERY.length], FALLBACK_GALLERY[(i + 1) % FALLBACK_GALLERY.length]];
  }
  if (!o.thumbnail || !String(o.thumbnail).startsWith("http") || String(o.thumbnail).includes("placeholder")) {
    o.thumbnail = gal[0];
  }
  o.gallery = gal.slice(0, 8);
  enrichedGalleries++;

  const pid = o.id || o.dedupClusterId;
  if (pid && states[pid]) {
    states[pid].thumbnail = states[pid].thumbnail && String(states[pid].thumbnail).startsWith("http") ? states[pid].thumbnail : o.thumbnail;
    states[pid].gallery = Array.isArray(states[pid].gallery) && states[pid].gallery.length > 0 ? states[pid].gallery : o.gallery;
  }
}

fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
fs.writeFileSync(offersTsPath, `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\nexport default HARVESTED_SWISS_OFFERS;\n`, "utf8");
fs.writeFileSync(statePath, JSON.stringify(states, null, 2), "utf8");
console.log(`✓ ${enrichedGalleries} Profile mit sauberen Vorschaubildern & Foto-Galerien synchronisiert!`);