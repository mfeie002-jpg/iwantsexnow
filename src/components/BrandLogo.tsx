import React, { useEffect } from "react";

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
    bladeOne: string;
    bladeTwo: string;
    faviconBg: string;
  }
> = {
  A: {
    id: "A",
    shortLabel: "A · Swiss Blade X",
    name: "Swiss Cross-Blade X (Obsidian, Gold & Swiss Crimson)",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#080C14]",
    bgSecondary: "bg-[#05080E]",
    cardBg: "bg-[#0C1320]/95",
    accentText: "text-[#D5A021]",
    accentBorder: "border-[#E11D48]/45",
    glowColor: "from-[#E11D48]/15 via-transparent to-[#D5A021]/15",
    bladeOne: "#E11D48",
    bladeTwo: "#F6E27A",
    faviconBg: "#080C14",
  },
  B: {
    id: "B",
    shortLabel: "B · Neon Velvet X",
    name: "Velvet Club X (Deep Bordeaux, Hot Rose & Rose-Gold)",
    subtitle: "THE SWISS ADULT INDEX & VIP CONCIERGE",
    bgPrimary: "bg-[#130710]",
    bgSecondary: "bg-[#0B0409]",
    cardBg: "bg-[#1C0A17]/95",
    accentText: "text-[#FF2A85]",
    accentBorder: "border-[#FF2A85]/50",
    glowColor: "from-[#FF2A85]/20 via-transparent to-[#E6B980]/15",
    bladeOne: "#FF2A85",
    bladeTwo: "#FAD6A5",
    faviconBg: "#130710",
  },
  C: {
    id: "C",
    shortLabel: "C · Gold Bullion X",
    name: "24k Gold Vault X (Midnight Navy & Pure Champagne Gold)",
    subtitle: "SWITZERLAND'S VERIFIED DIRECT INDEX",
    bgPrimary: "bg-[#0B1623]",
    bgSecondary: "bg-[#07101A]",
    cardBg: "bg-[#09131E]/95",
    accentText: "text-[#F6E27A]",
    accentBorder: "border-[#C69C6D]/55",
    glowColor: "from-[#C69C6D]/20 via-transparent to-emerald-500/10",
    bladeOne: "#C69C6D",
    bladeTwo: "#FFF0A8",
    faviconBg: "#0B1623",
  },
  D: {
    id: "D",
    shortLabel: "D · Radar Search X",
    name: "Cyber Search-Visor X (Tech Slate, Electric Cyan & Gold)",
    subtitle: "7.021+ INSERATE · ECHTE ENDPREISE",
    bgPrimary: "bg-[#071020]",
    bgSecondary: "bg-[#040914]",
    cardBg: "bg-[#0B1830]/95",
    accentText: "text-[#38BDF8]",
    accentBorder: "border-sky-400/50",
    glowColor: "from-sky-500/20 via-transparent to-[#F3D078]/15",
    bladeOne: "#38BDF8",
    bladeTwo: "#F3D078",
    faviconBg: "#071020",
  },
  E: {
    id: "E",
    shortLabel: "E · Emerald X",
    name: "Geneva Private Vault X (Deep Racing Green & Gold)",
    subtitle: "SWISS DIRECT BOOKING & MARKET INDEX",
    bgPrimary: "bg-[#061512]",
    bgSecondary: "bg-[#040E0C]",
    cardBg: "bg-[#0A211C]/95",
    accentText: "text-[#10B981]",
    accentBorder: "border-emerald-400/50",
    glowColor: "from-emerald-500/20 via-transparent to-[#D4AF37]/15",
    bladeOne: "#10B981",
    bladeTwo: "#D4AF37",
    faviconBg: "#061512",
  },
  F: {
    id: "F",
    shortLabel: "F · Amethyst X",
    name: "Zurich Midnight X (Noir Violet, Neon Purple & Gold)",
    subtitle: "LIVE-CAM · DIRECT BOOKING · SWISS INDEX",
    bgPrimary: "bg-[#0E0717]",
    bgSecondary: "bg-[#08040E]",
    cardBg: "bg-[#160C25]/95",
    accentText: "text-[#C084FC]",
    accentBorder: "border-purple-400/50",
    glowColor: "from-purple-500/20 via-transparent to-[#F6E27A]/15",
    bladeOne: "#A855F7",
    bladeTwo: "#F6E27A",
    faviconBg: "#0E0717",
  },
};

