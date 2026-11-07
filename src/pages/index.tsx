import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import { SWISS_DOORPLATE_TOKENS } from "@/lib/brand/doorplateTokens";
import offersData from "@/data/harvested-offers.json";
import {
  Search,
  Heart,
  ArrowUpDown,
  RotateCcw,
  Sparkles,
  Crown,
  MessageCircle,
  User,
  Building2,
} from "lucide-react";

const CANTON_PILLS = [
  { code: "ALL", label: "🇨🇭 ALLE SUITEN" },
  { code: "ZG", label: "ZG · ZUG" },
  { code: "ZH", label: "ZH · ZÜRICH" },
  { code: "LU", label: "LU · LUZERN" },
  { code: "BS", label: "BS · BASEL" },
  { code: "BE", label: "BE · BERN" },
  { code: "AG", label: "AG · AARGAU" },
  { code: "SG", label: "SG · ST. GALLEN" },
  { code: "GE", label: "GE · GENÈVE" },
  { code: "VD", label: "VD · LAUSANNE" },
  { code: "TI", label: "TI · LUGANO" },
];

const RUBRIC_TABS = [
  { id: "ALL", label: "ALLE COMPANIONS" },
  { id: "female", label: "ELITE ESCORT & GFE" },
  { id: "massage", label: "TANTRA & PRIVATE SPA" },
  { id: "bdsm", label: "DOMINA & NOIR STUDIO" },
  { id: "trans", label: "TRANS VIP" },
];

