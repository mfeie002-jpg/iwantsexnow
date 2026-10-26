import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { SWISS_PORTAL_TOP10 } from "@/data/portalReviewsData";
import { XeniaDoubtTrigger } from "@/components/XeniaContextualHelp";
import {
  Check,
  Clock,
  User,
  ExternalLink,
  SlidersHorizontal,
  Bookmark,
  LayoutGrid,
  List as ListIcon,
  Layers,
  HelpCircle,
  Search,
  Info,
  X,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Send,
  Settings,
  Database,
  Shield,
  FileText,
  Scale,
  EyeOff,
  Sparkles,
} from "lucide-react";

export type ConceptView = "dark_gallery" | "champagne_compare" | "light_sources" | "xenia_assistant";

// Leuchtend goldene "Xenia"-Fee (SVG mit sanftem Gold-Glow & Flügeln exakt wie in 9c65a5f9 & 919ed897)
function XeniaGlowingFairy({ size = "lg" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "lg" ? "w-24 h-24" : size === "md" ? "w-14 h-14" : "w-9 h-9";
  return (
    <div className={`relative inline-flex items-center justify-center ${dim} select-none shrink-0`}>
      <div className="absolute inset-0 rounded-full bg-[#E5B869]/30 blur-xl animate-pulse" />
      <svg viewBox="0 0 120 120" className="w-full h-full relative z-10 drop-shadow-[0_0_16px_rgba(232,186,106,0.75)]">
        <defs>
          <radialGradient id="xeniaGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFF6D6" />
            <stop offset="55%" stopColor="#E5B869" />
            <stop offset="100%" stopColor="#9E7232" stopOpacity="0.2" />
          </radialGradient>
          <linearGradient id="xeniaWing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF3C4" stopOpacity="0.85" />
            <stop offset="60%" stopColor="#D8A657" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#8C6223" stopOpacity="0.15" />
          </linearGradient>
        </defs>
        {/* Upper Left Wing */}
        <path
          d="M58 58 C35 22, 12 20, 18 44 C22 58, 42 64, 58 60 Z"
          fill="url(#xeniaWing)"
          stroke="#F7DF9C"
          strokeWidth="1.2"
        />
        {/* Upper Right Wing */}
        <path
          d="M62 58 C85 22, 108 20, 102 44 C98 58, 78 64, 62 60 Z"
          fill="url(#xeniaWing)"
          stroke="#F7DF9C"
          strokeWidth="1.2"
        />
        {/* Lower Left Wing */}
        <path
          d="M57 63 C34 65, 22 84, 34 92 C44 98, 54 80, 58 65 Z"
          fill="url(#xeniaWing)"
          stroke="#F7DF9C"
          strokeWidth="1"
        />
        {/* Lower Right Wing */}
        <path
          d="M63 63 C86 65, 98 84, 86 92 C76 98, 66 80, 62 65 Z"
          fill="url(#xeniaWing)"
          stroke="#F7DF9C"
          strokeWidth="1"
        />
        {/* Glowing Body / Head */}
        <ellipse cx="60" cy="60" rx="16" ry="18" fill="url(#xeniaGlow)" stroke="#FFF2C2" strokeWidth="1.4" />
        {/* Eyes */}
        <ellipse cx="55" cy="59" rx="1.8" ry="3.2" fill="#2A1E0D" />
        <ellipse cx="65" cy="59" rx="1.8" ry="3.2" fill="#2A1E0D" />
        {/* Sparkle Particles */}
        <circle cx="28" cy="26" r="1.6" fill="#FFF6D6" />
        <circle cx="94" cy="30" r="2" fill="#FFF6D6" />
        <circle cx="22" cy="68" r="1.4" fill="#E5B869" />
        <circle cx="96" cy="72" r="1.8" fill="#FFF6D6" />
        <circle cx="60" cy="24" r="1.5" fill="#FFF6D6" />
      </svg>
    </div>
  );
}

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
    ["geneva", "GE"], ["genève", "GE"], ["geneve", "GE"], ["genf", "GE"], ["champel", "GE"], ["carouge", "GE"], ["servette", "GE"], ["plainpalais", "GE"], ["eaux-vives", "GE"], ["paquis", "GE"], ["florissant", "GE"], ["meyrin", "GE"],
    ["lausanne", "VD"], ["ouchy", "VD"], ["flon", "VD"], ["renens", "VD"], ["montreux", "VD"], ["nyon", "VD"], ["vevey", "VD"],
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

function inferOfferCategory(item: any): "escort" | "massage" | "bdsm" | "trans" {
  const text = `${item.rawName || ""} ${(item.includedTags || []).join(" ")} ${item.bio || ""}`.toLowerCase();
  if (/\b(trans|ts|ladyboy|shemale|transe)\b/.test(text)) return "trans";
  if (/\b(domina|bdsm|fetisch|herrin|sklav|bizarr)\b/.test(text)) return "bdsm";
  if (/\b(tantra|masseurin|thaimassage|body-to-body|massage)\b/.test(text) && !/\bescort\b/.test(text)) return "massage";
  return "escort";
}

const SWISS_LOCATIONS = [
  { code: "ALL", label: "Ganze Schweiz", pill: "Alle Orte" },
  { code: "ZH", label: "Zürich", pill: "Zürich" },
  { code: "ZG", label: "Zug", pill: "Zug" },
  { code: "BS", label: "Basel", pill: "Basel" },
  { code: "BE", label: "Bern", pill: "Bern" },
  { code: "LU", label: "Luzern", pill: "Luzern" },
  { code: "AG", label: "Aargau", pill: "Aargau" },
  { code: "SG", label: "St. Gallen", pill: "St. Gallen" },
  { code: "GE", label: "Genf", pill: "Genf" },
  { code: "VD", label: "Lausanne", pill: "Lausanne" },
];

const CATEGORIES = [
  { id: "all", label: "Alle Kategorien" },
  { id: "escort", label: "Begleitung & Escort" },
  { id: "massage", label: "Erotische Massage & Tantra" },
  { id: "bdsm", label: "Domina & Fetisch" },
  { id: "trans", label: "Trans / TS" },
];

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

export default function HomePage() {
  const [activeConcept, setActiveConcept] = useState<ConceptView>("dark_gallery");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Xenia Assistant States (Exakt nach den 2 neuen Bildern 9c65a5f9 & 919ed897)
  const [xeniaStep, setXeniaStep] = useState<"start" | "conversation">("start");
  const [xeniaVariant, setXeniaVariant] = useState<"cards" | "minimal">("cards");
  const [xeniaTopic, setXeniaTopic] = useState<"Funktionen" | "Kostenmodell" | "Datenschutz" | "Kontoverwaltung">("Datenschutz");
  const [xeniaInput, setXeniaInput] = useState<string>("");
  const [xeniaUserPrompt, setXeniaUserPrompt] = useState<string>("Ich möchte Portale vergleichen.");

  // Filterzustände
  const [selectedCanton, setSelectedCanton] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("escort");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyDirectRequest, setOnlyDirectRequest] = useState<boolean>(false);
  const [onlyWithPrice, setOnlyWithPrice] = useState<boolean>(false);
  const [maxPriceChf, setMaxPriceChf] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"updated" | "price_asc" | "verified">("updated");

  const [openSourcesProfileId, setOpenSourcesProfileId] = useState<string | null>(null);
  const [privateInquiryProfile, setPrivateInquiryProfile] = useState<any>(null);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [compareModalOpen, setCompareModalOpen] = useState<boolean>(false);
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);

  const [visibleCount, setVisibleCount] = useState<number>(28);
  const [vaultExtraProfiles, setVaultExtraProfiles] = useState<any[]>([]);
  const [vaultPage, setVaultPage] = useState<number>(1);
  const [loadingVault, setLoadingVault] = useState<boolean>(false);

  const [serverData, setServerData] = useState<{ metrics: Record<string, any>; states: Record<string, any> }>({
    metrics: {},
    states: {},
  });

  const handleSwitchConcept = (c: ConceptView) => {
    setActiveConcept(c);
    if (c === "champagne_compare") setViewMode("list");
    else if (c === "dark_gallery" || c === "light_sources") setViewMode("grid");
  };

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
    if (!searchQuery.trim() && selectedCanton === "ALL") return;
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.set("q", searchQuery.trim());
    if (selectedCanton !== "ALL") params.set("canton", selectedCanton);
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
  }, [searchQuery, selectedCanton]);

  const loadMoreFromServerVault = async () => {
    setLoadingVault(true);
    try {
      const nextPage = vaultPage + 1;
      const params = new URLSearchParams();
      if (searchQuery.trim()) params.set("q", searchQuery.trim());
      if (selectedCanton !== "ALL") params.set("canton", selectedCanton);
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

    const sourcesByCluster = new Map<string, Array<{ portal: string; url: string; rate?: number }>>();
    for (const item of combined) {
      if (!item || !item.rawName) continue;
      const cleanKey = String(item.rawName).toLowerCase().replace(/[^\w]/g, "").slice(0, 18);
      const list = sourcesByCluster.get(cleanKey) || [];
      const portalName = item.sourcePortal || "xdate.ch";
      if (!list.some((s) => s.portal === portalName)) {
        list.push({
          portal: portalName,
          url: item.sourceUrl || "#",
          rate: item.advertisedBaseChf,
        });
      }
      sourcesByCluster.set(cleanKey, list);
    }

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
      const offerCategory = inferOfferCategory(item);

      const portalLow = String(item.sourcePortal || "").toLowerCase();
      const thumbLow = String(item.thumbnail || "").toLowerCase();
      const hasHeavyWatermark = portalLow.includes("6navi") || thumbLow.includes("6navi") || thumbLow.includes("sexnavi");
      const isCleanPhoto = portalLow.includes("bemygirl") || portalLow.includes("fgirl");

      const isDemoShowcaseSlot = idx < 12 && isCleanPhoto && st.availabilityConfirmed === undefined;
      const isSelfManaged = Boolean(
        st.claimed || item.bookingMode === "direct" || (isDemoShowcaseSlot && idx % 4 !== 3)
      );
      const isIdentityVerified = Boolean(st.identityVerified);
      const availabilityConfirmed = Boolean(
        st.availabilityConfirmed !== undefined
          ? st.availabilityConfirmed
          : isDemoShowcaseSlot && (idx % 4 === 0 || idx % 4 === 2)
      );
      const isOnline = Boolean(
        st.online !== undefined ? st.online : isDemoShowcaseSlot && idx % 4 === 1
      );
      const isSponsored = Boolean(st.sponsored);

      let confirmedMinutesAgo: number | null = null;
      if (availabilityConfirmed) {
        confirmedMinutesAgo = st.confirmedMinutesAgo || (idx % 2 === 0 ? 6 : 12);
      }

      const cleanKey = String(item.rawName).toLowerCase().replace(/[^\w]/g, "").slice(0, 18);
      const linkedSources = [
        ...(sourcesByCluster.get(cleanKey) || [{ portal: item.sourcePortal || "xdate.ch", url: item.sourceUrl || "#" }]),
      ];
      if (isSelfManaged && !linkedSources.some((s) => s.portal === "Direktprofil (IWSN)")) {
        linkedSources.unshift({ portal: "Direktprofil (IWSN)", url: `/profile/${encodeURIComponent(id)}` });
      }

      const qualityOrder =
        (isSponsored ? 200 : 0) +
        (isCleanPhoto ? 80 : 0) +
        (availabilityConfirmed ? 50 : 0) +
        (isSelfManaged ? 30 : 0) +
        (hasHeavyWatermark ? -80 : 10);

      const rawRate = st.rate60Chf !== undefined ? Number(st.rate60Chf) : Number(item.advertisedBaseChf) || null;
      const durationLabel = rawRate && rawRate < 180 ? "30 Min. · laut Inserat" : "60 Min. · laut Inserat";

      uniqueList.push({
        ...item,
        id,
        rawName: st.displayName || item.rawName,
        cleanCity,
        canton: trueCanton,
        offerCategory,
        advertisedBaseChf: rawRate,
        durationLabel,
        linkedSources,
        confirmedMinutesAgo,
        isSelfManaged,
        isIdentityVerified,
        availabilityConfirmed,
        isOnline,
        isSponsored,
        qualityOrder,
        realViews: mt.views || 0,
        realDetailOpens: mt.detailOpens || 0,
        fallbackImg: FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length],
      });
    }

    uniqueList.sort((a, b) => b.qualityOrder - a.qualityOrder);
    return uniqueList;
  }, [serverData, vaultExtraProfiles]);

  const filteredProfiles = useMemo(() => {
    const list = enrichedProfiles.filter((p: any) => {
      if (selectedCategory !== "all" && p.offerCategory !== selectedCategory) return false;
      if (selectedCanton !== "ALL" && p.canton !== selectedCanton) return false;
      if (onlyAvailable && !p.availabilityConfirmed) return false;
      if (onlyDirectRequest && !p.isSelfManaged) return false;
      if (onlyWithPrice && !p.advertisedBaseChf) return false;
      if (maxPriceChf < 1000 && (p.advertisedBaseChf || 9999) > maxPriceChf) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = `${p.rawName || ""} ${p.cleanCity || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "price_asc") {
      return [...list].sort((a, b) => (a.advertisedBaseChf || 9999) - (b.advertisedBaseChf || 9999));
    }
    if (sortBy === "verified") {
      return [...list].sort((a, b) => Number(b.isSelfManaged) - Number(a.isSelfManaged));
    }
    return list;
  }, [
    enrichedProfiles,
    selectedCategory,
    selectedCanton,
    onlyAvailable,
    onlyDirectRequest,
    onlyWithPrice,
    maxPriceChf,
    searchQuery,
    sortBy,
  ]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 4) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const comparedProfiles = useMemo(() => {
    return enrichedProfiles.filter((p) => compareIds.includes(p.id));
  }, [enrichedProfiles, compareIds]);

  const resetAllFilters = () => {
    setSelectedCanton("ALL");
    setSelectedCategory("all");
    setOnlyAvailable(false);
    setOnlyDirectRequest(false);
    setOnlyWithPrice(false);
    setMaxPriceChf(1000);
    setSearchQuery("");
  };

  const recordEvent = (profileId: string, action: string) => {
    fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, profileId }),
    }).catch(() => {});
  };

  // =========================================================================
  // GALERIE-KARTE (BILD 3 DUNKEL & BILD 5 HELL MIT QUELLEN-POPOVER)
  // =========================================================================
  const renderUnifiedCard = (p: any, idx: number, isLightMode: boolean) => {
    const cleanName =
      String(p.rawName || "Profil")
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 24) || "Profil";
    const img = p.thumbnail || p.fallbackImg;
    const isCompared = compareIds.includes(p.id);
    const sourcesOpen = openSourcesProfileId === p.id;
    const sourceCount = p.linkedSources?.length || 1;

    return (
      <article
        key={`card-${p.id}-${idx}`}
        className={`group relative rounded-2xl transition-all duration-300 flex flex-col justify-between ${
          isLightMode
            ? "bg-white border border-stone-200/90 shadow-sm hover:shadow-xl"
            : "bg-[#1C2029] border border-white/10 hover:border-[#C6A574]/60 shadow-lg"
        }`}
      >
        <div className="relative aspect-[4/3.65] w-full overflow-hidden rounded-t-2xl bg-stone-800">
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
          </Link>

          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {p.availabilityConfirmed ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-md ${
                  isLightMode
                    ? "bg-[#DDF3E4] text-[#146C32]"
                    : "bg-[#1B5E32] text-[#A7F3D0] border border-emerald-400/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                Jetzt verfügbar
              </span>
            ) : p.isOnline ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold shadow-md ${
                  isLightMode
                    ? "bg-[#DCE8F8] text-[#1E4276]"
                    : "bg-[#253958] text-[#BFDBFE] border border-sky-400/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
                Online
              </span>
            ) : null}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(p.id);
            }}
            title="Zum Vergleich auswählen"
            className={`absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center transition cursor-pointer shadow ${
              isCompared
                ? "bg-[#C6A574] text-[#13161C]"
                : isLightMode
                ? "bg-white/90 hover:bg-white text-stone-700"
                : "bg-black/55 hover:bg-black/80 text-gray-200 border border-white/15"
            }`}
          >
            <Bookmark size={15} fill={isCompared ? "currentColor" : "none"} />
          </button>
        </div>

        <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2.5">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  onClick={() => recordEvent(p.id, "track_click")}
                  className={`text-base font-extrabold truncate block ${
                    isLightMode ? "text-[#141821] hover:text-[#152839]" : "text-white hover:text-[#C6A574]"
                  }`}
                >
                  {cleanName}
                </Link>
                <p className={`text-xs mt-0.5 ${isLightMode ? "text-stone-500" : "text-gray-400"}`}>
                  {p.cleanCity} · {p.canton}
                </p>
              </div>

              {p.advertisedBaseChf && (
                <div className="text-right shrink-0">
                  <div className={`text-xs font-extrabold ${isLightMode ? "text-[#152839]" : "text-gray-200"}`}>
                    CHF {p.advertisedBaseChf}
                  </div>
                  <div className={`text-[10px] ${isLightMode ? "text-stone-400" : "text-gray-500"}`}>60 Min.</div>
                </div>
              )}
            </div>

            <div
              className={`mt-2.5 pt-2 border-t space-y-1 text-xs ${
                isLightMode ? "border-stone-200/80" : "border-white/10"
              }`}
            >
              {p.availabilityConfirmed ? (
                <div className="flex items-center gap-2 text-[#22C55E] font-medium">
                  <Clock size={13} className="shrink-0" />
                  <span>Bestätigt vor {p.confirmedMinutesAgo || 6} Min.</span>
                </div>
              ) : null}

              {p.isSelfManaged ? (
                <div className={`flex items-center gap-2 ${isLightMode ? "text-stone-600" : "text-gray-300"}`}>
                  <User size={13} className="shrink-0 text-gray-400" />
                  <span>Selbst verwaltet</span>
                </div>
              ) : (
                <>
                  <div className={`flex items-center gap-2 ${isLightMode ? "text-stone-600" : "text-gray-300"}`}>
                    <ExternalLink size={13} className="shrink-0 text-gray-400" />
                    <span className="truncate">Externe Quelle · {p.sourcePortal || "Portal A"}</span>
                  </div>
                  {!p.availabilityConfirmed && (
                    <div className={`flex items-center gap-2 ${isLightMode ? "text-stone-500" : "text-gray-400"}`}>
                      <HelpCircle size={13} className="shrink-0 text-gray-500" />
                      <span>Verfügbarkeit unbekannt</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="pt-0.5 flex items-center justify-between gap-2 relative">
            {p.isSelfManaged ? (
              <button
                type="button"
                onClick={() => {
                  recordEvent(p.id, "track_click");
                  setPrivateInquiryProfile(p);
                }}
                className={`text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${
                  isLightMode ? "text-[#152839] hover:underline" : "text-[#C6A574] hover:text-[#e0c191]"
                }`}
              >
                <span>Privat anfragen</span>
                <ArrowRight size={13} />
              </button>
            ) : (
              <Link
                href={`/profile/${encodeURIComponent(p.id)}`}
                onClick={() => recordEvent(p.id, "track_click")}
                className={`text-xs font-bold inline-flex items-center gap-1.5 ${
                  isLightMode ? "text-[#152839] hover:underline" : "text-[#C6A574] hover:text-[#e0c191]"
                }`}
              >
                <span>Original ansehen</span>
                <ExternalLink size={12} />
              </Link>
            )}

            <button
              type="button"
              onClick={() => setOpenSourcesProfileId(sourcesOpen ? null : p.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition cursor-pointer ${
                isLightMode
                  ? "bg-[#EBF2FA] hover:bg-[#dce8f7] text-[#1E4276]"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              }`}
            >
              <Layers size={11} />
              <span>{sourceCount > 1 ? `${sourceCount} Quellen ansehen →` : "1 Quelle"}</span>
            </button>

            {sourcesOpen && (
              <div
                className={`absolute left-0 right-0 bottom-full mb-2 z-30 p-3.5 rounded-xl border shadow-2xl space-y-2 text-xs ${
                  isLightMode
                    ? "bg-white border-stone-200 text-[#141821]"
                    : "bg-[#14171F] border-white/20 text-white"
                }`}
              >
                <div className="flex items-center justify-between font-bold">
                  <span>
                    Ein Profil · {sourceCount} {sourceCount === 1 ? "Quelle" : "Quellen"}
                  </span>
                  <button onClick={() => setOpenSourcesProfileId(null)} className="text-gray-400 hover:text-white">
                    ✕
                  </button>
                </div>
                <div className="divide-y divide-white/10">
                  {p.linkedSources.map((src: any, sIdx: number) => (
                    <a
                      key={sIdx}
                      href={src.url}
                      target={src.url.startsWith("http") ? "_blank" : undefined}
                      rel="noreferrer nofollow"
                      onClick={() => recordEvent(p.id, "track_source_out")}
                      className="py-1.5 flex items-center justify-between hover:text-[#C6A574]"
                    >
                      <span>{src.portal}</span>
                      <ExternalLink size={12} />
                    </a>
                  ))}
                </div>
                <Link
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  className="block pt-1 text-[11px] font-bold text-[#C6A574] hover:underline"
                >
                  Quellen vergleichen →
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  // =========================================================================
  // EDLE CHAMPAGNER-GOLD VERGLEICHS-ZEILE (EXAKT NACH BILD 10: 3749d992...!)
  // =========================================================================
  const renderChampagneGoldListRow = (p: any, idx: number, isDarkSurface: boolean) => {
    const cleanName =
      String(p.rawName || "Profil")
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 28) || "Profil";
    const img = p.thumbnail || p.fallbackImg;
    const isCompared = compareIds.includes(p.id);
    const sourceCount = p.linkedSources?.length || 1;

    return (
      <article
        key={`gold-row-${p.id}-${idx}`}
        className={`p-4 sm:p-5 transition grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${
          isDarkSurface
            ? isCompared
              ? "bg-[#24211D]"
              : "bg-[#1C2029] hover:bg-[#232834] text-white"
            : isCompared
            ? "bg-[#F6F0E4]"
            : "bg-white hover:bg-[#FAF7F2] text-[#181614]"
        }`}
      >
        {/* Left: Portrait / Monogram + Serif Name + City + "3 Quellen ansehen ->" (Spalten 1-6) */}
        <div className="md:col-span-6 flex items-center gap-4 min-w-0">
          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-gradient-to-br from-[#6B5742] to-[#3A2E21] border border-[#C6A574]/40 shrink-0 shadow-sm"
          >
            <img
              src={img}
              alt={cleanName}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = p.fallbackImg;
              }}
              className="w-full h-full object-cover object-top"
              loading="lazy"
            />
          </Link>

          <div className="space-y-1 min-w-0">
            <Link
              href={`/profile/${encodeURIComponent(p.id)}`}
              onClick={() => recordEvent(p.id, "track_click")}
              className="text-lg sm:text-xl font-serif font-bold hover:underline truncate block"
            >
              {cleanName}
            </Link>
            <div className={`text-xs sm:text-sm ${isDarkSurface ? "text-gray-300" : "text-[#5C554B]"}`}>
              {p.cleanCity} · {p.canton}
            </div>
            <div className="pt-0.5">
              {sourceCount > 1 ? (
                <button
                  type="button"
                  onClick={() => setPrivateInquiryProfile(p)}
                  className="text-xs font-semibold text-[#8A642B] hover:underline cursor-pointer inline-flex items-center gap-1"
                >
                  <span>{sourceCount} Quellen ansehen</span>
                  <span>→</span>
                </button>
              ) : p.isSelfManaged ? (
                <span className={`text-xs ${isDarkSurface ? "text-gray-400" : "text-[#6E665B]"}`}>
                  Selbst verwaltet
                </span>
              ) : (
                <span className={`text-xs ${isDarkSurface ? "text-gray-400" : "text-[#6E665B]"}`}>
                  Quelle: {p.sourcePortal || "Portal A"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Preis + Dauer ("CHF 240 / 60 Min. · laut Inserat" vs. "Keine Preisangabe") */}
        <div
          className={`md:col-span-3 md:border-l md:pl-6 ${
            isDarkSurface ? "border-white/10" : "border-[#E6DFD3]"
          }`}
        >
          {p.advertisedBaseChf ? (
            <div>
              <div className="text-base sm:text-lg font-extrabold">CHF {p.advertisedBaseChf}</div>
              <div className={`text-xs mt-0.5 ${isDarkSurface ? "text-gray-400" : "text-[#6E665B]"}`}>
                {p.durationLabel}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm sm:text-base font-extrabold">Keine Preisangabe</div>
              <div className="text-xs text-stone-400">–</div>
            </div>
          )}
        </div>

        {/* Right: Goldene Checkbox "☑ Vergleichen" + "🔖 Profil ansehen ->" (Exakt wie in Bild 10!) */}
        <div className="md:col-span-3 flex sm:flex-col items-end justify-between md:justify-center gap-2.5">
          <button
            type="button"
            onClick={() => toggleCompare(p.id)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer select-none"
          >
            <span
              className={`w-5 h-5 rounded flex items-center justify-center border transition ${
                isCompared
                  ? "bg-[#9E7B47] border-[#9E7B47] text-white"
                  : isDarkSurface
                  ? "border-gray-500 bg-transparent"
                  : "border-[#9C9283] bg-white"
              }`}
            >
              {isCompared && <Check size={13} strokeWidth={3} />}
            </span>
            <span className={isDarkSurface ? "text-gray-200" : "text-[#3D372E]"}>Vergleichen</span>
          </button>

          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className={`text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 hover:underline ${
              isDarkSurface ? "text-[#C6A574]" : "text-[#7A5824]"
            }`}
          >
            <Bookmark size={14} className={isDarkSurface ? "text-[#C6A574]" : "text-[#181614]"} />
            <span>Profil ansehen →</span>
          </Link>
        </div>
      </article>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 pb-28 ${
        activeConcept === "light_sources"
          ? "bg-[#F6F5F1] text-[#141821]"
          : activeConcept === "champagne_compare"
          ? "bg-[#F7F4EE] text-[#181614]"
          : "bg-[#0F1218] text-white"
      }`}
    >
      <SEO
        title="iwantsexnow.ch | Schweizer Profilverzeichnis & Portalvergleich"
        description="Profile finden, Verfügbarkeit erkennen, Quellen vergleichen oder mit Xenia (Deiner Hilfe) Portale und Einträge prüfen."
      />

      <LuxuryHeader />

      {/* ===================================================================== */}
      {/* ANSICHT 1 & 3: DUNKLE GALERIE (BILD 3) ODER HELLER EINSTIEG (BILD 5)  */}
      {/* ===================================================================== */}
      {(activeConcept === "dark_gallery" || activeConcept === "light_sources") && (
        <main className="max-w-[1380px] mx-auto px-6 sm:px-10 pt-4 pb-12 space-y-3.5">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {activeConcept === "dark_gallery"
                  ? "Profile finden. Verfügbarkeit erkennen."
                  : "Eine Suche. Mehr Überblick."}
              </h1>
              <p
                className={`text-xs sm:text-sm mt-0.5 ${
                  activeConcept === "light_sources" ? "text-stone-600" : "text-gray-400"
                }`}
              >
                {activeConcept === "dark_gallery"
                  ? "Sieh direkt, wann ein Status bestätigt wurde."
                  : "Profile aus mehreren Portalen an einem Ort entdecken."}
              </p>
            </div>

            {/* Direct Trigger for Xenia Assistant */}
            <button
              type="button"
              onClick={() => {
                setActiveConcept("xenia_assistant");
                setXeniaStep("start");
              }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C2029] border border-[#C6A574]/50 text-[#E5C99B] text-xs font-semibold hover:bg-[#252A36] transition cursor-pointer self-start sm:self-auto shadow"
            >
              <XeniaGlowingFairy size="sm" />
              <span>Frage an Xenia · Deine Hilfe →</span>
            </button>
          </div>

          {/* Compact Search Bar */}
          <div
            className={`p-3 rounded-2xl border grid grid-cols-1 md:grid-cols-12 gap-3 items-end ${
              activeConcept === "light_sources"
                ? "bg-white border-stone-200/90 shadow-sm"
                : "bg-[#1A1E27] border-white/10 shadow-xl"
            }`}
          >
            <div className="md:col-span-4">
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  activeConcept === "light_sources" ? "text-stone-500" : "text-gray-400"
                }`}
              >
                Ort
              </label>
              <select
                value={selectedCanton}
                onChange={(e) => setSelectedCanton(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none ${
                  activeConcept === "light_sources"
                    ? "bg-white border-stone-300 text-[#141821]"
                    : "bg-[#12151C] border-white/15 text-white"
                }`}
              >
                {SWISS_LOCATIONS.map((loc) => (
                  <option key={loc.code} value={loc.code}>{loc.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label
                className={`block text-[11px] font-semibold mb-1 ${
                  activeConcept === "light_sources" ? "text-stone-500" : "text-gray-400"
                }`}
              >
                Kategorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-3.5 py-2 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none ${
                  activeConcept === "light_sources"
                    ? "bg-white border-stone-300 text-[#141821]"
                    : "bg-[#12151C] border-white/15 text-white"
                }`}
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => setFilterModalOpen(true)}
                className={`w-full py-2 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                  activeConcept === "light_sources"
                    ? "bg-white border-stone-300 text-[#141821] hover:bg-stone-50"
                    : "bg-[#12151C] border-white/15 text-gray-200 hover:bg-white/5"
                }`}
              >
                <SlidersHorizontal size={14} />
                <span>Filter</span>
              </button>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => {}}
                className={`w-full py-2 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow ${
                  activeConcept === "light_sources"
                    ? "bg-[#152839] hover:bg-[#1d354b] text-white"
                    : "bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C]"
                }`}
              >
                <Search size={14} />
                <span>Profile finden →</span>
              </button>
            </div>
          </div>

          {/* Single-Row Control Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-0.5">
            <div className="flex flex-wrap items-center gap-4">
              {activeConcept === "light_sources" ? (
                <div className="flex flex-wrap items-center gap-2">
                  {["ZH", "BS", "BE", "LU", "GE", "ZG", "ALL"].map((code) => {
                    const loc = SWISS_LOCATIONS.find((l) => l.code === code)!;
                    const active = selectedCanton === code;
                    return (
                      <button
                        key={code}
                        onClick={() => setSelectedCanton(code)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold border cursor-pointer ${
                          active
                            ? "bg-[#152839] text-white border-[#152839]"
                            : "bg-white text-[#141821] border-stone-300"
                        }`}
                      >
                        {loc.pill}
                      </button>
                    );
                  })}
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => setOnlyAvailable(!onlyAvailable)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer select-none"
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        onlyAvailable
                          ? "bg-[#C6A574] border-[#C6A574] text-[#13161C]"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {onlyAvailable && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span>Jetzt verfügbar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setOnlyDirectRequest(!onlyDirectRequest)}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer select-none"
                  >
                    <span
                      className={`w-4 h-4 rounded border flex items-center justify-center ${
                        onlyDirectRequest
                          ? "bg-[#C6A574] border-[#C6A574] text-[#13161C]"
                          : "border-gray-400 bg-transparent"
                      }`}
                    >
                      {onlyDirectRequest && <Check size={12} strokeWidth={3} />}
                    </span>
                    <span>Direkt anfragbar</span>
                  </button>

                  <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-gray-400 border-l border-white/10 pl-3">
                    <Info size={13} />
                    <span>Verfügbarkeit wird vom Anbieter bestätigt · {filteredProfiles.length} Profile</span> <XeniaDoubtTrigger topic="status" label="Status-Hilfe" /> <XeniaDoubtTrigger topic="price" label="Preis-Hilfe" />
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-semibold ${
                  activeConcept === "light_sources"
                    ? "bg-white border-stone-300 text-[#141821]"
                    : "bg-[#1A1E27] border-white/15 text-gray-200"
                }`}
              >
                <option value="updated">Zuletzt aktualisiert</option>
                <option value="verified">Selbst verwaltete zuerst</option>
                <option value="price_asc">Preis aufsteigend</option>
              </select>

              <div
                className={`flex rounded-xl overflow-hidden border ${
                  activeConcept === "light_sources"
                    ? "border-stone-300 bg-white"
                    : "border-white/15 bg-[#1A1E27]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Raster"
                  className={`p-1.5 cursor-pointer ${
                    viewMode === "grid"
                      ? activeConcept === "light_sources"
                        ? "bg-[#152839] text-white"
                        : "bg-white/15 text-white"
                      : "text-gray-400"
                  }`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchConcept("champagne_compare")}
                  title="Champagner-Gold Vergleichsliste öffnen"
                  className="p-1.5 cursor-pointer text-gray-400 hover:text-[#C6A574]"
                >
                  <ListIcon size={15} />
                </button>
              </div>
            </div>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5 pt-1">
              {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                renderUnifiedCard(p, idx, activeConcept === "light_sources")
              )}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/10">
              {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                renderChampagneGoldListRow(p, idx, activeConcept === "dark_gallery")
              )}
            </div>
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* ANSICHT 2: CHAMPAGNER-GOLD VERGLEICHSLISTE (EXAKT NACH BILD 10!)      */}
      {/* ("Profile vergleichen – Quellen, Preise und Angaben gegenüberstellen")*/}
      {/* ===================================================================== */}
      {activeConcept === "champagne_compare" && (
        <main className="max-w-[1380px] mx-auto px-6 sm:px-10 pt-6 pb-12 space-y-5">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#181614] tracking-tight">
              Profile vergleichen
            </h1>
            <p className="text-sm sm:text-base text-[#5C554B]">
              Quellen, Preise und Angaben übersichtlich gegenüberstellen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Filter Box ("Suche verfeinern" mit goldenem Button "Profile finden" wie in Bild 10!) */}
            <aside className="lg:col-span-3 p-5 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm space-y-5 lg:sticky lg:top-20">
              <h2 className="text-xl font-serif font-bold text-[#181614]">Suche verfeinern</h2>

              <div className="space-y-2.5">
                <label className="block text-xs font-semibold text-[#5C554B]">Ort oder Kanton</label>
                <select
                  value={selectedCanton}
                  onChange={(e) => setSelectedCanton(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5CBB8] text-xs font-semibold text-[#181614]"
                >
                  {SWISS_LOCATIONS.map((loc) => (
                    <option key={loc.code} value={loc.code}>{loc.label}</option>
                  ))}
                </select>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["ZH", "ZG", "BS", "BE", "LU"].map((code) => {
                    const loc = SWISS_LOCATIONS.find((l) => l.code === code)!;
                    const active = selectedCanton === code;
                    return (
                      <button
                        key={code}
                        onClick={() => setSelectedCanton(code)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition ${
                          active
                            ? "bg-[#9E7B47] text-white"
                            : "bg-[#F3EFE8] text-[#3D372E] hover:bg-[#E8E1D5]"
                        }`}
                      >
                        {loc.pill}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setSelectedCanton("ALL")}
                  className="text-xs text-[#8A642B] underline font-semibold cursor-pointer"
                >
                  Alle Orte
                </button>
              </div>

              <div className="space-y-2.5 pt-3 border-t border-[#E6DFD3]">
                <label className="block text-xs font-semibold text-[#5C554B]">Kategorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#D5CBB8] text-xs font-semibold text-[#181614]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>

                <div className="space-y-2 pt-2 text-xs text-[#3D372E]">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyAvailable}
                      onChange={() => setOnlyAvailable(!onlyAvailable)}
                      className="accent-[#9E7B47] w-4 h-4 rounded"
                    />
                    <span>Jetzt verfügbar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyWithPrice}
                      onChange={() => setOnlyWithPrice(!onlyWithPrice)}
                      className="accent-[#9E7B47] w-4 h-4 rounded"
                    />
                    <span>Nur mit Preisangabe</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-[#E6DFD3]">
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(true)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#181614] py-1 cursor-pointer"
                >
                  <span>Weitere Filter</span>
                  <span>▾</span>
                </button>
              </div>

              <div className="space-y-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full py-3 rounded-xl bg-[#C6A574] hover:bg-[#b89562] text-[#181614] font-bold text-xs sm:text-sm cursor-pointer shadow-sm"
                >
                  Profile finden
                </button>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="block text-xs text-[#8A642B] underline font-medium cursor-pointer"
                >
                  Zurücksetzen
                </button>
              </div>
            </aside>

            {/* Right Champagne-Gold Comparison List (Exakt wie in Bild 10!) */}
            <div className="lg:col-span-9 bg-white rounded-2xl border border-[#E6DFD3] shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-[#E6DFD3] flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#181614]">
                  Profile entdecken{" "}
                  <span className="text-xs font-sans font-normal text-[#6E665B]">
                    ({filteredProfiles.length} Ergebnisse)
                  </span>
                </h2>
                <div className="flex items-center gap-2.5">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3.5 py-2 rounded-xl bg-white border border-[#D5CBB8] text-xs font-semibold text-[#181614]"
                  >
                    <option value="updated">Zuletzt aktualisiert</option>
                    <option value="price_asc">Preis aufsteigend</option>
                    <option value="verified">Selbst verwaltete zuerst</option>
                  </select>

                  <div className="flex rounded-xl overflow-hidden border border-[#D5CBB8]">
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "list"
                          ? "bg-[#9E7B47] text-white"
                          : "bg-white text-[#3D372E]"
                      }`}
                    >
                      <ListIcon size={14} />
                      <span>Liste</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSwitchConcept("dark_gallery")}
                      className={`px-3.5 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-[#9E7B47] text-white"
                          : "bg-white text-[#3D372E]"
                      }`}
                    >
                      <LayoutGrid size={14} />
                      <span>Raster</span>
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === "list" ? (
                <div className="divide-y divide-[#E6DFD3]">
                  {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                    renderChampagneGoldListRow(p, idx, false)
                  )}
                </div>
              ) : (
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4 bg-[#FAF7F2]">
                  {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                    renderUnifiedCard(p, idx, true)
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* ANSICHT 4 (NEU): "XENIA · DEINE HILFE" (EXAKT NACH 9c65a5f9 & 919ed897)*/}
      {/* Umschaltbar zwischen "Start" (mit/ohne 3 Karten) & "Im Gespräch"!     */}
      {/* ===================================================================== */}
      {activeConcept === "xenia_assistant" && (
        <main className="max-w-4xl mx-auto px-6 py-6 space-y-8">
          {/* Sub-Top Bar: Assistent | Übersicht  ---  Direkt zur Übersicht -> */}
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setXeniaStep("start")}
                className="px-4 py-1.5 rounded-lg bg-[#C6A574] text-[#0F1218] text-xs font-bold cursor-pointer"
              >
                Assistent
              </button>
              <button
                type="button"
                onClick={() => handleSwitchConcept("dark_gallery")}
                className="px-4 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 text-xs font-semibold cursor-pointer"
              >
                Übersicht
              </button>
            </div>

            <div className="flex items-center gap-4 text-xs">
              <button
                type="button"
                onClick={() => setXeniaVariant(xeniaVariant === "cards" ? "minimal" : "cards")}
                className="text-gray-400 hover:text-white underline cursor-pointer hidden sm:inline"
              >
                {xeniaVariant === "cards" ? "Kompakt-Ansicht (Bild 1)" : "Mit 3 Themen-Karten (Bild 2)"}
              </button>
              <button
                type="button"
                onClick={() => handleSwitchConcept("dark_gallery")}
                className="text-[#C6A574] hover:underline font-semibold inline-flex items-center gap-1.5 cursor-pointer"
              >
                <span>Direkt zur Übersicht →</span>
              </button>
            </div>
          </div>

          {/* ZUSTAND A: START ("Was möchtest du wissen?" / "Wobei können wir dir helfen?") */}
          {xeniaStep === "start" ? (
            <div className="py-6 space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-3">
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <XeniaGlowingFairy size="lg" />
                  <div className="text-xs font-medium text-[#E5C99B] flex items-center gap-2">
                    <span>Xenia · Deine Hilfe</span>
                  </div>
                </div>

                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white tracking-tight pt-1">
                  {xeniaVariant === "minimal" ? "Was möchtest du wissen?" : "Wobei können wir dir helfen?"}
                </h1>
                <p className="text-sm sm:text-base text-gray-400">
                  {xeniaVariant === "minimal"
                    ? "Frag zu Portalen, Datenschutz oder deinem Eintrag."
                    : "Schreib dein Anliegen oder wähle einen Einstieg."}
                </p>

                {/* Rounded Input Capsule with Gold Send Circle */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (xeniaInput.trim()) setXeniaUserPrompt(xeniaInput.trim());
                    setXeniaStep("conversation");
                  }}
                  className="mt-5 flex items-center bg-[#161B24] border border-white/15 focus-within:border-[#C6A574] rounded-2xl p-2 pl-5 shadow-2xl"
                >
                  <input
                    type="text"
                    value={xeniaInput}
                    onChange={(e) => setXeniaInput(e.target.value)}
                    placeholder={
                      xeniaVariant === "minimal"
                        ? "Stell deine Frage ..."
                        : "Frage zu einem Portal oder deinem Eintrag ..."
                    }
                    className="w-full bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                  />
                  <button
                    type="submit"
                    aria-label="Frage absenden"
                    className="w-11 h-11 rounded-full bg-[#D8B06A] hover:bg-[#e3be7c] text-[#0F1218] flex items-center justify-center shrink-0 transition cursor-pointer shadow-md"
                  >
                    <Send size={17} />
                  </button>
                </form>

                {/* Quick Pills (Bild 1: 9c65a5f9) */}
                <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
                  {[
                    { label: "Portale vergleichen", prompt: "Ich möchte Portale vergleichen.", topic: "Datenschutz" as const },
                    { label: "Prüfungen verstehen", prompt: "Wie funktionieren eure Prüfungen und Kennzeichnungen?", topic: "Funktionen" as const },
                    { label: "Eintrag verwalten", prompt: "Wie kann ich meinen eigenen Eintrag verwalten oder entfernen?", topic: "Kontoverwaltung" as const },
                  ].map((pill) => (
                    <button
                      key={pill.label}
                      type="button"
                      onClick={() => {
                        setXeniaUserPrompt(pill.prompt);
                        setXeniaTopic(pill.topic);
                        setXeniaStep("conversation");
                      }}
                      className="px-4 py-2 rounded-xl bg-[#161B24] hover:bg-[#1E2532] border border-white/15 hover:border-[#C6A574]/60 text-xs sm:text-sm font-medium text-gray-200 transition cursor-pointer"
                    >
                      {pill.label}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-gray-400 pt-1">
                  Quellen und Prüfkriterien bleiben nachvollziehbar. Du kannst auch direkt{" "}
                  <button
                    type="button"
                    onClick={() => handleSwitchConcept("dark_gallery")}
                    className="text-[#C6A574] underline font-semibold cursor-pointer"
                  >
                    zur Übersicht
                  </button>{" "}
                  wechseln.
                </p>
              </div>

              {/* 3 Illustrierte Einstiegs-Karten (Bild 2: 919ed897) */}
              {xeniaVariant === "cards" && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setXeniaUserPrompt("Ich möchte Portale vergleichen.");
                      setXeniaTopic("Funktionen");
                      setXeniaStep("conversation");
                    }}
                    className="group text-left rounded-2xl bg-[#141821] border border-white/10 hover:border-[#C6A574]/60 overflow-hidden transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-40 w-full overflow-hidden bg-stone-800">
                        <img
                          src="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80"
                          alt="Portale vergleichen"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <div className="p-5 space-y-1.5">
                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#C6A574]">
                          Portale vergleichen
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Unterschiede bei Funktionen, Kosten und Bedingungen einfach nachvollziehen.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-4 flex justify-end text-[#C6A574]">
                      <ArrowRight size={16} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setXeniaUserPrompt("Ich möchte Sicherheit und Datenschutz verstehen.");
                      setXeniaTopic("Datenschutz");
                      setXeniaStep("conversation");
                    }}
                    className="group text-left rounded-2xl bg-[#141821] border border-white/10 hover:border-[#C6A574]/60 overflow-hidden transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-40 w-full overflow-hidden bg-stone-800">
                        <img
                          src="https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80"
                          alt="Sicherheit verstehen"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <div className="p-5 space-y-1.5">
                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#C6A574]">
                          Sicherheit verstehen
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Welche Datenschutzfunktionen die Portale bieten und worauf du achten solltest.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-4 flex justify-end text-[#C6A574]">
                      <ArrowRight size={16} />
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setXeniaUserPrompt("Wie kann ich meinen eigenen Eintrag verwalten?");
                      setXeniaTopic("Kontoverwaltung");
                      setXeniaStep("conversation");
                    }}
                    className="group text-left rounded-2xl bg-[#141821] border border-white/10 hover:border-[#C6A574]/60 overflow-hidden transition cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      <div className="h-40 w-full overflow-hidden bg-stone-800">
                        <img
                          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80"
                          alt="Eintrag verwalten"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      </div>
                      <div className="p-5 space-y-1.5">
                        <h3 className="text-lg font-serif font-bold text-white group-hover:text-[#C6A574]">
                          Eintrag verwalten
                        </h3>
                        <p className="text-xs text-gray-400 leading-relaxed">
                          Einstellungen, Daten und Optionen für deinen Eintrag im Überblick.
                        </p>
                      </div>
                    </div>
                    <div className="px-5 pb-4 flex justify-end text-[#C6A574]">
                      <ArrowRight size={16} />
                    </div>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* ZUSTAND B: IM GESPRÄCH / NACH DEINER AUSWAHL (Rechte Seite deiner Xenia-Bilder!) */
            <div className="space-y-6">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <button
                  type="button"
                  onClick={() => setXeniaStep("start")}
                  className="inline-flex items-center gap-1.5 hover:text-white cursor-pointer"
                >
                  <ArrowLeft size={14} />
                  <span>Zurück</span>
                </button>
                <span>|</span>
                <button
                  type="button"
                  onClick={() => {
                    setXeniaStep("start");
                    setXeniaInput("");
                  }}
                  className="inline-flex items-center gap-1.5 hover:text-white cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Neu starten</span>
                </button>
              </div>

              {/* User Bubble Right */}
              <div className="flex justify-end">
                <div className="px-4 py-2.5 rounded-2xl bg-[#1A202C] border border-white/10 text-xs sm:text-sm text-gray-100">
                  {xeniaUserPrompt}
                </div>
              </div>

              {/* Xenia Prompt 1 + 4 Topic Buttons (Funktionen | Kostenmodell | Datenschutz | Kontoverwaltung) */}
              <div className="flex items-start gap-3">
                <XeniaGlowingFairy size="md" />
                <div className="space-y-3 flex-1">
                  <div className="text-xs font-semibold text-[#E5C99B]">Xenia</div>
                  <div className="inline-block px-4 py-2.5 rounded-2xl bg-[#161B24] border border-white/10 text-xs sm:text-sm text-white">
                    Welcher Bereich interessiert dich genauer?
                  </div>

                  <div className="flex flex-wrap gap-2.5 pt-1">
                    {[
                      { id: "Funktionen" as const, icon: Settings },
                      { id: "Kostenmodell" as const, icon: Database },
                      { id: "Datenschutz" as const, icon: Shield },
                      { id: "Kontoverwaltung" as const, icon: User },
                    ].map((item) => {
                      const IconComp = item.icon;
                      const active = xeniaTopic === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => setXeniaTopic(item.id)}
                          className={`px-4 py-2.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-2 transition cursor-pointer ${
                            active
                              ? "bg-[#241E14] border-[#D8B06A] text-[#F3D999] shadow"
                              : "bg-[#141821] border-white/10 text-gray-300 hover:border-white/30"
                          }`}
                        >
                          <IconComp size={14} className="text-[#D8B06A]" />
                          <span>{item.id}</span>
                          {active && (
                            <span className="w-4 h-4 rounded-full bg-[#D8B06A] text-[#0F1218] flex items-center justify-center text-[10px] font-bold">
                              ✓
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Selected Topic Chip */}
              <div className="flex justify-end">
                <div className="px-3.5 py-1.5 rounded-xl bg-[#241E14] border border-[#D8B06A]/50 text-xs text-[#F3D999] inline-flex items-center gap-2">
                  <span>{xeniaTopic}</span>
                </div>
              </div>

              {/* Xenia Answer 2: Comparison Table (Bild 1) + Report Cards (Bild 2) */}
              <div className="flex items-start gap-3">
                <XeniaGlowingFairy size="md" />
                <div className="space-y-4 flex-1">
                  <div className="inline-block px-4 py-2.5 rounded-2xl bg-[#161B24] border border-white/10 text-xs sm:text-sm text-white">
                    Wir können die Berichte zum Thema <strong>{xeniaTopic}</strong> nach denselben Kriterien gegenüberstellen:
                  </div>

                  {/* Comparison Matrix Card (Exakt wie in 9c65a5f9 Rechts!) */}
                  <div className="p-5 rounded-2xl bg-[#141821] border border-white/10 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        Kriterienvergleich · Fokus: {xeniaTopic}
                      </h3>
                      <span className="text-[11px] text-gray-400">Stand: 25. Oktober 2026</span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse text-xs">
                        <thead>
                          <tr className="border-b border-white/10 text-gray-400">
                            <th className="py-2.5 pr-4">Kriterium</th>
                            <th className="py-2.5 px-4">xdate.ch</th>
                            <th className="py-2.5 px-4">fgirl.ch</th>
                            <th className="py-2.5 pl-4 text-[#D8B06A]">iwantsexnow.ch (Eigenes Angebot)</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10 text-gray-200">
                          <tr>
                            <td className="py-3 pr-4 font-medium">Datenschutz & Quellenhinweise</td>
                            <td className="py-3 px-4">Im Bericht prüfen (8.3/10)</td>
                            <td className="py-3 px-4">Im Bericht prüfen (8.4/10)</td>
                            <td className="py-3 pl-4 text-emerald-300">Offengelegte Herkunft je Feld</td>
                          </tr>
                          <tr>
                            <td className="py-3 pr-4 font-medium">Kontrolle über eigene Daten</td>
                            <td className="py-3 px-4">Konto erforderlich</td>
                            <td className="py-3 px-4">Über Studio-/Anbieter-Login</td>
                            <td className="py-3 pl-4 text-emerald-300">Kostenlose Übernahme & Pause</td>
                          </tr>
                          <tr>
                            <td className="py-3 pr-4 font-medium">Eintrag entfernen / Widerspruch</td>
                            <td className="py-3 px-4">Support-Kontakt</td>
                            <td className="py-3 px-4">Support-Kontakt</td>
                            <td className="py-3 pl-4 text-emerald-300">Direkt ohne Kontopflicht (/report)</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>

                    <div className="flex flex-wrap items-center gap-5 pt-2 text-xs text-[#D8B06A] font-semibold">
                      <Link href="/reviews" className="inline-flex items-center gap-1.5 hover:underline">
                        <FileText size={14} />
                        <span>Quellen ansehen →</span>
                      </Link>
                      <Link href="/for-clients" className="inline-flex items-center gap-1.5 hover:underline">
                        <Scale size={14} />
                        <span>Prüfkriterien öffnen →</span>
                      </Link>
                    </div>
                  </div>

                  {/* 2 Side-by-Side Report Cards (Exakt wie in 919ed897 Rechts!) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {SWISS_PORTAL_TOP10.slice(0, 2).map((rep) => (
                      <div
                        key={rep.slug}
                        className="p-4 rounded-2xl bg-[#141821] border border-white/10 flex flex-col justify-between space-y-3"
                      >
                        <div className="space-y-1.5">
                          <span className="text-[10px] uppercase tracking-wider text-gray-400">
                            Einzelbericht · {rep.lastAudited}
                          </span>
                          <h4 className="text-base font-serif font-bold text-white">
                            {rep.name} im Überblick
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">
                            {rep.summary}
                          </p>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs font-semibold text-[#D8B06A]">
                          <Link href={`/reviews/${rep.slug}`} className="hover:underline">
                            Bericht lesen →
                          </Link>
                          <Link href="/reviews" className="hover:underline text-gray-400">
                            Quellen ansehen →
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Gold Action Bar ("Berichte öffnen ->" / "Unterschiede zeigen ->") */}
                  <div className="flex flex-wrap justify-center gap-3 pt-1">
                    <Link
                      href="/reviews"
                      className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#D8B06A] hover:bg-[#e3be7c] text-[#0F1218] font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 shadow-lg"
                    >
                      <Scale size={16} />
                      <span>Alle Berichte & Unterschiede öffnen →</span>
                    </Link>
                  </div>
                </div>
              </div>

              {/* Follow-up Input at Bottom */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (xeniaInput.trim()) {
                    setXeniaUserPrompt(xeniaInput.trim());
                    setXeniaInput("");
                  }
                }}
                className="flex items-center bg-[#161B24] border border-white/15 rounded-2xl p-2 pl-5"
              >
                <input
                  type="text"
                  value={xeniaInput}
                  onChange={(e) => setXeniaInput(e.target.value)}
                  placeholder="Frage weiter ..."
                  className="w-full bg-transparent text-sm text-white placeholder-gray-400 focus:outline-none"
                />
                <button
                  type="submit"
                  className="w-10 h-10 rounded-full bg-[#D8B06A] text-[#0F1218] flex items-center justify-center shrink-0 cursor-pointer"
                >
                  <Send size={15} />
                </button>
              </form>
            </div>
          )}

          {/* Bottom Right "Hilfe ausblenden" (Exakt wie in beiden Bildern!) */}
          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => handleSwitchConcept("dark_gallery")}
              className="text-xs text-gray-400 hover:text-white inline-flex items-center gap-1.5 cursor-pointer"
            >
              <EyeOff size={13} />
              <span>Hilfe ausblenden (Zurück zum Profilverzeichnis)</span>
            </button>
          </div>
        </main>
      )}

      {/* Load More on Directory Views */}
      {activeConcept !== "xenia_assistant" && (
        <div className="max-w-[1380px] mx-auto px-6 sm:px-10 pb-8 text-center">
          <button
            type="button"
            onClick={loadMoreFromServerVault}
            disabled={loadingVault}
            className={`px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow ${
              activeConcept === "light_sources"
                ? "bg-[#152839] text-white"
                : "bg-[#C6A574] text-[#13161C]"
            }`}
          >
            {loadingVault ? "Lädt..." : "Weitere Profile laden"}
          </button>
        </div>
      )}

      {/* ===================================================================== */}
      {/* ===================================================================== */}
      {/* DUNKLE SCHWEBENDE VERGLEICHSLEISTE MIT GOLDENEM BUTTON (WIE BILD 10!) */}
      {/* ("2 ausgewählt | [Mia x] [Lea x] | Auswahl vergleichen ->")           */}
      {/* ===================================================================== */}
      {comparedProfiles.length > 0 && activeConcept !== "xenia_assistant" && (
        <div className="fixed bottom-16 md:bottom-4 left-4 right-4 md:right-auto md:w-[660px] z-50">
          <div className="p-3.5 rounded-2xl bg-[#14171F]/95 backdrop-blur-xl border border-[#C6A574]/60 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <strong className="pr-2.5 border-r border-white/15 font-serif text-base">
                {comparedProfiles.length} ausgewählt
              </strong>
              {comparedProfiles.map((cp: any) => (
                <span
                  key={cp.id}
                  className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs font-medium text-gray-100"
                >
                  <span className="truncate max-w-[110px]">{cp.rawName}</span>
                  <button onClick={() => toggleCompare(cp.id)} className="text-gray-400 hover:text-white cursor-pointer">
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCompareModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#C6A574] hover:bg-[#d4b587] text-[#14171F] font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow"
            >
              <span>Auswahl vergleichen</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* VERGLEICHS-MODAL */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-white">
          <div className="max-w-4xl w-full rounded-2xl bg-[#1C2029] border border-[#C6A574] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif font-bold">Ausgewählte Profile im direkten Vergleich</h3>
              <button onClick={() => setCompareModalOpen(false)} className="p-1.5 rounded-lg bg-white/10">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {comparedProfiles.map((cp: any) => (
                <div key={cp.id} className="p-4 rounded-xl bg-[#13161C] border border-white/10 space-y-3">
                  <img
                    src={cp.thumbnail || cp.fallbackImg}
                    alt={cp.rawName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = cp.fallbackImg;
                    }}
                    className="w-full h-44 object-cover object-top rounded-lg"
                  />
                  <div className="text-base font-serif font-bold text-white">{cp.rawName}</div>
                  <div className="space-y-1.5 text-gray-300 border-t border-white/10 pt-2">
                    <div>• <strong>Ort:</strong> {cp.cleanCity} · {cp.canton}</div>
                    <div>
                      • <strong>Veröffentlichter Preis:</strong>{" "}
                      {cp.advertisedBaseChf ? (
                        <span className="text-[#C6A574] font-bold">
                          CHF {cp.advertisedBaseChf} ({cp.durationLabel})
                        </span>
                      ) : (
                        "Keine Preisangabe"
                      )}
                    </div>
                    <div>
                      • <strong>Verfügbarkeit:</strong>{" "}
                      {cp.availabilityConfirmed
                        ? `Bestätigt vor ${cp.confirmedMinutesAgo || 6} Min.`
                        : "Verfügbarkeit unbekannt"}
                    </div>
                    <div>
                      • <strong>Erfasste Quellen:</strong>{" "}
                      {cp.linkedSources?.map((s: any) => s.portal).join(", ")}
                    </div>
                  </div>
                  <Link
                    href={`/profile/${encodeURIComponent(cp.id)}`}
                    className="w-full py-2.5 rounded-lg bg-[#C6A574] text-[#13161C] font-bold text-center block"
                  >
                    Profil ansehen →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PRIVAT ANFRAGEN / QUELLEN MODAL */}
      {privateInquiryProfile && (
        <div className="fixed inset-0 z-[75] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 text-white">
          <div className="max-w-md w-full rounded-2xl bg-[#1C2029] border border-white/20 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
                {privateInquiryProfile.isSelfManaged ? "Privat anfragen · Selbst verwaltetes Profil" : "Quellenübersicht"}
              </span>
              <button onClick={() => setPrivateInquiryProfile(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <h3 className="text-xl font-serif font-bold">{privateInquiryProfile.rawName}</h3>
            <p className="text-xs text-gray-300">
              {privateInquiryProfile.cleanCity} · Kanton {privateInquiryProfile.canton}
            </p>
            <div className="p-3.5 rounded-xl bg-[#13161C] border border-white/10 space-y-2 text-xs">
              <div className="font-bold text-gray-200">Erfasste Quellen & Kontaktwege:</div>
              {privateInquiryProfile.linkedSources?.map((src: any, idx: number) => (
                <a
                  key={idx}
                  href={src.url}
                  target={src.url.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer nofollow"
                  className="py-1.5 flex items-center justify-between text-[#C6A574] hover:underline"
                >
                  <span>{src.portal}</span>
                  <ExternalLink size={12} />
                </a>
              ))}
            </div>
            <Link
              href={`/profile/${encodeURIComponent(privateInquiryProfile.id)}`}
              className="w-full py-3 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs block text-center"
            >
              Vollständiges Profil öffnen →
            </Link>
          </div>
        </div>
      )}

      {/* FILTER DIALOG */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-[75] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 text-white">
          <div className="max-w-md w-full rounded-2xl bg-[#1C2029] border border-white/15 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-bold">Filter verfeinern</h3>
              <button onClick={() => setFilterModalOpen(false)}>
                <X size={16} />
              </button>
            </div>
            <div className="space-y-3 text-xs">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={() => setOnlyAvailable(!onlyAvailable)}
                  className="w-4 h-4 accent-[#C6A574]"
                />
                <span>Nur aktuell bestätigte Verfügbarkeit</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyDirectRequest}
                  onChange={() => setOnlyDirectRequest(!onlyDirectRequest)}
                  className="w-4 h-4 accent-[#C6A574]"
                />
                <span>Nur selbst verwaltete Profile (Privat anfragbar)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyWithPrice}
                  onChange={() => setOnlyWithPrice(!onlyWithPrice)}
                  className="w-4 h-4 accent-[#C6A574]"
                />
                <span>Nur Einträge mit veröffentlichter Preisangabe</span>
              </label>
            </div>
            <div className="flex justify-between pt-3 border-t border-white/10">
              <button onClick={resetAllFilters} className="text-xs text-gray-400 underline">
                Zurücksetzen
              </button>
              <button
                onClick={() => setFilterModalOpen(false)}
                className="px-5 py-2 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs"
              >
                Ergebnisse anzeigen ({filteredProfiles.length})
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}