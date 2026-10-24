import { useState } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  ShieldCheck,
  Sparkles,
  Calculator,
  Video,
  UserCheck,
  ArrowRight,
  CheckCircle2,
  Scale,
  Coins,
  HeartHandshake,
} from "lucide-react";
import { SeoSiloFooter } from "@/components/marketplace/SeoSiloFooter";

const GUIDE_ARTICLES = [
  {
    id: "newcomer-escort-schweiz",
    category: "Für Neueinsteigerinnen & Models",
    title: "Neu als selbstständige Escort in der Schweiz starten (Zürich & Zug Setup-Guide 2026)",
    readTime: "4 Min. Lesezeit",
    summary: "Wie du ohne Agentur-Abgaben (100% eigenes Honorar) sicher, legal und anonym in der Schweiz startest – von der Zweit-eSIM über das 90-Tage-Meldeverfahren bis zu deinem ersten CHF 450 Fixpreis-Date.",
    steps: [
      "1. Privatsphäre trennen: Hole dir eine Schweizer Prepaid-eSIM (z.B. Yallo oder Swisscom) nur für Buchungen & Signal/WhatsApp.",
      "2. Recht & Bewilligung in der Schweiz: In der Schweiz ist selbstständige Begleitung legal. Schweizerinnen & C/B-Bewilligung melden sich einfach als Selbstständige an; EU-Bürgerinnen nutzen das kostenlose 90-Tage-Online-Meldeverfahren (SEM).",
      "3. Gesicht schützen & trotzdem verifizieren: Du musst dein Gesicht öffentlich nicht zeigen – nutze unseren geschützten 3-Minuten 1:1 Video-Check oder verkaufe private Videos im VIP-Tresor (80% Auszahlung).",
      "4. Fixpreis statt Diskussion: Lege im Onboarding-Buddy deine Tarife für 30 Min., 60 Min. und 2 Std. verbindlich fest.",
    ],
    ctaLabel: "Jetzt mit dem Onboarding-Buddy starten (+2 Gratis Credits)",
    ctaHref: "/create-post",
  },
  {
    id: "gigolo-callboy-schweiz-guide",
    category: "Gigolos, Callboys & Begleitung für Damen / Paare",
    title: "Als Gigolo / Male Escort in der Schweiz arbeiten – oder als Dame / Paar diskret buchen",
    readTime: "3 Min. Lesezeit",
    summary: "Der Schweizer Markt für stilvolle männliche Begleiter (Gigolos & Callboys) wächst rasant: Worauf Damen bei Dinner-Dates und Paare bei MMF-Treffen in Zürich, Zug & Genf achten.",
    steps: [
      "1. Für suchende Damen & Paare: Über unseren Filter '🤵 Gigolos & Callboys' auf /search findest du geprüfte, kultivierte Gentlemen mit garantiertem Endpreis ohne Agentur-Aufschlag.",
      "2. Vorab-Chemie prüfen: Gerade für Frauen und Paare ist der 3-Minuten 1:1 Live-Cam Vibe-Check (CHF 29 inkl. CHF 20 Buchungs-Gutschein) ideal, um Stimme, Auftreten und Sympathie vorab anonym zu erleben.",
      "3. Für angehende Gigolos: Gepflegtes Auftreten, Mehrsprachigkeit (DE/EN/FR/IT), Diskretion im 5-Sterne-Hotel und Zuverlässigkeit sind wichtiger als reine Muskelmasse.",
    ],
    ctaLabel: "Alle geprüften Schweizer Gigolos & Callboys ansehen",
    ctaHref: "/search?gender=male",
  },
  {
    id: "kunden-preisfallen-vermeiden",
    category: "Für Neukunden & Gentlemen",
    title: "Warum dasselbe Profil auf xdate, fgirl & and6 oft 3 verschiedene Preise hat (und wie du CHF 100+ sparst)",
    readTime: "3 Min. Lesezeit",
    summary: "Viele Agenturen und Portale kopieren Inserate mehrfach oder locken mit CHF 250 Lockvogel-Preisen, die vor Ort durch versteckte Extra-Gebühren auf CHF 550 steigen.",
    steps: [
      "1. Rufnummern-Cluster prüfen: Gib die +41 Nummer oder den Namen in unseren Scanner auf /how-it-works ein – wir zeigen dir sofort alle verknüpften Portal-Inserate.",
      "2. Extras vorab im Rechner anklicken: Klicke GFE, Französisch, Massage oder Hotel-Outcall vorab an, um den echten Endpreis zu sehen.",
      "3. Fixpreis-Zertifikat (#IW-Code) nutzen: Mit deinem Buchungscode ist der Komplettpreis vor Ort zu 100% eingefroren.",
    ],
    ctaLabel: "Zum Endpreis-Rechner & Rufnummern-Scanner",
    ctaHref: "/how-it-works",
  },
  {
    id: "laufhaus-vs-direktbuchung",
    category: "Schweizer Insider-Vergleich",
    title: "Haus Aphrodite & Haus Zeus vs. Private Direktbuchung / Hotel-Outcall: Was lohnt sich wann?",
    readTime: "4 Min. Lesezeit",
    summary: "Der ehrliche Vergleich zwischen einem spontanen Walk-In Besuch in bekannten Schweizer Kontakthäusern (wie Aphrodite oder Zeus) und einer verifizierten Direktbuchung.",
    steps: [
      "1. Wann ein Kontakthaus (Zeus / Aphrodite) Sinn macht: Wenn du spontan ohne Voranmeldung für 30 Minuten (ab CHF 140–150) vorbeischauen möchtest.",
      "2. Wann eine Direktbuchung überlegen ist: Wenn du 100% Privatsphäre im eigenen Hotel/Apartment in Zug, Cham oder Zürich suchst, echten Girlfriend-Service ohne Zeitdruck wünschst und vorab per 1:1 Video-Check sicherstellen willst, dass die Dame exakt den Fotos entspricht.",
    ],
    ctaLabel: "Häuser-Guide & Portal-Rankings öffnen",
    ctaHref: "/rankings",
  },
];

