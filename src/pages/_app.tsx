import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="min-h-screen flex flex-col bg-[#090A0F] text-[#F5F2EB]">
      <div className="flex-1">
        <Component {...pageProps}/>
      </div>

      <footer className="bg-[#090A0F] border-t border-white/10 py-10 px-4 sm:px-6 mt-16">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-xs text-gray-400">
          <div className="space-y-2">
            <div className="text-base font-serif font-bold text-white">
              IWANTSEXNOW<span className="text-[#C8A97E]">.CH</span>
            </div>
            <p className="leading-relaxed">
              Das unabhängige Schweizer Direktverzeichnis für verifizierte Escorts, Girlfriend Experience, Tantra-Studios & 305 stationäre Clubs. 0 % Buchungsprovision & 80 % Creator-Anteil.
            </p>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">Schweizer Fokus-Kantone</div>
            <div className="grid grid-cols-2 gap-1.5">
              <Link className="hover:text-[#C8A97E]" href="/orte/zug">Zug & Baar (ZG)</Link>
              <Link className="hover:text-[#C8A97E]" href="/escort-zurich">Zürich City (ZH)</Link>
              <Link className="hover:text-[#C8A97E]" href="/orte/luzern">Luzern (LU)</Link>
              <Link className="hover:text-[#C8A97E]" href="/orte/baden">Baden / Aargau (AG)</Link>
              <Link className="hover:text-[#C8A97E]" href="/escort-basel">Basel-Stadt (BS)</Link>
              <Link className="hover:text-[#C8A97E]" href="/escort-bern">Bern (BE)</Link>
              <Link className="hover:text-[#C8A97E]" href="/escort-geneva">Genève (GE)</Link>
              <Link className="hover:text-[#C8A97E]" href="/escort-lugano">Lugano (TI)</Link>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">Plattform & KI-Werkzeuge</div>
            <div className="grid grid-cols-2 gap-1.5">
              <Link className="hover:text-[#C8A97E]" href="/search">Deep-Filter Suche</Link>
              <Link className="text-[#C8A97E] font-semibold hover:underline" href="/fantasy-preview">🔮 Avatar & Preview</Link>
              <Link className="hover:text-[#C8A97E]" href="/compare-escorts">4-Profil Vergleich</Link>
              <Link className="hover:text-[#C8A97E]" href="/rankings">Top-50 Ranking</Link>
              <Link className="hover:text-[#C8A97E]" href="/clubs">305 Schweizer Clubs</Link>
              <Link className="hover:text-[#C8A97E]" href="/pricing">CHF-Honorar-Kompass</Link>
              <Link className="hover:text-[#C8A97E]" href="/hotels">Outcall-Hotel-Guide</Link>
              <Link className="hover:text-[#C8A97E]" href="/reviews">Portal-Prüfberichte</Link>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-white font-bold uppercase tracking-wider text-[11px]">Für Anbieterinnen & Rechtliches</div>
            <div className="flex flex-col gap-1.5">
              <Link className="text-[#C8A97E] font-bold hover:underline" href="/register">+ Eigenes Profil kostenlos eintragen (60s)</Link>
              <Link className="hover:text-white" href="/boost">Kantonaler 24h Top-Spot Boost</Link>
              <Link className="hover:text-white" href="/safety">Sicherheit, Schutz & 18+ Richtlinien</Link>
              <div className="flex flex-wrap gap-3 pt-2 text-[11px]">
                <Link className="hover:text-white" href="/imprint">Impressum</Link>
                <Link className="hover:text-white" href="/privacy">Datenschutz</Link>
                <Link className="hover:text-white" href="/terms">AGB</Link>
                <Link className="text-rose-400 hover:underline font-semibold" href="/report">1-Klick Opt-Out / Melden</Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}