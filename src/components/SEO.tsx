import Head from "next/head";

export function SEO({
  title = "iwantsexnow.ch | Schweizer Escort-Index, Live-Status & Direktbuchung",
  description = "Entdecke über 7.021+ Schweizer Escorts, Studios & Begleiterinnen.",
  image = "/og-image.png",
  url = "https://iwantsexnow.ch",
  type = "website",
  noindex = false,
  structuredData,
}: any) {
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