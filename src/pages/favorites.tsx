import { useState, useEffect } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, Send, Trash2, Sparkles, ArrowLeft } from "lucide-react";

const ALL_PROFILES = [
  {
    id: 1,
    name: "Sophia",
    age: 26,
    city: "Zürich, Zug & Winterthur",
    rate60: 450,
    portalAvg: 520,
    included: ["GFE", "Dinner Dates", "Outcall"],
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=700&fit=crop",
  },
  {
    id: 2,
    name: "Elena",
    age: 24,
    city: "Zug, Cham & Zürichsee",
    rate60: 400,
    portalAvg: 480,
    included: ["GFE", "Outcall", "Massage"],
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop",
  },
  {
    id: 3,
    name: "Emma",
    age: 28,
    city: "Basel & Zürich",
    rate60: 350,
    portalAvg: 420,
    included: ["GFE", "Massage"],
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=700&fit=crop",
  },
  {
    id: 4,
    name: "Mia",
    age: 25,
    city: "Bern, Zürich & Zug",
    rate60: 550,
    portalAvg: 650,
    included: ["GFE", "Dinner Dates", "Outcall", "Overnight"],
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=700&fit=crop",
  },
];

export default function FavoritesPage() {
  const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 2]);

  useEffect(() => {
    const saved = localStorage.getItem("favorites");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setFavoriteIds(parsed);
        }
      } catch {
        // keep defaults
      }
    }
  }, []);

  const removeFav = (id: number) => {
    const updated = favoriteIds.filter((item) => item !== id);
    setFavoriteIds(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  const savedProfiles = ALL_PROFILES.filter((p) => favoriteIds.includes(p.id));

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Meine Merkliste & Direktvergleich | iWantSexNow.ch"
        description="Gespeicherte Schweizer Direktprofile und Endpreis-Vergleich."
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
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> Zurück zur Suche
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Badge className="bg-rose-500/20 text-rose-300 border border-rose-500/40 mb-2">
              <Heart size={12} className="mr-1 inline fill-rose-400" /> Persönliche Shortlist
            </Badge>
            <h1 className="text-3xl md:text-4xl font-serif font-black">
              Meine Merkliste & Preisvergleich
            </h1>
          </div>
          <Button className="bg-[#C69C6D] text-[#0D1B2A] font-black" asChild>
            <Link href="/matches">
              <Sparkles size={15} className="mr-1.5" /> Smart-Matcher öffnen
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {savedProfiles.map((p) => (
            <Card key={p.id} className="bg-[#09131E] border border-[#C69C6D]/40 p-5 rounded-2xl text-white flex flex-col justify-between">
              <div className="flex gap-4">
                <img src={p.image} alt={p.name} className="w-32 h-40 object-cover rounded-xl shrink-0" />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between">
                      <h2 className="text-2xl font-serif font-black">{p.name}, {p.age}</h2>
                      <button
                        type="button"
                        onClick={() => removeFav(p.id)}
                        className="text-gray-400 hover:text-rose-400"
                        title="Entfernen"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    <p className="text-xs text-[#D5A021] font-semibold mt-0.5">📍 {p.city}</p>
                    <p className="text-xs text-emerald-300 mt-2">✓ Inklusive: {p.included.join(", ")}</p>
                  </div>

                  <div className="mt-3 bg-white/5 border border-white/10 rounded-xl p-2.5 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-gray-400">Direktbuchungs-Fixpreis</div>
                      <div className="text-xl font-black text-[#D5A021]">CHF {p.rate60}</div>
                    </div>
                    <Badge className="bg-emerald-500/20 text-emerald-300 border-0 text-xs">
                      Spare CHF {p.portalAvg - p.rate60}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end gap-2">
                <Button size="sm" className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs" asChild>
                  <Link href={`/profile/${p.id}`}>
                    <Send size={13} className="mr-1.5" /> Direkt zum Fixpreis buchen
                  </Link>
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}