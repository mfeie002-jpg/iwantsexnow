import { BrandLogo } from "@/components/BrandLogo";
import { useState } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
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
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Schweizer Escort, Gigolo & English Expat Guides (Magazin & Preis-Report 2026) | iWantSexNow.ch"
        description="Offizielle Schweizer Ratgeber (Deutsch & English): Escort Preise 2026, English Tourist & Hotel Outcall Guide, WEF Davos / St. Moritz, TWINT & USDT Zahlung und Einsteiger-Guides."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
            <BookOpen size={13} className="mr-1.5 inline" /> Swiss Shield Magazin · Deutsch & English (For Tourists & Expats)
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black">
            Schweizer Insider-Guides, Preis-Reports & English Visitor Briefing
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Wähle unten einen unserer detaillierten Ratgeber für <strong>internationale Gäste (English)</strong>, <strong>Schweizer Gentlemen</strong>, <strong>Neueinsteigerinnen</strong> und <strong>Gigolos / Callboys</strong>:
          </p>
        </div>

        {/* Dedicated SEO Blog Articles Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {articles.map((art) => (
            <Card
              key={art.slug}
              className="bg-[#09131E] border border-[#C69C6D]/45 hover:border-[#D5A021] p-6 rounded-2xl text-white flex flex-col justify-between space-y-5 shadow-2xl transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px]">
                    {art.category}
                  </Badge>
                  <span className="text-xs text-gray-400">{art.readTime}</span>
                </div>
                <Link href={`/guides/${art.slug}`} className="hover:text-[#D5A021]">
                  <h2 className="text-xl sm:text-2xl font-serif font-black leading-snug">
                    {art.title}
                  </h2>
                </Link>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {art.heroIntro}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <Button
                  className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black text-xs py-5"
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
        <Card className="bg-gradient-to-br from-[#13263A] to-[#09131E] border-2 border-[#C69C6D] p-6 md:p-8 rounded-2xl text-white space-y-6 shadow-2xl">
          <div>
            <Badge className="bg-[#C69C6D] text-[#0D1B2A] font-black mb-2">
              <Calculator size={12} className="mr-1 inline" /> Interaktiver Schweizer Verdienst-Rechner (Escorts & Gigolos)
            </Badge>
            <h2 className="text-2xl font-serif font-black">
              Wie viel verdienst du selbstständig auf iWantSexNow.ch vs. klassische Agentur?
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-4 bg-black/40 p-4 rounded-xl border border-white/10 text-xs">
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-300 font-bold">Dates pro Woche:</span>
                <strong className="text-[#D5A021]">{datesPerWeek} Dates / Woche</strong>
              </div>
              <input
                type="range"
                min={1}
                max={20}
                value={datesPerWeek}
                onChange={(e) => setDatesPerWeek(Number(e.target.value))}
                className="w-full accent-[#C69C6D] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-300 font-bold">Dein Stundentarif (60m):</span>
                <strong className="text-[#D5A021]">CHF {avgRateChf}</strong>
              </div>
              <input
                type="range"
                min={250}
                max={800}
                step={50}
                value={avgRateChf}
                onChange={(e) => setAvgRateChf(Number(e.target.value))}
                className="w-full accent-[#C69C6D] cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-gray-300 font-bold">Video-/Cam-Verkäufe / Woche:</span>
                <strong className="text-emerald-400">{vaultUnlocksPerWeek}x (à CHF 29)</strong>
              </div>
              <input
                type="range"
                min={0}
                max={40}
                step={2}
                value={vaultUnlocksPerWeek}
                onChange={(e) => setVaultUnlocksPerWeek(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4 text-center">
            <div className="p-4 rounded-xl bg-black/50 border border-white/10">
              <div className="text-xs text-gray-400">Bei klassischer Agentur (45% Abzug)</div>
              <div className="text-xl font-black text-gray-400 line-through mt-1">
                CHF {traditionalAgencyNet.toLocaleString("de-CH")} / Mt.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-950/50 border-2 border-emerald-400">
              <div className="text-xs text-emerald-300 font-bold uppercase">Dein Netto auf iWantSexNow.ch</div>
              <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-1">
                CHF {totalMonthlyNetWithUs.toLocaleString("de-CH")} / Mt.
              </div>
            </div>
            <div className="p-4 rounded-xl bg-[#C69C6D]/20 border border-[#C69C6D] flex flex-col justify-center">
              <div className="text-xs text-[#D5A021] font-bold uppercase">Dein Mehrverdienst jeden Monat</div>
              <div className="text-2xl font-black text-white mt-1">
                +CHF {extraMonthlyProfit.toLocaleString("de-CH")}
              </div>
              <Link href="/create-post" className="text-[11px] text-[#D5A021] underline font-bold mt-1">
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