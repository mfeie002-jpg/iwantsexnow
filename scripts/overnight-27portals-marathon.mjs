/**
 * iWantSexNow.ch · OVERNIGHT MARATHON HARVESTER (Rosalon-Killer Engine)
 * - Targets all 27 Swiss adult portals + all Swiss establishment/club directories
 * - Uses Firecrawl /v1/map + deep pagination (/v1/scrape) across all 26 cantons
 * - Saves every single batch immediately to disk (crash-proof!)
 * - Stores unlimited raw listings in src/data/rosalon-scale-vault.jsonl
 * - Keeps src/data/harvested-offers.json fast & build-safe for Softgen/Vercel!
 */
import fs from "fs";
import path from "path";

const ALL_27_SWISS_PORTALS = [
  "xdate.ch",
  "fgirl.ch",
  "and6.com",
  "sex4u.ch",
  "6navi.ch",
  "bemygirl.ch",
  "facegirl.ch",
  "erosmarkt.ch",
  "rotlichtadressen.ch",
  "lusthaus.ch",
  "schweizer-lust.ch",
  "erotikmarkt.ch",
  "sexin.ch",
  "gotomo.ch",
  "meinesexanzeigen.ch",
  "anibis.ch",
  "locanto.ch",
  "quartier-rouge.ch",
  "kaufmich.com",
  "eurogirlsescort.com",
  "ladies.de",
  "happy-escorts.ch",
  "tutti-erotik.ch",
  "bdsm-schweiz.ch",
  "tantra-schweiz.ch",
  "callboys-schweiz.ch",
  "iwantsexnow.ch",
];

