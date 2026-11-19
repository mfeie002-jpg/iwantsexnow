import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-papier text-tinte flex flex-col justify-between overflow-x-hidden">
      <SEO title="Kontakt & Redaktion | iwantsexnow.ch" description="Haben Sie Fragen zu einem Prüfbericht, zur kostenlosen Profilübernahme oder ein Korrekturanliegen?" />
      <LuxuryHeader />

      <PageIntro tone="minze" note="Wir antworten selbst" art="none" title={<>Kontakt & Redaktion</>}
        lead={<>Haben Sie Fragen zu einem Prüfbericht, zur kostenlosen Profilübernahme oder ein Korrekturanliegen?</>} />

      <main className="essay">
        

        <div className="max-w-4xl space-y-5">
          
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-tinte">Schnellste Wege je nach Anliegen</h2>
          <div className="space-y-2 text-[13px] sm:text-sm text-tinte-soft leading-relaxed">
            <p>• <strong>Bestehendes Profil kostenlos übernehmen & selbst verwalten:</strong> <a href='/create-post' className='text-kirsche-tief font-bold underline'>Direkt zur Profilübernahme (/create-post) →</a></p>
            <p>• <strong>Eintrag ohne Konto korrigieren oder entfernen lassen:</strong> <a href='/report' className='text-kirsche-tief font-bold underline'>Direkt zum Meldeformular (/report) →</a></p>
            <p>• <strong>Redaktion & Portalvergleich:</strong> redaktion@iwantsexnow.ch</p>
          </div>
        </section>
        </div>
      </main>
</div>
  );
}
