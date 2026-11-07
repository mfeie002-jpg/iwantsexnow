import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import { ShieldCheck, Crown } from "lucide-react";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#070606] text-[#F5EFE6]">
      <div className="flex-1">
        <Component {...pageProps} />
      </div>

      {/* Globaler Penthouse-Footer — strikt am unteren Seitenende */}
      <footer
        style={{
          background: "linear-gradient(180deg, #0C0908 0%, #050404 100%)",
        }}
        className="border-t border-[#C8A97E]/30 py-12 px-4 sm:px-6 mt-20 pb-28 lg:pb-12"
      >
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-[#C8A97E]/20">
            <div className="flex items-center gap-3">
              <div className="brass-3d w-8 h-8 rounded-lg flex items-center justify-center">
                <Crown size={15} className="text-[#191105]" />
              </div>
              <div>
                <div className="text-base font-serif font-bold tracking-[0.16em] text-[#EAD2AA]">
                  IWANTSEXNOW.CH
                </div>
                <div className="text-[10px] font-mono tracking-[0.2em] text-[#9E8C74] uppercase">
                  SWISS PRIVATE DIRECTORY · DIRECT +41 ACCESS
                </div>
              </div>
            </div>
            <SwissDoorplate state="FREI" roomNumber="CH-INDEX" customLabel="2'529 DOSSIERS · 305 CLUBS" size="sm" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-[#B6A48E]">
            <div className="space-y-3">
              <div className="text-[#EAD2AA] font-mono font-bold uppercase tracking-[0.18em] text-[11px]">
                Das Schweizer Direkt-Prinzip
              </div>
              <p className="leading-relaxed text-[11px]">
                Unabhängiges Schweizer Luxus- und Direktverzeichnis für verifizierte Escorts, Girlfriend Experience, Tantra-Ateliers und 305 stationäre Etablissements. 0 % Vermittlungsprovision und 80 % Creator-Erlösanteil.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] font-mono text-emerald-400 font-bold pt-1">
                <ShieldCheck size={14} />
                <span>100 % CHF-HONORAR-TRANSPARENZ</span>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-[#EAD2AA] font-mono font-bold uppercase tracking-[0.18em] text-[11px]">
                Schweizer Fokus-Kantone
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <Link className="hover:text-[#EAD2AA] transition" href="/orte/zug">Zug & Baar (ZG)</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/escort-zurich">Zürich City (ZH)</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/orte/luzern">Luzern (LU)</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/orte/baden">Baden / Aargau (AG)</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/escort-basel">Basel-Stadt (BS)</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/escort-bern">Bern (BE)</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/escort-geneva">Genève (GE)</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/escort-lugano">Lugano (TI)</Link>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-[#EAD2AA] font-mono font-bold uppercase tracking-[0.18em] text-[11px]">
                Concierge & KI-Module
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <Link className="hover:text-[#EAD2AA] transition" href="/search">Deep-Filter Suche</Link>
                <Link className="text-[#DEC393] font-bold hover:underline" href="/fantasy-preview">🔮 Voice & Preview</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/compare-escorts">4-Suiten Vergleich</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/rankings">Top-50 Kuratierung</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/clubs">305 Schweizer Clubs</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/pricing">CHF-Honorar-Kompass</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/hotels">Diskrete Day-Use Hotels</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/reviews">Portal-Prüfberichte</Link>
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="text-[#EAD2AA] font-mono font-bold uppercase tracking-[0.18em] text-[11px]">
                Für Anbieterinnen & Recht (CH-DSG)
              </div>
              <div className="flex flex-col gap-1.5 text-[11px]">
                <Link className="text-[#DEC393] font-bold hover:underline" href="/register">
                  + Eigene Suite kostenlos eintragen (60s)
                </Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/boost">Kantonaler 24h Top-Spot Boost</Link>
                <Link className="hover:text-[#EAD2AA] transition" href="/safety">18+ Schutz & Schweizer Richtlinien</Link>
                <div className="flex flex-wrap gap-3 pt-2 text-[11px]">
                  <Link className="hover:text-[#EAD2AA]" href="/imprint">Impressum</Link>
                  <Link className="hover:text-[#EAD2AA]" href="/privacy">Datenschutz</Link>
                  <Link className="hover:text-[#EAD2AA]" href="/terms">AGB</Link>
                  <Link className="text-rose-400 hover:underline font-bold" href="/report">
                    1-Klick Opt-Out / Melden
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <MobileBottomNav />
    </div>
  );
}