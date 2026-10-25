import fs from "fs";
import path from "path";

const compDir = path.join(process.cwd(), "src", "components");

// 1. SEO.tsx mit Named Export UND Default Export!
const seoCode = `import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonicalPath?: string;
}

export function SEO({
  title = "iwantsexnow.ch | Schweizer Profilverzeichnis & Portalvergleich",
  description = "Profile finden, Verfügbarkeit erkennen und veröffentlichte Preise & Quellen in der ganzen Schweiz übersichtlich vergleichen.",
  image = "https://iwantsexnow.ch/og-cover.jpg",
  noindex = false,
  canonicalPath,
}: SEOProps) {
  const router = useRouter();
  const asPath = router && router.asPath ? router.asPath : "/";
  const cleanPath = (canonicalPath || asPath).split("?")[0].split("#")[0];
  const canonicalUrl = "https://iwantsexnow.ch" + (cleanPath === "/" ? "" : cleanPath);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="de-CH" href="https://iwantsexnow.ch/" />
      <link rel="alternate" hrefLang="fr-CH" href="https://iwantsexnow.ch/escort-geneva" />
      <link rel="alternate" hrefLang="it-CH" href="https://iwantsexnow.ch/escort-lugano" />
      <link rel="alternate" hrefLang="x-default" href="https://iwantsexnow.ch/" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="iwantsexnow.ch" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}

export default SEO;
`;
fs.writeFileSync(path.join(compDir, "SEO.tsx"), seoCode, "utf8");
console.log("✓ SEO.tsx hat jetzt Named Export { SEO } UND Default Export!");

// 2. Stelle sicher, dass LuxuryHeader, StructuredSchema & XeniaContextualHelp ebenfalls Default Exports haben
function ensureDefaultExport(fileName, exportName) {
  const fullPath = path.join(compDir, fileName);
  if (fs.existsSync(fullPath)) {
    let raw = fs.readFileSync(fullPath, "utf8");
    if (!raw.includes("export default ")) {
      raw += `\nexport default ${exportName};\n`;
      fs.writeFileSync(fullPath, raw, "utf8");
      console.log(`✓ Default Export ergänzt in: ${fileName}`);
    }
  }
}

ensureDefaultExport("LuxuryHeader.tsx", "LuxuryHeader");
ensureDefaultExport("StructuredSchema.tsx", "StructuredSchema");
ensureDefaultExport("XeniaContextualHelp.tsx", "XeniaDoubtTrigger");