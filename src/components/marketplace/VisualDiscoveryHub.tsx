import React, { useState } from "react";
import Link from "next/link";

export interface VisualFilterItem {
  id: string;
  label: string;
  sub: string;
  queryTag: string;
  image: string;
  count: string;
  badge?: string;
}

export const VISUAL_PREFERENCE_CARDS: VisualFilterItem[] = [
  {
    id: "all",
    label: "Alle Tramfrauen",
    sub: "Heute Nacht frei",
    queryTag: "",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
    count: "7.021+",
    badge: "🔥 Beliebt",
  },
  {
    id: "gfe",
    label: "Girlfriend (GFE)",
    sub: "Küssen & Zärtlichkeit",
    queryTag: "GFE",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",
    count: "2.100+",
    badge: "💋 Hautnah",
  },
  {
    id: "blonde",
    label: "Blonde Verführung",
    sub: "High-Class & Sinnlich",
    queryTag: "Blond",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
    count: "1.420+",
  },
  {
    id: "latina",
    label: "Hot Latina",
    sub: "Feurig & Kurvig",
    queryTag: "Latina",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
    count: "1.180+",
    badge: "🌶️ Heiss",
  },
  {
    id: "brunette",
    label: "Brunette Elegance",
    sub: "Stilvoll & Verrucht",
    queryTag: "Brunette",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85",
    count: "1.890+",
  },
  {
    id: "ebony",
    label: "Exotic Ebony",
    sub: "Pure Leidenschaft",
    queryTag: "Ebony",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=700&q=85",
    count: "490+",
  },
  {
    id: "massage",
    label: "Tantra & Body2Body",
    sub: "Nackte Entspannung",
    queryTag: "Massage",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=700&q=85",
    count: "950+",
    badge: "✨ Sinnlich",
  },
  {
    id: "busty",
    label: "Curves & XXL",
    sub: "Weiblich & Vollbusig",
    queryTag: "XXL",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=85",
    count: "830+",
  },
  {
    id: "asian",
    label: "Asian & Thai Lotus",
    sub: "Zart & Diskret",
    queryTag: "Asia",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85",
    count: "640+",
  },
  {
    id: "livecam",
    label: "1:1 Live-Cam",
    sub: "Jetzt im Video-Call",
    queryTag: "Cam",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
    count: "48 Live",
    badge: "🔴 LIVE",
  },
];

export const TRENDING_SEARCHES = [
  { label: "🟢 Jetzt frei für Hotelbesuch Zürich", tag: "Zürich", hot: true },
  { label: "🥂 Zug & Cham Privat-Appartement", tag: "Zug", hot: true },
  { label: "✓ Nur Offiziell Geprüfte Echte Fotos", tag: "VERIFIED", hot: true },
  { label: "💋 Französisch & Zungenküsse (GFE)", tag: "GFE", hot: false },
  { label: "💆‍♀️ Nuru & Body-to-Body Massage", tag: "Massage", hot: false },
  { label: "🌶️ Heisse Latina heute verfügbar", tag: "Latina", hot: false },
  { label: "👠 Domina & Bizarr-Session", tag: "Domina", hot: false },
];

