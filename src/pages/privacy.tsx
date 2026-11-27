import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { CorporateFooter } from "@/components/CorporateFooter";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-papier text-tinte flex flex-col justify-between overflow-x-hidden">
      <SEO title="Datenschutzerklärung (Schweizer DSG) | iwantsexnow.ch" description="Informationen zum Umgang mit personenbezogenen Daten gemäss dem revidierten Schweizer Datenschutzgesetz (revDSG)." />
      <LuxuryHeader />

      <PageIntro tone="himmel" note="Was mit deinen Daten passiert" art="verified" title={<>Datenschutzerklärung (Schweizer DSG)</>}
        lead={<>Informationen zum Umgang mit personenbezogenen Daten gemäss dem revidierten Schweizer Datenschutzgesetz (revDSG).</>} />

      <main id="main" tabIndex={-1} className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        

        <div className="max-w-4xl space-y-5">
          
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-tinte">1. Grundsatz der Datensparsamkeit für Besucher</h2>
          <div className="space-y-2 text-[13px] sm:text-sm text-tinte-soft leading-relaxed">
            <p>Sie können das gesamte Verzeichnis, alle Preis- und Quellenvergleiche sowie die kontextuelle Hilfe ohne Registrierung und ohne Benutzerkonto nutzen.</p>
            <p>Es werden keine sensiblen persönlichen Vorlieben oder privaten Suchprofile an Dritte verkauft.</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-tinte">2. Volle Datenhoheit für Anbieterinnen (Selbstverwaltung & Opt-out)</h2>
          <div className="space-y-2 text-[13px] sm:text-sm text-tinte-soft leading-relaxed">
            <p>Anbieterinnen können ihren bestehenden Eintrag kostenlos übernehmen, korrigieren, pausieren oder über <a href='/report' className='text-kirsche-tief font-bold underline'>/report</a> dauerhaft entfernen und für künftige Indexierungen sperren lassen.</p>
            <p>Unterlagen im Rahmen der freiwilligen Identitätsprüfung (18+) dienen ausschliesslich der Verifikation und werden niemals öffentlich zugänglich gemacht.</p>
          </div>
        </section>
        </div>
      </main>

      <CorporateFooter light />
    </div>
  );
}
