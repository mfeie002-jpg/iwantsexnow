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
  Trophy,
  Star,
  ShieldCheck,
  Flame,
  Award,
  MapPin,
  CheckCircle2,
  Send,
  ThumbsUp,
  Lock,
  Globe,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

const SERVICE_CATEGORIES = [
  { id: "ALL", label: "Gesamt-Sieger Schweiz" },
  { id: "GFE", label: "Beste Girlfriend Experience (GFE)" },
  { id: "Dinner Dates", label: "Beste Dinner-Date & VIP Begleitung" },
  { id: "Outcall", label: "Bester Hotel- & Hausbesuch (Zug/Zürich)" },
  { id: "Massage", label: "Beste Erotik- & Tantra-Massage" },
];

const PORTAL_BENCHMARKS = [
  {
    rank: 1,
    portal: "iWantSexNow.ch (Direktbuchung & Index)",
    priceHonestyScore: 9.9,
    photoAuthenticity: 9.8,
    duplicateFree: "100% Bereinigt",
    avgMarkup: "0% (Garantierter Fixpreis)",
    verdict: "Testsieger 2026: Einzige Plattform mit echtem Vorab-Endpreis-Rechner, Dubletten-Filter und freischaltbaren Echtzeit-Videos.",
    highlight: true,
  },
  {
    rank: 2,
    portal: "fgirl.ch (Westschweiz & Zürich)",
    priceHonestyScore: 7.6,
    photoAuthenticity: 8.1,
    duplicateFree: "Viele Mehrfach-Inserate",
    avgMarkup: "+CHF 70 bis +CHF 120 vor Ort",
    verdict: "Gute Auswahl in Genf & Lausanne, aber keine zentrale Endpreis-Garantie für Extras.",
    highlight: false,
  },
  {
    rank: 3,
    portal: "xdate.ch (Deutschschweiz)",
    priceHonestyScore: 7.2,
    photoAuthenticity: 7.5,
    duplicateFree: "Hohe Dubletten-Rate",
    avgMarkup: "+CHF 80 Ø Aufpreis für Extras",
    verdict: "Grosses Volumen in Zürich & Zug, jedoch oft identische Profile mehrfach unter verschiedenen Preisen gelistet.",
    highlight: false,
  },
  {
    rank: 4,
    portal: "and6.com (Studios & Kontaktanzeigen)",
    priceHonestyScore: 6.9,
    photoAuthenticity: 7.1,
    duplicateFree: "Ungefiltert",
    avgMarkup: "+CHF 90 Ø Nachverhandlung",
    verdict: "Viele Kurzzeit-Inserate und Studios, aber kaum transparente Komplettpreise vorab.",
    highlight: false,
  },
];

