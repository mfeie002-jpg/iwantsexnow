import { useState } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Clock, MapPin, Send, ArrowLeft, Car } from "lucide-react";

const ZURICH_ZUG_PROVIDERS = [
  {
    id: 1,
    name: "Sophia",
    age: 26,
    zone: "Zürich City & Zug",
    subareas: ["Zürich Paradeplatz", "Zürich Oerlikon", "Zug / Baar", "Winterthur"],
    rate60: 450,
    portalAvg: 520,
    freshness: "Vor 12 Min. bestätigt · Heute bis 23:30 Uhr",
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    included: ["GFE", "Dinner Date", "Outcall Zürich/Zug"],
  },
  {
    id: 2,
    name: "Elena",
    age: 24,
    zone: "Zug, Cham & Zürichsee",
    subareas: ["Zug Zentrum", "Cham", "Horgen / Thalwil", "Zürich Enge"],
    rate60: 400,
    portalAvg: 480,
    freshness: "Vor 8 Min. bestätigt · Sofort verfügbar",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    included: ["GFE", "Outcall", "Wellness & Massage"],
  },
  {
    id: 4,
    name: "Mia",
    age: 25,
    zone: "Zürich Airport & VIP Hotel-Outcall",
    subareas: ["Zürich Airport / The Circle", "Zürich City", "Zug", "Luzern"],
    rate60: 550,
    portalAvg: 650,
    freshness: "Vor 19 Min. bestätigt · Heute 17:00 – 23:00 Uhr",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
    included: ["GFE", "Dinner Date", "Overnight", "VIP Outcall"],
  },
];

export default function EscortZurichPage() {
  const [selectedSubarea, setSelectedSubarea] = useState("Alle");
  const subareas = ["Alle", "Zürich", "Zug", "Cham", "Oerlikon", "Winterthur", "Airport"];

  const filtered = ZURICH_ZUG_PROVIDERS.filter(
    (p) => selectedSubarea === "Alle" || p.subareas.some((s) => s.toLowerCase().includes(selectedSubarea.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white">
      <SEO
        title="Escort Zürich & Zug – Verifizierte Direktprofile & Endpreise | iWantSexNow.ch"
        description="Geprüfte Direktprofile in Zürich, Zug, Cham und Winterthur mit bestätigter Echtzeit-Verfügbarkeit und Endpreis-Garantie."
      />
      <header className="border-b border-white/10 bg-[#09131E] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            <span>iWant</span><span className="text-[#D5A021]">Sex</span><span>Now</span><span className="text-gray-400 text-base">.ch</span>
          </Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-4">
          <ArrowLeft size={14} /> Zurück zur Startseite
        </Link>
        <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-3 block w-fit">
          Pilot-Region Zürich · Zug · Winterthur
        </Badge>
        <h1 className="text-3xl md:text-5xl font-black">
          Verifizierte Direktprofile in Zürich & Zug
        </h1>
        <p className="text-gray-300 mt-2 max-w-3xl text-sm md:text-base">
          Alle Anbieterinnen in unserer Pilot-Region sind persönlich per ID & Live-Foto verifiziert, bestätigen ihre Verfügbarkeit in Echtzeit und garantieren transparente Endpreise ohne Agentur-Aufschlag.
        </p>

        <div className="flex flex-wrap gap-2 my-6">
          {subareas.map((area) => (
            <button
              key={area}
              onClick={() => setSelectedSubarea(area)}
              className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                selectedSubarea === area
                  ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                  : "bg-white/5 text-gray-300 border-white/10 hover:border-white/30"
              }`}
            >
              {area}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mt-8">
          {filtered.map((p) => (
            <Card key={p.id} className="bg-white/5 border-white/15 overflow-hidden rounded-2xl text-white flex flex-col justify-between">
              <div>
                <div className="relative h-72">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <ShieldCheck size={13} /> Verifiziertes Direktprofil
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="text-2xl font-black">{p.name}, {p.age}</h2>
                      <p className="text-xs text-[#D5A021] font-semibold mt-0.5">📍 {p.zone}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] text-gray-400 line-through">Drittportale CHF {p.portalAvg}</div>
                      <div className="text-2xl font-black text-[#D5A021]">CHF {p.rate60}</div>
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-lg flex items-center gap-1.5">
                    <Clock size={13} /> {p.freshness}
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {p.subareas.map((sub, i) => (
                      <span key={i} className="text-[11px] bg-black/40 border border-white/10 px-2 py-0.5 rounded text-gray-300">
                        {sub}
                      </span>
                    ))}
                  </div>

                  <div className="mt-3 text-xs text-gray-300">
                    <strong className="text-white">Inklusive:</strong> {p.included.join(" · ")}
                  </div>
                </div>
              </div>
              <div className="p-5 pt-0">
                <Button className="w-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-bold" asChild>
                  <Link href={`/profile/${p.id}`}>
                    <Send size={14} className="mr-1.5" /> Profil & Direkt-Anfrage
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
