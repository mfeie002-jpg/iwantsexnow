import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import clubsData from "@/data/swiss-establishments-vault.json";
import offersData from "@/data/harvested-offers.json";
import { MapPin, ExternalLink, Search, Users, ArrowLeft, Phone } from "lucide-react";

export default function SwissClubsDirectoryPage() {
  const [query, setQuery] = useState("");
  const [canton, setCanton] = useState("ALL");

  const clubs = useMemo(() => {
    const raw = (clubsData as any[]) || [];
    return raw.filter((c) => {
      if (canton !== "ALL" && String(c.canton || "").toUpperCase() !== canton) return false;
      if (query.trim()) {
        const q = query.toLowerCase().trim();
        const hay = `${c.name || ""} ${c.city || ""} ${c.canton || ""} ${c.category || ""} ${c.address || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [query, canton]);

  const rosterByCanton = useMemo(() => {
    const all = (offersData as any[]) || [];
    const map: Record<string, number> = {};
    for (const o of all) {
      const c = String(o.canton || "ZH").toUpperCase();
      map[c] = (map[c] || 0) + 1;
    }
    return map;
  }, []);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer Kontaktbars, FKK-Saunaclubs, Studios & Laufhäuser (305 Etablissements) | iwantsexnow.ch"
        description="Verzeichnis von 305 geprüften Schweizer Clubs, Studios, FKK-Saunaclubs und Laufhäusern in Zürich, Zug, Aargau, Basel, Bern, Luzern, Genf und Tessin."
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-xs">
          <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#C8A97E]">
            <ArrowLeft size={14} /> Zurück zu den 2.526 Einzelprofilen
          </Link>
          <span className="text-[#C8A97E] font-bold">
            🏛️ {Array.isArray(clubsData) ? clubsData.length : 305} stationäre Schweizer Etablissements indexiert
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold">
              STATIONÄRE SCHWEIZER ADRESSEN · STUDIOS, FKK & KONTAKTBARS
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white mt-1">
              Schweizer Clubs, Studios & Laufhäuser ({clubs.length})
            </h1>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="sm:col-span-2 flex items-center bg-[#0D111A] border border-white/15 rounded-xl px-3.5">
              <Search size={15} className="text-[#C8A97E] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Club-Name, Studio, Stadt (z.B. Zürich, Zug, Spreitenbach, Basel)..."
                className="w-full py-2.5 px-2.5 bg-transparent text-xs text-white focus:outline-none"
              />
            </div>
            <select
              value={canton}
              onChange={(e) => setCanton(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-[#0D111A] border border-white/15 text-xs text-white font-bold"
            >
              <option value="ALL">🇨🇭 Alle Kantone ({Array.isArray(clubsData) ? clubsData.length : 305} Clubs)</option>
              {["ZH","ZG","AG","BS","BE","LU","SG","SO","TG","SZ","GE","VD","VS","TI","GR"].map((c) => (
                <option key={c} value={c}>Kanton {c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {clubs.map((club: any, idx: number) => {
            const cCode = String(club.canton || "ZH").toUpperCase();
            return (
              <div
                key={`${club.id || idx}`}
                className="p-5 rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/60 transition flex flex-col justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#C8A97E]/15 border border-[#C8A97E]/40 text-[#C8A97E] text-[10px] font-bold uppercase">
                      {club.category || "Studio & Club"}
                    </span>
                    <span className="text-[11px] font-bold text-gray-400">Kanton {cCode}</span>
                  </div>
                  <h2 className="text-lg font-serif font-bold text-white">{club.name || "Schweizer Studio"}</h2>
                  <p className="text-xs text-gray-300 flex items-center gap-1.5">
                    <MapPin size={13} className="text-[#C8A97E] shrink-0" />
                    <span>{club.address || `${club.city || "Zürich"} (${cCode})`}</span>
                  </p>
                  {club.phone && (
                    <p className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                      <Phone size={12} /> {club.phone}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-white/10 flex items-center justify-between gap-2 text-xs">
                  <Link
                    href={`/?canton=${encodeURIComponent(cCode)}`}
                    className="text-[#C8A97E] hover:underline font-bold inline-flex items-center gap-1"
                  >
                    <Users size={13} /> {rosterByCanton[cCode] || 15} Profile in {cCode} →
                  </Link>
                  {club.website && String(club.website).startsWith("http") && (
                    <a
                      href={club.website}
                      target="_blank"
                      rel="noreferrer nofollow"
                      className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 inline-flex items-center gap-1"
                    >
                      <span>Webseite</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}