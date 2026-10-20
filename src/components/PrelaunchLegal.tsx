import Link from "next/link";

type Variant = "privacy" | "terms";

const content: Record<Variant, {
  title: string;
  lead: string;
  sections: { heading: string; body: string }[];
}> = {
  privacy: {
    title: "Datenschutzinformationen – Vorschau",
    lead: "Diese Seite ist eine vorläufige Statusinformation, keine abschliessende Datenschutzerklärung. Der öffentliche Marktplatz ist noch nicht für echte Registrierungen oder Inserate freigegeben.",
    sections: [
      {
        heading: "Welche Funktionen sind aktuell aktiv?",
        body: "Du kannst den Entwurf ansehen. Öffentliche Registrierung, Buchungen, Nachrichten, Zahlungsfunktionen, Identitätsprüfung und Foto-Uploads sind deaktiviert. Angezeigte Personen und Bewertungen sind Demo-Beispiele."
      },
      {
        heading: "Technische Verarbeitung",
        body: "Wie bei jeder Website können beim Aufruf technische Verbindungsdaten durch Hosting- und Infrastruktur-Dienstleister verarbeitet werden. Welche konkreten Anbieter, Zwecke und Aufbewahrungsfristen gelten, wird vor der Freischaltung im vollständigen Datenschutzhinweis ausgewiesen."
      },
      {
        heading: "Was noch verbindlich dokumentiert werden muss",
        body: "Die verantwortliche Stelle und ihre Kontaktadresse, Verarbeitungszwecke, technische Dienstleister, Datenkategorien, Empfänger, Speicherdauern, Löschwege und Datenschutzrechte werden vor dem öffentlichen Produktivstart konkret benannt."
      },
      {
        heading: "Bis dahin",
        body: "Bitte über die Vorschau keine Ausweisbilder, persönlichen Nachrichten, Zahlungsdaten oder sonstigen sensiblen Daten übermitteln. Echte Profile werden nur mit nachweisbarer Einwilligung und freigegebenem Prüfprozess aufgenommen."
      }
    ]
  },
  terms: {
    title: "Nutzungsbedingungen – Vorschau",
    lead: "Hier entsteht der künftige Schweizer Vergleichsmarktplatz. Diese Information beschreibt nur die Vorbereitungsphase und ist kein fertiger Nutzungsvertrag.",
    sections: [
      {
        heading: "Kein aktiver Vermittlungsbetrieb",
        body: "Profile, Fotos, Preise, Bewertungen, vermeintliche Verfügbarkeiten und Buchungsbeispiele dienen der Darstellung des Konzepts. Es gibt derzeit keine über diese Vorschau buchbaren Personen oder angebotenen Live-Transaktionen."
      },
      {
        heading: "Keine kostenpflichtige Leistung",
        body: "Mitgliedschaften, Promotion, Geschenke, Abonnements und Preisrechner sind Produktideen oder Demo-Oberflächen. Aus der Ansicht der Vorschau entsteht kein Vertrag und keine Zahlungspflicht."
      },
      {
        heading: "Zukünftige Voraussetzungen",
        body: "Die geplante Plattform richtet sich an Erwachsene. Vor echter Freischaltung werden Alters- und Identitätsprüfung, Einwilligung, Moderation, Meldemöglichkeiten sowie die vertraglichen Rollen und das anwendbare Recht verbindlich geregelt."
      },
      {
        heading: "Nächste Version",
        body: "Verbindliche, vollständige Nutzungsbedingungen mit Betreiberangaben und Kontaktmöglichkeit werden veröffentlicht, bevor reale Konten, Inserate, Buchungen oder Zahlungen zugelassen werden."
      }
    ]
  }
};

export default function PrelaunchLegal({ variant }: { variant: Variant }) {
  const page = content[variant];
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-purple-950 px-4 py-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-300">
          iWantSexNow.ch · Entwicklungs-Vorschau · 18+
        </p>
        <h1 className="mb-5 text-3xl font-black md:text-4xl">{page.title}</h1>
        <p className="mb-8 rounded-xl border border-amber-500/50 bg-amber-950/40 p-5 text-base text-amber-100">
          {page.lead}
        </p>
        <div className="space-y-5">
          {page.sections.map((section) => (
            <section key={section.heading} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-3 text-xl font-bold">{section.heading}</h2>
              <p className="leading-relaxed text-slate-200">{section.body}</p>
            </section>
          ))}
        </div>
        <nav aria-label="Weitere Informationen" className="mt-9 flex flex-wrap gap-4 text-sm font-semibold">
          <Link className="rounded-lg border border-white/30 px-4 py-3 hover:bg-white/10" href="/">
            Startseite
          </Link>
          <Link className="rounded-lg border border-white/30 px-4 py-3 hover:bg-white/10" href="/privacy">
            Datenschutz
          </Link>
          <Link className="rounded-lg border border-white/30 px-4 py-3 hover:bg-white/10" href="/terms">
            Nutzungsbedingungen
          </Link>
        </nav>
      </div>
    </main>
  );
}
