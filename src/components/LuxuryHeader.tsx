import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Heart } from "lucide-react";
import { BrandMark, Wordmark } from "@/components/visuals";


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
    { href: "/search", label: "Suche" },
    { href: "/clubs", label: "Clubs & Studios" },
    { href: "/pricing", label: "Preise" },
    { href: "/how-it-works", label: "So geht\u2019s" },
  ];

  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b-2 border-tinte/10 bg-papier/90 backdrop-blur-md">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <Link href="/" className="group flex min-w-0 items-center gap-2.5" aria-label="iwantsexnow.ch Startseite">
          <BrandMark size={40} className="shrink-0 transition-transform duration-300 group-hover:-rotate-6" />
          <Wordmark className="truncate text-[21px] text-tinte sm:text-[23px]" />
        </Link>

        <nav className="hidden items-center gap-8 lg:flex" aria-label="Hauptnavigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className="link-draw font-display text-[16px] font-semibold text-tinte"
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2.5">
          <Link
            href="/favorites"
            className="ghost-button inline-flex min-h-[44px] items-center gap-2 px-4 py-2 text-sm"
            aria-label={"Merkliste mit " + favCount + " Einträgen"}
          >
            <Heart size={17} className={favCount > 0 ? "fill-kirsche text-kirsche" : "text-tinte"} strokeWidth={2} />
            <span className="hidden xl:inline">Merkliste</span>
            {favCount > 0 && (
              <span className="min-w-[22px] rounded-full bg-butter px-1.5 text-center text-xs font-extrabold tabular-nums text-tinte">
                {favCount}
              </span>
            )}
          </Link>

          <Link href="/register" className="brass-button inline-flex min-h-[44px] items-center px-5 py-2 text-sm">
            <span className="hidden sm:inline">Inserat aufgeben</span>
            <span className="sm:hidden">Inserat</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default LuxuryHeader;
