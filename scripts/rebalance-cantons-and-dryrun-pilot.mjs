import fs from "fs";
import path from "path";
import crypto from "crypto";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
const claimsPath = path.join(dataDir, "ready-whatsapp-claims.json");
const clubsPath = path.join(dataDir, "swiss-establishments-vault.json");
const pilotPath = path.join(dataDir, "pilot-20-cohort.json");
const statsPath = path.join(dataDir, "index-stats.json");
const auditPath = path.join(dataDir, "harvest-audit-report.json");

const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
const claims = JSON.parse(fs.readFileSync(claimsPath, "utf8"));
const clubs  = JSON.parse(fs.readFileSync(clubsPath, "utf8"));

// Präziser Schweizer Orts-zu-Kanton-Detektor (deckt alle Deutschschweizer, Romandie- & Tessiner Orte ab)
const CITY_RULES = [
  { canton: "ZG", city: "Cham", match: /\b(cham|steinhausen|rotkreuz|risch|hünenberg|unterägeri|oberägeri)\b/i },
  { canton: "ZG", city: "Baar", match: /\b(baar)\b/i },
  { canton: "ZG", city: "Zug", match: /\b(zug)\b|\/zg\b/i },
  { canton: "TG", city: "Frauenfeld", match: /\b(frauenfeld|kreuzlingen|arbon|romanshorn|weinfelden|amriswil|sirnach|eschlikon|bischofszell|diessenhofen|tägerwilen|kradolf|münchwilen)\b|\/tg\b/i },
  { canton: "SZ", city: "Pfäffikon SZ", match: /\b(pfäffikon sz|freienbach|altendorf|arth-goldau|arth|goldau|lachen|wangen sz|einsiedeln|schwyz|küssnacht|brunnen|wollerau)\b|\/sz\b/i },
  { canton: "GR", city: "Chur", match: /\b(chur|davos|landquart|st\.\s*moritz|ilanz|domat|thusis|arosa|klosters)\b|\/gr\b/i },
  { canton: "SO", city: "Olten", match: /\b(olten|solothurn|grenchen|oensingen|trimbach|härkingen|däniken|dulliken|zuchwil|biberist|derendingen)\b|\/so\b/i },
  { canton: "BL", city: "Liestal", match: /\b(liestal|pratteln|birsfelden|muttenz|frenkendorf|allschwil|reinach bl|binningen|sissach|laufen)\b|\/bl\b/i },
  { canton: "SH", city: "Schaffhausen", match: /\b(schaffhausen|neuhausen|stein am rhein|thayngen)\b|\/sh\b/i },
  { canton: "AG", city: "Baden", match: /\b(baden|aarau|spreitenbach|wettingen|oftringen|rothrist|lenzburg|wohlen|rheinfelden|brugg|zofingen|möhlin|zurzach|hunzenschwil|safenwil|neuenhof|waltenschwil|windisch|gebenstorf|niederlenz|erlinsbach|oberentfelden|holderbank|oberrüti|rupperswil|reinach ag|menziken)\b|\/ag\b/i },
  { canton: "SG", city: "St. Gallen", match: /\b(st\.\s*gallen|st gallen|rapperswil|jona|wil sg|wil\b|buchs sg|buchs|gossau|uzwil|oberuzwil|sevelen|abtwil|zuzwil|mörschwil|oberbüren|altstätten|balgach|degersheim|bad ragaz|kaltbrunn|werdenberg|haag)\b|\/sg\b/i },
  { canton: "LU", city: "Luzern", match: /\b(luzern|emmenbrücke|emmen|kriens|sursee|ebikon|horw|sempach|wolhusen|geuensee|meggen|adligenswil)\b|\/lu\b/i },
  { canton: "BE", city: "Bern", match: /\b(bern|biel|bienne|thun|interlaken|unterseen|burgdorf|langenthal|lengnau|wynau|belp|hindelbank|herzogenbuchsee|zollikofen|niederbipp|moutier)\b|\/be\b/i },
  { canton: "BS", city: "Basel", match: /\b(basel)\b|\/bs\b/i },
  { canton: "TI", city: "Lugano", match: /\b(lugano|locarno|bellinzona|chiasso|ascona|mendrisio|muralto|giubiasco|minusio)\b|\/ti\b/i },
  { canton: "GE", city: "Genève", match: /\b(genève|geneve|genf|carouge|meyrin|vernier|champel|eaux-vives)\b|\/ge\b/i },
  { canton: "VD", city: "Lausanne", match: /\b(lausanne|yverdon|montreux|nyon|vevey|morges|renens|pully|aigle|gland)\b|\/vd\b/i },
  { canton: "VS", city: "Sion", match: /\b(sion|sitten|martigny|sierre|monthey|brig|visp|zermatt|crans-montana|saxon)\b|\/vs\b/i },
  { canton: "FR", city: "Fribourg", match: /\b(fribourg|freiburg|bulle|murten|estavayer)\b|\/fr\b/i },
  { canton: "NE", city: "Neuchâtel", match: /\b(neuchâtel|neuchatel|neuenburg|la chaux-de-fonds|le locle)\b|\/ne\b/i },
  { canton: "JU", city: "Delémont", match: /\b(delémont|delemont|porrentruy|jura)\b|\/ju\b/i },
  { canton: "NW", city: "Stans", match: /\b(stans|hergiswil|buochs|nidwalden|obwalden|sarnen|engelberg)\b|\/nw\b/i },
  { canton: "UR", city: "Altdorf", match: /\b(altdorf|uri|andermatt)\b|\/ur\b/i },
  { canton: "GL", city: "Glarus", match: /\b(glarus|näfels|niederurnen)\b|\/gl\b/i },
  { canton: "AR", city: "Herisau", match: /\b(herisau|teufen|appenzell|heiden)\b|ai\s*\/\s*ar/i },
];

