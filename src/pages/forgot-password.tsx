import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-papier text-tinte flex flex-col justify-between overflow-x-hidden">
      <SEO
        title="Zugang vergessen | iWantSexNow.ch"
        description="Bei iWantSexNow.ch brauchst du kein Passwort. Dein Anbieter-Cockpit öffnest du mit Mobilnummer, Anzeigename oder Profil-ID."
      />
      <LuxuryHeader />

      <PageIntro
        tone="butter"
        note="Kein Passwort, kein Stress"
        art="hanger"
        title={<>Zugang vergessen?</>}
        lead={<>Ein Passwort gibt es bei uns gar nicht. Dein Anbieter-Cockpit öffnest du mit deiner +41-Nummer, deinem Anzeigenamen oder deiner Profil-ID.</>}
      />

      <main className="max-w-2xl w-full mx-auto px-6 py-10 space-y-5">
        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie space-y-4">
          <h2 className="text-xl font-display font-bold">So kommst du wieder rein</h2>
          <ol className="space-y-3 text-sm text-tinte-soft leading-relaxed list-decimal pl-5">
            <li>Auf der Login-Seite die Nummer eingeben, die im Profil hinterlegt ist (z.B. +41 78 …).</li>
            <li>Alternativ den Anzeigenamen oder die Profil-ID eingeben, falls du sie dir notiert hast.</li>
            <li>Deinen persönlichen Cockpit-Link danach als Lesezeichen speichern.</li>
          </ol>
          <Link
            href="/login"
            className="inline-flex items-center justify-center rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-sm px-6 py-3 transition"
          >
            Zum Login
          </Link>
        </section>

        <section className="p-6 sm:p-8 rounded-2xl bg-white border border-linie space-y-3">
          <h2 className="text-xl font-display font-bold">Nummer oder Profil nicht mehr aktuell?</h2>
          <p className="text-sm text-tinte-soft leading-relaxed">
            Dann melde dich über das Formular. Wir prüfen die Übernahme von Hand und korrigieren oder entfernen den Eintrag.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/report" className="text-sm font-bold text-kirsche-tief underline underline-offset-4">
              Zum Meldeformular
            </Link>
            <Link href="/contact" className="text-sm font-bold text-kirsche-tief underline underline-offset-4">
              Kontakt
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
