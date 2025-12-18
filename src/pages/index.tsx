import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MobileNav } from "@/components/MobileNav";
import { Heart, Shield, Lock, Clock, Star, MapPin, MessageCircle, Eye, Phone, Search, CheckCircle, Award, Sparkles, DollarSign, Calendar, Gift, X, ChevronLeft, ChevronRight, Filter, TrendingUp, Users, Zap, AlertCircle, Check, Send, ExternalLink, Share2, Bookmark, Play } from "lucide-react";
import Link from "next/link";

export default function Home() {
  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState("all");
  const [priceRange, setPriceRange] = useState("all");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [verifiedPhotos, setVerifiedPhotos] = useState(false);
  const [videoAds, setVideoAds] = useState(false);
  
  // Pagination State
  const [displayCount, setDisplayCount] = useState(12);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  
  // Lightbox State
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedEscort, setSelectedEscort] = useState<any>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  // UI State
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortBy, setSortBy] = useState("featured");
  
  // Interaction State
  const [favorites, setFavorites] = useState<number[]>([]);
  const [recentlyViewed, setRecentlyViewed] = useState<number[]>([]);
  const [viewCounts, setViewCounts] = useState<{[key: number]: number}>({});
  
  // Form State
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
    date: "",
    duration: ""
  });
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [formSuccess, setFormSuccess] = useState(false);
  
  // Newsletter State
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterError, setNewsletterError] = useState("");
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  
  // Scroll State
  const [scrolled, setScrolled] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Animation State
  const [visibleSections, setVisibleSections] = useState<{[key: string]: boolean}>({});
  
  // Live Stats
  const [onlineCount, setOnlineCount] = useState(127);
  const [activeViewers, setActiveViewers] = useState(342);
  
  // Trust Signals
  const [recentBookings, setRecentBookings] = useState([
    { name: "Michael from Zürich", time: "2 min ago", service: "GFE" },
    { name: "David from Geneva", time: "5 min ago", service: "Dinner Date" },
    { name: "Thomas from Basel", time: "8 min ago", service: "Overnight" }
  ]);

  // Story-style profiles (xdate.ch style circular row)
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

  // Featured premium escorts with full data
  const allEscorts = [
    {
      id: 1,
      name: "Sophia",
      age: 26,
      location: "Zürich City Center",
      locations: ["Zürich", "Winterthur", "Zug"],
      images: [
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop"
      ],
      thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      topAd: true,
      available: true,
      rating: 5.0,
      reviews: 127,
      reviewTexts: [
        { author: "Marc", rating: 5, text: "Amazing experience, very professional and charming." },
        { author: "Peter", rating: 5, text: "Exceeded all expectations. Highly recommended!" },
        { author: "Stefan", rating: 5, text: "Perfect companion for my business dinner." }
      ],
      rate: 500,
      services: ["GFE", "Dinner Dates", "Events"],
      serviceType: "sie-sucht-ihn",
      languages: ["German", "English", "French"],
      bodyType: "Athletic",
      height: "168 cm",
      bio: "Sophisticated companion offering genuine connection and unforgettable experiences. I love fine dining, cultural events, and engaging conversations. Available for dinner dates, overnight stays, and travel companionship.",
      longDescription: "Im Club Seegirls erlebst du Verführung und Sinnlichkeit in Perfektion. Unsere charmanten Damen und geschmackvoll eingerichteten Räumlichkeiten schaffen den idealen Rahmen für unvergessliche Momente. Lass dich von unseren Damen in eine Welt entführen, in der Träume wirklichkeit werden.",
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
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop",
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop"
      ],
      thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      topAd: false,
      available: true,
      rating: 4.9,
      reviews: 203,
      reviewTexts: [
        { author: "Jean", rating: 5, text: "Absolutely stunning and intelligent. Perfect evening!" },
        { author: "Laurent", rating: 5, text: "Worth every franc. Will definitely book again." }
      ],
      rate: 600,
      services: ["PSE", "Travel", "Overnight"],
      serviceType: "escort-service",
      languages: ["Italian", "English", "French"],
      bodyType: "Slim",
      height: "165 cm",
      bio: "Adventurous spirit seeking exciting connections. Fluent in multiple languages, perfect travel companion.",
      longDescription: "Professional escort offering premium companionship for discerning gentlemen. Experienced in social events, business dinners, and private encounters. Discreet, elegant, and always professional.",
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
        "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800&h=1200&fit=crop"
      ],
      thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      verified: true,
      premium: false,
      topAd: false,
      available: false,
      rating: 4.8,
      reviews: 156,
      reviewTexts: [
        { author: "Andreas", rating: 5, text: "Very relaxing massage experience." }
      ],
      rate: 400,
      services: ["GFE", "Massage"],
      serviceType: "erotik-massage",
      languages: ["German", "English"],
      bodyType: "Average",
      height: "170 cm",
      bio: "Caring and attentive companion specializing in relaxation and genuine connection.",
      longDescription: "Tantra and erotic massage specialist. Create unforgettable moments of relaxation and sensuality in my private studio.",
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
        "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800&h=1200&fit=crop"
      ],
      thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      topAd: true,
      available: true,
      rating: 5.0,
      reviews: 189,
      reviewTexts: [
        { author: "Markus", rating: 5, text: "Best escort experience in Switzerland!" },
        { author: "Daniel", rating: 5, text: "Professional, beautiful, and fun. Perfect!" }
      ],
      rate: 700,
      services: ["PSE", "Events", "Travel"],
      serviceType: "sie-sucht-ihn",
      languages: ["German", "French", "English"],
      bodyType: "Athletic",
      height: "172 cm",
      bio: "Elite companion for discerning gentlemen. Fitness enthusiast and world traveler.",
      longDescription: "Neu in der Stadt! Premium VIP escort service mit höchster Diskretion. Begleitung für Geschäftsessen, Events und private Treffen. Exklusiv für anspruchsvolle Herren.",
      availability: "Available today 2PM-10PM",
      postedTime: "vor 30 Minuten",
      hasVideo: true,
      verifiedPhotos: true
    }
  ];

  // Filter escorts
  const filteredEscorts = allEscorts.filter(escort => {
    if (searchQuery && !escort.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !escort.location.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (selectedCity !== "all" && !escort.locations.some(loc => loc.toLowerCase().includes(selectedCity.toLowerCase()))) return false;
    if (selectedService !== "all" && !escort.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()))) return false;
    if (selectedOffer !== "all" && escort.serviceType !== selectedOffer) return false;
    if (onlineOnly && !escort.available) return false;
    if (verifiedOnly && !escort.verified) return false;
    if (verifiedPhotos && !escort.verifiedPhotos) return false;
    if (videoAds && !escort.hasVideo) return false;
    if (priceRange !== "all") {
      const [min, max] = priceRange.split("-").map(Number);
      if (escort.rate < min || escort.rate > max) return false;
    }
    return true;
  });

  // Sort escorts
  const sortedEscorts = [...filteredEscorts].sort((a, b) => {
    // Always show TOP AD first
    if (a.topAd && !b.topAd) return -1;
    if (!a.topAd && b.topAd) return 1;
    
    switch(sortBy) {
      case "price-low": return a.rate - b.rate;
      case "price-high": return b.rate - a.rate;
      case "rating": return b.rating - a.rating;
      case "reviews": return b.reviews - a.reviews;
      case "newest": return a.postedTime.localeCompare(b.postedTime);
      default: return b.premium ? 1 : -1; // Featured
    }
  });

  // Paginated escorts for display
  const displayedEscorts = sortedEscorts.slice(0, displayCount);
  const hasMore = displayCount < sortedEscorts.length;

  // Load More function
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setDisplayCount(prev => prev + 12);
      setIsLoadingMore(false);
    }, 1000);
  };

  // Form Validation
  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[\+]?[(]?[0-9]{2,4}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/.test(phone);
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: {[key: string]: string} = {};

    if (!contactForm.name.trim()) errors.name = "Name is required";
    if (!contactForm.email.trim()) errors.email = "Email is required";
    else if (!validateEmail(contactForm.email)) errors.email = "Invalid email format";
    if (contactForm.phone && !validatePhone(contactForm.phone)) errors.phone = "Invalid phone format";
    if (!contactForm.message.trim()) errors.message = "Message is required";

    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      setFormSubmitting(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      setFormSubmitting(false);
      setFormSuccess(true);
      setContactForm({ name: "", email: "", phone: "", message: "", date: "", duration: "" });
      setTimeout(() => setFormSuccess(false), 5000);
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewsletterError("");
    
    if (!newsletterEmail.trim()) {
      setNewsletterError("Email is required");
      return;
    }
    if (!validateEmail(newsletterEmail)) {
      setNewsletterError("Invalid email format");
      return;
    }

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setNewsletterSuccess(true);
    setNewsletterEmail("");
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  // Lightbox Functions
  const openLightbox = (escort: any, imageIndex: number = 0) => {
    setSelectedEscort(escort);
    setCurrentImageIndex(imageIndex);
    setLightboxOpen(true);
    document.body.style.overflow = 'hidden';
    
    // Track view
    if (!recentlyViewed.includes(escort.id)) {
      setRecentlyViewed(prev => [escort.id, ...prev.slice(0, 4)]);
    }
    setViewCounts(prev => ({...prev, [escort.id]: (prev[escort.id] || 0) + 1}));
  };

  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedEscort(null);
    setCurrentImageIndex(0);
    document.body.style.overflow = 'unset';
  };

  const nextImage = () => {
    if (selectedEscort && currentImageIndex < selectedEscort.images.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  // Favorites
  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  // Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 100);
      setShowScrollTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({...prev, [entry.target.id]: true}));
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Live stats animation
  useEffect(() => {
    const interval = setInterval(() => {
      setOnlineCount(prev => Math.max(100, prev + Math.floor(Math.random() * 3) - 1));
      setActiveViewers(prev => Math.max(300, prev + Math.floor(Math.random() * 5) - 2));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxOpen, currentImageIndex]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
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
            
            {/* Live Stats in Header */}
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
              <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold">
                <Phone size={18} className="mr-2" />
                Inserat aufgeben
              </Button>
            </nav>

            <MobileNav />
          </div>
        </div>

        {/* Live Booking Notifications */}
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

      {/* Story-Style Circular Profile Row (xdate.ch style) */}
      <section className="py-6 bg-black/20 border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {storyProfiles.map((profile) => (
              <div
                key={profile.id}
                className="flex-shrink-0 cursor-pointer group"
                onClick={() => {
                  const escort = allEscorts.find(e => e.id === profile.id);
                  if (escort) openLightbox(escort, 0);
                }}
              >
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full p-0.5 ${
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
                <p className="text-white text-xs text-center mt-2 font-medium truncate w-20">
                  {profile.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

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
            {/* Animated Headline */}
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400">
                  Sex und Erotik
                </span>
                <br />
                <span className="text-white drop-shadow-2xl">Inserate in der Schweiz</span>
              </h1>
            </div>

            {/* xdate.ch Style Advanced Filters */}
            <Card className="p-4 shadow-2xl bg-white/10 backdrop-blur-md border-white/20">
              <div className="grid md:grid-cols-4 gap-3 mb-3">
                {/* Region/City Dropdown */}
                <Select value={selectedCity} onValueChange={setSelectedCity}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Regionen</SelectItem>
                    <SelectItem value="zürich">Zürich</SelectItem>
                    <SelectItem value="geneva">Genf/Genève</SelectItem>
                    <SelectItem value="basel">Basel</SelectItem>
                    <SelectItem value="bern">Bern</SelectItem>
                    <SelectItem value="lausanne">Lausanne</SelectItem>
                    <SelectItem value="winterthur">Winterthur</SelectItem>
                    <SelectItem value="luzern">Luzern</SelectItem>
                    <SelectItem value="st-gallen">St. Gallen</SelectItem>
                  </SelectContent>
                </Select>

                {/* Rubrik/Category Dropdown */}
                <Select value={selectedService} onValueChange={setSelectedService}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white">
                    <SelectValue placeholder="Rubrik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Kategorien</SelectItem>
                    <SelectItem value="gfe">GFE</SelectItem>
                    <SelectItem value="pse">PSE</SelectItem>
                    <SelectItem value="massage">Massage</SelectItem>
                    <SelectItem value="dinner">Dinner Dates</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="events">Events</SelectItem>
                  </SelectContent>
                </Select>

                {/* Angebot/Offer Type Dropdown */}
                <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                  <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white">
                    <SelectValue placeholder="Angebot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Alle Angebote</SelectItem>
                    <SelectItem value="sie-sucht-ihn">Sie sucht ihn</SelectItem>
                    <SelectItem value="er-sucht-sie">Er sucht sie</SelectItem>
                    <SelectItem value="escort-service">Escort Service</SelectItem>
                    <SelectItem value="erotik-massage">Erotik Massage</SelectItem>
                    <SelectItem value="trans">Trans</SelectItem>
                    <SelectItem value="gay">Gay</SelectItem>
                  </SelectContent>
                </Select>

                {/* Search Box */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                  <Input
                    placeholder="Suchen..."
                    className="pl-10 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-400"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery("")} 
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>
              </div>

              {/* xdate.ch style Checkboxes */}
              <div className="flex items-center gap-6 text-white">
                <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={verifiedPhotos}
                    onChange={(e) => setVerifiedPhotos(e.target.checked)}
                    className="w-4 h-4 rounded accent-pink-600"
                  />
                  <span className="text-sm font-medium">Verifizierte Bilder</span>
                </label>
                
                <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition-colors">
                  <input
                    type="checkbox"
                    checked={videoAds}
                    onChange={(e) => setVideoAds(e.target.checked)}
                    className="w-4 h-4 rounded accent-pink-600"
                  />
                  <span className="text-sm font-medium">Video Inserate</span>
                </label>

                {/* Results Counter (xdate.ch style) */}
                <div className="ml-auto">
                  <span className="text-yellow-500 font-bold text-lg">
                    {filteredEscorts.length} Treffer
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Escorts Section with xdate.ch Features */}
      <section id="escorts" className="py-20 bg-black/40 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-7xl mx-auto">
            {/* Escorts Grid with TOP AD and Premium badges */}
            <div className="space-y-6 mb-8">
              {displayedEscorts.map((escort) => (
                <Card 
                  key={escort.id} 
                  className={`overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-yellow-500/50 transition-all duration-300 hover:shadow-2xl cursor-pointer ${
                    escort.topAd ? 'border-2 border-yellow-500 shadow-2xl shadow-yellow-500/20' : ''
                  }`}
                  onClick={() => openLightbox(escort, 0)}
                >
                  <div className="flex flex-col md:flex-row gap-6 p-6">
                    {/* Image Section */}
                    <div className="relative w-full md:w-80 flex-shrink-0">
                      <img
                        src={escort.thumbnail}
                        alt={escort.name}
                        className="w-full h-80 object-cover rounded-lg"
                      />
                      
                      {/* TOP AD Badge (xdate.ch style) */}
                      {escort.topAd && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 font-black text-base px-4 py-2 shadow-2xl">
                            TOP AD
                          </Badge>
                        </div>
                      )}

                      {/* Premium Badge */}
                      {escort.premium && !escort.topAd && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 font-bold text-sm px-3 py-1.5 shadow-xl">
                            PREMIUM
                          </Badge>
                        </div>
                      )}

                      {/* Time Posted (xdate.ch style) */}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-black/70 text-white border-0 text-xs px-2 py-1">
                          {escort.postedTime}
                        </Badge>
                      </div>

                      {/* Badges Row */}
                      <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
                        {escort.verified && (
                          <Badge className="bg-blue-500 border-0 text-xs">
                            <Shield size={10} className="mr-1" />
                            Verified
                          </Badge>
                        )}
                        {escort.verifiedPhotos && (
                          <Badge className="bg-green-500 border-0 text-xs">
                            <CheckCircle size={10} className="mr-1" />
                            Verified Photos
                          </Badge>
                        )}
                        {escort.hasVideo && (
                          <Badge className="bg-purple-500 border-0 text-xs">
                            <Play size={10} className="mr-1" />
                            Video
                          </Badge>
                        )}
                        {escort.available && (
                          <Badge className="bg-green-500 border-0 text-xs animate-pulse">
                            <div className="w-2 h-2 bg-white rounded-full mr-1" />
                            Verfügbar
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1 space-y-4">
                      {/* Title with Icons */}
                      <div>
                        <div className="flex items-start gap-3 mb-2">
                          <h3 className="text-3xl font-black text-white">
                            {escort.name}, {escort.age}
                          </h3>
                          {escort.serviceType === "sie-sucht-ihn" && (
                            <Badge className="bg-pink-600 border-0 text-xs flex items-center gap-1">
                              <Heart size={10} fill="white" />
                              Sie sucht ihn
                            </Badge>
                          )}
                          {escort.serviceType === "escort-service" && (
                            <Badge className="bg-purple-600 border-0 text-xs">
                              Escort Service
                            </Badge>
                          )}
                        </div>
                        
                        {/* Location Tags (xdate.ch style multiple cities) */}
                        <div className="flex items-center gap-2 text-blue-400 text-sm mb-3">
                          <MapPin size={14} />
                          <span className="font-medium">
                            {escort.locations.join(", ")}
                          </span>
                        </div>
                      </div>

                      {/* Long Description (xdate.ch style) */}
                      <p className="text-gray-300 text-base leading-relaxed line-clamp-3">
                        {escort.longDescription}
                      </p>

                      {/* Services Tags */}
                      <div className="flex flex-wrap gap-2">
                        {escort.services.map((service, idx) => (
                          <Badge key={idx} variant="outline" className="border-white/20 text-gray-300 text-xs">
                            {service}
                          </Badge>
                        ))}
                      </div>

                      {/* Languages */}
                      <div className="flex flex-wrap gap-2">
                        {escort.languages.map((lang, idx) => (
                          <span key={idx} className="text-xs text-gray-400">
                            {lang}{idx < escort.languages.length - 1 && ", "}
                          </span>
                        ))}
                      </div>

                      {/* Rating */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={18} 
                              className={i < Math.floor(escort.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}
                            />
                          ))}
                        </div>
                        <span className="text-white text-sm font-medium">{escort.rating.toFixed(1)}</span>
                        <span className="text-white/60 text-xs">({escort.reviews} Bewertungen)</span>
                      </div>

                      {/* Price and CTA */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/10">
                        <div>
                          <div className="text-xs text-gray-400">Ab</div>
                          <div className="text-2xl font-black text-yellow-500">CHF {escort.rate}</div>
                          <div className="text-xs text-gray-400">pro Stunde</div>
                        </div>
                        <div className="flex gap-3">
                          <Button 
                            size="sm"
                            variant="outline"
                            className="text-white border-white/30"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleFavorite(escort.id);
                            }}
                          >
                            <Heart size={16} className={favorites.includes(escort.id) ? "fill-pink-600 text-pink-600" : ""} />
                          </Button>
                          <Button 
                            size="sm"
                            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                            onClick={(e) => {
                              e.stopPropagation();
                              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                            }}
                          >
                            <MessageCircle size={16} className="mr-2" />
                            Kontakt
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleLoadMore}
                  disabled={isLoadingMore}
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg px-12"
                >
                  {isLoadingMore ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                      Loading...
                    </>
                  ) : (
                    <>
                      Load More ({sortedEscorts.length - displayCount} remaining)
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* No Results */}
            {filteredEscorts.length === 0 && (
              <Card className="p-12 text-center bg-white/5 backdrop-blur-sm border-white/10">
                <Search size={64} className="mx-auto text-gray-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Keine Inserate gefunden</h3>
                <p className="text-gray-400 mb-6">Versuche deine Suchkriterien anzupassen</p>
                <Button 
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCity("all");
                    setSelectedService("all");
                    setSelectedOffer("all");
                    setVerifiedPhotos(false);
                    setVideoAds(false);
                  }}
                  className="bg-yellow-500 text-black hover:bg-yellow-600"
                >
                  Filter zurücksetzen
                </Button>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* Service Categories with Human Images */}
      <section id="services" className="py-20 bg-gradient-to-b from-transparent to-black/40">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
              Premium Escort Services
            </h2>
            <p className="text-xl text-gray-300">
              Exclusive experiences tailored to your desires
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {[
              { 
                image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&h=300&fit=crop",
                title: "Girlfriend Experience (GFE)", 
                description: "Intimate, passionate companionship with genuine connection and affection",
                color: "from-pink-500 to-rose-500"
              },
              { 
                image: "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=400&h=300&fit=crop",
                title: "Dinner & Social Events", 
                description: "Sophisticated companion for business dinners, galas, and social occasions",
                color: "from-purple-500 to-indigo-500"
              },
              { 
                image: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=400&h=300&fit=crop",
                title: "Overnight & Travel", 
                description: "Extended bookings for overnight stays and international travel companionship",
                color: "from-yellow-500 to-orange-500"
              },
              { 
                image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=400&h=300&fit=crop",
                title: "Pornstar Experience (PSE)", 
                description: "Adventurous, uninhibited experiences for those seeking excitement",
                color: "from-red-500 to-pink-500"
              },
              { 
                image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=400&h=300&fit=crop",
                title: "Massage & Spa", 
                description: "Professional relaxation and sensual massage experiences",
                color: "from-teal-500 to-cyan-500"
              },
              { 
                image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&h=300&fit=crop",
                title: "VIP Elite Services", 
                description: "Exclusive premium experiences with our highest-rated companions",
                color: "from-yellow-500 to-amber-500"
              }
            ].map((service, idx) => (
              <Card key={idx} className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all group cursor-pointer">
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className={`absolute inset-0 bg-gradient-to-br ${service.color} opacity-30 group-hover:opacity-20 transition-opacity`} />
                </div>
                <div className="p-6 text-center">
                  <h3 className="text-2xl font-bold text-white mb-3">{service.title}</h3>
                  <p className="text-gray-300">{service.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Cities Section */}
      <section id="cities" className="py-20 bg-black/40 backdrop-blur-sm border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Elite Escorts Across Switzerland
              </h2>
              <p className="text-xl text-gray-300">
                Premium companionship services in all major Swiss cities
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: "Zürich", escorts: 200, href: "/escort-zurich", image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=400&fit=crop" },
                { name: "Geneva", escorts: 150, href: "/escort-geneva", image: "https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?w=600&h=400&fit=crop" },
                { name: "Basel", escorts: 120, href: "/escort-basel", image: "https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=600&h=400&fit=crop" },
                { name: "Bern", escorts: 100, href: "/escort-bern", image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=600&h=400&fit=crop" },
                { name: "Lausanne", escorts: 90, href: "/escort-lausanne", image: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop" },
                { name: "Lucerne", escorts: 75, href: "/escort-lucerne", image: "https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=600&h=400&fit=crop" }
              ].map((city, idx) => (
                <Link key={idx} href={city.href}>
                  <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-yellow-500/50 transition-all hover:shadow-xl hover:shadow-yellow-500/20 hover:-translate-y-1 cursor-pointer group">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={city.image} 
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
                      <div className="absolute bottom-4 left-4 right-4">
                        <h3 className="text-3xl font-black text-white mb-1">{city.name}</h3>
                        <p className="text-gray-300 text-sm">{city.escorts} escorts available</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <CheckCircle size={14} className="text-green-500" />
                          <span>Verified profiles</span>
                        </div>
                        <Button size="sm" variant="outline" className="text-white border-white/30 group-hover:bg-yellow-500 group-hover:text-black group-hover:border-yellow-500 transition-all">
                          Browse
                        </Button>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us with Human Images */}
      <section id="about" className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Why Choose iWantSexNow.ch?
              </h2>
              <p className="text-xl text-gray-300">
                The premier luxury escort service in Switzerland
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  image: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=300&fit=crop",
                  title: "100% Verified & Safe",
                  description: "Every escort is ID verified and background checked. Your safety is our priority.",
                  color: "bg-blue-500"
                },
                {
                  image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400&h=300&fit=crop",
                  title: "Elite Selection Only",
                  description: "Handpicked sophisticated companions. Educated, beautiful, and professional.",
                  color: "bg-purple-500"
                },
                {
                  image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=400&h=300&fit=crop",
                  title: "Complete Discretion",
                  description: "Anonymous bookings, encrypted communications. Your privacy absolutely guaranteed.",
                  color: "bg-pink-500"
                },
                {
                  image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=300&fit=crop",
                  title: "Top Rated Service",
                  description: "Highest client satisfaction ratings. Verified reviews from real clients.",
                  color: "bg-yellow-500"
                },
                {
                  image: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=400&h=300&fit=crop",
                  title: "24/7 Availability",
                  description: "Round-the-clock bookings. Escorts available any time, day or night.",
                  color: "bg-green-500"
                },
                {
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
                  title: "Professional Service",
                  description: "Licensed, legal, and compliant. Premium experience every time.",
                  color: "bg-orange-500"
                }
              ].map((feature, idx) => (
                <Card key={idx} className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all group cursor-pointer">
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={feature.image} 
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className={`absolute inset-0 ${feature.color} opacity-30 group-hover:opacity-20 transition-opacity`} />
                  </div>
                  <div className="p-6">
                    <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-300">{feature.description}</p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Contact Section with Validation */}
      <section id="contact" className="py-20 bg-gradient-to-r from-purple-900/50 via-pink-900/50 to-orange-900/50 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                Ready to Book Your Experience?
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Contact us now for discreet, professional escort services
              </p>
            </div>

            <Card className="p-8 bg-white/10 backdrop-blur-md border-white/20">
              {formSuccess ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto rounded-full bg-green-500 flex items-center justify-center mb-6">
                    <Check size={40} className="text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Message Sent Successfully!</h3>
                  <p className="text-gray-300 mb-8">
                    We've received your inquiry and will respond within 24 hours.
                  </p>
                  <Button
                    onClick={() => setFormSuccess(false)}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleContactSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white mb-2 block">
                        Your Name *
                      </Label>
                      <Input
                        value={contactForm.name}
                        onChange={(e) => {
                          setContactForm({...contactForm, name: e.target.value});
                          setFormErrors({...formErrors, name: ""});
                        }}
                        placeholder="John Doe"
                        className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                          formErrors.name ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.name && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {formErrors.name}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">
                        Email *
                      </Label>
                      <Input
                        type="email"
                        value={contactForm.email}
                        onChange={(e) => {
                          setContactForm({...contactForm, email: e.target.value});
                          setFormErrors({...formErrors, email: ""});
                        }}
                        placeholder="your@email.com"
                        className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                          formErrors.email ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.email && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {formErrors.email}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-white mb-2 block">
                        Phone
                      </Label>
                      <Input
                        type="tel"
                        value={contactForm.phone}
                        onChange={(e) => {
                          setContactForm({...contactForm, phone: e.target.value});
                          setFormErrors({...formErrors, phone: ""});
                        }}
                        placeholder="+41 XX XXX XX XX"
                        className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                          formErrors.phone ? "border-red-500" : ""
                        }`}
                      />
                      {formErrors.phone && (
                        <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle size={14} />
                          {formErrors.phone}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-white mb-2 block">
                        Preferred Date
                      </Label>
                      <Input
                        type="date"
                        value={contactForm.date}
                        onChange={(e) => setContactForm({...contactForm, date: e.target.value})}
                        className="bg-white/10 border-white/20 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Duration
                    </Label>
                    <Select value={contactForm.duration} onValueChange={(value) => setContactForm({...contactForm, duration: value})}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Select duration" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1h">1 hour</SelectItem>
                        <SelectItem value="2h">2 hours</SelectItem>
                        <SelectItem value="3h">3 hours</SelectItem>
                        <SelectItem value="dinner">Dinner (4+ hours)</SelectItem>
                        <SelectItem value="overnight">Overnight</SelectItem>
                        <SelectItem value="weekend">Weekend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-2 block">
                      Message *
                    </Label>
                    <Textarea
                      value={contactForm.message}
                      onChange={(e) => {
                        setContactForm({...contactForm, message: e.target.value});
                        setFormErrors({...formErrors, message: ""});
                      }}
                      rows={4}
                      placeholder="Tell us about your preferences..."
                      className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none ${
                        formErrors.message ? "border-red-500" : ""
                      }`}
                    />
                    {formErrors.message && (
                      <p className="text-red-400 text-sm mt-1 flex items-center gap-1">
                        <AlertCircle size={14} />
                        {formErrors.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    disabled={formSubmitting}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg h-14 disabled:opacity-50"
                  >
                    {formSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={20} className="mr-2" />
                        Send Booking Request
                      </>
                    )}
                  </Button>

                  <p className="text-center text-sm text-gray-400 mt-4">
                    <Lock size={14} className="inline mr-1" />
                    All communications are encrypted and confidential
                  </p>
                </form>
              )}
            </Card>

            {/* Newsletter Signup */}
            <Card className="p-6 mt-8 bg-white/5 backdrop-blur-sm border-white/10">
              <div className="text-center mb-4">
                <h3 className="text-xl font-bold text-white mb-2">
                  Get Exclusive Updates
                </h3>
                <p className="text-gray-300 text-sm">
                  Subscribe to receive new escort profiles and special offers
                </p>
              </div>

              {newsletterSuccess ? (
                <div className="flex items-center justify-center gap-2 text-green-400 py-3">
                  <CheckCircle size={20} />
                  <span className="font-semibold">Successfully subscribed!</span>
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      type="email"
                      value={newsletterEmail}
                      onChange={(e) => {
                        setNewsletterEmail(e.target.value);
                        setNewsletterError("");
                      }}
                      placeholder="your@email.com"
                      className={`bg-white/10 border-white/20 text-white placeholder:text-gray-400 ${
                        newsletterError ? "border-red-500" : ""
                      }`}
                    />
                    {newsletterError && (
                      <p className="text-red-400 text-sm mt-1">{newsletterError}</p>
                    )}
                  </div>
                  <Button
                    type="submit"
                    className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white"
                  >
                    Subscribe
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </section>

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
                Switzerland's premier adult dating and escort platform
              </p>
              <div className="flex gap-3">
                <Button size="icon" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/>
                  </svg>
                </Button>
                <Button size="icon" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.645.069-4.85.069-3.204 0-3.584-.012-4.849-.069-3.26-.149-4.781-2.618-6.98-6.98-.059 1.281-.073 1.689-.073 4.948 0 3.204.013 3.583.072 4.849.196 4.354 2.617 6.78 6.979 6.98 1.281-.059 1.69-.069 4.949-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.28.058 1.689.072 4.948 0 3.204-.014 3.667-.072 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.057 1.645.069 4.85.069 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.204-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </Button>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Top Cities</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/escort-zurich" className="hover:text-white transition-colors">Zürich Escorts</Link></li>
                <li><Link href="/escort-geneva" className="hover:text-white transition-colors">Geneva Escorts</Link></li>
                <li><Link href="/escort-basel" className="hover:text-white transition-colors">Basel Escorts</Link></li>
                <li><Link href="/escort-bern" className="hover:text-white transition-colors">Bern Escorts</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Information</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link href="/safety" className="hover:text-white transition-colors">Safety & Privacy</Link></li>
                <li><Link href="/faq" className="hover:text-white transition-colors">FAQ</Link></li>
                <li><Link href="/members" className="hover:text-white transition-colors">Browse Members</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center">
            <p className="text-gray-400 text-sm">© 2025 iWantSexNow.ch. All rights reserved. | 18+ Only | Licensed & Legal</p>
          </div>
        </div>
      </footer>

      {/* Lightbox Modal */}
      {lightboxOpen && selectedEscort && (
        <div className="fixed inset-0 bg-black/95 z-[100] flex items-center justify-center p-4 animate-fade-in" onClick={closeLightbox}>
          <div className="absolute inset-0 backdrop-blur-sm" />
          
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 z-10 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-all text-white"
          >
            <X size={24} />
          </button>

          {/* Content */}
          <div className="relative max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-6" onClick={(e) => e.stopPropagation()}>
            {/* Image Gallery */}
            <div className="relative">
              <div className="relative aspect-[3/4] bg-black rounded-lg overflow-hidden">
                <img
                  src={selectedEscort.images[currentImageIndex]}
                  alt={`${selectedEscort.name} - Photo ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                />

                {/* Navigation Arrows */}
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-all text-white"
                  >
                    <ChevronLeft size={24} />
                  </button>
                )}

                {currentImageIndex < selectedEscort.images.length - 1 && (
                  <button
                    onClick={nextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm flex items-center justify-center hover:bg-black/80 transition-all text-white"
                  >
                    <ChevronRight size={24} />
                  </button>
                )}

                {/* Image Counter */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/60 backdrop-blur-sm rounded-full text-white text-sm font-semibold">
                  {currentImageIndex + 1} / {selectedEscort.images.length}
                </div>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-2 mt-4 overflow-x-auto">
                {selectedEscort.images.map((img: string, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      idx === currentImageIndex ? "border-yellow-500 scale-110" : "border-white/20 hover:border-white/40"
                    }`}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details */}
            <div className="bg-white/5 backdrop-blur-md rounded-lg p-6 overflow-y-auto max-h-[80vh] border border-white/10">
              <div className="space-y-6">
                {/* Header */}
                <div>
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-4xl font-black text-white mb-2">
                        {selectedEscort.name}, {selectedEscort.age}
                      </h2>
                      <div className="flex items-center gap-2 text-gray-300">
                        <MapPin size={18} />
                        <span>{selectedEscort.location}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFavorite(selectedEscort.id)}
                      className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-all"
                    >
                      <Heart 
                        size={24} 
                        className={favorites.includes(selectedEscort.id) ? "fill-pink-600 text-pink-600" : "text-white"}
                      />
                    </button>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    {selectedEscort.verified && (
                      <Badge className="bg-blue-500 border-0">
                        <Shield size={14} className="mr-1" />
                        ID Verified
                      </Badge>
                    )}
                    {selectedEscort.premium && (
                      <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 font-bold">
                        <Star size={14} className="mr-1" fill="currentColor" />
                        Premium VIP
                      </Badge>
                    )}
                    {selectedEscort.available ? (
                      <Badge className="bg-green-500 border-0">
                        <div className="w-2 h-2 bg-white rounded-full mr-2" />
                        Available Now
                      </Badge>
                    ) : (
                      <Badge className="bg-red-500/80 border-0">
                        <Clock size={14} className="mr-1" />
                        Busy
                      </Badge>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-2 mt-4">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          size={18} 
                          className={i < Math.floor(selectedEscort.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}
                        />
                      ))}
                    </div>
                    <span className="text-white text-sm font-medium">{selectedEscort.rating.toFixed(1)}</span>
                    <span className="text-white/60 text-xs">({selectedEscort.reviews} reviews)</span>
                  </div>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">About Me</h3>
                  <p className="text-gray-300 leading-relaxed">{selectedEscort.bio}</p>
                </div>

                {/* Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Body Type</div>
                    <div className="text-white font-semibold">{selectedEscort.bodyType}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-400 mb-1">Height</div>
                    <div className="text-white font-semibold">{selectedEscort.height}</div>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Services Offered</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEscort.services.map((service: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="border-white/20 text-white">
                        {service}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-xl font-bold text-white mb-3">Languages</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedEscort.languages.map((lang: string, idx: number) => (
                      <Badge key={idx} variant="outline" className="border-white/20 text-white">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                {selectedEscort.available && (
                  <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-lg">
                    <div className="flex items-center gap-2 text-green-400 font-semibold mb-1">
                      <Clock size={16} />
                      <span>Available Today</span>
                    </div>
                    <p className="text-gray-300 text-sm">{selectedEscort.availability}</p>
                  </div>
                )}

                {/* Reviews Preview */}
                {selectedEscort.reviewTexts && selectedEscort.reviewTexts.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-white mb-3">Recent Reviews</h3>
                    <div className="space-y-3">
                      {selectedEscort.reviewTexts.slice(0, 2).map((review: any, idx: number) => (
                        <div key={idx} className="p-4 bg-white/5 rounded-lg border border-white/10">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-white font-semibold">{review.author}</span>
                            <div className="flex items-center gap-1">
                              {[...Array(5)].map((_, i) => (
                                <Star 
                                  key={i} 
                                  size={12} 
                                  className={i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="text-gray-300 text-sm">{review.text}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Pricing */}
                <div className="p-6 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-400 mb-1">Starting from</div>
                      <div className="text-4xl font-black text-yellow-500">CHF {selectedEscort.rate}</div>
                      <div className="text-sm text-gray-400">per hour</div>
                    </div>
                    <DollarSign size={48} className="text-yellow-500/30" />
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button
                    size="lg"
                    className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold"
                    onClick={() => {
                      closeLightbox();
                      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                  >
                    <MessageCircle size={20} className="mr-2" />
                    Contact Now
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="text-white border-white/30"
                    onClick={() => {
                      if (navigator.share) {
                        navigator.share({
                          title: `${selectedEscort.name} - iWantSexNow.ch`,
                          text: selectedEscort.bio,
                          url: window.location.href
                        });
                      }
                    }}
                  >
                    <Share2 size={20} />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 w-14 h-14 rounded-full bg-gradient-to-r from-yellow-500 to-orange-500 text-black flex items-center justify-center shadow-2xl hover:scale-110 transition-all z-50 animate-bounce"
        >
          <ChevronLeft size={24} className="rotate-90" />
        </button>
      )}

      {/* Custom Animations */}
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
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 500px;
          }
        }
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
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
        .animate-marquee {
          animation: marquee 30s linear infinite;
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
        .animation-delay-800 {
          animation-delay: 800ms;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}