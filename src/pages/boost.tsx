import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Zap, Sparkles, CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

const BOOST_PACKAGES = [
  {
    id: "boost-24h",
    title: "24-Stunden Kantons-Top-Spot",
    priceChf: 19,
    duration: "24 Stunden",
    features: [
      "Platzierung in den Top-Positionen deines Kantons (z.B. ZG oder ZH)",
      "Grünes 'Jetzt für 4h verfügbar' Live-Badge im Radar",
      "100% direkter +41 WhatsApp- & Telefon-Kontakt ohne Provision",
    ],
  },
  {
    id: "boost-3d",
    title: "3-Tage Weekend & Business Boost",
    priceChf: 45,
    duration: "72 Stunden",
    popular: true,
    features: [
      "Permanente Top-Rotation im Kantons-Ranking (/rankings) & auf den 2D-Seiten",
      "Hervorhebung im 24h-Story-Feed (/stories) & im Quick-Matcher (/matches)",
      "Priorisierte Anzeige bei Outcall- & Hotel-Anfragen",
    ],
  },
  {
    id: "boost-7d",
    title: "7-Tage VIP Kantons-Dominanz",
    priceChf: 89,
    duration: "7 Tage",
    features: [
      "Maximale Sichtbarkeit auf der Startseite, im Kantons-Kompass & in allen Rubriken",
      "Goldenes '★ Top-Empfehlung' Siegel auf deiner Profilkarte",
      "Inklusive kostenlosem Foto-Echtheits-Check im Anbieter-Cockpit",
    ],
  },
];

export default function BoostProfilePage() {
  const [profileIdInput, setProfileIdInput] = useState("");

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Kantonaler Profil-Boost & Top-Spot Platzierung (Zug, Zürich, Luzern) | iwantsexnow.ch"
        description="Hebe dein Schweizer Escort- oder Studio-Profil auf Platz 1 in deinem Kanton. Faire Tages- und Wochenpauschalen per TWINT ohne Vermittlungsprovision."
        url="https://iwantsexnow.ch/boost"
      />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <Zap size={14} /> MAXIMALE SICHTBARKEIT IN DEINEM KANTON · 0% BUCHUNGSPROVISION
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Profil-Booster & Kantonale Top-Spot-Platzierung
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Kein Abo-Zwang: Buche deinen Top-Spot flexibel für 24 Stunden, 3 Tage oder 7 Tage direkt per TWINT oder Karte.
            </p>
          </div>
          <Link href="/register" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#C8A97E]">
            Noch kein Profil? Kostenlos starten →
          </Link>
        </section>

        <div className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-gray-300">Optional: Deine Profil-ID oder Name für die direkte Zuordnung:</span>
          <input
            type="text"
            value={profileIdInput}
            onChange={(e) => setProfileIdInput(e.target.value)}
            placeholder="z.B. rosalon-188 oder Anzeigename..."
            className="w-full sm:w-80 rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2 text-xs text-white"
          />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BOOST_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between gap-6 ${
                pkg.popular ? "bg-[#171E2E] border-[#C8A97E]" : "bg-[#121722] border-white/10"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-white/10 text-[#C8A97E] text-[10px] font-extrabold uppercase">
                    {pkg.duration}
                  </span>
                  {pkg.popular && (
                    <span className="px-2.5 py-1 rounded bg-emerald-500 text-[#07120B] text-[10px] font-extrabold uppercase">
                      Meistgewählt
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-serif font-bold text-white">{pkg.title}</h2>
                <div className="text-3xl font-extrabold text-[#C8A97E]">
                  CHF {pkg.priceChf}.– <span className="text-xs text-gray-400 font-normal">einmalig</span>
                </div>
                <ul className="space-y-2.5 text-xs text-gray-300 pt-2 border-t border-white/10">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-emerald-400 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/checkout?profileId=${encodeURIComponent(profileIdInput || "boost-order")}&amount=${pkg.priceChf}`}
                className="w-full py-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider text-center block"
              >
                ⚡ Jetzt für CHF {pkg.priceChf}.– aktivieren →
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}