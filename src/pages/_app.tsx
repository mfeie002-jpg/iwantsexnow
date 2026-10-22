import { Toaster } from "@/components/ui/toaster";
import SEO from "@/components/SEO";
import PreviewAccess from "@/components/PreviewAccess";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { useRouter } from "next/router";

const routeMeta: Record<string, { title: string; description: string }> = {
  "/": {
    title: "iWantSexNow.ch | Schweizer Inserate-Marktplatz (Vorschau)",
    description: "Vorschau eines Schweizer Vergleichsmarktplatzes. Alle Profile und Kennzahlen sind Demo-Beispiele; keine realen Buchungen oder Konten.",
  },
  "/escort-zurich": {
    title: "Escort Zürich – Demoseite | iWantSexNow.ch",
    description: "Vorschau für Zürich mit fiktiven Profilen, Bildern und Beispielpreisen. Noch keine realen Inserate oder Vermittlung.",
  },
  "/escort-geneva": {
    title: "Escort Genf – Demoseite | iWantSexNow.ch",
    description: "Regionaler Konzeptentwurf mit Demo-Profilen und ohne echte Buchungen.",
  },
  "/escort-basel": {
    title: "Escort Basel – Demoseite | iWantSexNow.ch",
    description: "Regionaler Konzeptentwurf mit Demo-Profilen und ohne echte Buchungen.",
  },
  "/escort-bern": {
    title: "Escort Bern – Demoseite | iWantSexNow.ch",
    description: "Regionaler Konzeptentwurf mit Demo-Profilen und ohne echte Buchungen.",
  },
  "/escort-lausanne": {
    title: "Escort Lausanne – Demoseite | iWantSexNow.ch",
    description: "Regionaler Konzeptentwurf mit Demo-Profilen und ohne echte Buchungen.",
  },
  "/demo-accounts": {
    title: "Demo-Konten und Testprofile | iWantSexNow.ch",
    description: "Nur fiktive Testkonten, öffentliche Demo-Passwörter und Beispielstatistiken. Kein echter Login.",
  },
  "/register": {
    title: "Registrierung noch nicht aktiv | iWantSexNow.ch",
    description: "Sichere öffentliche Registrierung ist noch nicht verfügbar. Bitte keine echten Zugangsdaten eingeben.",
  },
  "/login": {
    title: "Anmeldung noch nicht aktiv | iWantSexNow.ch",
    description: "Die Plattform wird vorbereitet. Echte Benutzerkonten und Login sind noch nicht freigeschaltet.",
  },
  "/forgot-password": {
    title: "Passwort zurücksetzen noch nicht aktiv | iWantSexNow.ch",
    description: "Die öffentliche Passwort-Wiederherstellung folgt mit einem sicheren Anmeldesystem.",
  },
  "/pricing": {
    title: "Geplantes Preismodell (Demo) | iWantSexNow.ch",
    description: "Unverbindliche Preise und Promotion-Beispiele. Derzeit keine kostenpflichtigen Buchungen.",
  },
  "/contact": {
    title: "Kontakt und Support – in Vorbereitung | iWantSexNow.ch",
    description: "Noch kein betreuter Kontaktkanal oder Live-Chat. Diese Vorschau nimmt keine Anfragen entgegen.",
  },
  "/imprint": {
    title: "Betreiberangaben – in Vorbereitung | iWantSexNow.ch",
    description: "Status der noch ausstehenden Betreiberangaben. Kein vollständiges Impressum und kein aktiver Vermittlungsbetrieb.",
  },
  "/privacy": {
    title: "Datenschutzinformationen – Vorschau | iWantSexNow.ch",
    description: "Vorläufige Informationen zum Entwicklungsstand. Keine vollständige Datenschutzerklärung; reale Registrierungen sind noch deaktiviert.",
  },
  "/terms": {
    title: "Nutzungsbedingungen – Vorschau | iWantSexNow.ch",
    description: "Vorläufige Informationen zur noch nicht aktiven Schweizer Vergleichsplattform. Keine echten Buchungen oder kostenpflichtigen Leistungen.",
  },
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
    description: "iWantSexNow.ch befindet sich in der Vorschauphase. Profile, Rezensionen, Preise und Nutzerkennzahlen sind Demodaten.",
  };

  return (
    <>
      <SEO title={meta.title} description={meta.description} />
      {previewFeature ? <PreviewAccess feature={previewFeature} /> : <Component {...pageProps} />}
      <div role="status" aria-label="Vorschauhinweis" className="fixed bottom-20 left-3 right-3 sm:bottom-3 sm:right-auto z-40 sm:max-w-sm rounded-xl border border-amber-400 bg-amber-100 px-3 py-2 text-xs font-semibold leading-relaxed text-amber-950 shadow-lg pointer-events-none">
        DEMO / VORSCHAU: Alle dargestellten Profile, Bilder, Bewertungen und Buchungen sind Beispieldaten. Keine echten Anfragen oder Nutzerkonten.
      </div>
      <Toaster />
    </>
  );
}
