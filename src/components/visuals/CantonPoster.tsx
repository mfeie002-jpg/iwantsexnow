import React, { useId } from "react";
import { PAL, ridgePath, uid } from "./art";

export type CantonKey = "zh" | "zg" | "lu" | "bs" | "be" | "ag" | "sg" | "ge" | "vd" | "ti" | "ch";

const W = 400;
const H = 520;
const HORIZON = 342;
const INK = "#2b2f6b";

interface SceneDef {
  sky: [string, string, string];
  sun: { x: number; y: number; r: number; c: string };
  far: { seed: number; base: number; amp: number; top: string; bottom: string };
  near: { seed: number; base: number; amp: number; fill: string };
  water: [string, string];
  clouds: Array<[number, number, number]>;
}

const day = (
  sky: [string, string, string],
  sunX: number,
  seeds: [number, number],
  amps: [number, number],
  far: [string, string],
  near: string,
  water: [string, string],
  clouds: Array<[number, number, number]>,
): SceneDef => ({
  sky,
  sun: { x: sunX, y: 150, r: 46, c: "#ffe48a" },
  far: { seed: seeds[0], base: 318, amp: amps[0], top: far[0], bottom: far[1] },
  near: { seed: seeds[1], base: 340, amp: amps[1], fill: near },
  water,
  clouds,
});

