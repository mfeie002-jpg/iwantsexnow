import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

type Schema = Record<string, unknown>;
interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  type?: string;
  noindex?: boolean;
  schemaJson?: Schema | Schema[];
  structuredData?: Schema | Schema[];
}

const ORIGIN = "https://iwantsexnow.ch";
const DEFAULT_IMAGE = ORIGIN + "/images/ai/hero-swiss-night.webp";

export function SEO({
  title = "iwantsexnow.ch — Schweizer Escort-, Massage- & Studio-Verzeichnis",
  description = "Entdecke regionale Einträge, vergleiche Quellen und informiere dich über Schweizer Escort-, Massage- und Studio-Angebote.",
  url,
  image = DEFAULT_IMAGE,
  type = "website",
  noindex = false,
  schemaJson,
  structuredData
}: SEOProps) {
  const router = useRouter();
  const rawPath = String(router.asPath || "/").split(/[?#]/)[0];
  const path = rawPath.startsWith("/") ? rawPath : "/";
  const cleanUrl = String(url || ORIGIN + path).split(/[?#]/)[0];
  const ogType = type === "article" ? "article" : "website";

  const baseSchema: Schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "iwantsexnow.ch",
    url: ORIGIN,
    inLanguage: ["de-CH", "fr-CH", "it-CH", "en"],
    potentialAction: {
      "@type": "SearchAction",
      target: ORIGIN + "/search?q={search_term_string}",
      "query-input": "required name=search_term_string"
    }
  };

  const extraSchemas = [
    ...(Array.isArray(schemaJson) ? schemaJson : schemaJson ? [schemaJson] : []),
    ...(Array.isArray(structuredData) ? structuredData : structuredData ? [structuredData] : [])
  ];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={cleanUrl} />
      <link rel="alternate" hrefLang="de-CH" href={cleanUrl} />
      <link rel="alternate" hrefLang="x-default" href={cleanUrl} />
      <meta name="robots" content={noindex ? "noindex,nofollow" : "index,follow,max-image-preview:large,max-snippet:-1"} />
      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content="iwantsexnow.ch" />
      <meta property="og:locale" content="de_CH" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={cleanUrl} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify([baseSchema, ...extraSchemas]) }}
      />
    </Head>
  );
}

export default SEO;
