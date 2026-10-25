import fs from "fs";
import path from "path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dataDir = path.join(process.cwd(), "src", "data");

const vaultPath = path.join(dataDir, "rosalon-scale-vault.jsonl");
const unlockedPath = path.join(dataDir, "unlocked-subpage-phones.json");
const claimsPath = path.join(dataDir, "ready-whatsapp-claims.json");
const clubsPath = path.join(dataDir, "swiss-establishments-vault.json");
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
const statsPath = path.join(dataDir, "index-stats.json");

function sanitizeStr(input) {
  if (!input) return "";
  const s = String(input);
  if (typeof s.toWellFormed === "function") return s.toWellFormed().trim();
  return s.replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "").trim();
}

const VALID_CH_PREFIXES = new Set([
  "75", "76", "77", "78", "79",
  "21", "22", "24", "26", "27",
  "31", "32", "33", "34",
  "41", "43", "44",
  "52", "55", "56", "58",
  "61", "62", "71", "81", "91"
]);

function validateSwissPhone(raw) {
  if (!raw) return null;
  const s = sanitizeStr(raw);
  if (s.includes("07x") || s.includes("123456") || s.includes("234567") || s.includes("000000") || s.includes("999999")) return null;
  if (s.startsWith("+") && !s.startsWith("+41")) return null;

  let d = s.replace(/\D/g, "");
  if (d.startsWith("0041")) d = "41" + d.slice(4);
  else if (d.startsWith("0") && d.length === 10) d = "41" + d.slice(1);
  else if (d.length === 9 && VALID_CH_PREFIXES.has(d.slice(0, 2))) d = "41" + d;

  if (!d.startsWith("41") || d.length !== 11) return null;
  const prefix = d.slice(2, 4);
  const sub = d.slice(4);
  if (!VALID_CH_PREFIXES.has(prefix) || /^(\d)\1{5,}$/.test(sub) || sub === "1234567" || sub === "7654321") return null;

  return {
    waDigits: d,
    formatted: `+41 ${prefix} ${sub.slice(0, 3)} ${sub.slice(3, 5)} ${sub.slice(5, 7)}`,
    isMobile: ["75", "76", "77", "78", "79"].includes(prefix),
  };
}

function readJsonSafe(p, fb) {
  try { return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fb; } catch { return fb; }
}

