import Head from "next/head";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  structuredData?: Record<string, any> | Record<string, any>[];
}

export function SEO({
  title = "iwantsexnow.ch | Schweizer Escort-Index, Live-Status & Direktbuchung",
  description = "Entdecke über 7.021+ Schweizer Escorts, Studios & Begleiterinnen. Visuelle Schnellwahl ohne Tippen, Live-Online-Status, offizielle Verifizierung und transparente Preise.",
  image = "/og-image.png",
  url = "https://iwantsexnow.ch",
  type = "website",
  noindex = false,
  structuredData,
}: SEOProps) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
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