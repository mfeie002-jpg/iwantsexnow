import React from "react";
import { BrandMark, Wordmark } from "@/components/visuals";

export type BrandThemeId = "A" | "B" | "C" | "D" | "E" | "F";

export function StencilSerifX({
  color = "#ff6b5e",
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
    <div className="group flex select-none items-center gap-3">
      <BrandMark size={compact ? 36 : 46} className="shrink-0 transition-transform duration-300 group-hover:-rotate-3" />
      <div className="flex flex-col">
        <Wordmark className={compact ? "text-xl text-[#f2f7f6]" : "text-2xl text-[#f2f7f6] md:text-[28px]"} />
        <span className="mt-1.5 text-xs font-semibold text-[#9fb8b5]">Vergleichen &amp; direkt buchen</span>
      </div>
    </div>
  );
}
