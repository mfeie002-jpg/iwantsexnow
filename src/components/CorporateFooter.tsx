import React from "react";
import Link from "next/link";
import { StencilSerifX } from "@/components/BrandLogo";
import { ArrowRight } from "lucide-react";

export function CorporateFooter({ light = false }: { light?: boolean }) {
  return (
    <footer
      className={
        light
          ? "mt-16 border-t border-[#E6DFD3] bg-[#EFECE4] text-[#181614] pb-24 md:pb-10"
          : "mt-16 border-t border-white/10 bg-[#0E1015] text-white pb-24 md:pb-10"
      }
    >
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 py-10 space-y-8">
        {/* Top Row: Brand + Provider CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-current/10">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#1A1E29] border border-[#C6A574]/50 flex items-center justify-center">
              <StencilSerifX color="#C6A574" className="w-4 h-3.5" />
            </div>
            <div>
              <div className="text-base font-serif font-bold tracking-tight flex items-baseline">
                <span>iwantse</span>
                <StencilSerifX color="#C6A574" className="w-[13px] h-[11px] mx-[0.5px] translate-y-[1px]" />
                <span>now.ch</span>
              </div>
              <div className={light ? "text-[10px] uppercase tracking-widest text-[#6E665B]" : "text-[10px] uppercase tracking-widest text-gray-400"}>
                Schweizer Profilverzeichnis & Portalvergleich
              </div>
            </div>
          </Link>

          <Link
            href="/advertise"
            className="text-xs sm:text-sm font-bold text-[#C6A574] hover:underline inline-flex items-center gap-1.5"
          >
            <span>Für Anbieter: Profil und Verfügbarkeit selbst verwalten</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Middle Row: 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#C6A574]">Regionen (DE / FR / IT)</div>
            <ul className={light ? "space-y-1.5 text-[#5C554B]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/escort-zurich" className="hover:underline">Zürich (ZH)</Link></li>
              <li><Link href="/orte/cham" className="hover:underline">Zug & Cham (ZG)</Link></li>
              <li><Link href="/escort-basel" className="hover:underline">Basel (BS/BL)</Link></li>
              <li><Link href="/escort-bern" className="hover:underline">Bern (BE)</Link></li>
              <li><Link href="/escort-geneva" className="hover:underline">Genève (GE · FR)</Link></li>
              <li><Link href="/escort-lausanne" className="hover:underline">Lausanne & Vaud (VD · FR)</Link></li>
              <li><Link href="/escort-lugano" className="hover:underline">Lugano & Ticino (TI · IT)</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#C6A574]">Verzeichnis & Vergleich</div>
            <ul className={light ? "space-y-1.5 text-[#5C554B]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/" className="hover:underline">Alle Profile entdecken</Link></li>
              <li><Link href="/compare-escorts" className="hover:underline">Profile & Preise vergleichen</Link></li>
              <li><Link href="/rankings" className="hover:underline">Schweizer Clubs & Studios</Link></li>
              <li><Link href="/reviews" className="hover:underline">Schweizer Portalvergleich</Link></li>
              <li><Link href="/pricing" className="hover:underline">Honorar- & Konditionen-Kompass</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#C6A574]">Für Anbieterinnen</div>
            <ul className={light ? "space-y-1.5 text-[#5C554B]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/advertise" className="hover:underline">Vorteile & Selbstverwaltung</Link></li>
              <li><Link href="/create-post" className="hover:underline">Bestehendes Profil übernehmen</Link></li>
              <li><Link href="/creator-dashboard" className="hover:underline">Anbieter-Cockpit öffnen</Link></li>
              <li><Link href="/verify" className="hover:underline">Identitätsprüfung (✓) beantragen</Link></li>
              <li><Link href="/report" className="hover:underline">Eintrag melden oder entfernen</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#C6A574]">Methodik & Rechtliches</div>
            <ul className={light ? "space-y-1.5 text-[#5C554B]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/safety" className="hover:underline">Prüfkriterien & Sicherheit</Link></li>
              <li><Link href="/about" className="hover:underline">Über uns & Methodik</Link></li>
              <li><Link href="/faq" className="hover:underline">Häufige Fragen (FAQ)</Link></li>
              <li><Link href="/contact" className="hover:underline">Kontakt & Redaktion</Link></li>
              <li><Link href="/imprint" className="hover:underline">Impressum</Link></li>
              <li><Link href="/privacy" className="hover:underline">Datenschutz (DSG Schweiz)</Link></li>
              <li><Link href="/terms" className="hover:underline">Nutzungsbedingungen (AGB)</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={light ? "pt-6 border-t border-[#E6DFD3] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6E665B]" : "pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500"}>
          <span>© 2026 iwantsexnow.ch · Schweizer Profilverzeichnis & Portalvergleich · Zugang ausschliesslich ab 18 Jahren.</span>
          <span>Alle Quellen, Zeitstempel und Prüfkriterien sind transparent ausgewiesen.</span>
        </div>
      </div>
    </footer>
  );
}

export default CorporateFooter;
