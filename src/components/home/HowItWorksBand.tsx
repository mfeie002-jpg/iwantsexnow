import React from "react";
import { StepSearchArt, StepCompareArt, StepBookArt } from "@/components/visuals";

const STEPS = [
  {
    Art: StepSearchArt,
    title: "Suchen",
    text: "Kanton, Stadt oder PLZ eingeben und nach Kategorie, Preis und Verfügbarkeit filtern.",
  },
  {
    Art: StepCompareArt,
    title: "Vergleichen",
    text: "30- und 60-Minuten-Honorare in CHF nebeneinander sehen, bis zu vier Profile im Direktvergleich.",
  },
  {
    Art: StepBookArt,
    title: "Direkt buchen",
    text: "Über die +41 Nummer direkt Kontakt aufnehmen. Keine Agentur dazwischen, 0% Provision.",
  },
];

export function HowItWorksBand() {
  return (
    <section className="paper contour-bg mt-20" aria-labelledby="ablauf-h">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20">
        <h2 id="ablauf-h" className="max-w-2xl text-3xl sm:text-4xl">
          In drei Schritten zum direkten Kontakt
        </h2>

        <div className="mt-10 grid gap-10 lg:-mx-8 lg:grid-cols-3 lg:gap-0">
          {STEPS.map(({ Art, title, text }, i) => (
            <div key={title} className={"lg:px-8 " + (i > 0 ? "lg:border-l-2 lg:border-dashed lg:border-[#0b2229]/25" : "")}>
              <Art className="w-full rounded-3xl" />
              <h3 className="mt-6 text-2xl">{title}</h3>
              <p className="mt-2 max-w-sm leading-7 text-[#2d4650]">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksBand;
