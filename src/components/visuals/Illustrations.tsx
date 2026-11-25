import React, { useId } from "react";
import { PAL, uid } from "./art";

const INK = PAL.nacht;
const stroke = { stroke: INK, strokeWidth: 3, strokeLinejoin: "round" as const, strokeLinecap: "round" as const };

/* ------------------------------------------------------------------ brand */

/** Mark: a cherry door hanger with a heart. Hand-cut, slightly tilted. */
export function BrandMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" className={className} aria-hidden="true" focusable="false">
      <g transform="rotate(-8 24 24)">
        <path
          fillRule="evenodd"
          d="M24,2 C30.5,2 34,6.5 34,11 C34,13.2 33.2,15 32,16.3 H36 C39.3,16.3 42,19 42,22.3 V38.5 C42,41.8 39.3,44.5 36,44.5 H12 C8.7,44.5 6,41.8 6,38.5 V22.3 C6,19 8.7,16.3 12,16.3 H16 C14.8,15 14,13.2 14,11 C14,6.5 17.5,2 24,2 Z M24,6.8 C21,6.8 19.2,8.6 19.2,11 C19.2,13.4 21,15.2 24,15.2 C27,15.2 28.8,13.4 28.8,11 C28.8,8.6 27,6.8 24,6.8 Z"
          fill={PAL.glueh}
          stroke={INK}
          strokeWidth={2.4}
          strokeLinejoin="round"
        />
        <path
          d="M24,39 C16.4,33.6 15.4,27.6 19.4,25.8 C21.7,24.8 23.4,26 24,27.3 C24.6,26 26.3,24.8 28.6,25.8 C32.6,27.6 31.6,33.6 24,39 Z"
          fill="#fff"
        />
      </g>
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-display inline-flex items-baseline leading-none ${className}`} style={{ fontWeight: 800, letterSpacing: "-0.035em" }}>
      <span>iwantsexnow</span>
      <span style={{ color: PAL.glueh }}>.ch</span>
    </span>
  );
}

/** "Bitte nicht stören" door hanger. The brand's own object. */
export function DoorHanger({
  className,
  line1 = "Bitte nicht stören",
  line2 = "Diskret, direkt, fair.",
  tone = "light",
}: {
  className?: string;
  line1?: string;
  line2?: string;
  tone?: "dark" | "light";
}) {
  const body = tone === "dark" ? "#2b2f6b" : "#ffffff";
  const ink = tone === "dark" ? "#fbfaf8" : INK;
  const sub = tone === "dark" ? "#c9c9db" : "#5b5f84";
  return (
    <svg viewBox="0 0 220 420" className={className} role="img" aria-label="Türhänger: Bitte nicht stören" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M110,4 C150,4 168,28 168,58 C168,76 160,92 148,102 L194,102 C204,102 212,110 212,120 V396 C212,406 204,414 194,414 H26 C16,414 8,406 8,396 V120 C8,110 16,102 26,102 H72 C60,92 52,76 52,58 C52,28 70,4 110,4 Z M110,28 C94,28 84,42 84,58 C84,74 94,88 110,88 C126,88 136,74 136,58 C136,42 126,28 110,28 Z"
        fill={body}
        stroke={INK}
        strokeWidth={3.5}
        strokeLinejoin="round"
        fillRule="evenodd"
      />
      <rect x={28} y={126} width={164} height={152} rx={14} fill="#ffd3dc" {...stroke} />
      <circle cx={146} cy={178} r={22} fill="#ffe48a" {...stroke} strokeWidth={2.6} />
      <path d="M30,262 L30,238 L74,196 L104,226 L128,204 L190,258 V264 a14,14 0 0 1 -14,14 H44 a14,14 0 0 1 -14,-14 Z" fill="#bfebd6" {...stroke} strokeWidth={2.6} />
      <path d="M62,262 L96,222 L120,246 L136,230 L170,262 Z" fill="#8ed6b5" {...stroke} strokeWidth={2.2} />
      <text x={110} y={322} textAnchor="middle" fontFamily="Bricolage Grotesque, Figtree, Arial, sans-serif" fontWeight={800} fontSize={22} fill={ink}>
        {line1}
      </text>
      <text x={110} y={348} textAnchor="middle" fontFamily="Figtree, Arial, sans-serif" fontWeight={500} fontSize={14} fill={sub}>
        {line2}
      </text>
      <path d="M92,376 C100,370 108,382 116,376 S128,370 130,376" fill="none" stroke={PAL.glueh} strokeWidth={3.4} strokeLinecap="round" />
    </svg>
  );
}

/** Round rubber stamp: "geprüft". */
export function VerifiedStamp({ className, label = "Verifiziert" }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <g transform="rotate(-9 60 60)" fill="none" stroke={PAL.lago} strokeLinecap="round" strokeLinejoin="round">
        <circle cx="60" cy="60" r="54" strokeWidth="3.5" />
        <circle cx="60" cy="60" r="46" strokeWidth="1.8" strokeDasharray="2 5" />
        <path d="M36,58 L53,75 L84,40" strokeWidth="9" />
        <text x="60" y="98" textAnchor="middle" fontFamily="Bricolage Grotesque, Figtree, Arial, sans-serif" fontWeight={800} fontSize="14" fill={PAL.lago} stroke="none">
          geprüft
        </text>
      </g>
    </svg>
  );
}

/* ---------------------------------------------------- postage + postmark */

/** Perforated postage stamp. */
export function Stamp({
  code,
  count,
  color = "#ffe48a",
  className,
}: {
  code: string;
  count?: number | string;
  color?: string;
  className?: string;
}) {
  const id = uid(useId());
  const holesX = Array.from({ length: 9 }, (_, i) => 8 + i * 8);
  const holesY = Array.from({ length: 11 }, (_, i) => 8 + i * 8);
  return (
    <svg viewBox="0 0 80 96" className={className} aria-hidden="true" focusable="false">
      <defs>
        <mask id={`${id}m`}>
          <rect width="80" height="96" fill="#fff" />
          {holesX.map((x) => (
            <React.Fragment key={x}>
              <circle cx={x} cy={0} r={2.7} fill="#000" />
              <circle cx={x} cy={96} r={2.7} fill="#000" />
            </React.Fragment>
          ))}
          {holesY.map((y) => (
            <React.Fragment key={y}>
              <circle cx={0} cy={y} r={2.7} fill="#000" />
              <circle cx={80} cy={y} r={2.7} fill="#000" />
            </React.Fragment>
          ))}
        </mask>
      </defs>
      <g mask={`url(#${id}m)`}>
        <rect width="80" height="96" fill="#fff" />
        <rect x="7" y="7" width="66" height="82" fill={color} stroke={INK} strokeWidth="1.6" />
        <circle cx="54" cy="30" r="9" fill="#fff" opacity="0.8" />
        <path d="M7,62 L26,38 L38,54 L48,44 L73,70 V89 H7 Z" fill={INK} opacity="0.88" />
        <path d="M26,38 L21,46 L26,44 L31,47 Z" fill="#fff" />
      </g>
      <text x="40" y="82" textAnchor="middle" fontFamily="Bricolage Grotesque, Figtree, Arial, sans-serif" fontWeight={800} fontSize="15" fill="#fff" stroke={INK} strokeWidth="0.6" paintOrder="stroke">
        {code}
      </text>
      {count !== undefined && (
        <text x="14" y="24" fontFamily="Bricolage Grotesque, Figtree, Arial, sans-serif" fontWeight={800} fontSize="11" fill={INK}>
          {count}
        </text>
      )}
    </svg>
  );
}

