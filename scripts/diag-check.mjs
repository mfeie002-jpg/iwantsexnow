import fs from "fs";
const data = JSON.parse(fs.readFileSync("src/data/harvested-offers.json", "utf8"));
console.log("=== ERSTE 8 PROFIL-BILDER IN HARVESTED-OFFERS.JSON ===");
data.slice(0, 8).forEach((o, i) => {
  console.log(i + 1, o.id, "| Name:", (o.rawName || "").slice(0, 22), "| thumb:", o.thumbnail, "| gal0:", (o.gallery || [])[0]);
});
console.log("\n=== INHALT VON _app.tsx ===");
console.log(fs.readFileSync("src/pages/_app.tsx", "utf8"));
console.log("\n=== INHALT VON next.config ===");
for (const f of ["next.config.mjs", "next.config.js", "next.config.ts"]) {
  if (fs.existsSync(f)) console.log("--- " + f + " ---\n" + fs.readFileSync(f, "utf8"));
}