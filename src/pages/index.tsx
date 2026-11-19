import React, { useState, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import LuxuryHeader from "../components/LuxuryHeader";
import MobileBottomNav from "../components/MobileBottomNav";
import harvestedData from "../data/harvested-offers.json";

interface RawOffer {
  id: string;
  rawName?: string;
  city?: string;
  canton?: string;
  rate60Chf?: number;
  rate30Chf?: number;
  photoUrl?: string;
  photos?: string[];
  rawPhone?: string;
  category?: string;
  sourceDomain?: string;
  verified?: boolean;
  available4h?: boolean;
}

const MOOD_STORIES = [
  { id: "all", label: "Alle Inspirationen", sub: "Ganze Schweiz", img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80" },
  { id: "escort", label: "Dinner & Hotel", sub: "Girlfriend Experience", img: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=500&q=80" },
  { id: "massage", label: "Tantra & Rituale", sub: "Hautnah entspannen", img: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=500&q=80" },
  { id: "late", label: "Späte Stunden", sub: "Jetzt spontan frei", img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=500&q=80" },
  { id: "bdsm", label: "Fetisch & Bizarre", sub: "Dominanz & Hingabe", img: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=500&q=80" },
  { id: "trans", label: "Trans & Muse", sub: "Exotische Begleitung", img: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=500&q=80" }
];

const CANTON_SCENES = [
  { code: "ALL", name: "Ganze Schweiz", img: "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=400&q=80" },
  { code: "ZH", name: "Zürich", img: "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=400&q=80" },
  { code: "ZG", name: "Zug & Cham", img: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
  { code: "GE", name: "Genève", img: "https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&w=400&q=80" },
  { code: "BS", name: "Basel", img: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=400&q=80" },
  { code: "LU", name: "Luzern", img: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=400&q=80" },
  { code: "AG", name: "Aargau", img: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=400&q=80" },
  { code: "BE", name: "Bern", img: "https://images.unsplash.com/photo-1509356843151-3e7d96241e11?auto=format&fit=crop&w=400&q=80" }
];

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80"
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
  const allOffers = (Array.isArray(harvestedData) ? harvestedData : (harvestedData as any)?.offers || []) as RawOffer[];
  const [selectedCanton, setSelectedCanton] = useState("ALL");
  const [selectedMood, setSelectedMood] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleCount, setVisibleCount] = useState(36);

  const filtered = useMemo(() => {
    return allOffers.filter((item) => {
      const text = `${item.rawName || ""} ${item.city || ""} ${item.category || ""}`.toLowerCase();
      const isTrans = /\b(ts|trans|shemale|ladyboy)\b/i.test(text);
      if (selectedMood !== "trans" && isTrans) return false;
      if (selectedMood === "trans" && !isTrans) return false;
      if (selectedMood === "massage" && !/massage|tantra|body/i.test(text)) return false;
      if (selectedMood === "bdsm" && !/domina|bdsm|fetisch|bizarre/i.test(text)) return false;
      if (selectedCanton !== "ALL" && (item.canton || "").toUpperCase() !== selectedCanton) return false;
      if (searchQuery.trim() && !text.includes(searchQuery.trim().toLowerCase())) return false;
      return true;
    });
  }, [allOffers, selectedCanton, selectedMood, searchQuery]);

  const displayed = filtered.slice(0, visibleCount);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#0B0809] text-[#F4EFEA]">
      <Head>
        <title>iWantSexNow.ch — Schweizer Édition Privée für Begleitung & Nightlife</title>
        <meta name="description" content="Kuratierte Porträts, private Begleitung, Tantra-Ateliers und Schweizer Nightlife in Zürich, Zug, Genf, Basel und Luzern." />
      </Head>

      <LuxuryHeader />

      <main className="max-w-[1440px] w-full mx-auto px-4 sm:px-10 pt-4 sm:pt-10">
        {/* 1. ATMOSPHÄRISCHE BÜHNE (Kein Suchkasten, sondern lebendige Fotografie & Konversations-Einstieg) */}
        <section className="relative mb-14">
          {/* Warme, organische Hintergrund-Aura statt hartem Kasten */}
          <div className="absolute -top-20 left-1/4 w-[520px] h-[320px] rounded-full bg-[#9E3B4B]/15 blur-[130px] pointer-events-none" />
          <div className="absolute top-10 right-10 w-[420px] h-[280px] rounded-full bg-[#D9B38C]/10 blur-[120px] pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
            <div className="lg:col-span-8 space-y-5">
              <div className="text-xs uppercase tracking-[0.35em] text-[#D9B38C]">
                Zürich · Zug · Genève · Basel · Luzern
              </div>

              {/* Menschlicher "Mad-Libs" Konversations-Wähler statt Computer-Dropdowns */}
              <h1 className="font-editorial text-4xl sm:text-6xl lg:text-7xl font-normal leading-[1.06] text-[#F4EFEA]">
                Heute Abend in{" "}
                <span className="italic text-[#D9B38C] underline decoration-[#D9B38C]/40 underline-offset-8">
                  {CANTON_SCENES.find((c) => c.code === selectedCanton)?.name || "der Schweiz"}
                </span>{" "}
                auf der Suche nach{" "}
                <span className="italic text-[#F4EFEA]">
                  {MOOD_STORIES.find((m) => m.id === selectedMood)?.label || "echter Nähe"}.
                </span>
              </h1>
            </div>

            {/* Rahmenlose, menschliche Freitext-Zeile wie in einem Notizbuch */}
            <div className="lg:col-span-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Name, Wunsch oder Ort flüstern..."
                className="w-full input-human text-base sm:text-lg placeholder-[#A69B95]/60 font-editorial italic"
              />
            </div>
          </div>

          {/* 2. VISUELLE STÄDTE-KULISSEN (Echte Fotos in Pillen-Form statt Text-Buttons) */}
          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar pt-8 pb-2">
            {CANTON_SCENES.map((city) => {
              const active = selectedCanton === city.code;
              return (
                <button
                  key={city.code}
                  type="button"
                  onClick={() => setSelectedCanton(city.code)}
                  className={`group relative flex items-center gap-3 pr-5 pl-1.5 py-1.5 shape-pill-photo transition duration-300 cursor-pointer shrink-0 border-0 ${
                    active ? "bg-[#F4EFEA] text-[#0B0809]" : "bg-[#181214] text-[#F4EFEA] hover:bg-[#241B1E]"
                  }`}
                >
                  <img
                    src={city.img}
                    alt={city.name}
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <span className="text-xs font-semibold tracking-wider uppercase">{city.name}</span>
                </button>
              );
            })}
          </div>

          {/* 3. VISUELLE MOOD-BÖGEN (Arch-Portraits statt Kategorie-Icons) */}
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-5 pt-6">
            {MOOD_STORIES.map((mood) => {
              const active = selectedMood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setSelectedMood(mood.id)}
                  className={`group relative h-36 sm:h-48 overflow-hidden shape-arch text-left cursor-pointer border-0 transition duration-500 ${
                    active ? "ring-2 ring-[#D9B38C] scale-[1.02]" : "opacity-80 hover:opacity-100"
                  }`}
                >
                  <img
                    src={mood.img}
                    alt={mood.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700 brightness-75"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0809] via-[#0B0809]/25 to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="font-editorial italic text-lg sm:text-2xl text-white leading-tight">
                      {mood.label}
                    </div>
                    <div className="hidden sm:block text-[10px] uppercase tracking-[0.18em] text-[#D9B38C] mt-0.5">
                      {mood.sub}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* 4. DIE PORTRÄT-GALERIE (Ihr bestehendes Profil-Grid bleibt das Herzstück) */}
        <section>
          <div className="flex items-baseline justify-between mb-6">
            <h2 className="font-editorial italic text-2xl sm:text-3xl text-[#F4EFEA] font-normal">
              Kuratierte Dossiers <span className="text-sm not-italic text-[#A69B95] ml-2">({filtered.length})</span>
            </h2>
            <div className="flex gap-6 text-xs uppercase tracking-[0.2em] text-[#D9B38C]">
              <Link href="/compare-escorts" className="hover:text-white transition">Direktvergleich</Link>
              <Link href="/matches" className="hover:text-white transition">30s Concierge</Link>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-7">
            {displayed.map((profile, idx) => {
              const firstName = cleanFirstName(profile.rawName, idx);
              const fallbackImg = FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length];
              const rawImg = profile.photoUrl || (profile.photos && profile.photos[0]) || fallbackImg;
              const imgSrc = rawImg.startsWith("http") ? `/api/img?u=${encodeURIComponent(rawImg)}&f=${idx % 6}` : rawImg;
              const rate = profile.rate60Chf || 350;

              return (
                <Link
                  key={profile.id || idx}
                  href={`/profile/${profile.id}`}
                  className="group relative aspect-[3/4] overflow-hidden rounded-[22px] bg-[#140E10] block"
                >
                  <img
                    src={imgSrc}
                    alt={firstName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = fallbackImg;
                    }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-700 brightness-90 contrast-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0B0809] via-[#0B0809]/20 to-transparent" />

                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 rounded-full bg-[#0B0809]/70 backdrop-blur-md text-[10px] uppercase tracking-[0.2em] text-[#D9B38C]">
                      ● Frei
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 text-left">
                    <div className="font-editorial text-2xl sm:text-3xl text-white tracking-wide">
                      {firstName}
                    </div>
                    <div className="text-xs text-[#F4EFEA]/75 tracking-wider mt-0.5">
                      {profile.city || "Zürich"} · <span className="text-[#D9B38C]">CHF {rate}</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {visibleCount < filtered.length && (
            <div className="mt-16 text-center">
              <button
                type="button"
                onClick={() => setVisibleCount((prev) => prev + 36)}
                className="px-10 py-4 rounded-full bg-[#F4EFEA] text-[#0B0809] text-xs font-semibold uppercase tracking-[0.25em] hover:bg-[#D9B38C] transition cursor-pointer border-0"
              >
                Weitere Porträts entfalten
              </button>
            </div>
          )}
        </section>

        {/* 5. VISUELLE EDITORIAL-SEKTIONEN STATT TEXT-BOXEN UNTER DEM KATALOG */}
        <section className="mt-28 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 relative h-[420px] overflow-hidden shape-petal">
            <img
              src="https://images.unsplash.com/photo-1566417713940-fe7c737a9ef2?auto=format&fit=crop&w=1200&q=80"
              alt="Schweizer Nightlife & Clubs"
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0B0809] via-[#0B0809]/40 to-transparent" />
            <div className="absolute bottom-10 left-8 sm:left-12 max-w-md space-y-3">
              <div className="text-xs uppercase tracking-[0.3em] text-[#D9B38C]">Private Villen & Lounges</div>
              <h3 className="font-editorial italic text-4xl sm:text-5xl text-white font-normal">
                305 Schweizer Clubs, Saunen & Separees.
              </h3>
              <Link
                href="/clubs"
                className="inline-block mt-2 px-6 py-3 rounded-full bg-[#F4EFEA] text-[#0B0809] text-xs font-semibold uppercase tracking-[0.2em] hover:bg-[#D9B38C] transition"
              >
                Nightlife-Guide öffnen
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-[420px] overflow-hidden shape-arch">
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80"
              alt="Schweizer Portal-Report"
              className="w-full h-full object-cover brightness-75"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0809] via-[#0B0809]/40 to-transparent" />
            <div className="absolute bottom-10 left-8 right-8 space-y-3">
              <div className="text-xs uppercase tracking-[0.3em] text-[#D9B38C]">Unabhängige Redaktion</div>
              <h3 className="font-editorial italic text-3xl sm:text-4xl text-white font-normal">
                Der grosse Schweizer Portal- & Honorar-Report.
              </h3>
              <Link
                href="/reviews"
                className="inline-block mt-2 text-xs uppercase tracking-[0.25em] text-[#D9B38C] underline underline-offset-8 hover:text-white"
              >
                Reportagen & Tests lesen →
              </Link>
            </div>
          </div>
        </section>
      </main>

      <MobileBottomNav />
    </div>
  );
}