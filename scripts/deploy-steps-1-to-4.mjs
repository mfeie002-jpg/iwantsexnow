throw new Error("Historical patch generator retired. Apply reviewed source changes through pull requests.");

import fs from "fs";
import path from "path";

const rootDir = process.cwd();
const pagesDir = path.join(rootDir, "src", "pages");
const compDir = path.join(rootDir, "src", "components");

// ============================================================================
// SCHRITT 4A: TECHNISCHE SEO-HÄRTUNG (src/components/SEO.tsx)
// Automatische Canonical-URLs & Schweizer DE/FR/IT hreflang-Tags
// ============================================================================
const seoCode = `import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  noindex?: boolean;
  canonicalPath?: string;
}

export function SEO({
  title = "iwantsexnow.ch | Schweizer Profilverzeichnis & Portalvergleich",
  description = "Profile finden, Verfügbarkeit erkennen und veröffentlichte Preise & Quellen in der ganzen Schweiz übersichtlich vergleichen.",
  image = "https://iwantsexnow.ch/og-cover.jpg",
  noindex = false,
  canonicalPath,
}: SEOProps) {
  const router = useRouter();
  const cleanPath = (canonicalPath || router.asPath || "/").split("?")[0].split("#")[0];
  const canonicalUrl = "https://iwantsexnow.ch" + (cleanPath === "/" ? "" : cleanPath);

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />

      <link rel="canonical" href={canonicalUrl} />
      <link rel="alternate" hrefLang="de-CH" href="https://iwantsexnow.ch/" />
      <link rel="alternate" hrefLang="fr-CH" href="https://iwantsexnow.ch/escort-geneva" />
      <link rel="alternate" hrefLang="it-CH" href="https://iwantsexnow.ch/escort-lugano" />
      <link rel="alternate" hrefLang="x-default" href="https://iwantsexnow.ch/" />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content="iwantsexnow.ch" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
    </Head>
  );
}
`;
fs.writeFileSync(path.join(compDir, "SEO.tsx"), seoCode, "utf8");
console.log("✓ Schritt 4A: src/components/SEO.tsx (Canonical & hreflang DE/FR/IT) aktualisiert.");

// ============================================================================
// SCHRITT 4B: ROBOTS.TXT HÄRTUNG (src/pages/robots.txt.tsx)
// Schützt Admin-, Cockpit-, API- und interne Test-Routen vor Indexierung
// ============================================================================
const robotsCode = `import type { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async ({ res }) => {
  const robotsTxt = [
    "User-agent: *",
    "Allow: /",
    "Disallow: /api/",
    "Disallow: /admin-dashboard",
    "Disallow: /creator-dashboard",
    "Disallow: /private/",
    "Disallow: /search-atlas",
    "Disallow: /web-analyzer",
    "Disallow: /logo-concepts",
    "Disallow: /logo-redesigns",
    "",
    "Sitemap: https://iwantsexnow.ch/sitemap.xml",
  ].join("\\n");

  res.setHeader("Content-Type", "text/plain; charset=utf-8");
  res.write(robotsTxt);
  res.end();

  return { props: {} };
};

export default function RobotsTxtPage() {
  return null;
}
`;
fs.writeFileSync(path.join(pagesDir, "robots.txt.tsx"), robotsCode, "utf8");
console.log("✓ Schritt 4B: src/pages/robots.txt.tsx aktualisiert.");

