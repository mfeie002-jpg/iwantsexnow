import React, { useState } from "react";
import Link from "next/link";
import { Search, MapPin, Check, Sparkles, SlidersHorizontal } from "lucide-react";

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
    label: "Alle Models",
    sub: "Kompletter Index",
    queryTag: "",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85",
    count: "7.021",
  },
  {
    id: "gfe",
    label: "Girlfriend (GFE)",
    sub: "Küssen & Begleitung",
    queryTag: "GFE",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=85",
    count: "2.100",
  },
  {
    id: "outcall",
    label: "Hotel & Outcall",
    sub: "Diskreter Besuch",
    queryTag: "Outcall",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=85",
    count: "1.640",
  },
  {
    id: "massage",
    label: "Tantra & Massage",
    sub: "Body-to-Body & Nuru",
    queryTag: "Massage",
    image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=600&q=85",
    count: "950",
  },
  {
    id: "blonde",
    label: "Blond",
    sub: "High-Class Models",
    queryTag: "Blond",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=85",
    count: "1.420",
  },
  {
    id: "brunette",
    label: "Brünett",
    sub: "Natürlich & Elegant",
    queryTag: "Brunette",
    image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=85",
    count: "1.890",
  },
  {
    id: "latina",
    label: "Latina",
    sub: "Kurvig & Temperament",
    queryTag: "Latina",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=85",
    count: "1.180",
  },
  {
    id: "ebony",
    label: "Ebony",
    sub: "Exotisch & Sinnlich",
    queryTag: "Ebony",
    image: "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=600&q=85",
    count: "490",
  },
  {
    id: "asian",
    label: "Asian & Thai",
    sub: "Zart & Privat",
    queryTag: "Asia",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=85",
    count: "640",
  },
  {
    id: "domina",
    label: "Domina & Fetisch",
    sub: "BDSM & Privatstudio",
    queryTag: "Domina",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=85",
    count: "390",
  },
];

