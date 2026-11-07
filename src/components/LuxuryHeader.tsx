import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Heart,
  Search,
  Building2,
  Sparkles,
  ShieldCheck,
  PlusCircle,
} from "lucide-react";
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
    {
      href: "/search",
      label: "Deep-Suche",
      icon: Search,
      highlight: false,
    },
    {
      href: "/clubs",
      label: `${TOTAL_CLUBS} Clubs & Studios`,
      icon: Building2,
      highlight: false,
    },
    {
      href: "/fantasy-preview",
      label: "Avatar & Preview",
      icon: Sparkles,
      highlight: true,
    },
    {
      href: "/pricing",
      label: "CHF-Kompass",
      icon: ShieldCheck,
      highlight: false,
    },
  ];

  const getNavClass = (isHighlight: boolean, isActive: boolean) => {
    const base =
      "relative inline-flex min-h-[35px] items-center gap-1.5 whitespace-nowrap rounded-[5px] border px-3 py-1.5 text-[10px] font-medium tracking-[0.025em] transition duration-200 ";

    if (isHighlight) {
      return (
        base +
        "border-[#C8A97E]/30 bg-[#C8A97E]/[0.055] text-[#DEC393] hover:border-[#DEC393]/65 hover:bg-[#C8A97E]/10"
      );
    }

    if (isActive) {
      return (
        base +
        "border-[#C8A97E]/25 bg-[#C8A97E]/[0.06] text-[#DEC393] after:absolute after:inset-x-3 after:-bottom-[18px] after:h-px after:bg-[#DEC393]"
      );
    }

    return (
      base +
      "border-transparent text-[#8F8578] hover:bg-white/[0.025] hover:text-[#E7DCCB]"
    );
  };

  const heartClass =
    favCount > 0
      ? "fill-[#DEC393] text-[#DEC393]"
      : "text-[#A79A89]";

  return (
    <header className="sticky top-0 z-40 border-b border-[#C8A97E]/15 bg-[#070606]/90 backdrop-blur-2xl">
      <div className="h-px bg-gradient-to-r from-transparent via-[#DEC393]/55 to-transparent" />

      <div className="mx-auto flex h-[70px] max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link
            href="/"
            className="group flex min-w-0 items-center gap-3"
            aria-label="iwantsexnow.ch Startseite"
          >
            <div className="brass-button relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[5px] font-serif text-[13px] font-semibold tracking-[0.08em]">
              <span className="relative z-[1]">CH</span>
            </div>

            <div className="min-w-0">
              <div className="truncate font-serif text-[14px] font-medium tracking-[0.065em] text-[#F2EADF] sm:text-[17px]">
                IWANTSEXNOW
                <span className="text-[#C8A97E]">.CH</span>
              </div>
              <div className="mt-1 truncate text-[7px] font-medium uppercase tracking-[0.2em] text-[#776D60] sm:text-[8px]">
                Schweizer Direktverzeichnis · 0% Provision
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

        <nav
          className="hidden items-center gap-1 lg:flex"
          aria-label="Hauptnavigation"
        >
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = router.pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={getNavClass(Boolean(item.highlight), active)}
              >
                <Icon size={12} strokeWidth={1.55} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href="/favorites"
            className="ghost-button inline-flex min-h-[37px] items-center gap-1.5 rounded-[5px] px-2.5 py-1.5 text-[10px] font-medium sm:px-3"
            aria-label={"Merkliste mit " + favCount + " Einträgen"}
          >
            <Heart size={13} className={heartClass} strokeWidth={1.55} />
            <span className="hidden xl:inline">Merkliste</span>
            {favCount > 0 && (
              <span className="min-w-[18px] rounded-full border border-[#DEC393]/30 bg-[#C8A97E]/10 px-1.5 py-0.5 text-center font-mono text-[9px] tabular-nums text-[#DEC393]">
                {favCount}
              </span>
            )}
          </Link>

          <Link
            href="/register"
            className="brass-button inline-flex min-h-[37px] items-center gap-1.5 rounded-[5px] px-3 py-1.5 text-[9px] uppercase tracking-[0.065em] sm:px-3.5 sm:text-[10px]"
          >
            <PlusCircle
              size={13}
              strokeWidth={1.8}
              className="relative z-[1]"
            />
            <span className="relative z-[1] hidden sm:inline">
              + Inserat (0%)
            </span>
            <span className="relative z-[1] sm:hidden">+ Inserat</span>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default LuxuryHeader;