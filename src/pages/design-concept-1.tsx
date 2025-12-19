import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { Heart, MapPin, Star, Shield, CheckCircle, Sparkles, Crown } from "lucide-react";
import Link from "next/link";

/**
 * DESIGN CONCEPT 1: "ELEGANT & SOPHISTICATED"
 * 
 * Logo: Stylized "EN" monogram with decorative flourish
 * Slogan: "Where Elegance Meets Desire"
 * 
 * Color Palette:
 * - Deep Burgundy (#6B1B3D)
 * - Champagne Gold (#D4AF37)
 * - Cream (#F5F5DC)
 * - Charcoal (#2C2C2C)
 * 
 * Typography:
 * - Headings: Playfair Display (Elegant Serif)
 * - Body: Cormorant Garamond (Refined Serif)
 * 
 * Aesthetic:
 * - Luxury boutique hotel
 * - Art deco influences
 * - Refined, timeless, discreet
 * - Old-world elegance meets modern sophistication
 */

export default function DesignConcept1() {
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
    <div className="min-h-screen bg-[#F5F5DC]">
      <SEO 
        title="Design Concept 1: Elegant & Sophisticated | iWantSexNow.ch"
        description="Elegant and sophisticated design concept"
      />

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=Cormorant+Garamond:wght@300;400;500;600&display=swap');
        
        .concept-1 h1, .concept-1 h2, .concept-1 h3, .concept-1 h4 {
          font-family: 'Playfair Display', serif;
        }
        
        .concept-1 body, .concept-1 p, .concept-1 span {
          font-family: 'Cormorant Garamond', serif;
        }
      `}</style>

      <div className="concept-1">
        {/* Header */}
        <header className="bg-[#2C2C2C] border-b-2 border-[#D4AF37]">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              {/* Logo */}
              <div className="flex items-center gap-4">
                <div className="relative">
                  {/* Elegant Monogram Logo */}
                  <div className="w-16 h-16 bg-gradient-to-br from-[#6B1B3D] to-[#4A1428] rounded-full flex items-center justify-center border-2 border-[#D4AF37] shadow-lg">
                    <span className="text-[#D4AF37] font-bold text-2xl" style={{ fontFamily: "'Playfair Display', serif" }}>EN</span>
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 text-[#D4AF37]" size={16} />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-[#F5F5DC] tracking-wide">Elite Nocturne</h1>
                  <p className="text-xs text-[#D4AF37] tracking-widest uppercase">Where Elegance Meets Desire</p>
                </div>
              </div>

              <nav className="hidden md:flex items-center gap-6">
                <Button variant="ghost" className="text-[#F5F5DC] hover:text-[#D4AF37]">Our Gallery</Button>
                <Button variant="ghost" className="text-[#F5F5DC] hover:text-[#D4AF37]">Membership</Button>
                <Button className="bg-[#6B1B3D] text-[#F5F5DC] hover:bg-[#4A1428] border border-[#D4AF37]">
                  Reserve
                </Button>
              </nav>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="relative py-24 bg-gradient-to-b from-[#2C2C2C] to-[#1a1a1a]">
          <div className="container mx-auto px-4 text-center">
            <div className="max-w-3xl mx-auto">
              <div className="flex items-center justify-center gap-2 mb-6">
                <div className="w-12 h-px bg-[#D4AF37]"></div>
                <Crown className="text-[#D4AF37]" size={24} />
                <div className="w-12 h-px bg-[#D4AF37]"></div>
              </div>
              
              <h2 className="text-5xl md:text-6xl font-bold text-[#F5F5DC] mb-6 leading-tight">
                Curated Companions<br />
                <span className="text-[#D4AF37]">For the Discerning</span>
              </h2>
              
              <p className="text-xl text-[#F5F5DC]/80 mb-8 leading-relaxed">
                Experience the art of refined companionship in Switzerland's most prestigious circles.
                Discretion assured, excellence guaranteed.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-[#6B1B3D] text-[#F5F5DC] hover:bg-[#4A1428] border-2 border-[#D4AF37] text-lg px-8">
                  View Our Collection
                </Button>
                <Button size="lg" variant="outline" className="border-2 border-[#D4AF37] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-[#2C2C2C] text-lg px-8">
                  Become a Member
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Sample Listings */}
        <section className="py-16 bg-[#F5F5DC]">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h3 className="text-4xl font-bold text-[#2C2C2C] mb-4">Featured Companions</h3>
              <div className="w-24 h-1 bg-[#D4AF37] mx-auto"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {sampleEscorts.map(escort => (
                <Card key={escort.id} className="overflow-hidden bg-white border-2 border-[#D4AF37]/30 hover:border-[#D4AF37] transition-all shadow-lg">
                  <div className="relative h-96">
                    <img src={escort.image} alt={escort.name} className="w-full h-full object-cover" />
                    <div className="absolute top-4 right-4">
                      {escort.premium && (
                        <Badge className="bg-[#6B1B3D] text-[#D4AF37] border border-[#D4AF37]">
                          <Crown size={12} className="mr-1" />
                          Elite
                        </Badge>
                      )}
                    </div>
                    {escort.verified && (
                      <div className="absolute bottom-4 left-4">
                        <Badge className="bg-[#D4AF37] text-[#2C2C2C] border-0">
                          <CheckCircle size={12} className="mr-1" />
                          Verified
                        </Badge>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="text-2xl font-bold text-[#2C2C2C]">{escort.name}, {escort.age}</h4>
                        <div className="flex items-center gap-1 text-[#6B1B3D] mt-1">
                          <MapPin size={14} />
                          <span className="text-sm">{escort.location}</span>
                        </div>
                      </div>
                      <button onClick={() => toggleFavorite(escort.id)}>
                        <Heart size={20} className={`${favorites.includes(escort.id) ? 'fill-[#6B1B3D] text-[#6B1B3D]' : 'text-[#2C2C2C]'}`} />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={16} className={i < escort.rating ? "text-[#D4AF37] fill-[#D4AF37]" : "text-gray-300"} />
                      ))}
                      <span className="text-sm text-[#2C2C2C] ml-1">({escort.reviews})</span>
                    </div>

                    <div className="border-t-2 border-[#D4AF37]/20 pt-4 flex items-center justify-between">
                      <div>
                        <div className="text-sm text-[#2C2C2C]/60">From</div>
                        <div className="text-2xl font-bold text-[#6B1B3D]">CHF {escort.rate}</div>
                      </div>
                      <Button className="bg-[#6B1B3D] text-[#F5F5DC] hover:bg-[#4A1428] border border-[#D4AF37]">
                        Arrange Meeting
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-[#2C2C2C] border-t-2 border-[#D4AF37] py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-[#6B1B3D] to-[#4A1428] rounded-full flex items-center justify-center border-2 border-[#D4AF37]">
                <span className="text-[#D4AF37] font-bold text-lg">EN</span>
              </div>
            </div>
            <p className="text-[#D4AF37] text-sm tracking-widest uppercase mb-2">Elite Nocturne</p>
            <p className="text-[#F5F5DC]/60 text-sm">Where Elegance Meets Desire</p>
            <div className="mt-6 text-[#F5F5DC]/40 text-xs">
              © {new Date().getFullYear()} Elite Nocturne. Discretion Assured.
            </div>
          </div>
        </footer>

        {/* Back to Main Site */}
        <div className="fixed bottom-8 right-8 z-50">
          <Button asChild className="bg-[#6B1B3D] text-[#F5F5DC] hover:bg-[#4A1428] shadow-2xl">
            <Link href="/">← Back to Main Site</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}