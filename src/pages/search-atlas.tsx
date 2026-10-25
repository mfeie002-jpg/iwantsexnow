import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { StructuredSchema } from "@/components/StructuredSchema";
import { ArrowUpRight } from "lucide-react";

const USABILITY_TASKS = [
  {
    id: "t1",
    question: "1. Lokal-Einstieg: Kann ein Besucher ohne Umwege ein relevantes lokales Ergebnis erreichen?",
    task: "Aufgabe: Öffne die Startseite und filtere auf 'Basel (BS)' oder rufe direkt /escort-basel auf.",
    targetHref: "/escort-basel",
    targetLabel: "Lokal-Einstieg Basel testen →",
  },
  {
    id: "t2",
    question: "2. Status-Semantik: Wird der Unterschied zwischen 'Jetzt verfügbar', 'Online' und 'Externe Quelle' verstanden?",
    task: "Aufgabe: Klicke auf der Startseite auf 'Status-Hilfe (?)' oder prüfe die Zeitangabe ('Bestätigt vor 6 Min.') auf einer Karte.",
    targetHref: "/",
    targetLabel: "Status-Labels auf Startseite prüfen →",
  },
  {
    id: "t3",
    question: "3. Preis-Vergleichbarkeit: Sind Währung (CHF), Dauer (60 Min. vs. 30 Min.) und fehlende Angaben klar erkennbar?",
    task: "Aufgabe: Wechsle auf der Startseite in die Ansicht '2. Gold-Vergleichsliste' und wähle 2 Profile über '☑ Vergleichen' aus.",
    targetHref: "/",
    targetLabel: "Gold-Vergleichsliste testen →",
  },
  {
    id: "t4",
    question: "4. Quellen-Transparenz: Lassen sich Mehrfach-Inserate unter einem Profil nachvollziehen?",
    task: "Aufgabe: Klicke auf einer Profilkarte unten rechts auf 'X Quellen ansehen →'.",
    targetHref: "/",
    targetLabel: "Quellen-Popover testen →",
  },
  {
    id: "t5",
    question: "5. Kontextuelle Hilfe (Xenia): Hilft die Erklärung am Punkt des Zweifels ohne Pflicht-Konversation?",
    task: "Aufgabe: Öffne sowohl das kleine '?'-Popover an den Ergebnissen als auch die optionale Vollansicht '✨ 4. Xenia Hilfe'.",
    targetHref: "/",
    targetLabel: "Xenia-Hilfe testen →",
  },
  {
    id: "t6",
    question: "6. Nachvollziehbarer Portalvergleich: Sind Quelle, Prüfkriterien und offene Fragen dokumentiert?",
    task: "Aufgabe: Öffne /reviews/xdate-review und prüfe rechts die Spalte 'So ist der Bericht belegt'.",
    targetHref: "/reviews/xdate-review",
    targetLabel: "Beleg-Spalte im Einzelbericht prüfen →",
  },
];

export default function SearchIntentAtlasPage() {
  const [checkedTasks, setCheckedTasks] = useState<string[]>(["t1", "t2", "t3", "t4", "t5", "t6"]);

  const toggleTask = (id: string) => {
    setCheckedTasks((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return (
    <div className="min-h-screen bg-[#F6F5F1] text-[#141821] pb-20">
      <SEO
        title="Search Intent Atlas & Usability-Validierung | iwantsexnow.ch"
        description="Dokumentation der 12 Schweizer Such-Cluster (DE/FR/IT), der 4 Entscheidungs-Momente und der 6 Usability-Validierungsaufgaben."
        noindex
      />
      <StructuredSchema />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-10 space-y-10">
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-widest text-[#8C6B32]">
            IWANTSEXNOW.CH · PRODUKT- & SUCHINTENTIONS-VALIDIERUNG (STAND OKTOBER 2026)
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold text-[#141821]">
            Was der Suchende will. Was die Seite beantworten muss.
          </h1>
          <p className="text-base text-stone-600 max-w-3xl leading-relaxed">
            Interaktive Prüfliste für die 4 Entscheidungs-Phasen (Orient ↔ Narrow ↔ Verify ↔ Decide) und die 6 Validierungs-Aufgaben aus unserem Search Intent Atlas.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { step: "1 · Orient", q: "„Geht es hier um meinen Ort und mein Anliegen?“", sol: "Orts- & Kategorie-Versprechen bleibt bei jedem Einstieg erhalten (DE/FR/IT)." },
            { step: "2 · Narrow", q: "„Welche Angebote kommen in Frage?“", sol: "Schnelle visuelle Auswahl + klare Fakten-Filter ohne Reizüberflutung." },
            { step: "3 · Verify", q: "„Was ist bestätigt und woher stammt es?“", sol: "Zeitstempel ('Bestätigt vor X Min.'), Dauer beim Preis & Quellen-Popover direkt an der Karte." },
            { step: "4 · Decide", q: "„Habe ich genug Sicherheit für den nächsten Schritt?“", sol: "Klare Trennung zwischen 'Privat anfragen' (Direktprofil) und 'Original ansehen' (Externe Quelle)." },
          ].map((st) => (
            <div key={st.step} className="p-5 rounded-2xl bg-white border-t-4 border-[#8C6B32] shadow-sm space-y-2">
              <div className="text-xs font-extrabold uppercase tracking-wider text-[#8C6B32]">{st.step}</div>
              <div className="text-sm font-bold text-[#141821]">{st.q}</div>
              <p className="text-xs text-stone-600 leading-relaxed">{st.sol}</p>
            </div>
          ))}
        </div>

        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-stone-200/90 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#141821]">
                Die 6 Validierungs-Aufgaben (Live-Prüfung)
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Jede Aufgabe testet eine konkrete Anforderung aus dem Search Intent Atlas direkt im Live-Prototyp.
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-[#DDF3E4] text-[#146C32] text-xs font-extrabold">
              {checkedTasks.length} / {USABILITY_TASKS.length} im Prototyp umgesetzt
            </span>
          </div>

          <div className="divide-y divide-stone-200">
            {USABILITY_TASKS.map((item) => {
              const checked = checkedTasks.includes(item.id);
              return (
                <div key={item.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-3">
                    <button
                      type="button"
                      onClick={() => toggleTask(item.id)}
                      className={
                        checked
                          ? "mt-0.5 w-5 h-5 rounded flex items-center justify-center border shrink-0 cursor-pointer bg-[#146C32] border-[#146C32] text-white"
                          : "mt-0.5 w-5 h-5 rounded flex items-center justify-center border shrink-0 cursor-pointer border-stone-400 bg-white"
                      }
                    >
                      {checked && "✓"}
                    </button>
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-[#141821]">{item.question}</div>
                      <div className="text-xs text-stone-600">{item.task}</div>
                    </div>
                  </div>

                  <Link
                    href={item.targetHref}
                    className="px-4 py-2 rounded-xl bg-[#F3EFE6] hover:bg-[#e7decb] text-[#5C4722] text-xs font-bold shrink-0 inline-flex items-center gap-1.5"
                  >
                    <span>{item.targetLabel}</span>
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}