import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, MessageCircle, Star, Shield, CheckCircle, Play, Search, ChevronLeft, ChevronRight } from "lucide-react";

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
  escorts: any[];
  isLoadingMore: boolean;
  hasMore: boolean;
  handleLoadMore: () => void;
  openLightbox: (escort: any, index: number) => void;
  favorites: number[];
  toggleFavorite: (id: number) => void;
  resetFilters: () => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function EscortGrid({
  escorts,
  isLoadingMore,
  hasMore,
  handleLoadMore,
  openLightbox,
  favorites,
  toggleFavorite,
  resetFilters,
  currentPage,
  totalPages,
  onPageChange
}: EscortGridProps) {
  const renderPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);
    
    if (endPage - startPage < maxVisible - 1) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    if (startPage > 1) {
      pages.push(
        <Button
          key={1}
          onClick={() => onPageChange(1)}
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
        >
          1
        </Button>
      );
      if (startPage > 2) {
        pages.push(<span key="start-ellipsis" className="text-white/60 px-2">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(
        <Button
          key={i}
          onClick={() => onPageChange(i)}
          variant={currentPage === i ? "default" : "outline"}
          size="sm"
          className={currentPage === i 
            ? "bg-white text-black font-bold" 
            : "bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"}
        >
          {i}
        </Button>
      );
    }

    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pages.push(<span key="end-ellipsis" className="text-white/60 px-2">...</span>);
      }
      pages.push(
        <Button
          key={totalPages}
          onClick={() => onPageChange(totalPages)}
          variant="outline"
          size="sm"
          className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-white/40"
        >
          {totalPages}
        </Button>
      );
    }

    return pages;
  };

  return (
    <section id="escorts" className="py-20 bg-black/40 backdrop-blur-sm border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="space-y-6 mb-8">
            {escorts.map((escort) => (
              <Card 
                key={escort.id} 
                className={`overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 cursor-pointer transform
                  hover:-translate-y-1 hover:shadow-2xl hover:border-white/30
                  ${escort.topAd ? 'border-2 border-white/40 shadow-2xl shadow-black/40' : ''}`}
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
                        <Badge className="bg-white text-black border-0 font-black text-base px-4 py-2 shadow-2xl">
                          TOP AD
                        </Badge>
                      </div>
                    )}

                    {escort.premium && !escort.topAd && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-gray-700 text-white border-0 font-bold text-sm px-3 py-1.5 shadow-xl">
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
                        <Badge className="bg-gray-600 border-0 text-xs">
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
                        <h3 className="text-3xl font-black text-white hover:text-gray-300 transition-colors">
                          {escort.name}, {escort.age}
                        </h3>
                        {escort.serviceType === "sie-sucht-ihn" && (
                          <Badge className="bg-rose-600 border-0 text-xs flex items-center gap-1">
                            <Heart size={10} fill="white" />
                            Sie sucht ihn
                          </Badge>
                        )}
                        {escort.serviceType === "escort-service" && (
                          <Badge className="bg-gray-600 border-0 text-xs">
                            Escort Service
                          </Badge>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-gray-400 text-sm mb-3">
                        <MapPin size={14} />
                        <span className="font-medium hover:text-gray-300 transition-colors cursor-pointer">
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
                        <div className="text-2xl font-black text-white">CHF {escort.rate}</div>
                        <div className="text-xs text-gray-400">pro Stunde</div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          size="sm"
                          variant="outline"
                          className="text-white border-white/30 hover:bg-white/10 hover:border-white/50 transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(escort.id);
                          }}
                        >
                          <Heart size={16} className={favorites.includes(escort.id) ? "fill-rose-600 text-rose-600" : ""} />
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-white hover:bg-gray-200 text-black font-bold hover:scale-105 transition-transform"
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
              >
                Previous
              </Button>
              
              <div className="flex gap-2">
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
                      onClick={() => onPageChange(pageNum)}
                      className={currentPage === pageNum 
                        ? "bg-pink-600 hover:bg-pink-700" 
                        : "border-white/30 text-white hover:bg-white/10"
                      }
                    >
                      {pageNum}
                    </Button>
                  );
                })}
              </div>

              <Button
                variant="outline"
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="border-white/30 text-white hover:bg-white/10 disabled:opacity-50"
              >
                Next
              </Button>
            </div>
          )}

          {/* Empty State */}
          {escorts.length === 0 && (
            <Card className="p-12 text-center bg-white/5 backdrop-blur-sm border-white/10">
              <Search size={64} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Keine Inserate gefunden</h3>
              <p className="text-gray-400 mb-6">Versuche deine Suchkriterien anzupassen</p>
              <Button 
                onClick={resetFilters}
                className="bg-white text-black hover:bg-gray-200"
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