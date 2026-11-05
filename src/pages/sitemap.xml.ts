import { GetServerSideProps } from "next";
import offersData from "@/data/harvested-offers.json";

const BASE_URL = "https://iwantsexnow.ch";

const TOP_SWISS_CITIES = [
  "zuerich", "zug", "cham", "basel", "bern", "luzern",
  "st-gallen", "baden", "winterthur", "geneve", "lausanne", "lugano"
];

const TOP_SERVICES = [
  "girlfriend-experience",
  "erotische-massage",
  "tantra-massage",
  "hotelbesuch-outcall",
  "privatempfang-incall",
  "domina-bdsm",
  "trans-ts"
];

const STATIC_ROUTES = [
  "",
  "/search",
  "/compare-escorts",
  "/rankings",
  "/reviews",
  "/reviews/xdate-review",
  "/reviews/fgirl-review",
  "/reviews/and6-review",
  "/reviews/bemygirl-review",
  "/live-cam",
  "/pricing",
  "/advertise",
  "/create-post",
  "/verify",
  "/how-it-works",
  "/escort-zurich",
  "/escort-geneva",
  "/escort-basel",
  "/escort-bern",
  "/escort-lausanne",
  "/escort-lugano",
];

export default function SitemapXml() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const nowIso = new Date().toISOString();
  const offers = (offersData as any[]) || [];

  const urls: string[] = [];

  // 1. Statische Haupt- & Städte-Routen
  for (const r of STATIC_ROUTES) {
    urls.push(
      `<url><loc>${BASE_URL}${r}</loc><lastmod>${nowIso}</lastmod><changefreq>daily</changefreq><priority>${r === "" ? "1.0" : "0.9"}</priority></url>`
    );
  }

  // 2. 2D Programmatische SEO-Landingpages: Stadt x Service (84 hochrelevante Google.ch Kombinationen)
  for (const city of TOP_SWISS_CITIES) {
    urls.push(
      `<url><loc>${BASE_URL}/orte/${city}</loc><lastmod>${nowIso}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>`
    );
    for (const srv of TOP_SERVICES) {
      urls.push(
        `<url><loc>${BASE_URL}/kategorie/${city}/${srv}</loc><lastmod>${nowIso}</lastmod><changefreq>daily</changefreq><priority>0.85</priority></url>`
      );
    }
  }

  // 3. Alle 2.526 Schweizer Einzelprofile (/profile/[id])
  for (const o of offers) {
    const pid = o.id || o.dedupClusterId;
    if (!pid) continue;
    urls.push(
      `<url><loc>${BASE_URL}/profile/${encodeURIComponent(pid)}</loc><lastmod>${nowIso}</lastmod><changefreq>daily</changefreq><priority>0.8</priority></url>`
    );
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};