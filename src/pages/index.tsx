import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Heart, CheckCircle, Eye, Phone } from "lucide-react";
import Link from "next/link";

// Components
import { HeroSection } from "@/components/home/HeroSection";
import { EscortGrid } from "@/components/home/EscortGrid";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { CityLinks } from "@/components/home/CityLinks";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";

export default function Home() {
  // Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState("all");
  const [verifiedPhotos, setVerifiedPhotos] = useState(false);
  const [videoAds, setVideoAds] = useState(false);
  
  // App State
  const [scrolled, setScrolled] = useState(false);
  const [onlineCount, setOnlineCount] = useState(127);
  const [activeViewers, setActiveViewers] = useState(342);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  // City pages data
  const cityPages = [
    {
      name: "Zürich",
      slug: "zurich",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop",
      escorts: 6,
      description: "Switzerland's financial capital",
      featured: true
    },
    {
      name: "Geneva",
      slug: "geneva",
      image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&h=600&fit=crop",
      escorts: 6,
      description: "International city of diplomacy",
      featured: true
    },
    {
      name: "Basel",
      slug: "basel",
      image: "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&h=600&fit=crop",
      escorts: 4,
      description: "Cultural capital on the Rhine",
      featured: true
    },
    {
      name: "Bern",
      slug: "bern",
      image: "https://images.unsplash.com/photo-1559564484-e48d68d8ffad?w=800&h=600&fit=crop",
      escorts: 4,
      description: "UNESCO heritage capital",
      featured: true
    },
    {
      name: "Lausanne",
      slug: "lausanne",
      image: "https://images.unsplash.com/photo-1583212692277-a2b6b5c8c2e1?w=800&h=600&fit=crop",
      escorts: 5,
      description: "Olympic city on Lake Geneva",
      featured: true
    }
  ];

  // Recent Bookings Ticker
  const [recentBookings] = useState([
    { name: "Michael from Zürich", time: "2 min ago", service: "GFE" },
    { name: "David from Geneva", time: "5 min ago", service: "Dinner Date" },
    { name: "Thomas from Basel", time: "8 min ago", service: "Overnight" }
  ]);

  // Story Profiles
  const storyProfiles = [
    { id: 1, name: "Vanessa", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 2, name: "Yasmin", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 3, name: "Damiana", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", verified: false, online: true },
    { id: 4, name: "Lara", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop", verified: true, online: false },
    { id: 5, name: "Katja", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 6, name: "Mely", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop", verified: false, online: true },
    { id: 7, name: "Ts Aschley", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 8, name: "Anthonella", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=150&h=150&fit=crop", verified: true, online: false },
    { id: 9, name: "Valery", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=150&h=150&fit=crop", verified: false, online: true },
  ];

  // Escort Data
  const allEscorts = [
    {
      id: 1,
      name: "Sophia",
      age: 26,
      location: "Zürich City Center",
      locations: ["Zürich", "Winterthur", "Zug"],
      images: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop",
      ],
      thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      topAd: true,
      available: true,
      rating: 5.0,
      reviews: 127,
      rate: 500,
      services: ["GFE", "Dinner Dates", "Events"],
      serviceType: "sie-sucht-ihn",
      languages: ["German", "English", "French"],
      bodyType: "Athletic",
      height: "168 cm",
      bio: "Sophisticated companion offering genuine connection.",
      longDescription: "Im Club Seegirls erlebst du Verführung und Sinnlichkeit in Perfektion.",
      availability: "Available today 6PM-11PM",
      postedTime: "vor 1 Minute",
      hasVideo: false,
      verifiedPhotos: true
    },
    {
      id: 2,
      name: "Isabella",
      age: 24,
      location: "Geneva",
      locations: ["Geneva", "Lausanne", "Montreux"],
      images: [
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop",
      ],
      thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      topAd: false,
      available: true,
      rating: 4.9,
      reviews: 203,
      rate: 600,
      services: ["PSE", "Travel", "Overnight"],
      serviceType: "escort-service",
      languages: ["Italian", "English", "French"],
      bodyType: "Slim",
      height: "165 cm",
      bio: "Adventurous spirit seeking exciting connections.",
      longDescription: "Professional escort offering premium companionship.",
      availability: "Available now",
      postedTime: "vor 15 Minuten",
      hasVideo: true,
      verifiedPhotos: true
    },
    {
      id: 3,
      name: "Emma",
      age: 28,
      location: "Basel",
      locations: ["Basel", "Liestal"],
      images: [
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop",
      ],
      thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      verified: true,
      premium: false,
      topAd: false,
      available: false,
      rating: 4.8,
      reviews: 156,
      rate: 400,
      services: ["GFE", "Massage"],
      serviceType: "erotik-massage",
      languages: ["German", "English"],
      bodyType: "Average",
      height: "170 cm",
      bio: "Caring and attentive companion.",
      longDescription: "Tantra and erotic massage specialist.",
      availability: "Available tomorrow",
      postedTime: "vor 2 Stunden",
      hasVideo: false,
      verifiedPhotos: false
    },
    {
      id: 4,
      name: "Mia",
      age: 25,
      location: "Bern",
      locations: ["Bern", "Thun", "Biel"],
      images: [
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop",
      ],
      thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      topAd: true,
      available: true,
      rating: 5.0,
      reviews: 189,
      rate: 700,
      services: ["PSE", "Events", "Travel"],
      serviceType: "sie-sucht-ihn",
      languages: ["German", "French", "English"],
      bodyType: "Athletic",
      height: "172 cm",
      bio: "Elite companion for discerning gentlemen.",
      longDescription: "Neu in der Stadt! Premium VIP escort service.",
      availability: "Available today 2PM-10PM",
      postedTime: "vor 30 Minuten",
      hasVideo: true,
      verifiedPhotos: true
    }
  ];

  // Filtering Logic
  const filteredEscorts = allEscorts.filter(escort => {
    if (searchQuery && !escort.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !escort.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCity !== "all" && !escort.locations.some(loc => loc.toLowerCase().includes(selectedCity.toLowerCase()))) return false;
    if (selectedService !== "all" && !escort.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()))) return false;
    if (selectedOffer !== "all" && escort.serviceType !== selectedOffer) return false;
    if (verifiedPhotos && !escort.verifiedPhotos) return false;
    if (videoAds && !escort.hasVideo) return false;
    return true;
  });

  // Pagination calculations
  const totalPages = Math.ceil(filteredEscorts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedEscorts = filteredEscorts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById('escorts')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setCurrentPage(prev => prev + 1);
      setIsLoadingMore(false);
    }, 1000);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCity("all");
    setSelectedService("all");
    setSelectedOffer("all");
    setVerifiedPhotos(false);
    setVideoAds(false);
    setCurrentPage(1);
  };

  // Reset to page 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, selectedService, selectedOffer, verifiedPhotos, videoAds]);

  // Effects
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(100, prev + Math.floor(Math.random() * 3) - 1));
      setActiveViewers(prev => Math.max(300, prev + Math.floor(Math.random() * 5) - 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <SEO 
        title="iWantSexNow.ch - Premium Escort Services in Switzerland"
        description="Discover exclusive escort services across Switzerland. Browse verified profiles in Zürich, Geneva, Basel and more."
      />

      {/* Header */}
      <header className={`border-b border-white/10 backdrop-blur-md sticky top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 shadow-2xl' : 'bg-black/40'
      }`}>
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
                <div className="text-xs text-pink-500 font-semibold tracking-wider">SWITZERLAND'S #1</div>
              </div>
            </Link>
            
            {/* Live Stats */}
            <div className="hidden md:flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2 text-white">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold">{onlineCount} online now</span>
              </div>
              <div className="flex items-center gap-2 text-white">
                <Eye size={16} className="text-yellow-500" />
                <span className="font-semibold">{activeViewers} viewing</span>
              </div>
            </div>
            
            <nav className="hidden md:flex items-center gap-4">
              <Button variant="ghost" className="text-white hover:text-yellow-500" onClick={() => {
                document.getElementById('services')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Services
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-500" onClick={() => {
                document.getElementById('cities')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Locations
              </Button>
              <Button variant="ghost" className="text-white hover:text-yellow-500" onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                Contact
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

        {/* Live Booking Ticker */}
        <div className="border-t border-white/10 bg-black/60 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center gap-2 text-xs text-white/80 overflow-hidden">
              <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
              <div className="animate-marquee whitespace-nowrap">
                {recentBookings.map((booking, idx) => (
                  <span key={idx} className="inline-block mx-8">
                    <strong className="text-white">{booking.name}</strong> booked {booking.service} {booking.time}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      <HeroSection 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCity={selectedCity}
        setSelectedCity={setSelectedCity}
        selectedService={selectedService}
        setSelectedService={setSelectedService}
        selectedOffer={selectedOffer}
        setSelectedOffer={setSelectedOffer}
        verifiedPhotos={verifiedPhotos}
        setVerifiedPhotos={setVerifiedPhotos}
        videoAds={videoAds}
        setVideoAds={setVideoAds}
        filteredCount={filteredEscorts.length}
      />

      {/* Story Row */}
      <section className="py-6 bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {storyProfiles.map((profile) => (
              <div key={profile.id} className="flex-shrink-0 cursor-pointer group">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full p-0.5 transition-all duration-300 hover:scale-110 ring-2 ring-transparent group-hover:ring-pink-500 group-hover:ring-offset-2 ring-offset-black ${
                    profile.online 
                      ? 'bg-gradient-to-tr from-pink-600 via-purple-600 to-yellow-500' 
                      : 'bg-gray-600'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-black">
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </div>
                  {profile.verified && (
                    <div className="absolute bottom-0 right-0 bg-green-500 rounded-full p-0.5">
                      <CheckCircle size={14} className="text-white" fill="white" />
                    </div>
                  )}
                </div>
                <p className="text-white text-xs text-center mt-2 font-medium truncate w-20 group-hover:text-pink-500 transition-colors">
                  {profile.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <EscortGrid 
        escorts={paginatedEscorts}
        isLoadingMore={isLoadingMore}
        hasMore={currentPage < totalPages}
        handleLoadMore={handleLoadMore}
        openLightbox={() => {}} // Placeholder for now
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        resetFilters={resetFilters}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Featured Cities Section */}
      <section className="py-20 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-orange-900/50 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Explore Escorts by City
              </h2>
              <p className="text-xl text-gray-300">
                Premium companions in Switzerland's major cities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityPages.map((city) => (
                <Link key={city.slug} href={`/escort-${city.slug}`}>
                  <Card className="group overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-pink-500 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-pink-500/20">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-3xl font-black text-white mb-2">
                          {city.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3">
                          {city.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-pink-600 border-0">
                            {city.escorts}+ Escorts
                          </Badge>
                          <span className="text-yellow-500 font-bold group-hover:translate-x-2 transition-transform">
                            View All →
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
      
      <ServiceCategories />
      
      <CityLinks />
      
      <AboutSection />
      
      <ContactSection />

      {/* Footer */}
      <footer className="bg-black border-t border-white/10 py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Heart className="text-pink-600 fill-pink-600" size={24} />
                <span className="text-xl font-bold text-white">iWantSexNow.ch</span>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                Switzerland's premier adult dating platform
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/members" className="hover:text-white">Browse Members</Link></li>
                <li><Link href="/register" className="hover:text-white">Sign Up</Link></li>
                <li><Link href="/login" className="hover:text-white">Login</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/imprint" className="hover:text-white">Imprint</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/help" className="hover:text-white">Help Center</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                <li><Link href="/safety" className="hover:text-white">Safety Tips</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} iWantSexNow.ch. All rights reserved. 18+</p>
          </div>
        </div>
      </footer>
    </div>
  );
}