import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { ShieldCheck, Clock, HelpCircle, Scale, Check, AlertCircle } from "lucide-react";

export default function SafetyAndBeginnerGuidePage() {
  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#141821] pb-20">
      <SEO
        title="Sicherheit, Etikette & Bedeutung der Kennzeichnungen | iwantsexnow.ch"
        description="Was Sie vor einer Kontaktaufnahme wissen sollten: Bedeutung von Prüfstatus, Preisangaben, Datenschutz, Einvernehmlichkeit und respektvoller Umgang."
      />
      <LuxuryHeader />

      <main className="max-w-5xl mx-auto px-6 sm:px-10 py-10 space-y-10">
        <section className="space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#E8DEC8] text-[#5C4722] text-[11px] font-bold uppercase tracking-wider">
            <span>ORIENTIERUNG, SICHERHEIT & ETIKETTE</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#141821]">
            Was sollte ich vor einer Entscheidung verstehen?
          </h1>
          <p className="text-base text-stone-600 leading-relaxed max-w-3xl">
            Eine transparente Übersicht über die Bedeutung unserer Kennzeichnungen, den Unterschied zwischen eigenen Profilen und externen Quellen sowie Grundregeln für einen sicheren, respektvollen Umgang.
          </p>
        </section>

        {/* 1. Was die Kennzeichnungen genau bedeuten (und was nicht!) */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-5">
          <h2 className="text-2xl font-serif font-bold text-[#141821]">
            1. Unsere 5 Status- und Herkunfts-Kennzeichnungen
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div className="p-4 rounded-xl bg-[#F6F5F1] border border-stone-200 space-y-1">
              <div className="font-bold text-[#146C32]">● Jetzt verfügbar (mit Zeitangabe)</div>
              <p className="text-stone-600 leading-relaxed">
                Vom Anbieter aktiv in seinem Konto bestätigt (z.B. „Bestätigt vor 6 Min.“). Der Status läuft nach 4 Stunden automatisch ab. Er ist ein Verfügbarkeitssignal, aber noch keine verbindliche Terminzusage.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F5F1] border border-stone-200 space-y-1">
              <div className="font-bold text-[#1E4276]">● Online</div>
              <p className="text-stone-600 leading-relaxed">
                Zeigt an, dass das betreffende Konto kürzlich auf unserer Plattform aktiv war. Ein blosser Datenimport löst niemals ein Online-Signal aus.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F5F1] border border-stone-200 space-y-1">
              <div className="font-bold text-[#8C6B32]">✓ Identität geprüft</div>
              <p className="text-stone-600 leading-relaxed">
                Volljährigkeit (18+) und Berechtigung zur Bildnutzung wurden von uns dokumentiert geprüft. Dies ist nicht käuflich und ersetzt nicht die eigene Sorgfalt beim Treffen.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#F6F5F1] border border-stone-200 space-y-1">
              <div className="font-bold text-[#141821]">Selbst verwaltet vs. Externe Quelle</div>
              <p className="text-stone-600 leading-relaxed">
                „Selbst verwaltet“ bedeutet, dass der Anbieter seine Angaben direkt bei uns pflegt. „Externe Quelle“ verweist auf ein öffentlich erreichbares Drittverzeichnis, dessen Verfügbarkeit uns nicht bekannt ist.
              </p>
            </div>
          </div>
        </section>

        {/* 2. Preise, Dauer & Rahmenbedingungen richtig lesen */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#141821]">
            2. Veröffentlichte Preise, Dauer und Konditionen richtig einordnen
          </h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed">
            <li>• <strong>Zeiteinheit prüfen:</strong> Achten Sie darauf, ob sich ein genannter Betrag auf <strong>60 Minuten</strong> oder <strong>30 Minuten</strong> bezieht. In unserer Vergleichsansicht weisen wir die zugehörige Dauer stets mit aus.</li>
            <li>• <strong>Incall vs. Outcall (Hotel-/Hausbesuch):</strong> Bei Besuchen im Hotel oder zu Hause können Fahrtkosten oder Mindestbuchungsdauern hinzukommen.</li>
            <li>• <strong>Vorab klären:</strong> Klären Sie gewünschte Dauer, Honorar und Rahmenbedingungen sachlich und respektvoll vor dem Treffen. Leisten Sie keine anonymen Vorauszahlungen per Gutscheinkarte oder Auslandsüberweisung.</li>
          </ul>
        </section>

        {/* 3. Einvernehmlichkeit, Datenschutz & Meldewege */}
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-4">
          <h2 className="text-2xl font-serif font-bold text-[#141821]">
            3. Respekt, Einvernehmlichkeit und sofortiger Meldeweg
          </h2>
          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
            Jede Vereinbarung zwischen Erwachsenen beruht auf gegenseitigem Respekt, klaren Grenzen und Freiwilligkeit. Wenn Ihnen ein fehlerhafter Eintrag, eine missbräuchliche Bildverwendung oder ein Verstoss auffällt, können Sie diesen jederzeit ohne Registrierung über unser Meldeformular melden.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link href="/" className="px-5 py-2.5 rounded-xl bg-[#152839] text-white font-bold text-xs">
              Zurück zur Profilübersicht →
            </Link>
            <Link href="/reviews" className="px-5 py-2.5 rounded-xl bg-[#F3EFE6] border border-[#DFD5C0] text-[#5C4722] font-bold text-xs">
              Zum Schweizer Portalvergleich →
            </Link>
            <Link href="/report" className="px-5 py-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 font-bold text-xs">
              Eintrag melden oder entfernen lassen →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}