import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Heart, MapPin, Star, Shield, CheckCircle, Circle } from "lucide-react";
import Link from "next/link";

/**
 * DESIGN CONCEPT 2: "MODERN & MINIMAL"
 * 
 * Logo: Simple "R" lettermark in geometric sans
 * Slogan: "Refined. Direct. Discreet."
 * 
 * Color Palette:
 * - Pure Black (#000000)
 * - Pure White (#FFFFFF)
 * - Slate Gray (#64748B)
 * - Minimal Red Accent (#DC2626)
 * 
 * Typography:
 * - Headings: Inter (Modern Sans-Serif)
 * - Body: Inter (Modern Sans-Serif)
 * 
 * Aesthetic:
 * - Swiss design minimalism
 * - Brutalist influences
 * - Clean, direct, no-nonsense
 * - Modern tech startup meets luxury
 */

export default function DesignConcept2() {
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
      rate: 500
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
      rate: 600
    }
  ];

  const toggleFavorite = (id: number) => {
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);
  };

  return (
    <div className="min-h-screen bg-white">
      <SEO 
        title="Design Concept 2: Modern & Minimal | iWantSexNow.ch"
        description="Modern and minimal design concept"
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
        
        .concept-2 * {
          font-family: 'Inter', sans-serif;
        }
      `}</style>

      <div className="concept-2">
        {/* Header */}
        <header className="bg-black border-b border-white">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white flex items-center justify-center">
                  <span className="text-black font-black text-2xl">R</span>
                </div>
                <div>
                  <h1 className="text-xl font-black text-white tracking-tight">RENDEZVOUS</h1>
                  <p className="text-[10px] text-white/60 tracking-wider uppercase">Refined. Direct. Discreet.</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-4">
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 font-medium">Browse</Button>
                <Button variant="ghost" className="text-white hover:text-white hover:bg-white/10 font-medium">Join</Button>
                <Button className="bg-white text-black hover:bg-gray-100 font-bold">
                  Book
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="py-32 bg-black">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl">
              <div className="flex items-center gap-3 mb-6">
                <Circle className="text-[#DC2626]" size={8} fill="currentColor" />
                <span className="text-white/60 text-xs tracking-widest uppercase">Premium Companions</span>
              </div>
              
              <h2 className="text-6xl md:text-7xl font-black text-white mb-6 leading-[0.9]">
                Direct.<br />
                Refined.<br />
                <span className="text-[#DC2626]">Discreet.</span>
              </h2>
              
              <p className="text-lg text-white/60 mb-12 max-w-xl font-light">
                Switzerland's most straightforward platform for premium companionship.
                No games. No complexity. Just honest connections.
              </p>

              <div className="flex gap-4">
                <Button size="lg" className="bg-white text-black hover:bg-gray-100 font-bold text-base px-8 h-12">
                  View Profiles
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-black font-bold text-base px-8 h-12">
                  Learn More
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Listings */}
        <section className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="mb-16">
              <h3 className="text-5xl font-black text-black mb-2">Featured</h3>
              <p className="text-lg text-gray-500 font-light">Fiktive Beispielprofile – nicht geprüft oder buchbar</p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 max-w-6xl">
              {sampleEscorts.map(escort => (
                <div key={escort.id} className="group">
                  <div className="relative mb-6 overflow-hidden bg-black">
                    <img 
                      src={escort.image} 
                      alt={escort.name} 
                      className="w-full aspect-[3/4] object-cover transition-transform duration-500 group-hover:scale-105" 
                    />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {escort.premium && (
                        <Badge className="bg-white text-black border-0 font-bold">
                          PREMIUM
                        </Badge>
                      )}
                      {escort.verified && (
                        <Badge className="bg-black text-white border border-white font-bold">
                          <CheckCircle size={12} className="mr-1" />
                          DEMO
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="text-2xl font-black text-black">{escort.name}</h4>
                        <div className="flex items-center gap-2 text-gray-500 mt-1">
                          <span className="text-sm font-medium">{escort.age}</span>
                          <span>·</span>
                          <span className="text-sm font-medium">{escort.location}</span>
                        </div>
                      </div>
                      <button onClick={() => toggleFavorite(escort.id)} className="mt-1">
                        <Heart size={20} className={`${favorites.includes(escort.id) ? 'fill-[#DC2626] text-[#DC2626]' : 'text-black'}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-1 mb-6">
                      {[...Array(5)].map((_, i) => (
                        <div key={i} className={`w-8 h-1 ${i < escort.rating ? 'bg-black' : 'bg-gray-200'}`}></div>
                      ))}
                      <span className="text-xs text-gray-500 ml-2 font-medium">Demo-Bewertungen</span>
                    </div>

                    <div className="flex items-center justify-between pt-6 border-t-2 border-black">
                      <div>
                        <div className="text-xs text-gray-500 font-medium mb-1">BEISPIELPREIS</div>
                        <div className="text-3xl font-black text-black">CHF {escort.rate}</div>
                      </div>
                      <Button className="bg-black text-white hover:bg-gray-900 font-bold">
                        BOOK NOW
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-black py-16">
          <div className="container mx-auto px-4 text-center">
            <div className="w-10 h-10 bg-white flex items-center justify-center mx-auto mb-4">
              <span className="text-black font-black text-2xl">R</span>
            </div>
            <p className="text-white text-sm tracking-widest uppercase mb-2 font-bold">RENDEZVOUS</p>
            <p className="text-white/40 text-xs">Refined. Direct. Discreet.</p>
            <div className="mt-8 text-white/30 text-xs font-medium">
              © {new Date().getFullYear()} RENDEZVOUS
            </div>
          </div>
        </footer>

        {/* Back to Main Site */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button asChild className="bg-black text-white hover:bg-gray-900 shadow-2xl font-bold">
            <Link href="/">← Back to Main Site</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}