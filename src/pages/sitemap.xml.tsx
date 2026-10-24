import type { GetServerSideProps } from "next";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";
import { SWISS_SEO_LOCATIONS } from "@/pages/orte/[slug]";

const BASE_URL = "https://iwantsexnow.ch";

const STATIC_ROUTES = [
  "",
  "/search",
  "/compare-escorts",
  "/rankings",
  "/live-cam",
  "/how-it-works",
  "/matches",
  "/escort-zurich",
  "/escort-basel",
  "/escort-bern",
  "/escort-geneva",
  "/escort-lausanne",
  "/create-post",
  "/pricing",
  "/verify",
  "/checkout",
  "/login",
  "/faq",
  "/safety",
];

function generateSiteMap() {
  const now = new Date().toISOString();
  const profiles = deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED);
  const profileRoutes = profiles.map((p) => `/profile/${encodeURIComponent(p.displayName)}`);
  const localSeoRoutes = Object.keys(SWISS_SEO_LOCATIONS).map((slug) => `/orte/${slug}`);
  const allRoutes = [...STATIC_ROUTES, ...localSeoRoutes, ...profileRoutes];

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allRoutes
  .map(
    (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === "" || route === "/search" || route === "/rankings" ? "hourly" : "daily"}</changefreq>
    <priority>${route === "" ? "1.0" : route.startsWith("/orte/") || route.startsWith("/escort-") || route.startsWith("/profile/") ? "0.9" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;
}

export default function SiteMap() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const sitemap = generateSiteMap();
  res.setHeader("Content-Type", "text/xml");
  res.setHeader("Cache-Control", "public, s-maxage=3600, stale-while-revalidate=86400");
  res.write(sitemap);
  res.end();
  return { props: {} };
};