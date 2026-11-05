import fs from "fs";
import path from "path";
import crypto from "crypto";

const dataDir = path.join(process.cwd(), "src", "data");
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
const claimsPath = path.join(dataDir, "ready-whatsapp-claims.json");
const pilotPath = path.join(dataDir, "pilot-20-cohort.json");

const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
const claims = JSON.parse(fs.readFileSync(claimsPath, "utf8"));

const ZH_CITIES = /^(zürich|zurich|zuerich|winterthur|oerlikon|kloten|opfikon|glattbrugg|dietikon|schlieren|uster|wetzikon|horgen|adliswil|wäden|wädenswil|dübendorf|wallisellen|bülach|bachenbülach|volketswil|bubikon|affoltern|regensdorf|illnau|effretikon|thalwil|küsnacht|meilen|stafa|stäfa|hinwil|pfäffikon zh|dietlikon|elsau|egg)$/i;
const ZG_CITIES = /^(zug|cham|baar|rotkreuz|steinhausen|hünenberg|risch|unterägeri|oberägeri|menzingen|walchwil|neuheim)$/i;

for (const list of [offers, claims]) {
  for (const item of list) {
    const c = String(item.city || "").trim();
    if (ZH_CITIES.test(c)) {
      item.canton = "ZH";
    } else if (ZG_CITIES.test(c)) {
      item.canton = "ZG";
    }
  }
}

fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
fs.writeFileSync(offersTsPath, `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\n`, "utf8");
fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2), "utf8");

const secret = process.env.OWNER_TOKEN_SECRET || "iwsn-swiss-pilot-hmac-2026";
const makeToken = (id) => crypto.createHmac("sha256", secret).update(String(id)).digest("hex").slice(0, 24);

const zgClean = offers.filter((o) => o.canton === "ZG" && ZG_CITIES.test(o.city) && String(o.rawPhone || "").match(/^\+41\s*7[5-9]/)).slice(0, 10);
const zhClean = offers.filter((o) => o.canton === "ZH" && ZH_CITIES.test(o.city) && String(o.rawPhone || "").match(/^\+41\s*7[5-9]/)).slice(0, 10);

const pilotCohort = [...zgClean, ...zhClean].map((p, idx) => {
  const token = makeToken(p.id);
  const cleanName = String(p.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim().slice(0, 32) || `Pilot-${idx + 1}`;
  return {
    pilotRank: idx + 1,
    id: p.id,
    name: cleanName,
    city: p.city,
    canton: p.canton,
    phoneDisplay: p.rawPhone,
    rate30Chf: p.rate30Chf || 200,
    rate60Chf: p.advertisedBaseChf || 350,
    outreachStatus: "DRY_RUN_ONLY_NOT_CONTACTED",
    ownerToken: token,
    dryRunCockpitUrl: `https://iwantsexnow.ch/creator-dashboard?id=${encodeURIComponent(p.id)}&token=${token}`,
    localTestUrl: `http://localhost:3000/creator-dashboard?id=${encodeURIComponent(p.id)}&token=${token}`,
  };
});

fs.writeFileSync(pilotPath, JSON.stringify(pilotCohort, null, 2), "utf8");

console.log("\n=== BEREINIGTE PILOT-KOHORTE (ECHTE ZUGER & ZÜRCHER STÄDTE - 0 NACHRICHTEN GESENDET) ===");
console.table(
  pilotCohort.slice(0, 12).map((p) => ({
    Rang: p.pilotRank,
    Kanton: p.canton,
    Stadt: p.city,
    Name: p.name,
    Telefon: p.phoneDisplay,
    CHF_60m: p.rate60Chf,
    Status: "TROCKENTEST (NIEMAND KONTAKTIERT)",
  }))
);

if (pilotCohort[0]) {
  console.log("\n👉 DEINE PERSÖNLICHEN TROCKENTEST-LINKS FÜR DEN BROWSER:");
  console.log("   1) Pilot-Profil Kanton ZUG (" + pilotCohort[0].name + ", " + pilotCohort[0].city + "):");
  console.log("      Live:  " + pilotCohort[0].dryRunCockpitUrl);
  console.log("      Lokal: " + pilotCohort[0].localTestUrl);
}
const firstZh = pilotCohort.find((x) => x.canton === "ZH");
if (firstZh) {
  console.log("   2) Pilot-Profil Kanton ZÜRICH (" + firstZh.name + ", " + firstZh.city + "):");
  console.log("      Live:  " + firstZh.dryRunCockpitUrl);
  console.log("      Lokal: " + firstZh.localTestUrl + "\n");
}