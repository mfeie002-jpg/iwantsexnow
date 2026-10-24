import { useState, useEffect, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Navigation } from "@/components/Navigation";
import {
  CheckCircle,
  ArrowUp,
  ShieldCheck,
  Clock,
  Calculator,
  Send,
  X,
  Car,
  ChevronDown,
  SlidersHorizontal,
  Globe,
  CalendarCheck,
  Palette,
  TrendingDown,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { LiveChatWidget } from "@/components/LiveChatWidget";
import { useToast } from "@/hooks/use-toast";
import { HeroSection } from "@/components/home/HeroSection";
import { EscortGrid } from "@/components/home/EscortGrid";
import { ServiceCategories } from "@/components/home/ServiceCategories";
import { CityLinks } from "@/components/home/CityLinks";
import { AboutSection } from "@/components/home/AboutSection";
import { ContactSection } from "@/components/home/ContactSection";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

export type BrandThemeId = "A" | "B" | "C" | "D";

export const BRAND_THEMES: Record<
  BrandThemeId,
  {
    id: BrandThemeId;
    shortLabel: string;
    name: string;
    subtitle: string;
    bgPrimary: string;
    bgSecondary: string;
    cardBg: string;
    accentText: string;
    accentBorder: string;
    glowColor: string;
  }
> = {
  A: {
    id: "A",
    shortLabel: "A · Swiss Shield",
    name: "The Swiss Shield",
    subtitle: "SWISS ESCORT INDEX & DIRECT BOOKING",
    bgPrimary: "bg-[#0B1623]",
    bgSecondary: "bg-[#07101A]",
    cardBg: "bg-[#09131E]/95",
    accentText: "text-[#D5A021]",
    accentBorder: "border-[#C69C6D]/50",
    glowColor: "from-[#C69C6D]/15 via-transparent to-emerald-500/10",
  },
  B: {
    id: "B",
    shortLabel: "B · Golden Key",
    name: "The Golden Key & Compass",
    subtitle: "THE LUXURY SWISS INDEX & CONCIERGE",
    bgPrimary: "bg-[#160810]",
    bgSecondary: "bg-[#0F050B]",
    cardBg: "bg-[#1F0B17]/95",
    accentText: "text-[#E6B980]",
    accentBorder: "border-[#E6B980]/50",
    glowColor: "from-rose-500/15 via-transparent to-[#E6B980]/10",
  },
  C: {
    id: "C",
    shortLabel: "C · Royal Crest",
    name: "The Swiss Monogram Crest",
    subtitle: "SWITZERLAND'S ELITE VERIFIED INDEX",
    bgPrimary: "bg-[#08090D]",
    bgSecondary: "bg-[#050608]",
    cardBg: "bg-[#0E1017]/95",
    accentText: "text-[#E2C275]",
    accentBorder: "border-[#E2C275]/50",
    glowColor: "from-[#E2C275]/15 via-transparent to-red-500/10",
  },
  D: {
    id: "D",
    shortLabel: "D · Search-Mark",
    name: "The Modern Search-Mark",
    subtitle: "ALLE PORTALE · ECHTE ENDPREISE",
    bgPrimary: "bg-[#091326]",
    bgSecondary: "bg-[#060C1A]",
    cardBg: "bg-[#0D1B36]/95",
    accentText: "text-[#F3D078]",
    accentBorder: "border-sky-400/40",
    glowColor: "from-sky-500/15 via-transparent to-[#F3D078]/10",
  },
};

const EXTRA_OPTIONS = [
  { id: "GFE", label: "Girlfriend Experience (GFE)", defaultExtraChf: 80 },
  { id: "Dinner Dates", label: "Dinner Date Begleitung", defaultExtraChf: 100 },
  { id: "Outcall", label: "Hotel- & Hausbesuch (Outcall)", defaultExtraChf: 70 },
  { id: "Massage", label: "Erotik- & Tantra-Massage", defaultExtraChf: 60 },
  { id: "Overnight", label: "Overnight Upgrade (+4 Std.)", defaultExtraChf: 600 },
];

export function BrandLogo({
  compact = false,
  variant = "A",
}: {
  compact?: boolean;
  variant?: BrandThemeId;
}) {
  const theme = BRAND_THEMES[variant] || BRAND_THEMES.A;
  return (
    <div className="flex items-center gap-3 group select-none">
      <div className={`relative flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105 ${compact ? "w-10 h-10" : "w-12 h-12"}`}>
        {variant === "A" && (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_4px_12px_rgba(213,160,33,0.35)]">
            <defs>
              <linearGradient id="shieldGoldA" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F6E27A" />
                <stop offset="50%" stopColor="#C69C6D" />
                <stop offset="100%" stopColor="#9A6F32" />
              </linearGradient>
              <linearGradient id="shieldBgA" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#16283E" />
                <stop offset="100%" stopColor="#07101A" />
              </linearGradient>
            </defs>
            <path d="M32 4 L56 12 V30 C56 46 45 55 32 60 C19 55 8 46 8 30 V12 L32 4 Z" fill="url(#shieldBgA)" stroke="url(#shieldGoldA)" strokeWidth="3" />
            <path d="M32 8 L52 15 V29 C52 43 42 51 32 55 C22 51 12 43 12 29 V15 L32 8 Z" fill="none" stroke="url(#shieldGoldA)" strokeWidth="0.9" strokeOpacity="0.6" />
            <path d="M30.5 11 H33.5 V14 H36.5 V17 H33.5 V20 H30.5 V17 H27.5 V14 H30.5 Z" fill="#F6E27A" />
            <text x="32" y="44" textAnchor="middle" fill="url(#shieldGoldA)" fontFamily="Georgia, serif" fontWeight="900" fontSize="24" letterSpacing="-1">
              iW
            </text>
          </svg>
        )}
        {variant === "B" && (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_4px_12px_rgba(230,185,128,0.35)]">
            <circle cx="32" cy="32" r="27" fill="#1F0B17" stroke="#FAD6A5" strokeWidth="2.5" />
            <polygon points="32,10 36,28 54,32 36,36 32,54 28,36 10,32 28,28" fill="#FAD6A5" fillOpacity="0.25" stroke="#FAD6A5" strokeWidth="1.5" />
            <text x="32" y="39" textAnchor="middle" fill="#FAD6A5" fontFamily="Georgia, serif" fontWeight="900" fontSize="20">iW</text>
          </svg>
        )}
        {variant === "C" && (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_4px_12px_rgba(226,194,117,0.35)]">
            <circle cx="32" cy="34" r="25" fill="#0B0D13" stroke="#E2C275" strokeWidth="2.8" />
            <path d="M24 9 L28 13 L32 7 L36 13 L40 9 L38 15 H26 Z" fill="#E2C275" />
            <rect x="28" y="16" width="8" height="8" rx="1.5" fill="#D92626" />
            <path d="M31 18 H33 V19.5 H34.5 V21 H33 V22.5 H31 V21 H29.5 V19.5 H31 Z" fill="#FFFFFF" />
            <text x="32" y="45" textAnchor="middle" fill="#E2C275" fontFamily="Georgia, serif" fontWeight="900" fontSize="22">iW</text>
          </svg>
        )}
        {variant === "D" && (
          <svg viewBox="0 0 64 64" className="w-full h-full drop-shadow-[0_4px_12px_rgba(56,189,248,0.35)]">
            <circle cx="28" cy="28" r="21" fill="#0D1F3C" stroke="#F3D078" strokeWidth="3.5" />
            <line x1="43" y1="43" x2="57" y2="57" stroke="#F3D078" strokeWidth="6" strokeLinecap="round" />
            <text x="28" y="35" textAnchor="middle" fill="#FFFFFF" fontFamily="sans-serif" fontWeight="900" fontSize="19">iW</text>
          </svg>
        )}
      </div>

      <div className="flex flex-col">
        <span className={`font-serif font-black tracking-tight leading-none ${compact ? "text-xl" : "text-2xl md:text-3xl"}`}>
          <span className="text-white">iWant</span>
          <span className={variant === "D" ? "text-sky-400" : "bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#D5A021] bg-clip-text text-transparent"}>
            Sex
          </span>
          <span className="text-white">Now</span>
          <span className="text-[#C69C6D] text-sm font-sans font-bold ml-0.5">.ch</span>
        </span>
        <span className="text-[9px] uppercase tracking-[0.2em] text-gray-300 font-sans font-semibold mt-1">
          {theme.subtitle}
        </span>
      </div>
    </div>
  );
}

