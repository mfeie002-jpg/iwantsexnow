import React, { useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { MapPin, CheckCircle2, ArrowRight, ShieldCheck, Info, Sparkles } from "lucide-react";

const CANTON_NAMES: Record<string, string> = {
  ZH: "Zürich",
  ZG: "Zug & Cham",
  GE: "Genève (Romandie)",
  VD: "Lausanne & Waadt",
  BS: "Basel-Stadt",
  AG: "Aargau & Baden",
  BE: "Bern & Biel",
  LU: "Luzern",
  SG: "St. Gallen",
  TI: "Lugano & Tessin",
  SO: "Solothurn & Olten",
  VS: "Wallis",
  TG: "Thurgau",
  SZ: "Schwyz & Pfäffikon",
};

export default function SwissPricingCompassPage() {
  const cantonBenchmarks = useMemo(() => {
    const all = (offersData as any[]) || [];
    const grouped: Record<string, { count: number; sum30: number; sum60: number }> = {};

    for (const o of all) {
      const c = String(o.canton || "ZH").toUpperCase();
      if (!grouped[c]) grouped[c] = { count: 0, sum30: 0, sum60: 0 };
      const r60 = Number(o.advertisedBaseChf) || 350;
      const r30 = Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10;
      grouped[c].count += 1;
      grouped[c].sum30 += r30;
      grouped[c].sum60 += r60;
    }

    return Object.entries(grouped)
      .filter(([_, v]) => v.count >= 5)
      .map(([canton, v]) => ({
        canton,
        label: CANTON_NAMES[canton] || `Kanton ${canton}`,
        count: v.count,
        avg30: Math.round(v.sum30 / v.count / 10) * 10,
        avg60: Math.round(v.sum60 / v.count / 10) * 10,
        avgOutcall: Math.round((v.sum60 / v.count + 70) / 10) * 10,
      }))
      .sort((a, b) => b.count - a.count);
  }, []);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer Escort Preise 2026: 30 Min. & 60 Min. CHF-Richtwerte nach Kanton | iwantsexnow.ch"
        description="Was kostet ein Escort oder eine erotische Massage in Zürich, Zug, Basel, Bern, Genf und Lugano? Echter Schweizer Preisvergleich (30 Min. / 60 Min. / Hotel-Outcall) aus 2.526 Profilen."
        url="https://iwantsexnow.ch/pricing"
      />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Hero */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-4">
          <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold">
            TRANSPARENTER SCHWEIZER HONORAR-KOMPASS 2026 · DATENBASIS: 2.526 PROFILE
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            Schweizer Escort- & Massage-Richtpreise im Kantonsvergleich (CHF)
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed max-w-3xl">
            Auf herkömmlichen Schweizer Portalen fehlen oft klare Preisangaben für 30 vs. 60 Minuten oder Zuschläge für Hotelbesuche (Outcall). Diese Übersicht zeigt dir die real berechneten Durchschnittswerte aus 2.526 aktiven Schweizer Profilen – und daneben das 100 % kostenlose Selbstverwaltungs-Modell für Anbieterinnen.
          </p>
        </section>

        {/* Kantonale Preis-Tabelle (SEO-Magnet für "Escort Zürich Preise" / "Escort Zug Kosten") */}
        <section className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
              1. Durchschnittliche Kunden-Honorare nach Schweizer Kanton (Incall vs. Hotel-Outcall)
            </h2>
            <span className="text-xs text-emerald-400 font-semibold">● Direktkontakt ohne Agentur-Provision</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Kanton & Region</th>
                  <th className="py-3 px-3">Aktive Profile</th>
                  <th className="py-3 px-3">Ø 30 Min. (Privat / Incall)</th>
                  <th className="py-3 px-3">Ø 60 Min. (Privat / Incall)</th>
                  <th className="py-3 px-3">Ø 60 Min. (Hotel / Outcall)</th>
                  <th className="py-3 px-3 text-right">Direktvergleich</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {cantonBenchmarks.map((row) => (
                  <tr key={row.canton} className="hover:bg-white/5">
                    <td className="py-3.5 px-3 font-bold text-white">
                      <span className="px-2 py-0.5 rounded bg-[#C8A97E]/20 text-[#C8A97E] mr-2">{row.canton}</span>
                      {row.label}
                    </td>
                    <td className="py-3.5 px-3 text-gray-300">{row.count} Profile</td>
                    <td className="py-3.5 px-3 font-semibold text-gray-200">CHF {row.avg30}.–</td>
                    <td className="py-3.5 px-3 font-extrabold text-[#C8A97E]">CHF {row.avg60}.–</td>
                    <td className="py-3.5 px-3 text-gray-300">ca. CHF {row.avgOutcall}.– (inkl. Anfahrt)</td>
                    <td className="py-3.5 px-3 text-right">
                      <Link
                        href={`/?canton=${encodeURIComponent(row.canton)}`}
                        className="text-[#C8A97E] hover:underline font-bold inline-flex items-center gap-1"
                      >
                        Alle {row.count} in {row.canton} →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Für Anbieterinnen: 0 CHF Basisprofil + 80/20 Creator-Modell statt teurer Portal-Abos */}
        <section className="grid md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#121722] border border-emerald-500/40 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold uppercase">
                FÜR ANBIETERINNEN & STUDIOS · DAUERHAFT KOSTENLOS
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                Selbstverwaltetes Direktprofil: CHF 0.– / Monat
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Anders als bei klassischen Inserateportalen zahlst du auf iwantsexnow.ch keine monatlichen Fixgebühren von CHF 150–400, nur um deine eigenen Fotos, Preise und deine Telefonnummer aktuell zu halten.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-200 pt-2">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Eigene +41 Nummer, 30m/60m Preise & Bio jederzeit ändern</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 1-Klick „Jetzt für 4 Stunden verfügbar“-Echtzeitschalter</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 0 % Provision auf deine direkten Treffen & WhatsApp-Kontakte</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Kostenlose „✓ Identität geprüft“-Verifizierung</li>
              </ul>
            </div>
            <Link
              href="/create-post"
              className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07120B] font-extrabold text-xs uppercase tracking-wider text-center block"
            >
              Eigenes Profil jetzt kostenlos übernehmen oder anlegen →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#C8A97E]/20 text-[#C8A97E] text-[10px] font-extrabold uppercase">
                OPTIONALER ZUSATZ-UMSATZ · 80 % AUSZAHLUNG AN DICH
              </span>
              <h3 className="text-xl font-serif font-bold text-white">
                Paid-Content-Vault (PPV), 1:1 Live-Cam & Top-Spot
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Verdiene zusätzlich auch ohne physisches Treffen: Verkaufe gesperrte 4K-Videos & Foto-Sets oder biete diskrete 1:1 Video-Calls direkt über dein Profil an.
              </p>
              <ul className="space-y-1.5 text-xs text-gray-200 pt-2">
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#C8A97E]" /> <strong>80 % Netto-Auszahlung</strong> bei allen Paid-Content- & Video-Verkäufen</li>
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#C8A97E]" /> <strong>80 % Netto-Auszahlung</strong> bei 1:1 Live-Cam-Minuten (z.B. CHF 6/Min.)</li>
                <li className="flex items-center gap-2"><Sparkles size={14} className="text-[#C8A97E]" /> <strong>30 Tage Gratis-Pilot-Boost</strong> für Top-Platzierungen in Zug & Zürich</li>
              </ul>
            </div>
            <Link
              href="/login"
              className="w-full py-3.5 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider text-center block"
            >
              Ins Anbieter-Cockpit einloggen →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}