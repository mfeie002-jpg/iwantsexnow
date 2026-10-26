import type { GetServerSideProps } from "next";
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
  ].join("\n");

  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.write(xml);
  res.end();

  return { props: {} };
};

export default function SitemapXmlPage() {
  return null;
}
