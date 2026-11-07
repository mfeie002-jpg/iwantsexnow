import React, { useState, useMemo } from "react";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import clubsData from "@/data/swiss-establishments-vault.json";
import { Building2, MapPin, PhoneCall, ExternalLink, Search, Crown } from "lucide-react";

const CANTON_LIST = ["ALL", "ZH", "AG", "ZG", "LU", "BS", "BE", "SG", "SO", "TG", "GE", "VD", "VS", "TI"];

export default function SwissClubsDirectoryPage() {
  const [canton, setCanton] = useState("ALL");
  const [search, setSearch] = useState("");

  const filteredClubs = useMemo(() => {
    const raw = Array.isArray(clubsData) ? (clubsData as any[]) : [];
    return raw.filter((c) => {
      if (canton !== "ALL" && String(c.canton || "").toUpperCase() !== canton) return false;
      if (search.trim()) {
        const q = search.toLowerCase();
        const hay = [c.name, c.city, c.canton, c.category, c.address].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [canton, search]);

  return (
    <div className="min-h-screen bg-[#070606] text-[#F5EFE6] pb-24">
      <SEO
        title="305 Schweizer FKK-Clubs, Laufhäuser & Tantra-Studios | iwantsexnow.ch"
        description="Das komplette Schweizer Etablissement-Verzeichnis: 305 geprüfte Kontaktbars, FKK-Saunaclubs, Laufhäuser und Tantra-Ateliers mit +41 Direktwahl."
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        <section className="penthouse-panel p-6 rounded-[24px] border border-[#C8A97E]/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#C8A97E]/20 pb-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <SwissDoorplate state="FREI" roomNumber="ETABLISSEMENTS" customLabel={filteredClubs.length + " HÄUSER AKTIV"} size="sm" />
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif text-[#EAD2AA] mt-1">
                Schweizer FKK-Clubs, Laufhäuser & Private Studios
              </h1>
              <p className="text-xs sm:text-sm text-[#C8B9A6] max-w-2xl">
                Alle stationären Schweizer Adressen mit direkter +41 Telefonverbindung, Google-Maps-Navigation und kantonaler Zuordnung.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="relative flex-1 min-w-[220px]">
              <Search size={14} className="absolute left-3.5 top-3 text-[#DEC393]" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Club-Name, Stadt (Zürich, Spreitenbach, Zug, Genève) oder Kategorie suchen..."
                className="w-full pl-9 pr-3 py-2 rounded-full bg-black/75 border border-[#C8A97E]/35 text-xs text-white placeholder-[#8E8271] focus:border-[#EAD2AA] outline-none"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
              {CANTON_LIST.map((c) => {
                const isAct = canton === c;
                const cls = isAct
                  ? "brass-3d px-3 py-1.5 rounded-full text-[10px] font-mono font-extrabold cursor-pointer shrink-0"
                  : "px-3 py-1.5 rounded-full bg-black/60 border border-[#C8A97E]/25 text-[#C8B9A6] hover:text-white text-[10px] font-mono cursor-pointer shrink-0";
                return (
                  <button key={c} type="button" onClick={() => setCanton(c)} className={cls}>
                    {c === "ALL" ? "🇨🇭 ALLE" : c}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredClubs.map((club: any, i: number) => {
            const phone = club.phone || "+41 44 431 20 90";
            const mapsUrl =
              "https://www.google.com/maps/search/?api=1&query=" +
              encodeURIComponent((club.name || "") + " " + (club.city || "") + " Switzerland");

            return (
              <div
                key={club.id || i}
                className="valentina-outer-card rounded-[24px] p-2.5 flex flex-col justify-between"
              >
                <div className="rounded-[18px] border border-[#C8A97E]/35 bg-[#080606] p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <SwissDoorplate
                        state="FREI"
                        roomNumber={String(club.canton || "CH")}
                        customLabel={String(club.category || "CLUB & STUDIO").slice(0, 18).toUpperCase()}
                        size="sm"
                      />
                      <Crown size={14} className="text-[#DEC393]" />
                    </div>

                    <h2 className="text-xl font-serif text-[#EAD2AA] tracking-wide">
                      {club.name}
                    </h2>

                    <div className="text-xs font-mono text-[#C8B9A6] flex items-center gap-1.5">
                      <MapPin size={13} className="text-[#DEC393] shrink-0" />
                      <span>{club.address || club.city} ({club.canton})</span>
                    </div>

                    {club.entryChf && (
                      <div className="text-[11px] font-mono text-[#DEC393]">
                        Eintritt / Richtwert: <strong>CHF {club.entryChf}.–</strong> · {club.hours || "Täglich geöffnet"}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#C8A97E]/20">
                    <a
                      href={"tel:" + String(phone).replace(/\s+/g, "")}
                      className="brass-3d py-2.5 px-3 rounded-full border border-[#F5E3B8]/65 font-mono font-extrabold text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5"
                    >
                      <PhoneCall size={12} />
                      <span>ANRUFEN</span>
                    </a>
                    <a
                      href={mapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="emerald-3d py-2.5 px-3 rounded-full border border-[#C8A97E]/45 font-mono font-bold text-[10px] tracking-wider uppercase flex items-center justify-center gap-1.5"
                    >
                      <ExternalLink size={12} className="text-[#DEC393]" />
                      <span>ROUTE / MAPS</span>
                    </a>
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </div>
  );
}