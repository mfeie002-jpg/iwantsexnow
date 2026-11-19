import React, { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import LuxuryHeader from "../components/LuxuryHeader";
import MobileBottomNav from "../components/MobileBottomNav";
import { useDesignWorld } from "../lib/DesignWorldContext";
import harvestedData from "../data/harvested-offers.json";

interface RawOffer {
  id: string;
  rawName?: string;
  city?: string;
  canton?: string;
  rate60Chf?: number;
  photoUrl?: string;
  photos?: string[];
  category?: string;
}

const VISUAL_CITIES = [
  { code: "ALL", name: "Schweiz", sub: "Alle Metropolen", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=600&q=80" },
  { code: "ZH", name: "Zürich", sub: "Seefeld & City", img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=600&q=80" },
  { code: "ZG", name: "Zug & Cham", sub: "Seeufer & Baar", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80" },
  { code: "GE", name: "Genève", sub: "Lac & Luxury", img: "https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&w=600&q=80" },
  { code: "BS", name: "Basel", sub: "Rhein & Messe", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=600&q=80" },
  { code: "LU", name: "Luzern", sub: "Zentralschweiz", img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=600&q=80" },
  { code: "BE", name: "Bern", sub: "Altstadt & Bellevue", img: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=600&q=80" }
];

const VISUAL_FANTASIES = [
  { id: "all", title: "Alle Begegnungen", sub: "Offene Inspiration", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80" },
  { id: "escort", title: "Suite & Champagner", sub: "Girlfriend Experience & Dinner", img: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=700&q=80" },
  { id: "massage", title: "Warmes Öl & Tantra", sub: "Hautnahe Rituale ohne Eile", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=700&q=80" },
  { id: "late", title: "Späte Verführung", sub: "Spontan heute Nacht", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80" },
  { id: "bdsm", title: "Samt & Dominanz", sub: "Fetisch & Bizarre", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=80" },
  { id: "trans", title: "Trans & Muse", sub: "Exotische Eleganz", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80" }
];

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80"
];

function cleanFirstName(raw?: string, idx = 0): string {
  if (!raw) return "Valentina";
  const cleaned = raw.replace(/[^a-zA-ZäöüÄÖÜéèà\s]/g, " ").trim();
  const first = cleaned.split(/\s+/).find((w) => w.length >= 3 && !/^(NEU|TOP|VIP|SEX|ESCORT|CH|TS)$/i.test(w));
  const defaults = ["Valentina", "Elena", "Sofia", "Camila", "Noemi", "Chiara", "Amélie", "Soraya"];
  if (!first) return defaults[idx % defaults.length];
  return first.charAt(0).toUpperCase() + first.slice(1).toLowerCase();
}

export default function HomePage() {
  const { world, sensoryMood, setSensoryMood } = useDesignWorld();
  const allOffers = (Array.isArray(harvestedData) ? harvestedData : (harvestedData as any)?.offers || []) as RawOffer[];
  const [selectedCanton, setSelectedCanton] = useState("ALL");
  const [selectedFantasy, setSelectedFantasy] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(32);

  const filtered = useMemo(() => {
    return allOffers.filter((item) => {
      const text = `${item.rawName || ""} ${item.city || ""} ${item.category || ""}`.toLowerCase();
      const isTrans = /\b(ts|trans|shemale|ladyboy)\b/i.test(text);
      if (selectedFantasy !== "trans" && isTrans) return false;
      if (selectedFantasy === "trans" && !isTrans) return false;
      if (selectedFantasy === "massage" && !/massage|tantra|body/i.test(text)) return false;
      if (selectedFantasy === "bdsm" && !/domina|bdsm|fetisch|bizarre/i.test(text)) return false;
      if (selectedCanton !== "ALL" && (item.canton || "").toUpperCase() !== selectedCanton) return false;
      if (searchQuery.trim() && !text.includes(searchQuery.trim().toLowerCase())) return false;
      return true;
    });
  }, [allOffers, selectedCanton, selectedFantasy, searchQuery]);

  const displayed = filtered.slice(0, visibleCount);
  const activeCityObj = VISUAL_CITIES.find((c) => c.code === selectedCanton) || VISUAL_CITIES[0];
  const activeFantasyObj = VISUAL_FANTASIES.find((f) => f.id === selectedFantasy) || VISUAL_FANTASIES[0];

  // Profil-Rendering (Ihr unberührtes, sauberes Porträt-Herzstück)
  const renderProfiles = (gridClass = "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4") => (
    <div className={`grid ${gridClass} gap-5 sm:gap-7`}>
      {displayed.map((profile, idx) => {
        const firstName = cleanFirstName(profile.rawName, idx);
        const fallbackImg = FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length];
        const rawImg = profile.photoUrl || (profile.photos && profile.photos[0]) || fallbackImg;
        const imgSrc = rawImg.startsWith("http") ? `/api/img?u=${encodeURIComponent(rawImg)}&f=${idx % 4}` : rawImg;
        const rate = profile.rate60Chf || 350;

        return (
          <Link
            key={profile.id || idx}
            href={`/profile/${profile.id}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-[22px] bg-[#140E10] block no-underline shadow-xl"
          >
            <img
              src={imgSrc}
              alt={firstName}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = fallbackImg;
              }}
              className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700 brightness-90"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 rounded-full bg-black/65 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-[#E0B589]">
                ● Frei
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-left">
              <div className="font-editorial text-2xl sm:text-3xl text-white tracking-wide">
                {firstName}
              </div>
              <div className="text-xs text-white/75 tracking-wider mt-0.5">
                {profile.city || "Zürich"} · <span className="text-[#E0B589]">CHF {rate}</span>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-between">
      <Head>
        <title>iWantSexNow.ch — Schweizer Édition Privée</title>
      </Head>

      <LuxuryHeader />

      {/* =====================================================================
          WELT 1: SOHO HOUSE DAYLIGHT ATELIER (Helles Büttenpapier, Magazin-Collage)
         ===================================================================== */}
      {world === "atelier" && (
        <main className="max-w-[1440px] w-full mx-auto px-6 sm:px-14 pt-10">
          {/* Asymmetrische Print-Magazin-Collage oben */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-16">
            <div className="lg:col-span-5 space-y-6">
              <div className="text-xs uppercase tracking-[0.3em] text-[#8C2D38]">
                Kapitel I · Persönliche Begleitung
              </div>
              <h1 className="font-editorial italic text-5xl sm:text-7xl leading-[1.02] text-[#14110F] font-normal">
                Ein Abend in {activeCityObj.name}, ganz nach deiner Handschrift.
              </h1>
              <p className="text-base text-[#5C534B] leading-relaxed">
                Blättere durch die Schweizer Städte-Postkarten oder tippe auf deine Stimmung. Kein Suchformular, keine Filter-Tabellen – nur echte Atmosphäre.
              </p>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Handschriftliche Notiz: Name, Ort oder Wunsch..."
                className="w-full human-line-input text-xl font-editorial italic text-[#14110F] placeholder-[#5C534B]/60"
              />
            </div>

            {/* Rechts: Überlappende Foto-Postkarten wie auf einem Holztisch */}
            <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-5">
              {VISUAL_FANTASIES.map((f, i) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFantasy(f.id)}
                  className={`group relative h-52 overflow-hidden text-left cursor-pointer border-0 shadow-xl ${
                    i % 2 === 0 ? "mask-arch" : "mask-editorial-tilt"
                  } ${selectedFantasy === f.id ? "ring-4 ring-[#8C2D38]" : ""}`}
                >
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="font-editorial italic text-2xl text-white leading-tight">{f.title}</div>
                    <div className="text-[10px] uppercase tracking-[0.18em] text-[#E0B589] mt-0.5">{f.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bebilderte Briefmarken-Leiste für die Schweizer Kantone */}
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar pb-10">
            {VISUAL_CITIES.map((c) => (
              <button
                key={c.code}
                type="button"
                onClick={() => setSelectedCanton(c.code)}
                className={`flex items-center gap-3.5 pl-2 pr-6 py-2 rounded-full cursor-pointer border-0 transition shrink-0 ${
                  selectedCanton === c.code
                    ? "bg-[#8C2D38] text-[#F3EDE2] shadow-lg"
                    : "bg-[#E7DEC8] text-[#14110F] hover:bg-[#DDD1B6]"
                }`}
              >
                <img src={c.img} alt={c.name} className="w-11 h-11 rounded-full object-cover" />
                <div className="text-left">
                  <div className="font-editorial italic text-2xl leading-none">{c.name}</div>
                  <div className="text-[10px] uppercase tracking-[0.15em] opacity-75">{c.sub}</div>
                </div>
              </button>
            ))}
          </div>

          {renderProfiles()}
        </main>
      )}

      {/* =====================================================================
          WELT 2: SLIXA / TRYST FULL-BLEED CINEMA (Kino-Bühne & Sensory Mood Dial)
         ===================================================================== */}
      {world === "cinema" && (
        <main className="max-w-[1440px] w-full mx-auto px-6 sm:px-14 pt-6">
          {/* Grosse, abgerundete Panorama-Kinobühne mit live wechselndem Kulissenfoto */}
          <section className="relative rounded-[42px] overflow-hidden mb-14 shadow-[0_30px_90px_rgba(0,0,0,0.85)]">
            <div className="relative h-[460px] sm:h-[520px] w-full">
              <img
                src={activeFantasyObj.img}
                alt={activeFantasyObj.title}
                className="w-full h-full object-cover brightness-75 scale-105 transition-all duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#090607] via-[#090607]/65 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090607] via-transparent to-transparent" />

              <div className="absolute inset-0 flex flex-col justify-end p-7 sm:p-14 max-w-3xl space-y-6">
                <div className="text-xs uppercase tracking-[0.35em] text-[#E0B589]">
                  {activeCityObj.name} · {activeFantasyObj.sub}
                </div>
                <h1 className="font-editorial italic text-5xl sm:text-7xl text-white font-normal leading-[1.02]">
                  „{activeFantasyObj.title}“ in {activeCityObj.name}.
                </h1>

                {/* Haptischer "Sensory Mood Slider" statt Computer-Filter */}
                <div className="space-y-2 max-w-xl pt-2">
                  <div className="flex justify-between text-[11px] uppercase tracking-[0.22em] text-[#E0B589]">
                    <span>Sanft & Zärtlich (Tantra)</span>
                    <span>Dinner & Hotel (GFE)</span>
                    <span>Spät & Verrucht</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={sensoryMood}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      setSensoryMood(val);
                      if (val < 33) setSelectedFantasy("massage");
                      else if (val < 66) setSelectedFantasy("all");
                      else setSelectedFantasy("bdsm");
                    }}
                    className="w-full accent-[#E0B589] cursor-pointer h-1.5 bg-white/20 rounded-lg"
                  />
                </div>

                {/* Bebilderte Städte-Linsen direkt auf der Kinobühne */}
                <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-2">
                  {VISUAL_CITIES.map((c) => (
                    <button
                      key={c.code}
                      type="button"
                      onClick={() => setSelectedCanton(c.code)}
                      className={`flex items-center gap-2.5 pl-1.5 pr-4 py-1.5 rounded-full cursor-pointer border-0 transition shrink-0 ${
                        selectedCanton === c.code
                          ? "bg-[#E0B589] text-[#090607] font-bold"
                          : "bg-black/60 backdrop-blur-xl text-white hover:bg-black/80"
                      }`}
                    >
                      <img src={c.img} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                      <span className="text-xs uppercase tracking-[0.16em]">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Überlappende Bogen-Galerie für die 6 Erlebnis-Welten am unteren Bühnenrand */}
            <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 px-6 sm:px-14 pb-8 bg-[#090607]">
              {VISUAL_FANTASIES.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setSelectedFantasy(f.id)}
                  className={`group relative h-40 overflow-hidden mask-arch text-left cursor-pointer border-0 transition duration-500 ${
                    selectedFantasy === f.id ? "ring-2 ring-[#E0B589] -translate-y-2" : "opacity-75 hover:opacity-100"
                  }`}
                >
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
                  <div className="absolute bottom-3 left-3.5 right-3.5">
                    <div className="font-editorial italic text-xl text-white leading-tight">{f.title}</div>
                    <div className="text-[10px] text-[#E0B589] truncate">{f.sub}</div>
                  </div>
                </button>
              ))}
            </div>
          </section>

          {renderProfiles()}
        </main>
      )}

      {/* =====================================================================
          WELT 3: ZURICH AFTER-HOURS SPATIAL RADAR (Organische Schweizer Foto-Inseln)
         ===================================================================== */}
      {world === "radar" && (
        <main className="max-w-[1440px] w-full mx-auto px-6 sm:px-14 pt-6">
          <section className="relative rounded-[36px] p-6 sm:p-12 mb-14 bg-[#0D1418] overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              <div className="lg:col-span-5 space-y-5">
                <div className="text-xs uppercase tracking-[0.3em] text-[#D4A359]">
                  Schweizer Nacht-Topografie
                </div>
                <h1 className="font-editorial italic text-5xl sm:text-6xl text-white font-normal leading-[1.05]">
                  Wo beginnt deine Nacht?
                </h1>
                <p className="text-sm text-[#8A99A1] leading-relaxed">
                  Tippe direkt auf eine der beleuchteten Schweizer Regionen-Inseln oder wähle deine Abend-Atmosphäre.
                </p>
                <div className="flex flex-wrap gap-2.5 pt-2">
                  {VISUAL_FANTASIES.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setSelectedFantasy(f.id)}
                      className={`flex items-center gap-2 pl-1.5 pr-4 py-1.5 rounded-full cursor-pointer border-0 transition ${
                        selectedFantasy === f.id ? "bg-[#D4A359] text-black font-bold" : "bg-[#06090B] text-white/80"
                      }`}
                    >
                      <img src={f.img} alt={f.title} className="w-7 h-7 rounded-full object-cover" />
                      <span className="text-xs">{f.title}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Rechts: Organisch versetzte Schweizer Städte-Inseln wie auf einer leuchtenden Karte */}
              <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
                {VISUAL_CITIES.slice(1).map((c, idx) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCanton(selectedCanton === c.code ? "ALL" : c.code)}
                    className={`group relative h-44 overflow-hidden text-left cursor-pointer border-0 transition duration-500 ${
                      idx % 2 === 0 ? "mask-tear" : "mask-arch"
                    } ${selectedCanton === c.code ? "ring-4 ring-[#D4A359] scale-105" : "opacity-85 hover:opacity-100"}`}
                  >
                    <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <div className="font-editorial italic text-3xl text-white leading-none">{c.name}</div>
                      <div className="text-[10px] uppercase tracking-[0.2em] text-[#D4A359] mt-1">{c.sub}</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </section>

          {renderProfiles()}
        </main>
      )}

      {/* =====================================================================
          WELT 4: FEELD / ART-GALLERY BRUTALISM (Sticky 40/60 Split-Screen & Foto-Typografie)
         ===================================================================== */}
      {world === "brutalist" && (
        <main className="max-w-[1440px] w-full mx-auto px-6 sm:px-14 pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            {/* Linke Seite (40%): Bleibt beim Scrollen wie ein Kunst-Plakat stehen! */}
            <div className="lg:col-span-5 lg:sticky lg:top-8 space-y-6">
              <div className="relative h-[460px] overflow-hidden mask-arch">
                <img
                  src={activeFantasyObj.img}
                  alt={activeFantasyObj.title}
                  className="w-full h-full object-cover brightness-80"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-xs uppercase tracking-[0.3em] text-[#D94E34]">
                    {activeCityObj.name} · Kulisse
                  </div>
                  <h1 className="font-editorial italic text-5xl sm:text-6xl text-white font-normal leading-none mt-1">
                    {activeFantasyObj.title}
                  </h1>
                </div>
              </div>

              {/* Übergrosse klickbare Typografie-Liste statt Buttons */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-2">
                {VISUAL_CITIES.map((c) => (
                  <button
                    key={c.code}
                    type="button"
                    onClick={() => setSelectedCanton(c.code)}
                    className={`font-editorial italic text-3xl sm:text-4xl cursor-pointer bg-transparent border-0 p-0 transition ${
                      selectedCanton === c.code ? "text-[#D94E34] underline" : "text-white/50 hover:text-white"
                    }`}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-3 gap-2.5 pt-2">
                {VISUAL_FANTASIES.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFantasy(f.id)}
                    className={`relative h-24 overflow-hidden text-left p-2.5 cursor-pointer border-0 ${
                      selectedFantasy === f.id ? "ring-2 ring-[#D94E34]" : "opacity-65 hover:opacity-100"
                    }`}
                  >
                    <img src={f.img} alt={f.title} className="absolute inset-0 w-full h-full object-cover brightness-50" />
                    <span className="relative z-10 font-editorial italic text-lg text-white leading-tight block">
                      {f.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Rechte Seite (60%): Fliessender Porträt-Strom */}
            <div className="lg:col-span-7">
              {renderProfiles("grid-cols-2 sm:grid-cols-3")}
            </div>
          </div>
        </main>
      )}

      {visibleCount < filtered.length && (
        <div className="my-16 text-center">
          <button
            type="button"
            onClick={() => setVisibleCount((prev) => prev + 32)}
            className="px-10 py-4 rounded-full bg-[#E0B589] text-black text-xs font-bold uppercase tracking-[0.25em] cursor-pointer border-0 shadow-xl"
          >
            Weitere Porträts entfalten
          </button>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}