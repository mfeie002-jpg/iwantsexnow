import fs from "fs";
import path from "path";
import crypto from "crypto";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
const claimsPath = path.join(dataDir, "ready-whatsapp-claims.json");
const pilotPath = path.join(dataDir, "pilot-20-cohort.json");
const statePath = path.join(dataDir, "managed-profile-states.json");
const metricsApiPath = path.join(root, "src", "pages", "api", "vault", "metrics.ts");

const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
const claims = JSON.parse(fs.readFileSync(claimsPath, "utf8"));

// 1. Korrigiere falsch unter ZG/ZH einsortierte Nachbargemeinden
const FIX_CITY_CANTON = [
  { test: /^(wald|wald \(zh\)|bubikon|rüti|hinwil|wetzikon|uster|pfäffikon zh|bülach|kloten|opfikon|glattbrugg|schlieren|dietikon|horgen|adliswil|wädenswil|thalwil|winterthur|zürich|zurich)$/i, canton: "ZH" },
  { test: /^(muri|muri ag|schafisheim|lenzburg|baden|aarau|wohlen|spreitenbach|oftringen|rothrist|wettingen|rheinfelden|brugg|zofingen)$/i, canton: "AG" },
  { test: /^(horn|arbon|romanshorn|frauenfeld|kreuzlingen|weinfelden|amriswil|sirnach)$/i, canton: "TG" },
  { test: /^(dagmersellen|sursee|luzern|emmenbrücke|emmen|kriens|ebikon|wolhusen)$/i, canton: "LU" },
  { test: /^(zug|cham|baar|rotkreuz|steinhausen|hünenberg|risch|unterägeri|oberägeri|walchwil|menzingen|neuheim)$/i, canton: "ZG" },
];

for (const list of [offers, claims]) {
  for (const item of list) {
    const c = String(item.city || "").trim();
    for (const rule of FIX_CITY_CANTON) {
      if (rule.test.test(c)) {
        item.canton = rule.canton;
        break;
      }
    }
    // Entferne auch 8901234 / 0123456 Sequenzen
    const digits = String(item.rawPhone || item.phoneDisplay || "").replace(/\D/g, "");
    if (/8901234|0123456|123456|234567|345678|456789|987654|765432/.test(digits)) {
      if (item.rawPhone !== undefined) item.rawPhone = "";
      if (item.phoneDisplay !== undefined) item.phoneDisplay = "";
    }
  }
}

const cleanClaims = claims.filter((c) => Boolean(c.phoneDisplay));
fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
fs.writeFileSync(offersTsPath, `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\nexport default HARVESTED_SWISS_OFFERS;\n`, "utf8");
fs.writeFileSync(claimsPath, JSON.stringify(cleanClaims, null, 2), "utf8");

// 2. Baue die 20 Pilot-Profile ausschliesslich aus echten ZG-Gemeinden (Zug, Cham, Baar, Rotkreuz) & echten ZH-Gemeinden (Zürich, Winterthur, Kloten, Opfikon, Dietikon)
const secret = process.env.CLAIM_TOKEN_SECRET || process.env.OWNER_TOKEN_SECRET || "iwsn-swiss-master-secret-2026";
const makeToken = (pid) => crypto.createHmac("sha256", secret).update(String(pid).trim().toLowerCase()).digest("hex").slice(0, 28);

const PURE_ZG = /^(zug|cham|baar|rotkreuz|steinhausen|hünenberg|risch|unterägeri|oberägeri)$/i;
const PURE_ZH = /^(zürich|zurich|winterthur|kloten|opfikon|glattbrugg|dietikon|schlieren|uster|wetzikon|horgen|adliswil|dübendorf|wallisellen)$/i;

const usedPhones = new Set();
function pickPureCantonPilots(canton, cityRegex, count) {
  const out = [];
  for (const o of offers) {
    if (o.canton !== canton) continue;
    if (!cityRegex.test(String(o.city || "").trim())) continue;
    const ph = String(o.rawPhone || "").trim();
    if (!/^\+41\s*7[5-9]/.test(ph)) continue;
    const d = ph.replace(/\D/g, "");
    if (usedPhones.has(d)) continue;
    usedPhones.add(d);
    out.push(o);
    if (out.length >= count) break;
  }
  return out;
}

const zg10 = pickPureCantonPilots("ZG", PURE_ZG, 10);
const zh10 = pickPureCantonPilots("ZH", PURE_ZH, 10);

const states = fs.existsSync(statePath) ? JSON.parse(fs.readFileSync(statePath, "utf8")) : {};

