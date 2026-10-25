import { Toaster } from "@/components/ui/toaster";
import { SEO } from "@/components/SEO";
import { AgeVerificationGate } from "@/components/AgeVerificationGate";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { useRouter } from "next/router";

const routeMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "iWantSexNow.ch | Der Schweizer Escort-Index – Vergleichen & Direkt Buchen",
    description: "Alle Schweizer Escorts, Studios und Portale in einer Suchmaschine: Echte Endpreise, automatischer Dubletten-Filter und verifizierte Direktbuchung in Zürich & Zug.",
  },
  "/search": {
    title: "Erotik & Escort Suche Schweiz – Preis- & Portalvergleich | iWantSexNow.ch",
    description: "Schweizweite Meta-Suche für Zürich, Zug, Cham und die ganze Schweiz mit transparentem Endpreis-Rechner.",
  },
  "/compare-escorts": {
    title: "Schweizer Portale & Direktprofile im Endpreis-Vergleich | iWantSexNow.ch",
    description: "Dubletten-Check, echte Endpreise und verifizierte Direktprofile im direkten Vergleich.",
  },
  "/escort-zurich": {
    title: "Escort Zürich, Zug & Cham – Verifizierte Direktprofile | iWantSexNow.ch",
    description: "Geprüfte Profile in Zürich, Zug, Cham und Winterthur mit Echtzeit-Verfügbarkeit und Endpreis-Garantie.",
  },
  "/escort-geneva": {
    title: "Escort Genève – Verifizierte Direktprofile | iWantSexNow.ch",
    description: "Exklusive Begleitung und geprüfte Profile in Genf.",
  },
  "/escort-basel": {
    title: "Escort Basel – Verifizierte Direktprofile | iWantSexNow.ch",
    description: "Geprüfte Anbieterinnen, Studios und Direktprofile in Basel.",
  },
  "/escort-bern": {
    title: "Escort Bern – Verifizierte Direktprofile | iWantSexNow.ch",
    description: "Diskrete Begleitung und verifizierte Profile in Bern.",
  },
  "/escort-lausanne": {
    title: "Escort Lausanne – Verifizierte Direktprofile | iWantSexNow.ch",
    description: "Geprüfte Profile und diskrete Direkt-Anfragen in Lausanne.",
  },
};

export const previewOnlyRoutes: Record<string, string> = {};

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const fallbackName =
    pathname
      .split("/")
      .filter((segment) => segment && !segment.startsWith("["))
      .join(" / ")
      .replace(/-/g, " ") || "Schweizer Escort-Index";

  const meta = routeMeta[pathname] || {
    title: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1) + " | iWantSexNow.ch",
    description: "Verifizierter Schweizer Escort- & Preisvergleich mit transparenten Endpreisen und diskreter Direktbuchung.",
  };

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "iWantSexNow.ch",
    url: "https://iwantsexnow.ch",
    description: meta.description,
    potentialAction: {
      "@type": "SearchAction",
      target: "https://iwantsexnow.ch/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <>
      <SEO title={meta.title} description={meta.description} />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </Head>
      <AgeVerificationGate />
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}