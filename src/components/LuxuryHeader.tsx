import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Wordmark } from "@/components/visuals";
import { useDiscreet } from "@/lib/discreet";

const NAV = [
  { href: "/search", label: "Entdecken" },
  { href: "/#staedte", label: "Städte" },
  { href: "/favorites", label: "Merkliste", fav: true },
  { href: "/register", label: "Inserieren" },
];

export function DiscreetSwitch({ compact = false }: { compact?: boolean }) {
  const [on, toggle] = useDiscreet();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-pressed={on}
      aria-label={compact ? "Diskreter Modus" : undefined}
      className="inline-flex min-h-[44px] items-center gap-2.5 rounded-full px-1 text-[15px] font-semibold text-ink"
    >
      <span
        aria-hidden="true"
        className={
          "relative inline-block h-[26px] w-[44px] rounded-full border transition-colors " +
          (on ? "border-gold bg-gold" : "border-line-strong bg-transparent")
        }
      >
        <span
          className={
            "absolute top-[3px] h-[18px] w-[18px] rounded-full transition-[left] duration-300 " +
            (on ? "left-[21px] bg-gold-on" : "left-[3px] bg-line-strong")
          }
        />
      </span>
      {!compact && <span>Diskret</span>}
    </button>
  );
}

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

  const isActive = (href: string) => !href.includes("#") && (router.pathname === href || router.pathname.startsWith(href + "/"));

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex min-h-[76px] max-w-[1200px] flex-wrap items-center justify-between gap-x-8 gap-y-2 px-4 py-3 sm:px-6">
        <Link href="/" className="min-w-0" aria-label="iWantSexNow.ch Startseite">
          <Wordmark className="text-[28px] text-ink sm:text-[30px]" />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex" aria-label="Hauptnavigation">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              aria-current={isActive(item.href) ? "page" : undefined}
              className={"py-2.5 text-[16px] font-semibold transition-colors hover:text-gold " + (isActive(item.href) ? "text-gold" : "text-ink")}
            >
              {item.label}
              {item.fav && favCount > 0 && <span className="ml-1 text-gold">({favCount})</span>}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-3">
          <DiscreetSwitch />
        </div>
      </div>
    </header>
  );
}

export default LuxuryHeader;
