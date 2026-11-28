import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-papier text-tinte flex flex-col justify-between overflow-x-hidden">
      <SEO title="Häufige Fragen (FAQ) | iwantsexnow.ch" description="Die wichtigsten Antworten zu Verfügbarkeits-Status, Preisangaben, Quellen-Zusammenführung und kostenloser Profilübernahme." />
      <LuxuryHeader />

      <PageIntro tone="flieder" note="Kurz erklärt" art="none" title={<>Häufige Fragen (FAQ)</>}
        lead={<>Die wichtigsten Antworten zu Verfügbarkeits-Status, Preisangaben, Quellen-Zusammenführung und kostenloser Profilübernahme.</>} />

      <main className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        

        <div className="max-w-4xl space-y-5">
          
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-tinte">Was bedeutet „Jetzt verfügbar · Bestätigt vor X Min.“?</h2>
          <div className="space-y-2 text-[13px] sm:text-sm text-tinte-soft leading-relaxed">
            <p>Dieses grüne Merkmal erscheint nur, wenn die Anbieterin ihren Status im Anbieter-Cockpit aktiv für die nächsten 4 Stunden bestätigt hat. Nach Ablauf von 4 Stunden schaltet sich die Anzeige automatisch auf neutral zurück.</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-tinte">Wie kann ich als Anbieterin mein Profil übernehmen oder löschen?</h2>
          <div className="space-y-2 text-[13px] sm:text-sm text-tinte-soft leading-relaxed">
            <p>Klicken Sie an Ihrem Profil auf „Ist das dein Profil? Bestehendes Profil übernehmen“ oder öffnen Sie direkt <a href='/create-post' className='text-kirsche-tief font-bold underline'>/create-post</a>. Wenn Sie Ihren Eintrag entfernen lassen möchten, können Sie dies jederzeit kostenlos und ohne Login unter <a href='/report' className='text-kirsche-tief font-bold underline'>/report</a> veranlassen.</p>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}
