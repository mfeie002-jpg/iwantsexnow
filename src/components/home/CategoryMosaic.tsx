import React from "react";
import Link from "next/link";
import { CategoryPolaroid, CATEGORY_META } from "@/components/visuals";
import type { CategoryKey } from "@/components/visuals";

type Props = {
  activeRubric: string;
  onPickRubric: (rubric: string) => void;
  onPickVip: () => void;
};

const ORDER: CategoryKey[] = ["female", "massage", "bdsm", "trans", "vip", "clubs"];
const TILTS = [-3, 2.5, -1.5, 3, -2.5, 1.8];

export function CategoryMosaic({ activeRubric, onPickRubric, onPickVip }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-6 pt-20 sm:px-6 sm:pt-24" aria-labelledby="kategorien-h">
      <h2 id="kategorien-h" className="text-[clamp(2rem,4.6vw,3.4rem)] text-tinte">
        Worauf hast du Lust?
      </h2>
      <p className="hand mt-1 text-[1.7rem] text-tinte/75">Such dir ein Foto aus, wir sortieren den Rest.</p>

      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-6">
        {ORDER.map((kind, i) => {
          const meta = CATEGORY_META[kind];
          const isActive = activeRubric === kind;
          const inner = (
            <>
              <CategoryPolaroid kind={kind} tilt={TILTS[i]} className={isActive ? "ring-4 ring-kirsche" : ""} />
              <div className="mt-4 px-1">
                <div className="font-display text-lg font-bold leading-tight text-tinte">{meta.label}</div>
                <div className="mt-1 text-sm leading-5 text-tinte/70">{meta.blurb}</div>
              </div>
            </>
          );
          const cls = "group block w-full text-left";
          return (
            <li key={kind}>
              {kind === "clubs" ? (
                <Link href="/clubs" className={cls}>
                  {inner}
                </Link>
              ) : (
                <button type="button" className={cls + " cursor-pointer"} aria-pressed={isActive} onClick={() => (kind === "vip" ? onPickVip() : onPickRubric(kind))}>
                  {inner}
                </button>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

export default CategoryMosaic;
