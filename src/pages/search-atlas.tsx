import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Compass, MapPin, Sparkles, ArrowRight } from "lucide-react";

const CITIES = [
  { slug: "zug", name: "Zug & Baar", canton: "ZG" },
  { slug: "zuerich", name: "Zürich City", canton: "ZH" },
  { slug: "winterthur", name: "Winterthur", canton: "ZH" },
  { slug: "luzern", name: "Luzern", canton: "LU" },
  { slug: "baden", name: "Baden & Aargau", canton: "AG" },
  { slug: "basel", name: "Basel-Stadt", canton: "BS" },
  { slug: "bern", name: "Bern", canton: "BE" },
  { slug: "st-gallen", name: "St. Gallen", canton: "SG" },
  { slug: "geneve", name: "Genève", canton: "GE" },
  { slug: "lausanne", name: "Lausanne", canton: "VD" },
  { slug: "lugano", name: "Lugano", canton: "TI" },
];

const SERVICES = [
  { slug: "girlfriend-experience", label: "Girlfriend Experience (GFE)" },
  { slug: "tantra-massage", label: "Tantra & Erotische Massage" },
  { slug: "haus-und-hotelbesuche", label: "Haus- & Hotelbesuche (Outcall)" },
  { slug: "domina-bdsm", label: "Domina, BDSM & Fetisch" },
  { slug: "dinner-date", label: "High-Class Dinner Date" },
  { slug: "trans-escort", label: "Trans & TS Escort" },
  { slug: "paare-und-bisex", label: "Bisexuell & Paare" },
];

export default function SearchAtlasPage() {
  const [selectedCanton, setSelectedCanton] = useState<string>("ALL");

  const visibleCities = CITIES.filter(
    (c) => selectedCanton === "ALL" || c.canton === selectedCanton
  );

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer 2D-Such-Atlas: Alle Kantone, Städte & Spezial-Rubriken | iwantsexnow.ch"
        description="Komplettes Schweizer Verzeichnis aller Ortsseiten und 84 Stadt-Service-Kombinationen (GFE, Tantra, Hotel-Outcall, BDSM, Trans) mit CHF-Richtpreisen."
        url="https://iwantsexnow.ch/search-atlas"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <Compass size={14} /> 2D-PROGRAMMATIC DIRECTORY ATLAS · SCHWEIZ
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Kompletter Schweizer Orts- & Rubriken-Atlas
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Direktzugriff auf alle regionalen Schweizer Knotenpunkte und Spezial-Rubriken mit 5-Wege-Echtzeit-Sortierung.
            </p>
          </div>
          <Link href="/search" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
            Zur Deep-Filter-Suche →
          </Link>
        </section>

        <div className="flex flex-wrap gap-1.5">
          {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCanton(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                selectedCanton === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#121722] text-gray-300 border border-white/10"
              }`}
            >
              {c === "ALL" ? "Alle Regionen" : `Kanton ${c}`}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleCities.map((city) => (
            <div key={city.slug} className="p-5 rounded-2xl bg-[#121722] border border-white/10 space-y-3">
              <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                <div>
                  <span className="text-[10px] font-extrabold text-[#C8A97E] uppercase">Kanton {city.canton}</span>
                  <h2 className="text-lg font-serif font-bold text-white">{city.name}</h2>
                </div>
                <Link
                  href={`/orte/${city.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold"
                >
                  Hauptseite →
                </Link>
              </div>

              <div className="space-y-1.5 text-xs">
                {SERVICES.map((srv) => (
                  <Link
                    key={srv.slug}
                    href={`/kategorie/${city.slug}/${srv.slug}`}
                    className="p-2 rounded-xl bg-[#0D111A] hover:bg-white/5 border border-white/5 hover:border-[#C8A97E]/40 flex items-center justify-between text-gray-300 hover:text-white transition"
                  >
                    <span>
                      {srv.label} in <strong>{city.name}</strong>
                    </span>
                    <ArrowRight size={12} className="text-[#C8A97E]" />
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}