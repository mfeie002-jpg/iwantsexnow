import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Home, Flame, Search, Building2, Heart } from "lucide-react";

export function MobileBottomNav() {
  const router = useRouter();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      try {
        const raw = localStorage.getItem("ch_favorite_profiles") || "[]";
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
    { href: "/", label: "Start", icon: Home },
    { href: "/search", label: "Suche", icon: Search },
    { href: "/stories", label: "Heute frei", icon: Flame, dot: true },
    { href: "/clubs", label: "Clubs", icon: Building2 },
    { href: "/favorites", label: "Merkliste", icon: Heart, count: favCount },
  ];

  return (
    <nav aria-label="Mobile Schnellnavigation" className="mobile-thumb-bar pointer-events-none fixed inset-x-0 bottom-0 z-50 px-3 lg:hidden">
      <div className="pointer-events-auto mx-auto grid max-w-md grid-cols-5 gap-1 rounded-[1.6rem] border-2 border-tinte bg-white p-1.5 shadow-[0_4px_0_rgba(30,34,71,0.9),0_14px_28px_-10px_rgba(30,34,71,0.4)]">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = tab.href === "/" ? router.pathname === "/" : router.pathname === tab.href || router.pathname.startsWith(tab.href + "/");

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={
                "relative flex min-h-[54px] flex-col items-center justify-center rounded-[1.1rem] px-1 text-tinte transition-colors " +
                (active ? "bg-butter" : "hover:bg-tinte/5")
              }
            >
              <span className="relative">
                <Icon size={21} strokeWidth={active ? 2.4 : 1.9} />
                {tab.dot && <span className="absolute -right-1 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-kirsche" />}
                {typeof tab.count === "number" && tab.count > 0 && (
                  <span className="absolute -right-3.5 -top-2 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-kirsche px-1 text-[11px] font-extrabold tabular-nums text-white">
                    {tab.count}
                  </span>
                )}
              </span>
              <span className={"mt-1 text-[11px] leading-none " + (active ? "font-extrabold" : "font-semibold")}>{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
