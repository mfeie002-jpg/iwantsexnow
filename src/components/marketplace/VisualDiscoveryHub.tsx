import React, { useState } from "react";
import Link from "next/link";

export interface VisualFilterItem {
  id: string;
  label: string;
  sub: string;
  queryTag: string;
  image: string;
  count: string;
}

export const VISUAL_PREFERENCE_CARDS: VisualFilterItem[] = [
  {
    id: "all",
    label: "Alle Top-Profile",
    sub: "Sofort verfügbar",
    queryTag: "",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
    count: "7.021+",
  },
  {
    id: "blonde",
    label: "Blonde",
    sub: "Luxury & High-Class",
    queryTag: "Blond",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80",
    count: "1.420+",
  },
  {
    id: "latina",
    label: "Latina",
    sub: "Temperament & Curves",
    queryTag: "Latina",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80",
    count: "1.180+",
  },
  {
    id: "ebony",
    label: "Ebony",
    sub: "Exotic & Sensual",
    queryTag: "Ebony",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=500&q=80",
    count: "490+",
  },
  {
    id: "brunette",
    label: "Brunette",
    sub: "Natural & Elegant",
    queryTag: "Brunette",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=500&q=80",
    count: "1.890+",
  },
  {
    id: "asian",
    label: "Asian & Thai",
    sub: "Discreet & Tantra",
    queryTag: "Asia",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=500&q=80",
    count: "640+",
  },
  {
    id: "busty",
    label: "Curvy & XXL",
    sub: "Vollbusig & Feminin",
    queryTag: "XXL",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80",
    count: "830+",
  },
  {
    id: "gfe",
    label: "Girlfriend (GFE)",
    sub: "Zärtlich & Privat",
    queryTag: "GFE",
    image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=500&q=80",
    count: "2.100+",
  },
  {
    id: "massage",
    label: "Erotik-Massage",
    sub: "Tantra & Body2Body",
    queryTag: "Massage",
    image: "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=500&q=80",
    count: "950+",
  },
  {
    id: "livecam",
    label: "1:1 Live-Cam",
    sub: "Sofort Video-Call",
    queryTag: "Cam",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=500&q=80",
    count: "48 Live",
  },
];

