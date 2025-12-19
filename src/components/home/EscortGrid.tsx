import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, MessageCircle, Star, Shield, CheckCircle, Play, Search } from "lucide-react";

interface Escort {
  id: number;
  name: string;
  age: number;
  location: string;
  locations: string[];
  images: string[];
  thumbnail: string;
  verified: boolean;
  premium: boolean;
  topAd: boolean;
  available: boolean;
  rating: number;
  reviews: number;
  rate: number;
  services: string[];
  serviceType: string;
  languages: string[];
  bodyType: string;
  height: string;
  bio: string;
  longDescription: string;
  availability: string;
  postedTime: string;
  hasVideo: boolean;
  verifiedPhotos: boolean;
}

interface EscortGridProps {
  escorts: Escort[];
  isLoadingMore: boolean;
  hasMore: boolean;
  handleLoadMore: () => void;
  openLightbox: (escort: Escort, index: number) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  resetFilters: () => void;
}

export function EscortGrid({
  escorts,
  isLoadingMore,
  hasMore,
  handleLoadMore,
  openLightbox,
  favorites,
  toggleFavorite,
  resetFilters
}: EscortGridProps) {
  return (
    <section id="escorts" className="py-20 bg-black/40 backdrop-blur-sm border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 mb-8">
            {escorts.map((escort) => (
              <Card 
                key={escort.id} 
                className={`overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 cursor-pointer transform
                  hover:-translate-y-1 hover:shadow-2xl hover:border-yellow-500 hover:shadow-yellow-500/20
                  ${escort.topAd ? 'border-2 border-yellow-500 shadow-2xl shadow-yellow-500/20' : ''}`}
                onClick={() => openLightbox(escort, 0)}
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  {/* Image Section */}
                  <div className="relative w-full md:w-80 flex-shrink-0 group">
                    <img
                      src={escort.thumbnail}
                      alt={escort.name}
                      className="w-full h-80 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {escort.topAd && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black border-0 font-black text-base px-4 py-2 shadow-2xl">
                          TOP AD
                        </Badge>
                      </div>
                    )}

                    {escort.premium && !escort.topAd && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white border-0 font-bold text-sm px-3 py-1.5 shadow-xl">
                          PREMIUM
                        </Badge>
                      </div>
                    )}

                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/70 text-white border-0 text-xs px-2 py-1">
                        {escort.postedTime}
                      </Badge>
                    </div>

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
                    <div>
                      <div className="flex items-start gap-3 mb-2">
                        <h3 className="text-3xl font-black text-white hover:text-pink-500 transition-colors">
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
                      
                      <div className="flex items-center gap-2 text-blue-400 text-sm mb-3">
                        <MapPin size={14} />
                        <span className="font-medium hover:text-blue-300 transition-colors cursor-pointer">
                          {escort.locations.join(", ")}
                        </span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-base leading-relaxed line-clamp-3">
                      {escort.longDescription}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {escort.services.map((service, idx) => (
                        <Badge key={idx} variant="outline" className="border-white/20 text-gray-300 text-xs hover:bg-white/10 hover:text-white transition-colors cursor-pointer">
                          {service}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {escort.languages.map((lang, idx) => (
                        <span key={idx} className="text-xs text-gray-400">
                          {lang}{idx < escort.languages.length - 1 && ", "}
                        </span>
                      ))}
                    </div>

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
                          className="text-white border-white/30 hover:bg-white/10 hover:border-pink-500 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(escort.id);
                          }}
                        >
                          <Heart size={16} className={favorites.includes(escort.id) ? "fill-pink-600 text-pink-600" : ""} />
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold hover:scale-105 transition-transform"
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

          {hasMore && (
            <div className="text-center">
              <Button
                size="lg"
                onClick={handleLoadMore}
                disabled={isLoadingMore}
                className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold text-lg px-12 hover:scale-105 transition-transform"
              >
                {isLoadingMore ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black mr-2" />
                    Loading...
                  </>
                ) : (
                  <>
                    Load More
                  </>
                )}
              </Button>
            </div>
          )}

          {escorts.length === 0 && (
            <Card className="p-12 text-center bg-white/5 backdrop-blur-sm border-white/10">
              <Search size={64} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Keine Inserate gefunden</h3>
              <p className="text-gray-400 mb-6">Versuche deine Suchkriterien anzupassen</p>
              <Button 
                onClick={resetFilters}
                className="bg-yellow-500 text-black hover:bg-yellow-600"
              >
                Filter zurücksetzen
              </Button>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}