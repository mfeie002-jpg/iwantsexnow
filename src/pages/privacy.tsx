import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-[#f2f7f6] text-[#0d1f27] flex flex-col justify-between overflow-x-hidden">
      <SEO title="Datenschutzerklärung (Schweizer DSG) | iwantsexnow.ch" description="Informationen zum Umgang mit personenbezogenen Daten gemäss dem revidierten Schweizer Datenschutzgesetz (revDSG)." />
      <LuxuryHeader />

      <main className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#dcebe8] text-[#5a2a24] text-[11px] font-bold uppercase tracking-wider">
            <span>DATENSCHUTZ & DATENSPARSAMKEIT</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#0d1f27]">Datenschutzerklärung (Schweizer DSG)</h1>
          <p className="text-sm sm:text-base text-[#3d5963] leading-relaxed">Informationen zum Umgang mit personenbezogenen Daten gemäss dem revidierten Schweizer Datenschutzgesetz (revDSG).</p>
        </div>

        <div className="max-w-4xl space-y-5">
          
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#dcebe8] shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#0d1f27]">1. Grundsatz der Datensparsamkeit für Besucher</h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#2d4650] leading-relaxed">
            <p>Sie können das gesamte Verzeichnis, alle Preis- und Quellenvergleiche sowie die kontextuelle Hilfe ohne Registrierung und ohne Benutzerkonto nutzen.</p>
            <p>Es werden keine sensiblen persönlichen Vorlieben oder privaten Suchprofile an Dritte verkauft.</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#dcebe8] shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#0d1f27]">2. Volle Datenhoheit für Anbieterinnen (Selbstverwaltung & Opt-out)</h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#2d4650] leading-relaxed">
            <p>Anbieterinnen können ihren bestehenden Eintrag kostenlos übernehmen, korrigieren, pausieren oder über <a href='/report' className='text-[#7a3028] font-bold underline'>/report</a> dauerhaft entfernen und für künftige Indexierungen sperren lassen.</p>
            <p>Unterlagen im Rahmen der freiwilligen Identitätsprüfung (18+) dienen ausschliesslich der Verifikation und werden niemals öffentlich zugänglich gemacht.</p>
          </div>
        </section>
        </div>
      </main>

      <CorporateFooter light />
    </div>
  );
}
