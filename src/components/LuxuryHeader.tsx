import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Heart } from "lucide-react";
import { BrandMark, Wordmark } from "@/components/visuals";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import offersData from "@/data/harvested-offers.json";
import clubsData from "@/data/swiss-establishments-vault.json";

const TOTAL_PROFILES = Array.isArray(offersData) && offersData.length > 0 ? offersData.length : 2590;
const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 108;

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
    { href: "/clubs", label: `${TOTAL_CLUBS} Clubs & Studios` },
    { href: "/fantasy-preview", label: "Avatar & Preview" },
    { href: "/pricing", label: "CHF-Kompass" },
  ];

  const isActive = (href: string) => router.pathname === href || router.pathname.startsWith(href + "/");

  return (
    <header className="sticky top-0 z-40 border-b border-[#1d4350]/70 bg-[#07141a]/85 backdrop-blur-xl">
      <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/" className="group flex min-w-0 items-center gap-3" aria-label="iwantsexnow.ch Startseite">
            <BrandMark size={40} className="shrink-0 transition-transform duration-300 group-hover:-rotate-3" />
            <div className="min-w-0">
              <Wordmark className="truncate text-[17px] text-[#f2f7f6] sm:text-[19px]" />
              <div className="mt-1 hidden truncate text-xs font-medium text-[#9fb8b5] sm:block">
                Schweizer Direktverzeichnis, 0% Provision
              </div>
            </div>
          </Link>

          <div className="hidden pl-2 2xl:block">
            <SwissDoorplate
              state="FREI"
              roomNumber="CH"
              customLabel={`${TOTAL_PROFILES.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")} PROFILE AKTIV`}
              size="sm"
            />
          </div>
        </div>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Hauptnavigation">
          {navItems.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={
                  "relative rounded-full px-3.5 py-2 text-sm font-semibold transition-colors duration-200 " +
                  (active
                    ? "bg-[#ff6b5e]/12 text-[#ffb067]"
                    : "text-[#b4cac8] hover:bg-white/[0.05] hover:text-[#f2f7f6]")
                }
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/favorites"
            className="ghost-button inline-flex min-h-[40px] items-center gap-2 px-3.5 py-2 text-sm font-semibold"
            aria-label={"Merkliste mit " + favCount + " Einträgen"}
          >
            <Heart size={15} className={favCount > 0 ? "fill-[#ff6b5e] text-[#ff6b5e]" : "text-[#9fb8b5]"} strokeWidth={1.8} />
            <span className="hidden xl:inline">Merkliste</span>
            {favCount > 0 && (
              <span className="min-w-[20px] rounded-full bg-[#ff6b5e] px-1.5 text-center text-xs font-bold tabular-nums text-[#07141a]">
                {favCount}
              </span>
            )}
          </Link>

          <Link href="/register" className="brass-button inline-flex min-h-[40px] items-center px-4 py-2 text-sm">
            <span className="hidden sm:inline">Inserat aufgeben</span>
            <span className="sm:hidden">Inserat</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default LuxuryHeader;
