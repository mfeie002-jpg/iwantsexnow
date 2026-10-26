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
    name: "Primary Brand Identity (Deep Navy & Champagne Sand #C8A97E)",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#0D1826]",
    bgSecondary: "bg-[#08101A]",
    cardBg: "bg-[#111F30]/95",
    accentText: "text-[#C8A97E]",
    accentBorder: "border-[#C8A97E]/45",
    glowColor: "from-[#C8A97E]/15 via-transparent to-emerald-500/10",
  },
  B: {
    id: "B",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#0D1826]",
    bgSecondary: "bg-[#08101A]",
    cardBg: "bg-[#111F30]/95",
    accentText: "text-[#C8A97E]",
    accentBorder: "border-[#C8A97E]/45",
    glowColor: "from-[#C8A97E]/15 via-transparent to-emerald-500/10",
  },
  C: {
    id: "C",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#0D1826]",
    bgSecondary: "bg-[#08101A]",
    cardBg: "bg-[#111F30]/95",
    accentText: "text-[#C8A97E]",
    accentBorder: "border-[#C8A97E]/45",
    glowColor: "from-[#C8A97E]/15 via-transparent to-emerald-500/10",
  },
  D: {
    id: "D",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#0D1826]",
    bgSecondary: "bg-[#08101A]",
    cardBg: "bg-[#111F30]/95",
    accentText: "text-[#C8A97E]",
    accentBorder: "border-[#C8A97E]/45",
    glowColor: "from-[#C8A97E]/15 via-transparent to-emerald-500/10",
  },
  E: {
    id: "E",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#0D1826]",
    bgSecondary: "bg-[#08101A]",
    cardBg: "bg-[#111F30]/95",
    accentText: "text-[#C8A97E]",
    accentBorder: "border-[#C8A97E]/45",
    glowColor: "from-[#C8A97E]/15 via-transparent to-emerald-500/10",
  },
  F: {
    id: "F",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#0D1826]",
    bgSecondary: "bg-[#08101A]",
    cardBg: "bg-[#111F30]/95",
    accentText: "text-[#C8A97E]",
    accentBorder: "border-[#C8A97E]/45",
    glowColor: "from-[#C8A97E]/15 via-transparent to-emerald-500/10",
  },
};

export function StencilSerifX({
  color = "#C8A97E",
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
      {/* Standalone Architectural Stencil 'X' Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          compact ? "w-9 h-9" : "w-11 h-11"
        }`}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full shadow-lg">
          <rect
            width="60"
            height="60"
            x="2"
            y="2"
            rx="9"
            fill="#0F1C2E"
            stroke="#C8A97E"
            strokeOpacity="0.5"
            strokeWidth="2"
          />
          <g fill="#C8A97E">
            <polygon points="10,13 28,13 28,16.5 23.5,16.5 45.5,47.5 51,47.5 51,51 33,51 33,47.5 37.5,47.5 15.5,16.5 10,16.5" />
            <polygon points="36,13 52,13 52,16.5 46.8,16.5 36.2,29.5 32.8,24.8 41.2,16.5 36,16.5" />
            <polygon points="24.8,34.5 28.2,39.2 19.8,47.5 25,47.5 25,51 9,51 9,47.5 14.2,47.5" />
          </g>
        </svg>
      </div>

      {/* Editorial Lowercase Serif Wordmark: iwantse[x]now.ch */}
      <div className="flex flex-col">
        <span
          className={`font-serif font-bold tracking-[-0.02em] leading-none flex items-baseline text-[#F8F6F0] ${
            compact ? "text-xl" : "text-2xl md:text-[30px]"
          }`}
        >
          <span>iwantse</span>
          <StencilSerifX
            color="#C8A97E"
            className={
              compact
                ? "w-[18px] h-[15px] mx-[0.5px] translate-y-[1.5px]"
                : "w-[23px] h-[19px] md:w-[26px] md:h-[21px] mx-[0.5px] translate-y-[2px]"
            }
          />
          <span>now.ch</span>
        </span>
        <span className="text-[8.5px] uppercase tracking-[0.22em] text-gray-300/90 font-sans font-semibold mt-1">
          SWISS ESCORT INDEX & DIRECT BOOKING
        </span>
      </div>
    </div>
  );
}