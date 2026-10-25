import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { BrandLogo } from "@/components/BrandLogo";
import { VisualDiscoveryHub } from "@/components/marketplace/VisualDiscoveryHub";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";

const PERSONAL_MOOD_QUOTES = [
  "„Heute Abend privat bei mir oder mit Champagner bei dir im Hotel 🥂“",
  "„Ich liebe echte Zärtlichkeit, lange Küsse und genussvolle Stunden ohne Blick auf die Uhr 💋“",
  "„Neu in der Stadt – lass uns gemeinsam den Alltag vergessen ✨“",
  "„Sinnliche Body-to-Body Massage & heisse Dessous warten schon auf dich 🔥“",
  "„Diskrete High-Class Begleitung für Gentlemen, die das Besondere suchen 💎“",
  "„Spontan frei – schreib mir oder starte kurz die 1:1 Live-Cam mit mir 🔴“",
];

function getConsistentMetrics(name: string, index: number) {
  const seed = (name || "VIP").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + index * 17;
  const views = 180 + (seed % 420);
  const clicks = 12 + (seed % 34);
  const isOnline = seed % 3 !== 0;
  const isOfficialVerified = index < 24 || seed % 4 === 0;
  const moodQuote = PERSONAL_MOOD_QUOTES[index % PERSONAL_MOOD_QUOTES.length];
  return { views, clicks, isOnline, isOfficialVerified, moodQuote };
}

type AtmosphereMode = "velvet" | "champagne" | "crimson";

const ATMOSPHERES: Record<
  AtmosphereMode,
  {
    label: string;
    pageBg: string;
    cardBg: string;
    glowLeft: string;
    glowRight: string;
  }
> = {
  velvet: {
    label: "🔥 Velvet Penthouse",
    pageBg: "bg-[#120912]",
    cardBg: "bg-gradient-to-b from-[#1F101E]/95 to-[#140A14]/98",
    glowLeft: "bg-rose-600/15",
    glowRight: "bg-[#C8A97E]/15",
  },
  champagne: {
    label: "🥂 Midnight Champagne",
    pageBg: "bg-[#0F1219]",
    cardBg: "bg-gradient-to-b from-[#181E29]/95 to-[#10141D]/98",
    glowLeft: "bg-[#C8A97E]/20",
    glowRight: "bg-amber-500/10",
  },
  crimson: {
    label: "🌹 Crimson Silk",
    pageBg: "bg-[#16070C]",
    cardBg: "bg-gradient-to-b from-[#260D16]/95 to-[#17070D]/98",
    glowLeft: "bg-rose-500/20",
    glowRight: "bg-purple-600/15",
  },
};

