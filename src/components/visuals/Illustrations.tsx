import React, { useId } from "react";
import { PAL, uid } from "./art";

/* ------------------------------------------------------------------ brand */

/** Mark: two overlapping circles, ruby and gold, with a wine lens. */
export function BrandMark({ size = 36, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" className={className} aria-hidden="true" focusable="false">
      <circle cx="24" cy="32" r="20" fill="#d6165f" />
      <circle cx="42" cy="32" r="20" fill="#e8c98a" fillOpacity="0.95" />
      <path d="M33 17.6 a20 20 0 0 1 0 28.8 a20 20 0 0 1 0 -28.8Z" fill="#3a1325" />
    </svg>
  );
}

export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif inline-flex items-baseline leading-none ${className}`} style={{ fontWeight: 600, letterSpacing: "-0.02em" }}>
      <span>iWantSexNow</span>
      <span style={{ color: PAL.rose }}>.ch</span>
    </span>
  );
}

/** "Bitte nicht stören" style door hanger — the brand's signature object. */
export function DoorHanger({
  className,
  line1 = "Bitte nicht stören",
  line2 = "Diskret. Direkt. Fair.",
  tone = "dark",
}: {
  className?: string;
  line1?: string;
  line2?: string;
  tone?: "dark" | "light";
}) {
  const id = uid(useId());
  const bodyA = tone === "dark" ? PAL.tiefsee : "#ffffff";
  const ink = tone === "dark" ? PAL.gletscher : PAL.tinte;
  return (
    <svg viewBox="0 0 220 420" className={className} role="img" aria-label="Türhänger: Bitte nicht stören" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PAL.rose} />
          <stop offset="0.55" stopColor={PAL.glueh} />
          <stop offset="1" stopColor={PAL.bernstein} />
        </linearGradient>
      </defs>
      <path
        d="M110,0 C150,0 168,26 168,58 C168,76 160,92 148,102 L194,102 C204,102 212,110 212,120 V396 C212,406 204,414 194,414 H26 C16,414 8,406 8,396 V120 C8,110 16,102 26,102 H72 C60,92 52,76 52,58 C52,26 70,0 110,0 Z M110,28 C94,28 84,42 84,58 C84,74 94,88 110,88 C126,88 136,74 136,58 C136,42 126,28 110,28 Z"
        fill={bodyA}
        stroke={tone === "dark" ? PAL.linie : "#c3d4d1"}
        strokeWidth={2}
        fillRule="evenodd"
      />
      <rect x={28} y={128} width={164} height={150} rx={14} fill={`url(#${id}g)`} />
      <path d="M28,236 L72,194 L104,226 L128,200 L192,262 V264 a14,14 0 0 1 -14,14 H42 a14,14 0 0 1 -14,-14 Z" fill={PAL.nacht} opacity={0.9} />
      <circle cx={148} cy={176} r={20} fill="#fff1cf" />
      <text x={110} y={322} textAnchor="middle" fontFamily="Bodoni Moda, Georgia, serif" fontWeight={800} fontSize={20} fill={ink} >
        {line1}
      </text>
      <text x={110} y={348} textAnchor="middle" fontFamily="Instrument Sans, Arial, sans-serif" fontWeight={500} fontSize={13} fill={tone === "dark" ? PAL.nebel : "#3d5963"}>
        {line2}
      </text>
      <rect x={72} y={372} width={76} height={6} rx={3} fill={PAL.glueh} opacity={0.9} />
    </svg>
  );
}

