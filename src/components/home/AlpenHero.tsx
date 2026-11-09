import React from "react";
import { HeroScene } from "@/components/visuals";

type CantonOption = { code: string; label: string };

type Props = {
  query: string;
  onQuery: (v: string) => void;
  canton: string;
  onCanton: (v: string) => void;
  onSubmit: () => void;
  cantons: CantonOption[];
  profileCount: string;
  clubCount: number;
};

export function AlpenHero({ query, onQuery, canton, onCanton, onSubmit, cantons, profileCount, clubCount }: Props) {
  return (
    <section className="relative isolate overflow-hidden border-b border-[#1d4350]">
      <HeroScene className="sun-rise absolute inset-0 -z-20 h-full w-full" align="xMidYMax" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#07141a]/92 via-[#07141a]/58 to-[#07141a]/10" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-32 bg-gradient-to-t from-[#07141a] to-transparent" />
      <div
        aria-hidden="true"
        className="hero-glow pointer-events-none absolute -right-20 top-6 -z-10 h-[26rem] w-[26rem] rounded-full bg-[#ff6b5e]/30 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 pb-14 pt-14 sm:px-6 sm:pt-20 lg:pb-24 lg:pt-28">
        <h1 className="max-w-3xl text-[clamp(2.35rem,6.4vw,4.9rem)] text-white">Eine Suche für die ganze Schweiz.</h1>
        <p
          className="mt-4 text-[clamp(1.2rem,2.6vw,1.85rem)] text-[#ffe2c2]"
          style={{ fontFamily: "Archivo, Arial, sans-serif", fontStretch: "108%", fontWeight: 600 }}
        >
          Vergleichen &amp; Direkt Buchen.
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSubmit();
          }}
          className="paper ticket mt-9 grid max-w-3xl gap-4 rounded-3xl p-5 shadow-[0_30px_80px_rgba(2,10,14,0.55)] sm:grid-cols-[1.5fr_1fr_auto] sm:items-end sm:p-6"
          style={{ ["--notch-y" as string]: "50%" }}
          role="search"
        >
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0b2229]">Stadt, PLZ, Name oder Service</span>
            <input
              type="search"
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="z.B. Zürich, 8001, Tantra"
              className="luxury-input"
              autoComplete="off"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-[#0b2229]">Kanton</span>
            <select value={canton} onChange={(e) => onCanton(e.target.value)} className="luxury-select cursor-pointer">
              {cantons.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </select>
          </label>
          <button type="submit" className="brass-button min-h-[46px] cursor-pointer px-7 text-base">
            Profile anzeigen
          </button>
        </form>

        <dl className="mt-10 flex flex-wrap gap-x-10 gap-y-5">
          {[
            [profileCount, "Profile in 24 Kantonen"],
            [String(clubCount), "Clubs & Studios"],
            ["0%", "Agentur-Provision"],
            ["+41", "Direkter Kontakt"],
          ].map(([n, l]) => (
            <div key={l} className="border-l-2 border-[#ff6b5e]/70 pl-4">
              <dt
                className="text-3xl text-white tabular-nums"
                style={{ fontFamily: "Archivo, Arial, sans-serif", fontStretch: "112%", fontWeight: 800 }}
              >
                {n}
              </dt>
              <dd className="mt-0.5 text-sm text-[#c7dad8]">{l}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

export default AlpenHero;
