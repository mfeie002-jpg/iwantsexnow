import type { GetServerSideProps } from "next";

const BASE_URL = "https://iwantsexnow.ch";

const STATIC_ROUTES = [
  "",
  "/search",
  "/compare-escorts",
  "/matches",
  "/escort-zurich",
  "/escort-basel",
  "/escort-bern",
  "/escort-geneva",
  "/escort-lausanne",
  "/create-post",
  "/pricing",
  "/verify",
  "/faq",
  "/safety",
  "/profile/1",
  "/profile/2",
  "/profile/3",
  "/profile/4",
];

function generateSiteMap() {
  const now = new Date().toISOString();
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${STATIC_ROUTES.map(
  (route) => `  <url>
    <loc>${BASE_URL}${route}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${route === "" || route === "/search" ? "hourly" : "daily"}</changefreq>
    <priority>${route === "" ? "1.0" : route.startsWith("/escort-") ? "0.9" : "0.8"}</priority>
  </url>`
).join("\n")}
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