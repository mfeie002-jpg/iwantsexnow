import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import LuxuryHeader from "../components/LuxuryHeader";
import MobileBottomNav from "../components/MobileBottomNav";

const VIBES = [
  { id: "dinner", title: "Champagner & Hotel-Suite", sub: "Stilvolle Begleitung ohne Zeitdruck", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80", href: "/?cat=escort" },
  { id: "tantra", title: "Hautnahes Tantra-Ritual", sub: "Warmes Öl, Ruhe & tiefe Berührung", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80", href: "/?cat=massage" },
  { id: "passion", title: "Spontane Leidenschaft", sub: "Sofort frei in deiner Nähe", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80", href: "/" }
];

export default function MatchesConciergePage() {
  const [selectedCity, setSelectedCity] = useState("Zürich");

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0809] text-[#F4EFEA]">
      <Head>
        <title>Persönlicher Vibe-Concierge — iWantSexNow.ch</title>
      </Head>
      <LuxuryHeader />

      <main className="max-w-[1300px] w-full mx-auto px-4 sm:px-10 pt-10">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D9B38C]">30-Sekunden Intuition</p>
        <h1 className="font-editorial italic text-5xl sm:text-7xl font-normal mt-2 mb-6">
          Wonach sehnt sich dein Abend in {selectedCity}?
        </h1>

        <div className="flex flex-wrap gap-3 mb-12">
          {["Zürich", "Zug & Cham", "Genève", "Basel", "Luzern", "Bern"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCity(c)}
              className={`px-6 py-2.5 rounded-full text-xs uppercase tracking-[0.2em] cursor-pointer border-0 transition ${
                selectedCity === c ? "bg-[#D9B38C] text-[#0B0809] font-bold" : "bg-[#181214] text-[#F4EFEA]"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {VIBES.map((v) => (
            <Link
              key={v.id}
              href={v.href}
              className="group relative h-[460px] overflow-hidden shape-arch block"
            >
              <img src={v.img} alt={v.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0809] via-[#0B0809]/30 to-transparent" />
              <div className="absolute bottom-8 left-7 right-7 space-y-2">
                <h2 className="font-editorial italic text-3xl text-white font-normal">{v.title}</h2>
                <p className="text-sm text-[#F4EFEA]/75">{v.sub}</p>
                <div className="pt-2 text-xs uppercase tracking-[0.22em] text-[#D9B38C]">
                  Passende Porträts in {selectedCity} →
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}