function LuxuryDivider({ label }: { label?: string }) {
  return (
    <div className="relative py-2 flex items-center justify-center overflow-hidden bg-transparent">
      <div className="w-full max-w-5xl mx-auto px-4 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-[#C69C6D]/50 to-[#C69C6D]" />
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[#C69C6D]/40 bg-black/50 text-[10px] uppercase tracking-[0.22em] text-[#D5A021] font-bold shadow-lg">
          <span>❖</span>
          {label && <span>{label}</span>}
          <span>❖</span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-[#C69C6D]/50 to-[#C69C6D]" />
      </div>
    </div>
  );
}

export default function Home() {
  const { toast } = useToast();
  const [brandTheme, setBrandTheme] = useState<BrandThemeId>("A");
  const activeTheme = BRAND_THEMES[brandTheme];

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("all");
  const [selectedService, setSelectedService] = useState("all");
  const [selectedOffer, setSelectedOffer] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  const [verifiedPhotos, setVerifiedPhotos] = useState(false);
  const [videoAds, setVideoAds] = useState(false);

  const [selectedDuration, setSelectedDuration] = useState<30 | 60 | 120>(60);
  const [selectedExtras, setSelectedExtras] = useState<string[]>(["GFE"]);
  const [maxBudgetChf, setMaxBudgetChf] = useState<number>(1200);
  const [meetingType, setMeetingType] = useState<"all" | "incall" | "outcall">("all");
  const [expandedPortalId, setExpandedPortalId] = useState<number | null>(null);

  const [enquiryTarget, setEnquiryTarget] = useState<any | null>(null);
  const [enquiryTime, setEnquiryTime] = useState("Heute, 20:30 Uhr");
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
  const ITEMS_PER_PAGE = 12;

  // Map all deduplicated Swiss profiles (from Firecrawl harvested-offers.json + Direct Seed) into Home View
  const deduplicatedClusters = useMemo(() => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED), []);

  const allEscorts = useMemo(() => {
    return deduplicatedClusters.map((p, idx) => ({
      id: idx + 1,
      clusterId: p.dedupClusterId,
      name: p.displayName,
      age: p.age,
      bookingMode: p.bookingMode,
      bookingBadge: p.bookingMode === "direct" ? "Direkt Buchbar · Autorisiert" : "Schweizer Markt-Index",
      location: `${p.primaryCity} (${p.canton})`,
      locations: p.subareas.length ? p.subareas : [p.primaryCity, p.canton],
      travelInfo: `${p.subareas.join(" · ")} (${p.canton}) · Diskreter Incall & Hotel-Outcall`,
      incall: p.incall,
      outcall: p.outcall,
      gender: "female",
      images: [p.thumbnail],
      thumbnail: p.thumbnail,
      verified: true,
      premium: p.bookingMode === "direct",
      topAd: idx < 6,
      available: true,
      rating: p.bookingMode === "direct" ? 5.0 : 4.8,
      reviews: 42 + idx * 7,
      rate: p.bestBaseRate60Chf,
      portalAvgRate: p.portalAverage60Chf,
      portalsCount: p.sourcesCount,
      portalNames: p.sources.map((s) => s.portal),
      portalBreakdown: p.sources.map((s) => ({
        name: s.portal,
        price: s.priceChf,
        note: s.isDirect ? "Garantierter Fixpreis · 0% Aufschlag" : `Gefunden (${s.lastSeenIso})`,
      })),
      services: p.includedServices,
      extraPrices: p.extraPricesChf,
      serviceType: "escort-service",
      languages: ["Deutsch", "English"],
      bodyType: "Slim",
      height: "168 cm",
      bio: `Im Schweizer Index erfasst (${p.normalizedPhoneMask}). Direkt zum transparenten Endpreis anfragbar.`,
      longDescription: p.freshnessLabel,
      availability: p.freshnessLabel,
      postedTime: p.freshnessLabel,
      hasVideo: p.bookingMode === "direct",
      verifiedPhotos: true,
    }));
  }, [deduplicatedClusters]);

  const storyProfiles = useMemo(() => {
    return allEscorts.slice(0, 14).map((e) => ({
      id: e.id,
      name: `${e.name.slice(0, 10)} · ${e.locations[0]?.slice(0, 6) || "CH"}`,
      image: e.thumbnail,
      verified: true,
      online: true,
    }));
  }, [allEscorts]);

  const cityPages = [
    {
      name: "Zürich",
      slug: "zurich",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?w=800&h=600&fit=crop",
      escorts: deduplicatedClusters.filter((p) => p.canton === "ZH").length,
      description: "Pilot-Region · Direkt buchbare Profile & gesamter Stadt-Index",
      featured: true,
    },
    {
      name: "Zug & Cham",
      slug: "zurich",
      image: "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?w=800&h=600&fit=crop",
      escorts: deduplicatedClusters.filter((p) => p.canton === "ZG" || p.subareas.includes("Zug")).length,
      description: "Pilot-Region · Diskrete Direktbuchung & Hotelbesuche in Zug/Cham",
      featured: true,
    },
    {
      name: "Geneva",
      slug: "geneva",
      image: "https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&h=600&fit=crop",
      escorts: 12,
      description: "International VIP Companionship & Events",
      featured: true,
    },
    {
      name: "Basel",
      slug: "basel",
      image: "https://images.unsplash.com/photo-1549877452-9c387954fbc2?w=800&h=600&fit=crop",
      escorts: 9,
      description: "Verifizierte Anbieterinnen & Studios am Rhein",
      featured: true,
    },
    {
      name: "Bern",
      slug: "bern",
      image: "https://images.unsplash.com/photo-1559564484-e48d68d8ffad?w=800&h=600&fit=crop",
      escorts: 8,
      description: "Diskrete High-Class Kontakte in der Bundesstadt",
      featured: true,
    },
    {
      name: "Lausanne",
      slug: "lausanne",
      image: "https://images.unsplash.com/photo-1583212692277-a2b6b5c8c2e1?w=800&h=600&fit=crop",
      escorts: 7,
      description: "Exklusive Profile am Genfersee",
      featured: true,
    },
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
    const thirdPartyTotal = Math.round((escort.portalAvgRate * durationMultiplier) / 10) * 10 + extrasCost + paidList.length * 20;
    const includedRatio = selectedExtras.length > 0 ? includedList.length / selectedExtras.length : 1;
    const budgetScore = totalCost <= maxBudgetChf ? 15 : 0;
    const matchScore = Math.min(99, Math.round(78 + includedRatio * 6 + budgetScore));

    return {
      basePrice,
      extrasCost,
      totalCost,
      thirdPartyTotal,
      savings: Math.max(40, thirdPartyTotal - totalCost),
      includedList,
      paidList,
      matchScore,
    };
  };

  const toggleExtra = (id: string) => {
    setSelectedExtras((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSendPrivateEnquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!enquiryTarget) return;
    const calc = calculateProviderTotal(enquiryTarget);

    try {
      await fetch("/api/enquiries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerName: enquiryTarget.name,
          duration: selectedDuration,
          extras: selectedExtras,
          guaranteedTotalChf: calc.totalCost,
          requestedTime: enquiryTime,
          city: enquiryCity,
          contact: enquiryContact,
          notes: enquiryNotes,
        }),
      });
    } catch {
      // non-blocking
    }

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
      title: `Direktbuchungs-Anfrage an ${enquiryTarget.name} übermittelt`,
      description: `Garantierter Fixpreis CHF ${calc.totalCost} (${selectedDuration} Min.) wurde direkt gesendet.`,
      duration: 4500,
    });
    setEnquiryTarget(null);
    setEnquiryContact("");
    setEnquiryNotes("");
  };

  useEffect(() => {
    const savedFavorites = localStorage.getItem("favorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
    const savedTheme = localStorage.getItem("brandTheme") as BrandThemeId | null;
    if (savedTheme && BRAND_THEMES[savedTheme]) {
      setBrandTheme(savedTheme);
    }
  }, []);

  const handleThemeSwitch = (id: BrandThemeId) => {
    setBrandTheme(id);
    localStorage.setItem("brandTheme", id);
    toast({
      title: `Design & Logo: ${BRAND_THEMES[id].name}`,
      description: `Variante ${id} aktiv – Logo & Farbwelt wurden live aktualisiert.`,
      duration: 2200,
    });
  };

  const filteredEscorts = allEscorts.filter((escort) => {
    if (
      searchQuery &&
      !escort.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !escort.location.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !escort.locations.some((l) => l.toLowerCase().includes(searchQuery.toLowerCase()))
    )
      return false;
    if (
      selectedCity !== "all" &&
      !escort.locations.some((loc) => loc.toLowerCase().includes(selectedCity.toLowerCase())) &&
      !escort.location.toLowerCase().includes(selectedCity.toLowerCase())
    )
      return false;
    if (selectedService !== "all" && !escort.services.some((s) => s.toLowerCase().includes(selectedService.toLowerCase())))
      return false;
    if (selectedOffer !== "all" && escort.serviceType !== selectedOffer) return false;
    if (selectedGender !== "all" && escort.gender !== selectedGender) return false;
    if (verifiedPhotos && !escort.verifiedPhotos) return false;
    if (videoAds && !escort.hasVideo) return false;
    if (meetingType === "incall" && !escort.incall) return false;
    if (meetingType === "outcall" && !escort.outcall) return false;
    const calc = calculateProviderTotal(escort);
    if (calc.totalCost > maxBudgetChf) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredEscorts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedEscorts = filteredEscorts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    document.getElementById("escorts")?.scrollIntoView({ behavior: "smooth" });
  };

  const handleLoadMore = () => {
    setIsLoadingMore(true);
    setTimeout(() => {
      setCurrentPage((prev) => prev + 1);
      setIsLoadingMore(false);
    }, 500);
  };

  const toggleFavorite = (id: number) => {
    setFavorites((prev) => {
      const newFavorites = prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id];
      localStorage.setItem("favorites", JSON.stringify(newFavorites));
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
    setMaxBudgetChf(1200);
    setMeetingType("all");
    setCurrentPage(1);
  };

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
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${activeTheme.bgPrimary}`}>
      <SEO
        title="iWantSexNow.ch | Der Schweizer Escort-Index – Vergleichen & Direkt Buchen"
        description="Alle Schweizer Escorts, Studios und Portale in einer Suchmaschine: Echte Endpreise, automatischer Dubletten-Filter und verifizierte Direktbuchung."
      />

      <header
        className={`border-b border-[#C69C6D]/25 fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? `${activeTheme.bgSecondary}/95 backdrop-blur-md py-2` : `${activeTheme.bgPrimary} py-3`
        } ${headerVisible ? "translate-y-0" : "-translate-y-full"}`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between gap-3">
            <Link href="/">
              <BrandLogo compact={scrolled} variant={brandTheme} />
            </Link>

            <div className="hidden xl:flex items-center gap-1 bg-black/45 border border-[#C69C6D]/35 rounded-full px-2 py-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#D5A021] px-2 flex items-center gap-1">
                <Palette size={12} /> Design:
              </span>
              {(["A", "B", "C", "D"] as BrandThemeId[]).map((id) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleThemeSwitch(id)}
                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold transition-all ${
                    brandTheme === id ? "bg-[#C69C6D] text-[#0D1B2A] shadow" : "text-gray-300 hover:text-white"
                  }`}
                >
                  {BRAND_THEMES[id].shortLabel}
                </button>
              ))}
            </div>

            <div className="hidden lg:block">
              <Navigation />
            </div>
            <MobileNav />
          </div>

          <div className="flex xl:hidden items-center justify-center gap-1.5 mt-2 pt-2 border-t border-white/10 overflow-x-auto">
            <span className="text-[10px] text-[#D5A021] font-bold uppercase mr-1 flex items-center gap-1 shrink-0">
              <Palette size={11} /> Logo & Look:
            </span>
            {(["A", "B", "C", "D"] as BrandThemeId[]).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => handleThemeSwitch(id)}
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0 ${
                  brandTheme === id ? "bg-[#C69C6D] text-[#0D1B2A]" : "bg-white/5 text-gray-300"
                }`}
              >
                {BRAND_THEMES[id].shortLabel}
              </button>
            ))}
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

      <section className={`py-5 ${activeTheme.bgSecondary} border-b border-[#C69C6D]/20`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
            <p className="text-xs text-[#D5A021] font-bold uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Live-Index: {INITIAL_RAW_SWISS_FEED.length} Schweizer Inserate → {allEscorts.length} echte Profile (Zürich, Zug & Schweiz)
            </p>
            <Link href="/compare-escorts" className="text-xs text-gray-300 hover:text-white underline font-semibold">
              Komplette {allEscorts.length}-Profile Endpreis-Matrix öffnen →
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            {storyProfiles.map((profile) => (
              <Link key={profile.id} href={`/profile/${profile.id}`} className="flex-shrink-0 cursor-pointer group">
                <div className="relative">
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full p-0.5 transition-all duration-300 hover:scale-105 bg-gradient-to-tr from-[#C69C6D] via-amber-300 to-emerald-400 shadow-[0_0_15px_rgba(213,160,33,0.3)]">
                    <div className="w-full h-full rounded-full overflow-hidden border-2 border-[#0D1B2A]">
                      <img src={profile.image} alt={profile.name} className="w-full h-full object-cover" />
                    </div>
                  </div>
                  <div className="absolute bottom-0 right-0 bg-emerald-500 rounded-full p-0.5">
                    <CheckCircle size={13} className="text-white" fill="white" />
                  </div>
                </div>
                <p className="text-white text-xs text-center mt-1.5 font-medium truncate w-16 md:w-20">
                  {profile.name}
                </p>
              </Link>
            ))}
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <TrendingDown size={15} className="text-emerald-400 shrink-0" />
              <span className="text-gray-300">Ø Ersparnis Direktbuchung: <strong className="text-emerald-400">CHF 85 / Std.</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <ShieldCheck size={15} className="text-[#D5A021] shrink-0" />
              <span className="text-gray-300">Live-Index: <strong className="text-white">{allEscorts.length} echte Profile</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <Clock size={15} className="text-sky-400 shrink-0" />
              <span className="text-gray-300">Zürich & Zug: <strong className="text-white">Echtzeit-Sync aktiv</strong></span>
            </div>
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/10">
              <Lock size={15} className="text-[#D5A021] shrink-0" />
              <span className="text-gray-300">Anfrage-Schutz: <strong className="text-white">100% Diskret & Direkt</strong></span>
            </div>
          </div>
        </div>
      </section>

      <LuxuryDivider label="Swiss Endpreis & Index Engine" />

      <section id="decision-engine" className="relative py-12 md:py-16 overflow-hidden border-b border-white/10">
        <div className={`pointer-events-none absolute inset-0 bg-gradient-to-br ${activeTheme.glowColor} opacity-80`} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-8 gap-6">
              <div>
                <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-3">
                  <Calculator size={14} className="mr-1.5 inline" />
                  Meta-Index ({allEscorts.length} Profile) + Direktbuchung in Echtzeit
                </Badge>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif font-black text-white tracking-tight">
                  Alle Schweizer Portale durchsucht. Direkt hier buchbar.
                </h2>
                <p className="text-gray-300 text-sm md:text-base mt-1 max-w-2xl">
                  Wähle Dauer, Treffpunkt und gewünschte Services: Unsere Engine vergleicht alle Online-Inserate der Schweiz, filtert Mehrfach-Kopien heraus und lässt dich verifizierte Anbieterinnen direkt zum Fixpreis buchen.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex bg-black/50 p-1 rounded-xl border border-[#C69C6D]/30">
                  {([30, 60, 120] as const).map((mins) => (
                    <button
                      key={mins}
                      onClick={() => setSelectedDuration(mins)}
                      className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition-all ${
                        selectedDuration === mins ? "bg-[#C69C6D] text-[#0D1B2A] shadow-lg" : "text-gray-300 hover:text-white"
                      }`}
                    >
                      {mins === 120 ? "2 Std." : `${mins} Min.`}
                    </button>
                  ))}
                </div>

                <div className="flex bg-black/50 p-1 rounded-xl border border-white/15">
                  {(
                    [
                      { id: "all", label: "Incall & Outcall" },
                      { id: "incall", label: "Studio / Privat" },
                      { id: "outcall", label: "Hotel / Hausbesuch" },
                    ] as const
                  ).map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setMeetingType(m.id)}
                      className={`px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                        meetingType === m.id
                          ? "bg-white/15 text-white border border-[#C69C6D]/40"
                          : "text-gray-400 hover:text-white"
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="relative bg-black/40 backdrop-blur-md border border-[#C69C6D]/35 rounded-2xl p-4 sm:p-6 mb-8 shadow-2xl">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                  <div className="text-xs text-[#D5A021] uppercase font-bold mb-2.5 flex items-center gap-1.5 tracking-wider">
                    <SlidersHorizontal size={13} />
                    Gewünschte Services anklicken (Berechnet live den echten Endpreis ohne Nachverhandlung):
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {EXTRA_OPTIONS.map((opt) => {
                      const active = selectedExtras.includes(opt.id);
                      return (
                        <button
                          key={opt.id}
                          onClick={() => toggleExtra(opt.id)}
                          className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold border transition-all flex items-center gap-2 ${
                            active
                              ? "bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                              : "bg-white/5 border-white/10 text-gray-300 hover:border-[#C69C6D]/50"
                          }`}
                        >
                          <CheckCircle size={14} className={active ? "text-emerald-400 shrink-0" : "text-gray-500 shrink-0"} />
                          <span>{opt.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="md:w-64 bg-white/5 border border-white/15 rounded-xl p-3.5 shrink-0">
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="text-gray-300 font-semibold">Max. Gesamtbudget:</span>
                    <span className="text-[#D5A021] font-black text-sm">bis CHF {maxBudgetChf}</span>
                  </div>
                  <input
                    type="range"
                    min={300}
                    max={1500}
                    step={50}
                    value={maxBudgetChf}
                    onChange={(e) => setMaxBudgetChf(Number(e.target.value))}
                    className="w-full accent-[#C69C6D] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredEscorts.slice(0, 8).map((escort) => {
                const calc = calculateProviderTotal(escort);
                const isExpanded = expandedPortalId === escort.id;
                const isDirect = escort.bookingMode === "direct";
                return (
                  <div
                    key={escort.id}
                    className={`relative rounded-2xl ${activeTheme.cardBg} border ${activeTheme.accentBorder} hover:border-[#D5A021] transition-all p-4 sm:p-6 flex flex-col justify-between shadow-[0_12px_35px_rgba(0,0,0,0.45)] group`}
                  >
                    <div className="absolute top-0 left-8 right-8 h-[2px] bg-gradient-to-r from-transparent via-[#C69C6D]/70 to-transparent" />
                    <div>
                      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
                        <Link
                          href={`/profile/${encodeURIComponent(escort.name)}`}
                          className="relative w-full sm:w-44 h-60 sm:h-48 flex-shrink-0 rounded-xl overflow-hidden block border border-white/15"
                        >
                          <img
                            src={escort.thumbnail}
                            alt={escort.name}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div
                            className={`absolute top-2.5 left-2.5 text-white text-[11px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow ${
                              isDirect ? "bg-emerald-600/95" : "bg-sky-600/95"
                            }`}
                          >
                            {isDirect ? <CalendarCheck size={12} /> : <Globe size={12} />}
                            {escort.bookingBadge}
                          </div>
                          <div className="absolute top-2.5 right-2.5 bg-black/85 border border-[#C69C6D] text-[#D5A021] text-[11px] font-black px-2.5 py-1 rounded-full">
                            {calc.matchScore}% Match
                          </div>
                          <div className="absolute bottom-2 left-2 right-2 bg-black/85 backdrop-blur-sm text-[11px] text-amber-300 px-2.5 py-1 rounded-lg text-center font-medium border border-amber-400/20">
                            {escort.portalsCount} Schweizer Quelle(n)
                          </div>
                        </Link>

                        <div className="flex-1 min-w-0 flex flex-col justify-between">
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <Link
                                href={`/profile/${encodeURIComponent(escort.name)}`}
                                className="hover:text-[#D5A021] transition-colors"
                              >
                                <h3 className="text-xl sm:text-2xl font-serif font-black text-white leading-tight">
                                  {escort.name}, {escort.age}
                                </h3>
                              </Link>
                              <span className="text-xs font-bold text-yellow-400 bg-yellow-500/10 border border-yellow-500/30 px-2 py-0.5 rounded-md shrink-0">
                                ★ {escort.rating.toFixed(1)}
                              </span>
                            </div>

                            <p className="text-xs sm:text-sm text-[#D5A021] font-semibold mt-1">
                              📍 {escort.locations.join(" · ")}
                            </p>
                            <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-1.5">
                              <Car size={12} className="text-gray-400 shrink-0" />
                              <span className="truncate">{escort.travelInfo}</span>
                            </p>
                          </div>

                          <div className="mt-3 bg-gradient-to-r from-white/10 to-white/5 border border-[#C69C6D]/35 rounded-xl p-3 flex items-center justify-between gap-3">
                            <div>
                              <div className="text-[11px] text-gray-300">
                                {isDirect ? `Direktbuchungs-Fixpreis (${selectedDuration} Min.)` : `Bereinigter Endpreis (${selectedDuration} Min.)`}
                              </div>
                              <div className="flex items-baseline gap-2 mt-0.5">
                                <span className="text-2xl sm:text-3xl font-black text-[#D5A021]">
                                  CHF {calc.totalCost}
                                </span>
                                <span className="text-xs text-gray-400 line-through">
                                  Ø CHF {calc.thirdPartyTotal}
                                </span>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="inline-block bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold px-2.5 py-1 rounded-lg">
                                Sparvorteil CHF {calc.savings}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-4 flex items-center gap-2 text-xs text-emerald-300 bg-emerald-950/50 border border-emerald-500/30 px-3 py-2 rounded-xl">
                        <Clock size={14} className="shrink-0" />
                        <span className="font-medium">{escort.postedTime}</span>
                      </div>

                      {isExpanded && (
                        <div className="mt-3 bg-black/60 border border-[#C69C6D]/40 rounded-xl p-3 text-xs space-y-2">
                          <div className="font-bold text-[#D5A021] flex items-center justify-between">
                            <span>Schweizer Cross-Portal-Index:</span>
                            <span>1h Basis</span>
                          </div>
                          {escort.portalBreakdown.map((p, idx) => (
                            <div key={idx} className="flex items-center justify-between py-1 border-b border-white/5 last:border-0">
                              <div>
                                <span className={idx === 0 ? "font-bold text-emerald-400" : "text-gray-300"}>{p.name}</span>
                                <span className="text-gray-500 ml-2">({p.note})</span>
                              </div>
                              <span className={idx === 0 ? "font-black text-emerald-400" : "text-gray-400 line-through"}>
                                CHF {p.price}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-between gap-3">
                      <button
                        type="button"
                        onClick={() => setExpandedPortalId(isExpanded ? null : escort.id)}
                        className="text-xs text-gray-300 hover:text-[#D5A021] flex items-center gap-1 font-medium"
                      >
                        <ChevronDown size={14} className={`transition-transform ${isExpanded ? "rotate-180" : ""}`} />
                        {isExpanded ? "Quellen schließen" : `Quellen & Preisabgleich zeigen`}
                      </button>

                      <div className="flex items-center gap-2 ml-auto">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-white/20 text-white hover:bg-white/10 text-xs h-9"
                          asChild
                        >
                          <Link href={`/profile/${encodeURIComponent(escort.name)}`}>Profil öffnen</Link>
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => {
                            setEnquiryTarget(escort);
                            setEnquiryCity(escort.locations[0]);
                          }}
                          className="bg-gradient-to-r from-[#C69C6D] via-[#E5C178] to-[#C69C6D] hover:opacity-95 text-[#0D1B2A] font-black text-xs px-4 h-9 shadow-lg"
                        >
                          <Send size={13} className="mr-1.5" />
                          {isDirect ? "Jetzt direkt buchen" : "Termin anfragen"}
                        </Button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 text-center">
              <Button className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black px-8 py-6 text-sm" asChild>
                <Link href="/search">
                  Alle {allEscorts.length} Schweizer Profile im Voll-Index durchsuchen →
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LuxuryDivider label={`Verifizierte Profile & Schweizer Katalog (${filteredEscorts.length})`} />

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

      <LuxuryDivider label="Kantone & Pilot-Regionen" />

      <section className="py-20 bg-gradient-to-b from-black/40 to-black/70 border-y border-white/10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-serif font-black text-white mb-4">
                Schweizer Regionen & Kantone
              </h2>
              <p className="text-lg md:text-xl text-gray-400">
                Pilot-Städte Zürich & Zug sowie der komplette Schweizer Markt-Index nach Kanton
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {cityPages.map((city, idx) => (
                <Link key={`${city.slug}-${idx}`} href={`/escort-${city.slug}`}>
                  <Card className="group overflow-hidden bg-white/5 backdrop-blur-sm border-white/15 hover:border-[#C69C6D] transition-all duration-300 cursor-pointer hover:-translate-y-1 hover:shadow-2xl">
                    <div className="relative h-60 overflow-hidden">
                      <img
                        src={city.image}
                        alt={city.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <h3 className="text-2xl md:text-3xl font-serif font-black text-white mb-1">
                          {city.name}
                        </h3>
                        <p className="text-gray-300 text-xs md:text-sm mb-3">
                          {city.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <Badge className="bg-[#C69C6D] border-0 text-[#0D1B2A] font-bold">
                            {city.escorts} Profile aktiv
                          </Badge>
                          <span className="text-[#D5A021] text-sm font-bold group-hover:translate-x-1 transition-transform">
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
          <div className="bg-[#0D1B2A] border border-[#C69C6D]/50 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setEnquiryTarget(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
              Direktbuchung & Diskrete Termin-Anfrage
            </Badge>
            <h3 className="text-2xl font-serif font-black">
              {enquiryTarget.name} ({enquiryTarget.age}) direkt buchen
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Deine Buchungsanfrage geht mit garantiertem Endpreis direkt an {enquiryTarget.name}.
            </p>

            <div className="mt-4 p-3.5 rounded-xl bg-white/5 border border-white/10 text-xs space-y-1">
              <div className="flex justify-between font-bold text-sm">
                <span>Garantierter Komplettpreis ({selectedDuration} Min.):</span>
                <span className="text-[#D5A021]">CHF {calculateProviderTotal(enquiryTarget).totalCost}</span>
              </div>
              <div className="text-gray-400">
                Inkludierte Optionen: {selectedExtras.length ? selectedExtras.join(", ") : "Standard"}
              </div>
            </div>

            <form onSubmit={handleSendPrivateEnquiry} className="mt-4 space-y-3">
              <div>
                <label className="text-xs text-gray-300 block mb-1">Treffpunkt (Zürich / Zug / Hotel / Studio)</label>
                <input
                  type="text"
                  value={enquiryCity}
                  onChange={(e) => setEnquiryCity(e.target.value)}
                  required
                  className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Gewünschte Uhrzeit & Datum</label>
                <input
                  type="text"
                  value={enquiryTime}
                  onChange={(e) => setEnquiryTime(e.target.value)}
                  required
                  className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                />
              </div>
              <div>
                <label className="text-xs text-gray-300 block mb-1">Deine Nummer für Rückbestätigung (SMS / WhatsApp / Signal / Threema)</label>
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
                <label className="text-xs text-gray-300 block mb-1">Diskrete Notiz (optional)</label>
                <textarea
                  rows={2}
                  placeholder="Hotelname, besondere Wünsche..."
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
                  Jetzt verbindlich anfragen
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showScrollTop && (
        <Button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] shadow-2xl"
          size="icon"
          aria-label="Scroll to top"
        >
          <ArrowUp size={20} />
        </Button>
      )}

      <LiveChatWidget />

      <footer className={`${activeTheme.bgSecondary} text-white py-16 border-t border-[#C69C6D]/25`}>
        <div className="container mx-auto px-6">
          <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            <div>
              <div className="mb-4">
                <BrandLogo compact variant={brandTheme} />
              </div>
              <p className="text-gray-400 text-sm leading-relaxed mt-3">
                Der Schweizer Escort-Index: Alle Online-Inserate der Schweiz in einer Suche gebündelt, um Dubletten bereinigt und zum transparenten Endpreis direkt buchbar.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-white mb-4">Suchmaschine & Buchung</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/compare-escorts" className="hover:text-white">Endpreis- & Portal-Vergleich</Link></li>
                <li><Link href="/search" className="hover:text-white">Schweizweite Meta-Suche ({allEscorts.length})</Link></li>
                <li><Link href="/escort-zurich" className="hover:text-white">Pilot-Region Zürich & Zug</Link></li>
                <li><Link href="/create-post" className="hover:text-white">Profil übernehmen / Inserieren</Link></li>
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
              <h4 className="font-bold text-white mb-4">Vertrauen & B2B</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><Link href="/faq" className="hover:text-white">Verifizierungs-Prozess</Link></li>
                <li><Link href="/pricing" className="hover:text-white">B2B Pakete & Direktbuchung</Link></li>
                <li><Link href="/checkout" className="hover:text-white">B2B Checkout (TWINT / Crypto)</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 text-center text-gray-500 text-sm">
            <p>&copy; {new Date().getFullYear()} iWantSexNow.ch · Swiss Escort Index & Direct Booking Engine (18+)</p>
          </div>
        </div>
      </footer>
    </div>
  );
}