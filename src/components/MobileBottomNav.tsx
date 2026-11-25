import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { usePrefs } from "@/lib/prefs";

export function MobileBottomNav() {
  const router = useRouter();
  const { t } = usePrefs();
  const [favCount, setFavCount] = useState(0);

  useEffect(() => {
    const sync = () => {
      try {
        const parsed = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
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
    { href: "/", label: t("discover") },
    { href: "/#staedte", label: t("cities") },
    { href: "/favorites", label: t("saved"), count: favCount },
    { href: "/advertise", label: t("advertise") },
  ];

  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed inset-x-3 bottom-3 z-50 lg:hidden"
    >
      <div className="mobile-thumb-bar mx-auto grid max-w-md grid-cols-4 gap-1 rounded-full border border-[#3d2231] px-2 py-2">
        {tabs.map((tab) => {
          const active = router.asPath === tab.href || router.pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className="relative grid min-h-[48px] justify-items-center content-center gap-0.5 rounded-full px-1 text-[14px] font-semibold"
            >
              <span
                className={
                  "h-1.5 w-1.5 rounded-full " + (active ? "bg-[#d6165f]" : "bg-transparent")
                }
              />
              <span className={active ? "text-[#fbf1ec]" : "text-[#cdb5be]"}>
                {tab.label}
                {typeof tab.count === "number" && tab.count > 0 ? ` · ${tab.count}` : ""}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
