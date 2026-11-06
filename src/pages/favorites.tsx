import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { Heart, Trash2, Scale, Plus, ArrowRight, Sparkles } from "lucide-react";

export default function FavoritesPage() {
  const [favIds, setFavIds] = useState<string[]>([]);
  const [cantonFilter, setCantonFilter] = useState<string>("ALL");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("ch_favorite_profiles") || "[]";
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        setFavIds(parsed);
      } else {
        // Initialisiere mit 3 Top-Profilen aus ZG/ZH als Start-Inspiration, falls leer
        const starter = ((offersData as any[]) || []).slice(0, 3).map((o) => o.id || o.dedupClusterId);
        setFavIds(starter);
        localStorage.setItem("ch_favorite_profiles", JSON.stringify(starter));
      }
    } catch {}
  }, []);

  const updateFavs = (next: string[]) => {
    setFavIds(next);
    try {
      localStorage.setItem("ch_favorite_profiles", JSON.stringify(next));
      window.dispatchEvent(new Event("ch-favorites-updated"));
    } catch {}
  };

  const toggleFav = (id: string) => {
    if (favIds.includes(id)) {
      updateFavs(favIds.filter((x) => x !== id));
    } else {
      updateFavs([id, ...favIds]);
    }
  };

  const allProfiles = useMemo(() => {
    return ((offersData as any[]) || []).slice(0, 120).map((o) => {
      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      return {
        ...o,
        id: o.id || o.dedupClusterId,
        rate60Chf: r60,
        rate30Chf: r30,
      };
    });
  }, []);

  const savedProfiles = useMemo(
    () => allProfiles.filter((p) => favIds.includes(p.id)),
    [allProfiles, favIds]
  );

  const suggestions = useMemo(() => {
    return allProfiles
      .filter((p) => !favIds.includes(p.id) && (cantonFilter === "ALL" || p.canton === cantonFilter))
      .slice(0, 12);
  }, [allProfiles, favIds, cantonFilter]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Meine Schweizer Favoriten & Merkliste (Zero-Trace lokal gespeichert) | iwantsexnow.ch"
        description="Verwalte deine gespeicherten Schweizer Escort- & Massage-Favoriten anonym auf deinem Gerät und vergleiche Honorare & Attribute mit 1 Klick."
        url="https://iwantsexnow.ch/favorites"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-rose-400 font-bold flex items-center gap-1.5">
              <Heart size={14} className="fill-rose-400" /> PERSÖNLICHE SCHWEIZER MERKLISTE ({savedProfiles.length} PROFILE)
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Deine gespeicherten Favoriten & Schnellvergleich
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              100 % lokal auf deinem Gerät gespeichert (kein Account erforderlich).
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link
              href="/compare-escorts"
              className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold inline-flex items-center gap-1.5"
            >
              <Scale size={14} /> 4-Profil Direktvergleich öffnen →
            </Link>
            {savedProfiles.length > 0 && (
              <button
                type="button"
                onClick={() => updateFavs([])}
                className="px-3.5 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold cursor-pointer"
              >
                Liste leeren
              </button>
            )}
          </div>
        </section>

        {/* Gespeicherte Favoriten */}
        {savedProfiles.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#121722] border border-white/10 text-center space-y-3">
            <p className="text-sm text-gray-300 font-semibold">Deine Merkliste ist aktuell leer.</p>
            <p className="text-xs text-gray-400">Füge unten mit 1 Klick Profile aus deinem Kanton hinzu.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedProfiles.map((p: any) => (
              <div key={p.id} className="rounded-2xl bg-[#121722] border border-[#C8A97E]/60 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-60 bg-[#0D111A]">
                    <img
                      src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                      alt={p.rawName}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                      className="w-full h-full object-cover object-top"
                    />
                    <button
                      type="button"
                      onClick={() => toggleFav(p.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-rose-400 hover:bg-rose-500 hover:text-white cursor-pointer"
                      title="Aus Merkliste entfernen"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/80 border border-white/15 text-xs font-extrabold text-[#C8A97E]">
                      CHF {p.rate60Chf}.– / 60m
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-[#C8A97E]">{p.canton} · {p.city}</span>
                      <span className="text-gray-400">30 Min.: CHF {p.rate30Chf}.–</span>
                    </div>
                    <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block text-base font-serif font-bold text-white hover:text-[#C8A97E] truncate">
                      {p.rawName}
                    </Link>
                    <div className="text-xs text-gray-300">
                      {p.age || 25} J. · {p.heightCm || 168} cm · Cup {p.cupSize || "C"} · {p.hairColor || "Brünett"}
                    </div>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Link
                    href={`/profile/${encodeURIComponent(p.id)}`}
                    className="block w-full py-2.5 px-3 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs text-center"
                  >
                    Profil & +41 Kontakt öffnen →
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Weitere Empfehlungen nach Kanton zum 1-Klick-Merken */}
        <section className="space-y-4 pt-6 border-t border-white/10">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-serif font-bold text-white">
              Weitere Top-Profile nach Kanton zur Merkliste hinzufügen
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "GE"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCantonFilter(c)}
                  className={`px-3 py-1 rounded-lg text-xs font-extrabold cursor-pointer ${
                    cantonFilter === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#121722] text-gray-300 border border-white/10"
                  }`}
                >
                  {c === "ALL" ? "Alle" : c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestions.map((p: any) => (
              <div key={p.id} className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-col justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                    alt={p.rawName}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                    className="w-12 h-12 rounded-xl object-cover object-top"
                  />
                  <div className="min-w-0">
                    <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-xs font-bold text-white hover:text-[#C8A97E] truncate block">
                      {p.rawName}
                    </Link>
                    <div className="text-[11px] text-gray-400">{p.city} ({p.canton}) · CHF {p.rate60Chf}.–</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFav(p.id)}
                  className="w-full py-2 rounded-xl bg-white/5 hover:bg-[#C8A97E] text-gray-200 hover:text-[#0D111A] border border-white/10 text-xs font-extrabold cursor-pointer transition"
                >
                  ♥ Auf Merkliste speichern
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}