/** Wavy cancellation marks, drawn over a stamp. */
export function Postmark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 110 60" className={className} aria-hidden="true" focusable="false" fill="none" stroke={INK} strokeWidth="2" strokeLinecap="round" opacity="0.5">
      <circle cx="30" cy="30" r="24" />
      <circle cx="30" cy="30" r="18" strokeDasharray="2 4" />
      <path d="M58,16 C66,10 72,22 80,16 S94,10 104,16" />
      <path d="M58,30 C66,24 72,36 80,30 S94,24 104,30" />
      <path d="M58,44 C66,38 72,50 80,44 S94,38 104,44" />
    </svg>
  );
}

/* ----------------------------------------------------------------- doodles */

type DoodleKind = "arrow" | "star" | "heart" | "sun" | "circle" | "spark" | "cloud";

export function Doodle({ kind, className, color = INK }: { kind: DoodleKind; className?: string; color?: string }) {
  const p = { fill: "none", stroke: color, strokeWidth: 3.2, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  switch (kind) {
    case "arrow":
      return (
        <svg viewBox="0 0 120 90" className={className} aria-hidden="true" focusable="false">
          <path d="M8,16 C40,8 82,18 94,62" {...p} />
          <path d="M80,56 L95,68 L102,48" {...p} />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 60 60" className={className} aria-hidden="true" focusable="false">
          <path d="M30,6 L36,24 L55,24 L40,35 L46,53 L30,42 L14,53 L20,35 L5,24 L24,24 Z" {...p} />
        </svg>
      );
    case "heart":
      return (
        <svg viewBox="0 0 60 56" className={className} aria-hidden="true" focusable="false">
          <path d="M30,50 C8,34 4,18 16,10 C23,6 28,10 30,15 C32,10 37,6 44,10 C56,18 52,34 30,50 Z" {...p} />
        </svg>
      );
    case "sun":
      return (
        <svg viewBox="0 0 80 80" className={className} aria-hidden="true" focusable="false">
          <circle cx="40" cy="40" r="14" {...p} />
          <path d="M40,8 V18 M40,62 V72 M8,40 H18 M62,40 H72 M17,17 L24,24 M56,56 L63,63 M63,17 L56,24 M24,56 L17,63" {...p} />
        </svg>
      );
    case "circle":
      return (
        <svg viewBox="0 0 200 80" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="none">
          <path d="M104,8 C48,4 8,22 10,42 C12,64 66,74 120,70 C176,66 196,48 188,30 C182,14 146,6 100,8" {...p} />
        </svg>
      );
    case "spark":
      return (
        <svg viewBox="0 0 40 40" className={className} aria-hidden="true" focusable="false">
          <path d="M20,3 C22,13 27,18 37,20 C27,22 22,27 20,37 C18,27 13,22 3,20 C13,18 18,13 20,3 Z" {...p} />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 100 50" className={className} aria-hidden="true" focusable="false">
          <path d="M20,40 C6,40 4,26 16,24 C14,12 32,6 40,16 C46,6 66,8 68,22 C84,20 92,38 76,40 Z" {...p} />
        </svg>
      );
  }
}

/** Paper-cut wave edge to sit between two colour fields. */
export function Wave({ color, className, flip = false }: { color: string; className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 1440 60"
      preserveAspectRatio="none"
      className={className}
      style={{ display: "block", width: "100%", height: "clamp(28px, 4vw, 56px)", transform: flip ? "scaleY(-1)" : undefined }}
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0,34 C120,6 240,6 360,28 S600,58 760,34 S1040,2 1180,26 S1380,52 1440,30 V60 H0 Z" fill={color} />
    </svg>
  );
}

/* ------------------------------------------------------- how-it-works art */

const CH_OUTLINE =
  "M58,150 L84,124 L128,114 L152,88 L204,82 L238,62 L292,72 L332,60 L384,86 L424,112 L444,150 L412,176 L382,170 L352,192 L322,202 L292,218 L252,206 L222,228 L182,222 L150,202 L108,208 L78,188 Z";

export function StepSearchArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 220" className={className} aria-hidden="true" focusable="false">
      <g transform="translate(-14 -8) scale(0.72)">
        <path d={CH_OUTLINE} fill="#dcd3f7" {...stroke} />
        {[
          [150, 140],
          [250, 112],
          [330, 120],
          [226, 176],
        ].map(([x, y], i) => (
          <g key={i} transform={`translate(${x} ${y})`}>
            <path d="M0,0 C-12,-14 -12,-30 0,-30 C12,-30 12,-14 0,0 Z" fill={PAL.glueh} {...stroke} strokeWidth={3.6} />
            <circle cx={0} cy={-21} r={4} fill="#fff" />
          </g>
        ))}
      </g>
      <g transform="translate(176 96) rotate(-12)">
        <circle cx={34} cy={34} r={34} fill="#fff" fillOpacity={0.75} {...stroke} strokeWidth={5} />
        <path d="M60,60 L96,98" {...stroke} strokeWidth={12} />
        <path d="M60,60 L96,98" stroke="#ffd34d" strokeWidth={5} strokeLinecap="round" />
        <path d="M16,26 C20,16 30,12 40,14" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" />
      </g>
    </svg>
  );
}

