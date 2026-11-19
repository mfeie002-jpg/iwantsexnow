import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { CorporateFooter } from "@/components/CorporateFooter";
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
    <div className="min-h-screen bg-white text-tinte pb-24">
      <SEO
        title="Für Anbieter: Bestehendes Profil kostenlos übernehmen & selbst verwalten | iwantsexnow.ch"
        description="Übernehmen Sie die volle Kontrolle über Ihren Eintrag auf iwantsexnow.ch: Verfügbarkeit in Echtzeit bestätigen, private Anfragen erhalten, Preise pflegen oder kostenlos pausieren."
      />
      <LuxuryHeader />

      <PageIntro tone="flieder" note="Für Anbieterinnen und Studios" art="compare" title={<>Dein Profil. Deine Angaben. Deine Verfügbarkeit.</>}
        lead={<>Auf <strong>iwantsexnow.ch</strong> entscheidest du selbst, wie dein Angebot dargestellt wird. Übernimm deinen bestehenden Verzeichnis-Eintrag kostenlos oder erstelle ein neues Direktprofil – ohne Abo-Zwang und ohne versteckte Gebühren.</>}>
        {/* Visual Before / After Card Comparison (Matches Bild 1: Availability at a Glance!) */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Before: External Entry */}
            <div className="p-4 rounded-2xl bg-papier border border-tinte/20 space-y-3 opacity-80">
              <div className="text-[13px] font-bold text-gray-600">
                Vorher · Externer Eintrag
              </div>
              <div className="h-28 rounded-xl bg-stone-200 flex items-center justify-center text-[13px] text-gray-600">
                Standard-Vorschau
              </div>
              <div className="space-y-1">
                <div className="text-sm font-bold text-tinte">Beispielprofil D</div>
                <div className="text-[13px] text-gray-600">Zürich · ZH</div>
              </div>
              <div className="pt-2 border-t border-tinte/20 space-y-1.5 text-[13px] text-gray-600">
                <div className="flex items-center gap-1.5">
                  <ExternalLink size={12} />
                  <span>Externe Quelle · Portal A</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <HelpCircle size={12} />
                  <span>Verfügbarkeit unbekannt</span>
                </div>
              </div>
              <div className="pt-1 text-[13px] font-bold text-gray-600 flex items-center gap-1">
                <span>Original ansehen</span>
                <ExternalLink size={11} />
              </div>
            </div>

            {/* After: Self-Managed Profile */}
            <div className="p-4 rounded-2xl bg-fels border-2 border-kirsche shadow-2xl space-y-3">
              <div className="text-[13px] font-bold text-kirsche">
                Nachher · Selbst verwaltet ✓
              </div>
              <div className="relative h-28 rounded-xl bg-gradient-to-br from-fels to-papier flex items-center justify-center">
                <span className="absolute top-2 left-2 inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#1B5E32] text-mint-700 border border-mint-400/40 text-[13px] font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#4fd1b0]" />
                  Jetzt verfügbar
                </span>
                <span className="text-[13px] text-kirsche font-semibold">Eigene Wunschfotos</span>
              </div>
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm font-bold text-tinte">Dein Direktprofil</div>
                  <div className="text-[13px] text-gray-700">Zürich · ZH</div>
                </div>
                <div className="text-right">
                  <div className="text-[13px] font-bold text-kirsche">CHF 350</div>
                  <div className="text-[13px] text-gray-600">60 Min.</div>
                </div>
              </div>
              <div className="pt-2 border-t border-tinte/20 space-y-1.5 text-[13px]">
                <div className="flex items-center gap-1.5 text-[#4fd1b0] font-medium">
                  <Clock size={12} />
                  <span>Bestätigt vor 6 Min.</span>
                </div>
                <div className="flex items-center gap-1.5 text-gray-800">
                  <User size={12} className="text-kirsche" />
                  <span>Selbst verwaltet</span>
                </div>
              </div>
              <div className="pt-1 text-[13px] font-bold text-kirsche flex items-center gap-1">
                <span>Privat anfragen</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
      </PageIntro>

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-10 space-y-14">
        {/* Hero Section */}
        

        {/* Concrete Functional Benefits */}
        <section className="space-y-5">
          <h2 className="text-2xl font-serif font-bold text-tinte">
            Was du mit einem selbst verwalteten Profil direkt steuern kannst
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-fels border border-tinte/20 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#1B5E32]/40 border border-mint-500/30 flex items-center justify-center text-[#4fd1b0]">
                <Clock size={18} />
              </div>
              <h3 className="text-base font-bold text-tinte">
                1. „Jetzt verfügbar“ auf Knopfdruck (4h-Fenster)
              </h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                Bestätige mit einem Klick im Cockpit, dass du aktuell Termine annimmst. Besucher sehen den echten Zeitstempel („Bestätigt vor X Min.“) und können gezielt nach verfügbaren Profilen filtern. Nach 4 Stunden schaltet sich der Status automatisch wieder auf neutral.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-fels border border-tinte/20 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-kirsche/15 border border-kirsche/40 flex items-center justify-center text-kirsche">
                <Layers size={18} />
              </div>
              <h3 className="text-base font-bold text-tinte">
                2. „Privat anfragen“ & Quellen zusammenführen
              </h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                Sobald du dein Profil übernimmst, erscheint auf deiner Karte die direkte Aktion „Privat anfragen →“. Zudem kannst du deinen Preis samt Zeiteinheit (z.B. 60 Min. vs. 30 Min.), deinen Ort und deine Telefonnummer jederzeit selbst korrigieren.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-fels border border-tinte/20 space-y-2.5">
              <div className="w-10 h-10 rounded-xl bg-tinte/[0.04] border border-tinte/25 flex items-center justify-center text-gray-800">
                <EyeOff size={18} />
              </div>
              <h3 className="text-base font-bold text-tinte">
                3. Volle Datenhoheit: Pausieren oder Entfernen
              </h3>
              <p className="text-[13px] text-gray-700 leading-relaxed">
                Du machst Urlaub oder möchtest eine Pause einlegen? Im Cockpit kannst du dein Profil jederzeit mit 1 Klick vorübergehend ausblenden. Falls du gar nicht im Verzeichnis erscheinen möchtest, entfernen und sperren wir deinen Eintrag kostenlos über unser Meldeformular.
              </p>
            </div>
          </div>
        </section>

        {/* 3 Clear Steps */}
        <section className="p-6 sm:p-8 rounded-2xl bg-papier border border-tinte/20 space-y-6">
          <h2 className="text-2xl font-serif font-bold text-tinte">
            So funktioniert die kostenlose Übernahme in 3 Schritten
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[13px] sm:text-sm">
            <div className="space-y-1.5">
              <div className="text-[13px] font-extrabold text-kirsche">Schritt 1 · Eintrag wählen</div>
              <div className="font-bold text-tinte">Bestehendes Profil suchen oder neu starten</div>
              <p className="text-gray-600 text-[13px] leading-relaxed">
                Klicke direkt an deinem Profil auf „Ist das dein Profil?“ oder gib deinen Namen und Ort im Übernahme-Formular an.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-[13px] font-extrabold text-kirsche">Schritt 2 · Angaben anpassen</div>
              <div className="font-bold text-tinte">Name, Stadt, Richtpreis & Kontakt festlegen</div>
              <p className="text-gray-600 text-[13px] leading-relaxed">
                Du erhältst sofort deinen persönlichen Zugangsschlüssel für das Anbieter-Cockpit und kannst alle Felder selbst pflegen.
              </p>
            </div>
            <div className="space-y-1.5">
              <div className="text-[13px] font-extrabold text-kirsche">Schritt 3 · Optional prüfen lassen</div>
              <div className="font-bold text-tinte">Dokumentierte Identitätsprüfung (✓)</div>
              <p className="text-gray-600 text-[13px] leading-relaxed">
                Auf Wunsch kannst du die kostenlose Echtheits- und Volljährigkeitsprüfung abschliessen, um das „Identität geprüft“-Merkmal zu erhalten.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-tinte/20">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/create-post"
                className="px-6 py-3 rounded-xl bg-kirsche text-[#ffffff] font-bold text-[13px] "
              >
                Jetzt Profil übernehmen →
              </Link>
              <Link
                href="/verify"
                className="px-5 py-3 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-semibold text-gray-800"
              >
                Informationen zur Identitätsprüfung →
              </Link>
            </div>
            <Link href="/report" className="text-[13px] text-gray-600 hover:text-tinte underline">
              Ich möchte meinen Eintrag ohne Konto entfernen lassen →
            </Link>
          </div>
        </section>
      </main>
      <CorporateFooter />
    </div>
  );
}
