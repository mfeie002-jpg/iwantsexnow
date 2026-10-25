import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { StencilSerifX } from "@/components/BrandLogo";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import indexStats from "@/data/index-stats.json";
import {
  Check,
  MapPin,
  ArrowUpRight,
  ExternalLink,
  Building2,
  Scale,
  UserCheck,
  Search,
  Sparkles,
  ShieldCheck,
  Info,
  RotateCcw,
  SlidersHorizontal,
  Heart,
  Flame,
  Sun,
  Moon,
  Compass,
} from "lucide-react";

export type WorldId = "A" | "B" | "C" | "D";

// Intelligenter Schweizer Orts-zu-Kanton-Korrektor (Verhindert "Emmen (ZH)" oder "Basel (ZH)"!)
function inferTrueSwissCanton(cityRaw: string, fallbackCanton: string): { cleanCity: string; trueCanton: string } {
  const firstPart = String(cityRaw || "Zürich").split("/")[0].split(",")[0].trim();
  const cLow = firstPart.toLowerCase();

  const cityMap: Array<[string, string]> = [
    ["emmen", "LU"], ["luzern", "LU"], ["kriens", "LU"], ["sursee", "LU"], ["sempach", "LU"],
    ["basel", "BS"], ["liestal", "BL"], ["pratteln", "BL"],
    ["menziken", "AG"], ["aarau", "AG"], ["baden", "AG"], ["wettingen", "AG"], ["spreitenbach", "AG"], ["oftringen", "AG"], ["riniken", "AG"], ["schafisheim", "AG"], ["wohlen", "AG"], ["lenzburg", "AG"],
    ["zug", "ZG"], ["cham", "ZG"], ["baar", "ZG"], ["rotkreuz", "ZG"],
    ["bern", "BE"], ["biel", "BE"], ["thun", "BE"], ["interlaken", "BE"], ["niederbipp", "BE"], ["langenthal", "BE"],
    ["st. gallen", "SG"], ["st gallen", "SG"], ["wil", "SG"], ["buchs", "SG"], ["rapperswil", "SG"], ["bad ragaz", "SG"],
    ["frauenfeld", "TG"], ["weinfelden", "TG"], ["kreuzlingen", "TG"],
    ["solothurn", "SO"], ["olten", "SO"], ["härkingen", "SO"], ["grenchen", "SO"],
    ["genève", "GE"], ["geneve", "GE"], ["genf", "GE"], ["carouge", "GE"],
    ["lausanne", "VD"], ["montreux", "VD"], ["nyon", "VD"], ["vevey", "VD"],
    ["lugano", "TI"], ["locarno", "TI"], ["bellinzona", "TI"],
    ["chur", "GR"], ["davos", "GR"], ["landquart", "GR"],
    ["altendorf", "SZ"], ["pfäffikon", "SZ"], ["wangen", "SZ"],
    ["zürich", "ZH"], ["zurich", "ZH"], ["winterthur", "ZH"], ["oerlikon", "ZH"], ["kloten", "ZH"], ["schlieren", "ZH"], ["dietikon", "ZH"], ["horgen", "ZH"], ["wädenswil", "ZH"], ["wetzikon", "ZH"], ["bülach", "ZH"], ["rüti", "ZH"], ["unterengstringen", "ZH"], ["oberengstringen", "ZH"],
  ];

  for (const [needle, cantonCode] of cityMap) {
    if (cLow.includes(needle)) {
      return { cleanCity: firstPart, trueCanton: cantonCode };
    }
  }
  return { cleanCity: firstPart || "Zürich", trueCanton: String(fallbackCanton || "ZH").toUpperCase() };
}

// Erkennt, ob ein Profil in die Trans/TS-Rubrik gehört (damit wir sauber nach Rubrik filtern können)
function inferGenderRubric(item: any): "female" | "trans" | "massage" {
  const text = `${item.rawName || ""} ${(item.includedTags || []).join(" ")} ${item.bio || ""}`.toLowerCase();
  if (/\b(trans|ts|ladyboy|shemale|transe)\b/.test(text)) return "trans";
  if (/\b(tantra|masseurin|thaimassage|body-to-body|massage)\b/.test(text) && !/\bescort\b/.test(text)) return "massage";
  return "female";
}

