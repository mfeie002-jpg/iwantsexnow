import { Toaster } from "@/components/ui/toaster";
import SEO from "@/components/SEO";
import PreviewAccess from "@/components/PreviewAccess";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

const routeMeta: Record<string, { title: string; description: string }> = {
 "/": { title: "Informationen & Orientierung | iWantSexNow.ch", description: "Häufige Fragen, Datenschutzinformationen und Kontaktstatus an einem Ort. Persönliche Funktionen bleiben deaktiviert." },
 "/search": { title: "Inserate noch nicht freigeschaltet | iWantSexNow.ch", description: "Es sind keine öffentlichen Inserate veröffentlicht." },
};

// All sensitive or commercial actions remain read-only in the public pre-launch prototype.
// Keep the underlying page components untouched for later authenticated implementation.
export const previewOnlyRoutes: Record<string, string> = {
  "/booking-confirmation": "Buchungsanfrage",
  "/create-post": "Inserat veröffentlichen",
  "/verify": "Profilprüfung",
  "/upload-photos": "Foto-Upload",
  "/messages": "Nachrichten",
  "/premium": "Premium-Mitgliedschaft",
  "/boost": "Bezahlte Promotion",
  "/gifts": "Geschenke",
  "/content-feed": "Bezahlte Inhalte",
  "/creator-dashboard": "Creator-Dashboard",
  "/profile": "Benutzerprofil",
  "/account-settings": "Kontoeinstellungen",
};

export default function App({ Component, pageProps }: AppProps) {
  const { pathname } = useRouter();
  const previewFeature = previewOnlyRoutes[pathname];
  const fallbackName = pathname
    .split("/")
    .filter((segment) => segment && !segment.startsWith("["))
    .join(" / ")
    .replace(/-/g, " ") || "Plattform-Vorschau";
  const meta = previewFeature
    ? {
        title: previewFeature + " noch nicht aktiv | iWantSexNow.ch",
        description: "Diese Funktion ist eine Design-Vorschau. Es werden keine Buchungen, Nachrichten, Zahlungen, Konten oder Identitätsprüfungen verarbeitet.",
      }
    : routeMeta[pathname] || {
    title: fallbackName.charAt(0).toUpperCase() + fallbackName.slice(1) + " | iWantSexNow.ch",
    description: "iWantSexNow.ch befindet sich in der Vorschauphase. Es sind keine öffentlichen Profile oder Transaktionen freigeschaltet.",
  };

  return (
    <>
      <SEO title={meta.title} description={meta.description} />
      {previewFeature ? <PreviewAccess feature={previewFeature} /> : <Component {...pageProps} />}
      <Toaster />
    </>
  );
}
