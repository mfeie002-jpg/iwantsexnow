import React from "react";
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