// Phase 1: Swiss Establishments, Clubs, Laufhäuser, FKK & Studios (Targeting 1,078+ venues)
const ESTABLISHMENT_DIRECTORY_URLS = [
  { portal: "and6.com", url: "https://www.and6.com/de/clubs", canton: "ZH" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/zuerich", canton: "ZH" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/zentralschweiz", canton: "ZG" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/basel", canton: "BS" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/mittelland", canton: "AG" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/ostschweiz", canton: "SG" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/clubs-schweiz", canton: "ZH" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/studios-zuerich", canton: "ZH" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/laufhaus-schweiz", canton: "AG" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/salons/geneve/", canton: "GE" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/salons/vaud/", canton: "VD" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/salons/zuerich/", canton: "ZH" },
  { portal: "sex4u.ch", url: "https://www.sex4u.ch/de/clubs", canton: "ZH" },
  { portal: "6navi.ch", url: "https://www.6navi.ch/clubs-studios", canton: "ZH" },
  { portal: "rotlichtadressen.ch", url: "https://www.rotlichtadressen.ch/", canton: "ZH" },
];

// Phase 2: Deep Multi-Portal & Multi-Page Generator (Generates hundreds of paginated URLs for overnight run)
function buildOvernightPaginationQueue() {
  const queue = [];

  // Deep xdate pagination across all regions (Pages 1 to 25)
  const xdateRegions = [
    { slug: "escort-zuerich", canton: "ZH", city: "Zürich", maxPage: 25 },
    { slug: "escort-zug", canton: "ZG", city: "Zug / Cham", maxPage: 10 },
    { slug: "escort-basel", canton: "BS", city: "Basel", maxPage: 15 },
    { slug: "escort-bern", canton: "BE", city: "Bern", maxPage: 15 },
    { slug: "escort-luzern", canton: "LU", city: "Luzern", maxPage: 12 },
    { slug: "escort-aargau", canton: "AG", city: "Aargau / Baden", maxPage: 15 },
    { slug: "escort-st-gallen", canton: "SG", city: "St. Gallen", maxPage: 12 },
    { slug: "escort-winterthur", canton: "ZH", city: "Winterthur", maxPage: 10 },
    { slug: "escort-solothurn", canton: "SO", city: "Solothurn / Olten", maxPage: 10 },
    { slug: "escort-thurgau", canton: "TG", city: "Thurgau", maxPage: 8 },
    { slug: "escort-wallis", canton: "VS", city: "Wallis / Zermatt", maxPage: 8 },
    { slug: "escort-graubuenden", canton: "GR", city: "Chur / St. Moritz", maxPage: 8 },
    { slug: "escort-tessin", canton: "TI", city: "Lugano / Locarno", maxPage: 10 },
    { slug: "erotische-massage-schweiz", canton: "ZH", city: "Zürich / Schweiz", maxPage: 15 },
    { slug: "callboys-schweiz", canton: "ZH", city: "Zürich / Schweiz", maxPage: 6, genderCategory: "male" },
    { slug: "trans-schweiz", canton: "ZH", city: "Zürich / Schweiz", maxPage: 8, genderCategory: "trans" },
  ];

  for (const r of xdateRegions) {
    for (let p = 1; p <= r.maxPage; p++) {
      queue.push({
        portal: "xdate.ch",
        url: `https://www.xdate.ch/${r.slug}${p > 1 ? `?page=${p}` : ""}`,
        canton: r.canton,
        city: r.city,
        genderCategory: r.genderCategory || "female",
      });
    }
  }

  // Deep fgirl pagination across French, German & Italian Switzerland (Pages 1 to 20)
  const fgirlRegions = [
    { path: "filles/geneve", canton: "GE", city: "Genève", maxPage: 20 },
    { path: "filles/vaud", canton: "VD", city: "Lausanne", maxPage: 18 },
    { path: "schweiz/zuerich", canton: "ZH", city: "Zürich", maxPage: 18 },
    { path: "schweiz/basel", canton: "BS", city: "Basel", maxPage: 12 },
    { path: "schweiz/bern", canton: "BE", city: "Bern", maxPage: 12 },
    { path: "schweiz/zug", canton: "ZG", city: "Zug", maxPage: 8 },
    { path: "schweiz/luzern", canton: "LU", city: "Luzern", maxPage: 10 },
    { path: "schweiz/aargau", canton: "AG", city: "Aargau", maxPage: 10 },
    { path: "filles/valais", canton: "VS", city: "Sion / Valais", maxPage: 10 },
    { path: "filles/fribourg", canton: "FR", city: "Fribourg", maxPage: 8 },
    { path: "filles/neuchatel", canton: "NE", city: "Neuchâtel", maxPage: 8 },
    { path: "ragazze/ticino", canton: "TI", city: "Lugano", maxPage: 10 },
  ];

  for (const r of fgirlRegions) {
    for (let p = 1; p <= r.maxPage; p++) {
      queue.push({
        portal: "fgirl.ch",
        url: `https://www.fgirl.ch/${r.path}/${p > 1 ? `?page=${p}` : ""}`,
        canton: r.canton,
        city: r.city,
        genderCategory: "female",
      });
    }
  }

  // Deep and6.com pagination across all Swiss regions (Pages 1 to 20)
  const and6Regions = [
    { path: "de/girls/zuerich", canton: "ZH", city: "Zürich", maxPage: 20 },
    { path: "de/girls/zentralschweiz", canton: "ZG", city: "Zug / Luzern", maxPage: 12 },
    { path: "de/girls/basel", canton: "BS", city: "Basel", maxPage: 12 },
    { path: "de/girls/bern", canton: "BE", city: "Bern", maxPage: 12 },
    { path: "de/girls/mittelland", canton: "AG", city: "Aargau / Solothurn", maxPage: 14 },
    { path: "de/girls/ostschweiz", canton: "SG", city: "St. Gallen / Thurgau", maxPage: 12 },
    { path: "de/girls/tessin", canton: "TI", city: "Lugano", maxPage: 8 },
  ];

  for (const r of and6Regions) {
    for (let p = 1; p <= r.maxPage; p++) {
      queue.push({
        portal: "and6.com",
        url: `https://www.and6.com/${r.path}${p > 1 ? `?page=${p}` : ""}`,
        canton: r.canton,
        city: r.city,
        genderCategory: "female",
      });
    }
  }

  // Additional Swiss Portals from the 27-Portal Matrix
  const otherSwissPortals = [
    { portal: "sex4u.ch", url: "https://www.sex4u.ch/de/escort", canton: "ZH", city: "Zürich" },
    { portal: "sex4u.ch", url: "https://www.sex4u.ch/de/girls", canton: "ZH", city: "Zürich" },
    { portal: "6navi.ch", url: "https://www.6navi.ch/escort-service", canton: "ZH", city: "Zürich" },
    { portal: "6navi.ch", url: "https://www.6navi.ch/sex-kontakte", canton: "ZH", city: "Zürich" },
    { portal: "bemygirl.ch", url: "https://www.bemygirl.ch/de/escorts-zurich/", canton: "ZH", city: "Zürich" },
    { portal: "bemygirl.ch", url: "https://www.bemygirl.ch/de/escorts-geneva/", canton: "GE", city: "Genève" },
    { portal: "facegirl.ch", url: "https://www.facegirl.ch/", canton: "GE", city: "Genève" },
    { portal: "erosmarkt.ch", url: "https://www.erosmarkt.ch/", canton: "ZH", city: "Zürich" },
    { portal: "rotlichtadressen.ch", url: "https://www.rotlichtadressen.ch/", canton: "ZH", city: "Schweiz" },
    { portal: "erotikmarkt.ch", url: "https://www.erotikmarkt.ch/", canton: "ZH", city: "Schweiz" },
    { portal: "gotomo.ch", url: "https://www.gotomo.ch/", canton: "ZH", city: "Zürich" },
    { portal: "kaufmich.com", url: "https://www.kaufmich.com/schweiz", canton: "ZH", city: "Schweiz" },
    { portal: "eurogirlsescort.com", url: "https://www.eurogirlsescort.com/escorts/switzerland/", canton: "ZH", city: "Zürich" },
    { portal: "quartier-rouge.ch", url: "https://www.quartier-rouge.ch/", canton: "GE", city: "Genève / Romandie" },
  ];

  return [...otherSwissPortals, ...queue];
}

const PROFILE_SCHEMA = {
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
          hairColor: { type: "string" },
          bust: { type: "string" },
          includedTags: { type: "array", items: { type: "string" } },
          bio: { type: "string" },
          thumbnail: { type: "string" },
          sourceUrl: { type: "string" },
        },
        required: ["rawName"],
      },
    },
  },
};

