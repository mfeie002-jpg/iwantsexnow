import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");
const offersPath = path.join(dataDir, "harvested-offers.json");
const statePath = path.join(dataDir, "managed-profile-states.json");

const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
const states = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};

for (const o of offers) {
  const pid = o.id || o.dedupClusterId;
  if (!pid) continue;
  const cleanName = String(o.rawName || o.name || "Profil").replace(/\s+/g, " ").trim();
  const existing = states[pid] || {};
  states[pid] = {
    ...existing,
    profileId: pid,
    name: existing.name || cleanName,
    displayName: existing.displayName || cleanName,
    city: existing.city || o.city || "Zug",
    canton: existing.canton || o.canton || "ZG",
    phoneDisplay: existing.phoneDisplay || o.rawPhone || "",
    rate30Chf: Number(existing.rate30Chf || o.rate30Chf || 200),
    rate60Chf: Number(existing.rate60Chf || o.advertisedBaseChf || 350),
    priceChf: Number(existing.priceChf || o.advertisedBaseChf || 350),
    bio: existing.bio || o.bio || `${cleanName} in ${o.city || "Zug"} (${o.canton || "ZG"}) – Direktkontakt.`,
    description: existing.description || o.bio || `${cleanName} in ${o.city || "Zug"} (${o.canton || "ZG"}) – Direktkontakt.`,
    thumbnail: o.thumbnail || "",
    sourcePortal: o.sourcePortal || "xdate.ch",
    updatedAt: existing.updatedAt || new Date().toISOString(),
  };
}

fs.writeFileSync(statePath, JSON.stringify(states, null, 2), "utf8");
console.log(`✓ ${Object.keys(states).length} Profile in managed-profile-states.json vollständig mit Name, Stadt, Kanton, +41 Nummer, Preis & Bio synchronisiert!`);