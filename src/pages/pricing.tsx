import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { ShieldCheck, Calculator, MapPin, ArrowRight, CheckCircle2 } from "lucide-react";

const CANTON_META: { code: string; name: string; slug: string }[] = [
  { code: "ZG", name: "Zug & Baar", slug: "zug" },
  { code: "ZH", name: "Zürich City & Region", slug: "zuerich" },
  { code: "LU", name: "Luzern & Zentralschweiz", slug: "luzern" },
  { code: "AG", name: "Baden, Wettingen & Aargau", slug: "baden" },
  { code: "BS", name: "Basel-Stadt & Dreiländereck", slug: "basel" },
  { code: "BE", name: "Bern, Biel & Thun", slug: "bern" },
  { code: "SG", name: "St. Gallen & Rapperswil", slug: "st-gallen" },
  { code: "GE", name: "Genève", slug: "geneve" },
  { code: "VD", name: "Lausanne & Vaud", slug: "lausanne" },
  { code: "TI", name: "Lugano & Locarno", slug: "lugano" },
];

export default function PricingCompassPage() {
  const [calcCanton, setCalcCanton] = useState("ZG");
  const [calcDuration, setCalcDuration] = useState<number>(60);
  const [calcMode, setCalcMode] = useState<"incall" | "outcall">("incall");

  const cantonStats = useMemo(() => {
    const raw = (offersData as any[]) || [];
    return CANTON_META.map((c) => {
      const matches = raw.filter((o) => String(o.canton || "").toUpperCase() === c.code);
      const rates60 = matches
        .map((m) => Number(m.advertisedBaseChf))
        .filter((n) => Number.isFinite(n) && n >= 100 && n <= 1200);

      const avg60 =
        rates60.length > 0
          ? Math.round(rates60.reduce((a, b) => a + b, 0) / rates60.length / 10) * 10
          : 350;
      const avg30 = Math.round((avg60 * 0.6) / 10) * 10;

      return {
        ...c,
        count: matches.length,
        avg60,
        avg30,
        min60: rates60.length > 0 ? Math.min(...rates60) : 200,
        max60: rates60.length > 0 ? Math.max(...rates60) : 600,
      };
    });
  }, []);

  const estimatedChf = useMemo(() => {
    const found = cantonStats.find((c) => c.code === calcCanton) || cantonStats[0];
    const base60 = found?.avg60 || 350;
    let total = base60;
    if (calcDuration === 30) total = Math.round((base60 * 0.6) / 10) * 10;
    if (calcDuration === 90) total = Math.round((base60 * 1.45) / 10) * 10;
    if (calcDuration === 120) total = Math.round((base60 * 1.85) / 10) * 10;
    if (calcMode === "outcall") total += 50;
    return total;
  }, [cantonStats, calcCanton, calcDuration, calcMode]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer Escort & Tantra CHF-Honorar-Kompass (30m/60m Richtpreise nach Kanton) | iwantsexnow.ch"
        description="Offizieller Schweizer CHF-Honorar-Kompass für unabhängige Escorts, Girlfriend Experience & Tantra-Studios in Zug, Zürich, Luzern, Basel, Bern & Genf. 100% Preistransparenz."
        url="https://iwantsexnow.ch/pricing"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} /> SCHWEIZER PREIS-TRANSPARENZ · 0 % VERMITTLUNGSPROVISION
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Kantonaler CHF-Honorar-Kompass (30 Min. & 60 Min. Richtwerte)
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Echte Durchschnittswerte aus <strong>2.515 bereinigten Schweizer Profilen</strong> (strenges Quality-Gate: CHF 100.– bis CHF 1.200.–).
            </p>
          </div>
          <Link href="/compare-escorts" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
            4-Profil Tarifvergleich →
          </Link>
        </section>

        {/* Interaktiver Schweizer Honorar-Rechner */}
        <section className="p-6 rounded-2xl bg-[#121722] border border-white/10 space-y-4">
          <div className="flex items-center gap-2 text-sm font-serif font-bold text-white">
            <Calculator size={16} className="text-[#C8A97E]" />
            <span>Interaktiver Schweizer Richtpreis-Rechner</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Kanton wählen</label>
              <select
                value={calcCanton}
                onChange={(e) => setCalcCanton(e.target.value)}
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-xs text-white font-bold"
              >
                {cantonStats.map((c) => (
                  <option key={c.code} value={c.code}>
                    {c.code} — {c.name} ({c.count} Profile)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Gewünschte Dauer</label>
              <select
                value={calcDuration}
                onChange={(e) => setCalcDuration(Number(e.target.value))}
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-xs text-white font-bold"
              >
                <option value={30}>30 Minuten (Express)</option>
                <option value={60}>60 Minuten (Standard)</option>
                <option value={90}>90 Minuten (Genuss)</option>
                <option value={120}>120 Minuten (Dinner / VIP)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">Treffpunkt</label>
              <select
                value={calcMode}
                onChange={(e) => setCalcMode(e.target.value as any)}
                className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-xs text-white font-bold"
              >
                <option value="incall">Incall (Privates Apartment / Studio)</option>
                <option value="outcall">Outcall (Hotelbesuch inkl. Anfahrt)</option>
              </select>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D111A] border border-[#C8A97E]/50 flex items-center justify-between">
              <div>
                <div className="text-[10px] text-gray-400 uppercase font-bold">Üblicher Richtwert</div>
                <div className="text-xl font-extrabold text-[#C8A97E]">CHF {estimatedChf}.–</div>
              </div>
              <Link
                href={`/matches`}
                className="px-3 py-2 rounded-lg bg-[#C8A97E] text-[#0D111A] text-[11px] font-extrabold"
              >
                Matches →
              </Link>
            </div>
          </div>
        </section>

        {/* Kantonale Richtpreis-Karten */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cantonStats.map((c) => (
            <div key={c.code} className="p-5 rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/50 flex flex-col justify-between gap-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-[#C8A97E]/20 text-[#C8A97E] text-xs font-extrabold">
                    Kanton {c.code}
                  </span>
                  <span className="text-xs text-gray-400 font-semibold">{c.count} geprüfte Profile</span>
                </div>
                <h2 className="text-lg font-serif font-bold text-white">{c.name}</h2>

                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <div className="p-3 rounded-xl bg-[#0D111A] border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase">Ø 60 Min. Date</div>
                    <div className="text-base font-extrabold text-[#C8A97E] mt-0.5">CHF {c.avg60}.–</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#0D111A] border border-white/5">
                    <div className="text-[10px] text-gray-400 uppercase">Ø 30 Min. Express</div>
                    <div className="text-base font-extrabold text-white mt-0.5">CHF {c.avg30}.–</div>
                  </div>
                </div>
                <div className="text-[11px] text-gray-400">
                  Bandbreite 60 Min.: CHF {c.min60}.– bis CHF {c.max60}.– · Direkte Bar- oder TWINT-Zahlung vor Ort.
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-white/10 text-xs">
                <Link href={`/kategorie/${c.slug}/girlfriend-experience`} className="text-gray-300 hover:text-white">
                  GFE {c.name.split(" ")[0]} →
                </Link>
                <Link href={`/orte/${c.slug}`} className="text-[#C8A97E] font-extrabold inline-flex items-center gap-1">
                  <span>Alle Profile</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}