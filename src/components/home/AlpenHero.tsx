import React from "react";
import { CantonPostcard, Doodle, HeroScene } from "@/components/visuals";

type Opt = { value: string; label: string };

type Props = {
  rubric: string;
  onRubric: (v: string) => void;
  canton: string;
  onCanton: (v: string) => void;
  freeToday: boolean;
  onFreeToday: (v: boolean) => void;
  maxRate: number;
  onMaxRate: (v: number) => void;
  onSubmit: () => void;
  cantons: Opt[];
  matchCount: number;
  profileCount: string;
  clubCount: number;
  counts: Record<string, number>;
};

const RUBRICS: Opt[] = [
  { value: "ALL", label: "Escort, Massage & mehr" },
  { value: "female", label: "Escort & GFE" },
  { value: "massage", label: "Tantra & Massage" },
  { value: "bdsm", label: "Domina & BDSM" },
  { value: "trans", label: "Trans VIP" },
];

const WHEN: Opt[] = [
  { value: "any", label: "egal wann" },
  { value: "today", label: "heute noch frei" },
];

const BUDGET: Opt[] = [
  { value: "1200", label: "ohne Preislimit" },
  { value: "250", label: "bis CHF 250 pro Stunde" },
  { value: "350", label: "bis CHF 350 pro Stunde" },
  { value: "500", label: "bis CHF 500 pro Stunde" },
];

function Slot({ label, value, options, onChange }: { label: string; value: string; options: Opt[]; onChange: (v: string) => void }) {
  const current = options.find((o) => o.value === value) || options[0];
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="sentence-slot"
      style={{ width: `${current.label.length * 0.56 + 1.7}em` }}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );
}

export function AlpenHero({
  rubric,
  onRubric,
  canton,
  onCanton,
  freeToday,
  onFreeToday,
  maxRate,
  onMaxRate,
  onSubmit,
  cantons,
  matchCount,
  profileCount,
  clubCount,
  counts,
}: Props) {
  const cantonOpts: Opt[] = cantons.map((c) => ({ value: c.value, label: c.value === "ALL" ? "der ganzen Schweiz" : c.label }));
  const budgetValue = [250, 350, 500].includes(maxRate) ? String(maxRate) : "1200";

  return (
    <section className="field-blush relative isolate overflow-hidden" aria-labelledby="hero-h">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 pb-24 pt-10 sm:px-6 sm:pt-14 lg:grid-cols-[1.08fr_0.92fr] lg:gap-6 lg:pb-40 lg:pt-16">
        <div className="relative z-10">
          <h1 id="hero-h" className="text-[clamp(2.6rem,6.4vw,5.3rem)] leading-[0.98] text-tinte">
            Eine Suche für die ganze Schweiz.
          </h1>
          <p className="mt-4 font-display text-[clamp(1.35rem,2.7vw,2rem)] font-bold text-tinte">
            <span className="squiggle">Vergleichen &amp; Direkt Buchen.</span>
          </p>
          <p className="mt-6 max-w-lg text-[17px] leading-8 text-tinte/80">
            {profileCount} Profile in allen Kantonen und {clubCount} Clubs. Preise in CHF, direkter Kontakt auf +41, keine Agentur dazwischen.
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              onSubmit();
            }}
            role="search"
            aria-label="Suche als Satz"
            className="relative mt-9 max-w-[40rem] -rotate-[0.6deg] rounded-[1.6rem_1.3rem_1.7rem_1.2rem] border-2 border-tinte bg-white p-5 shadow-[0_6px_0_rgba(30,34,71,0.92)] sm:p-7"
          >
            <span className="tape" style={{ top: "-0.8rem", left: "2rem", ["--r" as string]: "-5deg" }} />
            <p className="font-display text-[clamp(1.3rem,2.6vw,1.85rem)] font-semibold leading-[2.1] text-tinte">
              Ich suche <Slot label="Kategorie" value={rubric} options={RUBRICS} onChange={onRubric} />{" "}
              <span className="whitespace-nowrap">
                in <Slot label="Ort" value={canton} options={cantonOpts} onChange={onCanton} />,
              </span>{" "}
              <Slot label="Wann" value={freeToday ? "today" : "any"} options={WHEN} onChange={(v) => onFreeToday(v === "today")} />,{" "}
              <Slot label="Budget" value={budgetValue} options={BUDGET} onChange={(v) => onMaxRate(Number(v))} />.
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3">
              <button type="submit" className="brass-button inline-flex min-h-[54px] cursor-pointer items-center px-7 text-base">
                Zeig mir, wer da ist
              </button>
              <p className="hand text-[1.6rem] text-tinte/80" aria-live="polite">
                {matchCount > 0 ? `${matchCount} Profile passen gerade` : "Hier passt gerade nichts, probier etwas anderes"}
              </p>
            </div>
          </form>
        </div>

        <div className="relative mx-auto h-[25rem] w-full max-w-[34rem] sm:h-[30rem] lg:h-[36rem] lg:max-w-none" aria-hidden="true">
          <div className="blob absolute left-[8%] top-[6%] h-[78%] w-[78%] bg-butter/80" />
          <CantonPostcard canton="zh" count={counts.ZH} tilt={-6} className="absolute left-0 top-[12%] z-10 w-[60%]" />
          <CantonPostcard canton="lu" count={counts.LU} tilt={5} className="absolute right-0 top-0 z-[5] w-[54%]" />
          <CantonPostcard canton="ti" count={counts.TI} tilt={-2} tape className="absolute -bottom-[7%] right-[4%] z-20 w-[56%]" />
          <Doodle kind="star" color="#1e2247" className="absolute left-[2%] top-0 h-12 w-12 rotate-[-10deg]" />
          <Doodle kind="sun" color="#d92b52" className="absolute bottom-[34%] right-[-2%] hidden h-16 w-16 sm:block" />
        </div>
      </div>

      <HeroScene className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[11rem] w-full sm:h-[13rem] lg:h-[17rem]" align="xMidYMax" />
    </section>
  );
}

export default AlpenHero;