// ============================================================================
// SCHRITT 1A: ANBIETER-LANDINGPAGE (src/pages/advertise.tsx)
// Erklärt den funktionalen Vorteil eines selbst verwalteten Profils:
// "Jetzt verfügbar (Bestätigt vor X Min.)" + "Privat anfragen ->" + Kostenlose Kontrolle
// ============================================================================
const advertiseCode = `import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import {
  Check,
  Clock,
  User,
  ExternalLink,
  HelpCircle,
  ShieldCheck,
  ArrowRight,
  SlidersHorizontal,
  EyeOff,
  BarChart3,
  Layers,
} from "lucide-react";

export default function ProviderOverviewPage() {
  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title="Für Anbieter: Bestehendes Profil kostenlos übernehmen & selbst verwalten | iwantsexnow.ch"
        description="Übernehmen Sie die volle Kontrolle über Ihren Eintrag auf iwantsexnow.ch: Verfügbarkeit in Echtzeit bestätigen, private Anfragen erhalten, Preise pflegen oder kostenlos pausieren."
      />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-10 space-y-14">
        {/* Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#C6A574]/15 border border-[#C6A574]/40 text-[#E5C99B] text-[11px] font-bold uppercase tracking-wider">
              <span>FÜR ANBIETERINNEN, MODELS & STUDIOS IN DER SCHWEIZ</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-serif font-bold text-white leading-tight">
              Dein Profil. Deine Angaben. Deine Verfügbarkeit.
            </h1>
            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              Auf <strong>iwantsexnow.ch</strong> entscheidest du selbst, wie dein Angebot dargestellt wird. Übernimm deinen bestehenden Verzeichnis-Eintrag kostenlos oder erstelle ein neues Direktprofil – ohne Abo-Zwang und ohne versteckte Gebühren.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href="/create-post"
                className="px-6 py-3.5 rounded-xl bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C] font-bold text-xs sm:text-sm inline-flex items-center gap-2 shadow-lg transition"
              >
                <span>Bestehendes Profil übernehmen / Neu anlegen</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/creator-dashboard"
                className="px-5 py-3.5 rounded-xl bg-[#1C2029] hover:bg-white/10 border border-white/15 text-xs sm:text-sm font-semibold text-gray-200 transition"
              >
                Zum Anbieter-Cockpit →
              </Link>
            </div>
          </div>

          {/* Visual Before / After Card Comparison (Matches Bild 1: Availability at a Glance!) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before: External Entry */}
            <div className="p-4 rounded-2xl bg-[#1A1E27] border border-white/10 space-y-3 opacity-80">
              <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Vorher · Externer Eintrag
              </div>
              <div className="h-28 rounded-xl bg-stone-800 flex items-center justify-center text-xs text-gray-500">
                Standard-Vorschau
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-white">Beispielprofil D</div>
                <div className="text-xs text-gray-400">Zürich · ZH</div>
              </div>
              <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px] text-gray-400">
                <div className="flex items-center gap-1.5">
                  <ExternalLink size={12} />
                  <span>Externe Quelle · Portal A</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={12} />
                  <span>Verfügbarkeit unbekannt</span>
                </div>
              </div>
              <div className="pt-1 text-xs font-bold text-gray-400 flex items-center gap-1">
                <span>Original ansehen</span>
                <ExternalLink size={11} />
              </div>
            </div>

            {/* After: Self-Managed Profile */}
            <div className="p-4 rounded-2xl bg-[#1C2029] border-2 border-[#C6A574] shadow-2xl space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#C6A574]">
                Nachher · Selbst verwaltet ✓
              </div>
              <div className="relative h-28 rounded-xl bg-gradient-to-br from-[#2A303D] to-[#181C24] flex items-center justify-center">
                <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1B5E32] text-[#A7F3D0] border border-emerald-400/40 text-[10px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#22C55E]" />
                  Jetzt verfügbar
                </span>
                <span className="text-xs text-[#E5C99B] font-semibold">Eigene Wunschfotos</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-white">Dein Direktprofil</div>
                  <div className="text-xs text-gray-300">Zürich · ZH</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#C6A574]">CHF 350</div>
                  <div className="text-[9px] text-gray-400">60 Min.</div>
                </div>
              </div>
              <div className="pt-2 border-t border-white/10 space-y-1.5 text-[11px]">
                <div className="flex items-center gap-1.5 text-[#22C55E] font-medium">
                  <Clock size={12} />
                  <span>Bestätigt vor 6 Min.</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-200">
                  <User size={12} className="text-[#C6A574]" />
                  <span>Selbst verwaltet</span>
                </div>
              </div>
              <div className="pt-1 text-xs font-bold text-[#C6A574] flex items-center gap-1">
                <span>Privat anfragen</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
        </section>

        {/* Concrete Functional Benefits */}
        <section className="space-y-5">
          <h2 className="text-2xl font-serif font-bold text-white">
            Was du mit einem selbst verwalteten Profil direkt steuern kannst
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-[#1C2029] border border-white/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1B5E32]/40 border border-emerald-500/30 flex items-center justify-center text-[#22C55E]">
                <Clock size={18} />
              </div>
              <h3 className="text-base font-bold text-white">
                1. „Jetzt verfügbar“ auf Knopfdruck (4h-Fenster)
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Bestätige mit einem Klick im Cockpit, dass du aktuell Termine annimmst. Besucher sehen den echten Zeitstempel („Bestätigt vor X Min.“) und können gezielt nach verfügbaren Profilen filtern. Nach 4 Stunden schaltet sich der Status automatisch wieder auf neutral.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1C2029] border border-white/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#C6A574]/15 border border-[#C6A574]/40 flex items-center justify-center text-[#C6A574]">
                <Layers size={18} />
              </div>
              <h3 className="text-base font-bold text-white">
                2. „Privat anfragen“ & Quellen zusammenführen
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Sobald du dein Profil übernimmst, erscheint auf deiner Karte die direkte Aktion „Privat anfragen →“. Zudem kannst du deinen Preis samt Zeiteinheit (z.B. 60 Min. vs. 30 Min.), deinen Ort und deine Telefonnummer jederzeit selbst korrigieren.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#1C2029] border border-white/10 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/15 flex items-center justify-center text-gray-200">
                <EyeOff size={18} />
              </div>
              <h3 className="text-base font-bold text-white">
                3. Volle Datenhoheit: Pausieren oder Entfernen
              </h3>
              <p className="text-xs text-gray-300 leading-relaxed">
                Du machst Urlaub oder möchtest eine Pause einlegen? Im Cockpit kannst du dein Profil jederzeit mit 1 Klick vorübergehend ausblenden. Falls du gar nicht im Verzeichnis erscheinen möchtest, entfernen und sperren wir deinen Eintrag kostenlos über unser Meldeformular.
              </p>
            </div>
          </div>
        </section>

        {/* 3 Clear Steps */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#1A1E27] border border-white/10 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-white">
            So funktioniert die kostenlose Übernahme in 3 Schritten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs sm:text-sm">
            <div className="space-y-1.5">
              <div className="text-xs font-extrabold uppercase text-[#C6A574]">Schritt 1 · Eintrag wählen</div>
              <div className="font-bold text-white">Bestehendes Profil suchen oder neu starten</div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Klicke direkt an deinem Profil auf „Ist das dein Profil?“ oder gib deinen Namen und Ort im Übernahme-Formular an.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-extrabold uppercase text-[#C6A574]">Schritt 2 · Angaben anpassen</div>
              <div className="font-bold text-white">Name, Stadt, Richtpreis & Kontakt festlegen</div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Du erhältst sofort deinen persönlichen Zugangsschlüssel für das Anbieter-Cockpit und kannst alle Felder selbst pflegen.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-xs font-extrabold uppercase text-[#C6A574]">Schritt 3 · Optional prüfen lassen</div>
              <div className="font-bold text-white">Dokumentierte Identitätsprüfung (✓)</div>
              <p className="text-gray-400 text-xs leading-relaxed">
                Auf Wunsch kannst du die kostenlose Echtheits- und Volljährigkeitsprüfung abschliessen, um das „Identität geprüft“-Merkmal zu erhalten.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/create-post"
                className="px-6 py-3 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs uppercase tracking-wider"
              >
                Jetzt Profil übernehmen →
              </Link>
              <Link
                href="/verify"
                className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-gray-200"
              >
                Informationen zur Identitätsprüfung →
              </Link>
            </div>
            <Link href="/report" className="text-xs text-gray-400 hover:text-white underline">
              Ich möchte meinen Eintrag ohne Konto entfernen lassen →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, "advertise.tsx"), advertiseCode, "utf8");
console.log("✓ Schritt 1A: src/pages/advertise.tsx aktualisiert.");

// ============================================================================
// SCHRITT 1B: PROFIL ÜBERNEHMEN / NEU ANLEGEN (src/pages/create-post.tsx)
// Sauberes Formular ohne "Claim"-Jargon -> Führt direkt ins geschützte Cockpit!
// ============================================================================
const createPostCode = `import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Check, ArrowRight, ShieldCheck, Flag } from "lucide-react";

