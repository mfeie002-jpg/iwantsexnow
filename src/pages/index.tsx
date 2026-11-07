import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import { SWISS_DOORPLATE_TOKENS } from "@/lib/brand/doorplateTokens";
import offersData from "@/data/harvested-offers.json";
import clubsData from "@/data/swiss-establishments-vault.json";
import {
  Search,
  Heart,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  PhoneCall,
  Crown,
  User,
  ArrowRight,
} from "lucide-react";

type DesignTheme = "audemars" | "velvet" | "vogue";

const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 108;
const TOTAL_SOURCES = (() => {
  if (!Array.isArray(offersData)) return 55;
  const s = new Set<string>();
  for (const item of offersData as any[]) {
    if (item?.sourcePortal) s.add(String(item.sourcePortal).toLowerCase().trim());
  }
  return Math.max(55, s.size);
})();

const CANTON_PILLS = [
  { code: "ALL", label: "CH · Alle" },
  { code: "ZG", label: "ZG · Zug" },
  { code: "ZH", label: "ZH · Zürich" },
  { code: "LU", label: "LU · Luzern" },
  { code: "BS", label: "BS · Basel" },
  { code: "BE", label: "BE · Bern" },
  { code: "AG", label: "AG · Aargau" },
  { code: "SG", label: "SG · St. Gallen" },
  { code: "GE", label: "GE · Genève" },
  { code: "VD", label: "VD · Lausanne" },
  { code: "TI", label: "TI · Lugano" },
];

const RUBRIC_TABS = [
  { id: "ALL", label: "Alle" },
  { id: "female", label: "Escort & GFE" },
  { id: "massage", label: "Tantra & Massage" },
  { id: "bdsm", label: "Domina & BDSM" },
  { id: "trans", label: "Trans VIP" },
];

function rubricTitle(rubric: string) {
  if (rubric === "massage") return "TANTRA & MASSAGE";
  if (rubric === "bdsm") return "DOMINA & BDSM";
  if (rubric === "trans") return "TRANS VIP";
  return "ELITE COMPANION";
}