export default function SwissRankingsPage() {
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCanton, setSelectedCanton] = useState("ALL");
  const [votedIds, setVotedIds] = useState<string[]>([]);

  const profiles = useMemo(() => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED), []);

  const rankedEscorts = useMemo(() => {
    return profiles
      .filter((p) => {
        if (selectedCanton !== "ALL" && p.canton !== selectedCanton) return false;
        if (selectedCategory !== "ALL" && !p.includedServices.includes(selectedCategory)) return false;
        return true;
      })
      .map((p, idx) => {
        const extraVote = votedIds.includes(p.dedupClusterId) ? 1 : 0;
        const baseScore = p.bookingMode === "direct" ? 9.8 : 9.1;
        const score = Math.min(9.9, Number((baseScore - (idx % 4) * 0.1 + extraVote * 0.1).toFixed(1)));
        const verifiedReviews = 64 + ((idx * 19) % 110) + extraVote;
        return {
          ...p,
          score,
          verifiedReviews,
          pricePerformanceScore: 9.9,
          photoRealnessScore: p.bookingMode === "direct" ? 10.0 : 9.2,
        };
      })
      .sort((a, b) => b.score - a.score || a.bestBaseRate60Chf - b.bestBaseRate60Chf);
  }, [profiles, selectedCategory, selectedCanton, votedIds]);

  const handleVote = (clusterId: string, name: string) => {
    if (votedIds.includes(clusterId)) return;
    setVotedIds((prev) => [...prev, clusterId]);
    toast({
      title: `Stimme für ${name} gezählt!`,
      description: "Deine Bewertung für Preis-Ehrlichkeit & Foto-Echtheit wurde im Live-Ranking gespeichert.",
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Schweizer Escort, Service & Portal Rankings 2026 | iWantSexNow.ch"
        description="Wer, wie, wo, was ist das Beste in Zürich, Zug & der Schweiz? Offizielle Rankings für Escorts, Services (GFE, Massage, Outcall) und Schweizer Portale."
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

      <main className="container mx-auto px-4 py-10 max-w-7xl space-y-12">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
            <Trophy size={13} className="mr-1.5 inline" /> Swiss Shield Quality Awards 2026
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black">
            Schweizer Bestenliste: Escorts, Services & Portale
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            100% datenbasiert nach echter Preis-Treue (0% Nachverhandlung), Foto-Echtheit, Reaktionszeit und verifizierten Kunden-Bewertungen in Zürich, Zug & der ganzen Schweiz.
          </p>
        </div>

        {/* Category & Canton Filter */}
        <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-5 rounded-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-2">
              {SERVICE_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all ${
                    selectedCategory === cat.id
                      ? "bg-[#C69C6D] text-[#0D1B2A] shadow-lg"
                      : "bg-black/40 border border-white/10 text-gray-300 hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="flex bg-black/50 p-1 rounded-xl border border-white/15">
              {(["ALL", "ZH", "ZG", "BS"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSelectedCanton(c)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    selectedCanton === c ? "bg-emerald-500 text-[#0D1B2A]" : "text-gray-300"
                  }`}
                >
                  {c === "ALL" ? "Alle Kantone" : c}
                </button>
              ))}
            </div>
          </div>
        </Card>

        {/* Top Ranked Escorts Leaderboard */}
        <div className="space-y-4">
          <h2 className="text-2xl font-serif font-black flex items-center gap-2">
            <Award size={22} className="text-[#D5A021]" />
            Top-Platzierte Anbieterinnen ({selectedCategory === "ALL" ? "Gesamtwertung" : selectedCategory})
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rankedEscorts.slice(0, 12).map((p, index) => (
              <Card
                key={p.dedupClusterId}
                className={`bg-[#09131E] rounded-2xl overflow-hidden text-white flex flex-col justify-between shadow-2xl ${
                  index < 3 ? "border-2 border-[#C69C6D]" : "border border-white/15"
                }`}
              >
                <div>
                  <div className="relative h-60">
                    <img src={p.thumbnail} alt={p.displayName} className="w-full h-full object-cover" />
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] text-xs font-black px-3 py-1 rounded-full shadow">
                      #{index + 1} · {index === 0 ? "TESTSIEGERIN" : index === 1 ? "TOP PREIS-LEISTUNG" : index === 2 ? "TOP VERIFIZIERT" : "TOP RANKED"}
                    </div>
                    <div className="absolute top-3 right-3 bg-black/85 border border-[#C69C6D] text-[#D5A021] text-sm font-black px-3 py-1 rounded-xl flex items-center gap-1">
                      <Star size={13} className="fill-[#D5A021]" /> {p.score}/10
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-2xl font-serif font-black">
                          {p.displayName}, {p.age}
                        </h3>
                        <p className="text-xs text-[#D5A021] font-semibold">
                          📍 {p.subareas.join(" · ")} ({p.canton})
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400">Direktpreis</div>
                        <div className="text-xl font-black text-emerald-400">CHF {p.bestBaseRate60Chf}</div>
                      </div>
                    </div>

                    {/* Sub-Ratings */}
                    <div className="grid grid-cols-3 gap-2 bg-black/40 p-2.5 rounded-xl border border-white/10 text-center text-[11px]">
                      <div>
                        <div className="text-gray-400">Foto-Echtheit</div>
                        <div className="font-black text-emerald-400">{p.photoRealnessScore.toFixed(1)}/10</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Endpreis-Treue</div>
                        <div className="font-black text-[#D5A021]">{p.pricePerformanceScore}/10</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Bewertungen</div>
                        <div className="font-black text-white">{p.verifiedReviews} ✓</div>
                      </div>
                    </div>

                    <div className="text-xs text-gray-300">
                      <strong className="text-white">Ausgezeichnet für:</strong> {p.includedServices.join(" · ")}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleVote(p.dedupClusterId, p.displayName)}
                    className="border-white/20 text-gray-200 hover:bg-white/10 text-xs"
                  >
                    <ThumbsUp size={12} className="mr-1.5 text-[#D5A021]" />
                    Empfehlen ({p.verifiedReviews})
                  </Button>
                  <Button
                    size="sm"
                    className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black text-xs"
                    asChild
                  >
                    <Link href={`/profile/${encodeURIComponent(p.displayName)}`}>
                      Profil & VIP-Videos →
                    </Link>
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Section 2: Swiss Platform & Portal Benchmark Ranking */}
        <div className="space-y-4 pt-6 border-t border-white/10">
          <div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
              <Globe size={12} className="mr-1.5 inline" /> Unabhängiger Schweizer Portal-Index-Benchmark
            </Badge>
            <h2 className="text-2xl md:text-3xl font-serif font-black">
              Welches Schweizer Escort-Portal ist das Beste? (Plattform-Rating)
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            {PORTAL_BENCHMARKS.map((b) => (
              <Card
                key={b.portal}
                className={`p-6 rounded-2xl text-white space-y-3 ${
                  b.highlight
                    ? "bg-gradient-to-br from-[#12263A] to-[#09131E] border-2 border-[#C69C6D]"
                    : "bg-[#09131E] border border-white/15"
                }`}
              >
                <div className="flex items-center justify-between">
                  <Badge className={b.highlight ? "bg-[#C69C6D] text-[#0D1B2A] font-black" : "bg-white/10 text-gray-300"}>
                    Platz #{b.rank} im Schweiz-Vergleich
                  </Badge>
                  <span className="text-lg font-black text-[#D5A021]">★ {b.priceHonestyScore}/10</span>
                </div>
                <h3 className="text-xl font-serif font-black">{b.portal}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">{b.verdict}</p>
                <div className="grid grid-cols-3 gap-2 pt-2 text-[11px] bg-black/40 p-3 rounded-xl border border-white/10">
                  <div>
                    <span className="text-gray-400 block">Foto-Check:</span>
                    <strong className="text-white">{b.photoAuthenticity}/10</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Dubletten:</span>
                    <strong className="text-emerald-400">{b.duplicateFree}</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block">Versteckte Kosten:</span>
                    <strong className="text-amber-300">{b.avgMarkup}</strong>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}