export default function HomePage() {
  const [studioFilterOn, setStudioFilterOn] = useState<boolean>(true);
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
    } catch {}
  }, []);

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

      const cleanTitle = String(o.rawName || "VALENTINA")
        .replace(/^[\W_]+/, "")
        .split(/[·|-]/)[0]
        .trim()
        .slice(0, 22);

      list.push({
        ...o,
        id: pid,
        cleanTitle: cleanTitle || "VALENTINA",
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

  const imgClass = studioFilterOn ? "darkroom-img" : "darkroom-img-raw";

  return (
    <div className="min-h-screen bg-[#070606] text-[#F5EFE6]">
      <SEO
        title="IWANTSEXNOW.CH — Private Penthouse Directory & Swiss Companions (0% Provision)"
        description="2'529+ geprüfte Schweizer Escort-, Tantra- & Studio-Dossiers sowie 305 Clubs. Echte 30m/60m CHF-Tarife & direkter +41 WhatsApp-Kontakt."
        url="https://iwantsexnow.ch"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-5 space-y-6">
        {/* STEUER- & FILTER-COCKPIT ABOVE THE FOLD */}
        <section className="penthouse-panel p-4 sm:p-5 rounded-[22px] border border-[#C8A97E]/35 space-y-3.5">
          {/* Zeile 1: Rubrik-Schalter + Darkroom-Engine-Toggle + Preview-Shortcut */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#C8A97E]/20 pb-3">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {RUBRIC_TABS.map((tab) => {
                const isAct = rubricFilter === tab.id;
                const cls = isAct
                  ? "brass-3d px-3.5 py-1.5 rounded-full text-[10px] font-mono font-extrabold tracking-[0.16em] uppercase cursor-pointer shrink-0"
                  : "px-3.5 py-1.5 rounded-full text-[10px] font-mono font-semibold tracking-[0.16em] uppercase bg-black/50 text-[#C8B9A6] hover:text-[#EAD2AA] border border-[#C8A97E]/20 cursor-pointer shrink-0 transition";
                return (
                  <button key={tab.id} type="button" onClick={() => setRubricFilter(tab.id)} className={cls}>
                    {tab.label}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStudioFilterOn(!studioFilterOn)}
                className={
                  studioFilterOn
                    ? "px-3 py-1.5 rounded-full bg-[#C8A97E]/20 border border-[#C8A97E]/60 text-[#EAD2AA] text-[10px] font-mono font-bold tracking-wider cursor-pointer"
                    : "px-3 py-1.5 rounded-full bg-black/50 border border-white/15 text-gray-400 text-[10px] font-mono tracking-wider cursor-pointer"
                }
                title="Luxury Darkroom Engine: Dämpft grelle Farben und schneidet Portal-Wasserzeichen an den Bildrändern ab"
              >
                {studioFilterOn ? "✨ DARKROOM ENGINE: AKTIV" : "DARKROOM ENGINE: AUS"}
              </button>

              <Link
                href="/clubs"
                className="hidden xl:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/60 border border-[#C8A97E]/30 text-[#EAD2AA] text-[10px] font-mono font-bold tracking-wider uppercase hover:border-[#EAD2AA]"
              >
                <Building2 size={12} className="text-[#DEC393]" />
                <span>305 Clubs</span>
              </Link>

              <Link
                href="/fantasy-preview"
                className="emerald-3d hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#C8A97E]/45 text-[10px] font-mono font-bold tracking-wider uppercase"
              >
                <Sparkles size={12} className="text-[#DEC393]" />
                <span>Voice & 5s Preview</span>
              </Link>
            </div>
          </div>

          {/* Zeile 2: Horizontale Schweizer Kantons-Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            {CANTON_PILLS.map((c) => {
              const isAct = cantonFilter === c.code;
              const cls = isAct
                ? "px-3 py-1 rounded-full bg-[#EAD2AA] text-[#161006] text-[10px] font-mono font-extrabold tracking-[0.15em] shrink-0 cursor-pointer shadow"
                : "px-3 py-1 rounded-full bg-black/55 border border-[#C8A97E]/25 text-[#C8B9A6] hover:border-[#EAD2AA]/70 hover:text-white text-[10px] font-mono tracking-[0.15em] shrink-0 cursor-pointer transition";
              return (
                <button key={c.code} type="button" onClick={() => setCantonFilter(c.code)} className={cls}>
                  {c.label}
                </button>
              );
            })}
          </div>

          {/* Zeile 3: Suchfeld + 3D-Türschild-Filter + CHF-Honorar-Obergrenze + Sortierung */}
          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={14} className="absolute left-3.5 top-2.5 text-[#DEC393]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Suite, Stadt (Zürich, Zug 6300, Genève, Lugano), Name oder Service..."
                className="w-full pl-9 pr-3 py-2 rounded-full bg-black/75 border border-[#C8A97E]/35 text-xs text-[#F5EFE6] placeholder-[#8E8271] focus:border-[#EAD2AA] outline-none"
              />
            </div>

            <button
              type="button"
              onClick={() => setOnlyAvailable4h(!onlyAvailable4h)}
              className="cursor-pointer"
            >
              <SwissDoorplate
                state={onlyAvailable4h ? "FREI" : "RESERVIERT"}
                roomNumber="4H"
                customLabel={onlyAvailable4h ? "NUR FREI · AKTIV" : "NUR FREI ZEIGEN"}
                size="sm"
              />
            </button>

            <select
              value={maxRate60}
              onChange={(e) => setMaxRate60(Number(e.target.value))}
              className="rounded-full bg-black/75 border border-[#C8A97E]/35 px-3.5 py-2 text-[11px] font-mono font-bold text-[#EAD2AA] outline-none cursor-pointer"
            >
              <option value={1200} className="bg-[#100D0B]">HONORAR: ALLE CHF</option>
              <option value={250} className="bg-[#100D0B]">BIS CHF 250 / STD.</option>
              <option value={350} className="bg-[#100D0B]">BIS CHF 350 / STD.</option>
              <option value={500} className="bg-[#100D0B]">BIS CHF 500 / STD.</option>
            </select>

            <div className="flex items-center gap-1.5 bg-black/75 border border-[#C8A97E]/35 rounded-full px-3.5 py-2">
              <ArrowUpDown size={12} className="text-[#DEC393]" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] font-mono font-bold text-[#F5EFE6] outline-none cursor-pointer"
              >
                <option value="recommended" className="bg-[#100D0B]">KURATIERT ({activeOffers.length})</option>
                <option value="available" className="bg-[#100D0B]">TÜRSCHILD: FREI ZUERST</option>
                <option value="price_asc" className="bg-[#100D0B]">CHF AUFSTEIGEND</option>
                <option value="price_desc" className="bg-[#100D0B]">CHF ABSTEIGEND</option>
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
                className="p-2 rounded-full bg-white/5 hover:bg-white/15 border border-[#C8A97E]/30 text-[#EAD2AA] cursor-pointer"
                title="Alle Filter zurücksetzen"
              >
                <RotateCcw size={14} />
              </button>
            )}
          </div>
        </section>

        {/* EMPTY STATE MIT TROCKENEM SCHWEIZER HUMOR */}
        {activeOffers.length === 0 && (
          <div className="penthouse-panel rounded-[24px] border border-[#C8A97E]/40 p-10 text-center space-y-4">
            <SwissDoorplate state="BESETZT" roomNumber="0 TREFFER" customLabel="KEINE SUITE OFFEN" size="lg" />
            <p className="text-sm font-serif text-[#EAD2AA] max-w-lg mx-auto">
              {SWISS_DOORPLATE_TOKENS.microcopyDe.emptyFilter}
            </p>
            <button
              type="button"
              onClick={() => {
                setCantonFilter("ALL");
                setRubricFilter("ALL");
                setSearchQuery("");
                setOnlyAvailable4h(false);
                setMaxRate60(1200);
              }}
              className="brass-3d px-6 py-2.5 rounded-full text-xs font-mono font-extrabold uppercase tracking-widest cursor-pointer"
            >
              ALLE 2&apos;529 SCHWEIZER SUITEN ÖFFNEN
            </button>
          </div>
        )}

        {/* DIE "VALENTINA"-PROFIKARTEN IM GRID */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {activeOffers.slice(0, visibleLimit).map((p: any, idx: number) => {
            const isFav = favIds.includes(p.id);
            const cleanDigits = p.rawPhone ? String(p.rawPhone).replace(/\D/g, "") : "";
            const suiteNum = "SUITE " + String(101 + (idx % 899));

            return (
              <div
                key={p.id}
                className="valentina-outer-card rounded-[26px] overflow-hidden flex flex-col justify-between group p-2.5"
              >
                <div className="relative rounded-[20px] overflow-hidden border border-[#C8A97E]/35 bg-[#070505] flex-1 flex flex-col justify-between">
                  {/* LUXURY DARKROOM STAGE */}
                  <Link
                    href={"/profile/" + encodeURIComponent(p.id)}
                    className="darkroom-stage block aspect-[3/4.1] w-full"
                  >
                    {p.hasRealPhoto ? (
                      <img
                        referrerPolicy="no-referrer"
                        src={p.cleanThumb}
                        alt={p.cleanTitle}
                        loading={idx < 8 ? "eager" : "lazy"}
                        onError={(e) => {
                          const t = e.currentTarget as HTMLImageElement;
                          t.style.display = "none";
                        }}
                        className={imgClass}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-gradient-to-b from-[#16110E] to-[#070505]">
                        <div className="w-12 h-12 rounded-full border border-[#C8A97E]/45 flex items-center justify-center text-[#DEC393] mb-2">
                          <Crown size={20} />
                        </div>
                        <div className="text-xs font-serif tracking-widest uppercase text-[#EAD2AA]">
                          {p.cleanTitle}
                        </div>
                      </div>
                    )}

                    <div className="darkroom-vignette" />
                    <div className="darkroom-floor" />

                    {/* Oben links: Krone + 3D-Messing-Türschild */}
                    <div className="absolute top-3.5 left-3.5 z-10 flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-black/75 border border-[#C8A97E]/55 flex items-center justify-center text-[#DEC393] shadow">
                        <Crown size={13} />
                      </div>
                      <SwissDoorplate
                        state={p.isAvail ? "FREI" : "RESERVIERT"}
                        roomNumber={p.canton || "CH"}
                        customLabel={p.isAvail ? "FREI" : suiteNum}
                        size="sm"
                      />
                    </div>

                    {/* Oben rechts: Runder Glas-Merklisten-Button */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleFav(p.id);
                      }}
                      className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full bg-black/75 hover:bg-black border border-[#C8A97E]/40 flex items-center justify-center text-[#EAD2AA] cursor-pointer transition"
                      aria-label="Merken"
                    >
                      <Heart size={13} className={isFav ? "text-rose-400 fill-rose-400" : "text-[#EAD2AA]"} />
                    </button>

                    {/* Unten zentrierte Valentina-Luxus-Typografie */}
                    <div className="absolute inset-x-0 bottom-2 z-10 px-4 text-center flex flex-col items-center">
                      <h3
                        style={{ textShadow: "0 4px 18px rgba(0,0,0,0.95)" }}
                        className="font-serif text-xl sm:text-2xl tracking-[0.14em] uppercase text-[#EAD2AA] font-normal truncate max-w-full"
                      >
                        {p.cleanTitle}
                      </h3>

                      <div className="text-[9px] font-sans font-semibold tracking-[0.26em] uppercase text-[#C8B69E] mt-1 truncate max-w-full">
                        • {p.city} ({p.canton}) · ELITE COMPANION •
                      </div>

                      <div className="flex items-center justify-center gap-2 my-2 w-36">
                        <span className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-[#C8A97E]/65" />
                        <span className="text-[#DEC393] text-[9px]">✦</span>
                        <span className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-[#C8A97E]/65" />
                      </div>

                      <div className="text-[8px] font-mono tracking-[0.28em] uppercase text-[#A89882]">
                        STARTING AT
                      </div>

                      <div className="font-serif font-mono text-2xl sm:text-3xl text-[#EAD2AA] tracking-wider leading-tight mt-0.5">
                        CHF {p.rate60Chf}
                      </div>

                      <div className="text-[8px] font-mono tracking-[0.22em] uppercase text-[#9E8C74] mt-0.5">
                        PER HOUR · (30 MIN: CHF {p.rate30Chf})
                      </div>
                    </div>
                  </Link>

                  {/* Untere 2-Spalten-Daumenleiste (Links Gebürstetes Gold WhatsApp, Rechts Dunkel-Smaragd View Profile) */}
                  <div className="px-3.5 pb-3.5 pt-2 bg-[#070505] grid grid-cols-2 gap-2.5">
                    {cleanDigits ? (
                      <a
                        href={
                          "https://wa.me/" +
                          cleanDigits +
                          "?text=" +
                          encodeURIComponent(
                            "Hallo " + p.cleanTitle + ", ich habe deine Suite (" + p.city + ") auf iwantsexnow.ch gesehen."
                          )
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brass-3d py-2.5 px-3 rounded-full border border-[#F5E3B8]/65 font-sans font-extrabold text-[10px] tracking-[0.15em] uppercase flex items-center justify-center gap-1.5 transition"
                      >
                        <MessageCircle size={12} className="shrink-0" />
                        <span>WHATSAPP</span>
                      </a>
                    ) : (
                      <Link
                        href={"/fantasy-preview?id=" + encodeURIComponent(p.id)}
                        className="brass-3d py-2.5 px-3 rounded-full border border-[#F5E3B8]/65 font-sans font-extrabold text-[10px] tracking-[0.15em] uppercase flex items-center justify-center gap-1.5 transition"
                      >
                        <Sparkles size={12} className="shrink-0" />
                        <span>PREVIEW</span>
                      </Link>
                    )}

                    <Link
                      href={"/profile/" + encodeURIComponent(p.id)}
                      className="emerald-3d py-2.5 px-3 rounded-full border border-[#C8A97E]/45 font-sans font-bold text-[10px] tracking-[0.14em] uppercase flex items-center justify-center gap-1.5 transition"
                    >
                      <User size={12} className="shrink-0 text-[#DEC393]" />
                      <span>VIEW PROFILE</span>
                    </Link>
                  </div>
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
              className="brass-3d px-8 py-3 rounded-full border border-[#F5E3B8]/65 text-xs font-mono font-extrabold tracking-[0.2em] uppercase cursor-pointer transition"
            >
              + 24 WEITERE SUITEN ÖFFNEN ({activeOffers.length - visibleLimit} IM TRESOR)
            </button>
          </div>
        )}
      </main>
    </div>
  );
}