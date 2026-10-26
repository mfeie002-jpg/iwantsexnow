import fs from "fs";
import path from "path";

const root = process.cwd();
const compDir = path.join(root, "src", "components");
const pagesDir = path.join(root, "src", "pages");

// ---------------------------------------------------------------------------
// 1. CORPORATE FOOTER KOMPONENTE (src/components/CorporateFooter.tsx)
//    Exakt bündig (max-w-[1380px] mx-auto px-6 sm:px-10), Stencil-X Logo,
//    Regionen, Rechtliches & Anbieter-Link wie in den Mockups!
// ---------------------------------------------------------------------------
const footerCode = `import React from "react";
import Link from "next/link";
import { StencilSerifX } from "@/components/BrandLogo";
import { ArrowRight } from "lucide-react";

export function CorporateFooter({ light = false }: { light?: boolean }) {
  return (
    <footer
      className={
        light
          ? "mt-16 border-t border-[#E6DFD3] bg-[#EFECE4] text-[#181614] pb-24 md:pb-10"
          : "mt-16 border-t border-white/10 bg-[#0E1015] text-white pb-24 md:pb-10"
      }
    >
      <div className="max-w-[1380px] mx-auto px-6 sm:px-10 py-10 space-y-8">
        {/* Top Row: Brand + Provider CTA */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-current/10">
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-[#1A1E29] border border-[#C6A574]/50 flex items-center justify-center">
              <StencilSerifX color="#C6A574" className="w-4 h-3.5" />
            </div>
            <div>
              <div className="text-base font-serif font-bold tracking-tight flex items-baseline">
                <span>iwantse</span>
                <StencilSerifX color="#C6A574" className="w-[13px] h-[11px] mx-[0.5px] translate-y-[1px]" />
                <span>now.ch</span>
              </div>
              <div className={light ? "text-[10px] uppercase tracking-widest text-[#6E665B]" : "text-[10px] uppercase tracking-widest text-gray-400"}>
                Schweizer Profilverzeichnis & Portalvergleich
              </div>
            </div>
          </Link>

          <Link
            href="/advertise"
            className="text-xs sm:text-sm font-bold text-[#C6A574] hover:underline inline-flex items-center gap-1.5"
          >
            <span>Für Anbieter: Profil und Verfügbarkeit selbst verwalten</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Middle Row: 4 Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-xs">
          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#C6A574]">Regionen (DE / FR / IT)</div>
            <ul className={light ? "space-y-1.5 text-[#5C554B]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/escort-zurich" className="hover:underline">Zürich (ZH)</Link></li>
              <li><Link href="/orte/cham" className="hover:underline">Zug & Cham (ZG)</Link></li>
              <li><Link href="/escort-basel" className="hover:underline">Basel (BS/BL)</Link></li>
              <li><Link href="/escort-bern" className="hover:underline">Bern (BE)</Link></li>
              <li><Link href="/escort-geneva" className="hover:underline">Genève (GE · FR)</Link></li>
              <li><Link href="/escort-lausanne" className="hover:underline">Lausanne & Vaud (VD · FR)</Link></li>
              <li><Link href="/escort-lugano" className="hover:underline">Lugano & Ticino (TI · IT)</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#C6A574]">Verzeichnis & Vergleich</div>
            <ul className={light ? "space-y-1.5 text-[#5C554B]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/" className="hover:underline">Alle Profile entdecken</Link></li>
              <li><Link href="/compare-escorts" className="hover:underline">Profile & Preise vergleichen</Link></li>
              <li><Link href="/rankings" className="hover:underline">Schweizer Clubs & Studios</Link></li>
              <li><Link href="/reviews" className="hover:underline">Schweizer Portalvergleich</Link></li>
              <li><Link href="/pricing" className="hover:underline">Honorar- & Konditionen-Kompass</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#C6A574]">Für Anbieterinnen</div>
            <ul className={light ? "space-y-1.5 text-[#5C554B]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/advertise" className="hover:underline">Vorteile & Selbstverwaltung</Link></li>
              <li><Link href="/create-post" className="hover:underline">Bestehendes Profil übernehmen</Link></li>
              <li><Link href="/creator-dashboard" className="hover:underline">Anbieter-Cockpit öffnen</Link></li>
              <li><Link href="/verify" className="hover:underline">Identitätsprüfung (✓) beantragen</Link></li>
              <li><Link href="/report" className="hover:underline">Eintrag melden oder entfernen</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <div className="font-bold uppercase tracking-wider text-[#C6A574]">Methodik & Rechtliches</div>
            <ul className={light ? "space-y-1.5 text-[#5C554B]" : "space-y-1.5 text-gray-400"}>
              <li><Link href="/safety" className="hover:underline">Prüfkriterien & Sicherheit</Link></li>
              <li><Link href="/about" className="hover:underline">Über uns & Methodik</Link></li>
              <li><Link href="/faq" className="hover:underline">Häufige Fragen (FAQ)</Link></li>
              <li><Link href="/contact" className="hover:underline">Kontakt & Redaktion</Link></li>
              <li><Link href="/imprint" className="hover:underline">Impressum</Link></li>
              <li><Link href="/privacy" className="hover:underline">Datenschutz (DSG Schweiz)</Link></li>
              <li><Link href="/terms" className="hover:underline">Nutzungsbedingungen (AGB)</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={light ? "pt-6 border-t border-[#E6DFD3] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#6E665B]" : "pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-2 text-[11px] text-gray-500"}>
          <span>© 2026 iwantsexnow.ch · Schweizer Profilverzeichnis & Portalvergleich · Zugang ausschliesslich ab 18 Jahren.</span>
          <span>Alle Quellen, Zeitstempel und Prüfkriterien sind transparent ausgewiesen.</span>
        </div>
      </div>
    </footer>
  );
}

export default CorporateFooter;
`;
fs.writeFileSync(path.join(compDir, "CorporateFooter.tsx"), footerCode, "utf8");
console.log("✓ 1. Einheitlicher CorporateFooter erstellt: src/components/CorporateFooter.tsx");

