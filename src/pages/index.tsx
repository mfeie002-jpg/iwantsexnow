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
  Flame,
  Eye,
  Plus,
  X,
  ShieldCheck,
  Clock,
  SlidersHorizontal,
} from "lucide-react";

export type SuperiorLayoutId = "1" | "2" | "3" | "4";

// 1. Präziser Schweizer Orts-zu-Kanton-Korrektor (Verhindert "Basel (ZH)" oder "Emmen (ZH)"!)
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

function inferFamiliarCategory(item: any): "girls" | "massage" | "bdsm" | "trans" {
  const text = `${item.rawName || ""} ${(item.includedTags || []).join(" ")} ${item.bio || ""}`.toLowerCase();
  if (/\b(trans|ts|ladyboy|shemale|transe)\b/.test(text)) return "trans";
  if (/\b(domina|bdsm|fetisch|herrin|sklav|bizarr)\b/.test(text)) return "bdsm";
  if (/\b(tantra|masseurin|thaimassage|body-to-body|massage)\b/.test(text) && !/\bescort\b/.test(text)) return "massage";
  return "girls";
}

// Vertraute Schweizer Haupt-Rubriken
const FAMILIAR_MAIN_TABS = [
  { id: "girls", label: "Sie sucht Ihn / Escorts" },
  { id: "massage", label: "Erotische Massagen & Tantra" },
  { id: "bdsm", label: "Domina & BDSM" },
  { id: "trans", label: "Transsexuelle / TS" },
  { id: "all", label: "Alle Inserate" },
];

// Vertraute Schweizer Regionen mit Zählern
const SWISS_REGIONS = [
  { code: "ALL", name: "Alle Regionen (Schweiz)", short: "🇨🇭 Alle" },
  { code: "ZH", name: "Zürich (Stadt & Region)", short: "Zürich" },
  { code: "ZG", name: "Zug & Cham", short: "Zug & Cham" },
  { code: "AG", name: "Aargau (Baden / Aarau)", short: "Aargau" },
  { code: "BS", name: "Basel & Nordwestschweiz", short: "Basel" },
  { code: "LU", name: "Luzern & Zentralschweiz", short: "Luzern" },
  { code: "BE", name: "Bern & Mittelland", short: "Bern" },
  { code: "SG", name: "St. Gallen & Ostschweiz", short: "St. Gallen" },
  { code: "SO", name: "Solothurn & Olten", short: "Solothurn" },
  { code: "TG", name: "Thurgau & Bodensee", short: "Thurgau" },
  { code: "GE", name: "Genève (Romandie)", short: "Genève" },
  { code: "VD", name: "Waadt / Lausanne", short: "Lausanne" },
];

