import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { BrandLogo } from "@/components/BrandLogo";

export default function ForClientsLandingPage() {
  return (
    <div className="min-h-screen bg-[#0D1826] text-white">
      <SEO
        title="Für Gentlemen & Kunden: Sicher, diskret & ohne Fake-Profile buchen | iwantsexnow.ch"
        description="Warum Schweizer Gentlemen iwantsexnow.ch nutzen: Visuelle Suche über 7.021+ Profile, offizieller Verifizierungs-Haken (✓), 3-Min. Live-Cam Vorab-Check und Fixpreis-Garantie."
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08101A]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <BrandLogo compact />
          </Link>
          <div className="flex items-center gap-3 text-xs font-bold">
            <Link href="/advertise" className="text-emerald-300 hover:underline hidden sm:inline">
              Für Models & Studios →
            </Link>
            <Link href="/reviews" className="text-sky-300 hover:underline hidden sm:inline">
              Top 10 Portal-Reviews
            </Link>
            <Link href="/" className="px-4 py-2 rounded-xl bg-[#C8A97E] text-[#0D1826]">
              🔍 Direkt zur visuellen Suche
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-14">
        <section className="text-center max-w-4xl mx-auto space-y-4">
          <span className="inline-block px-4 py-1 rounded-full bg-[#C8A97E]/15 border border-[#C8A97E]/40 text-[#C8A97E] text-xs font-bold uppercase tracking-wider">
            🇨🇭 Der Schweizer Gentleman-Standard 2026
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold leading-tight">
            Schluss mit 20 offenen Browser-Tabs, veralteten Fotos und versteckten Aufpreisen im Hotelzimmer.
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Erfahre, wie <strong>iwantsexnow.ch</strong> den gesamten Schweizer Escort- & Erotikmarkt (7.021+ Profile & 216 Clubs) an einem Ort bündelt – mit 4 Sicherheits-Garantien für diskrete Kunden.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-3xl bg-[#111F30] border border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase text-sky-400">USP #1 · Echtheits-Garantie</div>
            <h2 className="text-2xl font-serif font-bold">
              Der offizielle Verifizierungs-Haken (✓) – wie bei Instagram & YouTube
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Auf klassischen Portalen weisst du nie, ob die Fotos 8 Jahre alt oder aus dem Internet kopiert sind. Unser blauer/goldener <strong>✓ Offiziell-Haken</strong> direkt auf dem Profilbild garantiert dir: Diese Anbieterin hat sich bei uns persönlich registriert, ihre Schweizer Rufnummer und ihre Original-Fotos per Tagescode-Selfie bestätigt.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111F30] border border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase text-emerald-400">USP #2 · Echtzeit-Verfügbarkeit</div>
            <h2 className="text-2xl font-serif font-bold">
              🟢 Grüner Live-Status direkt auf dem Bild statt stundenlangem Warten
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Nichts ist frustrierender, als 10 Nummern auf WhatsApp anzuschreiben und keine Antwort zu bekommen. Unser <strong>🟢 ONLINE · VERFÜGBAR</strong>-Badge direkt auf dem Foto zeigt dir in Echtzeit, wer in Zürich, Zug, Basel oder Genf <strong>genau jetzt</strong> für ein Date oder einen Hotel-Besuch bereit ist.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111F30] border border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase text-rose-400">USP #3 · Vorab-Video-Check & VIP-Tresor</div>
            <h2 className="text-2xl font-serif font-bold">
              🔴 3-Minuten 1:1 Live-Cam Check & unzensierte Vorab-Videos
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Du möchtest vor einem CHF 500+ Hotel-Date 100% sicher sein, dass die Chemie stimmt? Starte direkt im Browser einen anonymen <strong>3-Minuten 1:1 Video-Call (Kamera bei dir auf Wunsch aus!)</strong> oder schalte im <strong>VIP Content Tresor</strong> aktuelle unzensierte 4K-Videos der Dame frei.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#111F30] border border-white/10 space-y-3">
            <div className="text-xs font-bold uppercase text-[#C8A97E]">USP #4 · Schweizer Fixpreis-Schutz</div>
            <h2 className="text-2xl font-serif font-bold">
              Transparente Komplettpreise ohne unangenehme Nachverhandlungen
            </h2>
            <p className="text-xs sm:text-sm text-gray-300">
              Viele Inserate auf Drittportalen locken mit „CHF 150“, verlangen vor Ort aber plötzlich für jeden Standard-Wunsch horrende Extras. Mit unserem <strong>Endpreis-Rechner & Fixpreis-Zertifikat</strong> ist der Gesamtpreis vor dem Treffen verbindlich fixiert.
            </p>
          </div>
        </section>

        <section className="p-8 rounded-3xl bg-gradient-to-r from-[#111F30] to-[#08101A] border border-[#C8A97E]/50 text-center space-y-4">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold">
            Bereit für die einfachste visuelle Suche der Schweiz?
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 max-w-xl mx-auto">
            Klicke einfach auf dein gewünschtes Bild (Blonde, Latina, Ebony, GFE, Tantra-Massage oder Live-Cam) – komplett ohne Tippen und 100% anonym.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link href="/" className="px-7 py-3.5 rounded-2xl bg-[#C8A97E] text-[#0D1826] font-extrabold text-sm">
              🔍 Jetzt visuelle Suche starten (7.021+ Profile) →
            </Link>
            <Link href="/hotels" className="px-6 py-3.5 rounded-2xl bg-white/10 border border-white/15 text-white font-bold text-sm">
              🏨 Diskrete Day-Use Hotels & Suiten ansehen
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}