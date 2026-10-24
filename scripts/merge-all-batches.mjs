import fs from "fs";
import path from "path";

const readSafe = (file) => {
  const p = path.join(process.cwd(), "src", "data", file);
  if (!fs.existsSync(p)) return [];
  try { return JSON.parse(fs.readFileSync(p, "utf8")); } catch { return []; }
};

const b1 = readSafe("harvested-offers.json");
const b2 = readSafe("batch-cantons.json");
const b3 = readSafe("batch-phones.json");

const combined = [...b3, ...b1, ...b2].filter((x) => x && x.rawName);

fs.writeFileSync(path.join(process.cwd(), "src", "data", "harvested-offers.json"), JSON.stringify(combined, null, 2), "utf8");
fs.writeFileSync(
  path.join(process.cwd(), "src", "data", "harvestedOffers.ts"),
  `// Auto-generated Master Dataset (Windows 1 + 2 + 3)\nexport const HARVESTED_SWISS_OFFERS: any[] = ${JSON.stringify(combined, null, 2)};\n`,
  "utf8"
);
console.log(`=== MASTER MERGE KOMPLETT: ${combined.length} echte Schweizer Profile vereint! ===`);