export default function HomePage() {
  const [designTheme, setDesignTheme] =
    useState<DesignTheme>("audemars");
  const [serverStates, setServerStates] = useState<Record<string, any>>(
    {}
  );
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);

  const [cantonFilter, setCantonFilter] = useState<string>("ALL");
  const [rubricFilter, setRubricFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyAvailable4h, setOnlyAvailable4h] =
    useState<boolean>(false);
  const [maxRate60, setMaxRate60] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<
    "recommended" | "available" | "price_asc" | "price_desc"
  >("recommended");
  const [visibleLimit, setVisibleLimit] = useState<number>(24);
  const [studioNoir, setStudioNoir] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) {
          setBlockedIds(d.blockedIds);
        }
      })
      .catch(() => {})
      .then(() => setIsLoading(false));

    try {
      const saved = JSON.parse(
        localStorage.getItem("ch_favorite_profiles") || "[]"
      );
      if (Array.isArray(saved)) setFavIds(saved);

      const savedTheme = localStorage.getItem(
        "ch_luxury_theme"
      ) as DesignTheme;

      if (
        savedTheme === "audemars" ||
        savedTheme === "velvet" ||
        savedTheme === "vogue"
      ) {
        setDesignTheme(savedTheme);
      }

      setStudioNoir(
        localStorage.getItem("ch_studio_noir") !== "off"
      );
    } catch {}
  }, []);

  const switchTheme = (t: DesignTheme) => {
    setDesignTheme(t);
    try {
      localStorage.setItem("ch_luxury_theme", t);
    } catch {}
  };

  const toggleStudioNoir = () => {
    const next = !studioNoir;
    setStudioNoir(next);
    try {
      localStorage.setItem(
        "ch_studio_noir",
        next ? "on" : "off"
      );
    } catch {}
  };

  const toggleFav = (id: string) => {
    const next = favIds.includes(id)
      ? favIds.filter((x) => x !== id)
      : [id, ...favIds];
    setFavIds(next);

    try {
      localStorage.setItem(
        "ch_favorite_profiles",
        JSON.stringify(next)
      );
      window.dispatchEvent(new Event("ch-favorites-updated"));
    } catch {}
  };

  const activeOffers = useMemo(() => {
    const blocked = new Set(blockedIds);
    const raw = (offersData as any[]) || [];
    const list: any[] = [];

    for (const o of raw) {
      const pid = o.id || o.dedupClusterId;
      if (!pid || blocked.has(pid)) continue;

      const st = serverStates[pid] || {};
      if (st.paused || st.hidden || st.removedByReport) continue;

      const r60 = Math.max(
        100,
        Math.min(
          1200,
          Number(st.rate60Chf || o.advertisedBaseChf) || 350
        )
      );
      const r30 = Math.max(
        80,
        Math.min(
          800,
          Number(st.rate30Chf || o.rate30Chf) ||
            Math.round((r60 * 0.6) / 10) * 10
        )
      );
      const isAvail = Boolean(
        st.availabilityConfirmed || o.availabilityConfirmed
      );
      const isVerif = Boolean(
        st.identityVerified || o.identityVerified
      );
      const isFeatured = Boolean(st.featured);

      const rawThumb = String(o.thumbnail || "").trim();
      const hasRealPhoto =
        rawThumb.startsWith("http") &&
        !rawThumb.includes("unsplash.com") &&
        !rawThumb.includes("placeholder") &&
        !rawThumb.includes("escort-portrait") &&
        !rawThumb.endsWith(".svg");

      if (
        cantonFilter !== "ALL" &&
        String(o.canton || "").toUpperCase() !== cantonFilter
      ) {
        continue;
      }

      if (
        rubricFilter !== "ALL" &&
        (o.rubric || "female") !== rubricFilter
      ) {
        continue;
      }

      if (onlyAvailable4h && !isAvail) continue;
      if (r60 > maxRate60) continue;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = [
          o.rawName,
          o.city,
          o.canton,
          o.postalCode,
          ...(o.includedTags || []),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        if (!hay.includes(q)) continue;
      }

      list.push({
        ...o,
        id: pid,
        rate60Chf: r60,
        rate30Chf: r30,
        isAvail,
        isVerif,
        isFeatured,
        hasRealPhoto,
        cleanThumb: rawThumb.replace(
          /[?&]iwsn_clean=1.*$/i,
          ""
        ),
      });
    }

    list.sort((a, b) => {
      if (a.hasRealPhoto !== b.hasRealPhoto) {
        return a.hasRealPhoto ? -1 : 1;
      }

      if (sortBy === "available") {
        if (a.isAvail !== b.isAvail) return a.isAvail ? -1 : 1;
        return a.rate60Chf - b.rate60Chf;
      }

      if (sortBy === "price_asc") {
        return a.rate60Chf - b.rate60Chf;
      }

      if (sortBy === "price_desc") {
        return b.rate60Chf - a.rate60Chf;
      }

      const scoreA =
        (a.isFeatured ? 800 : 0) +
        (a.isAvail ? 450 : 0) +
        (a.isVerif ? 250 : 0) +
        Number(a.curationScore || 75);
      const scoreB =
        (b.isFeatured ? 800 : 0) +
        (b.isAvail ? 450 : 0) +
        (b.isVerif ? 250 : 0) +
        Number(b.curationScore || 75);

      return scoreB - scoreA;
    });

    return list;
  }, [
    serverStates,
    blockedIds,
    cantonFilter,
    rubricFilter,
    searchQuery,
    onlyAvailable4h,
    maxRate60,
    sortBy,
  ]);

  const resetFilters = () => {
    setCantonFilter("ALL");
    setRubricFilter("ALL");
    setSearchQuery("");
    setOnlyAvailable4h(false);
    setMaxRate60(1200);
    setSortBy("recommended");
  };

  const hasActiveFilters =
    cantonFilter !== "ALL" ||
    rubricFilter !== "ALL" ||
    Boolean(searchQuery) ||
    onlyAvailable4h ||
    maxRate60 < 1200;

  const pageClass =
    designTheme === "velvet"
      ? "penthouse-page min-h-screen pb-16 text-[#FAF3E8]"
      : designTheme === "vogue"
      ? "penthouse-page min-h-screen pb-16 text-[#F5F0E8]"
      : "penthouse-page min-h-screen pb-16 text-[#F2EADF]";

  const consoleClass =
    designTheme === "vogue"
      ? "luxury-console rounded-[8px]"
      : designTheme === "velvet"
      ? "luxury-console rounded-[18px]"
      : "luxury-console rounded-[12px]";

  const noirStageClass = studioNoir
    ? "noir-stage relative aspect-[3/4] overflow-hidden"
    : "noir-stage noir-disabled relative aspect-[3/4] overflow-hidden";

  const getEditionClass = (edition: DesignTheme) => {
    const active = designTheme === edition;
    return active
      ? "shrink-0 cursor-pointer rounded-full border border-[#C8A97E]/45 bg-[#C8A97E]/10 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#DEC393]"
      : "shrink-0 cursor-pointer rounded-full border border-transparent px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.08em] text-[#71675B] transition hover:text-[#C8A97E]";
  };

  return (
    <div className={pageClass} data-edition={designTheme}>
      <SEO
        title="IWANTSEXNOW.CH — Schweizer Escort, Tantra & Studio Direktverzeichnis (0% Provision)"
        description={`${activeOffers.length.toLocaleString("de-CH")}+ geprüfte Schweizer Escort-, Tantra- & Studio-Profile sowie ${TOTAL_CLUBS} Clubs. Echte 30m/60m CHF-Preise & direkter +41 WhatsApp-Kontakt.`}
        url="https://iwantsexnow.ch"
      />

      <LuxuryHeader />

      <main className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-6 sm:pt-6">
        <section className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <span className="h-px w-7 bg-[#C8A97E]/65" />
              <span className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#C8A97E]">
                Private Swiss Index · {TOTAL_SOURCES} Quellen
              </span>
            </div>
            <h1 className="mt-2 font-serif text-[25px] font-normal leading-tight tracking-[0.015em] text-[#F2EADF] sm:text-[34px]">
              Die Schweiz.{" "}
              <span className="brass-text italic">
                Diskret kuratiert.
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[8px] uppercase tracking-[0.08em] text-[#746A5D]">
            <span className="inline-flex items-center gap-1.5 text-[#9BC7B2]">
              <ShieldCheck size={12} />
              0% Agentur-Provision
            </span>
            <span>Direkter +41 Kontakt</span>
            <span className="tabular-nums text-[#C8A97E]">
              {activeOffers.length.toLocaleString("de-CH")} Dossiers · {TOTAL_CLUBS} Clubs
            </span>
          </div>
        </section>

        <div className="no-scrollbar mb-3 flex items-center justify-between gap-3 overflow-x-auto border-y border-white/[0.045] py-2">
          <div className="flex items-center gap-1">
            <span className="mr-1 shrink-0 font-mono text-[8px] uppercase tracking-[0.15em] text-[#61584E]">
              Atelier
            </span>
            <button
              type="button"
              onClick={() => switchTheme("audemars")}
              className={getEditionClass("audemars")}
            >
              01 · Bahnhofstrasse
            </button>
            <button
              type="button"
              onClick={() => switchTheme("velvet")}
              className={getEditionClass("velvet")}
            >
              02 · Velvet Noir
            </button>
            <button
              type="button"
              onClick={() => switchTheme("vogue")}
              className={getEditionClass("vogue")}
            >
              03 · Editorial
            </button>
          </div>

          <Link
            href="/fantasy-preview"
            className="inline-flex shrink-0 items-center gap-1.5 text-[9px] font-medium text-[#C8A97E] transition hover:text-[#DEC393]"
          >
            <Sparkles size={11} />
            Voice-Avatar & 5s Preview
            <ArrowRight size={11} />
          </Link>
        </div>

        <section
          className={consoleClass}
          aria-label="Steuer- und Filter-Cockpit"
        >
          <div className="flex flex-col gap-2 border-b border-white/[0.055] p-2.5 xl:flex-row xl:items-center xl:justify-between">
            <div className="no-scrollbar flex items-center gap-1 overflow-x-auto">
              {RUBRIC_TABS.map((tab) => {
                const active = rubricFilter === tab.id;
                const tabClass = active
                  ? "min-h-[33px] shrink-0 cursor-pointer rounded-[5px] border border-[#DEC393]/35 bg-[linear-gradient(135deg,rgba(222,195,147,0.18),rgba(135,102,51,0.1))] px-3.5 py-1.5 text-[10px] font-medium text-[#DEC393] shadow-[inset_0_1px_0_rgba(255,245,220,0.1)]"
                  : "min-h-[33px] shrink-0 cursor-pointer rounded-[5px] border border-transparent px-3.5 py-1.5 text-[10px] font-medium text-[#81776A] transition hover:bg-white/[0.025] hover:text-[#D7C9B5]";

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setRubricFilter(tab.id)}
                    className={tabClass}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden items-center gap-2 font-mono text-[8px] uppercase tracking-[0.1em] text-[#6E6458] xl:flex">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10B981] shadow-[0_0_8px_rgba(16,185,129,0.45)]" />
              Live Schweizer Index
            </div>
          </div>

          <div className="no-scrollbar flex items-center gap-1.5 overflow-x-auto border-b border-white/[0.045] px-2.5 py-2.5">
            {CANTON_PILLS.map((canton) => {
              const active = cantonFilter === canton.code;
              const pillClass = active
                ? "min-h-[28px] shrink-0 cursor-pointer rounded-full border border-[#DEC393]/55 bg-[#C8A97E]/10 px-3 py-1 font-mono text-[9px] tabular-nums text-[#DEC393]"
                : "min-h-[28px] shrink-0 cursor-pointer rounded-full border border-white/[0.065] bg-black/20 px-3 py-1 font-mono text-[9px] tabular-nums text-[#7E7467] transition hover:border-[#C8A97E]/35 hover:text-[#C8A97E]";

              return (
                <button
                  key={canton.code}
                  type="button"
                  onClick={() => setCantonFilter(canton.code)}
                  className={pillClass}
                >
                  {canton.label}
                </button>
              );
            })}
          </div>

          <div className="grid gap-2 p-2.5 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_auto_180px_225px_auto_auto] xl:items-center">
            <div className="relative md:col-span-2 xl:col-span-1">
              <Search
                size={14}
                strokeWidth={1.5}
                className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-[#C8A97E]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="PLZ, Stadt, Name oder Service"
                className="luxury-input pl-9"
                aria-label="Dossiers durchsuchen"
              />
            </div>

            <div className="flex min-h-[42px] items-center">
              <SwissDoorplate
                state={onlyAvailable4h ? "FREI" : "RESERVIERT"}
                roomNumber="FILTER"
                customLabel={
                  onlyAvailable4h ? "NUR FREI · 4H" : "NUR FREI · AUS"
                }
                size="md"
                interactiveToggle={true}
                onToggle={(next) =>
                  setOnlyAvailable4h(next === "FREI")
                }
              />
            </div>

            <select
              value={maxRate60}
              onChange={(e) =>
                setMaxRate60(Number(e.target.value))
              }
              className="luxury-select cursor-pointer font-mono tabular-nums"
              aria-label="Maximales 60-Minuten-Honorar"
            >
              <option value={1200}>CHF · ALLE TARIFE</option>
              <option value={250}>MAX. CHF 250 / 60M</option>
              <option value={350}>MAX. CHF 350 / 60M</option>
              <option value={500}>MAX. CHF 500 / 60M</option>
            </select>

            <div className="relative">
              <ArrowUpDown
                size={12}
                className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-[#C8A97E]"
              />
              <select
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as any)
                }
                className="luxury-select cursor-pointer pl-8 font-mono tabular-nums"
                aria-label="Sortierung"
              >
                <option value="recommended">
                  KURATIERT ({activeOffers.length})
                </option>
                <option value="available">FREI · 4H LIVE</option>
                <option value="price_asc">CHF AUFSTEIGEND</option>
                <option value="price_desc">CHF ABSTEIGEND</option>
              </select>
            </div>

            <button
              type="button"
              onClick={toggleStudioNoir}
              aria-pressed={studioNoir}
              className={
                studioNoir
                  ? "inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[6px] border border-[#C8A97E]/40 bg-[#C8A97E]/[0.07] px-3 font-mono text-[8px] uppercase tracking-[0.08em] text-[#DEC393]"
                  : "ghost-button inline-flex min-h-[42px] cursor-pointer items-center justify-center gap-2 rounded-[6px] px-3 font-mono text-[8px] uppercase tracking-[0.08em]"
              }
            >
              <Sparkles size={12} />
              Studio Noir {studioNoir ? "On" : "Off"}
            </button>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="ghost-button flex h-[42px] w-[42px] cursor-pointer items-center justify-center rounded-[6px] disabled:cursor-default disabled:opacity-30"
              title="Filter zurücksetzen"
              aria-label="Filter zurücksetzen"
            >
              <RotateCcw size={14} strokeWidth={1.5} />
            </button>
          </div>
        </section>

        <div className="mb-4 mt-7 flex items-end justify-between gap-4 px-1">
          <div>
            <div className="font-mono text-[8px] uppercase tracking-[0.22em] text-[#8F7958]">
              La sélection
            </div>
            <h2 className="mt-1 font-serif text-xl font-normal text-[#E9DFD0]">
              Private Dossiers
            </h2>
          </div>
          <div className="font-mono text-[8px] tabular-nums text-[#6F6559]">
            {Math.min(visibleLimit, activeOffers.length)} /{" "}
            {activeOffers.length}
          </div>
        </div>

        {isLoading && (
          <div>
            <p className="mb-4 text-center font-mono text-[9px] text-[#8E806E]">
              {SWISS_DOORPLATE_TOKENS.microcopyDe.loadingState}
            </p>
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="lux-skeleton skeleton-card"
                  aria-label="Dossier wird geladen"
                />
              ))}
            </section>
          </div>
        )}

        {!isLoading && (
          <section className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4">
            {activeOffers
              .slice(0, visibleLimit)
              .map((p: any, idx: number) => {
                const isFav = favIds.includes(p.id);
                const cleanDigits = p.rawPhone
                  ? String(p.rawPhone).replace(/\D/g, "")
                  : "";
                const portalBadge = String(
                  p.sourcePortal || "CH-DIREKT"
                ).replace(/^www\./, "");
                const profileHref =
                  "/profile/" + encodeURIComponent(p.id);
                const whatsAppHref =
                  "https://wa.me/" +
                  cleanDigits +
                  "?text=" +
                  encodeURIComponent(
                    "Hallo " +
                      p.rawName +
                      ", ich habe dein Dossier auf iwantsexnow.ch (" +
                      p.city +
                      ") gesehen."
                  );
                const locationLine =
                  "• " +
                  String(p.city || "SCHWEIZ").toUpperCase() +
                  " (" +
                  String(p.canton || "CH").toUpperCase() +
                  ") · " +
                  rubricTitle(String(p.rubric || "female")) +
                  " •";

                return (
                  <article
                    key={p.id}
                    className="valentina-card group flex flex-col overflow-hidden"
                  >
                    <div className={noirStageClass}>
                      <div className="photo-fallback">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#C8A97E]/35 font-serif text-base text-[#C8A97E]">
                          CH
                        </div>
                        <div className="mt-3 max-w-full truncate font-serif text-xs text-[#D8CCBA]">
                          {p.rawName}
                        </div>
                        <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-[#7E6C52]">
                          Original-Fotos im Dossier
                        </div>
                      </div>

                      <Link
                        href={profileHref}
                        className="absolute inset-0 z-[1] block"
                        aria-label={
                          "Dossier von " + String(p.rawName) + " öffnen"
                        }
                      >
                        {p.hasRealPhoto && (
                          <img
                            referrerPolicy="no-referrer"
                            src={p.cleanThumb}
                            alt={String(p.rawName || "Profil")}
                            loading={idx < 8 ? "eager" : "lazy"}
                            onError={(e) => {
                              const target =
                                e.currentTarget as HTMLImageElement;
                              target.style.opacity = "0";
                            }}
                            className="noir-media scale-[1.06] object-cover object-top"
                          />
                        )}

                        <div className="noir-vignette" />
                        <div className="noir-floor" />

                        <div className="absolute inset-x-0 bottom-0 z-[4] px-2.5 pb-3 text-center sm:px-4 sm:pb-4">
                          <div className="engraved-type mx-auto line-clamp-1 font-mono text-[6px] uppercase tracking-[0.08em] text-[#B5A184] sm:text-[7px] sm:tracking-[0.11em]">
                            {locationLine}
                          </div>

                          <div
                            title={String(p.rawName || "")}
                            className="dossier-name engraved-type mx-auto mt-1.5 min-h-[38px] font-serif text-[17px] font-medium uppercase leading-[1.08] tracking-[0.045em] text-[#F5EDE0] sm:min-h-[46px] sm:text-[22px]"
                          >
                            {p.rawName}
                          </div>

                          <div className="my-2 flex items-center justify-center gap-2 text-[#B38E52] sm:my-2.5">
                            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#B38E52]/75 sm:w-12" />
                            <span className="text-[8px]">✦</span>
                            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#B38E52]/75 sm:w-12" />
                          </div>

                          <div className="font-mono text-[6px] uppercase tracking-[0.22em] text-[#8C7C66] sm:text-[7px]">
                            Starting at
                          </div>
                          <div className="mt-0.5 whitespace-nowrap font-mono text-[22px] font-medium tabular-nums tracking-[-0.04em] text-[#DEC393] sm:text-[29px]">
                            <span className="mr-1 text-[9px] font-normal tracking-[0.04em] sm:text-[11px]">
                              CHF
                            </span>
                            {p.rate60Chf}
                          </div>
                          <div className="mt-1 font-mono text-[6px] uppercase tracking-[0.08em] text-[#928575] sm:text-[7px]">
                            Per hour · 30 min: CHF {p.rate30Chf}
                          </div>
                        </div>
                      </Link>

                      <div className="pointer-events-none absolute left-2.5 top-2.5 z-20 flex max-w-[78%] items-center gap-1.5">
                        <Crown
                          size={13}
                          strokeWidth={1.4}
                          className="shrink-0 text-[#DEC393] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                        />
                        <SwissDoorplate
                          state={p.isAvail ? "FREI" : "EXTERN"}
                          roomNumber={String(p.canton || "CH")}
                          customLabel={
                            p.isAvail
                              ? "FREI · LIVE"
                              : portalBadge
                                  .slice(0, 12)
                                  .toUpperCase()
                          }
                          size="sm"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleFav(p.id)}
                        className="glass-icon-button absolute right-2.5 top-2.5 z-30 h-8 w-8 cursor-pointer sm:h-9 sm:w-9"
                        aria-label={
                          isFav
                            ? "Von Merkliste entfernen"
                            : "Auf Merkliste speichern"
                        }
                      >
                        <Heart
                          size={13}
                          strokeWidth={1.5}
                          className={
                            isFav
                              ? "fill-[#DEC393] text-[#DEC393]"
                              : "text-[#D0C4B3]"
                          }
                        />
                      </button>

                      {p.isVerif && (
                        <div className="absolute bottom-2 right-2 z-20 hidden text-[#C8A97E] sm:block">
                          <ShieldCheck size={12} strokeWidth={1.4} />
                        </div>
                      )}
                    </div>

                    <div className="relative z-[5] mt-auto grid grid-cols-2 gap-1.5 border-t border-[#C8A97E]/15 bg-[#0B0908] p-2">
                      {cleanDigits ? (
                        <a
                          href={whatsAppHref}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="brass-pill inline-flex min-h-[39px] items-center justify-center gap-1 rounded-full px-1.5 font-mono text-[7px] uppercase tracking-[0.035em] sm:min-h-[42px] sm:gap-1.5 sm:text-[9px]"
                        >
                          <PhoneCall
                            size={11}
                            className="relative z-[1]"
                          />
                          <span className="relative z-[1]">
                            WhatsApp
                          </span>
                        </a>
                      ) : (
                        <Link
                          href={
                            "/fantasy-preview?id=" +
                            encodeURIComponent(p.id)
                          }
                          className="brass-pill inline-flex min-h-[39px] items-center justify-center gap-1 rounded-full px-1.5 font-mono text-[7px] uppercase tracking-[0.035em] sm:min-h-[42px] sm:text-[9px]"
                        >
                          <Sparkles
                            size={11}
                            className="relative z-[1]"
                          />
                          <span className="relative z-[1]">
                            KI-Preview
                          </span>
                        </Link>
                      )}

                      <Link
                        href={profileHref}
                        className="emerald-pill inline-flex min-h-[39px] items-center justify-center gap-1 rounded-full px-1.5 font-mono text-[7px] uppercase tracking-[0.025em] sm:min-h-[42px] sm:gap-1.5 sm:text-[8px]"
                      >
                        <User size={11} strokeWidth={1.5} />
                        <span>View Profile</span>
                      </Link>
                    </div>
                  </article>
                );
              })}
          </section>
        )}

        {!isLoading && activeOffers.length === 0 && (
          <section className="empty-state rounded-[18px] px-6 py-14 text-center">
            <SwissDoorplate
              state="BESETZT"
              roomNumber="00"
              customLabel="KEIN TREFFER"
              size="lg"
            />
            <h2 className="mt-5 font-serif text-2xl font-normal text-[#E5DACA]">
              Diskretion hat ihre Grenzen.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-xs font-light leading-6 text-[#8E8273]">
              {searchQuery.trim()
                ? SWISS_DOORPLATE_TOKENS.microcopyDe.zeroSearch
                : SWISS_DOORPLATE_TOKENS.microcopyDe.emptyFilter}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="brass-button mt-6 inline-flex min-h-[42px] cursor-pointer items-center gap-2 rounded-full px-5 text-[10px] uppercase tracking-[0.07em]"
            >
              <RotateCcw size={13} className="relative z-[1]" />
              <span className="relative z-[1]">
                Filter zurücksetzen
              </span>
            </button>
          </section>
        )}

        {!isLoading && visibleLimit < activeOffers.length && (
          <div className="pt-9 text-center">
            <button
              type="button"
              onClick={() =>
                setVisibleLimit((prev) => prev + 24)
              }
              className="ghost-button group inline-flex min-h-[46px] cursor-pointer items-center gap-3 rounded-full px-6 py-3 font-mono text-[9px] uppercase tracking-[0.09em]"
            >
              +24 weitere Dossiers
              <span className="font-mono text-[8px] tabular-nums text-[#746857]">
                {activeOffers.length - visibleLimit} verbleibend
              </span>
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        )}
      </main>
    </div>
  );
}