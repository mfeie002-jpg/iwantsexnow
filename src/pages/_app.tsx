import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { ShieldCheck, Sparkles } from "lucide-react";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import clubsData from "@/data/swiss-establishments-vault.json";

const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 108;

function PenthouseFooter() {
  return (
    <footer className="relative border-t border-[#C8A97E]/20 bg-[#090706] pb-28 pt-12 text-xs lg:pb-8">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#DEC393]/55 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
          <div>
            <div className="font-serif text-lg tracking-[0.045em] text-[#F2EADF]">
              IWANTSEXNOW
              <span className="text-[#C8A97E]">.CH</span>
            </div>
            <div className="mt-2 font-mono text-[8px] uppercase tracking-[0.2em] text-[#756A5D]">
              Private Swiss Directory · Est. Zürich
            </div>
            <p className="mt-4 max-w-sm text-[11px] font-light leading-6 text-[#8F8476]">
              Das unabhängige Schweizer Direktverzeichnis für Escorts,
              Girlfriend Experience, Tantra-Studios und {TOTAL_CLUBS} stationäre
              Clubs. 0% Buchungsprovision und 80% Creator-Anteil im
              Paid-Vault.
            </p>

            <div className="mt-5 inline-flex items-start gap-2.5 border-l border-[#C8A97E]/45 pl-3">
              <ShieldCheck
                size={16}
                strokeWidth={1.4}
                className="mt-0.5 shrink-0 text-[#C8A97E]"
              />
              <div>
                <div className="font-mono text-[9px] uppercase tracking-[0.1em] text-[#D2B98D]">
                  CHF-Transparenzsiegel
                </div>
                <div className="mt-1 text-[9px] leading-4 text-[#746A5E]">
                  30m/60m Honorare · Direkter +41 Kontakt · 0% Agentur
                </div>
              </div>
            </div>
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#C8A97E]">
              Kantons-Direktlinks
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10px]">
              <Link className="footer-link" href="/orte/zug">
                Zug & Baar <span className="font-mono">ZG</span>
              </Link>
              <Link className="footer-link" href="/escort-zurich">
                Zürich City <span className="font-mono">ZH</span>
              </Link>
              <Link className="footer-link" href="/orte/luzern">
                Luzern <span className="font-mono">LU</span>
              </Link>
              <Link className="footer-link" href="/orte/baden">
                Baden / Aargau <span className="font-mono">AG</span>
              </Link>
              <Link className="footer-link" href="/escort-basel">
                Basel-Stadt <span className="font-mono">BS</span>
              </Link>
              <Link className="footer-link" href="/escort-bern">
                Bern <span className="font-mono">BE</span>
              </Link>
              <Link className="footer-link" href="/orte/st-gallen">
                St. Gallen <span className="font-mono">SG</span>
              </Link>
              <Link className="footer-link" href="/escort-geneva">
                Genève <span className="font-mono">GE</span>
              </Link>
              <Link className="footer-link" href="/orte/lausanne">
                Lausanne <span className="font-mono">VD</span>
              </Link>
              <Link className="footer-link" href="/escort-lugano">
                Lugano <span className="font-mono">TI</span>
              </Link>
            </div>
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#C8A97E]">
              Plattform & KI-Werkzeuge
            </div>
            <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2.5 text-[10px]">
              <Link className="footer-link" href="/search">
                Deep-Filter Suche
              </Link>
              <Link
                className="inline-flex items-center gap-1 text-[#D2B98D] transition hover:text-[#DEC393]"
                href="/fantasy-preview"
              >
                <Sparkles size={10} />
                Avatar & Preview
              </Link>
              <Link className="footer-link" href="/matches">
                10s Quick-Matcher
              </Link>
              <Link className="footer-link" href="/compare-escorts">
                4-Profil Vergleich
              </Link>
              <Link className="footer-link" href="/rankings">
                Top-50 Ranking
              </Link>
              <Link className="footer-link" href="/clubs">
                {TOTAL_CLUBS} Schweizer Clubs
              </Link>
              <Link className="footer-link" href="/pricing">
                CHF-Honorar-Kompass
              </Link>
              <Link className="footer-link" href="/hotels">
                Outcall-Hotel-Guide
              </Link>
              <Link className="footer-link" href="/reviews">
                Portal-Prüfberichte
              </Link>
              <Link className="footer-link" href="/stories">
                4h Live-Stories
              </Link>
            </div>
          </div>

          <div>
            <div className="font-mono text-[9px] uppercase tracking-[0.17em] text-[#C8A97E]">
              Anbieterinnen & Rechtliches
            </div>
            <div className="mt-4 flex flex-col gap-2.5 text-[10px]">
              <Link
                className="brass-button inline-flex min-h-[34px] w-fit items-center rounded-[4px] px-3 text-[9px] font-semibold uppercase tracking-[0.06em]"
                href="/register"
              >
                <span className="relative z-[1]">
                  + Profil eintragen · 0%
                </span>
              </Link>
              <Link className="footer-link" href="/boost">
                Kantonaler 24h Top-Spot Boost
              </Link>
              <Link className="footer-link" href="/safety">
                Sicherheit, Schutz & 18+ Richtlinien
              </Link>
              <Link
                className="bordeaux-button mt-2 inline-flex min-h-[34px] w-fit items-center rounded-[4px] px-3 text-[9px] font-medium"
                href="/report"
              >
                1-Klick Opt-Out / Profil melden
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 border-t border-[#C8A97E]/10 pt-5 text-[9px] text-[#6E6458] sm:flex-row sm:items-center sm:justify-between">
          <div className="font-mono uppercase tracking-[0.08em]">
            © {new Date().getFullYear()} IWANTSEXNOW.CH · Schweiz · 18+
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            <Link className="footer-link" href="/imprint">
              Impressum
            </Link>
            <Link className="footer-link" href="/privacy">
              Datenschutz
            </Link>
            <Link className="footer-link" href="/terms">
              AGB
            </Link>
            <Link className="footer-link" href="/report">
              Opt-Out
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#070606] text-[#F2EADF]">
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
      <PenthouseFooter />
      <MobileBottomNav />
    </div>
  );
}