import { Toaster } from "@/components/ui/toaster";
import SEO from "@/components/SEO";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

const routeMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "iWantSexNow.ch | Verifizierter Schweizer Escort- & Preisvergleich (Zürich & Zug)",
    description: "Finden, vergleichen und direkt anfragen: Transparente Endpreise, geprüfte Identitäten, Dubletten-Check über 47 Portale und Echtzeit-Verfügbarkeit.",
  },
  "/search": {
    title: "Erotik & Escort Suche Schweiz – Preis- & Portalvergleich | iWantSexNow.ch",
    description: "Intent-basierte Suche für Zürich, Zug und die ganze Schweiz mit transparentem Endpreis-Rechner.",
  },
  "/compare-escorts": {
    title: "47 Schweizer Portale & Direktprofile im Vergleich | iWantSexNow.ch",
    description: "Dubletten-Check, echte Endpreise und verifizierte Direktprofile im direkten Vergleich.",
  },
  "/escort-zurich": {
    title: "Escort Zürich & Zug – Verifizierte Direktprofile | iWantSexNow.ch",
    description: "Geprüfte Profile in Zürich, Zug und Winterthur mit Echtzeit-Verfügbarkeit und Endpreis-Garantie.",
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
      .replace(/-/g, " ") || "Schweizer Decision-Marketplace";

  const meta = routeMeta[pathname] || {
    title: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1) + " | iWantSexNow.ch",
    description: "Verifizierter Schweizer Escort- & Preisvergleich mit transparenten Endpreisen und diskreter Direkt-Anfrage.",
  };

  return (
    <>
      <SEO title={meta.title} description={meta.description} />
      <Component {...pageProps} />
      <Toaster />
    </>
  );
}