// Kuratierte, hochwertige Schweizer Städte-Karten mit echten Architektur-/Mood-Bildern
const SWISS_CITY_HUBS = [
  {
    code: "ZH",
    name: "Zürich & See",
    sub: "City, Paradeplatz, Oerlikon & Winterthur",
    image: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=700&q=80",
  },
  {
    code: "ZG",
    name: "Zug & Cham",
    sub: "Baar, Cham, Rotkreuz & Ennetsee",
    image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=700&q=80",
  },
  {
    code: "BS",
    name: "Basel & Nordwest",
    sub: "Basel-Stadt, Messe & Liestal",
    image: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=700&q=80",
  },
  {
    code: "LU",
    name: "Luzern & Zentral",
    sub: "Luzern City, Emmen & Vierwaldstättersee",
    image: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=700&q=80",
  },
  {
    code: "BE",
    name: "Bern & Mittelland",
    sub: "Bern City, Thun, Biel & Interlaken",
    image: "https://images.unsplash.com/photo-1594394489098-74ac04c0fc2e?auto=format&fit=crop&w=700&q=80",
  },
  {
    code: "AG",
    name: "Aargau & Baden",
    sub: "Baden, Aarau, Wettingen & Spreitenbach",
    image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80",
  },
  {
    code: "SG",
    name: "St. Gallen & Ost",
    sub: "St. Gallen, Wil, Rapperswil & Bodensee",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80",
  },
  {
    code: "GE",
    name: "Genève & Lausanne",
    sub: "Romandie, Lac Léman & Montreux",
    image: "https://images.unsplash.com/photo-1574867155517-3628058e2f6c?auto=format&fit=crop&w=700&q=80",
  },
];

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

