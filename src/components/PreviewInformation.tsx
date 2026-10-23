import Link from "next/link";

export type PreviewInformationVariant = "about" | "faq" | "safety" | "contact" | "imprint";

const information = {
  about: {
    title: "Über diese Vorschau",
    lead: "iWantSexNow.ch zeigt einen Entwurf für einen Schweizer Inserate-Marktplatz. Es gibt noch keinen aktiven Vermittlungsbetrieb.",
    sections: [
      ["Fiktive Beispiele", "Die gezeigten Namen, Fotos, Bewertungen, Preise und Aktivitätsdaten sind Designbeispiele. Sie belegen weder echte Nutzer noch geprüfte Anbieter oder verfügbare Leistungen."],
      ["Was sich ausprobieren lässt", "Die Suche und Filter arbeiten mit Beispieldaten. Ausgewählte Stadtseiten und Profilansichten zeigen mögliche Layouts. Es werden keine echten Buchungen, Nachrichten oder Zahlungen ausgeführt."],
      ["Vor einer Freischaltung", "Sichere Konten, Alters- und Profilprüfung, Einwilligungen, Moderation, echte Kontaktwege und vollständige Betreiber- und Vertragsinformationen müssen erst umgesetzt und geprüft werden."],
    ],
  },
  faq: {
    title: "Häufige Fragen zur Vorschau",
    lead: "Diese Antworten beschreiben den aktuellen Entwicklungsstand. Es werden noch keine Mitgliedschaften oder Dienstleistungen angeboten.",
    sections: [
      ["Sind die Profile echt?", "Es sind keine öffentlichen Profile veröffentlicht. Die bisherigen Beispieldaten wurden entfernt."],
      ["Kann ich mich registrieren oder Nachrichten senden?", "Registrierung, Anmeldung, Nachrichten, Inserate und Foto-Uploads sind noch nicht freigeschaltet. Bitte keine persönlichen Daten, Passwörter oder Ausweisbilder eingeben."],
      ["Kann ich buchen, Premium kaufen oder einen Newsletter abonnieren?", "Nein. Buchungen, Zahlungen, Premium, Promotion und Newsletter sind nicht aktiv. Die Vorschau nimmt keine Bestellungen oder Anmeldungen entgegen."],
      ["Gibt es einen Support-Chat?", "Es gibt noch keinen betreuten Chat und keine bestätigte Supportadresse. Es werden keine Supportnachrichten angenommen und keine Antwortzeiten zugesagt."],
      ["Was machen die Filter?", "Die öffentliche Suche ist noch nicht freigeschaltet. Es werden keine Profile oder Kontaktdaten bereitgestellt."],
    ],
  },
  safety: {
    title: "Sicherheit in der Vorschau",
    lead: "Die Vorschau ist kein geprüfter Vermittlungsdienst. Es gibt keine echten Profile, Buchungen oder aktive Meldestelle.",
    sections: [
      ["Keine Echtheitsprüfung", "Stockfotos, Beispielnamen, Demo-Sterne und Statusanzeigen sind keine Identitätsprüfung, Sicherheitsgarantie oder Empfehlung einer Person."],
      ["Keine sensiblen Daten eingeben", "Bitte keine Passwörter, Zahlungsdaten, Ausweisbilder oder privaten Nachrichten übermitteln. Registrierung, Uploads und Kontaktaktionen bleiben deaktiviert."],
      ["Noch kein Melde- oder Supportdienst", "Es wird keine Meldung an ein Moderationsteam zugestellt. Ein echter Meldeweg mit Zuständigkeit und Kontaktinformation muss vor einer Freischaltung eingerichtet werden."],
    ],
  },
  contact: {
    title: "Kontakt und Support – in Vorbereitung",
    lead: "Für diese Vorschau ist noch kein betreuter Kontakt- oder Supportkanal freigeschaltet.",
    sections: [
      ["Keine Nachrichtenübermittlung", "Diese Seite nimmt keine Anfragen, Buchungen oder Newsletter-Anmeldungen entgegen. Es gibt keinen Live-Chat und keine zugesagte Antwortzeit."],
      ["Kontaktangaben folgen", "Eine bestätigte Kontaktadresse und die verantwortliche Stelle werden vor der Aufnahme eines echten Betriebs veröffentlicht. Bitte keine persönlichen oder sensiblen Daten über die Vorschau übermitteln."],
    ],
  },
  imprint: {
    title: "Betreiberangaben – in Vorbereitung",
    lead: "Diese Statusseite ist noch kein vollständiges Impressum. Die verantwortliche Stelle und ihre bestätigten Kontaktangaben sind noch nicht veröffentlicht.",
    sections: [
      ["Aktueller Stand", "Die Website zeigt ausschliesslich eine Entwicklungs-Vorschau. Es werden keine realen Inserate, Buchungen, Mitgliedschaften oder Zahlungen angeboten."],
      ["Vor dem Produktivstart", "Vollständige, geprüfte Betreiber- und Kontaktangaben müssen vor der Freischaltung echter Konten oder Dienstleistungen vorliegen. Es werden hier keine Namen, Adressen oder Zuständigkeiten als Platzhalter erfunden."],
    ],
  },
} as const;

export default function PreviewInformation({ variant }: { variant: PreviewInformationVariant }) {
  const page = information[variant];
  return (
    <main className="min-h-screen bg-slate-950 px-4 pb-40 pt-16 text-white">
      <div className="mx-auto max-w-3xl">
        <p className="mb-3 text-xs font-bold uppercase tracking-widest text-amber-300">iWantSexNow.ch · Entwicklungs-Vorschau · 18+</p>
        <h1 className="mb-5 text-3xl font-black md:text-4xl">{page.title}</h1>
        <p className="mb-8 rounded-xl border border-amber-500/50 bg-amber-950/40 p-5 text-amber-100">{page.lead}</p>
        <div className="space-y-5">
          {page.sections.map(([title, body]) => (
            <section key={title} className="rounded-xl border border-white/10 bg-white/5 p-5">
              <h2 className="mb-3 text-xl font-bold">{title}</h2>
              <p className="leading-relaxed text-slate-200">{body}</p>
            </section>
          ))}
        </div>
        <nav aria-label="Weitere Informationen" className="mt-9 flex flex-wrap gap-4 text-sm font-semibold">
          {[
            ["/", "Startseite"], ["/faq", "Fragen zur Vorschau"], ["/contact", "Kontaktstatus"],
            ["/imprint", "Betreiberangaben"], ["/privacy", "Datenschutz"], ["/terms", "Nutzungsbedingungen"],
          ].filter(([href]) => href !== `/${variant}`).map(([href, label]) => (
            <Link key={href} href={href} className="rounded-lg border border-white/30 px-4 py-3 hover:bg-white/10">{label}</Link>
          ))}
        </nav>
      </div>
    </main>
  );
}
