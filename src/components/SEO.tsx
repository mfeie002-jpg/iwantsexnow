import Head from "next/head";

export function SEO({
  title = "iwantsexnow.ch | Schweizer Escort-Index, Preisvergleich & Direktkontakt",
  description = "Über 2.526 geprüfte Schweizer Escort-, Tantra- & Studio-Profile in 24 Kantonen: Echte 30m/60m CHF-Richtpreise, +41 Direktkontakt und 305 Clubs vergleichen.",
  image = "/og-image.png",
  url = "https://iwantsexnow.ch",
  type = "website",
  noindex = false,
  structuredData,
}: any) {
  const canonicalUrl = String(url || "https://iwantsexnow.ch").trim();

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      <link rel="canonical" href={canonicalUrl} />

      {/* Swiss Multilingual hreflang Signals for Google.ch */}
      <link rel="alternate" hrefLang="de-CH" href={canonicalUrl} />
      <link rel="alternate" hrefLang="fr-CH" href="https://iwantsexnow.ch/kategorie/geneve/girlfriend-experience" />
      <link rel="alternate" hrefLang="it-CH" href="https://iwantsexnow.ch/kategorie/lugano/girlfriend-experience" />
      <link rel="alternate" hrefLang="en-CH" href="https://iwantsexnow.ch/guides/english-tourist-expat-escort-guide-switzerland" />
      <link rel="alternate" hrefLang="x-default" href="https://iwantsexnow.ch" />

      {noindex ? (
        <meta name="robots" content="noindex, nofollow" />
      ) : (
        <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      )}

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="de_CH" />
      <meta property="og:locale:alternate" content="fr_CH" />
      <meta property="og:locale:alternate" content="it_CH" />

      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </Head>
  );
}
export default SEO;