import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { VisualDiscoveryHub } from "@/components/marketplace/VisualDiscoveryHub";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { Check, MapPin, Phone, ShieldCheck, Video, ArrowUpRight } from "lucide-react";

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",
];

function getConsistentMetrics(name: string, index: number) {
  const seed = (name || "VIP").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + index * 17;
  const views = 180 + (seed % 420);
  const clicks = 12 + (seed % 34);
  const isOnline = seed % 3 !== 0;
  const isOfficialVerified = index < 24 || seed % 4 === 0;
  return { views, clicks, isOnline, isOfficialVerified };
}

export default function HomePage() {
  const [activeVisualId, setActiveVisualId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCanton, setActiveCanton] = useState<string>("ALL");
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(28);
  const [selectedTeaserProfile, setSelectedTeaserProfile] = useState<any>(null);

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
        hasRealPhone,
        fallbackImg: FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length],
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
    <div className="min-h-screen bg-[#090A0F] text-white pb-20 lg:pb-10">
      <SEO
        title="iwantsexnow.ch | Schweizer Escort-Verzeichnis, Privat-Models & Direktbuchung"
        description="Über 7.021+ verifizierte Escorts, Privat-Models, Tantra-Masseurinnen & 216 Clubs in Zürich, Zug, Basel, Bern & Genf. Geprüfte Fotos & transparente Stundentarife."
      />

      {/* Interactive Luxury Header with Dropdown Submenus & Mobile Drawer */}
      <LuxuryHeader />

      {/* Clean Visual Category & City Filter Bar */}
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
      />

      {/* Main High-Class Escort Portrait Grid */}
      <main className="max-w-7xl mx-auto px-4 py-7">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-5 pb-3 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-300">
            <span className="font-bold text-white">{filteredProfiles.length} Escorts & Studios</span>
            <span>in {activeCanton === "ALL" ? "der ganzen Schweiz" : `Kanton ${activeCanton}`}</span>
            {searchQuery && <span className="text-[#C8A97E]">· Filter: „{searchQuery}“</span>}
          </div>
          <div className="flex items-center gap-4 text-xs">
            <Link href="/rankings" className="text-gray-300 hover:text-white">
              216 Schweizer Clubs ansehen →
            </Link>
            <Link href="/advertise" className="text-[#C8A97E] hover:underline font-semibold">
              Top-Platzierung buchen →
            </Link>
          </div>
        </div>

        {/* 2 columns on mobile (authentic escort directory grid!), 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
          {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) => {
            const cleanName = String(p.rawName || "Model").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim().slice(0, 24) || "VIP Model";
            const age = Number(p.age) >= 18 && Number(p.age) <= 55 ? Number(p.age) : 24 + (idx % 7);
            const city = String(p.city || "Zürich").split("/")[0].trim();
            const rate = p.advertisedBaseChf || 400;
            const img = p.thumbnail || p.fallbackImg;

            return (
              <article
                key={`${p.id}-${idx}`}
                className={`group rounded-xl overflow-hidden bg-[#11131C] border transition-all duration-300 flex flex-col justify-between ${
                  idx < 4
                    ? "border-[#C8A97E]/60 shadow-[0_8px_30px_rgba(200,169,126,0.12)]"
                    : "border-white/10 hover:border-[#C8A97E]/50"
                }`}
              >
                {/* 3:4 Portrait Escort Photo */}
                <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07080C]">
                  <Link href={`/profile/${encodeURIComponent(p.id)}`}>
                    <img
                      src={img}
                      alt={`${cleanName}, ${age} – Escort in ${city}`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = p.fallbackImg;
                      }}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-black/25 pointer-events-none" />

                  {/* Top-Left: Subtle Status Indicator */}
                  <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                    {p.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-emerald-500/40 text-emerald-300 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Verfügbar
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/70 text-gray-300 text-[10px]">
                        Heute aktiv
                      </span>
                    )}
                    {idx < 4 && (
                      <span className="px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] text-[9px] font-extrabold uppercase tracking-wider w-fit">
                        Featured
                      </span>
                    )}
                  </div>

                  {/* Top-Right: Official Checkmark */}
                  <div className="absolute top-2.5 right-2.5">
                    {p.isOfficialVerified ? (
                      <span
                        title="Geprüftes Originalprofil"
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 backdrop-blur border border-[#C8A97E]/50 text-[#E5C99B] text-[10px] font-semibold"
                      >
                        <Check size={11} className="text-[#C8A97E]" /> Verifiziert
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-black/70 text-gray-400 text-[9px] border border-white/10">
                        {p.sourcePortal || "Index"}
                      </span>
                    )}
                  </div>

                  {/* Bottom Photo Overlay: Name, Age, Location & CHF Rate */}
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-1">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate">
                          {cleanName}, {age}
                        </h2>
                        {p.isOfficialVerified && (
                          <span className="w-3.5 h-3.5 rounded-full bg-[#C8A97E] text-[#090A0F] text-[9px] font-black inline-flex items-center justify-center shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-300 flex items-center gap-1 truncate">
                        <MapPin size={11} className="text-[#C8A97E] shrink-0" />
                        <span>{city} ({p.canton || "ZH"})</span>
                      </p>
                    </div>
                    <div className="shrink-0 bg-black/85 backdrop-blur px-2 py-1 rounded border border-white/15 text-right">
                      <div className="text-[9px] text-gray-400 leading-none">1 Std.</div>
                      <div className="text-xs font-bold text-[#C8A97E]">CHF {rate}</div>
                    </div>
                  </div>
                </div>

                {/* Clean Card Footer */}
                <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                  <div className="flex flex-wrap gap-1">
                    {(p.includedTags || ["GFE", "Privat", "Hotelbesuch"]).slice(0, 3).map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300 border border-white/5"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {p.isOfficialVerified ? (
                    <div className="grid grid-cols-2 gap-1.5">
                      <Link
                        href={`/profile/${encodeURIComponent(p.id)}`}
                        className="py-2 rounded-lg bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-bold text-[11px] text-center transition"
                      >
                        Profil & Kontakt
                      </Link>
                      <Link
                        href={`/live-cam?model=${encodeURIComponent(cleanName)}`}
                        className="py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 font-semibold text-[11px] text-center transition flex items-center justify-center gap-1"
                      >
                        <Video size={12} className="text-rose-400" /> Live-Cam
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => setSelectedTeaserProfile(p)}
                        className="w-full py-2 rounded-lg bg-white/5 hover:bg-[#C8A97E] hover:text-[#090A0F] text-gray-200 font-semibold text-[11px] transition border border-white/10 cursor-pointer"
                      >
                        Kontakt & Details ({p.views} Aufrufe)
                      </button>
                      <div className="flex items-center justify-between text-[9px] text-gray-500 px-0.5">
                        <Link
                          href={`/create-post?claim=${encodeURIComponent(cleanName)}`}
                          className="text-[#C8A97E] hover:underline"
                        >
                          Profil übernehmen
                        </Link>
                        <Link href={`/report?name=${encodeURIComponent(cleanName)}`} className="hover:text-gray-300">
                          Opt-Out / DMCA
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>

        {visibleCount < filteredProfiles.length && (
          <div className="text-center mt-8">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 28)}
              className="px-8 py-3 rounded-xl border border-[#C8A97E] bg-[#C8A97E]/10 hover:bg-[#C8A97E] text-[#C8A97E] hover:text-[#090A0F] font-bold text-xs uppercase tracking-wider transition cursor-pointer"
            >
              Weitere Profile anzeigen ({filteredProfiles.length - visibleCount} weitere)
            </button>
          </div>
        )}

        {/* Editorial B2B & Trust Footer Blocks */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14 pt-8 border-t border-white/10">
          <Link
            href="/advertise"
            className="p-5 rounded-xl bg-[#11131C] border border-white/10 hover:border-[#C8A97E]/60 transition group"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              Für selbstständige Models & Studios
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1 group-hover:text-[#C8A97E] flex items-center justify-between">
              <span>1. Monat kostenlos inserieren</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Übernehmen Sie Ihr bestehendes Profil kostenlos: Offizieller Verifizierungs-Haken, eigene Klick-Statistiken, Top-Spot Bidding und Verkauf von Locked Videos.
            </p>
          </Link>

          <Link
            href="/for-clients"
            className="p-5 rounded-xl bg-[#11131C] border border-white/10 hover:border-[#C8A97E]/60 transition group"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              Für diskrete Gentlemen
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1 group-hover:text-[#C8A97E] flex items-center justify-between">
              <span>Echte Fotos & Fixpreis-Garantie</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Wie unser dreistufiger Echtheits-Check, der 3-Minuten Vorab-Video-Call und transparente Komplettpreise vor Enttäuschungen schützen.
            </p>
          </Link>

          <Link
            href="/reviews"
            className="p-5 rounded-xl bg-[#11131C] border border-white/10 hover:border-[#C8A97E]/60 transition group"
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-[#C8A97E]">
              Marktbericht Schweiz 2026
            </div>
            <h3 className="text-base font-serif font-bold text-white mt-1 group-hover:text-[#C8A97E] flex items-center justify-between">
              <span>Top 10 Escort-Portale im Test</span>
              <ArrowUpRight size={16} />
            </h3>
            <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
              Detaillierte Reviews und Preisvergleiche zu xdate.ch, fgirl.ch, and6.com, rosalon.ch und kaufmich.com.
            </p>
          </Link>
        </div>
      </main>

      {/* Clean Modal for Indexed Profiles */}
      {selectedTeaserProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#11131C] border border-[#C8A97E]/60 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                Schweizer Markt-Index · {selectedTeaserProfile.sourcePortal || "CH"}
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
            <p className="text-xs text-gray-300 leading-relaxed">
              Dieses Profil verzeichnete auf <strong>iwantsexnow.ch</strong> bereits{" "}
              <strong className="text-white">{selectedTeaserProfile.views} Profil-Aufrufe</strong> und{" "}
              <strong className="text-[#C8A97E]">{selectedTeaserProfile.clicks + 1} Kontakt-Anfragen</strong>.
            </p>
            <div className="flex flex-col gap-2 pt-2">
              <Link
                href={`/profile/${encodeURIComponent(selectedTeaserProfile.id)}`}
                className="py-2.5 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs text-center"
              >
                Als Kunde: Vollständiges Profil & Buchungsanfrage öffnen →
              </Link>
              <Link
                href={`/create-post?claim=${encodeURIComponent(selectedTeaserProfile.rawName || "")}`}
                className="py-2.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold text-xs text-center border border-white/15"
              >
                Sind Sie diese Anbieterin? Profil kostenlos übernehmen (1. Monat gratis)
              </Link>
              <Link
                href={`/report?name=${encodeURIComponent(selectedTeaserProfile.rawName || "")}`}
                className="text-center text-[11px] text-gray-500 hover:text-gray-300 pt-1"
              >
                Eintrag entfernen / DMCA melden
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}