export function VisualDiscoveryHub({
  activeVisualId,
  onSelectVisual,
  activeCanton,
  onSelectCanton,
  searchQuery,
  onSearchChange,
  onlyOnline,
  onToggleOnline,
  onlyVerified,
  onToggleVerified,
  storyProfiles = [],
}: {
  activeVisualId: string;
  onSelectVisual: (id: string, queryTag: string) => void;
  activeCanton: string;
  onSelectCanton: (canton: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onlyOnline: boolean;
  onToggleOnline: () => void;
  onlyVerified: boolean;
  onToggleVerified: () => void;
  storyProfiles?: any[];
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  const cantons = [
    { code: "ALL", name: "🇨🇭 Ganze Schweiz" },
    { code: "ZH", name: "Zürich" },
    { code: "ZG", name: "Zug & Cham" },
    { code: "BS", name: "Basel" },
    { code: "BE", name: "Bern" },
    { code: "LU", name: "Luzern" },
    { code: "AG", name: "Aargau" },
    { code: "SG", name: "St. Gallen" },
    { code: "GE", name: "Genève" },
    { code: "VD", name: "Lausanne" },
  ];

  return (
    <section className="relative overflow-hidden border-b border-[#C8A97E]/25">
      {/* SENSUAL ATMOSPHERIC BACKGROUND IMAGE + WARM VELVET/CHAMPAGNE BOKEH GLOW */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000 opacity-35"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=2000&q=85')",
        }}
      />
      {/* Multi-layered warm luxury gradients instead of flat blue */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#120910]/85 via-[#160D18]/88 to-[#120B13]" />
      <div className="pointer-events-none absolute -top-24 left-1/4 w-[520px] h-[520px] rounded-full bg-rose-600/20 blur-[130px]" />
      <div className="pointer-events-none absolute top-10 right-1/4 w-[480px] h-[480px] rounded-full bg-[#C8A97E]/20 blur-[130px]" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 pt-6 pb-7">
        {/* 1. HUMAN STORIES BAR AT THE VERY TOP (Immediate human connection like Instagram/Fgirl) */}
        {storyProfiles.length > 0 && (
          <div className="mb-6 pb-4 border-b border-white/10">
            <div className="flex items-center justify-between mb-2.5">
              <div className="flex items-center gap-2 text-xs font-bold text-[#E8CFA6]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span>GERADE LIVE & BEREIT FÜR DEIN DATE (ECHTZEIT-STORIES):</span>
              </div>
              <Link href="/live-cam" className="text-xs text-rose-300 hover:text-rose-200 font-bold">
                🔴 Alle Live-Cams öffnen →
              </Link>
            </div>
            <div className="flex items-center gap-3.5 overflow-x-auto pb-1 scrollbar-hide">
              {storyProfiles.slice(0, 12).map((sp: any, idx: number) => (
                <Link
                  key={idx}
                  href={`/profile/${encodeURIComponent(sp.id)}`}
                  className="group flex flex-col items-center shrink-0 w-18"
                >
                  <div className="relative p-[2.5px] rounded-full bg-gradient-to-tr from-rose-500 via-[#C8A97E] to-emerald-400 shadow-[0_0_20px_rgba(225,29,72,0.35)] group-hover:scale-105 transition-transform">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#120910] bg-black">
                      <img
                        src={sp.thumbnail || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"}
                        alt={sp.rawName}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </div>
                    <span className="absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#120910]" />
                  </div>
                  <span className="text-[11px] font-semibold text-gray-100 mt-1.5 truncate max-w-[70px] group-hover:text-[#C8A97E]">
                    {String(sp.rawName || "VIP").split(" ")[0]}
                  </span>
                  <span className="text-[9px] text-[#C8A97E] font-medium">
                    {String(sp.city || "Zürich").split("/")[0].slice(0, 9)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* 2. EMOTIONAL, SENSUAL HEADLINE */}
        <div className="text-center max-w-3xl mx-auto mb-6">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-gradient-to-r from-rose-500/20 via-[#C8A97E]/20 to-emerald-500/20 border border-[#C8A97E]/40 text-[#F3DFB9] text-xs font-semibold mb-3 shadow-lg">
            <span>🥂 Echt. Diskret. Unvergesslich.</span>
            <span className="text-white/40">|</span>
            <span className="text-emerald-300 font-bold">142 Begleiterinnen jetzt online</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight leading-[1.12] drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
            Wen möchtest du <span className="italic font-normal bg-gradient-to-r from-[#F6E2B3] via-[#C8A97E] to-rose-300 bg-clip-text text-transparent">heute Nacht</span> erleben?
          </h1>
          <p className="text-sm md:text-base text-gray-200/90 mt-2.5 max-w-2xl mx-auto">
            Spüre das Knistern schon vor dem Treffen: Wähle deine Fantasie per Bild-Klick, sieh wer gerade live im Hotel oder Studio frei ist und buche direkt ohne Umwege.
          </p>
        </div>

        {/* 3. GLAMOUR GLASS SEARCH BAR WITH ZERO-TYPING TRENDING DROPDOWN */}
        <div className="relative max-w-3xl mx-auto mb-6 z-30">
          <div className="flex items-center bg-black/55 backdrop-blur-xl border-2 border-[#C8A97E]/60 rounded-2xl shadow-[0_15px_45px_rgba(0,0,0,0.65)] focus-within:border-rose-400 transition-all overflow-hidden">
            <span className="pl-4 pr-2 text-[#C8A97E] text-lg">✨</span>
            <input
              type="text"
              value={searchQuery}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setTimeout(() => setSearchFocused(false), 220)}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Tippe hier für die heissesten Trends heute Abend – oder gib Ort, Wunsch oder Name ein..."
              className="w-full py-4 px-2 bg-transparent text-white placeholder-gray-300/70 text-sm md:text-base focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => onSearchChange("")}
                className="px-3 text-xs text-gray-300 hover:text-white"
              >
                ✕
              </button>
            )}
            <Link
              href={`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
              className="m-1.5 px-6 py-3 rounded-xl bg-gradient-to-r from-[#C8A97E] via-[#E5C99B] to-[#C8A97E] hover:brightness-110 text-[#120910] font-extrabold text-sm shrink-0 transition shadow-lg"
            >
              Entdecken
            </Link>
          </div>

          {searchFocused && (
            <div className="absolute left-0 right-0 mt-2 p-4 rounded-2xl bg-[#1A0E17]/95 backdrop-blur-2xl border border-[#C8A97E]/60 shadow-2xl z-40">
              <div className="flex items-center justify-between mb-2.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                  🔥 Was Schweizer Gentlemen gerade am meisten suchen (1-Klick ohne Tippen)
                </span>
              </div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((t, i) => (
                  <button
                    key={i}
                    type="button"
                    onMouseDown={() => {
                      if (t.tag === "VERIFIED") onToggleVerified();
                      else onSearchChange(t.tag);
                      setSearchFocused(false);
                    }}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                      t.hot
                        ? "bg-gradient-to-r from-rose-500/20 to-[#C8A97E]/20 border-[#C8A97E]/60 text-white hover:bg-[#C8A97E] hover:text-black"
                        : "bg-white/5 border-white/15 text-gray-200 hover:border-[#C8A97E]"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 4. QUICK REGION & LIVE PILLS */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-7">
          <button
            onClick={onToggleOnline}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 ${
              onlyOnline
                ? "bg-emerald-500 text-black border-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.6)]"
                : "bg-emerald-500/15 text-emerald-300 border-emerald-500/40 hover:bg-emerald-500/25"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-current animate-ping" />
            🟢 Jetzt Frei & Online
          </button>

          <button
            onClick={onToggleVerified}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 ${
              onlyVerified
                ? "bg-sky-400 text-black border-sky-200 shadow-[0_0_20px_rgba(56,189,248,0.6)]"
                : "bg-sky-500/15 text-sky-200 border-sky-400/40 hover:bg-sky-500/25"
            }`}
          >
            <span>✓</span> 100% Echte Geprüfte Fotos
          </button>

          <span className="text-white/20 hidden sm:inline">|</span>

          {cantons.map((c) => (
            <button
              key={c.code}
              onClick={() => onSelectCanton(c.code)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold border transition ${
                activeCanton === c.code
                  ? "bg-gradient-to-r from-[#C8A97E] to-[#E5C99B] text-[#120910] border-[#C8A97E] font-extrabold shadow-md"
                  : "bg-black/40 backdrop-blur text-gray-200 border-white/15 hover:border-[#C8A97E]/60"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* 5. TALLER, SENSUAL MAGAZINE-STYLE MOOD CARDS (Instead of tiny dull boxes) */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-xs font-bold uppercase tracking-[0.18em] text-[#E5C99B] flex items-center gap-2">
              <span>✨ Wähle deine Fantasie (Ein Klick auf das Bild genügt)</span>
            </h2>
            {activeVisualId !== "all" && (
              <button
                onClick={() => onSelectVisual("all", "")}
                className="text-xs text-rose-300 underline hover:text-white font-semibold"
              >
                Alle 7.021+ Profile zeigen
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-3">
            {VISUAL_PREFERENCE_CARDS.map((card) => {
              const isSelected = activeVisualId === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => onSelectVisual(card.id, card.queryTag)}
                  className={`group relative h-36 sm:h-44 rounded-2xl overflow-hidden border-2 text-left transition-all duration-300 ${
                    isSelected
                      ? "border-[#C8A97E] ring-2 ring-rose-500/50 scale-[1.04] shadow-[0_10px_30px_rgba(200,169,126,0.4)]"
                      : "border-white/15 hover:border-[#C8A97E]/80 hover:-translate-y-1 shadow-xl"
                  }`}
                >
                  <img
                    src={card.image}
                    alt={card.label}
                    className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700"
                    loading="lazy"
                  />
                  {/* Warm sensual vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#12070E] via-[#12070E]/35 to-transparent" />
                  <div className="absolute top-2 left-2 right-2 flex items-center justify-between gap-1">
                    {card.badge ? (
                      <span className="px-1.5 py-0.5 rounded-md bg-rose-600/90 text-[9px] font-extrabold text-white shadow">
                        {card.badge}
                      </span>
                    ) : (
                      <span />
                    )}
                    <span className="px-1.5 py-0.5 rounded-md bg-black/75 backdrop-blur text-[9px] font-bold text-[#E5C99B] border border-[#C8A97E]/40">
                      {card.count}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5">
                    <div className="text-xs sm:text-[13px] font-serif font-bold text-white leading-tight drop-shadow">
                      {card.label}
                    </div>
                    <div className="text-[10px] text-[#E5C99B]/90 truncate mt-0.5">{card.sub}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}