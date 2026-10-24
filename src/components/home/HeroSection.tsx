import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Users, UserPlus, PlusCircle, Shield } from "lucide-react";
import Link from "next/link";
import { motion, Variants, useScroll, useTransform } from "framer-motion";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  selectedService: string;
  setSelectedService: (val: string) => void;
  selectedOffer: string;
  setSelectedOffer: (val: string) => void;
  selectedGender: string;
  setSelectedGender: (val: string) => void;
  verifiedPhotos: boolean;
  setVerifiedPhotos: (val: boolean) => void;
  videoAds: boolean;
  setVideoAds: (val: boolean) => void;
  filteredCount: number;
}

export function HeroSection({
  searchQuery, setSearchQuery,
  selectedCity, setSelectedCity,
  selectedService, setSelectedService,
  selectedOffer, setSelectedOffer,
  selectedGender, setSelectedGender,
  verifiedPhotos, setVerifiedPhotos,
  videoAds, setVideoAds,
  filteredCount
}: HeroSectionProps) {
  // Parallax scrolling effect
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const backgroundScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  const titleVariants: Variants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
        delay: 0.2
      }
    }
  };

  const filterCardVariants: Variants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    },
    hover: {
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  return (
    <>
      {/* PROMO BANNER - Subdued */}
      <motion.section 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 py-3 md:py-4 border-b border-white/20"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-center">
            <div className="flex items-center gap-2">
              <Shield size={18} className="text-gray-300" />
              <span className="text-white font-bold text-sm md:text-base">DEMO / VORSCHAU:</span>
            </div>
            <span className="text-gray-200 text-xs md:text-sm">
              Alle Profile und Kennzahlen sind Beispieldaten. Noch keine echten Buchungen oder Nutzerkonten.
            </span>
            <Button size="sm" className="bg-white text-gray-900 hover:bg-gray-100 font-bold shadow-lg whitespace-nowrap" asChild>
              <Link href="/demo-accounts">Demo ansehen →</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Animated Hero Section with Parallax Background */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Parallax Background Image with Overlays */}
        <motion.div 
          className="absolute inset-0"
          style={{ y: backgroundY }}
        >
          {/* Romantic/Sensual Background Image with Parallax */}
          <motion.div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&h=1080&fit=crop&q=80')",
              scale: backgroundScale,
              opacity: backgroundOpacity
            }}
          />
          
          {/* Dark Gradient Overlay for Readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/70 to-black/80" />
          
          {/* Subtle Colored Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/60 via-gray-800/50 to-gray-900/60" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto text-center space-y-8"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <motion.h1 
                variants={titleVariants}
                className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight"
              >
                <motion.span 
                  className="text-white drop-shadow-2xl"
                >
                  Sex und Erotik
                </motion.span>
                <br />
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-gray-300 drop-shadow-2xl"
                >
                  Inserate in der Schweiz
                </motion.span>
              </motion.h1>
              <p className="text-base text-gray-200">Städte und Kategorien mit fiktiven Inseraten testen.</p>
              <Link href="/search" className="inline-block rounded-lg bg-white px-6 py-3 font-bold text-slate-950 hover:bg-gray-100">Inserate-Katalog öffnen →</Link>
            </motion.div>

            {/* Filters with Animations */}
            <motion.div 
              variants={filterCardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
            >
              <Card className="p-4 md:p-6 shadow-2xl bg-white/10 backdrop-blur-md border-white/20 overflow-hidden relative">
                <div className="relative z-10 space-y-4">
                  {/* Main Filters */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Select value={selectedGender} onValueChange={setSelectedGender}>
                        <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white hover:border-gray-500 transition-all duration-300">
                          <SelectValue placeholder="Geschlecht" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle</SelectItem>
                          <SelectItem value="female">Frauen</SelectItem>
                          <SelectItem value="male">Männer</SelectItem>
                          <SelectItem value="trans">Trans</SelectItem>
                          <SelectItem value="couples">Paare</SelectItem>
                          <SelectItem value="non-binary">Nicht-binär</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Select value={selectedCity} onValueChange={setSelectedCity}>
                        <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white hover:border-gray-500 transition-all duration-300">
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
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Select value={selectedService} onValueChange={setSelectedService}>
                        <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white hover:border-gray-500 transition-all duration-300">
                          <SelectValue placeholder="Service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Alle Services</SelectItem>
                          <SelectItem value="gfe">GFE/BFE</SelectItem>
                          <SelectItem value="pse">PSE</SelectItem>
                          <SelectItem value="massage">Massage</SelectItem>
                          <SelectItem value="dinner">Dinner Dates</SelectItem>
                          <SelectItem value="travel">Travel Companion</SelectItem>
                          <SelectItem value="events">Events</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                        <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white hover:border-gray-500 transition-all duration-300">
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
                          <SelectItem value="lesbian">Lesbian</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>

                  {/* Search Bar */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      placeholder="Name, Ort, Stichwort suchen..."
                      className="pl-12 pr-12 py-6 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-400 hover:border-gray-500 focus:border-gray-400 transition-all duration-300 text-lg"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <motion.button 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setSearchQuery("")} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
                      >
                        <X size={20} />
                      </motion.button>
                    )}
                  </motion.div>

                  {/* Filter Options */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <motion.label 
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.input
                          type="checkbox"
                          checked={verifiedPhotos}
                          onChange={(e) => setVerifiedPhotos(e.target.checked)}
                          className="w-4 h-4 rounded accent-gray-600 cursor-pointer"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        />
                        <span className="text-sm font-medium">Bildmerkmal (Demo)</span>
                      </motion.label>
                      
                      <motion.label 
                        className="flex items-center gap-2 cursor-pointer hover:text-gray-300 transition-colors group"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <motion.input
                          type="checkbox"
                          checked={videoAds}
                          onChange={(e) => setVideoAds(e.target.checked)}
                          className="w-4 h-4 rounded accent-gray-600 cursor-pointer"
                          whileHover={{ scale: 1.2 }}
                          whileTap={{ scale: 0.9 }}
                        />
                        <span className="text-sm font-medium">Video-Merkmal (Demo)</span>
                      </motion.label>
                    </div>

                    <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full border border-white/20">
                      <span className="text-white font-bold text-lg">
                        {filteredCount} Treffer
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Call-to-Action Buttons */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8"
            >
              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  size="lg" 
                  className="bg-white text-black hover:bg-gray-200 font-black text-lg px-8 py-6 shadow-2xl w-full sm:w-auto relative overflow-hidden group"
                  onClick={() => document.getElementById('escorts')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  <span className="relative z-10 flex items-center">
                    <Users size={24} className="mr-2" />
                    Jetzt Durchsuchen
                  </span>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-6 backdrop-blur-sm w-full sm:w-auto relative overflow-hidden group"
                  asChild
                >
                  <Link href="/register">
                    <span className="relative z-10 flex items-center">
                      <UserPlus size={24} className="mr-2" />
                      Registrierung (in Vorbereitung)
                    </span>
                  </Link>
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.05, y: -5 }}
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Button 
                  size="lg" 
                  variant="outline"
                  className="border-2 border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold text-lg px-8 py-6 backdrop-blur-sm w-full sm:w-auto relative overflow-hidden group"
                  asChild
                >
                  <Link href="/create-post">
                    <span className="relative z-10 flex items-center">
                      <PlusCircle size={24} className="mr-2" />
                      Inserate (in Vorbereitung)
                    </span>
                  </Link>
                </Button>
              </motion.div>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div 
              variants={itemVariants}
              className="flex flex-wrap items-center justify-center gap-6 mt-6 text-white/80 text-sm"
            >
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
              >
                <motion.div 
                  className="w-3 h-3 bg-green-500 rounded-full"
                  animate={{ scale: [1, 1.2, 1], opacity: [1, 0.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span><strong className="text-white">Demo</strong> statt Live-Aktivität</span>
              </motion.div>
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
              >
                <Shield size={16} className="text-gray-400" />
                <span><strong className="text-white">Beispielprofile</strong> ohne Echtheitsprüfung</span>
              </motion.div>
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              <motion.div 
                className="flex items-center gap-2"
                whileHover={{ scale: 1.1 }}
              >
                <Shield size={16} className="text-gray-400" />
                <span><strong className="text-white">Vorschau</strong> – kein Live-Buchungsbetrieb</span>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
