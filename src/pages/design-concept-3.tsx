import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Heart, MapPin, Star, Shield, CheckCircle, Flame, Zap } from "lucide-react";
import Link from "next/link";

/**
 * DESIGN CONCEPT 3: "BOLD & CONFIDENT"
 * 
 * Logo: Flame symbol with strong typography
 * Slogan: "Unapologetically Premium"
 * 
 * Color Palette:
 * - Deep Red (#B91C1C)
 * - Jet Black (#0A0A0A)
 * - Bright White (#FFFFFF)
 * - Electric Orange (#F97316)
 * 
 * Typography:
 * - Headings: Montserrat (Bold Sans-Serif)
 * - Body: Outfit (Modern Sans-Serif)
 * 
 * Aesthetic:
 * - High-energy, confident
 * - Nightclub/premium entertainment
 * - Bold, direct, powerful
 * - Modern luxury with edge
 */

export default function DesignConcept3() {
  const [favorites, setFavorites] = useState<number[]>([]);

  const sampleEscorts = [
    {
      id: 1,
      name: "Anastasia",
      age: 26,
      location: "Zürich",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      rating: 5.0,
      reviews: 127,
      rate: 500,
      online: true
    },
    {
      id: 2,
      name: "Valentina",
      age: 24,
      location: "Geneva",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      rating: 4.9,
      reviews: 203,
      rate: 600,
      online: true
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <SEO 
        title="Design Concept 3: Bold & Confident | iWantSexNow.ch"
        description="Bold and confident design concept"
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800;900&family=Outfit:wght@300;400;500;600;700&display=swap');
        
        .concept-3 h1, .concept-3 h2, .concept-3 h3, .concept-3 h4 {
          font-family: 'Montserrat', sans-serif;
        }
        
        .concept-3 p, .concept-3 span, .concept-3 button {
          font-family: 'Outfit', sans-serif;
        }
      `}</style>

      <div className="concept-3">
        {/* Header */}
        <header className="bg-[#0A0A0A] border-b-2 border-[#B91C1C]">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-[#B91C1C] to-[#F97316] rounded-lg flex items-center justify-center shadow-lg shadow-[#B91C1C]/50">
                    <Flame className="text-white" size={28} />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-br from-[#B91C1C] to-[#F97316] rounded-lg blur-xl opacity-50"></div>
                </div>
                <div>
                  <h1 className="text-2xl font-black text-white tracking-tight">APEX</h1>
                  <p className="text-[10px] text-[#F97316] tracking-widest uppercase font-bold">Unapologetically Premium</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-3">
                <Button variant="ghost" className="text-white hover:text-[#F97316] font-bold">DISCOVER</Button>
                <Button variant="ghost" className="text-white hover:text-[#F97316] font-bold">ELITE</Button>
                <Button className="bg-gradient-to-r from-[#B91C1C] to-[#F97316] text-white hover:shadow-lg hover:shadow-[#B91C1C]/50 font-black transition-all">
                  JOIN NOW
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative py-28 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B91C1C]/20 via-transparent to-[#F97316]/20"></div>
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40"></div>
          
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#B91C1C] to-[#F97316] px-4 py-2 rounded-full mb-8">
                <Zap className="text-white" size={16} fill="white" />
                <span className="text-white text-xs font-black tracking-wider uppercase">Switzerland's #1 Premium Platform</span>
              </div>
              
              <h2 className="text-6xl md:text-8xl font-black text-white mb-6 leading-[0.9]">
                MEET<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#B91C1C] to-[#F97316]">
                  UNFORGETTABLE
                </span>
              </h2>
              
              <p className="text-xl text-white/70 mb-12 max-w-2xl mx-auto font-medium">
                Connect with Switzerland's most exclusive companions. Premium quality. Zero compromises. 
                Available 24/7.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-gradient-to-r from-[#B91C1C] to-[#F97316] text-white hover:shadow-2xl hover:shadow-[#B91C1C]/50 font-black text-lg px-10 h-14 transition-all">
                  START NOW
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black font-black text-lg px-10 h-14">
                  LEARN MORE
                </Button>
              </div>

              <div className="flex items-center justify-center gap-8 mt-12 text-white">
                <div>
                  <div className="text-3xl font-black">500+</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider font-bold">Premium Profiles</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div>
                  <div className="text-3xl font-black">24/7</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider font-bold">Always Available</div>
                </div>
                <div className="w-px h-12 bg-white/20"></div>
                <div>
                  <div className="text-3xl font-black">100%</div>
                  <div className="text-xs text-white/60 uppercase tracking-wider font-bold">Verified</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Listings */}
        <section className="py-20 bg-gradient-to-b from-[#0A0A0A] to-black">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h3 className="text-5xl font-black text-white mb-2">TRENDING NOW</h3>
                <p className="text-[#F97316] font-bold">🔥 Most Popular This Week</p>
              </div>
              <Button className="bg-gradient-to-r from-[#B91C1C] to-[#F97316] text-white font-black">
                VIEW ALL
              </Button>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {sampleEscorts.map(escort => (
                <Card key={escort.id} className="overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-950 border-2 border-zinc-800 hover:border-[#B91C1C] transition-all group">
                  <div className="relative">
                    <img 
                      src={escort.image} 
                      alt={escort.name} 
                      className="w-full aspect-[4/5] object-cover group-hover:scale-105 transition-transform duration-500" 
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                    
                    <div className="absolute top-4 left-4 flex gap-2">
                      {escort.premium && (
                        <Badge className="bg-gradient-to-r from-[#B91C1C] to-[#F97316] text-white border-0 font-black shadow-lg">
                          ⚡ PREMIUM
                        </Badge>
                      )}
                      {escort.online && (
                        <Badge className="bg-green-500 text-white border-0 font-black animate-pulse">
                          ● ONLINE
                        </Badge>
                      )}
                    </div>

                    {escort.verified && (
                      <div className="absolute top-4 right-4">
                        <div className="bg-blue-500 rounded-full p-2">
                          <CheckCircle size={16} className="text-white" fill="white" />
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-3xl font-black text-white">{escort.name}</h4>
                        <div className="flex items-center gap-2 text-white/60 mt-1">
                          <span className="font-bold">{escort.age}</span>
                          <span>•</span>
                          <MapPin size={14} />
                          <span className="font-bold">{escort.location}</span>
                        </div>
                      </div>
                      <button onClick={() => toggleFavorite(escort.id)}>
                        <Heart size={24} className={`${favorites.includes(escort.id) ? 'fill-[#B91C1C] text-[#B91C1C]' : 'text-white'}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={18} className={i < escort.rating ? "text-[#F97316] fill-[#F97316]" : "text-zinc-700"} />
                      ))}
                      <span className="text-sm text-white/60 ml-2 font-bold">({escort.reviews})</span>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t-2 border-[#B91C1C]">
                      <div>
                        <div className="text-xs text-white/60 font-bold mb-1">FROM</div>
                        <div className="text-4xl font-black text-white">CHF {escort.rate}</div>
                      </div>
                      <Button className="bg-gradient-to-r from-[#B91C1C] to-[#F97316] text-white hover:shadow-lg hover:shadow-[#B91C1C]/50 font-black px-8">
                        BOOK NOW
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black border-t-2 border-[#B91C1C] py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="relative w-14 h-14 mx-auto mb-4">
              <div className="w-14 h-14 bg-gradient-to-br from-[#B91C1C] to-[#F97316] rounded-lg flex items-center justify-center">
                <Flame className="text-white" size={28} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-br from-[#B91C1C] to-[#F97316] rounded-lg blur-xl opacity-50"></div>
            </div>
            <p className="text-white text-sm tracking-widest uppercase mb-2 font-black">APEX</p>
            <p className="text-[#F97316] text-xs font-bold">Unapologetically Premium</p>
            <div className="mt-6 text-white/40 text-xs font-medium">
              © {new Date().getFullYear()} APEX. All Rights Reserved.
            </div>
          </div>
        </footer>

        {/* Back to Main Site */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button asChild className="bg-gradient-to-r from-[#B91C1C] to-[#F97316] text-white hover:shadow-2xl shadow-[#B91C1C]/50 font-black">
            <Link href="/">← Back to Main Site</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}