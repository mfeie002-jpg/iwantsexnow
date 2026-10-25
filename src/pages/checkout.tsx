import { BrandLogo } from "@/components/BrandLogo";
import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Lock,
  CheckCircle2,
  Copy,
  QrCode,
  Coins,
  CreditCard,
  Zap,
  ArrowLeft,
} from "lucide-react";

const PRODUCTS: Record<string, { name: string; priceChf: number; credits: number; period: string; desc: string }> = {
  direct_weekly: {
    name: "Verified Direct Provider (Wochen-Pass)",
    priceChf: 59,
    credits: 5,
    period: "7 Tage Vollzugriff",
    desc: "Grünes Direktbuchungs-Siegel + 5 Gratis Lead-Credits inklusive",
  },
  direct_monthly: {
    name: "Verified Direct Provider (Monats-Paket)",
    priceChf: 190,
    credits: 20,
    period: "30 Tage Vollzugriff",
    desc: "Grünes Direktbuchungs-Siegel + 20 Lead-Credits + Echtzeit-Ping",
  },
  vip_monthly: {
    name: "VIP Smart-Matcher Dominanz (Zürich & Zug)",
    priceChf: 390,
    credits: 999,
    period: "30 Tage VIP-Flatrate",
    desc: "Platz 1-3 im Endpreis-Rechner + Unbegrenzte Kunden-Leads inklusive",
  },
  credits_5: {
    name: "5er-Paket Direkte Kunden-Leads (Pay-per-Lead)",
    priceChf: 95,
    credits: 5,
    period: "Kein Abo · Kein Verfall",
    desc: "Schalte 5 verifizierte Fixpreis-Buchungsanfragen inkl. Kunden-Rufnummer frei",
  },
  boost_24h: {
    name: "24h „Sofort-Verfügbar“ Radar-Boost",
    priceChf: 29,
    credits: 2,
    period: "24 Stunden Top-Spot",
    desc: "Sofortige Hervorhebung im Live-Story-Radar für Zürich & Zug",
  },
};

