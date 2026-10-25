import { BrandLogo } from "@/components/BrandLogo";
import { useState, useMemo } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Calculator,
  Globe,
  CalendarCheck,
  Send,
  ArrowLeft,
  CheckCircle2,
  TrendingDown,
  Database,
  PhoneCall,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

const EXTRA_SERVICES = [
  { id: "GFE", label: "Girlfriend Experience (GFE)" },
  { id: "Dinner Dates", label: "Dinner Date" },
  { id: "Outcall", label: "Hotel- & Hausbesuch (Outcall)" },
  { id: "Massage", label: "Tantra- & Erotik-Massage" },
  { id: "Overnight", label: "Overnight (+4 Std.)" },
];

export default function CompareEscortsMatrixPage() {
  const [cantonFilter, setCantonFilter] = useState("ALL");
  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["GFE", "Outcall"]);

  const profiles = useMemo(() => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED), []);

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const rows = useMemo(() => {
    const mult = duration === 30 ? 0.65 : duration === 120 ? 1.8 : 1;
    return profiles
      .filter((p) => {
        if (cantonFilter === "ALL") return true;
        if (cantonFilter === "ZG") return p.canton === "ZG" || p.subareas.includes("Zug");
        if (cantonFilter === "ZH") return p.canton === "ZH";
        if (cantonFilter === "OTHER") return !["ZH", "ZG"].includes(p.canton);
        return true;
      })
      .map((p) => {
        const base = Math.round((p.bestBaseRate60Chf * mult) / 10) * 10;
        let extrasChf = 0;
        const includedHit: string[] = [];
        const paidHit: string[] = [];

        selectedExtras.forEach((ext) => {
          if (p.includedServices.includes(ext)) {
            includedHit.push(ext);
          } else {
            extrasChf += p.extraPricesChf[ext] ?? 70;
            paidHit.push(ext);
          }
        });

        const totalDirectChf = base + extrasChf;
        const portalAvgChf = Math.round((p.portalAverage60Chf * mult) / 10) * 10 + extrasChf + paidHit.length * 20;
        const savingsChf = Math.max(0, portalAvgChf - totalDirectChf);

        return {
          profile: p,
          base,
          extrasChf,
          totalDirectChf,
          portalAvgChf,
          savingsChf,
          includedHit,
          paidHit,
        };
      })
      .sort((a, b) => a.totalDirectChf - b.totalDirectChf);
  }, [profiles, cantonFilter, duration, selectedExtras]);

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Schweizer Portal- & Endpreis-Matrix (Zürich, Zug & Schweiz) | iWantSexNow.ch"
        description="Vergleiche alle Schweizer Escort-Portale und Direktprofile in einer transparenten Endpreis-Matrix ohne versteckte Aufpreise."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> Zurück zur Startseite
        </Link>

        {/* Matrix Header & Live Configurator */}
        <div className="bg-[#09131E] border border-[#C69C6D]/45 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4">
            <div>
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                <Database size={12} className="mr-1.5 inline" />
                Schweizer Endpreis-Matrix · {INITIAL_RAW_SWISS_FEED.length} Portal-Inserate → {profiles.length} geprüfte Cluster
              </Badge>
              <h1 className="text-2xl md:text-4xl font-serif font-black">
                Portal- & Endpreis-Vergleichsmatrix
              </h1>
              <p className="text-sm text-gray-300 mt-1 max-w-3xl">
                Sieh auf einen Blick, auf welchen Drittportalen (`xdate.ch`, `fgirl.ch`, `and6.com`, `6navi.ch`) eine Anbieterin teurer gelistet ist und wie viel du bei direkter Fixpreis-Buchung sparst.
              </p>
            </div>

            <div className="flex bg-black/50 p-1 rounded-xl border border-[#C69C6D]/30 shrink-0 self-start">
              {([30, 60, 120] as const).map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={
                    duration === mins
                      ? "px-4 py-2 rounded-lg text-xs font-black bg-[#C69C6D] text-[#0D1B2A]"
                      : "px-4 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white"
                  }
                >
                  {mins === 120 ? "2 Stunden" : `${mins} Min.`}
                </button>
              ))}
            </div>
          </div>

          {/* Canton & Extra Service Toggles */}
          <div className="grid lg:grid-cols-12 gap-4 pt-4 border-t border-white/10">
            <div className="lg:col-span-5 flex flex-wrap gap-1.5">
              {([
                { id: "ALL", label: "Ganze Schweiz (16)" },
                { id: "ZG", label: "Zug & Cham (ZG)" },
                { id: "ZH", label: "Zürich (ZH)" },
                { id: "OTHER", label: "BS / BE / LU / GE / VD" },
              ] as const).map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setCantonFilter(c.id)}
                  className={
                    cantonFilter === c.id
                      ? "px-3 py-2 rounded-xl text-xs font-black bg-[#C69C6D] text-[#0D1B2A]"
                      : "px-3 py-2 rounded-xl text-xs font-bold bg-black/40 border border-white/10 text-gray-300"
                  }
                >
                  {c.label}
                </button>
              ))}
            </div>

            <div className="lg:col-span-7 flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#D5A021] uppercase mr-1 flex items-center gap-1">
                <Calculator size={13} /> Gewünschte Extras:
              </span>
              {EXTRA_SERVICES.map((ext) => {
                const active = selectedExtras.includes(ext.id);
                return (
                  <button
                    key={ext.id}
                    type="button"
                    onClick={() => toggleExtra(ext.id)}
                    className={
                      active
                        ? "px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-500/20 border border-emerald-400 text-white"
                        : "px-3 py-1.5 rounded-xl text-xs font-semibold bg-black/40 border border-white/10 text-gray-400"
                    }
                  >
                    {active ? "✓ " : "+ "}{ext.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Responsive Comparison Matrix Table */}
        <div className="overflow-x-auto rounded-2xl border border-[#C69C6D]/40 bg-[#09131E] shadow-2xl">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/15 bg-black/40 text-[11px] uppercase tracking-wider text-[#D5A021]">
                <th className="p-4">Anbieterin & Region</th>
                <th className="p-4">Gefundene Schweizer Portale (Dubletten-Check)</th>
                <th className="p-4">Inklusive im Grundtarif</th>
                <th className="p-4">Andere Portale Ø</th>
                <th className="p-4">Echter Endpreis ({duration}m)</th>
                <th className="p-4 text-right">Direkt-Buchung</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10 text-xs">
              {rows.map((r) => {
                const p = r.profile;
                const isDirect = p.bookingMode === "direct";
                return (
                  <tr key={p.dedupClusterId} className="hover:bg-white/5 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.thumbnail}
                          alt={p.displayName}
                          className="w-12 h-14 rounded-lg object-cover border border-white/15 shrink-0"
                        />
                        <div>
                          <div className="font-serif font-black text-base text-white flex items-center gap-1.5">
                            {p.displayName}, {p.age}
                            {isDirect && (
                              <Badge className="bg-emerald-600 text-white border-0 text-[10px] px-1.5 py-0">
                                Direkt
                              </Badge>
                            )}
                          </div>
                          <div className="text-[#D5A021] font-semibold mt-0.5">
                            📍 {p.subareas.join(" · ")} ({p.canton})
                          </div>
                          <div className="text-[11px] text-gray-400 font-mono mt-0.5">
                            <PhoneCall size={10} className="inline mr-1" />
                            {p.normalizedPhoneMask}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="space-y-1">
                        {p.sources.map((s, i) => (
                          <div key={i} className="flex items-center justify-between gap-3 max-w-xs">
                            <span className={s.isDirect ? "text-emerald-400 font-bold" : "text-gray-300"}>
                              {s.portal}
                            </span>
                            <span className={s.isDirect ? "text-emerald-400 font-bold" : "text-gray-400 line-through"}>
                              CHF {s.priceChf}/h
                            </span>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {p.includedServices.map((srv) => (
                          <span
                            key={srv}
                            className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-[11px]"
                          >
                            ✓ {srv}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="text-sm text-gray-400 line-through font-semibold">
                        CHF {r.portalAvgChf}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-2xl font-black text-[#D5A021]">CHF {r.totalDirectChf}</div>
                      <div className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <TrendingDown size={12} /> Spare CHF {r.savingsChf}
                      </div>
                    </td>

                    <td className="p-4 text-right">
                      <Button
                        size="sm"
                        className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black text-xs"
                        asChild
                      >
                        <Link
                          href={`/booking-confirmation?provider=${encodeURIComponent(p.displayName)}&city=${encodeURIComponent(p.primaryCity)}&duration=${duration}&total=${r.totalDirectChf}&extras=${encodeURIComponent(selectedExtras.join(", "))}`}
                        >
                          <Send size={12} className="mr-1.5" />
                          Fixpreis buchen
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}