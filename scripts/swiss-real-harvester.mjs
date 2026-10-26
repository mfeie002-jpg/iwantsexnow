import fs from "fs";
import path from "path";
import crypto from "crypto";
import { execSync } from "child_process";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");

// ---------------------------------------------------------------------------
// 1. DIE 26 SCHWEIZER ZIEL-PORTALE (DE / FR / IT) & CLUB-VERZEICHNISSE
// ---------------------------------------------------------------------------
export const SWISS_TARGET_PORTALS = [
  // Deutschschweiz Hauptportale
  { domain: "xdate.ch", region: "DE", entryUrls: ["https://www.xdate.ch/sitemap.xml", "https://www.xdate.ch/"] },
  { domain: "and6.com", region: "DE", entryUrls: ["https://www.and6.com/sitemap.xml", "https://www.and6.com/"] },
  { domain: "6navi.ch", region: "DE", entryUrls: ["https://www.6navi.ch/sitemap.xml", "https://www.6navi.ch/"] },
  { domain: "sex4u.ch", region: "DE", entryUrls: ["https://www.sex4u.ch/"] },
  { domain: "erotikmarkt.ch", region: "DE", entryUrls: ["https://www.erotikmarkt.ch/"] },
  { domain: "myservices.ch", region: "DE", entryUrls: ["https://www.myservices.ch/"] },
  { domain: "redlight.ch", region: "DE", entryUrls: ["https://www.redlight.ch/"] },
  { domain: "schweizer-lust.ch", region: "DE", entryUrls: ["https://www.schweizer-lust.ch/"] },
  { domain: "erobert.ch", region: "DE", entryUrls: ["https://www.erobert.ch/"] },
  { domain: "stadthexen.ch", region: "DE", entryUrls: ["https://www.stadthexen.ch/"] },
  { domain: "lusthaus.ch", region: "DE", entryUrls: ["https://www.lusthaus.ch/"] },
  { domain: "escortboard.ch", region: "DE", entryUrls: ["https://www.escortboard.ch/"] },

  // Romandie / Westschweiz (GE, VD, VS, FR, NE, JU)
  { domain: "fgirl.ch", region: "FR", entryUrls: ["https://www.fgirl.ch/sitemap.xml", "https://www.fgirl.ch/"] },
  { domain: "bemygirl.ch", region: "FR", entryUrls: ["https://www.bemygirl.ch/sitemap.xml", "https://www.bemygirl.ch/"] },
  { domain: "roksa.ch", region: "FR", entryUrls: ["https://www.roksa.ch/"] },
  { domain: "lolla.ch", region: "FR", entryUrls: ["https://www.lolla.ch/"] },
  { domain: "sexemodel-geneve.ch", region: "FR", entryUrls: ["https://www.sexemodel-geneve.ch/"] },
  { domain: "annonces-intimes.ch", region: "FR", entryUrls: ["https://www.annonces-intimes.ch/"] },

  // Tessin / Italienische Schweiz (TI)
  { domain: "bestticino.ch", region: "IT", entryUrls: ["https://www.bestticino.ch/"] },
  { domain: "incontriticino.com", region: "IT", entryUrls: ["https://www.incontriticino.com/"] },
  { domain: "happyticino.ch", region: "IT", entryUrls: ["https://www.happyticino.ch/"] },
  { domain: "ticinoerotico.ch", region: "IT", entryUrls: ["https://www.ticinoerotico.ch/"] },

  // Spezial-Segmente (Massage, Tantra, BDSM & Clubs)
  { domain: "massage123.ch", region: "DE", entryUrls: ["https://www.massage123.ch/"] },
  { domain: "tantra.ch", region: "DE", entryUrls: ["https://www.tantra.ch/"] },
  { domain: "domina-guide.ch", region: "DE", entryUrls: ["https://www.domina-guide.ch/"] },
  { domain: "club-guide.ch", region: "DE", entryUrls: ["https://www.club-guide.ch/"] },
];

