import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import SEO from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Heart, MapPin, Star, Shield, CheckCircle, Phone, MessageCircle, Search, X, Clock, Award, Sparkles, TrendingUp, Users, Play, Video, Eye, Calendar, Zap, Crown, ThumbsUp, Camera } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Escort {
  id: number;
  name: string;
  age: number;
  district: string;
  location: string;
  image: string;
  verified: boolean;
  premium: boolean;
  available: boolean;
  rating: number;
  reviews: number;
  rate: number;
  services: string[];
  languages: string[];
  description: string;
  postedTime: string;
  hasVideo: boolean;
  hasVirtualTour: boolean;
  verifiedPhotos: boolean;
  idVerified: boolean;
  safeDate: boolean;
  bodyType: string;
  height: string;
  responseTime: string;
  bookingsToday: number;
}

export default function EscortBern() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const [priceRange, setPriceRange] = useState([350, 700]);
  const [minRating, setMinRating] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comparison, setComparison] = useState<number[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [selectedEscort, setSelectedEscort] = useState<Escort | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [liveViewers, setLiveViewers] = useState(142);

  const bernEscorts: Escort[] = [
    {
      id: 11,
      name: "Anna",
      age: 26,
      district: "Bern Old Town",
      location: "Zytglogge, Bern",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 142,
      rate: 580,
      services: ["GFE", "Dinner Dates", "Cultural Tours"],
      languages: ["German", "English", "French"],
      description: "Sophisticated companion in Bern's UNESCO World Heritage Old Town. Perfect for cultural experiences.",
      postedTime: "Online now",
      hasVideo: true,
      hasVirtualTour: true,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Slim",
      height: "169 cm",
      responseTime: "< 5 min",
      bookingsToday: 3
    },
    {
      id: 12,
      name: "Katarina",
      age: 24,
      district: "Kirchenfeld",
      location: "Kirchenfeld, Bern",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 4.9,
      reviews: 118,
      rate: 620,
      services: ["PSE", "Couples", "Overnight"],
      languages: ["German", "Russian", "English"],
      description: "Elite escort near diplomatic quarter. Specializing in exclusive overnight experiences.",
      postedTime: "Active 4min ago",
      hasVideo: true,
      hasVirtualTour: true,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Athletic",
      height: "171 cm",
      responseTime: "< 10 min",
      bookingsToday: 4
    },
    {
      id: 13,
      name: "Lisa",
      age: 27,
      district: "Länggasse",
      location: "Länggasse, Bern",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      verified: true,
      premium: false,
      available: true,
      rating: 4.7,
      reviews: 94,
      rate: 480,
      services: ["GFE", "Massage", "Relaxation"],
      languages: ["German", "English"],
      description: "Warm companion in student-friendly Länggasse. Offering relaxing encounters near university.",
      postedTime: "Available tonight",
      hasVideo: false,
      hasVirtualTour: false,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: false,
      bodyType: "Average",
      height: "167 cm",
      responseTime: "< 30 min",
      bookingsToday: 1
    },
    {
      id: 14,
      name: "Sandra",
      age: 25,
      district: "Bern Old Town",
      location: "Bundesplatz, Bern",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 4.8,
      reviews: 106,
      rate: 550,
      services: ["GFE", "Travel", "Events"],
      languages: ["German", "French", "Italian"],
      description: "Multilingual escort perfect for government events and diplomatic receptions in capital.",
      postedTime: "Online now",
      hasVideo: true,
      hasVirtualTour: true,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Slim",
      height: "170 cm",
      responseTime: "< 5 min",
      bookingsToday: 2
    }
  ];

  const filteredEscorts = bernEscorts.filter(escort => {
    if (searchQuery && !escort.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !escort.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedDistrict !== "all" && escort.district !== selectedDistrict) return false;
    if (selectedService !== "all" && !escort.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()))) return false;
    if (verifiedOnly && !escort.verified) return false;
    if (availableNow && !escort.available) return false;
    if (escort.rate < priceRange[0] || escort.rate > priceRange[1]) return false;
    if (escort.rating < minRating) return false;
    return true;
  });

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const toggleComparison = (id: number) => {
    if (comparison.includes(id)) {
      setComparison(prev => prev.filter(c => c !== id));
    } else if (comparison.length < 3) {
      setComparison(prev => [...prev, id]);
    }
  };

  const openBookingModal = (escort: Escort) => {
    setSelectedEscort(escort);
    setBookingModalOpen(true);
  };

  const openVideoModal = (escort: Escort) => {
    setSelectedEscort(escort);
    setVideoModalOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLiveViewers(prev => Math.max(120, prev + Math.floor(Math.random() * 8) - 4));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <SEO 
        title="Escort Bern - Premium Escort Services in Bern | iWantSexNow.ch"
        description="Find exclusive escort services in Bern. Browse verified profiles, book premium companions in Old Town, Kirchenfeld & more. Discreet & professional."
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
                <div className="text-xs text-pink-500 font-semibold tracking-wider">ESCORT BERN</div>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-white">
                <Eye size={16} className="text-blue-400" />
                <span className="font-semibold">{liveViewers} viewing</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Zap size={16} className="text-green-500 animate-pulse" />
                <span className="font-semibold">{bernEscorts.filter(e => e.available).length} available now</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="/">Home</Link>
              </Button>
              {comparison.length > 0 && (
                <Button variant="outline" className="border-yellow-500 text-yellow-500 hover:bg-yellow-500/10" asChild>
                  <Link href={`/compare-escorts?ids=${comparison.join(',')}`}>
                    Compare ({comparison.length})
                  </Link>
                </Button>
              )}
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
              backgroundImage: "url('https://images.unsplash.com/photo-1559564484-e48d68d8ffad?w=1920&h=1080&fit=crop&q=80')"
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
              <span className="text-white font-semibold">Escort Bern</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
                  Escort Bern
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-white font-bold mb-4">
                Premium Escort Services in Switzerland's Capital
              </p>
              <p className="text-lg text-gray-300 max-w-3xl mx-auto">
                Discover elite companionship in Switzerland's charming capital city. From UNESCO Old Town to diplomatic events, find verified escorts for sophisticated encounters.
              </p>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white"
            >
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <Users className="mx-auto text-pink-500 mb-2" size={32} />
                <div className="text-2xl font-black">{bernEscorts.length}+</div>
                <div className="text-xs text-gray-400">Active Escorts</div>
              </Card>
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <Shield className="mx-auto text-green-500 mb-2" size={32} />
                <div className="text-2xl font-black">100%</div>
                <div className="text-xs text-gray-400">Verified</div>
              </Card>
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <Award className="mx-auto text-yellow-500 mb-2" size={32} />
                <div className="text-2xl font-black">4.9★</div>
                <div className="text-xs text-gray-400">Avg Rating</div>
              </Card>
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-white/20">
                <Video className="mx-auto text-purple-500 mb-2" size={32} />
                <div className="text-2xl font-black">{bernEscorts.filter(e => e.hasVideo).length}</div>
                <div className="text-xs text-gray-400">Video Profiles</div>
              </Card>
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
                      <SelectItem value="Bern Old Town">Old Town</SelectItem>
                      <SelectItem value="Kirchenfeld">Kirchenfeld</SelectItem>
                      <SelectItem value="Länggasse">Länggasse</SelectItem>
                      <SelectItem value="Breitenrain">Breitenrain</SelectItem>
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

                <div className="space-y-4">
                  <div className="flex items-center gap-6 text-white">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition-colors">
                      <Checkbox 
                        checked={verifiedOnly} 
                        onCheckedChange={(checked) => setVerifiedOnly(checked === true)} 
                      />
                      <span className="text-sm font-medium">Verified Only</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition-colors">
                      <Checkbox 
                        checked={availableNow} 
                        onCheckedChange={(checked) => setAvailableNow(checked === true)} 
                      />
                      <span className="text-sm font-medium">Available Now</span>
                    </label>

                    <div className="ml-auto">
                      <span className="text-yellow-500 font-bold text-lg">{filteredEscorts.length} Results</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white mb-2 block text-sm">Price Range: CHF {priceRange[0]} - {priceRange[1]}</Label>
                      <Slider
                        value={priceRange}
                        onValueChange={setPriceRange}
                        min={300}
                        max={1000}
                        step={50}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label className="text-white mb-2 block text-sm">Minimum Rating</Label>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              size={24}
                              className={rating <= minRating ? "text-yellow-500 fill-yellow-500" : "text-gray-600"}
                            />
                          </button>
                        ))}
                        {minRating > 0 && (
                          <button
                            onClick={() => setMinRating(0)}
                            className="ml-2 text-xs text-gray-400 hover:text-white"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-8 bg-gradient-to-r from-yellow-600/20 via-orange-600/20 to-pink-600/20 border-y border-yellow-500/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Crown className="text-yellow-500" size={48} />
              <div>
                <h3 className="text-2xl font-black text-white mb-1">VIP Concierge Service</h3>
                <p className="text-gray-300">White-glove booking assistance for discerning clients in Bern</p>
              </div>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-black">
              <Phone size={20} className="mr-2" />
              Contact Concierge
            </Button>
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
                        
                        {escort.hasVideo && (
                          <button
                            onClick={() => openVideoModal(escort)}
                            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                          >
                            <div className="bg-pink-600 rounded-full p-4 transform group-hover:scale-110 transition-transform">
                              <Play size={32} className="text-white" fill="white" />
                            </div>
                          </button>
                        )}

                        {escort.premium && (
                          <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 font-bold shadow-xl">PREMIUM</Badge>
                        )}

                        {escort.available && (
                          <Badge className="absolute top-3 right-3 bg-green-500 border-0 text-xs animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full mr-1" />
                            Available
                          </Badge>
                        )}

                        <div className="absolute bottom-3 left-3 flex gap-2 flex-wrap">
                          {escort.verified && (
                            <Badge className="bg-blue-500 border-0 text-xs">
                              <Shield size={10} className="mr-1" />
                              Verified
                            </Badge>
                          )}
                          {escort.hasVideo && (
                            <Badge className="bg-purple-500 border-0 text-xs">
                              <Video size={10} className="mr-1" />
                              Video
                            </Badge>
                          )}
                          {escort.hasVirtualTour && (
                            <Badge className="bg-pink-500 border-0 text-xs">
                              <Eye size={10} className="mr-1" />
                              Tour
                            </Badge>
                          )}
                        </div>

                        {escort.bookingsToday > 0 && (
                          <div className="absolute top-3 left-1/2 -translate-x-1/2 bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            🔥 {escort.bookingsToday} bookings today
                          </div>
                        )}
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

                          <div className="flex items-center gap-4 text-gray-400 text-xs mb-3">
                            <div className="flex items-center gap-1">
                              <Clock size={12} />
                              <span>{escort.postedTime}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Zap size={12} className="text-green-500" />
                              <span>Responds in {escort.responseTime}</span>
                            </div>
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

                        <div className="flex flex-wrap gap-2 text-sm text-gray-400">
                          <span className="flex items-center gap-1">
                            <Camera size={14} /> {escort.bodyType}
                          </span>
                          <span>•</span>
                          <span>{escort.height}</span>
                          <span>•</span>
                          <span>{escort.languages.join(", ")}</span>
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

                        <div className="grid grid-cols-2 gap-4 p-4 bg-black/40 rounded-lg">
                          {escort.verifiedPhotos && (
                            <div className="flex items-center gap-2 text-green-400 text-xs">
                              <CheckCircle size={14} /> Real Photos
                            </div>
                          )}
                          {escort.idVerified && (
                            <div className="flex items-center gap-2 text-blue-400 text-xs">
                              <CheckCircle size={14} /> ID Verified
                            </div>
                          )}
                          {escort.safeDate && (
                            <div className="flex items-center gap-2 text-yellow-400 text-xs">
                              <CheckCircle size={14} /> SafeDate
                            </div>
                          )}
                          {escort.hasVirtualTour && (
                            <div className="flex items-center gap-2 text-pink-400 text-xs">
                              <CheckCircle size={14} /> Virtual Tour
                            </div>
                          )}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-white/10">
                          <div>
                            <div className="text-xs text-gray-400">Starting from</div>
                            <div className="text-2xl font-black text-yellow-500">CHF {escort.rate}</div>
                            <div className="text-xs text-gray-400">per hour</div>
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              size="sm"
                              variant="outline"
                              className={`text-white border-white/30 hover:bg-white/10 ${
                                comparison.includes(escort.id) ? "border-yellow-500 bg-yellow-500/10" : ""
                              }`}
                              onClick={() => toggleComparison(escort.id)}
                              disabled={comparison.length >= 3 && !comparison.includes(escort.id)}
                            >
                              <ThumbsUp size={16} />
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              className="text-white border-white/30 hover:bg-white/10 hover:border-pink-500"
                              onClick={() => toggleFavorite(escort.id)}
                            >
                              <Heart size={16} className={favorites.includes(escort.id) ? "fill-pink-600 text-pink-600" : ""} />
                            </Button>
                            <Button 
                              size="sm"
                              className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold"
                              onClick={() => openBookingModal(escort)}
                            >
                              <MessageCircle size={16} className="mr-2" />
                              Book Now
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
                  setPriceRange([350, 700]);
                  setMinRating(0);
                }} className="bg-yellow-500 text-black hover:bg-yellow-600">
                  Reset Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      <Dialog open={bookingModalOpen} onOpenChange={setBookingModalOpen}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">Quick Booking Request</DialogTitle>
            <DialogDescription className="text-gray-400">
              Send a booking request to {selectedEscort?.name}
            </DialogDescription>
          </DialogHeader>
          {selectedEscort && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-white/5 rounded-lg">
                <img src={selectedEscort.image} alt={selectedEscort.name} className="w-20 h-20 rounded-lg object-cover" />
                <div>
                  <h4 className="font-bold text-lg">{selectedEscort.name}, {selectedEscort.age}</h4>
                  <p className="text-sm text-gray-400">{selectedEscort.location}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Star size={14} className="text-yellow-500 fill-yellow-500" />
                    <span className="text-sm">{selectedEscort.rating} ({selectedEscort.reviews} reviews)</span>
                  </div>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-2xl font-black text-yellow-500">CHF {selectedEscort.rate}</div>
                  <div className="text-xs text-gray-400">per hour</div>
                </div>
              </div>
              <div className="text-center">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white font-bold w-full"
                  asChild
                >
                  <Link href={`/booking-confirmation?escortId=${selectedEscort.id}&escortName=${selectedEscort.name}`}>
                    <Calendar size={20} className="mr-2" />
                    Continue to Full Booking Form
                  </Link>
                </Button>
                <p className="text-xs text-gray-400 mt-2">
                  Response time: {selectedEscort.responseTime}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{selectedEscort?.name}'s Video Profile</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play size={64} className="text-pink-500 mx-auto mb-4" />
              <p className="text-gray-400">Video preview would load here</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                <li><Link href="/escort-geneva" className="hover:text-white">Escort Geneva</Link></li>
                <li><Link href="/escort-basel" className="hover:text-white">Escort Basel</Link></li>
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
            <p>&copy; {new Date().getFullYear()} iWantSexNow.ch - Escort Bern. All rights reserved. 18+</p>
          </div>
        </div>
      </footer>
    </div>
  );
}