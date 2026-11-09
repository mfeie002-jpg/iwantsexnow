import React from "react";
import Link from "next/link";
import { DoorHanger } from "@/components/visuals";

export function ProviderBand() {
  return (
    <section className="relative isolate overflow-hidden bg-[#0a1a21]" aria-labelledby="anbieter-h">
      <div aria-hidden="true" className="contour-bg absolute inset-0 -z-10 opacity-80" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.3fr_0.7fr]">
        <div>
          <h2 id="anbieter-h" className="max-w-2xl text-3xl text-white sm:text-5xl">
            Du bietest Services an? Dein Profil, deine Preise.
          </h2>
          <ul className="mt-6 grid max-w-xl gap-3 text-[#c7dad8]">
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff6b5e]" />
              <span>Verfügbarkeit für die nächsten 4 Stunden selbst setzen und Honorare jederzeit ändern.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff6b5e]" />
              <span>0% Provision auf Direktkontakte, 80% Anteil an Paid-Inhalten.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#ff6b5e]" />
              <span>Opt-Out mit einem Klick, wenn du nicht gelistet sein möchtest.</span>
            </li>
          </ul>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className="brass-button inline-flex min-h-[50px] items-center px-7 text-base">
              Profil eintragen
            </Link>
            <Link href="/report" className="btn-outline inline-flex min-h-[50px] items-center px-7 text-base font-semibold">
              Opt-Out oder melden
            </Link>
          </div>
        </div>

        <div className="mx-auto w-44 sm:w-56 lg:w-64">
          <DoorHanger tone="dark" className="w-full -rotate-3 drop-shadow-[0_24px_40px_rgba(0,0,0,0.5)]" />
        </div>
      </div>
    </section>
  );
}

export default ProviderBand;