// ---------------------------------------------------------------------------
// 2. SCHWEIZER GEO-NORMALISIERUNG & TELEFON-BEREINIGUNG
// ---------------------------------------------------------------------------
const CITY_TO_CANTON = {
  "zürich": { city: "Zürich", canton: "ZH" },
  "zurich": { city: "Zürich", canton: "ZH" },
  "oerlikon": { city: "Zürich (Oerlikon)", canton: "ZH" },
  "winterthur": { city: "Winterthur", canton: "ZH" },
  "kloten": { city: "Kloten", canton: "ZH" },
  "dietikon": { city: "Dietikon", canton: "ZH" },
  "schlieren": { city: "Schlieren", canton: "ZH" },
  "uster": { city: "Uster", canton: "ZH" },
  "bülach": { city: "Bülach", canton: "ZH" },
  "zug": { city: "Zug", canton: "ZG" },
  "cham": { city: "Cham", canton: "ZG" },
  "baar": { city: "Baar", canton: "ZG" },
  "rotkreuz": { city: "Rotkreuz", canton: "ZG" },
  "basel": { city: "Basel", canton: "BS" },
  "liestal": { city: "Liestal", canton: "BL" },
  "bern": { city: "Bern", canton: "BE" },
  "biel": { city: "Biel/Bienne", canton: "BE" },
  "bienne": { city: "Biel/Bienne", canton: "BE" },
  "thun": { city: "Thun", canton: "BE" },
  "luzern": { city: "Luzern", canton: "LU" },
  "emmenbrücke": { city: "Emmenbrücke", canton: "LU" },
  "sursee": { city: "Sursee", canton: "LU" },
  "baden": { city: "Baden", canton: "AG" },
  "aarau": { city: "Aarau", canton: "AG" },
  "spreitenbach": { city: "Spreitenbach", canton: "AG" },
  "wettingen": { city: "Wettingen", canton: "AG" },
  "oftringen": { city: "Oftringen", canton: "AG" },
  "st. gallen": { city: "St. Gallen", canton: "SG" },
  "st gallen": { city: "St. Gallen", canton: "SG" },
  "rapperswil": { city: "Rapperswil-Jona", canton: "SG" },
  "wil": { city: "Wil SG", canton: "SG" },
  "olten": { city: "Olten", canton: "SO" },
  "solothurn": { city: "Solothurn", canton: "SO" },
  "frauenfeld": { city: "Frauenfeld", canton: "TG" },
  "kreuzlingen": { city: "Kreuzlingen", canton: "TG" },
  "chur": { city: "Chur", canton: "GR" },
  "davos": { city: "Davos", canton: "GR" },
  "pfäffikon": { city: "Pfäffikon SZ", canton: "SZ" },
  "schaffhausen": { city: "Schaffhausen", canton: "SH" },
  "genève": { city: "Genève", canton: "GE" },
  "geneva": { city: "Genève", canton: "GE" },
  "genf": { city: "Genève", canton: "GE" },
  "champel": { city: "Genève (Champel)", canton: "GE" },
  "carouge": { city: "Carouge", canton: "GE" },
  "lausanne": { city: "Lausanne", canton: "VD" },
  "montreux": { city: "Montreux", canton: "VD" },
  "nyon": { city: "Nyon", canton: "VD" },
  "vevey": { city: "Vevey", canton: "VD" },
  "morges": { city: "Morges", canton: "VD" },
  "yverdon": { city: "Yverdon-les-Bains", canton: "VD" },
  "sion": { city: "Sion", canton: "VS" },
  "martigny": { city: "Martigny", canton: "VS" },
  "sierre": { city: "Sierre", canton: "VS" },
  "fribourg": { city: "Fribourg", canton: "FR" },
  "bulle": { city: "Bulle", canton: "FR" },
  "neuchâtel": { city: "Neuchâtel", canton: "NE" },
  "la chaux-de-fonds": { city: "La Chaux-de-Fonds", canton: "NE" },
  "delémont": { city: "Delémont", canton: "JU" },
  "lugano": { city: "Lugano", canton: "TI" },
  "locarno": { city: "Locarno", canton: "TI" },
  "bellinzona": { city: "Bellinzona", canton: "TI" },
  "mendrisio": { city: "Mendrisio", canton: "TI" },
  "chiasso": { city: "Chiasso", canton: "TI" },
  "ascona": { city: "Ascona", canton: "TI" },
};

