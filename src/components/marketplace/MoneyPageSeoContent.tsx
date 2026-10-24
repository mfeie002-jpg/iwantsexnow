import { useState } from "react";
import Link from "next/link";
import { ShieldCheck, Globe, Hotel, Coins, Sparkles, BookOpen, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MoneyPageSeoProps {
  cityOrRegion?: string;
  canton?: string;
  minRateChf?: number;
  avgRateChf?: number;
  profileCount?: number;
}

export function MoneyPageSeoContent({
  cityOrRegion = "Zürich, Zug, Cham, Basel, Bern & Genf",
  canton = "CH",
  minRateChf = 350,
  avgRateChf = 450,
  profileCount = 260,
}: MoneyPageSeoProps) {
  const [lang, setLang] = useState<"de" | "en">("de");

  return (
    <section
      aria-label={`Marktbericht, Preis-Spiegel und Expat-Guide für ${cityOrRegion}`}
      className="bg-[#08111C] border-t border-[#C69C6D]/30 py-12 text-white"
    >
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        {/* Language Switcher Header for Swiss Locals & English Tourists/Expats */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-1.5">
              <Sparkles size={12} className="mr-1.5 inline" /> Offizielles Schweizer Markt-Dossier & Expat-Guide 2026
            </Badge>
            <h2 className="text-2xl md:text-3xl font-serif font-black">
              {lang === "de"
                ? `Escort, Gigolo & Studio-Preisspiegel für ${cityOrRegion} (${canton})`
                : `Verified Swiss Escort & Hotel Outcall Guide for ${cityOrRegion} (${canton})`}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-[#C69C6D]/50">
            <button
              type="button"
              onClick={() => setLang("de")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                lang === "de" ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300 hover:text-white"
              }`}
            >
              🇨🇭 Deutsch (CH)
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                lang === "en" ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300 hover:text-white"
              }`}
            >
              🇬🇧 English (Tourists & Expats)
            </button>
          </div>
        </div>

        {lang === "de" ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
            {/* Left 7 Cols: Deep Editorial SEO Content */}
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-serif font-bold text-white">
                Warum der direkte Preis- & Dubletten-Abgleich in {cityOrRegion} bares Geld spart
              </h3>
              <p>
                Wer in <strong>{cityOrRegion}</strong> nach einer erstklassigen Begleiterin (High-Class Escort), einer sinnlichen <strong>Tantra- & Erotik-Massage</strong>, einem kultivierten <strong>Gigolo / Callboy für Damen und Paare</strong> oder einem diskreten <strong>Hotel-Outcall</strong> sucht, stösst auf klassischen Schweizer Inserate-Portalen (`xdate.ch`, `fgirl.ch`, `and6.com`, `sex4u.ch`) oft auf dasselbe Problem: Identische Profile werden unter verschiedenen Künstlernamen mehrfach geschaltet, und angegebene Basispreise entpuppen sich vor Ort als Lockvogel-Angebote ohne Extras.
              </p>
              <p>
                Die <strong>Swiss Shield Meta-Engine von iWantSexNow.ch</strong> scannt deshalb stündlich über <strong>{profileCount} aktive Schweizer Profile</strong>, bündelt identische <code>+41 79 / 078 / 076</code> Rufnummern zu einem einzigen geprüften Cluster und berechnet dir vorab den <strong>verbindlichen Komplettpreis inklusive deiner Wunsch-Services</strong> (wie <em>Girlfriend Experience GFE, Französisch Pur FO, Zungenküsse ZK, 69, Dinner-Date oder Overnight</em>).
              </p>

              <h3 className="text-lg font-serif font-bold text-white pt-2">
                Diskrete Hotelbesuche (Outcall), Privat-Studios (Incall) & Zahlungsarten (Bar, TWINT & Crypto/USDT)
              </h3>
              <p>
                Ob für internationale Geschäftsreisende am <strong>Flughafen Zürich (Kloten / Glattpark)</strong>, Krypto-Unternehmer im <strong>Kanton Zug (Zug Zentrum, Cham, Baar, Rotkreuz)</strong>, im <strong>Kanton Schwyz (Pfäffikon SZ, Wollerau)</strong> oder in 5-Sterne-Resorts in <strong>St. Moritz, Davos, Zermatt, Gstaad, Basel und Genf</strong>: Über unser <strong>Fixpreis-Zertifikat (#IW-Code)</strong> ist dein vereinbartes Honorar vorab eingefroren. Viele verifizierte Direktprofile akzeptieren neben diskreter Barzahlung (CHF / EUR) auch <strong>TWINT</strong> sowie <strong>USDT / Bitcoin</strong>.
              </p>
            </div>

            {/* Right 5 Cols: Structured Price & Keyword Silo Table */}
            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-[#09131E] border border-[#C69C6D]/45 p-5 rounded-2xl text-white space-y-3">
                <h3 className="text-base font-serif font-black text-[#D5A021] flex items-center gap-2">
                  <Coins size={16} /> Offizielle Richtpreise in {cityOrRegion} (2026)
                </h3>
                <div className="divide-y divide-white/10 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">30 Min. Express / Studio-Visit (Incall):</span>
                    <strong className="text-emerald-400">ab CHF {Math.round(minRateChf * 0.65)} – {Math.round(avgRateChf * 0.7)}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">60 Min. Direktbuchung (inkl. GFE):</span>
                    <strong className="text-emerald-400">ab CHF {minRateChf} (Ø CHF {avgRateChf})</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">2 Stunden VIP Dinner- oder Hotel-Date:</span>
                    <strong className="text-[#D5A021]">CHF {Math.round(avgRateChf * 1.75)} – {Math.round(avgRateChf * 2)}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">Overnight (10–12 Std. inkl. Frühstück):</span>
                    <strong className="text-white">CHF 1,800 – 3,500</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">3-Minuten 1:1 Live-Cam Vibe-Check vorab:</span>
                    <strong className="text-rose-300">CHF 29 (CHF 20 Date-Gutschrift!)</strong>
                  </div>
                </div>
              </Card>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-[#D5A021]">Weiterführende Schweizer Insider-Guides:</div>
                <div className="flex flex-wrap gap-1.5">
                  <Link href="/guides/english-tourist-expat-escort-guide-switzerland" className="underline text-gray-300 hover:text-white">
                    🇬🇧 English Tourist & Expat Guide
                  </Link>
                  <span>·</span>
                  <Link href="/guides/wef-davos-st-moritz-art-basel-vip-escort" className="underline text-gray-300 hover:text-white">
                    🏔️ WEF Davos, St. Moritz & Art Basel
                  </Link>
                  <span>·</span>
                  <Link href="/guides/escort-twint-crypto-usdt-diskret-bezahlen" className="underline text-gray-300 hover:text-white">
                    💳 Diskret zahlen (Bar, TWINT, USDT)
                  </Link>
                  <span>·</span>
                  <Link href="/guides/schweizer-escort-preise-2026-vergleich" className="underline text-gray-300 hover:text-white">
                    📊 Preis-Report Schweiz 2026
                  </Link>
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* ENGLISH TOURIST & EXPAT SEO CONTENT */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <div className="lg:col-span-7 space-y-4">
              <h3 className="text-lg font-serif font-bold text-white">
                The #1 English-Friendly Escort & Companion Search Engine in Switzerland
              </h3>
              <p>
                Visiting <strong>{cityOrRegion}</strong> for business, banking, crypto conferences in <strong>Zug</strong>, the <strong>WEF in Davos</strong>, <strong>Art Basel</strong>, or a luxury holiday in <strong>Zurich, Geneva, St. Moritz, or Zermatt</strong>? Traditional Swiss adult directories (`xdate.ch`, `fgirl.ch`, `and6.com`) are often only in German/French, filled with duplicate agency ads, and notorious for surprise upcharges once the companion arrives at your hotel room.
              </p>
              <p>
                <strong>iWantSexNow.ch</strong> is Switzerland’s official meta-index and direct-booking platform: We scan and deduplicate over <strong>{profileCount} verified companions, female escorts, male gigolos (for women & couples), and VIP trans models</strong> every hour by their Swiss <code>+41</code> phone number.
              </p>
              <ul className="space-y-1.5 text-emerald-300 font-medium">
                <li>✓ <strong>100% Fixed-Price Guarantee (Swiss Shield Certificate):</strong> Select your duration (30m, 60m, 2h, Overnight) and desired services (GFE, Dinner Date, Hotel Outcall, Massage) upfront—zero price negotiation in your hotel room.</li>
                <li>✓ <strong>3-Minute 1:1 Live-Cam Vibe-Check (CHF 29):</strong> Verify that your companion looks 100% like her photos via a private browser video call before booking (includes a CHF 20 credit toward your date!).</li>
                <li>✓ <strong>5-Star Hotel Outcall & Crypto Friendly:</strong> Discreet outcalls to all major Swiss luxury hotels (Dolder Grand, Baur au Lac, Park Hyatt, Park Hotel Zug, Kameha Grand, Mandarin Oriental, Badrutt’s Palace). Cash (CHF/EUR/USD), TWINT, and USDT/Crypto accepted.</li>
              </ul>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-[#09131E] border border-[#C69C6D]/45 p-5 rounded-2xl text-white space-y-3">
                <h3 className="text-base font-serif font-black text-[#D5A021] flex items-center gap-2">
                  <Globe size={16} /> Swiss Companion Rates & Etiquette (English)
                </h3>
                <div className="divide-y divide-white/10 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">Legal Status in Switzerland:</span>
                    <strong className="text-emerald-400">100% Legal & Regulated (18+)</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">60 Min. Verified Direct Rate:</span>
                    <strong className="text-emerald-400">from CHF {minRateChf} (avg. CHF {avgRateChf})</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">2 Hours Dinner / Hotel Outcall:</span>
                    <strong className="text-[#D5A021]">CHF {Math.round(avgRateChf * 1.75)} – {Math.round(avgRateChf * 2)}</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">Accepted Currencies:</span>
                    <strong className="text-white">CHF, EUR (1:1), USD, USDT/BTC</strong>
                  </div>
                </div>
                <Link
                  href="/guides/english-tourist-expat-escort-guide-switzerland"
                  className="block text-center w-full py-2.5 rounded-xl bg-[#C69C6D] text-[#0D1B2A] font-black text-xs"
                >
                  Read Complete English Visitor & Hotel Outcall Guide →
                </Link>
              </Card>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}