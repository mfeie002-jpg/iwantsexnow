import { useState, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  ShieldCheck,
  Calculator,
  PhoneCall,
  Send,
  Star,
  Video,
  Building2,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";
import { LivePortalSyncBanner, SWISS_HOUSES_AND_CLUBS } from "@/components/marketplace/LivePortalSyncBanner";

export const SWISS_SEO_LOCATIONS: Record<
  string,
  {
    slug: string;
    title: string;
    canton: string;
    filterKeyword: string;
    hotelsAndSpots: string;
    intro: string;
  }
> = {
  cham: {
    slug: "cham",
    title: "Cham & Lorzenpark (Kanton Zug)",
    canton: "ZG",
    filterKeyword: "ZG",
    hotelsAndSpots: "Cham Zentrum, Lorzenpark, Riedpark, Seehof & diskrete Business-Apartments (10 Min. ab Zug)",
    intro: "Vergleiche alle verifizierten Escorts, Privat-Studios und Hotel-Outcalls in Cham (ZG). 100% bereinigt um Portal-Dubletten mit garantiertem Vorab-Fixpreis.",
  },
  baar: {
    slug: "baar",
    title: "Baar & Sihlbrugg (Kanton Zug)",
    canton: "ZG",
    filterKeyword: "ZG",
    hotelsAndSpots: "Baar Zentrum, Neufeld, Sihlbrugg & Business-Hotels im Raum Zug/Baar",
    intro: "Alle aktuell verfügbaren Direktprofile und Markt-Index-Einträge für Baar (Kanton Zug) mit Tiefgaragen-Diskretion und 20-Minuten Hotel-Outcall.",
  },
  rotkreuz: {
    slug: "rotkreuz",
    title: "Rotkreuz, Risch & Holzhäusern (Zug)",
    canton: "ZG",
    filterKeyword: "ZG",
    hotelsAndSpots: "Rotkreuz Business-Park, Risch, Campus-Hotels & Autobahnkreuz A4/A14",
    intro: "Diskrete Begleitung und verifizierte Studios in Rotkreuz & Risch (ZG) – direkter Preisvergleich über alle Schweizer Portale.",
  },
  zug: {
    slug: "zug",
    title: "Zug Stadt, Metalli & Zugersee",
    canton: "ZG",
    filterKeyword: "ZG",
    hotelsAndSpots: "Park Hotel Zug, City Garden, Hotel Löwen, Metalli & diskrete Privat-Suiten",
    intro: "Der komplette Escort- & Preis-Index für die Stadt Zug: Alle Portale gebündelt, 0% Agentur-Aufschlag und echte Endpreis-Garantie.",
  },
  "zuerich-paradeplatz": {
    slug: "zuerich-paradeplatz",
    title: "Zürich Paradeplatz, Bahnhofstrasse & Enge",
    canton: "ZH",
    filterKeyword: "ZH",
    hotelsAndSpots: "Paradeplatz, Baur au Lac, Widder, Park Hyatt, Enge & Kreis 1/2",
    intro: "High-Class Escorts und verifizierte Direktprofile rund um den Zürcher Paradeplatz, die Bahnhofstrasse und Enge zum transparenten Fixpreis.",
  },
  "zuerich-oerlikon": {
    slug: "zuerich-oerlikon",
    title: "Zürich Oerlikon, Glattpark & Airport Kloten",
    canton: "ZH",
    filterKeyword: "ZH",
    hotelsAndSpots: "Messe Oerlikon, Kameha Grand, Radisson Blu Airport,The Circle & Glattpark",
    intro: "Sofort verfügbare Escorts für Hotel-Outcalls am Flughafen Zürich (Kloten), Glattpark und Studios in Zürich-Oerlikon.",
  },
  "zuerich-seefeld": {
    slug: "zuerich-seefeld",
    title: "Zürich Seefeld, Bellevue & Zollikon",
    canton: "ZH",
    filterKeyword: "ZH",
    hotelsAndSpots: "Zürich Seefeld (Kreis 8), Bellevue, La Réserve Eden au Lac & Goldküste",
    intro: "Exklusive Privat-Suiten und Dinner-Date-Begleiterinnen im Zürcher Seefeld und an der Goldküste.",
  },
  winterthur: {
    slug: "winterthur",
    title: "Winterthur & Region Ost-Zürich",
    canton: "ZH",
    filterKeyword: "ZH",
    hotelsAndSpots: "Winterthur Hauptbahnhof, Sulzer-Areal, Wülflingen & Töss",
    intro: "Alle Escort- und Massage-Inserate in Winterthur gebündelt im Schweizer Dubletten- & Endpreis-Index.",
  },
  luzern: {
    slug: "luzern",
    title: "Luzern, Emmenbrücke & Vierwaldstättersee",
    canton: "LU",
    filterKeyword: "LU",
    hotelsAndSpots: "Luzern Zentrum, Schweizerhof, Palace, Mandarin Oriental, Kriens & Emmen",
    intro: "Verifizierte Escorts und Hotel-Outcalls in Luzern und der Zentralschweiz – alle Portale in einer Suche.",
  },
  aargau: {
    slug: "aargau",
    title: "Aargau, Baden, Wettingen & Aarau",
    canton: "AG",
    filterKeyword: "AG",
    hotelsAndSpots: "Baden Limmathof, Atrium-Hotel Blume, Wettingen, Spreitenbach & Aarau",
    intro: "Der komplette Schweizer Escort- & Studio-Vergleich für den Kanton Aargau (Baden, Wettingen, Spreitenbach, Aarau & Olten).",
  },
  "st-gallen": {
    slug: "st-gallen",
    title: "St. Gallen, Rapperswil & Bodensee",
    canton: "SG",
    filterKeyword: "SG",
    hotelsAndSpots: "St. Gallen City, Einstein Hotel, Radisson Blu, Rapperswil-Jona & Wil",
    intro: "Vergleiche alle Escort-Profile und Studios in St. Gallen, Rapperswil und der Ostschweiz zum echten Endpreis.",
  },
  lugano: {
    slug: "lugano",
    title: "Lugano, Locarno & Ascona (Ticino)",
    canton: "TI",
    filterKeyword: "TI",
    hotelsAndSpots: "Lugano Paradiso, Villa Principe Leopoldo, Splendide Royal & Ascona",
    intro: "Exklusive Begleiterinnen und Studios im Tessin (Lugano, Locarno, Bellinzona) – Dubletten-bereinigt im Schweizer Index.",
  },
  "haus-aphrodite": {
    slug: "haus-aphrodite",
    title: "Villa / Haus Aphrodite · Preise, Damen & Direkt-Vergleich",
    canton: "ZG",
    filterKeyword: "ALL",
    hotelsAndSpots: "Walk-In Kontakt- & Wellness-Haus (Zentralschweiz / Zürich-Einzugsgebiet) · Diskrete Parkplätze am Haus",
    intro: "Transparente Übersicht zu Haus Aphrodite (Eintritt CHF 0, Richtpreis ab CHF 150/30m) im direkten Vergleich mit privaten Direktbuchungs-Escorts der Region.",
  },
  "haus-zeus": {
    slug: "haus-zeus",
    title: "Haus / Club Zeus · Preise, Zimmer-Tarife & Direkt-Alternativen",
    canton: "ZH",
    filterKeyword: "ALL",
    hotelsAndSpots: "Etabliertes Schweizer Lauf- & Studio-Haus (Walk-In ohne Termin möglich)",
    intro: "Alle Fakten, Richtpreise (ab CHF 140/30m) und diskrete Privat-Alternativen zum Haus Zeus im unabhängigen Schweizer Preis-Index.",
  },
};

export default function LocalSeoHubPage() {
  const router = useRouter();
  const rawSlug = String(router.query.slug || "cham").toLowerCase();
  const loc = SWISS_SEO_LOCATIONS[rawSlug] || SWISS_SEO_LOCATIONS.cham;

  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const allProfiles = useMemo(() => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED), []);

  const matchingProfiles = useMemo(() => {
    if (loc.filterKeyword === "ALL") return allProfiles.slice(0, 18);
    const filtered = allProfiles.filter(
      (p) =>
        p.canton === loc.canton ||
        p.primaryCity.toLowerCase().includes(rawSlug) ||
        p.subareas.some((s) => s.toLowerCase().includes(rawSlug))
    );
    return filtered.length > 0 ? filtered : allProfiles.slice(0, 12);
  }, [allProfiles, loc, rawSlug]);

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title={`Escort ${loc.title} – Echte Endpreise, Portale & Direktbuchung | iWantSexNow.ch`}
        description={loc.intro}
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

      <LivePortalSyncBanner totalProfiles={allProfiles.length} />

      <main className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
        {/* Local SEO Hero */}
        <div className="bg-[#09131E] border-2 border-[#C69C6D]/50 rounded-2xl p-6 md:p-8 shadow-2xl space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
                <MapPin size={12} className="mr-1.5 inline" /> Lokaler Schweizer Preis- & Verfügbarkeits-Hub ({loc.canton})
              </Badge>
              <h1 className="text-2xl md:text-4xl font-serif font-black">
                Escorts, Studios & Endpreise in {loc.title}
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                {loc.intro}
              </p>
              <p className="text-xs text-emerald-300 font-semibold">
                🏨 Diskrete Treffpunkte & Abdeckung: {loc.hotelsAndSpots}
              </p>
            </div>

            <div className="flex bg-black/50 p-1 rounded-xl border border-[#C69C6D]/40 shrink-0">
              {([30, 60, 120] as const).map((mins) => (
                <button
                  key={mins}
                  type="button"
                  onClick={() => setDuration(mins)}
                  className={
                    duration === mins
                      ? "px-4 py-2 rounded-lg text-xs font-black bg-[#C69C6D] text-[#0D1B2A]"
                      : "px-4 py-2 rounded-lg text-xs font-bold text-gray-300"
                  }
                >
                  {mins === 120 ? "2 Std." : `${mins} Min.`}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Local City Switcher */}
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-white/10 text-xs">
            <span className="text-gray-400 font-bold mr-1 py-1">Weitere Schweizer Hotspots:</span>
            {Object.values(SWISS_SEO_LOCATIONS).map((item) => (
              <Link
                key={item.slug}
                href={`/orte/${item.slug}`}
                className={`px-2.5 py-1 rounded-lg border transition-all ${
                  item.slug === loc.slug
                    ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D] font-black"
                    : "bg-black/40 border-white/10 text-gray-300 hover:text-white"
                }`}
              >
                {item.title.split(" ")[0]} {item.slug.startsWith("haus-") ? `(${item.title.split(" ")[2]})` : ""}
              </Link>
            ))}
          </div>
        </div>

        {/* Profile Grid for this Location */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {matchingProfiles.map((p) => {
            const price = duration === 30 ? p.rate30Chf : duration === 120 ? p.rate120Chf : p.bestBaseRate60Chf;
            return (
              <Card
                key={p.dedupClusterId}
                className="bg-[#09131E] border border-[#C69C6D]/40 rounded-2xl overflow-hidden text-white flex flex-col justify-between shadow-xl"
              >
                <div>
                  <Link href={`/profile/${encodeURIComponent(p.displayName)}`} className="relative h-64 block group overflow-hidden">
                    <img src={p.thumbnail} alt={p.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-bold px-2.5 py-1 rounded-full">
                      ✓ {p.sourcesCount} Portal(e) geprüft
                    </div>
                    <div className="absolute top-3 right-3 bg-black/85 border border-[#C69C6D] text-[#D5A021] text-xs font-black px-2.5 py-1 rounded-lg">
                      ★ {p.ratingScore.toFixed(1)}/10
                    </div>
                  </Link>

                  <div className="p-5 space-y-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <h2 className="text-2xl font-serif font-black">
                          {p.displayName}, {p.age}
                        </h2>
                        <p className="text-xs text-[#D5A021] font-semibold">
                          📍 {p.subareas.join(" · ")} ({p.canton})
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-[10px] text-gray-400">Fixpreis ({duration}m)</div>
                        <div className="text-2xl font-black text-emerald-400">CHF {price}</div>
                      </div>
                    </div>

                    <p className="text-xs text-gray-300 line-clamp-2">{p.bio}</p>

                    <div className="flex flex-wrap gap-1.5 text-[11px]">
                      {p.includedServices.slice(0, 4).map((srv) => (
                        <span key={srv} className="px-2 py-0.5 rounded bg-emerald-500/15 border border-emerald-500/30 text-emerald-200">
                          ✓ {srv}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0 flex items-center justify-between gap-2">
                  <Button size="sm" variant="outline" className="border-rose-500/40 text-rose-300 text-xs" asChild>
                    <Link href={`/live-cam?provider=${encodeURIComponent(p.displayName)}`}>
                      <Video size={12} className="mr-1 text-rose-400" /> 1:1 Cam Check
                    </Link>
                  </Button>
                  <Button size="sm" className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs" asChild>
                    <Link
                      href={`/booking-confirmation?provider=${encodeURIComponent(p.displayName)}&city=${encodeURIComponent(
                        loc.title
                      )}&duration=${duration}&total=${price}&extras=GFE%2C%20Outcall`}
                    >
                      <Send size={12} className="mr-1.5" /> Fixpreis-Zertifikat
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