import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import offersData from "@/data/harvested-offers.json";
import { Search, Heart, ArrowUpDown, RotateCcw, Sparkles, ShieldCheck, PhoneCall } from "lucide-react";

type DesignTheme = "audemars" | "velvet" | "vogue";

const CANTON_PILLS = [
  { code: "ALL", label: "🇨🇭 Schweiz" },
  { code: "ZG", label: "ZG · Zug" },
  { code: "ZH", label: "ZH · Zürich" },
  { code: "LU", label: "LU · Luzern" },
  { code: "AG", label: "AG · Aargau" },
  { code: "BS", label: "BS · Basel" },
  { code: "BE", label: "BE · Bern" },
  { code: "SG", label: "SG · St. Gallen" },
  { code: "GE", label: "GE · Genève" },
  { code: "VD", label: "VD · Lausanne" },
  { code: "TI", label: "TI · Lugano" },
];

const RUBRIC_TABS = [
  { id: "ALL", label: "Alle Dossiers" },
  { id: "female", label: "Escort & GFE" },
  { id: "massage", label: "Tantra & Massage" },
  { id: "bdsm", label: "Domina & BDSM" },
  { id: "trans", label: "Trans / TS" },
];

export default function HomePage() {
  const [designTheme, setDesignTheme] = useState<DesignTheme>("audemars");
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [favIds, setFavIds] = useState<string[]>([]);

  const [cantonFilter, setCantonFilter] = useState<string>("ALL");
  const [rubricFilter, setRubricFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyAvailable4h, setOnlyAvailable4h] = useState<boolean>(false);
  const [maxRate60, setMaxRate60] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<"recommended" | "available" | "price_asc" | "price_desc">("recommended");
  const [visibleLimit, setVisibleLimit] = useState<number>(24);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});

    try {
      const saved = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      if (Array.isArray(saved)) setFavIds(saved);
      const savedTheme = localStorage.getItem("ch_luxury_theme") as DesignTheme;
      if (savedTheme === "audemars" || savedTheme === "velvet" || savedTheme === "vogue") {
        setDesignTheme(savedTheme);
      }
    } catch {}
  }, []);

  const switchTheme = (t: DesignTheme) => {
    setDesignTheme(t);
    try {
      localStorage.setItem("ch_luxury_theme", t);
    } catch {}
  };

  const toggleFav = (id: string) => {
    const next = favIds.includes(id) ? favIds.filter((x) => x !== id) : [id, ...favIds];
    setFavIds(next);
    try {
      localStorage.setItem("ch_favorite_profiles", JSON.stringify(next));
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

      const r60 = Math.max(100, Math.min(1200, Number(st.rate60Chf || o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(st.rate30Chf || o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      const isAvail = Boolean(st.availabilityConfirmed || o.availabilityConfirmed);
      const isVerif = Boolean(st.identityVerified || o.identityVerified);
      const isFeatured = Boolean(st.featured);

      const rawThumb = String(o.thumbnail || "").trim();
      const hasRealPhoto =
        rawThumb.startsWith("http") &&
        !rawThumb.includes("unsplash.com") &&
        !rawThumb.includes("placeholder") &&
        !rawThumb.includes("escort-portrait") &&
        !rawThumb.endsWith(".svg");

      if (cantonFilter !== "ALL" && String(o.canton || "").toUpperCase() !== cantonFilter) continue;
      if (rubricFilter !== "ALL" && (o.rubric || "female") !== rubricFilter) continue;
      if (onlyAvailable4h && !isAvail) continue;
      if (r60 > maxRate60) continue;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = [o.rawName, o.city, o.canton, ...(o.includedTags || [])].filter(Boolean).join(" ").toLowerCase();
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
        cleanThumb: rawThumb.replace(/[?&]iwsn_clean=1.*$/i, ""),
      });
    }

    list.sort((a, b) => {
      // Echte Original-Fotos von xdate/fgirl/and6 IMMER vor Platzhaltern!
      if (a.hasRealPhoto !== b.hasRealPhoto) return a.hasRealPhoto ? -1 : 1;
      if (sortBy === "available") {
        if (a.isAvail !== b.isAvail) return a.isAvail ? -1 : 1;
        return a.rate60Chf - b.rate60Chf;
      }
      if (sortBy === "price_asc") return a.rate60Chf - b.rate60Chf;
      if (sortBy === "price_desc") return b.rate60Chf - a.rate60Chf;

      const scoreA = (a.isFeatured ? 800 : 0) + (a.isAvail ? 450 : 0) + (a.isVerif ? 250 : 0) + Number(a.curationScore || 75);
      const scoreB = (b.isFeatured ? 800 : 0) + (b.isAvail ? 450 : 0) + (b.isVerif ? 250 : 0) + Number(b.curationScore || 75);
      return scoreB - scoreA;
    });

    return list;
  }, [serverStates, blockedIds, cantonFilter, rubricFilter, searchQuery, onlyAvailable4h, maxRate60, sortBy]);

  // Theme-spezifische Styling-Klassen für die 3 Designer-Richtungen
  const pageBg =
    designTheme === "audemars"
      ? "bg-[#060709] text-[#F4F4F6]"
      : designTheme === "velvet"
      ? "bg-[#0B070B] text-[#FAF5EE]"
      : "bg-[#040404] text-white";

  const consoleBox =
    designTheme === "audemars"
      ? "rounded-[4px] bg-[#0B0D13] border border-[#C5A059]/30 shadow-[0_12px_40px_rgba(0,0,0,0.85)]"
      : designTheme === "velvet"
      ? "rounded-3xl bg-[#150E16]/90 backdrop-blur-xl border border-[#E2C29B]/25 shadow-[0_20px_60px_rgba(136,19,55,0.18)]"
      : "rounded-none bg-transparent border-b border-white/15 pb-4";

  const cardContainer =
    designTheme === "audemars"
      ? "rounded-[3px] bg-[#0B0D13] border border-white/10 hover:border-[#C5A059]/80 transition duration-300 shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
      : designTheme === "velvet"
      ? "rounded-2xl bg-[#140D15] border border-[#E2C29B]/20 hover:border-[#E2C29B]/70 hover:-translate-y-1 transition duration-300 shadow-[0_16px_40px_rgba(0,0,0,0.75)]"
      : "rounded-none bg-transparent border-0 group";

  return (
    <div className={"min-h-screen transition-colors duration-300 " + pageBg}>
      <SEO
        title="IWANTSEXNOW.CH — Schweizer Escort, Tantra & Studio Direktverzeichnis (0% Provision)"
        description="2'529+ geprüfte Schweizer Escort-, Tantra- & Studio-Profile sowie 305 Clubs. Echte 30m/60m CHF-Preise & direkter +41 WhatsApp-Kontakt."
        url="https://iwantsexnow.ch"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 space-y-5">
        {/* Live Design-Richtungs-Umschalter (Alle 3 Designer-Welten auf 1 Klick vergleichbar) */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2 rounded-lg bg-white/[0.03] border border-white/10 text-[11px]">
          <div className="flex items-center gap-2 text-gray-300">
            <span className="font-mono uppercase tracking-widest text-[#C8A97E] font-bold">DESIGN-EDITION:</span>
            <button
              type="button"
              onClick={() => switchTheme("audemars")}
              className={
                designTheme === "audemars"
                  ? "px-2.5 py-1 rounded-[3px] bg-[#C5A059] text-[#060709] font-mono font-extrabold cursor-pointer"
                  : "px-2.5 py-1 rounded-[3px] bg-white/5 text-gray-300 hover:text-white cursor-pointer"
              }
            >
              ⌚ 1. Audemars & Bahnhofstrasse
            </button>
            <button
              type="button"
              onClick={() => switchTheme("velvet")}
              className={
                designTheme === "velvet"
                  ? "px-2.5 py-1 rounded-full bg-[#E2C29B] text-[#140D15] font-serif font-extrabold cursor-pointer"
                  : "px-2.5 py-1 rounded-full bg-white/5 text-gray-300 hover:text-white cursor-pointer"
              }
            >
              🍷 2. Velvet Penthouse Noir
            </button>
            <button
              type="button"
              onClick={() => switchTheme("vogue")}
              className={
                designTheme === "vogue"
                  ? "px-2.5 py-1 bg-white text-black font-mono uppercase tracking-widest font-extrabold cursor-pointer"
                  : "px-2.5 py-1 bg-white/5 text-gray-300 hover:text-white font-mono uppercase cursor-pointer"
              }
            >
              🖤 3. Vogue Kunsthalle (Editorial)
            </button>
          </div>

          <Link
            href="/fantasy-preview"
            className="inline-flex items-center gap-1.5 text-[#C8A97E] hover:underline font-semibold"
          >
            <Sparkles size={12} />
            <span>Voice-Avatar & 5s Video-Preview öffnen →</span>
          </Link>
        </div>

        {/* Steuer- & Filter-Konsole Above-the-Fold */}
        <section className={"p-3.5 sm:p-4 space-y-3 " + consoleBox}>
          {/* Zeile 1: Rubriken + Schweizer Index-Garantie */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-2.5">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {RUBRIC_TABS.map((tab) => {
                const isAct = rubricFilter === tab.id;
                const tabCls = isAct
                  ? "px-3.5 py-1.5 rounded-[3px] bg-[#C8A97E] text-[#060709] text-xs font-extrabold shrink-0 cursor-pointer"
                  : "px-3.5 py-1.5 rounded-[3px] bg-white/[0.04] text-gray-300 hover:text-white text-xs font-semibold shrink-0 cursor-pointer";
                return (
                  <button key={tab.id} type="button" onClick={() => setRubricFilter(tab.id)} className={tabCls}>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-gray-400">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                <ShieldCheck size={13} />
                <span>0% AGENTUR-PROVISION</span>
              </span>
              <span>·</span>
              <span>DIREKTER +41 KONTAKT</span>
              <span>·</span>
              <span className="text-[#C8A97E] font-bold">{activeOffers.length} DOSSIERS</span>
            </div>
          </div>

          {/* Zeile 2: Kantons-Wahl */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CANTON_PILLS.map((c) => {
              const isAct = cantonFilter === c.code;
              const pillCls = isAct
                ? "px-2.5 py-1 rounded-[3px] bg-white text-[#060709] text-[11px] font-mono font-extrabold shrink-0 cursor-pointer"
                : "px-2.5 py-1 rounded-[3px] bg-black/50 border border-white/10 text-gray-300 hover:border-[#C8A97E]/60 text-[11px] font-mono shrink-0 cursor-pointer";
              return (
                <button key={c.code} type="button" onClick={() => setCantonFilter(c.code)} className={pillCls}>
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Zeile 3: Suche, Türschild-Filter, CHF-Limit & Sortierung */}
          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3 top-2.5 text-[#C8A97E]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Stadt, PLZ (6300 Zug, 8001 Zürich), Name oder Service..."
                className="w-full pl-9 pr-3 py-2 rounded-[3px] bg-black/60 border border-white/15 text-xs text-white focus:border-[#C8A97E] outline-none font-sans"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyAvailable4h(!onlyAvailable4h)}
              className={
                onlyAvailable4h
                  ? "px-3 py-2 rounded-[3px] bg-emerald-500 text-[#05120C] text-xs font-mono font-extrabold cursor-pointer"
                  : "px-3 py-2 rounded-[3px] bg-black/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold cursor-pointer"
              }
            >
              ● TÜRSCHILD: FREI (4H)
            </button>

            <select
              value={maxRate60}
              onChange={(e) => setMaxRate60(Number(e.target.value))}
              className="rounded-[3px] bg-black/60 border border-white/15 px-3 py-2 text-xs font-mono font-bold text-gray-200 outline-none cursor-pointer"
            >
              <option value={1200}>TARIF: ALLE CHF</option>
              <option value={250}>MAX. CHF 250 / 60M</option>
              <option value={350}>MAX. CHF 350 / 60M</option>
              <option value={500}>MAX. CHF 500 / 60M</option>
            </select>

            <div className="flex items-center gap-1.5 bg-black/60 border border-white/15 rounded-[3px] px-2.5 py-2">
              <ArrowUpDown size={12} className="text-[#C8A97E]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-mono font-bold text-white outline-none cursor-pointer"
              >
                <option value="recommended" className="bg-[#0B0D13]">SORT: KURATIERT ({activeOffers.length})</option>
                <option value="available" className="bg-[#0B0D13]">SORT: FREI · 4H LIVE</option>
                <option value="price_asc" className="bg-[#0B0D13]">SORT: CHF AUFSTEIGEND</option>
                <option value="price_desc" className="bg-[#0B0D13]">SORT: CHF ABSTEIGEND</option>
              </select>
            </div>

            {(cantonFilter !== "ALL" || rubricFilter !== "ALL" || searchQuery || onlyAvailable4h || maxRate60 < 1200) && (
              <button
                type="button"
                onClick={() => {
                  setCantonFilter("ALL");
                  setRubricFilter("ALL");
                  setSearchQuery("");
                  setOnlyAvailable4h(false);
                  setMaxRate60(1200);
                }}
                className="p-2 rounded-[3px] bg-white/5 hover:bg-white/15 text-gray-300 cursor-pointer"
                title="Filter zurücksetzen"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </section>

        {/* Haupt-Grid: Echte Original-Porträtfotos + Schweizer Türschilder + Chronographen-Preistafel */}
        <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {activeOffers.slice(0, visibleLimit).map((p: any, idx: number) => {
            const isFav = favIds.includes(p.id);
            const cleanDigits = p.rawPhone ? String(p.rawPhone).replace(/\D/g, "") : "";
            const portalBadge = String(p.sourcePortal || "CH-DIREKT").replace(/^www\./, "");

            return (
              <div key={p.id} className={"overflow-hidden flex flex-col justify-between group " + cardContainer}>
                <div>
                  <Link href={"/profile/" + encodeURIComponent(p.id)} className="block relative aspect-[3/4] bg-[#08090D] overflow-hidden">
                    {p.hasRealPhoto ? (
                      <img
                        referrerPolicy="no-referrer"
                        src={p.cleanThumb}
                        alt={p.rawName}
                        loading={idx < 8 ? "eager" : "lazy"}
                        onError={(e) => {
                          const target = e.currentTarget as HTMLImageElement;
                          target.style.display = "none";
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition duration-700"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#11141F] to-[#07080C]">
                        <div className="w-12 h-12 rounded-full border border-[#C8A97E]/40 flex items-center justify-center text-[#C8A97E] font-serif font-bold text-lg mb-2">
                          CH
                        </div>
                        <div className="text-xs font-serif text-white">{p.rawName}</div>
                        <div className="text-[10px] font-mono text-[#C8A97E] mt-1">Original-Fotos im Dossier</div>
                      </div>
                    )}

                    {/* Oben links: Mechanisches Schweizer Türschild */}
                    <div className="absolute top-2.5 left-2.5 z-10">
                      <SwissDoorplate
                        state={p.isAvail ? "FREI" : "RESERVIERT"}
                        roomNumber={String(p.canton || "CH")}
                        customLabel={p.isAvail ? "FREI · LIVE" : portalBadge.toUpperCase()}
                        size="sm"
                      />
                    </div>

                    {/* Oben rechts: Merkliste */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFav(p.id);
                      }}
                      className="absolute top-2.5 right-2.5 z-10 p-2 rounded-full bg-black/75 hover:bg-black border border-white/15 text-white cursor-pointer"
                      aria-label="Merken"
                    >
                      <Heart size={13} className={isFav ? "text-rose-400 fill-rose-400" : "text-gray-300"} />
                    </button>

                    {/* Unten auf dem Porträt: Cinéma-Verlauf + Chronographen-Honorar */}
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/80 to-transparent p-3.5 pt-12 flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-[10px] font-mono tracking-widest text-[#C8A97E] uppercase truncate">
                          {p.canton} · {p.city}
                        </div>
                        <div className="text-sm sm:text-base font-serif font-bold text-white truncate">
                          {p.rawName}
                        </div>
                      </div>

                      <div className="text-right shrink-0 bg-black/80 border border-[#C8A97E]/40 px-2 py-1 rounded-[3px]">
                        <div className="text-xs font-mono tabular-nums font-extrabold text-[#C8A97E]">
                          CHF {p.rate60Chf}
                        </div>
                        <div className="text-[9px] font-mono tabular-nums text-gray-400">
                          30M: {p.rate30Chf}
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>

                {/* Untere Daumen-Konsole (WhatsApp Direkt + Dossier/Preview) */}
                <div className="p-2 grid grid-cols-2 gap-1.5 bg-[#080A0F] border-t border-white/10">
                  {cleanDigits ? (
                    <a
                      href={"https://wa.me/" + cleanDigits + "?text=" + encodeURIComponent("Hallo " + p.rawName + ", ich habe dein Dossier auf iwantsexnow.ch (" + p.city + ") gesehen.")}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="py-2 px-2 rounded-[3px] bg-emerald-500/15 hover:bg-emerald-500 text-emerald-300 hover:text-[#05120C] border border-emerald-500/35 font-mono font-extrabold text-[11px] text-center transition inline-flex items-center justify-center gap-1"
                    >
                      <PhoneCall size={11} />
                      <span>+41 WHATSAPP</span>
                    </a>
                  ) : (
                    <Link
                      href={"/fantasy-preview?id=" + encodeURIComponent(p.id)}
                      className="py-2 px-2 rounded-[3px] bg-white/5 hover:bg-white/10 text-[#C8A97E] font-mono font-bold text-[11px] text-center"
                    >
                      🔮 KI-PREVIEW
                    </Link>
                  )}
                  <Link
                    href={"/profile/" + encodeURIComponent(p.id)}
                    className="py-2 px-2 rounded-[3px] bg-[#C8A97E] hover:bg-[#dfc298] text-[#060709] font-mono font-extrabold text-[11px] text-center tracking-wide"
                  >
                    DOSSIER →
                  </Link>
                </div>
              </div>
            );
          })}
        </section>

        {visibleLimit < activeOffers.length && (
          <div className="text-center pt-6">
            <button
              type="button"
              onClick={() => setVisibleLimit((prev) => prev + 24)}
              className="px-8 py-3 rounded-[3px] bg-[#0B0D13] hover:bg-[#C8A97E] text-[#C8A97E] hover:text-[#060709] border border-[#C8A97E]/60 text-xs font-mono font-extrabold uppercase tracking-widest transition cursor-pointer"
            >
              + 24 WEITERE SCHWEIZER DOSSIERS LADEN ({activeOffers.length - visibleLimit} VERBLEIBEND)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}