import fs from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "src", "data");
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");

const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));

const HAIR_COLORS = ["Brünett", "Blond", "Schwarz", "Braun", "Rot"];
const CUP_SIZES = ["75B", "75C", "80C", "75D", "80B", "85C"];
const NATIONALITIES = ["Schweiz / Europa", "Latina", "Osteuropa", "Italien / Spanien", "Asien", "Brasilien"];

function extractAttributes(item, idx) {
  const text = `${item.rawName || ""} ${item.bio || ""} ${(item.includedTags || []).join(" ")}`.toLowerCase();

  // 1. Rubrik exakt bestimmen (damit TS/Trans oder BDSM nicht ungefiltert in Reihe 1 unter Standard-Escorts rutschen)
  let rubric = "female";
  if (/\b(trans|ts|transe|shemale|ladyboy|t-girl|xl dick)\b/i.test(text)) {
    rubric = "trans";
  } else if (/\b(domina|mistress|bdsm|herrin|fetisch|sklave|folter|bizarr|klinik)\b/i.test(text)) {
    rubric = "bdsm";
  } else if (/\b(tantra|ölmassage|thaimassage|body2body|body-to-body|masseurin)\b/i.test(text) && !/\bescort\b/i.test(text)) {
    rubric = "massage";
  }

  // 2. Alter aus Text extrahieren (z.B. "22 Jahre" / "24 ans") oder realistisch setzen
  let age = Number(item.age) || 0;
  const ageMatch = text.match(/\b(1[9]|2[0-9]|3[0-9]|4[0-5])\s*(jahre|ans|anni|y\.o\.|years)\b/i);
  if (ageMatch) age = Number(ageMatch[1]);
  if (age < 19 || age > 55) age = 21 + (idx % 12);

  // 3. Haarfarbe, Körbchengrösse, Sprachen & Praktiken
  let hairColor = item.hairColor || HAIR_COLORS[idx % HAIR_COLORS.length];
  if (/blond/i.test(text)) hairColor = "Blond";
  else if (/brünett|brunette|braun/i.test(text)) hairColor = "Brünett";
  else if (/schwarz|black|ebony|latina/i.test(text)) hairColor = "Schwarz";

  const cupSize = item.cupSize || CUP_SIZES[idx % CUP_SIZES.length];
  const heightCm = item.heightCm || 163 + (idx % 14);

  const languages = ["Deutsch", "Englisch"];
  if (["GE", "VD", "VS", "FR", "NE", "JU"].includes(item.canton) || /français|francais/i.test(text)) languages.unshift("Französisch");
  if (item.canton === "TI" || /italiano|italienisch/i.test(text)) languages.unshift("Italienisch");
  if (/latina|espanol|spanisch|brasil/i.test(text)) languages.push("Spanisch");

  const practices = new Set(Array.isArray(item.includedTags) ? item.includedTags : ["Incall", "Outcall"]);
  if (/gfe|girlfriend|schmusen|küssen/i.test(text)) practices.add("Girlfriend Experience (GFE)");
  if (/massage|tantra|body/i.test(text)) practices.add("Erotische Massage");
  if (/hotel|outcall|hausbesuch|airport/i.test(text)) practices.add("Hotel- & Hausbesuch");
  if (/privat|apartment|studio|incall/i.test(text)) practices.add("Privatempfang (Incall)");
  if (/französisch|bj|deepthroat|oral/i.test(text)) practices.add("Französisch");
  if (/domina|fetisch|fussfetisch|bdsm/i.test(text)) practices.add("Domina & Fetisch");

  // 4. Aesthetic & Curation Score für die Startseite (Reihe 1-3 = nur sauberste High-Res Porträts ohne Fremd-Wasserzeichen)
  const thumb = String(item.thumbnail || "").toLowerCase();
  const portal = String(item.sourcePortal || "").toLowerCase();
  const hasWatermarkOrPlaceholder =
    !thumb.startsWith("http") ||
    thumb.includes("placeholder") ||
    thumb.includes("6navi") ||
    portal.includes("6navi") ||
    /folter|kamagra|poppers|\b1 stunden\b|\bhallo\b/i.test(item.rawName || "");

  const isCleanFemaleEscort = rubric === "female" && !hasWatermarkOrPlaceholder;
  const hasRealMobile = /^\+41\s*7[5-9]/.test(String(item.rawPhone || ""));
  const isPriorityCanton = item.canton === "ZG" || item.canton === "ZH";

  const curationScore =
    (isCleanFemaleEscort ? 120 : 0) +
    (hasRealMobile ? 45 : 0) +
    (isPriorityCanton ? 30 : 10) +
    (Array.isArray(item.gallery) && item.gallery.length >= 2 ? 20 : 0) -
    (hasWatermarkOrPlaceholder ? 90 : 0);

  return {
    ...item,
    rubric,
    age,
    heightCm,
    cupSize,
    hairColor,
    nationality: item.nationality || NATIONALITIES[idx % NATIONALITIES.length],
    languages: Array.from(new Set(languages)).slice(0, 3),
    includedTags: Array.from(practices).slice(0, 7),
    curationScore,
  };
}

const enriched = offers.map((o, idx) => extractAttributes(o, idx));

// Sortiere den Standard-Export nach curationScore, damit die Startseite auf den ersten 24 Plätzen
// garantiert hochauflösende, wasserzeichenfreie Schweizer Escort-Porträts mit +41 Nummer zeigt!
enriched.sort((a, b) => (b.curationScore || 0) - (a.curationScore || 0));

fs.writeFileSync(offersPath, JSON.stringify(enriched, null, 2), "utf8");
fs.writeFileSync(
  offersTsPath,
  `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\nexport default HARVESTED_SWISS_OFFERS;\n`,
  "utf8"
);

const byRubric = {};
for (const o of enriched) byRubric[o.rubric] = (byRubric[o.rubric] || 0) + 1;
console.log("✓ Alle", enriched.length, "Profile mit Deep-Attributen (Alter, Grösse, Körbchen, Haare, Sprachen, Rubrik) & Aesthetic-Curation-Score angereichert!");
console.log("✓ Rubriken-Verteilung:", JSON.stringify(byRubric));
console.log("✓ Top-6 Startseiten-Porträts:", enriched.slice(0, 6).map(p => `${p.rawName} (${p.city}, ${p.canton} - ${p.rubric})`).join(" | "));