export function VerifiedStamp({ className, label = "Verifiziert" }: { className?: string; label?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={label} xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="54" fill="none" stroke={PAL.lago} strokeWidth="3" strokeDasharray="3 6" />
      <circle cx="60" cy="60" r="42" fill={PAL.lago} opacity="0.14" />
      <circle cx="60" cy="60" r="42" fill="none" stroke={PAL.lago} strokeWidth="2.5" />
      <path d="M40,62 L55,76 L82,46" fill="none" stroke={PAL.lago} strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------- how-it-works art */

const CH_OUTLINE =
  "M58,150 L84,124 L128,114 L152,88 L204,82 L238,62 L292,72 L332,60 L384,86 L424,112 L444,150 L412,176 L382,170 L352,192 L322,202 L292,218 L252,206 L222,228 L182,222 L150,202 L108,208 L78,188 Z";

export function StepSearchArt({ className }: { className?: string }) {
  const id = uid(useId());
  const pins: [number, number][] = [
    [330, 98],
    [290, 112],
    [250, 100],
    [206, 120],
    [360, 130],
    [130, 150],
    [250, 180],
    [388, 150],
  ];
  return (
    <svg viewBox="0 0 480 320" className={className} role="img" aria-label="Karte der Schweiz mit Suchlupe" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PAL.rose} />
          <stop offset="1" stopColor={PAL.bernstein} />
        </linearGradient>
      </defs>
      <rect width="480" height="320" rx="22" fill="#dcebe8" />
      <path d="M0,260 C80,230 140,280 220,262 S380,230 480,262 V320 H0 Z" fill="#c3dcd8" />
      <path d={CH_OUTLINE} fill="#fff" stroke={PAL.tinte} strokeWidth="3" strokeLinejoin="round" />
      <path d="M150,150 C190,138 220,170 262,152 S340,140 384,150" fill="none" stroke="#9cc9c2" strokeWidth="5" strokeLinecap="round" />
      {pins.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="9" fill={`url(#${id}g)`} />
          <circle cx={x} cy={y} r="3.4" fill="#fff" />
        </g>
      ))}
      <g transform="translate(300 176)">
        <circle cx="0" cy="0" r="42" fill="#fff" fillOpacity="0.55" stroke={PAL.tinte} strokeWidth="7" />
        <path d="M30,30 L62,62" stroke={PAL.tinte} strokeWidth="11" strokeLinecap="round" />
        <circle cx="-10" cy="-8" r="6" fill={PAL.glueh} />
        <circle cx="12" cy="8" r="6" fill={PAL.glueh} />
      </g>
    </svg>
  );
}

export function StepCompareArt({ className }: { className?: string }) {
  const id = uid(useId());
  const cards = [
    { x: 34, price: "250", t: "30 Min.", hi: false },
    { x: 176, price: "320", t: "60 Min.", hi: true },
    { x: 318, price: "450", t: "90 Min.", hi: false },
  ];
  return (
    <svg viewBox="0 0 480 320" className={className} role="img" aria-label="Drei Preise im Vergleich" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PAL.rose} />
          <stop offset="1" stopColor={PAL.bernstein} />
        </linearGradient>
      </defs>
      <rect width="480" height="320" rx="22" fill="#dcebe8" />
      {cards.map((c) => (
        <g key={c.x} transform={`translate(${c.x} ${c.hi ? 36 : 58})`}>
          <rect width="128" height={c.hi ? 232 : 196} rx="16" fill={c.hi ? PAL.tinte : "#fff"} stroke={PAL.tinte} strokeWidth="2.5" />
          <circle cx="0" cy={c.hi ? 150 : 128} r="9" fill="#dcebe8" />
          <circle cx="128" cy={c.hi ? 150 : 128} r="9" fill="#dcebe8" />
          <path d={`M14,${c.hi ? 150 : 128} H114`} stroke={c.hi ? "#2d5262" : "#c3d4d1"} strokeWidth="2.5" strokeDasharray="5 6" />
          <text x="64" y="54" textAnchor="middle" fontFamily="Instrument Sans, Arial, sans-serif" fontWeight="600" fontSize="14" fill={c.hi ? PAL.nebel : "#3d5963"}>{c.t}</text>
          <text x="64" y="98" textAnchor="middle" fontFamily="Bodoni Moda, Georgia, serif" fontWeight="800" fontSize="40" fill={c.hi ? "#fff" : PAL.tinte} >{c.price}</text>
          <text x="64" y="120" textAnchor="middle" fontFamily="Instrument Sans, Arial, sans-serif" fontWeight="600" fontSize="13" fill={c.hi ? PAL.glueh : "#3d5963"}>CHF</text>
          {c.hi && <rect x="24" y="178" width="80" height="30" rx="15" fill={`url(#${id}g)`} />}
          {c.hi && (
            <text x="64" y="198" textAnchor="middle" fontFamily="Instrument Sans, Arial, sans-serif" fontWeight="700" fontSize="13" fill={PAL.nacht}>Fixpreis</text>
          )}
        </g>
      ))}
    </svg>
  );
}

