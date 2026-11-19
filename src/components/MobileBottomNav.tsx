import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function MobileBottomNav() {
  const router = useRouter();

  return (
    <>
      {/* Editorial Magazin-Footer statt technischem Sitemap-Kasten */}
      <footer className="mt-28 pt-20 pb-28 px-6 sm:px-14 bg-gradient-to-b from-transparent to-[#050304] relative overflow-hidden">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-end pb-16">
            <div className="lg:col-span-7 space-y-4">
              <p className="text-xs uppercase tracking-[0.35em] text-[#D9B38C]">L&apos;Art de la Nuit Suisse</p>
              <h2 className="font-editorial italic text-4xl sm:text-6xl text-[#F4EFEA] font-normal leading-[1.08]">
                Diskretion, Ästhetik & echte Begegnungen in der Schweiz.
              </h2>
            </div>
            <div className="lg:col-span-5 flex flex-wrap gap-4 lg:justify-end">
              <Link
                href="/advertise"
                className="px-7 py-4 rounded-full bg-[#D9B38C] text-[#0B0809] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-white transition"
              >
                Als Model beitreten
              </Link>
              <Link
                href="/reviews"
                className="px-7 py-4 rounded-full bg-[#1C1417] text-[#F4EFEA] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#2A1E22] transition"
              >
                Portal-Report lesen
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 py-12 text-sm text-[#A69B95]">
            <div className="space-y-2.5">
              <div className="text-xs uppercase tracking-[0.25em] text-[#D9B38C] mb-3">Metropolen</div>
              <div><Link href="/orte/zuerich" className="hover:text-white transition">Zürich & Seefeld</Link></div>
              <div><Link href="/orte/zug" className="hover:text-white transition">Zug, Baar & Cham</Link></div>
              <div><Link href="/orte/geneve" className="hover:text-white transition">Genève & Lausanne</Link></div>
              <div><Link href="/orte/basel" className="hover:text-white transition">Basel & Luzern</Link></div>
            </div>
            <div className="space-y-2.5">
              <div className="text-xs uppercase tracking-[0.25em] text-[#D9B38C] mb-3">Kuratierte Welten</div>
              <div><Link href="/?cat=escort" className="hover:text-white transition">Private Begleitung (GFE)</Link></div>
              <div><Link href="/?cat=massage" className="hover:text-white transition">Tantra & Sinnliche Rituale</Link></div>
              <div><Link href="/clubs" className="hover:text-white transition">305 Schweizer Clubs & Villen</Link></div>
              <div><Link href="/matches" className="hover:text-white transition">Persönlicher Vibe-Matcher</Link></div>
            </div>
            <div className="space-y-2.5">
              <div className="text-xs uppercase tracking-[0.25em] text-[#D9B38C] mb-3">Redaktion & Markt</div>
              <div><Link href="/reviews" className="hover:text-white transition">Schweizer Portal-Vergleich</Link></div>
              <div><Link href="/pricing" className="hover:text-white transition">Honorar- & Tarif-Spiegel</Link></div>
              <div><Link href="/compare-escorts" className="hover:text-white transition">Dossiers gegenüberstellen</Link></div>
              <div><Link href="/for-clients" className="hover:text-white transition">Gäste-Kodex & Sicherheit</Link></div>
            </div>
            <div className="space-y-2.5">
              <div className="text-xs uppercase tracking-[0.25em] text-[#D9B38C] mb-3">Atelier & Recht</div>
              <div><Link href="/login" className="hover:text-white transition">Anbieter-Atelier (Login)</Link></div>
              <div><Link href="/report" className="hover:text-white transition">Sofort-Opt-Out & Korrektur</Link></div>
              <div><Link href="/privacy" className="hover:text-white transition">Schweizer Datenschutz (revDSG)</Link></div>
              <div><Link href="/terms" className="hover:text-white transition">Impressum & Richtlinien</Link></div>
            </div>
          </div>
        </div>
      </footer>

      {/* Schwebende, weiche Mobile-Kapsel ohne bunte Spielzeug-Icons */}
      <div className="md:hidden fixed bottom-4 inset-x-5 z-50">
        <div className="flex items-center justify-around px-4 py-3 rounded-full bg-[#140E10]/90 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.85)]">
          <Link href="/" className={`text-xs uppercase tracking-[0.15em] ${router.pathname === "/" ? "text-[#D9B38C] font-bold" : "text-[#F4EFEA]/75"}`}>
            Porträts
          </Link>
          <Link href="/clubs" className={`text-xs uppercase tracking-[0.15em] ${router.pathname.startsWith("/clubs") ? "text-[#D9B38C] font-bold" : "text-[#F4EFEA]/75"}`}>
            Clubs
          </Link>
          <Link href="/matches" className={`text-xs uppercase tracking-[0.15em] ${router.pathname.startsWith("/matches") ? "text-[#D9B38C] font-bold" : "text-[#F4EFEA]/75"}`}>
            Concierge
          </Link>
          <Link href="/reviews" className={`text-xs uppercase tracking-[0.15em] ${router.pathname.startsWith("/reviews") ? "text-[#D9B38C] font-bold" : "text-[#F4EFEA]/75"}`}>
            Magazin
          </Link>
        </div>
      </div>
    </>
  );
}