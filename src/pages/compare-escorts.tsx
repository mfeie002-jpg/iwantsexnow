import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { Scale, CheckCircle2, Phone, Lock, Heart, Plus, X } from "lucide-react";

export default function CompareEscortsPage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [cantonPoolFilter, setCantonPoolFilter] = useState<string>("ALL");

  const allProfiles = useMemo(() => {
    return ((offersData as any[]) || []).slice(0, 120).map((o) => {
      const pid = o.id || o.dedupClusterId;
      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      return {
        ...o,
        id: pid,
        rate60Chf: r60,
        rate30Chf: r30,
      };
    });
  }, []);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
      })
      .catch(() => {});

    try {
      const favs = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      if (Array.isArray(favs) && favs.length > 0) {
        setSelectedIds(favs.slice(0, 4));
        return;
      }
    } catch {}

    setSelectedIds(allProfiles.slice(0, 4).map((p) => p.id));
  }, [allProfiles]);

  const comparedProfiles = useMemo(
    () =>
      selectedIds
        .map((id) => allProfiles.find((p) => p.id === id))
        .filter(Boolean)
        .map((p: any) => {
          const st = serverStates[p.id] || {};
          return {
            ...p,
            isAvail: Boolean(st.availabilityConfirmed || p.availabilityConfirmed),
            isVerif: Boolean(st.identityVerified || p.identityVerified),
          };
        }),
    [selectedIds, allProfiles, serverStates]
  );

  const toggleCompare = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds([...selectedIds.slice(1), id]);
    }
  };

  const loadFromFavorites = () => {
    try {
      const favs = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      if (Array.isArray(favs) && favs.length > 0) {
        setSelectedIds(favs.slice(0, 4));
      }
    } catch {}
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="4-Profil Schweizer Escort Direktvergleich (CHF-Tarife, Alter, Cup & 4h-Status) | iwantsexnow.ch"
        description="Vergleiche bis zu 4 unabhängige Schweizer Escort-, GFE- & Tantra-Profile nebeneinander nach 30m/60m CHF-Honorar, Körbchengrösse, Alter und Echtzeit-Verfügbarkeit."
        url="https://iwantsexnow.ch/compare-escorts"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <Scale size={14} /> SIDE-BY-SIDE TRANSPARENZ-MATRIX (MAX. 4 PROFILE)
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Schweizer 4-Profil Direktvergleich (CHF & Attribute)
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Stelle bis zu 4 Profile aus deiner Merkliste oder deinem Kanton direkt gegenüber.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={loadFromFavorites}
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-rose-300 inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Heart size={13} className="fill-rose-400 text-rose-400" /> Aus Merkliste laden
            </button>
            <Link href="/pricing" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
              CHF-Honorar-Kompass →
            </Link>
          </div>
        </section>

        {/* Vergleichs-Spalten (Mobile-First horizontal scrollbar auf kleinen Screens, 4 Spalten auf Desktop) */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparedProfiles.map((p: any) => (
            <div key={p.id} className="rounded-2xl bg-[#121722] border border-[#C8A97E]/50 overflow-hidden flex flex-col justify-between">
              <div>
                <div className="relative h-56 bg-[#0D111A]">
                  <img
                    src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                    alt={p.rawName}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                    className="w-full h-full object-cover object-top"
                  />
                  <button
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-black/80 text-gray-300 hover:text-white cursor-pointer"
                    title="Aus Vergleich entfernen"
                  >
                    <X size={14} />
                  </button>
                  <div className="absolute bottom-3 left-3 px-2.5 py-1 rounded-xl bg-black/85 border border-white/15 text-xs font-extrabold text-[#C8A97E]">
                    CHF {p.rate60Chf}.– / 60m
                  </div>
                </div>

                <div className="p-4 space-y-2.5 text-xs">
                  <div>
                    <span className="text-[10px] font-bold text-[#C8A97E] uppercase">
                      {p.canton} · {p.city}
                    </span>
                    <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block text-base font-serif font-bold text-white hover:text-[#C8A97E] truncate">
                      {p.rawName}
                    </Link>
                  </div>

                  <div className="space-y-1.5 pt-2 border-t border-white/10">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Honorar 60 Min.:</span>
                      <strong className="text-[#C8A97E]">CHF {p.rate60Chf}.–</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Express 30 Min.:</span>
                      <strong className="text-white">CHF {p.rate30Chf}.–</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">4h-Echtzeit-Status:</span>
                      <strong className={p.isAvail ? "text-emerald-400" : "text-gray-300"}>
                        {p.isAvail ? "● Jetzt verfügbar" : "Auf Anfrage"}
                      </strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Alter & Grösse:</span>
                      <strong className="text-white">{p.age || 25} J. · {p.heightCm || 168} cm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Körbchen & Haar:</span>
                      <strong className="text-white">Cup {p.cupSize || "C"} · {p.hairColor || "Brünett"}</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">+41 Direktkontakt:</span>
                      <strong className="text-emerald-400">{p.rawPhone ? "✓ Vorhanden" : "Messenger"}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 space-y-1.5">
                <Link
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  className="block w-full py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs text-center"
                >
                  Profil & +41 Kontakt →
                </Link>
              </div>
            </div>
          ))}
        </section>

        {/* Schnell-Auswahl weiterer Profile nach Kanton */}
        <section className="p-5 rounded-2xl bg-[#121722] border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-sm font-serif font-bold text-white">
              Andere Schweizer Profile in den Vergleich aufnehmen ({selectedIds.length}/4 gewählt):
            </h2>
            <div className="flex flex-wrap gap-1">
              {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "GE"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCantonPoolFilter(c)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                    cantonPoolFilter === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] text-gray-300 border border-white/10"
                  }`}
                >
                  {c === "ALL" ? "Alle" : c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {allProfiles
              .filter((p) => cantonPoolFilter === "ALL" || p.canton === cantonPoolFilter)
              .slice(0, 18)
              .map((p: any) => {
                const active = selectedIds.includes(p.id);
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    className={`p-2.5 rounded-xl border text-left text-xs cursor-pointer transition ${
                      active ? "bg-[#C8A97E]/20 border-[#C8A97E] text-white" : "bg-[#0D111A] border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    <div className="font-bold truncate">{p.rawName}</div>
                    <div className="text-[10px] text-gray-400">
                      {p.city} ({p.canton}) · CHF {p.rate60Chf}.–
                    </div>
                  </button>
                );
              })}
          </div>
        </section>
      </main>
    </div>
  );
}