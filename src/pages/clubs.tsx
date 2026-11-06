import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import clubsVault from "@/data/swiss-establishments-vault.json";
import { Building2, MapPin, Phone, Search, ShieldCheck, ArrowRight, ExternalLink } from "lucide-react";

const CANTON_TO_SLUG: Record<string, string> = {
  ZG: "zug",
  ZH: "zuerich",
  LU: "luzern",
  AG: "baden",
  BS: "basel",
  BE: "bern",
  SG: "st-gallen",
  GE: "geneve",
  VD: "lausanne",
  TI: "lugano",
};

export default function SwissClubsDirectoryPage() {
  const [cantonFilter, setCantonFilter] = useState<string>("ALL");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const allClubs = useMemo(() => {
    const raw = (clubsVault as any[]) || [];
    return raw.map((c, idx) => {
      const cat = String(c.categoryLabel || c.type || "Erotik-Studio & Club");
      let normalizedType = "studio";
      if (/fkk|sauna/i.test(cat)) normalizedType = "fkk";
      else if (/cabaret|nightclub|bar|lounge/i.test(cat)) normalizedType = "club";
      else if (/laufhaus|villa|maison/i.test(cat)) normalizedType = "villa";

      return {
        ...c,
        id: c.id || `ch-club-${idx + 1}`,
        name: c.name || c.rawName || "Geprüftes Schweizer Etablissement",
        city: c.city || "Zürich",
        canton: String(c.canton || "ZH").toUpperCase(),
        categoryLabel: cat,
        normalizedType,
        entryChf: Number(c.entryChf) || (normalizedType === "fkk" ? 85 : 0),
      };
    });
  }, []);

  const filteredClubs = useMemo(() => {
    return allClubs.filter((c) => {
      if (cantonFilter !== "ALL" && c.canton !== cantonFilter) return false;
      if (typeFilter !== "ALL" && c.normalizedType !== typeFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${c.name} ${c.city} ${c.canton} ${c.categoryLabel} ${c.address || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [allClubs, cantonFilter, typeFilter, searchQuery]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title={`Alle ${allClubs.length} geprüften Schweizer FKK-Clubs, Saunaclubs & Erotik-Studios | iwantsexnow.ch`}
        description={`Komplettes Schweizer Verzeichnis mit ${allClubs.length} stationären FKK-Saunaclubs, Kontaktbars, Laufhäusern und Tantra-Studios in Zürich, Zug, Aargau, Luzern, Basel, Bern & Genf.`}
        url="https://iwantsexnow.ch/clubs"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <Building2 size={14} /> STATIONÄRES SCHWEIZER ETABLISSEMENT-REGISTER ({filteredClubs.length} VON {allClubs.length})
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Geprüfte Schweizer FKK-Saunaclubs, Studios & Kontaktbars
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Konzessionierte Schweizer Adressen mit direktem Telefonkontakt, Kantons-Filter und regionaler Zuordnung.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href="/register" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
              + Studio / Club eintragen →
            </Link>
          </div>
        </section>

        {/* Filter-Konsole: Kanton, Etablissement-Typ & Volltextsuche */}
        <section className="p-5 rounded-2xl bg-[#121722] border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1.5">
              {["ALL", "ZH", "AG", "ZG", "LU", "BS", "BE", "SG", "SO", "GE", "VD", "TI"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCantonFilter(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                    cantonFilter === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] text-gray-300 border border-white/10"
                  }`}
                >
                  {c === "ALL" ? `Alle Kantone (${allClubs.length})` : c}
                </button>
              ))}
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Clubname, Ort oder Kanton suchen..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D111A] border border-white/15 text-xs text-white"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-2 border-t border-white/10">
            {[
              { id: "ALL", label: "Alle Etablissement-Typen" },
              { id: "fkk", label: "🧖‍♀️ FKK- & Saunaclubs" },
              { id: "studio", label: "💆‍♀️ Massage- & Diskret-Studios" },
              { id: "club", label: "🥂 Nightclubs & Kontaktbars" },
              { id: "villa", label: "🏛️ Villen & Laufhäuser" },
            ].map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTypeFilter(t.id)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  typeFilter === t.id ? "bg-emerald-500 text-[#07120B]" : "bg-[#0D111A] text-gray-300 border border-white/10"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </section>

        {/* Club-Karten-Grid */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClubs.map((club: any) => {
            const ortSlug = CANTON_TO_SLUG[club.canton] || "zuerich";
            return (
              <div
                key={club.id}
                className="p-5 rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/60 flex flex-col justify-between gap-4 transition"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="px-2.5 py-0.5 rounded bg-[#C8A97E]/20 text-[#C8A97E] text-[10px] font-extrabold uppercase">
                      {club.canton} · {club.city}
                    </span>
                    <span className="px-2.5 py-0.5 rounded bg-white/5 text-gray-300 text-[10px] font-semibold">
                      {club.categoryLabel}
                    </span>
                  </div>

                  <h2 className="text-lg font-serif font-bold text-white">{club.name}</h2>

                  {club.address && (
                    <div className="text-xs text-gray-400 flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#C8A97E] shrink-0" />
                      <span>{club.address}</span>
                    </div>
                  )}

                  <p className="text-xs text-gray-300 leading-relaxed">
                    {club.description ||
                      `Geprüftes stationäres Etablissement in ${club.city} (Kanton ${club.canton}). Diskreter Empfang, gepflegte Räumlichkeiten und wechselnde internationale Präsenz.`}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    {club.phoneDisplay ? (
                      <a
                        href={`tel:${String(club.phoneDisplay).replace(/\s+/g, "")}`}
                        className="text-emerald-400 font-extrabold hover:underline inline-flex items-center gap-1"
                      >
                        <Phone size={12} /> {club.phoneDisplay}
                      </a>
                    ) : (
                      <span className="text-gray-400 text-[11px]">Vor-Ort-Empfang ohne Voranmeldung</span>
                    )}

                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${club.name} ${club.city} Schweiz`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-gray-400 hover:text-white inline-flex items-center gap-1"
                    >
                      <span>Route</span>
                      <ExternalLink size={11} />
                    </a>
                  </div>

                  <Link
                    href={`/orte/${ortSlug}`}
                    className="block w-full py-2 px-3 rounded-xl bg-white/5 hover:bg-[#C8A97E] text-gray-200 hover:text-[#0D111A] border border-white/10 text-xs font-extrabold text-center transition"
                  >
                    Einzelprofile im Kanton {club.canton} ansehen →
                  </Link>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}