import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const CITY_VISUALS = [
  { name: "Zürich", sub: "Limmatquai · Seefeld · City", href: "/orte/zuerich", img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80" },
  { name: "Zug & Cham", sub: "Seeufer · Baar · Diskret", href: "/orte/zug", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80" },
  { name: "Genève", sub: "Rue du Rhône · Lac · Luxury", href: "/orte/geneve", img: "https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&w=600&q=80" },
  { name: "Basel", sub: "Rhein · Grossbasel · Messeturm", href: "/orte/basel", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80" },
  { name: "Luzern", sub: "Vierwaldstättersee · Pilatus", href: "/orte/luzern", img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80" },
  { name: "Bern & Lugano", sub: "Bundeshauptstadt & Tessin", href: "/orte/bern", img: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=600&q=80" }
];

const EXPERIENCE_VISUALS = [
  { title: "Private Begleitung", sub: "Dinner, Hotel & GFE", href: "/?cat=escort", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=600&q=80" },
  { title: "Sinnliche Massagen", sub: "Tantra & Body-to-Body", href: "/?cat=massage", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80" },
  { title: "Clubs & Villen", sub: "305 Schweizer Adressen", href: "/clubs", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=600&q=80" },
  { title: "Vibe-Concierge", sub: "Persönliches Matching", href: "/matches", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80" }
];

export { LuxuryHeader };

export default function LuxuryHeader() {
  const [curtainOpen, setCurtainOpen] = useState(false);
  const router = useRouter();

  const quickExit = () => {
    window.location.replace("https://www.nzz.ch");
  };

  return (
    <>
      <header className="sticky top-0 z-50 px-4 sm:px-10 pt-4 pb-2 pointer-events-none">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between pointer-events-auto">
          {/* Asymmetrische Editorial-Wortmarke statt tech-logo */}
          <Link href="/" className="group flex items-baseline gap-2 no-underline">
            <span className="font-editorial italic text-2xl sm:text-3xl tracking-tight text-[#F4EFEA]">
              iWantSe<span className="not-italic font-bold text-[#D9B38C] text-3xl sm:text-4xl mx-0.5">X</span>Now
            </span>
            <span className="hidden sm:inline-block text-[11px] uppercase tracking-[0.28em] text-[#A69B95] group-hover:text-[#D9B38C] transition">
              Suisse · Édition Privée
            </span>
          </Link>

          {/* Schwebende organische Glas-Kapsel in der Mitte (Ohne Computer-Icons) */}
          <nav className="hidden md:flex items-center gap-8 px-8 py-3 rounded-full bg-[#140E10]/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)]">
            <Link href="/" className={`text-sm tracking-wide transition ${router.pathname === "/" ? "text-[#D9B38C] font-semibold" : "text-[#F4EFEA]/80 hover:text-white"}`}>
              Porträts
            </Link>
            <button
              type="button"
              onClick={() => setCurtainOpen(!curtainOpen)}
              className="text-sm tracking-wide text-[#F4EFEA]/80 hover:text-[#D9B38C] transition cursor-pointer bg-transparent border-0"
            >
              Städte & Welten {curtainOpen ? "—" : "+"}
            </button>
            <Link href="/clubs" className={`text-sm tracking-wide transition ${router.pathname.startsWith("/clubs") ? "text-[#D9B38C] font-semibold" : "text-[#F4EFEA]/80 hover:text-white"}`}>
              Nightlife & Clubs
            </Link>
            <Link href="/reviews" className={`text-sm tracking-wide transition ${router.pathname.startsWith("/reviews") ? "text-[#D9B38C] font-semibold" : "text-[#F4EFEA]/80 hover:text-white"}`}>
              Magazin & Markt-Test
            </Link>
            <Link href="/matches" className={`text-sm tracking-wide transition ${router.pathname.startsWith("/matches") ? "text-[#D9B38C] font-semibold" : "text-[#F4EFEA]/80 hover:text-white"}`}>
              Concierge
            </Link>
          </nav>

          {/* Rechte Seite: Ruhige Text-Links + Visueller Vorhang-Trigger */}
          <div className="flex items-center gap-4">
            <Link
              href="/advertise"
              className="hidden sm:inline-block text-xs uppercase tracking-[0.2em] text-[#D9B38C] hover:text-white transition"
            >
              Für Models
            </Link>
            <button
              type="button"
              onClick={() => setCurtainOpen(!curtainOpen)}
              className="px-5 py-2.5 rounded-full bg-[#F4EFEA] text-[#0B0809] text-xs font-semibold uppercase tracking-[0.18em] hover:bg-[#D9B38C] transition cursor-pointer border-0"
            >
              {curtainOpen ? "Schliessen" : "Index"}
            </button>
            <button
              type="button"
              onClick={quickExit}
              title="Diskreter Schnellausstieg"
              className="text-[11px] uppercase tracking-[0.15em] text-[#A69B95] hover:text-white bg-transparent border-0 cursor-pointer"
            >
              ESC
            </button>
          </div>
        </div>
      </header>

      {/* VISUELLER PANORAMA-VORHANG (Ersetzt alle Text-Dropdowns & Icon-Listen durch echte Fotografie) */}
      {curtainOpen && (
        <div className="fixed inset-0 z-40 bg-[#0B0809]/95 backdrop-blur-2xl overflow-y-auto pt-24 pb-16 px-6 sm:px-14 animate-fadeIn">
          <div className="max-w-[1400px] mx-auto space-y-12">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D9B38C] mb-2">Wähle deine Kulisse</p>
              <h2 className="font-editorial italic text-4xl sm:text-5xl text-[#F4EFEA] font-normal">
                Schweizer Städte bei Nacht
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mt-6">
                {CITY_VISUALS.map((c) => (
                  <Link
                    key={c.name}
                    href={c.href}
                    onClick={() => setCurtainOpen(false)}
                    className="group relative h-64 overflow-hidden shape-arch block"
                  >
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700 brightness-75 group-hover:brightness-95" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0809] via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="font-editorial text-2xl text-white">{c.name}</div>
                      <div className="text-[11px] text-[#D9B38C] tracking-wider">{c.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#D9B38C] mb-2">Erlebnis-Welten</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-4">
                {EXPERIENCE_VISUALS.map((exp) => (
                  <Link
                    key={exp.title}
                    href={exp.href}
                    onClick={() => setCurtainOpen(false)}
                    className="group relative h-44 overflow-hidden shape-petal block"
                  >
                    <img src={exp.img} alt={exp.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-700 brightness-75" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0B0809]/90 via-[#0B0809]/30 to-transparent" />
                    <div className="absolute bottom-4 left-5">
                      <div className="font-editorial italic text-2xl text-white">{exp.title}</div>
                      <div className="text-xs text-[#F4EFEA]/70">{exp.sub}</div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-8 flex flex-wrap items-center justify-between gap-6 text-sm text-[#A69B95]">
              <div className="flex flex-wrap gap-8">
                <Link href="/compare-escorts" onClick={() => setCurtainOpen(false)} className="hover:text-[#D9B38C] transition">Dossier-Vergleich</Link>
                <Link href="/pricing" onClick={() => setCurtainOpen(false)} className="hover:text-[#D9B38C] transition">Schweizer Honorar-Index</Link>
                <Link href="/for-clients" onClick={() => setCurtainOpen(false)} className="hover:text-[#D9B38C] transition">Diskretion & Etikette</Link>
                <Link href="/advertise" onClick={() => setCurtainOpen(false)} className="hover:text-[#D9B38C] transition">Profil übernehmen</Link>
                <Link href="/login" onClick={() => setCurtainOpen(false)} className="hover:text-[#D9B38C] transition">Atelier Login</Link>
                <Link href="/report" onClick={() => setCurtainOpen(false)} className="hover:text-[#D9B38C] transition">Eintrag melden / Opt-Out</Link>
              </div>
              <div className="text-xs tracking-[0.2em] uppercase text-[#D9B38C]">Zürich · Zug · Genève · Basel · Lugano</div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
