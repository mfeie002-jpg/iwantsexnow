import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { CorporateFooter } from "@/components/CorporateFooter";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-papier text-tinte flex flex-col justify-between overflow-x-hidden">
      <SEO title="Impressum & Betreiberangaben | iwantsexnow.ch" description="Transparente Angaben zum Betrieb des Schweizer Profilverzeichnisses und Portalvergleichs iwantsexnow.ch." />
      <LuxuryHeader />

      <PageIntro tone="himmel" note="Das Kleingedruckte, lesbar" art="none" title={<>Impressum & Betreiberangaben</>}
        lead={<>Transparente Angaben zum Betrieb des Schweizer Profilverzeichnisses und Portalvergleichs iwantsexnow.ch.</>} />

      <main className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        

        <div className="max-w-4xl space-y-5">
          
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-tinte">1. Funktion der Plattform</h2>
          <div className="space-y-2 text-[13px] sm:text-sm text-tinte-soft leading-relaxed">
            <p>iwantsexnow.ch ist ein unabhängiges Schweizer Online-Verzeichnis und Vergleichsportal für Erwachsene (18+). Wir sind keine Escort-Agentur, kein Studio-Betreiber und vermitteln keine Dienstleistungen auf eigene Rechnung.</p>
            <p>Wir stellen technische Werkzeuge zur Verfügung, mit denen Anbieterinnen ihre eigenen Profile kostenlos verwalten und Suchende öffentlich zugängliche Angebote und Portale nach transparenten Kriterien vergleichen können.</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-tinte">2. Kontakt für Redaktion, Behörden & Widersprüche</h2>
          <div className="space-y-2 text-[13px] sm:text-sm text-tinte-soft leading-relaxed">
            <p>Für Korrekturwünsche, Urheberrechts-Meldungen oder die sofortige Entfernung eines Eintrags ohne Kontopflicht nutzen Sie bitte direkt unser <a href='/report' className='text-kirsche-tief font-bold underline'>Melde- & Löschformular (/report)</a>.</p>
            <p>E-Mail-Kontakt: compliance@iwantsexnow.ch · Gerichtsstand und anwendbares Recht: Schweiz.</p>
          </div>
        </section>
        </div>
      </main>

      <CorporateFooter light />
    </div>
  );
}
