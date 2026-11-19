import React, { useId } from "react";
import { PAL, ridgePath, scatter, uid } from "./art";

export type CantonKey = "zh" | "zg" | "lu" | "bs" | "be" | "ag" | "sg" | "ge" | "vd" | "ti" | "ch";

const W = 400;
const H = 520;
const HORIZON = 342;
const INK = PAL.nacht;

interface SceneDef {
  sky: [string, string, string];
  sun: { x: number; y: number; r: number; c: string };
  far: { seed: number; base: number; amp: number; top: string; bottom: string };
  near: { seed: number; base: number; amp: number; fill: string };
  water: [string, string];
  stars?: boolean;
}

const SCENES: Record<CantonKey, SceneDef> = {
  zh: {
    sky: ["#1a2358", "#c4457a", "#ffb067"],
    sun: { x: 282, y: 322, r: 70, c: "#ffe2ae" },
    far: { seed: 11, base: 318, amp: 140, top: "#8a4f8f", bottom: "#4a2c6c" },
    near: { seed: 5, base: 340, amp: 36, fill: "#241f4d" },
    water: ["#7a2f62", "#0d1f27"],
    stars: true,
  },
  zg: {
    sky: ["#0f2a4a", "#4e7fae", "#f7c59f"],
    sun: { x: 120, y: 316, r: 58, c: "#fff0c9" },
    far: { seed: 23, base: 316, amp: 150, top: "#6f8fb8", bottom: "#2f4f7a" },
    near: { seed: 9, base: 340, amp: 30, fill: "#173553" },
    water: ["#4d6f96", "#0d1f27"],
  },
  lu: {
    sky: ["#2b1b4d", "#c2506b", "#ffb36b"],
    sun: { x: 98, y: 318, r: 62, c: "#ffd9a0" },
    far: { seed: 37, base: 322, amp: 170, top: "#8f4c86", bottom: "#4b2760" },
    near: { seed: 14, base: 340, amp: 28, fill: "#2a1b45" },
    water: ["#8a3f68", "#0d1f27"],
    stars: true,
  },
  bs: {
    sky: ["#13335c", "#5b8fc4", "#ffd6a5"],
    sun: { x: 300, y: 326, r: 54, c: "#fff2d2" },
    far: { seed: 41, base: 318, amp: 72, top: "#6f98c6", bottom: "#33567f" },
    near: { seed: 19, base: 340, amp: 24, fill: "#16395e" },
    water: ["#5f86b0", "#0d1f27"],
  },
  be: {
    sky: ["#1c2a4f", "#9a4c7e", "#ffaf6b"],
    sun: { x: 300, y: 322, r: 66, c: "#ffd9a0" },
    far: { seed: 53, base: 320, amp: 130, top: "#85508f", bottom: "#412a63" },
    near: { seed: 27, base: 340, amp: 30, fill: "#231d49" },
    water: ["#7d3f70", "#0d1f27"],
    stars: true,
  },
  ag: {
    sky: ["#14344b", "#4f9aa8", "#f6b26b"],
    sun: { x: 290, y: 318, r: 56, c: "#fff0c0" },
    far: { seed: 61, base: 324, amp: 80, top: "#5b9fa6", bottom: "#27596a" },
    near: { seed: 31, base: 342, amp: 40, fill: "#123a46" },
    water: ["#4d94a0", "#0d1f27"],
  },
  sg: {
    sky: ["#1e2a55", "#8e5aa6", "#ffc58b"],
    sun: { x: 80, y: 320, r: 56, c: "#ffe7b9" },
    far: { seed: 71, base: 318, amp: 190, top: "#a07bb8", bottom: "#4b3a78" },
    near: { seed: 33, base: 340, amp: 34, fill: "#262451" },
    water: ["#7a5d9c", "#0d1f27"],
  },
  ge: {
    sky: ["#17285e", "#d45f86", "#ffc27a"],
    sun: { x: 330, y: 312, r: 62, c: "#fff0c9" },
    far: { seed: 83, base: 312, amp: 160, top: "#c48aa8", bottom: "#6a4a86" },
    near: { seed: 35, base: 338, amp: 20, fill: "#2a2a5a" },
    water: ["#b5517e", "#0d1f27"],
    stars: true,
  },
  vd: {
    sky: ["#112b55", "#5c8bd0", "#ffd0a0"],
    sun: { x: 90, y: 318, r: 60, c: "#fff0cd" },
    far: { seed: 97, base: 316, amp: 150, top: "#7ea0d6", bottom: "#3b5c96" },
    near: { seed: 37, base: 340, amp: 26, fill: "#173a66" },
    water: ["#5d86be", "#0d1f27"],
  },
  ti: {
    sky: ["#0d3a4d", "#35a5a5", "#ffc796"],
    sun: { x: 110, y: 322, r: 64, c: "#fff1d0" },
    far: { seed: 101, base: 322, amp: 150, top: "#5fb3b0", bottom: "#1f6e72" },
    near: { seed: 39, base: 340, amp: 32, fill: "#0f4650" },
    water: ["#3a9ca0", "#0d1f27"],
  },
  ch: {
    sky: ["#1a2358", "#d45f86", "#ffb067"],
    sun: { x: 250, y: 318, r: 72, c: "#ffe2ae" },
    far: { seed: 7, base: 318, amp: 170, top: "#a46a9a", bottom: "#4a2c6c" },
    near: { seed: 3, base: 340, amp: 34, fill: "#231f4d" },
    water: ["#8a3d6c", "#0d1f27"],
    stars: true,
  },
};