export default function CheckoutPage() {
  const router = useRouter();
  const { toast } = useToast();

  const planKey = String(router.query.plan || "direct_monthly");
  const [selectedPlanKey, setSelectedPlanKey] = useState<string>(planKey in PRODUCTS ? planKey : "direct_monthly");
  const [method, setMethod] = useState<"twint_qr" | "crypto" | "paysafe">("twint_qr");
  const [artistName, setArtistName] = useState("Sophia");
  const [txReference] = useState(() => `IW-PAY-${Math.floor(100000 + Math.random() * 900000)}`);
  const [paidSuccess, setPaidSuccess] = useState(false);

  const swissIban = process.env.NEXT_PUBLIC_SWISS_IBAN || "CH93 0076 2011 6238 5295 7";
  const usdtWallet = process.env.NEXT_PUBLIC_USDT_WALLET || "T9yD14Nj9j7xAB4dbGeiX9h8unkKHxuWwb";

  const product = PRODUCTS[selectedPlanKey] || PRODUCTS.direct_monthly;
  const usdtAmount = Math.round(product.priceChf * 1.12);

  const handleCopy = (val: string, label: string) => {
    navigator.clipboard?.writeText(val);
    toast({
      title: `${label} kopiert`,
      description: val,
      duration: 2000,
    });
  };

  const handleConfirmPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentCredits = Number(localStorage.getItem("providerLeadCredits") || "2");
    localStorage.setItem("providerLeadCredits", String(currentCredits + product.credits));
    localStorage.setItem("providerActivePlan", product.name);

    try {
      await fetch("/api/claims/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName,
          phone: `${method.toUpperCase()} · CHF ${product.priceChf}`,
          city: product.name,
          dailyCode: txReference,
          mode: "verify",
        }),
      });
    } catch {
      // non-blocking
    }

    setPaidSuccess(true);
    toast({
      title: `Zahlung (${txReference}) aktiviert!`,
      description: `${product.credits} Lead-Credits & Paket "${product.name}" wurden deinem Provider-Dashboard gutgeschrieben.`,
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Diskreter B2B Checkout (TWINT / Swiss QR / Crypto) | iWantSexNow.ch"
        description="Aktiviere dein Direktbuchungs-Paket oder lade Lead-Credits diskret per Schweizer QR/TWINT oder USDT auf."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-5xl space-y-8">
        <Link href="/pricing" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> Zurück zur Paket-Übersicht
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 space-y-4">
            <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
              <Lock size={12} className="mr-1 inline" /> 100% Diskrete B2B-Abrechnung
            </Badge>
            <h1 className="text-2xl md:text-3xl font-serif font-black">
              1. Paket oder Lead-Credits wählen
            </h1>

            <div className="space-y-2.5">
              {Object.entries(PRODUCTS).map(([key, item]) => {
                const active = selectedPlanKey === key;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPlanKey(key)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      active
                        ? "bg-[#09131E] border-2 border-[#C69C6D] shadow-xl"
                        : "bg-white/5 border-white/10 text-gray-300 hover:border-white/30"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white">{item.name}</span>
                      <span className="text-lg font-black text-[#D5A021]">CHF {item.priceChf}</span>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">{item.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="lg:col-span-7">
            <Card className="bg-[#09131E] border-2 border-[#C69C6D]/60 p-6 md:p-8 rounded-2xl text-white space-y-6 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-white/10">
                <div>
                  <div className="text-xs text-gray-400">Gewählte Leistung:</div>
                  <h2 className="text-xl font-serif font-black text-white">{product.name}</h2>
                  <div className="text-xs text-emerald-400 font-semibold">{product.period}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Gesamtbetrag (inkl. MwSt.)</div>
                  <div className="text-3xl font-black text-[#D5A021]">CHF {product.priceChf}.00</div>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold uppercase text-[#D5A021] block mb-2.5">
                  2. Bevorzugte Schweizer Zahlungsmethode wählen:
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setMethod("twint_qr")}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      method === "twint_qr"
                        ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                        : "bg-black/40 border-white/15 text-gray-300"
                    }`}
                  >
                    <QrCode size={18} />
                    <span>Swiss QR / TWINT</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("crypto")}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      method === "crypto"
                        ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                        : "bg-black/40 border-white/15 text-gray-300"
                    }`}
                  >
                    <Coins size={18} />
                    <span>USDT / Bitcoin</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setMethod("paysafe")}
                    className={`p-3 rounded-xl border text-xs font-bold flex flex-col items-center gap-1.5 transition-all ${
                      method === "paysafe"
                        ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                        : "bg-black/40 border-white/15 text-gray-300"
                    }`}
                  >
                    <CreditCard size={18} />
                    <span>Prepaid / Card</span>
                  </button>
                </div>
              </div>

              {paidSuccess ? (
                <div className="p-6 rounded-2xl bg-emerald-950/60 border border-emerald-400 text-center space-y-4">
                  <CheckCircle2 size={46} className="text-emerald-400 mx-auto" />
                  <h3 className="text-2xl font-serif font-black">
                    Guthaben & Paket sofort aktiviert!
                  </h3>
                  <p className="text-xs text-gray-300 max-w-md mx-auto">
                    Referenz <strong>{txReference}</strong> wurde deinem Profil (<strong>{artistName}</strong>) zugeordnet. Deine <strong>+{product.credits} Lead-Credits</strong> stehen ab sofort im Provider-Dashboard bereit.
                  </p>
                  <Button className="bg-[#C69C6D] text-[#0D1B2A] font-black" asChild>
                    <Link href="/creator-dashboard">Jetzt im Provider-Dashboard Kunden-Leads freischalten →</Link>
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleConfirmPayment} className="space-y-5">
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">
                      Künstlername oder Schweizer Telefonnummer (für die automatische Profil-Zuordnung)
                    </label>
                    <input
                      type="text"
                      value={artistName}
                      onChange={(e) => setArtistName(e.target.value)}
                      required
                      className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                    />
                  </div>

                  {method === "twint_qr" && (
                    <div className="p-4 rounded-xl bg-black/50 border border-[#C69C6D]/40 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[#D5A021] uppercase">
                          Neutraler Schweizer QR- / Instant-Transfer
                        </span>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-[10px]">
                          Neutraler Auszug
                        </Badge>
                      </div>
                      <p className="text-gray-300">
                        Überweise per Schweizer Banking- oder TWINT-App. Auf deinem Auszug erscheint neutral <strong>„iW Digital Media Services CH“</strong>.
                      </p>
                      <div className="grid sm:grid-cols-2 gap-3 bg-white/5 p-3 rounded-lg border border-white/10">
                        <div>
                          <div className="text-gray-400 text-[11px]">CH-IBAN (iW Digital Media):</div>
                          <div className="font-mono font-bold text-white text-xs">{swissIban}</div>
                          <div className="text-gray-400 text-[11px] mt-2">Zahlungs-Referenz:</div>
                          <div className="font-mono font-bold text-emerald-400">{txReference}</div>
                        </div>
                        <div className="flex flex-col justify-between items-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopy(swissIban, "Schweizer IBAN")}
                            className="border-white/20 text-white text-xs h-7"
                          >
                            <Copy size={11} className="mr-1" /> IBAN kopieren
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => handleCopy(txReference, "Referenznummer")}
                            className="border-white/20 text-white text-xs h-7"
                          >
                            <Copy size={11} className="mr-1" /> Referenz kopieren
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {method === "crypto" && (
                    <div className="p-4 rounded-xl bg-black/50 border border-emerald-500/40 space-y-3 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-400 uppercase">
                          100% Anonyme Krypto-Zahlung (USDT TRC20 / Solana / Polygon)
                        </span>
                        <span className="font-mono font-black text-white">≈ {usdtAmount} USDT</span>
                      </div>
                      <p className="text-gray-300">
                        Sende <strong>{usdtAmount} USDT</strong> an die untenstehende Wallet-Adresse:
                      </p>
                      <div className="flex items-center justify-between gap-2 bg-white/5 p-2.5 rounded-lg border border-white/10 font-mono text-[11px] text-amber-300">
                        <span className="truncate">{usdtWallet}</span>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => handleCopy(usdtWallet, "USDT-Wallet-Adresse")}
                          className="border-white/20 text-white text-xs h-7 shrink-0"
                        >
                          <Copy size={11} className="mr-1" /> Kopieren
                        </Button>
                      </div>
                    </div>
                  )}

                  {method === "paysafe" && (
                    <div className="p-4 rounded-xl bg-black/50 border border-white/20 space-y-3 text-xs">
                      <div className="font-bold text-[#D5A021] uppercase">
                        Schweizer Paysafecard / Prepaid-Code (Kiosk, SBB-Automat, TWINT)
                      </div>
                      <input
                        type="text"
                        placeholder="16-stellige PIN eingeben (z.B. 0948-....-....-....)"
                        className="w-full rounded-lg bg-black/60 border border-white/20 px-3 py-2 text-sm font-mono text-white"
                      />
                    </div>
                  )}

                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-base shadow-xl"
                  >
                    <Zap size={17} className="mr-2" />
                    Zahlung bestätigen & {product.credits} Lead-Credits sofort gutschreiben
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}