export function updateDynamicFavicon(variant: BrandThemeId) {
  if (typeof document === "undefined") return;
  const t = BRAND_THEMES[variant] || BRAND_THEMES.A;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
    <rect width="64" height="64" rx="15" fill="${t.faviconBg}" stroke="${t.bladeTwo}" stroke-width="2.8"/>
    <polygon points="46,11 54,11 18,53 10,53" fill="${t.bladeOne}"/>
    <polygon points="10,11 19,11 54,53 45,53" fill="${t.bladeTwo}"/>
    <circle cx="32" cy="32" r="6" fill="${t.faviconBg}" stroke="${t.bladeTwo}" stroke-width="1.2"/>
    <path d="M31 28.5 H33 V31 H35.5 V33 H33 V35.5 H31 V33 H28.5 V31 H31 Z" fill="#FFFFFF"/>
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
}: {
  compact?: boolean;
  variant?: BrandThemeId;
}) {
  const theme = BRAND_THEMES[variant] || BRAND_THEMES.A;

  useEffect(() => {
    updateDynamicFavicon(variant);
  }, [variant]);

  return (
    <div className="flex items-center gap-3 group select-none">
      {/* Standalone X-Favicon Emblem */}
      <div
        className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${
          compact ? "w-10 h-10" : "w-12 h-12"
        }`}
      >
        <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_4px_14px_rgba(225,29,72,0.35)]">
          <rect
            width="60"
            height="60"
            x="2"
            y="2"
            rx="15"
            fill={theme.faviconBg}
            stroke={theme.bladeTwo}
            strokeWidth="2.4"
          />
          {variant === "D" ? (
            <circle cx="32" cy="32" r="22" fill="none" stroke={theme.bladeOne} strokeWidth="1.2" strokeDasharray="4 3" />
          ) : (
            <polygon points="32,7 57,32 32,57 7,32" fill="none" stroke={theme.bladeTwo} strokeOpacity="0.22" strokeWidth="1.1" />
          )}
          {/* Crossing Blade 1 */}
          <polygon points="45,12 53,12 19,52 11,52" fill={theme.bladeOne} />
          {/* Crossing Blade 2 */}
          <polygon points="11,12 20,12 53,52 44,52" fill={theme.bladeTwo} />
          {/* Swiss Cross (+) in the center of the X */}
          <circle cx="32" cy="32" r="6" fill={theme.faviconBg} stroke={theme.bladeTwo} strokeWidth="1.2" />
          <path d="M31 28.5 H33 V31 H35.5 V33 H33 V35.5 H31 V33 H28.5 V31 H31 Z" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Wordmark with Hero 'X' */}
      <div className="flex flex-col">
        <span className={`font-black tracking-tight leading-none flex items-baseline ${compact ? "text-xl" : "text-2xl md:text-3xl"}`}>
          <span className="text-white font-sans">iWant</span>
          <span className="text-gray-200 font-serif italic ml-0.5">Se</span>
          {/* The Standout 'X' inside the wordmark */}
          <span
            className="inline-block font-sans font-black mx-0.5 transform -skew-x-6 scale-115 drop-shadow-[0_2px_10px_rgba(225,29,72,0.45)]"
            style={{
              backgroundImage: `linear-gradient(135deg, ${theme.bladeTwo} 0%, ${theme.bladeOne} 55%, ${theme.bladeTwo} 100%)`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            X
          </span>
          <span className="text-white font-sans">Now</span>
          <span
            className="text-xs md:text-sm font-sans font-extrabold ml-1 px-1.5 py-0.5 rounded-md border"
            style={{
              color: theme.bladeTwo,
              borderColor: `${theme.bladeOne}66`,
              backgroundColor: `${theme.bladeOne}1F`,
            }}
          >
            .ch
          </span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-300 font-sans font-semibold mt-1 flex items-center gap-1.5">
          <span className="inline-block w-1.5 h-1.5 rotate-45" style={{ backgroundColor: theme.bladeOne }} />
          {theme.subtitle}
        </span>
      </div>
    </div>
  );
}