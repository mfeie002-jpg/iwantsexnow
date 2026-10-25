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
  Phone,
  Search,
  Sparkles,
  Building2,
  Scale,
  UserCheck,
  ArrowUpRight,
  ExternalLink,
  Info,
  RotateCcw,
  SlidersHorizontal,
  Flame,
} from "lucide-react";

export type FamiliarLayoutId = "1" | "2" | "3" | "4";

// 1. Korrekte Schweizer Orts-zu-Kanton-Zuordnung (Kein "Emmen (ZH)" oder "Basel (ZH)" mehr!)
function inferTrueSwissCanton(cityRaw: string, fallbackCanton: string): { cleanCity: string; trueCanton: string } {
  const firstPart = String(cityRaw || "Zürich").split("/")[0].split(",")[0].trim();
  const cLow = firstPart.toLowerCase();

  const cityMap: Array<[string, string]> = [
    ["emmen", "LU"], ["luzern", "LU"], ["kriens", "LU"], ["sursee", "LU"], ["sempach", "LU"],
    ["basel", "BS"], ["liestal", "BL"], ["pratteln", "BL"],
    ["menziken", "AG"], ["aarau", "AG"], ["baden", "AG"], ["wettingen", "AG"], ["spreitenbach", "AG"], ["oftringen", "AG"], ["riniken", "AG"], ["schafisheim", "AG"], ["wohlen", "AG"], ["lenzburg", "AG"],
    ["zug", "ZG"], ["cham", "ZG"], ["baar", "ZG"], ["rotkreuz", "ZG"],
    ["bern", "BE"], ["biel", "BE"], ["thun", "BE"], ["interlaken", "BE"], ["niederbipp", "BE"],
    ["st. gallen", "SG"], ["st gallen", "SG"], ["wil", "SG"], ["buchs", "SG"], ["rapperswil", "SG"], ["bad ragaz", "SG"],
    ["frauenfeld", "TG"], ["weinfelden", "TG"], ["kreuzlingen", "TG"],
    ["solothurn", "SO"], ["olten", "SO"], ["härkingen", "SO"],
    ["genève", "GE"], ["geneve", "GE"], ["genf", "GE"], ["carouge", "GE"],
    ["lausanne", "VD"], ["montreux", "VD"], ["nyon", "VD"],
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

// 2. Vertraute Schweizer Standard-Rubriken (wie auf xdate.ch, and6.com & fgirl.ch)
function inferFamiliarCategory(item: any): "girls" | "massage" | "bdsm" | "trans" {
  const text = `${item.rawName || ""} ${(item.includedTags || []).join(" ")} ${item.bio || ""}`.toLowerCase();
  if (/\b(trans|ts|ladyboy|shemale|transe)\b/.test(text)) return "trans";
  if (/\b(domina|bdsm|fetisch|herrin|sklav|bizarr)\b/.test(text)) return "bdsm";
  if (/\b(tantra|masseurin|thaimassage|body-to-body|massage)\b/.test(text) && !/\bescort\b/.test(text)) return "massage";
  return "girls";
}

// Die 6 gelernten Haupt-Tabs, die jeder Schweizer Besucher von Xdate / And6 / Fgirl kennt
const FAMILIAR_MAIN_TABS = [
  { id: "girls", label: "Sie sucht Ihn / Escorts", badge: "Hauptkatalog" },
  { id: "massage", label: "Erotische Massagen & Tantra", badge: "B2B & Nuru" },
  { id: "bdsm", label: "Domina & BDSM", badge: "Fetisch" },
  { id: "trans", label: "Transsexuelle / TS", badge: "TS" },
  { id: "all", label: "Alle Inserate", badge: "Komplett" },
];

// Vertraute Regionen-Liste mit Schweizer Kantonskürzeln (wie auf and6.com / xdate.ch)
const SWISS_REGIONS = [
  { code: "ALL", name: "Alle Regionen (Schweiz)" },
  { code: "ZH", name: "Zürich (Stadt & Region)" },
  { code: "ZG", name: "Zug & Cham" },
  { code: "AG", name: "Aargau (Baden / Aarau)" },
  { code: "BS", name: "Basel & Nordwestschweiz" },
  { code: "LU", name: "Luzern & Zentralschweiz" },
  { code: "BE", name: "Bern & Mittelland" },
  { code: "SG", name: "St. Gallen & Ostschweiz" },
  { code: "SO", name: "Solothurn & Olten" },
  { code: "TG", name: "Thurgau & Bodensee" },
  { code: "GE", name: "Genève (Romandie)" },
  { code: "VD", name: "Waadt / Lausanne" },
];

// Vertraute Schweizer Service-Filter (wie auf and6.com & xdate.ch)
const FAMILIAR_SERVICES = [
  { label: "Girlfriend Experience (GFE)", tag: "GFE" },
  { label: "Haus- & Hotelbesuch (Outcall)", tag: "Outcall" },
  { label: "Privat & Diskret empfangbar", tag: "Privat" },
  { label: "Erotische / Tantra Massage", tag: "Massage" },
  { label: "Zungenküsse & Zärtlichkeit", tag: "Küssen" },
  { label: "Reife Frauen & MILF", tag: "MILF" },
  { label: "Vollbusig / Kurvig (XXL)", tag: "XXL" },
  { label: "Asiatin / Thai", tag: "Asia" },
  { label: "Latina", tag: "Latina" },
];

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

export default function HomePage() {
  const [layout, setLayout] = useState<FamiliarLayoutId>("1");
  const [activeTab, setActiveTab] = useState<"girls" | "massage" | "bdsm" | "trans" | "all">("girls");
  const [activeCanton, setActiveCanton] = useState<string>("ALL");
  const [activeServiceTag, setActiveServiceTag] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(32);
  const [selectedIndexProfile, setSelectedIndexProfile] = useState<any>(null);
  const [vaultExtraProfiles, setVaultExtraProfiles] = useState<any[]>([]);
  const [vaultPage, setVaultPage] = useState<number>(1);
  const [loadingVault, setLoadingVault] = useState<boolean>(false);

  const [serverData, setServerData] = useState<{ metrics: Record<string, any>; states: Record<string, any> }>({
    metrics: {},
    states: {},
  });

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
    const qCombined = `${searchQuery} ${activeServiceTag}`.trim();
    if (!qCombined && activeCanton === "ALL") return;
    const params = new URLSearchParams();
    if (qCombined) params.set("q", qCombined);
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
  }, [searchQuery, activeServiceTag, activeCanton]);

  const loadMoreFromServerVault = async () => {
    setLoadingVault(true);
    try {
      const nextPage = vaultPage + 1;
      const qCombined = `${searchQuery} ${activeServiceTag}`.trim();
      const params = new URLSearchParams();
      if (qCombined) params.set("q", qCombined);
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

  // Aufbereitete Inserate (Cleane Bilder ohne 6navi-Wasserzeichen zuerst + echte Schweizer Kantons-Zuweisung)
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
      const category = inferFamiliarCategory(item);

      const isSelfManaged = Boolean(st.claimed || item.bookingMode === "direct");
      const isIdentityVerified = Boolean(st.identityVerified);
      const availabilityConfirmed = Boolean(st.availabilityConfirmed);
      const isSponsored = Boolean(st.sponsored);

      const portalLow = String(item.sourcePortal || "").toLowerCase();
      const thumbLow = String(item.thumbnail || "").toLowerCase();
      const hasHeavyWatermark = portalLow.includes("6navi") || thumbLow.includes("6navi") || thumbLow.includes("sexnavi");
      const isHighResPortal = portalLow.includes("bemygirl") || portalLow.includes("fgirl") || portalLow.includes("xdate");

      const qualityRank =
        (isSponsored ? 200 : 0) +
        (availabilityConfirmed ? 100 : 0) +
        (isIdentityVerified ? 80 : 0) +
        (isSelfManaged ? 60 : 0) +
        (item.rawPhone ? 25 : 0) +
        (isHighResPortal ? 30 : 0) +
        (hasHeavyWatermark ? -50 : 10);

      // Kurze, vertraute Inserate-Headline wie auf xdate.ch / and6.com
      const tagsList = Array.isArray(item.includedTags) && item.includedTags.length > 0
        ? item.includedTags.slice(0, 3).join(" · ")
        : "Privat & Diskret · Direktkontakt";
      const adHeadline = st.bio || item.bio
        ? String(st.bio || item.bio).slice(0, 68)
        : `${tagsList} in ${cleanCity}`;

      uniqueList.push({
        ...item,
        id,
        rawName: st.displayName || item.rawName,
        cleanCity,
        canton: trueCanton,
        category,
        adHeadline,
        advertisedBaseChf: st.rate60Chf || item.advertisedBaseChf,
        isSelfManaged,
        isIdentityVerified,
        availabilityConfirmed,
        isSponsored,
        qualityRank,
        realViews: mt.views || 0,
        realDetailOpens: mt.detailOpens || 0,
        fallbackImg: FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length],
      });
    }

    uniqueList.sort((a, b) => b.qualityRank - a.qualityRank);
    return uniqueList;
  }, [serverData, vaultExtraProfiles]);

  // Exakte Trefferzahlen in Klammern pro Kanton (Genau wie auf and6.com & xdate.ch!)
  const cantonCounts = useMemo(() => {
    const map: Record<string, number> = { ALL: 0 };
    for (const p of enrichedProfiles) {
      if (activeTab !== "all" && p.category !== activeTab) continue;
      map.ALL += 1;
      map[p.canton] = (map[p.canton] || 0) + 1;
    }
    return map;
  }, [enrichedProfiles, activeTab]);

  // Exakte Trefferzahlen pro Haupt-Rubrik
  const tabCounts = useMemo(() => {
    const map: Record<string, number> = { all: enrichedProfiles.length, girls: 0, massage: 0, bdsm: 0, trans: 0 };
    for (const p of enrichedProfiles) {
      if (activeCanton !== "ALL" && p.canton !== activeCanton) continue;
      map[p.category] = (map[p.category] || 0) + 1;
    }
    return map;
  }, [enrichedProfiles, activeCanton]);

  const filteredProfiles = useMemo(() => {
    return enrichedProfiles.filter((p: any) => {
      if (activeTab !== "all" && p.category !== activeTab) return false;
      if (activeCanton !== "ALL" && p.canton !== activeCanton) return false;
      if (onlyAvailable && !p.availabilityConfirmed) return false;
      if (onlyVerified && !p.isSelfManaged && !p.isIdentityVerified) return false;

      const combinedQuery = `${searchQuery} ${activeServiceTag}`.toLowerCase().trim();
      if (combinedQuery) {
        const hay = `${p.rawName || ""} ${p.cleanCity || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""} ${p.rawPhone || ""}`.toLowerCase();
        if (!hay.includes(combinedQuery)) return false;
      }
      return true;
    });
  }, [enrichedProfiles, activeTab, activeCanton, onlyAvailable, onlyVerified, searchQuery, activeServiceTag]);

  const resetAll = () => {
    setActiveCanton("ALL");
    setActiveTab("girls");
    setActiveServiceTag("");
    setSearchQuery("");
    setOnlyAvailable(false);
    setOnlyVerified(false);
  };

  const recordEvent = (profileId: string, action: string) => {
    fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, profileId }),
    }).catch(() => {});
  };

  // =========================================================================
  // DIE VERTRAUTE SCHWEIZER INSERATE-KARTE (Wie auf Xdate / And6 / Fgirl:
  // Grosses Bild + Name/Ort + 1-zeilige Headline + Telefon/Kontakt-Badge!)
  // =========================================================================
  const renderFamiliarAdCard = (p: any, idx: number, keyPrefix: string) => {
    const cleanName =
      String(p.rawName || "Inserat")
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 24) || "Model";
    const rate = p.advertisedBaseChf || null;
    const img = p.thumbnail || p.fallbackImg;
    const hasPhone = Boolean(p.rawPhone && String(p.rawPhone).length >= 9);

    return (
      <article
        key={`${keyPrefix}-${p.id}-${idx}`}
        className={`group rounded-xl overflow-hidden bg-[#12141D] border transition-all duration-300 flex flex-col justify-between ${
          p.isSponsored
            ? "border-[#C8A97E] shadow-[0_8px_25px_rgba(200,169,126,0.18)]"
            : "border-white/10 hover:border-[#C8A97E]/60"
        }`}
      >
        {/* 3:4 Portrait Photo (Entire photo opens the ad immediately!) */}
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07080C]">
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
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0D0F17] via-transparent to-black/25" />
          </Link>

          {/* Top-Left: Familiar Status Badges */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
            {p.availabilityConfirmed ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-500 text-black text-[10px] font-extrabold shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                HEUTE FREI
              </span>
            ) : p.isIdentityVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] text-[10px] font-extrabold shadow">
                <Check size={10} /> ECHTE FOTOS
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded bg-black/75 backdrop-blur text-gray-200 text-[10px] font-semibold border border-white/10">
                📍 {p.cleanCity} ({p.canton})
              </span>
            )}
          </div>

          {/* Top-Right: Discreet Info / Source Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              recordEvent(p.id, "track_click");
              setSelectedIndexProfile(p);
            }}
            title={`Quelle: ${p.sourcePortal || "Index"}`}
            className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/65 hover:bg-[#C8A97E] text-gray-300 hover:text-black flex items-center justify-center transition cursor-pointer border border-white/15"
          >
            <Info size={13} />
          </button>

          {/* Bottom on Photo: Name + City + Rate */}
          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between gap-1"
          >
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-tight truncate group-hover:text-[#C8A97E] transition">
                {cleanName}
              </h3>
              <p className="text-[11px] text-[#E5C99B] font-medium truncate">
                {p.cleanCity} ({p.canton})
              </p>
            </div>
            {rate && (
              <span className="shrink-0 px-2 py-0.5 rounded bg-black/85 border border-[#C8A97E]/40 text-[11px] font-extrabold text-[#C8A97E]">
                CHF {rate}
              </span>
            )}
          </Link>
        </div>

        {/* Compact Xdate/And6-Style Ad Footer (1-line headline + direct phone/contact indicator) */}
        <Link
          href={`/profile/${encodeURIComponent(p.id)}`}
          onClick={() => recordEvent(p.id, "track_click")}
          className="p-2.5 flex flex-col justify-between gap-1.5 hover:bg-white/[0.02] transition"
        >
          <p className="text-[11px] text-gray-300 line-clamp-1 leading-snug">
            {p.adHeadline}
          </p>
          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
            {hasPhone ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1 truncate">
                <Phone size={11} className="shrink-0" />
                <span>{String(p.rawPhone).slice(0, 12)}…</span>
              </span>
            ) : (
              <span className="text-gray-400">Direkt-Inserat</span>
            )}
            <span className="text-[#C8A97E] font-bold group-hover:translate-x-0.5 transition-transform">
              Ansehen →
            </span>
          </div>
        </Link>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-white pb-24 lg:pb-16">
      <SEO
        title="iwantsexnow.ch | Schweizer Escorts, Erotische Massagen & Sexkontakte"
        description="Über 2.800+ Schweizer Escort-Inserate, erotische Massagen, Domina-Studios & 162 Clubs in Zürich, Zug, Aargau, Basel, Luzern, Bern & Genf."
      />

      {/* ===================================================================== */}
      {/* TOP SWITCHER FOR THE 4 FAMILIAR SWISS TOP-10 PORTAL LAYOUTS           */}
      {/* ===================================================================== */}
      <div className="bg-[#141722] border-b border-[#C8A97E]/40 py-1.5 px-3 sticky top-0 z-[60] shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
          <span className="px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] font-extrabold uppercase text-[10px] shrink-0">
            Top-10 Google Vorbilder:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: "1" as FamiliarLayoutId, label: "1. Xdate / And6 Klassiker (Sidebar + Sofort-Grid) ⭐" },
              { id: "2" as FamiliarLayoutId, label: "2. Fgirl.ch Style (Rubrik-Tabs + Story-Bar + 5er-Grid)" },
              { id: "3" as FamiliarLayoutId, label: "3. Kaufmich / EuroGirls (1-Zeilen Dropdown-Filterbank)" },
              { id: "4" as FamiliarLayoutId, label: "4. BeMyGirl Luxury (Kantons-Zähler + Randlose Porträts)" },
            ].map((l) => (
              <button
                key={l.id}
                type="button"
                onClick={() => setLayout(l.id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  layout === l.id
                    ? "bg-[#C8A97E] text-[#090A0F] shadow"
                    : "bg-black/40 text-gray-300 border border-white/10 hover:text-white"
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <LuxuryHeader />

      {/* ===================================================================== */}
      {/* FAMILIAR TOP RUBRIC BAR (SHARED ACROSS SWISS PORTALS:                 */}
      {/* Sie sucht Ihn / Escorts | Massagen | Domina | Trans/TS | 162 Clubs)   */}
      {/* ===================================================================== */}
      <div className="border-b border-white/10 bg-[#0E1018]">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
          <div className="flex items-center gap-1.5 shrink-0">
            {FAMILIAR_MAIN_TABS.map((tab) => {
              const active = activeTab === tab.id;
              const cnt = tabCounts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer shrink-0 ${
                    active
                      ? "bg-[#C8A97E] text-[#090A0F] shadow-md"
                      : "bg-[#151824] text-gray-200 border border-white/10 hover:border-[#C8A97E]/50"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`px-1.5 py-0.5 rounded text-[10px] font-extrabold ${
                      active ? "bg-black/20 text-[#090A0F]" : "bg-white/10 text-[#C8A97E]"
                    }`}
                  >
                    {cnt}
                  </span>
                </button>
              );
            })}

            <Link
              href="/rankings"
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#151824] text-gray-200 border border-white/10 hover:border-[#C8A97E] flex items-center gap-1.5 shrink-0"
            >
              <Building2 size={13} className="text-[#C8A97E]" />
              <span>Clubs & Laufhäuser ({totalClubsCount})</span>
            </Link>
          </div>

          {/* Right Quick Search */}
          <div className="flex items-center bg-[#090A0F] border border-white/15 focus-within:border-[#C8A97E] rounded-xl px-3 py-1.5 w-56 sm:w-64 shrink-0">
            <Search size={14} className="text-[#C8A97E] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ort, Name oder +41 Nr..."
              className="w-full px-2 bg-transparent text-base sm:text-xs text-white placeholder-gray-400 focus:outline-none"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-xs text-gray-400">✕</button>
            )}
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LAYOUT 1: XDATE / AND6 KLASSIKER (Linke Regionen-/Service-Sidebar     */}
      {/*           mit Zahlen in Klammern + Rechts sofort das Inserate-Grid!)  */}
      {/* ===================================================================== */}
      {layout === "1" && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5">
          {/* Mobile Horizontal Region Bar (Only visible on mobile where sidebar is hidden) */}
          <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-white/10 scrollbar-hide">
            {SWISS_REGIONS.map((reg) => (
              <button
                key={reg.code}
                onClick={() => setActiveCanton(reg.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                  activeCanton === reg.code
                    ? "bg-[#C8A97E] text-[#090A0F]"
                    : "bg-[#12141D] text-gray-300 border border-white/10"
                }`}
              >
                {reg.code === "ALL" ? "Schweiz" : reg.code} ({cantonCounts[reg.code] || 0})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT SIDEBAR: Exactly like And6.com & Xdate.ch (Regions with counts + Services) */}
            <aside className="hidden lg:block lg:col-span-3 space-y-5 sticky top-28">
              {/* Box 1: Regionen mit exakter Anzahl in Klammern */}
              <div className="p-4 rounded-2xl bg-[#11131C] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#C8A97E] flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>Regionen (Schweiz)</span>
                  </h2>
                  {activeCanton !== "ALL" && (
                    <button onClick={() => setActiveCanton("ALL")} className="text-[11px] text-rose-300 hover:underline">
                      Alle
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {SWISS_REGIONS.map((reg) => {
                    const isSelected = activeCanton === reg.code;
                    const count = cantonCounts[reg.code] || 0;
                    return (
                      <button
                        key={reg.code}
                        type="button"
                        onClick={() => setActiveCanton(reg.code)}
                        className={`w-full px-3 py-2 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? "bg-[#C8A97E] text-[#090A0F] font-extrabold"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{reg.name}</span>
                        <span
                          className={`text-[11px] font-mono ${
                            isSelected ? "text-[#090A0F] font-black" : "text-gray-500"
                          }`}
                        >
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Box 2: Beliebte Services (1-Klick wie auf And6 / Xdate) */}
              <div className="p-4 rounded-2xl bg-[#11131C] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#C8A97E]">
                    Beliebte Services & Typ
                  </h2>
                  {activeServiceTag && (
                    <button onClick={() => setActiveServiceTag("")} className="text-[11px] text-rose-300 hover:underline">
                      Reset
                    </button>
                  )}
                </div>
                <div className="flex flex-col gap-1">
                  {FAMILIAR_SERVICES.map((srv) => {
                    const active = activeServiceTag === srv.tag;
                    return (
                      <button
                        key={srv.tag}
                        type="button"
                        onClick={() => setActiveServiceTag(active ? "" : srv.tag)}
                        className={`w-full px-2.5 py-1.5 rounded-lg text-xs text-left flex items-center justify-between transition cursor-pointer ${
                          active
                            ? "bg-white/15 text-[#C8A97E] font-bold border border-[#C8A97E]/40"
                            : "text-gray-300 hover:bg-white/5"
                        }`}
                      >
                        <span>{srv.label}</span>
                        <span className="text-[#C8A97E]">{active ? "✓" : "›"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Box 3: Portal-Test & Anbieter-Box */}
              <div className="p-4 rounded-2xl bg-[#11131C] border border-[#C8A97E]/30 space-y-2">
                <div className="text-[10px] font-bold uppercase text-[#C8A97E]">Markt-Vergleich</div>
                <Link href="/reviews" className="block text-xs font-bold text-white hover:text-[#C8A97E]">
                  ⭐ Xdate, Fgirl & And6 im Test →
                </Link>
                <Link href="/advertise" className="block text-xs text-gray-400 hover:text-white pt-1 border-t border-white/10">
                  + Eigenes Inserat kostenlos verwalten →
                </Link>
              </div>
            </aside>

            {/* RIGHT MAIN COLUMN: Immediate Ad Grid! */}
            <div className="lg:col-span-9 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-white/10">
                <div className="text-xs sm:text-sm font-bold text-white">
                  {FAMILIAR_MAIN_TABS.find((t) => t.id === activeTab)?.label} in{" "}
                  <span className="text-[#C8A97E]">
                    {SWISS_REGIONS.find((r) => r.code === activeCanton)?.name}
                  </span>{" "}
                  <span className="text-gray-400 font-normal">({filteredProfiles.length} Inserate)</span>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={() => setOnlyAvailable(!onlyAvailable)}
                    className={`px-3 py-1 rounded-lg border cursor-pointer ${
                      onlyAvailable ? "bg-emerald-500 text-black font-bold" : "bg-[#12141D] border-white/10 text-gray-300"
                    }`}
                  >
                    ● Heute verfügbar
                  </button>
                  <button
                    onClick={() => setOnlyVerified(!onlyVerified)}
                    className={`px-3 py-1 rounded-lg border cursor-pointer ${
                      onlyVerified ? "bg-[#C8A97E] text-black font-bold" : "bg-[#12141D] border-white/10 text-gray-300"
                    }`}
                  >
                    ✓ Geprüft
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                  renderFamiliarAdCard(p, idx, "l1")
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 2: FGIRL.CH STYLE (Kantons-Zähler-Pills + Hot Stories + 5er Grid) */}
      {/* ===================================================================== */}
      {layout === "2" && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5 space-y-5">
          {/* Canton Pills with exact counts (like Fgirl.ch) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-hide">
            {SWISS_REGIONS.map((reg) => {
              const active = activeCanton === reg.code;
              return (
                <button
                  key={reg.code}
                  onClick={() => setActiveCanton(reg.code)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold shrink-0 cursor-pointer transition ${
                    active
                      ? "bg-rose-600 text-white shadow-lg"
                      : "bg-[#12141D] text-gray-300 border border-white/10 hover:border-rose-500/50"
                  }`}
                >
                  {reg.code === "ALL" ? "🇨🇭 Alle Kantone" : reg.name.split("(")[0].trim()}{" "}
                  <span className="opacity-75">({cantonCounts[reg.code] || 0})</span>
                </button>
              );
            })}
          </div>

          {/* Fgirl-Style "Hot Profiles of the Moment" Strip (Indices 0..7, main grid starts at 8 -> NO DUPLICATES!) */}
          <div className="p-4 rounded-2xl bg-[#11131C] border border-white/10 space-y-2.5">
            <div className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
              <Flame size={14} />
              <span>HOT PROFILES OF THE MOMENT ({activeCanton === "ALL" ? "SCHWEIZ" : activeCanton})</span>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
              {filteredProfiles.slice(0, 8).map((hp: any, i: number) => (
                <Link
                  key={`fg-hot-${i}`}
                  href={`/profile/${encodeURIComponent(hp.id)}`}
                  className="group text-center space-y-1"
                >
                  <div className="aspect-square rounded-2xl overflow-hidden border-2 border-rose-500/70 p-0.5 bg-black">
                    <img
                      src={hp.thumbnail || hp.fallbackImg}
                      alt={hp.rawName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = hp.fallbackImg;
                      }}
                      className="w-full h-full object-cover object-top rounded-xl group-hover:scale-105 transition"
                    />
                  </div>
                  <div className="text-[11px] font-bold text-white truncate">{hp.rawName}</div>
                  <div className="text-[10px] text-gray-400 truncate">{hp.cleanCity}</div>
                </Link>
              ))}
            </div>
          </div>

          {/* 5-Column Dense Gallery Grid (Starting at index 8 so 0% duplicate with Hot Strip above!) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredProfiles.slice(8, 8 + visibleCount).map((p: any, idx: number) =>
              renderFamiliarAdCard(p, idx, "l2")
            )}
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 3: KAUFMICH / EUROGIRLS (1-Zeilen Dropdown-Filterbank + Grid)  */}
      {/* ===================================================================== */}
      {layout === "3" && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5 space-y-5">
          {/* Familiar 4-Column Horizontal Filter Bar */}
          <div className="p-4 rounded-2xl bg-[#12141D] border border-[#C8A97E]/40 shadow-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div>
              <label className="block text-[10px] font-bold uppercase text-[#C8A97E] mb-1">
                1. Rubrik wählen
              </label>
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value as any)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/15 text-xs font-bold text-white"
              >
                {FAMILIAR_MAIN_TABS.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.label} ({tabCounts[t.id] || 0})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#C8A97E] mb-1">
                2. Kanton / Stadt
              </label>
              <select
                value={activeCanton}
                onChange={(e) => setActiveCanton(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/15 text-xs font-bold text-white"
              >
                {SWISS_REGIONS.map((r) => (
                  <option key={r.code} value={r.code}>
                    {r.name} ({cantonCounts[r.code] || 0})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase text-[#C8A97E] mb-1">
                3. Beliebter Service / Typ
              </label>
              <select
                value={activeServiceTag}
                onChange={(e) => setActiveServiceTag(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/15 text-xs font-bold text-white"
              >
                <option value="">Alle Services & Vorlieben</option>
                {FAMILIAR_SERVICES.map((s) => (
                  <option key={s.tag} value={s.tag}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={() => setOnlyAvailable(!onlyAvailable)}
                className={`flex-1 py-2.5 px-3 rounded-xl border text-xs font-bold cursor-pointer ${
                  onlyAvailable
                    ? "bg-emerald-500 text-black border-emerald-400"
                    : "bg-[#090A0F] border-white/15 text-gray-300"
                }`}
              >
                ● Heute frei
              </button>
              <button
                type="button"
                onClick={resetAll}
                className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-bold text-[#C8A97E] cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
              renderFamiliarAdCard(p, idx, "l3")
            )}
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 4: BEMYGIRL LUXURY (Kantons-Zähler + Randlose 3:4 Porträts)    */}
      {/* ===================================================================== */}
      {layout === "4" && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C8A97E]/25">
            <div className="flex flex-wrap gap-1.5">
              {SWISS_REGIONS.slice(0, 9).map((reg) => (
                <button
                  key={reg.code}
                  onClick={() => setActiveCanton(reg.code)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                    activeCanton === reg.code
                      ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E]"
                      : "bg-[#11131C] text-gray-300 border-white/10 hover:border-[#C8A97E]/50"
                  }`}
                >
                  {reg.code === "ALL" ? "Alle Regionen" : reg.name.split("(")[0].trim()}{" "}
                  <span className="opacity-70">({cantonCounts[reg.code] || 0})</span>
                </button>
              ))}
            </div>
            <div className="flex gap-1.5">
              {FAMILIAR_SERVICES.slice(0, 4).map((s) => (
                <button
                  key={s.tag}
                  onClick={() => setActiveServiceTag(activeServiceTag === s.tag ? "" : s.tag)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer ${
                    activeServiceTag === s.tag
                      ? "bg-white text-black border-white font-bold"
                      : "bg-white/5 border-white/10 text-gray-300"
                  }`}
                >
                  {s.tag}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
              renderFamiliarAdCard(p, idx, "l4")
            )}
          </div>
        </main>
      )}

      {/* Load More & Secondary Doors */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="text-center flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={loadMoreFromServerVault}
            disabled={loadingVault}
            className="px-8 py-3.5 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg"
          >
            {loadingVault ? "Lädt..." : "Weitere Inserate anzeigen"}
          </button>
          <Link
            href="/search"
            className="px-6 py-3.5 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-gray-200"
          >
            Alle Filter öffnen →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10">
          <Link href="/reviews" className="p-5 rounded-2xl bg-[#11131C] border border-white/10 hover:border-[#C8A97E] transition">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">01 · Portal-Test</div>
            <h3 className="text-base font-serif font-bold text-white mt-1 flex items-center justify-between">
              <span>Xdate, Fgirl & And6 im Vergleich</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1">Sachliche Einzelberichte zu Kosten, Reichweite & Funktionen.</p>
          </Link>

          <Link href="/rankings" className="p-5 rounded-2xl bg-[#11131C] border border-white/10 hover:border-[#C8A97E] transition">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">02 · Etablissements</div>
            <h3 className="text-base font-serif font-bold text-white mt-1 flex items-center justify-between">
              <span>{totalClubsCount} Schweizer Clubs & Laufhäuser</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1">Alle Kontaktdaten und Standorte nach Kanton geordnet.</p>
          </Link>

          <Link href="/advertise" className="p-5 rounded-2xl bg-[#11131C] border border-white/10 hover:border-[#C8A97E] transition">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">03 · Für Anbieterinnen</div>
            <h3 className="text-base font-serif font-bold text-white mt-1 flex items-center justify-between">
              <span>Inserat kostenlos selbst verwalten</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1">Bestehenden Eintrag übernehmen, korrigieren oder entfernen.</p>
          </Link>
        </div>
      </div>

      {selectedIndexProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#11131C] border border-[#C8A97E]/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                Quellenangabe · {selectedIndexProfile.sourcePortal || "Index"}
              </span>
              <button onClick={() => setSelectedIndexProfile(null)} className="text-gray-400 hover:text-white text-sm p-1">
                ✕
              </button>
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              {selectedIndexProfile.rawName} ({selectedIndexProfile.cleanCity}, {selectedIndexProfile.canton})
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Dieser Eintrag stammt aus einer öffentlich erreichbaren Quelle ({selectedIndexProfile.sourcePortal || "Portal-Index"}).
            </p>
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href={`/profile/${encodeURIComponent(selectedIndexProfile.id)}`}
                className="py-2.5 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs text-center"
              >
                Vollständige Inserate-Ansicht öffnen →
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
                  Mein Inserat? Verwalten
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