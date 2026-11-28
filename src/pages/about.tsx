import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-papier text-tinte flex flex-col justify-between overflow-x-hidden">
      <SEO title="Über uns & Prüf-Methodik | iwantsexnow.ch" description="Warum wir auf nachvollziehbare Zeitstempel, offengelegte Quellen und ehrliche Preis-Einordnung setzen." />
      <LuxuryHeader />

      <PageIntro tone="butter" note="Wer wir sind" art="canton:ch" title={<>Über uns & Prüf-Methodik</>}
        lead={<>Warum wir auf nachvollziehbare Zeitstempel, offengelegte Quellen und ehrliche Preis-Einordnung setzen.</>} />

      <main className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        

        <div className="max-w-4xl space-y-5">
          
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-tinte">1. Was uns von klassischen Inserate-Portalen unterscheidet</h2>
          <div className="space-y-2 text-[13px] sm:text-sm text-tinte-soft leading-relaxed">
            <p>Auf herkömmlichen Portalen ist für Besucher oft unklar, ob ein grüner Punkt tatsächlich aktuelle Verfügbarkeit bedeutet, ob sich ein genannter Preis auf 30 oder 60 Minuten bezieht und auf wie vielen Plattformen dasselbe Profil parallel inseriert.</p>
            <p>Deshalb zeigt iwantsexnow.ch bei jedem Eintrag offen die Herkunft ('Selbst verwaltet' vs. 'Externe Quelle'), den exakten Bestätigungs-Zeitstempel (4-Stunden-Fenster) und die zugeordnete Dauer beim Preis.</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-tinte">2. Unabhängige Prüfkriterien im Portalvergleich</h2>
          <div className="space-y-2 text-[13px] sm:text-sm text-tinte-soft leading-relaxed">
            <p>In unserem <a href='/reviews' className='text-kirsche-tief font-bold underline'>Schweizer Portalvergleich (/reviews)</a> dokumentieren wir für jedes untersuchte Portal die Quelle, die geprüften Kriterien sowie noch offene Fragen.</p>
          </div>
        </section>
        </div>
      </main>
    </div>
  );
}
