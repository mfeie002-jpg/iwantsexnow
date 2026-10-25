import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import {
  Check,
  MapPin,
  SlidersHorizontal,
  Bookmark,
  ChevronRight,
  LayoutGrid,
  List as ListIcon,
  Eye,
  X,
  Phone,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Scale,
  Building2,
  UserCheck,
  Info,
} from "lucide-react";

export type DraftId = "1" | "2" | "3";

// Präziser Schweizer Orts-zu-Kanton-Korrektor (Verhindert falsche Kantone wie "Basel · ZH"!)
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
  { code: "ZH", label: "Zürich (ZH)", pill: "Zürich" },
  { code: "ZG", label: "Zug & Cham (ZG)", pill: "Zug" },
  { code: "BS", label: "Basel (BS)", pill: "Basel" },
  { code: "BE", label: "Bern (BE)", pill: "Bern" },
  { code: "LU", label: "Luzern (LU)", pill: "Luzern" },
  { code: "AG", label: "Aargau (AG)", pill: "Aargau" },
  { code: "SG", label: "St. Gallen (SG)", pill: "St. Gallen" },
  { code: "GE", label: "Genf (GE)", pill: "Genf" },
  { code: "VD", label: "Lausanne / Waadt (VD)", pill: "Lausanne" },
];

const CATEGORIES = [
  { id: "all", label: "Alle Kategorien" },
  { id: "escort", label: "Begleitung & Escort" },
  { id: "massage", label: "Erotische Massage & Tantra" },
  { id: "bdsm", label: "Domina & Fetisch" },
  { id: "trans", label: "Trans / TS" },
];

