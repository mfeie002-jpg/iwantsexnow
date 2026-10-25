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
} from "lucide-react";

export type ConceptId = "1" | "2" | "3" | "4" | "5";

interface ConceptConfig {
  id: ConceptId;
  shortTitle: string;
  mobileTitle: string;
  fullTitle: string;
  pageBg: string;
  ambientGlowLeft: string;
  ambientGlowRight: string;
  cardStyle: string;
  accentBadge: string;
  buttonPrimary: string;
  dividerLabel: string;
}

const CONCEPTS: Record<ConceptId, ConceptConfig> = {
  "1": {
    id: "1",
    shortTitle: "1. Katalog-Sofortstart",
    mobileTitle: "1. Katalog",
    fullTitle: "Option 1: Photos First – Der direkte Schweizer Katalog",
    pageBg: "bg-[#090A0F]",
    ambientGlowLeft: "bg-[#C8A97E]/10",
    ambientGlowRight: "bg-sky-500/5",
    cardStyle: "bg-[#11131C] border-white/10 hover:border-[#C8A97E]/60 rounded-xl",
    accentBadge: "bg-[#C8A97E] text-[#090A0F]",
    buttonPrimary: "bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F]",
    dividerLabel: "SWISS DIRECT INDEX · CURATED SELECTION",
  },
  "2": {
    id: "2",
    shortTitle: "2. 2-Schritte-Concierge",
    mobileTitle: "2. Concierge",
    fullTitle: "Option 2: Der geführte 2-Schritte-Concierge",
    pageBg: "bg-[#0B0E17]",
    ambientGlowLeft: "bg-[#C8A97E]/15",
    ambientGlowRight: "bg-emerald-500/10",
    cardStyle: "bg-[#131826]/95 border-[#C8A97E]/25 hover:border-[#C8A97E] rounded-2xl shadow-xl",
    accentBadge: "bg-gradient-to-r from-[#C8A97E] to-[#E5C99B] text-[#090A0F]",
    buttonPrimary: "bg-gradient-to-r from-[#C8A97E] to-[#E5C99B] text-[#090A0F]",
    dividerLabel: "PERSONAL SWISS CONCIERGE · VERIFIED DISCOVERY",
  },
  "3": {
    id: "3",
    shortTitle: "3. Die 3 Haupt-Türen",
    mobileTitle: "3. 3-Türen",
    fullTitle: "Option 3: Die 3 klaren Haupt-Türen (Models · Clubs · Test)",
    pageBg: "bg-[#080A0F]",
    ambientGlowLeft: "bg-sky-500/10",
    ambientGlowRight: "bg-[#C8A97E]/12",
    cardStyle: "bg-[#10131C] border-white/15 hover:border-white/40 rounded-xl",
    accentBadge: "bg-white text-[#090A0F]",
    buttonPrimary: "bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F]",
    dividerLabel: "TRANSPARENT SWISS MARKETPLACE · 3 PILLARS",
  },
  "4": {
    id: "4",
    shortTitle: "4. Editorial Spotlight",
    mobileTitle: "4. Spotlight",
    fullTitle: "Option 4: Editorial Luxury Magazine (BeMyGirl / Boutique-Stil)",
    pageBg: "bg-[#11090E]",
    ambientGlowLeft: "bg-rose-500/15",
    ambientGlowRight: "bg-[#C8A97E]/20",
    cardStyle: "bg-gradient-to-b from-[#1B1017] to-[#120A0F] border-[#C8A97E]/30 hover:border-[#C8A97E] rounded-2xl shadow-xl",
    accentBadge: "bg-gradient-to-r from-[#C8A97E] via-[#F1DCA7] to-[#C8A97E] text-[#11090E]",
    buttonPrimary: "bg-gradient-to-r from-[#C8A97E] via-[#E8CE9D] to-[#C8A97E] text-[#11090E]",
    dividerLabel: "EDITION SUISSE · PRIVATE PORTFOLIO",
  },
  "5": {
    id: "5",
    shortTitle: "5. Live-Pulse Radar",
    mobileTitle: "5. Live-Radar",
    fullTitle: "Option 5: Live-Pulse & Visuelles Entdecker-Radar",
    pageBg: "bg-[#090D12]",
    ambientGlowLeft: "bg-emerald-500/12",
    ambientGlowRight: "bg-[#C8A97E]/15",
    cardStyle: "bg-[#111722] border-emerald-500/20 hover:border-[#C8A97E]/70 rounded-2xl",
    accentBadge: "bg-emerald-400 text-[#090A0F]",
    buttonPrimary: "bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F]",
    dividerLabel: "REAL-TIME SWISS RADAR · VERIFIED STATUS",
  },
};

