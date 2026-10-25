import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SWISS_PORTAL_TOP10, OUR_PLATFORM_DISCLOSURE } from "@/data/portalReviewsData";
import { FileText, Search, HelpCircle, Scale, Check, AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";

export default function SinglePortalReviewPage() {
  const router = useRouter();
  const slug = String(router.query.slug || "xdate-review");

  const report =
    SWISS_PORTAL_TOP10.find((p) => p.slug === slug) ||
    SWISS_PORTAL_TOP10[0];

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#141821] pb-20">
      <SEO
        title={`${report.name} im Überblick: Funktionen, Kosten & Datenschutz | iwantsexnow.ch`}
        description={`Sachlicher Einzelbericht zu ${report.name} (${report.domain}): Funktionen, Kostenmodell, Prüfstatus und offene Fragen im transparenten Schweizer Vergleich.`}
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-8 space-y-10">
        {/* Top Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
          <Link href="/reviews" className="inline-flex items-center gap-1.5 font-bold text-[#141821] hover:underline">
            <ArrowLeft size={14} />
            <span>Zurück zur Portalvergleich-Übersicht</span>
          </Link>
          <span>Prüfstand: {report.lastAudited} · Methodik v1.0</span>
        </div>

        {/* Hero Title */}
        <section className="space-y-3 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8DEC8] text-[#5C4722] text-[11px] font-bold uppercase tracking-wider">
            <span>EINZELBERICHT · SCHWEIZER PORTALVERGLEICH</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#141821] tracking-tight">
            {report.name} im Überblick: Was wirklich geprüft wurde.
          </h1>
          <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
            {report.summary}
          </p>
        </section>

        {/* Main 2-Column Layout: Left Detailed Audit | Right "So ist der Bericht belegt" (Bild 6/8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS: Structured Criteria & Findings */}
          <div className="lg:col-span-8 space-y-6">
            {/* Key Criteria Card */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-5">
              <h2 className="text-xl font-extrabold text-[#141821]">
                Geprüfte Kriterien für {report.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
                <div className="p-4 rounded-xl bg-[#F6F5F1] border border-stone-200/80 space-y-1">
                  <div className="text-[11px] font-bold uppercase text-stone-500">1. Schwerpunkt & Zielgruppe</div>
                  <div className="font-bold text-[#141821]">{report.bestFor}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F5F1] border border-stone-200/80 space-y-1">
                  <div className="text-[11px] font-bold uppercase text-stone-500">2. Veröffentlichtes Kostenmodell (Anbieter)</div>
                  <div className="font-bold text-[#141821]">{report.avgCostForModelsChf}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F5F1] border border-stone-200/80 space-y-1">
                  <div className="text-[11px] font-bold uppercase text-stone-500">3. Prüf- & Verifizierungs-Standard</div>
                  <div className="font-bold text-[#141821]">{report.verificationStandard}</div>
                </div>

                <div className="p-4 rounded-xl bg-[#F6F5F1] border border-stone-200/80 space-y-1">
                  <div className="text-[11px] font-bold uppercase text-stone-500">4. Kriterien-Bewertung (Redaktion)</div>
                  <div className="font-bold text-[#141821]">
                    Besucher-Nutzen: {report.visitorScore}/10 · Anbieter-Nutzen: {report.providerScore}/10
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Known Limitations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-3">
                <h3 className="text-base font-extrabold text-[#146C32] flex items-center gap-2">
                  <Check size={17} />
                  <span>Beobachtete Stärken</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {report.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#146C32] font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-3">
                <h3 className="text-base font-extrabold text-[#9A3412] flex items-center gap-2">
                  <AlertTriangle size={17} />
                  <span>Einschränkungen & Kritikpunkte</span>
                </h3>
                <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
                  {report.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#9A3412] font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direct Comparison Table with Other Evaluated Portals */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-[#141821]">
                {report.name} im direkten Vergleich mit anderen Schweizer Portalen
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-500">
                      <th className="py-2.5 pr-3">Portal</th>
                      <th className="py-2.5 px-3">Schwerpunkt</th>
                      <th className="py-2.5 px-3">Kostenmodell (Anbieter)</th>
                      <th className="py-2.5 pl-3">Bericht</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-200">
                    {SWISS_PORTAL_TOP10.map((other) => (
                      <tr
                        key={other.slug}
                        className={other.slug === report.slug ? "bg-[#F3EFE6] font-bold" : ""}
                      >
                        <td className="py-3 pr-3">{other.name}</td>
                        <td className="py-3 px-3 text-stone-600">{other.bestFor}</td>
                        <td className="py-3 px-3 text-stone-600">{other.avgCostForModelsChf}</td>
                        <td className="py-3 pl-3">
                          {other.slug === report.slug ? (
                            <span className="text-[#8C6B32]">Aktueller Bericht</span>
                          ) : (
                            <Link href={`/reviews/${other.slug}`} className="text-[#8C6B32] hover:underline font-bold">
                              Vergleichen →
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* RIGHT 4 COLUMNS: "So ist der Bericht belegt" (Exakt nach Bild 6 / Bild 8!) */}
          <aside className="lg:col-span-4 p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-5 lg:sticky lg:top-24">
            <div>
              <h2 className="text-xl font-serif font-bold text-[#141821]">So ist der Bericht belegt</h2>
              <p className="text-xs text-stone-500 mt-0.5">Beispiel: {report.name}</p>
            </div>

            <div className="space-y-4 divide-y divide-stone-200 text-xs">
              <div className="pt-2 flex items-start gap-3">
                <FileText size={18} className="text-[#8C6B32] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#141821]">Quelle — Dokumentation des Portals</div>
                  <p className="text-stone-600 leading-relaxed">
                    Auswertung der öffentlich verfügbaren Informationen von <strong>{report.domain}</strong> wie AGB, Datenschutzerklärung, Hilfebereich und Preisübersichten (Stand: {report.lastAudited}).
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3">
                <Search size={18} className="text-[#8C6B32] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#141821]">Prüfkriterien — Funktionen und Datenschutz</div>
                  <p className="text-stone-600 leading-relaxed">
                    Systematische Prüfung der beschriebenen Suchfunktionen, Filter, Kennzeichnungen, Kontoverwaltung und Meldewege.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3">
                <HelpCircle size={18} className="text-[#8C6B32] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-[#141821]">Offene Fragen — Noch nicht abschliessend beurteilt</div>
                  <p className="text-stone-600 leading-relaxed">
                    Interne Moderationsprozesse, tatsächliche Reaktionszeiten des Supports und nicht-öffentliche Preisstaffeln nach Login konnten ohne verdeckten Testkauf nicht abschliessend geprüft werden.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F3EFE6] border border-[#DFD5C0] flex items-center gap-2.5 text-xs font-semibold text-[#5C4722]">
              <Scale size={16} className="shrink-0" />
              <span>Aussagen bleiben nachvollziehbar.</span>
            </div>

            <div className="pt-2 border-t border-stone-200 space-y-2 text-xs">
              <div className="font-bold text-stone-700">Offenlegung ({OUR_PLATFORM_DISCLOSURE.name}):</div>
              <p className="text-stone-500 leading-relaxed">{OUR_PLATFORM_DISCLOSURE.note}</p>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}