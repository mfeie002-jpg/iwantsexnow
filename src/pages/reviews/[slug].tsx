import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { SEO } from "@/components/SEO";
import { BrandLogo } from "@/components/BrandLogo";
import { SWISS_PORTAL_TOP10 } from "@/data/portalReviewsData";

export default function SinglePortalReviewPage() {
  const router = useRouter();
  const slug = String(router.query.slug || "xdate-review");
  const review = SWISS_PORTAL_TOP10.find((r) => r.slug === slug) || SWISS_PORTAL_TOP10[1];
  const winner = SWISS_PORTAL_TOP10[0];

  return (
    <div className="min-h-screen bg-[#0D1826] text-white">
      <SEO
        title={`${review.name} Erfahrungen & Test 2026 (Platz #${review.rank} im Schweizer Ranking) | Review`}
        description={`Ehrlicher Testbericht zu ${review.name} (${review.score}/10): Was kostet ein Inserat für Models? Wie hoch ist die Fake- & Dubletten-Quote für Kunden? Plus Vergleich mit Testsieger iwantsexnow.ch.`}
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08101A]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <BrandLogo compact />
          </Link>
          <div className="flex items-center gap-3 text-xs font-bold">
            <Link href="/reviews" className="text-sky-300 hover:underline">
              ← Alle Top 10 Portal-Reviews
            </Link>
            <Link href="/advertise" className="px-3.5 py-1.5 rounded-xl bg-emerald-500 text-black">
              1. Monat Gratis testen
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-10">
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400">
            <Link href="/" className="hover:text-white">Startseite</Link>
            <span>/</span>
            <Link href="/reviews" className="hover:text-white">Top 10 Portal-Reviews</Link>
            <span>/</span>
            <span className="text-[#C8A97E]">{review.name} Review</span>
          </div>

          <span className="inline-block px-3 py-1 rounded-full bg-[#C8A97E]/15 text-[#C8A97E] text-xs font-bold">
            Platz #{review.rank} von 10 im Schweizer Portal-Benchmark 2026 · Wertung: {review.score}/10
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
            {review.name} Erfahrungen, Preise & ehrlicher Testbericht (2026)
          </h1>
          <p className="text-sm sm:text-base text-gray-300">{review.summary}</p>
        </div>

        {/* KEY FACTS SCORECARD */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-[#111F30] border border-white/10">
            <div className="text-[10px] uppercase text-gray-400">Redaktions-Score</div>
            <div className="text-2xl font-extrabold text-[#C8A97E] mt-1">{review.score} / 10</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#111F30] border border-white/10">
            <div className="text-[10px] uppercase text-gray-400">Aktive Inserate (CH)</div>
            <div className="text-sm font-bold text-white mt-1">{review.activeListingsCh}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#111F30] border border-white/10">
            <div className="text-[10px] uppercase text-gray-400">Kosten für Models</div>
            <div className="text-xs font-bold text-white mt-1">{review.avgCostForModelsChf}</div>
          </div>
          <div className="p-4 rounded-2xl bg-[#111F30] border border-white/10">
            <div className="text-[10px] uppercase text-gray-400">Creator-Tools</div>
            <div className="text-xs font-bold text-white mt-1">{review.monetizationFeatures}</div>
          </div>
        </div>

        {/* PROS & CONS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
          <div className="p-5 rounded-2xl bg-emerald-950/30 border border-emerald-500/30 space-y-2">
            <h2 className="text-base font-bold text-emerald-300">👍 Stärken von {review.name}</h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-200">
              {review.pros.map((p, i) => (
                <li key={i}>{p}</li>
              ))}
            </ul>
          </div>
          <div className="p-5 rounded-2xl bg-rose-950/30 border border-rose-500/30 space-y-2">
            <h2 className="text-base font-bold text-rose-300">👎 Schwächen von {review.name}</h2>
            <ul className="list-disc list-inside space-y-1.5 text-gray-200">
              {review.cons.map((c, i) => (
                <li key={i}>{c}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* DEEP EDITORIAL SECTIONS */}
        <div className="space-y-8 p-6 sm:p-8 rounded-3xl bg-[#111F30] border border-white/10 text-sm leading-relaxed text-gray-200">
          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              1. Marktüberblick & Reichweite von {review.name} in der Schweiz
            </h2>
            <p>{review.deepAnalysis.overview}</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              2. Kosten, Gebühren & Lohnt sich {review.name} für Models / Escorts?
            </h2>
            <p>{review.deepAnalysis.pricingForModels}</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              3. Benutzerfreundlichkeit & Preis-Transparenz für Kunden
            </h2>
            <p>{review.deepAnalysis.experienceForClients}</p>
          </section>

          <section className="space-y-2">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
              4. Fake-Profile, Dubletten-Quote & Verifizierung
            </h2>
            <p>{review.deepAnalysis.fakeAndDuplicateRate}</p>
          </section>

          <section className="space-y-2 border-t border-white/10 pt-6">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#C8A97E]">
              5. Unser Fazit zu {review.name} im Vergleich zum Testsieger ({winner.name})
            </h2>
            <p>{review.deepAnalysis.finalVerdict}</p>
          </section>
        </div>

        {/* CTA BOX FOR MODELS & CLIENTS */}
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/50 to-[#111F30] border border-emerald-500/40 space-y-4">
          <h3 className="text-xl sm:text-2xl font-serif font-bold">
            Inserierst du aktuell auf {review.name}? Hol dir jetzt deinen kostenlosen 1. Monat auf iwantsexnow.ch!
          </h3>
          <p className="text-xs sm:text-sm text-gray-200">
            Dein Profil sammelt in unserem Schweizer Index bereits organische Klicks. Übernimm es jetzt in 30 Sekunden kostenlos: Inklusive offiziellem ✓ Haken, Locked-Video-Verkauf (80% Auszahlung) und 1:1 Live-Cam!
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/create-post"
              className="px-6 py-3 rounded-xl bg-emerald-500 text-black font-extrabold text-xs sm:text-sm"
            >
              ✓ Eigenes Profil jetzt gratis übernehmen (1. Monat CHF 0)
            </Link>
            <Link
              href="/"
              className="px-6 py-3 rounded-xl bg-[#C8A97E] text-[#0D1826] font-extrabold text-xs sm:text-sm"
            >
              🔍 Als Kunde alle {review.name}-Inserate bereinigt durchsuchen
            </Link>
          </div>
        </div>

        {/* OTHER REVIEWS NAVIGATION */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">
            Weitere Schweizer Portal-Testberichte 2026:
          </h3>
          <div className="flex flex-wrap gap-2">
            {SWISS_PORTAL_TOP10.map((item) => (
              <Link
                key={item.slug}
                href={`/reviews/${item.slug}`}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold border ${
                  item.slug === review.slug
                    ? "bg-[#C8A97E] text-[#0D1826] border-[#C8A97E]"
                    : "bg-white/5 border-white/10 text-gray-300 hover:border-[#C8A97E]"
                }`}
              >
                #{item.rank} {item.name} ({item.score})
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}