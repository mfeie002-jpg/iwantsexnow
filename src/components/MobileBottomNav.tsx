import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const TABS = [
  { href: "/search", label: "Entdecken" },
  { href: "/#staedte", label: "Städte" },
  { href: "/favorites", label: "Merkliste", fav: true },
  { href: "/register", label: "Inserieren" },
];

export function MobileBottomNav() {
  const router = useRouter();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
        setFavCount(Array.isArray(parsed) ? parsed.length : 0);
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

  return (
    <nav aria-label="Hauptnavigation mobil" className="mobile-thumb-bar fixed inset-x-0 bottom-0 z-50 border-t border-line bg-surface/95 backdrop-blur-md lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-4 px-2 pb-[max(10px,env(safe-area-inset-bottom))]">
        {TABS.map((tab) => {
          const active = !tab.href.includes("#") && (router.pathname === tab.href || router.pathname.startsWith(tab.href + "/"));
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={"flex min-h-[60px] flex-col items-center justify-center gap-1 text-[13px] font-bold " + (active ? "text-gold" : "text-ink-soft")}
            >
              <span aria-hidden="true" className={"h-[3px] w-7 rounded-full " + (active ? "bg-gold" : "bg-transparent")} />
              <span>
                {tab.label}
                {tab.fav && favCount > 0 && <span className="ml-0.5 text-gold">{favCount}</span>}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