export function StepCompareArt({ className }: { className?: string }) {
  const tag = (x: number, y: number, rot: number, fill: string, price: string, check?: boolean) => (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      <path d="M0,0 H86 C94,0 98,4 98,12 V74 C98,82 94,86 86,86 H0 Z" transform="translate(-4 0)" fill={fill} {...stroke} />
      <circle cx={10} cy={43} r={6.5} fill="#fbfaf8" {...stroke} strokeWidth={2.6} />
      <text x={32} y={36} fontFamily="Figtree, Arial, sans-serif" fontWeight={700} fontSize={12} fill={INK}>
        CHF
      </text>
      <text x={32} y={68} fontFamily="Bricolage Grotesque, Figtree, Arial, sans-serif" fontWeight={800} fontSize={30} fill={INK}>
        {price}
      </text>
      {check && (
        <g transform="translate(80 -10)">
          <circle r={15} fill={PAL.lago} {...stroke} strokeWidth={2.8} />
          <path d="M-7,0 L-2,6 L8,-6" fill="none" stroke="#fff" strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        </g>
      )}
    </g>
  );
  return (
    <svg viewBox="0 0 300 220" className={className} aria-hidden="true" focusable="false">
      <path d="M150,36 V190 M96,190 H204" {...stroke} strokeWidth={4} />
      <path d="M44,52 H256" {...stroke} strokeWidth={4} />
      <path d="M44,52 L26,108 H62 Z M256,52 L238,108 H274 Z" fill="#fff" {...stroke} strokeWidth={3} />
      <circle cx={150} cy={36} r={9} fill="#ffd34d" {...stroke} />
      {tag(18, 104, -6, "#ffe48a", "250")}
      {tag(184, 96, 5, "#bfebd6", "190", true)}
    </svg>
  );
}

