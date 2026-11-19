import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import { SWISS_DOORPLATE_TOKENS } from "@/lib/brand/doorplateTokens";
import offersData from "@/data/harvested-offers.json";
import clubsData from "@/data/swiss-establishments-vault.json";
import { AlpenHero } from "@/components/home/AlpenHero";
import { CantonRail } from "@/components/home/CantonRail";
import { CategoryMosaic } from "@/components/home/CategoryMosaic";
import { HowItWorksBand } from "@/components/home/HowItWorksBand";
import { ProviderBand } from "@/components/home/ProviderBand";
import { EmptyArt } from "@/components/visuals";
import type { CantonKey } from "@/components/visuals";
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

const TOTAL_CLUBS = Array.isArray(clubsData) && clubsData.length > 0 ? clubsData.length : 108;
const TOTAL_SOURCES = (() => {
  if (!Array.isArray(offersData)) return 55;
  const s = new Set<string>();
  for (const item of offersData as any[]) {
    if (item?.sourcePortal) s.add(String(item.sourcePortal).toLowerCase().trim());
  }
  return Math.max(55, s.size);
})();

const CANTON_RAIL: { code: string; key: CantonKey }[] = [
  { code: "ZG", key: "zg" },
  { code: "ZH", key: "zh" },
  { code: "LU", key: "lu" },
  { code: "BS", key: "bs" },
  { code: "BE", key: "be" },
  { code: "AG", key: "ag" },
  { code: "SG", key: "sg" },
  { code: "GE", key: "ge" },
  { code: "VD", key: "vd" },
  { code: "TI", key: "ti" },
];

const CANTON_COUNTS: Record<string, number> = (() => {
  const m: Record<string, number> = {};
  if (Array.isArray(offersData)) {
    for (const o of offersData as any[]) {
      const c = String(o?.canton || "").toUpperCase();
      if (c) m[c] = (m[c] || 0) + 1;
    }
  }
  return m;
})();

const TOTAL_PROFILES = Array.isArray(offersData) ? offersData.length : 0;