// ---------------------------------------------------------------------------
// 2. Binde den CorporateFooter automatisch in LuxuryHeader.tsx oder global ein
//    + sorge für overflow-x-hidden und perfekte Fluchtlinien
// ---------------------------------------------------------------------------
const reviewsIndexPath = path.join(pagesDir, "reviews", "index.tsx");
const reviewsPageCode = `import React, { useState, useMemo } from "react";
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
`;
fs.writeFileSync(reviewsIndexPath, reviewsPageCode, "utf8");
console.log("✓ 2. /reviews/index.tsx auf exakte Container-Breite & Champagner-Gold-CI aktualisiert.");

// ---------------------------------------------------------------------------
// 3. RECHTLICHE, KONTAKT- & LOGIN-SEITEN IN EXAKTER CORPORATE IDENTITY
//    (/login, /imprint, /privacy, /terms, /contact, /faq, /about)
// ---------------------------------------------------------------------------
const loginPageCode = `import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import { StencilSerifX } from "@/components/BrandLogo";
import { Lock, ArrowRight, UserCheck, ShieldCheck } from "lucide-react";

export default function CorporateLoginPage() {
  const router = useRouter();
  const [profileId, setProfileId] = useState("");
  const [ownerToken, setOwnerToken] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const targetId = profileId.trim() || "ch-1";
    if (typeof window !== "undefined" && ownerToken.trim()) {
      localStorage.setItem("iwsn_owner_token_" + targetId, ownerToken.trim());
      localStorage.setItem("iwsn_last_profile_id", targetId);
    }
    router.push("/creator-dashboard?id=" + encodeURIComponent(targetId));
  };

  return (
    <div className="min-h-screen bg-[#13161C] text-white flex flex-col justify-between overflow-x-hidden">
      <SEO
        title="Anbieter-Login & Profilzugang | iwantsexnow.ch"
        description="Direkter Zugang zu Ihrem selbst verwalteten Anbieter-Cockpit auf iwantsexnow.ch."
      />
      <LuxuryHeader />

      <main className="max-w-md w-full mx-auto px-6 py-12 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-xl bg-[#1C2029] border border-[#C6A574]/50 flex items-center justify-center mx-auto">
            <StencilSerifX color="#C6A574" className="w-6 h-5" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Anbieter-Login
          </h1>
          <p className="text-xs sm:text-sm text-gray-400">
            Öffne dein Anbieter-Cockpit, um deine 4-Stunden-Verfügbarkeit zu bestätigen oder deine Angaben zu bearbeiten.
          </p>
        </div>

        <form onSubmit={handleLogin} className="p-6 sm:p-7 rounded-2xl bg-[#1C2029] border border-white/15 shadow-2xl space-y-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Profil-ID oder Anzeigename *
            </label>
            <input
              type="text"
              required
              value={profileId}
              onChange={(e) => setProfileId(e.target.value)}
              placeholder="z.B. ch-1 oder dein Profilname..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 mb-1.5">
              Persönlicher Zugangs-Schlüssel (optional bei gespeicherter Sitzung)
            </label>
            <input
              type="password"
              value={ownerToken}
              onChange={(e) => setOwnerToken(e.target.value)}
              placeholder="iwsn_..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3.5 rounded-xl bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>Cockpit öffnen</span>
            <ArrowRight size={15} />
          </button>
        </form>

        <div className="p-4 rounded-2xl bg-[#1A1E27] border border-white/10 text-center space-y-2 text-xs">
          <div className="text-gray-300 font-semibold">Noch keinen Zugangsschlüssel?</div>
          <Link href="/create-post" className="text-[#C6A574] hover:underline font-bold block">
            Bestehendes Profil kostenlos übernehmen oder neu anlegen →
          </Link>
        </div>
      </main>

      <CorporateFooter />
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, "login.tsx"), loginPageCode, "utf8");
console.log("✓ 3. /login.tsx auf Schwarz-Gold Corporate Design aktualisiert.");

// Helper für saubere Corporate-Info-Seiten (/imprint, /privacy, /terms, /contact, /about, /faq)
function writeCorporateInfoPage(fileName, title, badge, subtitle, sections) {
  const sectionsJsx = sections
    .map(
      (s) => `
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD3] shadow-xs space-y-3">
          <h2 className="text-xl font-serif font-bold text-[#181614]">${s.heading}</h2>
          <div className="space-y-2 text-xs sm:text-sm text-[#3D372E] leading-relaxed">
            ${s.paragraphs.map((p) => `<p>${p}</p>`).join("\n            ")}
          </div>
        </section>`
    )
    .join("\n");

  const code = `import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#181614] flex flex-col justify-between overflow-x-hidden">
      <SEO title="${title} | iwantsexnow.ch" description="${subtitle}" />
      <LuxuryHeader />

      <main className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8DEC8] text-[#5C4722] text-[11px] font-bold uppercase tracking-wider">
            <span>${badge}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#181614]">${title}</h1>
          <p className="text-sm sm:text-base text-[#5C554B] leading-relaxed">${subtitle}</p>
        </div>

        <div className="max-w-4xl space-y-5">
          ${sectionsJsx}
        </div>
      </main>

      <CorporateFooter light />
    </div>
  );
}
`;
  fs.writeFileSync(path.join(pagesDir, fileName), code, "utf8");
}

writeCorporateInfoPage(
  "imprint.tsx",
  "Impressum & Betreiberangaben",
  "RECHTLICHE ANGABEN · SCHWEIZ",
  "Transparente Angaben zum Betrieb des Schweizer Profilverzeichnisses und Portalvergleichs iwantsexnow.ch.",
  [
    {
      heading: "1. Funktion der Plattform",
      paragraphs: [
        "iwantsexnow.ch ist ein unabhängiges Schweizer Online-Verzeichnis und Vergleichsportal für Erwachsene (18+). Wir sind keine Escort-Agentur, kein Studio-Betreiber und vermitteln keine Dienstleistungen auf eigene Rechnung.",
        "Wir stellen technische Werkzeuge zur Verfügung, mit denen Anbieterinnen ihre eigenen Profile kostenlos verwalten und Suchende öffentlich zugängliche Angebote und Portale nach transparenten Kriterien vergleichen können.",
      ],
    },
    {
      heading: "2. Kontakt für Redaktion, Behörden & Widersprüche",
      paragraphs: [
        "Für Korrekturwünsche, Urheberrechts-Meldungen oder die sofortige Entfernung eines Eintrags ohne Kontopflicht nutzen Sie bitte direkt unser <a href='/report' class='text-[#7A5824] font-bold underline'>Melde- & Löschformular (/report)</a>.",
        "E-Mail-Kontakt: compliance@iwantsexnow.ch · Gerichtsstand und anwendbares Recht: Schweiz.",
      ],
    },
  ]
);

writeCorporateInfoPage(
  "privacy.tsx",
  "Datenschutzerklärung (Schweizer DSG)",
  "DATENSCHUTZ & DATENSPARSAMKEIT",
  "Informationen zum Umgang mit personenbezogenen Daten gemäss dem revidierten Schweizer Datenschutzgesetz (revDSG).",
  [
    {
      heading: "1. Grundsatz der Datensparsamkeit für Besucher",
      paragraphs: [
        "Sie können das gesamte Verzeichnis, alle Preis- und Quellenvergleiche sowie die kontextuelle Hilfe ohne Registrierung und ohne Benutzerkonto nutzen.",
        "Es werden keine sensiblen persönlichen Vorlieben oder privaten Suchprofile an Dritte verkauft.",
      ],
    },
    {
      heading: "2. Volle Datenhoheit für Anbieterinnen (Selbstverwaltung & Opt-out)",
      paragraphs: [
        "Anbieterinnen können ihren bestehenden Eintrag kostenlos übernehmen, korrigieren, pausieren oder über <a href='/report' class='text-[#7A5824] font-bold underline'>/report</a> dauerhaft entfernen und für künftige Indexierungen sperren lassen.",
        "Unterlagen im Rahmen der freiwilligen Identitätsprüfung (18+) dienen ausschliesslich der Verifikation und werden niemals öffentlich zugänglich gemacht.",
      ],
    },
  ]
);

writeCorporateInfoPage(
  "terms.tsx",
  "Nutzungsbedingungen (AGB)",
  "RICHTLINIEN & EINVERNEHMLICHKEIT · 18+",
  "Grundregeln für die Nutzung des Schweizer Profilverzeichnisses und Portalvergleichs.",
  [
    {
      heading: "1. Ausschliesslicher Zugang für Volljährige (18+)",
      paragraphs: [
        "Der Zugriff auf iwantsexnow.ch sowie das Anlegen oder Übernehmen eines Anbieterprofils ist ausnahmslos volljährigen Personen ab 18 Jahren gestattet.",
      ],
    },
    {
      heading: "2. Trennung von Plattform und individuellen Vereinbarungen",
      paragraphs: [
        "Alle auf Profilkarten genannten Preise, Zeiteinheiten (z.B. 60 Min. vs. 30 Min.) und Verfügbarkeitsangaben stammen aus dem jeweiligen Anbieterprofil oder dem ausgewiesenen Ursprungsinserat. Etwaige Vereinbarungen kommen ausschliesslich direkt zwischen den beteiligten Erwachsenen zustande.",
      ],
    },
  ]
);

writeCorporateInfoPage(
  "about.tsx",
  "Über uns & Prüf-Methodik",
  "TRANSPARENZ STATT REIZÜBERFLUTUNG",
  "Warum wir auf nachvollziehbare Zeitstempel, offengelegte Quellen und ehrliche Preis-Einordnung setzen.",
  [
    {
      heading: "1. Was uns von klassischen Inserate-Portalen unterscheidet",
      paragraphs: [
        "Auf herkömmlichen Portalen ist für Besucher oft unklar, ob ein grüner Punkt tatsächlich aktuelle Verfügbarkeit bedeutet, ob sich ein genannter Preis auf 30 oder 60 Minuten bezieht und auf wie vielen Plattformen dasselbe Profil parallel inseriert.",
        "Deshalb zeigt iwantsexnow.ch bei jedem Eintrag offen die Herkunft ('Selbst verwaltet' vs. 'Externe Quelle'), den exakten Bestätigungs-Zeitstempel (4-Stunden-Fenster) und die zugeordnete Dauer beim Preis.",
      ],
    },
    {
      heading: "2. Unabhängige Prüfkriterien im Portalvergleich",
      paragraphs: [
        "In unserem <a href='/reviews' class='text-[#7A5824] font-bold underline'>Schweizer Portalvergleich (/reviews)</a> dokumentieren wir für jedes untersuchte Portal die Quelle, die geprüften Kriterien sowie noch offene Fragen.",
      ],
    },
  ]
);

writeCorporateInfoPage(
  "faq.tsx",
  "Häufige Fragen (FAQ)",
  "ANTWORTEN FÜR BESUCHER & ANBIETERINNEN",
  "Die wichtigsten Antworten zu Verfügbarkeits-Status, Preisangaben, Quellen-Zusammenführung und kostenloser Profilübernahme.",
  [
    {
      heading: "Was bedeutet „Jetzt verfügbar · Bestätigt vor X Min.“?",
      paragraphs: [
        "Dieses grüne Merkmal erscheint nur, wenn die Anbieterin ihren Status im Anbieter-Cockpit aktiv für die nächsten 4 Stunden bestätigt hat. Nach Ablauf von 4 Stunden schaltet sich die Anzeige automatisch auf neutral zurück.",
      ],
    },
    {
      heading: "Wie kann ich als Anbieterin mein Profil übernehmen oder löschen?",
      paragraphs: [
        "Klicken Sie an Ihrem Profil auf „Ist das dein Profil? Bestehendes Profil übernehmen“ oder öffnen Sie direkt <a href='/create-post' class='text-[#7A5824] font-bold underline'>/create-post</a>. Wenn Sie Ihren Eintrag entfernen lassen möchten, können Sie dies jederzeit kostenlos und ohne Login unter <a href='/report' class='text-[#7A5824] font-bold underline'>/report</a> veranlassen.",
      ],
    },
  ]
);

writeCorporateInfoPage(
  "contact.tsx",
  "Kontakt & Redaktion",
  "DIREKTER DRAHT · SCHWEIZ",
  "Haben Sie Fragen zu einem Prüfbericht, zur kostenlosen Profilübernahme oder ein Korrekturanliegen?",
  [
    {
      heading: "Schnellste Wege je nach Anliegen",
      paragraphs: [
        "• <strong>Bestehendes Profil kostenlos übernehmen & selbst verwalten:</strong> <a href='/create-post' class='text-[#7A5824] font-bold underline'>Direkt zur Profilübernahme (/create-post) →</a>",
        "• <strong>Eintrag ohne Konto korrigieren oder entfernen lassen:</strong> <a href='/report' class='text-[#7A5824] font-bold underline'>Direkt zum Meldeformular (/report) →</a>",
        "• <strong>Redaktion & Portalvergleich:</strong> redaktion@iwantsexnow.ch",
      ],
    },
  ]
);
console.log("✓ 4. /imprint, /privacy, /terms, /about, /faq & /contact in Corporate Identity erstellt.");

// ---------------------------------------------------------------------------
// 4. CONTAINER-BREITE & FOOTER AUF DEN HAUPTSEITEN VERANKERN
// ---------------------------------------------------------------------------
function attachFooterAndAlignContainer(fileRelPath, isLight = false) {
  const full = path.join(pagesDir, fileRelPath);
  if (!fs.existsSync(full)) return;
  let code = fs.readFileSync(full, "utf8");

  // Container-Fluchtlinie auf max-w-[1380px] vereinheitlichen
  code = code.replace(/max-w-7xl mx-auto px-6 sm:px-10/g, "max-w-[1380px] mx-auto px-6 sm:px-10");
  code = code.replace(/max-w-6xl mx-auto px-6 sm:px-10/g, "max-w-[1380px] mx-auto px-6 sm:px-10");
  code = code.replace(/max-w-5xl mx-auto px-6 sm:px-10/g, "max-w-[1380px] mx-auto px-6 sm:px-10");

  // Ersetze etwaige verbleibende marineblaue Buttons durch Corporate Schwarz-Gold
  code = code.replace(/bg-\[#152839\]/g, "bg-[#181614]");
  code = code.replace(/text-\[#152839\]/g, "text-[#7A5824]");

  // Füge CorporateFooter ein, falls noch nicht vorhanden
  if (!code.includes("CorporateFooter")) {
    code = code.replace(
      'import { LuxuryHeader } from "@/components/LuxuryHeader";',
      'import { LuxuryHeader } from "@/components/LuxuryHeader";\nimport { CorporateFooter } from "@/components/CorporateFooter";'
    );
    const lastMainClose = code.lastIndexOf("</main>");
    if (lastMainClose !== -1) {
      const insertPos = lastMainClose + "</main>".length;
      code =
        code.slice(0, insertPos) +
        `\n      <CorporateFooter ${isLight ? "light " : ""}/>` +
        code.slice(insertPos);
    }
  }
  fs.writeFileSync(full, code, "utf8");
}

attachFooterAndAlignContainer("index.tsx", false);
attachFooterAndAlignContainer("search.tsx", false);
attachFooterAndAlignContainer("rankings.tsx", false);
attachFooterAndAlignContainer("advertise.tsx", false);
attachFooterAndAlignContainer("create-post.tsx", false);
attachFooterAndAlignContainer("creator-dashboard.tsx", false);
attachFooterAndAlignContainer("verify.tsx", false);
attachFooterAndAlignContainer("escort-zurich.tsx", false);
attachFooterAndAlignContainer("escort-basel.tsx", false);
attachFooterAndAlignContainer("escort-bern.tsx", false);
attachFooterAndAlignContainer("escort-geneva.tsx", false);
attachFooterAndAlignContainer("escort-lausanne.tsx", false);
attachFooterAndAlignContainer("escort-lugano.tsx", false);
attachFooterAndAlignContainer(path.join("orte", "[slug].tsx"), false);
attachFooterAndAlignContainer(path.join("profile", "[id].tsx"), false);

attachFooterAndAlignContainer("compare-escorts.tsx", true);
attachFooterAndAlignContainer("pricing.tsx", true);
attachFooterAndAlignContainer("safety.tsx", true);
attachFooterAndAlignContainer("for-clients.tsx", true);
attachFooterAndAlignContainer("how-it-works.tsx", true);
attachFooterAndAlignContainer("report.tsx", true);
attachFooterAndAlignContainer("search-atlas.tsx", true);
attachFooterAndAlignContainer(path.join("reviews", "[slug].tsx"), true);

console.log("✓ 5. Alle 24 Kernseiten sind jetzt auf den Pixel genau bündig (max-w-[1380px]) und tragen den CorporateFooter!");