import React from "react";
import Link from "next/link";
import { BrandMark, Wordmark } from "@/components/visuals";

export function CorporateFooter({ light = false }: { light?: boolean }) {
  return (
    <footer className={"mt-16 pb-24 text-tinte md:pb-10 " + (light ? "bg-himmel/60" : "bg-white")}>
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 py-10 space-y-8">
        {/* Top Row: Brand + Provider CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b-2 border-dotted border-tinte/20">
          <Link href="/" className="flex shrink-0 items-center gap-3">
            <BrandMark size={40} />
            <div>
              <Wordmark className="text-xl text-tinte" />
              <div className="mt-1 text-xs font-medium text-tinte/70">
                Schweizer Profilverzeichnis &amp; Portalvergleich
              </div>
            </div>
          </Link>

          <Link
            href="/advertise"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-kirsche-tief underline decoration-2 underline-offset-4 hover:text-kirsche"
          >
            <span>Für Anbieter: Profil und Verfügbarkeit selbst verwalten</span>
          </Link>
        </div>

        {/* Middle Row: 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-[13px]">
          <div className="space-y-2">
            <div className="font-display text-base font-bold text-tinte">Regionen (DE / FR / IT)</div>
            <ul className="space-y-1.5 text-tinte/75">
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
            <div className="font-display text-base font-bold text-tinte">Verzeichnis & Vergleich</div>
            <ul className="space-y-1.5 text-tinte/75">
              <li><Link href="/" className="hover:underline">Alle Profile entdecken</Link></li>
              <li><Link href="/compare-escorts" className="hover:underline">Profile & Preise vergleichen</Link></li>
              <li><Link href="/rankings" className="hover:underline">Schweizer Clubs & Studios</Link></li>
              <li><Link href="/reviews" className="hover:underline">Schweizer Portalvergleich</Link></li>
              <li><Link href="/pricing" className="hover:underline">Honorar- & Konditionen-Kompass</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-display text-base font-bold text-tinte">Für Anbieterinnen</div>
            <ul className="space-y-1.5 text-tinte/75">
              <li><Link href="/advertise" className="hover:underline">Vorteile & Selbstverwaltung</Link></li>
              <li><Link href="/create-post" className="hover:underline">Bestehendes Profil übernehmen</Link></li>
              <li><Link href="/creator-dashboard" className="hover:underline">Anbieter-Cockpit öffnen</Link></li>
              <li><Link href="/verify" className="hover:underline">Identitätsprüfung (✓) beantragen</Link></li>
              <li><Link href="/report" className="hover:underline">Eintrag melden oder entfernen</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-display text-base font-bold text-tinte">Methodik & Rechtliches</div>
            <ul className="space-y-1.5 text-tinte/75">
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
        <div className="flex flex-wrap items-center justify-between gap-2 border-t-2 border-dotted border-tinte/20 pt-6 text-[11px] text-tinte/60">
          <span>© 2026 iwantsexnow.ch · Schweizer Profilverzeichnis & Portalvergleich · Zugang ausschliesslich ab 18 Jahren.</span>
          <span>Alle Quellen, Zeitstempel und Prüfkriterien sind transparent ausgewiesen.</span>
        </div>
      </div>
    </footer>
  );
}

export default CorporateFooter;
