import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Meine Schweizer Favoriten & Merkliste (Zero-Trace lokal gespeichert) | iwantsexnow.ch"
        description="Verwalte deine gespeicherten Schweizer Escort- & Massage-Favoriten anonym auf deinem Gerät und vergleiche Honorare & Attribute mit 1 Klick."
        url="https://iwantsexnow.ch/favorites"
      />
      <LuxuryHeader />

      <PageIntro tone="blush" note="Deine Merkliste" art="none" title={<>Deine gespeicherten Favoriten & Schnellvergleich</>}
        lead={<>100 % lokal auf deinem Gerät gespeichert (kein Account erforderlich).</>} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        <section className="p-6 rounded-2xl bg-white border border-kirsche/40 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap gap-2">
            <Link
              href="/compare-escorts"
              className="px-4 py-2.5 rounded-xl bg-kirsche text-white text-[13px] font-extrabold inline-flex items-center gap-1.5"
            >
              <Scale size={14} /> 4-Profil Direktvergleich öffnen →
            </Link>
            {savedProfiles.length > 0 && (
              <button
                type="button"
                onClick={() => updateFavs([])}
                className="px-3.5 py-2.5 rounded-xl bg-glow-500/15 border border-glow-500/30 text-glow-700 text-[13px] font-bold cursor-pointer"
              >
                Liste leeren
              </button>
            )}
          </div>
        </section>

        {/* Gespeicherte Favoriten */}
        {savedProfiles.length === 0 ? (
          <div className="p-10 rounded-2xl bg-white border border-tinte/20 text-center space-y-3">
            <p className="text-sm text-gray-700 font-semibold">Deine Merkliste ist aktuell leer.</p>
            <p className="text-[13px] text-gray-600">Füge unten mit 1 Klick Profile aus deinem Kanton hinzu.</p>
          </div>
        ) : (
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {savedProfiles.map((p: any) => (
              <div key={p.id} className="rounded-2xl bg-white border border-kirsche/60 overflow-hidden flex flex-col justify-between">
                <div>
                  <div className="relative h-60 bg-papier">
                    <img
                      src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                      alt={p.rawName}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                      className="w-full h-full object-cover object-top"
                    />
                    <button
                      type="button"
                      onClick={() => toggleFav(p.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/80 text-glow-400 hover:bg-glow-500 hover:text-white cursor-pointer"
                      title="Aus Merkliste entfernen"
                    >
                      <Trash2 size={14} />
                    </button>
                    <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/80 border border-tinte/25 text-[13px] font-extrabold text-kirsche">
                      CHF {p.rate60Chf}.– / 60m
                    </div>
                  </div>
                  <div className="p-4 space-y-1.5">
                    <div className="flex items-center justify-between text-[13px]">
                      <span className="font-bold text-kirsche">{p.canton} · {p.city}</span>
                      <span className="text-gray-600">30 Min.: CHF {p.rate30Chf}.–</span>
                    </div>
                    <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block text-base font-serif font-bold text-tinte hover:text-kirsche truncate">
                      {p.rawName}
                    </Link>
                    <div className="text-[13px] text-gray-700">
                      {p.age || 25} J. · {p.heightCm || 168} cm · Cup {p.cupSize || "C"} · {p.hairColor || "Brünett"}
                    </div>
                  </div>
                </div>
                <div className="p-4 pt-0">
                  <Link
                    href={`/profile/${encodeURIComponent(p.id)}`}
                    className="block w-full py-2.5 px-3 rounded-xl bg-kirsche text-white font-extrabold text-[13px] text-center"
                  >
                    Profil & +41 Kontakt öffnen →
                  </Link>
                </div>
              </div>
            ))}
          </section>
        )}

        {/* Weitere Empfehlungen nach Kanton zum 1-Klick-Merken */}
        <section className="space-y-4 pt-6 border-t border-tinte/20">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-serif font-bold text-tinte">
              Weitere Top-Profile nach Kanton zur Merkliste hinzufügen
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "GE"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCantonFilter(c)}
                  className={`px-3 py-1 rounded-lg text-[13px] font-extrabold cursor-pointer ${
                    cantonFilter === c ? "bg-kirsche text-white" : "bg-white text-gray-300 border border-tinte/20"
                  }`}
                >
                  {c === "ALL" ? "Alle" : c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {suggestions.map((p: any) => (
              <div key={p.id} className="p-4 rounded-2xl bg-white border border-tinte/20 flex flex-col justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                    alt={p.rawName}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                    className="w-12 h-12 rounded-xl object-cover object-top"
                  />
                  <div className="min-w-0">
                    <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-[13px] font-bold text-tinte hover:text-kirsche truncate block">
                      {p.rawName}
                    </Link>
                    <div className="text-[13px] text-gray-600">{p.city} ({p.canton}) · CHF {p.rate60Chf}.–</div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => toggleFav(p.id)}
                  className="w-full py-2 rounded-xl bg-tinte/[0.04] hover:bg-kirsche text-gray-200 hover:text-white border border-tinte/20 text-[13px] font-extrabold cursor-pointer transition"
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