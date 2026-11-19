import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import LuxuryHeader from "../components/LuxuryHeader";
import MobileBottomNav from "../components/MobileBottomNav";

const CLUB_AMBIENCES = [
  { id: "ALL", title: "Alle Adressen", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=800&q=80" },
  { id: "ZH", title: "Zürich & Limmattal", img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=800&q=80" },
  { id: "ZG", title: "Zug & Zentralschweiz", img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=800&q=80" },
  { id: "AG", title: "Aargau & Mittelland", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=800&q=80" },
  { id: "GE", title: "Genève & Romandie", img: "https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&w=800&q=80" }
];

const FEATURED_VENUES = [
  { name: "Villa Bellevue Privée", city: "Zürich Seefeld", canton: "ZH", vibe: "Penthouse & Champagne Lounge", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=900&q=80" },
  { name: "Maison d'Or Spa & Suite", city: "Zug / Baar", canton: "ZG", vibe: "Private Wellness & Diskrete Tiefgarage", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=900&q=80" },
  { name: "Le Velours Grand Club", city: "Genève Centre", canton: "GE", vibe: "Cabaret, Champagner-Separees & Suiten", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80" },
  { name: "Palais Noir Wellness", city: "Baden / Aargau", canton: "AG", vibe: "FKK-Saunalandschaft & Outdoor-Pool", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80" },
  { name: "Château du Lac", city: "Luzern", canton: "LU", vibe: "Seeblick-Suiten & Private Escort-Empfang", img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=900&q=80" },
  { name: "Atelier Rouge Bizarre", city: "Basel", canton: "BS", vibe: "Kuratierte BDSM- & Fetisch-Residenz", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=900&q=80" }
];

export default function ClubsPage() {
  const [region, setRegion] = useState("ALL");
  const list = FEATURED_VENUES.filter((v) => region === "ALL" || v.canton === region);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0809] text-[#F4EFEA]">
      <Head>
        <title>Schweizer Nightlife, Villen & Clubs — iWantSexNow.ch</title>
      </Head>
      <LuxuryHeader />

      <main className="max-w-[1400px] w-full mx-auto px-4 sm:px-10 pt-8">
        <p className="text-xs uppercase tracking-[0.35em] text-[#D9B38C]">Schweizer Nightlife-Architektur</p>
        <h1 className="font-editorial italic text-5xl sm:text-7xl font-normal mt-2 mb-8">
          Diskrete Villen, Saunaclubs & Separees.
        </h1>

        {/* Visuelle Regionen-Bühnen statt Filter-Kästchen */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-14">
          {CLUB_AMBIENCES.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setRegion(c.id)}
              className={`relative h-36 overflow-hidden shape-petal text-left cursor-pointer border-0 transition ${
                region === c.id ? "ring-2 ring-[#D9B38C]" : "opacity-75 hover:opacity-100"
              }`}
            >
              <img src={c.img} alt={c.title} className="w-full h-full object-cover brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0809] via-transparent to-transparent" />
              <div className="absolute bottom-3 left-4 font-editorial italic text-xl text-white">
                {c.title}
              </div>
            </button>
          ))}
        </div>

        {/* Grosse Editorial-Bühnenkarten */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {list.map((venue, i) => (
            <div
              key={venue.name}
              className={`group relative h-96 overflow-hidden ${i % 2 === 0 ? "shape-petal" : "shape-arch"}`}
            >
              <img src={venue.img} alt={venue.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-75" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0809] via-[#0B0809]/35 to-transparent" />
              <div className="absolute bottom-8 left-8 right-8 space-y-2">
                <div className="text-xs uppercase tracking-[0.25em] text-[#D9B38C]">{venue.city} · {venue.canton}</div>
                <h2 className="font-editorial italic text-3xl sm:text-4xl text-white font-normal">{venue.name}</h2>
                <p className="text-sm text-[#F4EFEA]/80">{venue.vibe}</p>
                <div className="pt-2">
                  <Link href="/" className="text-xs uppercase tracking-[0.2em] text-[#D9B38C] underline underline-offset-8">
                    Anwesende Models ansehen →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      <MobileBottomNav />
    </div>
  );
}