const SCENES: Record<CantonKey, SceneDef> = {
  zh: day(["#c6dffa", "#e3eefc", "#fff3d6"], 300, [11, 5], [120, 30], ["#b3c3ee", "#98a9de"], "#7fcaa6", ["#8cc4f0", "#6aa6e0"], [[70, 96, 1], [250, 70, 0.8]]),
  zg: day(["#bfe3f6", "#ddf1fa", "#fff3d6"], 110, [23, 9], [128, 26], ["#a9c8ee", "#8eb0e2"], "#79c9a2", ["#8fc9ee", "#6cabe0"], [[260, 90, 1], [90, 66, 0.7]]),
  lu: day(["#d8d0f5", "#ece4f8", "#ffe6d4"], 96, [37, 14], [146, 24], ["#b9aef0", "#9d90e2"], "#80cba8", ["#8ec2ec", "#69a3dc"], [[250, 84, 1], [120, 56, 0.7]]),
  bs: day(["#c9e2fb", "#e5effc", "#ffecc9"], 300, [41, 19], [60, 22], ["#bdd0f1", "#a2b8e6"], "#84cca6", ["#8bc3ee", "#68a6de"], [[80, 80, 1], [240, 60, 0.7]]),
  be: day(["#ffd3dc", "#ffe6e2", "#ffefc9"], 300, [53, 27], [112, 26], ["#e2b6e0", "#c79ad0"], "#86cca4", ["#8dc4ee", "#69a5dd"], [[90, 90, 1], [220, 62, 0.8]]),
  ag: day(["#bfebd6", "#e1f5e9", "#fff3cf"], 292, [61, 31], [74, 34], ["#a2d9c4", "#85c8b0"], "#6fc29a", ["#8bd0e0", "#66b4cd"], [[78, 84, 1], [240, 64, 0.7]]),
  sg: day(["#dcd3f7", "#eee7fa", "#ffe4d0"], 84, [71, 33], [164, 30], ["#c2b6ee", "#a597e0"], "#7ecba7", ["#8ec2ec", "#6aa4dc"], [[250, 76, 1], [130, 54, 0.7]]),
  ge: day(["#ffc9d4", "#ffe2dc", "#ffefc2"], 330, [83, 35], [138, 18], ["#ebb7d4", "#d49ac2"], "#8ccea6", ["#8cc4f0", "#68a5e0"], [[70, 84, 1], [200, 56, 0.7]]),
  vd: day(["#bdd9f7", "#dcebfb", "#fff1d4"], 90, [97, 37], [128, 24], ["#a8c2ee", "#8aa8e0"], "#78c7a3", ["#8bc3ee", "#66a4de"], [[250, 80, 1], [140, 58, 0.7]]),
  ti: day(["#bdebe0", "#dff5ee", "#ffe9c4"], 110, [101, 39], [126, 28], ["#9ed8cc", "#7cc4b8"], "#6ec29e", ["#84d0e4", "#5eb2d0"], [[260, 80, 1], [90, 60, 0.7]]),
  ch: day(["#ffd3dc", "#ffe8e0", "#fff0c8"], 250, [7, 3], [140, 30], ["#e0b5dc", "#c398cc"], "#84cca4", ["#8cc4f0", "#68a5e0"], [[80, 84, 1], [300, 60, 0.7]]),
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
    <path d="M196,338 L200,104 L204,338 Z" fill={"#4d84d6"} opacity={0.96} />
    <path d="M200,118 C158,140 150,232 132,326" stroke={"#4d84d6"} strokeWidth={2.4} fill="none" opacity={0.75} />
    <path d="M200,118 C242,140 250,232 268,326" stroke={"#4d84d6"} strokeWidth={2.4} fill="none" opacity={0.75} />
    <path d="M200,130 C176,150 170,214 160,300" stroke={"#4d84d6"} strokeWidth={1.6} fill="none" opacity={0.55} />
    <path d="M200,130 C224,150 230,214 240,300" stroke={"#4d84d6"} strokeWidth={1.6} fill="none" opacity={0.55} />
    <ellipse cx={200} cy={334} rx={46} ry={9} fill={"#4d84d6"} opacity={0.4} />
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
  variant = "card",
}: {
  canton: CantonKey;
  className?: string;
  title?: string;
  /** "card" is a landscape crop for postcards, "portrait" shows the whole scene */
  variant?: "card" | "portrait";
  /** kept for older call sites; daytime scenes have no stars */
  stars?: boolean;
}) {
  const id = uid(useId());
  const s = SCENES[canton] || SCENES.ch;
  const Landmark = LANDMARKS[canton] || CH;
  const farPath = ridgePath(s.far.seed, W, H, s.far.base, s.far.amp);
  const nearPath = ridgePath(s.near.seed, W, H, s.near.base, s.near.amp, 24);
  const streaks = Array.from({ length: 7 }, (_, i) => ({
    y: HORIZON + 8 + i * 16,
    w: 96 - i * 9 + (i % 2) * 12,
  }));
  const viewBox = variant === "card" ? `0 54 ${W} 326` : `0 0 ${W} ${H}`;

  return (
    <svg
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={title || CANTON_META[canton]?.name}
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id={`${id}sky`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={s.sky[0]} />
          <stop offset="0.55" stopColor={s.sky[1]} />
          <stop offset="1" stopColor={s.sky[2]} />
        </linearGradient>
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
      <circle cx={s.sun.x} cy={s.sun.y} r={s.sun.r * 1.7} fill={s.sun.c} opacity={0.3} />
      <circle cx={s.sun.x} cy={s.sun.y} r={s.sun.r} fill={s.sun.c} />
      {s.clouds.map(([cx, cy, k], i) => (
        <g key={i} transform={`translate(${cx} ${cy}) scale(${k})`} fill="#fff" opacity={0.95}>
          <ellipse cx={0} cy={0} rx={38} ry={12} />
          <ellipse cx={-16} cy={-9} rx={18} ry={14} />
          <ellipse cx={8} cy={-13} rx={22} ry={16} />
        </g>
      ))}

      <g clipPath={`url(#${id}clip)`}>
        <path d={farPath} fill={`url(#${id}far)`} />
        <path d={nearPath} fill={s.near.fill} />
        <Landmark />
      </g>

      <rect x="0" y={HORIZON} width={W} height={H - HORIZON} fill={`url(#${id}water)`} />
      {streaks.map((st, i) => (
        <rect key={i} x={s.sun.x - st.w / 2} y={st.y} width={st.w} height={3} rx={1.5} fill="#fff" opacity={0.55 - i * 0.06} />
      ))}
    </svg>
  );
}
