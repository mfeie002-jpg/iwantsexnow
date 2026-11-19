import React from "react";

export type BrandThemeId = "A" | "B" | "C" | "D" | "E" | "F";

export const BRAND_THEMES: Record<
  BrandThemeId,
  {
    id: BrandThemeId;
    shortLabel: string;
    name: string;
    subtitle: string;
    bgPrimary: string;
    bgSecondary: string;
    cardBg: string;
    accentText: string;
    accentBorder: string;
    glowColor: string;
  }
> = {
  A: {
    id: "A",
    shortLabel: "Primary",
    name: "Primary Brand Identity (Deep Navy & Champagne Sand #e8c98a)",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#150810]",
    bgSecondary: "bg-[#150810]",
    cardBg: "bg-[#22101a]/95",
    accentText: "text-[#e8c98a]",
    accentBorder: "border-[#e8c98a]/45",
    glowColor: "from-[#d6165f]/15 via-transparent to-emerald-500/10",
  },
  B: {
    id: "B",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#150810]",
    bgSecondary: "bg-[#150810]",
    cardBg: "bg-[#22101a]/95",
    accentText: "text-[#e8c98a]",
    accentBorder: "border-[#e8c98a]/45",
    glowColor: "from-[#d6165f]/15 via-transparent to-emerald-500/10",
  },
  C: {
    id: "C",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#150810]",
    bgSecondary: "bg-[#150810]",
    cardBg: "bg-[#22101a]/95",
    accentText: "text-[#e8c98a]",
    accentBorder: "border-[#e8c98a]/45",
    glowColor: "from-[#d6165f]/15 via-transparent to-emerald-500/10",
  },
  D: {
    id: "D",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#150810]",
    bgSecondary: "bg-[#150810]",
    cardBg: "bg-[#22101a]/95",
    accentText: "text-[#e8c98a]",
    accentBorder: "border-[#e8c98a]/45",
    glowColor: "from-[#d6165f]/15 via-transparent to-emerald-500/10",
  },
  E: {
    id: "E",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#150810]",
    bgSecondary: "bg-[#150810]",
    cardBg: "bg-[#22101a]/95",
    accentText: "text-[#e8c98a]",
    accentBorder: "border-[#e8c98a]/45",
    glowColor: "from-[#d6165f]/15 via-transparent to-emerald-500/10",
  },
  F: {
    id: "F",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#150810]",
    bgSecondary: "bg-[#150810]",
    cardBg: "bg-[#22101a]/95",
    accentText: "text-[#e8c98a]",
    accentBorder: "border-[#e8c98a]/45",
    glowColor: "from-[#d6165f]/15 via-transparent to-emerald-500/10",
  },
};

export function StencilSerifX({
  color = "#e8c98a",
  className = "w-6 h-6 inline-block",
}: {
  color?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 54 44" className={className} aria-label="x">
      <g fill={color}>
        <polygon points="3,4 22,4 22,7.5 17.2,7.5 41.2,36.5 47,36.5 47,40 28,40 28,36.5 32.8,36.5 8.8,7.5 3,7.5" />
        <polygon points="31,4 49,4 49,7.5 43.5,7.5 32.2,20.2 28.6,15.6 37.5,7.5 31,7.5" />
        <polygon points="20.2,24.2 23.8,28.8 14.5,36.5 20.5,36.5 20.5,40 2,40 2,36.5 7.8,36.5" />
      </g>
    </svg>
  );
}

export function BrandLogo({
  compact = false,
}: {
  compact?: boolean;
  variant?: BrandThemeId;
}) {
  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Flowing "W" mark */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          compact ? "w-9 h-9" : "w-11 h-11"
        }`}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full" fill="none" aria-hidden="true">
          <path d="M7 14 C7 46 22 54 32 30 C42 54 57 46 57 14" stroke="#e8c98a" strokeWidth="5.5" strokeLinecap="round" strokeLinejoin="round" />
          <circle cx="32" cy="12" r="4.5" fill="#d6165f" />
        </svg>
      </div>

      {/* Editorial Lowercase Serif Wordmark: iwantse[x]now.ch */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-bold tracking-[-0.02em] leading-none flex items-baseline text-[#fbf1ec] ${
            compact ? "text-xl" : "text-2xl md:text-[30px]"
          }`}
        >
          <span>iWantSexNow</span>
          <span className="text-[#e8c98a]">.ch</span>
        </span>
        <span className="text-xs uppercase tracking-[0.22em] text-gray-300/90 font-sans font-semibold mt-1">
          SWISS ESCORT INDEX & DIRECT BOOKING
        </span>
      </div>
    </div>
  );
}