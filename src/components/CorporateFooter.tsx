import React from "react";
import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/visuals";
import { ArrowRight } from "lucide-react";

export function CorporateFooter({ light = false }: { light?: boolean }) {
  return (
    <footer
      className={
        light
          ? "mt-16 border-t border-[#c3d4d1] bg-[#dcebe8] text-[#0b2229] pb-24 md:pb-10"
          : "mt-16 border-t border-[#1d4350] bg-[#0a1a21] text-white pb-24 md:pb-10"
      }
    >
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 py-10 space-y-8">
        {/* Top Row: Brand + Provider CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-current/10">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <BrandMark size={38} />
            <div>
              <Wordmark className={light ? "text-lg text-[#0b2229]" : "text-lg text-[#f2f7f6]"} />
              <div className={light ? "mt-1 text-xs font-medium text-[#3d5963]" : "mt-1 text-xs font-medium text-[#9fb8b5]"}>
                Schweizer Profilverzeichnis &amp; Portalvergleich
              </div>
            </div>
          </Link>

          <Link
            href="/advertise"
            className={(light ? "text-[#a8382e] " : "text-[#ffb067] ") + "inline-flex items-center gap-1.5 text-sm font-bold hover:underline"}
          >
            <span>Für Anbieter: Profil und Verfügbarkeit selbst verwalten</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Middle Row: 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="space-y-2">
            <div className={light ? "text-sm font-bold text-[#a8382e]" : "text-sm font-bold text-[#ffb067]"}>Regionen (DE / FR / IT)</div>
            <ul className={light ? "space-y-1.5 text-[#3d5963]" : "space-y-1.5 text-gray-400"}>
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
            <div className={light ? "text-sm font-bold text-[#a8382e]" : "text-sm font-bold text-[#ffb067]"}>Verzeichnis & Vergleich</div>
            <ul className={light ? "space-y-1.5 text-[#3d5963]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/" className="hover:underline">Alle Profile entdecken</Link></li>
              <li><Link href="/compare-escorts" className="hover:underline">Profile & Preise vergleichen</Link></li>
              <li><Link href="/rankings" className="hover:underline">Schweizer Clubs & Studios</Link></li>
              <li><Link href="/reviews" className="hover:underline">Schweizer Portalvergleich</Link></li>
              <li><Link href="/pricing" className="hover:underline">Honorar- & Konditionen-Kompass</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className={light ? "text-sm font-bold text-[#a8382e]" : "text-sm font-bold text-[#ffb067]"}>Für Anbieterinnen</div>
            <ul className={light ? "space-y-1.5 text-[#3d5963]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/advertise" className="hover:underline">Vorteile & Selbstverwaltung</Link></li>
              <li><Link href="/create-post" className="hover:underline">Bestehendes Profil übernehmen</Link></li>
              <li><Link href="/creator-dashboard" className="hover:underline">Anbieter-Cockpit öffnen</Link></li>
              <li><Link href="/verify" className="hover:underline">Identitätsprüfung (✓) beantragen</Link></li>
              <li><Link href="/report" className="hover:underline">Eintrag melden oder entfernen</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className={light ? "text-sm font-bold text-[#a8382e]" : "text-sm font-bold text-[#ffb067]"}>Methodik & Rechtliches</div>
            <ul className={light ? "space-y-1.5 text-[#3d5963]" : "space-y-1.5 text-gray-400"}>
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
        <div className={light ? "pt-6 border-t border-[#dcebe8] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#5d7a82]" : "pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500"}>
          <span>© 2026 iwantsexnow.ch · Schweizer Profilverzeichnis & Portalvergleich · Zugang ausschliesslich ab 18 Jahren.</span>
          <span>Alle Quellen, Zeitstempel und Prüfkriterien sind transparent ausgewiesen.</span>
        </div>
      </div>
    </footer>
  );
}

export default CorporateFooter;
