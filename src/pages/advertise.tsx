import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { BrandLogo } from "@/components/BrandLogo";

export default function AdvertiseForModelsPage() {
  const [datesPerWeek, setDatesPerWeek] = useState(4);
  const [avgRateChf, setAvgRateChf] = useState(450);
  const [lockedSalesPerMonth, setLockedSalesPerMonth] = useState(25);
  const [liveCamCallsPerMonth, setLiveCamCallsPerMonth] = useState(15);

  const directBookingMonthly = datesPerWeek * 4 * avgRateChf;
  const lockedContentMonthly = Math.round(lockedSalesPerMonth * 29 * 0.8);
  const liveCamMonthly = Math.round(liveCamCallsPerMonth * 49 * 0.8);
  const totalMonthlyChf = directBookingMonthly + lockedContentMonthly + liveCamMonthly;

  return (
    <div className="min-h-screen bg-[#0D1826] text-white">
      <SEO
        title="Für Models, Escorts & Studios: Warum auf iwantsexnow.ch inserieren? (1. Monat Gratis)"
        description="Mehr Direktbuchungen, 0% Vermittlungsprovision, offizieller Verifizierungs-Haken (✓), Locked VIP Videos verkaufen & 1:1 Live-Cam. Jetzt 1. Monat 100% kostenlos starten!"
      />

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08101A]/95 backdrop-blur">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/">
            <BrandLogo compact />
          </Link>
          <div className="flex items-center gap-3 text-xs font-bold">
            <Link href="/for-clients" className="text-gray-300 hover:text-white hidden sm:inline">
              Für Kunden →
            </Link>
            <Link href="/reviews" className="text-sky-300 hover:underline hidden sm:inline">
              Portal-Vergleich (Wir vs. Xdate)
            </Link>
            <Link
              href="/create-post"
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold"
            >
              🎁 1. Monat Gratis starten
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-10 space-y-16">
        {/* HERO SECTION WITH H1 */}
        <section className="text-center max-w-4xl mx-auto space-y-5">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/15 border border-emerald-400/40 text-emerald-300 text-xs font-extrabold uppercase tracking-wider">
            🎁 Launch-Incentive: Erster Monat 100% kostenlos + CHF 50 Startguthaben
          </span>
          <h1 className="text-3xl sm:text-5xl font-serif font-bold tracking-tight leading-tight">
            Warum sich Schweizer Top-Models & Escorts bei <span className="text-[#C8A97E]">iwantsexnow.ch</span> registrieren – selbst wenn sie schon auf Xdate sind.
          </h1>
          <p className="text-sm sm:text-base text-gray-300 max-w-2xl mx-auto">
            Klassische Portale kassieren jeden Monat hunderte Franken für Push-Boosts, bieten dir aber weder eigene Statistiken noch digitale Zusatzeinnahmen. Bei uns übernimmst du dein Profil in 30 Sekunden kostenlos und verdienst auf <strong>3 Wegen gleichzeitig</strong>.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              href="/create-post"
              className="px-7 py-3.5 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            >
              ✓ Jetzt kostenlos registrieren / Index-Profil übernehmen (CHF 0 im 1. Monat)
            </Link>
            <Link
              href="/creator-dashboard"
              className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm"
            >
              📊 Live-Demo des Model-Dashboards ansehen
            </Link>
          </div>
        </section>

        {/* H2: INDEX PROFILE VS REGISTERED OFFICIAL PROFILE */}
        <section className="space-y-6">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-serif font-bold">
              Was ist der Unterschied: <span className="text-gray-400">Nur im Index</span> vs. <span className="text-sky-400">Offiziell Registriert (✓)</span>?
            </h2>
            <p className="text-xs sm:text-sm text-gray-300 mt-2">
              Wenn wir dein Inserat von Xdate oder Fgirl indexieren, sammelt es bei uns bereits organische Ansichten und Kunden-Klicks. Aber erst mit deiner kostenlosen Registrierung schaltest du die echten Geld-Motoren frei:
            </p>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-[#C8A97E]/40 bg-[#111F30] shadow-2xl">
            <table className="w-full text-left border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-white/10 bg-[#08101A]">
                  <th className="p-4 font-bold text-gray-300">Funktion & Verdienst-Hebel</th>
                  <th className="p-4 font-bold text-gray-400">Passives Index-Profil (z.B. nur Xdate)</th>
                  <th className="p-4 font-bold text-emerald-300 bg-emerald-500/10">
                    ✓ Offiziell Registriert bei iwantsexnow.ch
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="p-4 font-bold">Offizieller Verifizierungs-Haken (✓ wie Meta/YouTube)</td>
                  <td className="p-4 text-gray-400">❌ Kein Haken („Ungeprüfter Index-Eintrag“)</td>
                  <td className="p-4 text-sky-300 font-bold bg-emerald-500/5">
                    ✅ Blauer/Goldener ✓ Offiziell-Haken direkt auf deinem Foto & Namen
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">🟢 „Jetzt Online / Verfügbar“ Badge auf dem Bild</td>
                  <td className="p-4 text-gray-400">❌ Nicht möglich</td>
                  <td className="p-4 text-emerald-300 font-bold bg-emerald-500/5">
                    ✅ 1-Klick Live-Schalter im Dashboard → leuchtet sofort grün auf deinem Bild
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Kunden-Anfragen & Telefonnummer</td>
                  <td className="p-4 text-gray-400">🔒 Klicks werden gezählt, aber im Tresor zurückgehalten</td>
                  <td className="p-4 text-white font-bold bg-emerald-500/5">
                    ✅ 100% Direkt-Kontakt (WhatsApp / Anruf / Fixpreis-Buchung) mit 0% Provision
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">🔒 Locked VIP Content verkaufen (Fotos & 4K Videos)</td>
                  <td className="p-4 text-gray-400">❌ Auf Xdate/Fgirl nicht möglich (CHF 0)</td>
                  <td className="p-4 text-purple-200 font-bold bg-emerald-500/5">
                    ✅ Verkaufe gesperrte Fotos/Videos für CHF 19–99 direkt auf deinem Profil (80% Auszahlung!)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">🔴 Bezahlte 1:1 Live-Cam & Video Vibe-Checks</td>
                  <td className="p-4 text-gray-400">❌ Nicht vorhanden</td>
                  <td className="p-4 text-rose-200 font-bold bg-emerald-500/5">
                    ✅ Verdiene CHF 29–139 pro kurzem Video-Call direkt im Browser (ohne App!)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">📊 Echtzeit-Statistiken & Impression-Analytics</td>
                  <td className="p-4 text-gray-400">❌ Blindflug</td>
                  <td className="p-4 text-white font-bold bg-emerald-500/5">
                    ✅ Exakte Kurven: Wie viele Impressions, Such-Klicks, WhatsApp-Taps & Umsätze
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">🏆 Gesponserte Top-Rankings & Live-Bidding</td>
                  <td className="p-4 text-gray-400">❌ Wird immer hinter registrierten Models gelistet</td>
                  <td className="p-4 text-[#C8A97E] font-bold bg-emerald-500/5">
                    ✅ Automatischer Vorrang + Live-Bidding auf Platz 1–3 in deiner Stadt (nach Dauer oder Impressions)
                  </td>
                </tr>
                <tr>
                  <td className="p-4 font-bold">Preis zum Starten</td>
                  <td className="p-4 text-gray-400">Xdate kostet CHF 300–700/Mt.</td>
                  <td className="p-4 text-emerald-300 font-extrabold bg-emerald-500/10">
                    🎁 1. Monat 100% KOSTENLOS (inkl. CHF 50 Start-Credits)
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* H2: INTERACTIVE CREATOR REVENUE CALCULATOR */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#111F30] to-[#08101A] border border-[#C8A97E]/50 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-[#C8A97E]">
                💰 Interaktiver Einkommens-Rechner für Models
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold">
                Berechne dein monatliches Einkommens-Potenzial auf iwantsexnow.ch
              </h2>
              <p className="text-xs sm:text-sm text-gray-300">
                Durch die Kombination aus <strong>provisionsfreien Direkt-Dates</strong> + <strong>Locked VIP Videos (Pay-per-View)</strong> + <strong>1:1 Live-Cam Sessions</strong> verdienen registrierte Models im Schnitt CHF 2.400+ pro Monat zusätzlich – selbst an Tagen ohne Hotel-Date!
              </p>

              <div className="space-y-4 pt-2">
                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Direkt-Dates pro Woche:</span>
                    <span className="text-[#C8A97E]">{datesPerWeek} Dates / Woche</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={15}
                    value={datesPerWeek}
                    onChange={(e) => setDatesPerWeek(Number(e.target.value))}
                    className="w-full accent-[#C8A97E]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Dein Ø Honorar pro Date (0% Provision!):</span>
                    <span className="text-[#C8A97E]">CHF {avgRateChf}</span>
                  </div>
                  <input
                    type="range"
                    min={200}
                    max={1000}
                    step={50}
                    value={avgRateChf}
                    onChange={(e) => setAvgRateChf(Number(e.target.value))}
                    className="w-full accent-[#C8A97E]"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Verkaufte Locked VIP Foto/Video-Sets pro Monat (à CHF 29):</span>
                    <span className="text-purple-300">{lockedSalesPerMonth} Verkäufe / Mt.</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    step={5}
                    value={lockedSalesPerMonth}
                    onChange={(e) => setLockedSalesPerMonth(Number(e.target.value))}
                    className="w-full accent-purple-400"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-bold mb-1">
                    <span>Kurze 1:1 Live-Cam Sessions pro Monat (à CHF 49):</span>
                    <span className="text-rose-300">{liveCamCallsPerMonth} Calls / Mt.</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={60}
                    step={5}
                    value={liveCamCallsPerMonth}
                    onChange={(e) => setLiveCamCallsPerMonth(Number(e.target.value))}
                    className="w-full accent-rose-400"
                  />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-[#08101A] border border-[#C8A97E]/40 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Deine geschätzten Monats-Einnahmen
              </div>
              <div className="text-4xl sm:text-5xl font-serif font-bold text-emerald-400">
                CHF {totalMonthlyChf.toLocaleString("de-CH")}.– <span className="text-sm font-sans text-gray-400">/ Monat</span>
              </div>
              <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between">
                  <span className="text-gray-300">Direkt-Buchungen (100% für dich, 0% Cut):</span>
                  <span className="font-bold text-white">CHF {directBookingMonthly.toLocaleString("de-CH")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-300">Passives Einkommen (Locked VIP Videos, 80%):</span>
                  <span className="font-bold text-purple-300">+ CHF {lockedContentMonthly.toLocaleString("de-CH")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-300">1:1 Live-Cam & Video Vibe-Checks (80%):</span>
                  <span className="font-bold text-rose-300">+ CHF {liveCamMonthly.toLocaleString("de-CH")}</span>
                </div>
              </div>
              <Link
                href="/create-post"
                className="block w-full py-3.5 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#0D1826] font-extrabold text-center text-sm mt-4"
              >
                🚀 Jetzt in 60 Sek. Profil aktivieren (1. Monat Gratis) →
              </Link>
            </div>
          </div>
        </section>

        {/* H2: SPONSORED RANKINGS & BIDDING MODEL EXPLAINED */}
        <section className="space-y-6">
          <h2 className="text-2xl sm:text-3xl font-serif font-bold text-center">
            Volle Kostenkontrolle nach deinem Gratis-Monat: Unser faires Ranking- & Bidding-Modell
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-emerald-300 uppercase">Option 1 · Für Einsteiger</span>
              <h3 className="text-xl font-bold">30 Tage VIP Gratis-Test</h3>
              <div className="text-2xl font-extrabold text-[#C8A97E]">CHF 0.–</div>
              <p className="text-xs text-gray-300">
                Übernimmt dein bestehendes Profil oder erstellt ein neues inkl. offiziellem ✓ Haken, Online-Schalter, Statistik-Dashboard und Verkauf von Locked Videos. Keine automatische Abo-Falle!
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border-2 border-[#C8A97E] space-y-2">
              <span className="text-xs font-bold text-[#C8A97E] uppercase">Option 2 · Garantierte Reichweite</span>
              <h3 className="text-xl font-bold">Impressions- oder Zeit-Boost</h3>
              <div className="text-2xl font-extrabold text-[#C8A97E]">Ab CHF 29.–</div>
              <p className="text-xs text-gray-300">
                Buche gezielt <strong>24h / 7 Tage Top-Platzierung</strong> in deiner Stadt (z.B. Zürich Freitagabend) ODER zahle fair nach garantierten <strong>Top-Impressions (z.B. 5.000 Einblendungen ganz oben)</strong>.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-[#111F30] border border-white/10 space-y-2">
              <span className="text-xs font-bold text-sky-300 uppercase">Option 3 · Live Pole-Position</span>
              <h3 className="text-xl font-bold">Live-Bidding für Platz 1–3</h3>
              <div className="text-2xl font-extrabold text-[#C8A97E]">Flexibles Gebot</div>
              <p className="text-xs text-gray-300">
                Wie bei Google Ads bestimmst du im Dashboard selbst per Schieberegler, was dir <strong>Platz 1 in Zürich, Zug oder Basel</strong> heute wert ist – jederzeit mit 1 Klick pausierbar!
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}