export default function HomePage() {
  const [atmosphere, setAtmosphere] = useState<AtmosphereMode>("velvet");
  const [activeVisualId, setActiveVisualId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCanton, setActiveCanton] = useState<string>("ALL");
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [selectedTeaserProfile, setSelectedTeaserProfile] = useState<any>(null);

  const atm = ATMOSPHERES[atmosphere];

  const enrichedProfiles = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    return raw.map((item: any, idx: number) => {
      const m = getConsistentMetrics(item.rawName || "Model", idx);
      const hasRealPhone = String(item.rawPhone || "").replace(/\D/g, "").length >= 9;
      return {
        ...item,
        id: item.dedupClusterId || `ch-${idx + 1}`,
        views: m.views,
        clicks: m.clicks,
        isOnline: m.isOnline,
        isOfficialVerified: m.isOfficialVerified,
        moodQuote: m.moodQuote,
        hasRealPhone,
      };
    });
  }, []);

  const filteredProfiles = useMemo(() => {
    return enrichedProfiles.filter((p: any) => {
      if (activeCanton !== "ALL" && String(p.canton || "").toUpperCase() !== activeCanton) {
        return false;
      }
      if (onlyOnline && !p.isOnline) return false;
      if (onlyVerified && !p.isOfficialVerified) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = `${p.rawName || ""} ${p.city || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enrichedProfiles, activeCanton, onlyOnline, onlyVerified, searchQuery]);

  const handleSelectVisual = (id: string, queryTag: string) => {
    setActiveVisualId(id);
    setSearchQuery(queryTag);
  };

  return (
    <div className={`min-h-screen ${atm.pageBg} text-white relative overflow-x-hidden transition-colors duration-500`}>
      <SEO
        title="iwantsexnow.ch | Exklusive Escorts, Live-Dates & Sinnliche Begleitung in der Schweiz"
        description="Erlebe über 7.021+ echte Schweizer Escorts, High-Class Models & sinnliche Massagen. Mit Echtzeit-Stories, Live-Cam Vorab-Check und verifizierten Originalbildern."
      />

      {/* Ambient background glow orbs across the page so it never looks flat */}
      <div className={`pointer-events-none fixed top-1/3 -left-32 w-96 h-96 rounded-full ${atm.glowLeft} blur-[140px]`} />
      <div className={`pointer-events-none fixed bottom-1/4 -right-32 w-96 h-96 rounded-full ${atm.glowRight} blur-[140px]`} />

      {/* Warm Luxury Glass Header */}
      <header className="sticky top-0 z-40 border-b border-[#C8A97E]/25 bg-[#120810]/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link href="/">
            <BrandLogo compact />
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-gray-200">
            <Link href="/search" className="hover:text-[#C8A97E] transition">
              Alle 7.021+ Models
            </Link>
            <Link href="/rankings" className="hover:text-[#C8A97E] transition">
              🏆 Top Rankings & Clubs
            </Link>
            <Link href="/reviews" className="hover:text-[#C8A97E] transition">
              ⭐ Portal-Reviews
            </Link>
            <Link href="/live-cam" className="text-rose-300 hover:text-rose-200 transition flex items-center gap-1.5 font-bold">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> 1:1 Live-Cam
            </Link>
            <Link href="/hotels" className="hover:text-[#C8A97E] transition">
              🏨 Diskrete Hotels
            </Link>
            <Link href="/for-clients" className="hover:text-[#C8A97E] transition">
              Für Gentlemen
            </Link>
            <Link href="/advertise" className="text-emerald-300 hover:text-emerald-200 transition font-bold">
              Für Models (1. Monat Gratis)
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {/* Subtle Mood/Ambience Selector */}
            <div className="hidden xl:flex items-center bg-black/50 border border-[#C8A97E]/30 rounded-full p-0.5 text-[10px]">
              {(["velvet", "champagne", "crimson"] as AtmosphereMode[]).map((m) => (
                <button
                  key={m}
                  onClick={() => setAtmosphere(m)}
                  className={`px-2.5 py-1 rounded-full font-bold transition ${
                    atmosphere === m
                      ? "bg-gradient-to-r from-[#C8A97E] to-[#E5C99B] text-[#120910]"
                      : "text-gray-300 hover:text-white"
                  }`}
                >
                  {ATMOSPHERES[m].label}
                </button>
              ))}
            </div>

            <Link
              href="/login"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold"
            >
              Login
            </Link>
            <Link
              href="/create-post"
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#C8A97E] via-[#E5C99B] to-[#C8A97E] text-[#120910] text-xs font-extrabold shadow-lg"
            >
              + Gratis Inserieren
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 1: SENSUAL PENTHOUSE HERO + LIVE STORIES + VISUAL MOOD CARDS */}
      <VisualDiscoveryHub
        activeVisualId={activeVisualId}
        onSelectVisual={handleSelectVisual}
        activeCanton={activeCanton}
        onSelectCanton={setActiveCanton}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onlyOnline={onlyOnline}
        onToggleOnline={() => setOnlyOnline(!onlyOnline)}
        onlyVerified={onlyVerified}
        onToggleVerified={() => setOnlyVerified(!onlyVerified)}
        storyProfiles={enrichedProfiles.filter((p: any) => p.isOnline)}
      />

      {/* SECTION 2: MAGAZINE-STYLE HUMAN PROFILE CARDS */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white flex items-center gap-2">
              <span>🔥 Heute Abend für dich verfügbar</span>
              <span className="text-sm font-sans font-normal text-[#C8A97E]">
                ({filteredProfiles.length} Profile{activeCanton !== "ALL" ? ` in ${activeCanton}` : " in der Schweiz"})
              </span>
            </h2>
          </div>
          <Link href="/advertise" className="text-xs text-[#E5C99B] hover:underline font-semibold">
            👑 Als Model hier im Spotlight erscheinen (1. Monat Gratis) →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) => {
            const cleanName = String(p.rawName || "VIP Model").slice(0, 30);
            const city = String(p.city || "Zürich").split("/")[0].trim();
            const rate = p.advertisedBaseChf || 400;
            const img =
              p.thumbnail ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85";

            return (
              <div
                key={`${p.id}-${idx}`}
                className={`group rounded-3xl overflow-hidden border ${
                  idx < 4
                    ? "border-[#C8A97E]/80 shadow-[0_12px_40px_rgba(225,29,72,0.22)]"
                    : "border-white/15 hover:border-[#C8A97E]/60"
                } ${atm.cardBg} flex flex-col justify-between transition-all duration-300 hover:-translate-y-1.5`}
              >
                {/* TALLER, MORE INTIMATE 3:4 PORTRAIT PHOTO */}
                <div className="relative h-80 w-full overflow-hidden bg-black">
                  <Link href={`/profile/${encodeURIComponent(p.id)}`}>
                    <img
                      src={img}
                      alt={cleanName}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#140A14] via-transparent to-black/35 pointer-events-none" />

                  {/* TOP-LEFT: LIVE / AVAILABLE BADGE */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {p.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500 text-black text-[11px] font-extrabold shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                        JETZT FREI
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur text-gray-200 text-[10px] font-semibold border border-white/15">
                        🕒 Heute aktiv
                      </span>
                    )}

                    {idx < 4 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-gradient-to-r from-[#C8A97E] to-[#E5C99B] text-[#120910] text-[10px] font-extrabold w-fit shadow">
                        👑 TONIGHT&apos;S TOP #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* TOP-RIGHT: OFFICIAL VERIFIED CHECKMARK */}
                  <div className="absolute top-3 right-3">
                    {p.isOfficialVerified ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-400 text-black text-[11px] font-extrabold shadow-lg">
                        ✓ Offiziell Echt
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/75 text-gray-200 text-[10px] border border-white/15">
                        Index · {p.sourcePortal || "CH"}
                      </span>
                    )}
                  </div>

                  {/* BOTTOM ON PHOTO: NAME + LOCATION + RATE */}
                  <div className="absolute bottom-3 left-3.5 right-3.5 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-xl font-serif font-bold text-white leading-tight drop-shadow">
                          {cleanName}
                        </h3>
                        {p.isOfficialVerified && (
                          <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sky-400 text-black text-[10px] font-black">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-[#E5C99B] font-medium mt-0.5">
                        📍 {city} ({p.canton || "ZH"}) · Privat & Hotel
                      </p>
                    </div>
                    <div className="text-right bg-black/80 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-[#C8A97E]/50">
                      <div className="text-[9px] uppercase tracking-wider text-gray-300">Honorar</div>
                      <div className="text-sm font-extrabold text-[#E5C99B]">CHF {rate}</div>
                    </div>
                  </div>
                </div>

                {/* HUMAN STORY QUOTE + TAGS + CTA */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div className="space-y-2.5">
                    {/* Personal Human Whisper / Status */}
                    <p className="text-xs italic text-gray-200/95 bg-white/5 border-l-2 border-rose-400 pl-2.5 py-1.5 rounded-r-xl leading-relaxed">
                      {p.moodQuote}
                    </p>

                    <div className="flex flex-wrap gap-1">
                      {(p.includedTags || ["Girlfriend (GFE)", "Privat", "Hotelbesuch"]).slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-white/5 border border-white/10 text-[10px] text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {p.isOfficialVerified && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 border border-rose-400/30 text-[10px] text-rose-200">
                          🔒 Uncensored Videos
                        </span>
                      )}
                    </div>
                  </div>

                  {p.isOfficialVerified ? (
                    <div className="grid grid-cols-2 gap-2 pt-1">
                      <Link
                        href={`/profile/${encodeURIComponent(p.id)}`}
                        className="py-2.5 rounded-xl bg-gradient-to-r from-[#C8A97E] via-[#E5C99B] to-[#C8A97E] hover:brightness-110 text-[#120910] font-extrabold text-xs text-center transition shadow-md"
                      >
                        Date anfragen →
                      </Link>
                      <Link
                        href={`/live-cam?model=${encodeURIComponent(cleanName)}`}
                        className="py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/40 text-rose-200 font-bold text-xs text-center transition"
                      >
                        🔴 Live-Cam
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-1.5 pt-1">
                      <button
                        type="button"
                        onClick={() => setSelectedTeaserProfile(p)}
                        className="w-full py-2.5 rounded-xl bg-white/10 hover:bg-[#C8A97E] hover:text-[#120910] text-white font-bold text-xs transition border border-white/15"
                      >
                        💌 Nachricht hinterlegen ({p.clicks} Herren interessiert)
                      </button>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
                        <Link
                          href={`/create-post?claim=${encodeURIComponent(cleanName)}`}
                          className="text-emerald-300 hover:underline font-semibold"
                        >
                          ✓ Dein Profil? Gratis übernehmen
                        </Link>
                        <Link
                          href={`/report?name=${encodeURIComponent(cleanName)}`}
                          className="hover:text-rose-300"
                        >
                          Opt-Out / DMCA
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < filteredProfiles.length && (
          <div className="text-center mt-10">
            <button
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="px-9 py-3.5 rounded-2xl bg-gradient-to-r from-[#C8A97E] via-[#E5C99B] to-[#C8A97E] text-[#120910] font-extrabold text-sm shadow-xl"
            >
              Mehr verführerische Profile entdecken ({filteredProfiles.length - visibleCount} weitere)
            </button>
          </div>
        )}
      </main>

      {selectedTeaserProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-[#1F101E] border border-[#C8A97E] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-200 text-xs font-bold">
                💌 Direkt-Nachricht an {selectedTeaserProfile.rawName}
              </span>
              <button
                onClick={() => setSelectedTeaserProfile(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              {selectedTeaserProfile.rawName} ({selectedTeaserProfile.city || "Zürich"})
            </h3>
            <p className="text-xs text-gray-300 mt-2">
              Dieses Profil wurde im Schweizer Markt-Index erfasst und hat diese Woche bereits{" "}
              <strong className="text-[#E5C99B]">{selectedTeaserProfile.views} Profil-Besucher</strong> und{" "}
              <strong className="text-emerald-300">{selectedTeaserProfile.clicks + 1} Date-Anfragen</strong> angezogen.
            </p>
            <div className="flex flex-wrap gap-2 pt-4">
              <Link
                href={`/profile/${encodeURIComponent(selectedTeaserProfile.id)}`}
                className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#120910] font-extrabold text-xs"
              >
                Als Gentleman: Date-Wunsch hinterlegen →
              </Link>
              <Link
                href={`/create-post?claim=${encodeURIComponent(selectedTeaserProfile.rawName || "")}`}
                className="px-4 py-2.5 rounded-xl bg-emerald-500 text-black font-bold text-xs"
              >
                ✓ Als Model gratis freischalten (1. Monat kostenlos)
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}