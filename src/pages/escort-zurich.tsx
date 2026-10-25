import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { MapPin, Check, ExternalLink } from "lucide-react";

function safeEncode(str: any): string {
  try {
    const clean = String(str || "")
      .replace(/[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?<![\uD800-\uDBFF])[\uDC00-\uDFFF]/g, "")
      .trim();
    return encodeURIComponent(clean);
  } catch {
    return "profil";
  }
}

const PILOT_ZONES = [
  { id: "ALL", label: "Alle (Zürich & Kanton Zug)" },
  { id: "ZG", label: "Zug, Cham, Baar & Rotkreuz (ZG)" },
  { id: "ZH", label: "Zürich City, Oerlikon & Winterthur (ZH)" },
];

export default function EscortZurichZugHub() {
  const [selectedZone, setSelectedZone] = useState("ALL");

  const pilotProfiles = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    return raw
      .filter((p: any) => p && (p.canton === "ZH" || p.canton === "ZG"))
      .slice(0, 60);
  }, []);

  const filtered = useMemo(() => {
    if (selectedZone === "ALL") return pilotProfiles;
    return pilotProfiles.filter((p: any) => p.canton === selectedZone);
  }, [pilotProfiles, selectedZone]);

  return (
    <div className="min-h-screen bg-[#090A0F] text-white pb-20">
      <SEO
        title="Escort Zürich, Zug & Cham – Regionale Übersicht & Vergleich | iwantsexnow.ch"
        description="Entdecke Profile und Studios in Zürich, Zug, Cham, Baar, Oerlikon und Winterthur im Schweizer Direkt- und Quellenverzeichnis."
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="p-6 rounded-2xl bg-[#11131C] border border-white/10 space-y-2">
          <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold">
            SCHWERPUNKT-REGION · ZÜRICH & KANTON ZUG
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold">
            Zürich, Zug & Cham ({filtered.length} Einträge)
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 max-w-3xl">
            Regionale Übersicht für Zürich City, Oerlikon, Winterthur sowie Zug, Cham, Baar und Rotkreuz.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {PILOT_ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => setSelectedZone(z.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                selectedZone === z.id
                  ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E] font-bold"
                  : "bg-[#11131C] border-white/10 text-gray-300 hover:border-white/30"
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((p: any, idx: number) => {
            const cleanName =
              String(p.rawName || "Profil")
                .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
                .trim()
                .slice(0, 26) || "Profil";
            const city = String(p.city || "Zürich").split("/")[0].trim();
            const rate = p.advertisedBaseChf || 400;
            const img =
              p.thumbnail ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80";

            return (
              <article
                key={idx}
                className="rounded-xl overflow-hidden bg-[#11131C] border border-white/10 flex flex-col justify-between"
              >
                <div className="relative aspect-[3/4] bg-black">
                  <img src={img} alt={cleanName} className="w-full h-full object-cover object-top" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-black/25" />
                  <div className="absolute top-2.5 left-2.5">
                    <span className="px-2 py-0.5 rounded bg-black/80 text-gray-200 text-[10px] border border-white/10">
                      Quelle: {p.sourcePortal || "Index"}
                    </span>
                  </div>
                  <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate">{cleanName}</h2>
                      <p className="text-[11px] text-gray-300 flex items-center gap-1 truncate">
                        <MapPin size={11} className="text-[#C8A97E]" /> {city} ({p.canton})
                      </p>
                    </div>
                    <div className="bg-black/85 px-2 py-1 rounded border border-white/15 text-xs font-bold text-[#C8A97E]">
                      CHF {rate}
                    </div>
                  </div>
                </div>

                <div className="p-3 space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-gray-400">
                    <Link
                      href={`/create-post?claim=${safeEncode(cleanName)}`}
                      className="text-[#C8A97E] hover:underline"
                    >
                      Eintrag verwalten
                    </Link>
                    <Link href={`/report?name=${safeEncode(cleanName)}`} className="hover:text-gray-200">
                      Melden / Entfernen
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
    </div>
  );
}