// Vertraute Schweizer Service-Filter + Visuelle Vibe-Pills
const FAMILIAR_SERVICES = [
  { label: "Girlfriend Experience (GFE)", tag: "GFE", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=250&q=80" },
  { label: "Haus- & Hotelbesuch", tag: "Outcall", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=250&q=80" },
  { label: "Privat & Diskret", tag: "Privat", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80" },
  { label: "Tantra & Body2Body", tag: "Massage", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=250&q=80" },
  { label: "Latina & Kurvig", tag: "Latina", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=250&q=80" },
  { label: "Asiatin & Thai", tag: "Asia", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=250&q=80" },
  { label: "Zungenküsse & Zärtlich", tag: "Küssen", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=250&q=80" },
  { label: "Reife Frauen & MILF", tag: "MILF", img: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=250&q=80" },
];

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

export default function HomePage() {
  const [layout, setLayout] = useState<SuperiorLayoutId>("1");
  const [activeTab, setActiveTab] = useState<"girls" | "massage" | "bdsm" | "trans" | "all">("girls");
  const [activeCanton, setActiveCanton] = useState<string>("ALL");
  const [activeServiceTag, setActiveServiceTag] = useState<string>("");
  const [maxPriceChf, setMaxPriceChf] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(32);

  // UNSER UNIQUE FEATURE 1: ⚡ Quick-Peek Slide-Over Drawer (0-Tab-Wechsel!)
  const [quickPeekProfile, setQuickPeekProfile] = useState<any>(null);

  // UNSER UNIQUE FEATURE 2: ⚖️ Live Compare-Tray (Bis zu 3 Models direkt vergleichen!)
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);

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

      const rate = Number(st.rate60Chf || item.advertisedBaseChf) || 350;
      const tagsList =
        Array.isArray(item.includedTags) && item.includedTags.length > 0
          ? item.includedTags.slice(0, 3)
          : ["GFE", "Privat", "Diskret"];
      const adHeadline =
        st.bio || item.bio
          ? String(st.bio || item.bio).slice(0, 70)
          : `${tagsList.join(" · ")} in ${cleanCity}`;

      uniqueList.push({
        ...item,
        id,
        rawName: st.displayName || item.rawName,
        cleanCity,
        canton: trueCanton,
        category,
        adHeadline,
        includedTags: tagsList,
        advertisedBaseChf: rate,
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

  const cantonCounts = useMemo(() => {
    const map: Record<string, number> = { ALL: 0 };
    for (const p of enrichedProfiles) {
      if (activeTab !== "all" && p.category !== activeTab) continue;
      map.ALL += 1;
      map[p.canton] = (map[p.canton] || 0) + 1;
    }
    return map;
  }, [enrichedProfiles, activeTab]);

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
      if (maxPriceChf < 1000 && Number(p.advertisedBaseChf || 350) > maxPriceChf) return false;
      if (onlyAvailable && !p.availabilityConfirmed) return false;
      if (onlyVerified && !p.isSelfManaged && !p.isIdentityVerified) return false;

      const combinedQuery = `${searchQuery} ${activeServiceTag}`.toLowerCase().trim();
      if (combinedQuery) {
        const hay = `${p.rawName || ""} ${p.cleanCity || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""} ${p.rawPhone || ""}`.toLowerCase();
        if (!hay.includes(combinedQuery)) return false;
      }
      return true;
    });
  }, [enrichedProfiles, activeTab, activeCanton, maxPriceChf, onlyAvailable, onlyVerified, searchQuery, activeServiceTag]);

  // Berechne den Live-Marktpreis-Schnitt der aktuellen Auswahl (Unser Unique Comparis-Vorteil!)
  const avgRegionRate = useMemo(() => {
    if (filteredProfiles.length === 0) return 350;
    const sum = filteredProfiles.slice(0, 40).reduce((acc, p) => acc + (Number(p.advertisedBaseChf) || 350), 0);
    return Math.round(sum / Math.min(40, filteredProfiles.length) / 10) * 10;
  }, [filteredProfiles]);

  const toggleCompare = (pid: string) => {
    setCompareIds((prev) => {
      if (prev.includes(pid)) return prev.filter((x) => x !== pid);
      if (prev.length >= 3) return [...prev.slice(1), pid];
      return [...prev, pid];
    });
  };

  const comparedProfiles = useMemo(() => {
    return enrichedProfiles.filter((p) => compareIds.includes(p.id));
  }, [enrichedProfiles, compareIds]);

  const resetAll = () => {
    setActiveCanton("ALL");
    setActiveTab("girls");
    setActiveServiceTag("");
    setMaxPriceChf(1000);
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
  // DIE "FAMILIAR, YET SUPERIOR" INSERATE-KARTE:
  // Vertraut wie Xdate/And6/Fgirl, ABER mit:
  // - ⚡ 1-Klick Quick-Peek (Kein Tab-Wechsel nötig!)
  // - ⚖️ +Vergleich Checkbox (Bis zu 3 Models nebeneinander vergleichen!)
  // - 🛡️ Klarem 3-Stufen Herkunfts- & Preis-Check
  // =========================================================================
  const renderSuperiorAdCard = (p: any, idx: number, keyPrefix: string) => {
    const cleanName =
      String(p.rawName || "Inserat")
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 24) || "Model";
    const rate = p.advertisedBaseChf || 350;
    const img = p.thumbnail || p.fallbackImg;
    const hasPhone = Boolean(p.rawPhone && String(p.rawPhone).length >= 9);
    const isCompared = compareIds.includes(p.id);

    return (
      <article
        key={`${keyPrefix}-${p.id}-${idx}`}
        className={`group rounded-2xl overflow-hidden bg-[#121520] border transition-all duration-300 flex flex-col justify-between ${
          isCompared
            ? "border-emerald-400 ring-2 ring-emerald-400/40"
            : p.isSponsored
            ? "border-[#C8A97E] shadow-[0_10px_30px_rgba(200,169,126,0.2)]"
            : "border-white/10 hover:border-[#C8A97E]/70 hover:-translate-y-0.5"
        }`}
      >
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
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0D14] via-transparent to-black/30" />
          </Link>

          {/* Top-Left: 3-Stage Trust & Live Status */}
          <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 pointer-events-none">
            {p.availabilityConfirmed ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500 text-black text-[10px] font-extrabold shadow">
                <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
                HEUTE FREI (4h)
              </span>
            ) : p.isIdentityVerified ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#C8A97E] text-[#090A0F] text-[10px] font-extrabold shadow">
                <Check size={10} /> GEPRÜFT
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded-md bg-black/75 backdrop-blur text-gray-200 text-[10px] font-semibold border border-white/15">
                📍 {p.cleanCity} ({p.canton})
              </span>
            )}
          </div>

          {/* Top-Right: UNIQUE FEATURE -> "+ Vergleich" Toggle & Quick-Peek Trigger */}
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                toggleCompare(p.id);
              }}
              title="Zum Direkt-Vergleich hinzufügen"
              className={`px-2 py-1 rounded-md text-[10px] font-bold backdrop-blur border transition cursor-pointer flex items-center gap-0.5 ${
                isCompared
                  ? "bg-emerald-400 text-black border-emerald-300 font-extrabold"
                  : "bg-black/70 hover:bg-black/90 text-gray-200 border-white/15 hover:border-[#C8A97E]"
              }`}
            >
              {isCompared ? <Check size={11} /> : <Plus size={11} />}
              <span className="hidden sm:inline">{isCompared ? "Im Vergleich" : "Vergleich"}</span>
            </button>
          </div>

          {/* Bottom on Photo: Name + City + Rate Badge */}
          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className="absolute bottom-2 left-2.5 right-2.5 flex items-end justify-between gap-1"
          >
            <div className="min-w-0">
              <h3 className="text-sm sm:text-base font-serif font-bold text-white leading-tight truncate group-hover:text-[#E5C99B] transition">
                {cleanName}
              </h3>
              <p className="text-[11px] text-[#C8A97E] font-medium truncate">
                {p.cleanCity} ({p.canton})
              </p>
            </div>
            <div className="shrink-0 text-right">
              <span className="px-2 py-0.5 rounded-md bg-black/85 border border-[#C8A97E]/45 text-[11px] font-extrabold text-[#E5C99B]">
                CHF {rate}
              </span>
            </div>
          </Link>
        </div>

        {/* Superior Card Footer: Service Pills + ⚡ 1-Klick Quick-Peek (No Tab Switching!) */}
        <div className="p-2.5 flex flex-col justify-between gap-2 bg-[#10131C]">
          <div className="flex items-center gap-1 overflow-hidden">
            {(p.includedTags || ["GFE", "Privat"]).slice(0, 3).map((t: string, i: number) => (
              <span
                key={i}
                className="px-1.5 py-0.5 rounded bg-white/5 text-[10px] text-gray-300 border border-white/5 truncate"
              >
                {t}
              </span>
            ))}
          </div>

          <div className="flex items-center justify-between gap-1.5 pt-1 border-t border-white/10">
            {/* UNIQUE FEATURE: ⚡ Quick-View Button opens Slide-Over Drawer immediately! */}
            <button
              type="button"
              onClick={() => {
                recordEvent(p.id, "track_click");
                setQuickPeekProfile(p);
              }}
              className="flex-1 py-1.5 px-2 rounded-lg bg-white/5 hover:bg-[#C8A97E] text-gray-200 hover:text-[#090A0F] text-[11px] font-bold transition flex items-center justify-center gap-1 cursor-pointer border border-white/10"
            >
              <Eye size={12} />
              <span>⚡ Quick-Check</span>
            </button>

            <Link
              href={`/profile/${encodeURIComponent(p.id)}`}
              onClick={() => recordEvent(p.id, "track_click")}
              className="py-1.5 px-2.5 rounded-lg bg-[#C8A97E]/15 hover:bg-[#C8A97E] text-[#E5C99B] hover:text-[#090A0F] text-[11px] font-bold transition shrink-0"
            >
              Inserat →
            </Link>
          </div>
        </div>
      </article>
    );
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-white pb-28 lg:pb-16">
      <SEO
        title="iwantsexnow.ch | Schweizer Escorts, Erotische Massagen & Direkt-Vergleich"
        description="Das vertraute Schweizer Erotik-Verzeichnis – aber besser: Mit ⚡ 1-Klick Quick-Check, ⚖️ Direkt-Vergleich, CHF-Preisfilter und geprüften Kontaktdaten."
      />

      {/* ===================================================================== */}
      {/* TOP SWITCHER FOR THE 4 "FAMILIAR, YET SUPERIOR" SWISS LAYOUTS         */}
      {/* ===================================================================== */}
      <div className="bg-gradient-to-r from-[#121521] via-[#191D2E] to-[#121521] border-b border-[#C8A97E]/45 py-1.5 px-3 sticky top-0 z-[60] shadow-xl">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
          <span className="px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] font-extrabold uppercase text-[10px] shrink-0">
            Vertraut + Unser USP:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: "1" as SuperiorLayoutId, label: "1. Xdate / And6 NEXT (Smart Sidebar + ⚡ Quick-Check + CHF-Filter) ⭐" },
              { id: "2" as SuperiorLayoutId, label: "2. Fgirl.ch ULTRA (Foto-Vibe-Chips + 5er-Wall + Vergleich)" },
              { id: "3" as SuperiorLayoutId, label: "3. Comparis × Escort (Tarif-Radar + 4er-Filterbank + Konditionen)" },
              { id: "4" as SuperiorLayoutId, label: "4. BeMyGirl × Interactive (Luxury Porträts + Hover-Dossier)" },
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
      {/* FAMILIAR TOP RUBRIC BAR + OUR UNIQUE VALUE STRIP                      */}
      {/* ===================================================================== */}
      <div className="border-b border-white/10 bg-[#0D1018]">
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
                      : "bg-[#151926] text-gray-200 border border-white/10 hover:border-[#C8A97E]/50"
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
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-[#151926] text-gray-200 border border-white/10 hover:border-[#C8A97E] flex items-center gap-1.5 shrink-0"
            >
              <Building2 size={13} className="text-[#C8A97E]" />
              <span>Clubs & Laufhäuser ({totalClubsCount})</span>
            </Link>
          </div>

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
      {/* LAYOUT 1: "XDATE / AND6 NEXT" (Vertraute Sidebar + UNSERE 3 UPGRADES: */}
      {/*           CHF-Preis-Filter, Live-Tarifspiegel & ⚡ Quick-Check!)       */}
      {/* ===================================================================== */}
      {layout === "1" && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5">
          {/* Mobile Swipe Region Bar */}
          <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-white/10 scrollbar-hide">
            {SWISS_REGIONS.map((reg) => (
              <button
                key={reg.code}
                onClick={() => setActiveCanton(reg.code)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                  activeCanton === reg.code
                    ? "bg-[#C8A97E] text-[#090A0F]"
                    : "bg-[#121520] text-gray-300 border border-white/10"
                }`}
              >
                {reg.short} ({cantonCounts[reg.code] || 0})
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* SMART LEFT SIDEBAR: Familiar Regions + OUR UNIQUE CHF PRICE FILTER */}
            <aside className="hidden lg:block lg:col-span-3 space-y-4 sticky top-28">
              {/* 1. Regionen mit Zahlen in Klammern (wie And6 / Xdate) */}
              <div className="p-4 rounded-2xl bg-[#11141E] border border-white/10 space-y-2">
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
                <div className="space-y-0.5">
                  {SWISS_REGIONS.map((reg) => {
                    const isSelected = activeCanton === reg.code;
                    const count = cantonCounts[reg.code] || 0;
                    return (
                      <button
                        key={reg.code}
                        type="button"
                        onClick={() => setActiveCanton(reg.code)}
                        className={`w-full px-3 py-1.5 rounded-lg text-xs flex items-center justify-between transition cursor-pointer ${
                          isSelected
                            ? "bg-[#C8A97E] text-[#090A0F] font-extrabold"
                            : "text-gray-300 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <span className="truncate">{reg.name}</span>
                        <span className={`text-[11px] font-mono ${isSelected ? "text-[#090A0F] font-black" : "text-gray-500"}`}>
                          ({count})
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. UNSER USP: Echter Schweizer Stundentarif-Filter (Hat weder Xdate noch And6!) */}
              <div className="p-4 rounded-2xl bg-[#11141E] border border-[#C8A97E]/35 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C8A97E]">
                    💰 Max. Richtpreis (1 Std.)
                  </span>
                  <span className="text-xs font-extrabold text-white">
                    {maxPriceChf >= 1000 ? "Alle Tarife" : `Bis CHF ${maxPriceChf}`}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1.5 text-[11px] font-bold">
                  {[
                    { val: 250, label: "≤ 250" },
                    { val: 350, label: "≤ 350" },
                    { val: 450, label: "≤ 450" },
                    { val: 1000, label: "Alle" },
                  ].map((b) => (
                    <button
                      key={b.val}
                      type="button"
                      onClick={() => setMaxPriceChf(b.val)}
                      className={`py-1.5 rounded-lg border cursor-pointer ${
                        maxPriceChf === b.val
                          ? "bg-[#C8A97E] text-black border-[#C8A97E]"
                          : "bg-black/40 border-white/10 text-gray-300"
                      }`}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-gray-400">
                  Ø Marktpreis in dieser Auswahl: <strong className="text-[#E5C99B]">CHF {avgRegionRate} / Std.</strong>
                </p>
              </div>

              {/* 3. Beliebte Services mit Mini-Thumbnails */}
              <div className="p-4 rounded-2xl bg-[#11141E] border border-white/10 space-y-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h2 className="text-xs font-bold uppercase tracking-wider text-[#C8A97E]">
                    Service & Vorlieben
                  </h2>
                  {activeServiceTag && (
                    <button onClick={() => setActiveServiceTag("")} className="text-[11px] text-rose-300 hover:underline">
                      Reset
                    </button>
                  )}
                </div>
                <div className="space-y-1">
                  {FAMILIAR_SERVICES.map((srv) => {
                    const active = activeServiceTag === srv.tag;
                    return (
                      <button
                        key={srv.tag}
                        type="button"
                        onClick={() => setActiveServiceTag(active ? "" : srv.tag)}
                        className={`w-full p-1.5 rounded-xl text-xs text-left flex items-center justify-between transition cursor-pointer ${
                          active
                            ? "bg-[#C8A97E] text-[#090A0F] font-extrabold"
                            : "text-gray-300 hover:bg-white/5"
                        }`}
                      >
                        <div className="flex items-center gap-2 truncate">
                          <img src={srv.img} alt={srv.label} className="w-6 h-6 rounded-md object-cover shrink-0" />
                          <span className="truncate">{srv.label}</span>
                        </div>
                        <span className="text-[11px] pr-1">{active ? "✓" : "›"}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </aside>

            {/* RIGHT MAIN COLUMN: Superior Insights Bar + Immediate 4-Column Ad Grid */}
            <div className="lg:col-span-9 space-y-4">
              {/* OUR UNIQUE ADVANTAGE BAR ABOVE THE GRID */}
              <div className="p-3 rounded-2xl bg-gradient-to-r from-[#121624] via-[#171C2E] to-[#121624] border border-[#C8A97E]/35 flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-bold text-white">
                    {SWISS_REGIONS.find((r) => r.code === activeCanton)?.name}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/10 text-[#E5C99B] font-bold">
                    {filteredProfiles.length} Inserate
                  </span>
                  <span className="text-gray-400 hidden sm:inline">
                    · Ø Richtwert: <strong className="text-white">CHF {avgRegionRate}/h</strong>
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 text-xs">
                  <button
                    onClick={() => setOnlyAvailable(!onlyAvailable)}
                    className={`px-3 py-1 rounded-lg border cursor-pointer ${
                      onlyAvailable ? "bg-emerald-500 text-black font-bold" : "bg-black/40 border-white/15 text-gray-300"
                    }`}
                  >
                    ● Heute frei (4h)
                  </button>
                  <button
                    onClick={() => setOnlyVerified(!onlyVerified)}
                    className={`px-3 py-1 rounded-lg border cursor-pointer ${
                      onlyVerified ? "bg-[#C8A97E] text-black font-bold" : "bg-black/40 border-white/15 text-gray-300"
                    }`}
                  >
                    ✓ Geprüft / Selbst verwaltet
                  </button>
                  {(activeCanton !== "ALL" || activeServiceTag || maxPriceChf < 1000 || onlyAvailable || onlyVerified) && (
                    <button onClick={resetAll} className="px-2.5 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold cursor-pointer">
                      Reset
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3.5">
                {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                  renderSuperiorAdCard(p, idx, "s1")
                )}
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 2: "FGIRL.CH ULTRA" (Visual Vibe-Chips + Canton Pills + 5-Grid)*/}
      {/* ===================================================================== */}
      {layout === "2" && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5 space-y-4">
          {/* Row 1: Canton Pills with exact numbers in parentheses */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {SWISS_REGIONS.map((reg) => {
              const active = activeCanton === reg.code;
              return (
                <button
                  key={reg.code}
                  onClick={() => setActiveCanton(reg.code)}
                  className={`px-3.5 py-2 rounded-full text-xs font-bold shrink-0 cursor-pointer transition ${
                    active
                      ? "bg-[#C8A97E] text-[#090A0F] shadow-lg"
                      : "bg-[#121520] text-gray-300 border border-white/10 hover:border-[#C8A97E]/50"
                  }`}
                >
                  {reg.short} <span className="opacity-75">({cantonCounts[reg.code] || 0})</span>
                </button>
              );
            })}
          </div>

          {/* Row 2: OUR UPGRADE OVER FGIRL -> Visual Photo Vibe Chips + Instant Price Caps */}
          <div className="flex items-center justify-between gap-3 overflow-x-auto py-1 scrollbar-hide">
            <div className="flex items-center gap-2 shrink-0">
              {FAMILIAR_SERVICES.map((srv) => {
                const active = activeServiceTag === srv.tag;
                return (
                  <button
                    key={srv.tag}
                    onClick={() => setActiveServiceTag(active ? "" : srv.tag)}
                    className={`flex items-center gap-2 p-1 pr-3 rounded-full border text-xs font-bold transition cursor-pointer shrink-0 ${
                      active
                        ? "bg-white text-black border-white shadow"
                        : "bg-[#121520] text-gray-200 border-white/10 hover:border-[#C8A97E]"
                    }`}
                  >
                    <img src={srv.img} alt={srv.label} className="w-7 h-7 rounded-full object-cover" />
                    <span>{srv.tag}</span>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {[250, 350, 1000].map((val) => (
                <button
                  key={val}
                  onClick={() => setMaxPriceChf(val)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border cursor-pointer ${
                    maxPriceChf === val ? "bg-[#C8A97E] text-black border-[#C8A97E]" : "bg-[#121520] border-white/10 text-gray-300"
                  }`}
                >
                  {val === 1000 ? "Alle CHF" : `≤ CHF ${val}`}
                </button>
              ))}
            </div>
          </div>

          {/* Dense 5-Column Gallery Grid with ⚡ Quick-Check & ⚖️ Compare */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
            {filteredProfiles.slice(0, visibleCount + 3).map((p: any, idx: number) =>
              renderSuperiorAdCard(p, idx, "s2")
            )}
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 3: "COMPARIS × ESCORT" (Schweizer Preis- & Qualitäts-Entscheider)*/}
      {/* ===================================================================== */}
      {layout === "3" && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5 space-y-5">
          {/* Top Swiss Market Intelligence Cockpit */}
          <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141826] to-[#10131E] border border-[#C8A97E]/45 shadow-2xl space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
                  SCHWEIZER MARKT- & KONDITIONEN-VERGLEICH (WIE COMPARIS)
                </span>
                <h1 className="text-lg sm:text-2xl font-serif font-bold text-white">
                  Filtere nach Region, Service & Stundentarif – oder vergleiche bis zu 3 Profile direkt
                </h1>
              </div>
              <div className="px-3.5 py-2 rounded-xl bg-black/50 border border-white/10 text-xs">
                Ø Richtpreis in Auswahl: <strong className="text-[#C8A97E]">CHF {avgRegionRate} / 60 Min.</strong>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-bold uppercase text-[#C8A97E] mb-1">1. Rubrik</label>
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
                <label className="block text-[10px] font-bold uppercase text-[#C8A97E] mb-1">2. Kanton / Region</label>
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
                <label className="block text-[10px] font-bold uppercase text-[#C8A97E] mb-1">3. Service / Vorliebe</label>
                <select
                  value={activeServiceTag}
                  onChange={(e) => setActiveServiceTag(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/15 text-xs font-bold text-white"
                >
                  <option value="">Alle Services & Vorlieben</option>
                  {FAMILIAR_SERVICES.map((s) => (
                    <option key={s.tag} value={s.tag}>{s.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase text-[#C8A97E] mb-1">4. Preis-Obergrenze (1h)</label>
                <select
                  value={maxPriceChf}
                  onChange={(e) => setMaxPriceChf(Number(e.target.value))}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/15 text-xs font-bold text-white"
                >
                  <option value={1000}>Alle Preisklassen</option>
                  <option value={250}>Bis CHF 250 / Std.</option>
                  <option value={350}>Bis CHF 350 / Std.</option>
                  <option value={450}>Bis CHF 450 / Std.</option>
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
              renderSuperiorAdCard(p, idx, "s3")
            )}
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* LAYOUT 4: "BEMYGIRL × INTERACTIVE HOVER-DOSSIER"                      */}
      {/* ===================================================================== */}
      {layout === "4" && (
        <main className="max-w-7xl mx-auto px-3 sm:px-4 py-5 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#C8A97E]/30">
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
                  {reg.short} <span className="opacity-70">({cantonCounts[reg.code] || 0})</span>
                </button>
              ))}
            </div>
            <div className="text-xs text-[#E5C99B]">
              Tipp: Klicke auf <strong>⚡ Quick-Check</strong> für sofortige Tarif- & Kontaktdaten ohne Seitenwechsel!
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
              renderSuperiorAdCard(p, idx, "s4")
            )}
          </div>
        </main>
      )}

      {/* Load More & Secondary Pillars */}
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
            Erweiterte Suche öffnen →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12 pt-8 border-t border-white/10">
          <Link href="/reviews" className="p-5 rounded-2xl bg-[#11131C] border border-white/10 hover:border-[#C8A97E] transition">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">01 · Unabhängiger Portal-Test</div>
            <h3 className="text-base font-serif font-bold text-white mt-1 flex items-center justify-between">
              <span>Xdate, Fgirl & And6 im Vergleich</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1">Sachliche Einzelberichte zu Kosten, Reichweite & Funktionen.</p>
          </Link>

          <Link href="/rankings" className="p-5 rounded-2xl bg-[#11131C] border border-white/10 hover:border-[#C8A97E] transition">
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">02 · Stationäre Etablissements</div>
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

      {/* ===================================================================== */}
      {/* UNIQUE FEATURE 1: ⚡ QUICK-PEEK SLIDE-OVER DRAWER (0-TAB-SWITCHING!)   */}
      {/* ===================================================================== */}
      {quickPeekProfile && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-[#11141F] border-l border-[#C8A97E]/50 h-full overflow-y-auto p-5 sm:p-6 shadow-2xl flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] text-[10px] font-extrabold uppercase">
                    ⚡ Quick-Check
                  </span>
                  <span className="text-xs text-gray-400">
                    Quelle: {quickPeekProfile.sourcePortal || "Index"}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setQuickPeekProfile(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="flex gap-4 items-center">
                <img
                  src={quickPeekProfile.thumbnail || quickPeekProfile.fallbackImg}
                  alt={quickPeekProfile.rawName}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = quickPeekProfile.fallbackImg;
                  }}
                  className="w-24 h-32 rounded-xl object-cover object-top border border-[#C8A97E]/50 shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-xl font-serif font-bold text-white">{quickPeekProfile.rawName}</h3>
                  <p className="text-xs text-[#C8A97E] flex items-center gap-1">
                    <MapPin size={13} />
                    <span>{quickPeekProfile.cleanCity} (Kanton {quickPeekProfile.canton})</span>
                  </p>
                  <div className="pt-1 flex flex-wrap gap-1">
                    {quickPeekProfile.availabilityConfirmed ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        ● Verfügbarkeit bestätigt
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-white/10 text-gray-300 text-[10px]">
                        Externer Index-Eintrag
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Unique Tariff Breakdown Box */}
              <div className="p-4 rounded-xl bg-[#090A0F] border border-white/10 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#C8A97E]">
                  Schweizer Tarif- & Markt-Einordnung
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                  <div className="p-2 rounded-lg bg-white/5">
                    <div className="text-[10px] text-gray-400">30 Min. (Richtwert)</div>
                    <div className="font-bold text-white mt-0.5">
                      CHF {Math.round((quickPeekProfile.advertisedBaseChf || 350) * 0.6)}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-[#C8A97E]/15 border border-[#C8A97E]/40">
                    <div className="text-[10px] text-[#E5C99B]">60 Min. (Standard)</div>
                    <div className="font-extrabold text-[#C8A97E] mt-0.5">
                      CHF {quickPeekProfile.advertisedBaseChf || 350}
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5">
                    <div className="text-[10px] text-gray-400">Ø Region {quickPeekProfile.canton}</div>
                    <div className="font-bold text-gray-300 mt-0.5">CHF {avgRegionRate}</div>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="text-xs font-bold text-gray-300">Services & Beschreibung:</div>
                <div className="flex flex-wrap gap-1.5">
                  {(quickPeekProfile.includedTags || ["GFE", "Privat"]).map((t: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200">
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-300 leading-relaxed pt-1">
                  {quickPeekProfile.adHeadline}
                </p>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              {quickPeekProfile.rawPhone && (
                <a
                  href={`tel:${quickPeekProfile.rawPhone}`}
                  onClick={() => recordEvent(quickPeekProfile.id, "track_contact")}
                  className="w-full py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-xs uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  <span>Direkt anrufen: {quickPeekProfile.rawPhone}</span>
                </a>
              )}
              <Link
                href={`/profile/${encodeURIComponent(quickPeekProfile.id)}`}
                className="w-full py-3 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-bold text-xs uppercase tracking-wider block text-center"
              >
                Vollständiges Profil öffnen →
              </Link>
              {quickPeekProfile.sourceUrl && (
                <a
                  href={quickPeekProfile.sourceUrl}
                  target="_blank"
                  rel="noreferrer nofollow"
                  onClick={() => recordEvent(quickPeekProfile.id, "track_source_out")}
                  className="w-full py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <span>Originalquelle ({quickPeekProfile.sourcePortal || "Extern"}) prüfen</span>
                  <ExternalLink size={12} />
                </a>
              )}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Link
                  href={`/create-post?claim=${encodeURIComponent(quickPeekProfile.rawName || "")}&id=${encodeURIComponent(quickPeekProfile.id)}`}
                  className="py-2 rounded-lg bg-white/5 text-[#C8A97E] text-[11px] font-semibold text-center border border-white/10"
                >
                  Mein Profil? Verwalten
                </Link>
                <Link
                  href={`/report?name=${encodeURIComponent(quickPeekProfile.rawName || "")}&id=${encodeURIComponent(quickPeekProfile.id)}`}
                  className="py-2 rounded-lg bg-rose-500/15 text-rose-300 text-[11px] font-semibold text-center border border-rose-500/30"
                >
                  Melden / Entfernen
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* UNIQUE FEATURE 2: ⚖️ FLOATING COMPARE-TRAY & SIDE-BY-SIDE MODAL       */}
      {/* ===================================================================== */}
      {comparedProfiles.length > 0 && (
        <div className="fixed bottom-16 lg:bottom-4 inset-x-0 z-50 px-4 pointer-events-none">
          <div className="max-w-3xl mx-auto p-3 rounded-2xl bg-[#141826]/95 backdrop-blur-xl border-2 border-[#C8A97E] shadow-[0_20px_50px_rgba(0,0,0,0.9)] flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-2.5 overflow-x-auto">
              <span className="text-xs font-bold text-[#C8A97E] shrink-0">
                ⚖️ Direkt-Vergleich ({comparedProfiles.length}/3):
              </span>
              {comparedProfiles.map((cp: any) => (
                <div
                  key={cp.id}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/60 border border-white/15 text-xs"
                >
                  <span className="font-bold text-white truncate max-w-[90px]">{cp.rawName}</span>
                  <button onClick={() => toggleCompare(cp.id)} className="text-gray-400 hover:text-white">
                    ✕
                  </button>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCompareModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-[#C8A97E] text-[#090A0F] font-extrabold text-xs cursor-pointer"
              >
                Jetzt vergleichen →
              </button>
              <button
                type="button"
                onClick={() => setCompareIds([])}
                className="text-xs text-gray-400 hover:text-white px-2 cursor-pointer"
              >
                Leeren
              </button>
            </div>
          </div>
        </div>
      )}

      {compareModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="max-w-4xl w-full rounded-2xl bg-[#11141F] border border-[#C8A97E] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-xl font-serif font-bold text-white">
                ⚖️ Direkt-Vergleich deiner ausgewählten Profile
              </h3>
              <button onClick={() => setCompareModalOpen(false)} className="p-1.5 rounded-lg bg-white/10 text-white">
                <X size={16} />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {comparedProfiles.map((cp: any) => (
                <div key={cp.id} className="p-4 rounded-xl bg-[#090A0F] border border-white/10 space-y-3 text-xs">
                  <img
                    src={cp.thumbnail || cp.fallbackImg}
                    alt={cp.rawName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = cp.fallbackImg;
                    }}
                    className="w-full h-48 object-cover object-top rounded-lg"
                  />
                  <div className="text-base font-serif font-bold text-white">{cp.rawName}</div>
                  <div className="space-y-1.5 text-gray-300 border-t border-white/10 pt-2">
                    <div>📍 <strong>Ort:</strong> {cp.cleanCity} ({cp.canton})</div>
                    <div>💰 <strong>Richtpreis 1h:</strong> <span className="text-[#C8A97E] font-bold">CHF {cp.advertisedBaseChf || 350}</span></div>
                    <div>🛡️ <strong>Status:</strong> {cp.isIdentityVerified ? "✓ Geprüft" : cp.isSelfManaged ? "Selbst verwaltet" : `Quelle: ${cp.sourcePortal || "Index"}`}</div>
                    <div>✨ <strong>Services:</strong> {(cp.includedTags || ["GFE"]).join(", ")}</div>
                  </div>
                  <Link
                    href={`/profile/${encodeURIComponent(cp.id)}`}
                    className="w-full py-2.5 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-center block"
                  >
                    Zum Profil →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}