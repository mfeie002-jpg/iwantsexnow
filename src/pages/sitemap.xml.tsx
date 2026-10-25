import type { GetServerSideProps } from "next";

const CANONICAL_ROUTES = [
  "/",
  "/search",
  "/rankings",
  "/reviews",
  "/reviews/xdate-review",
  "/reviews/fgirl-review",
  "/reviews/and6-review",
  "/reviews/rosalon-review",
  "/reviews/kaufmich-review",
  "/advertise",
  "/for-clients",
  "/how-it-works",
  "/pricing",
  "/report",
  "/escort-zurich",
  "/escort-basel",
  "/escort-bern",
  "/escort-geneva",
  "/escort-lausanne",
  "/hotels",
  "/compare-escorts",
  "/orte/cham",
  "/orte/zug",
  "/orte/zuerich-paradeplatz",
  "/orte/zuerich-oerlikon",
  "/orte/winterthur",
  "/orte/baden",
  "/orte/luzern",
  "/orte/basel-city",
  "/orte/bern-city",
  "/orte/st-gallen",
];

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const baseUrl = "https://iwantsexnow.ch";
  const today = new Date().toISOString().split("T")[0];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${CANONICAL_ROUTES.map(
  (route) => `  <url>
    <loc>${baseUrl}${route}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${route === "/" || route === "/search" ? "daily" : "weekly"}</changefreq>
    <priority>${route === "/" ? "1.0" : route.startsWith("/reviews") || route === "/advertise" ? "0.9" : "0.8"}</priority>
  </url>`
).join("\n")}
</urlset>`;

  res.setHeader("Content-Type", "text/xml");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapXml() {
  return null;
}