import React from "react";

/**
 * Paper-cut landscape band: sun, soft ridges, rolling hills.
 * 1600x420 art, cropped with `slice` so it works from phone to ultrawide.
 */
export function HeroScene({ className, align = "xMidYMax" }: { className?: string; align?: string }) {
  return (
    <svg viewBox="0 0 1600 420" preserveAspectRatio={`${align} slice`} aria-hidden="true" focusable="false" className={className} xmlns="http://www.w3.org/2000/svg">
      <circle cx="1210" cy="150" r="84" fill="#ffe48a" />
      <g fill="#fff" opacity="0.9">
        <ellipse cx="300" cy="96" rx="74" ry="20" />
        <ellipse cx="262" cy="82" rx="34" ry="22" />
        <ellipse cx="326" cy="76" rx="40" ry="26" />
        <ellipse cx="820" cy="58" rx="56" ry="15" />
        <ellipse cx="796" cy="48" rx="26" ry="16" />
        <ellipse cx="842" cy="44" rx="30" ry="18" />
      </g>
      <path d="M0,300 L130,170 L230,250 L350,120 L470,250 L560,200 L700,300 V420 H0 Z" fill="#dcd3f7" />
      <path d="M520,300 L690,150 L790,230 L880,170 L1010,290 L1100,240 L1240,300 V420 H520 Z" fill="#c6dffa" />
      <path d="M1000,300 L1160,190 L1260,250 L1380,140 L1500,240 L1600,200 V420 H1000 Z" fill="#dcd3f7" />
      <path d="M0,350 C180,310 340,318 520,346 S860,372 1060,340 S1420,306 1600,344 V420 H0 Z" fill="#a6e0c3" />
      <path d="M0,386 C220,356 420,372 640,392 S1040,404 1260,380 S1500,366 1600,384 V420 H0 Z" fill="#bfebd6" />
    </svg>
  );
}
