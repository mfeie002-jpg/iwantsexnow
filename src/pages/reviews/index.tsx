import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SWISS_PORTAL_TOP10, OUR_PLATFORM_DISCLOSURE } from "@/data/portalReviewsData";
import { Search, FileText, HelpCircle, Scale, ArrowRight, Check } from "lucide-react";

const REPORT_IMAGES = [
  "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=700&q=80",
];

export default function SynthesizedPortalComparisonPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("ALL");

  const filteredReports = useMemo(() => {
    return SWISS_PORTAL_TOP10.filter((p) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return `${p.name} ${p.summary} ${p.bestFor}`.toLowerCase().includes(q);
    });
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#141821] pb-20">
      <SEO
        title="Schweizer Portale. Klar verglichen. | iwantsexnow.ch Portalvergleich"
        description="Funktionen, Datenschutz und Profilkontrolle von xdate.ch, fgirl.ch, and6.com, rosalon.ch & kaufmich.com nach denselben Kriterien verglichen."
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 py-10 space-y-12">
        {/* Hero Header + Search Bar (Exakt nach Bild 7: "Schweizer Portale. Klar verglichen.") */}
        <section className="space-y-4 max-w-4xl">
          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#141821] tracking-tight">
            Schweizer Portale. Klar verglichen.
          </h1>
          <p className="text-base sm:text-lg text-stone-600">
            Funktionen, Datenschutz und Profilkontrolle verständlich erklärt.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <div className="flex-1 flex items-center bg-white border border-stone-300 rounded-xl px-4 py-3 shadow-sm">
              <Search size={18} className="text-stone-400 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Portal oder Thema suchen (z.B. xdate, fgirl, Kosten, Datenschutz)..."
                className="w-full px-3 bg-transparent text-sm text-[#141821] placeholder-stone-400 focus:outline-none"
              />
            </div>
            <button
              type="button"
              className="px-6 py-3 rounded-xl bg-[#B8965A] hover:bg-[#a6854b] text-[#141821] font-bold text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Berichte suchen</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {["ALL", "Funktionen", "Datenschutz", "Kontoverwaltung", "Kosten"].map((t) => (
              <button
                key={t}
                onClick={() => setSelectedTopic(t)}
                className={`px-3.5 py-1.5 rounded-lg font-semibold border cursor-pointer ${
                  selectedTopic === t
                    ? "bg-[#E8DEC8] border-[#B8965A] text-[#141821]"
                    : "bg-white border-stone-300 text-stone-700"
                }`}
              >
                {t === "ALL" ? "Alle Themen" : t}
              </button>
            ))}
            {(searchQuery || selectedTopic !== "ALL") && (
              <button
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTopic("ALL");
                }}
                className="text-stone-600 underline ml-2"
              >
                Zurücksetzen
              </button>
            )}
          </div>
        </section>

        {/* Section 1: Aktuelle Prüfberichte (3 Cards Grid wie in Bild 7 + Beleg-Spalte aus Bild 6!) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-extrabold text-[#141821]">Aktuelle Prüfberichte</h2>
              <span className="text-xs text-stone-500">Prüfstand: 25. Oktober 2026</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredReports.map((report, idx) => (
                <article
                  key={report.slug}
                  className="rounded-2xl bg-white border border-stone-200/90 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between"
                >
                  <div>
                    <div className="h-44 w-full overflow-hidden bg-stone-200">
                      <img
                        src={REPORT_IMAGES[idx % REPORT_IMAGES.length]}
                        alt={report.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-5 space-y-2">
                      <div className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                        PRÜFBERICHT · STAND {report.lastAudited.toUpperCase()}
                      </div>
                      <h3 className="text-xl font-extrabold text-[#141821]">
                        {report.name} im Überblick
                      </h3>
                      <p className="text-xs text-stone-500 font-medium">
                        Funktionen · Datenschutz · Kontoverwaltung
                      </p>
                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                        {report.summary}
                      </p>
                    </div>
                  </div>
                  <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-stone-100">
                    <div className="text-xs text-stone-600">
                      Besucher: <strong>{report.visitorScore}/10</strong> · Anbieter: <strong>{report.providerScore}/10</strong>
                    </div>
                    <Link
                      href={`/reviews/${report.slug}`}
                      className="text-xs font-bold text-[#8C6B32] hover:underline inline-flex items-center gap-1"
                    >
                      <span>Bericht lesen</span>
                      <ArrowRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>

          {/* RIGHT EVIDENCE COLUMN FROM BILD 6 ("So ist der Bericht belegt") */}
          <aside className="lg:col-span-4 p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-5 lg:sticky lg:top-24">
            <div>
              <h3 className="text-xl font-serif font-bold text-[#141821]">So ist jeder Bericht belegt</h3>
              <p className="text-xs text-stone-500 mt-0.5">Transparente Methodik & Nachweise</p>
            </div>

            <div className="space-y-4 divide-y divide-stone-200 text-xs">
              <div className="pt-2 flex items-start gap-3">
                <FileText size={18} className="text-[#8C6B32] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#141821]">Quelle — Dokumentation des Portals</div>
                  <p className="text-stone-600 leading-relaxed">
                    Auswertung der öffentlich verfügbaren Informationen wie AGB, Datenschutzerklärung, Hilfebereich und offizieller Preislisten (Stand: 25. Oktober 2026).
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3">
                <Search size={18} className="text-[#8C6B32] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#141821]">Prüfkriterien — Funktionen & Datenschutz</div>
                  <p className="text-stone-600 leading-relaxed">
                    Systematische Prüfung der beschriebenen Suchfunktionen, Schutzmassnahmen, Kontoverwaltung und Meldewege.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3">
                <HelpCircle size={18} className="text-[#8C6B32] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#141821]">Offene Fragen — Ehrlich ausgewiesen</div>
                  <p className="text-stone-600 leading-relaxed">
                    Aspekte, die ohne internes Anbieterkonto nicht abschliessend geprüft werden können, bleiben transparent als offen markiert.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F3EFE6] border border-[#DFD5C0] flex items-center gap-2.5 text-xs font-semibold text-[#5C4722]">
              <Scale size={16} className="shrink-0" />
              <span>Aussagen bleiben nachvollziehbar. Keine käuflichen Noten.</span>
            </div>
          </aside>
        </section>

        {/* Section 2: Nach denselben Kriterien vergleichen (Exakt wie in Bild 7!) */}
        <section className="space-y-4 pt-6 border-t border-stone-300">
          <h2 className="text-2xl font-extrabold text-[#141821]">
            Nach denselben Kriterien vergleichen
          </h2>

          <div className="overflow-x-auto rounded-2xl bg-white border border-stone-200/90 shadow-sm">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600">
                  <th className="p-4">Portal</th>
                  <th className="p-4">Funktionen & Schwerpunkt</th>
                  <th className="p-4">Prüfstatus & Datenschutz</th>
                  <th className="p-4">Profilkontrolle & Kosten</th>
                  <th className="p-4">Bericht</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200">
                {SWISS_PORTAL_TOP10.map((p) => (
                  <tr key={p.slug} className="hover:bg-stone-50/80">
                    <td className="p-4 font-extrabold text-[#141821]">{p.name}</td>
                    <td className="p-4 text-stone-600">{p.bestFor}</td>
                    <td className="p-4 text-stone-600">{p.verificationStandard}</td>
                    <td className="p-4 text-stone-600">{p.avgCostForModelsChf}</td>
                    <td className="p-4">
                      <Link href={`/reviews/${p.slug}`} className="font-bold text-[#8C6B32] hover:underline">
                        Details →
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Offenlegung unseres eigenen Angebots */}
        <section className="p-6 rounded-2xl bg-white border border-stone-300 space-y-2 text-xs sm:text-sm">
          <div className="font-bold text-[#8C6B32] uppercase tracking-wider text-xs">
            Offenlegung · {OUR_PLATFORM_DISCLOSURE.name}
          </div>
          <p className="text-stone-600 leading-relaxed">{OUR_PLATFORM_DISCLOSURE.note}</p>
        </section>
      </main>
    </div>
  );
}