<<<<<<< HEAD
import React, { useEffect } from "react";
=======
import React from "react";
>>>>>>> e08451b5c0ec969df720a00309195978da28eb1b

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
<<<<<<< HEAD
    wordColor: string;
    xColor: string;
    iconBg: string;
    iconFg: string;
    iconShape: "square" | "circle";
=======
>>>>>>> e08451b5c0ec969df720a00309195978da28eb1b
  }
> = {
  A: {
    id: "A",
<<<<<<< HEAD
    shortLabel: "A · Navy & Sand (Primary)",
    name: "Primary Brand Sheet (Deep Navy & Champagne Sand #C8A97E)",
=======
    shortLabel: "Primary",
    name: "Primary Brand Identity (Deep Navy & Champagne Sand #C8A97E)",
>>>>>>> e08451b5c0ec969df720a00309195978da28eb1b
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#0D1826]",
    bgSecondary: "bg-[#08101A]",
    cardBg: "bg-[#111F30]/95",
    accentText: "text-[#C8A97E]",
    accentBorder: "border-[#C8A97E]/45",
    glowColor: "from-[#C8A97E]/15 via-transparent to-emerald-500/10",
<<<<<<< HEAD
    wordColor: "#F8F6F0",
    xColor: "#C8A97E",
    iconBg: "#0F1C2E",
    iconFg: "#C8A97E",
    iconShape: "square",
  },
  B: {
    id: "B",
    shortLabel: "B · Rich Gold & Charcoal",
    name: "Variant B (Charcoal Slate & Brushed Rich Gold #A68354)",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#181A1D]",
    bgSecondary: "bg-[#101214]",
    cardBg: "bg-[#22252A]/95",
    accentText: "text-[#C59B6D]",
    accentBorder: "border-[#A68354]/50",
    glowColor: "from-[#A68354]/20 via-transparent to-[#C8A97E]/10",
    wordColor: "#EAE6DF",
    xColor: "#B68D58",
    iconBg: "#2C2E30",
    iconFg: "#C8A97E",
    iconShape: "circle",
  },
  C: {
    id: "C",
    shortLabel: "C · Deep Red & Off-Black",
    name: "Variant C (Editorial Off-Black & Deep Bordeaux Red #832838)",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#111113]",
    bgSecondary: "bg-[#0A0A0C]",
    cardBg: "bg-[#18181C]/95",
    accentText: "text-[#B83B52]",
    accentBorder: "border-[#832838]/55",
    glowColor: "from-[#832838]/25 via-transparent to-[#C8A97E]/10",
    wordColor: "#F5F3EF",
    xColor: "#9E2A3F",
    iconBg: "#161618",
    iconFg: "#9E2A3F",
    iconShape: "square",
  },
  D: {
    id: "D",
    shortLabel: "D · Sand Tile & Navy X",
    name: "Favicon Tile #1 (Inverted Champagne Sand Tile & Deep Navy)",
    subtitle: "7.021+ INSERATE · ECHTE ENDPREISE",
    bgPrimary: "bg-[#0B1522]",
    bgSecondary: "bg-[#070E17]",
    cardBg: "bg-[#0F1D2E]/95",
    accentText: "text-[#D4B483]",
    accentBorder: "border-[#D4B483]/50",
    glowColor: "from-[#D4B483]/20 via-transparent to-sky-500/10",
    wordColor: "#FFFFFF",
    xColor: "#D4B483",
    iconBg: "#C8A97E",
    iconFg: "#0F1C2E",
    iconShape: "square",
  },
  E: {
    id: "E",
    shortLabel: "E · Warm Ivory Editorial",
    name: "Luxury Print Look (Dark Espresso & Dual-Tone Bordeaux/Gold X)",
    subtitle: "SWISS PRIVATE CONCIERGE & INDEX",
    bgPrimary: "bg-[#141115]",
    bgSecondary: "bg-[#0C0A0D]",
    cardBg: "bg-[#1D1820]/95",
    accentText: "text-[#C8A97E]",
    accentBorder: "border-[#C8A97E]/45",
    glowColor: "from-[#832838]/20 via-transparent to-[#C8A97E]/15",
    wordColor: "#F7F4EE",
    xColor: "#C8A97E",
    iconBg: "#1D1820",
    iconFg: "#C8A97E",
    iconShape: "circle",
  },
  F: {
    id: "F",
    shortLabel: "F · Short Form 'isx'",
    name: "Discreet Monogram Mode ('isx' Short Form + Full Subline)",
    subtitle: "IWANTSEXNOW.CH · SWISS VERIFIED INDEX",
=======
  },
  B: {
    id: "B",
    shortLabel: "Primary",
    name: "Primary Brand Identity",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
>>>>>>> e08451b5c0ec969df720a00309195978da28eb1b
    bgPrimary: "bg-[#0D1826]",
    bgSecondary: "bg-[#08101A]",
    cardBg: "bg-[#111F30]/95",
    accentText: "text-[#C8A97E]",
<<<<<<< HEAD
    accentBorder: "border-[#C8A97E]/50",
    glowColor: "from-[#C8A97E]/15 via-transparent to-[#832838]/15",
    wordColor: "#FFFFFF",
    xColor: "#C8A97E",
    iconBg: "#0F1C2E",
    iconFg: "#C8A97E",
    iconShape: "circle",
=======
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
>>>>>>> e08451b5c0ec969df720a00309195978da28eb1b
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

<<<<<<< HEAD
export function updateDynamicFavicon(variant: BrandThemeId) {
  if (typeof document === "undefined") return;
  const t = BRAND_THEMES[variant] || BRAND_THEMES.A;
  const bgShape =
    t.iconShape === "circle"
      ? `<circle cx="32" cy="32" r="30" fill="${t.iconBg}" stroke="${t.iconFg}" stroke-opacity="0.35" stroke-width="1.5"/>`
      : `<rect width="64" height="64" rx="8" fill="${t.iconBg}" stroke="${t.iconFg}" stroke-opacity="0.35" stroke-width="1.5"/>`;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    ${bgShape}
    <g fill="${t.iconFg}">
      <polygon points="10,13 28,13 28,16.5 23.5,16.5 45.5,47.5 51,47.5 51,51 33,51 33,47.5 37.5,47.5 15.5,16.5 10,16.5"/>
      <polygon points="36,13 52,13 52,16.5 46.8,16.5 36.2,29.5 32.8,24.8 41.2,16.5 36,16.5"/>
      <polygon points="24.8,34.5 28.2,39.2 19.8,47.5 25,47.5 25,51 9,51 9,47.5 14.2,47.5"/>
    </g>
  </svg>`;
  const encoded = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  let link = document.querySelector("link[rel='icon']") as HTMLLinkElement | null;
  if (!link) {
    link = document.createElement("link");
    link.rel = "icon";
    document.head.appendChild(link);
  }
  link.href = encoded;
}

export function BrandLogo({
  compact = false,
  variant = "A",
=======
export function BrandLogo({
  compact = false,
>>>>>>> e08451b5c0ec969df720a00309195978da28eb1b
}: {
  compact?: boolean;
  variant?: BrandThemeId;
}) {
<<<<<<< HEAD
  const theme = BRAND_THEMES[variant] || BRAND_THEMES.A;

  useEffect(() => {
    updateDynamicFavicon(variant);
  }, [variant]);

  return (
    <div className="flex items-center gap-3.5 group select-none">
=======
  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Standalone Architectural Stencil 'X' Emblem */}
>>>>>>> e08451b5c0ec969df720a00309195978da28eb1b
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          compact ? "w-9 h-9" : "w-11 h-11"
        }`}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full shadow-lg">
<<<<<<< HEAD
          {theme.iconShape === "circle" ? (
            <circle
              cx="32"
              cy="32"
              r="30"
              fill={theme.iconBg}
              stroke={theme.xColor}
              strokeOpacity="0.45"
              strokeWidth="2"
            />
          ) : (
            <rect
              width="60"
              height="60"
              x="2"
              y="2"
              rx="8"
              fill={theme.iconBg}
              stroke={theme.xColor}
              strokeOpacity="0.45"
              strokeWidth="2"
            />
          )}
          <g fill={theme.iconFg}>
=======
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
>>>>>>> e08451b5c0ec969df720a00309195978da28eb1b
            <polygon points="10,13 28,13 28,16.5 23.5,16.5 45.5,47.5 51,47.5 51,51 33,51 33,47.5 37.5,47.5 15.5,16.5 10,16.5" />
            <polygon points="36,13 52,13 52,16.5 46.8,16.5 36.2,29.5 32.8,24.8 41.2,16.5 36,16.5" />
            <polygon points="24.8,34.5 28.2,39.2 19.8,47.5 25,47.5 25,51 9,51 9,47.5 14.2,47.5" />
          </g>
        </svg>
      </div>

<<<<<<< HEAD
      <div className="flex flex-col">
        {variant === "F" ? (
          <span
            className={`font-serif font-bold tracking-tight leading-none flex items-baseline ${
              compact ? "text-2xl" : "text-3xl md:text-4xl"
            }`}
            style={{ color: theme.wordColor }}
          >
            <span>is</span>
            <StencilSerifX
              color={theme.xColor}
              className={compact ? "w-5 h-4 -ml-0.5 translate-y-[1px]" : "w-7 h-6 -ml-0.5 translate-y-[2px]"}
            />
            <span className="text-xs font-sans font-semibold tracking-widest uppercase ml-2 text-[#C8A97E]">
              iwantsexnow.ch
            </span>
          </span>
        ) : (
          <span
            className={`font-serif font-bold tracking-[-0.02em] leading-none flex items-baseline ${
              compact ? "text-xl" : "text-2xl md:text-[31px]"
            }`}
            style={{ color: theme.wordColor }}
          >
            <span>iwantse</span>
            <StencilSerifX
              color={theme.xColor}
              className={
                compact
                  ? "w-[18px] h-[15px] mx-[0.5px] translate-y-[1.5px]"
                  : "w-[23px] h-[19px] md:w-[26px] md:h-[21px] mx-[0.5px] translate-y-[2px]"
              }
            />
            <span>now.ch</span>
          </span>
        )}
        <span className="text-[9px] uppercase tracking-[0.22em] text-gray-300/90 font-sans font-semibold mt-1">
          {theme.subtitle}
=======
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
>>>>>>> e08451b5c0ec969df720a00309195978da28eb1b
        </span>
      </div>
    </div>
  );
}