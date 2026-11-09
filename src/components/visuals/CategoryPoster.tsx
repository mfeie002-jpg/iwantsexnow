import React, { useId } from "react";
import { PAL, scatter, uid } from "./art";

export type CategoryKey = "female" | "massage" | "bdsm" | "trans" | "vip" | "clubs";

const W = 400;
const H = 520;

export const CATEGORY_META: Record<CategoryKey, { label: string; blurb: string }> = {
  female: { label: "Escort & GFE", blurb: "Dinner, Hotel, Girlfriend Experience" },
  massage: { label: "Tantra & Massage", blurb: "Studios, Öl-Rituale, Entspannung" },
  bdsm: { label: "Domina & BDSM", blurb: "Studios mit Türschild und Regeln" },
  trans: { label: "Trans", blurb: "Verifizierte Anzeigen, klare Preise" },
  vip: { label: "VIP", blurb: "Penthouse, Outcall, Premium" },
  clubs: { label: "Clubs & Studios", blurb: "Adressen, Öffnungszeiten, Routen" },
};

const Coupe = ({ x, y, rot }: { x: number; y: number; rot: number }) => (
  <g transform={`translate(${x} ${y}) rotate(${rot})`}>
    <path d="M-34,-6 Q-34,46 0,52 Q34,46 34,-6 Z" fill="#fff" opacity={0.16} stroke="#fff" strokeOpacity={0.55} strokeWidth={1.5} />
    <path d="M-30,14 Q-28,46 0,50 Q28,46 30,14 Z" fill={PAL.bernstein} opacity={0.88} />
    <rect x={-2.2} y={50} width={4.4} height={52} fill="#fff" opacity={0.6} />
    <ellipse cx={0} cy={104} rx={28} ry={5.5} fill="#fff" opacity={0.6} />
  </g>
);

