import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Schweizer Escort Tour-Dates, Gast-Aufenthalte & Club-Events | iwantsexnow.ch"
        description="Aktuelle Tour-Dates unabhängiger Escorts in Zug, Zürich, Luzern & Basel sowie Veranstaltungen in den 108 geprüften Schweizer FKK- & Saunaclubs."
        url="https://iwantsexnow.ch/events"
      />
      <LuxuryHeader />

      <PageIntro tone="butter" note="Was läuft" art="none" title={<>Schweizer Tour-Dates, Pop-up-Visits & Club-Kalender</>}>
        <Link href="/clubs" className="px-4 py-2.5 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-bold text-kirsche">
            Alle 108 Schweizer Clubs →
          </Link>
      </PageIntro>

      <main className="guide">
        

        <div className="flex flex-wrap gap-1.5">
          {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCantonFilter(c)}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-extrabold cursor-pointer ${
                cantonFilter === c ? "bg-kirsche text-white" : "bg-white text-tinte border border-tinte/20 hover:bg-blush"
              }`}
            >
              {c === "ALL" ? "Alle Kantone" : `Kanton ${c}`}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tourProfiles.map((p: any) => (
            <div key={p.id} className="p-4 rounded-2xl bg-white border border-tinte/20 flex flex-col justify-between gap-3">
              <div className="flex items-center gap-3">
                <img
                  src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                  alt={p.rawName}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                  className="w-14 h-14 rounded-xl object-cover object-top border border-kirsche/40"
                />
                <div>
                  <span className="text-[13px] font-bold text-mint-700 ">{p.tourWindow}</span>
                  <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block text-sm font-serif font-bold text-tinte hover:text-kirsche">
                    {p.rawName}
                  </Link>
                  <div className="text-[13px] text-gray-600">
                    {p.city} ({p.canton}) · CHF {p.rate60Chf}.– / 60m
                  </div>
                </div>
              </div>
              <Link
                href={`/profile/${encodeURIComponent(p.id)}`}
                className="w-full py-2 rounded-xl bg-kirsche text-white font-extrabold text-[13px] text-center block"
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