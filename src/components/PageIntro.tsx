import React from "react";
import { CantonPostcard, CategoryPolaroid, DoorHanger, Doodle, StepBookArt, StepCompareArt, StepSearchArt, VerifiedStamp, Wave } from "@/components/visuals";
import type { CantonKey, CategoryKey } from "@/components/visuals";

export type IntroTone = "blush" | "butter" | "minze" | "himmel" | "flieder";
export type IntroArt =
  | "hanger"
  | "verified"
  | "search"
  | "compare"
  | "book"
  | "none"
  | `canton:${CantonKey}`
  | `category:${CategoryKey}`;

const TONE_WAVE: Record<IntroTone, string> = {
  blush: "#fbfaf8",
  butter: "#fbfaf8",
  minze: "#fbfaf8",
  himmel: "#fbfaf8",
  flieder: "#fbfaf8",
};

function PaperPhoto({ children, tilt = 3, tape = true, className = "" }: { children: React.ReactNode; tilt?: number; tape?: boolean; className?: string }) {
  return (
    <div className={`polaroid ${className}`} style={{ ["--tilt" as string]: `${tilt}deg`, paddingBottom: "0.65rem" }}>
      {tape && <span className="tape" style={{ top: "-0.75rem", left: "50%", marginLeft: "-2.6rem", ["--r" as string]: "-4deg" }} />}
      <div className="overflow-hidden rounded-[2px] bg-white">{children}</div>
    </div>
  );
}

function Art({ art }: { art: IntroArt }) {
  if (art === "none") return null;
  if (art === "hanger") return <DoorHanger className="h-[17rem] w-auto rotate-[4deg] drop-shadow-[0_10px_14px_rgba(30,34,71,0.18)]" />;
  if (art === "verified") return <VerifiedStamp className="h-44 w-44 rotate-[6deg]" />;
  if (art === "search")
    return (
      <PaperPhoto tilt={3}>
        <StepSearchArt className="block h-auto w-64" />
      </PaperPhoto>
    );
  if (art === "compare")
    return (
      <PaperPhoto tilt={-3}>
        <StepCompareArt className="block h-auto w-64" />
      </PaperPhoto>
    );
  if (art === "book")
    return (
      <PaperPhoto tilt={2}>
        <StepBookArt className="block h-auto w-64" />
      </PaperPhoto>
    );
  if (art.startsWith("canton:")) return <CantonPostcard canton={art.slice(7) as CantonKey} tilt={3} tape className="w-64" />;
  if (art.startsWith("category:")) return <CategoryPolaroid kind={art.slice(9) as CategoryKey} tilt={4} className="w-56" />;
  return null;
}

/**
 * Page header: coloured paper field, big headline, a hand-written note, one picture.
 * Replaces the old "title panel" on inner pages.
 */
export function PageIntro({
  tone = "butter",
  note,
  title,
  lead,
  art = "none",
  children,
}: {
  tone?: IntroTone;
  note?: React.ReactNode;
  title: React.ReactNode;
  lead?: React.ReactNode;
  art?: IntroArt;
  children?: React.ReactNode;
}) {
  const hasArt = art !== "none";
  return (
    <header className={`field-${tone} relative isolate overflow-hidden`}>
      <div className={`mx-auto grid max-w-6xl items-center gap-8 px-4 pb-14 pt-9 sm:px-6 sm:pt-12 ${hasArt ? "md:grid-cols-[1fr_auto] md:gap-12" : ""}`}>
        <div className="relative z-10 max-w-3xl">
          {note && <p className="hand mb-1 text-[1.55rem] leading-none text-kirsche-tief sm:text-[1.8rem]">{note}</p>}
          <h1 className="font-display text-[clamp(2rem,4.6vw,3.4rem)] font-extrabold leading-[1.03] tracking-tight text-tinte">{title}</h1>
          {lead && <p className="mt-4 max-w-2xl text-base leading-7 text-tinte/80 sm:text-lg sm:leading-8">{lead}</p>}
          {children && <div className="mt-6 flex flex-wrap items-center gap-3">{children}</div>}
        </div>
        {hasArt && (
          <div className="relative hidden justify-self-center pr-2 md:block" aria-hidden="true">
            <Art art={art} />
          </div>
        )}
        <Doodle kind="spark" color="#1e2247" className="pointer-events-none absolute right-[6%] top-5 hidden h-9 w-9 rotate-12 opacity-70 sm:block" />
      </div>
      <Wave color={TONE_WAVE[tone]} className="absolute inset-x-0 bottom-[-1px]" />
    </header>
  );
}

export default PageIntro;
