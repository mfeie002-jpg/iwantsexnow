import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const pagesDir = path.join(root, "src", "pages");
const libDir = path.join(root, "src", "lib");
const publicDir = path.join(root, "public");

if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });
if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });

// ---------------------------------------------------------------------------
// 1. EDLER SCHWARZ-GOLD SVG-PLATZHALTER STATT UNSPLASH-STOCKFOTOS (IWSN-011)
// ---------------------------------------------------------------------------
const svgPlaceholder = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 700" width="600" height="700">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1A1E29"/>
      <stop offset="100%" stop-color="#0E1015"/>
    </linearGradient>
  </defs>
  <rect width="600" height="700" fill="url(#bg)"/>
  <rect x="24" y="24" width="552" height="652" rx="20" fill="none" stroke="#C6A574" stroke-opacity="0.22" stroke-width="2"/>
  <g transform="translate(250, 240)">
    <path d="M12 10 L46 50 L12 90 L28 90 L54 59 L54 41 L28 10 Z" fill="#C6A574"/>
    <path d="M88 10 L54 50 L88 90 L72 90 L46 59 L46 41 L72 10 Z" fill="#C6A574" opacity="0.85"/>
  </g>
  <text x="300" y="385" text-anchor="middle" fill="#E5C99B" font-family="Georgia, serif" font-size="20" font-weight="bold" letter-spacing="2">IWANTSEXNOW.CH</text>
  <text x="300" y="418" text-anchor="middle" fill="#9CA3AF" font-family="sans-serif" font-size="14">Originalbilder im Quellinserat</text>
</svg>`;
fs.writeFileSync(path.join(publicDir, "placeholder-profile.svg"), svgPlaceholder, "utf8");
console.log("✓ 1. Edler Marken-Platzhalter (/placeholder-profile.svg) ohne Stockfotos erstellt.");

const imageGuardCode = `export function resolveCleanPortrait(rawUrl: any, _indexSeed = 0): string {
  const url = String(rawUrl || "").trim();
  if (!url || !url.startsWith("http")) return "/placeholder-profile.svg";

  const low = url.toLowerCase();
  if (
    low.includes("images.unsplash.com") ||
    low.includes("6navi") ||
    low.includes("sexnavi") ||
    low.includes("watermark") ||
    low.includes("placeholder") ||
    low.includes("no-image") ||
    low.includes("default-avatar") ||
    low.includes("example.com")
  ) {
    return "/placeholder-profile.svg";
  }
  return url;
}
`;
fs.writeFileSync(path.join(libDir, "imageQualityGuard.ts"), imageGuardCode, "utf8");

// ---------------------------------------------------------------------------
// 2. ECHTEN 650er SCHWEIZER PROFIL-BESTAND WIEDERHERSTELLEN (IWSN-004 & 010)
//    Falls ein vorheriger Commit harvested-offers.json geleert hat, holen wir
//    die 650 realen Schweizer Einträge direkt aus Commit 474be6e zurück!
// ---------------------------------------------------------------------------
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");

let currentOffers = [];
if (fs.existsSync(offersPath)) {
  try {
    currentOffers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
  } catch {}
}

let realOffers = Array.isArray(currentOffers)
  ? currentOffers.filter((item) => {
      const id = String(item?.dedupClusterId || "");
      const portal = String(item?.sourcePortal || "").toLowerCase();
      return !id.startsWith("w4-") && !id.startsWith("ch-v7k-") && !portal.includes("example.com");
    })
  : [];

if (realOffers.length < 500) {
  try {
    const rawFromGit = execSync("git show 474be6e:src/data/harvested-offers.json", {
      encoding: "utf8",
      maxBuffer: 25 * 1024 * 1024,
    });
    const parsedGit = JSON.parse(rawFromGit);
    if (Array.isArray(parsedGit) && parsedGit.length >= 500) {
      realOffers = parsedGit.filter((item) => {
        const id = String(item?.dedupClusterId || "");
        const portal = String(item?.sourcePortal || "").toLowerCase();
        return !id.startsWith("w4-") && !id.startsWith("ch-v7k-") && !portal.includes("example.com");
      });
      console.log(`✓ ${realOffers.length} echte Schweizer Profile aus Commit 474be6e wiederhergestellt!`);
    }
  } catch {}
}

// Weise jedem Eintrag eine deterministische, stabile ID zu (IWSN-007)
realOffers = realOffers.map((item, idx) => {
  const stableId = item.dedupClusterId || item.id || `ch-${idx + 1}`;
  const cleanThumb =
    item.thumbnail && !String(item.thumbnail).includes("images.unsplash.com")
      ? item.thumbnail
      : "/placeholder-profile.svg";
  return {
    ...item,
    id: stableId,
    dedupClusterId: stableId,
    thumbnail: cleanThumb,
  };
});

fs.writeFileSync(offersPath, JSON.stringify(realOffers, null, 2), "utf8");
fs.writeFileSync(
  offersTsPath,
  `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\nexport default HARVESTED_SWISS_OFFERS;\n`,
  "utf8"
);
console.log(`✓ 2. Öffentlicher Schweizer Profilbestand aktiv: ${realOffers.length} reale Profile in harvested-offers.json!`);

// ---------------------------------------------------------------------------
// 3. UNIFIED SEARCH API CONTRACT (/api/vault/search.ts) — IWSN-010 & IWSN-012
//    Liefert BEIDE Vertragsformate (status/results/totalMatches UND ok/listings/stats)
//    und berücksichtigt global gesperrte/pausierte Profile aus live-vault-state.json!
// ---------------------------------------------------------------------------
const searchApiPath = path.join(pagesDir, "api", "vault", "search.ts");
const unifiedSearchApiCode = `import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";