const CORE_CATEGORIES = [
  {
    id: "all",
    label: "Alle Models",
    sub: "Komplett",
    queryTag: "",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "gfe",
    label: "Girlfriend (GFE)",
    sub: "Zärtlich & Privat",
    queryTag: "GFE",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "massage",
    label: "Erotik-Massage",
    sub: "Tantra & B2B",
    queryTag: "Massage",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "outcall",
    label: "Hotel & Outcall",
    sub: "Diskreter Besuch",
    queryTag: "Outcall",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "latina",
    label: "Latina & Curves",
    sub: "Temperament",
    queryTag: "Latina",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "domina",
    label: "Domina & BDSM",
    sub: "Fetisch & Studio",
    queryTag: "Domina",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=500&q=80",
  },
];

const QUICK_CANTONS = [
  { code: "ALL", name: "🇨🇭 Alle", full: "Ganze Schweiz", sub: "Alle Regionen" },
  { code: "ZH", name: "Zürich", full: "Zürich", sub: "City & See" },
  { code: "ZG", name: "Zug & Cham", full: "Zug & Cham", sub: "Baar & ZG" },
  { code: "BS", name: "Basel", full: "Basel", sub: "BS & BL" },
  { code: "BE", name: "Bern", full: "Bern", sub: "City & BE" },
  { code: "LU", name: "Luzern", full: "Luzern", sub: "Zentralschweiz" },
  { code: "AG", name: "Aargau", full: "Aargau", sub: "Baden & Aarau" },
  { code: "SG", name: "St. Gallen", full: "St. Gallen", sub: "Ostschweiz" },
  { code: "GE", name: "Genève", full: "Genève", sub: "Romandie" },
  { code: "VD", name: "Lausanne", full: "Lausanne", sub: "Vaud" },
];

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