export default function SwissGuidesAndBlogPage() {
  const [selectedFilter, setSelectedFilter] = useState<string>("ALL");

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Schweizer Escort, Gigolo & Einsteiger-Guides (Magazin & Ratgeber) | iWantSexNow.ch"
        description="Offizielle Schweizer Ratgeber: Wie man sich als Escort oder Gigolo in der Schweiz selbstständig anmeldet, Preisfallen vermeidet und diskret bucht."
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

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
            <BookOpen size={13} className="mr-1.5 inline" /> Swiss Shield Wissen, Setup-Guides & Insider-Magazin
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black">
            Guides für Neueinsteiger/innen, Gigolos & Schweizer Gentlemen
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Alles über den sicheren Einstieg als selbstständige Escort oder Gigolo in der Schweiz, das 90-Tage-Meldeverfahren, Dubletten-Schutz und diskrete Fixpreis-Buchungen:
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {GUIDE_ARTICLES.map((art) => (
            <Card
              key={art.id}
              className="bg-[#09131E] border border-[#C69C6D]/45 p-6 rounded-2xl text-white flex flex-col justify-between space-y-5 shadow-2xl"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px]">
                    {art.category}
                  </Badge>
                  <span className="text-xs text-gray-400">{art.readTime}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-black leading-snug">
                  {art.title}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {art.summary}
                </p>

                <div className="bg-black/45 p-4 rounded-xl border border-white/10 space-y-2 text-xs text-gray-200">
                  {art.steps.map((s, idx) => (
                    <div key={idx} className="leading-relaxed">
                      {s}
                    </div>
                  ))}
                </div>
              </div>

              <Button
                className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black text-xs py-5"
                asChild
              >
                <Link href={art.ctaHref}>
                  {art.ctaLabel} <ArrowRight size={14} className="ml-1.5" />
                </Link>
              </Button>
            </Card>
          ))}
        </div>
      </main>

      <SeoSiloFooter />
    </div>
  );
}