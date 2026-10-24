import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Sparkles,
  ShieldCheck,
  Calculator,
  MapPin,
  Clock,
  CheckCircle2,
  Send,
  Car,
  SlidersHorizontal,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

const EXTRA_CHOICES = [
  { id: "GFE", label: "Girlfriend Experience (GFE)" },
  { id: "Dinner Dates", label: "Dinner Date Begleitung" },
  { id: "Outcall", label: "Hotel- & Hausbesuch (Outcall)" },
  { id: "Massage", label: "Sinnliche Tantra-Massage" },
  { id: "Overnight", label: "Overnight (+4 Std.)" },
];

export default function SmartMatchesPage() {
  const router = useRouter();
  const [region, setRegion] = useState<"ALL" | "ZH" | "ZG" | "BS">("ALL");
  const [meetingMode, setMeetingMode] = useState<"both" | "incall" | "outcall">("both");
  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["GFE", "Outcall"]);
  const [maxBudget, setMaxBudget] = useState(650);

  const allProfiles = deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const rankedMatches = allProfiles
    .map((p) => {
      const mult = duration === 30 ? 0.65 : duration === 120 ? 1.8 : 1;
      const base = Math.round((p.bestBaseRate60Chf * mult) / 10) * 10;
      let extraCost = 0;
      const includedMatched: string[] = [];

      selectedExtras.forEach((ext) => {
        if (p.includedServices.includes(ext)) {
          includedMatched.push(ext);
        } else {
          extraCost += p.extraPricesChf[ext] ?? 70;
        }
      });

      const totalChf = base + extraCost;
      const portalAvgChf = Math.round((p.portalAverage60Chf * mult) / 10) * 10 + extraCost + 30;

      // Calculate Smart Match Score (0 - 99%)
      let score = p.bookingMode === "direct" ? 86 : 76;
      if (region === "ALL" || p.canton === region) score += 6;
      if (totalChf <= maxBudget) score += 5;
      if (selectedExtras.length > 0) {
        score += Math.round((includedMatched.length / selectedExtras.length) * 4);
      }
      score = Math.min(99, score);

      return {
        profile: p,
        base,
        extraCost,
        totalChf,
        portalAvgChf,
        savingsChf: Math.max(0, portalAvgChf - totalChf),
        includedMatched,
        score,
      };
    })
    .filter((item) => {
      if (region !== "ALL" && item.profile.canton !== region) return false;
      if (meetingMode === "incall" && !item.profile.incall) return false;
      if (meetingMode === "outcall" && !item.profile.outcall) return false;
      return true;
    })
    .sort((a, b) => b.score - a.score || a.totalChf - b.totalChf);

  const handleInstantEnquiry = (item: typeof rankedMatches[0]) => {
    router.push({
      pathname: "/booking-confirmation",
      query: {
        provider: item.profile.displayName,
        city: item.profile.primaryCity,
        duration: String(duration),
        total: String(item.totalChf),
        extras: selectedExtras.join(", "),
      },
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Smart-Matching Concierge (Zürich, Zug & Schweiz) | iWantSexNow.ch"
        description="Finde in 30 Sekunden die besten verifizierten Direktprofile passend zu Budget, Kanton, Dauer und gewünschten Extras."
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
            <Sparkles size={13} className="mr-1.5 inline" /> 30-Sekunden Decision Wizard
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black">
            Smart-Matching nach Endpreis & Wunsch-Kriterien
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Wähle deine Region, Dauer und gewünschten Services: Unser Algorithmus prüft alle Direktprofile und Index-Einträge auf Inklusiv-Leistungen und berechnet deinen persönlichen Match-Score.
          </p>
        </div>

        {/* 3-Step Interactive Configurator */}
        <Card className="bg-[#09131E] border border-[#C69C6D]/45 p-6 rounded-2xl text-white space-y-6 shadow-2xl">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Step 1: Region & Treffpunkt */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-[#D5A021] tracking-wider">
                1. Kanton & Treffpunkt
              </div>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: "ALL", label: "Ganze Schweiz" },
                  { id: "ZH", label: "Zürich (ZH)" },
                  { id: "ZG", label: "Zug / Cham (ZG)" },
                  { id: "BS", label: "Basel (BS)" },
                ] as const).map((r) => (
                  <button
                    key={r.id}
                    type="button"
                    onClick={() => setRegion(r.id)}
                    className={`p-2.5 rounded-xl text-xs font-bold border transition-all ${
                      region === r.id
                        ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                        : "bg-black/40 border-white/10 text-gray-300"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
              <div className="flex bg-black/40 p-1 rounded-xl border border-white/10">
                {([
                  { id: "both", label: "Alle" },
                  { id: "incall", label: "Incall / Studio" },
                  { id: "outcall", label: "Hotel / Outcall" },
                ] as const).map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setMeetingMode(m.id)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold ${
                      meetingMode === m.id ? "bg-white/15 text-white" : "text-gray-400"
                    }`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Dauer & Budget */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-[#D5A021] tracking-wider">
                2. Dauer & Ziel-Budget
              </div>
              <div className="grid grid-cols-3 gap-2">
                {([30, 60, 120] as const).map((mins) => (
                  <button
                    key={mins}
                    type="button"
                    onClick={() => setDuration(mins)}
                    className={`py-2.5 rounded-xl text-xs font-bold border ${
                      duration === mins
                        ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                        : "bg-black/40 border-white/10 text-gray-300"
                    }`}
                  >
                    {mins === 120 ? "2 Stunden" : `${mins} Min.`}
                  </button>
                ))}
              </div>
              <div className="bg-black/40 border border-white/10 rounded-xl p-3">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Wunsch-Budget bis:</span>
                  <span className="font-black text-[#D5A021]">CHF {maxBudget}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={1400}
                  step={50}
                  value={maxBudget}
                  onChange={(e) => setMaxBudget(Number(e.target.value))}
                  className="w-full accent-[#C69C6D]"
                />
              </div>
            </div>

            {/* Step 3: Gewünschte Extras */}
            <div className="space-y-3">
              <div className="text-xs font-bold uppercase text-[#D5A021] tracking-wider">
                3. Gewünschte Services (Inklusive-Check)
              </div>
              <div className="flex flex-wrap gap-2">
                {EXTRA_CHOICES.map((ext) => {
                  const active = selectedExtras.includes(ext.id);
                  return (
                    <button
                      key={ext.id}
                      type="button"
                      onClick={() => toggleExtra(ext.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                        active
                          ? "bg-emerald-500/20 border-emerald-400 text-white"
                          : "bg-black/40 border-white/10 text-gray-400"
                      }`}
                    >
                      {active ? "✓ " : "+ "}{ext.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Ranked Match Cards */}
        <div className="space-y-4">
          <h2 className="text-xl font-serif font-black flex items-center gap-2">
            <SlidersHorizontal size={18} className="text-[#D5A021]" />
            Deine Top-Empfehlungen ({rankedMatches.length} verifizierte Treffer)
          </h2>

          <div className="grid md:grid-cols-2 gap-6">
            {rankedMatches.map((item, idx) => (
              <Card
                key={item.profile.dedupClusterId}
                className="bg-[#09131E] border border-[#C69C6D]/45 p-5 rounded-2xl text-white flex flex-col justify-between shadow-xl relative overflow-hidden"
              >
                {idx === 0 && (
                  <div className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] text-[11px] font-black uppercase tracking-wider px-3 py-1 rounded-full w-fit mb-3">
                    ★ Platz 1 · Beste Preis-Leistungs-Empfehlung
                  </div>
                )}

                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="relative w-full sm:w-40 h-52 sm:h-44 rounded-xl overflow-hidden shrink-0 border border-white/15">
                    <img src={item.profile.thumbnail} alt={item.profile.displayName} className="w-full h-full object-cover" />
                    <div className="absolute top-2 right-2 bg-black/85 border border-[#C69C6D] text-[#D5A021] text-xs font-black px-2.5 py-1 rounded-full">
                      {item.score}% Match
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-2xl font-serif font-black">
                        {item.profile.displayName}, {item.profile.age}
                      </h3>
                      <p className="text-xs text-[#D5A021] font-semibold mt-0.5">
                        📍 {item.profile.subareas.join(" · ")} ({item.profile.canton})
                      </p>
                      <p className="text-[11px] text-emerald-300 mt-1">{item.profile.freshnessLabel}</p>
                    </div>

                    <div className="mt-3 bg-white/5 border border-[#C69C6D]/30 rounded-xl p-3 flex items-center justify-between">
                      <div>
                        <div className="text-[10px] text-gray-400">Garantierter Endpreis ({duration} Min.)</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-[#D5A021]">CHF {item.totalChf}</span>
                          <span className="text-xs text-gray-400 line-through">Ø CHF {item.portalAvgChf}</span>
                        </div>
                      </div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs">
                        Sparvorteil CHF {item.savingsChf}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-400">
                    ✓ Inklusive: <strong className="text-emerald-300">{item.profile.includedServices.join(", ")}</strong>
                  </span>
                  <Button
                    size="sm"
                    onClick={() => handleInstantEnquiry(item)}
                    className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black text-xs shrink-0"
                  >
                    <Send size={13} className="mr-1.5" />
                    Zum Fixpreis anfragen
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}