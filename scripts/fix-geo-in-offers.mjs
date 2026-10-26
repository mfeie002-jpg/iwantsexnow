import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");

const GEO_RULES = [
  { m: ["geneva", "genève", "geneve", "genf", "champel", "carouge", "servette", "plainpalais", "eaux-vives", "paquis", "florissant", "meyrin"], city: "Genève", canton: "GE" },
  { m: ["lausanne", "ouchy", "renens", "morges", "nyon", "vevey", "montreux", "yverdon", "vaud"], city: "Lausanne", canton: "VD" },
  { m: ["sion", "sierre", "martigny", "monthey", "crans-montana", "valais", "wallis"], city: "Sion", canton: "VS" },
  { m: ["fribourg", "freiburg", "bulle"], city: "Fribourg", canton: "FR" },
  { m: ["neuchâtel", "neuchatel", "chaux-de-fonds"], city: "Neuchâtel", canton: "NE" },
  { m: ["lugano", "locarno", "ascona", "bellinzona", "mendrisio", "chiasso", "ticino", "tessin"], city: "Lugano", canton: "TI" },
  { m: ["luzern", "lucerne", "emmen", "emmenbrücke", "kriens", "sursee", "sempach", "ebikon"], city: "Luzern", canton: "LU" },
  { m: ["zug", "cham", "baar", "rotkreuz", "steinhausen"], city: "Zug", canton: "ZG" },
  { m: ["basel", "bâle", "riehen", "allschwil", "muttenz", "pratteln", "liestal"], city: "Basel", canton: "BS" },
  { m: ["aarau", "baden", "wettingen", "spreitenbach", "menziken", "oftringen", "zofingen", "lenzburg", "wohlen", "riniken", "schafisheim"], city: "Aarau / Baden", canton: "AG" },
  { m: ["bern", "berne", "biel", "bienne", "thun", "interlaken", "langenthal", "niederbipp"], city: "Bern", canton: "BE" },
  { m: ["st. gallen", "st gallen", "wil", "rapperswil", "buchs", "gossau", "bad ragaz"], city: "St. Gallen", canton: "SG" },
  { m: ["frauenfeld", "weinfelden", "kreuzlingen"], city: "Frauenfeld", canton: "TG" },
  { m: ["solothurn", "olten", "grenchen", "härkingen"], city: "Solothurn", canton: "SO" },
  { m: ["pfäffikon", "altendorf", "wangen", "lachen", "schwyz", "freienbach"], city: "Pfäffikon", canton: "SZ" },
  { m: ["chur", "davos", "st. moritz", "landquart"], city: "Chur", canton: "GR" },
  { m: ["zürich", "zurich", "zuerich", "winterthur", "oerlikon", "schlieren", "dietikon", "kloten", "glattbrugg", "uster", "wetzikon", "bülach", "horgen", "wädenswil", "rüti", "unterengstringen", "oberengstringen"], city: "Zürich", canton: "ZH" },
];

if (fs.existsSync(offersPath)) {
  const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
  let fixedCount = 0;

  for (const item of offers) {
    const rawCity = String(item.city || "Zürich").trim();
    const firstPart = rawCity.split("/")[0].split(",")[0].replace(/\(.*?\)/g, "").trim();
    const hay = `${rawCity} ${item.rawName || ""}`.toLowerCase();

    for (const rule of GEO_RULES) {
      if (rule.m.some((kw) => hay.includes(kw))) {
        const prevCanton = item.canton;
        item.canton = rule.canton;
        if (firstPart.toLowerCase() === "geneva") item.city = "Genève";
        else if (firstPart.toLowerCase() === "champel") item.city = "Genève (Champel)";
        else if (firstPart.toLowerCase() === "zurich") item.city = "Zürich";
        else if (!firstPart || firstPart.toLowerCase() === "unknown") item.city = rule.city;
        else item.city = firstPart;

        if (prevCanton !== item.canton) fixedCount++;
        break;
      }
    }
  }

  fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
  fs.writeFileSync(
    offersTsPath,
    `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\n`,
    "utf8"
  );
  console.log("✓ Geo-Normalizer hat " + fixedCount + " fehlerhafte Stadt-Kanton-Zuordnungen (wie Geneva·ZH / Champel·ZG) direkt in harvested-offers.json korrigiert!");
}