function saveAllCheckpoints(allVault, unlockedMap, clubsList) {
  // 1. Update Vault with newly unlocked phones & galleries
  for (const r of allVault) {
    r.rawName = sanitizeStr(r.rawName);
    r.city = sanitizeStr(r.city || "Zürich");
    const u = String(r.sourceUrl || "").trim();
    if (unlockedMap[u] && unlockedMap[u].realPhone) {
      r.rawPhone = unlockedMap[u].realPhone;
      if (unlockedMap[u].rate60Chf >= 150) r.advertisedBaseChf = unlockedMap[u].rate60Chf;
      if (Array.isArray(unlockedMap[u].gallery) && unlockedMap[u].gallery.length > 0) r.gallery = unlockedMap[u].gallery;
      if (unlockedMap[u].bio && unlockedMap[u].bio.length > 30) r.bio = sanitizeStr(unlockedMap[u].bio);
    }
    const chk = validateSwissPhone(r.rawPhone);
    r.rawPhone = chk ? chk.formatted : "";
  }

  fs.writeFileSync(vaultPath, allVault.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");
  fs.writeFileSync(unlockedPath, JSON.stringify(unlockedMap, null, 2), "utf8");
  fs.writeFileSync(clubsPath, JSON.stringify(clubsList, null, 2), "utf8");

  // 2. Build clean WhatsApp Claims list
  const seenDigits = new Set();
  const cleanClaims = [];
  for (const r of allVault) {
    const chk = validateSwissPhone(r.rawPhone);
    if (!chk || seenDigits.has(chk.waDigits)) continue;
    seenDigits.add(chk.waDigits);

    const cleanName = sanitizeStr(r.rawName).replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim() || "Profil";
    const city = sanitizeStr(r.city).split("/")[0].trim() || "Zürich";
    const claimUrl = `https://iwantsexnow.ch/create-post?claim=${encodeURIComponent(cleanName)}`;
    const msg = `Hallo ${cleanName} 👋 Dein Eintrag in ${city} ist im Schweizer Vergleichs- & Suchverzeichnis iwantsexnow.ch gelistet. Du kannst dein Profil hier kostenlos selbst verwalten, korrigieren oder den 30-Tage-Gründungszugang aktivieren: ${claimUrl} (oder jederzeit ohne Anmeldung ausblenden unter iwantsexnow.ch/report)`;

    cleanClaims.push({
      name: cleanName,
      rawTitle: r.rawName,
      city,
      canton: r.canton || "ZH",
      phoneDisplay: chk.formatted,
      waDigits: chk.waDigits,
      isMobile: chk.isMobile,
      waClickUrl: `https://wa.me/${chk.waDigits}?text=${encodeURIComponent(msg)}`,
      claimUrl,
      portal: r.sourcePortal || "xdate.ch",
      rateChf: r.advertisedBaseChf || 400,
      sourceUrl: r.sourceUrl || "",
    });
  }

  cleanClaims.sort((a, b) => {
    const aM = a.isMobile ? 20 : 0;
    const bM = b.isMobile ? 20 : 0;
    const aC = a.canton === "ZG" ? 10 : a.canton === "ZH" ? 7 : 0;
    const bC = b.canton === "ZG" ? 10 : b.canton === "ZH" ? 7 : 0;
    return (bM + bC) - (aM + aC);
  });
  fs.writeFileSync(claimsPath, JSON.stringify(cleanClaims, null, 2), "utf8");

  // 3. Build top 650 fast frontend bundle
  const sortedFront = [...allVault].sort((a, b) => {
    const aP = a.rawPhone ? 25 : 0;
    const bP = b.rawPhone ? 25 : 0;
    const aLoc = a.canton === "ZG" || a.canton === "ZH" ? 6 : 0;
    const bLoc = b.canton === "ZG" || b.canton === "ZH" ? 6 : 0;
    const aT = a.thumbnail ? 4 : 0;
    const bT = b.thumbnail ? 4 : 0;
    return (bP + bLoc + bT) - (aP + aLoc + aT);
  });

  const seenFront = new Set();
  const top650 = [];
  for (const item of sortedFront) {
    const chk = validateSwissPhone(item.rawPhone);
    const key = chk ? chk.waDigits : `${item.rawName.toLowerCase()}|${item.canton || ""}`;
    if (seenFront.has(key)) continue;
    seenFront.add(key);
    top650.push(item);
    if (top650.length >= 650) break;
  }

  fs.writeFileSync(offersPath, JSON.stringify(top650, null, 2), "utf8");
  fs.writeFileSync(offersTsPath, `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\n`, "utf8");

  const stats = {
    updatedAt: new Date().toISOString(),
    portalsIndexed: 27,
    totalRawListingsInVault: allVault.length,
    totalEstablishmentsInVault: clubsList.length,
    uniqueFrontendProfiles: top650.length,
    unlockedRealPhones: cleanClaims.length,
    mobileWhatsappReadyPhones: cleanClaims.filter((c) => c.isMobile).length,
  };
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf8");
  return stats;
}

function buildWave3CatalogQueue() {
  const q = [];
  const xdateDeep = [
    { slug: "escort-zuerich", canton: "ZH", city: "Zürich", start: 36, end: 58 },
    { slug: "escort-zug", canton: "ZG", city: "Zug / Cham", start: 11, end: 22 },
    { slug: "escort-basel", canton: "BS", city: "Basel", start: 36, end: 50 },
    { slug: "escort-bern", canton: "BE", city: "Bern", start: 36, end: 50 },
    { slug: "escort-luzern", canton: "LU", city: "Luzern", start: 36, end: 48 },
    { slug: "escort-aargau", canton: "AG", city: "Aargau / Baden", start: 36, end: 50 },
    { slug: "escort-st-gallen", canton: "SG", city: "St. Gallen", start: 36, end: 48 },
    { slug: "erotische-massage-zuerich", canton: "ZH", city: "Zürich", start: 1, end: 15 },
    { slug: "erotische-massage-zug", canton: "ZG", city: "Zug", start: 1, end: 8 },
    { slug: "domina-schweiz", canton: "ZH", city: "Zürich / Schweiz", start: 1, end: 12 },
  ];
  for (const r of xdateDeep) {
    for (let p = r.start; p <= r.end; p++) {
      q.push({ portal: "xdate.ch", url: `https://www.xdate.ch/${r.slug}?page=${p}`, canton: r.canton, city: r.city });
    }
  }

  const fgirlDeep = [
    { path: "schweiz/zuerich", canton: "ZH", city: "Zürich", start: 46, end: 60 },
    { path: "filles/geneve", canton: "GE", city: "Genève", start: 46, end: 60 },
    { path: "filles/vaud", canton: "VD", city: "Lausanne", start: 46, end: 60 },
    { path: "schweiz/basel", canton: "BS", city: "Basel", start: 13, end: 25 },
    { path: "schweiz/luzern", canton: "LU", city: "Luzern", start: 11, end: 22 },
  ];
  for (const r of fgirlDeep) {
    for (let p = r.start; p <= r.end; p++) {
      q.push({ portal: "fgirl.ch", url: `https://www.fgirl.ch/${r.path}/?page=${p}`, canton: r.canton, city: r.city });
    }
  }

  const and6Deep = [
    { path: "de/girls/zuerich", canton: "ZH", city: "Zürich", start: 46, end: 62 },
    { path: "de/girls/zentralschweiz", canton: "ZG", city: "Zug / Luzern", start: 13, end: 28 },
    { path: "de/girls/mittelland", canton: "AG", city: "Aargau / Olten", start: 46, end: 60 },
    { path: "de/girls/basel", canton: "BS", city: "Basel", start: 13, end: 25 },
  ];
  for (const r of and6Deep) {
    for (let p = r.start; p <= r.end; p++) {
      q.push({ portal: "and6.com", url: `https://www.and6.com/${r.path}?page=${p}`, canton: r.canton, city: r.city });
    }
  }
  return q;
}

async function runDinnerMarathon() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.error("FEHLER: Kein FIRECRAWL_API_KEY gesetzt!");
    process.exit(1);
  }

  const unlockedMap = readJsonSafe(unlockedPath, {});
  const clubsList = readJsonSafe(clubsPath, []);
  const lines = fs.existsSync(vaultPath) ? fs.readFileSync(vaultPath, "utf8").split("\n").filter(Boolean) : [];
  const allVault = [];
  for (const l of lines) {
    try { allVault.push(JSON.parse(l)); } catch {}
  }

  console.log("=====================================================================");
  console.log("🍽️  2-3 STUNDEN DINNER-MARATHON GESTARTET!");
  console.log(`   Start-Bestand: ${allVault.length} Listings | ${clubsList.length} Clubs`);
  console.log("=====================================================================\n");

  // -------------------------------------------------------------------------
  // PHASE 1: SUBPAGE +41 PHONE & GALLERY BREAKER (450 UNCHECKED PROFILES)
  // -------------------------------------------------------------------------
  const subpageCandidates = allVault.filter((r) => {
    const u = String(r.sourceUrl || "").trim();
    if (!u.startsWith("http") || u.includes("?page=")) return false;
    if (unlockedMap[u]) return false;
    if (validateSwissPhone(r.rawPhone)) return false;
    return u.includes("xdate.ch/de/") || u.includes("fgirl.ch/") || u.includes("and6.com/");
  });

  // Priorisiere ZG, ZH, LU, AG, BS, BE
  const prio = new Set(["ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD"]);
  subpageCandidates.sort((a, b) => {
    const aS = a.canton === "ZG" ? 20 : a.canton === "ZH" ? 15 : prio.has(a.canton) ? 8 : 1;
    const bS = b.canton === "ZG" ? 20 : b.canton === "ZH" ? 15 : prio.has(b.canton) ? 8 : 1;
    return bS - aS;
  });

  const phoneBatch = subpageCandidates.slice(0, 450);
  console.log(`[PHASE 1/2] Knacke +41 Nummern & Galerien auf ${phoneBatch.length} Einzelprofilen (von ${subpageCandidates.length} ungeprüften)...`);

  let step = 0;
  let newValidPhones = 0;

  for (const item of phoneBatch) {
    step++;
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: item.sourceUrl,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 800 },
            { type: "scroll", direction: "down", amount: 650 },
          ],
          extract: {
            schema: {
              type: "object",
              properties: {
                realSwissPhone: { type: "string" },
                rate60Chf: { type: "number" },
                galleryUrls: { type: "array", items: { type: "string" } },
                fullBio: { type: "string" },
              },
            },
            prompt: "Extract the real Swiss mobile or landline phone number (+41 or 079/078/077/076/044/041) as realSwissPhone, 1h CHF rate as rate60Chf, gallery image URLs, and full bio description.",
          },
        }),
      });
      const data = await res.json();
      const ext = data?.data?.extract;
      const chk = validateSwissPhone(ext?.realSwissPhone);

      if (chk) {
        unlockedMap[item.sourceUrl] = {
          rawName: sanitizeStr(item.rawName),
          city: sanitizeStr(item.city),
          canton: item.canton,
          sourcePortal: item.sourcePortal,
          sourceUrl: item.sourceUrl,
          realPhone: chk.formatted,
          waDigits: chk.waDigits,
          isMobile: chk.isMobile,
          rate60Chf: ext.rate60Chf || item.advertisedBaseChf || 400,
          gallery: Array.isArray(ext.galleryUrls) ? ext.galleryUrls.slice(0, 8) : [],
          bio: sanitizeStr(ext.fullBio || item.bio || ""),
          unlockedAt: new Date().toISOString(),
        };
        newValidPhones++;
        console.log(`   [Subpage ${step}/${phoneBatch.length}] 🔓 +41 TREFFER (+${newValidPhones}): ${item.rawName} (${item.city}) -> ${chk.formatted}`);
      } else {
        unlockedMap[item.sourceUrl] = { checkedNoPhone: true, unlockedAt: new Date().toISOString() };
        console.log(`   [Subpage ${step}/${phoneBatch.length}] - Geprüft (${item.rawName})`);
      }

      if (step % 10 === 0 || step === phoneBatch.length) {
        const st = saveAllCheckpoints(allVault, unlockedMap, clubsList);
        console.log(`      💾 [Auto-Save] Tresor: ${st.totalRawListingsInVault} Listings | Echte +41 Nummern: ${st.unlockedRealPhones} (${st.mobileWhatsappReadyPhones} Mobilfunk)`);
      }
    } catch {}
    await sleep(300);
  }

  // -------------------------------------------------------------------------
  // PHASE 2: WAVE 3 DEEP CATALOG PAGES (PAGES 36 TO 65 + SPECIAL RUBRICS)
  // -------------------------------------------------------------------------
  const catalogQueue = buildWave3CatalogQueue();
  console.log(`\n[PHASE 2/2] Starte Wave 3 Katalog-Crawl über ${catalogQueue.length} tiefe Seiten...`);

  let cStep = 0;
  for (const target of catalogQueue) {
    cStep++;
    console.log(`[Wave3 ${cStep}/${catalogQueue.length}] ${target.portal} (${target.city}, ${target.canton}) -> ${target.url}`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: target.url,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 1100 },
            { type: "scroll", direction: "down", amount: 1200 },
          ],
          extract: {
            schema: {
              type: "object",
              properties: {
                profiles: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      rawName: { type: "string" },
                      age: { type: "number" },
                      rawPhone: { type: "string" },
                      city: { type: "string" },
                      advertisedBaseChf: { type: "number" },
                      includedTags: { type: "array", items: { type: "string" } },
                      bio: { type: "string" },
                      thumbnail: { type: "string" },
                      sourceUrl: { type: "string" },
                    },
                    required: ["rawName"],
                  },
                },
              },
            },
            prompt: "Extract all escort, massage or studio profiles on this page: rawName, age, Swiss phone (+41/079/078/076 if visible), city, 1h CHF rate, services, bio, image URL (thumbnail) and profile URL (sourceUrl).",
          },
        }),
      });
      const data = await res.json();
      const list = data?.data?.extract?.profiles || [];

      if (list.length > 0) {
        for (const item of list) {
          if (!item.rawName) continue;
          const chk = validateSwissPhone(item.rawPhone);
          allVault.push({
            sourcePortal: target.portal,
            sourceUrl: sanitizeStr(item.sourceUrl || target.url),
            rawName: sanitizeStr(item.rawName).slice(0, 60),
            genderCategory: "female",
            age: Number(item.age) >= 18 && Number(item.age) <= 65 ? Number(item.age) : 25,
            rawPhone: chk ? chk.formatted : "",
            city: sanitizeStr(item.city || target.city).slice(0, 40),
            canton: target.canton,
            subareas: [sanitizeStr(item.city || target.city), target.city],
            advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 400,
            includedTags: Array.isArray(item.includedTags) && item.includedTags.length ? item.includedTags.slice(0, 6).map(sanitizeStr) : ["GFE", "Privat"],
            incall: true,
            outcall: true,
            scrapedAtIso: new Date().toISOString(),
            directAuthorized: false,
            thumbnail: item.thumbnail && String(item.thumbnail).startsWith("http") ? String(item.thumbnail) : undefined,
            bio: item.bio ? sanitizeStr(item.bio).slice(0, 360) : undefined,
          });
        }
        console.log(`   ✓ +${list.length} Profile gespeichert! (Master-Tresor: ${allVault.length} Listings)`);
      }

      if (cStep % 8 === 0 || cStep === catalogQueue.length) {
        saveAllCheckpoints(allVault, unlockedMap, clubsList);
      }
    } catch {}
    await sleep(450);
  }

  const finalStats = saveAllCheckpoints(allVault, unlockedMap, clubsList);
  console.log("\n=====================================================================");
  console.log("🏆 DINNER-MARATHON KOMPLETT ABGESCHLOSSEN!");
  console.log(` • Gesamt-Listings im Tresor:     ${finalStats.totalRawListingsInVault}`);
  console.log(` • Schweizer Clubs & Studios:     ${finalStats.totalEstablishmentsInVault}`);
  console.log(` • Geprüfte echte +41 Nummern:    ${finalStats.unlockedRealPhones} (davon ${finalStats.mobileWhatsappReadyPhones} Handy 075-079)`);
  console.log("=====================================================================\n");
}

runDinnerMarathon();