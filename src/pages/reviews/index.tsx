import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { BrandLogo } from "@/components/BrandLogo";
import { SWISS_PORTAL_TOP10 } from "@/data/portalReviewsData";

export default function Top10PortalReviewsHub() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top 10 Escort-Portale & Erotik-Verzeichnisse der Schweiz 2026 im Test",
    itemListElement: SWISS_PORTAL_TOP10.map((p) => ({
      "@type": "ListItem",
      position: p.rank,
      name: p.name,
      url: `https://iwantsexnow.ch/reviews/${p.slug}`,
    })),
  };

  return (
    <div className="min-h-screen bg-[#0D1826] text-white">
      <SEO
        title="Top 10 Escort-Portale Schweiz 2026 im Test: Xdate, Fgirl, And6 & Co. | Ehrliches Review"
        description="Der grosse unabhängige Schweizer Portal-Vergleich 2026: Xdate.ch Review, Fgirl.ch Erfahrungen, And6.com, Rosalon & Kaufmich im ehrlichen Test (Preise, Fake-Quote & Reichweite)."
        structuredData={structuredData}
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08101A]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <BrandLogo compact />
          </Link>
          <div className="flex items-center gap-3 text-xs font-bold">
            <Link href="/" className="text-gray-300 hover:text-white">
              ← Zurück zur Suche
            </Link>
            <Link href="/advertise" className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black">
              Für Models: 1. Monat Gratis
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-12">
        <section className="text-center max-w-4xl mx-auto space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full bg-sky-500/15 border border-sky-400/40 text-sky-300 text-xs font-bold uppercase tracking-wider">
            📊 Deep-Research Marktbericht Schweiz 2026 · 27 Portale analysiert
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
            Die Top 10 Schweizer Escort-Portale & Verzeichnisse 2026 im ehrlichen Test
          </h1>
          <p className="text-sm sm:text-base text-gray-300">
            Für diesen unabhängigen Benchmark haben wir über <strong>7.021 aktive Schweizer Inserate</strong> auf <strong>xdate.ch, fgirl.ch, and6.com, rosalon.ch, kaufmich.com, 6navi.ch, sex4u.ch, bemygirl.ch</strong> und weiteren Plattformen ausgewertet: Wo finden Kunden echte Profile ohne Preis-Abzocke – und wo verdienen Models am meisten?
          </p>
        </section>

        {/* QUICK COMPARISON MATRIX */}
        <section className="overflow-x-auto rounded-3xl border border-white/10 bg-[#111F30] shadow-2xl">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-white/10 bg-[#08101A] text-gray-300">
                <th className="p-3.5">Rang & Portal</th>
                <th className="p-3.5">Test-Score</th>
                <th className="p-3.5">Aktive CH-Inserate</th>
                <th className="p-3.5">Kosten für Models</th>
                <th className="p-3.5">Verifizierung & Schutz</th>
                <th className="p-3.5">Einzel-Testbericht</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {SWISS_PORTAL_TOP10.map((p) => (
                <tr key={p.slug} className={p.rank === 1 ? "bg-[#C8A97E]/10" : "hover:bg-white/5"}>
                  <td className="p-3.5 font-bold">
                    <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-[#C8A97E] text-[#0D1826] font-extrabold mr-2">
                      #{p.rank}
                    </span>
                    <Link href={`/reviews/${p.slug}`} className="hover:underline text-white text-sm">
                      {p.name}
                    </Link>
                  </td>
                  <td className="p-3.5 font-extrabold text-[#C8A97E] text-sm">{p.score.toFixed(1)} / 10</td>
                  <td className="p-3.5 text-gray-200">{p.activeListingsCh}</td>
                  <td className="p-3.5 text-gray-300">{p.avgCostForModelsChf}</td>
                  <td className="p-3.5 text-gray-300">{p.verificationStandard}</td>
                  <td className="p-3.5">
                    <Link
                      href={`/reviews/${p.slug}`}
                      className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-[#C8A97E] hover:text-[#0D1826] font-bold inline-block"
                    >
                      Zum Review →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* DETAILED RANKING RATIONALE CARDS (#1 to #10) */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">
            Einzelbegründung: Warum steht welches Portal auf Platz 1 bis 10?
          </h2>

          <div className="space-y-6">
            {SWISS_PORTAL_TOP10.map((p) => (
              <article
                key={p.slug}
                className={`p-6 rounded-3xl border ${
                  p.rank === 1
                    ? "bg-gradient-to-br from-[#15263B] to-[#0D1826] border-[#C8A97E]"
                    : "bg-[#111F30] border-white/10"
                } space-y-4`}
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#C8A97E]">
                      Platz #{p.rank} im Schweizer Gesamtranking · {p.verdictBadge}
                    </span>
                    <h3 className="text-2xl font-serif font-bold text-white mt-0.5">
                      #{p.rank} {p.name} – Erfahrungen, Kosten & Test 2026
                    </h3>
                  </div>
                  <div className="px-4 py-2 rounded-2xl bg-[#08101A] border border-[#C8A97E]/40 text-right">
                    <div className="text-[10px] text-gray-400 uppercase">Gesamtwertung</div>
                    <div className="text-xl font-extrabold text-[#C8A97E]">{p.score.toFixed(1)} / 10</div>
                  </div>
                </div>

                <p className="text-xs sm:text-sm text-gray-200">{p.summary}</p>

                <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-xs text-gray-300">
                  <strong className="text-white">Begründung der Redaktion für Platz #{p.rank}:</strong> {p.whyThisRank}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-1.5">
                    <div className="font-bold text-emerald-300">👍 Vorteile von {p.name}:</div>
                    <ul className="list-disc list-inside space-y-1 text-gray-200">
                      {p.pros.map((pro, i) => (
                        <li key={i}>{pro}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-1.5">
                    <div className="font-bold text-rose-300">👎 Nachteile & Kritikpunkte:</div>
                    <ul className="list-disc list-inside space-y-1 text-gray-200">
                      {p.cons.map((con, i) => (
                        <li key={i}>{con}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <span className="text-xs text-gray-400">
                    Am besten geeignet für: <strong className="text-gray-200">{p.bestFor}</strong>
                  </span>
                  <Link
                    href={`/reviews/${p.slug}`}
                    className="px-5 py-2.5 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#0D1826] font-bold text-xs"
                  >
                    📖 Vollständigen Testbericht zu {p.name} lesen →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}