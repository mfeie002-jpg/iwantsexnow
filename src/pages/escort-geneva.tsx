import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEO from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Heart, MapPin, Star, Shield, CheckCircle, Phone, MessageCircle, Search, X, Clock, Award, Sparkles, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function EscortGeneva() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [scrolled, setScrolled] = useState(false);

  const genevaEscorts = [
    {
      id: 1,
      name: "Isabelle",
      age: 25,
      district: "Geneva City Center",
      location: "Place du Molard, Geneva",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 143,
      rate: 600,
      services: ["GFE", "Dinner Dates", "International"],
      languages: ["French", "English", "Italian"],
      description: "Sophisticated French escort in Geneva's heart. Perfect for international clients and diplomatic events.",
      postedTime: "Online now"
    },
    {
      id: 2,
      name: "Anastasia",
      age: 27,
      district: "Eaux-Vives",
      location: "Eaux-Vives, Geneva",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 4.9,
      reviews: 178,
      rate: 700,
      services: ["PSE", "Couples", "Travel"],
      languages: ["Russian", "English", "French"],
      description: "Elite companion near Lake Geneva. Specializing in couples and exclusive travel experiences.",
      postedTime: "Active 3min ago"
    },
    {
      id: 3,
      name: "Sophie",
      age: 24,
      district: "Pâquis",
      location: "Les Pâquis, Geneva",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      verified: true,
      premium: false,
      available: false,
      rating: 4.8,
      reviews: 121,
      rate: 500,
      services: ["GFE", "Massage", "Tantra"],
      languages: ["French", "English"],
      description: "Sensual companion offering tantric experiences in Geneva's international quarter.",
      postedTime: "Available tonight"
    },
    {
      id: 4,
      name: "Camille",
      age: 26,
      district: "Carouge",
      location: "Carouge, Geneva",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 156,
      rate: 650,
      services: ["GFE", "Events", "Overnight"],
      languages: ["French", "English", "Spanish"],
      description: "Elegant escort in artistic Carouge. Perfect for cultural events and extended bookings.",
      postedTime: "Online now"
    }
  ];

  const filteredEscorts = genevaEscorts.filter(escort => {
    if (searchQuery && !escort.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !escort.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedDistrict !== "all" && escort.district !== selectedDistrict) return false;
    if (selectedService !== "all" && !escort.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()))) return false;
    if (verifiedOnly && !escort.verified) return false;
    if (availableNow && !escort.available) return false;
    return true;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <SEO 
        title="Escort Geneva - Premium Escort Services in Genève | iWantSexNow.ch"
        description="Find exclusive escort services in Geneva/Genève. Browse verified profiles, book premium companions in Geneva City Center, Eaux-Vives, Pâquis & more. International & discreet."
      />

      <header className={`border-b border-white/10 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/90 shadow-2xl' : 'bg-black/60'
      }`}>
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Heart className="text-pink-600 fill-pink-600" size={36} />
                <div className="absolute inset-0 bg-pink-600/20 blur-xl group-hover:bg-pink-600/40 transition-all" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">iWantSexNow.ch</span>
                <div className="text-xs text-pink-500 font-semibold tracking-wider">ESCORT GENEVA</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="/">Home</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="/members">All Escorts</Link>
              </Button>
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold" asChild>
                <Link href="/register">
                  <Phone size={18} className="mr-2" />
                  Join Free
                </Link>
              </Button>
            </nav>

            <MobileNav />
          </div>
        </div>
      </header>

      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0">
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-30"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=1920&h=1080&fit=crop&q=80')"
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-purple-900/60 to-black/80" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-sm text-gray-400"
            >
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/cities" className="hover:text-white transition-colors">Cities</Link>
              <span>/</span>
              <span className="text-white font-semibold">Escort Geneva</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
                  Escort Geneva
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-white font-bold mb-4">
                Premium Escort Services in Genève
              </p>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover elite companionship in Switzerland's international city. From diplomatic events to lakeside dinners, find verified escorts for sophisticated encounters.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center justify-center gap-8 text-white"
            >
              <div className="flex items-center gap-2">
                <Users className="text-pink-500" size={24} />
                <div className="text-left">
                  <div className="text-2xl font-black">{genevaEscorts.length}+</div>
                  <div className="text-xs text-gray-400">Active Escorts</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="text-green-500" size={24} />
                <div className="text-left">
                  <div className="text-2xl font-black">100%</div>
                  <div className="text-xs text-gray-400">Verified Profiles</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Award className="text-yellow-500" size={24} />
                <div className="text-left">
                  <div className="text-2xl font-black">4.9★</div>
                  <div className="text-xs text-gray-400">Average Rating</div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white">
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      <SelectItem value="Geneva City Center">City Center</SelectItem>
                      <SelectItem value="Eaux-Vives">Eaux-Vives</SelectItem>
                      <SelectItem value="Pâquis">Pâquis</SelectItem>
                      <SelectItem value="Carouge">Carouge</SelectItem>
                      <SelectItem value="Plainpalais">Plainpalais</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white">
                      <SelectValue placeholder="Service Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Services</SelectItem>
                      <SelectItem value="gfe">GFE Experience</SelectItem>
                      <SelectItem value="pse">PSE Experience</SelectItem>
                      <SelectItem value="massage">Erotic Massage</SelectItem>
                      <SelectItem value="dinner">Dinner Dates</SelectItem>
                      <SelectItem value="travel">Travel Companion</SelectItem>
                      <SelectItem value="international">International Events</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      placeholder="Search escorts..."
                      className="pl-10 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-6 text-white">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition-colors">
                    <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} className="w-4 h-4 rounded accent-pink-600" />
                    <span className="text-sm font-medium">Verified Only</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition-colors">
                    <input type="checkbox" checked={availableNow} onChange={(e) => setAvailableNow(e.target.checked)} className="w-4 h-4 rounded accent-pink-600" />
                    <span className="text-sm font-medium">Available Now</span>
                  </label>

                  <div className="ml-auto">
                    <span className="text-yellow-500 font-bold text-lg">{filteredEscorts.length} Results</span>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-black/40">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto space-y-6">
            {filteredEscorts.length > 0 ? (
              filteredEscorts.map((escort, index) => (
                <motion.div
                  key={escort.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-pink-500 transition-all duration-300 hover:shadow-2xl hover:shadow-pink-500/10">
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      <div className="relative w-full md:w-72 flex-shrink-0 group">
                        <img src={escort.image} alt={escort.name} className="w-full h-80 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500" />
                        
                        {escort.premium && (
                          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 font-bold shadow-xl">PREMIUM</Badge>
                        )}

                        {escort.available && (
                          <Badge className="absolute top-3 right-3 bg-green-500 border-0 text-xs animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full mr-1" />
                            Available
                          </Badge>
                        )}

                        <div className="absolute bottom-3 left-3 flex gap-2">
                          {escort.verified && (
                            <Badge className="bg-blue-500 border-0 text-xs">
                              <Shield size={10} className="mr-1" />
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="flex-1 space-y-4">
                        <div>
                          <h3 className="text-3xl font-black text-white mb-2 hover:text-pink-500 transition-colors cursor-pointer">
                            {escort.name}, {escort.age}
                          </h3>
                          
                          <div className="flex items-center gap-2 text-blue-400 text-sm mb-3">
                            <MapPin size={14} />
                            <span className="font-medium">{escort.location}</span>
                          </div>

                          <div className="flex items-center gap-2 text-gray-400 text-xs mb-3">
                            <Clock size={12} />
                            <span>{escort.postedTime}</span>
                          </div>
                        </div>

                        <p className="text-gray-300 leading-relaxed">{escort.description}</p>

                        <div className="flex flex-wrap gap-2">
                          {escort.services.map((service, idx) => (
                            <Badge key={idx} variant="outline" className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white transition-colors">
                              {service}
                            </Badge>
                          ))}
                        </div>

                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={16} className={i < Math.floor(escort.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"} />
                            ))}
                          </div>
                          <span className="text-white text-sm font-medium">{escort.rating}</span>
                          <span className="text-white/60 text-xs">({escort.reviews} reviews)</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div>
                            <div className="text-xs text-gray-400">Starting from</div>
                            <div className="text-2xl font-black text-yellow-500">CHF {escort.rate}</div>
                            <div className="text-xs text-gray-400">per hour</div>
                          </div>
                          <div className="flex gap-3">
                            <Button size="sm" variant="outline" className="text-white border-white/30 hover:bg-white/10 hover:border-pink-500" onClick={() => toggleFavorite(escort.id)}>
                              <Heart size={16} className={favorites.includes(escort.id) ? "fill-pink-600 text-pink-600" : ""} />
                            </Button>
                            <Button size="sm" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold" asChild>
                              <Link href="/register">
                                <MessageCircle size={16} className="mr-2" />
                                Contact
                              </Link>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="p-12 text-center bg-white/5 backdrop-blur-sm border-white/10">
                <Search size={64} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No escorts found</h3>
                <p className="text-gray-400 mb-6">Try adjusting your filters</p>
                <Button onClick={() => {
                  setSearchQuery("");
                  setSelectedDistrict("all");
                  setSelectedService("all");
                  setVerifiedOnly(false);
                  setAvailableNow(false);
                }} className="bg-yellow-500 text-black hover:bg-yellow-600">
                  Reset Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      <section className="py-16 bg-black/60 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-black text-white mb-6">Book Elite Escort Services in Geneva</h2>
            
            <div className="text-gray-300 space-y-4 leading-relaxed">
              <p>
                Looking to <strong className="text-white">book an escort in Geneva</strong>? Discover Switzerland's most sophisticated escort directory featuring multilingual companions throughout Geneva's prestigious districts. From UN headquarters to luxury lakeside hotels, find your perfect international companion.
              </p>

              <h3 className="text-2xl font-bold text-white mt-8 mb-4">Why Choose Geneva Escorts?</h3>
              <p>
                Geneva, as the diplomatic capital of the world, attracts elite professionals seeking discreet, cultured companionship. Our <strong className="text-white">Geneva escort services</strong> cater to international clients who value sophistication, multilingual abilities, and absolute discretion.
              </p>

              <h3 className="text-2xl font-bold text-white mt-8 mb-4">Popular Geneva Districts</h3>
              <ul className="space-y-2 text-gray-300">
                <li><strong className="text-white">Geneva City Center</strong> - Elite escorts near luxury hotels and international organizations</li>
                <li><strong className="text-white">Eaux-Vives</strong> - Sophisticated companions by Lake Geneva for romantic encounters</li>
                <li><strong className="text-white">Pâquis</strong> - International quarter escorts fluent in multiple languages</li>
                <li><strong className="text-white">Carouge</strong> - Artistic district companions for cultural experiences</li>
                <li><strong className="text-white">Plainpalais</strong> - Vibrant area escorts near universities and nightlife</li>
              </ul>

              <div className="bg-gradient-to-r from-pink-600/20 to-purple-600/20 border border-pink-500/30 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="text-yellow-500" />
                  Book Your Geneva Escort Experience
                </h3>
                <p className="text-gray-300 mb-4">
                  Join international clients who have discovered exceptional companionship in Geneva. Browse verified escorts now.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold" asChild>
                    <Link href="#top">
                      <TrendingUp className="mr-2" size={18} />
                      Browse Escorts
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
                    <Link href="/register">Register Free</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="text-pink-600 fill-pink-600" size={24} />
                <span className="text-xl font-bold text-white">iWantSexNow.ch</span>
              </div>
              <p className="text-gray-400 text-sm">Switzerland's premier escort directory</p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Other Cities</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/escort-zurich" className="hover:text-white">Escort Zürich</Link></li>
                <li><Link href="/escort-basel" className="hover:text-white">Escort Basel</Link></li>
                <li><Link href="/escort-bern" className="hover:text-white">Escort Bern</Link></li>
                <li><Link href="/escort-lausanne" className="hover:text-white">Escort Lausanne</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/" className="hover:text-white">Home</Link></li>
                <li><Link href="/members" className="hover:text-white">All Escorts</Link></li>
                <li><Link href="/register" className="hover:text-white">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/safety" className="hover:text-white">Safety Tips</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} iWantSexNow.ch - Escort Geneva. All rights reserved. 18+</p>
          </div>
        </div>
      </footer>
    </div>
  );
}