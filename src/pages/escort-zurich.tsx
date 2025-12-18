import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { MobileNav } from "@/components/MobileNav";
import { Heart, Star, Shield, Clock, MapPin, Phone, Mail, CheckCircle, Award, Lock, Eye, MessageCircle, Calendar, DollarSign, Sparkles, Crown, Search, Filter, ChevronLeft, ChevronRight, X } from "lucide-react";
import Link from "next/link";

export default function EscortZurich() {
  const [selectedEscort, setSelectedEscort] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  
  // Advanced filter state
  const [filters, setFilters] = useState({
    search: "",
    availability: "all",
    priceMin: 200,
    priceMax: 1000,
    ageMin: 18,
    ageMax: 50,
    services: [] as string[],
    languages: [] as string[],
    areas: [] as string[],
    bodyType: "all",
    ethnicity: "all",
    premium: false,
    verified: true,
    available: false
  });

  const serviceOptions = [
    "GFE (Girlfriend Experience)", "PSE (Pornstar Experience)", "Dinner Dates",
    "Massage", "City Tours", "Events Companion", "Travel Companion",
    "Overnight", "Weekend", "Couples", "Roleplay", "BDSM", "Tantric"
  ];

  const languageOptions = [
    "German", "English", "French", "Italian", "Spanish", "Portuguese", "Russian", "Chinese"
  ];

  const areas = [
    "Zürich City Center", "Seefeld", "Wiedikon", "Enge", "Altstetten",
    "Oerlikon", "Zürich Nord", "Zürich West", "Hottingen", "Wipkingen"
  ];

  // Generate 50 escorts for pagination demo
  const allEscorts = Array.from({ length: 50 }, (_, i) => ({
    id: i + 1,
    name: ["Sophia", "Isabella", "Emma", "Mia", "Nina", "Laura", "Sophie", "Anna", "Olivia", "Julia"][i % 10],
    age: 22 + (i % 15),
    location: areas[i % areas.length],
    image: `https://images.unsplash.com/photo-${1494790108377 + i}?w=400&h=600&fit=crop`,
    verified: i % 3 !== 0,
    premium: i % 4 === 0,
    available: i % 2 === 0,
    rating: 4.5 + (i % 5) * 0.1,
    reviews: 50 + i * 10,
    languages: languageOptions.slice(0, 2 + (i % 3)),
    services: serviceOptions.slice(0, 3 + (i % 5)),
    rate: 300 + (i % 8) * 100,
    bodyType: ["Slim", "Athletic", "Curvy", "Average"][i % 4],
    ethnicity: ["European", "Asian", "Latina", "Mixed", "African"][i % 5],
    description: "Professional companion offering unforgettable experiences with sophistication and discretion."
  }));

  // Apply filters
  const filteredEscorts = allEscorts.filter(escort => {
    if (filters.search && !escort.name.toLowerCase().includes(filters.search.toLowerCase())) return false;
    if (filters.availability === "available" && !escort.available) return false;
    if (filters.availability === "unavailable" && escort.available) return false;
    if (escort.rate < filters.priceMin || escort.rate > filters.priceMax) return false;
    if (escort.age < filters.ageMin || escort.age > filters.ageMax) return false;
    if (filters.services.length > 0 && !filters.services.some(s => escort.services.includes(s))) return false;
    if (filters.languages.length > 0 && !filters.languages.some(l => escort.languages.includes(l))) return false;
    if (filters.areas.length > 0 && !filters.areas.includes(escort.location)) return false;
    if (filters.bodyType !== "all" && escort.bodyType !== filters.bodyType) return false;
    if (filters.ethnicity !== "all" && escort.ethnicity !== filters.ethnicity) return false;
    if (filters.premium && !escort.premium) return false;
    if (filters.verified && !escort.verified) return false;
    if (filters.available && !escort.available) return false;
    return true;
  });

  // Pagination
  const itemsPerPage = 12;
  const totalPages = Math.ceil(filteredEscorts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEscorts = filteredEscorts.slice(startIndex, startIndex + itemsPerPage);

  const resetFilters = () => {
    setFilters({
      search: "",
      availability: "all",
      priceMin: 200,
      priceMax: 1000,
      ageMin: 18,
      ageMax: 50,
      services: [],
      languages: [],
      areas: [],
      bodyType: "all",
      ethnicity: "all",
      premium: false,
      verified: true,
      available: false
    });
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="border-b border-white/10 bg-black/40 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative">
                <Heart className="text-pink-600 fill-pink-600" size={36} />
                <div className="absolute inset-0 bg-pink-600/20 blur-xl group-hover:bg-pink-600/40 transition-all" />
              </div>
              <div>
                <span className="text-2xl font-black text-white tracking-tight">
                  iWantSexNow.ch
                </span>
                <div className="text-xs text-pink-500 font-semibold tracking-wider">ZÜRICH ESCORTS</div>
              </div>
            </Link>
            
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="#escorts">Browse</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="#services">Services</Link>
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-500" asChild>
                <Link href="#contact">Contact</Link>
              </Button>
              <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold">
                <Phone size={18} className="mr-2" />
                Book Now
              </Button>
            </nav>

            <MobileNav />
          </div>
        </div>
      </header>

      {/* Animated Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-orange-600/20 animate-pulse" />
          <div className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl animate-float-delayed" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center space-y-8">
            {/* Animated Badge */}
            <div className="animate-fade-in-down">
              <Badge className="bg-gradient-to-r from-pink-500 via-purple-500 to-pink-500 border-0 text-white text-base md:text-lg px-6 md:px-8 py-2 md:py-3 font-bold shadow-2xl shadow-pink-500/50">
                <Heart size={20} className="mr-2" />
                Zürich's #1 Premium Escort Service
              </Badge>
            </div>

            {/* Animated Headline */}
            <div className="space-y-4 animate-fade-in-up">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 animate-gradient">
                  Elite Escorts
                </span>
                <br />
                <span className="text-white drop-shadow-2xl">in Zürich</span>
              </h1>
              <p className="text-lg md:text-2xl text-gray-300 font-light max-w-4xl mx-auto leading-relaxed animate-fade-in px-4">
                Experience luxury companionship with Switzerland's most exclusive escorts.
                <span className="text-yellow-500 font-semibold"> Verified. Discreet. Available 24/7.</span>
              </p>
            </div>

            {/* Animated Stats */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-8 pt-8 animate-fade-in-up animation-delay-200 px-4">
              {[
                { number: "200+", label: "Elite Escorts", icon: Crown },
                { number: "24/7", label: "Always Available", icon: Clock },
                { number: "100%", label: "Verified & Safe", icon: Shield },
                { number: "5★", label: "Average Rating", icon: Star }
              ].map((stat, idx) => (
                <div key={idx} className="text-center group animate-scale-in" style={{ animationDelay: `${idx * 100}ms` }}>
                  <div className="relative">
                    <stat.icon className="mx-auto mb-2 text-yellow-500 group-hover:scale-110 transition-transform" size={28} />
                    <div className="absolute inset-0 bg-yellow-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="text-3xl md:text-4xl font-black text-yellow-500 mb-1">{stat.number}</div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Animated CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8 animate-fade-in-up animation-delay-400 px-4">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-base md:text-lg px-8 md:px-10 h-14 md:h-16 shadow-2xl shadow-yellow-500/50 hover:shadow-yellow-500/70 transition-all hover:scale-105 w-full sm:w-auto"
                onClick={() => document.getElementById('escorts')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Search size={22} className="mr-2" />
                Browse 200+ Escorts
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-white border-2 border-white/30 hover:bg-white/10 text-base md:text-lg px-8 md:px-10 h-14 md:h-16 backdrop-blur-sm w-full sm:w-auto"
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Phone size={22} className="mr-2" />
                Call +41 XX XXX XX XX
              </Button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-8 flex flex-wrap justify-center gap-4 md:gap-6 text-xs md:text-sm text-gray-400 animate-fade-in animation-delay-600 px-4">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-green-500" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-2">
                <Lock size={16} className="text-green-500" />
                <span>100% Discreet</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle size={16} className="text-green-500" />
                <span>Verified Profiles</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Advanced Filters Section */}
      <section id="escorts" className="py-12 bg-black/40 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Filter Toggle & Results Count */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2">
                  {filteredEscorts.length} Escorts Available
                </h2>
                <p className="text-sm md:text-base text-gray-400">Premium companions in Zürich</p>
              </div>
              <Button
                variant="outline"
                className="text-white border-white/30 w-full sm:w-auto"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={18} className="mr-2" />
                {showFilters ? "Hide" : "Show"} Filters
              </Button>
            </div>

            {/* Advanced Filters Panel */}
            {showFilters && (
              <Card className="p-4 md:p-6 mb-8 bg-white/5 backdrop-blur-md border-white/10 animate-slide-down">
                <div className="space-y-6">
                  {/* Search & Quick Filters */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Search by Name</label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <Input
                          placeholder="Enter name..."
                          value={filters.search}
                          onChange={(e) => {
                            setFilters({ ...filters, search: e.target.value });
                            setCurrentPage(1);
                          }}
                          className="pl-10 bg-white/10 border-white/20 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Availability</label>
                      <Select value={filters.availability} onValueChange={(value) => {
                        setFilters({ ...filters, availability: value });
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Escorts</SelectItem>
                          <SelectItem value="available">Available Now</SelectItem>
                          <SelectItem value="unavailable">Not Available</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="block text-white text-sm font-semibold mb-2">Body Type</label>
                      <Select value={filters.bodyType} onValueChange={(value) => {
                        setFilters({ ...filters, bodyType: value });
                        setCurrentPage(1);
                      }}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Types</SelectItem>
                          <SelectItem value="Slim">Slim</SelectItem>
                          <SelectItem value="Athletic">Athletic</SelectItem>
                          <SelectItem value="Curvy">Curvy</SelectItem>
                          <SelectItem value="Average">Average</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Price Range Slider */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-3">
                      Price Range: CHF {filters.priceMin} - CHF {filters.priceMax}/hour
                    </label>
                    <Slider
                      min={200}
                      max={1000}
                      step={50}
                      value={[filters.priceMin, filters.priceMax]}
                      onValueChange={([min, max]) => {
                        setFilters({ ...filters, priceMin: min, priceMax: max });
                        setCurrentPage(1);
                      }}
                      className="mb-2"
                    />
                  </div>

                  {/* Age Range Slider */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-3">
                      Age Range: {filters.ageMin} - {filters.ageMax} years
                    </label>
                    <Slider
                      min={18}
                      max={50}
                      step={1}
                      value={[filters.ageMin, filters.ageMax]}
                      onValueChange={([min, max]) => {
                        setFilters({ ...filters, ageMin: min, ageMax: max });
                        setCurrentPage(1);
                      }}
                      className="mb-2"
                    />
                  </div>

                  {/* Languages */}
                  <div>
                    <label className="block text-white text-sm font-semibold mb-3">Languages</label>
                    <div className="flex flex-wrap gap-2">
                      {languageOptions.map((lang) => (
                        <Button
                          key={lang}
                          variant={filters.languages.includes(lang) ? "default" : "outline"}
                          size="sm"
                          onClick={() => {
                            const newLanguages = filters.languages.includes(lang)
                              ? filters.languages.filter(l => l !== lang)
                              : [...filters.languages, lang];
                            setFilters({ ...filters, languages: newLanguages });
                            setCurrentPage(1);
                          }}
                          className={filters.languages.includes(lang) 
                            ? "bg-yellow-500 text-black hover:bg-yellow-600" 
                            : "text-white border-white/30"}
                        >
                          {lang}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Quick Toggles */}
                  <div className="flex flex-wrap gap-4 pt-4 border-t border-white/10">
                    <label className="flex items-center gap-2 cursor-pointer text-white hover:text-yellow-500">
                      <Checkbox
                        checked={filters.premium}
                        onCheckedChange={(checked) => {
                          setFilters({ ...filters, premium: checked as boolean });
                          setCurrentPage(1);
                        }}
                      />
                      <Crown size={16} className="text-yellow-500" />
                      <span className="text-sm">Premium Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-white hover:text-yellow-500">
                      <Checkbox
                        checked={filters.verified}
                        onCheckedChange={(checked) => {
                          setFilters({ ...filters, verified: checked as boolean });
                          setCurrentPage(1);
                        }}
                      />
                      <Shield size={16} className="text-blue-500" />
                      <span className="text-sm">Verified Only</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer text-white hover:text-yellow-500">
                      <Checkbox
                        checked={filters.available}
                        onCheckedChange={(checked) => {
                          setFilters({ ...filters, available: checked as boolean });
                          setCurrentPage(1);
                        }}
                      />
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Available Now</span>
                    </label>
                  </div>

                  {/* Reset Button */}
                  <div className="flex justify-end pt-4 border-t border-white/10">
                    <Button
                      variant="outline"
                      onClick={resetFilters}
                      className="text-white border-white/30"
                    >
                      <X size={18} className="mr-2" />
                      Reset All Filters
                    </Button>
                  </div>
                </div>
              </Card>
            )}

            {/* Escort Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
              {paginatedEscorts.map((escort) => (
                <Card 
                  key={escort.id} 
                  className="group overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-yellow-500/20 hover:-translate-y-1 cursor-pointer"
                  onClick={() => setSelectedEscort(escort.id)}
                >
                  <div className="relative">
                    <img
                      src={escort.image}
                      alt={escort.name}
                      className="w-full h-64 md:h-80 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Status Badges */}
                    <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
                      <div className="flex flex-col gap-2">
                        {escort.verified && (
                          <Badge className="bg-blue-500 border-0 shadow-lg text-xs">
                            <Shield size={10} className="mr-1" />
                            Verified
                          </Badge>
                        )}
                        {escort.premium && (
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 shadow-lg font-bold text-xs">
                            <Crown size={10} className="mr-1" />
                            Premium
                          </Badge>
                        )}
                      </div>
                      {escort.available ? (
                        <Badge className="bg-green-500 border-0 shadow-lg animate-pulse text-xs">
                          <div className="w-2 h-2 bg-white rounded-full mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge className="bg-red-500/80 border-0 shadow-lg text-xs">
                          Busy
                        </Badge>
                      )}
                    </div>

                    {/* Gradient Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black via-black/50 to-transparent p-3 md:p-4">
                      <h3 className="text-white text-lg md:text-2xl font-bold mb-1">{escort.name}, {escort.age}</h3>
                      <div className="flex items-center gap-2 text-white/90 text-xs md:text-sm mb-2">
                        <MapPin size={12} />
                        <span className="truncate">{escort.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star size={12} className="text-yellow-500 fill-yellow-500" />
                        <span className="text-white text-xs md:text-sm font-medium">{escort.rating.toFixed(1)}</span>
                        <span className="text-white/60 text-xs">({escort.reviews})</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 md:p-4 space-y-3">
                    <p className="text-gray-300 text-xs md:text-sm line-clamp-2">{escort.description}</p>
                    
                    <div className="flex flex-wrap gap-1">
                      {escort.languages.slice(0, 3).map((lang, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-white/20 text-gray-300">
                          {lang}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-white/10">
                      <div>
                        <div className="text-xs text-gray-400">From</div>
                        <div className="text-lg md:text-xl font-black text-yellow-500">CHF {escort.rate}</div>
                        <div className="text-xs text-gray-400">per hour</div>
                      </div>
                      <Button 
                        size="sm"
                        className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-xs md:text-sm"
                      >
                        <MessageCircle size={14} className="mr-1 md:mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="text-white border-white/30 disabled:opacity-50"
                >
                  <ChevronLeft size={20} />
                </Button>

                <div className="flex gap-2 flex-wrap justify-center">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="icon"
                        onClick={() => setCurrentPage(pageNum)}
                        className={currentPage === pageNum 
                          ? "bg-yellow-500 text-black hover:bg-yellow-600" 
                          : "text-white border-white/30"}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                </div>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="text-white border-white/30 disabled:opacity-50"
                >
                  <ChevronRight size={20} />
                </Button>

                <span className="text-white text-sm">
                  Page {currentPage} of {totalPages}
                </span>
              </div>
            )}

            {/* No Results */}
            {filteredEscorts.length === 0 && (
              <Card className="p-8 md:p-12 text-center bg-white/5 backdrop-blur-sm border-white/10">
                <Search size={64} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-xl md:text-2xl font-bold text-white mb-2">No escorts found</h3>
                <p className="text-sm md:text-base text-gray-400 mb-6">Try adjusting your filters to see more results</p>
                <Button onClick={resetFilters} className="bg-yellow-500 text-black hover:bg-yellow-600">
                  Reset Filters
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-12 md:py-20 bg-gradient-to-b from-transparent to-black/40">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
              Premium Services
            </h2>
            <p className="text-base md:text-xl text-gray-300">
              Exclusive experiences tailored to your desires
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 max-w-6xl mx-auto">
            {[
              { 
                icon: Heart, 
                title: "GFE / PSE", 
                description: "Girlfriend or Pornstar Experience with passionate companionship",
                color: "from-pink-500 to-rose-500"
              },
              { 
                icon: Calendar, 
                title: "Dinner & Events", 
                description: "Sophisticated companion for business dinners and social events",
                color: "from-purple-500 to-indigo-500"
              },
              { 
                icon: Clock, 
                title: "Overnight & Travel", 
                description: "Extended bookings for overnight stays and travel companionship",
                color: "from-yellow-500 to-orange-500"
              }
            ].map((service, idx) => (
              <Card key={idx} className="p-6 md:p-8 text-center bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all group">
                <div className="relative mb-6">
                  <div className={`w-16 h-16 md:w-20 md:h-20 mx-auto rounded-full bg-gradient-to-br ${service.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <service.icon className="text-white" size={32} />
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} blur-2xl opacity-20 group-hover:opacity-40 transition-opacity`} />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3">{service.title}</h3>
                <p className="text-sm md:text-base text-gray-300">{service.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 md:py-20 bg-gradient-to-br from-purple-900/50 via-pink-900/50 to-orange-900/50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-white mb-4">
                Book Your Experience
              </h2>
              <p className="text-base md:text-xl text-gray-300">
                Discreet, professional, unforgettable
              </p>
            </div>

            <Card className="p-6 md:p-8 bg-white/10 backdrop-blur-md border-white/20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Your Name *</label>
                  <Input placeholder="John Doe" className="bg-white/10 border-white/20 text-white" />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Phone *</label>
                  <Input type="tel" placeholder="+41 XX XXX XX XX" className="bg-white/10 border-white/20 text-white" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Preferred Date</label>
                  <Input type="date" className="bg-white/10 border-white/20 text-white" />
                </div>
                <div>
                  <label className="block text-white text-sm font-semibold mb-2">Duration</label>
                  <Select>
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">1 hour</SelectItem>
                      <SelectItem value="2">2 hours</SelectItem>
                      <SelectItem value="3">3 hours</SelectItem>
                      <SelectItem value="dinner">Dinner (4+ hours)</SelectItem>
                      <SelectItem value="overnight">Overnight</SelectItem>
                      <SelectItem value="weekend">Weekend</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-white text-sm font-semibold mb-2">Special Requests</label>
                <Textarea 
                  rows={4} 
                  placeholder="Tell us about your preferences..."
                  className="bg-white/10 border-white/20 text-white resize-none"
                />
              </div>

              <Button 
                size="lg" 
                className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-base md:text-lg h-14"
              >
                <MessageCircle size={20} className="mr-2" />
                Send Booking Request
              </Button>

              <p className="text-center text-sm text-gray-400 mt-4">
                <Lock size={14} className="inline mr-1" />
                All communications are encrypted and confidential
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="text-pink-600 fill-pink-600" size={24} />
                <span className="text-lg md:text-xl font-bold text-white">iWantSexNow.ch</span>
              </div>
              <p className="text-gray-400 text-sm">
                Zürich's premier escort service platform
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="#escorts" className="hover:text-white">Browse Escorts</Link></li>
                <li><Link href="#services" className="hover:text-white">Services</Link></li>
                <li><Link href="#contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Information</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety & Privacy</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-xs md:text-sm">© 2025 iWantSexNow.ch Zürich. All rights reserved. | 18+ Only | Licensed & Legal</p>
          </div>
        </div>
      </footer>

      {/* Add custom animations */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.9);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 8s ease-in-out infinite;
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.6s ease-out;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out;
        }
        .animate-fade-in {
          animation: fade-in 0.8s ease-out;
        }
        .animate-scale-in {
          animation: scale-in 0.5s ease-out;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out;
        }
        .animation-delay-200 {
          animation-delay: 200ms;
        }
        .animation-delay-400 {
          animation-delay: 400ms;
        }
        .animation-delay-600 {
          animation-delay: 600ms;
        }
      `}</style>
    </div>
  );
}