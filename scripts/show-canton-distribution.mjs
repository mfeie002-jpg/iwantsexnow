import fs from "fs";

const offers = JSON.parse(fs.readFileSync("src/data/harvested-offers.json", "utf8"));
const claims = JSON.parse(fs.readFileSync("src/data/ready-whatsapp-claims.json", "utf8"));
const clubs  = JSON.parse(fs.readFileSync("src/data/swiss-establishments-vault.json", "utf8"));

const map = {};
const ensure = (c) => {
  const k = String(c || "ZH").toUpperCase().trim() || "ZH";
  if (!map[k]) {
    map[k] = {
      Kanton: k,
      Profile: 0,
      Verifizierte_41_Nummern: 0,
      Handy_075_079: 0,
      Clubs_und_Studios: 0,
    };
  }
  return map[k];
};

for (const o of offers) ensure(o.canton).Profile++;
for (const c of claims) {
  const row = ensure(c.canton);
  row.Verifizierte_41_Nummern++;
  if (c.isMobile) row.Handy_075_079++;
}
for (const cl of clubs) ensure(cl.canton).Clubs_und_Studios++;

const sorted = Object.values(map).sort((a, b) => b.Profile - a.Profile);

console.log("\n=========================================================================");
console.log("   SCHWEIZER KANTONSVERTEILUNG (STAND NACH OVERNIGHT-RUN: 2.526 PROFILE)");
console.log("=========================================================================");
console.table(sorted);
console.log(
  `GESAMT: ${offers.length} Profile | ${claims.length} echte +41 Nummern (${claims.filter((c) => c.isMobile).length} Handy 075-079) | ${clubs.length} Clubs & Studios\n`
);