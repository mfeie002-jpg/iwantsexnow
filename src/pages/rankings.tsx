import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import clubsVault from "@/data/swiss-establishments-vault.json";
import { MapPin, Building2, ExternalLink, ArrowUpRight, Info } from "lucide-react";

export default function CleanRankingsAndClubsPage() {
  const [selectedCanton, setSelectedCanton] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const clubs = useMemo(() => {
    return Array.isArray(clubsVault) ? clubsVault : [];
  }, []);

  const filteredClubs = useMemo(() => {
    return clubs.filter((c: any) => {
      if (selectedCanton !== "ALL" && String(c.canton || "").toUpperCase() !== selectedCanton) {
        return false;
      }
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const hay = `${c.name || ""} ${c.city || ""} ${c.canton || ""} ${c.category || ""} ${c.address || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [clubs, selectedCanton, searchTerm]);

  const cantons = ["ALL", "ZH", "ZG", "AG", "BS", "BE", "LU", "SG", "SO", "TG", "GE", "VD", "TI"];

  return (
    <div className="min-h-screen bg-[#090A0F] text-white pb-20">
      <SEO
        title="Schweizer Clubs, Laufhäuser & Etablissements – Verzeichnis & Vergleich | iwantsexnow.ch"
        description={`Übersicht über ${clubs.length} Schweizer Clubs, Kontaktbars, FKK- & Massagestudios sowie Zugang zum redaktionellen Plattformvergleich.`}
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-6 border-b border-white/10">
          <div className="space-y-2 max-w-3xl">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#C8A97E]">
              SCHWEIZER ETABLISSEMENT-INDEX & PLATTFORMVERGLEICH
            </div>
            <h1 className="text-3xl sm:text-4xl font-serif font-bold">
              Schweizer Clubs, Studios & Laufhäuser ({filteredClubs.length})
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Strukturierte Übersicht über stationäre Schweizer Etablissements nach Kanton. Für unseren Kriterien-Vergleich der Schweizer Online-Portale wechseln Sie bitte in den redaktionellen Bereich.
            </p>
          </div>
          <Link
            href="/reviews"
            className="px-5 py-3 rounded-xl bg-[#C8A97E] text-[#090A0F] font-bold text-xs uppercase tracking-wider shrink-0 inline-flex items-center gap-2"
          >
            <span>Zum Portal-Vergleich (Xdate, Fgirl & Co.)</span>
            <ArrowUpRight size={15} />
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {cantons.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCanton(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border shrink-0 cursor-pointer transition ${
                  selectedCanton === c
                    ? "bg-white text-[#090A0F] border-white font-bold"
                    : "bg-[#11131C] text-gray-300 border-white/10 hover:border-white/30"
                }`}
              >
                {c === "ALL" ? "Ganze Schweiz" : c}
              </button>
            ))}
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Clubname, Ort oder Strasse filtern..."
            className="px-3.5 py-2 rounded-xl bg-[#11131C] border border-white/15 text-xs text-white sm:w-72"
          />
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club: any, idx: number) => (
            <article
              key={`${club.name}-${idx}`}
              className="p-5 rounded-2xl bg-[#11131C] border border-white/10 hover:border-[#C8A97E]/50 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-[#C8A97E] font-bold">
                  <span className="flex items-center gap-1">
                    <Building2 size={12} />
                    {club.type || club.category || "Club / Studio"}
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                    Kanton {club.canton || "CH"}
                  </span>
                </div>
                <h2 className="text-lg font-serif font-bold text-white">{club.name}</h2>
                <p className="text-xs text-gray-300 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#C8A97E] shrink-0" />
                  <span>{club.address || club.city || "Schweiz"}</span>
                </p>
                {club.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{club.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-500">
                  Quelle: {club.sourcePortal || "Verzeichnis-Index"}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={`/create-post?claim=${encodeURIComponent(club.name || "")}`}
                    className="text-[#C8A97E] hover:underline font-semibold"
                  >
                    Eintrag verwalten
                  </Link>
                  <Link
                    href={`/report?name=${encodeURIComponent(club.name || "")}`}
                    className="text-gray-400 hover:text-white"
                  >
                    Melden
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}