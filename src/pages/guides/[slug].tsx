import { useRouter } from "next/router";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ShieldCheck,
  Globe,
  Sparkles,
  Calculator,
  Video,
} from "lucide-react";
import { SeoSiloFooter } from "@/components/marketplace/SeoSiloFooter";

export interface LongTailArticle {
  slug: string;
  lang: "de" | "en";
  category: string;
  title: string;
  metaTitle: string;
  metaDescription: string;
  readTime: string;
  targetKeywords: string[];
  heroIntro: string;
  sections: { heading: string; body: string; bullets?: string[] }[];
  ctaLabel: string;
  ctaHref: string;
}

export const SWISS_LONG_TAIL_ARTICLES: Record<string, LongTailArticle> = {
  "english-tourist-expat-escort-guide-switzerland": {
    slug: "english-tourist-expat-escort-guide-switzerland",
    lang: "en",
    category: "🇬🇧 English Visitor & Expat Guide",
    title: "The Ultimate Guide to Booking Verified Escorts & Hotel Outcalls in Switzerland (Zurich, Zug, Geneva & St. Moritz)",
    metaTitle: "English Escort Guide Switzerland (Zurich, Zug, Geneva) – Rates & Hotel Outcalls",
    metaDescription: "Visiting Switzerland? Learn how to book verified English-speaking escorts & gigolos in Zurich, Zug, Basel & Geneva with 100% fixed prices and 1:1 live video verification.",
    readTime: "5 min read",
    targetKeywords: [
      "english speaking escort zurich",
      "hotel outcall escort zug",
      "verified escort geneva",
      "escort zurich airport",
      "swiss escort prices",
    ],
    heroIntro: "Switzerland is one of the safest, most discreet countries in the world for high-class adult companionship. However, international business travelers and expats often face language barriers and inflated agency prices on legacy local portals. Here is how to book safely with a 100% fixed price.",
    sections: [
      {
        heading: "1. Why Legacy Swiss Portals Often Confuse International Guests",
        body: "Platforms like xdate.ch, fgirl.ch, and and6.com list thousands of ads, but the same provider is frequently listed 3 to 5 times under different names and rates. Even worse, advertised base rates (e.g., CHF 300) often exclude standard services like Girlfriend Experience (GFE) or hotel outcall travel.",
        bullets: [
          "iWantSexNow.ch automatically merges duplicate ads by their verified +41 Swiss phone number.",
          "Our All-In Price Calculator lets you select duration (30m, 60m, 2h) and extras upfront so there is zero awkward negotiation in your hotel room.",
          "Filter specifically for fluent English-speaking companions in Zurich, Zug, Cham, Basel, Geneva, Lausanne, St. Moritz, and Zermatt.",
        ],
      },
      {
        heading: "2. Discreet 5-Star Hotel Outcalls (Zurich, Zug, Airport & Alpine Resorts)",
        body: "Most high-class companions in Switzerland offer rapid 20-to-30-minute hotel outcalls directly to business and luxury hotels—including The Dolder Grand, Baur au Lac, Park Hyatt Zurich, Kameha Grand (Airport/Glattpark), Park Hotel Zug, City Garden Zug, and alpine chalets in St. Moritz, Davos, and Zermatt.",
        bullets: [
          "Tip for Hotel Security: Simply share your room number or meet your companion briefly at the hotel bar or elevator lobby.",
          "Accepted Payments: Cash in CHF, EUR (usually accepted 1:1), USD, or discreet crypto transfers (USDT / Bitcoin) in Zug & Zurich.",
        ],
      },
      {
        heading: "3. Eliminate Photo Catfishing with the 3-Minute 1:1 Live-Cam Check",
        body: "Before inviting a companion to your hotel, you can launch an anonymous 3-minute 1:1 Live-Cam Vibe-Check in your browser for CHF 29—and CHF 20 is immediately credited toward your real-life booking!",
      },
    ],
    ctaLabel: "Browse English-Speaking Escorts & Companions Now",
    ctaHref: "/search?q=English",
  },

  "schweizer-escort-preise-2026-vergleich": {
    slug: "schweizer-escort-preise-2026-vergleich",
    lang: "de",
    category: "📊 Offizieller Preis-Report 2026",
    title: "Escort Preise Schweiz 2026: Was kostet 1 Stunde in Zürich, Zug, Basel & im Laufhaus (inkl. Extras)?",
    metaTitle: "Escort Preise Schweiz 2026 (Zürich, Zug, Studio vs. Hotel) | Ehrlicher Vergleich",
    metaDescription: "Was kostet ein Escort in der Schweiz wirklich? Aktuelle Stundentarife 2026 für Zürich, Zug, Cham, Basel & Bern: Studio-Incall vs. Hotel-Outcall, GFE-Extras & Laufhaus-Preise.",
    readTime: "4 Min. Lesezeit",
    targetKeywords: [
      "escort preise schweiz",
      "was kostet ein escort in zürich",
      "escort zug preise",
      "laufhaus preise schweiz",
      "xdate vs fgirl preise",
    ],
    heroIntro: "Auf Schweizer Portalen stehen oft Preise ab CHF 200 oder CHF 250 – doch vor Ort zahlen Kunden plötzlich CHF 550 oder mehr. Unser Daten-Report aus über 260 bereinigten Schweizer Profilen zeigt die echten Endpreise nach Stadt und Dauer.",
    sections: [
      {
        heading: "1. Die echten Durchschnittspreise nach Dauer (Studio vs. Hotel-Outcall)",
        body: "In den Wirtschaftszentren Zürich, Zug, Cham, Pfäffikon SZ, Basel und Genf haben sich im Jahr 2026 klare Richtwerte für seriöse, unabhängige Direktprofile etabliert:",
        bullets: [
          "30 Minuten Studio-Besuch (Incall): CHF 200 bis CHF 300 (in Kontakthäusern wie Haus Aphrodite oder Haus Zeus ab CHF 140–150).",
          "60 Minuten Direktbuchung inkl. GFE & Französisch: CHF 350 bis CHF 500 (bei Agenturen oft CHF 600+ für exakt dieselbe Leistung).",
          "2 Stunden Dinner-Date oder entspanntes Hotel-Outcall: CHF 700 bis CHF 950.",
          "Overnight (10–12 Stunden Begleitung): CHF 1,800 bis CHF 3,500.",
        ],
      },
      {
        heading: "2. Die Kostenfalle mit den 'versteckten Extras' vermeiden",
        body: "Auf klassischen Portalen werden Zungenküsse (ZK), Französisch ohne (FO), Position 69 oder die Anfahrt ins Hotel oft einzeln mit je CHF 50 bis CHF 100 nachberechnet. Mit dem iWantSexNow.ch Endpreis-Rechner wählst du alle gewünschten Leistungen vorab per Klick aus und frierst den Komplettpreis mit deinem Swiss-Shield-Zertifikat (#IW-Code) verbindlich ein.",
      },
    ],
    ctaLabel: "Jetzt echte Endpreise im Live-Rechner vergleichen",
    ctaHref: "/compare-escorts",
  },

  "wef-davos-st-moritz-art-basel-vip-escort": {
    slug: "wef-davos-st-moritz-art-basel-vip-escort",
    lang: "de",
    category: "🏔️ High-Society & Events Schweiz",
    title: "VIP Escort & Chalet-Begleitung für WEF Davos, St. Moritz, Zermatt & Art Basel buchen",
    metaTitle: "VIP Escort WEF Davos, St. Moritz, Zermatt & Art Basel | Diskrete Begleitung",
    metaDescription: "Exklusive mehrsprachige High-Class Escorts, Dinner-Begleiterinnen und Gigolos für das WEF in Davos, St. Moritz Chalets, Zermatt & die Art Basel zum Fixpreis.",
    readTime: "4 Min. Lesezeit",
    targetKeywords: [
      "wef davos escort",
      "escort st moritz chalet",
      "art basel vip escort",
      "escort zermatt hotel",
      "high class dinner date schweiz",
    ],
    heroIntro: "Während internationaler Gipfeltreffen wie dem World Economic Forum (WEF) in Davos, dem White Turf in St. Moritz, der Art Basel oder der Watches & Wonders in Genf steigt die Nachfrage nach mehrsprachigen, absolut diskreten VIP-Begleiterinnen und Gentlemen massiv an.",
    sections: [
      {
        heading: "1. Worauf internationale VIP-Gäste in St. Moritz, Davos & Zermatt achten",
        body: "In 5-Sterne-Häusern wie dem Badrutt's Palace, Kulm Hotel, AlpenGold Davos oder The Omnia Zermatt ist stilsicheres Auftreten, Mehrsprachigkeit (Englisch, Französisch, Deutsch, Russisch, Spanisch) und absolute Vertraulichkeit (NDA-Niveau) entscheidend.",
        bullets: [
          "100% Direktbuchung ohne Vermittlungs-Agentur, die 50% Aufschlag verlangt.",
          "Vorab-Auswahl per 3-Minuten 1:1 Video-Call: Überzeuge dich vor der Anreise ins Chalet live von Aussehen, Stil und Konversation.",
          "Nutze unseren anonymen VIP-Concierge (/events), um dein Wunsch-Budget für 2 Stunden, einen Abend oder ein ganzes Wochenende auszuschreiben.",
        ],
      },
    ],
    ctaLabel: "VIP-Profile für St. Moritz, Davos & Schweiz öffnen",
    ctaHref: "/orte/st-moritz-davos",
  },

  "escort-twint-crypto-usdt-diskret-bezahlen": {
    slug: "escort-twint-crypto-usdt-diskret-bezahlen",
    lang: "de",
    category: "💳 Diskretion & Zahlung Schweiz",
    title: "Escort in Zürich & Zug diskret bezahlen: Bar (CHF/EUR), TWINT oder Krypto (USDT / Bitcoin)?",
    metaTitle: "Escort mit TWINT, Krypto (USDT/Bitcoin) oder Bar bezahlen Schweiz | Guide",
    metaDescription: "Wie bezahlt man ein Escort-Date, Vorab-Videos oder 1:1 Live-Cam Checks in Zürich und im Crypto Valley Zug zu 100% anonym? Vergleich: Bar, TWINT & USDT.",
    readTime: "3 Min. Lesezeit",
    targetKeywords: [
      "escort twint bezahlen",
      "escort crypto usdt zurich zug",
      "escort anonym buchen schweiz",
      "live cam ohne kreditkarte schweiz",
    ],
    heroIntro: "Kein Schweizer Gentleman möchte verdächtige Abbuchungen auf seiner privaten Bank- oder Kreditkartenabrechnung sehen. So funktionieren 100% diskrete Zahlungen im Crypto Valley Zug, in Zürich und auf iWantSexNow.ch.",
    sections: [
      {
        heading: "1. Vor Ort beim Date: Barzahlung (CHF/EUR) vs. TWINT vs. USDT",
        body: "Beim persönlichen Treffen im Hotel oder Studio ist die klassische Übergabe im diskreten Briefumschlag (Schweizer Franken oder Euro) nach wie vor der Goldstandard. Immer mehr unabhängige Escorts und Gigolos in Zug, Cham und Zürich akzeptieren auf Wunsch aber auch neutrale TWINT-Überweisungen unter unverfänglichen Verwendungszwecken oder Wallet-zu-Wallet Transfers in USDT (TRC20 / Solana).",
      },
      {
        heading: "2. Auf iWantSexNow.ch: Neutrale Schweizer Abrechnung & Crypto-Support",
        body: "Für unsere 3-Minuten 1:1 Live-Cam Checks (CHF 29), gesperrte Vorab-Videos im VIP-Tresor sowie B2B-Promotions bieten wir sowohl neutrale Schweizer QR-IBAN-Referenzen als auch sofortige USDT-Transfers an.",
      },
    ],
    ctaLabel: "Direkt buchbare Profile in Zug & Zürich entdecken",
    ctaHref: "/orte/zug",
  },

  "newcomer-escort-schweiz": {
    slug: "newcomer-escort-schweiz",
    lang: "de",
    category: "🌱 Für Neueinsteigerinnen & Models",
    title: "Als selbstständige Escort in der Schweiz starten (2026): Anmeldung, 90-Tage-Meldeverfahren, Steuern & Sicherheit",
    metaTitle: "Als Escort in der Schweiz arbeiten (Anmeldung, Verdienst & Setup-Guide 2026)",
    metaDescription: "Schritt-für-Schritt Anleitung für Einsteigerinnen: Wie du legal, sicher und ohne Agentur-Abgaben (100% Honorar) als Escort in Zürich, Zug oder Basel startest.",
    readTime: "5 Min. Lesezeit",
    targetKeywords: [
      "als escort arbeiten schweiz",
      "escort werden zürich verdienst",
      "90 tage meldeverfahren erotik schweiz",
      "escort ohne agentur schweiz",
    ],
    heroIntro: "In der Schweiz ist selbstständige Begleitung vollkommen legal. Trotzdem verlieren viele Einsteigerinnen 40% bis 50% ihres Verdienstes an unfaire Agenturen oder zahlen hunderte Franken im Voraus für klassische Inserate-Portale. So baust du dir in 5 Schritten dein eigenes Direktgeschäft auf.",
    sections: [
      {
        heading: "1. Die rechtlichen Grundlagen in der Schweiz (CH-Bürgerinnen, B/C-Ausweis & EU-90-Tage)",
        body: "Als Schweizerin oder mit Niederlassungs-/Aufenthaltsbewilligung (C/B) kannst du jederzeit legal als selbstständige Dienstleisterin arbeiten. Kommst du aus dem EU/EFTA-Raum für einzelne Wochen nach Zürich, Zug oder Genf, nutzt du einfach das offizielle Online-Meldeverfahren des SEM (bis zu 90 Arbeitstage pro Kalenderjahr).",
      },
      {
        heading: "2. 100% Privatsphäre: Zweit-eSIM, Gesichtsschutz & 1:1 Video-Tresor",
        body: "Du musst dein Gesicht nicht unzensiert im offenen Internet zeigen! Auf iWantSexNow.ch kannst du dezente, stilvolle Fotos für dein öffentliches Profil nutzen und unzensierte Vorab-Videos im geschützten VIP-Tresor für CHF 19–39 verkaufen (du erhältst 80% Sofort-Auszahlung).",
      },
    ],
    ctaLabel: "Jetzt mit dem 5-Schritte Onboarding-Buddy starten (+CHF 50 Bonus)",
    ctaHref: "/create-post",
  },

  "gigolo-callboy-schweiz-guide": {
    slug: "gigolo-callboy-schweiz-guide",
    lang: "de",
    category: "🤵 Gigolos, Callboys & Paare",
    title: "Gigolo & Callboy Schweiz: Wie Damen und Paare (MMF) diskret buchen – oder wie du als Male Escort startest",
    metaTitle: "Gigolo & Callboy Schweiz (Zürich, Zug, Genf) – Für Damen, Paare & Herren",
    metaDescription: "Geprüfte Schweizer Gigolos, Callboys & Male Escorts für anspruchsvolle Frauen, Paare (MMF) und Herren. Inklusive Setup-Guide für angehende männliche Begleiter.",
    readTime: "4 Min. Lesezeit",
    targetKeywords: [
      "gigolo schweiz buchen",
      "callboy zürich für frauen",
      "male escort schweiz verdienst",
      "begleiter für paare mmf schweiz",
    ],
    heroIntro: "Immer mehr erfolgreiche Frauen, Geschäftsreisende und aufgeschlossene Paare in Zürich, Zug, Basel und Genf suchen nach kultivierter männlicher Begleitung – sei es für ein stilvolles Dinner-Date, Wellness zu zweit oder ein sinnliches Erlebnis zu dritt (MMF).",
    sections: [
      {
        heading: "1. Warum der 3-Minuten Live-Cam Check für Damen & Paare der Gamechanger ist",
        body: "Gerade für Frauen und Paare stehen Sympathie, Stimme, gepflegtes Auftreten und Respekt an erster Stelle. Über unseren 3-Minuten 1:1 Live-Cam Check kannst du deinen Wunsch-Gigolo vorab völlig anonym im Browser kennenlernen, bevor ihr euch im Hotel oder Apartment trefft.",
      },
      {
        heading: "2. Als Mann (Gigolo / Callboy) auf iWantSexNow.ch registrieren",
        body: "Über unseren Onboarding-Buddy (/create-post) kannst du dich in 3 Minuten als '🤵 Gigolo / Callboy' anmelden, genau festlegen, wen du empfängst oder besuchst (nur Damen, Paare, oder auch Herren/Bisexuell) und sofort 2 Gratis Lead-Credits im Wert von CHF 50 erhalten.",
      },
    ],
    ctaLabel: "Alle Schweizer Gigolos & Callboys anzeigen",
    ctaHref: "/search?q=Gigolo",
  },
};

