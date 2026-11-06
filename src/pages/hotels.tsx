import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Building2, ShieldCheck, Car, KeyRound, MapPin, ArrowRight } from "lucide-react";

const SWISS_HOTEL_HUBS = [
  {
    citySlug: "zug",
    city: "Zug & Baar",
    canton: "ZG",
    avgOutcallChf: 350,
    highlights: [
      {
        name: "Business- & Design-Hotels Zug / City-Nord",
        type: "5★ & 4★ Superior Business",
        access: "Direkter Liftzugang aus der Tiefgarage ohne Lobby-Durchquerung",
        note: "Ideal für diskrete Outcall-Termine und Dinner-Dates im Raum Zug, Baar & Cham.",
      },
      {
        name: "Serviced Apartments & Self-Check-in Suites (Baar / Metalli)",
        type: "100% Kontaktloser PIN-/Keybox-Zugang",
        access: "24/7 Self-Check-in ohne Rezeption",
        note: "Höchste Diskretion für Geschäftsreisende im Kanton Zug.",
      },
    ],
  },
  {
    citySlug: "zuerich",
    city: "Zürich City & Airport",
    canton: "ZH",
    avgOutcallChf: 350,
    highlights: [
      {
        name: "Luxury & Boutique-Hotels Zürich City / Kreis 1 & Seefeld",
        type: "5★ Grand & Boutique Hotels",
        access: "Separate Gästelifts & Valet-Tiefgarage",
        note: "Perfekt für High-Class Dinner Dates und mehrstündige Girlfriend-Experience-Begleitungen.",
      },
      {
        name: "Airport-Business-Hotels (Kloten / Opfikon / Glattbrugg)",
        type: "4★ Superior Airport & Day-Use",
        access: "Direkte Parkhaus-Anbindung (A1/A51) & schallisolierte Business-Suiten",
        note: "Beliebtester Treffpunkt für internationale Reisende und diskrete Tageszimmer.",
      },
    ],
  },
  {
    citySlug: "luzern",
    city: "Luzern & Zentralschweiz",
    canton: "LU",
    avgOutcallChf: 330,
    highlights: [
      {
        name: "Seepromenade & Pilatusstrasse Business-Hotels",
        type: "5★ & 4★ See- & Stadthotels",
        access: "Diskreter Nebeneingang & Parkhaus-Lift",
        note: "Stilvolle Kulisse für Begleitungen und Hotelbesuche in Luzern und Kriens.",
      },
    ],
  },
  {
    citySlug: "basel",
    city: "Basel & Dreiländereck (BS / Baden-Württemberg)",
    canton: "BS",
    avgOutcallChf: 320,
    highlights: [
      {
        name: "Messeplatz, Grossbasel & Rheinufer Business-Hotels",
        type: "4★ & 5★ Business-Suiten",
        access: "Schnelle Anreise über A2/A5 (auch aus Richtung Freiburg / Karlsruhe)",
        note: "Top-Adresse für diskrete Outcall-Besuche im Dreiländereck.",
      },
    ],
  },
  {
    citySlug: "baden",
    city: "Baden, Wettingen & Aargau (A1-Achse)",
    canton: "AG",
    avgOutcallChf: 310,
    highlights: [
      {
        name: "Thermal- & Business-Hotels Baden / Spreitenbach",
        type: "4★ Wellness- & Business-Hotels",
        access: "Direkt an der Autobahn A1 zwischen Zürich und Bern mit grosszügigen Tiefgaragen",
        note: "Sehr gefragt für diskrete Nachmittags- und Abendtermine.",
      },
    ],
  },
  {
    citySlug: "geneve",
    city: "Genève & Lausanne (Romandie)",
    canton: "GE",
    avgOutcallChf: 400,
    highlights: [
      {
        name: "Rive Droite, Rue du Rhône & Genève-Aéroport Palaces",
        type: "5★ Luxury & International Business",
        access: "Höchste internationale Diskretion & VIP-Concierge-Standards",
        note: "Führender Standort für mehrsprachige High-Class-Begleitungen in der Westschweiz.",
      },
    ],
  },
];

export default function HotelsGuidePage() {
  const [selectedCanton, setSelectedCanton] = useState<string>("ALL");

  const visibleHubs = SWISS_HOTEL_HUBS.filter(
    (h) => selectedCanton === "ALL" || h.canton === selectedCanton
  );

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Diskrete Schweizer Outcall-Hotels & Self-Check-in Apartments (Zug, Zürich, Basel) | iwantsexnow.ch"
        description="Schweizer Guide für diskrete Hotelbesuche (Outcall), Day-Use-Suiten mit Tiefgaragen-Lift und kontaktlose Self-Check-in-Apartments in Zug, Zürich, Luzern, Basel & Genf."
        url="https://iwantsexnow.ch/hotels"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <KeyRound size={14} /> DISKRETION & OUTCALL-LOGISTIK SCHWEIZ
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Schweizer Outcall-Hotel- & Self-Check-in-Kompass
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Worauf es bei diskreten Hotel- und Apartmentbesuchen ankommt: <strong>Direkter Tiefgaragen-Lift</strong>, <strong>kontaktloser PIN-Check-in</strong> und verifizierte Outcall-Profile.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/kategorie/zug/haus-und-hotelbesuche" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
              Outcall Zug (ZG) →
            </Link>
            <Link href="/kategorie/zuerich/haus-und-hotelbesuche" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white">
              Outcall Zürich (ZH) →
            </Link>
          </div>
        </section>

        {/* Kantons-Filter */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "ZG", "ZH", "LU", "BS", "AG", "GE"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCanton(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                selectedCanton === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#121722] text-gray-300 border border-white/10"
              }`}
            >
              {c === "ALL" ? "Alle Schweizer Regionen" : `Kanton ${c}`}
            </button>
          ))}
        </div>

        {/* Regionale Hotel- & Outcall-Karten */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleHubs.map((hub) => (
            <div key={hub.citySlug} className="p-6 rounded-2xl bg-[#121722] border border-white/10 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-white/10 pb-3">
                  <div>
                    <span className="text-[11px] font-bold text-[#C8A97E] uppercase tracking-wider">
                      Kanton {hub.canton} · Ø Outcall CHF {hub.avgOutcallChf}.– / 60m
                    </span>
                    <h2 className="text-xl font-serif font-bold text-white mt-0.5">{hub.city}</h2>
                  </div>
                  <Link
                    href={`/kategorie/${hub.citySlug}/haus-und-hotelbesuche`}
                    className="px-3.5 py-2 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs inline-flex items-center gap-1"
                  >
                    <span>Outcall-Profile</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="space-y-3">
                  {hub.highlights.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-[#0D111A] border border-white/5 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-white text-sm">{item.name}</strong>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-[#C8A97E] font-bold text-[10px]">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-emerald-400 font-semibold flex items-center gap-1.5">
                        <Car size={13} /> {item.access}
                      </div>
                      <p className="text-gray-400 text-[11px]">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
                <Link href={`/orte/${hub.citySlug}`} className="text-gray-300 hover:text-white font-semibold">
                  Alle Profile in {hub.city} →
                </Link>
                <Link href={`/kategorie/${hub.citySlug}/dinner-date`} className="text-[#C8A97E] font-bold hover:underline">
                  Dinner-Date Begleitung in {hub.city} →
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}