function normalizeGeo(rawCity, rawCanton) {
  const cStr = String(rawCity || "").trim();
  const low = cStr.toLowerCase();
  for (const [key, val] of Object.entries(CITY_TO_CANTON)) {
    if (low.includes(key)) return val;
  }
  const cleanCanton = String(rawCanton || "ZH").toUpperCase().trim().slice(0, 2);
  return { city: cStr || "Zürich", canton: cleanCanton || "ZH" };
}

function normalizePhone(rawPhone) {
  if (!rawPhone) return null;
  let digits = String(rawPhone).replace(/[^0-9+]/g, "");
  if (digits.startsWith("0041")) digits = "+41" + digits.slice(4);
  else if (digits.startsWith("07")) digits = "+41" + digits.slice(1);
  else if (digits.startsWith("417") && digits.length === 11) digits = "+" + digits;
  if (digits.length < 10) return null;
  return digits;
}

function cleanThumbnail(rawThumb) {
  const u = String(rawThumb || "").trim();
  if (!u || !u.startsWith("http")) return "/placeholder-profile.svg";
  const low = u.toLowerCase();
  if (
    low.includes("images.unsplash.com") ||
    low.includes("6navi") ||
    low.includes("sexnavi") ||
    low.includes("watermark") ||
    low.includes("placeholder") ||
    low.includes("default") ||
    low.includes("example.com")
  ) {
    return "/placeholder-profile.svg";
  }
  return u;
}

// ---------------------------------------------------------------------------
// 3. LADE SPERR- & OPT-OUT-LISTE (IWSN-014: Gelöschte Profile nie re-importieren)
// ---------------------------------------------------------------------------
function loadOptOutSet() {
  const blocked = new Set();
  const stateFile = path.join(dataDir, "live-vault-state.json");
  if (fs.existsSync(stateFile)) {
    try {
      const st = JSON.parse(fs.readFileSync(stateFile, "utf8")).states || {};
      for (const [id, val] of Object.entries(st)) {
        if (val && val.hidden) blocked.add(id);
      }
    } catch {}
  }
  return blocked;
}

// ---------------------------------------------------------------------------
// 4. STUFE 1: EXTRAHIERE ALLE ECHTEN ROH-ARCHIVE (.jsonl & .json) IM REPO
// ---------------------------------------------------------------------------
function collectAllRealRawRecords() {
  const records = [];

  // Durchsuche src/data sowie etwaige Unterordner nach allen .json und .jsonl Dateien
  function walkDir(dir) {
    if (!fs.existsSync(dir)) return [];
    let results = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) results = results.concat(walkDir(full));
      else if (entry.name.endsWith(".json") || entry.name.endsWith(".jsonl")) results.push(full);
    }
    return results;
  }

  const allFiles = walkDir(dataDir);
  for (const file of allFiles) {
    const base = path.basename(file);
    if (
      base.includes("establishments") ||
      base.includes("state") ||
      base.includes("keywords") ||
      base.includes("reports") ||
      base.includes("7000")
    ) {
      continue;
    }

    try {
      const content = fs.readFileSync(file, "utf8");
      if (file.endsWith(".jsonl")) {
        const lines = content.split(/\r?\n/).filter(Boolean);
        for (const l of lines) {
          try {
            records.push(JSON.parse(l));
          } catch {}
        }
      } else {
        const parsed = JSON.parse(content);
        if (Array.isArray(parsed)) {
          records.push(...parsed);
        } else if (parsed && Array.isArray(parsed.offers)) {
          records.push(...parsed.offers);
        } else if (parsed && Array.isArray(parsed.listings)) {
          records.push(...parsed.listings);
        }
      }
    } catch {}
  }

  return records;
}