export default function GuideDetailPage({ slug }: { slug: string }) {
  const article =
    SWISS_LONG_TAIL_ARTICLES[slug] ||
    SWISS_LONG_TAIL_ARTICLES["english-tourist-expat-escort-guide-switzerland"];

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    inLanguage: article.lang === "en" ? "en-CH" : "de-CH",
    author: {
      "@type": "Organization",
      name: "iWantSexNow.ch Editorial & Market Intelligence",
    },
    publisher: {
      "@type": "Organization",
      name: "iWantSexNow.ch",
      url: "https://iwantsexnow.ch",
    },
    mainEntityOfPage: `https://iwantsexnow.ch/guides/${article.slug}`,
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title={article.metaTitle}
        description={article.metaDescription}
        url={`https://iwantsexnow.ch/guides/${article.slug}`}
        type="article"
        structuredData={articleSchema}
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-black">
            <span>iWant</span><span className="text-[#D5A021]">Sex</span><span>Now</span><span className="text-[#C69C6D] text-sm font-sans">.ch</span>
          </Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
        <Link href="/guides" className="inline-flex items-center gap-2 text-xs text-[#D5A021] font-bold hover:underline">
          <ArrowLeft size={14} /> Zurück zur Magazin- & Guide-Übersicht (/guides)
        </Link>

        <article className="bg-[#09131E] border-2 border-[#C69C6D]/50 rounded-3xl p-6 md:p-10 space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
              {article.category}
            </Badge>
            <span className="text-xs text-gray-400">{article.readTime} · Aktualisiert 2026</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-serif font-black leading-tight">
            {article.title}
          </h1>

          <p className="text-sm sm:text-base text-amber-100/90 leading-relaxed bg-black/40 p-4 rounded-2xl border border-[#C69C6D]/30">
            {article.heroIntro}
          </p>

          <div className="space-y-6 pt-2">
            {article.sections.map((sec, idx) => (
              <div key={idx} className="space-y-3">
                <h2 className="text-xl font-serif font-black text-[#D5A021]">
                  {sec.heading}
                </h2>
                <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                  {sec.body}
                </p>
                {sec.bullets && (
                  <ul className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/10 text-xs sm:text-sm text-gray-200">
                    {sec.bullets.map((b, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </div>

          {/* Targeted Long-Tail Keyword Tags */}
          <div className="pt-4 border-t border-white/10 flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="text-gray-400 font-bold mr-1">Verwandte Themen & Suchen:</span>
            {article.targetKeywords.map((kw) => (
              <Link
                key={kw}
                href={`/search?q=${encodeURIComponent(kw.split(" ")[0])}`}
                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C69C6D]/20 border border-white/10 text-gray-300"
              >
                #{kw}
              </Link>
            ))}
          </div>

          <div className="pt-2">
            <Button
              className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-sm shadow-xl"
              asChild
            >
              <Link href={article.ctaHref}>
                {article.ctaLabel} <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
          </div>
        </article>

        {/* Internal Cross-Links to all other Long-Tail Guides */}
        <Card className="bg-[#09131E] border border-white/15 p-6 rounded-2xl text-white space-y-4">
          <h3 className="text-lg font-serif font-black text-[#D5A021]">
            Weitere Schweizer Guides & Insider-Berichte:
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            {Object.values(SWISS_LONG_TAIL_ARTICLES)
              .filter((a) => a.slug !== article.slug)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/guides/${a.slug}`}
                  className="p-3.5 rounded-xl bg-black/40 hover:bg-white/10 border border-white/10 transition-all block"
                >
                  <div className="text-[10px] text-[#D5A021] font-bold">{a.category}</div>
                  <div className="font-bold text-white mt-0.5 line-clamp-2">{a.title}</div>
                </Link>
              ))}
          </div>
        </Card>
      </main>
      <SeoSiloFooter />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      slug: String(params?.slug || "english-tourist-expat-escort-guide-switzerland"),
    },
  };
};