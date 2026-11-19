import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDesignWorld, DesignWorld } from "../lib/DesignWorldContext";

const SWISS_SCENES = [
  { name: "Zürich", area: "Seefeld · Paradeplatz · Limmat", href: "/orte/zuerich", img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=700&q=80" },
  { name: "Zug & Cham", area: "Seeufer · Baar · Diskrete Residenzen", href: "/orte/zug", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=700&q=80" },
  { name: "Genève", area: "Rue du Rhône · Grand Hotels", href: "/orte/geneve", img: "https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&w=700&q=80" },
  { name: "Basel", area: "Rhein · Kunstmuseum · Messe", href: "/orte/basel", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=700&q=80" },
  { name: "Luzern", area: "Vierwaldstättersee · Palace", href: "/orte/luzern", img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=700&q=80" },
  { name: "Lugano & Bern", area: "Tessiner Villen & Bundesstadt", href: "/orte/bern", img: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=700&q=80" }
];

const NAV_WORLDS = [
  { label: "Porträts", sub: "Dossiers", href: "/", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" },
  { label: "Nightlife", sub: "305 Villen & Clubs", href: "/clubs", img: "https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=200&q=80" },
  { label: "Concierge", sub: "30s Matching", href: "/matches", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=200&q=80" },
  { label: "Magazin", sub: "Markt-Test", href: "/reviews", img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=200&q=80" },
  { label: "Honorar", sub: "Tarif-Spiegel", href: "/pricing", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=200&q=80" },
  { label: "Atelier", sub: "Für Models", href: "/advertise", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=80" }
];

export function LuxuryHeader() {
  const { world, setWorld } = useDesignWorld();
  const [galleryMenuOpen, setGalleryMenuOpen] = useState(false);
  const router = useRouter();

  return (
    <>
      {/* =====================================================================
          LIVE-DESIGN-WELTEN-UMSCHALTER (SCHWEBT UNTEN LINKS AUF ALLEN SEITEN)
         ===================================================================== */}
      <div className="fixed bottom-20 md:bottom-6 left-4 z-50 flex flex-wrap items-center gap-1.5 p-1.5 rounded-full bg-black/85 backdrop-blur-2xl shadow-[0_15px_45px_rgba(0,0,0,0.85)] border border-white/15">
        <span className="text-[10px] uppercase tracking-[0.2em] text-[#E0B589] px-3 py-1 font-semibold">
          4 Extreme Welten:
        </span>
        {([
          { id: "atelier", name: "I. Soho Daylight (Papier)" },
          { id: "cinema", name: "II. Slixa Cinema (Dock)" },
          { id: "radar", name: "III. Night Radar (Spatial)" },
          { id: "brutalist", name: "IV. Feeld Art (Split)" }
        ] as { id: DesignWorld; name: string }[]).map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setWorld(item.id)}
            className={`px-3.5 py-1.5 rounded-full text-[11px] tracking-wider transition cursor-pointer border-0 ${
              world === item.id
                ? "bg-[#E0B589] text-black font-bold"
                : "bg-transparent text-white/75 hover:text-white"
            }`}
          >
            {item.name}
          </button>
        ))}
      </div>

      {/* =====================================================================
          NAVIGATION JE NACH WELT (KEIN STANDARD-COMPUTER-HEADER MEHR!)
         ===================================================================== */}

      {/* WELT 1: SOHO HOUSE DAYLIGHT ATELIER -> Gedruckter Magazin-Kopf wie Vogue / Monocle */}
      {world === "atelier" && (
        <header className="px-6 sm:px-14 pt-8 pb-6 border-b border-[#14110F]/15">
          <div className="max-w-[1440px] mx-auto flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <div className="text-[11px] uppercase tracking-[0.35em] text-[#8C2D38] mb-1">
                N° 26 · Édition Suisse · Zürich · Zug · Genève
              </div>
              <Link href="/" className="no-underline text-[#14110F]">
                <span className="font-editorial italic text-5xl sm:text-7xl tracking-tight leading-none">
                  iWantSexNow
                </span>
                <span className="font-editorial text-2xl sm:text-3xl text-[#8C2D38] ml-2">.ch</span>
              </Link>
            </div>

            {/* Bebilderte Magazin-Rubriken mit runden Foto-Miniaturen statt Icons */}
            <nav className="flex items-center gap-5 overflow-x-auto no-scrollbar pb-1">
              {NAV_WORLDS.map((n, i) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className="group flex items-center gap-3 pr-3 py-1 no-underline shrink-0"
                >
                  <img
                    src={n.img}
                    alt={n.label}
                    className="w-11 h-11 rounded-full object-cover group-hover:scale-110 transition shadow-md"
                  />
                  <div>
                    <div className="text-[10px] uppercase tracking-[0.2em] text-[#8C2D38]">0{i + 1}</div>
                    <div className={`font-editorial italic text-xl leading-none ${router.pathname === n.href ? "underline decoration-[#8C2D38] text-[#14110F]" : "text-[#14110F]/80"}`}>
                      {n.label}
                    </div>
                  </div>
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setGalleryMenuOpen(true)}
                className="px-5 py-2.5 rounded-full bg-[#14110F] text-[#F3EDE2] text-xs uppercase tracking-[0.2em] cursor-pointer border-0 shrink-0"
              >
                Städte-Kulissen
              </button>
            </nav>
          </div>
        </header>
      )}

      {/* WELT 2: SLIXA / TRYST CINEMA -> Oben nur schwebende Film-Signatur, Hauptnavigation als Foto-Dock! */}
      {world === "cinema" && (
        <>
          <header className="relative z-40 px-6 sm:px-14 pt-6 flex items-center justify-between">
            <Link href="/" className="no-underline flex items-baseline gap-3">
              <span className="font-editorial italic text-3xl sm:text-5xl text-[#F7F2EB] tracking-wide">
                iWantSe<span className="not-italic text-[#E0B589]">X</span>Now
              </span>
              <span className="hidden sm:inline text-[11px] uppercase tracking-[0.35em] text-[#E0B589]">
                Private Cinema & Escort Curations
              </span>
            </Link>

            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={() => setGalleryMenuOpen(true)}
                className="group flex items-center gap-3 pl-2 pr-5 py-1.5 rounded-full bg-[#1C1014]/90 backdrop-blur-xl text-[#F7F2EB] cursor-pointer border-0 shadow-2xl"
              >
                <div className="flex -space-x-2">
                  {SWISS_SCENES.slice(0, 3).map((s) => (
                    <img key={s.name} src={s.img} alt={s.name} className="w-7 h-7 rounded-full object-cover ring-1 ring-[#090607]" />
                  ))}
                </div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#E0B589]">Städte & Welten öffnen</span>
              </button>
              <Link href="/login" className="hidden sm:inline text-xs uppercase tracking-[0.2em] text-[#F7F2EB]/70 hover:text-white">
                Atelier Login
              </Link>
            </div>
          </header>

          {/* Schwebendes Slixa/Raya Foto-Dock oben unter der Signatur */}
          <div className="max-w-[1440px] mx-auto px-6 sm:px-14 pt-5">
            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-2">
              {NAV_WORLDS.map((n) => {
                const active = router.pathname === n.href;
                return (
                  <Link
                    key={n.href}
                    href={n.href}
                    className={`group relative flex items-center gap-3.5 pl-2 pr-6 py-2 rounded-full transition duration-500 shrink-0 no-underline ${
                      active
                        ? "bg-[#F7F2EB] text-[#090607] shadow-[0_10px_35px_rgba(224,181,137,0.3)]"
                        : "bg-[#170E11]/85 text-[#F7F2EB] hover:bg-[#24161B]"
                    }`}
                  >
                    <img src={n.img} alt={n.label} className="w-10 h-10 rounded-full object-cover" />
                    <div>
                      <div className="font-editorial italic text-xl leading-none">{n.label}</div>
                      <div className={`text-[10px] uppercase tracking-[0.18em] ${active ? "text-[#9E3347]" : "text-[#E0B589]"}`}>
                        {n.sub}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* WELT 3: ZURICH AFTER-HOURS RADAR -> Kompass-Bühne mit Uhrzeit-Atmosphäre */}
      {world === "radar" && (
        <header className="px-6 sm:px-14 pt-6 pb-4">
          <div className="max-w-[1440px] mx-auto flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#D4A359]/20">
            <Link href="/" className="no-underline flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden ring-2 ring-[#D4A359]">
                <img src="https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=200&q=80" alt="Swiss Night" className="w-full h-full object-cover" />
              </div>
              <div>
                <div className="font-editorial italic text-3xl text-[#EFECE6] leading-none">
                  iWantSexNow · Night Radar
                </div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-[#D4A359] mt-1">
                  47° 22&apos; N, 8° 32&apos; E · Zürich · Zug · Genève
                </div>
              </div>
            </Link>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar">
              {NAV_WORLDS.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`px-4 py-2 rounded-full text-xs uppercase tracking-[0.18em] no-underline transition ${
                    router.pathname === n.href
                      ? "bg-[#D4A359] text-[#06090B] font-bold"
                      : "bg-[#0D1418] text-[#EFECE6]/80 hover:text-white"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setGalleryMenuOpen(true)}
                className="px-4 py-2 rounded-full bg-[#1E4D45] text-white text-xs uppercase tracking-[0.18em] cursor-pointer border-0"
              >
                Karten-Panorama
              </button>
            </div>
          </div>
        </header>
      )}

      {/* WELT 4: FEELD / ART BRUTALISM -> Übergrosse Editorial-Leiste ohne Schnörkel */}
      {world === "brutalist" && (
        <header className="px-6 sm:px-14 pt-6 pb-4">
          <div className="max-w-[1440px] mx-auto flex flex-wrap items-baseline justify-between gap-6">
            <Link href="/" className="no-underline">
              <span className="font-editorial italic text-5xl sm:text-6xl text-[#F5F3EF] tracking-tighter">
                IWSN / SUISSE
              </span>
            </Link>
            <div className="flex flex-wrap items-center gap-6 text-sm uppercase tracking-[0.22em]">
              {NAV_WORLDS.map((n) => (
                <Link
                  key={n.href}
                  href={n.href}
                  className={`no-underline transition ${
                    router.pathname === n.href ? "text-[#D94E34] underline underline-offset-8" : "text-[#F5F3EF]/75 hover:text-white"
                  }`}
                >
                  {n.label}
                </Link>
              ))}
              <button
                type="button"
                onClick={() => setGalleryMenuOpen(true)}
                className="px-4 py-1.5 bg-[#D94E34] text-white text-xs uppercase tracking-[0.2em] cursor-pointer border-0"
              >
                Städte
              </button>
            </div>
          </div>
        </header>
      )}

      {/* VOLLBILD-KULISSEN-VORHANG FÜR ALLE 4 WELTEN (100% FOTOGRAFIE STATT ICONS) */}
      {galleryMenuOpen && (
        <div className="fixed inset-0 z-50 bg-[#090607]/95 backdrop-blur-2xl overflow-y-auto p-6 sm:p-14 text-[#F7F2EB]">
          <div className="max-w-[1400px] mx-auto">
            <div className="flex items-center justify-between pb-10">
              <div>
                <div className="text-xs uppercase tracking-[0.35em] text-[#E0B589]">Visueller Schweizer Atlas</div>
                <h2 className="font-editorial italic text-4xl sm:text-6xl font-normal mt-1">
                  Wähle deine Stadt & Atmosphäre
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setGalleryMenuOpen(false)}
                className="px-7 py-3 rounded-full bg-[#F7F2EB] text-[#090607] text-xs font-bold uppercase tracking-[0.2em] cursor-pointer border-0"
              >
                Schliessen
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {SWISS_SCENES.map((scene, i) => (
                <Link
                  key={scene.name}
                  href={scene.href}
                  onClick={() => setGalleryMenuOpen(false)}
                  className={`group relative h-80 overflow-hidden block no-underline ${
                    i % 2 === 0 ? "mask-arch" : "mask-tear"
                  }`}
                >
                  <img
                    src={scene.img}
                    alt={scene.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
                  <div className="absolute bottom-6 left-6 right-6">
                    <div className="font-editorial italic text-4xl text-white">{scene.name}</div>
                    <div className="text-xs uppercase tracking-[0.2em] text-[#E0B589] mt-1">{scene.area}</div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
export default LuxuryHeader;
