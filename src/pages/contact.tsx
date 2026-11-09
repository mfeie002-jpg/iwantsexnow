import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-[#f2f7f6] text-[#0d1f27] flex flex-col justify-between overflow-x-hidden">
      <SEO title="Kontakt & Redaktion | iwantsexnow.ch" description="Haben Sie Fragen zu einem Prüfbericht, zur kostenlosen Profilübernahme oder ein Korrekturanliegen?" />
      <LuxuryHeader />

      <main className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#dcebe8] text-[#5a2a24] text-[11px] font-bold uppercase tracking-wider">
            <span>DIREKTER DRAHT · SCHWEIZ</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0d1f27]">Kontakt & Redaktion</h1>
          <p className="text-sm sm:text-base text-[#3d5963] leading-relaxed">Haben Sie Fragen zu einem Prüfbericht, zur kostenlosen Profilübernahme oder ein Korrekturanliegen?</p>
        </div>

        <div className="max-w-4xl space-y-5">
          
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#dcebe8] shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#0d1f27]">Schnellste Wege je nach Anliegen</h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#2d4650] leading-relaxed">
            <p>• <strong>Bestehendes Profil kostenlos übernehmen & selbst verwalten:</strong> <a href='/create-post' className='text-[#7a3028] font-bold underline'>Direkt zur Profilübernahme (/create-post) →</a></p>
            <p>• <strong>Eintrag ohne Konto korrigieren oder entfernen lassen:</strong> <a href='/report' className='text-[#7a3028] font-bold underline'>Direkt zum Meldeformular (/report) →</a></p>
            <p>• <strong>Redaktion & Portalvergleich:</strong> redaktion@iwantsexnow.ch</p>
          </div>
        </section>
        </div>
      </main>

      <CorporateFooter light />
    </div>
  );
}