export const TRENDING_SEARCHES = [
  { label: "🟢 Jetzt online in Zürich", tag: "Zürich", hot: true },
  { label: "🔥 Zug & Cham Outcall Hotel", tag: "Zug", hot: true },
  { label: "💎 Offiziell Verifiziert (✓)", tag: "VERIFIED", hot: true },
  { label: "🖤 Ebony Zürich", tag: "Ebony", hot: false },
  { label: "💆‍♀️ Tantra & Nuru Massage", tag: "Massage", hot: false },
  { label: "🥂 Girlfriend Experience (GFE)", tag: "GFE", hot: false },
  { label: "👠 Domina & Fetisch", tag: "Domina", hot: false },
  { label: "🤵 Gigolo für Damen & Paare", tag: "Gigolo", hot: false },
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
    <div className="w-full max-w-7xl mx-auto px-4 pt-6 pb-4">
      {/* Clean, focused headline */}
      <div className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-3">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span>142 Models & Studios gerade live verfügbar · 7.021+ Schweizer Profile</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-serif font-bold text-white tracking-tight leading-tight">
          Wähle deinen Typ. <span className="text-[#C8A97E]">Sofort & ohne Umwege.</span>
        </h1>
        <p className="text-sm md:text-base text-gray-300 mt-2">
          Klicke einfach auf ein Bild deiner Vorliebe oder wähle deine Stadt – kein Tippen nötig.
        </p>
      </div>

      {/* Zero-Typing Search Bar with Instant Trending Dropdown */}
      <div className="relative max-w-3xl mx-auto mb-6 z-30">
        <div className="flex items-center bg-[#111F30]/95 border-2 border-[#C8A97E]/50 rounded-2xl shadow-[0_10px_35px_rgba(0,0,0,0.5)] focus-within:border-[#C8A97E] transition-all overflow-hidden">
          <span className="pl-4 pr-2 text-[#C8A97E] text-lg">🔍</span>
          <input
            type="text"
            value={searchQuery}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setTimeout(() => setSearchFocused(false), 220)}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Klicken für Trending-Vorschläge – oder Name, Ort, +41 Nummer eingeben..."
            className="w-full py-3.5 px-2 bg-transparent text-white placeholder-gray-400 text-sm md:text-base focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange("")}
              className="px-3 text-xs text-gray-400 hover:text-white"
            >
              ✕ Löschen
            </button>
          )}
          <Link
            href={`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
            className="m-1.5 px-5 py-2.5 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#0D1826] font-bold text-sm shrink-0 transition"
          >
            Finden
          </Link>
        </div>

        {/* Trending & Most Searched Popup when clicking search bar without typing */}
        {searchFocused && (
          <div className="absolute left-0 right-0 mt-2 p-4 rounded-2xl bg-[#0D1826] border border-[#C8A97E]/50 shadow-2xl z-40">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                🔥 Meistgesucht & Gerade im Trend (1-Klick Auswahl ohne Tippen)
              </span>
              <span className="text-[11px] text-gray-400">Live-Trends Schweiz</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((t, i) => (
                <button
                  key={i}
                  type="button"
                  onMouseDown={() => {
                    if (t.tag === "VERIFIED") {
                      onToggleVerified();
                    } else {
                      onSearchChange(t.tag);
                    }
                    setSearchFocused(false);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition flex items-center gap-1.5 ${
                    t.hot
                      ? "bg-[#C8A97E]/15 border-[#C8A97E]/50 text-white hover:bg-[#C8A97E] hover:text-[#0D1826]"
                      : "bg-white/5 border-white/10 text-gray-200 hover:border-[#C8A97E]"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Location & Live Status Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        <button
          onClick={onToggleOnline}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 ${
            onlyOnline
              ? "bg-emerald-500 text-black border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30 hover:bg-emerald-500/20"
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
          🟢 Nur Jetzt Online / Verfügbar
        </button>

        <button
          onClick={onToggleVerified}
          className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 ${
            onlyVerified
              ? "bg-sky-500 text-black border-sky-300 shadow-[0_0_15px_rgba(14,165,233,0.5)]"
              : "bg-sky-500/10 text-sky-300 border-sky-500/30 hover:bg-sky-500/20"
          }`}
        >
          <span>✓</span> Offiziell Verifiziert
        </button>

        <span className="text-gray-600 hidden sm:inline">|</span>

        {cantons.map((c) => (
          <button
            key={c.code}
            onClick={() => onSelectCanton(c.code)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold border transition ${
              activeCanton === c.code
                ? "bg-[#C8A97E] text-[#0D1826] border-[#C8A97E] font-bold"
                : "bg-white/5 text-gray-300 border-white/10 hover:border-[#C8A97E]/50"
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* VISUAL IMAGE FILTER CARDS (No Typing Needed - Click Your Preference) */}
      <div className="mb-2">
        <div className="flex items-center justify-between mb-2.5 px-1">
          <h2 className="text-xs font-bold uppercase tracking-widest text-[#C8A97E]">
            Was gefällt dir heute am besten? (Bild anklicken zum Filtern)
          </h2>
          {activeVisualId !== "all" && (
            <button
              onClick={() => onSelectVisual("all", "")}
              className="text-xs text-[#C8A97E] underline hover:text-white"
            >
              Filter zurücksetzen (Alle zeigen)
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {VISUAL_PREFERENCE_CARDS.map((card) => {
            const isSelected = activeVisualId === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectVisual(card.id, card.queryTag)}
                className={`group relative h-28 sm:h-32 rounded-2xl overflow-hidden border-2 text-left transition-all duration-200 ${
                  isSelected
                    ? "border-[#C8A97E] ring-2 ring-[#C8A97E]/50 scale-[1.03] shadow-xl"
                    : "border-white/10 hover:border-[#C8A97E]/60"
                }`}
              >
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-transparent" />
                <div className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded-md bg-black/70 text-[9px] font-bold text-[#C8A97E] border border-[#C8A97E]/30">
                  {card.count}
                </div>
                <div className="absolute bottom-2 left-2 right-2">
                  <div className="text-xs font-bold text-white leading-tight">{card.label}</div>
                  <div className="text-[10px] text-gray-300 truncate">{card.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}