import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Diskrete Schweizer Outcall-Hotels & Self-Check-in Apartments (Zug, Zürich, Basel) | iwantsexnow.ch"
        description="Schweizer Guide für diskrete Hotelbesuche (Outcall), Day-Use-Suiten mit Tiefgaragen-Lift und kontaktlose Self-Check-in-Apartments in Zug, Zürich, Luzern, Basel & Genf."
        url="https://iwantsexnow.ch/hotels"
      />
      <LuxuryHeader />

      <PageIntro tone="himmel" note="Diskret übernachten" art="none" title={<>Schweizer Outcall-Hotel- & Self-Check-in-Kompass</>}
        lead={<>Worauf es bei diskreten Hotel- und Apartmentbesuchen ankommt: <strong>Direkter Tiefgaragen-Lift</strong>, <strong>kontaktloser PIN-Check-in</strong> und verifizierte Outcall-Profile.</>}>
        <div className="flex gap-2">
            <Link href="/kategorie/zug/haus-und-hotelbesuche" className="px-4 py-2.5 rounded-xl bg-kirsche text-white text-[13px] font-extrabold">
              Outcall Zug (ZG) →
            </Link>
            <Link href="/kategorie/zuerich/haus-und-hotelbesuche" className="px-4 py-2.5 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-bold text-tinte">
              Outcall Zürich (ZH) →
            </Link>
          </div>
      </PageIntro>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        

        {/* Kantons-Filter */}
        <div className="flex flex-wrap gap-2">
          {["ALL", "ZG", "ZH", "LU", "BS", "AG", "GE"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setSelectedCanton(c)}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-extrabold cursor-pointer ${
                selectedCanton === c ? "bg-kirsche text-white" : "bg-white text-gray-300 border border-tinte/20"
              }`}
            >
              {c === "ALL" ? "Alle Schweizer Regionen" : `Kanton ${c}`}
            </button>
          ))}
        </div>

        {/* Regionale Hotel- & Outcall-Karten */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {visibleHubs.map((hub) => (
            <div key={hub.citySlug} className="p-6 rounded-2xl bg-white border border-tinte/20 flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-2 border-b border-tinte/20 pb-3">
                  <div>
                    <span className="text-[13px] font-bold text-kirsche ">
                      Kanton {hub.canton} · Ø Outcall CHF {hub.avgOutcallChf}.– / 60m
                    </span>
                    <h2 className="text-xl font-serif font-bold text-tinte mt-0.5">{hub.city}</h2>
                  </div>
                  <Link
                    href={`/kategorie/${hub.citySlug}/haus-und-hotelbesuche`}
                    className="px-3.5 py-2 rounded-xl bg-kirsche text-white font-extrabold text-[13px] inline-flex items-center gap-1"
                  >
                    <span>Outcall-Profile</span>
                    <ArrowRight size={12} />
                  </Link>
                </div>

                <div className="space-y-3">
                  {hub.highlights.map((item, i) => (
                    <div key={i} className="p-4 rounded-xl bg-papier border border-tinte/10 space-y-1.5 text-[13px]">
                      <div className="flex items-center justify-between gap-2">
                        <strong className="text-tinte text-sm">{item.name}</strong>
                        <span className="px-2 py-0.5 rounded bg-tinte/[0.06] text-kirsche font-bold text-[13px]">
                          {item.type}
                        </span>
                      </div>
                      <div className="text-mint-700 font-semibold flex items-center gap-1.5">
                        <Car size={13} /> {item.access}
                      </div>
                      <p className="text-gray-600 text-[13px]">{item.note}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-tinte/20 text-[13px]">
                <Link href={`/orte/${hub.citySlug}`} className="text-gray-700 hover:text-tinte font-semibold">
                  Alle Profile in {hub.city} →
                </Link>
                <Link href={`/kategorie/${hub.citySlug}/dinner-date`} className="text-kirsche font-bold hover:underline">
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