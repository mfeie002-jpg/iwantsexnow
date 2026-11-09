import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { BrandLogo } from "@/components/BrandLogo";
import { useState } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Calculator, ArrowRight, Globe } from "lucide-react";
import { SWISS_LONG_TAIL_ARTICLES } from "./[slug]";
import { SeoSiloFooter } from "@/components/marketplace/SeoSiloFooter";

export default function SwissGuidesAndBlogIndexPage() {
  const [datesPerWeek, setDatesPerWeek] = useState<number>(6);
  const [avgRateChf, setAvgRateChf] = useState<number>(450);
  const [vaultUnlocksPerWeek, setVaultUnlocksPerWeek] = useState<number>(10);

  const monthlyDirectChf = datesPerWeek * avgRateChf * 4;
  const monthlyVaultAndCamNetChf = Math.round(vaultUnlocksPerWeek * 29 * 4 * 0.8);
  const totalMonthlyNetWithUs = monthlyDirectChf + monthlyVaultAndCamNetChf;
  const traditionalAgencyNet = Math.round(monthlyDirectChf * 0.55);
  const extraMonthlyProfit = totalMonthlyNetWithUs - traditionalAgencyNet;

  const articles = Object.values(SWISS_LONG_TAIL_ARTICLES);

  return (
    <div className="min-h-screen bg-papier text-tinte">
      <SEO
        title="Schweizer Escort, Gigolo & English Expat Guides (Magazin & Preis-Report 2026) | iWantSexNow.ch"
        description="Offizielle Schweizer Ratgeber (Deutsch & English): Escort Preise 2026, English Tourist & Hotel Outcall Guide, WEF Davos / St. Moritz, TWINT & USDT Zahlung und Einsteiger-Guides."
      />
      <LuxuryHeader />

      <PageIntro tone="butter" note="Gut zu wissen" art="none" title={<>Schweizer Insider-Guides, Preis-Reports & English Visitor Briefing</>}
        lead={<>Wähle unten einen unserer detaillierten Ratgeber für <strong>internationale Gäste (English)</strong>, <strong>Schweizer Gentlemen</strong>, <strong>Neueinsteigerinnen</strong> und <strong>Gigolos / Callboys</strong>:</>} />

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-10">
        

        {/* Dedicated SEO Blog Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <Card
              key={art.slug}
              className="bg-papier border border-kirsche/45 hover:border-kirsche p-6 rounded-2xl text-tinte flex flex-col justify-between space-y-5 shadow-2xl transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-mint-500/20 text-mint-700 border border-mint-500/40 text-[13px]">
                    {art.category}
                  </Badge>
                  <span className="text-[13px] text-gray-600">{art.readTime}</span>
                </div>
                <Link href={`/guides/${art.slug}`} className="hover:text-kirsche">
                  <h2 className="text-xl sm:text-2xl font-serif font-black leading-snug">
                    {art.title}
                  </h2>
                </Link>
                <p className="text-[13px] sm:text-sm text-gray-700 leading-relaxed">
                  {art.heroIntro}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  className="w-full bg-gradient-to-r from-kirsche via-kirsche to-kirsche text-[#ffffff] font-black text-[13px] py-5"
                  asChild
                >
                  <Link href={`/guides/${art.slug}`}>
                    Kompletten Artikel lesen <ArrowRight size={14} className="ml-1.5" />
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>

        {/* Interactive Earnings Calculator */}
        <Card className="bg-gradient-to-br from-white to-papier border-2 border-kirsche p-6 md:p-8 rounded-2xl text-tinte space-y-6 shadow-2xl">
          <div>
            <Badge className="bg-kirsche text-[#ffffff] font-black mb-2">
              <Calculator size={12} className="mr-1 inline" /> Interaktiver Schweizer Verdienst-Rechner (Escorts & Gigolos)
            </Badge>
            <h2 className="text-2xl font-serif font-black">
              Wie viel verdienst du selbstständig auf iWantSexNow.ch vs. klassische Agentur?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 bg-tinte/10 p-4 rounded-xl border border-tinte/20 text-[13px]">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-700 font-bold">Dates pro Woche:</span>
                <strong className="text-kirsche">{datesPerWeek} Dates / Woche</strong>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={datesPerWeek}
                onChange={(e) => setDatesPerWeek(Number(e.target.value))}
                className="w-full accent-[#d92b52] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-700 font-bold">Dein Stundentarif (60m):</span>
                <strong className="text-kirsche">CHF {avgRateChf}</strong>
              </div>
              <input
                type="range"
                min={250}
                max={800}
                step={50}
                value={avgRateChf}
                onChange={(e) => setAvgRateChf(Number(e.target.value))}
                className="w-full accent-[#d92b52] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-700 font-bold">Video-/Cam-Verkäufe / Woche:</span>
                <strong className="text-mint-700">{vaultUnlocksPerWeek}x (à CHF 29)</strong>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={2}
                value={vaultUnlocksPerWeek}
                onChange={(e) => setVaultUnlocksPerWeek(Number(e.target.value))}
                className="w-full accent-mint-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-tinte/10 border border-tinte/20">
              <div className="text-[13px] text-gray-600">Bei klassischer Agentur (45% Abzug)</div>
              <div className="text-xl font-black text-gray-600 line-through mt-1">
                CHF {traditionalAgencyNet.toLocaleString("de-CH")} / Mt.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-mint-100/50 border-2 border-mint-400">
              <div className="text-[13px] text-mint-700 font-bold ">Dein Netto auf iWantSexNow.ch</div>
              <div className="text-2xl sm:text-3xl font-black text-mint-700 mt-1">
                CHF {totalMonthlyNetWithUs.toLocaleString("de-CH")} / Mt.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-kirsche/20 border border-kirsche flex flex-col justify-center">
              <div className="text-[13px] text-kirsche font-bold ">Dein Mehrverdienst jeden Monat</div>
              <div className="text-2xl font-black text-tinte mt-1">
                +CHF {extraMonthlyProfit.toLocaleString("de-CH")}
              </div>
              <Link href="/create-post" className="text-[13px] text-kirsche underline font-bold mt-1">
                Jetzt mit Onboarding-Buddy starten →
              </Link>
            </div>
          </div>
        </Card>
      </main>
      <SeoSiloFooter />
    </div>
  );
}