// Geordnete visuelle Filter für den "Weitere Filter"-Dialog (Abschnitt 5 der Analyse)
const VISUAL_DETAIL_FILTERS = [
  { id: "GFE", group: "Angebot", label: "Girlfriend Experience", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=240&q=80" },
  { id: "Outcall", group: "Besuchsform", label: "Hotel- & Hausbesuch", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=240&q=80" },
  { id: "Privat", group: "Besuchsform", label: "Privat empfangbar", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=240&q=80" },
  { id: "Massage", group: "Angebot", label: "Body-to-Body / Tantra", img: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=240&q=80" },
  { id: "Blond", group: "Merkmale", label: "Blond", img: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=240&q=80" },
  { id: "Latina", group: "Merkmale", label: "Latina / Brünett", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=240&q=80" },
];

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

export default function HomePage() {
  // Default ist Entwurf 2 (Direkte Galerie in Graphit #171A20) wie empfohlen!
  const [draft, setDraft] = useState<DraftId>("2");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Geordnete Such- & Filterzustände (Ort · Kategorie · Status · Weitere Filter)
  const [selectedCanton, setSelectedCanton] = useState<string>("ALL");
  const [selectedCategory, setSelectedCategory] = useState<string>("escort");
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [selectedDetailTags, setSelectedDetailTags] = useState<string[]>([]);
  const [maxPriceChf, setMaxPriceChf] = useState<number>(1000);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<"updated" | "price_asc" | "verified">("updated");

  // Dialoge für unsere Unique Features (Auf Ebene 2, damit die Hauptseite ruhig bleibt!)
  const [filterModalOpen, setFilterModalOpen] = useState<boolean>(false);
  const [quickPeekProfile, setQuickPeekProfile] = useState<any>(null);
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [compareOpen, setCompareOpen] = useState<boolean>(false);

  const [visibleCount, setVisibleCount] = useState<number>(30);
  const [vaultExtraProfiles, setVaultExtraProfiles] = useState<any[]>([]);
  const [vaultPage, setVaultPage] = useState<number>(1);
  const [loadingVault, setLoadingVault] = useState<boolean>(false);

  const [serverData, setServerData] = useState<{ metrics: Record<string, any>; states: Record<string, any> }>({
    metrics: {},
    states: {},
  });

  // Wenn man zu Entwurf 3 wechselt, zeige standardmässig die klassische Listenansicht (umschaltbar auf Raster)
  const handleSwitchDraft = (id: DraftId) => {
    setDraft(id);
    if (id === "3") setViewMode("list");
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
    const qCombined = [searchQuery, ...selectedDetailTags].join(" ").trim();
    if (!qCombined && selectedCanton === "ALL") return;
    const params = new URLSearchParams();
    if (qCombined) params.set("q", qCombined);
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
  }, [searchQuery, selectedDetailTags, selectedCanton]);

  const loadMoreFromServerVault = async () => {
    setLoadingVault(true);
    try {
      const nextPage = vaultPage + 1;
      const qCombined = [searchQuery, ...selectedDetailTags].join(" ").trim();
      const params = new URLSearchParams();
      if (qCombined) params.set("q", qCombined);
      if (selectedCanton !== "ALL") params.set("canton", selectedCanton);
      params.set("page", String(nextPage));
      params.set("limit", "48");

      const res = await fetch(`/api/vault/search?${params.toString()}`);
      const d = await res.json();
      if (d && Array.isArray(d.results) && d.results.length > 0) {
        setVaultExtraProfiles((prev) => [...prev, ...d.results]);
        setVaultPage(nextPage);
      }
      setVisibleCount((prev) => prev + 30);
    } catch {
      setVisibleCount((prev) => prev + 30);
    }
    setLoadingVault(false);
  };

  // Sauber aufbereitete Profile (Ohne Wasserzeichen-Bilder am Anfang & mit korrektem Schweizer Kanton!)
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
      const offerCategory = inferOfferCategory(item);

      const isSelfManaged = Boolean(st.claimed || item.bookingMode === "direct");
      const isIdentityVerified = Boolean(st.identityVerified);
      const availabilityConfirmed = Boolean(st.availabilityConfirmed);
      const isOnline = Boolean(st.online);
      const isSponsored = Boolean(st.sponsored);

      const portalLow = String(item.sourcePortal || "").toLowerCase();
      const thumbLow = String(item.thumbnail || "").toLowerCase();
      const hasHeavyWatermark = portalLow.includes("6navi") || thumbLow.includes("6navi") || thumbLow.includes("sexnavi");
      const isCleanPhoto = portalLow.includes("bemygirl") || portalLow.includes("fgirl");

      const qualityOrder =
        (isSponsored ? 200 : 0) +
        (availabilityConfirmed ? 100 : 0) +
        (isIdentityVerified ? 80 : 0) +
        (isSelfManaged ? 60 : 0) +
        (isCleanPhoto ? 35 : 0) +
        (hasHeavyWatermark ? -60 : 10);

      const rate = Number(st.rate60Chf || item.advertisedBaseChf) || 350;
      const tags =
        Array.isArray(item.includedTags) && item.includedTags.length > 0
          ? item.includedTags.slice(0, 4)
          : ["Einzelprofil", "Diskret"];

      uniqueList.push({
        ...item,
        id,
        rawName: st.displayName || item.rawName,
        cleanCity,
        canton: trueCanton,
        offerCategory,
        profileTypeLabel: isSelfManaged ? "Selbst verwaltetes Profil" : "Einzelprofil",
        advertisedBaseChf: rate,
        includedTags: tags,
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
      if (onlyVerified && !p.isIdentityVerified && !p.isSelfManaged) return false;
      if (maxPriceChf < 1000 && p.advertisedBaseChf > maxPriceChf) return false;

      if (selectedDetailTags.length > 0) {
        const hay = `${p.rawName || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""}`.toLowerCase();
        for (const tag of selectedDetailTags) {
          if (!hay.includes(tag.toLowerCase())) return false;
        }
      }

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = `${p.rawName || ""} ${p.cleanCity || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });

    if (sortBy === "price_asc") {
      return [...list].sort((a, b) => a.advertisedBaseChf - b.advertisedBaseChf);
    }
    if (sortBy === "verified") {
      return [...list].sort((a, b) => Number(b.isIdentityVerified) - Number(a.isIdentityVerified));
    }
    return list;
  }, [
    enrichedProfiles,
    selectedCategory,
    selectedCanton,
    onlyAvailable,
    onlyVerified,
    maxPriceChf,
    selectedDetailTags,
    searchQuery,
    sortBy,
  ]);

  const toggleDetailTag = (tag: string) => {
    setSelectedDetailTags((prev) => (prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]));
  };

  const toggleSaved = (id: string) => {
    setSavedIds((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) return [...prev.slice(1), id];
      return [...prev, id];
    });
  };

  const savedProfiles = useMemo(() => {
    return enrichedProfiles.filter((p) => savedIds.includes(p.id));
  }, [enrichedProfiles, savedIds]);

  const activeFilterCount =
    (selectedCanton !== "ALL" ? 1 : 0) +
    (selectedCategory !== "all" ? 1 : 0) +
    (onlyAvailable ? 1 : 0) +
    (onlyVerified ? 1 : 0) +
    (maxPriceChf < 1000 ? 1 : 0) +
    selectedDetailTags.length +
    (searchQuery.trim() ? 1 : 0);

  const resetAllFilters = () => {
    setSelectedCanton("ALL");
    setSelectedCategory("all");
    setOnlyAvailable(false);
    setOnlyVerified(false);
    setSelectedDetailTags([]);
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
  // KARTE FÜR ENTWURF 1 & 2 (Exakt wie in deinen Bildern 1 & 2, + Unique Quick-Peek & Bookmark!)
  // =========================================================================
  const renderDirectoryCard = (p: any, idx: number, isLight: boolean) => {
    const cleanName =
      String(p.rawName || "Profil")
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 24) || "Profil";
    const img = p.thumbnail || p.fallbackImg;
    const isSaved = savedIds.includes(p.id);

    return (
      <article
        key={`${p.id}-${idx}`}
        className={`group rounded-2xl overflow-hidden transition-all duration-300 flex flex-col justify-between ${
          isLight
            ? "bg-white border border-stone-200/90 shadow-sm hover:shadow-xl hover:border-stone-300"
            : "bg-[#222630] border border-white/10 hover:border-[#C6A574]/60 shadow-lg"
        }`}
      >
        {/* Top Square/Portrait Image Area */}
        <div className="relative aspect-[4/4.3] w-full overflow-hidden bg-stone-800">
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

          {/* Top-Left: Klare Status-Logik (Grün = Jetzt verfügbar, Blau = Online) exakt wie im Mockup! */}
          <div className="absolute top-3 left-3 flex flex-col gap-1.5 pointer-events-none">
            {p.availabilityConfirmed ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow ${
                  isLight ? "bg-[#DDF3E4] text-[#146C32]" : "bg-[#1A472A] text-[#6EE7B7] border border-emerald-500/30"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                Jetzt verfügbar
              </span>
            ) : p.isOnline ? (
              <span
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold shadow ${
                  isLight ? "bg-[#DCE8F8] text-[#1E4276]" : "bg-[#1E2E48] text-[#93C5FD] border border-sky-400/30"
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                Online
              </span>
            ) : null}
          </div>

          {/* Top-Right: Bookmark / Vergleichs-Button (Exakt wie das Lesezeichen-Icon in deinem Mockup!) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              toggleSaved(p.id);
            }}
            title="Auf Merkliste / Direkt-Vergleich setzen"
            className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition cursor-pointer shadow ${
              isSaved
                ? "bg-[#C6A574] text-[#171A20]"
                : isLight
                ? "bg-white/90 hover:bg-white text-stone-700"
                : "bg-black/50 hover:bg-black/80 text-gray-200 border border-white/15"
            }`}
          >
            <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
          </button>

          {/* Bottom-Right on Image: Unique Quick-Preview Trigger (0-Tab-Switch) */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              recordEvent(p.id, "track_click");
              setQuickPeekProfile(p);
            }}
            title="Schnellvorschau & Tarif-Einordnung ohne Seitenwechsel"
            className="absolute bottom-2.5 right-2.5 px-2.5 py-1 rounded-lg bg-black/70 hover:bg-[#C6A574] text-white hover:text-[#171A20] backdrop-blur text-[11px] font-semibold flex items-center gap-1 opacity-90 group-hover:opacity-100 transition cursor-pointer border border-white/15"
          >
            <Eye size={12} />
            <span>Vorschau</span>
          </button>
        </div>

        {/* Clean Card Footer Underneath the Photo (Exakt wie in deinen Bildern 1 & 2!) */}
        <Link
          href={`/profile/${encodeURIComponent(p.id)}`}
          onClick={() => recordEvent(p.id, "track_click")}
          className="p-3.5 flex items-center justify-between gap-2"
        >
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <h3
                className={`text-sm sm:text-base font-bold truncate ${
                  isLight ? "text-[#141821] group-hover:text-[#152839]" : "text-white group-hover:text-[#C6A574]"
                }`}
              >
                {cleanName}
              </h3>
              {p.isIdentityVerified && (
                <span title="Identität geprüft" className="text-[#C6A574] shrink-0">
                  <Check size={14} />
                </span>
              )}
            </div>
            <p className={`text-xs truncate mt-0.5 ${isLight ? "text-stone-500" : "text-gray-400"}`}>
              {p.cleanCity} · {p.canton}
            </p>
          </div>

          {/* Subtle Price + Unit (Only shown cleanly on the right) */}
          {p.advertisedBaseChf && (
            <div className="text-right shrink-0">
              <div className={`text-xs font-bold ${isLight ? "text-[#152839]" : "text-[#E5C99B]"}`}>
                CHF {p.advertisedBaseChf}
              </div>
              <div className={`text-[10px] ${isLight ? "text-stone-400" : "text-gray-500"}`}>Richtwert / 1h</div>
            </div>
          )}
        </Link>
      </article>
    );
  };

  // =========================================================================
  // ZEILE FÜR ENTWURF 3 (Exakt wie in deinem Bild 3: Klassische Verzeichnis-Zeile!)
  // =========================================================================
  const renderDirectoryListRow = (p: any, idx: number, isLight: boolean) => {
    const cleanName =
      String(p.rawName || "Profil")
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 28) || "Profil";
    const img = p.thumbnail || p.fallbackImg;
    const isSaved = savedIds.includes(p.id);

    return (
      <article
        key={`row-${p.id}-${idx}`}
        className={`p-4 transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
          isLight
            ? "bg-white hover:bg-stone-50/80 text-[#141821]"
            : "bg-[#222630] hover:bg-[#282D38] text-white"
        }`}
      >
        <div className="flex items-center gap-4 min-w-0">
          {/* Left Thumbnail with Status Badge */}
          <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-xl overflow-hidden bg-stone-200 shrink-0">
            <Link href={`/profile/${encodeURIComponent(p.id)}`} onClick={() => recordEvent(p.id, "track_click")}>
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
            {p.availabilityConfirmed ? (
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#16A34A] text-white text-[10px] font-bold">
                Jetzt verfügbar
              </span>
            ) : p.isOnline ? (
              <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-[#476788] text-white text-[10px] font-bold">
                Online
              </span>
            ) : null}
          </div>

          {/* Center Information (Name, City · Canton, Profile Type & Unique Service Tags) */}
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${encodeURIComponent(p.id)}`}
                onClick={() => recordEvent(p.id, "track_click")}
                className="text-base sm:text-lg font-bold hover:underline truncate"
              >
                {cleanName}
              </Link>
              {p.isIdentityVerified && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 text-[10px] font-bold">
                  <Check size={11} /> Identität geprüft
                </span>
              )}
            </div>

            <div className={`text-xs sm:text-sm font-medium ${isLight ? "text-stone-600" : "text-gray-300"}`}>
              {p.cleanCity} · {p.canton}
            </div>

            <div className={`text-xs flex flex-wrap items-center gap-2 ${isLight ? "text-stone-500" : "text-gray-400"}`}>
              <span>{p.profileTypeLabel}</span>
              <span>·</span>
              <span>Quelle: {p.isSelfManaged ? "Selbst verwaltet" : p.sourcePortal || "Verzeichnis"}</span>
              {p.advertisedBaseChf && (
                <>
                  <span>·</span>
                  <strong className={isLight ? "text-[#152839]" : "text-[#C6A574]"}>
                    CHF {p.advertisedBaseChf} / 1h
                  </strong>
                </>
              )}
            </div>

            {/* Subtle Service Tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {(p.includedTags || ["Begleitung"]).slice(0, 3).map((tag: string, i: number) => (
                <span
                  key={i}
                  className={`px-2 py-0.5 rounded text-[11px] ${
                    isLight ? "bg-stone-100 text-stone-600" : "bg-white/5 text-gray-300"
                  }`}
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Right Actions: Quick-Preview + Bookmark + "Profil ansehen ->" (Exakt wie in Bild 3!) */}
        <div className="flex items-center justify-end gap-3 shrink-0 border-t sm:border-t-0 pt-2.5 sm:pt-0 border-stone-200/60">
          <button
            type="button"
            onClick={() => {
              recordEvent(p.id, "track_click");
              setQuickPeekProfile(p);
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
              isLight
                ? "border-stone-200 hover:border-stone-400 text-stone-600"
                : "border-white/15 hover:border-white/30 text-gray-300"
            }`}
          >
            Vorschau
          </button>

          <button
            type="button"
            onClick={() => toggleSaved(p.id)}
            title="Merken / Vergleichen"
            className={`p-2 rounded-lg border transition cursor-pointer ${
              isSaved
                ? "bg-[#C6A574] text-[#171A20] border-[#C6A574]"
                : isLight
                ? "border-stone-200 text-stone-600 hover:bg-stone-100"
                : "border-white/15 text-gray-300 hover:bg-white/10"
            }`}
          >
            <Bookmark size={16} fill={isSaved ? "currentColor" : "none"} />
          </button>

          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className={`font-bold text-xs sm:text-sm inline-flex items-center gap-1 hover:underline ${
              draft === "3" ? "text-[#254F88]" : isLight ? "text-[#152839]" : "text-[#C6A574]"
            }`}
          >
            <span>Profil ansehen</span>
            <span>→</span>
          </Link>
        </div>
      </article>
    );
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 pb-24 lg:pb-16 ${
        draft === "1"
          ? "bg-[#F6F5F1] text-[#141821]"
          : draft === "3"
          ? "bg-[#F1F4F7] text-[#141821]"
          : "bg-[#171A20] text-white"
      }`}
    >
      <SEO
        title="iwantsexnow.ch | Escorts und Studios in der Schweiz"
        description="Wähle deinen Ort und entdecke passende Profile, Studios und transparente Portalvergleiche in der ganzen Schweiz."
      />

      {/* ===================================================================== */}
      {/* TOP BAR TO SWITCH LIVE BETWEEN YOUR 3 NEW DRAFTS (ENHANCED EDITIONS)  */}
      {/* ===================================================================== */}
      <div className="bg-[#0E1015] text-white border-b border-[#C6A574]/40 py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-[#C6A574] text-[#171A20] font-extrabold uppercase text-[10px]">
              3 Neue Entwürfe (Live-Prototyp):
            </span>
            <span className="text-gray-400 hidden md:inline">
              Wähle deinen Favoriten (inkl. Vorschau-Drawer, Bild-Filterdialog & Merklisten-Vergleich):
            </span>
          </div>
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => handleSwitchDraft("2")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                draft === "2"
                  ? "bg-[#C6A574] text-[#171A20] shadow"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:text-white"
              }`}
            >
              Entwurf 2: Direkte Galerie (Dunkel · Empfehlung ⭐)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchDraft("1")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                draft === "1"
                  ? "bg-[#F6F5F1] text-[#152839] shadow"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:text-white"
              }`}
            >
              Entwurf 1: Heller Sucheinstieg (#F6F5F1)
            </button>
            <button
              type="button"
              onClick={() => handleSwitchDraft("3")}
              className={`px-3 py-1 rounded-lg font-bold transition cursor-pointer whitespace-nowrap ${
                draft === "3"
                  ? "bg-[#254F88] text-white shadow"
                  : "bg-white/5 text-gray-300 border border-white/10 hover:text-white"
              }`}
            >
              Entwurf 3: Klassisches Verzeichnis (Filterspalte + Liste)
            </button>
          </div>
        </div>
      </div>

      {/* Calm Top Navigation */}
      <LuxuryHeader />

      {/* ===================================================================== */}
      {/* ENTWURF 1: HELLER SUCHEINSTIEG (Warmes Weiss #F6F5F1 + Navy #152839)  */}
      {/* ===================================================================== */}
      {draft === "1" && (
        <main className="max-w-7xl mx-auto px-4 pt-7 pb-12 space-y-6">
          {/* Calm Headline */}
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#141821] tracking-tight">
              Escorts und Studios in der Schweiz
            </h1>
            <p className="text-sm sm:text-base text-stone-600">
              Wähle deinen Ort und entdecke passende Profile.
            </p>
          </div>

          {/* White Search Container (Exakt wie in Bild 1!) */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
            <div className="md:col-span-5">
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Ort oder Kanton</label>
              <select
                value={selectedCanton}
                onChange={(e) => setSelectedCanton(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-stone-300 text-sm font-medium text-[#141821] focus:outline-none focus:border-[#152839]"
              >
                {SWISS_LOCATIONS.map((loc) => (
                  <option key={loc.code} value={loc.code}>{loc.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-xs font-semibold text-stone-600 mb-1.5">Kategorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-3 rounded-xl bg-white border border-stone-300 text-sm font-medium text-[#141821] focus:outline-none focus:border-[#152839]"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3">
              <button
                type="button"
                onClick={() => {}}
                className="w-full py-3 px-5 rounded-xl bg-[#152839] hover:bg-[#1e374d] text-white font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer shadow-sm"
              >
                <span>Profile anzeigen</span>
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          {/* Quick City Pills Left + Status & "Weitere Filter" Right (Exakt wie in Bild 1!) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-stone-200">
            <div className="flex flex-wrap items-center gap-2">
              {["ZH", "ZG", "BS", "BE", "LU", "GE", "ALL"].map((code) => {
                const loc = SWISS_LOCATIONS.find((l) => l.code === code)!;
                const active = selectedCanton === code;
                return (
                  <button
                    key={code}
                    type="button"
                    onClick={() => setSelectedCanton(code)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border transition cursor-pointer ${
                      active
                        ? "bg-[#152839] text-white border-[#152839]"
                        : "bg-white text-[#141821] border-stone-200/90 hover:border-stone-400"
                    }`}
                  >
                    {loc.pill}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200/90 text-xs font-medium text-[#141821] cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={() => setOnlyAvailable(!onlyAvailable)}
                  className="accent-[#152839] w-3.5 h-3.5"
                />
                <span>Jetzt verfügbar</span>
              </label>

              <label className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-stone-200/90 text-xs font-medium text-[#141821] cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={() => setOnlyVerified(!onlyVerified)}
                  className="accent-[#152839] w-3.5 h-3.5"
                />
                <span>Identität geprüft</span>
              </label>

              <button
                type="button"
                onClick={() => setFilterModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-white border border-stone-200/90 hover:border-stone-400 text-xs font-bold text-[#141821] flex items-center gap-1.5 cursor-pointer"
              >
                <SlidersHorizontal size={13} />
                <span>Weitere Filter</span>
                {selectedDetailTags.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#152839] text-white text-[10px]">
                    {selectedDetailTags.length}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Active Visual Filter Chips (If user selected any in "Weitere Filter") */}
          {selectedDetailTags.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-stone-500">Aktive Zusatzfilter:</span>
              {selectedDetailTags.map((t) => (
                <button
                  key={t}
                  onClick={() => toggleDetailTag(t)}
                  className="px-3 py-1 rounded-full bg-[#152839] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{t}</span>
                  <span>✕</span>
                </button>
              ))}
              <button onClick={resetAllFilters} className="text-xs text-[#152839] underline font-semibold ml-2">
                Zurücksetzen
              </button>
            </div>
          )}

          {/* Section Title + Sort Dropdown */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#141821]">
              Profile entdecken{" "}
              <span className="text-sm font-normal text-stone-500">({filteredProfiles.length} Ergebnisse)</span>
            </h2>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-[#141821]"
            >
              <option value="updated">Zuletzt aktualisiert</option>
              <option value="verified">Geprüfte Profile zuerst</option>
              <option value="price_asc">Richtwert aufsteigend</option>
            </select>
          </div>

          {/* 4-Column Light Directory Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
              renderDirectoryCard(p, idx, true)
            )}
          </div>
        </main>
      )}

      {/* ===================================================================== */}
      {/* ENTWURF 2: DIREKTE GALERIE — BEVORZUGTE AUSGANGSBASIS                 */}
      {/* (Graphit #171A20 + Karten #222630 + Gold #C6A574 + 5er-Raster)        */}
      {/* ===================================================================== */}
      {draft === "2" && (
        <main className="max-w-7xl mx-auto px-4 pt-6 pb-12 space-y-5">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Profile in der Schweiz
          </h1>

          {/* Compact 1-Line Toolbar (Exakt wie in Bild 2: Ort · Kategorie · Filter · Profile anzeigen >) */}
          <div className="p-3.5 rounded-2xl bg-[#1E222B] border border-white/10 shadow-xl grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-4">
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Ort</label>
              <select
                value={selectedCanton}
                onChange={(e) => setSelectedCanton(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-white/15 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-[#C6A574]"
              >
                {SWISS_LOCATIONS.map((loc) => (
                  <option key={loc.code} value={loc.code}>{loc.label}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-4">
              <label className="block text-[11px] font-medium text-gray-400 mb-1">Kategorie</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#14171E] border border-white/15 text-xs sm:text-sm font-medium text-white focus:outline-none focus:border-[#C6A574]"
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
                className="w-full py-2.5 px-3 rounded-xl bg-[#14171E] hover:bg-white/5 border border-white/15 text-xs sm:text-sm font-semibold text-gray-200 flex items-center justify-center gap-2 cursor-pointer transition"
              >
                <SlidersHorizontal size={14} className="text-[#C6A574]" />
                <span>Filter</span>
                {activeFilterCount > 2 && (
                  <span className="px-1.5 py-0.2 rounded-full bg-[#C6A574] text-[#171A20] text-[10px] font-extrabold">
                    {activeFilterCount}
                  </span>
                )}
              </button>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => {}}
                className="w-full py-2.5 px-4 rounded-xl bg-[#C6A574] hover:bg-[#d4b587] text-[#171A20] font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition cursor-pointer shadow-md"
              >
                <span>Profile anzeigen</span>
                <ChevronRight size={15} />
              </button>
            </div>
          </div>

          {/* Secondary Status Bar: Checkboxes Left + Sort & Grid/List Switcher Right (Exakt wie in Bild 2!) */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-4 text-xs sm:text-sm text-gray-200">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyAvailable}
                  onChange={() => setOnlyAvailable(!onlyAvailable)}
                  className="accent-[#C6A574] w-4 h-4 rounded"
                />
                <span>Jetzt verfügbar</span>
              </label>

              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={onlyVerified}
                  onChange={() => setOnlyVerified(!onlyVerified)}
                  className="accent-[#C6A574] w-4 h-4 rounded"
                />
                <span>Identität geprüft</span>
              </label>

              <span className="text-xs text-gray-400">
                ({filteredProfiles.length} passende Profile)
              </span>

              {selectedDetailTags.map((tag) => (
                <button
                  key={tag}
                  onClick={() => toggleDetailTag(tag)}
                  className="px-2.5 py-1 rounded-lg bg-[#C6A574]/20 border border-[#C6A574]/50 text-[#E5C99B] text-xs font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <span>{tag}</span>
                  <span>✕</span>
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-3 py-2 rounded-xl bg-[#1E222B] border border-white/15 text-xs font-semibold text-gray-200"
              >
                <option value="updated">Zuletzt aktualisiert</option>
                <option value="verified">Geprüfte Profile zuerst</option>
                <option value="price_asc">Richtwert aufsteigend</option>
              </select>

              <div className="flex rounded-xl overflow-hidden border border-white/15 bg-[#1E222B]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  title="Rasteransicht"
                  className={`p-2 cursor-pointer ${
                    viewMode === "grid" ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  title="Listenansicht"
                  className={`p-2 cursor-pointer ${
                    viewMode === "list" ? "bg-white/15 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ListIcon size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* Immediate 5-Column Dark Gallery OR List View */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                renderDirectoryCard(p, idx, false)
              )}
            </div>
          ) : (
            <div className="rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/10">
              {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                renderDirectoryListRow(p, idx, false)
              )}
            </div>
          )}
        </main>
      )}

      {/* ===================================================================== */}
      {/* ENTWURF 3: KLASSISCHES VERZEICHNIS MIT FILTERSPALTE & LISTE           */}
      {/* (Helles Grau #F1F4F7 + Weisse Flächen + Blau #254F88)                 */}
      {/* ===================================================================== */}
      {draft === "3" && (
        <main className="max-w-7xl mx-auto px-4 pt-6 pb-12 space-y-5">
          <div className="flex items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#141821]">
              Profile in der Schweiz
            </h1>
            <button
              type="button"
              onClick={() => setFilterModalOpen(true)}
              className="lg:hidden px-4 py-2 rounded-xl bg-[#254F88] text-white text-xs font-bold flex items-center gap-1.5"
            >
              <SlidersHorizontal size={14} />
              <span>Suche verfeinern</span>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* LEFT FILTER COLUMN ("Suche verfeinern" – Exakt wie in Bild 3!) */}
            <aside className="hidden lg:block lg:col-span-3 p-5 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-5 sticky top-24">
              <h2 className="text-lg font-extrabold text-[#141821]">Suche verfeinern</h2>

              <div className="space-y-2">
                <label className="block text-xs font-semibold text-stone-600">Ort oder Kanton</label>
                <select
                  value={selectedCanton}
                  onChange={(e) => setSelectedCanton(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-medium text-[#141821]"
                >
                  {SWISS_LOCATIONS.map((loc) => (
                    <option key={loc.code} value={loc.code}>{loc.label}</option>
                  ))}
                </select>

                {/* Quick City Pills inside Sidebar */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["ZH", "ZG", "BS", "BE", "LU"].map((code) => {
                    const loc = SWISS_LOCATIONS.find((l) => l.code === code)!;
                    const active = selectedCanton === code;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => setSelectedCanton(code)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                          active
                            ? "bg-[#254F88] text-white"
                            : "bg-[#F1F4F7] text-stone-700 hover:bg-stone-200"
                        }`}
                      >
                        {loc.pill}
                      </button>
                    );
                  })}
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedCanton("ALL")}
                  className="text-xs text-[#254F88] underline font-medium cursor-pointer"
                >
                  Alle Orte
                </button>
              </div>

              <div className="space-y-2 pt-3 border-t border-stone-200">
                <label className="block text-xs font-semibold text-stone-600">Kategorie</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-white border border-stone-300 text-xs font-medium text-[#141821]"
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
                      checked={onlyVerified}
                      onChange={() => setOnlyVerified(!onlyVerified)}
                      className="accent-[#254F88] w-4 h-4 rounded"
                    />
                    <span>Identität geprüft</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setFilterModalOpen(true)}
                  className="w-full flex items-center justify-between text-xs font-bold text-[#141821] py-1 cursor-pointer"
                >
                  <span>Weitere Filter (Service / Preis)</span>
                  <span>▾</span>
                </button>
              </div>

              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={() => {}}
                  className="w-full py-3 rounded-xl bg-[#254F88] hover:bg-[#1d3f6d] text-white font-bold text-xs cursor-pointer shadow-sm"
                >
                  Profile anzeigen
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

            {/* RIGHT RESULTS LIST OR GRID (Exakt wie in Bild 3!) */}
            <div className="lg:col-span-9 bg-white rounded-2xl border border-stone-200/90 shadow-sm overflow-hidden">
              <div className="p-4 sm:p-5 border-b border-stone-200 flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-extrabold text-[#141821]">
                  Profile entdecken{" "}
                  <span className="text-xs font-normal text-stone-500">({filteredProfiles.length} Treffer)</span>
                </h2>

                <div className="flex items-center gap-2.5">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs font-semibold text-[#141821]"
                  >
                    <option value="updated">Zuletzt aktualisiert</option>
                    <option value="verified">Geprüfte Profile zuerst</option>
                    <option value="price_asc">Richtwert aufsteigend</option>
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
                    renderDirectoryListRow(p, idx, true)
                  )}
                </div>
              ) : (
                <div className="p-5 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) =>
                    renderDirectoryCard(p, idx, true)
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      )}

      {/* Load More & Secondary Info Links */}
      <div className="max-w-7xl mx-auto px-4 pb-10 space-y-10">
        <div className="text-center">
          <button
            type="button"
            onClick={loadMoreFromServerVault}
            disabled={loadingVault}
            className={`px-7 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow ${
              draft === "1"
                ? "bg-[#152839] text-white"
                : draft === "3"
                ? "bg-[#254F88] text-white"
                : "bg-[#C6A574] text-[#171A20]"
            }`}
          >
            {loadingVault ? "Lädt..." : "Weitere Profile anzeigen"}
          </button>
        </div>

        {/* Clean Subordinate Access to Portal Comparison, Clubs & Provider Onboarding (Abschnitt 7) */}
        <div
          className={`pt-8 border-t flex flex-wrap items-center justify-between gap-4 text-xs ${
            draft === "2" ? "border-white/10 text-gray-400" : "border-stone-300 text-stone-600"
          }`}
        >
          <div className="flex flex-wrap items-center gap-4">
            <span><strong>Status-Kennzeichnungen:</strong></span>
            <span>● <strong>Jetzt verfügbar:</strong> Vom Anbieter aktiv bestätigt</span>
            <span>● <strong>Online:</strong> Kürzlich aktiv</span>
            <span>✓ <strong>Identität geprüft:</strong> Abgeschlossene Prüfung</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 font-semibold">
            <Link href="/reviews" className="hover:underline">Portalvergleich (Xdate, Fgirl & Co.) →</Link>
            <Link href="/advertise" className="hover:underline">Bestehendes Profil übernehmen →</Link>
            <Link href="/report" className="hover:underline">Profil melden / entfernen →</Link>
          </div>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* UNIQUE DIALOG 1: GEORDNETER VISUELLER FILTER-DIALOG ("Weitere Filter")*/}
      {/* (Mit Bildkacheln + klarem Textlabel wie in Abschnitt 5 empfohlen!)    */}
      {/* ===================================================================== */}
      {filterModalOpen && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 text-white">
          <div className="max-w-xl w-full rounded-2xl bg-[#1E222B] border border-white/15 p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold">Weitere Filter (Angebot, Besuchsform & Merkmale)</h3>
              <button onClick={() => setFilterModalOpen(false)} className="p-1.5 rounded-lg bg-white/10">
                <X size={16} />
              </button>
            </div>

            {/* Visual Filter Tiles with Clear Labels */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
                1. Visuelle Schnellauswahl (Mehrfachauswahl möglich)
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {VISUAL_DETAIL_FILTERS.map((vf) => {
                  const active = selectedDetailTags.includes(vf.id);
                  return (
                    <button
                      key={vf.id}
                      type="button"
                      onClick={() => toggleDetailTag(vf.id)}
                      className={`relative h-20 rounded-xl overflow-hidden border text-left transition cursor-pointer ${
                        active ? "border-[#C6A574] ring-2 ring-[#C6A574]" : "border-white/15 hover:border-white/40"
                      }`}
                    >
                      <img src={vf.img} alt={vf.label} className="w-full h-full object-cover object-top" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                      <div className="absolute top-1.5 right-1.5">
                        {active && (
                          <span className="w-5 h-5 rounded-full bg-[#C6A574] text-[#171A20] flex items-center justify-center text-xs font-bold">
                            ✓
                          </span>
                        )}
                      </div>
                      <div className="absolute bottom-2 left-2.5 right-2">
                        <div className="text-[10px] text-[#C6A574] uppercase font-bold">{vf.group}</div>
                        <div className="text-xs font-bold text-white leading-tight">{vf.label}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Price Cap Filter */}
            <div className="space-y-2 pt-2 border-t border-white/10">
              <div className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
                2. Richtwert-Obergrenze (60 Min.)
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                {[
                  { val: 250, label: "Bis CHF 250" },
                  { val: 350, label: "Bis CHF 350" },
                  { val: 450, label: "Bis CHF 450" },
                  { val: 1000, label: "Alle Preise" },
                ].map((b) => (
                  <button
                    key={b.val}
                    type="button"
                    onClick={() => setMaxPriceChf(b.val)}
                    className={`py-2 rounded-xl border cursor-pointer ${
                      maxPriceChf === b.val
                        ? "bg-[#C6A574] text-[#171A20] border-[#C6A574]"
                        : "bg-[#14171E] border-white/15 text-gray-300"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-white/10">
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-gray-400 hover:text-white underline cursor-pointer"
              >
                Alle Filter zurücksetzen
              </button>
              <button
                type="button"
                onClick={() => setFilterModalOpen(false)}
                className="px-6 py-2.5 rounded-xl bg-[#C6A574] text-[#171A20] font-bold text-xs cursor-pointer"
              >
                Ergebnisse anzeigen ({filteredProfiles.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* UNIQUE DIALOG 2: SCHNELLVORSCHAU-DRAWER (Ohne den Katalog zu verlassen)*/}
      {/* ===================================================================== */}
      {quickPeekProfile && (
        <div className="fixed inset-0 z-[70] bg-black/75 backdrop-blur-sm flex justify-end text-white">
          <div className="w-full max-w-md bg-[#1E222B] border-l border-white/15 h-full overflow-y-auto p-6 shadow-2xl flex flex-col justify-between space-y-5">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
                  Profil-Schnellvorschau
                </span>
                <button onClick={() => setQuickPeekProfile(null)} className="p-1.5 rounded-lg bg-white/10">
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
                  className="w-24 h-28 rounded-xl object-cover object-top shrink-0"
                />
                <div className="space-y-1">
                  <h3 className="text-xl font-bold text-white">{quickPeekProfile.rawName}</h3>
                  <p className="text-xs text-gray-300">
                    {quickPeekProfile.cleanCity} · Kanton {quickPeekProfile.canton}
                  </p>
                  <p className="text-xs text-[#C6A574] font-semibold">
                    Richtwert: CHF {quickPeekProfile.advertisedBaseChf || 350} / 1h
                  </p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#14171E] border border-white/10 text-xs space-y-1 text-gray-300">
                <div>• <strong>Status:</strong> {quickPeekProfile.availabilityConfirmed ? "Jetzt verfügbar (bestätigt)" : "Neutral"}</div>
                <div>• <strong>Prüfung:</strong> {quickPeekProfile.isIdentityVerified ? "Identität geprüft" : "Noch nicht durch uns geprüft"}</div>
                <div>• <strong>Herkunft:</strong> {quickPeekProfile.isSelfManaged ? "Selbst verwaltet" : `Externer Eintrag (${quickPeekProfile.sourcePortal || "Verzeichnis"})`}</div>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {(quickPeekProfile.includedTags || ["Einzelprofil"]).map((t: string, i: number) => (
                  <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200">
                    {t}
                  </span>
                ))}
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t border-white/10">
              {quickPeekProfile.rawPhone && (
                <a
                  href={`tel:${quickPeekProfile.rawPhone}`}
                  onClick={() => recordEvent(quickPeekProfile.id, "track_contact")}
                  className="w-full py-3 rounded-xl bg-emerald-500 text-black font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Phone size={14} />
                  <span>Kontakt: {quickPeekProfile.rawPhone}</span>
                </a>
              )}
              <Link
                href={`/profile/${encodeURIComponent(quickPeekProfile.id)}`}
                className="w-full py-3 rounded-xl bg-[#C6A574] text-[#171A20] font-bold text-xs block text-center"
              >
                Vollständiges Profil öffnen →
              </Link>
              <div className="flex justify-between text-[11px] text-gray-400 pt-2">
                <Link
                  href={`/create-post?claim=${encodeURIComponent(quickPeekProfile.rawName || "")}&id=${encodeURIComponent(quickPeekProfile.id)}`}
                  className="text-[#C6A574] hover:underline"
                >
                  Ist das dein Profil? Übernehmen
                </Link>
                <Link
                  href={`/report?name=${encodeURIComponent(quickPeekProfile.rawName || "")}&id=${encodeURIComponent(quickPeekProfile.id)}`}
                  className="hover:text-white"
                >
                  Profil melden / entfernen
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* UNIQUE FEATURE 3: FLOATING MERKLISTE & DIREKT-VERGLEICH (🔖)          */}
      {/* ===================================================================== */}
      {savedProfiles.length > 0 && (
        <div className="fixed bottom-16 md:bottom-4 inset-x-0 z-50 px-4 pointer-events-none text-white">
          <div className="max-w-2xl mx-auto p-3 rounded-2xl bg-[#1E222B]/95 backdrop-blur-xl border border-[#C6A574] shadow-2xl flex items-center justify-between gap-3 pointer-events-auto">
            <div className="flex items-center gap-2 overflow-x-auto text-xs">
              <span className="font-bold text-[#C6A574] shrink-0">
                🔖 Merkliste ({savedProfiles.length}/3):
              </span>
              {savedProfiles.map((sp: any) => (
                <span key={sp.id} className="px-2.5 py-1 rounded-lg bg-black/40 border border-white/10 truncate max-w-[110px]">
                  {sp.rawName}
                </span>
              ))}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setCompareOpen(true)}
                className="px-3.5 py-1.5 rounded-xl bg-[#C6A574] text-[#171A20] font-bold text-xs cursor-pointer"
              >
                Vergleichen →
              </button>
              <button onClick={() => setSavedIds([])} className="text-xs text-gray-400 hover:text-white px-1">
                ✕
              </button>
            </div>
          </div>
        </div>
      )}

      {compareOpen && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-white">
          <div className="max-w-4xl w-full rounded-2xl bg-[#1E222B] border border-[#C6A574] p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold">Direkt-Vergleich deiner gemerkten Profile</h3>
              <button onClick={() => setCompareOpen(false)} className="p-1.5 rounded-lg bg-white/10">
                <X size={16} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {savedProfiles.map((sp: any) => (
                <div key={sp.id} className="p-4 rounded-xl bg-[#14171E] border border-white/10 space-y-2.5">
                  <img
                    src={sp.thumbnail || sp.fallbackImg}
                    alt={sp.rawName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = sp.fallbackImg;
                    }}
                    className="w-full h-44 object-cover object-top rounded-lg"
                  />
                  <div className="text-base font-bold text-white">{sp.rawName}</div>
                  <div className="text-gray-300 space-y-1">
                    <div>Ort: {sp.cleanCity} · {sp.canton}</div>
                    <div>Richtwert: <strong className="text-[#C6A574]">CHF {sp.advertisedBaseChf} / 1h</strong></div>
                    <div>Status: {sp.availabilityConfirmed ? "Jetzt verfügbar" : "Standard"}</div>
                    <div>Herkunft: {sp.isSelfManaged ? "Selbst verwaltet" : sp.sourcePortal || "Verzeichnis"}</div>
                  </div>
                  <Link
                    href={`/profile/${encodeURIComponent(sp.id)}`}
                    className="w-full py-2 rounded-lg bg-[#C6A574] text-[#171A20] font-bold text-center block"
                  >
                    Profil öffnen →
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