import React from "react";
import { PAL } from "./art";

export type CategoryKey = "female" | "massage" | "bdsm" | "trans" | "vip" | "clubs";

const S = 300;
const INK = PAL.nacht;

export const CATEGORY_META: Record<CategoryKey, { label: string; blurb: string; note: string; bg: string }> = {
  female: { label: "Escort & GFE", blurb: "Dinner, Hotel und Girlfriend-Feeling", note: "zum Anstossen", bg: "#ffd3dc" },
  massage: { label: "Tantra & Massage", blurb: "Öl, Kerzen und Zeit zum Runterkommen", note: "Zeit für dich", bg: "#bfebd6" },
  bdsm: { label: "Domina & BDSM", blurb: "Klare Regeln, Studios mit Türschild", note: "mit Regeln", bg: "#dcd3f7" },
  trans: { label: "Trans", blurb: "Verifizierte Anzeigen, klare Preise", note: "ganz offen", bg: "#c6dffa" },
  vip: { label: "VIP", blurb: "Penthouse, Outcall und Premium", note: "Zimmer 1201", bg: "#ffe48a" },
  clubs: { label: "Clubs & Studios", blurb: "Adressen, Öffnungszeiten, Routen", note: "heute offen", bg: "#ffd9c2" },
};

const stroke = { stroke: INK, strokeWidth: 3.2, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

const Spark = ({ x, y, s = 1, fill = "#fff" }: { x: number; y: number; s?: number; fill?: string }) => (
  <path
    transform={`translate(${x} ${y}) scale(${s})`}
    d="M0,-14 C1.5,-5 5,-1.5 14,0 C5,1.5 1.5,5 0,14 C-1.5,5 -5,1.5 -14,0 C-5,-1.5 -1.5,-5 0,-14 Z"
    fill={fill}
    {...stroke}
    strokeWidth={2.4}
  />
);

const Coupe = ({ x, y, rot }: { x: number; y: number; rot: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M-34,-8 Q-34,38 0,46 Q34,38 34,-8 Z" fill="#fff" {...stroke} />
    <path d="M-30,8 Q-27,38 0,43 Q27,38 30,8 Z" fill="#ffe48a" />
    <path d="M-34,-8 Q-34,38 0,46 Q34,38 34,-8 Z" fill="none" {...stroke} />
    <path d="M0,46 V92" {...stroke} strokeWidth={5} />
    <ellipse cx={0} cy={96} rx={26} ry={7} fill="#fff" {...stroke} />
  </g>
);

function Art({ kind }: { kind: CategoryKey }) {
  const bg = CATEGORY_META[kind].bg;
  if (kind === "female") {
    return (
      <g>
        <rect width={S} height={S} fill={bg} />
        <circle cx={150} cy={140} r={104} fill="#fff" opacity={0.45} />
        <Coupe x={108} y={118} rot={13} />
        <Coupe x={192} y={118} rot={-13} />
        <Spark x={150} y={76} s={1.25} fill="#ffe48a" />
        <Spark x={58} y={64} s={0.7} />
        <Spark x={246} y={92} s={0.8} fill="#d92b52" />
        <circle cx={132} cy={54} r={5} fill="#fff" {...stroke} strokeWidth={2} />
        <circle cx={172} cy={40} r={3.5} fill="#fff" {...stroke} strokeWidth={2} />
        <path d="M232,226 c-8,-12 -24,-4 -16,10 c4,7 16,13 16,13 s12,-6 16,-13 c8,-14 -8,-22 -16,-10 z" fill="#d92b52" {...stroke} />
      </g>
    );
  }
  if (kind === "massage") {
    return (
      <g>
        <rect width={S} height={S} fill={bg} />
        <circle cx={150} cy={150} r={112} fill="#fff" opacity={0.4} />
        <ellipse cx={150} cy={254} rx={112} ry={14} fill={INK} opacity={0.14} />
        <ellipse cx={142} cy={236} rx={62} ry={22} fill="#dcd3f7" {...stroke} />
        <ellipse cx={146} cy={200} rx={46} ry={18} fill="#ffd3dc" {...stroke} />
        <ellipse cx={142} cy={170} rx={32} ry={14} fill="#c6dffa" {...stroke} />
        <rect x={218} y={170} width={42} height={68} rx={8} fill="#fffaf0" {...stroke} />
        <path d="M239,164 C226,146 240,136 239,118 C254,134 254,150 239,164 Z" fill="#ffc21f" {...stroke} />
        <path d="M32,248 C28,200 48,160 78,140 C84,176 74,222 44,252 Z" fill="#2faa7e" {...stroke} />
        <path d="M44,252 C52,210 62,176 78,140" fill="none" {...stroke} strokeWidth={2.4} />
        <path d="M70,250 C74,214 100,186 128,176 C126,214 108,242 76,256 Z" fill="#5ec59b" {...stroke} />
        <Spark x={248} y={92} s={0.7} />
      </g>
    );
  }
  if (kind === "bdsm") {
    return (
      <g>
        <rect width={S} height={S} fill={bg} />
        <circle cx={150} cy={140} r={108} fill="#fff" opacity={0.4} />
        <ellipse cx={150} cy={250} rx={118} ry={14} fill={INK} opacity={0.15} />
        {[70, 230].map((x) => (
          <g key={x}>
            <rect x={x - 5} y={120} width={10} height={124} rx={4} fill="#ffd34d" {...stroke} />
            <circle cx={x} cy={112} r={15} fill="#ffd34d" {...stroke} />
            <ellipse cx={x} cy={246} rx={27} ry={8} fill="#ffd34d" {...stroke} />
            <circle cx={x - 5} cy={107} r={4} fill="#fff" />
          </g>
        ))}
        <path d="M70,130 C100,218 200,218 230,130" fill="none" stroke={INK} strokeWidth={13} strokeLinecap="round" />
        <path d="M70,130 C100,218 200,218 230,130" fill="none" stroke="#d92b52" strokeWidth={8} strokeLinecap="round" />
        <path d="M86,152 C108,196 192,196 214,152" fill="none" stroke="#ff7a98" strokeWidth={2} strokeLinecap="round" opacity={0.8} />
        <Spark x={150} y={64} s={0.9} fill="#fff" />
      </g>
    );
  }
  if (kind === "trans") {
    return (
      <g>
        <rect width={S} height={S} fill={bg} />
        <circle cx={150} cy={160} r={118} fill="#fff" opacity={0.4} />
        <circle cx={150} cy={160} r={96} fill="#5bcefa" {...stroke} />
        <circle cx={150} cy={160} r={74} fill="#f5a9b8" {...stroke} />
        <circle cx={150} cy={160} r={52} fill="#ffffff" {...stroke} />
        <circle cx={150} cy={160} r={30} fill="#f5a9b8" {...stroke} />
        <circle cx={150} cy={160} r={12} fill="#5bcefa" {...stroke} />
        <path d="M44,70 c0,-14 22,-18 28,-6 c10,-8 26,0 22,12 H48 c-6,0 -8,-4 -4,-6 z" fill="#fff" {...stroke} strokeWidth={2.6} />
        <Spark x={250} y={64} s={0.9} fill="#ffe48a" />
        <Spark x={262} y={236} s={0.6} />
      </g>
    );
  }
  if (kind === "vip") {
    return (
      <g>
        <rect width={S} height={S} fill={bg} />
        <circle cx={150} cy={150} r={116} fill="#fff" opacity={0.45} />
        <g transform="rotate(-16 150 150)">
          <rect x={92} y={44} width={116} height={132} rx={16} fill="#d92b52" {...stroke} />
          <circle cx={150} cy={64} r={8} fill={bg} {...stroke} strokeWidth={2.6} />
          <text x={150} y={134} textAnchor="middle" fontFamily="Bricolage Grotesque, Figtree, Arial, sans-serif" fontWeight={800} fontSize={44} fill="#fff">1201</text>
          <path d="M150,176 V204" {...stroke} strokeWidth={8} />
          <path d="M150,176 V204" stroke="#ffd34d" strokeWidth={3} strokeLinecap="round" />
          <circle cx={150} cy={226} r={22} fill="none" stroke={INK} strokeWidth={12} />
          <circle cx={150} cy={226} r={22} fill="none" stroke="#ffd34d" strokeWidth={6} />
          <path d="M150,248 V270 M150,262 h12 M150,270 h9" stroke={INK} strokeWidth={10} strokeLinecap="round" />
          <path d="M150,248 V270 M150,262 h12 M150,270 h9" stroke="#ffd34d" strokeWidth={4.5} strokeLinecap="round" />
        </g>
        <Spark x={248} y={70} s={0.9} />
        <Spark x={52} y={232} s={0.7} fill="#d92b52" />
      </g>
    );
  }
  // clubs
  return (
    <g>
      <rect width={S} height={S} fill={bg} />
      <circle cx={150} cy={140} r={112} fill="#fff" opacity={0.42} />
      <rect x={52} y={72} width={196} height={186} fill="#2b2f6b" {...stroke} />
      <rect x={44} y={62} width={212} height={16} fill="#3a3f7a" {...stroke} />
      {Array.from({ length: 10 }, (_, i) => {
        const col = i % 5;
        const row = Math.floor(i / 5);
        const lit = i % 3 !== 1;
        return <rect key={i} x={68 + col * 36} y={92 + row * 28} width={22} height={18} rx={2} fill={lit ? "#ffd34d" : "#4b5099"} />;
      })}
      <rect x={76} y={150} width={148} height={50} rx={12} fill="#fff" {...stroke} />
      <rect x={82} y={156} width={136} height={38} rx={9} fill="none" stroke="#d92b52" strokeWidth={3} />
      <text x={150} y={184} textAnchor="middle" fontFamily="Bricolage Grotesque, Figtree, Arial, sans-serif" fontWeight={800} fontSize={27} letterSpacing={2} fill="#d92b52">OPEN</text>
      <rect x={126} y={214} width={48} height={44} fill="#ffe48a" {...stroke} />
      <path d="M150,214 V258" {...stroke} strokeWidth={2.4} />
      <ellipse cx={150} cy={262} rx={122} ry={10} fill={INK} opacity={0.15} />
      <Spark x={266} y={60} s={0.8} />
    </g>
  );
}

export function CategoryPoster({ kind, className, title }: { kind: CategoryKey; className?: string; title?: string }) {
  return (
    <svg
      viewBox={`0 0 ${S} ${S}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title || CATEGORY_META[kind].label}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <Art kind={kind} />
    </svg>
  );
}
