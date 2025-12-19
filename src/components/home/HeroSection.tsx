import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Sparkles, Heart } from "lucide-react";
import Link from "next/link";
import { motion, Variants } from "framer-motion";

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (val: string) => void;
  selectedCity: string;
  setSelectedCity: (val: string) => void;
  selectedService: string;
  setSelectedService: (val: string) => void;
  selectedOffer: string;
  setSelectedOffer: (val: string) => void;
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
  verifiedPhotos, setVerifiedPhotos,
  videoAds, setVideoAds,
  filteredCount
}: HeroSectionProps) {
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

  return (
    <>
      {/* PROMO BANNER */}
      <motion.section 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 15 }}
        className="bg-gradient-to-r from-yellow-500 via-orange-500 to-pink-600 py-3 md:py-4 border-b border-white/20"
      >
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-center">
            <div className="flex items-center gap-2">
              <Sparkles size={20} className="text-white animate-pulse" />
              <span className="text-white font-black text-sm md:text-base">LIMITED TIME OFFER:</span>
            </div>
            <span className="text-white text-xs md:text-sm">
              Join FREE today & get <strong>7 days Premium access</strong> + 100 bonus credits!
            </span>
            <Button size="sm" className="bg-white text-orange-600 hover:bg-gray-100 font-bold shadow-lg whitespace-nowrap" asChild>
              <Link href="/register">Claim Offer →</Link>
            </Button>
          </div>
        </div>
      </motion.section>

      {/* Animated Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 pointer-events-none">
          <motion.div 
            animate={{ 
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-pink-600/20 to-orange-600/20"
          />
          <motion.div 
            animate={{ 
              x: [0, 100, 0],
              y: [0, 50, 0],
            }}
            transition={{ 
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute top-0 left-0 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              x: [0, -100, 0],
              y: [0, -50, 0],
            }}
            transition={{ 
              duration: 25,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute bottom-0 right-0 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"
          />
        </div>

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
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ 
                    duration: 5,
                    repeat: Infinity,
                    ease: "linear"
                  }}
                  className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-[length:200%_auto]"
                >
                  Sex und Erotik
                </motion.span>
                <br />
                <motion.span 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-white drop-shadow-2xl"
                >
                  Inserate in der Schweiz
                </motion.span>
              </motion.h1>
            </motion.div>

            {/* Filters */}
            <motion.div variants={itemVariants}>
              <Card className="p-4 shadow-2xl bg-white/10 backdrop-blur-md border-white/20">
                <div className="grid md:grid-cols-4 gap-3 mb-3">
                  <Select value={selectedCity} onValueChange={setSelectedCity}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white hover:border-pink-500 transition-colors">
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

                  <Select value={selectedService} onValueChange={setSelectedService}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white hover:border-pink-500 transition-colors">
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

                  <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                    <SelectTrigger className="bg-gray-800/80 border-gray-700 text-white hover:border-pink-500 transition-colors">
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

                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                    <Input
                      placeholder="Suchen..."
                      className="pl-10 bg-gray-800/80 border-gray-700 text-white placeholder:text-gray-400 hover:border-pink-500 transition-colors"
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

                <div className="flex items-center gap-6 text-white">
                  <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition-colors group">
                    <input
                      type="checkbox"
                      checked={verifiedPhotos}
                      onChange={(e) => setVerifiedPhotos(e.target.checked)}
                      className="w-4 h-4 rounded accent-pink-600 group-hover:ring-2 ring-pink-500"
                    />
                    <span className="text-sm font-medium">Verifizierte Bilder</span>
                  </label>
                  
                  <label className="flex items-center gap-2 cursor-pointer hover:text-yellow-500 transition-colors group">
                    <input
                      type="checkbox"
                      checked={videoAds}
                      onChange={(e) => setVideoAds(e.target.checked)}
                      className="w-4 h-4 rounded accent-pink-600 group-hover:ring-2 ring-pink-500"
                    />
                    <span className="text-sm font-medium">Video Inserate</span>
                  </label>

                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="ml-auto"
                  >
                    <span className="text-yellow-500 font-bold text-lg">
                      {filteredCount} Treffer
                    </span>
                  </motion.div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}