import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#181614] flex flex-col justify-between overflow-x-hidden">
      <SEO title="Häufige Fragen (FAQ) | iwantsexnow.ch" description="Die wichtigsten Antworten zu Verfügbarkeits-Status, Preisangaben, Quellen-Zusammenführung und kostenloser Profilübernahme." />
      <LuxuryHeader />

      <main className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8DEC8] text-[#5C4722] text-[11px] font-bold uppercase tracking-wider">
            <span>ANTWORTEN FÜR BESUCHER & ANBIETERINNEN</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#181614]">Häufige Fragen (FAQ)</h1>
          <p className="text-sm sm:text-base text-[#5C554B] leading-relaxed">Die wichtigsten Antworten zu Verfügbarkeits-Status, Preisangaben, Quellen-Zusammenführung und kostenloser Profilübernahme.</p>
        </div>

        <div className="max-w-4xl space-y-5">
          
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD3] shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#181614]">Was bedeutet „Jetzt verfügbar · Bestätigt vor X Min.“?</h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#3D372E] leading-relaxed">
            <p>Dieses grüne Merkmal erscheint nur, wenn die Anbieterin ihren Status im Anbieter-Cockpit aktiv für die nächsten 4 Stunden bestätigt hat. Nach Ablauf von 4 Stunden schaltet sich die Anzeige automatisch auf neutral zurück.</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD3] shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#181614]">Wie kann ich als Anbieterin mein Profil übernehmen oder löschen?</h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#3D372E] leading-relaxed">
            <p>Klicken Sie an Ihrem Profil auf „Ist das dein Profil? Bestehendes Profil übernehmen“ oder öffnen Sie direkt <a href='/create-post' className='text-[#7A5824] font-bold underline'>/create-post</a>. Wenn Sie Ihren Eintrag entfernen lassen möchten, können Sie dies jederzeit kostenlos und ohne Login unter <a href='/report' className='text-[#7A5824] font-bold underline'>/report</a> veranlassen.</p>
          </div>
        </section>
        </div>
      </main>

      <CorporateFooter light />
    </div>
  );
}
