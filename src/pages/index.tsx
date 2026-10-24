import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Navigation } from "@/components/Navigation";
import { CheckCircle, ArrowUp, ShieldCheck, Clock, Calculator, Send, X } from "lucide-react";
import Link from "next/link";
import { LiveChatWidget } from "@/components/LiveChatWidget";
import { useToast } from "@/hooks/use-toast";
import { HeroSection } from "@/components/home/HeroSection";
import { EscortGrid } from "@/components/home/EscortGrid";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { CityLinks } from "@/components/home/CityLinks";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";

const EXTRA_OPTIONS = [
  { id: "GFE", label: "Girlfriend Experience (GFE)", defaultExtraChf: 80 },
  { id: "Dinner Dates", label: "Dinner Date Begleitung", defaultExtraChf: 100 },
  { id: "Outcall", label: "Hotel- & Hausbesuch (Outcall)", defaultExtraChf: 70 },
  { id: "Massage", label: "Erotik- & Tantra-Massage", defaultExtraChf: 60 },
  { id: "Overnight", label: "Overnight Upgrade (+4 Std.)", defaultExtraChf: 600 },
];

export default function Home() {
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [verifiedPhotos, setVerifiedPhotos] = useState(false);
  const [videoAds, setVideoAds] = useState(false);

  const [selectedDuration, setSelectedDuration] = useState<30 | 60 | 120>(60);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["GFE"]);
  const [enquiryTarget, setEnquiryTarget] = useState<any | null>(null);
  const [enquiryTime, setEnquiryTime] = useState("Heute, 20:00 Uhr");
  const [enquiryCity, setEnquiryCity] = useState("Zürich / Zug");
  const [enquiryContact, setEnquiryContact] = useState("");
  const [enquiryNotes, setEnquiryNotes] = useState("");

  const [scrolled, setScrolled] = useState(false);
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 6;

  const cityPages = [
    {
      name: "Zürich",
      slug: "zurich",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop",
      escorts: 18,
      description: "Pilot-Region · Geprüfte Direktprofile & Echtzeit-Status",
      featured: true
    },
    {
      name: "Zug",
      slug: "zurich",
      image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&h=600&fit=crop",
      escorts: 9,
      description: "Pilot-Region · Diskrete Begleitung & Hotelbesuche in Zug/Cham",
      featured: true
    },
    {
      name: "Geneva",
      slug: "geneva",
      image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&h=600&fit=crop",
      escorts: 12,
      description: "International VIP Companionship & Events",
      featured: true
    },
    {
      name: "Basel",
      slug: "basel",
      image: "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&h=600&fit=crop",
      escorts: 8,
      description: "Verifizierte Anbieterinnen & Studios am Rhein",
      featured: true
    },
    {
      name: "Bern",
      slug: "bern",
      image: "https://images.unsplash.com/photo-1559564484-e48d68d8ffad?w=800&h=600&fit=crop",
      escorts: 7,
      description: "Diskrete High-Class Kontakte in der Bundesstadt",
      featured: true
    },
    {
      name: "Lausanne",
      slug: "lausanne",
      image: "https://images.unsplash.com/photo-1583212692277-a2b6b5c8c2e1?w=800&h=600&fit=crop",
      escorts: 6,
      description: "Exklusive Profile am Genfersee",
      featured: true
    }
  ];

  const storyProfiles = [
    { id: 1, name: "Vanessa · ZH", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 2, name: "Elena · ZG", image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 3, name: "Damiana · ZH", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 4, name: "Lara · BS", image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop", verified: true, online: false },
    { id: 5, name: "Katja · ZG", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 6, name: "Mely · GE", image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 7, name: "Aschley · ZH", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop", verified: true, online: true },
    { id: 8, name: "Anthonella · BE", image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=150&h=150&fit=crop", verified: true, online: false },
    { id: 9, name: "Valery · LU", image: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=150&h=150&fit=crop", verified: true, online: true },
  ];

  const allEscorts = [
    {
      id: 1,
      name: "Sophia",
      age: 26,
      location: "Zürich & Zug",
      locations: ["Zürich", "Winterthur", "Zug"],
      gender: "female",
      images: ["https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&h=1200&fit=crop"],
      thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      topAd: true,
      available: true,
      rating: 5.0,
      reviews: 127,
      rate: 450,
      portalAvgRate: 520,
      portalsCount: 4,
      portalNames: ["Direktprofil", "xdate.ch", "fgirl.ch", "and6.com"],
      services: ["GFE", "Dinner Dates", "Outcall", "Events"],
      extraPrices: { "Massage": 50, "Overnight": 550 } as Record<string, number>,
      serviceType: "sie-sucht-ihn",
      languages: ["German", "English", "French"],
      bodyType: "Athletic",
      height: "168 cm",
      bio: "Verifiziertes Direktprofil ohne Agentur-Aufschlag. Echtzeit-Verfügbarkeit für Zürich & Zug.",
      longDescription: "Autorisiertes Direktprofil mit Identitäts- und Foto-Check. Transparente Endpreise ohne versteckte Nachverhandlungen.",
      availability: "Heute verfügbar (18:00 – 23:30 Uhr)",
      postedTime: "Vor 12 Min. vom Provider bestätigt",
      hasVideo: true,
      verifiedPhotos: true
    },
    {
      id: 2,
      name: "Elena",
      age: 24,
      location: "Zug & Zürichsee",
      locations: ["Zug", "Zürich", "Luzern"],
      gender: "female",
      images: ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800&h=1200&fit=crop"],
      thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      topAd: true,
      available: true,
      rating: 4.9,
      reviews: 94,
      rate: 400,
      portalAvgRate: 480,
      portalsCount: 3,
      portalNames: ["Direktprofil", "and6.com", "xdate.ch"],
      services: ["GFE", "Outcall", "Massage"],
      extraPrices: { "Dinner Dates": 60, "Overnight": 500 } as Record<string, number>,
      serviceType: "escort-service",
      languages: ["German", "English", "Italian"],
      bodyType: "Slim",
      height: "165 cm",
      bio: "Exklusive Begleitung in Zug, Cham und Zürich. 100% geprüfte Originalbilder.",
      longDescription: "Direkt verifiziertes Profil mit garantierter Preis-Transparenz und diskreter Direkt-Anfrage.",
      availability: "Sofort verfügbar in Zug / Zürich",
      postedTime: "Vor 8 Min. vom Provider bestätigt",
      hasVideo: true,
      verifiedPhotos: true
    },
    {
      id: 3,
      name: "Emma",
      age: 28,
      location: "Basel",
      locations: ["Basel", "Zürich"],
      gender: "female",
      images: ["https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=1200&fit=crop"],
      thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=600&fit=crop",
      verified: true,
      premium: false,
      topAd: false,
      available: true,
      rating: 4.8,
      reviews: 156,
      rate: 350,
      portalAvgRate: 420,
      portalsCount: 2,
      portalNames: ["Direktprofil", "and6.com"],
      services: ["GFE", "Massage"],
      extraPrices: { "Outcall": 60, "Dinner Dates": 80, "Overnight": 480 } as Record<string, number>,
      serviceType: "erotik-massage",
      languages: ["German", "English"],
      bodyType: "Athletic",
      height: "170 cm",
      bio: "Zertifizierte Tantra- & sinnliche Massage im privaten Studio.",
      longDescription: "Alle Basis-Extras bereits im Stundenpreis kalkuliert – kein Nachverkauf vor Ort.",
      availability: "Heute ab 19:00 Uhr verfügbar",
      postedTime: "Vor 27 Min. vom Provider bestätigt",
      hasVideo: false,
      verifiedPhotos: true
    },
    {
      id: 4,
      name: "Mia",
      age: 25,
      location: "Bern & Zürich",
      locations: ["Bern", "Zürich", "Zug"],
      gender: "female",
      images: ["https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&h=1200&fit=crop"],
      thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      topAd: true,
      available: true,
      rating: 5.0,
      reviews: 189,
      rate: 550,
      portalAvgRate: 650,
      portalsCount: 5,
      portalNames: ["Direktprofil", "xdate.ch", "fgirl.ch", "and6.com", "6navi.ch"],
      services: ["GFE", "Dinner Dates", "Outcall", "Overnight"],
      extraPrices: { "Massage": 40 } as Record<string, number>,
      serviceType: "sie-sucht-ihn",
      languages: ["German", "French", "English"],
      bodyType: "Athletic",
      height: "172 cm",
      bio: "High-Class Dinner & Overnight Companion für Zürich, Zug & Bern.",
      longDescription: "Auf 5 Schweizer Portalen gelistet – hier zum verifizierten Direkt-Tarif ohne Vermittlungsgebühr.",
      availability: "Heute 17:00 – 23:00 Uhr",
      postedTime: "Vor 19 Min. vom Provider bestätigt",
      hasVideo: true,
      verifiedPhotos: true
    }
  ];

  const calculateProviderTotal = (escort: typeof allEscorts[0]) => {
    const durationMultiplier = selectedDuration === 30 ? 0.65 : selectedDuration === 120 ? 1.8 : 1;
    const basePrice = Math.round((escort.rate * durationMultiplier) / 10) * 10;
    let extrasCost = 0;
    const includedList: string[] = [];
    const paidList: { label: string; price: number }[] = [];

    selectedExtras.forEach((ext) => {
      if (escort.services.includes(ext)) {
        includedList.push(ext);
      } else {
        const fallback = EXTRA_OPTIONS.find((o) => o.id === ext)?.defaultExtraChf ?? 70;
        const price = escort.extraPrices?.[ext] ?? fallback;
        extrasCost += price;
        paidList.push({ label: ext, price });
      }
    });

    const totalCost = basePrice + extrasCost;
    const thirdPartyTotal = Math.round((escort.portalAvgRate * durationMultiplier) / 10) * 10 + extrasCost + (paidList.length * 20);
    return {
      basePrice,
      extrasCost,
      totalCost,
      thirdPartyTotal,
      savings: Math.max(0, thirdPartyTotal - totalCost),
      includedList,
      paidList,
    };
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendPrivateEnquiry = (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryTarget) return;
    const calc = calculateProviderTotal(enquiryTarget);
    const savedLeads = JSON.parse(localStorage.getItem("privateEnquiries") || "[]");
    savedLeads.push({
      id: Date.now(),
      providerId: enquiryTarget.id,
      providerName: enquiryTarget.name,
      duration: selectedDuration,
      extras: selectedExtras,
      guaranteedTotalChf: calc.totalCost,
      requestedTime: enquiryTime,
      city: enquiryCity,
      contact: enquiryContact,
      notes: enquiryNotes,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("privateEnquiries", JSON.stringify(savedLeads));
    toast({
      title: `Diskrete Anfrage an ${enquiryTarget.name} gesendet`,
      description: `Fixpreis CHF ${calc.totalCost} (${selectedDuration} Min.) wurde als verifizierter Lead übermittelt.`,
      duration: 4500,
    });
    setEnquiryTarget(null);
    setEnquiryContact("");
    setEnquiryNotes("");
  };

  useEffect(() => {
    const savedFilters = localStorage.getItem('searchFilters');
    if (savedFilters) {
      const filters = JSON.parse(savedFilters);
      setSelectedCity(filters.city || "all");
      setSelectedService(filters.service || "all");
      setSelectedOffer(filters.offer || "all");
      setSelectedGender(filters.gender || "all");
      setVerifiedPhotos(filters.verifiedPhotos || false);
      setVideoAds(filters.videoAds || false);
    }
    const savedFavorites = localStorage.getItem('favorites');
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  useEffect(() => {
    const filters = {
      city: selectedCity,
      service: selectedService,
      offer: selectedOffer,
      gender: selectedGender,
      verifiedPhotos,
      videoAds
    };
    localStorage.setItem('searchFilters', JSON.stringify(filters));
  }, [selectedCity, selectedService, selectedOffer, selectedGender, verifiedPhotos, videoAds]);

  const filteredEscorts = allEscorts.filter(escort => {
    if (searchQuery && !escort.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !escort.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !escort.locations.some(l => l.toLowerCase().includes(searchQuery.toLowerCase()))) return false;
    if (selectedCity !== "all" && !escort.locations.some(loc => loc.toLowerCase().includes(selectedCity.toLowerCase()))) return false;
    if (selectedService !== "all" && !escort.services.some(s => s.toLowerCase().includes(selectedService.toLowerCase()))) return false;
    if (selectedOffer !== "all" && escort.serviceType !== selectedOffer) return false;
    if (selectedGender !== "all" && escort.gender !== selectedGender) return false;
    if (verifiedPhotos && !escort.verifiedPhotos) return false;
    if (videoAds && !escort.hasVideo) return false;
    return true;
  });

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
    }, 600);
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => {
      const newFavorites = prev.includes(id)
        ? prev.filter(fav => fav !== id)
        : [...prev, id];
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      toast({
        title: prev.includes(id) ? "Von Favoriten entfernt" : "Zu Favoriten hinzugefügt",
        description: prev.includes(id)
          ? "Profil wurde aus deinen Favoriten entfernt"
          : "Profil wurde zu deiner Vergleichsliste hinzugefügt",
        duration: 2000,
      });
      return newFavorites;
    });
  };

  const resetFilters = () => {
    setSearchQuery("");
    setSelectedCity("all");
    setSelectedService("all");
    setSelectedOffer("all");
    setSelectedGender("all");
    setVerifiedPhotos(false);
    setVideoAds(false);
    setCurrentPage(1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCity, selectedService, selectedOffer, selectedGender, verifiedPhotos, videoAds]);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShowScrollTop(currentScrollY > 500);
      setScrolled(currentScrollY > 100);
      if (currentScrollY > lastScrollY && currentScrollY > 150) {
        setHeaderVisible(false);
      } else if (currentScrollY < lastScrollY) {
        setHeaderVisible(true);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D1B2A]">
      <SEO
        title="iWantSexNow.ch | Verifizierter Schweizer Escort- & Preisvergleich (Zürich & Zug)"
        description="Finden, vergleichen und direkt anfragen: Transparente Endpreise, geprüfte Identitäten, Dubletten-Check über 47 Portale und Echtzeit-Verfügbarkeit."
      />
      <header className={`border-b border-gray-200 dark:border-gray-800 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white/95 dark:bg-[#0D1B2A]/95 backdrop-blur-sm py-3' : 'bg-white dark:bg-[#0D1B2A] py-4'
      } ${headerVisible ? 'translate-y-0' : '-translate-y-full'}`}>
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <span className={`font-bold tracking-tight transition-all duration-300 ${
                scrolled ? 'text-xl md:text-2xl' : 'text-2xl md:text-3xl'
              }`}>
                <span className="text-[#0D1B2A] dark:text-white">iWant</span>
                <span className="text-[#C69C6D] dark:text-[#D5A021]">Sex</span>
                <span className="text-[#0D1B2A] dark:text-white">Now</span>
                <span className="text-gray-500 dark:text-gray-400 text-lg">.ch</span>
              </span>
            </Link>
            <div className="hidden lg:block">
              <Navigation />
            </div>
            <MobileNav />
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
        selectedGender={selectedGender}
        setSelectedGender={setSelectedGender}
        verifiedPhotos={verifiedPhotos}
        setVerifiedPhotos={setVerifiedPhotos}
        videoAds={videoAds}
        setVideoAds={setVideoAds}
        filteredCount={filteredEscorts.length}
      />

      <section className="py-5 bg-[#09131E] border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-[#D5A021] font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Echtzeit-Status · Verifizierte Direktprofile in Zürich, Zug & Schweiz
            </p>
            <Link href="/compare-escorts" className="text-xs text-gray-300 hover:text-white underline">
              Alle 47 Portale & Preise vergleichen →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {storyProfiles.map((profile) => (
              <div key={profile.id} className="flex-shrink-0 cursor-pointer group">
                <div className="relative">
                  <div className={`w-20 h-20 rounded-full p-0.5 transition-all duration-300 hover:scale-105 ${
                    profile.online
                      ? 'bg-gradient-to-tr from-[#C69C6D] via-amber-400 to-emerald-400'
                      : 'bg-gray-700'
                  }`}>
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#0D1B2A]">
                      <img
                        src={profile.image}
                        alt={profile.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                      />
                    </div>
                  </div>
                  {profile.verified && (
                    <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-0.5">
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

      <section className="py-12 bg-gradient-to-b from-[#0D1B2A] to-[#13263B] border-b border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-3">
                  <Calculator size={14} className="mr-1.5 inline" />
                  Schweizer Endpreis- & Portal-Decision-Engine
                </Badge>
                <h2 className="text-2xl md:text-4xl font-black text-white">
                  Echter Endpreis statt Lockvogel-Tarife
                </h2>
                <p className="text-gray-300 text-sm md:text-base mt-1">
                  Wähle Dauer und gewünschte Services: Wir berechnen sofort den echten Komplettpreis, prüfen Dubletten auf 47 Portalen und zeigen dir geprüfte Direkt-Verfügbarkeit.
                </p>
              </div>
              <div className="flex bg-black/40 p-1.5 rounded-xl border border-white/10 self-start">
                {([30, 60, 120] as const).map((mins) => (
                  <button
                    key={mins}
                    onClick={() => setSelectedDuration(mins)}
                    className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                      selectedDuration === mins
                        ? "bg-[#C69C6D] text-[#0D1B2A] shadow-lg"
                        : "text-gray-300 hover:text-white"
                    }`}
                  >
                    {mins === 120 ? "2 Stunden" : `${mins} Min.`}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-4 mb-8">
              <div className="text-xs text-gray-400 uppercase font-bold mb-3">
                Gewünschte Optionen anklicken (Inklusive vs. Aufpreis wird live pro Anbieter berechnet):
              </div>
              <div className="flex flex-wrap gap-2">
                {EXTRA_OPTIONS.map((opt) => {
                  const active = selectedExtras.includes(opt.id);
                  return (
                    <button
                      key={opt.id}
                      onClick={() => toggleExtra(opt.id)}
                      className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-semibold border transition-all flex items-center gap-2 ${
                        active
                          ? "bg-emerald-500/20 border-emerald-400 text-white"
                          : "bg-black/20 border-white/10 text-gray-300 hover:border-white/30"
                      }`}
                    >
                      <CheckCircle size={14} className={active ? "text-emerald-400" : "text-gray-500"} />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {filteredEscorts.map((escort) => {
                const calc = calculateProviderTotal(escort);
                return (
                  <div
                    key={escort.id}
                    className="rounded-2xl bg-white/5 border border-white/15 hover:border-[#C69C6D]/60 transition-all p-5 flex flex-col sm:flex-row gap-5"
                  >
                    <div className="relative w-full sm:w-40 h-52 sm:h-auto flex-shrink-0 rounded-xl overflow-hidden">
                      <img src={escort.thumbnail} alt={escort.name} className="w-full h-full object-cover" />
                      <div className="absolute top-2 left-2 bg-emerald-600/95 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1">
                        <ShieldCheck size={12} /> ID & Fotos geprüft
                      </div>
                      <div className="absolute bottom-2 left-2 right-2 bg-black/80 backdrop-blur-sm text-[11px] text-amber-300 px-2.5 py-1 rounded-md">
                        Auf {escort.portalsCount} von 47 Portalen · 1 Duplikat-ID
                      </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              {escort.name}, {escort.age}
                            </h3>
                            <p className="text-xs text-gray-300 mt-0.5">
                              📍 {escort.locations.join(" · ")}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-[11px] text-gray-400 line-through">
                              Drittportale Ø CHF {calc.thirdPartyTotal}
                            </div>
                            <div className="text-2xl font-black text-[#D5A021]">
                              CHF {calc.totalCost}
                            </div>
                            <div className="text-[11px] text-emerald-400 font-semibold">
                              Endpreis für {selectedDuration} Min. (Sparvorteil CHF {calc.savings})
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-3 py-1.5 rounded-lg">
                          <Clock size={13} />
                          <span>{escort.postedTime} · {escort.availability}</span>
                        </div>

                        <div className="mt-3 space-y-1 text-xs">
                          <div className="text-gray-300">
                            <span className="text-gray-400">Grundtarif ({selectedDuration} Min.):</span>{" "}
                            <span className="font-semibold text-white">CHF {calc.basePrice}</span>
                          </div>
                          {calc.includedList.length > 0 && (
                            <div className="text-emerald-400">
                              ✓ Im Grundpreis inklusive: {calc.includedList.join(", ")} (CHF 0 Aufpreis)
                            </div>
                          )}
                          {calc.paidList.length > 0 && (
                            <div className="text-amber-300">
                              + Gewählte Extras: {calc.paidList.map((p) => `${p.label} (+CHF ${p.price})`).join(", ")}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                        <div className="text-[11px] text-gray-400 truncate">
                          Quellen: {escort.portalNames.join(", ")}
                        </div>
                        <Button
                          onClick={() => {
                            setEnquiryTarget(escort);
                            setEnquiryCity(escort.locations[0]);
                          }}
                          className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-bold text-xs px-4 py-2 h-auto shrink-0"
                        >
                          <Send size={13} className="mr-1.5" />
                          Diskret anfragen
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <EscortGrid
        escorts={paginatedEscorts}
        isLoadingMore={isLoadingMore}
        hasMore={currentPage < totalPages}
        handleLoadMore={handleLoadMore}
        openLightbox={() => {}}
        favorites={favorites}
        toggleFavorite={toggleFavorite}
        resetFilters={resetFilters}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <section className="py-20 bg-gradient-to-b from-gray-900 to-gray-950 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
                Schweizer Regionen & Kantone
              </h2>
              <p className="text-xl text-gray-400">
                Pilot-Städte Zürich & Zug sowie verifizierte Direktprofile in der ganzen Schweiz
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityPages.map((city, idx) => (
                <Link key={`${city.slug}-${idx}`} href={`/escort-${city.slug}`}>
                  <Card className="group overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 hover:border-white/30 transition-all duration-300 cursor-pointer hover:scale-105 hover:shadow-2xl hover:shadow-black/40">
                    <div className="relative h-64 overflow-hidden">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-3xl font-black text-white mb-2">
                          {city.name}
                        </h3>
                        <p className="text-gray-300 text-sm mb-3">
                          {city.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-[#C69C6D] border-0 text-[#0D1B2A] font-bold">
                            {city.escorts} Geprüfte Profile
                          </Badge>
                          <span className="text-gray-300 font-bold group-hover:translate-x-2 transition-transform">
                            Region öffnen →
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

      {enquiryTarget && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0D1B2A] border border-[#C69C6D]/50 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setEnquiryTarget(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
              Verifizierter Private-Enquiry-Flow
            </Badge>
            <h3 className="text-2xl font-black">
              Diskrete Anfrage an {enquiryTarget.name} ({enquiryTarget.age})
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Kein Callcenter, keine Drittportal-Gebühren: Deine Anfrage geht verschlüsselt direkt an den autorisierten Provider.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
              <div className="flex justify-between font-bold text-sm">
                <span>Kalkulierter Komplettpreis ({selectedDuration} Min.):</span>
                <span className="text-[#D5A021]">CHF {calculateProviderTotal(enquiryTarget).totalCost}</span>
              </div>
              <div className="text-gray-400">
                Gewählte Optionen: {selectedExtras.length ? selectedExtras.join(", ") : "Standard"}
              </div>
            </div>

            <form onSubmit={handleSendPrivateEnquiry} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Gewünschter Ort (Zürich / Zug / Hotel / Studio)</label>
                <input
                  type="text"
                  value={enquiryCity}
                  onChange={(e) => setEnquiryCity(e.target.value)}
                  required
                  className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Wunschzeitpunkt</label>
                <input
                  type="text"
                  value={enquiryTime}
                  onChange={(e) => setEnquiryTime(e.target.value)}
                  required
                  className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Deine Rückrufnummer / Signal / WhatsApp / Threema</label>
                <input
                  type="text"
                  placeholder="+41 79 ... oder Threema-ID"
                  value={enquiryContact}
                  onChange={(e) => setEnquiryContact(e.target.value)}
                  required
                  className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Diskrete Nachricht (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Besondere Wünsche oder Treffpunkt-Details..."
                  value={enquiryNotes}
                  onChange={(e) => setEnquiryNotes(e.target.value)}
                  className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                />
              </div>
              <div className="pt-2 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEnquiryTarget(null)}
                  className="border-white/20 text-gray-300"
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-bold"
                >
                  Verbindliche Anfrage senden
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScrollTop && (
        <Button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 w-14 h-14 rounded-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] shadow-2xl"
          size="icon"
          aria-label="Scroll to top"
        >
          <ArrowUp size={24} />
        </Button>
      )}

      <LiveChatWidget />

      <footer className="bg-[#0D1B2A] text-white py-16 border-t border-gray-800">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="mb-6">
                <span className="text-2xl font-bold tracking-tight">
                  <span className="text-white">iWant</span>
                  <span className="text-[#D5A021]">Sex</span>
                  <span className="text-white">Now</span>
                  <span className="text-gray-400 text-xl">.ch</span>
                </span>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Schweizer Decision-Marketplace für verifizierte Direktprofile, transparente Gesamtpreise und diskrete Direkt-Anfragen in Zürich, Zug und der gesamten Schweiz.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Marktplatz & Vergleich</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/compare-escorts" className="hover:text-white">47 Portale & Preise vergleichen</Link></li>
                <li><Link href="/search" className="hover:text-white">Intent-Suche & Filter</Link></li>
                <li><Link href="/register" className="hover:text-white">Als Provider listen</Link></li>
                <li><Link href="/admin-dashboard" className="hover:text-gray-300">Provider Self-Service Dashboard</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Rechtliches</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/terms" className="hover:text-white">Nutzungsbedingungen</Link></li>
                <li><Link href="/privacy" className="hover:text-white">Datenschutz (CH DSG)</Link></li>
                <li><Link href="/imprint" className="hover:text-white">Impressum</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Vertrauen & Sicherheit</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq" className="hover:text-white">Verifizierungs-Prozess</Link></li>
                <li><Link href="/contact" className="hover:text-white">Diskreter Support</Link></li>
                <li><Link href="/safety" className="hover:text-white">Richtlinien & Schutz</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} iWantSexNow.ch · Schweizer Decision-Marketplace (18+)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
