import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const txt = `User-agent: *
Allow: /
Allow: /orte/
Allow: /kategorie/
Allow: /profile/
Allow: /clubs
Allow: /pricing
Allow: /rankings
Allow: /reviews
Allow: /hotels
Disallow: /admin-dashboard
Disallow: /admin/
Disallow: /api/
Disallow: /creator-dashboard

Sitemap: https://iwantsexnow.ch/sitemap.xml
`;

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.setHeader("Cache-Control", "public, s-maxage=86400, stale-while-revalidate=86400");
  res.write(txt);
  res.end();

  return { props: {} };
};

export default function RobotsTxt() {
  return null;
}