function ArchitecturalDivider({ label }: { label: string }) {
  return (
    <div className="my-7 sm:my-10 flex items-center gap-2 sm:gap-4 select-none">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C8A97E]/40 to-[#C8A97E]/10" />
      <div className="flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-[#11131C]/90 border border-[#C8A97E]/30 shadow-lg shrink-0">
        <StencilSerifX color="#C8A97E" className="w-3.5 h-3 sm:w-4 sm:h-3.5" />
        <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.16em] sm:tracking-[0.22em] text-[#C8A97E]">
          {label}
        </span>
      </div>
      <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-[#C8A97E]/40 to-[#C8A97E]/10" />
    </div>
  );
}

export default function HomePage() {
  const [concept, setConcept] = useState<ConceptId>("1");
  const [activeVisualId, setActiveVisualId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCanton, setActiveCanton] = useState<string>("ALL");
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

  const cfg = CONCEPTS[concept];
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

      const isSelfManaged = Boolean(st.claimed || item.bookingMode === "direct");
      const isIdentityVerified = Boolean(st.identityVerified);
      const availabilityConfirmed = Boolean(st.availabilityConfirmed);
      const isSponsored = Boolean(st.sponsored);

      if (!st.hidden && !st.paused) {
        uniqueList.push({
          ...item,
          id,
          rawName: st.displayName || item.rawName,
          city: st.city || item.city,
          canton: st.canton || item.canton,
          advertisedBaseChf: st.rate60Chf || item.advertisedBaseChf,
          isSelfManaged,
          isIdentityVerified,
          availabilityConfirmed,
          isSponsored,
          realViews: mt.views || 0,
          realDetailOpens: mt.detailOpens || 0,
          fallbackImg: FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length],
        });
      }
    }
    return uniqueList;
  }, [serverData, vaultExtraProfiles]);

  const filteredProfiles = useMemo(() => {
    return enrichedProfiles.filter((p: any) => {
      if (activeCanton !== "ALL" && String(p.canton || "").toUpperCase() !== activeCanton) {
        return false;
      }
      if (onlyConfirmedAvailable && !p.availabilityConfirmed) return false;
      if (onlySelfManaged && !p.isSelfManaged) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = `${p.rawName || ""} ${p.city || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enrichedProfiles, activeCanton, onlyConfirmedAvailable, onlySelfManaged, searchQuery]);

  const selectCategory = (id: string, tag: string) => {
    setActiveVisualId(id);
    setSearchQuery(tag);
  };

  const resetFilters = () => {
    setActiveCanton("ALL");
    setActiveVisualId("all");
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

  // Mobile-Perfected Profile Card Component (Used consistently across the grid)
  const renderProfileCard = (p: any, idx: number, keyPrefix: string) => {
    const cleanName =
      String(p.rawName || "Profil")
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 22) || "Profil";
    const city = String(p.city || "Zürich").split("/")[0].trim();
    const rate = p.advertisedBaseChf || null;
    const img = p.thumbnail || p.fallbackImg;

    return (
      <article
        key={`${keyPrefix}-${p.id}-${idx}`}
        className={`group overflow-hidden border transition-all duration-300 flex flex-col justify-between ${cfg.cardStyle}`}
      >
        <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07080C]">
          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
          >
            <img
              src={img}
              alt={`${cleanName} – ${city}`}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = p.fallbackImg;
              }}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              loading="lazy"
            />
          </Link>
          <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-black/30 pointer-events-none" />

          {concept === "4" && (
            <div className="pointer-events-none absolute inset-1.5 sm:inset-2 border border-[#C8A97E]/25 rounded-xl" />
          )}

          {/* Top-Left: Compact Status / Source Badge */}
          <div className="absolute top-2 left-2 flex flex-col gap-1 max-w-[62%]">
            {p.availabilityConfirmed ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 border border-emerald-500/50 text-emerald-300 text-[10px] font-bold truncate">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
                Verfügbar
              </span>
            ) : (
              <span className="inline-flex items-center px-1.5 py-0.5 rounded bg-black/75 text-gray-300 text-[9px] sm:text-[10px] border border-white/10 truncate">
                {p.sourcePortal || "Index"}
              </span>
            )}
            {p.isSponsored && (
              <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase w-fit ${cfg.accentBadge}`}>
                Anzeige
              </span>
            )}
          </div>

          {/* Top-Right: Rate Pill or Verification Check (Frees up 100% bottom width on mobile!) */}
          <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
            {rate && (
              <span className="px-2 py-0.5 rounded bg-black/85 backdrop-blur border border-[#C8A97E]/40 text-[10px] sm:text-xs font-extrabold text-[#C8A97E]">
                CHF {rate}
              </span>
            )}
            {p.isIdentityVerified && (
              <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-black/85 border border-[#C8A97E]/60 text-[#E5C99B] text-[9px] font-semibold">
                <Check size={10} className="text-[#C8A97E]" /> Geprüft
              </span>
            )}
          </div>

          {/* Bottom Photo Overlay: Full 100% width for Name + Location (Never squished on mobile!) */}
          <div className="absolute bottom-2 left-2.5 right-2.5">
            <h2 className="text-sm sm:text-base font-serif font-bold text-white leading-tight truncate drop-shadow">
              {cleanName}
            </h2>
            <p className="text-[11px] text-gray-300 flex items-center gap-1 truncate mt-0.5">
              <MapPin size={11} className="text-[#C8A97E] shrink-0" />
              <span className="truncate">
                {city} ({p.canton || "CH"})
              </span>
            </p>
          </div>
        </div>

        {/* Thumb-Friendly Card Action Footer */}
        <div className="p-2 sm:p-3 flex items-center gap-1.5">
          <Link
            href={`/profile/${encodeURIComponent(p.id)}`}
            onClick={() => recordEvent(p.id, "track_click")}
            className={`flex-1 py-2 sm:py-2.5 rounded-lg font-bold text-[11px] sm:text-xs text-center transition ${cfg.buttonPrimary}`}
          >
            Profil öffnen
          </Link>
          {!p.isSelfManaged && (
            <button
              type="button"
              onClick={() => {
                recordEvent(p.id, "track_click");
                setSelectedIndexProfile(p);
              }}
              aria-label="Quellenangabe & Info"
              className="p-2 sm:p-2.5 rounded-lg bg-white/5 hover:bg-white/10 active:bg-white/15 border border-white/10 text-gray-300 cursor-pointer shrink-0"
            >
              <Info size={14} />
            </button>
          )}
        </div>
      </article>
    );
  };

  return (
    <div className={`min-h-screen ${cfg.pageBg} text-white pb-24 lg:pb-16 relative overflow-x-hidden transition-colors duration-500`}>
      <SEO
        title="iwantsexnow.ch | Escorts, Studios & Plattformvergleich Schweiz"
        description="Entdecke Escorts und Studios in Zürich, Zug, Basel, Bern & Genf ohne Registrierungspflicht. Mit transparenten Quellenangaben und Schweizer Portalvergleich."
      />

      <div className={`pointer-events-none fixed top-20 -left-32 w-[420px] h-[420px] rounded-full ${cfg.ambientGlowLeft} blur-[140px]`} />
      <div className={`pointer-events-none fixed bottom-10 -right-32 w-[420px] h-[420px] rounded-full ${cfg.ambientGlowRight} blur-[140px]`} />

      {/* SINGLE-LINE HORIZONTAL SWIPE CONCEPT SWITCHER (Does NOT block mobile screen height!) */}
      <div className="bg-[#121521] border-b border-[#C8A97E]/35 py-1.5 px-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2 overflow-x-auto scrollbar-hide">
          <span className="px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] font-extrabold uppercase text-[9px] shrink-0">
            Ansicht wählen:
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            {(["1", "2", "3", "4", "5"] as ConceptId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setConcept(id)}
                className={`px-2.5 sm:px-3 py-1 rounded-lg text-[11px] sm:text-xs font-bold transition whitespace-nowrap cursor-pointer ${
                  concept === id
                    ? "bg-[#C8A97E] text-[#090A0F] shadow"
                    : "bg-black/40 text-gray-300 border border-white/10 hover:text-white"
                }`}
              >
                <span className="sm:hidden">{CONCEPTS[id].mobileTitle}</span>
                <span className="hidden sm:inline">{CONCEPTS[id].shortTitle}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <LuxuryHeader />

      {/* ===================================================================== */}
      {/* CONCEPT 1 HERO: "KATALOG-SOFORTSTART" (Mobile Horizontal Swipe!)      */}
      {/* ===================================================================== */}
      {concept === "1" && (
        <section className="border-b border-white/10 bg-[#0B0D14]">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 pb-3 space-y-2.5">
            {/* Row 1: Search Input (16px on mobile to prevent iOS zoom!) + Region Swipe */}
            <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide snap-x">
                {QUICK_CANTONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setActiveCanton(c.code)}
                    className={`snap-start px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                      activeCanton === c.code
                        ? "bg-[#C8A97E] text-[#090A0F] font-extrabold"
                        : "bg-[#121520] text-gray-300 border border-white/10"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <div className="flex items-center bg-[#121520] border border-white/15 focus-within:border-[#C8A97E] rounded-xl px-3 py-1.5 flex-1 lg:w-64">
                  <Search size={15} className="text-[#C8A97E] shrink-0" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, Ort oder Vorliebe..."
                    className="w-full px-2 bg-transparent text-base sm:text-xs text-white placeholder-gray-400 focus:outline-none"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} className="text-xs text-gray-400 px-1">
                      ✕
                    </button>
                  )}
                </div>
                {(activeCanton !== "ALL" || searchQuery || onlyConfirmedAvailable || onlySelfManaged) && (
                  <button
                    onClick={resetFilters}
                    className="p-2 rounded-xl bg-white/10 text-[#C8A97E] shrink-0"
                    title="Filter zurücksetzen"
                  >
                    <RotateCcw size={15} />
                  </button>
                )}
              </div>
            </div>

            {/* Row 2: Horizontal Swipe Category Cards on Mobile, 6-Grid on Desktop */}
            <div className="flex sm:grid sm:grid-cols-6 gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide snap-x">
              {CORE_CATEGORIES.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => selectCategory(card.id, card.queryTag)}
                  className={`snap-start shrink-0 w-28 sm:w-auto relative h-16 sm:h-20 rounded-xl overflow-hidden border text-left transition cursor-pointer ${
                    activeVisualId === card.id
                      ? "border-[#C8A97E] ring-2 ring-[#C8A97E]/40"
                      : "border-white/10 hover:border-[#C8A97E]/60"
                  }`}
                >
                  <img src={card.image} alt={card.label} className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent" />
                  <div className="absolute bottom-1.5 left-2 right-1.5">
                    <div className="text-[11px] sm:text-xs font-bold text-white leading-tight truncate">
                      {card.label}
                    </div>
                    <div className="text-[9px] text-gray-300 truncate hidden sm:block">{card.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* CONCEPT 2 HERO: "DER 2-SCHRITTE-CONCIERGE" (Compact on Mobile)        */}
      {/* ===================================================================== */}
      {concept === "2" && (
        <section className="border-b border-[#C8A97E]/25 py-4 sm:py-7 px-3 sm:px-4">
          <div className="max-w-5xl mx-auto rounded-2xl sm:rounded-3xl bg-[#131826]/95 border border-[#C8A97E]/45 p-4 sm:p-7 shadow-2xl space-y-4 sm:space-y-5">
            <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#C8A97E]">
                  SCHWEIZER VIP-CONCIERGE
                </div>
                <h1 className="text-lg sm:text-3xl font-serif font-bold text-white">
                  In 2 Klicks zur passenden Auswahl
                </h1>
              </div>
              <button
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-[11px] text-[#C8A97E] font-semibold cursor-pointer shrink-0"
              >
                Reset
              </button>
            </div>

            {/* Step 1: Horizontal Swipe on Mobile, 5-Grid on Desktop */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#C8A97E] text-[#090A0F] font-extrabold inline-flex items-center justify-center text-[10px]">
                  1
                </span>
                <span>Stadt oder Region wählen:</span>
              </div>
              <div className="flex sm:grid sm:grid-cols-5 gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide snap-x">
                {QUICK_CANTONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setActiveCanton(c.code)}
                    className={`snap-start shrink-0 w-28 sm:w-auto p-2.5 rounded-xl border text-left transition cursor-pointer ${
                      activeCanton === c.code
                        ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E] font-bold"
                        : "bg-[#0B0E17] border-white/10 text-white"
                    }`}
                  >
                    <div className="text-xs font-bold truncate">{c.full}</div>
                    <div className={`text-[10px] truncate ${activeCanton === c.code ? "text-[#090A0F]/80" : "text-gray-400"}`}>
                      {c.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Horizontal Swipe on Mobile, 6-Grid on Desktop */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-gray-200 flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-[#C8A97E] text-[#090A0F] font-extrabold inline-flex items-center justify-center text-[10px]">
                  2
                </span>
                <span>Kategorie antippen:</span>
              </div>
              <div className="flex sm:grid sm:grid-cols-6 gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide snap-x">
                {CORE_CATEGORIES.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => selectCategory(card.id, card.queryTag)}
                    className={`snap-start shrink-0 w-28 sm:w-auto relative h-20 rounded-xl overflow-hidden border text-left transition cursor-pointer ${
                      activeVisualId === card.id
                        ? "border-[#C8A97E] ring-2 ring-[#C8A97E]"
                        : "border-white/15"
                    }`}
                  >
                    <img src={card.image} alt={card.label} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                    <div className="absolute bottom-1.5 left-2 right-1.5">
                      <div className="text-[11px] font-bold text-white truncate">{card.label}</div>
                      <div className="text-[9px] text-[#E5C99B] truncate">{card.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* CONCEPT 3 HERO: "DIE 3 HAUPT-TÜREN" (Swipeable Cards on Mobile)       */}
      {/* ===================================================================== */}
      {concept === "3" && (
        <section className="border-b border-white/10 py-4 sm:py-6 px-3 sm:px-4 bg-[#0B0D14]">
          <div className="max-w-7xl mx-auto space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {/* Door 1 */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-[#161B29] to-[#10131C] border-2 border-[#C8A97E] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] text-[10px] font-extrabold uppercase">
                    01 · Escorts & Models
                  </span>
                  <Sparkles size={16} className="text-[#C8A97E]" />
                </div>
                <h2 className="text-base sm:text-lg font-serif font-bold text-white">
                  Profile direkt nach Region filtern
                </h2>
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                  {["ALL", "ZH", "ZG", "BS", "BE", "LU", "GE"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCanton(c)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 cursor-pointer ${
                        activeCanton === c ? "bg-[#C8A97E] text-black" : "bg-white/10 text-white"
                      }`}
                    >
                      {c === "ALL" ? "Alle" : c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Door 2 & 3 side-by-side on mobile */}
              <div className="grid grid-cols-2 md:grid-cols-2 md:col-span-2 gap-3">
                <Link
                  href="/rankings"
                  className="p-4 sm:p-5 rounded-2xl bg-[#11131C] border border-white/15 hover:border-[#C8A97E] transition flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[#C8A97E] text-[9px] sm:text-[10px] font-bold uppercase inline-block">
                      02 · Clubs ({totalClubsCount})
                    </span>
                    <h2 className="text-sm sm:text-lg font-serif font-bold text-white group-hover:text-[#C8A97E]">
                      Schweizer Clubs & Studios
                    </h2>
                    <p className="text-[11px] text-gray-400 hidden sm:block">
                      Laufhäuser, FKK-Clubs & Kontaktbars nach Kanton.
                    </p>
                  </div>
                  <div className="text-[11px] font-bold text-[#C8A97E] flex items-center justify-between pt-2 mt-2 border-t border-white/10">
                    <span>Öffnen</span>
                    <ArrowUpRight size={14} />
                  </div>
                </Link>

                <Link
                  href="/reviews"
                  className="p-4 sm:p-5 rounded-2xl bg-[#11131C] border border-white/15 hover:border-[#C8A97E] transition flex flex-col justify-between group"
                >
                  <div className="space-y-1.5">
                    <span className="px-2 py-0.5 rounded bg-white/10 text-emerald-300 text-[9px] sm:text-[10px] font-bold uppercase inline-block">
                      03 · Portal-Test
                    </span>
                    <h2 className="text-sm sm:text-lg font-serif font-bold text-white group-hover:text-[#C8A97E]">
                      Xdate, Fgirl & Co. im Test
                    </h2>
                    <p className="text-[11px] text-gray-400 hidden sm:block">
                      Sachliche Einzelberichte zu Kosten & Funktionen.
                    </p>
                  </div>
                  <div className="text-[11px] font-bold text-emerald-300 flex items-center justify-between pt-2 mt-2 border-t border-white/10">
                    <span>Vergleich</span>
                    <ArrowUpRight size={14} />
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* CONCEPT 4 HERO: "EDITORIAL VOGUE SPOTLIGHT"                           */}
      {/* ===================================================================== */}
      {concept === "4" && (
        <section className="relative border-b border-[#C8A97E]/30 overflow-hidden py-5 sm:py-7 px-3 sm:px-4">
          <div className="relative z-10 max-w-7xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#C8A97E]/30 pb-3">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A97E]">
                  SWISS HIGH-CLASS PORTFOLIO
                </div>
                <h1 className="text-xl sm:text-4xl font-serif font-bold text-white mt-0.5">
                  Exklusive Begleitung & <span className="italic font-normal text-[#E8CE9D]">Spotlight</span>
                </h1>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-hide">
                {QUICK_CANTONS.slice(0, 7).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setActiveCanton(c.code)}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold border shrink-0 cursor-pointer ${
                      activeCanton === c.code
                        ? "bg-[#C8A97E] text-[#11090E] border-[#C8A97E]"
                        : "bg-black/50 text-gray-200 border-[#C8A97E]/30"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Horizontal Swipe Spotlight on Mobile, 4-Grid on Desktop */}
            <div className="flex lg:grid lg:grid-cols-4 gap-3 overflow-x-auto pb-1 scrollbar-hide snap-x">
              {filteredProfiles.slice(0, 4).map((sp: any, idx: number) => {
                const spName = String(sp.rawName || "Model").slice(0, 20);
                const spCity = String(sp.city || "Zürich").split("/")[0].trim();
                return (
                  <Link
                    key={`spot-${idx}`}
                    href={`/profile/${encodeURIComponent(sp.id)}`}
                    className="snap-start shrink-0 w-56 sm:w-64 lg:w-auto group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#C8A97E]/60 shadow-2xl"
                  >
                    <img
                      src={sp.thumbnail || sp.fallbackImg}
                      alt={spName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = sp.fallbackImg;
                      }}
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#11090E] via-transparent to-black/30" />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full bg-[#C8A97E] text-[#11090E] text-[9px] font-extrabold uppercase">
                      Spotlight #{idx + 1}
                    </div>
                    <div className="absolute bottom-3 left-3 right-3">
                      <div className="text-base font-serif font-bold text-white truncate">{spName}</div>
                      <div className="text-xs text-[#E8CE9D] flex items-center justify-between mt-0.5">
                        <span className="truncate">{spCity}</span>
                        <span className="font-bold shrink-0">CHF {sp.advertisedBaseChf || 400}</span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* CONCEPT 5 HERO: "LIVE-PULSE RADAR"                                    */}
      {/* ===================================================================== */}
      {concept === "5" && (
        <section className="border-b border-emerald-500/20 bg-[#0B1017] py-3.5 px-3 sm:px-4">
          <div className="max-w-7xl mx-auto space-y-3">
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-hide">
              <div className="shrink-0 pr-2 border-r border-white/10">
                <div className="text-[10px] font-bold uppercase text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Radar</span>
                </div>
              </div>
              {filteredProfiles.slice(0, 12).map((rp: any, i: number) => (
                <Link
                  key={`radar-${i}`}
                  href={`/profile/${encodeURIComponent(rp.id)}`}
                  className="shrink-0 flex items-center gap-2 p-1 pr-2.5 rounded-full bg-[#111722] border border-white/10 hover:border-[#C8A97E]"
                >
                  <img
                    src={rp.thumbnail || rp.fallbackImg}
                    alt={rp.rawName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = rp.fallbackImg;
                    }}
                    className="w-8 h-8 rounded-full object-cover object-top border border-[#C8A97E]"
                  />
                  <div className="text-[11px] font-bold text-white max-w-[75px] truncate">{rp.rawName}</div>
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-hide">
              {QUICK_CANTONS.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setActiveCanton(c.code)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold shrink-0 cursor-pointer ${
                    activeCanton === c.code
                      ? "bg-emerald-400 text-[#090A0F]"
                      : "bg-[#111722] text-gray-300 border border-white/10"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* MAIN CATALOGUE (Mobile-Optimized 2-Column Grid)                       */}
      {/* ===================================================================== */}
      <main className="relative z-10 max-w-7xl mx-auto px-3 sm:px-4 pt-4 pb-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-3.5 pb-2.5 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
            <StencilSerifX color="#C8A97E" className="w-3.5 h-3 shrink-0" />
            <span className="font-bold text-white">
              {activeCanton === "ALL" ? "Schweiz" : `Region ${activeCanton}`}
            </span>
            <span className="text-xs text-[#C8A97E]">({filteredProfiles.length} Profile)</span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px]">
            <button
              type="button"
              onClick={() => setOnlyConfirmedAvailable(!onlyConfirmedAvailable)}
              className={`px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                onlyConfirmedAvailable
                  ? "bg-emerald-500 text-black border-emerald-400 font-bold"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}
            >
              ● Verfügbar
            </button>
            <button
              type="button"
              onClick={() => setOnlySelfManaged(!onlySelfManaged)}
              className={`px-2.5 py-1 rounded-lg border cursor-pointer transition ${
                onlySelfManaged
                  ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E] font-bold"
                  : "bg-white/5 border-white/10 text-gray-300"
              }`}
            >
              ✓ Geprüft
            </button>
          </div>
        </div>

        {/* First 12 Profile Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {filteredProfiles.slice(0, 12).map((p: any, idx: number) => renderProfileCard(p, idx, "b1"))}
        </div>

        {/* Recurring Design Element: Architectural Divider + Mid-Stream Banner */}
        <ArchitecturalDivider label={cfg.dividerLabel} />

        <div className="my-6 p-4 sm:p-6 rounded-2xl bg-gradient-to-r from-[#121521] via-[#171B2B] to-[#121521] border border-[#C8A97E]/35 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
          <div className="lg:col-span-7 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <ShieldCheck size={13} />
              <span>TRANSPARENTER SCHWEIZER VERGLEICH</span>
            </div>
            <h3 className="text-base sm:text-xl font-serif font-bold text-white">
              Portale vergleichen & eigenes Profil kostenlos kontrollieren
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Lies unsere sachlichen Prüfberichte zu Xdate, Fgirl & And6 oder verwalte deinen eigenen Eintrag kostenlos.
            </p>
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-2">
            <Link
              href="/reviews"
              className="py-2.5 px-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-center text-white"
            >
              Portal-Test →
            </Link>
            <Link
              href="/advertise"
              className={`py-2.5 px-3 rounded-xl text-xs font-bold text-center ${cfg.buttonPrimary}`}
            >
              Für Models →
            </Link>
          </div>
        </div>

        {/* Remaining Profile Cards */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-5">
          {filteredProfiles.slice(12, visibleCount).map((p: any, idx: number) => renderProfileCard(p, idx, "b2"))}
        </div>

        <div className="text-center mt-7 flex flex-wrap justify-center gap-2.5">
          <button
            type="button"
            onClick={loadMoreFromServerVault}
            disabled={loadingVault}
            className={`px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg ${cfg.buttonPrimary}`}
          >
            {loadingVault ? "Lädt..." : "Weitere Profile laden"}
          </button>
          <Link
            href="/search"
            className="px-5 py-3 rounded-xl border border-white/15 bg-white/5 text-xs font-bold text-gray-200"
          >
            Alle Filter öffnen →
          </Link>
        </div>

        <ArchitecturalDivider label="REGIONEN, CLUBS & PORTAL-TESTS" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4">
          <Link href="/reviews" className={`p-4 sm:p-5 border transition group ${cfg.cardStyle}`}>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <Scale size={14} />
              <span>01 · Redaktioneller Vergleich</span>
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1 flex items-center justify-between">
              <span>Xdate, Fgirl & Co. im Test</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Einzelberichte zu Funktionen, Kosten und Prüfverfahren.
            </p>
          </Link>

          <Link href="/rankings" className={`p-4 sm:p-5 border transition group ${cfg.cardStyle}`}>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <Building2 size={14} />
              <span>02 · Stationäre Adressen</span>
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1 flex items-center justify-between">
              <span>{totalClubsCount} Schweizer Clubs & Studios</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Laufhäuser, FKK-Clubs und Studios nach Kanton.
            </p>
          </Link>

          <Link href="/advertise" className={`p-4 sm:p-5 border transition group ${cfg.cardStyle}`}>
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <UserCheck size={14} />
              <span>03 · Für Anbieterinnen</span>
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1 flex items-center justify-between">
              <span>Profil kostenlos verwalten</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1">
              Eintrag übernehmen, korrigieren oder kostenlos entfernen.
            </p>
          </Link>
        </div>
      </main>

      {selectedIndexProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#11131C] border border-[#C8A97E]/50 p-5 sm:p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                Quellenangabe · {selectedIndexProfile.sourcePortal || "Index"}
              </span>
              <button
                onClick={() => setSelectedIndexProfile(null)}
                className="text-gray-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>
            <h3 className="text-lg sm:text-xl font-serif font-bold text-white">
              {selectedIndexProfile.rawName} ({selectedIndexProfile.city || "Schweiz"})
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