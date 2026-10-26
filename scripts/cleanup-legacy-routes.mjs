import fs from "fs";
import path from "path";

const pagesDir = path.join(process.cwd(), "src", "pages");

const LEGACY_TEMPLATE_ROUTES = [
  "demo-accounts.tsx",
  "design-concept-1.tsx",
  "design-concept-2.tsx",
  "design-concept-3.tsx",
  "stories.tsx",
  "gifts.tsx",
  "matches.tsx",
  "events.tsx",
  "live-cam.tsx",
  "members.tsx",
  "messages.tsx",
  "notifications.tsx",
  "booking-confirmation.tsx",
  "checkout.tsx",
  "premium.tsx",
  "boost.tsx",
];

const redirectComponentCode = `import React, { useEffect } from "react";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";

export default function LegacyRedirectPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#13161C] text-white flex items-center justify-center text-xs text-gray-400">
      <SEO title="Weiterleitung | iwantsexnow.ch" noindex />
      <span>Weiterleitung zum Schweizer Profilverzeichnis...</span>
    </div>
  );
}
`;

for (const file of LEGACY_TEMPLATE_ROUTES) {
  const fullPath = path.join(pagesDir, file);
  if (fs.existsSync(fullPath)) {
    fs.writeFileSync(fullPath, redirectComponentCode, "utf8");
    console.log("✓ Alte Template-Seite auf '/' umgeleitet & auf noindex gesetzt:", file);
  }
}

// Aktualisiere robots.txt.tsx, damit Google /demo-accounts, /design-concept-* und /stories aus dem Index entfernt
const robotsPath = path.join(pagesDir, "robots.txt.tsx");
const robotsCode = `import type { GetServerSideProps } from "next";

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
  ].join("\\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(robotsTxt);
  res.end();

  return { props: {} };
};

export default function RobotsTxtPage() {
  return null;
}
`;
fs.writeFileSync(robotsPath, robotsCode, "utf8");
console.log("✓ robots.txt.tsx blockiert jetzt alle alten Template-Routen.");