import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SWISS_PORTAL_TOP10, OUR_PLATFORM_DISCLOSURE } from "@/data/portalReviewsData";
import { Check, Info, ShieldCheck } from "lucide-react";

export default function HonestPortalReviewsPage() {
  return (
    <div className="min-h-screen bg-[#090A0F] text-white pb-20">
      <SEO
        title="Schweizer Escort-Portale im Vergleich (2026): Methodik, Kosten & Erfahrungen | iwantsexnow.ch"
        description="Sachlicher Plattformvergleich für die Schweiz: xdate.ch, fgirl.ch, and6.com, rosalon.ch & kaufmich.com nach Besucher- und Anbieter-Kriterien geprüft."
      />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        <section className="max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold">
            <span>REDAKTIONELLER PLATTFORMVERGLEICH · STAND: 25. OKTOBER 2026</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold">
            Schweizer Erotik- & Escort-Portale im sachlichen Vergleich
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Welches Portal eignet sich für Suchende – und wo erhalten Anbieterinnen die fairsten Konditionen? Wir bewerten Besuchernutzen und Anbieternutzen getrennt nach offengelegten Kriterien. Bezahlte Werbeplätze haben keinen Einfluss auf redaktionelle Beschreibungen.
          </p>
        </section>

        {/* TRANSPARENCY DISCLOSURE BOX (Our Platform outside the third-party ranking) */}
        <section className="p-6 rounded-2xl bg-[#11131C] border border-[#C8A97E]/45 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#C8A97E]">
            <Info size={15} />
            <span>Offenlegung & Einordnung unseres eigenen Angebots</span>
          </div>
          <h2 className="text-lg font-serif font-bold text-white">{OUR_PLATFORM_DISCLOSURE.name}</h2>
          <p className="text-xs text-gray-300 leading-relaxed">{OUR_PLATFORM_DISCLOSURE.note}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
            {OUR_PLATFORM_DISCLOSURE.highlights.map((h, i) => (
              <div key={i} className="flex items-start gap-2 text-xs text-gray-200">
                <Check size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </section>

        {/* METHODOLOGY WEIGHTS */}
        <section className="p-5 rounded-2xl bg-[#0D0F17] border border-white/10">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300 mb-3">
            Unsere 5 Prüfkriterien & Gewichtung
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-[#C8A97E] font-bold">30 %</div>
              <div className="text-gray-200 font-semibold mt-0.5">Transparenz, Profilkontrolle & Meldewege</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-[#C8A97E] font-bold">25 %</div>
              <div className="text-gray-200 font-semibold mt-0.5">Suche & Mobile Bedienbarkeit</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-[#C8A97E] font-bold">20 %</div>
              <div className="text-gray-200 font-semibold mt-0.5">Kosten- & Werbetransparenz</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-[#C8A97E] font-bold">15 %</div>
              <div className="text-gray-200 font-semibold mt-0.5">Schweizer Abdeckung</div>
            </div>
            <div className="p-3 rounded-xl bg-white/5">
              <div className="text-[#C8A97E] font-bold">10 %</div>
              <div className="text-gray-200 font-semibold mt-0.5">Aktualität & Datenpflege</div>
            </div>
          </div>
        </section>

        {/* COMPARISON TABLE */}
        <section className="overflow-x-auto rounded-2xl border border-white/10 bg-[#11131C]">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#07080C] text-gray-300">
                <th className="p-3.5">Untersuchtes Portal</th>
                <th className="p-3.5">Note Besucher</th>
                <th className="p-3.5">Note Anbieter</th>
                <th className="p-3.5">Schwerpunkt Schweiz</th>
                <th className="p-3.5">Prüfdatum</th>
                <th className="p-3.5">Einzelbericht</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {SWISS_PORTAL_TOP10.map((p) => (
                <tr key={p.slug} className="hover:bg-white/5">
                  <td className="p-3.5 font-bold text-white">
                    <Link href={`/reviews/${p.slug}`} className="hover:text-[#C8A97E] text-sm">
                      {p.name}
                    </Link>
                    <div className="text-[11px] text-gray-400 font-normal">{p.verdictBadge}</div>
                  </td>
                  <td className="p-3.5 font-bold text-emerald-300">{p.visitorScore.toFixed(1)} / 10</td>
                  <td className="p-3.5 font-bold text-[#C8A97E]">{p.providerScore.toFixed(1)} / 10</td>
                  <td className="p-3.5 text-gray-300">{p.bestFor}</td>
                  <td className="p-3.5 text-gray-400">{p.lastAudited}</td>
                  <td className="p-3.5">
                    <Link
                      href={`/reviews/${p.slug}`}
                      className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#C8A97E] hover:text-[#090A0F] font-semibold inline-block transition"
                    >
                      Analyse lesen →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* DETAILED CARDS */}
        <section className="space-y-5">
          {SWISS_PORTAL_TOP10.map((p) => (
            <article key={p.slug} className="p-6 rounded-2xl bg-[#11131C] border border-white/10 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                    Einzelanalyse · Geprüft am {p.lastAudited}
                  </span>
                  <h3 className="text-xl font-serif font-bold text-white mt-0.5">{p.name}</h3>
                </div>
                <div className="flex gap-2 text-xs">
                  <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10">
                    Besucher: <strong className="text-emerald-300">{p.visitorScore}/10</strong>
                  </div>
                  <div className="px-3 py-1.5 rounded-xl bg-black/50 border border-white/10">
                    Anbieter: <strong className="text-[#C8A97E]">{p.providerScore}/10</strong>
                  </div>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-300">{p.summary}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-950/25 border border-emerald-500/25">
                  <div className="font-bold text-emerald-300 mb-1">Beobachtete Stärken:</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-200">
                    {p.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                  </ul>
                </div>
                <div className="p-3.5 rounded-xl bg-rose-950/25 border border-rose-500/25">
                  <div className="font-bold text-rose-300 mb-1">Grenzen & Kritikpunkte:</div>
                  <ul className="list-disc list-inside space-y-1 text-gray-200">
                    {p.cons.map((con, i) => <li key={i}>{con}</li>)}
                  </ul>
                </div>
              </div>
              <div className="flex justify-end">
                <Link
                  href={`/reviews/${p.slug}`}
                  className="px-4 py-2 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs"
                >
                  Vollständigen Prüfbericht zu {p.name} öffnen →
                </Link>
              </div>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
}