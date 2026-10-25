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
  SlidersHorizontal,
  ShieldCheck,
  Compass,
  Layers,
  RotateCcw,
  Eye,
} from "lucide-react";

export type ConceptId = "1" | "2" | "3" | "4" | "5";

interface ConceptConfig {
  id: ConceptId;
  shortTitle: string;
  fullTitle: string;
  subtitle: string;
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
    fullTitle: "Option 1: Photos First – Der direkte Schweizer Katalog",
    subtitle: "Wie Fgirl & Xdate Pro: 1 schlanke Leiste oben, sofort grosse 3:4 Porträts ohne Umwege.",
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
    fullTitle: "Option 2: Der geführte 2-Schritte-Concierge",
    subtitle: "Kein Suchstress: Schritt 1 Region anklicken -> Schritt 2 Erlebnis wählen -> Passende Treffer.",
    pageBg: "bg-[#0B0E17]",
    ambientGlowLeft: "bg-[#C8A97E]/15",
    ambientGlowRight: "bg-emerald-500/10",
    cardStyle: "bg-[#131826]/90 backdrop-blur-xl border-[#C8A97E]/25 hover:border-[#C8A97E] rounded-2xl shadow-xl",
    accentBadge: "bg-gradient-to-r from-[#C8A97E] to-[#E5C99B] text-[#090A0F]",
    buttonPrimary: "bg-gradient-to-r from-[#C8A97E] to-[#E5C99B] text-[#090A0F]",
    dividerLabel: "PERSONAL SWISS CONCIERGE · VERIFIED DISCOVERY",
  },
  "3": {
    id: "3",
    shortTitle: "3. Die 3 Haupt-Türen",
    fullTitle: "Option 3: Die 3 klaren Haupt-Türen (Marktplatz & Vergleich)",
    subtitle: "Jeder Besucher sieht in 1 Sekunde seine Tür: 1. Models finden | 2. 162+ Clubs | 3. Portal-Test.",
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
    fullTitle: "Option 4: Editorial Luxury Magazine (BeMyGirl / Boutique-Stil)",
    subtitle: "Warmes Penthouse-Licht, grosse Spotlight-Porträts oben und edle Magazin-Ornamente.",
    pageBg: "bg-[#11090E]",
    ambientGlowLeft: "bg-rose-500/15",
    ambientGlowRight: "bg-[#C8A97E]/20",
    cardStyle: "bg-gradient-to-b from-[#1B1017] to-[#120A0F] border-[#C8A97E]/30 hover:border-[#C8A97E] rounded-2xl shadow-[0_12px_35px_rgba(0,0,0,0.7)]",
    accentBadge: "bg-gradient-to-r from-[#C8A97E] via-[#F1DCA7] to-[#C8A97E] text-[#11090E]",
    buttonPrimary: "bg-gradient-to-r from-[#C8A97E] via-[#E8CE9D] to-[#C8A97E] text-[#11090E]",
    dividerLabel: "EDITION SUISSE · PRIVATE PORTFOLIO",
  },
  "5": {
    id: "5",
    shortTitle: "5. Live-Pulse Radar",
    fullTitle: "Option 5: Live-Pulse & Visuelles Entdecker-Radar",
    subtitle: "Fokus auf Echtzeit-Aktivität, runde Schnell-Porträts oben und visuelle Vorlieben-Filter.",
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
    sub: "Komplette Auswahl",
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
    sub: "Tantra & Body2Body",
    queryTag: "Massage",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "outcall",
    label: "Hotel & Hausbesuch",
    sub: "Diskreter Outcall",
    queryTag: "Outcall",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "latina",
    label: "Latina & Exotic",
    sub: "Kurvig & Temperament",
    queryTag: "Latina",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80",
  },
  {
    id: "domina",
    label: "Domina & Fetisch",
    sub: "BDSM & Studio",
    queryTag: "Domina",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=500&q=80",
  },
];

