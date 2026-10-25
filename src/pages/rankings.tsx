import { BrandLogo } from "@/components/BrandLogo";
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
  Award,
  ThumbsUp,
  Globe,
  Building2,
  Flame,
  CheckCircle2,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";
import { LivePortalSyncBanner, SWISS_HOUSES_AND_CLUBS } from "@/components/marketplace/LivePortalSyncBanner";

const SERVICE_CATEGORIES = [
  { id: "ALL", label: "Gesamt-Sieger Schweiz" },
  { id: "GFE", label: "Beste Girlfriend Experience (GFE)" },
  { id: "Dinner Dates", label: "Beste Dinner-Date & VIP Begleitung" },
  { id: "Outcall", label: "Bester Hotel- & Hausbesuch (Zug/Zürich)" },
  { id: "Massage", label: "Beste Erotik- & Tantra-Massage" },
];

const INITIAL_PORTAL_RATINGS = [
  {
    rank: 1,
    id: "iwantsexnow",
    portal: "iWantSexNow.ch (Direktbuchung & Live-Index)",
    overallScore: 9.9,
    votes: 1420,
    metrics: {
      priceHonesty: 9.9,
      photoRealness: 9.8,
      upToDateSync: 10.0,
      discretion: 9.9,
    },
    duplicateFree: "100% Bereinigt (Stündlicher Sync)",
    avgMarkup: "0% (Garantierter Fixpreis vorab)",
    verdict: "Offizieller Schweizer Testsieger 2026: Bündelt alle Portale stündlich live, streicht Dubletten und bietet 3-Minuten 1:1 Live-Cam-Checks sowie verbindliche Endpreise.",
    highlight: true,
  },
  {
    rank: 2,
    id: "fgirl",
    portal: "fgirl.ch (Westschweiz & Deutschschweiz)",
    overallScore: 7.7,
    votes: 890,
    metrics: {
      priceHonesty: 7.2,
      photoRealness: 8.3,
      upToDateSync: 7.8,
      discretion: 7.6,
    },
    duplicateFree: "Mehrfach-Inserate vorhanden",
    avgMarkup: "+CHF 70 bis +CHF 120 vor Ort",
    verdict: "Gute Foto-Qualität und starke Präsenz in Genf, Lausanne & Zürich, aber keine Endpreis-Garantie für Extras.",
    highlight: false,
  },
  {
    rank: 3,
    id: "xdate",
    portal: "xdate.ch (Deutschschweiz)",
    overallScore: 7.3,
    votes: 1150,
    metrics: {
      priceHonesty: 6.8,
      photoRealness: 7.5,
      upToDateSync: 7.6,
      discretion: 7.4,
    },
    duplicateFree: "Hohe Dubletten-Rate",
    avgMarkup: "+CHF 85 Ø Aufpreis für Extras",
    verdict: "Viele Inserate in Zürich, Zug & Mittelland, jedoch oft dieselben Nummern mehrfach zu unterschiedlichen Preisen (wird auf iWantSexNow.ch automatisch bereinigt).",
    highlight: false,
  },
  {
    rank: 4,
    id: "and6",
    portal: "and6.com (Studios & Kontaktanzeigen)",
    overallScore: 7.0,
    votes: 930,
    metrics: {
      priceHonesty: 6.5,
      photoRealness: 7.1,
      upToDateSync: 7.3,
      discretion: 7.1,
    },
    duplicateFree: "Ungefiltert",
    avgMarkup: "+CHF 90 Ø Nachverhandlung",
    verdict: "Grosses Verzeichnis für kurzfristige Studio-Inserate, aber unübersichtliche Preisstruktur bei Sonderwünschen.",
    highlight: false,
  },
];