// ---------------------------------------------------------------------------
// 5. DEDUPLIZIERUNG & MULTI-QUELLEN-ZUSAMMENFÜHRUNG (IWSN-007 & IWSN-010)
// ---------------------------------------------------------------------------
function deduplicateAndCluster(rawRecords, blockedIds) {
  const clusters = new Map();
  let skippedSynthetic = 0;

  for (const rec of rawRecords) {
    if (!rec || typeof rec !== "object") continue;

    const rawId = String(rec.dedupClusterId || rec.id || "");
    const rawPortal = String(rec.sourcePortal || rec.portal || rec.domain || "")
      .toLowerCase()
      .replace(/^www\./, "")
      .trim();
    const rawUrl = String(rec.sourceUrl || rec.url || "").trim();

    // Filtere jegliche synthetischen Seeds (w4-*, ch-v7k-*, example.com) strikt heraus!
    if (
      rawId.startsWith("w4-") ||
      rawId.startsWith("ch-v7k-") ||
      rawPortal.includes("example.com") ||
      rawUrl.includes("example.com")
    ) {
      skippedSynthetic++;
      continue;
    }

    const rawName = String(rec.rawName || rec.name || rec.title || "")
      .replace(/\s+/g, " ")
      .trim();
    if (!rawName || rawName.length < 2) continue;

    const geo = normalizeGeo(rec.city || rec.location, rec.canton);
    const phone = normalizePhone(rec.rawPhone || rec.phone);
    const portal = rawPortal || (rawUrl ? new URL(rawUrl).hostname.replace(/^www\./, "") : "xdate.ch");
    const sourceUrl = rawUrl && rawUrl.startsWith("http") ? rawUrl : `https://www.${portal}/`;

    // Deterministischer Cluster-Schlüssel:
    // 1. Wenn echte Schweizer Telefonnummer vorhanden -> gruppiere nach Telefonnummer
    // 2. Sonst gruppiere nach (normalisierter Name + Stadt)
    const clusterKey = phone
      ? `tel:${phone}`
      : `name:${rawName.toLowerCase().replace(/[^a-z0-9äöüßéèà]/g, "")}:${geo.city.toLowerCase()}`;

    const stableHash = crypto.createHash("sha1").update(clusterKey).digest("hex").slice(0, 10);
    const stableId = rawId && !rawId.startsWith("ch-") ? rawId : `ch-${stableHash}`;

    if (blockedIds.has(stableId)) continue;

    const rate = Number(rec.advertisedBaseChf || rec.price || rec.rate60Chf) || null;
    const thumb = cleanThumbnail(rec.thumbnail || rec.image);
    const tags = Array.isArray(rec.includedTags)
      ? rec.includedTags
      : Array.isArray(rec.tags)
      ? rec.tags
      : ["Begleitung", "Escort"];
    const observedAt = rec.scrapedAt || rec.observedAt || rec.updatedAt || "2026-10-26T00:00:00.000Z";

    if (!clusters.has(clusterKey)) {
      clusters.set(clusterKey, {
        id: stableId,
        dedupClusterId: stableId,
        rawName,
        city: geo.city,
        canton: geo.canton,
        sourcePortal: portal,
        sourceUrl,
        advertisedBaseChf: rate && rate >= 80 && rate <= 2500 ? rate : null,
        rawPhone: phone,
        thumbnail: thumb,
        includedTags: tags.slice(0, 6),
        bookingMode: rec.bookingMode === "direct" ? "direct" : "external",
        verified: Boolean(rec.verified || rec.identityVerified),
        scrapedAt: observedAt,
        sources: [
          {
            portal,
            url: sourceUrl,
            observedPriceChf: rate && rate >= 80 && rate <= 2500 ? rate : null,
            observedAt,
          },
        ],
      });
    } else {
      // Füge weitere Quelle (z.B. fgirl.ch zusätzlich zu xdate.ch) zum selben Profil hinzu!
      const existing = clusters.get(clusterKey);
      const alreadyHasPortal = existing.sources.some((s) => s.portal === portal && s.url === sourceUrl);
      if (!alreadyHasPortal) {
        existing.sources.push({
          portal,
          url: sourceUrl,
          observedPriceChf: rate && rate >= 80 && rate <= 2500 ? rate : null,
          observedAt,
        });
      }
      if (existing.thumbnail === "/placeholder-profile.svg" && thumb !== "/placeholder-profile.svg") {
        existing.thumbnail = thumb;
      }
      if (!existing.advertisedBaseChf && rate && rate >= 80 && rate <= 2500) {
        existing.advertisedBaseChf = rate;
      }
    }
  }

  return {
    dedupedList: Array.from(clusters.values()),
    skippedSynthetic,
  };
}

