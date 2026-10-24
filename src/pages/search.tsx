import { useState, useMemo } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Search,
  ShieldCheck,
  Globe,
  CalendarCheck,
  Calculator,
  SlidersHorizontal,
  Database,
  Plus,
  Send,
  CheckCircle,
  TrendingDown,
  MapPin,
  PhoneCall,
} from "lucide-react";
import {
  INITIAL_RAW_SWISS_FEED,
  deduplicateScrapedOffers,
  RawScrapedOffer,
} from "@/lib/marketplace/indexer";

const EXTRA_LIST = ["GFE", "Dinner Dates", "Outcall", "Massage", "Overnight"];

export default function SwissMetaSearchPage() {
  const { toast } = useToast();
  const [rawFeed, setRawFeed] = useState<RawScrapedOffer[]>(INITIAL_RAW_SWISS_FEED);
  const [query, setQuery] = useState("");
  const [selectedCanton, setSelectedCanton] = useState("ALL");
  const [modeFilter, setModeFilter] = useState<"all" | "direct" | "indexed">("all");
  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["GFE"]);
  const [showImporter, setShowImporter] = useState(false);

  // Live Scraper / Firecrawl Test Input
  const [newPortal, setNewPortal] = useState("xdate.ch");
  const [newName, setNewName] = useState("Elena");
  const [newPhone, setNewPhone] = useState("078 901 33 21");
  const [newCity, setNewCity] = useState("Cham / Zug");
  const [newCanton, setNewCanton] = useState("ZG");
  const [newPrice, setNewPrice] = useState(490);

  const deduplicatedProfiles = useMemo(() => deduplicateScrapedOffers(rawFeed), [rawFeed]);
  const duplicatesRemoved = rawFeed.length - deduplicatedProfiles.length;

  const calculateTotal = (p: typeof deduplicatedProfiles[0]) => {
    const mult = duration === 30 ? 0.65 : duration === 120 ? 1.8 : 1;
    const base = Math.round((p.bestBaseRate60Chf * mult) / 10) * 10;
    let extraSum = 0;
    selectedExtras.forEach((ext) => {
      if (!p.includedServices.includes(ext)) {
        extraSum += p.extraPricesChf[ext] ?? 70;
      }
    });
    const total = base + extraSum;
    const portalTotal = Math.round((p.portalAverage60Chf * mult) / 10) * 10 + extraSum + 30;
    return { base, extraSum, total, portalTotal, savings: Math.max(0, portalTotal - total) };
  };

  const filteredProfiles = deduplicatedProfiles
    .filter((p) => {
      if (selectedCanton !== "ALL" && p.canton !== selectedCanton) return false;
      if (modeFilter !== "all" && p.bookingMode !== modeFilter) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${p.displayName} ${p.primaryCity} ${p.canton} ${p.subareas.join(" ")} ${p.normalizedPhoneMask}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    })
    .sort((a, b) => calculateTotal(a).total - calculateTotal(b).total);

  const handleSimulateFirecrawlImport = (e: React.FormEvent) => {
    e.preventDefault();
    const incomingOffer: RawScrapedOffer = {
      sourcePortal: newPortal,
      rawName: newName,
      age: 24,
      rawPhone: newPhone,
      city: newCity,
      canton: newCanton,
      subareas: [newCity],
      advertisedBaseChf: Number(newPrice),
      includedTags: ["GFE"],
      incall: true,
      outcall: true,
      scrapedAtIso: "Gerade via Firecrawl importiert",
      directAuthorized: false,
    };
    setRawFeed((prev) => [incomingOffer, ...prev]);
    toast({
      title: `Inserat von ${newPortal} importiert & dedupliziert!`,
      description: `Telefonnummer (${newPhone}) wurde abgeglichen: Kein doppeltes Profil erzeugt, Preisvergleich aktualisiert.`,
      duration: 4500,
    });
  };

  const toggleExtra = (ext: string) => {
    setSelectedExtras((prev) => (prev.includes(ext) ? prev.filter((x) => x !== ext) : [...prev, ext]));
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Schweizer Escort-Suchmaschine & Dubletten-Index | iWantSexNow.ch"
        description="Durchsuche alle Schweizer Portale und Direktprofile in ZÃ¼rich, Zug, Cham und der ganzen Schweiz â€“ automatisch um Dubletten bereinigt und nach echtem Endpreis sortiert."
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

      <main className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
        {/* Top Meta-Index Header + Live Deduplication Stats */}
        <div className="bg-[#09131E] border border-[#C69C6D]/40 rounded-2xl p-6 shadow-2xl space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
                  <Database size={12} className="mr-1.5 inline" />
                  Live Cross-Portal Index: {rawFeed.length} Roh-Inserate â†’ {deduplicatedProfiles.length} echte Profile ({duplicatesRemoved} Dubletten eliminiert)
                </Badge>
              </div>
              <h1 className="text-2xl md:text-4xl font-serif font-black">
                Schweizer Meta-Suche & Endpreis-Sortierung
              </h1>
              <p className="text-sm text-gray-300 mt-1">
                Eine Suche Ã¼ber alle Schweizer Portale und autorisierten Direktprofile â€“ automatisch nach dem gÃ¼nstigsten echten Komplettpreis sortiert.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowImporter(!showImporter)}
              className="border-[#C69C6D] text-[#D5A021] hover:bg-[#C69C6D]/10 font-bold self-start"
            >
              <Plus size={16} className="mr-1.5" />
              {showImporter ? "Firecrawl-Importer schlieÃŸen" : "Firecrawl / Portal-Import testen"}
            </Button>
          </div>

          {/* Interactive Firecrawl / Scraper Ingestion Simulator */}
          {showImporter && (
            <div className="p-5 rounded-xl bg-black/50 border border-emerald-500/40 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold text-emerald-400 uppercase tracking-wider">
                  Firecrawl / Scraper Live-Deduplizierung testen (Telefonnummern-Cluster)
                </h2>
                <span className="text-xs text-gray-400">API: POST /api/indexer/import</span>
              </div>
              <p className="text-xs text-gray-300">
                Simuliere, wie unser Scraper ein weiteres Inserat auf einem Drittportal findet. Hat die Anbieterin dieselbe Telefonnummer (egal in welcher Schreibweise, z. B. <code>078 901 33 21</code> fÃ¼r Elena in Zug/Cham), wird kein Duplikat erzeugt, sondern das bestehende Profil um die Quelle ergÃ¤nzt:
              </p>
              <form onSubmit={handleSimulateFirecrawlImport} className="grid sm:grid-cols-2 lg:grid-cols-6 gap-3">
                <input
                  type="text"
                  value={newPortal}
                  onChange={(e) => setNewPortal(e.target.value)}
                  placeholder="Quell-Portal (z.B. xdate.ch)"
                  className="rounded-lg bg-black/60 border border-white/20 px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Name im Inserat"
                  className="rounded-lg bg-black/60 border border-white/20 px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Telefon (+41 / 078...)"
                  className="rounded-lg bg-black/60 border border-white/20 px-3 py-2 text-xs text-white"
                />
                <input
                  type="text"
                  value={newCity}
                  onChange={(e) => setNewCity(e.target.value)}
                  placeholder="Ort (z.B. Cham / Zug)"
                  className="rounded-lg bg-black/60 border border-white/20 px-3 py-2 text-xs text-white"
                />
                <input
                  type="number"
                  value={newPrice}
                  onChange={(e) => setNewPrice(Number(e.target.value))}
                  placeholder="Preis CHF"
                  className="rounded-lg bg-black/60 border border-white/20 px-3 py-2 text-xs text-white"
                />
                <Button type="submit" className="bg-emerald-500 hover:bg-emerald-600 text-[#0D1B2A] font-black text-xs">
                  Inserat einspeisen
                </Button>
              </form>
            </div>
          )}

          {/* Search & Filter Controls */}
          <div className="grid md:grid-cols-12 gap-3">
            <div className="md:col-span-5 relative">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D5A021]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, Ort (ZÃ¼rich, Zug, Cham), Telefonnummer..."
                className="w-full rounded-xl bg-black/50 border border-white/20 pl-10 pr-4 py-3 text-sm text-white"
              />
            </div>

            <div className="md:col-span-3 flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
              {(["ALL", "ZH", "ZG", "BS"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCanton(c)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    selectedCanton === c ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {c === "ALL" ? "Alle" : c}
                </button>
              ))}
            </div>

            <div className="md:col-span-4 flex gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10">
              {([
                { id: "all", label: "Alle Profile" },
                { id: "direct", label: "Direkt Buchbar" },
                { id: "indexed", label: "Markt-Index" },
              ] as const).map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setModeFilter(m.id)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${
                    modeFilter === m.id ? "bg-white/15 text-white border border-[#C69C6D]/40" : "text-gray-400"
                  }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Total Cost Calculator Bar inside Search */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/10">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold text-[#D5A021] uppercase mr-1 flex items-center gap-1">
                <Calculator size={13} /> Endpreis-Optionen:
              </span>
              {EXTRA_LIST.map((ext) => {
                const active = selectedExtras.includes(ext);
                return (
                  <button
                    key={ext}
                    type="button"
                    onClick={() => toggleExtra(ext)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      active
                        ? "bg-emerald-500/20 border-emerald-400 text-white"
                        : "bg-black/30 border-white/10 text-gray-400"
                    }`}
                  >
                    {active ? "âœ“ " : "+ "}{ext}
                  </button>
                );
              })}
            </div>

            <div className="flex bg-black/50 p-1 rounded-xl border border-white/15">
              {([30, 60, 120] as const).map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold ${
                    duration === mins ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300"
                  }`}
                >
                  {mins === 120 ? "2 Std." : `${mins} Min.`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Deduplicated Search Results */}
        <div className="grid md:grid-cols-2 gap-6">
          {filteredProfiles.map((p) => {
            const calc = calculateTotal(p);
            const isDirect = p.bookingMode === "direct";
            return (
              <Card
                key={p.dedupClusterId}
                className="bg-[#09131E] border border-[#C69C6D]/40 rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl"
              >
                <div>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="relative w-full sm:w-40 h-52 sm:h-44 rounded-xl overflow-hidden shrink-0 border border-white/15">
                      <img src={p.thumbnail} alt={p.displayName} className="w-full h-full object-cover" />
                      <div
                        className={`absolute top-2 left-2 px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 ${
                          isDirect ? "bg-emerald-600 text-white" : "bg-sky-600 text-white"
                        }`}
                      >
                        {isDirect ? <CalendarCheck size={11} /> : <Globe size={11} />}
                        {isDirect ? "Direkt Buchbar" : "Markt-Index"}
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-black/85 text-amber-300 text-[10px] font-bold px-2 py-1 rounded text-center">
                        {p.sourcesCount} Inserate â†’ 1 Cluster-ID
                      </div>
                    </div>

                    <div className="flex-1 min-w-0 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <h2 className="text-xl font-serif font-black">
                            {p.displayName}, {p.age}
                          </h2>
                          <span className="text-[11px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-gray-300 font-mono">
                            <PhoneCall size={10} className="inline mr-1 text-[#D5A021]" />
                            {p.normalizedPhoneMask}
                          </span>
                        </div>
                        <p className="text-xs text-[#D5A021] font-semibold mt-1">
                          ðŸ“ {p.subareas.join(" Â· ")} ({p.canton})
                        </p>
                        <p className="text-[11px] text-emerald-300 mt-1">{p.freshnessLabel}</p>
                      </div>

                      <div className="mt-3 bg-white/5 border border-[#C69C6D]/30 rounded-xl p-3 flex items-center justify-between">
                        <div>
                          <div className="text-[10px] text-gray-400">
                            Echter Komplettpreis ({duration} Min.)
                          </div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-black text-[#D5A021]">CHF {calc.total}</span>
                            <span className="text-xs text-gray-400 line-through">Ã˜ CHF {calc.portalTotal}</span>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs">
                          Sparvorteil CHF {calc.savings}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  {/* Sources deduplicated into this profile */}
                  <div className="mt-4 bg-black/40 rounded-xl p-3 border border-white/10 text-xs space-y-1.5">
                    <div className="text-[11px] font-bold text-gray-400 uppercase">
                      Gefundene & zusammengefÃ¼hrte Quellen fÃ¼r diese Telefonnummer:
                    </div>
                    {p.sources.map((s, idx) => (
                      <div key={idx} className="flex items-center justify-between">
                        <span className={s.isDirect ? "text-emerald-400 font-bold" : "text-gray-300"}>
                          {s.portal} <span className="text-gray-500">({s.lastSeenIso})</span>
                        </span>
                        <span className={s.isDirect ? "text-emerald-400 font-black" : "text-gray-400 line-through"}>
                          CHF {s.priceChf}/Std.
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                  <Link href="/create-post" className="text-[11px] text-gray-400 hover:text-[#D5A021] underline">
                    Sind Sie {p.displayName}? Profil Ã¼bernehmen
                  </Link>
                  <Button
                    size="sm"
                    className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black text-xs"
                    asChild
                  >
                    <Link href={`/profile/${encodeURIComponent(p.displayName)}`}>
                      <Send size={12} className="mr-1.5" />
                      {isDirect ? "Direkt zum Fixpreis buchen" : "Termin anfragen"}
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