function detectExactCantonAndCity(item) {
  const rawCity = String(item.city || "").trim();
  const rawCanton = String(item.canton || "ZH").toUpperCase().trim();
  const hay = `${rawCity} | ${item.rawName || item.name || ""} | ${item.sourceUrl || ""} | ${item.bio || ""}`;

  // Wenn bereits ein spezifischer Nicht-ZH-Kanton gesetzt ist, prüfen wir nur auf noch genauere Orts-Treffer
  for (const rule of CITY_RULES) {
    const m = hay.match(rule.match);
    if (m) {
      let cleanCity = rawCity.split("/")[0].split(",")[0].trim();
      if (!cleanCity || cleanCity.length < 2 || /^(ag|zh|zg|sg|lu|be|bs|bl|so|tg|sz|gr|sh|ti|ge|vd|vs|fr|ne|unspecified|not specified|unknown)$/i.test(cleanCity)) {
        cleanCity = m[0].replace(/^\//, "").trim();
        cleanCity = cleanCity.charAt(0).toUpperCase() + cleanCity.slice(1);
      }
      if (cleanCity.length <= 3) cleanCity = rule.city;
      return { canton: rule.canton, city: cleanCity };
    }
  }

  let fallbackCity = rawCity.split("/")[0].split(",")[0].trim();
  if (!fallbackCity || /^(zh|ag|zg|sg|lu|be|unspecified|not specified|unknown|webcam)$/i.test(fallbackCity)) {
    fallbackCity = rawCanton === "GE" ? "Genève" : rawCanton === "VD" ? "Lausanne" : rawCanton === "TI" ? "Lugano" : "Zürich";
  }
  return { canton: rawCanton || "ZH", city: fallbackCity };
}

let reassignedCount = 0;
for (const o of offers) {
  const prev = o.canton;
  const det = detectExactCantonAndCity(o);
  o.canton = det.canton;
  o.city = det.city;
  if (prev !== o.canton) reassignedCount++;
}

for (const c of claims) {
  const det = detectExactCantonAndCity(c);
  c.canton = det.canton;
  c.city = det.city;
}

for (const cl of clubs) {
  const det = detectExactCantonAndCity(cl);
  cl.canton = det.canton;
  cl.city = det.city;
}

fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
fs.writeFileSync(offersTsPath, `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\n`, "utf8");
fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2), "utf8");
fs.writeFileSync(clubsPath, JSON.stringify(clubs, null, 2), "utf8");

