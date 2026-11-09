import React from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { CorporateFooter } from "@/components/CorporateFooter";
import { SWISS_PORTAL_TOP10, OUR_PLATFORM_DISCLOSURE } from "@/data/portalReviewsData";
import { FileText, Search, HelpCircle, Scale, Check, AlertTriangle, ArrowLeft, ExternalLink } from "lucide-react";

export default function SinglePortalReviewPage() {
  const router = useRouter();
  const slug = String(router.query.slug || "xdate-review");

  const report =
    SWISS_PORTAL_TOP10.find((p) => p.slug === slug) ||
    SWISS_PORTAL_TOP10[0];

  return (
    <div className="min-h-screen bg-papier text-tinte pb-20">
      <SEO
        title={`${report.name} im Überblick: Funktionen, Kosten & Datenschutz | iwantsexnow.ch`}
        description={`Sachlicher Einzelbericht zu ${report.name} (${report.domain}): Funktionen, Kostenmodell, Prüfstatus und offene Fragen im transparenten Schweizer Vergleich.`}
      />
      <LuxuryHeader />

      <PageIntro tone="minze" note="Ehrlich bewertet" art="none" title={<>{report.name} im Überblick: Was wirklich geprüft wurde.</>}
        lead={<>{report.summary}</>} />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-8 space-y-10">
        {/* Top Breadcrumb */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-[13px] text-stone-600">
          <Link href="/reviews" className="inline-flex items-center gap-1.5 font-bold text-tinte hover:underline">
            <ArrowLeft size={14} />
            <span>Zurück zur Portalvergleich-Übersicht</span>
          </Link>
          <span>Prüfstand: {report.lastAudited} · Methodik v1.0</span>
        </div>

        {/* Hero Title */}
        

        {/* Main 2-Column Layout: Left Detailed Audit | Right "So ist der Bericht belegt" (Bild 6/8) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT 8 COLUMNS: Structured Criteria & Findings */}
          <div className="lg:col-span-8 space-y-6">
            {/* Key Criteria Card */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-5">
              <h2 className="text-xl font-extrabold text-tinte">
                Geprüfte Kriterien für {report.name}
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-[13px] sm:text-sm">
                <div className="p-4 rounded-xl bg-papier border border-stone-200/80 space-y-1">
                  <div className="text-[13px] font-bold text-stone-500">1. Schwerpunkt & Zielgruppe</div>
                  <div className="font-bold text-tinte">{report.bestFor}</div>
                </div>

                <div className="p-4 rounded-xl bg-papier border border-stone-200/80 space-y-1">
                  <div className="text-[13px] font-bold text-stone-500">2. Veröffentlichtes Kostenmodell (Anbieter)</div>
                  <div className="font-bold text-tinte">{report.avgCostForModelsChf}</div>
                </div>

                <div className="p-4 rounded-xl bg-papier border border-stone-200/80 space-y-1">
                  <div className="text-[13px] font-bold text-stone-500">3. Prüf- & Verifizierungs-Standard</div>
                  <div className="font-bold text-tinte">{report.verificationStandard}</div>
                </div>

                <div className="p-4 rounded-xl bg-papier border border-stone-200/80 space-y-1">
                  <div className="text-[13px] font-bold text-stone-500">4. Kriterien-Bewertung (Redaktion)</div>
                  <div className="font-bold text-tinte">
                    Besucher-Nutzen: {report.visitorScore}/10 · Anbieter-Nutzen: {report.providerScore}/10
                  </div>
                </div>
              </div>
            </div>

            {/* Strengths & Known Limitations */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-3">
                <h3 className="text-base font-extrabold text-[#2a9d86] flex items-center gap-2">
                  <Check size={17} />
                  <span>Beobachtete Stärken</span>
                </h3>
                <ul className="space-y-2 text-[13px] sm:text-sm text-stone-700">
                  {report.pros.map((pro, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-[#2a9d86] font-bold">•</span>
                      <span>{pro}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-3">
                <h3 className="text-base font-extrabold text-kirsche-tief flex items-center gap-2">
                  <AlertTriangle size={17} />
                  <span>Einschränkungen & Kritikpunkte</span>
                </h3>
                <ul className="space-y-2 text-[13px] sm:text-sm text-stone-700">
                  {report.cons.map((con, i) => (
                    <li key={i} className="flex items-start gap-2 leading-relaxed">
                      <span className="text-kirsche-tief font-bold">•</span>
                      <span>{con}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Direct Comparison Table with Other Evaluated Portals */}
            <div className="p-6 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4">
              <h3 className="text-lg font-extrabold text-tinte">
                {report.name} im direkten Vergleich mit anderen Schweizer Portalen
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
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
                        className={other.slug === report.slug ? "bg-papier font-bold" : ""}
                      >
                        <td className="py-3 pr-3">{other.name}</td>
                        <td className="py-3 px-3 text-stone-600">{other.bestFor}</td>
                        <td className="py-3 px-3 text-stone-600">{other.avgCostForModelsChf}</td>
                        <td className="py-3 pl-3">
                          {other.slug === report.slug ? (
                            <span className="text-kirsche-tief">Aktueller Bericht</span>
                          ) : (
                            <Link href={`/reviews/${other.slug}`} className="text-kirsche-tief hover:underline font-bold">
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
              <h2 className="text-xl font-serif font-bold text-tinte">So ist der Bericht belegt</h2>
              <p className="text-[13px] text-stone-500 mt-0.5">Beispiel: {report.name}</p>
            </div>

            <div className="space-y-4 divide-y divide-stone-200 text-[13px]">
              <div className="pt-2 flex items-start gap-3">
                <FileText size={18} className="text-kirsche-tief shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-tinte">Quelle — Dokumentation des Portals</div>
                  <p className="text-stone-600 leading-relaxed">
                    Auswertung der öffentlich verfügbaren Informationen von <strong>{report.domain}</strong> wie AGB, Datenschutzerklärung, Hilfebereich und Preisübersichten (Stand: {report.lastAudited}).
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3">
                <Search size={18} className="text-kirsche-tief shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-tinte">Prüfkriterien — Funktionen und Datenschutz</div>
                  <p className="text-stone-600 leading-relaxed">
                    Systematische Prüfung der beschriebenen Suchfunktionen, Filter, Kennzeichnungen, Kontoverwaltung und Meldewege.
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-start gap-3">
                <HelpCircle size={18} className="text-kirsche-tief shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="font-bold text-tinte">Offene Fragen — Noch nicht abschliessend beurteilt</div>
                  <p className="text-stone-600 leading-relaxed">
                    Interne Moderationsprozesse, tatsächliche Reaktionszeiten des Supports und nicht-öffentliche Preisstaffeln nach Login konnten ohne verdeckten Testkauf nicht abschliessend geprüft werden.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-papier border border-linie flex items-center gap-2.5 text-[13px] font-semibold text-kirsche-tief">
              <Scale size={16} className="shrink-0" />
              <span>Aussagen bleiben nachvollziehbar.</span>
            </div>

            <div className="pt-2 border-t border-stone-200 space-y-2 text-[13px]">
              <div className="font-bold text-stone-700">Offenlegung ({OUR_PLATFORM_DISCLOSURE.name}):</div>
              <p className="text-stone-500 leading-relaxed">{OUR_PLATFORM_DISCLOSURE.note}</p>
            </div>
          </aside>
        </div>
      </main>
      <CorporateFooter light />
    </div>
  );
}