import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Home,
  Flame,
  Sparkles,
  Building2,
  Heart,
} from "lucide-react";
import clubsData from "@/data/swiss-establishments-vault.json";

const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 108;

export function MobileBottomNav() {
  const router = useRouter();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      try {
        const raw =
          localStorage.getItem("ch_favorite_profiles") || "[]";
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) setFavCount(parsed.length);
      } catch {
        setFavCount(0);
      }
    };

    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("ch-favorites-updated", sync);

    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("ch-favorites-updated", sync);
    };
  }, [router.asPath]);

  const tabs = [
    { href: "/", label: "Entdecken", icon: Home },
    { href: "/stories", label: "4h-Live", icon: Flame, dot: true },
    { href: "/fantasy-preview", label: "KI-Preview", icon: Sparkles },
    { href: "/clubs", label: `${TOTAL_CLUBS} Clubs`, icon: Building2 },
    { href: "/favorites", label: "Merkliste", icon: Heart, count: favCount },
  ];

  return (
    <nav
      aria-label="Mobile Schnellnavigation"
      className="mobile-thumb-bar fixed inset-x-0 bottom-0 z-50 border-t border-[#1d4350] px-2 pt-1.5 lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = router.pathname === tab.href;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={
                "relative flex min-h-[56px] flex-col items-center justify-center rounded-2xl px-1 transition-colors " +
                (active ? "text-[#ffb067]" : "text-[#9fb8b5] hover:text-[#f2f7f6]")
              }
            >
              {active && (
                <span className="absolute inset-x-5 top-0 h-[3px] rounded-b-full bg-gradient-to-r from-[#ff5a8a] via-[#ff6b5e] to-[#ffb067]" />
              )}
              <span className="relative">
                <Icon size={21} strokeWidth={active ? 2 : 1.6} />
                {tab.dot && (
                  <span className="absolute -right-1 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#07141a] bg-[#4fd1b0]" />
                )}
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span className="absolute -right-3.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[#ff6b5e] px-1 text-[11px] font-bold tabular-nums text-[#07141a]">
                    {tab.count}
                  </span>
                )}
              </span>
              <span className="mt-1 text-[11px] font-semibold leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
