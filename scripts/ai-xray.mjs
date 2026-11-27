import fs from "fs";
import path from "path";

const offers = JSON.parse(fs.readFileSync("src/data/harvested-offers.json", "utf8"));
const arr = Array.isArray(offers) ? offers : (offers.offers || []);

const hostCounts = {};
let emptyCount = 0;
for (const o of arr) {
  const u = String(o.thumbnail || o.photoUrl || (o.gallery && o.gallery[0]) || "").trim();
  if (!u || !u.startsWith("http")) { emptyCount++; continue; }
  try {
    const h = new URL(u).hostname;
    hostCounts[h] = (hostCounts[h] || 0) + 1;
  } catch { emptyCount++; }
}

console.log("=== 1. BILD-DOMAINS IN HARVESTED-OFFERS (" + arr.length + " PROFILE) ===");
console.log("Ohne gültige HTTP-URL:", emptyCount);
console.log("Top Hosts:", Object.entries(hostCounts).sort((a,b) => b[1]-a[1]).slice(0, 12));
console.log("\nBeispiel-URLs (erste 5):");
arr.slice(0, 5).forEach((o, i) => console.log(`  [${i+1}] ${o.id} -> thumb=${o.thumbnail} | gal0=${(o.gallery||[])[0]}`));

console.log("\n=== 2. INHALT VON src/pages/_app.tsx ===");
console.log(fs.readFileSync("src/pages/_app.tsx", "utf8"));

console.log("\n=== 3. NEXT.CONFIG ===");
for (const f of ["next.config.mjs", "next.config.js", "next.config.ts"]) {
  if (fs.existsSync(f)) console.log("--- " + f + " ---\n" + fs.readFileSync(f, "utf8"));
}

console.log("\n=== 4. VORHANDENE ENV-KEY-NAMEN (.env.local) ===");
if (fs.existsSync(".env.local")) {
  const keys = fs.readFileSync(".env.local", "utf8")
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(l => l && !l.startsWith("#") && l.includes("="))
    .map(l => {
      const [k, ...rest] = l.split("=");
      return `${k.trim()} (Länge: ${rest.join("=").trim().length})`;
    });
  console.log(keys.join(", "));
} else {
  console.log("KEINE .env.local gefunden!");
}