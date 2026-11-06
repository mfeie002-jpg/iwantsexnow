import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import clubsData from "@/data/swiss-establishments-vault.json";
import { Calendar, MapPin, Sparkles, ArrowRight } from "lucide-react";

export default function EventsCalendarPage() {
  const [cantonFilter, setCantonFilter] = useState<string>("ALL");

  const tourProfiles = useMemo(() => {
    const raw = (offersData as any[]) || [];
    return raw
      .filter((o) => cantonFilter === "ALL" || String(o.canton || "").toUpperCase() === cantonFilter)
      .slice(0, 12)
      .map((o, idx) => ({
        ...o,
        id: o.id || o.dedupClusterId,
        rate60Chf: Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350)),
        tourWindow: idx % 2 === 0 ? "Heute & Morgen (Exklusiver Gast-Aufenthalt)" : "Diese Woche (Apartment & Hotel-Outcall)",
      }));
  }, [cantonFilter]);

  const featuredClubs = useMemo(() => {
    const raw = (clubsData as any[]) || [];
    return raw
      .filter((c) => cantonFilter === "ALL" || String(c.canton || "").toUpperCase() === cantonFilter)
      .slice(0, 6);
  }, [cantonFilter]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer Escort Tour-Dates, Gast-Aufenthalte & Club-Events | iwantsexnow.ch"
        description="Aktuelle Tour-Dates unabhängiger Escorts in Zug, Zürich, Luzern & Basel sowie Veranstaltungen in den 108 geprüften Schweizer FKK- & Saunaclubs."
        url="https://iwantsexnow.ch/events"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <Calendar size={14} /> AKTUELLE GAST-AUFENTHALTE & SCHWEIZER CLUB-SPECIALS
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Schweizer Tour-Dates, Pop-up-Visits & Club-Kalender
            </h1>
          </div>
          <Link href="/clubs" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#C8A97E]">
            Alle 108 Schweizer Clubs →
          </Link>
        </section>

        <div className="flex flex-wrap gap-1.5">
          {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCantonFilter(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                cantonFilter === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#121722] text-gray-300 border border-white/10"
              }`}
            >
              {c === "ALL" ? "Alle Kantone" : `Kanton ${c}`}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tourProfiles.map((p: any) => (
            <div key={p.id} className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-col justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                  alt={p.rawName}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                  className="w-14 h-14 rounded-xl object-cover object-top border border-[#C8A97E]/40"
                />
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 uppercase">{p.tourWindow}</span>
                  <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block text-sm font-serif font-bold text-white hover:text-[#C8A97E]">
                    {p.rawName}
                  </Link>
                  <div className="text-[11px] text-gray-400">
                    {p.city} ({p.canton}) · CHF {p.rate60Chf}.– / 60m
                  </div>
                </div>
              </div>
              <Link
                href={`/profile/${encodeURIComponent(p.id)}`}
                className="w-full py-2 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs text-center block"
              >
                Termin in {p.city} anfragen →
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}