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
  Clock,
  Send,
  ArrowLeft,
  CalendarCheck,
  Globe,
  PhoneCall,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

const PILOT_ZONES = [
  { id: "ALL", label: "Alle (Zürich & Kanton Zug)" },
  { id: "ZG", label: "Zug, Cham, Baar & Rotkreuz (ZG)" },
  { id: "ZH_CITY", label: "Zürich City (Paradeplatz / Seefeld / West)" },
  { id: "ZH_NORTH", label: "Oerlikon, Glattpark, Airport & Winterthur" },
];

export default function EscortZurichZugHub() {
  const [selectedZone, setSelectedZone] = useState("ALL");
  const [duration, setDuration] = useState<30 | 60 | 120>(60);

  const pilotProfiles = useMemo(() => {
    const all = deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED);
    return all.filter((p) => p.canton === "ZH" || p.canton === "ZG" || p.subareas.includes("Zug"));
  }, []);

  const filtered = pilotProfiles.filter((p) => {
    if (selectedZone === "ALL") return true;
    if (selectedZone === "ZG") return p.canton === "ZG" || p.subareas.some((s) => s.includes("Zug") || s.includes("Cham"));
    if (selectedZone === "ZH_CITY") {
      return p.subareas.some((s) => s.includes("Paradeplatz") || s.includes("Seefeld") || s.includes("West"));
    }
    if (selectedZone === "ZH_NORTH") {
      return p.subareas.some((s) => s.includes("Oerlikon") || s.includes("Glattpark") || s.includes("Winterthur") || s.includes("Airport"));
    }
    return true;
  });

  const calcPrice = (base60: number) => {
    const mult = duration === 30 ? 0.65 : duration === 120 ? 1.8 : 1;
    return Math.round((base60 * mult) / 10) * 10;
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Escort Zürich, Zug & Cham – 11 Verifizierte Direktprofile & Index | iWantSexNow.ch"
        description="Der komplette Escort-Index & Direktbuchungs-Marktplatz für Zürich, Zug, Cham, Baar, Rotkreuz, Oerlikon und Winterthur."
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
          <ArrowLeft size={14} /> Zurück zur Schweizer Hauptseite
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl shadow-2xl">
          <div>
            <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
              Pilot-Region · {filtered.length} Aktive Cluster-Profile in Zürich, Zug & Cham
            </Badge>
            <h1 className="text-3xl md:text-5xl font-serif font-black">
              Zürich, Zug & Cham · Direktbuchung & Index
            </h1>
            <p className="text-gray-300 text-sm md:text-base mt-1 max-w-3xl">
              Alle öffentlichen Portale für Zürich und den Kanton Zug (Zug, Cham, Baar, Rotkreuz) in Echtzeit gebündelt, um Dubletten bereinigt und zum garantierten Fixpreis buchbar.
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
                    ? "px-3.5 py-2 rounded-lg text-xs font-bold bg-[#C69C6D] text-[#0D1B2A]"
                    : "px-3.5 py-2 rounded-lg text-xs font-bold text-gray-300 hover:text-white"
                }
              >
                {mins === 120 ? "2 Std." : `${mins} Min.`}
              </button>
            ))}
          </div>
        </div>

        {/* Sub-Region Filter Bar */}
        <div className="flex flex-wrap gap-2">
          {PILOT_ZONES.map((z) => (
            <button
              key={z.id}
              type="button"
              onClick={() => setSelectedZone(z.id)}
              className={
                selectedZone === z.id
                  ? "px-4 py-2.5 rounded-xl text-xs font-black bg-[#C69C6D] text-[#0D1B2A] shadow-lg"
                  : "px-4 py-2.5 rounded-xl text-xs font-bold bg-[#09131E] border border-white/15 text-gray-300 hover:border-[#C69C6D]/50"
              }
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Profile Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((p) => {
            const isDirect = p.bookingMode === "direct";
            const rate = calcPrice(p.bestBaseRate60Chf);
            const avgPortal = calcPrice(p.portalAverage60Chf);
            return (
              <Card
                key={p.dedupClusterId}
                className="bg-[#09131E] border border-[#C69C6D]/40 rounded-2xl overflow-hidden text-white flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="relative h-64">
                    <img src={p.thumbnail} alt={p.displayName} className="w-full h-full object-cover" />
                    <div
                      className={
                        isDirect
                          ? "absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1"
                          : "absolute top-3 left-3 bg-sky-600 text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1"
                      }
                    >
                      {isDirect ? <CalendarCheck size={12} /> : <Globe size={12} />}
                      {isDirect ? "Direkt Buchbar · Verifiziert" : "Schweizer Markt-Index"}
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-black/85 text-amber-300 text-[11px] font-bold px-2.5 py-1 rounded-lg text-center">
                      {p.sourcesCount} Schweizer Portale gebündelt ({p.normalizedPhoneMask})
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="text-2xl font-serif font-black">
                          {p.displayName}, {p.age}
                        </h2>
                        <p className="text-xs text-[#D5A021] font-semibold mt-0.5">
                          📍 {p.subareas.join(" · ")} ({p.canton})
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400 line-through">Ø CHF {avgPortal}</div>
                        <div className="text-2xl font-black text-[#D5A021]">CHF {rate}</div>
                      </div>
                    </div>

                    <div className="text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                      <Clock size={12} /> {p.freshnessLabel}
                    </div>

                    <div className="text-xs text-gray-300">
                      <strong className="text-white">Inklusive:</strong> {p.includedServices.join(" · ")}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2">
                  <Link
                    href={`/create-post?claim=${encodeURIComponent(p.displayName)}`}
                    className="text-[11px] text-gray-400 hover:text-[#D5A021] underline"
                  >
                    Profil übernehmen
                  </Link>
                  <Button
                    size="sm"
                    className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black text-xs"
                    asChild
                  >
                    <Link
                      href={`/booking-confirmation?provider=${encodeURIComponent(p.displayName)}&city=${encodeURIComponent(p.primaryCity)}&duration=${duration}&total=${rate}`}
                    >
                      <Send size={12} className="mr-1.5" />
                      {isDirect ? "Jetzt direkt buchen" : "Termin anfragen"}
                    </Link>
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}