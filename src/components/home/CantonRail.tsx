import React from "react";
import { CantonPostcard, CANTON_META } from "@/components/visuals";
import type { CantonKey } from "@/components/visuals";

type Item = { code: string; key: CantonKey; count: number };

const TILTS = [-2.2, 1.6, -1, 2.4, -1.8, 1.2, -2.6, 1.8, -0.8, 2.2];

export function CantonRail({ items, active, onPick }: { items: Item[]; active: string; onPick: (code: string) => void }) {
  return (
    <section className="field-minze relative pb-24 pt-6 sm:pb-28" aria-labelledby="kantone-h">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
          <div>
            <h2 id="kantone-h" className="text-[clamp(2rem,4.6vw,3.4rem)] text-tinte">
              Wo bist du heute?
            </h2>
            <p className="hand mt-1 text-[1.7rem] text-tinte/75">Tipp auf eine Postkarte, der Rest passiert darunter.</p>
          </div>
          {active !== "ALL" && (
            <button type="button" onClick={() => onPick("ALL")} className="chip cursor-pointer">
              Ganze Schweiz anzeigen
            </button>
          )}
        </div>

        <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 sm:gap-x-6 md:grid-cols-3 lg:grid-cols-5">
          {items.map((it, i) => {
            const meta = CANTON_META[it.key];
            const isActive = active === it.code;
            return (
              <li key={it.code} className={i % 2 === 1 ? "lg:translate-y-6" : ""}>
                <button
                  type="button"
                  onClick={() => onPick(it.code)}
                  aria-pressed={isActive}
                  aria-label={`${meta.name}: ${it.count} Profile`}
                  className={"group block w-full cursor-pointer text-left " + (isActive ? "[&>.postcard]:ring-4 [&>.postcard]:ring-kirsche" : "")}
                >
                  <CantonPostcard canton={it.key} count={it.count} tilt={TILTS[i % TILTS.length]} tape={isActive} />
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}

export default CantonRail;
