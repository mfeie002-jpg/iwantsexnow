import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";
import { SWISS_LONG_TAIL_ARTICLES } from "./[slug]";
import { SeoSiloFooter } from "@/components/marketplace/SeoSiloFooter";

export default function SwissGuidesAndBlogIndexPage() {
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
      </main>
      <SeoSiloFooter />
    </div>
  );
}