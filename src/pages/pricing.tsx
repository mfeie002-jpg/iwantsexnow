import { BrandLogo } from "@/components/BrandLogo";
import { useState } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Globe,
  CalendarCheck,
  Zap,
  Lock,
  ArrowRight,
} from "lucide-react";

const B2B_PLANS = [
  {
    id: "claim",
    badge: "Einstieg Â· Schweizer Markt-Index",
    name: "Index-Claim & Dubletten-Schutz",
    priceMonthly: 0,
    priceWeekly: 0,
    subtitle: "FÃ¼r Anbieterinnen, die bereits auf Schweizer Portalen inserieren",
    features: [
      "Bestehendes Index-Profil per SMS/Signal kostenlos Ã¼bernehmen",
      "Automatische ZusammenfÃ¼hrung aller Fremdportal-Dubletten unter 1 ID",
      "Eigener Grundtarif (30m / 60m / 2h) im Endpreis-Rechner",
      "Basis-Sichtbarkeit in der schweizweiten Meta-Suche (/search)",
    ],
    cta: "Profil jetzt kostenlos Ã¼bernehmen",
    href: "/create-post",
    highlight: false,
  },
  {
    id: "direct",
    badge: "Beliebtestes Paket Â· Direktbuchung",
    name: "Verified Direct Provider",
    priceMonthly: 190,
    priceWeekly: 59,
    subtitle: "FÃ¼r selbststÃ¤ndige Escorts & Studios mit direkter Terminbuchung",
    features: [
      "GrÃ¼nes Siegel: â€žDirekt Buchbar Â· ID & Originalfotos geprÃ¼ftâ€œ",
      "0% Provision: Alle Direktbuchungs-Anfragen gehen 1:1 an dich (WhatsApp/Signal/Threema)",
      "1-Klick Echtzeit-VerfÃ¼gbarkeits-Ping (â€žJetzt fÃ¼r 4 Std. verfÃ¼gbarâ€œ)",
      "Voller Zugriff auf das Provider Self-Service & Lead Dashboard",
      "Bevorzugtes Ranking vor nicht-verifizierten Index-Profilen",
    ],
    cta: "Direktbuchung & Siegel aktivieren",
    href: "/checkout?plan=direct_monthly",
    highlight: true,
  },
  {
    id: "vip",
    badge: "Maximale Leads Â· ZÃ¼rich & Zug",
    name: "VIP Smart-Matcher Dominanz",
    priceMonthly: 390,
    priceWeekly: 119,
    subtitle: "Maximale Auslastung in deiner Wunsch-Region (z.B. ZÃ¼rich, Zug, Basel, Genf)",
    features: [
      "Alle Vorteile des Verified Direct Provider Pakets inklusive",
      "Garantierte Top-Platzierung im Endpreis-Rechner auf der Startseite",
      "Hervorhebung im Live-Story-Radar (â€žHeute direkt buchbarâ€œ)",
      "PrioritÃ¤ts-Matching bei High-Budget & Overnight-Anfragen",
      "PersÃ¶nlicher B2B Concierge-Support & Profil-Optimierung",
    ],
    cta: "VIP-Platzierung sichern",
    href: "/checkout?plan=direct_monthly",
    highlight: false,
  },
];