const pilotCohort = [...zg10, ...zh10].map((p, idx) => {
  const pid = p.id || p.dedupClusterId;
  const token = makeToken(pid);
  const cleanName = String(p.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim().slice(0, 34) || `Pilot-${idx + 1}`;
  const waDigits = String(p.rawPhone).replace(/\D/g, "");
  const directCockpitUrl = `https://iwantsexnow.ch/creator-dashboard?id=${encodeURIComponent(pid)}&token=${encodeURIComponent(token)}`;
  const inviteText = `Hallo ${cleanName}, für deinen Eintrag in ${p.city} (${p.canton}) haben wir auf iwantsexnow.ch die kostenlose Selbstverwaltung freigeschaltet. Du kannst deine Angaben hier direkt ohne Abo kontrollieren, korrigieren, Verfügbarkeit bestätigen oder pausieren: ${directCockpitUrl}`;

  states[pid] = {
    ...(states[pid] || {}),
    profileId: pid,
    displayName: cleanName,
    city: p.city,
    canton: p.canton,
    phoneDisplay: p.rawPhone,
    rate30Chf: Number(p.rate30Chf) || 200,
    rate60Chf: Number(p.advertisedBaseChf) || 350,
    bio: p.bio || `${cleanName} in ${p.city} (${p.canton}) – Direktkontakt ohne Agentur-Aufschlag.`,
    accountConfirmed: true,
    published: true,
    paused: false,
    pilotSlot: idx + 1,
    updatedAt: new Date().toISOString(),
  };

  return {
    pilotSlot: idx + 1,
    profileId: pid,
    name: cleanName,
    city: p.city,
    canton: p.canton,
    phoneDisplay: p.rawPhone,
    waDigits,
    rate30Chf: Number(p.rate30Chf) || 200,
    rate60Chf: Number(p.advertisedBaseChf) || 350,
    sourcePortal: p.sourcePortal || "xdate.ch",
    outreachStatus: "DRY_RUN_ONLY_NOT_CONTACTED",
    ownerToken: token,
    directCockpitUrl,
    localTestUrl: `http://localhost:3000/creator-dashboard?id=${encodeURIComponent(pid)}&token=${encodeURIComponent(token)}`,
    waInviteUrl: `https://wa.me/${waDigits}?text=${encodeURIComponent(inviteText)}`,
  };
});

fs.writeFileSync(pilotPath, JSON.stringify(pilotCohort, null, 2), "utf8");
fs.writeFileSync(statePath, JSON.stringify(states, null, 2), "utf8");

// 3. Stelle sicher, dass /api/vault/metrics.ts sowohl "token" als auch "ownerToken" sowie rate30Chf & phoneDisplay akzeptiert
if (fs.existsSync(metricsApiPath)) {
  let apiCode = fs.readFileSync(metricsApiPath, "utf8");
  apiCode = apiCode.replace(
    "const isOwner = Boolean(ownerToken && String(ownerToken) === expectedToken);",
    "const providedTok = String(ownerToken || req.body?.token || '').trim();\n        const isOwner = Boolean(providedTok && providedTok === expectedToken);"
  );
  if (!apiCode.includes("updates.rate30Chf")) {
    apiCode = apiCode.replace(
      'if (typeof updates.rate60Chf === "number") nextState.rate60Chf = Math.max(50, Math.min(5000, updates.rate60Chf));',
      'if (typeof updates.rate60Chf === "number") nextState.rate60Chf = Math.max(50, Math.min(5000, updates.rate60Chf));\n        if (typeof updates.rate30Chf === "number") nextState.rate30Chf = Math.max(40, Math.min(3000, updates.rate30Chf));\n        if (typeof updates.phoneDisplay === "string") nextState.phoneDisplay = updates.phoneDisplay.trim().slice(0, 30);\n        if (typeof updates.availableUntil === "string") nextState.availableUntil = updates.availableUntil;'
    );
  }
  fs.writeFileSync(metricsApiPath, apiCode, "utf8");
}

console.log("\n=== 100% REINE ZUGER (ZG) & ZÜRCHER (ZH) PILOT-20 KOHORTE (0 NACHRICHTEN GESENDET) ===");
console.table(
  pilotCohort.map((p) => ({
    Slot: p.pilotSlot,
    Kanton: p.canton,
    Stadt: p.city,
    Name: p.name,
    Handy: p.phoneDisplay,
    CHF_30m: p.rate30Chf,
    CHF_60m: p.rate60Chf,
  }))
);

console.log("\n👉 DEINE BEIDEN LIVE-COCKPIT-LINKS FÜR DEN BROWSER:");
console.log("1) ZUG (" + pilotCohort[0].name + ", " + pilotCohort[0].city + "):");
console.log("   " + pilotCohort[0].directCockpitUrl);
console.log("2) ZÜRICH (" + pilotCohort[10].name + ", " + pilotCohort[10].city + "):");
console.log("   " + pilotCohort[10].directCockpitUrl + "\n");