/* ---------------------------------------------------------------- landmarks */

const Lit = ({ x, y, w = 4, h = 7 }: { x: number; y: number; w?: number; h?: number }) => (
  <rect x={x} y={y} width={w} height={h} rx={1} fill={PAL.bernstein} opacity={0.95} />
);

const ZH = () => (
  <g fill={INK}>
    <rect x={118} y={286} width={156} height={60} />
    <rect x={150} y={208} width={38} height={138} />
    <rect x={204} y={208} width={38} height={138} />
    <path d="M148,210 C148,170 190,170 190,210 Z" />
    <path d="M202,210 C202,170 244,170 244,210 Z" />
    <rect x={167} y={160} width={4} height={18} />
    <rect x={221} y={160} width={4} height={18} />
    <rect x={292} y={236} width={8} height={110} />
    <path d="M288,240 L296,168 L304,240 Z" />
    <rect x={262} y={300} width={70} height={46} />
    <path d="M258,302 L297,274 L336,302 Z" />
    <Lit x={164} y={236} /><Lit x={218} y={236} /><Lit x={164} y={262} /><Lit x={218} y={262} />
    <Lit x={176} y={300} /><Lit x={196} y={300} /><Lit x={230} y={304} />
  </g>
);

const ZG = () => (
  <g fill={INK}>
    <rect x={88} y={300} width={60} height={46} />
    <path d="M84,302 L118,272 L152,302 Z" />
    <rect x={252} y={304} width={70} height={42} />
    <path d="M248,306 L287,276 L326,306 Z" />
    <rect x={168} y={192} width={64} height={154} />
    <path d="M158,194 L200,110 L242,194 Z" />
    <path d="M172,176 H228 M180,160 H220 M188,144 H212" stroke={PAL.tiefsee} strokeWidth={2} fill="none" opacity={0.9} />
    <rect x={198} y={86} width={4} height={26} />
    <path d="M202,88 L226,94 L202,100 Z" fill={PAL.glueh} />
    <path d="M184,346 V322 A16,16 0 0 1 216,322 V346 Z" fill={PAL.bernstein} opacity={0.9} />
    <circle cx={200} cy={236} r={10} fill={PAL.bernstein} opacity={0.95} />
    <Lit x={176} y={262} /><Lit x={218} y={262} />
  </g>
);

const LU = () => (
  <g fill={INK}>
    <path d="M26,320 H374 L364,304 H36 Z" />
    {Array.from({ length: 18 }, (_, i) => (
      <rect key={`p${i}`} x={40 + i * 19} y={304} width={4} height={28} />
    ))}
    <rect x={26} y={330} width={348} height={5} />
    {Array.from({ length: 13 }, (_, i) => (
      <rect key={`l${i}`} x={34 + i * 27} y={335} width={5} height={13} />
    ))}
    <rect x={246} y={236} width={56} height={98} />
    <path d="M240,240 L274,196 L308,240 Z" />
    <rect x={272} y={178} width={4} height={20} />
    <Lit x={266} y={262} w={6} h={9} /><Lit x={266} y={290} w={6} h={9} />
  </g>
);

