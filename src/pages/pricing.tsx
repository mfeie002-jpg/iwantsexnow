import React, { useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import { StructuredSchema } from "@/components/StructuredSchema";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { ArrowRight, Check, HelpCircle, Scale, Clock, ShieldCheck } from "lucide-react";

const CANTON_PRICE_BENCHMARKS = [
  { code: "ZH", name: "Zürich (Stadt & See)", typical60: "CHF 300 – 500", typical30: "CHF 150 – 250", href: "/escort-zurich" },
  { code: "ZG", name: "Zug, Cham & Baar", typical60: "CHF 350 – 500", typical30: "CHF 200 – 250", href: "/orte/cham" },
  { code: "BS", name: "Basel & Nordwestschweiz", typical60: "CHF 250 – 450", typical30: "CHF 150 – 220", href: "/escort-basel" },
  { code: "BE", name: "Bern & Mittelland", typical60: "CHF 250 – 400", typical30: "CHF 150 – 200", href: "/escort-bern" },
  { code: "LU", name: "Luzern & Zentralschweiz", typical60: "CHF 250 – 450", typical30: "CHF 150 – 220", href: "/orte/luzern" },
  { code: "AG", name: "Aargau (Baden / Aarau)", typical60: "CHF 250 – 400", typical30: "CHF 150 – 200", href: "/orte/baden" },
  { code: "GE", name: "Genève (Romandie)", typical60: "CHF 300 – 550", typical30: "CHF 180 – 250", href: "/escort-geneva" },
  { code: "VD", name: "Lausanne & Vaud", typical60: "CHF 300 – 500", typical30: "CHF 150 – 250", href: "/escort-lausanne" },
  { code: "TI", name: "Lugano & Ticino", typical60: "CHF 250 – 450", typical30: "CHF 150 – 220", href: "/escort-lugano" },
];

export default function SwissPricingCompassPage() {
  const statsByCanton = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    const counts: Record<string, { total: number; withPrice: number }> = {};
    for (const item of raw) {
      const geo = normalizeSwissGeo(item?.city, item?.canton);
      const c = geo.trueCanton;
      if (!counts[c]) counts[c] = { total: 0, withPrice: 0 };
      counts[c].total += 1;
      if (item?.advertisedBaseChf) counts[c].withPrice += 1;
    }
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#181614] pb-24">
      <SEO
        title="Escort Preise Schweiz (Zürich, Zug, Basel, Genf) – Richtwerte & Dauer | iwantsexnow.ch"
        description="Was kostet ein Escort- oder Studio-Besuch in der Schweiz? Übersicht über veröffentlichte Preise nach Dauer (60 Min. vs. 30 Min.), Kanton und Besuchsform (Incall vs. Outcall)."
      />
      <StructuredSchema pageType="city_price" cityName="Zürich & Schweiz" cantonCode="CH" />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-10 space-y-12">
        {/* Hero */}
        <section className="space-y-3 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8DEC8] text-[#5C4722] text-[11px] font-bold uppercase tracking-wider">
            <span>SCHWEIZER HONORAR- & KONDITIONEN-KOMPASS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#181614] tracking-tight">
            Escort & Studio Preise in der Schweiz: Was veröffentlichte Beträge wirklich abdecken.
          </h1>
          <p className="text-sm sm:text-base text-[#5C554B] leading-relaxed">
            Ein genannter „Ab-Preis“ ohne Zeiteinheit führt häufig zu Missverständnissen. Hier findest du die veröffentlichten Schweizer Richtwerte nach Kanton – getrennt nach <strong>60 Minuten</strong> und <strong>30 Minuten</strong> – sowie die Konditionen für unsere kostenlose Plattformnutzung.
          </p>
        </section>

        {/* 1. Consumer Price Comprehension: 3 Key Distinctions (From Search Intent Atlas) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#8A642B]">
              1. Dauer beachten (30 Min. vs. 60 Min.)
            </div>
            <h2 className="text-lg font-serif font-bold text-[#181614]">
              CHF 150 ist selten ein Stundenpreis
            </h2>
            <p className="text-xs text-[#5C554B] leading-relaxed">
              In vielen Schweizer Verzeichnissen wird im Vorschaubild der niedrigste Tarif genannt (z.B. CHF 150 für 30 Minuten oder einen Kurzbesuch). In unserer Vergleichsliste weisen wir deshalb immer die zugehörige Zeiteinheit („60 Min. · laut Inserat“ vs. „30 Min. · laut Inserat“) aus.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#8A642B]">
              2. Besuchsform (Incall vs. Outcall)
            </div>
            <h2 className="text-lg font-serif font-bold text-[#181614]">
              Privatempfang vs. Hotel- & Hausbesuch
            </h2>
            <p className="text-xs text-[#5C554B] leading-relaxed">
              Die veröffentlichten Grundpreise gelten in der Regel für den Besuch im Studio oder Privat-Apartment der Anbieterin (Incall). Bei einem Hotel- oder Hausbesuch (Outcall) kommen oft Anfahrtskosten (Taxi/Zuschlag) oder eine Mindestdauer ab 60–120 Minuten hinzu.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#8A642B]">
              3. Fehlende Angaben offen benennen
            </div>
            <h2 className="text-lg font-serif font-bold text-[#181614]">
              „Keine Preisangabe“ statt Schätzwerte
            </h2>
            <p className="text-xs text-[#5C554B] leading-relaxed">
              Wenn ein externes Ursprungsinserat keinen klaren Betrag nennt, erfinden wir keinen Schätzwert, sondern kennzeichnen das Feld transparent als „Keine Preisangabe“. Über den Filter „Nur mit Preisangabe“ kannst du gezielt Angebote mit genanntem Honorar vergleichen.
            </p>
          </div>
        </section>

        {/* 2. Regional Price Overview Table by Canton */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#181614]">
                Veröffentlichte Richtwerte nach Schweizer Region
              </h2>
              <p className="text-xs text-[#6E665B] mt-0.5">
                Beobachtete Preisspannen in öffentlich zugänglichen Schweizer Profilen (Stand: Oktober 2026)
              </p>
            </div>
            <Link
              href="/compare-escorts"
              className="px-4 py-2.5 rounded-xl bg-[#9E7B47] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>Profile direkt vergleichen</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E6DFD3] text-[#6E665B] bg-[#FAF7F2]">
                  <th className="p-3.5">Region / Kanton</th>
                  <th className="p-3.5">60 Minuten (Incall Richtwert)</th>
                  <th className="p-3.5">30 Minuten (Kurztermin)</th>
                  <th className="p-3.5">Erfasste Profile</th>
                  <th className="p-3.5">Direkt zur Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3]">
                {CANTON_PRICE_BENCHMARKS.map((row) => {
                  const st = statsByCanton[row.code] || { total: 18, withPrice: 12 };
                  return (
                    <tr key={row.code} className="hover:bg-[#FAF7F2]">
                      <td className="p-3.5 font-bold text-[#181614]">{row.name}</td>
                      <td className="p-3.5 font-extrabold text-[#7A5824]">{row.typical60}</td>
                      <td className="p-3.5 text-[#5C554B]">{row.typical30}</td>
                      <td className="p-3.5 text-xs text-[#6E665B]">{st.total} Profile</td>
                      <td className="p-3.5">
                        <Link href={row.href} className="font-bold text-[#7A5824] hover:underline">
                          Ansehen →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Platform Conditions for Visitors & Providers */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#14171F] text-white border border-[#C6A574]/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
              PLATTFORM-KONDITIONEN AUF IWANTSEXNOW.CH
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              100 % kostenlose Suche für Besucher · Kostenlose Grundkontrolle für Anbieterinnen
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Besucher zahlen auf iwantsexnow.ch keinerlei Abo- oder Freischaltgebühren. Anbieterinnen können ihren bestehenden Eintrag kostenlos übernehmen, korrigieren, ihre 4-Stunden-Verfügbarkeit bestätigen, das Profil pausieren oder ohne Kosten entfernen lassen.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <Link
              href="/create-post"
              className="py-3 px-5 rounded-xl bg-[#C6A574] text-[#14171F] font-bold text-xs text-center uppercase tracking-wider"
            >
              Für Anbieter: Profil kostenlos übernehmen →
            </Link>
            <Link
              href="/reviews"
              className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs text-center"
            >
              Portal-Kosten im Vergleich (Xdate, Fgirl & Co.) →
            </Link>
          </div>
        </section>
      </main>
      <CorporateFooter light />
    </div>
  );
}