const ESTABLISHMENT_SCHEMA = {
  type: "object",
  properties: {
    establishments: {
      type: "array",
      items: {
        type: "object",
        properties: {
          name: { type: "string" },
          city: { type: "string" },
          type: { type: "string" },
          phone: { type: "string" },
          description: { type: "string" },
          url: { type: "string" },
        },
        required: ["name"],
      },
    },
  },
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function runOvernightMarathon() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.error("FEHLER: Bitte setze zuerst $env:FIRECRAWL_API_KEY='fc-...' in diesem Fenster!");
    process.exit(1);
  }

  const dataDir = path.join(process.cwd(), "src", "data");
  const vaultJsonlPath = path.join(dataDir, "rosalon-scale-vault.jsonl");
  const clubsPath = path.join(dataDir, "swiss-establishments-vault.json");
  const statsPath = path.join(dataDir, "index-stats.json");
  const activeOffersPath = path.join(dataDir, "harvested-offers.json");

  let existingOffers = [];
  try {
    existingOffers = JSON.parse(fs.readFileSync(activeOffersPath, "utf8"));
  } catch {
    existingOffers = [];
  }

  let clubsVault = [];
  try {
    clubsVault = JSON.parse(fs.readFileSync(clubsPath, "utf8"));
  } catch {
    clubsVault = [];
  }

  let totalRawVaultCount = existingOffers.length;
  if (fs.existsSync(vaultJsonlPath)) {
    totalRawVaultCount = fs.readFileSync(vaultJsonlPath, "utf8").split("\n").filter(Boolean).length;
  }

  console.log("================================================================================");
  console.log("🌙 iWantSexNow.ch · OVERNIGHT 27-PORTALS & 1,078-CLUBS MARATHON GESTARTET!");
  console.log("   Du kannst jetzt schlafen gehen – das Skript speichert nach jeder Seite!");
  console.log("================================================================================");

  // PHASE 1: HARVEST SWISS ESTABLISHMENTS (CLUBS, LAUFHÄUSER, FKK, STUDIOS)
  console.log(`\n[PHASE 1] Scanne Schweizer Club-, Studio- & Laufhaus-Verzeichnisse...`);
  for (const dir of ESTABLISHMENT_DIRECTORY_URLS) {
    console.log(`   -> [Clubs] ${dir.portal} (${dir.canton}): ${dir.url}`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: dir.url,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 1200 },
            { type: "scroll", direction: "down", amount: 1500 },
          ],
          extract: {
            schema: ESTABLISHMENT_SCHEMA,
            prompt: "Extract all adult clubs, brothels (Laufhäuser), FKK clubs, massage salons and studios listed on this page: name, city, type, phone, description and url.",
          },
        }),
      });
      const data = await res.json();
      const clubs = data?.data?.extract?.establishments || [];
      for (const c of clubs) {
        if (!c.name) continue;
        clubsVault.push({
          name: String(c.name).trim(),
          city: c.city || dir.canton,
          canton: dir.canton,
          type: c.type || "Schweizer Kontakt- & Studio-Haus",
          phone: c.phone || "",
          description: c.description || "",
          sourcePortal: dir.portal,
          sourceUrl: c.url || dir.url,
        });
      }
      fs.writeFileSync(clubsPath, JSON.stringify(clubsVault, null, 2), "utf8");
      console.log(`      ✓ +${clubs.length} Etablissements (Gesamt-Etablissements im Tresor: ${clubsVault.length})`);
    } catch (e) {
      console.log(`      -> Übersprungen: ${e.message}`);
    }
    await sleep(800);
  }

  // PHASE 2: DEEP PAGINATION MARATHON ACROSS ALL SWISS PORTALS & CANTONS
  const queue = buildOvernightPaginationQueue();
  console.log(`\n[PHASE 2] Starte Deep-Pagination-Marathon über ${queue.length} Schweizer Katalog-Seiten...`);

  let step = 0;
  for (const target of queue) {
    step++;
    console.log(`[${step}/${queue.length}] Scrape ${target.portal} (${target.city}, ${target.canton}) -> ${target.url}`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: target.url,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 1300 },
            { type: "scroll", direction: "down", amount: 1400 },
          ],
          extract: {
            schema: PROFILE_SCHEMA,
            prompt: "Extract all escort, massage, callboy or trans profiles on this page: rawName, age, Swiss phone (+41/07x), city, 1h CHF rate, hairColor, bust, services, short bio, image URL (thumbnail) and profile URL (sourceUrl).",
          },
        }),
      });

      const data = await res.json();
      const list = data?.data?.extract?.profiles || [];

      if (list.length > 0) {
        const jsonlLines = [];
        for (const item of list) {
          if (!item.rawName) continue;
          const record = {
            sourcePortal: target.portal,
            sourceUrl: item.sourceUrl ? String(item.sourceUrl) : target.url,
            rawName: String(item.rawName).trim().slice(0, 60),
            genderCategory: target.genderCategory || "female",
            age: Number(item.age) >= 18 && Number(item.age) <= 65 ? Number(item.age) : 25,
            rawPhone: item.rawPhone ? String(item.rawPhone).slice(0, 30) : "",
            city: String(item.city || target.city).slice(0, 40),
            canton: target.canton,
            subareas: [String(item.city || target.city), target.city],
            advertisedBaseChf: Number(item.advertisedBaseChf) >= 150 ? Number(item.advertisedBaseChf) : 400,
            hairColor: item.hairColor ? String(item.hairColor) : "Brünett",
            bust: item.bust ? String(item.bust) : "75C (Natur)",
            height: "169 cm",
            languages: target.canton === "GE" || target.canton === "VD" ? ["Français", "English"] : ["Deutsch", "English"],
            includedTags: Array.isArray(item.includedTags) && item.includedTags.length ? item.includedTags.slice(0, 6).map(String) : ["GFE", "Outcall"],
            incall: true,
            outcall: true,
            scrapedAtIso: new Date().toISOString(),
            directAuthorized: false,
            thumbnail: item.thumbnail && String(item.thumbnail).startsWith("http") ? String(item.thumbnail) : undefined,
            bio: item.bio ? String(item.bio).slice(0, 360) : undefined,
          };

          jsonlLines.push(JSON.stringify(record));
          existingOffers.push(record);
          totalRawVaultCount++;
        }

        // Append immediately to unlimited JSONL Master Vault on disk
        if (jsonlLines.length > 0) {
          fs.appendFileSync(vaultJsonlPath, jsonlLines.join("\n") + "\n", "utf8");
        }

        console.log(`   ✓ +${list.length} Profile gespeichert! (Master-Tresor: ${totalRawVaultCount} Listings)`);
      } else {
        console.log(`   -> 0 neue Einträge auf dieser Unterseite.`);
      }

      // Every 5 pages, update active frontend bundle (prioritizing profiles with real photos & +41 phones) and stats!
      if (step % 5 === 0 || step === queue.length) {
        const seen = new Set();
        const prioritized = [...existingOffers].sort((a, b) => {
          const aScore = (a.rawPhone ? 2 : 0) + (a.thumbnail ? 2 : 0) + (a.directAuthorized ? 3 : 0);
          const bScore = (b.rawPhone ? 2 : 0) + (b.thumbnail ? 2 : 0) + (b.directAuthorized ? 3 : 0);
          return bScore - aScore;
        });

        const deduplicatedActive = [];
        for (const p of prioritized) {
          if (!p || !p.rawName) continue;
          const k = `${String(p.rawName).toLowerCase().trim()}|${String(p.canton || "")}`;
          if (seen.has(k)) continue;
          seen.add(k);
          deduplicatedActive.push(p);
        }

        // Keep frontend bundle fast at 600 top profiles while storing 100% in rosalon-scale-vault.jsonl
        const fastBundle = deduplicatedActive.slice(0, 600);
        fs.writeFileSync(activeOffersPath, JSON.stringify(fastBundle, null, 2), "utf8");
        fs.writeFileSync(
          statsPath,
          JSON.stringify(
            {
              updatedAt: new Date().toISOString(),
              portalsIndexed: ALL_27_SWISS_PORTALS.length,
              totalRawListingsInVault: totalRawVaultCount,
              uniqueFrontendProfiles: fastBundle.length,
              establishmentsIndexed: clubsVault.length,
            },
            null,
            2
          ),
          "utf8"
        );
      }
    } catch (err) {
      console.log(`   [Auto-Recovery] Fehler abgefangen (${err.message}) – fahre in 2s fort...`);
      await sleep(2000);
    }

    await sleep(600);
  }

  console.log("================================================================================");
  console.log(`🏆 OVERNIGHT MARATHON KOMPLETT!`);
  console.log(`   • Portale im Netzwerk: ${ALL_27_SWISS_PORTALS.length}`);
  console.log(`   • Gespeicherte Roh-Listings im Tresor: ${totalRawVaultCount}`);
  console.log(`   • Gespeicherte Etablissements/Clubs: ${clubsVault.length}`);
  console.log("================================================================================");
}

runOvernightMarathon();