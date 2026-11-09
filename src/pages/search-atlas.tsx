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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Schweizer 2D-Such-Atlas: Alle Kantone, Städte & Spezial-Rubriken | iwantsexnow.ch"
        description="Komplettes Schweizer Verzeichnis aller Ortsseiten und 84 Stadt-Service-Kombinationen (GFE, Tantra, Hotel-Outcall, BDSM, Trans) mit CHF-Richtpreisen."
        url="https://iwantsexnow.ch/search-atlas"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-white border border-kirsche/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[13px] text-kirsche font-bold flex items-center gap-1.5">
              <Compass size={14} /> 2D-PROGRAMMATIC Directory Atlas · SCHWEIZ
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-tinte mt-1">
              Kompletter Schweizer Orts- & Rubriken-Atlas
            </h1>
            <p className="text-[13px] text-gray-700 mt-1">
              Direktzugriff auf alle regionalen Schweizer Knotenpunkte und Spezial-Rubriken mit 5-Wege-Echtzeit-Sortierung.
            </p>
          </div>
          <Link href="/search" className="px-4 py-2.5 rounded-xl bg-kirsche text-white text-[13px] font-extrabold">
            Zur Deep-Filter-Suche →
          </Link>
        </section>

        <div className="flex flex-wrap gap-1.5">
          {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCanton(c)}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-extrabold cursor-pointer ${
                selectedCanton === c ? "bg-kirsche text-white" : "bg-white text-gray-300 border border-tinte/20"
              }`}
            >
              {c === "ALL" ? "Alle Regionen" : `Kanton ${c}`}
            </button>
          ))}
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {visibleCities.map((city) => (
            <div key={city.slug} className="p-5 rounded-2xl bg-white border border-tinte/20 space-y-3">
              <div className="flex items-center justify-between border-b border-tinte/20 pb-2.5">
                <div>
                  <span className="text-[13px] font-extrabold text-kirsche ">Kanton {city.canton}</span>
                  <h2 className="text-lg font-serif font-bold text-tinte">{city.name}</h2>
                </div>
                <Link
                  href={`/orte/${city.slug}`}
                  className="px-3 py-1.5 rounded-xl bg-kirsche text-white text-[13px] font-extrabold"
                >
                  Hauptseite →
                </Link>
              </div>

              <div className="space-y-1.5 text-[13px]">
                {SERVICES.map((srv) => (
                  <Link
                    key={srv.slug}
                    href={`/kategorie/${city.slug}/${srv.slug}`}
                    className="p-2 rounded-xl bg-papier hover:bg-tinte/[0.04] border border-tinte/10 hover:border-kirsche/40 flex items-center justify-between text-gray-700 hover:text-tinte transition"
                  >
                    <span>
                      {srv.label} in <strong>{city.name}</strong>
                    </span>
                    <ArrowRight size={12} className="text-kirsche" />
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