const CANTON_PILLS = [
  { code: "ALL", label: "Ganze Schweiz" },
  { code: "ZG", label: "Zug" },
  { code: "ZH", label: "Zürich" },
  { code: "LU", label: "Luzern" },
  { code: "BS", label: "Basel" },
  { code: "BE", label: "Bern" },
  { code: "AG", label: "Aargau" },
  { code: "SG", label: "St. Gallen" },
  { code: "GE", label: "Genève" },
  { code: "VD", label: "Lausanne" },
  { code: "TI", label: "Lugano" },
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


      setStudioNoir(
        localStorage.getItem("ch_studio_noir") !== "off"
      );
    } catch {}
  }, []);

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

  const noirStageClass = studioNoir
    ? "noir-stage relative aspect-[3/4] overflow-hidden"
    : "noir-stage noir-disabled relative aspect-[3/4] overflow-hidden";

  const scrollToGrid = () => {
    try {
      document.getElementById("dossiers")?.scrollIntoView({ behavior: "smooth", block: "start" });
    } catch {}
  };

  const pickCanton = (code: string) => {
    setCantonFilter(code);
    setVisibleLimit(24);
    scrollToGrid();
  };

  const pickRubric = (id: string) => {
    setRubricFilter(id);
    setVisibleLimit(24);
    scrollToGrid();
  };

  const pickVip = () => {
    setRubricFilter("ALL");
    setSortBy("price_desc");
    setVisibleLimit(24);
    scrollToGrid();
  };

  const profileCountLabel = TOTAL_PROFILES.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");

  return (
    <div className="penthouse-page min-h-screen">
      <SEO
        title="IWANTSEXNOW.CH — Schweizer Escort, Tantra & Studio Direktverzeichnis (0% Provision)"
        description={`${activeOffers.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")}+ geprüfte Schweizer Escort-, Tantra- & Studio-Profile sowie ${TOTAL_CLUBS} Clubs. Echte 30m/60m CHF-Preise & direkter +41 WhatsApp-Kontakt.`}
        url="https://iwantsexnow.ch"
      />

      <LuxuryHeader />

      <AlpenHero
        rubric={rubricFilter}
        onRubric={setRubricFilter}
        canton={cantonFilter}
        onCanton={setCantonFilter}
        freeToday={onlyAvailable4h}
        onFreeToday={setOnlyAvailable4h}
        maxRate={maxRate60}
        onMaxRate={setMaxRate60}
        onSubmit={scrollToGrid}
        cantons={CANTON_PILLS.map((c) => ({ value: c.code, label: c.label }))}
        matchCount={activeOffers.length}
        profileCount={profileCountLabel}
        clubCount={TOTAL_CLUBS}
        counts={CANTON_COUNTS}
      />

      <CantonRail
        items={CANTON_RAIL.map((c) => ({ ...c, count: CANTON_COUNTS[c.code] || 0 }))}
        active={cantonFilter}
        onPick={pickCanton}
      />

      <CategoryMosaic activeRubric={rubricFilter} onPickRubric={pickRubric} onPickVip={pickVip} />

      <main id="dossiers" className="mx-auto max-w-7xl scroll-mt-20 px-3 pb-12 pt-20 sm:px-6">
        <section className="luxury-console p-4 sm:p-5" aria-label="Filter">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="no-scrollbar flex items-center gap-2 overflow-x-auto">
              {RUBRIC_TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setRubricFilter(tab.id)}
                  aria-pressed={rubricFilter === tab.id}
                  className={"chip cursor-pointer " + (rubricFilter === tab.id ? "is-active" : "")}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="no-scrollbar mt-3 flex items-center gap-2 overflow-x-auto pb-1">
            {CANTON_PILLS.map((canton) => (
              <button
                key={canton.code}
                type="button"
                onClick={() => setCantonFilter(canton.code)}
                aria-pressed={cantonFilter === canton.code}
                className={"chip min-h-[34px] cursor-pointer text-[13px] " + (cantonFilter === canton.code ? "is-active" : "")}
              >
                {canton.label}
              </button>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_auto_190px_230px_auto_auto] xl:items-center">
            <div className="relative md:col-span-2 xl:col-span-1">
              <Search size={16} strokeWidth={1.8} className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-tinte/60" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, PLZ, Stadt oder Service"
                className="luxury-input pl-10"
                aria-label="Profile durchsuchen"
              />
            </div>

            <div className="flex min-h-[46px] items-center">
              <SwissDoorplate
                state={onlyAvailable4h ? "FREI" : "RESERVIERT"}
                roomNumber="FILTER"
                customLabel={onlyAvailable4h ? "NUR FREI · 4H" : "NUR FREI · AUS"}
                size="md"
                interactiveToggle={true}
                onToggle={(next) => setOnlyAvailable4h(next === "FREI")}
              />
            </div>

            <select
              value={maxRate60}
              onChange={(e) => setMaxRate60(Number(e.target.value))}
              className="luxury-select cursor-pointer tabular-nums"
              aria-label="Maximales 60-Minuten-Honorar"
            >
              <option value={1200}>Alle Tarife</option>
              <option value={250}>Bis CHF 250 / 60 Min.</option>
              <option value={350}>Bis CHF 350 / 60 Min.</option>
              <option value={500}>Bis CHF 500 / 60 Min.</option>
            </select>

            <div className="relative">
              <ArrowUpDown size={14} className="pointer-events-none absolute left-3.5 top-1/2 z-[1] -translate-y-1/2 text-tinte/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="luxury-select cursor-pointer pl-9 tabular-nums"
                aria-label="Sortierung"
              >
                <option value="recommended">Kuratiert ({activeOffers.length})</option>
                <option value="available">Frei in 4h</option>
                <option value="price_asc">Preis aufsteigend</option>
                <option value="price_desc">Preis absteigend</option>
              </select>
            </div>

            <button
              type="button"
              onClick={toggleStudioNoir}
              aria-pressed={studioNoir}
              className={"chip min-h-[46px] cursor-pointer justify-center " + (studioNoir ? "is-active" : "")}
            >
              <Sparkles size={14} />
              Studio-Look {studioNoir ? "an" : "aus"}
            </button>

            <button
              type="button"
              onClick={resetFilters}
              disabled={!hasActiveFilters}
              className="ghost-button flex h-[46px] w-[46px] cursor-pointer items-center justify-center disabled:cursor-default disabled:opacity-30"
              title="Filter zurücksetzen"
              aria-label="Filter zurücksetzen"
            >
              <RotateCcw size={16} strokeWidth={1.8} />
            </button>
          </div>
        </section>

        <div className="mb-5 mt-10 flex items-end justify-between gap-4 px-1">
          <h2 className="text-[clamp(1.8rem,3.6vw,2.6rem)] text-tinte">Alle Profile</h2>
          <div className="text-sm font-semibold tabular-nums text-tinte/60">
            {Math.min(visibleLimit, activeOffers.length)} von {activeOffers.length}
          </div>
        </div>

        {isLoading && (
          <div>
            <p className="mb-4 text-center text-sm text-tinte/60">
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
                        <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[#ffe48a]/35 font-serif text-base text-[#ffe48a]">
                          CH
                        </div>
                        <div className="mt-3 max-w-full truncate font-serif text-xs text-[#ffe48a]">
                          {p.rawName}
                        </div>
                        <div className="mt-1 font-mono text-[7px] uppercase tracking-[0.1em] text-[#c9b06a]">
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
                          <div className="engraved-type mx-auto line-clamp-1 font-mono text-[6px] uppercase tracking-[0.08em] text-[#ffe48a] sm:text-[7px] sm:tracking-[0.11em]">
                            {locationLine}
                          </div>

                          <div
                            title={String(p.rawName || "")}
                            className="dossier-name engraved-type mx-auto mt-1.5 min-h-[38px] font-serif text-[17px] font-medium uppercase leading-[1.08] tracking-[0.045em] text-[#ffe48a] sm:min-h-[46px] sm:text-[22px]"
                          >
                            {p.rawName}
                          </div>

                          <div className="my-2 flex items-center justify-center gap-2 text-[#ffd34d] sm:my-2.5">
                            <span className="h-px w-8 bg-gradient-to-r from-transparent to-[#ffd34d]/75 sm:w-12" />
                            <span className="text-[8px]">✦</span>
                            <span className="h-px w-8 bg-gradient-to-l from-transparent to-[#ffd34d]/75 sm:w-12" />
                          </div>

                          <div className="font-mono text-[6px] uppercase tracking-[0.22em] text-[#a9abc8] sm:text-[7px]">
                            Starting at
                          </div>
                          <div className="mt-0.5 whitespace-nowrap font-mono text-[22px] font-medium tabular-nums tracking-[-0.04em] text-[#ffe48a] sm:text-[29px]">
                            <span className="mr-1 text-[9px] font-normal tracking-[0.04em] sm:text-[11px]">
                              CHF
                            </span>
                            {p.rate60Chf}
                          </div>
                          <div className="mt-1 font-mono text-[6px] uppercase tracking-[0.08em] text-[#a9abc8] sm:text-[7px]">
                            Per hour · 30 min: CHF {p.rate30Chf}
                          </div>
                        </div>
                      </Link>

                      <div className="pointer-events-none absolute left-2.5 top-2.5 z-20 flex max-w-[78%] items-center gap-1.5">
                        <Crown
                          size={13}
                          strokeWidth={1.4}
                          className="shrink-0 text-[#ffe48a] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
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
                              ? "fill-[#ffe48a] text-[#ffe48a]"
                              : "text-[#ffe48a]"
                          }
                        />
                      </button>

                      {p.isVerif && (
                        <div className="absolute bottom-2 right-2 z-20 hidden text-[#ffe48a] sm:block">
                          <ShieldCheck size={12} strokeWidth={1.4} />
                        </div>
                      )}
                    </div>

                    <div className="relative z-[5] mt-auto grid grid-cols-2 gap-1.5 border-t border-[#ffe48a]/20 bg-[#1e2247] p-2">
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
          <section className="empty-state px-6 py-14 text-center">
            <EmptyArt className="mx-auto w-56" />
            <h2 className="mt-6 text-2xl text-tinte">
              Keine Treffer für diese Auswahl.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-base leading-7 text-tinte/75">
              {searchQuery.trim()
                ? SWISS_DOORPLATE_TOKENS.microcopyDe.zeroSearch
                : SWISS_DOORPLATE_TOKENS.microcopyDe.emptyFilter}
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="brass-button mt-6 inline-flex min-h-[48px] cursor-pointer items-center gap-2 px-6 text-sm"
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
              className="ghost-button group inline-flex min-h-[50px] cursor-pointer items-center gap-3 px-7 py-3 text-sm font-semibold"
            >
              +24 weitere Dossiers
              <span className="text-xs tabular-nums text-tinte/60">
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

      <HowItWorksBand />
      <ProviderBand />
    </div>
  );
}