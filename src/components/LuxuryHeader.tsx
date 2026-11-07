import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Heart, Search, Building2, Sparkles, ShieldCheck, PlusCircle, Crown } from "lucide-react";
import { SwissDoorplate } from "@/components/SwissDoorplate";

export function LuxuryHeader() {
  const router = useRouter();
  const [favCount, setFavCount] = useState<number>(0);

  useEffect(() => {
    const syncFavs = () => {
      try {
        const raw = localStorage.getItem("ch_favorite_profiles");
        const arr = raw ? JSON.parse(raw) : [];
        setFavCount(Array.isArray(arr) ? arr.length : 0);
      } catch {
        setFavCount(0);
      }
    };
    syncFavs();
    window.addEventListener("storage", syncFavs);
    window.addEventListener("ch-favorites-updated", syncFavs);
    return () => {
      window.removeEventListener("storage", syncFavs);
      window.removeEventListener("ch-favorites-updated", syncFavs);
    };
  }, []);

  const navItems = [
    { href: "/search", label: "Deep-Suche", icon: Search, highlight: false },
    { href: "/clubs", label: "305 Clubs & Suiten", icon: Building2, highlight: false },
    { href: "/fantasy-preview", label: "Voice-Avatar & Preview", icon: Sparkles, highlight: true },
    { href: "/pricing", label: "CHF-Kompass", icon: ShieldCheck, highlight: false },
  ];

  const getNavClass = (isHighlight: boolean, isActive: boolean) => {
    const base =
      "px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.14em] inline-flex items-center gap-1.5 transition ";
    if (isHighlight) {
      return (
        base +
        "emerald-3d border border-[#C8A97E]/50 text-[#EAD2AA]"
      );
    }
    if (isActive) {
      return (
        base +
        "bg-[#C8A97E]/20 text-[#EAD2AA] border border-[#C8A97E]/50"
      );
    }
    return (
      base +
      "text-[#C8B9A6] hover:text-[#EAD2AA] hover:bg-white/[0.04] border border-transparent"
    );
  };

  const heartClass = favCount > 0 ? "text-rose-400 fill-rose-400" : "text-[#DEC393]";

  return (
    <header
      style={{
        background: "linear-gradient(180deg, rgba(14,11,9,0.97) 0%, rgba(7,6,6,0.95) 100%)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.85)",
      }}
      className="sticky top-0 z-40 backdrop-blur-xl border-b border-[#C8A97E]/30"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="brass-3d w-9 h-9 rounded-xl border border-[#F5E3B8]/60 flex items-center justify-center shadow-lg">
              <Crown size={17} className="text-[#191105]" />
            </div>
            <div>
              <div className="text-base sm:text-lg font-serif font-bold tracking-[0.14em] text-[#F5EFE6] leading-none">
                IWANTSEXNOW<span className="text-[#DEC393]">.CH</span>
              </div>
              <div className="text-[9px] font-mono text-[#B6A48E] tracking-[0.22em] uppercase mt-1">
                SWISS PENTHOUSE DIRECTORY · 0% PROVISION
              </div>
            </div>
          </Link>

          <div className="hidden xl:block pl-2">
            <SwissDoorplate state="FREI" roomNumber="CH" customLabel="2'529 SUITEN" size="sm" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;
            const linkCls = getNavClass(Boolean(item.highlight), active);
            return (
              <Link key={item.href} href={item.href} className={linkCls}>
                <Icon size={13} className="text-[#DEC393]" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/favorites"
            className="px-3.5 py-1.5 rounded-full bg-[#120E0C] hover:bg-[#1A1411] border border-[#C8A97E]/35 text-[11px] font-mono font-bold tracking-wider uppercase text-[#EAD2AA] inline-flex items-center gap-1.5 transition"
          >
            <Heart size={13} className={heartClass} />
            <span className="hidden sm:inline">Merkliste</span>
            {favCount > 0 && (
              <span className="brass-3d px-1.5 py-0.2 rounded-full text-[10px] font-mono font-extrabold">
                {favCount}
              </span>
            )}
          </Link>

          <Link
            href="/register"
            className="brass-3d px-4 py-1.5 rounded-full border border-[#F5E3B8]/60 font-sans font-extrabold text-[11px] tracking-[0.14em] uppercase inline-flex items-center gap-1.5 transition"
          >
            <PlusCircle size={13} />
            <span>Inserat (0%)</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default LuxuryHeader;