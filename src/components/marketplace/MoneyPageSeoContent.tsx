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
  profileCount,
}: MoneyPageSeoProps) {
  const [lang, setLang] = useState<"de" | "en">("de");

  return (
    <section
      aria-label={`Marktbericht, Preis-Spiegel und Expat-Guide für ${cityOrRegion}`}
      className="bg-[#08111C] border-t border-[#ff6b5e]/30 py-12 text-white"
    >
      <div className="container mx-auto px-4 max-w-7xl space-y-8">
        {/* Language Switcher Header for Swiss Locals & English Tourists/Expats */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-white/10">
          <div>
            <Badge className="bg-[#ff6b5e]/20 text-[#ff6b5e] border border-[#ff6b5e]/40 mb-1.5">
              <Sparkles size={12} className="mr-1.5 inline" /> Offizielles Schweizer Markt-Dossier & Expat-Guide 2026
            </Badge>
            <h2 className="text-2xl md:text-3xl font-serif font-black">
              {lang === "de"
                ? `Escort, Gigolo & Studio-Preisspiegel für ${cityOrRegion} (${canton})`
                : `Verified Swiss Escort & Hotel Outcall Guide for ${cityOrRegion} (${canton})`}
            </h2>
          </div>

          <div className="flex items-center gap-1.5 bg-black/60 p-1.5 rounded-xl border border-[#ff6b5e]/50">
            <button
              type="button"
              onClick={() => setLang("de")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                lang === "de" ? "bg-[#ff6b5e] text-[#0d1f27]" : "text-gray-300 hover:text-white"
              }`}
            >
              🇨🇭 Deutsch (CH)
            </button>
            <button
              type="button"
              onClick={() => setLang("en")}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
                lang === "en" ? "bg-[#ff6b5e] text-[#0d1f27]" : "text-gray-300 hover:text-white"
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
                {typeof profileCount === "number"
                  ? <>Im Verzeichnis liegen <strong>{profileCount} Einträge</strong>. Ein nicht bestätigter Preis ist keine Offerte.</>
                  : <>Eine Profilzahl oder eine Preisspanne steht hier nur, wenn sie aus den Verzeichnisdaten kommt. Ein nicht bestätigter Preis ist keine Offerte.</>}
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
              <Card className="bg-[#07141a] border border-[#ff6b5e]/45 p-5 rounded-2xl text-white space-y-3">
                <h3 className="text-base font-serif font-black text-[#ff6b5e] flex items-center gap-2">
                  <Coins size={16} /> Preise in {cityOrRegion}
                </h3>
                <p className="text-xs text-gray-300">Keine Richtpreise. Beträge stehen beim jeweiligen Eintrag, geschätzte Werte sind dort gekennzeichnet.</p>
              </Card>

              <div className="bg-black/40 border border-white/10 rounded-2xl p-4 text-xs space-y-2">
                <div className="font-bold text-[#ff6b5e]">Weiterführende Schweizer Insider-Guides:</div>
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
                {typeof profileCount === "number"
                  ? <>The directory currently lists <strong>{profileCount} entries</strong>. An unconfirmed price is not an offer.</>
                  : <>A profile count appears here only when it is computed from the directory. An unconfirmed price is not an offer.</>}
              </p>
              <ul className="space-y-1.5 text-mint-300 font-medium">
                <li>✓ <strong>100% Fixed-Price Guarantee (Swiss Shield Certificate):</strong> Select your duration (30m, 60m, 2h, Overnight) and desired services (GFE, Dinner Date, Hotel Outcall, Massage) upfront—zero price negotiation in your hotel room.</li>
                <li>✓ <strong>No live-availability claim:</strong> A scraped listing is not a confirmation that someone is free.</li>
                <li>✓ <strong>5-Star Hotel Outcall & Crypto Friendly:</strong> Discreet outcalls to all major Swiss luxury hotels (Dolder Grand, Baur au Lac, Park Hyatt, Park Hotel Zug, Kameha Grand, Mandarin Oriental, Badrutt’s Palace). Cash (CHF/EUR/USD), TWINT, and USDT/Crypto accepted.</li>
              </ul>
            </div>

            <div className="lg:col-span-5 space-y-4">
              <Card className="bg-[#07141a] border border-[#ff6b5e]/45 p-5 rounded-2xl text-white space-y-3">
                <h3 className="text-base font-serif font-black text-[#ff6b5e] flex items-center gap-2">
                  <Globe size={16} /> Swiss Companion Rates & Etiquette (English)
                </h3>
                <div className="divide-y divide-white/10 text-xs">
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">Legal Status in Switzerland:</span>
                    <strong className="text-mint-400">100% Legal & Regulated (18+)</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">Published rates:</span>
                    <strong className="text-mint-400">per entry, estimates marked</strong>
                  </div>
                  <div className="py-2 flex justify-between">
                    <span className="text-gray-300">Accepted Currencies:</span>
                    <strong className="text-white">CHF, EUR (1:1), USD, USDT/BTC</strong>
                  </div>
                </div>
                <Link
                  href="/guides/english-tourist-expat-escort-guide-switzerland"
                  className="block text-center w-full py-2.5 rounded-xl bg-[#ff6b5e] text-[#0d1f27] font-black text-xs"
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