export default function PricingPage() {
  const { toast } = useToast();
  const [billingCycle, setBillingCycle] = useState<"weekly" | "monthly">("monthly");
  const [paymentMethod, setPaymentMethod] = useState<"twint" | "card" | "crypto">("twint");

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="B2B Konditionen & Direktbuchungs-Pakete fÃ¼r Anbieter | iWantSexNow.ch"
        description="Ãœbernehme dein Schweizer Index-Profil kostenlos oder aktiviere direkte Fixpreis-Buchungen ohne Agentur-Provision."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-12 max-w-6xl space-y-12">
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
            FÃ¼r selbststÃ¤ndige Anbieterinnen, Begleiterinnen & Studios (B2B)
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black">
            0% Vermittlungs-Provision. 100% Direkte Kunden-Leads.
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Anders als Agenturen verlangen wir keinen prozentualen Anteil an deinen Buchungen. Du behÃ¤ltst 100% deines Honorars und erhÃ¤ltst vorqualifizierte Anfragen mit bereits akzeptiertem Endpreis.
          </p>

          {/* Billing Cycle Toggle */}
          <div className="inline-flex bg-black/50 p-1.5 rounded-xl border border-[#C69C6D]/30 mt-4">
            <button
              type="button"
              onClick={() => setBillingCycle("weekly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                billingCycle === "weekly" ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300 hover:text-white"
              }`}
            >
              Wochen-Pass (Flexibel)
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle("monthly")}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                billingCycle === "monthly" ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300 hover:text-white"
              }`}
            >
              Monats-Paket (Spare 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6">
          {B2B_PLANS.map((plan) => {
            const price = billingCycle === "weekly" ? plan.priceWeekly : plan.priceMonthly;
            return (
              <Card
                key={plan.id}
                className={`p-6 rounded-2xl flex flex-col justify-between text-white relative ${
                  plan.highlight
                    ? "bg-[#09131E] border-2 border-[#C69C6D] shadow-[0_15px_40px_rgba(213,160,33,0.2)] scale-[1.02]"
                    : "bg-[#09131E]/80 border border-white/15"
                }`}
              >
                <div>
                  <Badge
                    className={`mb-3 ${
                      plan.highlight
                        ? "bg-[#C69C6D] text-[#0D1B2A] font-black"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {plan.badge}
                  </Badge>
                  <h2 className="text-2xl font-serif font-black">{plan.name}</h2>
                  <p className="text-xs text-gray-400 mt-1 min-h-[32px]">{plan.subtitle}</p>

                  <div className="my-6 pb-6 border-b border-white/10">
                    {price === 0 ? (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-emerald-400">CHF 0</span>
                        <span className="text-xs text-gray-400">dauerhaft kostenlos</span>
                      </div>
                    ) : (
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-black text-[#D5A021]">CHF {price}</span>
                        <span className="text-xs text-gray-400">
                          pro {billingCycle === "weekly" ? "Woche" : "Monat"} (inkl. MwSt.)
                        </span>
                      </div>
                    )}
                  </div>

                  <ul className="space-y-3 text-xs text-gray-200">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-8">
                  <Button
                    className={`w-full font-black py-6 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A]"
                        : "bg-white/10 hover:bg-white/20 text-white"
                    }`}
                    asChild
                  >
                    <Link href={plan.href}>
                      {plan.cta} <ArrowRight size={15} className="ml-1.5" />
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Swiss Discreet Payment Methods */}
        <Card className="bg-[#09131E] border border-[#C69C6D]/35 p-6 rounded-2xl text-white">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="text-xs font-bold uppercase text-[#D5A021] flex items-center gap-1.5">
                <Lock size={14} /> Diskrete Schweizer Abrechnung ohne verrÃ¤terische Buchungstexte
              </div>
              <h3 className="text-xl font-serif font-black mt-1">
                UnterstÃ¼tzte B2B-Zahlungsarten fÃ¼r Anbieterinnen
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                Alle Buchungen erscheinen neutral als â€žiW Digital Media Services CHâ€œ auf deinem Auszug.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              {([
                { id: "twint", label: "ðŸ‡¨ðŸ‡­ TWINT Sofort" },
                { id: "card", label: "ðŸ’³ Kreditkarte / Apple Pay" },
                { id: "crypto", label: "â‚¿ USDT / Bitcoin (100% Anonym)" },
              ] as const).map((pm) => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => {
                    setPaymentMethod(pm.id);
                    toast({
                      title: `${pm.label} ausgewÃ¤hlt`,
                      description: "Diese Zahlungsmethode ist im Verifizierungs-Abschluss hinterlegt.",
                    });
                  }}
                  className={`px-4 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                    paymentMethod === pm.id
                      ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                      : "bg-black/40 border-white/15 text-gray-300"
                  }`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
}