export default function HomePage() {
  const [world, setWorld] = useState<WorldId>("A");
  const [activeRubric, setActiveRubric] = useState<"all" | "female" | "massage" | "trans">("female");
  const [activeCanton, setActiveCanton] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyConfirmedAvailable, setOnlyConfirmedAvailable] = useState<boolean>(false);
  const [onlySelfManaged, setOnlySelfManaged] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(28);
  const [selectedIndexProfile, setSelectedIndexProfile] = useState<any>(null);
  const [vaultExtraProfiles, setVaultExtraProfiles] = useState<any[]>([]);
  const [vaultPage, setVaultPage] = useState<number>(1);
  const [loadingVault, setLoadingVault] = useState<boolean>(false);

  const [serverData, setServerData] = useState<{ metrics: Record<string, any>; states: Record<string, any> }>({
    metrics: {},
    states: {},
  });

  const isLightWorld = world === "B";
  const totalClubsCount = Number((indexStats as any)?.totalEstablishmentsInVault) || 162;
  const totalVaultCount = Number((indexStats as any)?.totalRawListingsInVault) || 2838;

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.ok) {
          setServerData({ metrics: d.metrics || {}, states: d.states || {} });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!searchQuery.trim() && activeCanton === "ALL") return;
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (activeCanton !== "ALL") params.set("canton", activeCanton);
    params.set("page", "1");
    params.set("limit", "48");

    fetch(`/api/vault/search?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.status === "ok" && Array.isArray(d.results)) {
          setVaultExtraProfiles(d.results);
        }
      })
      .catch(() => {});
  }, [searchQuery, activeCanton]);

  const loadMoreFromServerVault = async () => {
    setLoadingVault(true);
    try {
      const nextPage = vaultPage + 1;
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (activeCanton !== "ALL") params.set("canton", activeCanton);
      params.set("page", String(nextPage));
      params.set("limit", "48");

      const res = await fetch(`/api/vault/search?${params.toString()}`);
      const d = await res.json();
      if (d && Array.isArray(d.results) && d.results.length > 0) {
        setVaultExtraProfiles((prev) => [...prev, ...d.results]);
        setVaultPage(nextPage);
      }
      setVisibleCount((prev) => prev + 28);
    } catch {
      setVisibleCount((prev) => prev + 28);
    }
    setLoadingVault(false);
  };

  // Bereinigte, ästhetisch sortierte Profilliste (Ohne 6navi-Wasserzeichen in Reihe 1 + echte Kantons-Zuordnung!)
  const enrichedProfiles = useMemo(() => {
    const rawFast = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    const combined = [...rawFast, ...vaultExtraProfiles];
    const seen = new Set<string>();
    const uniqueList: any[] = [];

    for (let idx = 0; idx < combined.length; idx++) {
      const item = combined[idx];
      if (!item || !item.rawName) continue;
      const key = `${String(item.sourceUrl || "")}|${String(item.rawName)}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const id = item.dedupClusterId || `ch-${idx + 1}`;
      const st = serverData.states[id] || {};
      const mt = serverData.metrics[id] || { views: 0, detailOpens: 0, sourceClicks: 0 };

      if (st.hidden || st.paused) continue;

      const rawCity = st.city || item.city || "Zürich";
      const { cleanCity, trueCanton } = inferTrueSwissCanton(rawCity, st.canton || item.canton || "ZH");
      const rubric = inferGenderRubric(item);

      const isSelfManaged = Boolean(st.claimed || item.bookingMode === "direct");
      const isIdentityVerified = Boolean(st.identityVerified);
      const availabilityConfirmed = Boolean(st.availabilityConfirmed);
      const isSponsored = Boolean(st.sponsored);

      // Qualitäts-Score für die Startseiten-Reihenfolge:
      // Bevorzuge cleane High-Class Porträts (z.B. bemygirl / fgirl / xdate ohne dickes 6navi-Wasserzeichen) für die ersten Reihen!
      const portalLow = String(item.sourcePortal || "").toLowerCase();
      const thumbLow = String(item.thumbnail || "").toLowerCase();
      const hasHeavyWatermark = portalLow.includes("6navi") || thumbLow.includes("6navi") || thumbLow.includes("sexnavi");
      const isBoutiquePhoto = portalLow.includes("bemygirl") || portalLow.includes("fgirl");

      const aestheticScore =
        (isSponsored ? 200 : 0) +
        (availabilityConfirmed ? 100 : 0) +
        (isIdentityVerified ? 80 : 0) +
        (isSelfManaged ? 60 : 0) +
        (isBoutiquePhoto ? 40 : 0) +
        (hasHeavyWatermark ? -35 : 15);

      uniqueList.push({
        ...item,
        id,
        rawName: st.displayName || item.rawName,
        cleanCity,
        canton: trueCanton,
        rubric,
        advertisedBaseChf: st.rate60Chf || item.advertisedBaseChf,
        isSelfManaged,
        isIdentityVerified,
        availabilityConfirmed,
        isSponsored,
        aestheticScore,
        realViews: mt.views || 0,
        realDetailOpens: mt.detailOpens || 0,
        fallbackImg: FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length],
      });
    }

    uniqueList.sort((a, b) => b.aestheticScore - a.aestheticScore);
    return uniqueList;
  }, [serverData, vaultExtraProfiles]);

  // Zähle echte Treffer pro Kanton für unsere visuellen Regionen-Karten
  const cantonCounts = useMemo(() => {
    const map: Record<string, number> = { ALL: enrichedProfiles.length };
    for (const p of enrichedProfiles) {
      map[p.canton] = (map[p.canton] || 0) + 1;
    }
    return map;
  }, [enrichedProfiles]);

  const filteredProfiles = useMemo(() => {
    return enrichedProfiles.filter((p: any) => {
      if (activeRubric !== "all" && p.rubric !== activeRubric) return false;
      if (activeCanton !== "ALL" && p.canton !== activeCanton) return false;
      if (onlyConfirmedAvailable && !p.availabilityConfirmed) return false;
      if (onlySelfManaged && !p.isSelfManaged) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = `${p.rawName || ""} ${p.cleanCity || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enrichedProfiles, activeRubric, activeCanton, onlyConfirmedAvailable, onlySelfManaged, searchQuery]);

  const resetAll = () => {
    setActiveCanton("ALL");
    setActiveRubric("female");
    setSearchQuery("");
    setOnlyConfirmedAvailable(false);
    setOnlySelfManaged(false);
  };

  const recordEvent = (profileId: string, action: string) => {
    fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, profileId }),
    }).catch(() => {});
  };

  // =========================================================================
  // BORDERLESS BEMYGIRL-STYLE PORTRAIT CARD (No clunky beige box button!)
  // =========================================================================
  const renderEditorialPortraitCard = (p: any, idx: number, keyPrefix: string) => {
    const cleanName =
      String(p.rawName || "Profil")
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 22) || "Profil";
    const rate = p.advertisedBaseChf || null;
    const img = p.thumbnail || p.fallbackImg;

    return (
      <article
        key={`${keyPrefix}-${p.id}-${idx}`}
        className={`group relative rounded-2xl overflow-hidden transition-all duration-500 ${
          isLightWorld
            ? "bg-white border border-stone-200/90 shadow-[0_8px_30px_rgba(20,20,24,0.06)] hover:shadow-[0_16px_40px_rgba(158,123,79,0.18)] hover:-translate-y-1"
            : "bg-[#12131A] border border-white/10 hover:border-[#C8A97E]/70 shadow-[0_10px_30px_rgba(0,0,0,0.5)] hover:-translate-y-1"
        }`}
      >
        {/* Entire 3:4 Portrait is Clickable (Like BeMyGirl & Fgirl) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-stone-900">
          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className="block w-full h-full"
          >
            <img
              src={img}
              alt={`${cleanName} – ${p.cleanCity}`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = p.fallbackImg;
              }}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/15 to-transparent" />
          </Link>

          {/* Top-Left: Subtle Status or Verified Pill */}
          <div className="absolute top-3 left-3 flex flex-col gap-1 pointer-events-none">
            {p.availabilityConfirmed ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/95 text-black text-[10px] font-extrabold shadow-md">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                Verfügbar
              </span>
            ) : p.isIdentityVerified ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/80 backdrop-blur border border-[#C8A97E]/60 text-[#E5C99B] text-[10px] font-semibold">
                <Check size={11} className="text-[#C8A97E]" /> Geprüft
              </span>
            ) : null}
          </div>

          {/* Top-Right: Discreet Info Button (Replaces bottom button clutter) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              recordEvent(p.id, "track_click");
              setSelectedIndexProfile(p);
            }}
            title={`Quelle: ${p.sourcePortal || "Index"} · Details & Verwaltung`}
            className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/60 hover:bg-[#C8A97E] text-white/80 hover:text-black backdrop-blur flex items-center justify-center transition cursor-pointer border border-white/15"
          >
            <Info size={13} />
          </button>

          {/* Bottom Portrait Overlay: Clean Name, Real City/Canton & Rate */}
          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className="absolute bottom-0 inset-x-0 p-3.5 flex items-end justify-between gap-2"
          >
            <div className="min-w-0">
              <h3 className="text-base sm:text-lg font-serif font-bold text-white leading-tight truncate group-hover:text-[#E5C99B] transition">
                {cleanName}
              </h3>
              <p className="text-xs text-gray-300 flex items-center gap-1 truncate mt-0.5">
                <MapPin size={12} className="text-[#C8A97E] shrink-0" />
                <span className="truncate">
                  {p.cleanCity} ({p.canton})
                </span>
              </p>
            </div>

            {rate && (
              <div className="shrink-0 text-right">
                <span className="px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur border border-[#C8A97E]/40 text-xs font-bold text-[#E5C99B]">
                  CHF {rate}
                </span>
              </div>
            )}
          </Link>
        </div>
      </article>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-500 pb-24 lg:pb-16 ${
        isLightWorld ? "bg-[#F7F4EF] text-[#141418]" : world === "A" ? "bg-[#0D0A0E] text-white" : world === "C" ? "bg-[#090B10] text-white" : "bg-[#0A0F1A] text-white"
      }`}
    >
      <SEO
        title="iwantsexnow.ch | Schweizer Escorts, Studios & Plattformvergleich"
        description="Entdecke geprüfte Schweizer Escorts, Erotik-Massagen und 162+ Clubs in Zürich, Zug, Basel, Bern, Luzern & Genf."
      />

      {/* ===================================================================== */}
      {/* TOP LIVE WORLD SWITCHER (4 ECHTE, KOMPLETT UNTERSCHIEDLICHE WELTEN)   */}
      {/* ===================================================================== */}
      <div className="bg-[#141218] text-white border-b border-[#C8A97E]/40 py-2 px-3 sticky top-0 z-[60] shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-2 shrink-0">
            <span className="px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] font-extrabold uppercase text-[10px]">
              4 Neue Design-Welten:
            </span>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: "A" as WorldId, label: "Welt A: BeMyGirl Luxury Capsule ⭐" },
              { id: "B" as WorldId, label: "Welt B: Zürich Daylight (Hell & Edel) ☀️" },
              { id: "C" as WorldId, label: "Welt C: Fgirl / Netflix Streams 🎬" },
              { id: "D" as WorldId, label: "Welt D: Schweizer Regionen-Finder 🇨🇭" },
            ].map((w) => (
              <button
                key={w.id}
                type="button"
                onClick={() => setWorld(w.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  world === w.id
                    ? "bg-[#C8A97E] text-[#090A0F] shadow-md scale-[1.02]"
                    : "bg-white/5 text-gray-300 border border-white/10 hover:text-white"
                }`}
              >
                {w.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <LuxuryHeader />

      {/* ===================================================================== */}
      {/* WELT A: "BEMYGIRL EDITORIAL LUXURY + AIRBNB SEARCH CAPSULE"           */}
      {/* ===================================================================== */}
      {world === "A" && (
        <section className="relative overflow-hidden border-b border-[#C8A97E]/25 bg-gradient-to-b from-[#170F16] via-[#120C12] to-[#0D0A0E] py-8 sm:py-12 px-4">
          <div className="pointer-events-none absolute -top-24 left-1/3 w-96 h-96 rounded-full bg-[#C8A97E]/15 blur-[130px]" />
          <div className="max-w-6xl mx-auto space-y-7 relative z-10">
            {/* Clear 1-Second Focus Headline */}
            <div className="text-center max-w-3xl mx-auto space-y-2.5">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#C8A97E]/10 border border-[#C8A97E]/30 text-[#E5C99B] text-[11px] font-semibold tracking-wider uppercase">
                <span>SWISS PRIVATE ESCORT & STUDIO DIRECTORY</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight">
                Wen möchtest du <span className="italic font-normal text-[#E5C99B]">heute treffen?</span>
              </h1>
            </div>

            {/* THE UNIFIED AIRBNB-STYLE SEARCH CAPSULE (100% Obvious Where to Click!) */}
            <div className="max-w-4xl mx-auto p-2 sm:p-2.5 rounded-2xl sm:rounded-full bg-[#1B141B]/95 backdrop-blur-2xl border-2 border-[#C8A97E]/50 shadow-[0_20px_60px_rgba(0,0,0,0.8)] grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
              {/* Segment 1: Rubrik (Damen / Massage / TS) */}
              <div className="sm:col-span-4 flex items-center gap-1 bg-black/40 rounded-xl sm:rounded-full p-1 border border-white/10">
                {[
                  { id: "female", label: "Escorts & Girls" },
                  { id: "massage", label: "Massage" },
                  { id: "trans", label: "Trans / TS" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setActiveRubric(r.id as any)}
                    className={`flex-1 py-2 px-2 rounded-lg sm:rounded-full text-xs font-bold transition cursor-pointer ${
                      activeRubric === r.id
                        ? "bg-[#C8A97E] text-[#090A0F] shadow"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Segment 2: Stadt / Kanton */}
              <div className="sm:col-span-4 px-3 py-1.5 border-y sm:border-y-0 sm:border-x border-white/10">
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[#C8A97E]">
                  📍 Region / Kanton
                </label>
                <select
                  value={activeCanton}
                  onChange={(e) => setActiveCanton(e.target.value)}
                  className="w-full bg-transparent text-sm font-bold text-white focus:outline-none cursor-pointer"
                >
                  <option value="ALL" className="bg-[#141218]">Ganze Schweiz ({cantonCounts.ALL || 0})</option>
                  {SWISS_CITY_HUBS.map((c) => (
                    <option key={c.code} value={c.code} className="bg-[#141218]">
                      {c.name} ({cantonCounts[c.code] || 0})
                    </option>
                  ))}
                </select>
              </div>

              {/* Segment 3: Freitext oder Direkt-Button */}
              <div className="sm:col-span-4 flex items-center gap-2 pl-2 pr-1">
                <Search size={16} className="text-[#C8A97E] shrink-0" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, Ort, Wunsch..."
                  className="w-full bg-transparent text-base sm:text-xs text-white placeholder-gray-400 focus:outline-none"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="text-xs text-gray-400 px-1">✕</button>
                )}
              </div>
            </div>

            {/* 6 Visual Swiss City Quick-Cards with Live Profile Counters */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              {SWISS_CITY_HUBS.slice(0, 6).map((city) => {
                const isSelected = activeCanton === city.code;
                return (
                  <button
                    key={city.code}
                    type="button"
                    onClick={() => setActiveCanton(isSelected ? "ALL" : city.code)}
                    className={`group relative h-24 rounded-2xl overflow-hidden border text-left transition cursor-pointer ${
                      isSelected
                        ? "border-[#C8A97E] ring-2 ring-[#C8A97E]/50 scale-[1.02]"
                        : "border-white/15 hover:border-[#C8A97E]/70"
                    }`}
                  >
                    <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                    <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-[10px] font-bold text-[#E5C99B] border border-[#C8A97E]/30">
                      {cantonCounts[city.code] || 12}
                    </div>
                    <div className="absolute bottom-2 left-2.5 right-2">
                      <div className="text-xs font-serif font-bold text-white">{city.name}</div>
                      <div className="text-[10px] text-gray-300 truncate">{city.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* WELT B: "ZÜRICH DAYLIGHT & IVORY" (Helles, seriöses Schweizer Design) */}
      {/* ===================================================================== */}
      {world === "B" && (
        <section className="border-b border-stone-300/80 bg-[#EFECE6] py-8 sm:py-10 px-4 text-[#141418]">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#9E7B4F]/15 text-[#7A5C34] text-xs font-bold uppercase tracking-wider">
                <Sun size={14} />
                <span>SCHWEIZER VERZEICHNIS & PLATTFORMVERGLEICH</span>
              </div>
              <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#141418] leading-[1.12]">
                Seriöse Orientierung. Geprüfte Profile. Klare Herkunft.
              </h1>
              <p className="text-sm sm:text-base text-stone-600 leading-relaxed max-w-2xl">
                Kein dunkles Hinterzimmer-Chaos: Wähle deine Schweizer Region und deine gewünschte Rubrik oder vergleiche die grossen Portale nach transparenten Kriterien.
              </p>

              {/* Step 1: Rubric Tabs on Light Surface */}
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "female", label: "💃 Escorts & Privat-Models" },
                  { id: "massage", label: "💆‍♀️ Erotik- & Tantra-Massage" },
                  { id: "trans", label: "🏳️‍⚧️ Trans / TS" },
                  { id: "all", label: "Alle zeigen" },
                ].map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setActiveRubric(r.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                      activeRubric === r.id
                        ? "bg-[#141418] text-white shadow-md"
                        : "bg-white text-stone-700 border border-stone-300 hover:border-[#9E7B4F]"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>

              {/* Step 2: City Pills on Light Surface */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <button
                  onClick={() => setActiveCanton("ALL")}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold cursor-pointer ${
                    activeCanton === "ALL" ? "bg-[#9E7B4F] text-white" : "bg-white border border-stone-300 text-stone-700"
                  }`}
                >
                  🇨🇭 Ganze Schweiz
                </button>
                {SWISS_CITY_HUBS.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setActiveCanton(c.code)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer ${
                      activeCanton === c.code
                        ? "bg-[#9E7B4F] text-white font-bold"
                        : "bg-white border border-stone-300 text-stone-700 hover:border-[#141418]"
                    }`}
                  >
                    {c.name} ({cantonCounts[c.code] || 0})
                  </button>
                ))}
              </div>
            </div>

            {/* Right: 2 Featured Editorial Cards (Guaranteed NOT repeated in the main grid below!) */}
            <div className="lg:col-span-5 grid grid-cols-2 gap-3.5">
              {filteredProfiles.slice(0, 2).map((fp: any, i: number) => (
                <div key={`light-feat-${i}`}>
                  {renderEditorialPortraitCard(fp, i, "light-hero")}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* WELT C: "FGIRL / NETFLIX VISUAL STREAMS" (Kuratierte Themen-Reihen)   */}
      {/* ===================================================================== */}
      {world === "C" && (
        <section className="border-b border-white/10 bg-[#0D1017] py-6 px-4">
          <div className="max-w-7xl mx-auto space-y-6">
            {/* Big Top Category Switcher Tabs (Like Fgirl.ch) */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4">
              <div className="flex flex-wrap gap-2">
                {[
                  { id: "female", label: "🔥 Escorts & Begleitung" },
                  { id: "massage", label: "✨ Tantra & Massage" },
                  { id: "trans", label: "🏳️‍⚧️ Trans & TS" },
                  { id: "all", label: "Alle Rubriken" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveRubric(tab.id as any)}
                    className={`px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition cursor-pointer ${
                      activeRubric === tab.id
                        ? "bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.5)]"
                        : "bg-white/5 text-gray-300 border border-white/10 hover:text-white"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
                <Link
                  href="/rankings"
                  className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-white/5 text-[#C8A97E] border border-[#C8A97E]/30 hover:bg-[#C8A97E]/15"
                >
                  🏛️ {totalClubsCount} Clubs & Salons →
                </Link>
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
                <button
                  onClick={() => setActiveCanton("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                    activeCanton === "ALL" ? "bg-[#C8A97E] text-black" : "bg-white/5 text-gray-300"
                  }`}
                >
                  Alle Orte
                </button>
                {SWISS_CITY_HUBS.slice(0, 6).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setActiveCanton(c.code)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                      activeCanton === c.code ? "bg-[#C8A97E] text-black font-bold" : "bg-white/5 text-gray-300"
                    }`}
                  >
                    {c.code}
                  </button>
                ))}
              </div>
            </div>

            {/* Stream 1: Highlighted Horizontal Carousel (Indices 0..5, while main grid starts at 6 -> ZERO DUPLICATES!) */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <Flame size={16} />
                  <span>Ausgewählte Highlights ({activeCanton === "ALL" ? "Schweiz" : activeCanton})</span>
                </h2>
                <span className="text-xs text-gray-400">Horizontal wischen →</span>
              </div>
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide snap-x">
                {filteredProfiles.slice(0, 6).map((p: any, idx: number) => (
                  <div key={`stream-${idx}`} className="snap-start shrink-0 w-56 sm:w-64">
                    {renderEditorialPortraitCard(p, idx, "stream-top")}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* WELT D: "SCHWEIZER REGIONEN- & KANTONS-FINDER" (Geo-First)            */}
      {/* ===================================================================== */}
      {world === "D" && (
        <section className="border-b border-white/10 bg-[#0E1525] py-8 px-4">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#C8A97E] flex items-center gap-1.5">
                  <Compass size={15} />
                  <span>SCHRITT 1: WÄHLE DEINE SCHWEIZER REGION</span>
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">
                  In welcher Stadt suchst du heute?
                </h1>
              </div>

              {/* Rubric Switcher */}
              <div className="flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
                {[
                  { id: "female", label: "Escorts & Girls" },
                  { id: "massage", label: "Massage" },
                  { id: "trans", label: "Trans / TS" },
                  { id: "all", label: "Alle" },
                ].map((r) => (
                  <button
                    key={r.id}
                    onClick={() => setActiveRubric(r.id as any)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                      activeRubric === r.id ? "bg-[#C8A97E] text-black" : "text-gray-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 8 Large Visual Swiss City Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
              {SWISS_CITY_HUBS.map((city) => {
                const isSelected = activeCanton === city.code;
                return (
                  <button
                    key={city.code}
                    type="button"
                    onClick={() => setActiveCanton(isSelected ? "ALL" : city.code)}
                    className={`group relative h-28 sm:h-32 rounded-2xl overflow-hidden border-2 text-left transition cursor-pointer ${
                      isSelected
                        ? "border-[#C8A97E] ring-2 ring-[#C8A97E]/50"
                        : "border-white/15 hover:border-[#C8A97E]"
                    }`}
                  >
                    <img src={city.image} alt={city.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                    <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full bg-[#C8A97E] text-[#090A0F] text-[10px] font-extrabold">
                      {cantonCounts[city.code] || 15} Profile
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-sm sm:text-base font-serif font-bold text-white">{city.name}</div>
                      <div className="text-[11px] text-gray-300 truncate">{city.sub}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* HAUPTKATALOG (GARANTIERT OHNE DOPPLUNG DER HERO-BILDER!)              */}
      {/* ===================================================================== */}
      <main className="max-w-7xl mx-auto px-3 sm:px-4 pt-6 pb-8">
        {/* Filter Status Bar */}
        <div
          className={`flex flex-wrap items-center justify-between gap-2 mb-5 pb-3 border-b ${
            isLightWorld ? "border-stone-300" : "border-white/10"
          }`}
        >
          <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
            <StencilSerifX color={isLightWorld ? "#7A5C34" : "#C8A97E"} className="w-4 h-3.5 shrink-0" />
            <span className="font-bold">
              {activeRubric === "female"
                ? "Escorts & Privat-Models"
                : activeRubric === "massage"
                ? "Erotik- & Tantra-Massagen"
                : activeRubric === "trans"
                ? "Trans & TS Profile"
                : "Alle Rubriken"}
            </span>
            <span className="opacity-50">in</span>
            <span className={`font-bold ${isLightWorld ? "text-[#7A5C34]" : "text-[#C8A97E]"}`}>
              {activeCanton === "ALL" ? "der ganzen Schweiz" : `Kanton ${activeCanton}`}
            </span>
            <span className="opacity-60 text-xs">({filteredProfiles.length} Treffer)</span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setOnlyConfirmedAvailable(!onlyConfirmedAvailable)}
              className={`px-3 py-1.5 rounded-xl border font-semibold cursor-pointer transition ${
                onlyConfirmedAvailable
                  ? "bg-emerald-500 text-black border-emerald-400 font-bold"
                  : isLightWorld
                  ? "bg-white border-stone-300 text-stone-700"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}
            >
              ● Verfügbarkeit bestätigt
            </button>
            <button
              type="button"
              onClick={() => setOnlySelfManaged(!onlySelfManaged)}
              className={`px-3 py-1.5 rounded-xl border font-semibold cursor-pointer transition ${
                onlySelfManaged
                  ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E] font-bold"
                  : isLightWorld
                  ? "bg-white border-stone-300 text-stone-700"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}
            >
              ✓ Selbst verwaltet
            </button>
            {(activeCanton !== "ALL" || activeRubric !== "female" || searchQuery || onlyConfirmedAvailable || onlySelfManaged) && (
              <button
                type="button"
                onClick={resetAll}
                className="px-3 py-1.5 rounded-xl bg-rose-500/15 text-rose-400 font-bold cursor-pointer"
              >
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Main Grid: Slice offset prevents ANY duplicate from World B (offset 2) or World C (offset 6)! */}
        {(() => {
          const offset = world === "B" ? 2 : world === "C" ? 6 : 0;
          const gridItems = filteredProfiles.slice(offset, offset + visibleCount);

          if (gridItems.length === 0) {
            return (
              <div className="p-10 rounded-2xl border border-white/10 text-center space-y-3">
                <h3 className="text-lg font-serif font-bold">Keine Einträge für diese Auswahl</h3>
                <button
                  onClick={resetAll}
                  className="px-5 py-2.5 rounded-xl bg-[#C8A97E] text-[#090A0F] font-bold text-xs cursor-pointer"
                >
                  Filter zurücksetzen
                </button>
              </div>
            );
          }

          return (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-6">
              {gridItems.map((p: any, idx: number) => renderEditorialPortraitCard(p, idx, "main-grid"))}
            </div>
          );
        })()}

        <div className="text-center mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={loadMoreFromServerVault}
            disabled={loadingVault}
            className="px-8 py-3.5 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
          >
            {loadingVault ? "Lädt..." : "Weitere Profile laden"}
          </button>
          <Link
            href="/search"
            className={`px-6 py-3.5 rounded-xl border text-xs font-bold ${
              isLightWorld
                ? "border-stone-300 bg-white text-stone-800"
                : "border-white/15 bg-white/5 text-gray-200"
            }`}
          >
            Erweiterte Detail-Suche →
          </Link>
        </div>

        {/* Bottom 3 Pillars (Reviews, Clubs, Provider Control) */}
        <div
          className={`grid grid-cols-1 md:grid-cols-3 gap-4 mt-14 pt-8 border-t ${
            isLightWorld ? "border-stone-300" : "border-white/10"
          }`}
        >
          <Link
            href="/reviews"
            className={`p-5 rounded-2xl border transition group ${
              isLightWorld ? "bg-white border-stone-200 shadow-sm" : "bg-[#12131A] border-white/10 hover:border-[#C8A97E]"
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <Scale size={14} />
              <span>01 · Redaktioneller Vergleich</span>
            </div>
            <h3 className="text-base font-serif font-bold mt-1.5 flex items-center justify-between">
              <span>Xdate, Fgirl & Co. im Test</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs opacity-70 mt-1">
              Sachliche Einzelberichte zu Funktionen, Kosten und Prüfverfahren der grossen Schweizer Portale.
            </p>
          </Link>

          <Link
            href="/rankings"
            className={`p-5 rounded-2xl border transition group ${
              isLightWorld ? "bg-white border-stone-200 shadow-sm" : "bg-[#12131A] border-white/10 hover:border-[#C8A97E]"
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <Building2 size={14} />
              <span>02 · Stationäre Adressen</span>
            </div>
            <h3 className="text-base font-serif font-bold mt-1.5 flex items-center justify-between">
              <span>{totalClubsCount} Schweizer Clubs & Studios</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs opacity-70 mt-1">
              Stationäre Laufhäuser, FKK-Clubs, Kontaktbars und Massagestudios nach Kanton geordnet.
            </p>
          </Link>

          <Link
            href="/advertise"
            className={`p-5 rounded-2xl border transition group ${
              isLightWorld ? "bg-white border-stone-200 shadow-sm" : "bg-[#12131A] border-white/10 hover:border-[#C8A97E]"
            }`}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <UserCheck size={14} />
              <span>03 · Für Anbieterinnen</span>
            </div>
            <h3 className="text-base font-serif font-bold mt-1.5 flex items-center justify-between">
              <span>Profil kostenlos selbst verwalten</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs opacity-70 mt-1">
              Bestehenden Eintrag übernehmen, Angaben korrigieren, Verfügbarkeit bestätigen oder kostenlos entfernen.
            </p>
          </Link>
        </div>
      </main>

      {selectedIndexProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-white">
          <div className="max-w-md w-full rounded-2xl bg-[#12131A] border border-[#C8A97E]/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                Quellenangabe · {selectedIndexProfile.sourcePortal || "Index"}
              </span>
              <button onClick={() => setSelectedIndexProfile(null)} className="text-gray-400 hover:text-white text-sm p-1">
                ✕
              </button>
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              {selectedIndexProfile.rawName} ({selectedIndexProfile.cleanCity || "Schweiz"}, {selectedIndexProfile.canton})
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Dieser Eintrag stammt aus einer öffentlich erreichbaren Quelle ({selectedIndexProfile.sourcePortal || "Portal-Index"}).
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href={`/profile/${encodeURIComponent(selectedIndexProfile.id)}`}
                className="py-2.5 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs text-center"
              >
                Vollständige Profilansicht öffnen →
              </Link>
              {selectedIndexProfile.sourceUrl && (
                <a
                  href={selectedIndexProfile.sourceUrl}
                  target="_blank"
                  rel="noreferrer nofollow"
                  onClick={() => recordEvent(selectedIndexProfile.id, "track_source_out")}
                  className="py-2 rounded-lg bg-white/5 text-gray-200 font-semibold text-xs text-center border border-white/10 flex items-center justify-center gap-1.5"
                >
                  <span>Originalquelle öffnen</span>
                  <ExternalLink size={12} />
                </a>
              )}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <Link
                  href={`/create-post?claim=${encodeURIComponent(selectedIndexProfile.rawName || "")}&id=${encodeURIComponent(selectedIndexProfile.id)}`}
                  className="py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] text-center"
                >
                  Mein Profil? Verwalten
                </Link>
                <Link
                  href={`/report?name=${encodeURIComponent(selectedIndexProfile.rawName || "")}&id=${encodeURIComponent(selectedIndexProfile.id)}`}
                  className="py-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold text-[11px] text-center"
                >
                  Melden / Entfernen
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}