const BS = () => (
  <g fill={INK}>
    <rect x={158} y={282} width={86} height={64} />
    <path d="M152,284 L201,232 L250,284 Z" />
    <rect x={130} y={250} width={30} height={96} />
    <path d="M126,252 L145,146 L164,252 Z" />
    <rect x={242} y={250} width={30} height={96} />
    <path d="M238,252 L257,146 L276,252 Z" />
    <rect x={143} y={118} width={4} height={30} />
    <rect x={255} y={118} width={4} height={30} />
    <path d="M136,200 H154 M248,200 H266" stroke={PAL.tiefsee} strokeWidth={2} />
    <circle cx={201} cy={262} r={9} fill={PAL.bernstein} opacity={0.95} />
    <Lit x={140} y={272} /><Lit x={252} y={272} />
    <rect x={40} y={316} width={64} height={30} />
    <rect x={296} y={314} width={70} height={32} />
  </g>
);

const BE = () => (
  <g fill={INK}>
    <rect x={40} y={300} width={110} height={46} />
    <rect x={250} y={296} width={110} height={50} />
    <rect x={166} y={176} width={58} height={170} />
    <path d="M158,178 L195,92 L232,178 Z" />
    <rect x={172} y={134} width={46} height={44} />
    <rect x={193} y={60} width={4} height={34} />
    <circle cx={195} cy={246} r={21} fill={PAL.bernstein} opacity={0.95} />
    <circle cx={195} cy={246} r={15} fill={INK} />
    <path d="M195,246 V234 M195,246 L204,250" stroke={PAL.bernstein} strokeWidth={2.4} />
    <path d="M52,346 V326 A8,8 0 0 1 68,326 V346 M82,346 V326 A8,8 0 0 1 98,326 V346 M112,346 V326 A8,8 0 0 1 128,326 V346" stroke={PAL.bernstein} strokeWidth={0} fill={PAL.bernstein} opacity={0.35} />
  </g>
);

const AG = () => (
  <g fill={INK}>
    <path d="M0,346 L0,276 C50,262 96,258 140,300 L190,346 Z" />
    <rect x={64} y={214} width={32} height={62} />
    <path d="M60,214 h6 v-8 h6 v8 h6 v-8 h6 v8 h6 v-8 h6 v8 h2 v6 h-38 z" />
    <rect x={112} y={238} width={26} height={44} />
    <rect x={212} y={236} width={58} height={110} />
    <path d="M206,238 L241,196 L276,238 Z" />
    <path d="M222,346 V312 A19,19 0 0 1 260,312 V346 Z" fill={PAL.bernstein} opacity={0.88} />
    <path d="M290,330 H388 L382,318 H296 Z" />
    {Array.from({ length: 6 }, (_, i) => (
      <rect key={i} x={298 + i * 16} y={318} width={3} height={14} />
    ))}
    <Lit x={236} y={256} /><Lit x={250} y={256} /><Lit x={76} y={234} w={4} h={6} />
  </g>
);

const SG = () => (
  <g fill={INK}>
    <rect x={112} y={290} width={176} height={56} />
    <rect x={146} y={214} width={42} height={134} />
    <rect x={212} y={214} width={42} height={134} />
    <path d="M144,216 C140,176 192,176 190,216 Z" />
    <path d="M210,216 C206,176 258,176 256,216 Z" />
    <path d="M160,190 C160,160 176,150 167,126 C158,150 174,160 174,190 Z" />
    <rect x={165} y={96} width={4} height={34} />
    <rect x={231} y={96} width={4} height={34} />
    <path d="M226,190 C226,160 242,150 233,126 C224,150 240,160 240,190 Z" />
    <path d="M168,292 C168,262 232,262 232,292 Z" />
    <Lit x={162} y={240} /><Lit x={228} y={240} /><Lit x={162} y={266} /><Lit x={228} y={266} />
  </g>
);

