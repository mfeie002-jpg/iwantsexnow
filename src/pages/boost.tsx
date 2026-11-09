import React, { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Kantonaler Profil-Boost & Top-Spot Platzierung (Zug, Zürich, Luzern) | iwantsexnow.ch"
        description="Hebe dein Schweizer Escort- oder Studio-Profil auf Platz 1 in deinem Kanton. Faire Tages- und Wochenpauschalen per TWINT ohne Vermittlungsprovision."
        url="https://iwantsexnow.ch/boost"
      />
      <LuxuryHeader />

      <PageIntro tone="blush" note="Ganz oben stehen" art="book" title={<>Profil-Booster & Kantonale Top-Spot-Platzierung</>}
        lead={<>Kein Abo-Zwang: Buche deinen Top-Spot flexibel für 24 Stunden, 3 Tage oder 7 Tage direkt per TWINT oder Karte.</>}>
        <Link href="/register" className="px-4 py-2.5 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-bold text-kirsche">
            Noch kein Profil? Kostenlos starten →
          </Link>
      </PageIntro>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        

        <div className="p-4 rounded-2xl bg-white border border-tinte/20 flex flex-wrap items-center justify-between gap-3">
          <span className="text-[13px] font-bold text-gray-700">Optional: Deine Profil-ID oder Name für die direkte Zuordnung:</span>
          <input
            type="text"
            value={profileIdInput}
            onChange={(e) => setProfileIdInput(e.target.value)}
            placeholder="z.B. rosalon-188 oder Anzeigename..."
            className="w-full sm:w-80 rounded-xl bg-papier border border-tinte/25 px-3.5 py-2 text-[13px] text-tinte"
          />
        </div>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {BOOST_PACKAGES.map((pkg) => (
            <div
              key={pkg.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between gap-6 ${
                pkg.popular ? "bg-white border-kirsche" : "bg-white border-tinte/20"
              }`}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 rounded bg-tinte/[0.06] text-kirsche text-[13px] font-extrabold ">
                    {pkg.duration}
                  </span>
                  {pkg.popular && (
                    <span className="px-2.5 py-1 rounded bg-mint-500 text-tinte text-[13px] font-extrabold ">
                      Meistgewählt
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-serif font-bold text-tinte">{pkg.title}</h2>
                <div className="text-3xl font-extrabold text-kirsche">
                  CHF {pkg.priceChf}.– <span className="text-[13px] text-gray-600 font-normal">einmalig</span>
                </div>
                <ul className="space-y-2.5 text-[13px] text-gray-700 pt-2 border-t border-tinte/20">
                  {pkg.features.map((f, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 size={14} className="text-mint-700 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <Link
                href={`/checkout?profileId=${encodeURIComponent(profileIdInput || "boost-order")}&amount=${pkg.priceChf}`}
                className="w-full py-3 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] text-center block"
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