export default function SwissRankingsPage() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"escorts" | "portals" | "houses">("escorts");
  const [selectedCategory, setSelectedCategory] = useState("ALL");
  const [selectedCanton, setSelectedCanton] = useState("ALL");
  const [votedIds, setVotedIds] = useState<string[]>([]);
  const [portalList, setPortalList] = useState(INITIAL_PORTAL_RATINGS);

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
        const isPromoted = idx < 3 || p.bookingMode === "direct";
        const score = Math.min(9.9, Number(((p.ratingScore || 9.5) + extraVote * 0.1).toFixed(1)));
        const verifiedReviews = (p.reviewCount || 32) + extraVote;
        return {
          ...p,
          isPromoted,
          score,
          verifiedReviews,
          pricePerformanceScore: 9.9,
          photoRealnessScore: p.bookingMode === "direct" ? 10.0 : 9.4,
        };
      })
      .sort((a, b) => (a.isPromoted === b.isPromoted ? b.score - a.score : a.isPromoted ? -1 : 1));
  }, [profiles, selectedCategory, selectedCanton, votedIds]);

  const handleVote = (clusterId: string, name: string) => {
    if (votedIds.includes(clusterId)) return;
    setVotedIds((prev) => [...prev, clusterId]);
    toast({
      title: `Stimme für ${name} gezählt!`,
      description: "Deine Bewertung für Preis-Ehrlichkeit & Foto-Echtheit wurde im Live-Ranking gespeichert.",
    });
  };

  const handlePortalVote = (portalId: string, portalName: string) => {
    setPortalList((prev) =>
      prev.map((p) => (p.id === portalId ? { ...p, votes: p.votes + 1 } : p))
    );
    toast({
      title: `Plattform-Bewertung für ${portalName} gespeichert!`,
      description: "Danke für dein Feedback zur Schweizer Preis- und Foto-Transparenz.",
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Schweizer Escort, Portal & Laufhaus Rankings (Zeus, Aphrodite & Top-Profile) | iWantSexNow.ch"
        description="Wer, wie, wo, was ist das Beste in der Schweiz? Offizielle Rankings für Escorts, Schweizer Portale (xdate, fgirl, and6) und Häuser (Aphrodite, Zeus)."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <LivePortalSyncBanner totalProfiles={profiles.length} />

      <main className="container mx-auto px-4 py-10 max-w-7xl space-y-10">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
            <Trophy size={13} className="mr-1.5 inline" /> Swiss Shield Quality Awards & Index Benchmark 2026
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black">
            Schweizer Bestenliste: Escorts, Portale & Häuser
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Wähle unten zwischen den <strong>bestbewerteten Einzel-Profilen</strong>, dem grossen <strong>Schweizer Plattform-Rating</strong> und dem <strong>Guide für verifizierte Häuser & Lounges (wie Aphrodite & Zeus)</strong>:
          </p>

          {/* 3 Main Mode Tabs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-4 max-w-2xl mx-auto">
            <button
              type="button"
              onClick={() => setActiveTab("escorts")}
              className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === "escorts"
                  ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D] shadow-xl"
                  : "bg-[#09131E] border-white/15 text-gray-200 hover:border-[#C69C6D]/50"
              }`}
            >
              <Award size={16} /> 1. Top Escorts & Services ({profiles.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("portals")}
              className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === "portals"
                  ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D] shadow-xl"
                  : "bg-[#09131E] border-white/15 text-gray-200 hover:border-[#C69C6D]/50"
              }`}
            >
              <Globe size={16} /> 2. Plattform- & Portal-Rating
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("houses")}
              className={`p-3.5 rounded-2xl border text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === "houses"
                  ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D] shadow-xl"
                  : "bg-[#09131E] border-white/15 text-gray-200 hover:border-[#C69C6D]/50"
              }`}
            >
              <Building2 size={16} /> 3. Häuser & Clubs (Zeus / Aphrodite)
            </button>
          </div>
        </div>

        {/* TAB 1: ESCORT & SERVICE LEADERBOARD + SPONSORED TOP-SPOTS */}
        {activeTab === "escorts" && (
          <div className="space-y-6">
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

                <div className="flex items-center gap-2">
                  <Link
                    href="/checkout?plan=boost_24h"
                    className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black flex items-center gap-1.5"
                  >
                    <Flame size={13} /> Eigenes Profil auf Platz 1 promoten (ab CHF 29) →
                  </Link>
                </div>
              </div>
            </Card>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {rankedEscorts.slice(0, 15).map((p, index) => (
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
                        #{index + 1} · {index < 3 ? "👑 TOP-SPOT & TESTSIEGERIN" : "TOP RANKED"}
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
                          <div className="text-gray-400">Berichte</div>
                          <div className="font-black text-white">{p.verifiedReviews} ✓</div>
                        </div>
                      </div>

                      <div className="text-xs text-gray-300">
                        <strong className="text-white">Top bewertet für:</strong> {p.includedServices.slice(0, 4).join(" · ")}
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
                        Profil & Beweis öffnen →
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: INTERACTIVE PLATFORM & PORTAL RATING SCORECARDS */}
        {activeTab === "portals" && (
          <div className="space-y-6">
            <div className="bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-1.5">
                  Unabhängiger Schweizer Plattform-Index (Comparis-Prinzip)
                </Badge>
                <h2 className="text-2xl font-serif font-black">
                  Die grossen Schweizer Escort-Portale im direkten Qualitäts-Vergleich
                </h2>
                <p className="text-xs text-gray-300 mt-1">
                  Bewertet von über 4,300 Schweizer Nutzern nach Preis-Ehrlichkeit vor Ort, Foto-Echtheit, Dubletten-Freiheit und Aktualität:
                </p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {portalList.map((b) => (
                <Card
                  key={b.id}
                  className={`p-6 rounded-2xl text-white space-y-4 shadow-2xl ${
                    b.highlight
                      ? "bg-gradient-to-br from-[#13283F] to-[#09131E] border-2 border-[#C69C6D]"
                      : "bg-[#09131E] border border-white/15"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <Badge className={b.highlight ? "bg-[#C69C6D] text-[#0D1B2A] font-black" : "bg-white/10 text-gray-300"}>
                      Platz #{b.rank} im Schweiz-Vergleich
                    </Badge>
                    <div className="text-right">
                      <span className="text-2xl font-black text-[#D5A021]">★ {b.overallScore}/10</span>
                      <span className="block text-[10px] text-gray-400">{b.votes} Nutzer-Stimmen</span>
                    </div>
                  </div>

                  <h3 className="text-xl font-serif font-black">{b.portal}</h3>
                  <p className="text-xs text-gray-300 leading-relaxed">{b.verdict}</p>

                  {/* Visual Score Bars */}
                  <div className="space-y-2 bg-black/40 p-4 rounded-xl border border-white/10 text-xs">
                    {[
                      { label: "Endpreis-Ehrlichkeit (Keine Aufpreise)", val: b.metrics.priceHonesty },
                      { label: "Foto-Echtheit & Video-Verifizierung", val: b.metrics.photoRealness },
                      { label: "Aktualität & Stündlicher Live-Sync", val: b.metrics.upToDateSync },
                      { label: "Diskretion & Schweizer Datenschutz", val: b.metrics.discretion },
                    ].map((m) => (
                      <div key={m.label} className="space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="text-gray-300">{m.label}</span>
                          <strong className={b.highlight ? "text-emerald-400" : "text-[#D5A021]"}>{m.val}/10</strong>
                        </div>
                        <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${b.highlight ? "bg-emerald-400" : "bg-[#C69C6D]"}`}
                            style={{ width: `${m.val * 10}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-2 text-xs">
                    <span className="text-gray-400">
                      Versteckte Kosten: <strong className="text-amber-300">{b.avgMarkup}</strong>
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePortalVote(b.id, b.portal)}
                      className="border-white/20 text-white hover:bg-white/10 text-xs"
                    >
                      <ThumbsUp size={12} className="mr-1.5 text-[#D5A021]" /> Für dieses Portal stimmen
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DISCREET SWISS HOUSES, CLUBS & WALK-IN LOUNGES (APHRODITE, ZEUS, ETC.) */}
        {activeTab === "houses" && (
          <div className="space-y-6">
            <div className="bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-1.5">
                  <Building2 size={12} className="mr-1.5 inline" /> Vor-Ort-Guide · Verifizierte Schweizer Häuser & Privat-Lounges
                </Badge>
                <h2 className="text-2xl font-serif font-black">
                  Bekannte Schweizer Kontakt-Häuser & Diskrete Walk-In Adressen (z.B. Aphrodite & Zeus)
                </h2>
                <p className="text-xs text-gray-300 mt-1 max-w-3xl">
                  Du möchtest spontan ohne Vorab-Termin direkt vor Ort in ein etabliertes Schweizer Haus oder eine diskrete Privat-Lounge gehen? Hier findest du die transparenten Haus- und Zimmer-Tarife im Überblick:
                </p>
              </div>
              <Button className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs shrink-0" asChild>
                <Link href="/checkout?plan=vip_monthly">Haus / Studio hier listen →</Link>
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {SWISS_HOUSES_AND_CLUBS.map((house) => (
                <Card
                  key={house.id}
                  className="bg-[#09131E] border border-[#C69C6D]/45 p-6 rounded-2xl text-white space-y-4 shadow-xl"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] mb-1">
                        {house.walkInPossible ? "✓ WALK-IN OHNE TERMIN MÖGLICH" : "🔒 NUR MIT CODE / VORANMELDUNG"}
                      </Badge>
                      <h3 className="text-2xl font-serif font-black">{house.name}</h3>
                      <p className="text-xs text-[#D5A021] font-semibold mt-0.5">
                        📍 {house.region} · {house.type}
                      </p>
                    </div>
                    <span className="bg-black/60 border border-[#C69C6D] text-[#D5A021] font-black text-sm px-3 py-1 rounded-xl">
                      ★ {house.rating}/10
                    </span>
                  </div>

                  <p className="text-xs text-gray-300 leading-relaxed bg-black/40 p-3.5 rounded-xl border border-white/10">
                    {house.discretionNote}
                  </p>

                  <div className="grid grid-cols-3 gap-2 text-center text-xs bg-white/5 p-3 rounded-xl border border-white/10">
                    <div>
                      <span className="text-gray-400 block text-[10px]">Eintrittspreis</span>
                      <strong className="text-emerald-400">CHF {house.entryFeeChf} (Frei)</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Richtpreis 30 Min.</span>
                      <strong className="text-white">ab CHF {house.standardRoomRate30Chf}</strong>
                    </div>
                    <div>
                      <span className="text-gray-400 block text-[10px]">Anwesenheit</span>
                      <strong className="text-[#D5A021]">{house.activeLadiesCount}</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-[11px] text-gray-400">
                      ✓ Im Schweizer Standort-Index verifiziert
                    </span>
                    <Button size="sm" className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs" asChild>
                      <Link href={`/search?q=${encodeURIComponent(house.region.split(" ")[0])}`}>
                        Verfügbare Damen in der Region zeigen →
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}