const GE = () => (
  <g>
    <g fill={INK}>
      <rect x={120} y={338} width={170} height={7} />
      <rect x={74} y={326} width={60} height={20} />
      <rect x={300} y={328} width={56} height={18} />
    </g>
    <path d="M196,338 L200,104 L204,338 Z" fill={PAL.gletscher} opacity={0.96} />
    <path d="M200,118 C158,140 150,232 132,326" stroke={PAL.gletscher} strokeWidth={2.4} fill="none" opacity={0.75} />
    <path d="M200,118 C242,140 250,232 268,326" stroke={PAL.gletscher} strokeWidth={2.4} fill="none" opacity={0.75} />
    <path d="M200,130 C176,150 170,214 160,300" stroke={PAL.gletscher} strokeWidth={1.6} fill="none" opacity={0.55} />
    <path d="M200,130 C224,150 230,214 240,300" stroke={PAL.gletscher} strokeWidth={1.6} fill="none" opacity={0.55} />
    <ellipse cx={200} cy={334} rx={46} ry={9} fill={PAL.gletscher} opacity={0.4} />
  </g>
);

const VD = () => (
  <g fill={INK}>
    <path d="M0,346 L0,318 L40,318 L40,300 L84,300 L84,284 L130,284 L130,346 Z" />
    <path d="M270,346 L270,290 L322,290 L322,308 L372,308 L372,326 L400,326 L400,346 Z" />
    <rect x={130} y={262} width={140} height={84} />
    <path d="M124,264 L200,226 L276,264 Z" />
    <rect x={186} y={150} width={28} height={84} />
    <path d="M182,152 L200,70 L218,152 Z" />
    <rect x={198} y={46} width={4} height={26} />
    <rect x={140} y={226} width={20} height={44} />
    <path d="M136,228 L150,196 L164,228 Z" />
    <rect x={240} y={226} width={20} height={44} />
    <path d="M236,228 L250,196 L264,228 Z" />
    <path d="M190,346 V312 A10,10 0 0 1 210,312 V346 Z" fill={PAL.bernstein} opacity={0.9} />
    <Lit x={192} y={182} /><Lit x={146} y={248} /><Lit x={246} y={248} /><Lit x={160} y={288} /><Lit x={232} y={288} />
  </g>
);

const TI = () => (
  <g fill={INK}>
    <path d="M214,346 L300,196 L344,230 L400,258 L400,346 Z" />
    <rect x={296} y={176} width={10} height={22} />
    <path d="M292,178 L301,160 L310,178 Z" />
    <path d="M0,346 L0,290 C60,276 120,294 170,346 Z" />
    <path d="M70,346 C72,300 78,270 66,236" stroke={INK} strokeWidth={5} fill="none" />
    {[-70, -40, -12, 14, 42, 72].map((a, i) => (
      <path key={i} d={`M66,236 q${Math.sin((a * Math.PI) / 180) * 40},${-30 + Math.abs(a) * 0.22} ${Math.sin((a * Math.PI) / 180) * 52},${6 + Math.abs(a) * 0.12}`} stroke={INK} strokeWidth={5} fill="none" strokeLinecap="round" />
    ))}
    <path d="M132,346 C134,312 138,290 130,268" stroke={INK} strokeWidth={4} fill="none" />
    {[-60, -28, 6, 36, 66].map((a, i) => (
      <path key={i} d={`M130,268 q${Math.sin((a * Math.PI) / 180) * 30},${-22 + Math.abs(a) * 0.18} ${Math.sin((a * Math.PI) / 180) * 40},${4 + Math.abs(a) * 0.1}`} stroke={INK} strokeWidth={4} fill="none" strokeLinecap="round" />
    ))}
    <Lit x={236} y={316} /><Lit x={254} y={322} /><Lit x={272} y={314} />
  </g>
);

const CH = () => (
  <g fill={INK}>
    <rect x={150} y={290} width={100} height={56} />
    <path d="M142,292 L200,236 L258,292 Z" />
    <rect x={190} y={190} width={20} height={56} />
    <path d="M186,192 L200,140 L214,192 Z" />
    <Lit x={166} y={310} /><Lit x={190} y={310} /><Lit x={214} y={310} />
  </g>
);

const LANDMARKS: Record<CantonKey, () => JSX.Element> = { zh: ZH, zg: ZG, lu: LU, bs: BS, be: BE, ag: AG, sg: SG, ge: GE, vd: VD, ti: TI, ch: CH };

