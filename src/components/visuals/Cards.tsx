import React from "react";
import { CantonPoster, CANTON_META } from "./CantonPoster";
import type { CantonKey } from "./CantonPoster";
import { CategoryPoster, CATEGORY_META } from "./CategoryPoster";
import type { CategoryKey } from "./CategoryPoster";
import { Stamp, Postmark } from "./Illustrations";

const STAMP_COLORS: Partial<Record<CantonKey, string>> = {
  zh: "#c6dffa",
  zg: "#bfebd6",
  lu: "#dcd3f7",
  bs: "#ffd3dc",
  be: "#ffe48a",
  ag: "#bfebd6",
  sg: "#dcd3f7",
  ge: "#ffd3dc",
  vd: "#c6dffa",
  ti: "#bfebd6",
  ch: "#ffe48a",
};

/** A postcard: scenic photo, stamp with the number of profiles, handwritten greeting. */
export function CantonPostcard({
  canton,
  count,
  tilt = 0,
  greeting,
  className = "",
  tape = false,
}: {
  canton: CantonKey;
  count?: number | string;
  tilt?: number;
  greeting?: string;
  className?: string;
  tape?: boolean;
}) {
  const meta = CANTON_META[canton];
  return (
    <div className={`postcard ${className}`} style={{ ["--tilt" as string]: `${tilt}deg` }}>
      {tape && <span className="tape" style={{ top: "-0.7rem", left: "50%", marginLeft: "-2.6rem", ["--r" as string]: "-3deg" }} />}
      <div className="postcard-photo" style={{ aspectRatio: "5 / 4" }}>
        <CantonPoster canton={canton} variant="card" />
      </div>
      <Postmark className="pointer-events-none absolute right-12 top-1 h-10 w-20" />
      <Stamp code={meta.code} count={count} color={STAMP_COLORS[canton]} className="absolute -right-2 -top-3 h-[4.6rem] w-[3.85rem] rotate-[5deg] drop-shadow-[0_2px_2px_rgba(30,34,71,0.25)]" />
      <p className="hand mt-2 px-1 text-[1.7rem] text-tinte">{greeting || (canton === "ch" ? "Gruss aus der Schweiz" : `Gruss aus ${meta.name}`)}</p>
    </div>
  );
}

/** A polaroid with a hand-lettered note. */
export function CategoryPolaroid({
  kind,
  tilt = 0,
  note,
  className = "",
  tape = true,
}: {
  kind: CategoryKey;
  tilt?: number;
  note?: string;
  className?: string;
  tape?: boolean;
}) {
  const meta = CATEGORY_META[kind];
  return (
    <div className={`polaroid ${className}`} style={{ ["--tilt" as string]: `${tilt}deg` }}>
      {tape && <span className="tape" style={{ top: "-0.75rem", left: "50%", marginLeft: "-2.6rem", ["--r" as string]: `${tilt > 0 ? -5 : 4}deg` }} />}
      <div className="aspect-square overflow-hidden bg-flieder">
        <CategoryPoster kind={kind} title={meta.label} className="block h-full w-full" />
      </div>
      <span className="polaroid-caption">{note || meta.note}</span>
    </div>
  );
}
