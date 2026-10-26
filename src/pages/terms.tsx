import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#181614] flex flex-col justify-between overflow-x-hidden">
      <SEO title="Nutzungsbedingungen (AGB) | iwantsexnow.ch" description="Grundregeln für die Nutzung des Schweizer Profilverzeichnisses und Portalvergleichs." />
      <LuxuryHeader />

      <main className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8DEC8] text-[#5C4722] text-[11px] font-bold uppercase tracking-wider">
            <span>RICHTLINIEN & EINVERNEHMLICHKEIT · 18+</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#181614]">Nutzungsbedingungen (AGB)</h1>
          <p className="text-sm sm:text-base text-[#5C554B] leading-relaxed">Grundregeln für die Nutzung des Schweizer Profilverzeichnisses und Portalvergleichs.</p>
        </div>

        <div className="max-w-4xl space-y-5">
          
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD3] shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#181614]">1. Ausschliesslicher Zugang für Volljährige (18+)</h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#3D372E] leading-relaxed">
            <p>Der Zugriff auf iwantsexnow.ch sowie das Anlegen oder Übernehmen eines Anbieterprofils ist ausnahmslos volljährigen Personen ab 18 Jahren gestattet.</p>
          </div>
        </section>

        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD3] shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#181614]">2. Trennung von Plattform und individuellen Vereinbarungen</h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#3D372E] leading-relaxed">
            <p>Alle auf Profilkarten genannten Preise, Zeiteinheiten (z.B. 60 Min. vs. 30 Min.) und Verfügbarkeitsangaben stammen aus dem jeweiligen Anbieterprofil oder dem ausgewiesenen Ursprungsinserat. Etwaige Vereinbarungen kommen ausschliesslich direkt zwischen den beteiligten Erwachsenen zustande.</p>
          </div>
        </section>
        </div>
      </main>

      <CorporateFooter light />
    </div>
  );
}
