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
  ShieldCheck,
  Calculator,
  PhoneCall,
  Send,
  CalendarCheck,
  Globe,
  Star,
  Video,
  HelpCircle,
  CheckCircle2,
  Camera,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";
import { LivePortalSyncBanner } from "@/components/marketplace/LivePortalSyncBanner";

const EXTRA_TOGGLES = ["GFE", "Dinner Dates", "Outcall", "Massage"];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [canton, setCanton] = useState("ALL");
  const [modeFilter, setModeFilter] = useState<"ALL" | "direct" | "indexed">("ALL");
  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const [wantedExtras, setWantedExtras] = useState<string[]>(["GFE"]);

  const deduplicatedProfiles = useMemo(
    () => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED),
    []
  );

  const toggleExtra = (srv: string) => {
    setWantedExtras((prev) =>
      prev.includes(srv) ? prev.filter((x) => x !== srv) : [...prev, srv]
    );
  };

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    const tokens = q.split(/\s+/).filter(Boolean);
    const digits = q.replace(/\D/g, "");

    return deduplicatedProfiles.filter((p) => {
      if (canton !== "ALL" && p.canton !== canton) return false;
      if (modeFilter !== "ALL" && p.bookingMode !== modeFilter) return false;
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
        ...p.languages,
        ...p.sources.map((s) => s.portal),
      ]
        .join(" ")
        .toLowerCase();

      return tokens.every((tok) => searchableText.includes(tok));
    });
  }, [deduplicatedProfiles, query, canton, modeFilter]);

  const computeTotalChf = (profile: typeof deduplicatedProfiles[0]) => {
    const base =
      duration === 30 ? profile.rate30Chf : duration === 120 ? profile.rate120Chf : profile.bestBaseRate60Chf;
    let extrasSum = 0;
    const paidExtras: string[] = [];
    const freeExtras: string[] = [];

    for (const srv of wantedExtras) {
      if (profile.includedServices.includes(srv)) {
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

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Schweizer Escort-Suchmaschine (Google-Style Meta-Index) | iWantSexNow.ch"
        description="Durchsuche alle Schweizer Escort-Portale in Echtzeit nach Name, Stadt (Zürich, Zug, Cham), +41 Rufnummer, Services und echtem Komplettpreis."
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
      <main className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        {/* Search Engine Console */}
        <div className="bg-[#09131E] border-2 border-[#C69C6D]/50 rounded-2xl p-6 shadow-2xl space-y-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  ✓ {INITIAL_RAW_SWISS_FEED.length} Roh-Inserate gescannt → {deduplicatedProfiles.length} echte Profile
                </Badge>
                <Link href="/how-it-works" className="text-xs text-[#D5A021] font-bold hover:underline flex items-center gap-1">
                  <HelpCircle size={13} /> Wie funktioniert der Preis- & Dubletten-Abgleich?
                </Link>
              </div>
              <h1 className="text-2xl md:text-4xl font-serif font-black">
                Schweizer Escort-Suchmaschine & Rufnummern-Index
              </h1>
            </div>

            <div className="flex bg-black/50 p-1 rounded-xl border border-white/15 shrink-0">
              {(
                [
                  { id: "ALL", label: "Alle Treffer" },
                  { id: "direct", label: "Nur Direkt Buchbar" },
                  { id: "indexed", label: "Markt-Index" },
                ] as const
              ).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setModeFilter(m.id)}
                  className={
                    modeFilter === m.id
                      ? "px-3 py-1.5 rounded-lg text-xs font-bold bg-[#C69C6D] text-[#0D1B2A]"
                      : "px-3 py-1.5 rounded-lg text-xs font-bold text-gray-300 hover:text-white"
                  }
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 pt-2 border-t border-white/10">
            <div className="md:col-span-6 relative">
              <SearchIcon size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#D5A021]" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Name, Stadt (Zug, Cham, Zürich), Service (GFE, Massage) oder +41 Rufnummer..."
                className="w-full rounded-xl bg-black/50 border border-white/25 pl-10 pr-4 py-3 text-sm text-white focus:border-[#D5A021] focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={canton}
                onChange={(e) => setCanton(e.target.value)}
                className="w-full rounded-xl bg-black/50 border border-white/25 px-3 py-3 text-sm text-white"
              >
                <option value="ALL">Alle Schweizer Kantone ({deduplicatedProfiles.length})</option>
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

            <div className="md:col-span-3 flex bg-black/50 p-1 rounded-xl border border-white/20">
              {([30, 60, 120] as const).map((mins) => (
                <button
                  key={mins}
                  onClick={() => setDuration(mins)}
                  className={
                    duration === mins
                      ? "flex-1 py-2 rounded-lg text-xs font-black bg-[#C69C6D] text-[#0D1B2A]"
                      : "flex-1 py-2 rounded-lg text-xs font-bold text-gray-300"
                  }
                >
                  {mins === 120 ? "2 Std." : `${mins} Min.`}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 pt-2">
            <span className="text-xs text-[#D5A021] font-bold flex items-center gap-1 mr-2">
              <Calculator size={14} /> Gewünschte Leistungen im Endpreis einrechnen:
            </span>
            {EXTRA_TOGGLES.map((srv) => {
              const active = wantedExtras.includes(srv);
              return (
                <button
                  key={srv}
                  onClick={() => toggleExtra(srv)}
                  className={
                    active
                      ? "px-3 py-1.5 rounded-xl text-xs font-bold border bg-emerald-500/20 border-emerald-400 text-white"
                      : "px-3 py-1.5 rounded-xl text-xs font-bold border bg-white/5 border-white/15 text-gray-300"
                  }
                >
                  {active ? "✓ " : "+ "}{srv}
                </button>
              );
            })}
          </div>
        </div>

        {/* Rich Search Engine Result Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {results.map((p) => {
            const calc = computeTotalChf(p);
            const isDirect = p.bookingMode === "direct";
            return (
              <Card
                key={p.dedupClusterId}
                className="bg-[#09131E] border border-[#C69C6D]/45 hover:border-[#D5A021] rounded-2xl p-5 text-white flex flex-col justify-between shadow-xl transition-all"
              >
                <div className="space-y-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link
                      href={`/profile/${encodeURIComponent(p.displayName)}`}
                      className="relative w-full sm:w-44 h-60 sm:h-52 rounded-xl overflow-hidden shrink-0 border border-white/15 block group"
                    >
                      <img src={p.thumbnail} alt={p.displayName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
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

                        {/* Body Specs & Languages Pill Bar */}
                        <div className="flex flex-wrap gap-1.5 mt-2 text-[11px] text-gray-300">
                          <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">{p.height}</span>
                          <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">{p.bust}</span>
                          <span className="bg-black/40 px-2 py-0.5 rounded border border-white/10">{p.languages.slice(0, 2).join(" / ")}</span>
                          <span className="bg-emerald-950/60 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                            {p.reviewCount} Bewertungen
                          </span>
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

                  {/* Cross-Portal Deduplication Breakdown */}
                  <div className="bg-black/40 rounded-xl p-3 border border-white/10 text-xs space-y-1">
                    <div className="text-[#D5A021] font-bold">
                      Quellen- & Dubletten-Abgleich für dieses Profil:
                    </div>
                    {p.sources.map((src, i) => (
                      <div key={i} className="flex justify-between text-gray-300">
                        <span>
                          {src.portal} ({src.lastSeenIso})
                        </span>
                        <span className={src.isDirect ? "text-emerald-400 font-bold" : "line-through text-gray-500"}>
                          CHF {src.priceChf} / 60m
                        </span>
                      </div>
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
    </div>
  );
}