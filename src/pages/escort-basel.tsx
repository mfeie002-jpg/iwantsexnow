import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import SEO from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Heart, MapPin, Star, Shield, CheckCircle, Phone, MessageCircle, Search, X, Clock, Award, Sparkles, TrendingUp, Users, Play, Video, Eye, Calendar, Zap, Crown, ThumbsUp, Camera } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { LiveChatWidget } from "@/components/LiveChatWidget";

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

export default function EscortBasel() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [availableNow, setAvailableNow] = useState(false);
  const [priceRange, setPriceRange] = useState([350, 750]);
  const [minRating, setMinRating] = useState(0);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [comparison, setComparison] = useState<number[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const [selectedEscort, setSelectedEscort] = useState<Escort | null>(null);
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [liveViewers, setLiveViewers] = useState(164);

  const baselEscorts: Escort[] = [
    {
      id: 7,
      name: "Valentina",
      age: 25,
      district: "Basel City Center",
      location: "Marktplatz, Basel",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 4.9,
      reviews: 98,
      rate: 550,
      services: ["GFE", "Dinner Dates", "Cultural Events"],
      languages: ["German", "English", "Swiss German"],
      description: "Cultured companion in Basel's historic center. Perfect for museum visits and Rhine riverfront dining.",
      postedTime: "Online now",
      hasVideo: true,
      hasVirtualTour: true,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Slim",
      height: "166 cm",
      responseTime: "< 5 min",
      bookingsToday: 2
    },
    {
      id: 8,
      name: "Alina",
      age: 27,
      district: "Kleinbasel",
      location: "Claraplatz, Basel",
      image: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 134,
      rate: 600,
      services: ["PSE", "Couples", "Overnight"],
      languages: ["German", "French", "English"],
      description: "Adventurous Basel escort specializing in unforgettable experiences across the Rhine.",
      postedTime: "Active 3min ago",
      hasVideo: true,
      hasVirtualTour: true,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Athletic",
      height: "170 cm",
      responseTime: "< 10 min",
      bookingsToday: 4
    },
    {
      id: 9,
      name: "Leila",
      age: 24,
      district: "Gundeldingen",
      location: "Gundeldingen, Basel",
      image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=600&fit=crop",
      verified: true,
      premium: false,
      available: true,
      rating: 4.7,
      reviews: 76,
      rate: 450,
      services: ["GFE", "Massage", "Tantra"],
      languages: ["German", "English"],
      description: "Sensual companion in trendy Gundeldingen. Offering relaxing tantric experiences.",
      postedTime: "Available tonight",
      hasVideo: false,
      hasVirtualTour: false,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: false,
      bodyType: "Average",
      height: "168 cm",
      responseTime: "< 30 min",
      bookingsToday: 1
    },
    {
      id: 10,
      name: "Jasmine",
      age: 26,
      district: "Basel City Center",
      location: "Barfüsserplatz, Basel",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 4.8,
      reviews: 112,
      rate: 580,
      services: ["GFE", "Travel", "Shopping"],
      languages: ["German", "Italian", "English"],
      description: "Elegant escort perfect for Basel's upscale shopping district and fine dining scene.",
      postedTime: "Online now",
      hasVideo: true,
      hasVirtualTour: true,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Slim",
      height: "172 cm",
      responseTime: "< 5 min",
      bookingsToday: 3
    }
  ];

  const filteredEscorts = baselEscorts.filter(escort => {
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
      setLiveViewers(prev => Math.max(140, prev + Math.floor(Math.random() * 8) - 4));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900">
      <SEO 
        title="Escort Basel - Premium Escort Services in Basel | iWantSexNow.ch"
        description="Find exclusive escort services in Basel. Browse verified profiles, book premium companions in Basel City Center, Kleinbasel & more. Discreet & professional."
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
                <div className="text-xs text-pink-500 font-semibold tracking-wider">ESCORT BASEL</div>
              </div>
            </Link>
            
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-white">
                <Eye size={16} className="text-blue-400" />
                <span className="font-semibold">{liveViewers} viewing</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Zap size={16} className="text-green-500 animate-pulse" />
                <span className="font-semibold">{baselEscorts.filter(e => e.available).length} available now</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:text-amber-400" asChild>
                <Link href="/">Home</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:text-amber-400" asChild>
                <Link href="/members">All Escorts</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:text-amber-400" asChild>
                <Link href="/account-settings">Account</Link>
              </Button>
              {comparison.length > 0 && (
                <Button variant="outline" className="border-amber-500 text-amber-500 hover:bg-amber-500/10" asChild>
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

      {/* Hero Section - Basel Specific */}
      <section className="relative py-20 overflow-hidden">
        {/* Background with romantic couple imagery and warm tones */}
        <div className="absolute inset-0">
          {/* Romantic couple background - sophisticated and emotional */}
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&h=1080&fit=crop&q=80')",
              filter: "brightness(0.4)"
            }}
          />
          
          {/* Warm gradient overlay - gold, amber, rose tones */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/80 via-rose-900/70 to-slate-900/90" />
          
          {/* Soft vignette for depth */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />
          
          {/* Subtle animated glow */}
          <div className="absolute inset-0 bg-gradient-to-t from-amber-600/10 via-transparent to-rose-600/10 animate-pulse" 
               style={{ animationDuration: "4s" }} 
          />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Breadcrumb */}
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-center gap-2 text-sm text-amber-200/80"
            >
              <Link href="/" className="hover:text-white transition-colors">Home</Link>
              <span>/</span>
              <Link href="/cities" className="hover:text-white transition-colors">Cities</Link>
              <span>/</span>
              <span className="text-white font-semibold">Escort Basel</span>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h1 className="text-5xl md:text-7xl font-black leading-tight mb-6">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-rose-300 to-orange-200">
                  Escort Basel
                </span>
              </h1>
              <p className="text-2xl md:text-3xl text-white font-bold mb-4 drop-shadow-lg">
                Premium Escort Services in Basel
              </p>
              <p className="text-lg text-amber-100 max-w-3xl mx-auto drop-shadow-md">
                Discover elite companionship in Switzerland's cultural capital. From Rhine riverfront to Art Basel events, find verified escorts for sophisticated encounters.
              </p>
            </motion.div>

            {/* Quick Stats */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-4 text-white"
            >
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-amber-500/30 hover:border-amber-500/60 transition-all">
                <Users className="mx-auto text-amber-400 mb-2" size={32} />
                <div className="text-2xl font-black">{baselEscorts.length}+</div>
                <div className="text-xs text-amber-200">Active Escorts</div>
              </Card>
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-emerald-500/30 hover:border-emerald-500/60 transition-all">
                <Shield className="mx-auto text-emerald-400 mb-2" size={32} />
                <div className="text-2xl font-black">100%</div>
                <div className="text-xs text-emerald-200">Verified</div>
              </Card>
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-yellow-500/30 hover:border-yellow-500/60 transition-all">
                <Award className="mx-auto text-yellow-400 mb-2" size={32} />
                <div className="text-2xl font-black">4.9★</div>
                <div className="text-xs text-yellow-200">Avg Rating</div>
              </Card>
              <Card className="p-4 bg-white/10 backdrop-blur-sm border-rose-500/30 hover:border-rose-500/60 transition-all">
                <Video className="mx-auto text-rose-400 mb-2" size={32} />
                <div className="text-2xl font-black">{baselEscorts.filter(e => e.hasVideo).length}</div>
                <div className="text-xs text-rose-200">Video Profiles</div>
              </Card>
            </motion.div>

            {/* Search & Filters */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Card className="p-6 bg-slate-900/80 backdrop-blur-md border-amber-500/20 shadow-2xl">
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <Select value={selectedDistrict} onValueChange={setSelectedDistrict}>
                    <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white hover:border-amber-500/50 transition-all">
                      <SelectValue placeholder="District" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Districts</SelectItem>
                      <SelectItem value="Basel City Center">City Center</SelectItem>
                      <SelectItem value="Kleinbasel">Kleinbasel</SelectItem>
                      <SelectItem value="Gundeldingen">Gundeldingen</SelectItem>
                      <SelectItem value="St. Johann">St. Johann</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="bg-slate-800/80 border-slate-700 text-white hover:border-amber-500/50 transition-all">
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
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400" size={20} />
                    <Input
                      placeholder="Search by name or location..."
                      className="pl-10 bg-slate-800/80 border-slate-700 text-white placeholder:text-slate-400 hover:border-amber-500/50 focus:border-amber-500 transition-all"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        onClick={() => setSearchQuery("")} 
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-6 text-white">
                    <label className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-colors">
                      <Checkbox checked={verifiedOnly} onCheckedChange={(checked) => setVerifiedOnly(checked === true)} />
                      <span className="text-sm font-medium">Verified Only</span>
                    </label>
                    
                    <label className="flex items-center gap-2 cursor-pointer hover:text-amber-400 transition-colors">
                      <Checkbox checked={availableNow} onCheckedChange={(checked) => setAvailableNow(checked === true)} />
                      <span className="text-sm font-medium">Available Now</span>
                    </label>

                    <div className="ml-auto">
                      <span className="text-amber-400 font-bold text-lg">{filteredEscorts.length} Results</span>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <div className="flex justify-between text-sm text-white mb-2">
                        <span>Price Range</span>
                        <span>CHF {priceRange[0]} - {priceRange[1]}</span>
                      </div>
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
                      <div className="text-sm text-white mb-2">Minimum Rating</div>
                      <div className="flex items-center gap-1 mt-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => setMinRating(rating === minRating ? 0 : rating)}
                            className="transition-transform hover:scale-110"
                          >
                            <Star
                              size={24}
                              className={rating <= minRating ? "text-amber-400 fill-amber-400" : "text-slate-600"}
                            />
                          </button>
                        ))}
                        {minRating > 0 && (
                          <button
                            onClick={() => setMinRating(0)}
                            className="ml-2 text-xs text-slate-400 hover:text-white transition-colors"
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

      {/* VIP Concierge Banner */}
      <section className="py-8 bg-gradient-to-r from-amber-900/30 via-rose-900/30 to-orange-900/30 border-y border-amber-500/30">
        <div className="container mx-auto px-4">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Crown className="text-amber-400" size={48} />
              <div>
                <h3 className="text-2xl font-black text-white mb-1">VIP Concierge Service</h3>
                <p className="text-amber-100">White-glove booking assistance for discerning clients in Basel</p>
              </div>
            </div>
            <Button size="lg" className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-black shadow-lg shadow-amber-500/30">
              <Phone size={20} className="mr-2" />
              Contact Concierge
            </Button>
          </div>
        </div>
      </section>

      {/* Escort Listings */}
      <section className="py-12 bg-gradient-to-b from-gray-900 to-black">
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
                  <Link href={`/profile/${escort.id}`}>
                    <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all duration-300 hover:shadow-2xl hover:shadow-black/40 cursor-pointer">
                      <div className="flex flex-col md:flex-row gap-6 p-6">
                        {/* Image */}
                        <div className="relative w-full md:w-72 flex-shrink-0 group">
                          <img
                            src={escort.image}
                            alt={escort.name}
                            className="w-full h-80 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                          />
                          
                          {escort.hasVideo && (
                            <button
                              onClick={() => openVideoModal(escort)}
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                            >
                              <div className="bg-amber-500 rounded-full p-4 transform group-hover:scale-110 transition-transform">
                                <Play size={32} className="text-slate-900" fill="currentColor" />
                              </div>
                            </button>
                          )}

                          {escort.premium && (
                            <Badge className="absolute top-3 left-3 bg-gradient-to-r from-amber-400 to-orange-400 text-slate-900 border-0 font-bold shadow-xl">
                              PREMIUM
                            </Badge>
                          )}

                          {escort.available && (
                            <Badge className="absolute top-3 right-3 bg-emerald-500 border-0 text-xs animate-pulse">
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
                              <Badge className="bg-rose-500 border-0 text-xs">
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

                        {/* Content */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <h3 className="text-3xl font-black text-white mb-2 hover:text-amber-400 transition-colors cursor-pointer">
                              {escort.name}, {escort.age}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-amber-400 text-sm mb-3">
                              <MapPin size={14} />
                              <span className="font-medium">{escort.location}</span>
                            </div>

                            <div className="flex items-center gap-4 text-slate-400 text-xs mb-3">
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                <span>{escort.postedTime}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Zap size={12} className="text-emerald-400" />
                                <span>Responds in {escort.responseTime}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-slate-300 leading-relaxed">
                            {escort.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {escort.services.map((service, idx) => (
                              <Badge key={idx} variant="outline" className="border-amber-500/30 text-slate-300 hover:bg-amber-500/10 hover:text-amber-200 transition-colors">
                                {service}
                              </Badge>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-2 text-sm text-slate-400">
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
                                <Star 
                                  key={i} 
                                  size={16} 
                                  className={i < Math.floor(escort.rating) ? "text-amber-400 fill-amber-400" : "text-slate-600"}
                                />
                              ))}
                            </div>
                            <span className="text-white text-sm font-medium">{escort.rating}</span>
                            <span className="text-slate-400 text-xs">({escort.reviews} reviews)</span>
                          </div>

                          <div className="grid grid-cols-2 gap-4 p-4 bg-slate-900/60 rounded-lg border border-amber-500/20">
                            {escort.verifiedPhotos && (
                              <div className="flex items-center gap-2 text-emerald-400 text-xs">
                                <CheckCircle size={14} /> Real Photos
                              </div>
                            )}
                            {escort.idVerified && (
                              <div className="flex items-center gap-2 text-blue-400 text-xs">
                                <CheckCircle size={14} /> ID Verified
                              </div>
                            )}
                            {escort.safeDate && (
                              <div className="flex items-center gap-2 text-amber-400 text-xs">
                                <CheckCircle size={14} /> SafeDate
                              </div>
                            )}
                            {escort.hasVirtualTour && (
                              <div className="flex items-center gap-2 text-rose-400 text-xs">
                                <CheckCircle size={14} /> Virtual Tour
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
                            <div>
                              <div className="text-xs text-slate-400">Starting from</div>
                              <div className="text-2xl font-black text-amber-400">CHF {escort.rate}</div>
                              <div className="text-xs text-slate-400">per hour</div>
                            </div>
                            <div className="flex gap-2">
                              <Button 
                                size="sm"
                                variant="outline"
                                className={`text-white border-slate-600 hover:bg-slate-700 ${
                                  comparison.includes(escort.id) ? "border-amber-500 bg-amber-500/10" : ""
                                }`}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleComparison(escort.id);
                                }}
                                disabled={comparison.length >= 3 && !comparison.includes(escort.id)}
                              >
                                <ThumbsUp size={16} />
                              </Button>
                              <Button 
                                size="sm"
                                variant="outline"
                                className="text-white border-slate-600 hover:bg-slate-700 hover:border-rose-500"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleFavorite(escort.id);
                                }}
                              >
                                <Heart size={16} className={favorites.includes(escort.id) ? "fill-rose-500 text-rose-500" : ""} />
                              </Button>
                              <Button 
                                size="sm"
                                className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-bold shadow-lg shadow-amber-500/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openBookingModal(escort);
                                }}
                              >
                                <MessageCircle size={16} className="mr-2" />
                                Book Now
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                </motion.div>
              ))
            ) : (
              <Card className="p-12 text-center bg-slate-800/50 backdrop-blur-sm border-amber-500/20">
                <Search size={64} className="mx-auto text-slate-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Escorts found</h3>
                <p className="text-slate-400 mb-6">Try adjusting your filters</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedDistrict("all");
                    setSelectedService("all");
                    setVerifiedOnly(false);
                    setAvailableNow(false);
                    setPriceRange([350, 750]);
                    setMinRating(0);
                  }}
                  className="bg-amber-500 text-slate-900 hover:bg-amber-600 font-bold"
                >
                  Reset Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Quick Booking Modal */}
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

      {/* Video Modal */}
      <Dialog open={videoModalOpen} onOpenChange={setVideoModalOpen}>
        <DialogContent className="bg-gray-900 border-white/20 text-white max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-black">{selectedEscort?.name}'s Video Profile</DialogTitle>
          </DialogHeader>
          <div className="aspect-video bg-black rounded-lg flex items-center justify-center">
            <div className="text-center">
              <Play size={64} className="text-pink-500 mx-auto mb-4" />
              <p className="text-gray-400">Video preview would load here</p>
              <p className="text-sm text-gray-500 mt-2">Demo mode - video integration ready</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* SEO Content Section */}
      <section className="py-16 bg-slate-900 border-y border-amber-500/20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto prose prose-invert">
            <h2 className="text-3xl font-black text-white mb-6">Book Premium Escort Services in Basel</h2>
            
            <div className="text-slate-300 space-y-4 leading-relaxed">
              <p>
                Looking to <strong className="text-white">book an escort in Basel</strong>? Discover Switzerland's most sophisticated escort directory featuring verified companions throughout Basel's cultural districts. From Rhine riverfront to Art Basel events, find your perfect match in this historic city.
              </p>

              <h3 className="text-2xl font-bold text-white mt-8 mb-4">Why Choose Basel Escorts?</h3>
              <p>
                Basel, as Switzerland's cultural hub, attracts refined professionals seeking discreet, cultured companionship. Our <strong className="text-white">Basel escort services</strong> cater to art enthusiasts and business travelers who value sophistication and genuine connection.
              </p>

              <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-lg p-6 mt-8">
                <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <Sparkles className="text-amber-400" />
                  Start Your Basel Escort Experience Today
                </h3>
                <p className="text-slate-300 mb-4">
                  Join discerning clients who have discovered exceptional companionship in Basel. Browse our verified escorts now and book your perfect match today.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-900 font-bold" asChild>
                    <Link href="#top">
                      <TrendingUp className="mr-2" size={18} />
                      Browse Escorts Now
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-amber-500/50 text-white hover:bg-amber-500/10" asChild>
                    <Link href="/register">
                      Register Free Account
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Chat Widget */}
      <LiveChatWidget />

      {/* Footer */}
      <footer className="bg-slate-950 border-t border-amber-500/20 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="text-amber-500 fill-amber-500" size={24} />
                <span className="text-xl font-bold text-white">iWantSexNow.ch</span>
              </div>
              <p className="text-slate-400 text-sm">
                Switzerland's premier escort directory
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Other Cities</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/escort-zurich" className="hover:text-amber-400 transition-colors">Escort Zürich</Link></li>
                <li><Link href="/escort-geneva" className="hover:text-amber-400 transition-colors">Escort Geneva</Link></li>
                <li><Link href="/escort-bern" className="hover:text-amber-400 transition-colors">Escort Bern</Link></li>
                <li><Link href="/escort-lausanne" className="hover:text-amber-400 transition-colors">Escort Lausanne</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/" className="hover:text-amber-400 transition-colors">Home</Link></li>
                <li><Link href="/members" className="hover:text-amber-400 transition-colors">All Escorts</Link></li>
                <li><Link href="/register" className="hover:text-amber-400 transition-colors">Register</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-slate-400">
                <li><Link href="/safety" className="hover:text-amber-400 transition-colors">Safety Tips</Link></li>
                <li><Link href="/faq" className="hover:text-amber-400 transition-colors">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-amber-400 transition-colors">Contact</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-amber-500/20 pt-8 text-center text-slate-500 text-sm">
            <p>&copy; {new Date().getFullYear()} iWantSexNow.ch - Escort Basel. All rights reserved. 18+</p>
          </div>
        </div>
      </footer>
    </div>
  );
}