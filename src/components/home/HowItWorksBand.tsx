import React from "react";
import { Doodle, StepSearchArt, StepCompareArt, StepBookArt, Wave } from "@/components/visuals";

const STEPS = [
  {
    Art: StepSearchArt,
    title: "Such dir etwas aus",
    text: "Ort, Kategorie, Budget und ob sie heute noch frei ist. Mehr braucht es nicht.",
    bg: "bg-flieder",
  },
  {
    Art: StepCompareArt,
    title: "Vergleich in Ruhe",
    text: "30 und 60 Minuten in CHF nebeneinander, bis zu vier Profile gleichzeitig.",
    bg: "bg-butter",
  },
  {
    Art: StepBookArt,
    title: "Schreib direkt",
    text: "Über die +41 Nummer, ohne Agentur dazwischen. 0% Provision, du zahlst nur, was du ausmachst.",
    bg: "bg-minze",
  },
];

export function HowItWorksBand() {
  return (
    <section className="relative mt-24 bg-himmel" aria-labelledby="ablauf-h">
      <Wave color="#fbfaf8" className="absolute inset-x-0 -top-px" />
      <div className="mx-auto max-w-7xl px-4 pb-24 pt-24 sm:px-6 sm:pt-28">
        <h2 id="ablauf-h" className="max-w-2xl text-[clamp(2rem,4.6vw,3.4rem)] text-tinte">
          So läuft das hier
        </h2>
        <p className="hand mt-1 text-[1.7rem] text-tinte/75">Drei Schritte, keine Anmeldung.</p>

        <ol className="relative mt-14 grid gap-14 lg:grid-cols-3 lg:gap-10">
          {STEPS.map(({ Art, title, text, bg }, i) => (
            <li key={title} className="relative">
              <div className={"relative rounded-[1.8rem_1.4rem_1.9rem_1.3rem] border-2 border-tinte p-4 shadow-[0_5px_0_rgba(30,34,71,0.9)] " + bg} style={{ transform: `rotate(${[-1.4, 1, -0.8][i]}deg)` }}>
                <Art className="w-full" />
              </div>
              <div className="mt-6 flex items-baseline gap-3">
                <span className="hand text-[2.4rem] leading-none text-kirsche">{i + 1}</span>
                <h3 className="text-2xl text-tinte">{title}</h3>
              </div>
              <p className="mt-2 max-w-sm text-[16px] leading-7 text-tinte/80">{text}</p>
              {i < 2 && <Doodle kind="arrow" className="absolute -right-8 top-1/3 hidden h-14 w-20 text-tinte lg:block" color="#1e2247" />}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export default HowItWorksBand;
