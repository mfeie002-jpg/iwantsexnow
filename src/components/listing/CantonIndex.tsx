import React from "react";
import Link from "next/link";
import { countLabel } from "@/lib/listing";

export type CantonLink = {
  code: string;
  label: string;
  href: string;
  count: number;
};

/** Cities set roughly where they sit on a map of Switzerland. */
const PLACED: { code: string; area: string }[] = [
  { code: "BS", area: "basel" },
  { code: "ZH", area: "zurich" },
  { code: "SG", area: "stgallen" },
  { code: "AG", area: "aargau" },
  { code: "ZG", area: "zug" },
  { code: "LU", area: "luzern" },
  { code: "BE", area: "bern" },
  { code: "VD", area: "lausanne" },
  { code: "GE", area: "geneve" },
  { code: "TI", area: "lugano" },
];

export function CantonIndex({ cantons }: { cantons: CantonLink[] }) {
  const byCode = new Map(cantons.map((c) => [c.code, c]));
  const placed = PLACED.map((p) => byCode.get(p.code)).filter(Boolean) as CantonLink[];
  const rest = cantons.filter((c) => c.count > 0 && !PLACED.some((p) => p.code === c.code));

  return (
    <div className="canton-index">
      <div className="geo-board" aria-label="Städte in der Schweiz">
        {placed.map((c) => (
          <Link key={c.code} href={c.href} className={"geo-city geo-" + c.code.toLowerCase()}>
            <span>{c.label}</span>
            <em>{countLabel(c.count)}</em>
          </Link>
        ))}
      </div>
      {rest.length > 0 && (
        <ul className="canton-rest">
          {rest
            .slice()
            .sort((a, b) => b.count - a.count)
            .map((c) => (
              <li key={c.code}>
                <Link href={c.href}>
                  {c.label} <em>{countLabel(c.count)}</em>
                </Link>
              </li>
            ))}
        </ul>
      )}
    </div>
  );
}
