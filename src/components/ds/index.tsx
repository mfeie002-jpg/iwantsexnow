import React from "react";
import Link from "next/link";
import offersData from "@/data/harvested-offers.json";

/** Turns scraped ad copy into a plain first name: no emoji, no shouting, no slogans. */
export function cleanName(raw: unknown): string {
  let s = String(raw ?? "");
  if (/viagra|kamagra|cialis|fick|anal|abspritz|spritz|nutte|porn|blowjob|xxx|geil|sperma|hure|bumsen/i.test(s)) return "";
  s = s.split(/\s[-–—|:]\s|[,!|•·]|\s{2,}/)[0] || s;
  s = s.replace(/[^\p{L}\p{N}\s.'&-]/gu, " ");
  s = s.replace(/\b(new|neu|hot|sexy|geile?r?|erotische?|echte?|100%|party|deal)\b/gi, " ");
  s = s.replace(/\s+/g, " ").trim();
  if (!s) return "";
  const letters = s.replace(/[^A-Za-zÀ-ÿ]/g, "");
  if (letters && letters === letters.toUpperCase()) {
    s = s.toLowerCase().replace(/(^|\s)\S/g, (c) => c.toUpperCase());
  }
  return s.length > 26 ? s.slice(0, 26).trim() : s;
}

const GRADIENTS = [
  "linear-gradient(160deg, #3a1325 0%, #d6165f 100%)",
  "linear-gradient(160deg, #e8c98a 0%, #3a1325 100%)",
  "linear-gradient(160deg, #d6165f 0%, #3a1325 100%)",
  "linear-gradient(200deg, #7a1f4b 0%, #22101a 100%)",
];

export function avatarGradient(id: string): string {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) >>> 0;
  return GRADIENTS[h % GRADIENTS.length];
}

/* ------------------------------------------------------------------ hero */

function ArchArt({ variant }: { variant: 0 | 1 | 2 }) {
  const g = [
    ["#3a1325", "#d6165f"],
    ["#d6165f", "#3a1325"],
    ["#e8c98a", "#3a1325"],
  ][variant];
  const id = "ha" + variant;
  return (
    <svg viewBox="0 0 320 400" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={g[0]} />
          <stop offset="1" stopColor={g[1]} />
        </linearGradient>
      </defs>
      <rect width="320" height="400" fill={`url(#${id})`} />
      <circle cx={variant === 1 ? 110 : 220} cy="125" r="85" fill="#e8c98a" opacity=".32" />
      <path d="M0 315 C90 265 200 365 320 295 V400 H0Z" fill="#150810" opacity=".72" />
    </svg>
  );
}

export function HeroArches({ className = "" }: { className?: string }) {
  return (
    <div className={`relative h-[440px] ${className}`} aria-hidden="true">
      <div className="arch absolute left-0 top-14 w-[44%] shadow-[0_28px_60px_rgba(0,0,0,0.4)]">
        <ArchArt variant={0} />
      </div>
      <div className="arch absolute left-[28%] top-0 w-[44%] shadow-[0_28px_60px_rgba(0,0,0,0.4)]">
        <ArchArt variant={1} />
      </div>
      <div className="arch absolute left-[56%] top-[76px] w-[44%] shadow-[0_28px_60px_rgba(0,0,0,0.4)]">
        <ArchArt variant={2} />
      </div>
      <span className="note-tag absolute bottom-2 left-[4%] z-10">von Menschen geprüft</span>
    </div>
  );
}

/* ----------------------------------------------------------------- cities */

type City = { name: string; code: string; href: string; art: React.ReactNode };

const L = {
  fill: "none",
  stroke: "#e8c98a",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  opacity: 0.9,
};

const WATER = (
  <path
    {...L}
    d="M0 196 C50 188 100 204 150 196 S230 190 260 194 M0 210 C60 202 110 216 160 209 S230 204 260 208"
  />
);

const CITIES: City[] = [
  {
    name: "Zürich",
    code: "ZH",
    href: "/escort-zurich",
    art: (
      <>
        {WATER}
        <path {...L} d="M42 186 V120 L54 92 L66 120 V186 M82 186 V138 H122 V186 M128 186 V110 L140 80 L152 110 V186" />
        <circle {...L} cx="206" cy="110" r="26" />
      </>
    ),
  },
  {
    name: "Genève",
    code: "GE",
    href: "/escort-geneva",
    art: (
      <>
        {WATER}
        <path {...L} d="M130 192 V80 M130 80 C118 104 106 112 100 140 M130 80 C142 104 154 112 160 140 M130 80 C128 62 134 54 130 40" />
        <circle {...L} cx="56" cy="112" r="22" />
      </>
    ),
  },
  {
    name: "Basel",
    code: "BS",
    href: "/escort-basel",
    art: (
      <>
        {WATER}
        <path {...L} d="M60 190 V112 L78 74 L96 112 V190 M104 190 V126 L120 92 L136 126 V190 M60 190 H136 M160 190 V130 H220 V190 M160 130 L190 108 L220 130" />
        <circle {...L} cx="206" cy="70" r="20" />
      </>
    ),
  },
  {
    name: "Bern",
    code: "BE",
    href: "/escort-bern",
    art: (
      <>
        {WATER}
        <path {...L} d="M80 190 V96 H130 V190 M80 96 L105 68 L130 96 M96 120 H114 V150 H96Z M150 190 V140 H214 V190" />
        <circle {...L} cx="200" cy="90" r="22" />
      </>
    ),
  },
  {
    name: "Lausanne",
    code: "VD",
    href: "/escort-lausanne",
    art: (
      <>
        {WATER}
        <path {...L} d="M90 190 V110 L106 70 L122 110 V190 M90 130 H122 M150 190 V150 H210 V190" />
        <circle {...L} cx="50" cy="104" r="20" />
      </>
    ),
  },
  {
    name: "Lugano",
    code: "TI",
    href: "/escort-lugano",
    art: (
      <>
        {WATER}
        <path {...L} d="M20 188 L80 100 L110 140 L150 80 L220 188" />
        <circle {...L} cx="206" cy="68" r="20" />
      </>
    ),
  },
];

function countFor(code: string): number {
  const list = (offersData as any[]) || [];
  let n = 0;
  for (const o of list) if (String(o.canton || "").toUpperCase() === code) n++;
  return n;
}

export function CityPlates() {
  return (
    <section id="staedte" className="scroll-mt-24 py-16">
      <div className="mb-8 flex items-end justify-between gap-4 px-1">
        <h2 className="font-serif text-4xl text-[#fbf1ec] sm:text-5xl">
          Deine <em className="text-[#e8c98a]">Stadt</em>
        </h2>
        <Link href="/clubs" className="text-base text-[#e8c98a] underline underline-offset-4">
          Clubs und Studios
        </Link>
      </div>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {CITIES.map((c) => (
          <Link key={c.code} href={c.href} className="city-plate group">
            <svg
              viewBox="0 0 260 240"
              preserveAspectRatio="xMidYMax slice"
              className="absolute inset-0 h-full w-full"
              aria-hidden="true"
            >
              {c.art}
            </svg>
            <span className="absolute right-4 top-4 flex h-[52px] w-[52px] items-center justify-center rounded-full border border-[#e8c98a] font-serif text-xl italic text-[#e8c98a]">
              {c.code}
            </span>
            <div className="relative mt-[130px]">
              <h3 className="font-serif text-4xl text-[#fbf1ec]">{c.name}</h3>
              <span className="text-[15px] font-semibold text-[#e8c98a]">
                {countFor(c.code)} Profile
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ steps */

export function Steps() {
  const steps = [
    { n: "1", title: "Suchen", text: "Sag uns, wo und wann. Wir zeigen dir, wer Zeit hat." },
    { n: "2", title: "Schreiben", text: "Du schreibst direkt, ohne Umweg und ohne Provision." },
    { n: "3", title: "Treffen", text: "Ihr klärt alles zusammen. Bei Fragen sind wir da." },
  ];
  return (
    <section className="py-12">
      <h2 className="mb-10 px-1 font-serif text-4xl text-[#fbf1ec] sm:text-5xl">
        So geht&apos;s, <em className="text-[#e8c98a]">ganz einfach</em>
      </h2>
      <div className="grid gap-10 sm:grid-cols-3">
        {steps.map((s) => (
          <div key={s.n} className="grid justify-items-start gap-4">
            <span className="flex h-16 w-16 items-center justify-center rounded-full border border-[#e8c98a] font-serif text-4xl text-[#e8c98a]">
              {s.n}
            </span>
            <h3 className="font-serif text-3xl text-[#fbf1ec]">{s.title}</h3>
            <p className="text-[#cdb5be]">{s.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ trust */

export function TrustBand() {
  return (
    <section className="py-12">
      <div className="band flex flex-col items-start gap-6 bg-[#13362b] p-8 sm:flex-row sm:items-center sm:justify-between sm:p-12">
        <div className="max-w-xl">
          <span className="note-tag">von Menschen geprüft</span>
          <h2 className="mt-5 font-serif text-4xl text-[#fbf1ec]">Das schauen wir uns an</h2>
          <p className="mt-3 text-lg text-[#fbf1ec]">
            Fotos, Telefonnummer und Angaben, bevor ein Profil online geht. Stimmt etwas nicht? Du
            kannst es mit einem Tipp melden.
          </p>
        </div>
        <Link href="/report" className="ghost-button inline-flex min-h-[52px] items-center rounded-full px-8">
          Etwas melden
        </Link>
      </div>
    </section>
  );
}
