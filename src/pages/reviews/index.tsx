import React from "react";
import Head from "next/head";
import Link from "next/link";
import LuxuryHeader from "../../components/LuxuryHeader";
import MobileBottomNav from "../../components/MobileBottomNav";

const PORTAL_STORIES = [
  {
    rank: "01",
    name: "iWantSexNow.ch",
    verdict: "Schweizer Édition Privée & Direkt-Kuration",
    score: "9.8",
    atmosphere: "Direkter WhatsApp-Draht, echte Porträts & 0% Agentur-Provision",
    img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80",
    slug: "xdate"
  },
  {
    rank: "02",
    name: "BeMyGirl.ch",
    verdict: "Boutique-Ästhetik für die Romandie & Zürich",
    score: "9.1",
    atmosphere: "Hochwertige Studio-Shootings, stark in Genf & Lausanne",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=80",
    slug: "bemygirl"
  },
  {
    rank: "03",
    name: "Fgirl.ch",
    verdict: "Der Platzhirsch in der Westschweiz",
    score: "8.7",
    atmosphere: "Grosse Auswahl in Genf, Waadt & Wallis mit Story-Feeds",
    img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    slug: "fgirl"
  },
  {
    rank: "04",
    name: "Xdate.ch & And6.com",
    verdict: "Hohe Masse in der Deutschschweiz, klassischer Inserate-Bau",
    score: "8.2",
    atmosphere: "Viele Tages-Inserate in Zürich, Aargau und Basel",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=80",
    slug: "and6"
  }
];

export default function ReviewsMagazinePage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Head>
        <title>Schweizer Nightlife- & Portal-Report — iWantSexNow.ch</title>
      </Head>
      <LuxuryHeader />

      <main className="max-w-[1400px] w-full mx-auto px-6 sm:px-14 pt-10">
        <div className="max-w-3xl mb-14">
          <div className="text-xs uppercase tracking-[0.35em] text-[#E0B589]">Redaktionelle Kuration · 2026</div>
          <h1 className="font-editorial italic text-5xl sm:text-7xl font-normal leading-[1.03] mt-2">
            Die Schweizer Plattformen im ästhetischen & diskreten Härtetest.
          </h1>
        </div>

        {/* Asymmetrische Bild-Reportagen statt trockener Excel-Kästchen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {PORTAL_STORIES.map((p, idx) => (
            <Link
              key={p.name}
              href={`/reviews/${p.slug}`}
              className={`group relative h-[440px] overflow-hidden block no-underline shadow-2xl ${
                idx % 2 === 0 ? "mask-arch" : "mask-tear"
              }`}
            >
              <img src={p.img} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute top-6 left-8 right-8 flex justify-between items-center">
                <span className="font-editorial italic text-4xl text-[#E0B589]">N° {p.rank}</span>
                <span className="px-4 py-1.5 rounded-full bg-black/70 backdrop-blur-md text-xs uppercase tracking-[0.2em] text-white">
                  Note {p.score} / 10
                </span>
              </div>
              <div className="absolute bottom-8 left-8 right-8 space-y-2">
                <div className="text-xs uppercase tracking-[0.25em] text-[#E0B589]">{p.verdict}</div>
                <h2 className="font-editorial italic text-4xl sm:text-5xl text-white font-normal">{p.name}</h2>
                <p className="text-sm text-white/80">{p.atmosphere}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}