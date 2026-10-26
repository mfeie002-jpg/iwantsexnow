import type { GetServerSideProps } from "next";
// No routes are submitted while release indexing is withheld.
export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  res.setHeader("Content-Type", "application/xml; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end('<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>');
  return { props: {} };
};
export default function SitemapXml() { return null; }
