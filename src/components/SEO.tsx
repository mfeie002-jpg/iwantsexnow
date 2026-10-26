import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { canonicalUrl, releaseIndexingApproved } from "@/lib/seo-policy";

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
}

export function SEO({
  title = "iwantsexnow.ch | Schweizer Profilverzeichnis & Portalvergleich",
  description = "Schweizer Portalberichte, Quellen und Hinweise zur Eintragsverwaltung. Öffentliche Einträge werden erst nach dokumentierter Freigabe angezeigt.",
  image = "https://iwantsexnow.ch/og-cover.jpg",
  url,
  type = "website",
  structuredData,
  schema,
  noindex = false,
  canonicalPath,
  children,
}: SEOProps) {
  const router = useRouter();
  const pageCanonical = canonicalUrl(canonicalPath || url || router.asPath);
  const jsonLdPayload = structuredData || schema;

  return (
    <Head>
      <title>{title}</title>
      <meta key="description" name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" key="robots" content={noindex || !releaseIndexingApproved ? "noindex, nofollow" : "index, follow"} />
      <link key="canonical" rel="canonical" href={pageCanonical} />
      <meta key="og:type" property="og:type" content={type} />
      <meta key="og:site_name" property="og:site_name" content="iwantsexnow.ch" />
      <meta key="og:title" property="og:title" content={title} />
      <meta key="og:description" property="og:description" content={description} />
      <meta key="og:url" property="og:url" content={pageCanonical} />
      <meta key="og:image" property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLdPayload && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPayload).replace(/</g, "\\u003c") }}
        />
      )}
      {children}
    </Head>
  );
}

export default SEO;
