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
    {
      href: "/fantasy-preview",
      label: "KI-Preview",
      icon: Sparkles,
      featured: true,
    },
    { href: "/clubs", label: `${TOTAL_CLUBS} Clubs`, icon: Building2 },
    {
      href: "/favorites",
      label: "Merkliste",
      icon: Heart,
      count: favCount,
    },
  ];

  return (
    <nav
      aria-label="Mobile Schnellnavigation"
      className="mobile-thumb-bar fixed inset-x-0 bottom-0 z-50 border-t border-[#C8A97E]/20 px-2 pt-1.5 lg:hidden"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = router.pathname === tab.href;
          const itemClass = active
            ? "relative flex min-h-[54px] flex-col items-center justify-center rounded-[9px] border border-[#C8A97E]/20 bg-[#C8A97E]/[0.065] px-1 text-[#DEC393]"
            : "relative flex min-h-[54px] flex-col items-center justify-center rounded-[9px] border border-transparent px-1 text-[#82786B] transition hover:bg-white/[0.025] hover:text-[#D7C9B5]";

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={itemClass}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={
                  tab.featured
                    ? "relative -mt-4 flex h-9 w-9 items-center justify-center rounded-full border border-[#DEC393]/45 bg-[#17110C] shadow-[0_5px_20px_rgba(0,0,0,0.65)]"
                    : "relative"
                }
              >
                <Icon
                  size={tab.featured ? 17 : 18}
                  strokeWidth={active || tab.featured ? 1.8 : 1.45}
                  className={
                    active || tab.featured
                      ? "text-[#DEC393]"
                      : "text-[#9C9183]"
                  }
                />

                {tab.dot && (
                  <span className="absolute -right-1 -top-0.5 h-2 w-2 rounded-full border border-[#100D0B] bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.55)]" />
                )}

                {typeof tab.count === "number" && tab.count > 0 && (
                  <span className="absolute -right-3 -top-2 flex h-[16px] min-w-[16px] items-center justify-center rounded-full border border-[#DEC393]/45 bg-[#B38E52] px-1 font-mono text-[8px] font-semibold tabular-nums text-[#100D0B]">
                    {tab.count}
                  </span>
                )}
              </span>

              <span
                className={
                  tab.featured
                    ? "mt-0.5 text-[8px] font-medium leading-none"
                    : "mt-1 text-[8px] font-medium leading-none"
                }
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;