export const TRENDING_SEARCHES = [
  { label: "Zürich City · Jetzt verfügbar", tag: "Zürich" },
  { label: "Zug & Cham · Privat & Hotel", tag: "Zug" },
  { label: "Offiziell verifizierte Originalfotos", tag: "VERIFIED" },
  { label: "Girlfriend Experience (GFE)", tag: "GFE" },
  { label: "Tantra & Body-to-Body Massage", tag: "Massage" },
  { label: "Basel & Bern Escorts", tag: "Basel" },
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
  storyProfiles?: any[];
}) {
  const [searchFocused, setSearchFocused] = useState(false);

  const cantons = [
    { code: "ALL", name: "Ganze Schweiz" },
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
    <section className="relative border-b border-white/10 bg-[#090A0F]">
      {/* Subtle architectural gold light vignette */}
      <div
        className="pointer-events-none absolute inset-0 opacity-25"
        style={{
          background:
            "radial-gradient(circle at 50% 0%, rgba(200, 169, 126, 0.22) 0%, rgba(9, 10, 15, 0) 65%)",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-6 pb-6">
        {/* Compact, authoritative Swiss Escort Directory Header + Integrated Search */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-[#C8A97E] font-semibold mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>THE SWISS ESCORT & PRIVATE DIRECTORY</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white tracking-tight">
              Verifizierte Escorts, Privat-Models & Studios in der Schweiz
            </h1>
          </div>

          {/* Sleek Luxury Search Box */}
          <div className="relative w-full lg:w-[460px] z-30">
            <div className="flex items-center bg-[#12141D] border border-white/15 focus-within:border-[#C8A97E] rounded-xl overflow-hidden shadow-xl transition">
              <Search size={16} className="ml-3.5 text-[#C8A97E] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setTimeout(() => setSearchFocused(false), 200)}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Ort, Vorliebe, Name oder +41 Nummer suchen..."
                className="w-full py-2.5 px-3 bg-transparent text-white placeholder-gray-400 text-xs sm:text-sm focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => onSearchChange("")}
                  className="px-2 text-xs text-gray-400 hover:text-white"
                >
                  ✕
                </button>
              )}
              <Link
                href={`/search${searchQuery ? `?q=${encodeURIComponent(searchQuery)}` : ""}`}
                className="m-1 px-4 py-2 rounded-lg bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-bold text-xs shrink-0 transition"
              >
                Suchen
              </Link>
            </div>

            {/* Instant Zero-Typing Suggestions */}
            {searchFocused && (
              <div className="absolute left-0 right-0 mt-1.5 p-3.5 rounded-xl bg-[#12141D] border border-[#C8A97E]/50 shadow-2xl z-40">
                <div className="text-[10px] font-bold uppercase tracking-wider text-[#C8A97E] mb-2">
                  Häufig gesucht (Direktwahl ohne Tippen)
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {TRENDING_SEARCHES.map((t, i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseDown={() => {
                        if (t.tag === "VERIFIED") onToggleVerified();
                        else onSearchChange(t.tag);
                        setSearchFocused(false);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs bg-white/5 hover:bg-[#C8A97E] hover:text-[#090A0F] text-gray-200 border border-white/10 transition"
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Clean City & Filter Bar (Clearly clickable buttons with sharp borders) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-hide">
          <button
            type="button"
            onClick={onToggleOnline}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border shrink-0 flex items-center gap-2 transition cursor-pointer ${
              onlyOnline
                ? "bg-emerald-500 text-black border-emerald-400 font-bold"
                : "bg-[#12141D] text-gray-200 border-white/15 hover:border-emerald-400/60"
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${onlyOnline ? "bg-black" : "bg-emerald-400"}`} />
            <span>Jetzt Verfügbar</span>
          </button>

          <button
            type="button"
            onClick={onToggleVerified}
            className={`px-3.5 py-2 rounded-lg text-xs font-semibold border shrink-0 flex items-center gap-1.5 transition cursor-pointer ${
              onlyVerified
                ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E] font-bold"
                : "bg-[#12141D] text-gray-200 border-white/15 hover:border-[#C8A97E]/60"
            }`}
          >
            <Check size={13} className={onlyVerified ? "text-[#090A0F]" : "text-[#C8A97E]"} />
            <span>Geprüfte Originalfotos</span>
          </button>

          <div className="h-5 w-[1px] bg-white/10 mx-1 shrink-0" />

          {cantons.map((c) => (
            <button
              key={c.code}
              type="button"
              onClick={() => onSelectCanton(c.code)}
              className={`px-3.5 py-2 rounded-lg text-xs font-semibold border shrink-0 transition cursor-pointer ${
                activeCanton === c.code
                  ? "bg-white text-[#090A0F] border-white font-bold"
                  : "bg-[#12141D] text-gray-300 border-white/10 hover:border-white/30 hover:text-white"
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>

        {/* Visual Category Portraits (Clean Editorial 3:4 Cards - No Cartoon Badges) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2.5">
          {VISUAL_PREFERENCE_CARDS.map((card) => {
            const isSelected = activeVisualId === card.id;
            return (
              <button
                key={card.id}
                type="button"
                onClick={() => onSelectVisual(card.id, card.queryTag)}
                className={`group relative h-32 sm:h-36 rounded-xl overflow-hidden border text-left transition-all cursor-pointer ${
                  isSelected
                    ? "border-[#C8A97E] ring-2 ring-[#C8A97E]/40"
                    : "border-white/15 hover:border-[#C8A97E]/70"
                }`}
              >
                <img
                  src={card.image}
                  alt={card.label}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-black/75 text-[9px] font-semibold text-[#C8A97E] border border-white/10">
                  {card.count}
                </div>
                <div className="absolute bottom-2 left-2.5 right-2">
                  <div className="text-xs font-bold text-white leading-tight group-hover:text-[#C8A97E] transition">
                    {card.label}
                  </div>
                  <div className="text-[10px] text-gray-300 truncate">{card.sub}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}