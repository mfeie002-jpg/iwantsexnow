import { useState, useMemo } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Search as SearchIcon,
  Calculator,
  PhoneCall,
  Send,
  CalendarCheck,
  Globe,
  Star,
  Video,
  HelpCircle,
  Camera,
  SlidersHorizontal,
  Sparkles,
  RotateCcw,
  ArrowUpDown,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";
import { LivePortalSyncBanner } from "@/components/marketplace/LivePortalSyncBanner";
import { SeoSiloFooter } from "@/components/marketplace/SeoSiloFooter";

const ALL_SERVICE_FILTERS = [
  { id: "GFE", label: "Girlfriend Experience (GFE)" },
  { id: "Französisch Pur", label: "Französisch (FO)" },
  { id: "Küssen", label: "Zungenküsse (ZK)" },
  { id: "Outcall", label: "Hotel- & Hausbesuch" },
  { id: "Massage", label: "Tantra- & Erotik-Massage" },
  { id: "Dinner Dates", label: "VIP Dinner Date" },
  { id: "69", label: "Position 69" },
  { id: "Overnight", label: "Overnight Begleitung" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [canton, setCanton] = useState("ALL");
  const [modeFilter,
    genderFilter, setModeFilter] = useState<"ALL" | "direct" | "indexed">("ALL");
  const [genderFilter, setGenderFilter] = useState<"ALL" | "female" | "male" | "couple">("ALL");
  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const [wantedExtras, setWantedExtras] = useState<string[]>(["GFE"]);

  // Deep Filter State (Superior to xdate & fgirl)
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(true);
  const [ageGroup, setAgeGroup] = useState<"ALL" | "18-24" | "25-30" | "31+">("ALL");
  const [hairFilter, setHairFilter] = useState<"ALL" | "Blond" | "Brünett" | "Schwarz">("ALL");
  const [cupFilter, setCupFilter] = useState<"ALL" | "Natur" | "C-D">("ALL");
  const [languageFilter, setLanguageFilter] = useState<"ALL" | "Deutsch" | "English" | "Français" | "Italiano">("ALL");
  const [meetingFilter, setMeetingFilter] = useState<"ALL" | "incall" | "outcall">("ALL");
  const [maxPriceChf, setMaxPriceChf] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<"recommended" | "price_asc" | "savings_desc" | "rating_desc">("recommended");

  const deduplicatedProfiles = useMemo(
    () => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED),
    []
  );

  const toggleExtra = (srv: string) => {
    setWantedExtras((prev) =>
      prev.includes(srv) ? prev.filter((x) => x !== srv) : [...prev, srv]
    );
  };

  const computeTotalChf = (profile: typeof deduplicatedProfiles[0]) => {
    const base =
      duration === 30 ? profile.rate30Chf : duration === 120 ? profile.rate120Chf : profile.bestBaseRate60Chf;
    let extrasSum = 0;
    const paidExtras: string[] = [];
    const freeExtras: string[] = [];

    for (const srv of wantedExtras) {
      if (profile.includedServices.some((inc) => inc.toLowerCase().includes(srv.toLowerCase()))) {
        freeExtras.push(srv);
      } else {
        extrasSum += profile.extraPricesChf[srv] ?? 70;
        paidExtras.push(srv);
      }
    }
    return {
      base,
      extrasSum,
      total: base + extrasSum,
      freeExtras,
      paidExtras,
    };
  };

  const resetAllFilters = () => {
    setQuery("");
    setCanton("ALL");
    setModeFilter("ALL");
    setAgeGroup("ALL");
    setHairFilter("ALL");
    setCupFilter("ALL");
    setLanguageFilter("ALL");
    setMeetingFilter("ALL");
    setMaxPriceChf(1200);
    setWantedExtras(["GFE"]);
    setSortBy("recommended");
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const digits = q.replace(/\D/g, "");

    const filtered = deduplicatedProfiles.filter((p) => {
      if (canton !== "ALL" && p.canton !== canton) return false;
      if (modeFilter !== "ALL" && p.bookingMode !== modeFilter) return false;
      if (genderFilter !== "ALL" && p.genderCategory !== genderFilter) return false;
      if (meetingFilter === "incall" && !p.incall) return false;
      if (meetingFilter === "outcall" && !p.outcall) return false;

      if (ageGroup === "18-24" && (p.age < 18 || p.age > 24)) return false;
      if (ageGroup === "25-30" && (p.age < 25 || p.age > 30)) return false;
      if (ageGroup === "31+" && p.age < 31) return false;

      if (hairFilter !== "ALL" && !(p.hairColor || "").toLowerCase().includes(hairFilter.toLowerCase())) {
        return false;
      }
      if (cupFilter === "Natur" && !(p.bust || "").toLowerCase().includes("natur")) {
        return false;
      }
      if (cupFilter === "C-D" && !/[cd]/i.test(p.bust || "")) {
        return false;
      }
      if (
        languageFilter !== "ALL" &&
        !p.languages.some((l) => l.toLowerCase().includes(languageFilter.toLowerCase()))
      ) {
        return false;
      }

      const calc = computeTotalChf(p);
      if (calc.total > maxPriceChf) return false;

      if (!q) return true;
      if (digits.length >= 3 && p.rawPhoneFull.replace(/\D/g, "").includes(digits)) return true;

      const searchableText = [
        p.displayName,
        p.primaryCity,
        p.canton,
        ...p.subareas,
        ...p.includedServices,
        p.bio,
        p.height,
        p.bust,
        p.hairColor,
        ...p.languages,
        ...p.sources.map((s) => s.portal),
      ]
        .join(" ")
        .toLowerCase();

      return tokens.every((tok) => searchableText.includes(tok));
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === "price_asc") return computeTotalChf(a).total - computeTotalChf(b).total;
      if (sortBy === "savings_desc") return b.savingsPerHourChf - a.savingsPerHourChf;
      if (sortBy === "rating_desc") return b.ratingScore - a.ratingScore;
      return a.bookingMode === "direct" ? -1 : 1;
    });
  }, [
    deduplicatedProfiles,
    query,
    canton,
    modeFilter,
    genderFilter,
    meetingFilter,
    ageGroup,
    hairFilter,
    cupFilter,
    languageFilter,
    maxPriceChf,
    wantedExtras,
    duration,
    sortBy,
  ]);

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Schweizer Escort-Suchmaschine & Deep-Filter (Besser als xdate & fgirl) | iWantSexNow.ch"
        description="Filtere alle Schweizer Escort-Portale nach Haarfarbe, Alter, Oberweite, Tabu-freien Services, +41 Rufnummer und garantiertem Endpreis."
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

      <LivePortalSyncBanner totalProfiles={deduplicatedProfiles.length} />

      <main className="container mx-auto px-4 py-6 max-w-7xl space-y-6">
        {/* Precision Search & Deep Filter Console */}
        <div className="bg-[#09131E] border-2 border-[#C69C6D]/55 rounded-2xl p-5 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ✓ {INITIAL_RAW_SWISS_FEED.length} Inserate gescannt → {results.length} passende Profile
                </Badge>
                <Link href="/how-it-works" className="text-xs text-[#D5A021] font-bold hover:underline flex items-center gap-1">
                  <HelpCircle size={13} /> Rufnummern-Scanner & Erklärung
                </Link>
              </div>
              <div className="flex flex-wrap gap-1.5 mb-2">
                {[
                  { id: "ALL", label: "✨ Alle Profile" },
                  { id: "female", label: "👩 Female Escorts" },
                  { id: "male", label: "🤵 Gigolos & Callboys (Für Damen, Herren & Paare)" },
                  { id: "couple", label: "👩‍❤️‍👨 Paare & Duo" },
                ].map((g) => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setGenderFilter(g.id as any)}
                    className={`px-3 py-1 rounded-xl text-xs font-black border transition-all ${
                      genderFilter === g.id
                        ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                        : "bg-black/40 border-white/15 text-gray-300 hover:text-white"
                    }`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
              <h1 className="text-xl md:text-3xl font-serif font-black">
                Schweizer Präzisions-Suche & Endpreis-Filter
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className="border-[#C69C6D]/50 text-[#D5A021] hover:bg-[#C69C6D]/10 text-xs font-bold"
              >
                <SlidersHorizontal size={13} className="mr-1.5" />
                {showAdvancedFilters ? "Detail-Filter einklappen" : "Alle Detail-Filter öffnen (Optik, Busen, Services)"}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={resetAllFilters}
                className="text-gray-400 hover:text-white text-xs"
              >
                <RotateCcw size={13} className="mr-1" /> Reset
              </Button>
            </div>
          </div>

          {/* Primary Search Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-white/10">
            <div className="md:col-span-5 relative">
              <SearchIcon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D5A021]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, Ort (Zug, Cham, Zürich), +41 Rufnummer oder Vorliebe..."
                className="w-full rounded-xl bg-black/60 border border-white/25 pl-10 pr-4 py-2.5 text-sm text-white focus:border-[#D5A021] focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                className="w-full rounded-xl bg-black/60 border border-white/25 px-3 py-2.5 text-sm text-white"
              >
                <option value="ALL">📍 Alle Kantone ({deduplicatedProfiles.length})</option>
                <option value="ZH">Zürich (ZH)</option>
                <option value="ZG">Zug & Cham (ZG)</option>
                <option value="BS">Basel (BS)</option>
                <option value="BE">Bern (BE)</option>
                <option value="LU">Luzern (LU)</option>
                <option value="SG">St. Gallen (SG)</option>
                <option value="AG">Aargau (AG)</option>
                <option value="GE">Genève (GE)</option>
                <option value="VD">Lausanne / Vaud (VD)</option>
                <option value="TI">Lugano / Ticino (TI)</option>
              </select>
            </div>

            <div className="md:col-span-2 flex bg-black/60 p-1 rounded-xl border border-white/20">
              {([30, 60, 120] as const).map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={
                    duration === mins
                      ? "flex-1 py-1.5 rounded-lg text-xs font-black bg-[#C69C6D] text-[#0D1B2A]"
                      : "flex-1 py-1.5 rounded-lg text-xs font-bold text-gray-300"
                  }
                >
                  {mins === 120 ? "2h" : `${mins}m`}
                </button>
              ))}
            </div>

            <div className="md:col-span-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full rounded-xl bg-black/60 border border-[#C69C6D]/40 px-2.5 py-2.5 text-xs font-bold text-[#D5A021]"
              >
                <option value="recommended">👑 Top & Direkt zuerst</option>
                <option value="price_asc">💰 Günstigster Endpreis</option>
                <option value="savings_desc">🔥 Grösste Ersparnis</option>
                <option value="rating_desc">⭐ Beste Bewertung</option>
              </select>
            </div>
          </div>

          {/* Collapsible Deep Attribute & Service Filter Drawer */}
          {showAdvancedFilters && (
            <div className="pt-3 border-t border-white/10 space-y-4 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
                {/* Age Filter */}
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Alter</label>
                  <select
                    value={ageGroup}
                    onChange={(e) => setAgeGroup(e.target.value as any)}
                    className="w-full bg-transparent text-white font-bold focus:outline-none"
                  >
                    <option value="ALL" className="bg-[#09131E]">Alle Altersklassen</option>
                    <option value="18-24" className="bg-[#09131E]">18 – 24 Jahre (Young)</option>
                    <option value="25-30" className="bg-[#09131E]">25 – 30 Jahre</option>
                    <option value="31+" className="bg-[#09131E]">31+ Jahre (Lady / MILF)</option>
                  </select>
                </div>

                {/* Hair Color */}
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Haarfarbe</label>
                  <select
                    value={hairFilter}
                    onChange={(e) => setHairFilter(e.target.value as any)}
                    className="w-full bg-transparent text-white font-bold focus:outline-none"
                  >
                    <option value="ALL" className="bg-[#09131E]">Alle Haarfarben</option>
                    <option value="Blond" className="bg-[#09131E]">Blond</option>
                    <option value="Brünett" className="bg-[#09131E]">Brünett / Braun</option>
                    <option value="Schwarz" className="bg-[#09131E]">Schwarz</option>
                  </select>
                </div>

                {/* Cup / Bust */}
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Oberweite</label>
                  <select
                    value={cupFilter}
                    onChange={(e) => setCupFilter(e.target.value as any)}
                    className="w-full bg-transparent text-white font-bold focus:outline-none"
                  >
                    <option value="ALL" className="bg-[#09131E]">Alle Körbchengrössen</option>
                    <option value="Natur" className="bg-[#09131E]">100% Naturbusen</option>
                    <option value="C-D" className="bg-[#09131E]">Grosse Oberweite (C–DD)</option>
                  </select>
                </div>

                {/* Language */}
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Sprache</label>
                  <select
                    value={languageFilter}
                    onChange={(e) => setLanguageFilter(e.target.value as any)}
                    className="w-full bg-transparent text-white font-bold focus:outline-none"
                  >
                    <option value="ALL" className="bg-[#09131E]">Alle Sprachen</option>
                    <option value="Deutsch" className="bg-[#09131E]">Deutsch / CH-Deutsch</option>
                    <option value="English" className="bg-[#09131E]">English</option>
                    <option value="Français" className="bg-[#09131E]">Français</option>
                    <option value="Italiano" className="bg-[#09131E]">Italiano</option>
                  </select>
                </div>

                {/* Meeting Type */}
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <label className="text-[10px] text-gray-400 uppercase font-bold block mb-1">Treffpunkt</label>
                  <select
                    value={meetingFilter}
                    onChange={(e) => setMeetingFilter(e.target.value as any)}
                    className="w-full bg-transparent text-white font-bold focus:outline-none"
                  >
                    <option value="ALL" className="bg-[#09131E]">Studio & Hotel-Outcall</option>
                    <option value="incall" className="bg-[#09131E]">Nur Privat-Studio (Incall)</option>
                    <option value="outcall" className="bg-[#09131E]">Hotel- / Hausbesuch (Outcall)</option>
                  </select>
                </div>

                {/* Max Budget Slider */}
                <div className="bg-black/40 p-2.5 rounded-xl border border-white/10">
                  <div className="flex justify-between text-[10px] mb-1">
                    <span className="text-gray-400 uppercase font-bold">Max. Endpreis</span>
                    <strong className="text-[#D5A021]">CHF {maxPriceChf}</strong>
                  </div>
                  <input
                    type="range"
                    min={250}
                    max={1500}
                    step={50}
                    value={maxPriceChf}
                    onChange={(e) => setMaxPriceChf(Number(e.target.value))}
                    className="w-full accent-[#C69C6D] cursor-pointer"
                  />
                </div>
              </div>

              {/* Service & Taboo-Free Calculator Toggles */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-[#D5A021] font-bold flex items-center gap-1 mr-1">
                  <Calculator size={13} /> Gewünschte Services (live im Endpreis eingerechnet):
                </span>
                {ALL_SERVICE_FILTERS.map((srv) => {
                  const active = wantedExtras.includes(srv.id);
                  return (
                    <button
                      key={srv.id}
                      type="button"
                      onClick={() => toggleExtra(srv.id)}
                      className={
                        active
                          ? "px-3 py-1.5 rounded-xl text-xs font-bold border bg-emerald-500/20 border-emerald-400 text-white shadow"
                          : "px-3 py-1.5 rounded-xl text-xs font-bold border bg-white/5 border-white/15 text-gray-300 hover:border-white/30"
                      }
                    >
                      {active ? "✓ " : "+ "}{srv.label}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Rich Result Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {results.map((p, idx) => {
            const calc = computeTotalChf(p);
            const isDirect = p.bookingMode === "direct";
            return (
              <Card
                key={p.dedupClusterId}
                className={`bg-[#09131E] rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl transition-all ${
                  idx < 2 ? "border-2 border-[#C69C6D]" : "border border-[#C69C6D]/40 hover:border-[#D5A021]"
                }`}
              >
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/profile/${encodeURIComponent(p.displayName)}`}
                      className="relative w-full sm:w-44 h-60 sm:h-52 rounded-xl overflow-hidden shrink-0 border border-white/15 block group"
                    >
                      <img
                        src={p.thumbnail}
                        alt={p.displayName}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src =
                            "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop";
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div
                        className={
                          isDirect
                            ? "absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 bg-emerald-600 text-white"
                            : "absolute top-2.5 left-2.5 px-2.5 py-1 rounded-full text-[11px] font-bold flex items-center gap-1 bg-sky-700 text-white"
                        }
                      >
                        {isDirect ? <CalendarCheck size={12} /> : <Globe size={12} />}
                        {isDirect ? "Direkt Buchbar" : "Schweizer Index"}
                      </div>
                      <div className="absolute top-2.5 right-2.5 bg-black/85 border border-[#C69C6D] text-[#D5A021] text-[11px] font-black px-2 py-0.5 rounded-md flex items-center gap-1">
                        <Star size={11} className="fill-[#D5A021]" /> {p.ratingScore.toFixed(1)}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-black/85 rounded-lg px-2 py-1 text-[11px] text-amber-300 text-center font-mono flex items-center justify-center gap-1.5">
                        <Camera size={11} /> {p.gallery.length} Foto(s) · {p.sourcesCount} Portal(e)
                      </div>
                    </Link>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between gap-2">
                          <Link href={`/profile/${encodeURIComponent(p.displayName)}`} className="hover:text-[#D5A021]">
                            <h2 className="text-2xl font-serif font-black">
                              {p.displayName}, {p.age}
                            </h2>
                          </Link>
                          <span className="text-xs text-gray-300 font-mono bg-white/5 px-2 py-1 rounded border border-white/10">
                            <PhoneCall size={11} className="inline mr-1 text-[#D5A021]" />
                            {p.normalizedPhoneMask}
                          </span>
                        </div>

                        <p className="text-xs text-[#D5A021] font-semibold mt-1">
                          📍 {p.subareas.join(" · ")} ({p.canton})
                        </p>

                        {/* Deep Attribute Pills (Hair, Bust, Height, Languages) */}
                        <div className="flex flex-wrap gap-1.5 mt-2 text-[11px] text-gray-300">
                          <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">{p.hairColor}</span>
                          <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">{p.height}</span>
                          <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">{p.bust}</span>
                          <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">{p.languages.slice(0, 2).join(" / ")}</span>
                        </div>

                        <p className="text-xs text-gray-400 mt-2 line-clamp-2">
                          {p.bio}
                        </p>
                      </div>

                      <div className="mt-3 p-3 rounded-xl bg-white/5 border border-[#C69C6D]/35 flex items-center justify-between">
                        <div>
                          <div className="text-[11px] text-gray-300">
                            Garantierter Endpreis ({duration} Min. inkl. Extras)
                          </div>
                          <div className="text-2xl font-black text-[#D5A021]">
                            CHF {calc.total}
                          </div>
                        </div>
                        <div className="text-right text-xs">
                          <div className="text-gray-400 line-through">
                            Andere Portale: CHF {p.portalAverage60Chf + calc.extrasSum}
                          </div>
                          <div className="text-emerald-400 font-bold">
                            Spare CHF {Math.max(40, p.portalAverage60Chf - p.bestBaseRate60Chf)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Included Services Badges */}
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-emerald-400 font-bold mr-1">✓ Inklusive:</span>
                    {p.includedServices.slice(0, 6).map((srv) => (
                      <span key={srv} className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-200">
                        {srv}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-rose-500/50 text-rose-300 hover:bg-rose-950/50 text-xs"
                    asChild
                  >
                    <Link href={`/live-cam?provider=${encodeURIComponent(p.displayName)}`}>
                      <Video size={13} className="mr-1.5 text-rose-400" />
                      3-Min. Live-Cam Check
                    </Link>
                  </Button>

                  <div className="flex gap-2 ml-auto">
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-white/20 text-white hover:bg-white/10 text-xs"
                      asChild
                    >
                      <Link href={`/profile/${encodeURIComponent(p.displayName)}`}>
                        Alle Fotos & Berichte
                      </Link>
                    </Button>
                    <Button
                      size="sm"
                      className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black text-xs"
                      asChild
                    >
                      <Link
                        href={`/booking-confirmation?provider=${encodeURIComponent(
                          p.displayName
                        )}&city=${encodeURIComponent(p.primaryCity)}&duration=${duration}&total=${
                          calc.total
                        }&extras=${encodeURIComponent(wantedExtras.join(", "))}`}
                      >
                        <Send size={13} className="mr-1.5" />
                        Zum Fixpreis buchen
                      </Link>
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </main>
      <SeoSiloFooter />
    </div>
  );
}