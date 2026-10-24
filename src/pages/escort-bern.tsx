import { useState } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, Send, ArrowLeft } from "lucide-react";

const REGIONAL_PROVIDERS = [
  {
    id: 4,
    name: "Bern Direct VIP",
    age: 25,
    zone: "Bundesstadt Bern, Thun & Biel",
    subareas: ["Bern Bahnhof", "Kirchenfeld", "Thun", "Biel/Bienne"],
    rate60: 420,
    portalAvg: 500,
    freshness: "Vor 14 Min. bestätigt · Heute direkt buchbar",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
    included: ["GFE", "Dinner Date", "Outcall Bern"],
  },
  {
    id: 1,
    name: "Sophia",
    age: 26,
    zone: "Bern & Schweizweiter VIP Outcall",
    subareas: ["Bern Bahnhof", "Kirchenfeld", "Thun", "Biel/Bienne"],
    rate60: 450,
    portalAvg: 520,
    freshness: "Vor 12 Min. bestätigt · Direkt buchbar",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    included: ["GFE", "Dinner Date", "Hotel-Outcall"],
  },
];

export default function RegionalEscortPage() {
  const [selectedSubarea, setSelectedSubarea] = useState("Alle");
  const subareas = ["Alle", "Bern Bahnhof", "Kirchenfeld", "Thun", "Biel/Bienne"];

  const filtered = REGIONAL_PROVIDERS.filter(
    (p) => selectedSubarea === "Alle" || p.subareas.some((s) => s.toLowerCase().includes(selectedSubarea.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Escort Bern – Verifizierte Direktprofile & Endpreis-Index | iWantSexNow.ch"
        description="Geprüfte Direktprofile und Dubletten-bereinigter Markt-Index für Bundesstadt Bern, Thun & Biel."
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

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-4">
          <ArrowLeft size={14} /> Zurück zur Schweizer Gesamtübersicht
        </Link>
        <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-3 block w-fit">
          Regionaler Direktbuchungs- & Markt-Index · Bundesstadt Bern, Thun & Biel
        </Badge>
        <h1 className="text-3xl md:text-5xl font-serif font-black">
          Verifizierte Escorts & Direktprofile in Bern
        </h1>
        <p className="text-gray-300 mt-2 max-w-3xl text-sm md:text-base">
          Alle gelisteten Profile in Bern sind um Mehrfach-Inserate bereinigt, verfügen über echte Endpreis-Kalkulation und können direkt ohne Agentur-Gebühren angefragt werden.
        </p>

        <div className="flex flex-wrap gap-2 my-6">
          {subareas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedSubarea(area)}
              className={px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedSubarea === area
                  ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                  : "bg-white/5 text-gray-300 border-white/10 hover:border-white/30"
              }}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-8">
          {filtered.map((p, idx) => (
            <Card key={idx} className="bg-[#09131E] border border-[#C69C6D]/40 overflow-hidden rounded-2xl text-white flex flex-col justify-between">
              <div>
                <div className="relative h-72">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={13} /> Direkt Buchbar · Verifiziert
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-serif font-black">{p.name}, {p.age}</h2>
                      <p className="text-xs text-[#D5A021] font-semibold mt-0.5">📍 {p.zone}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-gray-400 line-through">Andere Portale CHF {p.portalAvg}</div>
                      <div className="text-2xl font-black text-[#D5A021]">CHF {p.rate60}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Clock size={13} /> {p.freshness}
                  </div>

                  <div className="mt-3 text-xs text-gray-300">
                    <strong className="text-white">Inklusive:</strong> {p.included.join(" · ")}
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Button className="w-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black" asChild>
                  <Link href={/profile/${p.id}}>
                    <Send size={14} className="mr-1.5" /> Direkt zum Fixpreis buchen
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}