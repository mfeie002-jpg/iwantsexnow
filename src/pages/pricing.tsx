import React from "react";
import Head from "next/head";
import Link from "next/link";
import LuxuryHeader from "../components/LuxuryHeader";
import MobileBottomNav from "../components/MobileBottomNav";

const SWISS_SUITES = [
  { title: "Kurzes Rendezvous · 30 Min.", chf: "CHF 200 – 300", sub: "Diskreter Besuch im privaten Studio oder Apartment", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80" },
  { title: "Klassische Stunde · 60 Min.", chf: "CHF 350 – 500", sub: "Girlfriend Experience, Tantra-Ritual oder Hotelbesuch", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80" },
  { title: "Dinner & Suite · 3 bis 4 Std.", chf: "CHF 1'000 – 1'600", sub: "Begleitung zum Abendessen in Zürich, Zug oder Genf", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80" },
  { title: "Overnight bis zum Morgen", chf: "CHF 2'000 – 3'500", sub: "Unbeschwerte Nacht inklusive Frühstück im Grand Hotel", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80" }
];

export default function PricingPage() {
  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Head>
        <title>Schweizer Honorar- & Suite-Kompass — iWantSexNow.ch</title>
      </Head>
      <LuxuryHeader />

      <main className="max-w-[1400px] w-full mx-auto px-6 sm:px-14 pt-10">
        <div className="max-w-3xl mb-14">
          <div className="text-xs uppercase tracking-[0.35em] text-[#E0B589]">Transparenz & Etikette</div>
          <h1 className="font-editorial italic text-5xl sm:text-7xl font-normal leading-[1.03] mt-2">
            Übliche Honorare in Zürich, Zug & Genève.
          </h1>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7">
          {SWISS_SUITES.map((s) => (
            <Link
              key={s.title}
              href="/"
              className="group relative h-[430px] overflow-hidden mask-arch block no-underline shadow-2xl"
            >
              <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute bottom-7 left-6 right-6 space-y-2">
                <div className="text-xs uppercase tracking-[0.22em] text-[#E0B589]">{s.title}</div>
                <div className="font-editorial italic text-4xl text-white">{s.chf}</div>
                <p className="text-xs text-white/75 leading-relaxed">{s.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}