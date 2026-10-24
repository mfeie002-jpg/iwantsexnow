import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, Users, UserPlus, PlusCircle, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";
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
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 150]);
  const backgroundScale = useTransform(scrollY, [0, 500], [1, 1.1]);
  const backgroundOpacity = useTransform(scrollY, [0, 300], [1, 0.3]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.15, delayChildren: 0.1 } }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100, damping: 14 } }
  };

  return (
    <>
      <div className="bg-gradient-to-r from-[#09131E] via-[#13263B] to-[#09131E] py-3 border-b border-white/15 mt-[72px] md:mt-[82px]">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 md:gap-4 text-center">
            <div className="flex items-center gap-2">
              <ShieldCheck size={16} className="text-emerald-400" />
              <span className="text-[#D5A021] font-bold text-xs uppercase tracking-wider">
                DIE SCHWEIZER SUCH- & BUCHUNGSMASCHINE:
              </span>
            </div>
            <span className="text-gray-200 text-xs md:text-sm">
              Alle Online-Inserate der Schweiz in einer Suche · Bereinigt um Fake-Dubletten · Direkt buchbar zum Fixpreis
            </span>
          </div>
        </div>
      </div>

      <section className="relative py-16 md:py-24 overflow-hidden">
        <motion.div className="absolute inset-0" style={{ y: backgroundY }}>
          <motion.div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: "url('https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&h=1080&fit=crop&q=80')",
              scale: backgroundScale,
              opacity: backgroundOpacity
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0D1B2A]/85 via-black/75 to-[#0D1B2A]/95" />
        </motion.div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-5xl mx-auto text-center space-y-7"
          >
            <motion.div variants={itemVariants} className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#C69C6D]/40 bg-[#C69C6D]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#D5A021]">
                Der Schweizer Escort-Index · Alle Profile · Echte Endpreise
              </div>
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight">
                <span className="text-white drop-shadow-2xl">Eine Suche für die ganze Schweiz.</span>
                <br />
                <span className="bg-gradient-to-r from-[#C69C6D] via-[#F3D078] to-[#D5A021] bg-clip-text text-transparent drop-shadow-2xl">
                  Vergleichen & Direkt Buchen.
                </span>
              </h1>
              <p className="text-base md:text-lg text-gray-200 max-w-3xl mx-auto">
                Wir bündeln alle verfügbaren Escorts, Studios und Portale der Schweiz an einem Ort: Mit echtem Endpreis-Rechner, automatischer Dubletten-Erkennung und diskreter Sofort-Buchung.
              </p>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Card className="p-4 md:p-6 shadow-2xl bg-white/10 backdrop-blur-md border-white/20 overflow-hidden relative">
                <div className="relative z-10 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    <Select value={selectedGender} onValueChange={setSelectedGender}>
                      <SelectTrigger className="bg-gray-900/80 border-gray-700 text-white">
                        <SelectValue placeholder="Kategorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Kategorien</SelectItem>
                        <SelectItem value="female">Frauen</SelectItem>
                        <SelectItem value="male">Männer</SelectItem>
                        <SelectItem value="trans">Trans</SelectItem>
                        <SelectItem value="couples">Paare</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedCity} onValueChange={setSelectedCity}>
                      <SelectTrigger className="bg-gray-900/80 border-gray-700 text-white">
                        <SelectValue placeholder="Region / Kanton" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Ganze Schweiz (Alle Kantone)</SelectItem>
                        <SelectItem value="zürich">Zürich</SelectItem>
                        <SelectItem value="zug">Zug & Cham</SelectItem>
                        <SelectItem value="winterthur">Winterthur</SelectItem>
                        <SelectItem value="basel">Basel</SelectItem>
                        <SelectItem value="bern">Bern</SelectItem>
                        <SelectItem value="luzern">Luzern</SelectItem>
                        <SelectItem value="geneva">Genf / Genève</SelectItem>
                        <SelectItem value="lausanne">Lausanne</SelectItem>
                        <SelectItem value="st-gallen">St. Gallen</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedService} onValueChange={setSelectedService}>
                      <SelectTrigger className="bg-gray-900/80 border-gray-700 text-white">
                        <SelectValue placeholder="Gewünschter Service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Alle Services</SelectItem>
                        <SelectItem value="gfe">Girlfriend Experience (GFE)</SelectItem>
                        <SelectItem value="dinner">Dinner Date</SelectItem>
                        <SelectItem value="outcall">Hotel- & Hausbesuch</SelectItem>
                        <SelectItem value="massage">Erotische Massage</SelectItem>
                        <SelectItem value="overnight">Overnight</SelectItem>
                        <SelectItem value="events">Events & Begleitung</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select value={selectedOffer} onValueChange={setSelectedOffer}>
                      <SelectTrigger className="bg-gray-900/80 border-gray-700 text-white">
                        <SelectValue placeholder="Buchungsart" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Direktbuchung + Markt-Index</SelectItem>
                        <SelectItem value="sie-sucht-ihn">Sofort direkt buchbar</SelectItem>
                        <SelectItem value="escort-service">High-Class & Agenturen</SelectItem>
                        <SelectItem value="erotik-massage">Studios & Tantra</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D5A021]" size={22} />
                    <Input
                      placeholder="Suchmaschine: Name, Stadt (z.B. Zürich, Zug), Service, Telefonnummer oder Studio..."
                      className="pl-12 pr-12 py-6 bg-gray-900/90 border-gray-700 text-white placeholder:text-gray-400 text-base md:text-lg rounded-xl"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
                      >
                        <X size={20} />
                      </button>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
                    <div className="flex flex-wrap items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                        <input
                          type="checkbox"
                          checked={verifiedPhotos}
                          onChange={(e) => setVerifiedPhotos(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#C69C6D] cursor-pointer"
                        />
                        <span className="text-sm font-medium">Nur geprüfte Originalfotos</span>
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer hover:text-gray-300">
                        <input
                          type="checkbox"
                          checked={videoAds}
                          onChange={(e) => setVideoAds(e.target.checked)}
                          className="w-4 h-4 rounded accent-[#C69C6D] cursor-pointer"
                        />
                        <span className="text-sm font-medium">Direkt online buchbar</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-2 bg-[#C69C6D] px-4 py-1.5 rounded-full">
                      <span className="text-[#0D1B2A] font-black text-sm md:text-base">
                        {filteredCount} Profile im Live-Index
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-6">
              <Button
                size="lg"
                className="bg-[#C69C6D] text-[#0D1B2A] hover:bg-[#b5895a] font-black text-base px-8 py-6 shadow-2xl w-full sm:w-auto"
                onClick={() => document.getElementById('decision-engine')?.scrollIntoView({ behavior: 'smooth' })}
              >
                <Users size={20} className="mr-2" />
                Endpreise vergleichen & Direkt buchen
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-white/40 bg-white/10 hover:bg-white/20 text-white font-bold text-base px-8 py-6 w-full sm:w-auto"
                asChild
              >
                <Link href="/create-post">
                  <PlusCircle size={20} className="mr-2" />
                  Profil übernehmen / Inserieren
                </Link>
              </Button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-6 mt-4 text-white/90 text-xs md:text-sm">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-emerald-400 rounded-full animate-pulse" />
                <span><strong className="text-white">Schweizweiter Meta-Index</strong> + Verifizierte Direktbuchung</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              <div className="flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-400" />
                <span><strong className="text-white">Cross-Portal Dubletten-Schutz</strong> gegen Mehrfach-Inserate</span>
              </div>
              <div className="hidden sm:block w-px h-4 bg-white/30" />
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-[#D5A021]" />
                <span><strong className="text-white">Garantierter Endpreis</strong> vor der Buchungsanfrage</span>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

