import React from "react";
import Head from "next/head";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string | string[];
  structuredData?: Record<string, any> | Array<Record<string, any>>;
  schema?: Record<string, any> | Array<Record<string, any>>;
  noindex?: boolean;
  canonicalPath?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

function buildCanonicalUrl(canonicalPath?: string, url?: string): string {
  if (url && url.startsWith("http")) return url;
  const raw = String(canonicalPath || url || "/").split("?")[0].split("#")[0];
  const stripped = raw.replace("https://iwantsexnow.ch", "").replace("http://iwantsexnow.ch", "");
  if (!stripped || stripped === "/") return "https://iwantsexnow.ch";
  return "https://iwantsexnow.ch" + (stripped.startsWith("/") ? stripped : "/" + stripped);
}

export function SEO({
  title = "iwantsexnow.ch | Schweizer Profilverzeichnis & Portalvergleich",
  description = "Profile finden, Verfügbarkeit erkennen und veröffentlichte Preise & Quellen in der ganzen Schweiz übersichtlich vergleichen.",
  image = "https://iwantsexnow.ch/og-cover.jpg",
  url,
  type = "website",
  structuredData,
  schema,
  noindex = false,
  canonicalPath,
  children,
}: SEOProps) {
  const canonicalUrl = buildCanonicalUrl(canonicalPath, url);
  const jsonLdPayload = structuredData || schema;

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
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="iwantsexnow.ch" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLdPayload && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPayload) }}
        />
      )}
      {children}
    </Head>
  );
}

export default SEO;
