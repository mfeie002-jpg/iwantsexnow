import type { GetServerSideProps } from "next";

export default function RobotsTxt() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const content = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /admin-dashboard",
    "Disallow: /api/",
    "Sitemap: https://iwantsexnow.ch/sitemap.xml",
  ].join("\n");

  res.setHeader("Content-Type", "text/plain");
  res.write(content);
  res.end();
  return { props: {} };
};