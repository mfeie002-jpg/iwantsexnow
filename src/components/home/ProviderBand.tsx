import React from "react";
import Link from "next/link";
import { DoorHanger, Doodle, Wave } from "@/components/visuals";

const POINTS = [
  "Du setzt selbst, wann du in den nächsten 4 Stunden frei bist, und änderst deine Preise jederzeit.",
  "0% Provision auf Direktkontakte, 80% Anteil an Paid-Inhalten.",
  "Du willst nicht gelistet sein? Opt-Out mit einem Klick.",
];

export function ProviderBand() {
  return (
    <section className="relative bg-flieder" aria-labelledby="anbieter-h">
      <Wave color="#c6dffa" className="absolute inset-x-0 -top-px" />
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-24 pt-28 sm:px-6 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <h2 id="anbieter-h" className="max-w-2xl text-[clamp(2rem,4.8vw,3.6rem)] text-tinte">
            Du bietest an? Dein Profil, deine Preise.
          </h2>
          <ul className="mt-8 grid max-w-xl gap-4">
            {POINTS.map((t) => (
              <li key={t} className="flex gap-3 text-[17px] leading-7 text-tinte/85">
                <Doodle kind="heart" color="#d92b52" className="mt-1.5 h-5 w-5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link href="/register" className="brass-button inline-flex min-h-[54px] items-center px-8 text-base">
              Profil eintragen
            </Link>
            <Link href="/report" className="btn-outline inline-flex min-h-[54px] items-center px-8 text-base">
              Opt-Out oder melden
            </Link>
          </div>
        </div>

        <div className="relative mx-auto w-44 sm:w-56 lg:w-64">
          <div className="absolute -top-14 left-1/2 h-16 w-0.5 -translate-x-1/2 bg-tinte/60" aria-hidden="true" />
          <DoorHanger tone="light" className="w-full origin-top -rotate-3 drop-shadow-[0_10px_0_rgba(30,34,71,0.15)]" />
        </div>
      </div>
    </section>
  );
}

export default ProviderBand;
