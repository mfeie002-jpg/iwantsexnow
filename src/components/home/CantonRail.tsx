import React from "react";
import { CantonPoster, CANTON_META } from "@/components/visuals";
import type { CantonKey } from "@/components/visuals";

type Item = { code: string; key: CantonKey; count: number };

export function CantonRail({ items, active, onPick }: { items: Item[]; active: string; onPick: (code: string) => void }) {
  return (
    <section className="mx-auto max-w-7xl px-4 pt-14 sm:px-6" aria-labelledby="kantone-h">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h2 id="kantone-h" className="text-3xl text-white sm:text-4xl">
            Nach Kanton stöbern
          </h2>
          <p className="mt-2 max-w-xl text-[#9fb8b5]">Von Zug bis Tessin: ein Tipp auf den Kanton filtert alle Profile darunter.</p>
        </div>
        {active !== "ALL" && (
          <button type="button" onClick={() => onPick("ALL")} className="chip cursor-pointer">
            Alle Kantone
          </button>
        )}
      </div>

      <div className="no-scrollbar -mx-4 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
        {items.map((it) => {
          const meta = CANTON_META[it.key];
          const isActive = active === it.code;
          return (
            <button
              key={it.code}
              type="button"
              onClick={() => onPick(it.code)}
              aria-pressed={isActive}
              className={
                "group w-[184px] shrink-0 cursor-pointer snap-start text-left sm:w-[216px] " +
                (isActive ? "ring-2 ring-[#ffb067] ring-offset-4 ring-offset-[#07141a] rounded-[1.25rem]" : "")
              }
            >
              <div className="poster aspect-[4/5]">
                <CantonPoster canton={it.key} title={meta.name} />
                <div className="poster-shade" />
                <div className="poster-caption">
                  <div className="text-xl font-extrabold text-white" style={{ fontFamily: "Archivo, Arial, sans-serif", fontStretch: "112%" }}>
                    {meta.name}
                  </div>
                  <div className="mt-0.5 text-sm text-[#d6e4e2]">
                    {meta.landmark}
                  </div>
                  <div className="mt-2 inline-flex rounded-full bg-[#07141a]/70 px-2.5 py-1 text-xs font-bold tabular-nums text-[#ffd9a0] backdrop-blur">
                    {it.count} Profile
                  </div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default CantonRail;
