import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Trash2, Video, Send, Sparkles, Calculator } from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";
import { SeoSiloFooter } from "@/components/marketplace/SeoSiloFooter";

export default function FavoritesShortlistPage() {
  const allProfiles = useMemo(() => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED), []);
  const [favNames, setFavNames] = useState<string[]>(["Sophia", "Elena", "Julian (VIP Gentleman & Gigolo)"]);

  useEffect(() => {
    const saved = localStorage.getItem("swissFavoriteProfiles");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) setFavNames(parsed);
      } catch {}
    }
  }, []);

  const removeFav = (name: string) => {
    const next = favNames.filter((n) => n !== name);
    setFavNames(next);
    localStorage.setItem("swissFavoriteProfiles", JSON.stringify(next));
  };

  const shortlisted = useMemo(() => {
    const found = allProfiles.filter((p) => favNames.includes(p.displayName));
    return found.length > 0 ? found : allProfiles.slice(0, 3);
  }, [allProfiles, favNames]);

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Deine Merkliste & Direkt-Vergleich | iWantSexNow.ch"
        description="Vergleiche deine gespeicherten Schweizer Escort- & Gigolo-Favoriten nach Endpreis, Inklusive-Services und 1:1 Live-Cam Verfügbarkeit."
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

      <main className="container mx-auto px-4 py-10 max-w-6xl space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl">
          <div>
            <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-1.5">
              <Heart size={12} className="mr-1.5 inline fill-rose-400" /> Persönliche Schweizer Shortlist
            </Badge>
            <h1 className="text-2xl md:text-4xl font-serif font-black">
              Deine gespeicherten Favoriten im Direkt-Vergleich ({shortlisted.length})
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1">
              Alle Favoriten bleiben anonym lokal in deinem Browser gespeichert (0% Cloud-Tracking).
            </p>
          </div>
          <Button className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs" asChild>
            <Link href="/search">+ Weitere Profile suchen</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {shortlisted.map((p) => (
            <Card
              key={p.dedupClusterId}
              className="bg-[#09131E] border border-[#C69C6D]/45 rounded-2xl overflow-hidden text-white flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="relative h-64">
                  <img src={p.thumbnail} alt={p.displayName} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFav(p.displayName)}
                    className="absolute top-3 right-3 bg-black/80 hover:bg-rose-600 text-white p-2 rounded-full border border-white/20"
                    title="Aus Merkliste entfernen"
                  >
                    <Trash2 size={14} />
                  </button>
                  <div className="absolute bottom-3 left-3 bg-emerald-600 text-white text-xs font-black px-3 py-1 rounded-full">
                    Direkt ab CHF {p.bestBaseRate60Chf}/h
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <h2 className="text-2xl font-serif font-black">
                    {p.displayName}, {p.age}
                  </h2>
                  <p className="text-xs text-[#D5A021] font-semibold">
                    📍 {p.subareas.join(" · ")} ({p.canton})
                  </p>
                  <div className="text-xs text-gray-300 space-y-1 bg-black/40 p-3 rounded-xl border border-white/10">
                    <div>• 30 Min. Fixpreis: <strong>CHF {p.rate30Chf}</strong></div>
                    <div>• 60 Min. Fixpreis: <strong className="text-emerald-400">CHF {p.bestBaseRate60Chf}</strong></div>
                    <div>• 2 Std. VIP-Date: <strong>CHF {p.rate120Chf}</strong></div>
                    <div>• Ersparnis vs. Portale: <strong className="text-[#D5A021]">-CHF {p.savingsPerHourChf}/h</strong></div>
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2">
                <Button size="sm" variant="outline" className="flex-1 border-rose-500/40 text-rose-300 text-xs" asChild>
                  <Link href={`/live-cam?provider=${encodeURIComponent(p.displayName)}`}>
                    <Video size={13} className="mr-1" /> 1:1 Cam
                  </Link>
                </Button>
                <Button size="sm" className="flex-1 bg-[#C69C6D] text-[#0D1B2A] font-black text-xs" asChild>
                  <Link href={`/profile/${encodeURIComponent(p.displayName)}`}>
                    Jetzt buchen →
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
      <SeoSiloFooter />
    </div>
  );
}