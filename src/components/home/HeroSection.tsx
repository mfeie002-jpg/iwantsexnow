import { useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  Search,
  ShieldCheck,
  Video,
  MapPin,
  PhoneCall,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

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
  const router = useRouter();
  const [focused, setFocused] = useState(false);
  const allProfiles = useMemo(() => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED), []);

  // Google-Style Multi-Token Smart Search (Matches Name, City, Canton, Phone, Service, Bio & Budget like "Zug GFE unter 450")
  const instantSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];
    const tokens = q.split(/\s+/).filter(Boolean);
    const digits = q.replace(/\D/g, "");

    return allProfiles
      .filter((p) => {
        if (digits.length >= 3 && p.rawPhoneFull.replace(/\D/g, "").includes(digits)) return true;
        const haystack = [
          p.displayName,
          p.primaryCity,
          p.canton,
          ...p.subareas,
          ...p.includedServices,
          p.bio,
          p.normalizedPhoneMask,
          `chf ${p.bestBaseRate60Chf}`,
        ]
          .join(" ")
          .toLowerCase();
        return tokens.every((tok) => haystack.includes(tok));
      })
      .slice(0, 6);
  }, [searchQuery, allProfiles]);

  const handleSmartExample = (exampleText: string, cityVal = "all", srvVal = "all") => {
    setSearchQuery(exampleText);
    setSelectedCity(cityVal);
    setSelectedService(srvVal);
    document.getElementById("decision-engine")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative pt-28 pb-12 md:pt-36 md:pb-16 overflow-hidden border-b border-[#C69C6D]/25 bg-gradient-to-b from-[#07101A] via-[#0B1623] to-[#09131E]">
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto text-center space-y-5">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/50 px-3.5 py-1 text-xs font-bold">
              <ShieldCheck size={14} className="mr-1.5 inline text-emerald-400" />
              Die Schweizer Escort-Suchmaschine · {allProfiles.length} deduplizierte Profile
            </Badge>
            <Link
              href="/how-it-works"
              className="inline-flex items-center gap-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-[#C69C6D]/40 text-[#D5A021] px-3.5 py-1 text-xs font-bold transition-all"
            >
              <HelpCircle size={13} />
              Neu hier? So funktioniert's in 60 Sek. →
            </Link>
            <Link
              href="/live-cam"
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-600/90 hover:bg-rose-600 text-white px-3.5 py-1 text-xs font-black shadow-lg transition-all"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              3-Min. 1:1 Live-Cam Vibe-Check
            </Link>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-black text-white tracking-tight leading-[1.1]">
            Such wie bei Google.{" "}
            <span className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#D5A021] bg-clip-text text-transparent">
              Vergleiche & buche zum Fixpreis.
            </span>
          </h1>

          <p className="text-sm sm:text-base md:text-lg text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Gib einfach einen <strong className="text-white">Namen, Ort (Zürich, Zug, Cham), Wunsch-Service oder eine +41 Rufnummer</strong> ein: Wir bündeln alle Schweizer Portale, streichen Dubletten und garantieren dir den echten Endpreis ohne Nachverhandlung.
          </p>

          {/* Google-Style Instant Search Bar + Dropdown */}
          <div className="bg-[#09131E]/95 border-2 border-[#C69C6D]/65 rounded-2xl p-4 sm:p-5 shadow-[0_18px_50px_rgba(0,0,0,0.75)] text-left space-y-4 mt-6 relative">
            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5 relative">
                <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D5A021]" />
                <input
                  type="text"
                  value={searchQuery}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setTimeout(() => setFocused(false), 220)}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Suche wie bei Google: 'Zug GFE', 'Sophia', '+41 79...' oder 'Cham Outcall'"
                  className="w-full rounded-xl bg-black/70 border border-white/25 pl-10 pr-4 py-3 text-sm text-white placeholder:text-gray-400 focus:border-[#D5A021] focus:outline-none"
                />

                {/* Instant Autocomplete Results Overlay */}
                {focused && searchQuery.trim().length > 0 && (
                  <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 rounded-2xl bg-[#07101A] border-2 border-[#C69C6D] shadow-2xl overflow-hidden divide-y divide-white/10">
                    <div className="px-3.5 py-2 bg-black/60 text-[11px] font-bold text-[#D5A021] flex items-center justify-between">
                      <span>⚡ Sofort-Treffer im Schweizer Index ({instantSuggestions.length})</span>
                      <Link href={`/search?q=${encodeURIComponent(searchQuery)}`} className="underline">
                        Alle Resultate öffnen →
                      </Link>
                    </div>
                    {instantSuggestions.map((p) => (
                      <Link
                        key={p.dedupClusterId}
                        href={`/profile/${encodeURIComponent(p.displayName)}`}
                        className="flex items-center justify-between gap-3 p-3 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img src={p.thumbnail} alt={p.displayName} className="w-11 h-11 rounded-lg object-cover shrink-0 border border-[#C69C6D]/40" />
                          <div className="min-w-0">
                            <div className="text-xs font-black text-white truncate">
                              {p.displayName}, {p.age} · <span className="text-[#D5A021]">{p.primaryCity} ({p.canton})</span>
                            </div>
                            <div className="text-[11px] text-gray-400 truncate">
                              ✓ {p.includedServices.slice(0, 3).join(" · ")} | {p.sourcesCount} Quelle(n)
                            </div>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-sm font-black text-emerald-400 block">CHF {p.bestBaseRate60Chf}</span>
                          <span className="text-[10px] text-gray-400 line-through">Ø CHF {p.portalAverage60Chf}</span>
                        </div>
                      </Link>
                    ))}
                    {instantSuggestions.length === 0 && (
                      <div className="p-3.5 text-xs text-gray-400">
                        Drücke auf „Treffer zeigen“ oder öffne die <Link href="/search" className="text-[#D5A021] underline">Schweizer Voll-Suche</Link>.
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="md:col-span-3">
                <select
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full rounded-xl bg-black/60 border border-white/20 px-3.5 py-3 text-sm text-white focus:border-[#C69C6D] focus:outline-none"
                >
                  <option value="all">📍 Ganze Schweiz (Alle Kantone)</option>
                  <option value="Zürich">Zürich (City, Seefeld, Oerlikon)</option>
                  <option value="Zug">Zug, Cham, Baar & Rotkreuz (ZG)</option>
                  <option value="Basel">Basel (BS)</option>
                  <option value="Bern">Bern (BE)</option>
                  <option value="Luzern">Luzern (LU)</option>
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
                  {filteredCount} Resultate
                </Button>
              </div>
            </div>

            {/* Google-Style Instant Search Suggestions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
              <div className="flex flex-wrap items-center gap-1.5">
                <span className="text-gray-400 font-semibold mr-1">Beliebte Suchen:</span>
                <button
                  type="button"
                  onClick={() => handleSmartExample("Zug", "Zug", "all")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C69C6D]/20 border border-white/10 text-gray-200 font-semibold"
                >
                  🔍 Escort Zug & Cham
                </button>
                <button
                  type="button"
                  onClick={() => handleSmartExample("", "Zürich", "GFE")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C69C6D]/20 border border-white/10 text-gray-200 font-semibold"
                >
                  🔍 Zürich GFE inklusive
                </button>
                <button
                  type="button"
                  onClick={() => handleSmartExample("", "all", "Outcall")}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C69C6D]/20 border border-white/10 text-gray-200 font-semibold"
                >
                  🔍 Diskreter Hotel-Outcall
                </button>
                <Link
                  href="/how-it-works"
                  className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 font-bold"
                >
                  📞 Rufnummern-Scanner
                </Link>
              </div>

              <Link href="/how-it-works" className="text-[#D5A021] font-bold hover:underline">
                Wie funktioniert die Endpreis-Garantie? →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}