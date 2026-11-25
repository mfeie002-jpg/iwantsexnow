import type { GetServerSideProps } from "next";
import offersData from "@/data/harvested-offers.json";

const CITIES = ["zug", "zuerich", "luzern", "baden", "basel", "bern", "st-gallen", "winterthur", "geneve", "lausanne", "lugano"];
const SERVICES = [
  "girlfriend-experience",
  "tantra-massage",
  "haus-und-hotelbesuche",
  "domina-bdsm",
  "dinner-date",
  "trans-escort",
  "paare-und-bisex",
];

const STATIC_PATHS = [
  "",
  "/search", "/fantasy-preview", "/clubs", "/pricing",
  "/matches",
  "/stories",
  "/live-cam",
  "/rankings",
  "/compare-escorts",
  "/clubs",
  "/pricing",
  "/hotels",
  "/reviews",
  "/register",
  "/favorites",
  "/boost",
  "/premium",
  "/events",
  "/messages",
  "/notifications",
  "/gifts",
  "/members",
  "/search-atlas",
  "/guides",
  "/faq",
  "/safety",
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = "https://iwantsexnow.ch";
  const now = new Date().toISOString();

  const urls: { loc: string; priority: string; changefreq: string }[] = [];

  for (const p of STATIC_PATHS) {
    urls.push({ loc: `${baseUrl}${p}`, priority: p === "" ? "1.0" : "0.9", changefreq: "hourly" });
  }

  for (const c of CITIES) {
    urls.push({ loc: `${baseUrl}/orte/${c}`, priority: "0.9", changefreq: "hourly" });
    for (const s of SERVICES) {
      urls.push({ loc: `${baseUrl}/kategorie/${c}/${s}`, priority: "0.85", changefreq: "daily" });
    }
  }

  const rawOffers = ((offersData as any[]) || []).slice(0, 1000);
  for (const o of rawOffers) {
    const pid = o.id || o.dedupClusterId;
    if (pid) {
      urls.push({
        loc: `${baseUrl}/profile/${encodeURIComponent(pid)}`,
        priority: "0.8",
        changefreq: "daily",
      });
    }
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapXml() {
  return null;
}