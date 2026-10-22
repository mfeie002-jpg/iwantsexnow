import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SEO from "@/components/SEO";
import { MobileNav } from "@/components/MobileNav";
import { Heart, MapPin, Star, Shield, CheckCircle, Phone, MessageCircle, X, ArrowLeft, Calendar, Clock, Award, DollarSign, Languages, Ruler, Video, Eye } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/router";

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

export default function CompareEscorts() {
  const router = useRouter();
  const { ids } = router.query;
  const [selectedEscorts, setSelectedEscorts] = useState<Escort[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);

  // All escorts data (would come from API in production)
  const allEscorts: Escort[] = [
    {
      id: 1,
      name: "Sophia",
      age: 26,
      district: "Zürich City Center",
      location: "Paradeplatz, Zürich",
      image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 127,
      rate: 500,
      services: ["GFE", "Dinner Dates", "Overnight"],
      languages: ["German", "English", "French"],
      description: "Sophisticated companion in Zürich's financial district.",
      hasVideo: true,
      hasVirtualTour: true,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Athletic",
      height: "168 cm",
      responseTime: "< 5 min",
      bookingsToday: 3
    },
    {
      id: 2,
      name: "Isabella",
      age: 24,
      district: "Zürich West",
      location: "Hardbrücke, Zürich",
      image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 4.9,
      reviews: 203,
      rate: 600,
      services: ["PSE", "Tantra", "Couples"],
      languages: ["Italian", "English", "German"],
      description: "Adventurous escort in trendy Zürich West.",
      hasVideo: true,
      hasVirtualTour: false,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Slim",
      height: "165 cm",
      responseTime: "< 10 min",
      bookingsToday: 5
    },
    {
      id: 4,
      name: "Mia",
      age: 25,
      district: "Oerlikon",
      location: "Oerlikon Station, Zürich",
      image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 5.0,
      reviews: 189,
      rate: 550,
      services: ["PSE", "Travel", "Events"],
      languages: ["German", "French", "English"],
      description: "Elite escort in North Zürich.",
      hasVideo: true,
      hasVirtualTour: true,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Athletic",
      height: "172 cm",
      responseTime: "< 5 min",
      bookingsToday: 4
    },
    {
      id: 5,
      name: "Lara",
      age: 27,
      district: "Zürich City Center",
      location: "Bahnhofstrasse, Zürich",
      image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=400&h=600&fit=crop",
      verified: true,
      premium: true,
      available: true,
      rating: 4.9,
      reviews: 167,
      rate: 650,
      services: ["GFE", "Dinner Dates", "Shopping"],
      languages: ["German", "English"],
      description: "Elegant companion on famous Bahnhofstrasse.",
      hasVideo: true,
      hasVirtualTour: true,
      verifiedPhotos: true,
      idVerified: true,
      safeDate: true,
      bodyType: "Slim",
      height: "175 cm",
      responseTime: "< 5 min",
      bookingsToday: 2
    }
  ];

  useEffect(() => {
    if (ids) {
      const idArray = (typeof ids === 'string' ? ids.split(',') : ids).map(id => parseInt(id));
      const escorts = allEscorts.filter(e => idArray.includes(e.id));
      setSelectedEscorts(escorts);
    }
  }, [ids]);

  const removeEscort = (id: number) => {
    const newEscorts = selectedEscorts.filter(e => e.id !== id);
    setSelectedEscorts(newEscorts);
    
    const newIds = newEscorts.map(e => e.id).join(',');
    if (newIds) {
      router.push(`/compare-escorts?ids=${newIds}`);
    } else {
      router.push('/escort-zurich');
    }
  };

  const toggleFavorite = (id: number) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(fav => fav !== id) : [...prev, id]
    );
  };

  const ComparisonRow = ({ label, icon: Icon, getValue }: { label: string; icon: any; getValue: (escort: Escort) => React.ReactNode }) => (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 py-4 border-b border-white/10">
      <div className="font-bold text-white flex items-center gap-2">
        <Icon size={18} className="text-pink-500" />
        {label}
      </div>
      {selectedEscorts.map((escort) => (
        <div key={escort.id} className="text-gray-300">
          {getValue(escort)}
        </div>
      ))}
    </div>
  );

  if (selectedEscorts.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <Card className="p-12 text-center bg-white/10 backdrop-blur-md border-white/20 max-w-md">
          <h2 className="text-2xl font-bold text-white mb-4">No Escorts Selected</h2>
          <p className="text-gray-300 mb-6">Please select escorts to compare from the listing page.</p>
          <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold" asChild>
            <Link href="/escort-zurich">Browse Escorts</Link>
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <SEO 
        title="Compare Escorts - Find Your Perfect Match | iWantSexNow.ch"
        description="Compare escort services, rates, and features side-by-side to make the best choice for your needs."
      />

      <header className="border-b border-white/10 backdrop-blur-md bg-black/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
              <Heart className="text-pink-600 fill-pink-600" size={36} />
              <span className="text-2xl font-black text-white">iWantSexNow.ch</span>
            </Link>
            <MobileNav />
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <Button variant="ghost" className="text-white hover:text-pink-500 mb-4" asChild>
                <Link href="/escort-zurich">
                  <ArrowLeft size={18} className="mr-2" />
                  Back to Listings
                </Link>
              </Button>
              <h1 className="text-4xl font-black text-white mb-2">Compare Escorts</h1>
              <p className="text-gray-300">Side-by-side comparison of {selectedEscorts.length} selected escorts</p>
            </div>
          </div>

          {/* Profile Images & Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {selectedEscorts.map((escort) => (
              <motion.div
                key={escort.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 relative group">
                  <button
                    onClick={() => removeEscort(escort.id)}
                    className="absolute top-3 right-3 z-10 bg-red-600 hover:bg-red-700 rounded-full p-2 transition-colors"
                  >
                    <X size={18} className="text-white" />
                  </button>

                  <div className="relative">
                    <img
                      src={escort.image}
                      alt={escort.name}
                      className="w-full h-80 object-cover"
                    />
                    {escort.premium && (
                      <Badge className="absolute top-3 left-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 font-bold">
                        PREMIUM
                      </Badge>
                    )}
                    {escort.available && (
                      <Badge className="absolute bottom-3 right-3 bg-green-500 border-0 animate-pulse">
                        <div className="w-2 h-2 bg-white rounded-full mr-1" />
                        Available
                      </Badge>
                    )}
                  </div>

                  <div className="p-6 space-y-4">
                    <div>
                      <h3 className="text-2xl font-black text-white mb-1">
                        {escort.name}, {escort.age}
                      </h3>
                      <div className="flex items-center gap-2 text-blue-400 text-sm">
                        <MapPin size={14} />
                        <span>{escort.location}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={16} 
                            className={i < Math.floor(escort.rating) ? "text-yellow-500 fill-yellow-500" : "text-gray-500"}
                          />
                        ))}
                      </div>
                      <span className="text-white text-sm font-medium">{escort.rating}</span>
                      <span className="text-white/60 text-xs">({escort.reviews})</span>
                    </div>

                    <div className="text-center py-3 bg-black/40 rounded-lg">
                      <div className="text-2xl font-black text-yellow-500">CHF {escort.rate}</div>
                      <div className="text-xs text-gray-400">per hour</div>
                    </div>

                    <div className="flex gap-2">
                      <Button 
                        size="sm"
                        variant="outline"
                        className="flex-1 text-white border-white/30 hover:bg-white/10"
                        onClick={() => toggleFavorite(escort.id)}
                      >
                        <Heart size={16} className={favorites.includes(escort.id) ? "fill-pink-600 text-pink-600" : ""} />
                      </Button>
                      <Button 
                        size="sm"
                        className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold"
                        asChild
                      >
                        <Link href={`/booking-confirmation?escortId=${escort.id}&escortName=${escort.name}`}>
                          <MessageCircle size={16} className="mr-2" />
                          Book
                        </Link>
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Detailed Comparison Table */}
          <Card className="p-8 bg-white/5 backdrop-blur-sm border-white/10">
            <h2 className="text-2xl font-black text-white mb-6">Detailed Comparison</h2>
            
            <div className="space-y-0">
              <ComparisonRow
                label="Location"
                icon={MapPin}
                getValue={(escort) => escort.district}
              />

              <ComparisonRow
                label="Beispielpreis (pro Stunde)"
                icon={DollarSign}
                getValue={(escort) => <span className="text-yellow-500 font-bold">CHF {escort.rate}</span>}
              />

              <ComparisonRow
                label="Demo-Bewertung"
                icon={Star}
                getValue={(escort) => (
                  <div className="flex items-center gap-1">
                    <Star size={16} className="text-yellow-500 fill-yellow-500" />
                    <span className="font-bold">{escort.rating}</span>
                    <span className="text-gray-500">({escort.reviews})</span>
                  </div>
                )}
              />

              <ComparisonRow
                label="Reaktionszeit (Demo)"
                icon={Clock}
                getValue={() => "Keine echte Erreichbarkeit"}
              />

              <ComparisonRow
                label="Body Type"
                icon={Ruler}
                getValue={(escort) => `${escort.bodyType} • ${escort.height}`}
              />

              <ComparisonRow
                label="Languages"
                icon={Languages}
                getValue={(escort) => escort.languages.join(", ")}
              />

              <ComparisonRow
                label="Services"
                icon={Award}
                getValue={(escort) => (
                  <div className="flex flex-wrap gap-1">
                    {escort.services.map((service, idx) => (
                      <Badge key={idx} variant="outline" className="border-white/20 text-gray-300 text-xs">
                        {service}
                      </Badge>
                    ))}
                  </div>
                )}
              />

              <ComparisonRow
                label="Verification"
                icon={Shield}
                getValue={(escort) => (
                  <div className="space-y-1">
                    {escort.verified && (
                      <div className="flex items-center gap-1 text-green-400 text-sm">
                        <CheckCircle size={14} /> Demo-Profil – nicht geprüft
                      </div>
                    )}
                    {escort.idVerified && (
                      <div className="flex items-center gap-1 text-blue-400 text-sm">
                        <CheckCircle size={14} /> Identität nicht geprüft
                      </div>
                    )}
                    {escort.verifiedPhotos && (
                      <div className="flex items-center gap-1 text-purple-400 text-sm">
                        <CheckCircle size={14} /> Stockfotos / Demo
                      </div>
                    )}
                    {escort.safeDate && (
                      <div className="flex items-center gap-1 text-yellow-400 text-sm">
                        <CheckCircle size={14} /> Demo-Funktion
                      </div>
                    )}
                  </div>
                )}
              />

              <ComparisonRow
                label="Media"
                icon={Video}
                getValue={(escort) => (
                  <div className="space-y-1 text-sm">
                    {escort.hasVideo && (
                      <div className="flex items-center gap-1 text-purple-400">
                        <Video size={14} /> Video Profile
                      </div>
                    )}
                    {escort.hasVirtualTour && (
                      <div className="flex items-center gap-1 text-pink-400">
                        <Eye size={14} /> Virtual Tour
                      </div>
                    )}
                  </div>
                )}
              />

              <ComparisonRow
                label="Availability"
                icon={Calendar}
                getValue={(escort) => (
                  <div>
                    {escort.available ? (
                      <Badge className="bg-green-500 border-0">
                        <div className="w-2 h-2 bg-white rounded-full mr-1" />
                        Available Now
                      </Badge>
                    ) : (
                      <Badge className="bg-gray-600 border-0">
                        Unavailable
                      </Badge>
                    )}
                    <div className="text-xs text-gray-400 mt-1">
                      {escort.bookingsToday} bookings today
                    </div>
                  </div>
                )}
              />
            </div>
          </Card>

          {/* Action Buttons */}
          <div className="mt-8 flex flex-wrap gap-4 justify-center">
            <Button className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 text-white font-bold" asChild>
              <Link href="/escort-zurich">
                Add More Escorts to Compare
              </Link>
            </Button>
            <Button variant="outline" className="border-white/30 text-white hover:bg-white/10" asChild>
              <Link href="/">
                Return Home
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}