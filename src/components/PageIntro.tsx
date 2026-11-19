import React from "react";
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

/* Arch placeholders: wine-to-ruby or gold-to-wine with a soft gold orb (Velvet Night system). */
const ARCH: Record<IntroTone, string> = {
  blush: "radial-gradient(circle at 66% 30%, rgba(232,201,138,0.55) 0%, rgba(232,201,138,0) 26%), radial-gradient(ellipse 95% 38% at 50% 112%, #150810 0%, #150810 62%, rgba(21,8,16,0) 63%), linear-gradient(165deg, #3a1325 0%, #d6165f 135%)",
  butter: "radial-gradient(circle at 34% 32%, rgba(232,201,138,0.6) 0%, rgba(232,201,138,0) 26%), radial-gradient(ellipse 95% 38% at 50% 112%, #150810 0%, #150810 62%, rgba(21,8,16,0) 63%), linear-gradient(200deg, #e8c98a -40%, #3a1325 70%)",
  minze: "radial-gradient(circle at 60% 28%, rgba(232,201,138,0.5) 0%, rgba(232,201,138,0) 24%), radial-gradient(ellipse 95% 38% at 50% 112%, #150810 0%, #150810 62%, rgba(21,8,16,0) 63%), linear-gradient(170deg, #13362b 0%, #3a1325 120%)",
  himmel: "radial-gradient(circle at 56% 26%, rgba(232,201,138,0.5) 0%, rgba(232,201,138,0) 24%), radial-gradient(ellipse 95% 38% at 50% 112%, #150810 0%, #150810 62%, rgba(21,8,16,0) 63%), linear-gradient(150deg, #22101a 0%, #ee3c7c 140%)",
  flieder: "radial-gradient(circle at 40% 30%, rgba(232,201,138,0.55) 0%, rgba(232,201,138,0) 24%), radial-gradient(ellipse 95% 38% at 50% 112%, #150810 0%, #150810 62%, rgba(21,8,16,0) 63%), linear-gradient(185deg, #2b1420 0%, #d6165f 140%)",
};

/**
 * Page header for inner pages: one calm wine band, serif headline, an italic
 * gold aside and one arch picture. Same props as before, so every page keeps working.
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
    <header className="relative isolate overflow-hidden border-b border-line bg-[radial-gradient(ellipse_90%_120%_at_15%_-20%,#3a1325_0%,#150810_70%)]">
      <div className={`mx-auto grid max-w-[1200px] items-center gap-10 px-4 pb-14 pt-12 sm:px-6 sm:pt-16 ${hasArt ? "md:grid-cols-[1fr_auto] md:gap-16" : ""}`}>
        <div className="relative z-10 max-w-3xl">
          {note && <p className="mb-3 font-display text-[24px] italic leading-tight text-gold">{note}</p>}
          <h1 className="font-display text-[clamp(2.4rem,5vw,3.6rem)] leading-[1.04] text-ink">{title}</h1>
          {lead && <p className="mt-5 max-w-2xl text-[18px] leading-8 text-ink-soft sm:text-[20px]">{lead}</p>}
          {children && <div className="mt-7 flex flex-wrap items-center gap-3">{children}</div>}
        </div>
        {hasArt && (
          <div className="relative hidden justify-self-center md:block" aria-hidden="true">
            <div className="aspect-[4/5] w-[200px] rounded-[999px_999px_22px_22px] border border-gold shadow-[0_16px_40px_rgba(0,0,0,0.28)]" style={{ background: ARCH[tone] }} />
          </div>
        )}
      </div>
    </header>
  );
}

export default PageIntro;