export function StepBookArt({ className }: { className?: string }) {
  const id = uid(useId());
  return (
    <svg viewBox="0 0 480 320" className={className} role="img" aria-label="Direkter Kontakt per Telefon" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={PAL.rose} />
          <stop offset="1" stopColor={PAL.bernstein} />
        </linearGradient>
      </defs>
      <rect width="480" height="320" rx="22" fill="#dcebe8" />
      <circle cx="380" cy="70" r="110" fill="#fff" opacity="0.5" />
      <g transform="translate(150 28)">
        <rect width="150" height="268" rx="26" fill={PAL.tinte} />
        <rect x="8" y="10" width="134" height="248" rx="19" fill="#f6faf9" />
        <rect x="52" y="16" width="46" height="6" rx="3" fill={PAL.tinte} opacity="0.85" />
        <rect x="22" y="46" width="88" height="34" rx="14" fill="#fff" stroke="#c3d4d1" strokeWidth="2" />
        <rect x="34" y="58" width="52" height="5" rx="2.5" fill="#9fb8b5" />
        <rect x="34" y="68" width="34" height="5" rx="2.5" fill="#c3d4d1" />
        <rect x="42" y="96" width="94" height="40" rx="14" fill={`url(#${id}g)`} />
        <rect x="54" y="110" width="58" height="5" rx="2.5" fill={PAL.nacht} opacity="0.8" />
        <rect x="54" y="120" width="40" height="5" rx="2.5" fill={PAL.nacht} opacity="0.5" />
        <rect x="22" y="150" width="88" height="34" rx="14" fill="#fff" stroke="#c3d4d1" strokeWidth="2" />
        <rect x="34" y="162" width="60" height="5" rx="2.5" fill="#9fb8b5" />
        <rect x="34" y="172" width="26" height="5" rx="2.5" fill="#c3d4d1" />
        <rect x="26" y="206" width="98" height="34" rx="17" fill={PAL.tinte} />
        <text x="75" y="228" textAnchor="middle" fontFamily="Instrument Sans, Arial, sans-serif" fontWeight="700" fontSize="14" fill="#fff">+41 · Direkt</text>
      </g>
      <g transform="translate(332 88) rotate(8)">
        <rect width="86" height="150" rx="16" fill="#fff" stroke={PAL.tinte} strokeWidth="2.5" />
        <circle cx="43" cy="26" r="9" fill="#dcebe8" stroke={PAL.tinte} strokeWidth="2.5" />
        <rect x="14" y="52" width="58" height="48" rx="8" fill={`url(#${id}g)`} />
        <circle cx="52" cy="66" r="9" fill="#fff1cf" />
        <path d="M14,100 L34,78 L48,92 L58,82 L72,100 Z" fill={PAL.nacht} opacity="0.9" />
        <rect x="14" y="112" width="58" height="6" rx="3" fill={PAL.tinte} opacity="0.8" />
        <rect x="14" y="124" width="36" height="5" rx="2.5" fill="#9fb8b5" />
      </g>
    </svg>
  );
}

/** Small illustration for empty states and gentle "nothing here yet" moments. */
export function EmptyArt({ className }: { className?: string }) {
  const id = uid(useId());
  return (
    <svg viewBox="0 0 240 160" className={className} role="img" aria-label="Keine Treffer" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`${id}g`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3a2b66" />
          <stop offset="1" stopColor="#d4507a" />
        </linearGradient>
      </defs>
      <rect width="240" height="160" rx="18" fill={`url(#${id}g)`} />
      <circle cx="160" cy="96" r="30" fill="#ffd9a0" opacity="0.95" />
      <path d="M0,160 L0,118 L40,84 L66,108 L98,70 L140,120 L176,98 L240,134 V160 Z" fill={PAL.nacht} />
      <path d="M98,70 L88,88 L98,83 L108,90 Z" fill="#fff" opacity="0.9" />
    </svg>
  );
}