export function StepBookArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 220" className={className} aria-hidden="true" focusable="false">
      <g transform="rotate(5 150 110)">
        <rect x={92} y={14} width={116} height={196} rx={20} fill="#2b2f6b" {...stroke} />
        <rect x={102} y={32} width={96} height={158} rx={8} fill="#fff" {...stroke} strokeWidth={2.4} />
        <rect x={102} y={32} width={96} height={30} rx={8} fill={PAL.glueh} {...stroke} strokeWidth={2.4} />
        <text x={150} y={53} textAnchor="middle" fontFamily="Bricolage Grotesque, Figtree, Arial, sans-serif" fontWeight={800} fontSize={15} fill="#fff">
          Freitag
        </text>
        {Array.from({ length: 6 }, (_, i) => (
          <rect key={i} x={110 + (i % 3) * 30} y={72 + Math.floor(i / 3) * 28} width={24} height={20} rx={5} fill={i === 4 ? "#ffd34d" : "#ece9f6"} stroke={i === 4 ? INK : "none"} strokeWidth={2} />
        ))}
        <path d="M118,142 C122,138 126,146 132,140" fill="none" stroke={INK} strokeWidth={2.4} strokeLinecap="round" />
        <rect x={112} y={156} width={76} height={22} rx={11} fill={PAL.lago} {...stroke} strokeWidth={2.4} />
        <path d="M138,167 L146,174 L162,160" fill="none" stroke="#fff" strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <g transform="translate(226 58)">
        <path d="M0,0 H58 C66,0 70,4 70,12 V34 C70,42 66,46 58,46 H30 L14,60 V46 H12 C4,46 0,42 0,34 V12 C0,4 4,0 0,0 Z" fill="#ffd3dc" {...stroke} strokeWidth={2.8} />
        <path d="M35,36 C22,27 20,19 27,16 C31,14 34,17 35,19 C36,17 39,14 43,16 C50,19 48,27 35,36 Z" fill={PAL.glueh} stroke={INK} strokeWidth={2} strokeLinejoin="round" />
      </g>
      <g transform="translate(20 150)">
        <Spark />
      </g>
    </svg>
  );
}

const Spark = () => (
  <path d="M20,3 C22,13 27,18 37,20 C27,22 22,27 20,37 C18,27 13,22 3,20 C13,18 18,13 20,3 Z" fill="#ffd34d" {...stroke} strokeWidth={2.6} />
);

export function EmptyArt({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 240 180" className={className} aria-hidden="true" focusable="false">
      <g transform="rotate(-6 120 90)">
        <rect x={52} y={22} width={136} height={138} rx={5} fill="#fff" {...stroke} />
        <rect x={64} y={34} width={112} height={92} fill="#dcd3f7" stroke={INK} strokeWidth={2.4} />
        <path d="M64,112 L92,80 L112,100 L132,76 L176,118 V126 H64 Z" fill="#bfebd6" stroke={INK} strokeWidth={2.4} strokeLinejoin="round" />
        <circle cx={150} cy={58} r={12} fill="#ffe48a" stroke={INK} strokeWidth={2.4} />
        <path d="M82,146 C92,138 100,152 112,144 S132,138 142,146" fill="none" stroke={INK} strokeWidth={2.6} strokeLinecap="round" />
      </g>
      <g transform="translate(176 20) rotate(10)">
        <path d="M0,28 C0,6 34,6 34,26 C34,38 20,40 20,52" fill="none" {...stroke} strokeWidth={5} />
        <circle cx={20} cy={68} r={3.4} fill={INK} />
      </g>
    </svg>
  );
}