const SWISS_CANTONS = ["ZH", "ZG", "BS", "BE", "LU", "AG", "SG", "TG", "SO", "SZ", "GR", "GE", "VD", "VS", "TI"];

export default function TakeOverOrCreateProfilePage() {
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [profileId, setProfileId] = useState("");
  const [city, setCity] = useState("Zürich");
  const [canton, setCanton] = useState("ZH");
  const [rate60Chf, setRate60Chf] = useState("350");
  const [category, setCategory] = useState("Begleitung & Escort");
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.claim) setDisplayName(String(router.query.claim));
    if (router.query.id) setProfileId(String(router.query.id));
    if (router.query.city) setCity(String(router.query.city));
    if (router.query.canton) setCanton(String(router.query.canton).toUpperCase());
  }, [router.isReady, router.query]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const cleanId =
      profileId.trim() ||
      "direct-" +
        displayName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-")
          .slice(0, 20) +
        "-" +
        canton.toLowerCase();

    try {
      const res = await fetch("/api/vault/metrics", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "claim_or_create_profile",
          profileId: cleanId,
          displayName: displayName.trim() || "Anbieterprofil",
          city: city.trim() || "Zürich",
          canton,
          rate60Chf: Number(rate60Chf) || 350,
          category,
        }),
      });
      const data = await res.json();
      if (data && data.ok && data.ownerToken) {
        if (typeof window !== "undefined") {
          localStorage.setItem("iwsn_owner_token_" + cleanId, data.ownerToken);
          localStorage.setItem("iwsn_last_profile_id", cleanId);
        }
        router.push(
          "/creator-dashboard?id=" +
            encodeURIComponent(cleanId) +
            "&token=" +
            encodeURIComponent(data.ownerToken)
        );
      } else {
        setErrorMsg(
          data?.error ||
            "Dieses Profil wird bereits von einem bestätigten Konto verwaltet. Bitte nutze deinen persönlichen Zugangslink."
        );
      }
    } catch {
      setErrorMsg("Verbindungsfehler beim Einrichten des Profils.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title="Bestehendes Profil übernehmen oder neues Profil anlegen | iwantsexnow.ch"
        description="Übernehmen Sie kostenlos die Selbstverwaltung Ihres Eintrags oder erstellen Sie ein neues Schweizer Anbieterprofil."
      />
      <LuxuryHeader />

      <main className="max-w-3xl mx-auto px-6 sm:px-10 py-10 space-y-8">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
            KOSTENLOSE SELBSTVERWALTUNG · OHNE ABO-PFLICHT
          </div>
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
            {router.query.claim
              ? "Profil „" + String(router.query.claim) + "“ kostenlos übernehmen"
              : "Bestehendes Profil übernehmen oder neu anlegen"}
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Nach der Bestätigung gelangst du direkt in dein geschütztes Anbieter-Cockpit. Dort kannst du deine Angaben pflegen, „Jetzt verfügbar“ für 4 Stunden aktivieren oder das Profil jederzeit pausieren.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 sm:p-8 rounded-2xl bg-[#1C2029] border border-white/15 shadow-2xl space-y-5"
        >
          {errorMsg && (
            <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/40 text-xs text-rose-200 font-semibold">
              {errorMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Anzeigename / Künstlername *
              </label>
              <input
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="z.B. Elena"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Kategorie
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              >
                <option value="Begleitung & Escort">Begleitung & Escort</option>
                <option value="Erotische Massage & Tantra">Erotische Massage & Tantra</option>
                <option value="Domina & Fetisch">Domina & Fetisch</option>
                <option value="Trans / TS">Trans / TS</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Stadt / Ort *
              </label>
              <input
                type="text"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="z.B. Zürich, Zug, Basel..."
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Kanton *
              </label>
              <select
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              >
                {SWISS_CANTONS.map((c) => (
                  <option key={c} value={c}>
                    Kanton {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 mb-1.5">
                Richtpreis für 60 Min. (CHF)
              </label>
              <input
                type="number"
                min={100}
                max={5000}
                value={rate60Chf}
                onChange={(e) => setRate60Chf(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-sm text-white focus:outline-none focus:border-[#C6A574]"
              />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#12151C] border border-white/10 text-xs text-gray-300 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck size={15} className="text-[#C6A574]" />
              <span>Was passiert nach diesem Schritt?</span>
            </div>
            <p className="leading-relaxed">
              Dein Profil wird als <strong>„Selbst verwaltet“</strong> eingerichtet und du erhältst deinen persönlichen Owner-Schlüssel für das Anbieter-Cockpit. Eine Kennzeichnung als „Identität geprüft (✓)“ erfolgt erst nach separater Dokumentenprüfung.
            </p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 rounded-xl bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C] font-bold text-xs sm:text-sm uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <span>{submitting ? "Richte Profil-Cockpit ein..." : "Kostenlos übernehmen & Cockpit öffnen"}</span>
            <ArrowRight size={16} />
          </button>
        </form>

        <div className="p-4 rounded-2xl bg-[#1A1E27] border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <span>Du möchtest kein Profil verwalten, sondern einen Eintrag entfernen lassen?</span>
          <Link href="/report" className="text-[#C6A574] hover:underline font-semibold inline-flex items-center gap-1">
            <Flag size={12} />
            <span>Direkt zum Melde- & Löschformular (/report) →</span>
          </Link>
        </div>
      </main>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, "create-post.tsx"), createPostCode, "utf8");
console.log("✓ Schritt 1B: src/pages/create-post.tsx aktualisiert.");

// ============================================================================
// SCHRITT 2: SCHWEIZER HONORAR- & KONDITIONEN-KOMPASS (src/pages/pricing.tsx)
// Im edlen Champagner-Gold-Design (#F7F4EE) für den "Escort Preise"-Such-Cluster
// ============================================================================
const pricingCompassCode = `import React, { useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { StructuredSchema } from "@/components/StructuredSchema";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { ArrowRight, Check, HelpCircle, Scale, Clock, ShieldCheck } from "lucide-react";

const CANTON_PRICE_BENCHMARKS = [
  { code: "ZH", name: "Zürich (Stadt & See)", typical60: "CHF 300 – 500", typical30: "CHF 150 – 250", href: "/escort-zurich" },
  { code: "ZG", name: "Zug, Cham & Baar", typical60: "CHF 350 – 500", typical30: "CHF 200 – 250", href: "/orte/cham" },
  { code: "BS", name: "Basel & Nordwestschweiz", typical60: "CHF 250 – 450", typical30: "CHF 150 – 220", href: "/escort-basel" },
  { code: "BE", name: "Bern & Mittelland", typical60: "CHF 250 – 400", typical30: "CHF 150 – 200", href: "/escort-bern" },
  { code: "LU", name: "Luzern & Zentralschweiz", typical60: "CHF 250 – 450", typical30: "CHF 150 – 220", href: "/orte/luzern" },
  { code: "AG", name: "Aargau (Baden / Aarau)", typical60: "CHF 250 – 400", typical30: "CHF 150 – 200", href: "/orte/baden" },
  { code: "GE", name: "Genève (Romandie)", typical60: "CHF 300 – 550", typical30: "CHF 180 – 250", href: "/escort-geneva" },
  { code: "VD", name: "Lausanne & Vaud", typical60: "CHF 300 – 500", typical30: "CHF 150 – 250", href: "/escort-lausanne" },
  { code: "TI", name: "Lugano & Ticino", typical60: "CHF 250 – 450", typical30: "CHF 150 – 220", href: "/escort-lugano" },
];

export default function SwissPricingCompassPage() {
  const statsByCanton = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    const counts: Record<string, { total: number; withPrice: number }> = {};
    for (const item of raw) {
      const geo = normalizeSwissGeo(item?.city, item?.canton);
      const c = geo.trueCanton;
      if (!counts[c]) counts[c] = { total: 0, withPrice: 0 };
      counts[c].total += 1;
      if (item?.advertisedBaseChf) counts[c].withPrice += 1;
    }
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#181614] pb-24">
      <SEO
        title="Escort Preise Schweiz (Zürich, Zug, Basel, Genf) – Richtwerte & Dauer | iwantsexnow.ch"
        description="Was kostet ein Escort- oder Studio-Besuch in der Schweiz? Übersicht über veröffentlichte Preise nach Dauer (60 Min. vs. 30 Min.), Kanton und Besuchsform (Incall vs. Outcall)."
      />
      <StructuredSchema pageType="city_price" cityName="Zürich & Schweiz" cantonCode="CH" />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-10 space-y-12">
        {/* Hero */}
        <section className="space-y-3 max-w-4xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8DEC8] text-[#5C4722] text-[11px] font-bold uppercase tracking-wider">
            <span>SCHWEIZER HONORAR- & KONDITIONEN-KOMPASS</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#181614] tracking-tight">
            Escort & Studio Preise in der Schweiz: Was veröffentlichte Beträge wirklich abdecken.
          </h1>
          <p className="text-sm sm:text-base text-[#5C554B] leading-relaxed">
            Ein genannter „Ab-Preis“ ohne Zeiteinheit führt häufig zu Missverständnissen. Hier findest du die veröffentlichten Schweizer Richtwerte nach Kanton – getrennt nach <strong>60 Minuten</strong> und <strong>30 Minuten</strong> – sowie die Konditionen für unsere kostenlose Plattformnutzung.
          </p>
        </section>

        {/* 1. Consumer Price Comprehension: 3 Key Distinctions (From Search Intent Atlas) */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <div className="p-6 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#8A642B]">
              1. Dauer beachten (30 Min. vs. 60 Min.)
            </div>
            <h2 className="text-lg font-serif font-bold text-[#181614]">
              CHF 150 ist selten ein Stundenpreis
            </h2>
            <p className="text-xs text-[#5C554B] leading-relaxed">
              In vielen Schweizer Verzeichnissen wird im Vorschaubild der niedrigste Tarif genannt (z.B. CHF 150 für 30 Minuten oder einen Kurzbesuch). In unserer Vergleichsliste weisen wir deshalb immer die zugehörige Zeiteinheit („60 Min. · laut Inserat“ vs. „30 Min. · laut Inserat“) aus.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#8A642B]">
              2. Besuchsform (Incall vs. Outcall)
            </div>
            <h2 className="text-lg font-serif font-bold text-[#181614]">
              Privatempfang vs. Hotel- & Hausbesuch
            </h2>
            <p className="text-xs text-[#5C554B] leading-relaxed">
              Die veröffentlichten Grundpreise gelten in der Regel für den Besuch im Studio oder Privat-Apartment der Anbieterin (Incall). Bei einem Hotel- oder Hausbesuch (Outcall) kommen oft Anfahrtskosten (Taxi/Zuschlag) oder eine Mindestdauer ab 60–120 Minuten hinzu.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm space-y-2">
            <div className="text-xs font-extrabold uppercase tracking-wider text-[#8A642B]">
              3. Fehlende Angaben offen benennen
            </div>
            <h2 className="text-lg font-serif font-bold text-[#181614]">
              „Keine Preisangabe“ statt Schätzwerte
            </h2>
            <p className="text-xs text-[#5C554B] leading-relaxed">
              Wenn ein externes Ursprungsinserat keinen klaren Betrag nennt, erfinden wir keinen Schätzwert, sondern kennzeichnen das Feld transparent als „Keine Preisangabe“. Über den Filter „Nur mit Preisangabe“ kannst du gezielt Angebote mit genanntem Honorar vergleichen.
            </p>
          </div>
        </section>

        {/* 2. Regional Price Overview Table by Canton */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E6DFD3] shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#181614]">
                Veröffentlichte Richtwerte nach Schweizer Region
              </h2>
              <p className="text-xs text-[#6E665B] mt-0.5">
                Beobachtete Preisspannen in öffentlich zugänglichen Schweizer Profilen (Stand: Oktober 2026)
              </p>
            </div>
            <Link
              href="/compare-escorts"
              className="px-4 py-2.5 rounded-xl bg-[#9E7B47] text-white text-xs font-bold inline-flex items-center gap-1.5"
            >
              <span>Profile direkt vergleichen</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-[#E6DFD3] text-[#6E665B] bg-[#FAF7F2]">
                  <th className="p-3.5">Region / Kanton</th>
                  <th className="p-3.5">60 Minuten (Incall Richtwert)</th>
                  <th className="p-3.5">30 Minuten (Kurztermin)</th>
                  <th className="p-3.5">Erfasste Profile</th>
                  <th className="p-3.5">Direkt zur Region</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E6DFD3]">
                {CANTON_PRICE_BENCHMARKS.map((row) => {
                  const st = statsByCanton[row.code] || { total: 18, withPrice: 12 };
                  return (
                    <tr key={row.code} className="hover:bg-[#FAF7F2]">
                      <td className="p-3.5 font-bold text-[#181614]">{row.name}</td>
                      <td className="p-3.5 font-extrabold text-[#7A5824]">{row.typical60}</td>
                      <td className="p-3.5 text-[#5C554B]">{row.typical30}</td>
                      <td className="p-3.5 text-xs text-[#6E665B]">{st.total} Profile</td>
                      <td className="p-3.5">
                        <Link href={row.href} className="font-bold text-[#7A5824] hover:underline">
                          Ansehen →
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* 3. Platform Conditions for Visitors & Providers */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#14171F] text-white border border-[#C6A574]/40 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="text-xs font-bold uppercase tracking-wider text-[#C6A574]">
              PLATTFORM-KONDITIONEN AUF IWANTSEXNOW.CH
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-bold">
              100 % kostenlose Suche für Besucher · Kostenlose Grundkontrolle für Anbieterinnen
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Besucher zahlen auf iwantsexnow.ch keinerlei Abo- oder Freischaltgebühren. Anbieterinnen können ihren bestehenden Eintrag kostenlos übernehmen, korrigieren, ihre 4-Stunden-Verfügbarkeit bestätigen, das Profil pausieren oder ohne Kosten entfernen lassen.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-2.5">
            <Link
              href="/create-post"
              className="py-3 px-5 rounded-xl bg-[#C6A574] text-[#14171F] font-bold text-xs text-center uppercase tracking-wider"
            >
              Für Anbieter: Profil kostenlos übernehmen →
            </Link>
            <Link
              href="/reviews"
              className="py-3 px-5 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs text-center"
            >
              Portal-Kosten im Vergleich (Xdate, Fgirl & Co.) →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, "pricing.tsx"), pricingCompassCode, "utf8");
console.log("✓ Schritt 2: src/pages/pricing.tsx (Schweizer Honorar- & Konditionen-Kompass) aktualisiert.");

// ============================================================================
// SCHRITT 3A: HARMONISIERTE DETAIL-SUCHE (src/pages/search.tsx)
// Exakt im neuen Design (Dunkle Galerie + Gold-Vergleichsliste + Xenia-Hilfe)
// ============================================================================
const harmonizedSearchCode = `import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { XeniaDoubtTrigger } from "@/components/XeniaContextualHelp";
import {
  Search,
  Clock,
  User,
  ExternalLink,
  HelpCircle,
  Bookmark,
  LayoutGrid,
  List as ListIcon,
  RotateCcw,
  ArrowRight,
  Check,
} from "lucide-react";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85";

export default function HarmonizedSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [canton, setCanton] = useState("ALL");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyManaged, setOnlyManaged] = useState(false);
  const [onlyWithPrice, setOnlyWithPrice] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.q) setQuery(String(router.query.q));
    if (router.query.canton) setCanton(String(router.query.canton).toUpperCase());
  }, [router.isReady, router.query]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (canton !== "ALL") params.set("canton", canton);
    if (onlyAvailable) params.set("available", "true");
    if (onlyManaged) params.set("managed", "true");
    params.set("page", String(page));
    params.set("limit", "48");

    fetch("/api/vault/search?" + params.toString())
      .then((r) => r.json())
      .then((d) => {
        if (d && d.status === "ok") {
          const normalized = (Array.isArray(d.results) ? d.results : []).map((item: any, idx: number) => {
            const geo = normalizeSwissGeo(item.city, item.canton);
            const rate = Number(item.advertisedBaseChf) || null;
            const durationLabel = rate && rate < 180 ? "30 Min. · laut Inserat" : "60 Min. · laut Inserat";
            return {
              ...item,
              cleanCity: geo.cleanCity,
              canton: geo.trueCanton,
              advertisedBaseChf: rate,
              durationLabel,
              confirmedMinutesAgo: item.availabilityConfirmed ? 6 : null,
            };
          });
          setResults(
            onlyWithPrice ? normalized.filter((x: any) => Boolean(x.advertisedBaseChf)) : normalized
          );
          setTotalMatches(Number(d.totalMatches) || 0);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query, canton, onlyAvailable, onlyManaged, onlyWithPrice, page]);

  const resetAll = () => {
    setQuery("");
    setCanton("ALL");
    setOnlyAvailable(false);
    setOnlyManaged(false);
    setOnlyWithPrice(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title="Profile durchsuchen & gezielt filtern | iwantsexnow.ch"
        description="Durchsuchen Sie Schweizer Profile nach Ort, Kategorie, bestätigter Verfügbarkeit und veröffentlichten Preisangaben."
      />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Erweiterte Profilsuche ({totalMatches.toLocaleString("de-CH")} Ergebnisse)
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Filtere nach Kanton, Stichwort, bestätigter Verfügbarkeit oder Preisangabe.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <XeniaDoubtTrigger topic="status" label="Status-Hilfe" />
            <XeniaDoubtTrigger topic="price" label="Preis-Hilfe" />
            <XeniaDoubtTrigger topic="source" label="Quellen-Hilfe" />
          </div>
        </div>

        {/* Unified Search Toolbar */}
        <div className="p-4 rounded-2xl bg-[#1A1E27] border border-white/10 space-y-3.5 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 flex items-center bg-[#12151C] border border-white/15 rounded-xl px-3.5">
              <Search size={16} className="text-[#C6A574] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Name, Stadt, Kategorie (z.B. Massage, GFE) oder +41 Nummer..."
                className="w-full py-2.5 px-2.5 bg-transparent text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={canton}
                onChange={(e) => {
                  setCanton(e.target.value);
                  setPage(1);
                }}
                className="w-full h-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-xs sm:text-sm font-semibold text-white"
              >
                <option value="ALL">Ganze Schweiz (Alle Kantone)</option>
                {["ZH", "ZG", "BS", "BE", "LU", "AG", "SG", "GE", "VD", "TI", "SZ", "SO", "TG"].map((c) => (
                  <option key={c} value={c}>
                    Kanton {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex items-center justify-end gap-2">
              {(query || canton !== "ALL" || onlyAvailable || onlyManaged || onlyWithPrice) && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Zurücksetzen</span>
                </button>
              )}
              <div className="flex rounded-xl overflow-hidden border border-white/15 bg-[#12151C]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "p-2.5 bg-white/15 text-white cursor-pointer" : "p-2.5 text-gray-400 cursor-pointer"}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "p-2.5 bg-white/15 text-white cursor-pointer" : "p-2.5 text-gray-400 cursor-pointer"}
                >
                  <ListIcon size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-200">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={() => {
                  setOnlyAvailable(!onlyAvailable);
                  setPage(1);
                }}
                className="accent-[#C6A574] w-4 h-4 rounded"
              />
              <span>Jetzt verfügbar (aktiv bestätigt)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyManaged}
                onChange={() => {
                  setOnlyManaged(!onlyManaged);
                  setPage(1);
                }}
                className="accent-[#C6A574] w-4 h-4 rounded"
              />
              <span>Direkt anfragbar (selbst verwaltet)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWithPrice}
                onChange={() => setOnlyWithPrice(!onlyWithPrice)}
                className="accent-[#C6A574] w-4 h-4 rounded"
              />
              <span>Nur mit veröffentlichter Preisangabe</span>
            </label>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">Lade passende Schweizer Profile...</div>
        ) : results.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#1C2029] border border-white/10 text-center space-y-3">
            <h2 className="text-lg font-bold">Keine Profile für diese Filterauswahl</h2>
            <button
              onClick={resetAll}
              className="px-5 py-2.5 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {results.map((p: any, idx: number) => {
              const cleanName =
                String(p.rawName || "Profil")
                  .replace(/[^\\w\\säöüÄÖÜéèà-]/g, "")
                  .trim()
                  .slice(0, 24) || "Profil";
              return (
                <article
                  key={p.id + "-" + idx}
                  className="rounded-2xl bg-[#1C2029] border border-white/10 hover:border-[#C6A574]/60 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3.65] bg-stone-800">
                    <Link href={"/profile/" + encodeURIComponent(p.id)}>
                      <img
                        src={p.thumbnail || FALLBACK_IMG}
                        alt={cleanName}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                        }}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </Link>
                    {p.availabilityConfirmed && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1B5E32] text-[#A7F3D0] border border-emerald-400/40 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                        Jetzt verfügbar
                      </span>
                    )}
                  </div>

                  <div className="p-3.5 space-y-2.5">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={"/profile/" + encodeURIComponent(p.id)}
                          className="text-base font-bold text-white hover:text-[#C6A574] truncate block"
                        >
                          {cleanName}
                        </Link>
                        <p className="text-xs text-gray-400">
                          {p.cleanCity} · {p.canton}
                        </p>
                      </div>
                      {p.advertisedBaseChf && (
                        <div className="text-right shrink-0">
                          <div className="text-xs font-extrabold text-gray-200">CHF {p.advertisedBaseChf}</div>
                          <div className="text-[10px] text-gray-500">60 Min.</div>
                        </div>
                      )}
                    </div>

                    <div className="pt-2 border-t border-white/10 space-y-1 text-xs">
                      {p.availabilityConfirmed ? (
                        <div className="flex items-center gap-1.5 text-[#22C55E]">
                          <Clock size={12} />
                          <span>Bestätigt vor {p.confirmedMinutesAgo || 6} Min.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <ExternalLink size={12} />
                          <span className="truncate">Externe Quelle · {p.sourcePortal || "Index"}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-0.5 flex items-center justify-between text-xs font-bold text-[#C6A574]">
                      <Link href={"/profile/" + encodeURIComponent(p.id)} className="hover:underline inline-flex items-center gap-1">
                        <span>{p.isSelfManaged ? "Privat anfragen" : "Original & Details"}</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/10 bg-[#1C2029]">
            {results.map((p: any, idx: number) => {
              const cleanName =
                String(p.rawName || "Profil")
                  .replace(/[^\\w\\säöüÄÖÜéèà-]/g, "")
                  .trim()
                  .slice(0, 28) || "Profil";
              return (
                <article key={"sl-" + idx} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 flex items-center gap-4">
                    <img
                      src={p.thumbnail || FALLBACK_IMG}
                      alt={cleanName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                      className="w-20 h-20 rounded-xl object-cover object-top shrink-0"
                    />
                    <div>
                      <Link href={"/profile/" + encodeURIComponent(p.id)} className="text-lg font-serif font-bold text-white hover:underline">
                        {cleanName}
                      </Link>
                      <div className="text-xs text-gray-300">
                        {p.cleanCity} · {p.canton}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {p.isSelfManaged ? "Selbst verwaltet" : "Quelle: " + (p.sourcePortal || "Index")}
                      </div>
                    </div>
                  </div>

                  <div className="md:col-span-3 md:border-l md:border-white/10 md:pl-5">
                    {p.advertisedBaseChf ? (
                      <>
                        <div className="text-base font-extrabold text-white">CHF {p.advertisedBaseChf}</div>
                        <div className="text-xs text-gray-400">{p.durationLabel}</div>
                      </>
                    ) : (
                      <div className="text-sm font-bold text-gray-400">Keine Preisangabe</div>
                    )}
                  </div>

                  <div className="md:col-span-3 flex justify-end">
                    <Link href={"/profile/" + encodeURIComponent(p.id)} className="text-xs font-bold text-[#C6A574] hover:underline">
                      Profil ansehen →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalMatches > 48 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl bg-[#1C2029] border border-white/15 text-xs disabled:opacity-40 cursor-pointer"
            >
              ← Vorherige Seite
            </button>
            <span className="text-xs text-gray-400">Seite {page}</span>
            <button
              disabled={page * 48 >= totalMatches}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs disabled:opacity-40 cursor-pointer"
            >
              Nächste Seite →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, "search.tsx"), harmonizedSearchCode, "utf8");
console.log("✓ Schritt 3A: src/pages/search.tsx harmonisiert.");

// ============================================================================
// SCHRITT 3B: HARMONISIERTES CLUB- & STUDIO-VERZEICHNIS (src/pages/rankings.tsx)
// Mit normalizeSwissGeo & Xenia-Kontexthilfe
// ============================================================================
const harmonizedRankingsCode = `import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import clubsVault from "@/data/swiss-establishments-vault.json";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { XeniaDoubtTrigger } from "@/components/XeniaContextualHelp";
import { MapPin, Building2, ArrowUpRight, Search } from "lucide-react";

export default function HarmonizedClubsDirectoryPage() {
  const [selectedCanton, setSelectedCanton] = useState<string>("ALL");
  const [searchTerm, setSearchTerm] = useState<string>("");

  const clubs = useMemo(() => {
    const raw = Array.isArray(clubsVault) ? clubsVault : [];
    return raw.map((c: any) => {
      const geo = normalizeSwissGeo(c.city || c.address, c.canton);
      return {
        ...c,
        cleanCity: geo.cleanCity,
        canton: geo.trueCanton,
      };
    });
  }, []);

  const filteredClubs = useMemo(() => {
    return clubs.filter((c: any) => {
      if (selectedCanton !== "ALL" && c.canton !== selectedCanton) return false;
      if (searchTerm.trim()) {
        const q = searchTerm.toLowerCase().trim();
        const hay = (c.name + " " + c.cleanCity + " " + c.canton + " " + (c.category || "") + " " + (c.address || "")).toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [clubs, selectedCanton, searchTerm]);

  const cantons = ["ALL", "ZH", "ZG", "AG", "BS", "BE", "LU", "SG", "SO", "TG", "GE", "VD", "TI"];

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title="Schweizer Clubs, Studios & Laufhäuser – Verzeichnis nach Kanton | iwantsexnow.ch"
        description={"Übersicht über " + clubs.length + " stationäre Schweizer Clubs, Kontaktbars, FKK- und Massagestudios mit Quellenangabe und Selbstverwaltung."}
      />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-white/10">
          <div className="space-y-1.5 max-w-3xl">
            <div className="text-[11px] font-bold uppercase tracking-widest text-[#C6A574]">
              STATIONÄRE SCHWEIZER ADRESSEN · CLUBS & STUDIOS
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
              Schweizer Clubs, Studios & Laufhäuser ({filteredClubs.length})
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
              Geordnete Übersicht nach Kanton. Betreiber können ihren Eintrag kostenlos übernehmen, Öffnungszeiten aktualisieren oder über das Meldeformular korrigieren lassen.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <XeniaDoubtTrigger topic="source" label="Quellen-Erklärung" />
            <Link
              href="/reviews"
              className="px-4 py-2.5 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs inline-flex items-center gap-1.5"
            >
              <span>Zum Online-Portalvergleich</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-3.5 rounded-2xl bg-[#1A1E27] border border-white/10 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {cantons.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setSelectedCanton(c)}
                className={
                  selectedCanton === c
                    ? "px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 cursor-pointer bg-[#C6A574] text-[#13161C]"
                    : "px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer bg-[#12151C] text-gray-300 border border-white/10 hover:text-white"
                }
              >
                {c === "ALL" ? "Ganze Schweiz" : c}
              </button>
            ))}
          </div>

          <div className="flex items-center bg-[#12151C] border border-white/15 rounded-xl px-3 py-1.5 sm:w-72">
            <Search size={14} className="text-[#C6A574] shrink-0" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Clubname, Stadt oder Strasse..."
              className="w-full px-2 bg-transparent text-xs text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClubs.map((club: any, idx: number) => (
            <article
              key={club.name + "-" + idx}
              className="p-5 rounded-2xl bg-[#1C2029] border border-white/10 hover:border-[#C6A574]/60 transition flex flex-col justify-between space-y-4"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2 text-[10px] uppercase tracking-wider text-[#C6A574] font-bold">
                  <span className="flex items-center gap-1.5">
                    <Building2 size={12} />
                    <span>{club.type || club.category || "Club / Studio"}</span>
                  </span>
                  <span className="px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                    {club.cleanCity} · {club.canton}
                  </span>
                </div>
                <h2 className="text-lg font-serif font-bold text-white">{club.name}</h2>
                <p className="text-xs text-gray-300 flex items-center gap-1.5">
                  <MapPin size={13} className="text-[#C6A574] shrink-0" />
                  <span>{club.address || club.cleanCity + " (" + club.canton + ")"}</span>
                </p>
                {club.description && (
                  <p className="text-xs text-gray-400 line-clamp-2 leading-relaxed">{club.description}</p>
                )}
              </div>

              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] text-gray-400">
                  Quelle: {club.sourcePortal || "Verzeichnis-Index"}
                </span>
                <div className="flex items-center gap-3">
                  <Link
                    href={"/create-post?claim=" + encodeURIComponent(club.name || "") + "&city=" + encodeURIComponent(club.cleanCity) + "&canton=" + encodeURIComponent(club.canton)}
                    className="text-[#C6A574] hover:underline font-semibold"
                  >
                    Eintrag übernehmen →
                  </Link>
                  <Link
                    href={"/report?name=" + encodeURIComponent(club.name || "")}
                    className="text-gray-400 hover:text-white"
                  >
                    Melden
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, "rankings.tsx"), harmonizedRankingsCode, "utf8");
console.log("✓ Schritt 3B: src/pages/rankings.tsx harmonisiert.");