const STATE_FILE = path.join(process.cwd(), "src", "data", "live-vault-state.json");
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

function loadStates(): Record<string, any> {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      return raw.states || {};
    }
  } catch {}
  return {};
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, status: "error", error: "Method not allowed" });
  }

  const q = String(req.query.q || req.query.query || "").toLowerCase().trim();
  const cantonFilter = String(req.query.canton || "ALL").toUpperCase().trim();
  const cityFilter = String(req.query.city || "").toLowerCase().trim();
  const portalFilter = String(req.query.portal || "").toLowerCase().trim();
  const onlyAvailable = req.query.available === "true";
  const onlyManaged = req.query.managed === "true" || req.query.verifiedOnly === "true";
  const page = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(String(req.query.limit || "48"), 10) || 48));

  const states = loadStates();
  const now = Date.now();
  const rawList = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];

  const projected = [];
  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item) continue;
    const id = String(item.dedupClusterId || item.id || "ch-" + (i + 1));
    const st = states[id] || {};

    // Globale Sperr- und Pausen-Durchsetzung (IWSN-010)
    if (st.hidden || st.paused) continue;

    const geo = normalizeSwissGeo(st.city || item.city, st.canton || item.canton);
    const isSelfManaged = Boolean(st.claimed || item.bookingMode === "direct");

    let availabilityConfirmed = Boolean(st.availabilityConfirmed);
    let confirmedMinutesAgo: number | null = null;
    if (availabilityConfirmed && st.availabilityConfirmedAt) {
      const elapsed = now - Number(st.availabilityConfirmedAt);
      if (elapsed > FOUR_HOURS_MS) {
        availabilityConfirmed = false;
      } else {
        confirmedMinutesAgo = Math.max(1, Math.round(elapsed / 60000));
      }
    }

    const rate = st.rate60Chf !== undefined ? Number(st.rate60Chf) : Number(item.advertisedBaseChf) || null;
    const displayName = String(st.displayName || item.rawName || "Profil").trim();

    projected.push({
      ...item,
      id,
      dedupClusterId: id,
      rawName: displayName,
      city: geo.cleanCity,
      cleanCity: geo.cleanCity,
      canton: geo.trueCanton,
      advertisedBaseChf: rate,
      isSelfManaged,
      availabilityConfirmed,
      confirmedMinutesAgo,
      identityVerified: Boolean(st.identityVerified),
    });
  }

  const matched = projected.filter((p) => {
    if (cantonFilter && cantonFilter !== "ALL" && p.canton !== cantonFilter) return false;
    if (cityFilter && !String(p.cleanCity || "").toLowerCase().includes(cityFilter)) return false;
    if (portalFilter && !String(p.sourcePortal || "").toLowerCase().includes(portalFilter)) return false;
    if (onlyAvailable && !p.availabilityConfirmed) return false;
    if (onlyManaged && !p.isSelfManaged) return false;
    if (q) {
      const hay = [
        p.rawName,
        p.cleanCity,
        p.canton,
        p.sourcePortal,
        p.rawPhone,
        ...(Array.isArray(p.includedTags) ? p.includedTags : []),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const totalMatches = matched.length;
  const start = (page - 1) * limit;
  const sliced = matched.slice(start, start + limit);

  // Erfüllt gleichzeitig den neuen Client-Vertrag (status/results/totalMatches)
  // UND den bestehenden CI-Testvertrag (ok/listings/stats.totalMatching)!
  return res.status(200).json({
    ok: true,
    status: "ok",
    page,
    limit,
    totalMatches,
    results: sliced,
    listings: sliced,
    stats: {
      totalMatching: totalMatches,
      returnedCount: sliced.length,
      page,
      limit,
    },
  });
}
`;
fs.writeFileSync(searchApiPath, unifiedSearchApiCode, "utf8");
console.log("✓ 3. /api/vault/search.ts erfüllt jetzt Client-Vertrag UND bestehenden Suchhandler-CI-Test!");

// ---------------------------------------------------------------------------
// 4. DYNAMISCHE SITEMAP WIEDERHERSTELLEN (/pages/sitemap.xml.tsx) — IWSN-019
// ---------------------------------------------------------------------------
const sitemapPath = path.join(pagesDir, "sitemap.xml.tsx");
const sitemapCode = `import type { GetServerSideProps } from "next";
import { SWISS_PORTAL_TOP10 } from "@/data/portalReviewsData";

const CORE_ROUTES = [
  "",
  "/search",
  "/compare-escorts",
  "/rankings",
  "/reviews",
  "/pricing",
  "/safety",
  "/advertise",
  "/create-post",
  "/for-clients",
  "/how-it-works",
  "/about",
  "/faq",
  "/contact",
  "/escort-zurich",
  "/escort-basel",
  "/escort-bern",
  "/escort-geneva",
  "/escort-lausanne",
  "/escort-lugano",
  "/orte/zuerich",
  "/orte/cham",
  "/orte/zug",
  "/orte/basel",
  "/orte/bern",
  "/orte/luzern",
  "/orte/baden",
  "/orte/st-gallen",
  "/orte/genf",
  "/orte/lausanne",
  "/orte/lugano",
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const reviewRoutes = (Array.isArray(SWISS_PORTAL_TOP10) ? SWISS_PORTAL_TOP10 : []).map(
    (r) => "/reviews/" + r.slug
  );
  const allUrls = [...CORE_ROUTES, ...reviewRoutes];
  const lastmod = new Date().toISOString().split("T")[0];

  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...allUrls.map(
      (u) =>
        "  <url><loc>https://iwantsexnow.ch" +
        u +
        "</loc><lastmod>" +
        lastmod +
        "</lastmod><changefreq>daily</changefreq><priority>" +
        (u === "" ? "1.0" : "0.8") +
        "</priority></url>"
    ),
    "</urlset>",
  ].join("\\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapXmlPage() {
  return null;
}
`;
fs.writeFileSync(sitemapPath, sitemapCode, "utf8");
console.log("✓ 4. /sitemap.xml liefert jetzt wieder alle freigegebenen Schweizer Haupt-, Stadt- & Review-Routen!");

// ---------------------------------------------------------------------------
// 5. ERSETZE UNSPLASH-FALLBACKS IN index.tsx, compare-escorts.tsx, [id].tsx, [slug].tsx
//    DURCH DEN MARKEN-PLATZHALTER (/placeholder-profile.svg)
// ---------------------------------------------------------------------------
function replaceUnsplashFallbacks(relFile) {
  const full = path.join(pagesDir, relFile);
  if (!fs.existsSync(full)) return;
  let content = fs.readFileSync(full, "utf8");
  content = content.replace(
    /https:\/\/images\.unsplash\.com\/photo-[a-zA-Z0-9-]+(\?[a-zA-Z0-9=&%-]+)?/g,
    "/placeholder-profile.svg"
  );
  fs.writeFileSync(full, content, "utf8");
}

replaceUnsplashFallbacks("index.tsx");
replaceUnsplashFallbacks("compare-escorts.tsx");
replaceUnsplashFallbacks("search.tsx");
replaceUnsplashFallbacks("escort-zurich.tsx");
replaceUnsplashFallbacks("escort-basel.tsx");
replaceUnsplashFallbacks("escort-bern.tsx");
replaceUnsplashFallbacks("escort-geneva.tsx");
replaceUnsplashFallbacks("escort-lausanne.tsx");
replaceUnsplashFallbacks("escort-lugano.tsx");
replaceUnsplashFallbacks(path.join("orte", "[slug].tsx"));
replaceUnsplashFallbacks(path.join("profile", "[id].tsx"));
console.log("✓ 5. Alle Unsplash-Ersatzporträts auf allen Seiten durch den ehrlichen Marken-Platzhalter (/placeholder-profile.svg) ersetzt!");