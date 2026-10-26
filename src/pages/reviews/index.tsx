import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import { SWISS_PORTAL_TOP10, OUR_PLATFORM_DISCLOSURE } from "@/data/portalReviewsData";
import { Search, FileText, Scale, HelpCircle, Check, ArrowRight } from "lucide-react";

export default function SwissPortalComparisonHubPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<"Alle" | "Funktionen" | "Datenschutz" | "Kontoverwaltung">("Alle");
  const [selectedSlugs, setSelectedSlugs] = useState<string[]>(["xdate-review", "fgirl-review"]);

  const filteredReports = useMemo(() => {
    return SWISS_PORTAL_TOP10.filter((rep) => {
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase().trim();
      return (rep.name + " " + rep.domain + " " + rep.bestFor + " " + rep.summary).toLowerCase().includes(q);
    });
  }, [searchQuery]);

  const toggleSelect = (slug: string) => {
    setSelectedSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev.slice(-2), slug]
    );
  };

  const comparedPortals = useMemo(() => {
    return SWISS_PORTAL_TOP10.filter((p) => selectedSlugs.includes(p.slug));
  }, [selectedSlugs]);

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#181614] overflow-x-hidden">
      <SEO
        title="Schweizer Portale. Klar verglichen. | iwantsexnow.ch"
        description="Funktionen, Datenschutz, Kostenmodell und Profilkontrolle der führenden Schweizer Erotik- und Escort-Portale nach denselben Kriterien verglichen."
      />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 pt-8 pb-12 space-y-10">
        {/* Hero Headline (Exakt nach Bild 9 & Bild 8: "Schweizer Portale. Klar verglichen.") */}
        <section className="space-y-2 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8DEC8] text-[#5C4722] text-[11px] font-bold uppercase tracking-wider">
            <span>SCHWEIZER PORTALVERGLEICH · PRÜFSTAND OKTOBER 2026</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#181614] tracking-tight">
            Schweizer Portale. Klar verglichen.
          </h1>
          <p className="text-sm sm:text-lg text-[#5C554B]">
            Funktionen, Datenschutz und Profilkontrolle verständlich erklärt – mit offengelegten Quellen und Prüfkriterien.
          </p>
        </section>

        {/* Search & Filter Row */}
        <section className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 flex items-center bg-white border border-[#D5CBB8] rounded-xl px-4 py-3 shadow-xs">
              <Search size={17} className="text-[#8A642B] shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Portal oder Thema suchen (z.B. xdate, fgirl, and6, Kosten, Datenschutz)..."
                className="w-full px-3 bg-transparent text-xs sm:text-sm text-[#181614] focus:outline-none"
              />
            </div>
            <button
              type="button"
              onClick={() => {}}
              className="px-6 py-3 rounded-xl bg-[#C6A574] hover:bg-[#b89562] text-[#181614] font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <span>Berichte suchen</span>
              <ArrowRight size={15} />
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[#6E665B] font-semibold mr-1">Fokus-Kriterium:</span>
            {(["Alle", "Funktionen", "Datenschutz", "Kontoverwaltung"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setSelectedTopic(t)}
                className={
                  selectedTopic === t
                    ? "px-3.5 py-1.5 rounded-lg bg-[#9E7B47] text-white font-bold cursor-pointer"
                    : "px-3.5 py-1.5 rounded-lg bg-white border border-[#D5CBB8] text-[#3D372E] font-semibold cursor-pointer hover:bg-[#F3EFE8]"
                }
              >
                {t}
              </button>
            ))}
            {(searchQuery || selectedTopic !== "Alle") && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedTopic("Alle");
                }}
                className="text-xs text-[#8A642B] underline ml-2 cursor-pointer"
              >
                Zurücksetzen
              </button>
            )}
          </div>
        </section>

        {/* Main 2-Column Layout: Left Reports | Right "So ist der Bericht belegt" (Bild 8!) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          <div className="lg:col-span-8 space-y-4">
            <h2 className="text-2xl font-serif font-bold text-[#181614]">
              Aktuelle Prüfberichte ({filteredReports.length})
            </h2>

            <div className="divide-y divide-[#E6DFD3] bg-white rounded-2xl border border-[#E6DFD3] shadow-xs overflow-hidden">
              {filteredReports.map((rep) => {
                const isSelected = selectedSlugs.includes(rep.slug);
                return (
                  <article
                    key={rep.slug}
                    className={
                      isSelected
                        ? "p-5 sm:p-6 bg-[#F6F0E4] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                        : "p-5 sm:p-6 bg-white hover:bg-[#FAF7F2] transition flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    }
                  >
                    <div className="space-y-1.5 max-w-xl">
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-[#E8DEC8] text-[#5C4722] text-[10px] font-bold uppercase tracking-wider">
                          Prüfbericht · {rep.domain}
                        </span>
                        <span className="text-xs text-[#6E665B]">Stand: {rep.lastAudited}</span>
                      </div>
                      <h3 className="text-lg sm:text-xl font-serif font-bold text-[#181614]">
                        <Link href={"/reviews/" + rep.slug} className="hover:underline">
                          {rep.name} im Überblick
                        </Link>
                      </h3>
                      <p className="text-xs text-[#5C554B] leading-relaxed">{rep.summary}</p>
                      <div className="text-[11px] font-semibold text-[#8A642B] pt-0.5">
                        Funktionen · Datenschutz · Kontoverwaltung · Kosten: {rep.avgCostForModelsChf}
                      </div>
                    </div>

                    <div className="flex sm:flex-col items-end justify-between gap-3 shrink-0">
                      <button
                        type="button"
                        onClick={() => toggleSelect(rep.slug)}
                        className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer"
                      >
                        <span
                          className={
                            isSelected
                              ? "w-5 h-5 rounded flex items-center justify-center bg-[#9E7B47] text-white"
                              : "w-5 h-5 rounded border border-[#9C9283] bg-white"
                          }
                        >
                          {isSelected && <Check size={13} strokeWidth={3} />}
                        </span>
                        <span>Vergleichen</span>
                      </button>

                      <Link
                        href={"/reviews/" + rep.slug}
                        className="text-xs sm:text-sm font-bold text-[#7A5824] hover:underline inline-flex items-center gap-1"
                      >
                        <span>Bericht lesen</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>

          {/* Right Column: "So ist der Bericht belegt" (Exakt wie in Bild 8!) */}
          <aside className="lg:col-span-4 p-6 rounded-2xl bg-white border border-[#E6DFD3] shadow-xs space-y-5 lg:sticky lg:top-24">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#181614]">So ist der Bericht belegt</h2>
              <p className="text-xs text-[#6E665B] mt-0.5">Nachvollziehbare Methodik für alle 6 Portale</p>
            </div>

            <div className="space-y-4 divide-y divide-[#E6DFD3] text-xs">
              <div className="pt-2 flex items-start gap-3">
                <FileText size={18} className="text-[#8A642B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#181614]">Quelle — Dokumentation des Portals</div>
                  <p className="text-[#5C554B] leading-relaxed">
                    Auswertung der öffentlich verfügbaren Informationen wie AGB, Datenschutzerklärung, Hilfebereich und Preislisten (Stand: Oktober 2026).
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3">
                <Search size={18} className="text-[#8A642B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#181614]">Prüfkriterien — Funktionen und Datenschutz</div>
                  <p className="text-[#5C554B] leading-relaxed">
                    Systematische Prüfung der beschriebenen Funktionen, Datenschutzmassnahmen, Kontoverwaltung und relevanten Einstellungen.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3">
                <HelpCircle size={18} className="text-[#8A642B] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#181614]">Offene Fragen — Noch nicht abschliessend beurteilt</div>
                  <p className="text-[#5C554B] leading-relaxed">
                    Einzelne Aspekte (wie nicht-öffentliche Rabattstaffeln oder interne Reaktionszeiten) werden offen als nicht abschliessend geprüft ausgewiesen.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F6F0E4] border border-[#E6DFD3] flex items-center gap-2.5 text-xs font-semibold text-[#5C4722]">
              <Scale size={16} className="shrink-0" />
              <span>Aussagen bleiben nachvollziehbar.</span>
            </div>

            <div className="pt-2 border-t border-[#E6DFD3] text-[11px] text-[#6E665B] leading-relaxed">
              <strong>Transparenz-Hinweis:</strong> {OUR_PLATFORM_DISCLOSURE.note}
            </div>
          </aside>
        </section>

        {/* Side-by-Side Comparison Matrix ("Nach denselben Kriterien vergleichen" aus Bild 9!) */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD3] shadow-xs space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#181614]">
            Nach denselben Kriterien vergleichen
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E6DFD3] text-[#6E665B] bg-[#FAF7F2]">
                  <th className="p-3.5">Portal</th>
                  <th className="p-3.5">Schwerpunkt & Funktionen</th>
                  <th className="p-3.5">Verifizierung & Datenschutz</th>
                  <th className="p-3.5">Kostenmodell & Kontrolle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3]">
                {(comparedPortals.length > 0 ? comparedPortals : SWISS_PORTAL_TOP10).map((p) => (
                  <tr key={p.slug} className="hover:bg-[#FAF7F2]">
                    <td className="p-3.5 font-serif font-bold text-base text-[#181614]">
                      <Link href={"/reviews/" + p.slug} className="hover:underline">
                        {p.name}
                      </Link>
                    </td>
                    <td className="p-3.5 text-[#3D372E]">{p.bestFor}</td>
                    <td className="p-3.5 text-[#3D372E]">{p.verificationStandard}</td>
                    <td className="p-3.5 font-semibold text-[#7A5824]">{p.avgCostForModelsChf}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <CorporateFooter light />
    </div>
  );
}
