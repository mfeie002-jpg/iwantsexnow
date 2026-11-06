import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Flame, Sparkles, Video, Heart, ShieldCheck, PlusCircle, Scale } from "lucide-react";

export function MobileBottomNav() {
  const router = useRouter();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem("ch_favorite_profiles") || "[]";
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setFavCount(parsed.length);
      } catch {}
    };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("ch-favorites-updated", sync);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ch-favorites-updated", sync);
    };
  }, [router.asPath]);

  const TABS = [
    { href: "/", label: "Start", icon: Home },
    { href: "/stories", label: "4h-Live", icon: Flame, dot: true },
    { href: "/matches", label: "Matcher", icon: Sparkles },
    { href: "/live-cam", label: "Video/Vault", icon: Video },
    { href: "/favorites", label: "Merkliste", icon: Heart, count: favCount },
  ];

  return (
    <>
      {/* Globaler Schweizer UX/SEO-Abschluss-Footer auf allen Seiten */}
      <footer className="bg-[#090C12] border-t border-white/10 text-gray-400 text-xs pb-24 lg:pb-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="space-y-2.5">
              <div className="text-base font-serif font-bold text-white">
                IWANTSEXNOW<span className="text-[#C8A97E]">.CH</span>
              </div>
              <p className="text-[11px] text-gray-400 leading-relaxed">
                Das unabhängige Schweizer Direktverzeichnis für verifizierte Escorts, Girlfriend Experience, Tantra-Studios & 108 stationäre Clubs. 0 % Buchungsprovision & 80 % Creator-Anteil im Paid-Vault.
              </p>
              <div className="inline-flex items-center gap-1.5 text-[11px] text-emerald-400 font-bold pt-1">
                <ShieldCheck size={14} /> 100 % Schweizer CHF-Preistransparenz
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#C8A97E]">
                Schweizer Fokus-Kantone
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <Link href="/orte/zug" className="hover:text-white">Zug & Baar (ZG)</Link>
                <Link href="/orte/zuerich" className="hover:text-white">Zürich City (ZH)</Link>
                <Link href="/orte/luzern" className="hover:text-white">Luzern (LU)</Link>
                <Link href="/orte/baden" className="hover:text-white">Baden / Aargau (AG)</Link>
                <Link href="/orte/basel" className="hover:text-white">Basel-Stadt (BS)</Link>
                <Link href="/orte/bern" className="hover:text-white">Bern (BE)</Link>
                <Link href="/orte/st-gallen" className="hover:text-white">St. Gallen (SG)</Link>
                <Link href="/orte/geneve" className="hover:text-white">Genève (GE)</Link>
                <Link href="/orte/lausanne" className="hover:text-white">Lausanne (VD)</Link>
                <Link href="/orte/lugano" className="hover:text-white">Lugano (TI)</Link>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#C8A97E]">
                Plattform & Werkzeuge
              </div>
              <div className="grid grid-cols-2 gap-1.5 text-[11px]">
                <Link href="/search" className="hover:text-white">Deep-Filter Suche</Link>
                <Link href="/matches" className="hover:text-white">10s Quick-Matcher</Link>
                <Link href="/compare-escorts" className="hover:text-white">4-Profil Vergleich</Link>
                <Link href="/rankings" className="hover:text-white">Top-50 Ranking</Link>
                <Link href="/clubs" className="hover:text-white">108 Schweizer Clubs</Link>
                <Link href="/pricing" className="hover:text-white">CHF-Honorar-Kompass</Link>
                <Link href="/hotels" className="hover:text-white">Outcall-Hotel-Guide</Link>
                <Link href="/reviews" className="hover:text-white">Echtheits-Bewertungen</Link>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#C8A97E]">
                Für Anbieterinnen & Rechtliches
              </div>
              <div className="flex flex-col gap-1.5 text-[11px]">
                <Link href="/register" className="text-[#C8A97E] font-bold hover:underline">
                  + Eigenes Profil kostenlos eintragen (60s)
                </Link>
                <Link href="/boost" className="hover:text-white">Kantonaler 24h Top-Spot Boost</Link>
                <Link href="/safety" className="hover:text-white">Sicherheit, Schutz & 18+ Richtlinien</Link>
                <div className="flex flex-wrap gap-3 pt-2 text-gray-500">
                  <Link href="/imprint" className="hover:text-gray-300">Impressum</Link>
                  <Link href="/privacy" className="hover:text-gray-300">Datenschutz</Link>
                  <Link href="/terms" className="hover:text-gray-300">AGB</Link>
                  <Link href="/report" className="text-rose-400/80 hover:text-rose-300">Opt-Out / Melden</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Mobile-First Thumb-Zone Bottom Navigation Bar (nur auf Smartphones/Tablets sichtbar) */}
      <nav
        aria-label="Mobile Schnellnavigation"
        className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0D111A]/95 backdrop-blur-lg border-t border-white/15 px-2 py-1.5"
        style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)" }}
      >
        <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
          {TABS.map((t) => {
            const Icon = t.icon;
            const active = router.pathname === t.href;
            return (
              <Link
                key={t.href}
                href={t.href}
                className={`relative flex flex-col items-center justify-center py-1.5 rounded-xl transition ${
                  active ? "text-[#C8A97E] bg-white/5 font-extrabold" : "text-gray-400 hover:text-white font-semibold"
                }`}
              >
                <div className="relative">
                  <Icon size={18} className={active ? "text-[#C8A97E]" : "text-gray-300"} />
                  {t.dot && (
                    <span className="absolute -top-0.5 -right-1 w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                  {typeof t.count === "number" && t.count > 0 && (
                    <span className="absolute -top-1.5 -right-2.5 px-1 min-w-[15px] h-[15px] rounded-full bg-[#C8A97E] text-[#0D111A] text-[9px] font-extrabold flex items-center justify-center">
                      {t.count}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 leading-none">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}

export default MobileBottomNav;