import Head from "next/head";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  structuredData?: any;
  children?: React.ReactNode;
}

export function SEO({
  title = "iWantSexNow.ch | Schweizer Escort-Index, Preisvergleich & Direktbuchung",
  description = "Alle Schweizer Escort-Portale in einer Suche: 100% bereinigt um Dubletten, echte Endpreis-Garantie (Zürich, Zug, Cham, Basel, Bern, Genf) & 1:1 Live-Cam Check.",
  image = "https://iwantsexnow.ch/og-image.png",
  url = "https://iwantsexnow.ch",
  type = "website",
  noindex = false,
  structuredData,
  children,
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={url} />

      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:site_name" content="iWantSexNow.ch" />
      <meta property="og:locale" content="de_CH" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {structuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      )}
      {children}
    </Head>
  );
}

export default SEO;