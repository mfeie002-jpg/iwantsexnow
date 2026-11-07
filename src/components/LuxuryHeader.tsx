import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Heart, Search, Building2, Sparkles, ShieldCheck, PlusCircle } from "lucide-react";
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
    { href: "/clubs", label: "305 Clubs & Studios", icon: Building2, highlight: false },
    { href: "/fantasy-preview", label: "Avatar & Preview", icon: Sparkles, highlight: true },
    { href: "/pricing", label: "CHF-Kompass", icon: ShieldCheck, highlight: false },
  ];

  const getNavClass = (isHighlight: boolean, isActive: boolean) => {
    const base = "px-3 py-1.5 rounded-lg text-xs font-semibold inline-flex items-center gap-1.5 transition ";
    if (isHighlight) {
      return base + "bg-[#C8A97E]/15 text-[#C8A97E] border border-[#C8A97E]/40 hover:bg-[#C8A97E] hover:text-[#090A0F]";
    }
    if (isActive) {
      return base + "bg-white/10 text-white";
    }
    return base + "text-gray-300 hover:text-white hover:bg-white/5";
  };

  const heartClass = favCount > 0 ? "text-rose-400 fill-rose-400" : "text-[#C8A97E]";

  return (
    <header className="sticky top-0 z-40 bg-[#090A0F]/95 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-[#C8A97E] text-[#090A0F] font-serif font-extrabold text-sm flex items-center justify-center shadow">
              CH
            </div>
            <div>
              <div className="text-base sm:text-lg font-serif font-bold tracking-wide text-white leading-none">
                IWANTSEXNOW<span className="text-[#C8A97E]">.CH</span>
              </div>
              <div className="text-[10px] text-gray-400 tracking-widest uppercase mt-0.5">
                SCHWEIZER DIREKTVERZEICHNIS · 0% PROVISION
              </div>
            </div>
          </Link>
          <div className="hidden xl:block pl-2">
            <SwissDoorplate state="FREI" roomNumber="CH" customLabel="2'529 PROFILE AKTIV" size="sm" />
          </div>
        </div>

        <nav className="hidden md:flex items-center gap-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;
            const linkCls = getNavClass(Boolean(item.highlight), active);
            return (
              <Link key={item.href} href={item.href} className={linkCls}>
                <Icon size={13} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/favorites"
            className="px-3 py-1.5 rounded-lg bg-[#11131C] hover:bg-white/10 border border-white/15 text-xs font-semibold text-gray-200 inline-flex items-center gap-1.5"
          >
            <Heart size={13} className={heartClass} />
            <span className="hidden sm:inline">Merkliste</span>
            {favCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-[#C8A97E] text-[#090A0F] text-[10px] font-extrabold">
                {favCount}
              </span>
            )}
          </Link>

          <Link
            href="/register"
            className="px-3.5 py-1.5 rounded-lg bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-extrabold text-xs inline-flex items-center gap-1.5 shadow"
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