function Art({ kind, id }: { kind: CategoryKey; id: string }) {
  if (kind === "female") {
    const bokeh = scatter(4, 26, W, 330, 5, 26);
    return (
      <g>
        <rect width={W} height={H} fill={`url(#${id}a)`} />
        {bokeh.map((b, i) => (
          <circle key={i} cx={b.x} cy={b.y + 40} r={b.r} fill={i % 3 === 0 ? PAL.rose : i % 3 === 1 ? PAL.bernstein : "#fff"} opacity={b.o * 0.28} />
        ))}
        <path d="M200,0 V360 M0,170 H400" stroke={PAL.nacht} strokeOpacity={0.5} strokeWidth={9} />
        <rect x={0} y={388} width={W} height={H - 388} fill={PAL.nacht} opacity={0.88} />
        <rect x={0} y={388} width={W} height={2} fill={PAL.bernstein} opacity={0.6} />
        <Coupe x={150} y={246} rot={14} />
        <Coupe x={250} y={246} rot={-14} />
        <path d="M200,214 l5,-16 l5,16 l16,5 l-16,5 l-5,16 l-5,-16 l-16,-5 z" fill="#fff" opacity={0.95} />
        <circle cx={200} cy={219} r={36} fill="#fff" opacity={0.1} />
      </g>
    );
  }
  if (kind === "massage") {
    return (
      <g>
        <rect width={W} height={H} fill={`url(#${id}a)`} />
        <path d="M70,0 C40,80 110,120 80,200 S120,300 90,360" stroke="#fff" strokeOpacity={0.1} strokeWidth={26} fill="none" strokeLinecap="round" />
        <path d="M330,40 C300,110 360,150 330,230" stroke="#fff" strokeOpacity={0.08} strokeWidth={18} fill="none" strokeLinecap="round" />
        <ellipse cx={200} cy={420} rx={170} ry={44} fill="none" stroke={PAL.lago} strokeOpacity={0.35} />
        <ellipse cx={200} cy={420} rx={120} ry={30} fill="none" stroke={PAL.lago} strokeOpacity={0.45} />
        <ellipse cx={200} cy={420} rx={72} ry={17} fill={PAL.nacht} opacity={0.5} />
        <ellipse cx={200} cy={392} rx={64} ry={20} fill="#1e2f33" />
        <ellipse cx={200} cy={366} rx={48} ry={16} fill="#2a4147" />
        <ellipse cx={200} cy={346} rx={30} ry={11} fill="#38585f" />
        <path d="M176,342 q24,-8 48,0" stroke="#fff" strokeOpacity={0.3} strokeWidth={2} fill="none" />
        <rect x={300} y={360} width={34} height={46} rx={6} fill="#f2e3d0" />
        <path d="M317,356 C305,338 317,326 317,312 C329,326 329,340 317,356 Z" fill={PAL.bernstein} />
        <circle cx={317} cy={340} r={34} fill={PAL.bernstein} opacity={0.16} />
        <rect x={80} y={366} width={22} height={44} rx={9} fill={PAL.glueh} opacity={0.9} />
        <rect x={85} y={352} width={12} height={16} rx={3} fill="#f2e3d0" />
      </g>
    );
  }
  if (kind === "bdsm") {
    return (
      <g>
        <rect width={W} height={H} fill={`url(#${id}a)`} />
        <path d={`M200,-10 L40,${H} H360 Z`} fill="#fff" opacity={0.08} />
        <path d={`M200,-10 L110,${H} H290 Z`} fill="#fff" opacity={0.08} />
        <rect x={0} y={400} width={W} height={H - 400} fill="#14050c" />
        <ellipse cx={200} cy={440} rx={150} ry={20} fill={PAL.rose} opacity={0.25} />
        {[88, 312].map((x) => (
          <g key={x}>
            <rect x={x - 4} y={230} width={8} height={170} fill={PAL.bernstein} />
            <circle cx={x} cy={224} r={13} fill={PAL.bernstein} />
            <ellipse cx={x} cy={402} rx={26} ry={6} fill={PAL.bernstein} />
            <circle cx={x - 3} cy={220} r={4} fill="#fff" opacity={0.7} />
          </g>
        ))}
        <path d="M88,250 C120,330 280,330 312,250" stroke="#d9234f" strokeWidth={9} fill="none" strokeLinecap="round" />
        <path d="M88,250 C120,330 280,330 312,250" stroke="#ff7a98" strokeWidth={2} fill="none" strokeLinecap="round" opacity={0.7} />
      </g>
    );
  }
  if (kind === "trans") {
    return (
      <g>
        <rect width={W} height={H} fill={`url(#${id}a)`} />
        <circle cx={200} cy={420} r={300} fill="#5bcefa" opacity={0.9} />
        <circle cx={200} cy={420} r={236} fill="#f5a9b8" />
        <circle cx={200} cy={420} r={172} fill="#ffffff" />
        <circle cx={200} cy={420} r={108} fill="#f5a9b8" />
        <circle cx={200} cy={420} r={50} fill="#5bcefa" />
        <rect x={0} y={420} width={W} height={H - 420} fill={PAL.nacht} />
        <rect x={0} y={420} width={W} height={2} fill="#fff" opacity={0.4} />
        {scatter(8, 20, W, 200, 0.8, 1.8).map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={d.o * 0.8} />
        ))}
      </g>
    );
  }
  if (kind === "vip") {
    return (
      <g>
        <rect width={W} height={H} fill={`url(#${id}a)`} />
        {Array.from({ length: 10 }, (_, i) => (
          <rect key={i} x={i * 44} y={0} width={20} height={H} fill="#fff" opacity={0.025} />
        ))}
        <rect x={112} y={96} width={176} height={330} rx={4} fill="#0c1b21" stroke={PAL.bernstein} strokeOpacity={0.5} strokeWidth={2} />
        <rect x={134} y={122} width={64} height={120} rx={3} fill="none" stroke="#fff" strokeOpacity={0.14} />
        <rect x={206} y={122} width={64} height={120} rx={3} fill="none" stroke="#fff" strokeOpacity={0.14} />
        <rect x={134} y={262} width={64} height={130} rx={3} fill="none" stroke="#fff" strokeOpacity={0.14} />
        <rect x={206} y={262} width={64} height={130} rx={3} fill="none" stroke="#fff" strokeOpacity={0.14} />
        <rect x={160} y={44} width={80} height={36} rx={4} fill={PAL.bernstein} />
        <text x={200} y={70} textAnchor="middle" fontFamily="Archivo, Arial, sans-serif" fontWeight={800} fontSize={24} fill={PAL.nacht}>1201</text>
        <circle cx={264} cy={256} r={7} fill={PAL.bernstein} />
        <path d="M264,263 V300" stroke={PAL.bernstein} strokeWidth={3} />
        <rect x={252} y={300} width={24} height={44} rx={5} fill={PAL.rose} />
        <circle cx={264} cy={312} r={4} fill={PAL.nacht} />
        <rect x={112} y={426} width={176} height={6} fill={PAL.bernstein} opacity={0.95} />
        <path d="M100,432 H300 L340,520 H60 Z" fill={PAL.bernstein} opacity={0.22} />
      </g>
    );
  }
  // clubs
  const wins = scatter(21, 38, 240, 240, 1, 1);
  return (
    <g>
      <rect width={W} height={H} fill={`url(#${id}a)`} />
      {scatter(6, 22, W, 150, 0.7, 1.6).map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={d.o * 0.6} />
      ))}
      <rect x={70} y={160} width={260} height={270} fill="#0a1a20" />
      <rect x={60} y={150} width={280} height={14} fill="#0f242c" />
      {wins.map((w, i) => {
        const col = i % 6;
        const row = Math.floor(i / 6);
        const lit = (i * 7) % 3 !== 0;
        return <rect key={i} x={92 + col * 36} y={186 + row * 36} width={20} height={22} rx={2} fill={lit ? PAL.bernstein : "#12303a"} opacity={lit ? 0.5 + w.o * 0.45 : 0.9} />;
      })}
      <rect x={118} y={300} width={164} height={64} rx={14} fill="none" stroke={PAL.rose} strokeWidth={4} />
      <rect x={118} y={300} width={164} height={64} rx={14} fill="none" stroke={PAL.rose} strokeWidth={12} opacity={0.22} />
      <text x={200} y={346} textAnchor="middle" fontFamily="Archivo, Arial, sans-serif" fontWeight={800} fontSize={34} letterSpacing={3} fill="#ffd1dc">OPEN</text>
      <rect x={168} y={376} width={64} height={54} fill="#14090f" />
      <rect x={0} y={430} width={W} height={H - 430} fill="#07141a" />
      <path d="M130,432 H270 L300,520 H100 Z" fill={PAL.rose} opacity={0.2} />
    </g>
  );
}

const BG: Record<CategoryKey, [string, string, string]> = {
  female: ["#2a1347", "#c4457a", "#ffb067"],
  massage: ["#0b2b2c", "#14575a", "#2f8f86"],
  bdsm: ["#1a0610", "#4a0f26", "#7a1738"],
  trans: ["#0d1f4d", "#2f3f86", "#7a6fbe"],
  vip: ["#2b1b1a", "#4a2b24", "#7a4a2d"],
  clubs: ["#150b3b", "#4b1d6b", "#a33a82"],
};

export function CategoryPoster({ kind, className, title }: { kind: CategoryKey; className?: string; title?: string }) {
  const id = uid(useId());
  const [a, b, c] = BG[kind];
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title || CATEGORY_META[kind].label}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}a`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={a} />
          <stop offset="0.6" stopColor={b} />
          <stop offset="1" stopColor={c} />
        </linearGradient>
      </defs>
      <Art kind={kind} id={id} />
    </svg>
  );
}
