import Head from "next/head";
import { useRouter } from "next/router";

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

const PRIVATE_NOINDEX_PREFIXES = [
  "/admin",
  "/creator-dashboard",
  "/account-settings",
  "/login",
  "/register",
  "/forgot-password",
  "/private",
  "/demo-accounts",
  "/design-concept",
];

export function SEO({
  title = "iWantSexNow.ch | Schweizer Escort-Index, Preisvergleich & Direktbuchung ★ 9.9",
  description = "★ 9.9/10 Schweizer Escort-Suchmaschine: Alle Portale (xdate, fgirl, and6) ohne Dubletten in Zürich, Zug, Cham, Basel, Bern & Genf. ✓ 100% Fixpreis-Garantie ✓ 3-Min. 1:1 Live-Cam Check.",
  image = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=1200&h=630&fit=crop",
  url,
  type = "website",
  noindex = false,
  structuredData,
  children,
}: SEOProps) {
  const router = useRouter();
  const cleanPath = (router?.asPath || "/").split("?")[0].split("#")[0];
  const canonicalUrl = url || `https://iwantsexnow.ch${cleanPath === "/" ? "" : cleanPath}`;

  const isPrivateRoute =
    noindex || PRIVATE_NOINDEX_PREFIXES.some((prefix) => cleanPath.startsWith(prefix));

  // Global Google Sitelinks Searchbox & Organization Schema
  const defaultGlobalSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "iWantSexNow.ch – Der Schweizer Escort- & Preis-Index",
    alternateName: "iWantSexNow Schweiz",
    url: "https://iwantsexnow.ch",
    inLanguage: "de-CH",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://iwantsexnow.ch/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  const finalSchema = structuredData
    ? Array.isArray(structuredData)
      ? [defaultGlobalSchema, ...structuredData]
      : [defaultGlobalSchema, structuredData]
    : defaultGlobalSchema;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      <meta
        name="robots"
        content={
          isPrivateRoute
            ? "noindex, nofollow"
            : "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1"
        }
      />
      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="de-ch" href={canonicalUrl} />
      <link rel="alternate" hrefLang="de" href={canonicalUrl} />
      <link rel="alternate" hrefLang="x-default" href={canonicalUrl} />

      {/* Geo-Targeting Meta Tags for Switzerland */}
      <meta name="geo.region" content="CH" />
      <meta name="geo.placename" content="Zürich, Zug, Cham, Schweiz" />
      <meta name="theme-color" content="#0B1623" />

      {/* Open Graph / WhatsApp / Telegram / Signal Rich Link Preview */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:site_name" content="iWantSexNow.ch · Swiss Verified Escort Index" />
      <meta property="og:locale" content="de_CH" />

      {/* Twitter / X Large Summary Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

      {!isPrivateRoute && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(finalSchema),
          }}
        />
      )}
      {children}
    </Head>
  );
}

export default SEO;