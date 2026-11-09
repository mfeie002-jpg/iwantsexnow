import React from "react";
import Link from "next/link";
import { CategoryPoster, CATEGORY_META } from "@/components/visuals";
import type { CategoryKey } from "@/components/visuals";

type Props = {
  activeRubric: string;
  onPickRubric: (rubric: string) => void;
  onPickVip: () => void;
};

const ORDER: CategoryKey[] = ["female", "massage", "bdsm", "trans", "vip", "clubs"];

export function CategoryMosaic({ activeRubric, onPickRubric, onPickVip }: Props) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-16 sm:px-6" aria-labelledby="kategorien-h">
      <h2 id="kategorien-h" className="text-3xl text-white sm:text-4xl">
        Was suchst du?
      </h2>
      <div className="mt-7 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-6">
        {ORDER.map((kind) => {
          const meta = CATEGORY_META[kind];
          const inner = (
            <div className="poster aspect-[4/5]">
              <CategoryPoster kind={kind} title={meta.label} />
              <div className="poster-shade" />
              <div className="poster-caption">
                <div className="text-lg font-extrabold leading-tight text-white" style={{ fontFamily: "Archivo, Arial, sans-serif", fontStretch: "110%" }}>
                  {meta.label}
                </div>
                <div className="mt-1 text-xs leading-snug text-[#d6e4e2]">{meta.blurb}</div>
              </div>
            </div>
          );
          const isActive = activeRubric === kind;
          const cls = "group block text-left " + (isActive ? "rounded-[1.25rem] ring-2 ring-[#ffb067] ring-offset-4 ring-offset-[#07141a]" : "");
          if (kind === "clubs") {
            return (
              <Link key={kind} href="/clubs" className={cls}>
                {inner}
              </Link>
            );
          }
          return (
            <button
              key={kind}
              type="button"
              className={cls + " cursor-pointer"}
              aria-pressed={isActive}
              onClick={() => (kind === "vip" ? onPickVip() : onPickRubric(kind))}
            >
              {inner}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CategoryMosaic;
