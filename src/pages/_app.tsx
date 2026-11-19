import "@/styles/globals.css";
import { DiscreetEffect } from "@/lib/discreet";
import type { AppProps } from "next/app";
import Link from "next/link";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import clubsData from "@/data/swiss-establishments-vault.json";

const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 108;

function PenthouseFooter() {
  return (
    <footer className="border-t border-[#3d2231] bg-[#150810] px-4 pb-32 pt-14 sm:px-6 lg:pb-12">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="font-serif text-3xl text-[#fbf1ec]">
              iWantSexNow<span className="text-[#e8c98a]">.ch</span>
            </div>
            <p className="mt-3 max-w-xs text-[15px] leading-relaxed text-[#cdb5be]">
              Eine Suche für die ganze Schweiz. Vergleichen und direkt buchen, ohne Provision.
            </p>
          </div>

          <div className="grid content-start gap-2 text-[15px]">
            <div className="mb-1 font-semibold text-[#fbf1ec]">Entdecken</div>
            <Link className="footer-link" href="/">Profile</Link>
            <Link className="footer-link" href="/#staedte">Städte</Link>
            <Link className="footer-link" href="/clubs">{TOTAL_CLUBS} Clubs und Studios</Link>
            <Link className="footer-link" href="/favorites">Merkliste</Link>
          </div>

          <div className="grid content-start gap-2 text-[15px]">
            <div className="mb-1 font-semibold text-[#fbf1ec]">Gut zu wissen</div>
            <Link className="footer-link" href="/how-it-works">So funktioniert&apos;s</Link>
            <Link className="footer-link" href="/safety">Sicherheit</Link>
            <Link className="footer-link" href="/faq">Fragen und Antworten</Link>
            <Link className="footer-link" href="/report">Etwas melden</Link>
          </div>

          <div className="grid content-start gap-2 text-[15px]">
            <div className="mb-1 font-semibold text-[#fbf1ec]">Für Anbieterinnen</div>
            <Link className="footer-link" href="/advertise">Inserieren</Link>
            <Link className="footer-link" href="/register">Profil eintragen</Link>
            <Link className="footer-link" href="/boost">Mehr Sichtbarkeit</Link>
            <Link className="footer-link" href="/contact">Kontakt</Link>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#3d2231] pt-6 text-[15px] text-[#cdb5be] sm:flex-row sm:items-center sm:justify-between">
          <div>© {new Date().getFullYear()} iWantSexNow.ch · Schweiz · nur für Erwachsene ab 18</div>
          <div className="flex flex-wrap gap-x-6 gap-y-2">
            <Link className="footer-link" href="/imprint">Impressum</Link>
            <Link className="footer-link" href="/privacy">Datenschutz</Link>
            <Link className="footer-link" href="/terms">AGB</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#150810] text-[#fbf1ec]">
      <div className="flex-1">
        <DiscreetEffect />
        <Component {...pageProps} />
      </div>
      <PenthouseFooter />
      <MobileBottomNav />
    </div>
  );
}