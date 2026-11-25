import React, { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HeroArches, CityPlates, Steps, TrustBand, cleanName, avatarGradient } from "@/components/ds";
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
      ? "penthouse-page min-h-screen pb-16 text-[#fbf1ec]"
      : designTheme === "vogue"
      ? "penthouse-page min-h-screen pb-16 text-[#fbf1ec]"
      : "penthouse-page min-h-screen pb-16 text-[#fbf1ec]";

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
      ? "shrink-0 cursor-pointer rounded-full border border-[#e8c98a]/45 bg-[#d6165f]/10 px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-[#e8c98a]"
      : "shrink-0 cursor-pointer rounded-full border border-transparent px-3 py-1.5 font-mono text-xs uppercase tracking-[0.08em] text-[#cdb5be] transition hover:text-[#e8c98a]";
  };

  return (
    <div className={pageClass} data-edition={designTheme}>
      <SEO
        title="IWANTSEXNOW.CH — Schweizer Escort, Tantra & Studio Direktverzeichnis (0% Provision)"
        description={`${activeOffers.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")}+ geprüfte Schweizer Escort-, Tantra- & Studio-Profile sowie ${TOTAL_CLUBS} Clubs. Echte 30m/60m CHF-Preise & direkter +41 WhatsApp-Kontakt.`}
        url="https://iwantsexnow.ch"
      />

      <LuxuryHeader />

      <main className="mx-auto max-w-7xl px-3 pb-8 pt-4 sm:px-6 sm:pt-6">
        <section className="relative mb-10 grid items-center gap-10 py-6 lg:grid-cols-[1.1fr_0.9fr] lg:py-12">
          <div>
            <p className="font-serif text-2xl italic text-[#e8c98a]">Schön, dass du da bist.</p>
            <h1 className="mt-3 font-serif text-[56px] leading-[0.98] text-[#fbf1ec] sm:text-[84px]">
              Wen suchst du <em className="text-[#e8c98a]">heute?</em>
            </h1>
            <p className="mt-6 max-w-md text-xl leading-relaxed text-[#cdb5be]">
              {activeOffers.length.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'")} echte Profile aus der ganzen Schweiz.
              Ehrliche Preise, direkter Kontakt, keine Provision.
            </p>
            <a
              href="#suche"
              className="brass-button mt-8 inline-flex min-h-[60px] items-center rounded-full px-10 text-[17px]"
            >
              Los geht's
            </a>
          </div>
          <HeroArches className="hidden sm:block" />
        </section>

        <section
          id="suche"
          className="mb-12 scroll-mt-24 rounded-[28px] border border-[#3d2231] bg-[#22101a] p-6 shadow-[0_1px_2px_rgba(0,0,0,0.25),0_16px_40px_rgba(0,0,0,0.28)] sm:p-9"
          aria-label="Suche"
        >
          <div className="grid gap-9">
            <div className="grid gap-3">
              <h2 className="font-serif text-3xl text-[#fbf1ec]">1 · Wo bist du?</h2>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Stadt, PLZ oder Name"
                  className="luxury-input"
                  aria-label="Stadt, PLZ oder Name"
                />
              </div>
              <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
                {CANTON_PILLS.map((canton) => {
                  const active = cantonFilter === canton.code;
                  return (
                    <button
                      key={canton.code}
                      type="button"
                      onClick={() => setCantonFilter(canton.code)}
                      aria-pressed={active}
                      className={
                        "min-h-[44px] shrink-0 cursor-pointer rounded-full border px-5 text-[15px] font-semibold transition " +
                        (active
                          ? "border-[#e8c98a] bg-[#e8c98a] text-[#2a1408]"
                          : "border-[#947683] text-[#fbf1ec] hover:border-[#e8c98a] hover:text-[#e8c98a]")
                      }
                    >
                      {canton.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3">
              <h2 className="font-serif text-3xl text-[#fbf1ec]">2 · Wann hast du Zeit?</h2>
              <div className="flex flex-wrap gap-2">
                {[
                  { id: true, label: "Jetzt frei" },
                  { id: false, label: "Egal" },
                ].map((o) => {
                  const active = onlyAvailable4h === o.id;
                  return (
                    <button
                      key={o.label}
                      type="button"
                      onClick={() => setOnlyAvailable4h(o.id)}
                      aria-pressed={active}
                      className={
                        "min-h-[44px] cursor-pointer rounded-full border px-5 text-[15px] font-semibold transition " +
                        (active
                          ? "border-[#e8c98a] bg-[#e8c98a] text-[#2a1408]"
                          : "border-[#947683] text-[#fbf1ec] hover:border-[#e8c98a] hover:text-[#e8c98a]")
                      }
                    >
                      {o.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid gap-3">
              <h2 className="font-serif text-3xl text-[#fbf1ec]">3 · Wonach ist dir?</h2>
              <div className="flex flex-wrap gap-2">
                {RUBRIC_TABS.map((tab) => {
                  const active = rubricFilter === tab.id;
                  return (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setRubricFilter(tab.id)}
                      aria-pressed={active}
                      className={
                        "min-h-[44px] cursor-pointer rounded-full border px-5 text-[15px] font-semibold transition " +
                        (active
                          ? "border-[#e8c98a] bg-[#e8c98a] text-[#2a1408]"
                          : "border-[#947683] text-[#fbf1ec] hover:border-[#e8c98a] hover:text-[#e8c98a]")
                      }
                    >
                      {tab.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#3d2231] pt-6">
              <div className="flex flex-wrap items-center gap-4 text-[#cdb5be]">
                <span>{activeOffers.length} Profile passen zu dir</span>
                <details className="group relative">
                  <summary className="cursor-pointer list-none text-[#e8c98a] underline underline-offset-4">Mehr Optionen</summary>
                  <div className="absolute left-0 top-9 z-20 grid w-72 gap-3 rounded-[24px] border border-[#3d2231] bg-[#2b1420] p-5 shadow-[0_28px_60px_rgba(0,0,0,0.5)]">
                    <label className="grid gap-1 text-[15px] font-semibold text-[#fbf1ec]">
                      Dein Budget
                      <select value={maxRate60} onChange={(e) => setMaxRate60(Number(e.target.value))} className="luxury-select">
                        <option value={1200}>Egal</option>
                        <option value={250}>bis CHF 250</option>
                        <option value={350}>bis CHF 350</option>
                        <option value={500}>bis CHF 500</option>
                      </select>
                    </label>
                    <label className="grid gap-1 text-[15px] font-semibold text-[#fbf1ec]">
                      Sortierung
                      <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)} className="luxury-select">
                        <option value="recommended">Unsere Empfehlung</option>
                        <option value="available">Jetzt frei</option>
                        <option value="price_asc">Günstigste zuerst</option>
                        <option value="price_desc">Teuerste zuerst</option>
                      </select>
                    </label>
                  </div>
                </details>
                {hasActiveFilters && (
                  <button type="button" onClick={resetFilters} className="cursor-pointer text-[#e8c98a] underline underline-offset-4">
                    Zurücksetzen
                  </button>
                )}
              </div>
              <a href="#profile" className="brass-button inline-flex min-h-[60px] items-center rounded-full px-10 text-[17px]">
                Zeig mir die Profile
              </a>
            </div>
          </div>
        </section>

        <div id="profile" className="mb-6 flex scroll-mt-24 items-end justify-between gap-4 px-1">
          <h2 className="font-serif text-4xl text-[#fbf1ec] sm:text-5xl">
            Profile <em className="text-[#e8c98a]">für dich</em>
          </h2>
          <div className="text-base text-[#cdb5be]">
            {Math.min(visibleLimit, activeOffers.length)} von {activeOffers.length}
          </div>
        </div>

        {isLoading && (
          <div>
            <p className="mb-4 text-center text-[#cdb5be]">Einen Moment, wir holen die Profile …</p>
            <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 8 }).map((_, index) => (
                <div
                  key={index}
                  className="lux-skeleton skeleton-card"
                  aria-label="Profil wird geladen"
                />
              ))}
            </section>
          </div>
        )}

        {!isLoading && (
          <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
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
                    className="valentina-card group flex flex-col p-2.5 text-center"
                  >
                    <div className="arch">
                      <div
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ background: avatarGradient(String(p.id)) }}
                      >
                        <span className="font-serif text-7xl text-white/90">
                          {cleanName(p.rawName).charAt(0).toUpperCase() || "·"}
                        </span>
                      </div>

                      <Link
                        href={profileHref}
                        className="absolute inset-0 z-[1] block"
                        aria-label={"Profil von " + (cleanName(p.rawName) || "Profil") + " öffnen"}
                      >
                        {p.hasRealPhoto && (
                          <img
                            referrerPolicy="no-referrer"
                            src={p.cleanThumb}
                            alt={cleanName(p.rawName) || ("Profil in " + (String(p.city || "der Schweiz").split("/")[0]))}
                            loading={idx < 8 ? "eager" : "lazy"}
                            onError={(e) => {
                              (e.currentTarget as HTMLImageElement).style.opacity = "0";
                            }}
                            className="h-full w-full object-cover object-top transition duration-700 group-hover:scale-105"
                          />
                        )}
                      </Link>

                      {p.isAvail && (
                        <span className="pointer-events-none absolute bottom-3 left-1/2 z-10 inline-flex -translate-x-1/2 items-center gap-2 rounded-full bg-[#13362b] px-3.5 py-1.5 text-sm font-semibold text-[#fbf1ec]">
                          <span className="h-2 w-2 rounded-full bg-[#5fd3a5]" />
                          Jetzt frei
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={() => toggleFav(p.id)}
                        className="absolute right-4 top-14 z-20 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#150810]/70 backdrop-blur transition hover:bg-[#150810]"
                        aria-label={isFav ? "Von Merkliste entfernen" : "Auf Merkliste speichern"}
                      >
                        <Heart
                          size={20}
                          strokeWidth={1.8}
                          className={isFav ? "fill-[#d6165f] text-[#d6165f]" : "text-white"}
                        />
                      </button>
                    </div>

                    <div className="flex flex-1 flex-col px-2 pb-3 pt-4">
                      <Link href={profileHref} className="block">
                        <h3 className="font-serif text-3xl leading-tight text-[#fbf1ec]">
                          {cleanName(p.rawName) || ("Profil in " + (String(p.city || "der Schweiz").split("/")[0]))}
                        </h3>
                      </Link>
                      <p className="mt-1 text-[15px] text-[#cdb5be]">
                        {String(p.city || "Schweiz")}
                        {p.isVerif ? " · Geprüft" : ""}
                      </p>
                      <p className="mt-3 text-[16px] text-[#cdb5be]">
                        ab <span className="font-serif text-3xl text-[#fbf1ec]">CHF {p.rate60Chf}</span>{" "}
                        pro Stunde
                      </p>

                      <div className="mt-auto pt-4">
                        {cleanDigits ? (
                          <a
                            href={whatsAppHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="brass-pill inline-flex min-h-[48px] items-center justify-center rounded-full px-8 text-[16px]"
                          >
                            Schreiben
                          </a>
                        ) : (
                          <Link
                            href={profileHref}
                            className="brass-pill inline-flex min-h-[48px] items-center justify-center rounded-full px-8 text-[16px]"
                          >
                            Profil ansehen
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
          </section>
        )}

        {!isLoading && activeOffers.length === 0 && (
          <section className="empty-state rounded-[28px] px-6 py-16 text-center">
            <h2 className="font-serif text-4xl text-[#fbf1ec]">
              Hier ist gerade <em className="text-[#e8c98a]">niemand</em>
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-lg leading-relaxed text-[#cdb5be]">
              Mit diesen Wünschen finden wir leider keine Profile. Versuch es mit einer anderen
              Stadt oder lass einzelne Wünsche weg.
            </p>
            <button
              type="button"
              onClick={resetFilters}
              className="brass-button mt-8 inline-flex min-h-[56px] cursor-pointer items-center rounded-full px-9 text-[16px]"
            >
              Alles zurücksetzen
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
              className="ghost-button group inline-flex min-h-[56px] cursor-pointer items-center gap-3 rounded-full px-8 py-3 text-[16px] font-semibold"
            >
              24 weitere Profile zeigen
              <span className="font-mono text-xs tabular-nums text-[#cdb5be]">
                ({activeOffers.length - visibleLimit} weitere)
              </span>
              <ArrowRight
                size={12}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </div>
        )}
              <CityPlates />
        <Steps />
        <TrustBand />
      </main>
    </div>
  );
}