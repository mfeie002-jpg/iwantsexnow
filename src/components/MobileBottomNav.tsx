import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

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

  if (router.pathname.startsWith("/profile/")) return null;

  const tabs = [
    { href: "/", label: "Start" },
    { href: "/search", label: "Suche" },
    { href: "/clubs", label: "Clubs" },
    { href: "/favorites", label: favCount > 0 ? "Merken " + favCount : "Merken" },
  ];

  return (
    <nav aria-label="Mobile Schnellnavigation" className="thumb-nav">
      {tabs.map((tab) => {
        const on = tab.href === "/" ? router.pathname === "/" : router.pathname === tab.href || router.pathname.startsWith(tab.href + "/");
        return (
          <Link key={tab.href} href={tab.href} aria-current={on ? "page" : undefined}>
            {tab.label}
          </Link>
        );
      })}
    </nav>
  );
}

export default MobileBottomNav;
