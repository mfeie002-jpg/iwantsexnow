import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Flame, Sparkles, Building2, Heart } from "lucide-react";

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
    { href: "/", label: "Suiten", icon: Home, dot: false },
    { href: "/stories", label: "4h-Frei", icon: Flame, dot: true },
    { href: "/fantasy-preview", label: "KI-Preview", icon: Sparkles, dot: false },
    { href: "/clubs", label: "305 Clubs", icon: Building2, dot: false },
    { href: "/favorites", label: "Merkliste", icon: Heart, count: favCount },
  ];

  return (
    <nav
      aria-label="Mobile Penthouse Navigation"
      style={{
        background: "linear-gradient(180deg, rgba(16,13,11,0.96) 0%, rgba(7,6,6,0.99) 100%)",
        paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 6px)",
        boxShadow: "0 -10px 30px rgba(0,0,0,0.9)",
      }}
      className="lg:hidden fixed bottom-0 inset-x-0 z-50 backdrop-blur-xl border-t border-[#C8A97E]/35 px-2 pt-1.5"
    >
      <div className="grid grid-cols-5 gap-1 max-w-md mx-auto">
        {TABS.map((t) => {
          const Icon = t.icon;
          const active = router.pathname === t.href;
          const itemCls = active
            ? "relative flex flex-col items-center justify-center py-1.5 rounded-xl bg-[#C8A97E]/15 border border-[#C8A97E]/45 text-[#EAD2AA] font-bold transition"
            : "relative flex flex-col items-center justify-center py-1.5 rounded-xl text-[#A89882] hover:text-[#EAD2AA] font-medium transition";
          const iconCls = active ? "text-[#DEC393]" : "text-[#A89882]";

          return (
            <Link key={t.href} href={t.href} className={itemCls}>
              <div className="relative">
                <Icon size={17} className={iconCls} />
                {t.dot && (
                  <span
                    className="absolute -top-0.5 -right-1.5 w-2 h-2 rounded-full bg-emerald-400"
                    style={{ boxShadow: "0 0 8px #4ADE80" }}
                  />
                )}
                {typeof t.count === "number" && t.count > 0 && (
                  <span className="brass-3d absolute -top-1.5 -right-3 px-1 min-w-[15px] h-[15px] rounded-full text-[9px] font-mono font-extrabold flex items-center justify-center">
                    {t.count}
                  </span>
                )}
              </div>
              <span className="text-[9px] font-mono uppercase tracking-wider mt-1 leading-none">
                {t.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;