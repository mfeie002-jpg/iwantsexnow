import { useState, useMemo } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Calculator,
  Video,
  ShieldCheck,
  PhoneCall,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  TrendingDown,
  Lock,
  HelpCircle,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers, normalizeSwissPhone } from "@/lib/marketplace/indexer";

export default function HowItWorksPage() {
  const [phoneQuery, setPhoneQuery] = useState("");
  const allProfiles = useMemo(() => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED), []);

  const matchedByPhone = useMemo(() => {
    const q = phoneQuery.trim().toLowerCase();
    if (!q) return [];
    const digits = q.replace(/\D/g, "");
    return allProfiles.filter((p) => {
      if (digits.length >= 3 && p.rawPhoneFull.replace(/\D/g, "").includes(digits)) return true;
      if (p.displayName.toLowerCase().includes(q)) return true;
      if (p.primaryCity.toLowerCase().includes(q)) return true;
      return false;
    });
  }, [phoneQuery, allProfiles]);

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="So funktioniert iWantSexNow.ch · Neukunden-Guide & Rufnummern-Scanner"
        description="Erfahre in 60 Sekunden, wie unsere Schweizer Meta-Suchmaschine Dubletten entfernt, echte Endpreise garantiert und 1:1 Video-Checks ermöglicht."
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

      <main className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 px-3.5 py-1">
            <HelpCircle size={13} className="mr-1.5 inline" /> Für Neukunden · In 60 Sekunden erklärt
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight">
            Wie Google & Comparis – aber für diskrete Schweizer Escort-Buchungen.
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Auf herkömmlichen Portalen (`xdate`, `fgirl`, `and6`) ist dasselbe Profil oft 4-mal zu unterschiedlichen Preisen inseriert, und vor Ort kosten Extras plötzlich CHF 150 Aufpreis. So löst <strong>iWantSexNow.ch</strong> dieses Problem:
          </p>
        </div>

        {/* 4 Visual Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              step: "SCHRITT 1",
              icon: Search,
              title: "Wie bei Google suchen (Freitext oder Nummer)",
              desc: "Tippe einfach 'Blond Zug Hotel unter 500', einen Namen oder eine +41 Rufnummer ein. Wir durchsuchen alle grossen Schweizer Portale gleichzeitig.",
              badge: "Alle Portale in 1 Suche",
            },
            {
              step: "SCHRITT 2",
              icon: TrendingDown,
              title: "Automatischer Dubletten- & Preis-Abgleich",
              desc: "Unsere Engine erkennt anhand der Schweizer Rufnummer sofort, wenn eine Dame auf 3 Portalen unterschiedlich teuer gelistet ist, und zeigt dir den günstigsten Direktpreis.",
              badge: "Ø CHF 85 Ersparnis / Std.",
            },
            {
              step: "SCHRITT 3",
              icon: Video,
              title: "Optionaler 3-Minuten 1:1 Live-Cam Check",
              desc: "Unsicher, ob die Fotos aktuell sind? Starte vorab einen 3-Minuten 1:1 Video-Call im Browser (CHF 29 – davon werden CHF 20 direkt auf dein Date angerechnet!).",
              badge: "100% Schutz vor Fake-Fotos",
            },
            {
              step: "SCHRITT 4",
              icon: Calculator,
              title: "Endpreis einfrieren & diskret buchen",
              desc: "Klicke Dauer und gewünschte Extras (z.B. GFE, Outcall, Massage) vorab an. Du erhältst ein Fixpreis-Zertifikat (IW-Code) ohne Nachverhandlung im Zimmer.",
              badge: "0% Nachverhandlung vor Ort",
            },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <Card key={i} className="bg-[#09131E] border border-[#C69C6D]/45 p-6 rounded-2xl text-white flex flex-col justify-between space-y-4 shadow-2xl">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-[#D5A021] tracking-wider">{item.step}</span>
                    <div className="w-10 h-10 rounded-xl bg-[#C69C6D]/15 border border-[#C69C6D]/40 flex items-center justify-center text-[#D5A021]">
                      <Icon size={18} />
                    </div>
                  </div>
                  <h2 className="text-lg font-serif font-black">{item.title}</h2>
                  <p className="text-xs text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 w-fit text-[11px]">
                  ✓ {item.badge}
                </Badge>
              </Card>
            );
          })}
        </div>

        {/* Interactive Reverse Phone & Fake-Price Scanner */}
        <Card className="bg-gradient-to-br from-[#122438] to-[#09131E] border-2 border-[#C69C6D] p-6 md:p-8 rounded-2xl text-white space-y-5 shadow-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge className="bg-[#C69C6D] text-[#0D1B2A] font-black mb-2">
                <PhoneCall size={12} className="mr-1 inline" /> NEU: Schweizer Rufnummern- & Inserate-Scanner
              </Badge>
              <h2 className="text-2xl font-serif font-black">
                Inserat auf einem anderen Portal gesehen? Prüfe hier den echten Preis!
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 mt-1">
                Gib einen Namen, Ort oder eine Telefonnummer (`079...`, `078...`, `076...`) ein, um zu sehen, auf wie vielen Portalen das Profil existiert und was der bereinigte Direktpreis ist:
              </p>
            </div>
          </div>

          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D5A021]" />
            <input
              type="text"
              value={phoneQuery}
              onChange={(e) => setPhoneQuery(e.target.value)}
              placeholder="Telefonnummer (+41 79...), Name (z.B. Sophia, Elena, Ann) oder Stadt (Zug, Cham, Zürich) eingeben..."
              className="w-full rounded-xl bg-black/60 border-2 border-[#C69C6D]/50 pl-11 pr-4 py-3.5 text-sm text-white focus:border-[#D5A021] focus:outline-none"
            />
          </div>

          {phoneQuery.trim() && (
            <div className="space-y-2.5 pt-2">
              {matchedByPhone.slice(0, 5).map((p) => (
                <div
                  key={p.dedupClusterId}
                  className="p-4 rounded-xl bg-black/50 border border-white/15 flex flex-wrap items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img src={p.thumbnail} alt={p.displayName} className="w-12 h-12 rounded-lg object-cover border border-[#C69C6D]/40" />
                    <div>
                      <div className="font-bold text-sm text-white">
                        {p.displayName}, {p.age} · <span className="text-[#D5A021]">{p.primaryCity} ({p.canton})</span>
                      </div>
                      <div className="text-gray-400 font-mono mt-0.5">
                        Cluster: {p.normalizedPhoneMask} · Gebündelt aus {p.sourcesCount} Schweizer Quelle(n)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <span className="text-gray-400 line-through block">Andere Portale Ø CHF {p.portalAverage60Chf}</span>
                      <strong className="text-emerald-400 text-base font-black">Direkt ab CHF {p.bestBaseRate60Chf}/h</strong>
                    </div>
                    <Button size="sm" className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs" asChild>
                      <Link href={`/profile/${encodeURIComponent(p.displayName)}`}>Profil & Beweis öffnen →</Link>
                    </Button>
                  </div>
                </div>
              ))}
              {matchedByPhone.length === 0 && (
                <div className="text-xs text-gray-400 p-3 bg-black/40 rounded-xl">
                  Kein direkter Treffer unter diesem Suchbegriff – öffne die <Link href="/search" className="text-[#D5A021] underline">Voll-Suche</Link> für alle Kantone.
                </div>
              )}
            </div>
          )}
        </Card>

        {/* CTA */}
        <div className="text-center space-y-4">
          <div className="flex flex-wrap justify-center gap-3">
            <Button className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black px-8 py-6 text-sm" asChild>
              <Link href="/search">
                Jetzt Google-Style Meta-Suche starten <ArrowRight size={16} className="ml-2" />
              </Link>
            </Button>
            <Button variant="outline" className="border-[#C69C6D] text-[#D5A021] hover:bg-[#C69C6D]/10 font-black px-6 py-6 text-sm" asChild>
              <Link href="/matches">
                <Sparkles size={16} className="mr-2" /> 30-Sekunden Smart-Matcher
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}