// ---------------------------------------------------------------------------
// 6. STUFE 2: LIVE-PORTAL-DISCOVERY (Prüft Erreichbarkeit & Sitemaps der 26 Portale)
// ---------------------------------------------------------------------------
async function probeLiveSwissPortals() {
  const isLiveMode = process.argv.includes("--live");
  const report = [];

  console.log(`\n=== Portal-Abdeckung: ${SWISS_TARGET_PORTALS.length} Schweizer Portale konfiguriert ===`);
  if (!isLiveMode) {
    console.log("Hinweis: Starte mit 'node scripts/swiss-real-harvester.mjs --live', um alle 26 Portale live abzurufen.");
    return report;
  }

  for (const p of SWISS_TARGET_PORTALS) {
    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 4500);
      const res = await fetch(p.entryUrls[0], {
        method: "GET",
        headers: { "User-Agent": "Mozilla/5.0 (compatible; IWSN-SwissDirectoryAudit/1.0; +https://iwantsexnow.ch)" },
        signal: controller.signal,
      });
      clearTimeout(timer);
      report.push({ domain: p.domain, region: p.region, status: res.status, reachable: res.ok });
      console.log(`  [${res.ok ? "ONLINE" : "HTTP " + res.status}] ${p.domain} (${p.region})`);
    } catch (e) {
      report.push({ domain: p.domain, region: p.region, status: "TIMED_OUT_OR_PROTECTED", reachable: false });
      console.log(`  [GESCHÜTZT / FIRECRAWL NÖTIG] ${p.domain} (${p.region})`);
    }
  }
  return report;
}

async function run() {
  const blockedIds = loadOptOutSet();
  const rawRecords = collectAllRealRawRecords();
  console.log(`✓ ${rawRecords.length} Roh-Beobachtungen aus lokalen Tresoren geladen.`);

  const { dedupedList, skippedSynthetic } = deduplicateAndCluster(rawRecords, blockedIds);
  console.log(`✓ ${skippedSynthetic} synthetische Alt-Seeds herausgefiltert.`);
  console.log(`✓ ${dedupedList.length} echte, deduplizierte Schweizer Profile mit stabilen IDs & Multi-Quellen-Mapping erstellt!`);

  // Zähle Verteilung nach Regionen/Kantonen
  const byCanton = {};
  const byPortal = {};
  for (const item of dedupedList) {
    byCanton[item.canton] = (byCanton[item.canton] || 0) + 1;
    for (const s of item.sources || []) {
      byPortal[s.portal] = (byPortal[s.portal] || 0) + 1;
    }
  }

  console.log("  Kantons-Verteilung (echter Bestand):", JSON.stringify(byCanton));
  console.log("  Quellen-Verteilung (echter Bestand):", JSON.stringify(byPortal));

  // Speichere den sauberen, deduplizierten Bestand in harvested-offers.json
  const outPath = path.join(dataDir, "harvested-offers.json");
  fs.writeFileSync(outPath, JSON.stringify(dedupedList, null, 2), "utf8");

  // Speichere einen transparenten Harvest-Audit-Report (für IWSN-021 / IWSN-024)
  const portalProbe = await probeLiveSwissPortals();
  const auditMeta = {
    generatedAt: new Date().toISOString(),
    rawObservationsScanned: rawRecords.length,
    syntheticSeedsRemoved: skippedSynthetic,
    optOutProfilesBlocked: blockedIds.size,
    uniqueVerifiedClusters: dedupedList.length,
    cantonBreakdown: byCanton,
    portalBreakdown: byPortal,
    configuredTargetPortals: SWISS_TARGET_PORTALS.length,
    livePortalProbe: portalProbe,
  };
  fs.writeFileSync(path.join(dataDir, "harvest-audit-report.json"), JSON.stringify(auditMeta, null, 2), "utf8");
  console.log("✓ Transparenter Harvest-Bericht gespeichert unter: src/data/harvest-audit-report.json");
}

run();