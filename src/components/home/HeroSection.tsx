import Link from "next/link";
import { Search, ShieldCheck, Calculator, Video, Sparkles, MapPin, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  selectedCity: string;
  setSelectedCity: (c: string) => void;
  selectedService: string;
  setSelectedService: (s: string) => void;
  selectedOffer: string;
  setSelectedOffer: (o: string) => void;
  selectedGender: string;
  setSelectedGender: (g: string) => void;
  verifiedPhotos: boolean;
  setVerifiedPhotos: (v: boolean) => void;
  videoAds: boolean;
  setVideoAds: (v: boolean) => void;
  filteredCount: number;
}

export function HeroSection({
  searchQuery,
  setSearchQuery,
  selectedCity,
  setSelectedCity,
  selectedService,
  setSelectedService,
  filteredCount,
}: HeroSectionProps) {
  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden border-b border-[#C69C6D]/25 bg-gradient-to-b from-[#07101A] via-[#0B1623] to-[#09131E]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/50 px-3.5 py-1 text-xs font-bold">
              <ShieldCheck size={14} className="mr-1.5 inline text-emerald-400" />
              Der Schweizer Escort-Index · 100% Bereinigt um Portal-Dubletten
            </Badge>
            <Link
              href="/live-cam"
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white px-3.5 py-1 text-xs font-black shadow-lg transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              NEU: 3-Min. 1:1 Live-Cam Vibe-Check vorab
            </Link>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-white tracking-tight leading-[1.1]">
            Alle Schweizer Portale in einer Suche.{" "}
            <span className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#D5A021] bg-clip-text text-transparent">
              Direkt zum Fixpreis buchbar.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Schluss mit mehrfach kopierten Inseraten und versteckten Aufpreisen vor Ort: Vergleiche alle Profile in{" "}
            <strong className="text-white">Zürich, Zug, Cham, Basel, Bern & Genf</strong>, prüfe echte Komplettpreise und buche verifizierte Direktprofile mit 0% Agentur-Provision.
          </p>

          {/* Swiss Search & Filter Console */}
          <div className="bg-[#09131E]/95 border-2 border-[#C69C6D]/55 rounded-2xl p-4 sm:p-5 shadow-[0_18px_50px_rgba(0,0,0,0.65)] text-left space-y-4 mt-6">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D5A021]" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name, Ort (z.B. Zug, Cham, Paradeplatz, Oerlikon)..."
                  className="w-full rounded-xl bg-black/60 border border-white/20 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-400 focus:border-[#C69C6D] focus:outline-none"
                />
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/20 px-3.5 py-3 text-sm text-white focus:border-[#C69C6D] focus:outline-none"
                >
                  <option value="all">📍 Ganze Schweiz (Alle Regionen)</option>
                  <option value="Zürich">Zürich (City, Seefeld, Oerlikon)</option>
                  <option value="Zug">Zug, Cham, Baar & Rotkreuz (ZG)</option>
                  <option value="Basel">Basel (BS)</option>
                  <option value="Bern">Bern (BE)</option>
                  <option value="Genève">Genève & Lausanne</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <select
                  value={selectedService}
                  onChange={(e) => setSelectedService(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/20 px-3 py-3 text-sm text-white focus:border-[#C69C6D] focus:outline-none"
                >
                  <option value="all">✨ Alle Services</option>
                  <option value="GFE">GFE (Girlfriend)</option>
                  <option value="Outcall">Hotel-Outcall</option>
                  <option value="Dinner Dates">Dinner Date</option>
                  <option value="Massage">Tantra / Massage</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <Button
                  onClick={() => document.getElementById("decision-engine")?.scrollIntoView({ behavior: "smooth" })}
                  className="w-full h-full min-h-[46px] bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black text-xs sm:text-sm rounded-xl shadow-lg"
                >
                  {filteredCount} Treffer zeigen
                </Button>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-gray-400 font-semibold mr-1">Schnellwahl:</span>
                {[
                  { label: "🔥 Zürich & Zug Pilot-Hub", href: "/escort-zurich" },
                  { label: "📊 Endpreis-Matrix", href: "/compare-escorts" },
                  { label: "🏆 Schweizer Bestenliste", href: "/rankings" },
                  { label: "🔴 1:1 Live-Cam Check", href: "/live-cam" },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C69C6D]/20 border border-white/10 hover:border-[#C69C6D]/50 text-gray-200 font-semibold transition-all"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>

              <Link href="/create-post" className="text-[#D5A021] font-bold hover:underline">
                Anbieterin? Index-Profil kostenlos übernehmen (+2 Credits) →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}