const QUICK_CANTONS = [
  { code: "ALL", name: "Ganze Schweiz", sub: "Alle Regionen" },
  { code: "ZH", name: "Zürich", sub: "City, Oerlikon & See" },
  { code: "ZG", name: "Zug & Cham", sub: "Baar & Zentralschweiz" },
  { code: "BS", name: "Basel", sub: "Stadt & Baselland" },
  { code: "BE", name: "Bern", sub: "City & Mittelland" },
  { code: "LU", name: "Luzern", sub: "Zentralschweiz" },
  { code: "AG", name: "Aargau", sub: "Baden, Aarau & Olten" },
  { code: "SG", name: "St. Gallen", sub: "Ostschweiz & Wil" },
  { code: "GE", name: "Genève", sub: "Romandie & Lac" },
  { code: "VD", name: "Lausanne", sub: "Vaud & Riviera" },
];

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

// Wiederkehrendes Designelement: Architektonischer Stencil-X Sektionstrenner
function ArchitecturalDivider({ label }: { label: string }) {
  return (
    <div className="my-10 flex items-center gap-4 select-none">
      <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-[#C8A97E]/40 to-[#C8A97E]/10" />
      <div className="flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#11131C]/90 border border-[#C8A97E]/30 shadow-lg">
        <StencilSerifX color="#C8A97E" className="w-4 h-3.5" />
        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#C8A97E]">{label}</span>
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

  return (
    <div className={`min-h-screen ${cfg.pageBg} text-white pb-24 lg:pb-16 relative overflow-x-hidden transition-colors duration-500`}>
      <SEO
        title="iwantsexnow.ch | Escorts, Studios & Plattformvergleich Schweiz"
        description="Entdecke Escorts und Studios in Zürich, Zug, Basel, Bern & Genf ohne Registrierungspflicht. Mit transparenten Quellenangaben und Schweizer Portalvergleich."
      />

      {/* RECURRING DESIGN ELEMENT 1: Ambient Luxury Light Orbs & Subtle Architectural Grid */}
      <div className={`pointer-events-none fixed top-20 -left-32 w-[500px] h-[500px] rounded-full ${cfg.ambientGlowLeft} blur-[150px] transition-all duration-700`} />
      <div className={`pointer-events-none fixed bottom-10 -right-32 w-[500px] h-[500px] rounded-full ${cfg.ambientGlowRight} blur-[150px] transition-all duration-700`} />

      {/* LIVE CONCEPT SWITCHER BAR (Top Sticky Preview Switcher so you can test all 5 live!) */}
      <div className="bg-gradient-to-r from-[#141722] via-[#1B1F2E] to-[#141722] border-b border-[#C8A97E]/40 py-2 px-4 sticky top-0 z-[60] shadow-xl">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] font-extrabold uppercase text-[10px]">
              Live-Design-Toggler
            </span>
            <span className="text-gray-200 font-semibold hidden sm:inline">{cfg.fullTitle}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {(["1", "2", "3", "4", "5"] as ConceptId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => setConcept(id)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                  concept === id
                    ? "bg-[#C8A97E] text-[#090A0F] shadow-[0_0_15px_rgba(200,169,126,0.5)] scale-[1.03]"
                    : "bg-black/50 text-gray-300 border border-white/10 hover:border-[#C8A97E]/50 hover:text-white"
                }`}
              >
                {CONCEPTS[id].shortTitle}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Header */}
      <LuxuryHeader />

      {/* ===================================================================== */}
      {/* CONCEPT 1 HERO: "KATALOG-SOFORTSTART" (Fgirl / Xdate Pro Style)       */}
      {/* ===================================================================== */}
      {concept === "1" && (
        <section className="relative border-b border-white/10 bg-[#0B0D14]/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 pt-4 pb-4 space-y-3">
            <div className="p-2.5 rounded-2xl bg-[#121520] border border-[#C8A97E]/35 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E] px-2 shrink-0 flex items-center gap-1">
                  <MapPin size={13} />
                  <span>1. Region:</span>
                </span>
                {QUICK_CANTONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setActiveCanton(c.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 cursor-pointer ${
                      activeCanton === c.code
                        ? "bg-[#C8A97E] text-[#090A0F] font-extrabold"
                        : "bg-white/5 text-gray-300 hover:bg-white/10"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center bg-[#090A0F] border border-white/15 rounded-xl px-3 py-1.5 w-full lg:w-64">
                  <Search size={14} className="text-[#C8A97E]" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Name, Ort oder Vorliebe..."
                    className="w-full px-2 bg-transparent text-xs text-white focus:outline-none"
                  />
                </div>
                {(activeCanton !== "ALL" || searchQuery || onlyConfirmedAvailable || onlySelfManaged) && (
                  <button
                    onClick={resetFilters}
                    className="px-3 py-1.5 rounded-xl bg-white/10 text-xs text-[#C8A97E] font-semibold cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {CORE_CATEGORIES.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => selectCategory(card.id, card.queryTag)}
                  className={`group relative h-20 rounded-xl overflow-hidden border text-left transition cursor-pointer ${
                    activeVisualId === card.id
                      ? "border-[#C8A97E] ring-2 ring-[#C8A97E]/40"
                      : "border-white/10 hover:border-[#C8A97E]/60"
                  }`}
                >
                  <img src={card.image} alt={card.label} className="w-full h-full object-cover object-top" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                  <div className="absolute bottom-2 left-2.5 right-2">
                    <div className="text-xs font-bold text-white leading-tight">{card.label}</div>
                    <div className="text-[10px] text-gray-300 truncate hidden sm:block">{card.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* CONCEPT 2 HERO: "DER 2-SCHRITTE-CONCIERGE" (Zero-Overload Assistant)  */}
      {/* ===================================================================== */}
      {concept === "2" && (
        <section className="relative border-b border-[#C8A97E]/25 py-8 px-4">
          <div className="max-w-5xl mx-auto rounded-3xl bg-[#131826]/90 backdrop-blur-2xl border border-[#C8A97E]/45 p-6 sm:p-8 shadow-[0_25px_70px_rgba(0,0,0,0.85)] space-y-6">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#C8A97E]">
                  SCHWEIZER VIP-CONCIERGE · IN 2 KLICKS ZUM ZIEL
                </div>
                <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">
                  Wo und wonach suchst du heute?
                </h1>
              </div>
              <button
                onClick={resetFilters}
                className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-[#C8A97E] font-semibold cursor-pointer"
              >
                Auswahl zurücksetzen
              </button>
            </div>

            {/* Step 1: Big Clickable City Cards */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C8A97E] text-[#090A0F] font-extrabold inline-flex items-center justify-center text-[11px]">
                  1
                </span>
                <span>Wähle deine Stadt oder Region:</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {QUICK_CANTONS.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setActiveCanton(c.code)}
                    className={`p-3 rounded-xl border text-left transition cursor-pointer ${
                      activeCanton === c.code
                        ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E] font-bold shadow-lg"
                        : "bg-[#0B0E17] border-white/10 text-white hover:border-[#C8A97E]/60"
                    }`}
                  >
                    <div className="text-xs sm:text-sm font-bold">{c.name}</div>
                    <div className={`text-[10px] ${activeCanton === c.code ? "text-[#090A0F]/80" : "text-gray-400"}`}>
                      {c.sub}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Big Clickable Experience Cards */}
            <div className="space-y-2.5">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-300 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#C8A97E] text-[#090A0F] font-extrabold inline-flex items-center justify-center text-[11px]">
                  2
                </span>
                <span>Wähle deine gewünschte Kategorie (oder tippe einen Wunsch ein):</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                {CORE_CATEGORIES.map((card) => (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => selectCategory(card.id, card.queryTag)}
                    className={`relative h-24 rounded-xl overflow-hidden border text-left transition cursor-pointer ${
                      activeVisualId === card.id
                        ? "border-[#C8A97E] ring-2 ring-[#C8A97E]"
                        : "border-white/15 hover:border-[#C8A97E]/60"
                    }`}
                  >
                    <img src={card.image} alt={card.label} className="w-full h-full object-cover object-top" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                    <div className="absolute bottom-2 left-2.5 right-2">
                      <div className="text-xs font-bold text-white">{card.label}</div>
                      <div className="text-[10px] text-[#E5C99B]">{card.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* CONCEPT 3 HERO: "DIE 3 KLAREN HAUPT-TÜREN" (Comparis / Portal Style)  */}
      {/* ===================================================================== */}
      {concept === "3" && (
        <section className="relative border-b border-white/10 py-7 px-4 bg-[#0B0D14]">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="text-center max-w-3xl mx-auto space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#C8A97E]">
                SCHWEIZER ENTSCHEIDUNGS- & VERGLEICHSPLATTFORM
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                Womit möchtest du starten? Wähle deinen Bereich:
              </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Door 1 */}
              <div className="p-6 rounded-2xl bg-gradient-to-b from-[#161B29] to-[#10131C] border-2 border-[#C8A97E] shadow-xl flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-[#C8A97E] text-[#090A0F] text-[10px] font-extrabold uppercase">
                      Tür 01 · Direkt-Suche
                    </span>
                    <Sparkles size={18} className="text-[#C8A97E]" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white">
                    Escorts & Privat-Models entdecken
                  </h2>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Filtere unten direkt nach Zürich, Zug, Basel, Bern oder Genf – ohne Registrierungspflicht.
                  </p>
                </div>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["ZH", "ZG", "BS", "BE", "LU", "GE"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setActiveCanton(c)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer ${
                        activeCanton === c ? "bg-[#C8A97E] text-black" : "bg-white/10 text-white hover:bg-white/20"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Door 2 */}
              <Link
                href="/rankings"
                className="p-6 rounded-2xl bg-[#11131C] border border-white/15 hover:border-[#C8A97E] transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-white/10 text-[#C8A97E] text-[10px] font-bold uppercase">
                      Tür 02 · Etablissements
                    </span>
                    <Building2 size={18} className="text-[#C8A97E]" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white group-hover:text-[#C8A97E]">
                    {totalClubsCount} Schweizer Clubs & Laufhäuser
                  </h2>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Geprüfte Adressliste für Kontaktbars, FKK-Clubs, Saunaclubs und Massagestudios in allen Kantonen.
                  </p>
                </div>
                <div className="text-xs font-bold text-[#C8A97E] flex items-center justify-between pt-2 border-t border-white/10">
                  <span>Club-Verzeichnis öffnen</span>
                  <ArrowUpRight size={15} />
                </div>
              </Link>

              {/* Door 3 */}
              <Link
                href="/reviews"
                className="p-6 rounded-2xl bg-[#11131C] border border-white/15 hover:border-[#C8A97E] transition flex flex-col justify-between space-y-4 group"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded bg-white/10 text-emerald-300 text-[10px] font-bold uppercase">
                      Tür 03 · Unabhängiger Test
                    </span>
                    <Scale size={18} className="text-emerald-300" />
                  </div>
                  <h2 className="text-xl font-serif font-bold text-white group-hover:text-[#C8A97E]">
                    Schweizer Portale im Vergleich
                  </h2>
                  <p className="text-xs text-gray-400 leading-relaxed">
                    Xdate.ch, Fgirl.ch, And6.com & Rosalon im sachlichen Test nach Besucher- und Anbieter-Kriterien.
                  </p>
                </div>
                <div className="text-xs font-bold text-emerald-300 flex items-center justify-between pt-2 border-t border-white/10">
                  <span>Zu den Portal-Testberichten</span>
                  <ArrowUpRight size={15} />
                </div>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* CONCEPT 4 HERO: "EDITORIAL VOGUE SPOTLIGHT" (BeMyGirl Luxury Style)   */}
      {/* ===================================================================== */}
      {concept === "4" && (
        <section className="relative border-b border-[#C8A97E]/30 overflow-hidden py-8 px-4">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-25 scale-105"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1800&q=80')",
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#11090E]/90 via-[#11090E]/80 to-[#11090E]" />

          <div className="relative z-10 max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#C8A97E]/30 pb-5">
              <div>
                <div className="text-[11px] font-bold uppercase tracking-[0.26em] text-[#C8A97E]">
                  SWISS HIGH-CLASS PORTFOLIO · CURATED EDITION
                </div>
                <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white mt-1">
                  Exklusive Begleitung & <span className="italic font-normal text-[#E8CE9D]">ausgewählte Adressen</span>
                </h1>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CANTONS.slice(0, 7).map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setActiveCanton(c.code)}
                    className={`px-3.5 py-2 rounded-full text-xs font-bold border transition cursor-pointer ${
                      activeCanton === c.code
                        ? "bg-[#C8A97E] text-[#11090E] border-[#C8A97E]"
                        : "bg-black/50 text-gray-200 border-[#C8A97E]/30 hover:border-[#C8A97E]"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            {/* 4 Extra-Large Magazine Cover Spotlight Portraits */}
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#E8CE9D] mb-3">
                ★ Spotlight-Auswahl ({activeCanton === "ALL" ? "Schweiz" : activeCanton})
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {filteredProfiles.slice(0, 4).map((sp: any, idx: number) => {
                  const spName = String(sp.rawName || "Model").slice(0, 22);
                  const spCity = String(sp.city || "Zürich").split("/")[0].trim();
                  return (
                    <Link
                      key={`spot-${idx}`}
                      href={`/profile/${encodeURIComponent(sp.id)}`}
                      className="group relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-[#C8A97E]/60 shadow-[0_15px_40px_rgba(0,0,0,0.85)]"
                    >
                      <img
                        src={sp.thumbnail || sp.fallbackImg}
                        alt={spName}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = sp.fallbackImg;
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#11090E] via-transparent to-black/30" />
                      <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#C8A97E] text-[#11090E] text-[10px] font-extrabold uppercase tracking-wider">
                        Editorial Pick #{idx + 1}
                      </div>
                      <div className="absolute bottom-3.5 left-3.5 right-3.5">
                        <div className="text-lg font-serif font-bold text-white">{spName}</div>
                        <div className="text-xs text-[#E8CE9D] flex items-center justify-between mt-0.5">
                          <span>📍 {spCity}</span>
                          <span className="font-bold">CHF {sp.advertisedBaseChf || 400}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* CONCEPT 5 HERO: "LIVE-PULSE & VISUELLES RADAR" (Modern App Discovery) */}
      {/* ===================================================================== */}
      {concept === "5" && (
        <section className="relative border-b border-emerald-500/20 bg-[#0B1017] py-5 px-4">
          <div className="max-w-7xl mx-auto space-y-5">
            {/* Horizontal Quick Portrait Radar */}
            <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-hide">
              <div className="shrink-0 pr-3 border-r border-white/10">
                <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Schnell-Radar</span>
                </div>
                <div className="text-xs font-bold text-white mt-0.5">Direkt ins Profil</div>
              </div>
              {filteredProfiles.slice(0, 12).map((rp: any, i: number) => (
                <Link
                  key={`radar-${i}`}
                  href={`/profile/${encodeURIComponent(rp.id)}`}
                  className="shrink-0 flex items-center gap-2.5 p-1.5 pr-3 rounded-full bg-[#111722] border border-white/10 hover:border-[#C8A97E] transition"
                >
                  <img
                    src={rp.thumbnail || rp.fallbackImg}
                    alt={rp.rawName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = rp.fallbackImg;
                    }}
                    className="w-10 h-10 rounded-full object-cover object-top border border-[#C8A97E]"
                  />
                  <div>
                    <div className="text-xs font-bold text-white max-w-[90px] truncate">{rp.rawName}</div>
                    <div className="text-[10px] text-[#C8A97E]">{String(rp.city || "ZH").split("/")[0]}</div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Unified Filter Chips */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10">
              <div className="flex flex-wrap gap-1.5">
                {QUICK_CANTONS.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setActiveCanton(c.code)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                      activeCanton === c.code
                        ? "bg-emerald-400 text-[#090A0F]"
                        : "bg-[#111722] text-gray-300 border border-white/10"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setOnlyConfirmedAvailable(!onlyConfirmedAvailable)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    onlyConfirmedAvailable
                      ? "bg-emerald-400 text-black border-emerald-300"
                      : "bg-[#111722] text-emerald-300 border-emerald-500/30"
                  }`}
                >
                  ● Verfügbarkeit bestätigt
                </button>
                <button
                  onClick={() => setOnlySelfManaged(!onlySelfManaged)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${
                    onlySelfManaged
                      ? "bg-[#C8A97E] text-black border-[#C8A97E]"
                      : "bg-[#111722] text-[#C8A97E] border-[#C8A97E]/30"
                  }`}
                >
                  ✓ Selbst verwaltet
                </button>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* MAIN CATALOGUE WITH RECURRING DESIGN ELEMENTS ACROSS THE PAGE         */}
      {/* ===================================================================== */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-8">
        {/* Status Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-gray-300">
            <StencilSerifX color="#C8A97E" className="w-4 h-3.5 shrink-0" />
            <span className="font-bold text-white">
              {activeCanton === "ALL" ? "Alle Schweizer Regionen" : `Region ${activeCanton}`}
            </span>
            <span className="text-gray-500">|</span>
            <span className="text-[#C8A97E] font-semibold">
              {filteredProfiles.length} geladene Profile (aus {totalVaultCount.toLocaleString("de-CH")} Index-Einträgen)
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              type="button"
              onClick={() => setOnlyConfirmedAvailable(!onlyConfirmedAvailable)}
              className={`px-3 py-1 rounded-lg border cursor-pointer transition ${
                onlyConfirmedAvailable
                  ? "bg-emerald-500 text-black border-emerald-400 font-bold"
                  : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
              }`}
            >
              ● Nur bestätigt verfügbar
            </button>
            <button
              type="button"
              onClick={() => setOnlySelfManaged(!onlySelfManaged)}
              className={`px-3 py-1 rounded-lg border cursor-pointer transition ${
                onlySelfManaged
                  ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E] font-bold"
                  : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
              }`}
            >
              ✓ Selbst verwaltet
            </button>
          </div>
        </div>

        {/* FIRST CATALOGUE BLOCK (Profiles 1 to 12) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredProfiles.slice(0, 12).map((p: any, idx: number) => {
            const cleanName =
              String(p.rawName || "Eintrag")
                .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
                .trim()
                .slice(0, 24) || "Profil";
            const city = String(p.city || "Zürich").split("/")[0].trim();
            const rate = p.advertisedBaseChf || null;
            const img = p.thumbnail || p.fallbackImg;

            return (
              <article
                key={`${p.id}-${idx}`}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-black/25 pointer-events-none" />

                  {/* Subtle Corner Design Ornament on Concept 4 */}
                  {concept === "4" && (
                    <div className="pointer-events-none absolute inset-2 border border-[#C8A97E]/25 rounded-xl" />
                  )}

                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {p.availabilityConfirmed ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/85 border border-emerald-500/50 text-emerald-300 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Verfügbar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 text-gray-300 text-[10px] border border-white/10">
                        {p.sourcePortal || "Index"}
                      </span>
                    )}
                    {p.isSponsored && (
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase w-fit ${cfg.accentBadge}`}>
                        Anzeige
                      </span>
                    )}
                  </div>

                  <div className="absolute top-2.5 right-2.5">
                    {p.isIdentityVerified ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 border border-[#C8A97E]/60 text-[#E5C99B] text-[10px] font-semibold">
                        <Check size={11} className="text-[#C8A97E]" /> Geprüft
                      </span>
                    ) : p.isSelfManaged ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 border border-sky-400/40 text-sky-200 text-[10px] font-semibold">
                        Selbst verwaltet
                      </span>
                    ) : null}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-1">
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate">
                        {cleanName}
                      </h2>
                      <p className="text-[11px] text-gray-300 flex items-center gap-1 truncate">
                        <MapPin size={11} className="text-[#C8A97E] shrink-0" />
                        <span>{city} ({p.canton || "CH"})</span>
                      </p>
                    </div>
                    {rate && (
                      <div className="shrink-0 bg-black/85 px-2 py-1 rounded border border-[#C8A97E]/30 text-right">
                        <div className="text-[9px] text-gray-400 leading-none">1 Std.</div>
                        <div className="text-xs font-bold text-[#C8A97E]">CHF {rate}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
                  <Link
                    href={`/profile/${encodeURIComponent(p.id)}`}
                    onClick={() => recordEvent(p.id, "track_click")}
                    className={`flex-1 py-2 rounded-lg font-bold text-[11px] text-center transition ${cfg.buttonPrimary}`}
                  >
                    Profil öffnen →
                  </Link>
                  {!p.isSelfManaged && (
                    <button
                      type="button"
                      onClick={() => {
                        recordEvent(p.id, "track_click");
                        setSelectedIndexProfile(p);
                      }}
                      className="px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 cursor-pointer"
                    >
                      Info
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {/* ================================================================= */}
        {/* RECURRING DESIGN ELEMENT 2: ARCHITECTURAL STENCIL-X DIVIDER       */}
        {/* + MID-STREAM INTERACTIVE SWISS PORTAL & CITY RIBBON               */}
        {/* ================================================================= */}
        <ArchitecturalDivider label={cfg.dividerLabel} />

        <div className="my-8 p-6 rounded-2xl bg-gradient-to-r from-[#121521] via-[#171B2B] to-[#121521] border border-[#C8A97E]/35 shadow-2xl grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-7 space-y-2">
            <div className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#C8A97E]">
              <ShieldCheck size={14} />
              <span>SCHWEIZER MARKT-TRANSPARENZ · KEIN WECHSELZWANG</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-serif font-bold text-white">
              Quellen verstehen, Portale vergleichen & eigene Profile kostenlos kontrollieren
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Wir trennen klar zwischen externen Quelleneinträgen, selbst verwalteten Anbieterprofilen und dokumentierter Identitätsprüfung. Lies unsere sachlichen Einzelberichte zu Xdate, Fgirl & And6 oder übernimm dein eigenes Profil kostenlos.
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap sm:flex-nowrap gap-2.5 justify-end">
            <Link
              href="/reviews"
              className="flex-1 py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-xs font-bold text-center text-white"
            >
              ⭐ Portal-Vergleich lesen →
            </Link>
            <Link
              href="/advertise"
              className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold text-center ${cfg.buttonPrimary}`}
            >
              ✓ Für Models: Gratis-Kontrolle →
            </Link>
          </div>
        </div>

        {/* SECOND CATALOGUE BLOCK (Remaining Profiles) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredProfiles.slice(12, visibleCount).map((p: any, idx: number) => {
            const cleanName =
              String(p.rawName || "Eintrag")
                .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
                .trim()
                .slice(0, 24) || "Profil";
            const city = String(p.city || "Zürich").split("/")[0].trim();
            const rate = p.advertisedBaseChf || null;
            const img = p.thumbnail || p.fallbackImg;

            return (
              <article
                key={`${p.id}-b2-${idx}`}
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
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-black/25 pointer-events-none" />

                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {p.availabilityConfirmed ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/85 border border-emerald-500/50 text-emerald-300 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Verfügbar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 text-gray-300 text-[10px] border border-white/10">
                        {p.sourcePortal || "Index"}
                      </span>
                    )}
                  </div>

                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-1">
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate">
                        {cleanName}
                      </h2>
                      <p className="text-[11px] text-gray-300 flex items-center gap-1 truncate">
                        <MapPin size={11} className="text-[#C8A97E] shrink-0" />
                        <span>{city} ({p.canton || "CH"})</span>
                      </p>
                    </div>
                    {rate && (
                      <div className="shrink-0 bg-black/85 px-2 py-1 rounded border border-[#C8A97E]/30 text-right">
                        <div className="text-[9px] text-gray-400 leading-none">1 Std.</div>
                        <div className="text-xs font-bold text-[#C8A97E]">CHF {rate}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-2.5 sm:p-3 flex items-center justify-between gap-2">
                  <Link
                    href={`/profile/${encodeURIComponent(p.id)}`}
                    onClick={() => recordEvent(p.id, "track_click")}
                    className={`flex-1 py-2 rounded-lg font-bold text-[11px] text-center transition ${cfg.buttonPrimary}`}
                  >
                    Profil öffnen →
                  </Link>
                  {!p.isSelfManaged && (
                    <button
                      type="button"
                      onClick={() => {
                        recordEvent(p.id, "track_click");
                        setSelectedIndexProfile(p);
                      }}
                      className="px-2.5 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 cursor-pointer"
                    >
                      Info
                    </button>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-8 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={loadMoreFromServerVault}
            disabled={loadingVault}
            className={`px-8 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition cursor-pointer shadow-lg ${cfg.buttonPrimary}`}
          >
            {loadingVault ? "Lade weitere Profile..." : "Weitere Profile laden"}
          </button>
          <Link
            href="/search"
            className="px-6 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-xs font-bold text-gray-200"
          >
            Erweiterte Suche öffnen →
          </Link>
        </div>

        {/* RECURRING DESIGN ELEMENT 3: REGIONAL SWISS CANTON & CLUB MATRIX */}
        <ArchitecturalDivider label="SCHWEIZER REGIONEN, CLUBS & PORTAL-TESTS" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link
            href="/reviews"
            className={`p-5 border transition group ${cfg.cardStyle}`}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <Scale size={14} />
              <span>01 · Redaktioneller Vergleich</span>
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1.5 group-hover:text-[#C8A97E] flex items-center justify-between">
              <span>Xdate, Fgirl & Co. im Test</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Sachliche Einzelberichte zu Funktionen, Kosten und Prüfverfahren der grossen Schweizer Portale.
            </p>
          </Link>

          <Link
            href="/rankings"
            className={`p-5 border transition group ${cfg.cardStyle}`}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <Building2 size={14} />
              <span>02 · Stationäre Adressen</span>
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1.5 group-hover:text-[#C8A97E] flex items-center justify-between">
              <span>{totalClubsCount} Schweizer Clubs & Studios</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Stationäre Laufhäuser, FKK-Clubs, Kontaktbars und Massagestudios nach Kanton geordnet.
            </p>
          </Link>

          <Link
            href="/advertise"
            className={`p-5 border transition group ${cfg.cardStyle}`}
          >
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              <UserCheck size={14} />
              <span>03 · Für Anbieterinnen</span>
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1.5 group-hover:text-[#C8A97E] flex items-center justify-between">
              <span>Profil kostenlos selbst verwalten</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1 leading-relaxed">
              Bestehenden Eintrag übernehmen, Angaben korrigieren, Verfügbarkeit bestätigen oder kostenlos entfernen.
            </p>
          </Link>
        </div>

        {/* Compact Transparency Footer Strip */}
        <div className="mt-6 p-4 rounded-xl bg-[#11131C]/70 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-400">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-semibold text-gray-300">Kennzeichnungen:</span>
            <span>● <strong>Verfügbar:</strong> Vom Anbieter für 4 Std. bestätigt</span>
            <span>✓ <strong>Geprüft / Selbst verwaltet:</strong> Autorisiertes Anbieterkonto</span>
            <span><strong>Index:</strong> Öffentlicher Quelleneintrag</span>
          </div>
          <Link href="/report" className="text-[#C8A97E] hover:underline">
            Profil melden oder Entfernung beantragen →
          </Link>
        </div>
      </main>

      {selectedIndexProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#11131C] border border-[#C8A97E]/50 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                Quellenangabe · {selectedIndexProfile.sourcePortal || "Index"}
              </span>
              <button
                onClick={() => setSelectedIndexProfile(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
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
                  className="py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 font-semibold text-xs text-center border border-white/10 flex items-center justify-center gap-1.5"
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