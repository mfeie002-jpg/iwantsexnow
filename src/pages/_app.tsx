import "@/styles/globals.css";
import type { AppProps } from "next/app";
import Link from "next/link";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { XeniaConcierge } from "@/components/XeniaConcierge";
import clubsData from "@/data/swiss-establishments-vault.json";

const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 305;

function UnifiedSwissFooter() {
  return (
    <footer className="bg-[#090508] border-t border-white/10 text-[#C9B8BF] text-xs pb-24 lg:pb-12 pt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div className="space-y-3">
          <Link href="/" className="inline-flex items-center gap-2.5 no-underline">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#E11D48] to-[#9F1239] text-white font-serif font-black text-base flex items-center justify-center">
              X
            </span>
            <span className="text-lg font-serif font-bold text-white">
              iwantse<span className="text-[#E11D48]">x</span>now<span className="text-[#E2B887]">.ch</span>
            </span>
          </Link>
          <p className="leading-relaxed text-[#A8949D]">
            Schweizer Verzeichnis mit regionaler Suche, Quellenhinweisen und Xenias freiwilliger Auswahlhilfe. Preise und Status werden nur nach belegtem Stand angezeigt.
          </p>
        </div>

        <div className="space-y-2">
          <div className="text-white font-bold uppercase tracking-wider text-[11px]">Beliebte Regionen</div>
          <div className="grid grid-cols-2 gap-1.5">
            <Link href="/escort-zurich" className="hover:text-white no-underline text-[#C9B8BF]">Zürich (ZH)</Link>
            <Link href="/orte/zug" className="hover:text-white no-underline text-[#C9B8BF]">Zug & Cham (ZG)</Link>
            <Link href="/escort-geneva" className="hover:text-white no-underline text-[#C9B8BF]">Genève (GE)</Link>
            <Link href="/escort-basel" className="hover:text-white no-underline text-[#C9B8BF]">Basel (BS)</Link>
            <Link href="/escort-bern" className="hover:text-white no-underline text-[#C9B8BF]">Bern (BE)</Link>
            <Link href="/orte/luzern" className="hover:text-white no-underline text-[#C9B8BF]">Luzern (LU)</Link>
            <Link href="/escort-lausanne" className="hover:text-white no-underline text-[#C9B8BF]">Lausanne (VD)</Link>
            <Link href="/escort-lugano" className="hover:text-white no-underline text-[#C9B8BF]">Lugano (TI)</Link>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-white font-bold uppercase tracking-wider text-[11px]">Plattform & Vergleich</div>
          <div className="flex flex-col gap-1.5">
            <Link href="/search" className="hover:text-white no-underline text-[#C9B8BF]">Schweizweite Detail-Suche</Link>
            <Link href="/clubs" className="hover:text-white no-underline text-[#C9B8BF]">{TOTAL_CLUBS} Clubs & Studios</Link>
            <Link href="/reviews" className="hover:text-white no-underline text-[#C9B8BF]">Portalübersicht & Vergleichsmethodik</Link>
            <Link href="/pricing" className="hover:text-white no-underline text-[#C9B8BF]">CHF Honorar-Kompass</Link>
            <Link href="/hotels" className="hover:text-white no-underline text-[#C9B8BF]">Diskrete Outcall- & Day-Use-Hotels</Link>
            <Link href="/fantasy-preview" className="text-[#E2B887] hover:underline no-underline">✨ KI-Voice & Preview Suite</Link>
          </div>
        </div>

        <div className="space-y-2.5">
          <div className="text-white font-bold uppercase tracking-wider text-[11px]">Für Anbieterinnen & Recht</div>
          <div className="flex flex-col gap-2">
            <Link
              href="/create-post"
              className="inline-block px-4 py-2 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-extrabold text-center no-underline"
            >
              + Inserat gratis / Claim (0%)
            </Link>
            <Link
              href="/report"
              className="inline-block px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-rose-300 font-semibold text-center no-underline"
            >
              1-Klick Opt-Out / Eintrag entfernen
            </Link>
            <div className="flex flex-wrap gap-3 pt-1 text-[11px] text-[#99848D]">
              <Link href="/imprint" className="hover:text-white no-underline">Impressum</Link>
              <Link href="/privacy" className="hover:text-white no-underline">Datenschutz (revDSG)</Link>
              <Link href="/terms" className="hover:text-white no-underline">AGB & 18+</Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-[#85717A]">
        <span>© {new Date().getFullYear()} iwantsexnow.ch — Unabhängiges Schweizer Verzeichnis & Meta-Vergleich (Zutritt strikt ab 18 Jahren).</span>
        <span>Quellen · Datenschutz · Meldeweg</span>
      </div>
    </footer>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div className="flex min-h-screen flex-col bg-[#0D070C] text-[#F8F1F4]">
      <div className="flex-1">
        <Component {...pageProps} />
      </div>
      <UnifiedSwissFooter />
      <XeniaConcierge />
      <MobileBottomNav />
    </div>
  );
}