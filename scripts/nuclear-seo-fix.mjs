import fs from "fs";
import path from "path";

const root = process.cwd();
const nextCacheDir = path.join(root, ".next");

// 1. Lösche den .next Cache-Ordner komplett, damit Webpack nichts Altes mehr lädt!
if (fs.existsSync(nextCacheDir)) {
  fs.rmSync(nextCacheDir, { recursive: true, force: true });
  console.log("✓ Alter .next Webpack-Cache komplett gelöscht!");
}

const seoUniversalContent = `import React from "react";
import Head from "next/head";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  noindex?: boolean;
  canonicalPath?: string;
  children?: React.ReactNode;
}

export function SEO({
  title = "iwantsexnow.ch | Schweizer Profilverzeichnis & Portalvergleich",
  description = "Profile finden, Verfügbarkeit erkennen und veröffentlichte Preise & Quellen in der ganzen Schweiz übersichtlich vergleichen.",
  image = "https://iwantsexnow.ch/og-cover.jpg",
  noindex = false,
  canonicalPath,
  children,
}: SEOProps) {
  const cleanPath = (canonicalPath || "/").split("?")[0].split("#")[0];
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
      {children}
    </Head>
  );
}

export default SEO;
`;

// 2. Schreibe SEO.tsx in src/components (beide Schreibweisen unter Windows abdecken)
const compDir = path.join(root, "src", "components");
fs.writeFileSync(path.join(compDir, "SEO.tsx"), seoUniversalContent, "utf8");
console.log("✓ src/components/SEO.tsx sauber ohne Router-SSR-Abhängigkeit geschrieben!");

// 3. Durchsuche rekursiv alle .tsx/.ts Dateien in src/ und harmonisiere default SEO imports -> named { SEO } imports
function walkAndFixImports(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkAndFixImports(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith(".tsx") || entry.name.endsWith(".ts"))) {
      let content = fs.readFileSync(fullPath, "utf8");
      let changed = false;

      // Wandle 'import SEO from "@/components/SEO"' in 'import { SEO } from "@/components/SEO"' um
      const regexDefaultSeo = /import\s+SEO\s+from\s+["']@\/components\/SEO["'];?/g;
      if (regexDefaultSeo.test(content)) {
        content = content.replace(regexDefaultSeo, 'import { SEO } from "@/components/SEO";');
        changed = true;
      }

      const regexDefaultSeoLower = /import\s+SEO\s+from\s+["']@\/components\/seo["'];?/g;
      if (regexDefaultSeoLower.test(content)) {
        content = content.replace(regexDefaultSeoLower, 'import { SEO } from "@/components/SEO";');
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log("  → Import vereinheitlicht in:", path.relative(root, fullPath));
      }
    }
  }
}

walkAndFixImports(path.join(root, "src"));
console.log("✓ Alle SEO-Imports in src/ sind jetzt 100% einheitlich!");