export const CANTON_META: Record<CantonKey, { code: string; name: string; landmark: string }> = {
  ch: { code: "CH", name: "Ganze Schweiz", landmark: "Alpenglühen" },
  zh: { code: "ZH", name: "Zürich", landmark: "Grossmünster & Limmat" },
  zg: { code: "ZG", name: "Zug", landmark: "Zytturm & Zugersee" },
  lu: { code: "LU", name: "Luzern", landmark: "Kapellbrücke & Pilatus" },
  bs: { code: "BS", name: "Basel", landmark: "Münster & Rhein" },
  be: { code: "BE", name: "Bern", landmark: "Zytglogge & Aare" },
  ag: { code: "AG", name: "Aargau", landmark: "Baden & Limmat" },
  sg: { code: "SG", name: "St. Gallen", landmark: "Kathedrale & Säntis" },
  ge: { code: "GE", name: "Genève", landmark: "Jet d'Eau & Mont-Blanc" },
  vd: { code: "VD", name: "Lausanne", landmark: "Kathedrale & Léman" },
  ti: { code: "TI", name: "Lugano", landmark: "San Salvatore & Palmen" },
};

export function cantonKeyFromCode(code?: string | null): CantonKey {
  const k = String(code || "").toLowerCase();
  if (k === "gr" || k === "vs" || k === "ne" || k === "fr" || k === "so") return "ch";
  return (k in SCENES ? k : "ch") as CantonKey;
}

export function CantonPoster({
  canton,
  className,
  title,
  stars = true,
}: {
  canton: CantonKey;
  className?: string;
  title?: string;
  stars?: boolean;
}) {
  const id = uid(useId());
  const s = SCENES[canton] || SCENES.ch;
  const Landmark = LANDMARKS[canton] || CH;
  const dots = s.stars && stars ? scatter(canton.charCodeAt(0) * 7 + canton.charCodeAt(1), 28, W, 150, 0.6, 1.5) : [];
  const farPath = ridgePath(s.far.seed, W, H, s.far.base, s.far.amp);
  const nearPath = ridgePath(s.near.seed, W, H, s.near.base, s.near.amp, 24);
  const streaks = Array.from({ length: 9 }, (_, i) => ({
    y: HORIZON + 10 + i * 17,
    w: 120 - i * 10 + (i % 2) * 14,
  }));

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title || CANTON_META[canton]?.name}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.sky[0]} />
          <stop offset="0.58" stopColor={s.sky[1]} />
          <stop offset="1" stopColor={s.sky[2]} />
        </linearGradient>
        <radialGradient id={`${id}sun`}>
          <stop offset="0" stopColor={s.sun.c} stopOpacity="1" />
          <stop offset="0.38" stopColor={s.sun.c} stopOpacity="0.55" />
          <stop offset="1" stopColor={s.sun.c} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}far`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.far.top} />
          <stop offset="1" stopColor={s.far.bottom} />
        </linearGradient>
        <linearGradient id={`${id}water`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.water[0]} />
          <stop offset="1" stopColor={s.water[1]} />
        </linearGradient>
        <clipPath id={`${id}clip`}>
          <rect x="0" y="0" width={W} height={HORIZON + 4} />
        </clipPath>
      </defs>

      <rect width={W} height={H} fill={`url(#${id}sky)`} />
      {dots.map((d, i) => (
        <circle key={i} cx={d.x} cy={d.y} r={d.r} fill="#fff" opacity={d.o * 0.7} />
      ))}
      <circle cx={s.sun.x} cy={s.sun.y} r={s.sun.r * 2.6} fill={`url(#${id}sun)`} />
      <circle cx={s.sun.x} cy={s.sun.y} r={s.sun.r * 0.62} fill={s.sun.c} opacity={0.95} />

      <g clipPath={`url(#${id}clip)`}>
        <path d={farPath} fill={`url(#${id}far)`} opacity={0.96} />
        <path d={nearPath} fill={s.near.fill} />
        <Landmark />
      </g>

      <rect x="0" y={HORIZON} width={W} height={H - HORIZON} fill={`url(#${id}water)`} />
      {streaks.map((st, i) => (
        <rect key={i} x={s.sun.x - st.w / 2} y={st.y} width={st.w} height={2.4} rx={1.2} fill={s.sun.c} opacity={0.5 - i * 0.045} />
      ))}
      <rect x="0" y={HORIZON} width={W} height={1.5} fill="#fff" opacity={0.18} />
    </svg>
  );
}