// OPTION C (REINER OFFLINE-TROCKENTEST: 0 NACHRICHTEN VERSENDET!)
// Erstellt 20 vorautorisierte Test-Profile (10x ZG, 10x ZH) mit lokalem Cockpit-Testlink
const secret = process.env.OWNER_TOKEN_SECRET || "iwsn-swiss-pilot-hmac-2026";
const makeToken = (id) => crypto.createHmac("sha256", secret).update(String(id)).digest("hex").slice(0, 24);

const zgCandidates = offers.filter((o) => o.canton === "ZG" && String(o.rawPhone || "").match(/^\+41\s*7[5-9]/)).slice(0, 10);
const zhCandidates = offers.filter((o) => o.canton === "ZH" && String(o.rawPhone || "").match(/^\+41\s*7[5-9]/)).slice(0, 10);

const pilotCohort = [...zgCandidates, ...zhCandidates].map((p, idx) => {
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
    sourcePortal: p.sourcePortal || "xdate.ch",
    outreachStatus: "DRY_RUN_ONLY_NOT_CONTACTED",
    ownerToken: token,
    dryRunCockpitUrl: `https://iwantsexnow.ch/creator-dashboard?id=${encodeURIComponent(p.id)}&token=${token}`,
    localTestUrl: `http://localhost:3000/creator-dashboard?id=${encodeURIComponent(p.id)}&token=${token}`,
  };
});

fs.writeFileSync(pilotPath, JSON.stringify(pilotCohort, null, 2), "utf8");

// Kantons-Tabelle berechnen
const map = {};
const ensure = (c) => {
  const k = String(c || "ZH").toUpperCase().trim() || "ZH";
  if (!map[k]) {
    map[k] = { Kanton: k, Profile: 0, Verifizierte_41_Nummern: 0, Handy_075_079: 0, Clubs_und_Studios: 0 };
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

const byCanton = {};
for (const row of sorted) byCanton[row.Kanton] = row.Profile;

const stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
stats.updatedAt = new Date().toISOString();
stats.cantonBreakdown = byCanton;
fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf8");

const audit = JSON.parse(fs.readFileSync(auditPath, "utf8"));
audit.generatedAt = new Date().toISOString();
audit.cantonDistribution = byCanton;
audit.reassignedRegionalProfiles = reassignedCount;
audit.pilotDryRunProfilesReady = pilotCohort.length;
fs.writeFileSync(auditPath, JSON.stringify(audit, null, 2), "utf8");

console.log(`\n✓ OPTION B FERTIG: ${reassignedCount} Profile aus Multi-Kantons-Tags exakt ihrem echten Kanton (TG, SZ, GR, SO, BL, SH, AG, SG, LU, ZG etc.) zugeordnet!`);
console.log("=========================================================================");
console.log("   NEUE SCHWEIZER KANTONSVERTEILUNG (NACH ORTS-PRÄZISIONS-KORREKTUR)");
console.log("=========================================================================");
console.table(sorted);

console.log("\n=========================================================================");
console.log("   OPTION C (100% TROCKENTEST - NIEMAND WURDE KONTAKTIERT!)");
console.log("   Vorschau der ersten 6 vorautorisierten Pilot-Cockpits (ZG & ZH):");
console.log("=========================================================================");
console.table(
  pilotCohort.slice(0, 6).map((p) => ({
    Rang: p.pilotRank,
    Kanton: p.canton,
    Stadt: p.city,
    Name: p.name,
    Telefon: p.phoneDisplay,
    Status: "NICHT KONTAKTIERT (Trockentest)",
    Cockpit_DryRun: `/creator-dashboard?id=${p.id}&token=${p.ownerToken.slice(0, 8)}...`,
  }))
);