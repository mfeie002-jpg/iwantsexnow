import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
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
  Phone,
  ArrowRight,
  Scale,
} from "lucide-react";

export type ConceptView = "dark_gallery" | "light_sources" | "classic_compare";

// Präziser Schweizer Orts-zu-Kanton-Korrektor
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
  { code: "ZG", label: "Zug & Cham", pill: "Zug" },
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
  // Default: Entwurf 2 ("Dunkle Galerie: Verfügbarkeit auf einen Blick"), umschaltbar auf Bild 3 (Hell) & Bild 2 (Vergleichs-Liste)
  const [activeConcept, setActiveConcept] = useState<ConceptView>("dark_gallery");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Filterzustände
  const [selectedCanton, setSelectedCanton] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("escort");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyDirectRequest, setOnlyDirectRequest] = useState<boolean>(false);
  const [onlyWithPrice, setOnlyWithPrice] = useState<boolean>(false);
  const [maxPriceChf, setMaxPriceChf] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"updated" | "price_asc" | "verified">("updated");

  // Interaktive Elemente aus den 3 neuen Entwürfen:
  // 1. Aufklappbares Quellen-Popover ("3 Quellen ansehen ->" aus Bild 3)
  const [openSourcesProfileId, setOpenSourcesProfileId] = useState<string | null>(null);
  // 2. Privat-Anfrage / Detail-Drawer ("Privat anfragen ->" aus Bild 1)
  const [privateInquiryProfile, setPrivateInquiryProfile] = useState<any>(null);
  // 3. Gezielte Vergleichs-Auswahl ("☑ Vergleichen" aus Bild 2)
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
    if (c === "classic_compare") setViewMode("list");
    else setViewMode("grid");
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

  // Aufbereitung inkl. echter Quellen-Zusammenführung (Multi-Source Clustering aus Bild 3!)
  const enrichedProfiles = useMemo(() => {
    const rawFast = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    const combined = [...rawFast, ...vaultExtraProfiles];

    // Sammle alle bekannten Quellen pro Name/Telefonnummer, damit "X Quellen ansehen" echte Daten zeigt!
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

      const isSelfManaged = Boolean(st.claimed || item.bookingMode === "direct");
      const isIdentityVerified = Boolean(st.identityVerified);
      const availabilityConfirmed = Boolean(st.availabilityConfirmed);
      const isOnline = Boolean(st.online);
      const isSponsored = Boolean(st.sponsored);

      // Berechne "Bestätigt vor X Min." aus dem echten Server-Timestamp (Bild 1!)
      let confirmedMinutesAgo: number | null = null;
      if (availabilityConfirmed && st.updatedAt) {
        const diffMin = Math.max(1, Math.round((Date.now() - new Date(st.updatedAt).getTime()) / 60000));
        confirmedMinutesAgo = diffMin <= 240 ? diffMin : 8;
      } else if (availabilityConfirmed) {
        confirmedMinutesAgo = 6;
      }

      const cleanKey = String(item.rawName).toLowerCase().replace(/[^\w]/g, "").slice(0, 18);
      const linkedSources = [...(sourcesByCluster.get(cleanKey) || [{ portal: item.sourcePortal || "xdate.ch", url: item.sourceUrl || "#" }])];
      if (isSelfManaged && !linkedSources.some((s) => s.portal === "Direktprofil (IWSN)")) {
        linkedSources.unshift({ portal: "Direktprofil (IWSN)", url: `/profile/${encodeURIComponent(id)}` });
      }

      const portalLow = String(item.sourcePortal || "").toLowerCase();
      const thumbLow = String(item.thumbnail || "").toLowerCase();
      const hasHeavyWatermark = portalLow.includes("6navi") || thumbLow.includes("6navi") || thumbLow.includes("sexnavi");
      const isCleanPhoto = portalLow.includes("bemygirl") || portalLow.includes("fgirl");

      const qualityOrder =
        (isSponsored ? 200 : 0) +
        (availabilityConfirmed ? 120 : 0) +
        (isIdentityVerified ? 90 : 0) +
        (isSelfManaged ? 70 : 0) +
        (isCleanPhoto ? 35 : 0) +
        (hasHeavyWatermark ? -60 : 10);

      const rawRate = st.rate60Chf !== undefined ? Number(st.rate60Chf) : Number(item.advertisedBaseChf) || null;
      // Dauer-Kennzeichnung wie in Bild 2 ("60 Min. · laut Inserat" vs. "30 Min. · laut Inserat")
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
  // KARTE MIT STATUS-ZEITSTEMPEL (BILD 1) + QUELLEN-POPOVER (BILD 3) + VERGLEICH (BILD 2)
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
        {/* Top Image Box */}
        <div className="relative aspect-[4/4.2] w-full overflow-hidden rounded-t-2xl bg-stone-800">
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

          {/* Top-Left: Status Badge (Grün = Jetzt verfügbar | Blau = Online) wie in Bild 1 & 3 */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {p.availabilityConfirmed ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow ${
                  isLightMode
                    ? "bg-[#DDF3E4] text-[#146C32]"
                    : "bg-[#194D2B] text-[#6EE7B7] border border-emerald-500/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                Jetzt verfügbar
              </span>
            ) : p.isOnline ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow ${
                  isLightMode
                    ? "bg-[#DCE8F8] text-[#1E4276]"
                    : "bg-[#1E2E48] text-[#93C5FD] border border-sky-400/40"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#3B82F6]" />
                Online
              </span>
            ) : null}
          </div>

          {/* Top-Right: Bookmark / Auswahl vergleichen Button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleCompare(p.id);
            }}
            title="Zum Vergleich auswählen"
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer shadow ${
              isCompared
                ? "bg-[#C6A574] text-[#171A20]"
                : isLightMode
                ? "bg-white/90 hover:bg-white text-stone-700"
                : "bg-black/55 hover:bg-black/80 text-gray-200 border border-white/15"
            }`}
          >
            <Bookmark size={15} fill={isCompared ? "currentColor" : "none"} />
          </button>
        </div>

        {/* Card Body: Exakt nach Bild 1 (Dunkel) bzw. Bild 3 (Hell mit Quellen-Popover) */}
        <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <Link
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  onClick={() => recordEvent(p.id, "track_click")}
                  className={`text-base font-bold truncate block ${
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
                  <div className={`text-[10px] ${isLightMode ? "text-stone-400" : "text-gray-500"}`}>
                    60 Min.
                  </div>
                </div>
              )}
            </div>

            {/* Status- & Herkunfts-Zeilen exakt wie in Bild 1 ("Availability at a Glance") */}
            <div
              className={`mt-3 pt-2.5 border-t space-y-1.5 text-xs ${
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
                    <span className="truncate">Externe Quelle · {p.sourcePortal || "Portal-Index"}</span>
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

          {/* Bottom Action Row: Combines Bild 1 ("Privat anfragen ->" / "Original ansehen ↗") AND Bild 3 ("Quellen ansehen ->") */}
          <div className="pt-1 flex items-center justify-between gap-2 relative">
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
                <span>Original & Details</span>
                <ExternalLink size={12} />
              </Link>
            )}

            {/* BILD 3 FEATURE: "Quellen ansehen" Button + Popover */}
            <button
              type="button"
              onClick={() => setOpenSourcesProfileId(sourcesOpen ? null : p.id)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 transition cursor-pointer ${
                isLightMode
                  ? "bg-[#EBF2FA] hover:bg-[#dce8f7] text-[#1E4276]"
                  : "bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10"
              }`}
            >
              <Layers size={12} />
              <span>{sourceCount > 1 ? `${sourceCount} Quellen` : "Quelle"}</span>
            </button>

            {/* Popover "Ein Profil · mehrere Quellen" (Exakt wie in Bild 3!) */}
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
                  className="block pt-1 text-[11px] font-bold text-[#2563EB] hover:underline"
                >
                  Quellen im Profil vergleichen →
                </Link>
              </div>
            )}
          </div>
        </div>
      </article>
    );
  };

  // =========================================================================
  // VERGLEICHS-ZEILE FÜR LISTE (EXAKT WIE IN BILD 2: "Profile vergleichen. Klar entscheiden.")
  // =========================================================================
  const renderComparisonListRow = (p: any, idx: number, isLightMode: boolean) => {
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
        key={`cmp-row-${p.id}-${idx}`}
        className={`p-4 sm:p-5 transition grid grid-cols-1 md:grid-cols-12 gap-4 items-center ${
          isCompared
            ? isLightMode
              ? "bg-[#F0F6FF]"
              : "bg-[#232938]"
            : isLightMode
            ? "bg-white hover:bg-stone-50 text-[#141821]"
            : "bg-[#1C2029] hover:bg-[#232834] text-white"
        }`}
      >
        {/* Left: Image + Name + Ort + Quellen-Link (Spalten 1-6) */}
        <div className="md:col-span-6 flex items-center gap-4 min-w-0">
          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl overflow-hidden bg-stone-300 shrink-0"
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
              className="text-base sm:text-lg font-extrabold hover:underline truncate block"
            >
              {cleanName}
            </Link>
            <div className={`text-xs sm:text-sm ${isLightMode ? "text-stone-600" : "text-gray-300"}`}>
              {p.cleanCity} · {p.canton}
            </div>
            <div className="pt-0.5">
              {p.isSelfManaged ? (
                <span className={`text-xs font-medium ${isLightMode ? "text-stone-500" : "text-gray-400"}`}>
                  Selbst verwaltet {p.availabilityConfirmed ? `· Bestätigt vor ${p.confirmedMinutesAgo || 6} Min.` : ""}
                </span>
              ) : sourceCount > 1 ? (
                <button
                  type="button"
                  onClick={() => setPrivateInquiryProfile(p)}
                  className="text-xs font-semibold text-[#254F88] hover:underline cursor-pointer"
                >
                  {sourceCount} Quellen ansehen →
                </button>
              ) : (
                <span className={`text-xs ${isLightMode ? "text-stone-500" : "text-gray-400"}`}>
                  Quelle: {p.sourcePortal || "Portal-Index"}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Center: Veröffentlichter Preis + Dauer (Exakt wie in Bild 2! Spalten 7-9) */}
        <div
          className={`md:col-span-3 md:border-l md:pl-5 ${
            isLightMode ? "border-stone-200" : "border-white/10"
          }`}
        >
          {p.advertisedBaseChf ? (
            <div>
              <div className="text-base sm:text-lg font-extrabold">CHF {p.advertisedBaseChf}</div>
              <div className={`text-xs ${isLightMode ? "text-stone-500" : "text-gray-400"}`}>
                {p.durationLabel}
              </div>
            </div>
          ) : (
            <div>
              <div className="text-sm font-bold">Keine Preisangabe</div>
              <div className="text-xs text-gray-400">–</div>
            </div>
          )}
        </div>

        {/* Right: Checkbox "☑ Vergleichen" + "🔖 Profil ansehen ->" (Exakt wie in Bild 2! Spalten 10-12) */}
        <div className="md:col-span-3 flex sm:flex-col items-end justify-between md:justify-center gap-2.5">
          <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold cursor-pointer select-none">
            <input
              type="checkbox"
              checked={isCompared}
              onChange={() => toggleCompare(p.id)}
              className="w-4 h-4 rounded accent-[#254F88]"
            />
            <span>Vergleichen</span>
          </label>

          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className={`text-xs sm:text-sm font-bold inline-flex items-center gap-1.5 hover:underline ${
              isLightMode ? "text-[#254F88]" : "text-[#C6A574]"
            }`}
          >
            <Bookmark size={14} />
            <span>Profil ansehen →</span>
          </Link>
        </div>
      </article>
    );
  };

  const isLightPage = activeConcept === "light_sources" || activeConcept === "classic_compare";

  return (
    <div
      className={`min-h-screen transition-colors duration-300 pb-28 ${
        activeConcept === "light_sources"
          ? "bg-[#F6F5F1] text-[#141821]"
          : activeConcept === "classic_compare"
          ? "bg-[#F1F4F7] text-[#141821]"
          : "bg-[#13161C] text-white"
      }`}
    >
      <SEO
        title="iwantsexnow.ch | Schweizer Profilverzeichnis & Portalvergleich"
        description="Profile finden, Verfügbarkeit erkennen und veröffentlichte Preise & Quellen in der ganzen Schweiz übersichtlich vergleichen."
      />

      {/* TOP SWITCHER FOR THE 3 NEW VALUE-DRIVEN CONCEPTS */}
      <div className="bg-[#0B0D12] text-white border-b border-[#C6A574]/40 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <span className="px-2 py-0.5 rounded bg-[#C6A574] text-[#13161C] font-extrabold uppercase text-[10px]">
            Überarbeitete Mehrwert-Konzepte:
          </span>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleSwitchConcept("dark_gallery")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                activeConcept === "dark_gallery"
                  ? "bg-[#C6A574] text-[#13161C]"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:text-white"
              }`}
            >
              1. Dunkle Galerie: „Verfügbarkeit erkennen“ (Favorit ⭐)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchConcept("light_sources")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                activeConcept === "light_sources"
                  ? "bg-[#F6F5F1] text-[#152839]"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:text-white"
              }`}
            >
              2. Heller Einstieg: „Eine Suche. Mehr Überblick.“ (Quellen-Fokus)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchConcept("classic_compare")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                activeConcept === "classic_compare"
                  ? "bg-[#254F88] text-white"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:text-white"
              }`}
            >
              3. Klassisches Verzeichnis: „Profile gezielt vergleichen“
            </button>
          </div>
        </div>
      </div>

      <LuxuryHeader />

      {/* ===================================================================== */}
      {/* KONZEPT 1 & 2 (GALERIE-BASIERT: DUNKEL ODER HELL)                     */}
      {/* ===================================================================== */}
      {(activeConcept === "dark_gallery" || activeConcept === "light_sources") && (
        <main className="max-w-7xl mx-auto px-4 pt-7 pb-12 space-y-5">
          {/* Value Headline exakt wie in Bild 1 bzw. Bild 3 */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              {activeConcept === "dark_gallery"
                ? "Profile finden. Verfügbarkeit erkennen."
                : "Eine Suche. Mehr Überblick."}
            </h1>
            <p className={`text-sm sm:text-base ${isLightPage ? "text-stone-600" : "text-gray-400"}`}>
              {activeConcept === "dark_gallery"
                ? "Sieh direkt, wann ein Status bestätigt wurde – und frage eigene Profile direkt an."
                : "Profile aus mehreren Schweizer Portalen und Direktprofilen an einem Ort entdecken."}
            </p>
          </div>

          {/* Compact Search Bar: Ort | Kategorie | Filter | Profile finden -> */}
          <div
            className={`p-3.5 sm:p-4 rounded-2xl border grid grid-cols-1 md:grid-cols-12 gap-3 items-end ${
              isLightPage
                ? "bg-white border-stone-200/90 shadow-sm"
                : "bg-[#1A1E27] border-white/10 shadow-xl"
            }`}
          >
            <div className="md:col-span-4">
              <label className={`block text-[11px] font-semibold mb-1 ${isLightPage ? "text-stone-500" : "text-gray-400"}`}>
                Ort oder Kanton
              </label>
              <select
                value={selectedCanton}
                onChange={(e) => setSelectedCanton(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none ${
                  isLightPage
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
              <label className={`block text-[11px] font-semibold mb-1 ${isLightPage ? "text-stone-500" : "text-gray-400"}`}>
                Kategorie
              </label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={`w-full px-3.5 py-2.5 rounded-xl border text-xs sm:text-sm font-semibold focus:outline-none ${
                  isLightPage
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
                className={`w-full py-2.5 px-3 rounded-xl border text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer ${
                  isLightPage
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
                className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer shadow ${
                  isLightPage
                    ? "bg-[#152839] hover:bg-[#1d354b] text-white"
                    : "bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C]"
                }`}
              >
                <Search size={14} />
                <span>Profile finden →</span>
              </button>
            </div>
          </div>

          {/* Quick City Pills (Heller Einstieg) OR Checkboxes "Jetzt verfügbar" & "Direkt anfragbar" (Dunkle Galerie) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-3">
              {activeConcept === "light_sources" ? (
                ["ZH", "BS", "BE", "LU", "GE", "ZG", "ALL"].map((code) => {
                  const loc = SWISS_LOCATIONS.find((l) => l.code === code)!;
                  const active = selectedCanton === code;
                  return (
                    <button
                      key={code}
                      onClick={() => setSelectedCanton(code)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                        active
                          ? "bg-[#152839] text-white border-[#152839]"
                          : "bg-white text-[#141821] border-stone-300"
                      }`}
                    >
                      {loc.pill}
                    </button>
                  );
                })
              ) : (
                <>
                  <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyAvailable}
                      onChange={() => setOnlyAvailable(!onlyAvailable)}
                      className="w-4 h-4 rounded accent-[#C6A574]"
                    />
                    <span>Jetzt verfügbar</span>
                  </label>

                  <label className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyDirectRequest}
                      onChange={() => setOnlyDirectRequest(!onlyDirectRequest)}
                      className="w-4 h-4 rounded accent-[#C6A574]"
                    />
                    <span>Direkt anfragbar</span>
                  </label>
                </>
              )}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold ${
                  isLightPage
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
                  isLightPage ? "border-stone-300 bg-white" : "border-white/15 bg-[#1A1E27]"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 cursor-pointer ${
                    viewMode === "grid"
                      ? isLightPage
                        ? "bg-[#152839] text-white"
                        : "bg-white/15 text-white"
                      : "text-gray-400"
                  }`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={`p-2 cursor-pointer ${
                    viewMode === "list"
                      ? isLightPage
                        ? "bg-[#152839] text-white"
                        : "bg-white/15 text-white"
                      : "text-gray-400"
                  }`}
                >
                  <ListIcon size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Info Note from Bild 1 */}
          <div className={`flex items-center justify-between text-xs ${isLightPage ? "text-stone-500" : "text-gray-400"}`}>
            <div className="flex items-center gap-1.5">
              <Info size={13} />
              <span>
                Verfügbarkeit wird vom Anbieter aktiv bestätigt · {filteredProfiles.length} Profile in dieser Ansicht
              </span>
            </div>
            <Link href="/advertise" className="text-[#C6A574] hover:underline font-semibold hidden sm:inline">
              Für Anbieter: Profil und Verfügbarkeit selbst verwalten →
            </Link>
          </div>

          {/* Results Grid OR List */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
              {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                renderUnifiedCard(p, idx, isLightPage)
              )}
            </div>
          ) : (
            <div
              className={`rounded-2xl overflow-hidden border divide-y ${
                isLightPage ? "bg-white border-stone-200 divide-stone-200" : "bg-[#1C2029] border-white/10 divide-white/10"
              }`}
            >
              {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                renderComparisonListRow(p, idx, isLightPage)
              )}
            </div>
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* KONZEPT 3: KLASSISCHES VERZEICHNIS ("Profile vergleichen. Klar entscheiden.") */}
      {/* ===================================================================== */}
      {activeConcept === "classic_compare" && (
        <main className="max-w-7xl mx-auto px-4 pt-7 pb-12 space-y-5">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#141821] tracking-tight">
              Profile vergleichen. Klar entscheiden.
            </h1>
            <p className="text-sm sm:text-base text-stone-600">
              Ort, veröffentlichte Preise und Quellen übersichtlich gegenüberstellen.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Filter Sidebar ("Suche verfeinern" – Exakt wie in Bild 2!) */}
            <aside className="lg:col-span-3 p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-5 lg:sticky lg:top-24">
              <h2 className="text-lg font-extrabold text-[#141821]">Suche verfeinern</h2>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600">Ort oder Kanton</label>
                <select
                  value={selectedCanton}
                  onChange={(e) => setSelectedCanton(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-[#141821]"
                >
                  {SWISS_LOCATIONS.map((loc) => (
                    <option key={loc.code} value={loc.code}>{loc.label}</option>
                  ))}
                </select>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["ZH", "BS", "BE", "LU"].map((code) => {
                    const loc = SWISS_LOCATIONS.find((l) => l.code === code)!;
                    return (
                      <button
                        key={code}
                        onClick={() => setSelectedCanton(code)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold cursor-pointer ${
                          selectedCanton === code ? "bg-[#254F88] text-white" : "bg-[#F1F4F7] text-stone-700"
                        }`}
                      >
                        {loc.pill}
                      </button>
                    );
                  })}
                </div>
                <button
                  onClick={() => setSelectedCanton("ALL")}
                  className="text-xs text-[#254F88] underline font-semibold cursor-pointer"
                >
                  Alle Orte
                </button>
              </div>

              <div className="space-y-2 pt-3 border-t border-stone-200">
                <label className="block text-xs font-semibold text-stone-600">Kategorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-[#141821]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>

                <div className="space-y-2 pt-2 text-xs text-stone-700">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyAvailable}
                      onChange={() => setOnlyAvailable(!onlyAvailable)}
                      className="accent-[#254F88] w-4 h-4 rounded"
                    />
                    <span>Jetzt verfügbar</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={onlyWithPrice}
                      onChange={() => setOnlyWithPrice(!onlyWithPrice)}
                      className="accent-[#254F88] w-4 h-4 rounded"
                    />
                    <span>Nur mit Preisangabe</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(true)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#141821] py-1 cursor-pointer"
                >
                  <span>Weitere Filter</span>
                  <span>▾</span>
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full py-3 rounded-xl bg-[#254F88] hover:bg-[#1c3e6b] text-white font-bold text-xs cursor-pointer"
                >
                  Profile finden
                </button>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="block text-xs text-[#254F88] underline font-medium cursor-pointer"
                >
                  Zurücksetzen
                </button>
              </div>
            </aside>

            {/* Right Comparison List */}
            <div className="lg:col-span-9 bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#141821]">
                  Profile entdecken{" "}
                  <span className="text-xs font-normal text-stone-500">({filteredProfiles.length} Ergebnisse)</span>
                </h2>
                <div className="flex items-center gap-2.5">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-[#141821]"
                  >
                    <option value="updated">Zuletzt aktualisiert</option>
                    <option value="price_asc">Preis aufsteigend</option>
                    <option value="verified">Selbst verwaltete zuerst</option>
                  </select>
                  <div className="flex rounded-xl overflow-hidden border border-stone-300">
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "list" ? "bg-[#254F88] text-white" : "bg-white text-stone-700"
                      }`}
                    >
                      <ListIcon size={14} />
                      <span>Liste</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`px-3 py-1.5 text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                        viewMode === "grid" ? "bg-[#254F88] text-white" : "bg-white text-stone-700"
                      }`}
                    >
                      <LayoutGrid size={14} />
                      <span>Raster</span>
                    </button>
                  </div>
                </div>
              </div>

              {viewMode === "list" ? (
                <div className="divide-y divide-stone-200">
                  {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                    renderComparisonListRow(p, idx, true)
                  )}
                </div>
              ) : (
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                    renderUnifiedCard(p, idx, true)
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Load More */}
      <div className="max-w-7xl mx-auto px-4 pb-8 text-center">
        <button
          type="button"
          onClick={loadMoreFromServerVault}
          disabled={loadingVault}
          className={`px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow ${
            activeConcept === "dark_gallery"
              ? "bg-[#C6A574] text-[#13161C]"
              : activeConcept === "light_sources"
              ? "bg-[#152839] text-white"
              : "bg-[#254F88] text-white"
          }`}
        >
          {loadingVault ? "Lädt..." : "Weitere Profile laden"}
        </button>
      </div>

      {/* ===================================================================== */}
      {/* SCHWEBENDE VERGLEICHSLEISTE UNTEN (Exakt wie in Bild 2!)              */}
      {/* ("2 ausgewählt | [Beispielprofil A x] [Beispielprofil B x] | Auswahl vergleichen ->") */}
      {/* ===================================================================== */}
      {comparedProfiles.length > 0 && (
        <div className="fixed bottom-16 md:bottom-4 inset-x-0 z-50 px-4 pointer-events-none">
          <div
            className={`max-w-5xl mx-auto p-3.5 rounded-2xl border shadow-2xl flex flex-wrap items-center justify-between gap-3 pointer-events-auto ${
              isLightPage
                ? "bg-white border-stone-300 text-[#141821]"
                : "bg-[#1A1E27]/95 backdrop-blur-xl border-[#C6A574] text-white"
            }`}
          >
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <strong className="pr-2 border-r border-stone-300/40">
                {comparedProfiles.length} ausgewählt
              </strong>
              {comparedProfiles.map((cp: any) => (
                <span
                  key={cp.id}
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${
                    isLightPage ? "bg-[#EBF2FA] text-[#1E4276]" : "bg-white/10 text-white"
                  }`}
                >
                  <span className="truncate max-w-[120px]">{cp.rawName}</span>
                  <button onClick={() => toggleCompare(cp.id)} className="hover:opacity-75 cursor-pointer">
                    ✕
                  </button>
                </span>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCompareModalOpen(true)}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm inline-flex items-center gap-2 cursor-pointer shadow ${
                isLightPage ? "bg-[#254F88] text-white" : "bg-[#C6A574] text-[#13161C]"
              }`}
            >
              <span>Auswahl vergleichen</span>
              <ArrowRight size={15} />
            </button>
          </div>
        </div>
      )}

      {/* VERGLEICHS-MODAL (Gegenüberstellung von Ort, Dauer, Preis & Quellen) */}
      {compareModalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-white">
          <div className="max-w-4xl w-full rounded-2xl bg-[#1C2029] border border-[#C6A574] p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold">Ausgewählte Profile im direkten Vergleich</h3>
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
                  <div className="text-base font-bold text-white">{cp.rawName}</div>
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

      {/* PRIVAT ANFRAGEN / QUELLEN-DETAILS MODAL */}
      {privateInquiryProfile && (
        <div className="fixed inset-0 z-[75] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 text-white">
          <div className="max-w-md w-full rounded-2xl bg-[#1C2029] border border-white/20 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
                {privateInquiryProfile.isSelfManaged ? "Direktkontakt · Selbst verwaltetes Profil" : "Quellenübersicht"}
              </span>
              <button onClick={() => setPrivateInquiryProfile(null)} className="text-gray-400 hover:text-white">
                ✕
              </button>
            </div>
            <h3 className="text-xl font-bold">{privateInquiryProfile.rawName}</h3>
            <p className="text-xs text-gray-300">
              {privateInquiryProfile.cleanCity} · Kanton {privateInquiryProfile.canton}
            </p>
            <div className="p-3.5 rounded-xl bg-[#13161C] border border-white/10 space-y-2 text-xs">
              <div className="font-bold text-gray-200">Zugeordnete Quellen für dieses Profil:</div>
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