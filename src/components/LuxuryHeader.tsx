import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import {
  Search,
  Sparkles,
  Trophy,
  Video,
  Flame,
  Building2,
  Scale,
  Heart,
  Menu,
  X,
  PlusCircle,
  MapPin,
  ShieldCheck,
  KeyRound,
  Star,
} from "lucide-react";

const MAIN_NAV = [
  { href: "/search", label: "Deep-Suche", icon: Search },
  { href: "/matches", label: "Quick-Matcher", icon: Sparkles },
  { href: "/stories", label: "24h-Stories", icon: Flame, badge: "LIVE" },
  { href: "/live-cam", label: "Video & Vault", icon: Video },
  { href: "/rankings", label: "Top-50", icon: Trophy },
  { href: "/clubs", label: "108 Clubs", icon: Building2 },
  { href: "/compare-escorts", label: "Direktvergleich", icon: Scale },
  { href: "/pricing", label: "CHF-Kompass", icon: ShieldCheck },
  { href: "/hotels", label: "Outcall-Hotels", icon: KeyRound },
  { href: "/reviews", label: "Bewertungen", icon: Star },
];

const CANTON_QUICK_LINKS = [
  { slug: "zug", code: "ZG", label: "Zug" },
  { slug: "zuerich", code: "ZH", label: "Zürich" },
  { slug: "luzern", code: "LU", label: "Luzern" },
  { slug: "baden", code: "AG", label: "Baden / AG" },
  { slug: "basel", code: "BS", label: "Basel" },
  { slug: "bern", code: "BE", label: "Bern" },
  { slug: "st-gallen", code: "SG", label: "St. Gallen" },
  { slug: "geneve", code: "GE", label: "Genève" },
  { slug: "lausanne", code: "VD", label: "Lausanne" },
  { slug: "lugano", code: "TI", label: "Lugano" },
];

export function LuxuryHeader() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const syncFavs = () => {
      try {
        const raw = localStorage.getItem("ch_favorite_profiles") || localStorage.getItem("favorites") || "[]";
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setFavCount(parsed.length);
      } catch {}
    };
    syncFavs();
    window.addEventListener("storage", syncFavs);
    window.addEventListener("ch-favorites-updated", syncFavs);
    return () => {
      window.removeEventListener("storage", syncFavs);
      window.removeEventListener("ch-favorites-updated", syncFavs);
    };
  }, [router.asPath]);

  return (
    <>
    <header className="sticky top-0 z-50 bg-[#0D111A]/95 backdrop-blur-md border-b border-white/10">
      {/* Obere Hauptzeile */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#C8A97E] to-[#9A7B4F] flex items-center justify-center text-[#0D111A] font-serif font-extrabold text-base shadow">
            CH
          </div>
          <div>
            <span className="text-base sm:text-lg font-serif font-bold tracking-wide text-white block leading-none">
              IWANTSEXNOW<span className="text-[#C8A97E]">.CH</span>
            </span>
            <span className="text-[9px] uppercase tracking-widest text-gray-400 block mt-0.5">
              SCHWEIZER DIREKTVERZEICHNIS · 0% PROVISION
            </span>
          </div>
        </Link>

        {/* Desktop-Navigation (Kompakt) */}
        <nav className="hidden xl:flex items-center gap-1">
          {MAIN_NAV.slice(0, 7).map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition ${
                  active
                    ? "bg-[#C8A97E] text-[#0D111A]"
                    : "text-gray-300 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={13} className={active ? "text-[#0D111A]" : "text-[#C8A97E]"} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-[#07120B] text-[9px] font-extrabold">
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Rechte Aktions-Buttons: Merkliste & Profil eintragen */}
        <div className="flex items-center gap-2">
          <Link
            href="/favorites"
            className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white flex items-center gap-1.5"
            title="Gespeicherte Favoriten & Merkliste"
          >
            <Heart size={14} className={favCount > 0 ? "text-rose-400 fill-rose-400" : "text-[#C8A97E]"} />
            <span className="hidden sm:inline">Merkliste</span>
            {favCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full bg-[#C8A97E] text-[#0D111A] text-[10px] font-extrabold">
                {favCount}
              </span>
            )}
          </Link>

          <Link
            href="/register"
            className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] text-xs font-extrabold shadow"
          >
            <PlusCircle size={14} />
            <span>Profil eintragen (0%)</span>
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="xl:hidden p-2 rounded-xl bg-white/5 border border-white/15 text-white cursor-pointer"
            aria-label="Menü öffnen"
          >
            {mobileOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Untere Kantons- & Modul-Schnellleiste */}
      <div className="bg-[#121722]/90 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-1.5 flex items-center justify-between gap-4 overflow-x-auto no-scrollbar text-[11px]">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-gray-400 font-bold flex items-center gap-1 mr-1">
              <MapPin size={11} className="text-[#C8A97E]" /> Kantone:
            </span>
            {CANTON_QUICK_LINKS.map((c) => (
              <Link
                key={c.slug}
                href={`/orte/${c.slug}`}
                className="px-2 py-0.5 rounded-lg bg-[#0D111A] hover:bg-[#C8A97E] text-gray-300 hover:text-[#0D111A] border border-white/10 font-bold transition shrink-0"
              >
                {c.code} · {c.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3 shrink-0 text-gray-300 font-semibold">
            <Link href="/pricing" className="hover:text-[#C8A97E]">CHF-Kompass</Link>
            <Link href="/hotels" className="hover:text-[#C8A97E]">Outcall-Hotels</Link>
            <Link href="/reviews" className="hover:text-[#C8A97E]">Bewertungen</Link>
            <Link href="/notifications" className="text-emerald-400 hover:underline">● 4h-Live-Ticker</Link>
          </div>
        </div>
      </div>

      {/* Mobiles Aufklapp-Menü */}
      {mobileOpen && (
        <div className="xl:hidden bg-[#121722] border-b border-white/15 px-4 py-4 space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {MAIN_NAV.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="p-2.5 rounded-xl bg-[#0D111A] border border-white/10 text-xs font-bold text-white flex items-center gap-2"
                >
                  <Icon size={14} className="text-[#C8A97E]" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              className="flex-1 py-2.5 px-4 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold text-center"
            >
              + Kostenloses Schweizer Profil anlegen →
            </Link>
            <Link
              href="/members"
              onClick={() => setMobileOpen(false)}
              className="py-2.5 px-4 rounded-xl bg-white/10 text-white text-xs font-bold text-center"
            >
              Gentleman-Lounge
            </Link>
          </div>
        </div>
      )}
    </header>
    <MobileBottomNav />
    </>
  );
}

export default LuxuryHeader;