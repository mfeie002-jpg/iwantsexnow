import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, MessageCircle, Star, Shield, CheckCircle, Play, Search } from "lucide-react";
import Link from "next/link";

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
  favorites,
  toggleFavorite,
  resetFilters,
  currentPage,
  totalPages,
  onPageChange
}: EscortGridProps) {
  return (
    <section id="escorts" className="py-16 bg-black/40 backdrop-blur-sm border-y border-white/10">
      <div className="container mx-auto px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-black text-white">
                Geprüfte Direktprofile & Detailvergleich
              </h2>
              <p className="text-sm text-gray-400">
                Alle Profile mit bestätigter Identität, Originalfotos und direkter Kontaktmöglichkeit ohne Agentur-Gebühren.
              </p>
            </div>
            <Link href="/compare-escorts" className="text-sm font-bold text-[#D5A021] hover:underline">
              Tabellarischen Preis- & Portalvergleich öffnen →
            </Link>
          </div>

          <div className="space-y-6 mb-8">
            {escorts.map((escort) => (
              <Card
                key={escort.id}
                className={`overflow-hidden bg-white/5 backdrop-blur-sm border-white/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-[#C69C6D]/50 ${
                  escort.topAd ? 'border-2 border-[#C69C6D]/60 shadow-2xl shadow-black/40' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6 p-6">
                  <div className="relative w-full md:w-80 flex-shrink-0 group">
                    <img
                      src={escort.thumbnail}
                      alt={escort.name}
                      className="w-full h-80 object-cover rounded-lg group-hover:scale-105 transition-transform duration-500"
                    />
                    {escort.topAd && (
                      <div className="absolute top-3 left-3">
                        <Badge className="bg-[#C69C6D] text-[#0D1B2A] border-0 font-black text-xs px-3 py-1.5 shadow-xl">
                          TOP VERIFIZIERT
                        </Badge>
                      </div>
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-black/80 text-amber-300 border border-amber-400/30 text-xs px-2.5 py-1">
                        {escort.portalsCount ? `Auf ${escort.portalsCount} Portalen · Bester Preis hier` : "Direktprofil"}
                      </Badge>
                    </div>
                    <div className="absolute bottom-3 left-3 right-3 flex gap-2 flex-wrap">
                      {escort.verified && (
                        <Badge className="bg-emerald-600 border-0 text-xs text-white">
                          <Shield size={11} className="mr-1" />
                          ID Geprüft
                        </Badge>
                      )}
                      {escort.verifiedPhotos && (
                        <Badge className="bg-blue-600 border-0 text-xs text-white">
                          <CheckCircle size={11} className="mr-1" />
                          100% Echte Fotos
                        </Badge>
                      )}
                      {escort.hasVideo && (
                        <Badge className="bg-purple-600 border-0 text-xs text-white">
                          <Play size={11} className="mr-1" />
                          Video-Check
                        </Badge>
                      )}
                      {escort.available && (
                        <Badge className="bg-emerald-500 border-0 text-xs text-white">
                          <div className="w-2 h-2 bg-white rounded-full mr-1.5 animate-pulse" />
                          Heute verfügbar
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex-1 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 className="text-3xl font-black text-white">
                            {escort.name}, {escort.age}
                          </h3>
                          <Badge className="bg-white/10 text-gray-200 border-0 text-xs">
                            {escort.postedTime}
                          </Badge>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-[#D5A021] text-sm mb-3 font-semibold">
                        <MapPin size={15} />
                        <span>{escort.locations.join(" · ")}</span>
                        <span className="text-gray-400 font-normal">({escort.availability})</span>
                      </div>

                      <p className="text-gray-300 text-base leading-relaxed mb-4">
                        {escort.longDescription}
                      </p>

                      <div className="flex flex-wrap gap-2 mb-3">
                        {escort.services.map((service: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="border-emerald-500/40 bg-emerald-950/30 text-emerald-300 text-xs">
                            ✓ {service} inklusive
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Sprachen: <strong className="text-gray-200">{escort.languages.join(", ")}</strong></span>
                        <span>·</span>
                        <div className="flex items-center gap-1">
                          <Star size={14} className="text-yellow-500 fill-yellow-500" />
                          <span className="text-white font-bold">{escort.rating.toFixed(1)}</span>
                          <span>({escort.reviews} verifizierte Bewertungen)</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-white/10">
                      <div>
                        <div className="text-xs text-gray-400">Direkt-Tarif (1 Std. inkl. Basis-Services)</div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-[#D5A021]">CHF {escort.rate}</span>
                          {escort.portalAvgRate && (
                            <span className="text-xs text-gray-400 line-through">
                              Drittportale Ø CHF {escort.portalAvgRate}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-white border-white/30 hover:bg-white/10"
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(escort.id);
                          }}
                        >
                          <Heart size={16} className={favorites.includes(escort.id) ? "fill-rose-600 text-rose-600" : ""} />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-bold"
                          asChild
                        >
                          <Link href={`/profile/${escort.id}`}>
                            <MessageCircle size={16} className="mr-2" />
                            Profil & Direkt-Anfrage
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {escorts.length === 0 && (
            <Card className="p-12 text-center bg-white/5 backdrop-blur-sm border-white/10">
              <Search size={64} className="mx-auto text-gray-500 mb-4" />
              <h3 className="text-2xl font-bold text-white mb-2">Keine passenden Profile für diesen Filter</h3>
              <p className="text-gray-400 mb-6">Setze die Filter zurück, um alle verifizierten Anbieterinnen in Zürich, Zug & Schweiz zu sehen.</p>
              <Button onClick={resetFilters} className="bg-[#C69C6D] text-[#0D1B2A] font-bold hover:bg-[#b5895a]">
                Alle Filter zurücksetzen
              </Button>
            </Card>
          )}
        </div>
      </div>
    </section>
  );
}
