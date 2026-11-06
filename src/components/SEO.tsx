import React from "react";
import Head from "next/head";

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  image?: string;
  noindex?: boolean;
  schemaJson?: Record<string, any> | Record<string, any>[];
}

export function SEO({
  title = "IWANTSEXNOW.CH — Schweizer Escort-, Tantra- & Studio-Direktverzeichnis (0% Provision)",
  description = "2'515+ geprüfte Schweizer Escort-, Girlfriend-Experience-, Tantra- & Studio-Profile sowie 108 stationäre Clubs in Zürich, Zug, Luzern, Basel, Bern & Genf. Direkter +41 Kontakt & transparente CHF-Tarife.",
  url = "https://iwantsexnow.ch",
  image = "https://iwantsexnow.ch/images/escort-portrait-1.jpg",
  noindex = false,
  schemaJson,
}: SEOProps) {
  const cleanUrl = String(url || "https://iwantsexnow.ch").split("?")[0];

  const defaultGraph = [
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "IWANTSEXNOW.CH",
      alternateName: "Schweizer Escort & Erotik-Direktverzeichnis",
      url: "https://iwantsexnow.ch",
      inLanguage: ["de-CH", "fr-CH", "it-CH", "en"],
      potentialAction: {
        "@type": "SearchAction",
        target: "https://iwantsexnow.ch/search?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: title,
      description,
      url: cleanUrl,
      areaServed: [
        { "@type": "AdministrativeArea", name: "Kanton Zug (ZG)" },
        { "@type": "AdministrativeArea", name: "Kanton Zürich (ZH)" },
        { "@type": "AdministrativeArea", name: "Kanton Luzern (LU)" },
        { "@type": "AdministrativeArea", name: "Kanton Aargau (AG)" },
        { "@type": "AdministrativeArea", name: "Kanton Basel-Stadt (BS)" },
        { "@type": "AdministrativeArea", name: "Kanton Bern (BE)" },
        { "@type": "AdministrativeArea", name: "Kanton Genève (GE)" },
        { "@type": "AdministrativeArea", name: "Kanton Vaud (VD)" },
        { "@type": "AdministrativeArea", name: "Kanton Ticino (TI)" },
      ],
      offers: {
        "@type": "AggregateOffer",
        priceCurrency: "CHF",
        lowPrice: "150",
        highPrice: "800",
        offerCount: "2515",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        bestRating: "5",
        worstRating: "1",
        ratingCount: "384",
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "Wie hoch sind die üblichen CHF-Honorare für Escort & Massage in der Schweiz?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Der kantonale Richtwert für ein klassisches 60-Minuten-Date liegt in der Schweiz zwischen CHF 250.– und CHF 450.– (30-Minuten-Express-Termine ab ca. CHF 150.– bis CHF 250.–). Alle Profile auf iwantsexnow.ch weisen transparente CHF-Tarife ohne Vermittlungsprovision aus.",
          },
        },
        {
          "@type": "Question",
          name: "Wie funktioniert der direkte +41 Kontakt und die 4-Stunden-Verfügbarkeit?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Anbieterinnen bestätigen in ihrem Schweizer Cockpit mit 1 Klick ihre Echtzeit-Verfügbarkeit für die nächsten 4 Stunden. Besucher nehmen direkt per Schweizer +41 Telefonnummer oder WhatsApp Kontakt auf.",
          },
        },
      ],
    },
  ];

  const extraSchemas = Array.isArray(schemaJson)
    ? schemaJson
    : schemaJson
    ? [schemaJson]
    : [];

  const combinedSchema = [...defaultGraph, ...extraSchemas];

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="canonical" href={cleanUrl} />
      <link rel="alternate" hrefLang="de-CH" href={cleanUrl} />
      <link rel="alternate" hrefLang="x-default" href={cleanUrl} />

      {noindex ? (
        <meta name="robots" content="noindex,nofollow" />
      ) : (
        <meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1" />
      )}

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="IWANTSEXNOW.CH" />
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(combinedSchema) }}
      />
    </Head>
  );
}

export default SEO;