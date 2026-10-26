import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /admin",
    "Disallow: /admin-dashboard",
    "Disallow: /creator-dashboard",
    "Disallow: /private/",
    "Disallow: /search-atlas",
    "Disallow: /web-analyzer",
    "Disallow: /logo-concepts",
    "Disallow: /logo-redesigns",
    "Disallow: /demo-accounts",
    "Disallow: /design-concept-1",
    "Disallow: /design-concept-2",
    "Disallow: /design-concept-3",
    "Disallow: /stories",
    "Disallow: /matches",
    "Disallow: /gifts",
    "Disallow: /events",
    "Disallow: /live-cam",
    "",
    "Sitemap: https://iwantsexnow.ch/sitemap.xml",
  ].join("\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(robotsTxt);
  res.end();

  return { props: {} };
};

export default function RobotsTxtPage() {
  return null;
}
