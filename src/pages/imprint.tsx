import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { PageIntro } from "@/components/PageIntro";

const PLACEHOLDERS = [
  "Name oder Firma",
  "Adresse",
  "PLZ und Ort",
  "UID",
  "Vertretungsberechtigte Person",
  "E-Mail",
  "Telefon",
] as const;

export default function CorporateInfoPage() {
  return (
    <div className="min-h-screen bg-papier text-tinte">
      <SEO title="Impressum | iwantsexnow.ch" description="Impressum von iwantsexnow.ch. Die Betreiberangaben folgen." />
      <PageIntro tone="himmel" note="Rechtliches" art="none" title={<>Impressum</>}
        lead={<>Die Pflichtangaben zum Betreiber sind noch nicht eingetragen. Bis dahin steht hier nur der Platzhalter.</>} />

      <main id="main" tabIndex={-1} className="max-w-[1380px] w-full mx-auto px-6 sm:px-10 py-10 space-y-8">
        <section className="max-w-3xl space-y-4 rounded-2xl border border-linie bg-white p-6 sm:p-8">
          <h2 className="font-serif text-xl font-bold text-tinte">Betreiberangaben</h2>
          <p className="text-sm text-tinte/80">Jedes Feld ist ein Platzhalter. Es ist keine Adresse, keine UID und keine Kontaktadresse erfunden.</p>
          <dl className="space-y-3 text-sm">
            {PLACEHOLDERS.map((label) => (
              <div key={label} className="grid gap-1 border-b border-dotted border-tinte/15 pb-3 sm:grid-cols-[220px_1fr]">
                <dt className="font-semibold text-tinte">{label}</dt>
                <dd>Angaben folgen</dd>
              </div>
            ))}
          </dl>
          <p className="text-sm text-tinte/80">Falsche Einträge kannst du ohne diese Angaben melden: <Link href="/report" className="font-bold text-kirsche-tief underline">Meldeformular</Link>.</p>
        </section>
      </main>
    </div>
  );
}
