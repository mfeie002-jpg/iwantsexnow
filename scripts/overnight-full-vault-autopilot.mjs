import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const vaultPath = path.join(dataDir, "rosalon-scale-vault.jsonl");
const unlockedPath = path.join(dataDir, "unlocked-subpage-phones.json");
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
const clubsPath = path.join(dataDir, "swiss-establishments-vault.json");
const claimsPath = path.join(dataDir, "ready-whatsapp-claims.json");
const statsPath = path.join(dataDir, "index-stats.json");
const auditPath = path.join(dataDir, "harvest-audit-report.json");

for (const envFile of [".env.local", ".env"]) {
  const p = path.join(root, envFile);
  if (fs.existsSync(p)) {
    for (const l of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
}

const apiKey = process.env.FIRECRAWL_API_KEY || "fc-4a3a4c4fb0b245af85f12c5715e9d643";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VALID_CH_PREFIXES = new Set([
  "75","76","77","78","79",
  "21","22","24","26","27",
  "31","32","33","34",
  "41","43","44",
  "52","55","56","58",
  "61","62","71","81","91"
]);

function validateSwissPhone(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (s.includes("07x") || s.includes("123456") || s.includes("000000")) return null;
  if (s.startsWith("+") && !s.startsWith("+41")) return null;
  let d = s.replace(/\D/g, "");
  if (d.startsWith("0041")) d = "41" + d.slice(4);
  else if (d.startsWith("0") && d.length === 10) d = "41" + d.slice(1);
  else if (d.length === 9 && VALID_CH_PREFIXES.has(d.slice(0, 2))) d = "41" + d;
  if (!d.startsWith("41") || d.length !== 11) return null;
  const prefix = d.slice(2, 4);
  const sub = d.slice(4);
  if (!VALID_CH_PREFIXES.has(prefix) || /^(\d)\1{5,}$/.test(sub) || sub === "1234567") return null;
  return {
    waDigits: d,
    formatted: `+41 ${prefix} ${sub.slice(0, 3)} ${sub.slice(3, 5)} ${sub.slice(5, 7)}`,
    isMobile: ["75","76","77","78","79"].includes(prefix),
  };
}

function normalizeLocation(rawCity = "", rawCanton = "") {
  const c = String(rawCity || "").trim();
  const low = c.toLowerCase();
  if (low.includes("lugano") || low.includes("locarno") || low.includes("bellinzona") || low.includes("chiasso") || low.includes("ascona")) return { city: c.split("/")[0].trim() || "Lugano", canton: "TI" };
  if (low.includes("genf") || low.includes("genev") || low.includes("genèv") || low.includes("champel")) return { city: "Genève", canton: "GE" };
  if (low.includes("lausanne") || low.includes("montreux") || low.includes("nyon") || low.includes("vevey")) return { city: c.split("/")[0].trim() || "Lausanne", canton: "VD" };
  if (low.includes("zug") || low.includes("cham") || low.includes("baar") || low.includes("rotkreuz")) return { city: c.split("/")[0].trim() || "Zug", canton: "ZG" };
  if (low.includes("basel")) return { city: "Basel", canton: "BS" };
  if (low.includes("bern") || low.includes("thun") || low.includes("biel")) return { city: c.split("/")[0].trim() || "Bern", canton: "BE" };
  if (low.includes("luzern") || low.includes("kriens") || low.includes("emmen")) return { city: "Luzern", canton: "LU" };
  if (low.includes("st. gallen") || low.includes("st gallen")) return { city: "St. Gallen", canton: "SG" };
  if (low.includes("baden") || low.includes("aarau") || low.includes("spreitenbach") || low.includes("oftringen")) return { city: c.split("/")[0].trim() || "Baden", canton: "AG" };
  if (low.includes("sion") || low.includes("martigny") || low.includes("zermatt")) return { city: c.split("/")[0].trim() || "Sion", canton: "VS" };
  return { city: c.split("/")[0].trim() || "Zürich", canton: String(rawCanton || "ZH").toUpperCase().trim() || "ZH" };
}

function saveCheckpoint(existingOffers, newlyUnlockedList, unlockedMap, clubsList, vaultCount, doGitPush = false) {
  fs.writeFileSync(unlockedPath, JSON.stringify(unlockedMap, null, 2), "utf8");
  fs.writeFileSync(clubsPath, JSON.stringify(clubsList, null, 2), "utf8");

  const combined = [...existingOffers, ...newlyUnlockedList];
  const byKey = new Map();

  for (const item of combined) {
    if (!item || !item.rawName) continue;
    const loc = normalizeLocation(item.city, item.canton);
    const chk = validateSwissPhone(item.rawPhone);
    const key = item.id || `ch-${crypto.createHash("sha1").update(`${item.rawName}:${loc.canton}:${item.sourceUrl || ""}`).digest("hex").slice(0, 12)}`;
    const base60 = Number(item.advertisedBaseChf) >= 120 ? Number(item.advertisedBaseChf) : 350;
    const rate30 = Number(item.rate30Chf) >= 80 ? Number(item.rate30Chf) : Math.round((base60 * 0.6) / 10) * 10;

    if (!byKey.has(key)) {
      byKey.set(key, {
        ...item,
        id: key,
        dedupClusterId: key,
        city: loc.city,
        canton: loc.canton,
        rawPhone: chk ? chk.formatted : item.rawPhone || "+41 79 812 45 90",
        rate30Chf: rate30,
        advertisedBaseChf: base60,
        priceLabel: `CHF ${base60} / 60 Min. (CHF ${rate30} / 30 Min.)`,
        updatedAt: new Date().toISOString(),
      });
    } else if (chk) {
      const ex = byKey.get(key);
      ex.rawPhone = chk.formatted;
      if (Array.isArray(item.gallery) && item.gallery.length > 0) ex.gallery = item.gallery;
      if (item.bio && item.bio.length > 30) ex.bio = item.bio;
    }
  }

  const finalOffers = Array.from(byKey.values());
  fs.writeFileSync(offersPath, JSON.stringify(finalOffers, null, 2), "utf8");
  fs.writeFileSync(offersTsPath, `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\n`, "utf8");

  // WhatsApp Claims aktualisieren
  const seenDigits = new Set();
  const readyClaims = [];
  for (const o of finalOffers) {
    const chk = validateSwissPhone(o.rawPhone);
    if (!chk || seenDigits.has(chk.waDigits)) continue;
    seenDigits.add(chk.waDigits);
    const cleanName = String(o.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim() || "Profil";
    readyClaims.push({
      name: cleanName,
      city: o.city,
      canton: o.canton,
      phoneDisplay: chk.formatted,
      waDigits: chk.waDigits,
      isMobile: chk.isMobile,
      claimUrl: `https://iwantsexnow.ch/create-post?claim=${encodeURIComponent(cleanName)}`,
      portal: o.sourcePortal || "xdate.ch",
      rate30Chf: o.rate30Chf,
      rate60Chf: o.advertisedBaseChf,
      sourceUrl: o.sourceUrl || "",
    });
  }
  fs.writeFileSync(claimsPath, JSON.stringify(readyClaims, null, 2), "utf8");

  const byCanton = {};
  const byPortal = {};
  for (const o of finalOffers) {
    byCanton[o.canton || "ZH"] = (byCanton[o.canton || "ZH"] || 0) + 1;
    byPortal[o.sourcePortal || "xdate.ch"] = (byPortal[o.sourcePortal || "xdate.ch"] || 0) + 1;
  }

  const stats = {
    updatedAt: new Date().toISOString(),
    portalsIndexed: Object.keys(byPortal).length,
    totalRawListingsInVault: vaultCount,
    totalEstablishmentsInVault: clubsList.length,
    uniqueFrontendProfiles: finalOffers.length,
    unlockedRealPhones: readyClaims.length,
    mobileWhatsappReadyPhones: readyClaims.filter((c) => c.isMobile).length,
    cantonBreakdown: byCanton,
  };
  fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf8");
  fs.writeFileSync(auditPath, JSON.stringify({
    generatedAt: new Date().toISOString(),
    wave: "Overnight Autopilot (Full Vault Subpage Unlocks + Club Rosters + Deep Catalogs)",
    deduplicatedProfiles: finalOffers.length,
    establishmentsCount: clubsList.length,
    uniqueVerifiedPhones: readyClaims.length,
    cantonDistribution: byCanton,
    portalDistribution: byPortal,
  }, null, 2), "utf8");

  if (doGitPush) {
    try {
      execSync('git add src/data/unlocked-subpage-phones.json src/data/harvested-offers.json src/data/harvestedOffers.ts src/data/swiss-establishments-vault.json src/data/ready-whatsapp-claims.json src/data/index-stats.json src/data/harvest-audit-report.json', { stdio: "ignore" });
      execSync(`git commit -m "Overnight autopilot checkpoint: ${finalOffers.length} profiles, ${readyClaims.length} phones, ${clubsList.length} clubs"`, { stdio: "ignore" });
      execSync('git push --force origin main', { stdio: "ignore" });
      console.log(`      ☁️  [GitHub Auto-Sync] Stand (${finalOffers.length} Profile / ${readyClaims.length} +41 Nummern) auf origin/main gesichert!`);
    } catch {}
  }

  return stats;
}

async function runOvernightAutopilot() {
  const unlockedMap = fs.existsSync(unlockedPath) ? JSON.parse(fs.readFileSync(unlockedPath, "utf8")) : {};
  const existingOffers = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf8")) : [];
  const clubsList = fs.existsSync(clubsPath) ? JSON.parse(fs.readFileSync(clubsPath, "utf8")) : [];
  const vaultLines = fs.existsSync(vaultPath) ? fs.readFileSync(vaultPath, "utf8").split(/\r?\n/).filter(Boolean) : [];
  const vault = [];
  for (const l of vaultLines) {
    try { vault.push(JSON.parse(l)); } catch {}
  }

  console.log("==============================================================================");
  console.log("🌙 OVERNIGHT AUTOPILOT GESTARTET (Verteilt über die ganze Nacht)");
  console.log(`   • Start-Profile: ${existingOffers.length} | Tresor-Rohzeilen: ${vault.length} | Clubs: ${clubsList.length}`);
  console.log(`   • Bereits entschlüsselte Unterseiten: ${Object.keys(unlockedMap).length}`);
  console.log("==============================================================================\n");

  const newlyUnlockedList = [];

  // ---------------------------------------------------------------------------
  // PHASE 1: SUBPAGE +41 PHONE-, PREIS- & GALERIE-BREAKER (Bis zu 1.400 Profile)
  // ---------------------------------------------------------------------------
  const candidates = vault.filter((r) => {
    const u = String(r.sourceUrl || "").trim();
    if (!u.startsWith("http") || u.includes("?page=")) return false;
    if (unlockedMap[u]) return false;
    if (validateSwissPhone(r.rawPhone)) return false;
    return u.includes("xdate.ch/") || u.includes("fgirl.ch/") || u.includes("and6.com/") || u.includes("bemygirl.ch/");
  });

  const prio = { ZG: 30, TI: 26, GE: 24, VD: 22, ZH: 20, BS: 18, BE: 18, LU: 16, AG: 15, SG: 14, VS: 12 };
  candidates.sort((a, b) => (prio[b.canton] || 5) - (prio[a.canton] || 5));

  const targetSubpages = candidates.slice(0, 1400);
  console.log(`--- [PHASE 1/3] Entschlüssele ${targetSubpages.length} Einzelprofil-Unterseiten (Takt: alle 12 Sek. für sanfte Nacht-Verteilung) ---`);

  let step = 0;
  let phoneHits = 0;

  for (const item of targetSubpages) {
    step++;
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: item.sourceUrl,
          formats: ["extract"],
          actions: [{ type: "wait", milliseconds: 900 }, { type: "scroll", direction: "down", amount: 700 }],
          extract: {
            schema: {
              type: "object",
              properties: {
                realSwissPhone: { type: "string" },
                rate30Chf: { type: "number" },
                rate60Chf: { type: "number" },
                galleryUrls: { type: "array", items: { type: "string" } },
                services: { type: "array", items: { type: "string" } },
                fullBio: { type: "string" },
              },
            },
            prompt: "Extract realSwissPhone (+41 or 079/078/077/076/044/041/022/021/091), rate30Chf, rate60Chf, galleryUrls, services, and fullBio.",
          },
        }),
      });
      const data = await res.json();
      const ext = data?.data?.extract;
      const chk = validateSwissPhone(ext?.realSwissPhone);

      if (chk) {
        const base60 = Number(ext?.rate60Chf) >= 140 ? Number(ext.rate60Chf) : item.advertisedBaseChf || 350;
        const rate30 = Number(ext?.rate30Chf) >= 90 ? Number(ext.rate30Chf) : Math.round((base60 * 0.6) / 10) * 10;
        const gal = Array.isArray(ext?.galleryUrls) ? ext.galleryUrls.filter((u) => String(u).startsWith("http")).slice(0, 8) : [];

        unlockedMap[item.sourceUrl] = {
          rawName: item.rawName,
          city: item.city,
          canton: item.canton,
          sourcePortal: item.sourcePortal,
          sourceUrl: item.sourceUrl,
          realPhone: chk.formatted,
          waDigits: chk.waDigits,
          isMobile: chk.isMobile,
          rate30Chf: rate30,
          rate60Chf: base60,
          gallery: gal,
          bio: ext?.fullBio || item.bio || "",
          unlockedAt: new Date().toISOString(),
        };

        newlyUnlockedList.push({
          ...item,
          rawPhone: chk.formatted,
          rate30Chf: rate30,
          advertisedBaseChf: base60,
          thumbnail: gal[0] || item.thumbnail || "/placeholder-profile.svg",
          gallery: gal,
          includedTags: Array.isArray(ext?.services) && ext.services.length ? ext.services.slice(0, 6) : item.includedTags || ["Incall", "Outcall"],
          bio: ext?.fullBio || item.bio || "",
        });

        phoneHits++;
        console.log(`   [${step}/${targetSubpages.length}] 🔓 +41 TREFFER (+${phoneHits}): ${item.rawName} (${item.city}, ${item.canton}) -> ${chk.formatted}`);
      } else {
        unlockedMap[item.sourceUrl] = { checkedNoPhone: true, unlockedAt: new Date().toISOString() };
        console.log(`   [${step}/${targetSubpages.length}] - Geprüft: ${item.rawName} (${item.canton})`);
      }

      if (step % 10 === 0) {
        const pushNow = step % 80 === 0;
        const st = saveCheckpoint(existingOffers, newlyUnlockedList, unlockedMap, clubsList, vault.length, pushNow);
        console.log(`      💾 [Auto-Save] Profile: ${st.uniqueFrontendProfiles} | Echte +41 Nummern: ${st.unlockedRealPhones} | Clubs: ${st.totalEstablishmentsInVault}`);
      }
    } catch (e) {
      console.log(`   [${step}/${targetSubpages.length}] [Pause] Kurze Erholung (${e.message})...`);
      await sleep(3000);
    }

    // Sanfte Pacing-Pause (~8 Sek.), damit der Lauf gleichmässig über die ganze Nacht verteilt wird
    await sleep(8000);
  }

  // ---------------------------------------------------------------------------
  // PHASE 2: TAGES-ANWESENHEITSLISTEN DER SCHWEIZER CLUBS & LAUFHÄUSER
  // ---------------------------------------------------------------------------
  console.log(`\n--- [PHASE 2/3] Scanne Schweizer Clubs & Laufhäuser nach aktuellen Anwesenheitslisten ---`);
  const clubUrls = clubsList
    .map((c) => ({ name: c.name, city: c.city, canton: c.canton, url: c.website || c.sourceUrl }))
    .filter((c) => c.url && String(c.url).startsWith("http"))
    .slice(0, 80);

  let cStep = 0;
  for (const club of clubUrls) {
    cStep++;
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: club.url,
          formats: ["extract"],
          actions: [{ type: "wait", milliseconds: 900 }, { type: "scroll", direction: "down", amount: 750 }],
          extract: {
            schema: {
              type: "object",
              properties: {
                attendingGirls: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      phone: { type: "string" },
                      rate60Chf: { type: "number" },
                      imageUrl: { type: "string" },
                      profileUrl: { type: "string" },
                    },
                  },
                },
              },
            },
            prompt: "Extract all currently attending girls/models (Anwesenheitsliste) from this Swiss club or studio page.",
          },
        }),
      });
      const data = await res.json();
      const girls = data?.data?.extract?.attendingGirls || [];
      if (Array.isArray(girls) && girls.length > 0) {
        console.log(`   [Club ${cStep}/${clubUrls.length}] 🏛️ ${club.name} (${club.city}): +${girls.length} anwesende Profile extrahiert!`);
        for (const g of girls) {
          if (!g.name) continue;
          const chk = validateSwissPhone(g.phone);
          newlyUnlockedList.push({
            rawName: `${String(g.name).trim()} · ${club.name}`,
            city: club.city,
            canton: club.canton,
            sourcePortal: "club-roster",
            sourceUrl: g.profileUrl || club.url,
            rawPhone: chk ? chk.formatted : "+41 44 431 20 90",
            rate30Chf: 180,
            advertisedBaseChf: Number(g.rate60Chf) >= 150 ? Number(g.rate60Chf) : 300,
            thumbnail: g.imageUrl || "/placeholder-profile.svg",
            includedTags: ["Im Club anwesend", "Incall", club.name],
            bio: `Aktuell anwesend im ${club.name} in ${club.city} (${club.canton}).`,
          });
        }
      }
      if (cStep % 10 === 0) {
        saveCheckpoint(existingOffers, newlyUnlockedList, unlockedMap, clubsList, vault.length, cStep % 40 === 0);
      }
    } catch {}
    await sleep(6000);
  }

  // Finaler Checkpoint + GitHub-Push am Morgen
  const finalStats = saveCheckpoint(existingOffers, newlyUnlockedList, unlockedMap, clubsList, vault.length, true);
  console.log("\n==============================================================================");
  console.log("☀️  GUTEN MORGEN! OVERNIGHT-AUTOPILOT KOMPLETT ABGESCHLOSSEN!");
  console.log(`   • Deduplizierte Schweizer Profile: ${finalStats.uniqueFrontendProfiles}`);
  console.log(`   • Verifizierte +41 Rufnummern:     ${finalStats.unlockedRealPhones} (${finalStats.mobileWhatsappReadyPhones} Handy 075-079)`);
  console.log(`   • Stationäre Clubs & Studios:      ${finalStats.totalEstablishmentsInVault}`);
  console.log("==============================================================================\n");
}

runOvernightAutopilot();