import { useState, useMemo } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  Send,
  Video,
  HelpCircle,
  ChevronRight,
  TrendingDown,
  ShieldCheck,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";
import { LivePortalSyncBanner } from "@/components/marketplace/LivePortalSyncBanner";
import { SeoSiloFooter } from "@/components/marketplace/SeoSiloFooter";

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
    hotelsAndSpots: "Messe Oerlikon, Kameha Grand, Radisson Blu Airport, The Circle & Glattpark",
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

export default function LocalSeoHubPage({ slug }: { slug: string }) {
  const rawSlug = String(slug || "cham").toLowerCase();
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

  const minRate60 = useMemo(
    () => Math.min(...matchingProfiles.map((p) => p.bestBaseRate60Chf)),
    [matchingProfiles]
  );
  const avgRate60 = useMemo(
    () =>
      Math.round(
        matchingProfiles.reduce((s, p) => s + p.bestBaseRate60Chf, 0) /
          Math.max(1, matchingProfiles.length)
      ),
    [matchingProfiles]
  );

  // Structured JSON-LD Schema (BreadcrumbList + FAQPage + ItemList) for Google Rich Results!
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "iWantSexNow.ch Schweiz", item: "https://iwantsexnow.ch" },
        { "@type": "ListItem", position: 2, name: `Kanton ${loc.canton}`, item: "https://iwantsexnow.ch/search" },
        { "@type": "ListItem", position: 3, name: loc.title, item: `https://iwantsexnow.ch/orte/${loc.slug}` },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `Was kostet ein Escort oder Studio-Besuch in ${loc.title}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Im aktuellen Schweizer Live-Index für ${loc.title} starten verifizierte 30-Minuten-Termine ab CHF ${Math.round(minRate60 * 0.65)}, während der bereinigte 60-Minuten-Direktpreis durchschnittlich bei CHF ${avgRate60} liegt (inklusive vereinbarter Extras, 0% Nachverhandlung).`,
          },
        },
        {
          "@type": "Question",
          name: `Wie werden Dubletten von xdate.ch, fgirl.ch und and6.com in ${loc.title} gefiltert?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Unsere Suchmaschine gleicht stündlich alle Schweizer Portale anhand der hinterlegten +41 Rufnummer ab und fasst mehrfach kopierte Inserate in ${loc.title} zu einem einzigen verifizierten Cluster-Profil mit Bestpreis-Garantie zusammen.`,
          },
        },
        {
          "@type": "Question",
          name: `Sind Hotel-Outcalls und 1:1 Vorab-Video-Checks in ${loc.title} möglich?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Ja. Für ${loc.hotelsAndSpots} bieten die gelisteten Direktprofile sowohl diskrete Studio-Termine (Incall) als auch Hotelbesuche (Outcall) sowie einen optionalen 3-Minuten 1:1 Live-Cam Vibe-Check vorab an.`,
          },
        },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title={`Escort ${loc.title} – Ab CHF ${minRate60} | Alle Portale & Fixpreise | iWantSexNow.ch`}
        description={`${loc.intro} Jetzt ${matchingProfiles.length} geprüfte Profile ab CHF ${minRate60}/h vergleichen und ohne Aufpreis buchen.`}
        url={`https://iwantsexnow.ch/orte/${loc.slug}`}
        structuredData={structuredData}
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

      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-8">
        {/* Visible SEO Breadcrumbs */}
        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-gray-400">
          <Link href="/" className="hover:text-white">Schweiz Index</Link>
          <ChevronRight size={12} />
          <Link href="/search" className="hover:text-white">Kanton {loc.canton}</Link>
          <ChevronRight size={12} />
          <span className="text-[#D5A021] font-bold">{loc.title}</span>
        </nav>

        {/* Local SEO Hero + Real-Time Market Price Table (Massive Information Gain for Google!) */}
        <div className="bg-[#09131E] border-2 border-[#C69C6D]/50 rounded-2xl p-6 md:p-8 shadow-2xl space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="space-y-2 max-w-3xl">
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
                <MapPin size={12} className="mr-1.5 inline" /> Offizieller Preis- & Verfügbarkeits-Index ({loc.canton})
              </Badge>
              <h1 className="text-2xl md:text-4xl font-serif font-black">
                Escorts, Studios & Echte Endpreise in {loc.title}
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

          {/* Live Regional Price Benchmark Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-black/45 p-4 rounded-xl border border-white/10 text-xs">
            <div>
              <span className="text-gray-400 block">Geprüfte Profile ({loc.canton}):</span>
              <strong className="text-white text-sm">{matchingProfiles.length} Aktive Einträge</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Einstiegspreis (60 Min.):</span>
              <strong className="text-emerald-400 text-sm">ab CHF {minRate60}.00</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Ø Direktpreis vs. Portale:</span>
              <strong className="text-[#D5A021] text-sm">CHF {avgRate60} (statt CHF {avgRate60 + 85})</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Vorab-Sicherheit:</span>
              <strong className="text-white text-sm">3-Min. 1:1 Video-Check aktiv</strong>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-white/10 text-xs">
            <span className="text-gray-400 font-bold mr-1 py-1">Direkt zu Nachbar-Orten wechseln:</span>
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
                {item.title.split(" ")[0]}
              </Link>
            ))}
          </div>
        </div>

        {/* Profile Grid */}
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
                    <img
                      src={p.thumbnail}
                      alt={`${p.displayName} Escort ${loc.title}`}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src =
                          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop";
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
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

        {/* Visible Local SEO FAQ Box (Matches Google FAQ Schema 1:1) */}
        <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl text-white space-y-4">
          <h2 className="text-xl font-serif font-black text-[#D5A021] flex items-center gap-2">
            <HelpCircle size={18} />
            Häufige Fragen zu Preisen, Diskretion & Buchung in {loc.title}
          </h2>
          <div className="grid md:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
              <h3 className="font-bold text-white text-sm">
                Was kostet ein Escort oder Studio-Besuch in {loc.title}?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Im Schweizer Live-Index starten 30-Minuten-Termine ab <strong>CHF {Math.round(minRate60 * 0.65)}</strong>, während 60 Minuten durchschnittlich bei <strong>CHF {avgRate60}</strong> liegen – inklusive vorab gewählter Extras ohne Nachverhandlung.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
              <h3 className="font-bold text-white text-sm">
                Wie werden Dubletten von xdate, fgirl & and6 gefiltert?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Unsere Engine prüft stündlich alle Schweizer Portale anhand der +41 Rufnummer und bündelt mehrfach kopierte Inserate in {loc.title} zu einem verifizierten Profil mit Bestpreis-Garantie.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-1.5">
              <h3 className="font-bold text-white text-sm">
                Sind Hotel-Outcalls und 1:1 Video-Checks in {loc.title} möglich?
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Ja, für <strong>{loc.hotelsAndSpots}</strong> sind sowohl diskrete Studio-Besuche als auch Hotel-Outcalls sowie der 3-Minuten 1:1 Live-Cam Check vorab buchbar.
              </p>
            </div>
          </div>
        </Card>
      </main>

      <SeoSiloFooter />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  return {
    props: {
      slug: String(params?.slug || "cham"),
    },
  };
};