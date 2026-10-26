import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import clubsVault from "@/data/swiss-establishments-vault.json";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { XeniaDoubtTrigger } from "@/components/XeniaContextualHelp";
import { MapPin, Building2, ArrowUpRight, Search } from "lucide-react";

export default function HarmonizedClubsDirectoryPage() {
  const [selectedCanton, setSelectedCanton] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const clubs = useMemo(() => {
    const raw = Array.isArray(clubsVault) ? clubsVault : [];
    return raw.map((c: any) => {
      const geo = normalizeSwissGeo(c.city || c.address, c.canton);
      return {
        ...c,
        cleanCity: geo.cleanCity,
        canton: geo.trueCanton,
      };
    });
  }, []);

  const filteredClubs = useMemo(() => {
    return clubs.filter((c: any) => {
      if (selectedCanton !== "ALL" && c.canton !== selectedCanton) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const hay = (c.name + " " + c.cleanCity + " " + c.canton + " " + (c.category || "") + " " + (c.address || "")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [clubs, selectedCanton, searchTerm]);

  const cantons = ["ALL", "ZH", "ZG", "AG", "BS", "BE", "LU", "SG", "SO", "TG", "GE", "VD", "TI"];

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title="Schweizer Clubs, Studios & Laufhäuser – Verzeichnis nach Kanton | iwantsexnow.ch"
        description={"Übersicht über " + clubs.length + " stationäre Schweizer Clubs, Kontaktbars, FKK- und Massagestudios mit Quellenangabe und Selbstverwaltung."}
      />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-white/10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#C6A574]">
              STATIONÄRE SCHWEIZER ADRESSEN · CLUBS & STUDIOS
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Schweizer Clubs, Studios & Laufhäuser ({filteredClubs.length})
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Geordnete Übersicht nach Kanton. Betreiber können ihren Eintrag kostenlos übernehmen, Öffnungszeiten aktualisieren oder über das Meldeformular korrigieren lassen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <XeniaDoubtTrigger topic="source" label="Quellen-Erklärung" />
            <Link
              href="/reviews"
              className="px-4 py-2.5 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs inline-flex items-center gap-1.5"
            >
              <span>Zum Online-Portalvergleich</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3.5 rounded-2xl bg-[#1A1E27] border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {cantons.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCanton(c)}
                className={
                  selectedCanton === c
                    ? "px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer bg-[#C6A574] text-[#13161C]"
                    : "px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer bg-[#12151C] text-gray-300 border border-white/10 hover:text-white"
                }
              >
                {c === "ALL" ? "Ganze Schweiz" : c}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#12151C] border border-white/15 rounded-xl px-3 py-1.5 sm:w-72">
            <Search size={14} className="text-[#C6A574] shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Clubname, Stadt oder Strasse..."
              className="w-full px-2 bg-transparent text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club: any, idx: number) => (
            <article
              key={club.name + "-" + idx}
              className="p-5 rounded-2xl bg-[#1C2029] border border-white/10 hover:border-[#C6A574]/60 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-[#C6A574] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={12} />
                    <span>{club.type || club.category || "Club / Studio"}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                    {club.cleanCity} · {club.canton}
                  </span>
                </div>
                <h2 className="text-lg font-serif font-bold text-white">{club.name}</h2>
                <p className="text-xs text-gray-300 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#C6A574] shrink-0" />
                  <span>{club.address || club.cleanCity + " (" + club.canton + ")"}</span>
                </p>
                {club.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{club.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400">
                  Quelle: {club.sourcePortal || "Verzeichnis-Index"}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={"/create-post?claim=" + encodeURIComponent(club.name || "") + "&city=" + encodeURIComponent(club.cleanCity) + "&canton=" + encodeURIComponent(club.canton)}
                    className="text-[#C6A574] hover:underline font-semibold"
                  >
                    Eintrag übernehmen →
                  </Link>
                  <Link
                    href={"/report?name=" + encodeURIComponent(club.name || "")}
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
      <CorporateFooter />
    </div>
  );
}
