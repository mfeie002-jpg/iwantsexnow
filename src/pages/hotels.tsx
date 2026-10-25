import { BrandLogo } from "@/components/BrandLogo";
import { useState, useMemo } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  Building2,
  KeyRound,
  Car,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  MapPin,
  Clock,
  Lock,
  ArrowRight,
  Users,
} from "lucide-react";
import { SWISS_DISCREET_HOTELS } from "@/data/swissHotels";
import harvestedV2Hotels from "@/data/harvested-hotels-v2.json";
import { SeoSiloFooter } from "@/components/marketplace/SeoSiloFooter";

export default function SwissDiscreetHotelsPage() {
  const { toast } = useToast();
  const [audienceMode, setAudienceMode] = useState<"ALL" | "client" | "provider">("ALL");
  const [selectedCanton, setSelectedCanton] = useState<string>("ALL");
  const [reservedHotelId, setReservedHotelId] = useState<string | null>(null);

  const filteredHotels = useMemo(() => {
    return SWISS_DISCREET_HOTELS.filter((h) => {
      if (selectedCanton !== "ALL" && h.canton !== selectedCanton) return false;
      if (audienceMode === "client" && h.category === "provider_apartment") return false;
      if (audienceMode === "provider" && h.category !== "provider_apartment" && !h.selfCheckIn) return false;
      return true;
    });
  }, [audienceMode, selectedCanton]);

  const handleSelectHotelForDate = (hotelName: string, city: string, rate: number) => {
    localStorage.setItem(
      "selectedSwissPartnerHotel",
      JSON.stringify({ hotelName, city, rate })
    );
    setReservedHotelId(hotelName);
    toast({
      title: `🏨 ${hotelName} für dein Date vorgemerkt!`,
      description: `Dieses diskrete Hotel (ab CHF ${rate}) wird automatisch in dein Fixpreis-Zertifikat übernommen.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Diskrete Tageszimmer (Day-Use), Outcall-Hotels & Escort-Apartments Schweiz | iWantSexNow.ch"
        description="Kein eigener Treffpunkt? Buche diskrete Schweizer Tageszimmer (Day-Use mit Tiefgaragen-Lift in Zürich, Zug, Cham, Basel) oder Work-Apartments für Escorts & Gigolos."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-7xl space-y-10">
        {/* Hero */}
        <div className="bg-[#09131E] border-2 border-[#C69C6D]/55 rounded-3xl p-6 md:p-10 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="max-w-3xl space-y-2">
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
                <KeyRound size={12} className="mr-1.5 inline" /> Swiss Discreet Room & Suite Concierge · Für Kunden & Models
              </Badge>
              <h1 className="text-3xl md:text-5xl font-serif font-black leading-tight">
                Diskrete Tageszimmer (Day-Use), 5★ Outcall-Hotels & Touring-Apartments
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                Du möchtest weder zu dir nach Hause einladen noch in ein Laufhaus gehen? Oder du bist als <strong>Escort / Gigolo auf Tour</strong> in Zürich & Zug und suchst ein <strong>legales, anonymes Apartment mit Self-Check-in</strong>? Wähle hier die geprüfte Schweizer Location für euer Treffen:
              </p>
            </div>

            <div className="bg-black/50 border border-emerald-500/40 rounded-2xl p-4 text-xs space-y-1.5 max-w-xs">
              <div className="font-black text-emerald-400 uppercase flex items-center gap-1.5">
                <ShieldCheck size={15} /> 100% Diskretions-Kriterien:
              </div>
              <div className="text-gray-300">✓ Direkter Lift aus der Tiefgarage</div>
              <div className="text-gray-300">✓ Digitaler PIN / Self-Check-in ohne Lobby</div>
              <div className="text-gray-300">✓ Tages-Slots (Day-Use ab CHF 125)</div>
            </div>
          </div>

          {/* Dual Audience Switcher (For Clients vs. For Escorts/Gigolos) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-white/10">
            <div className="flex flex-wrap gap-2">
              {[
                { id: "ALL", label: "🏨 Alle diskreten Hotels & Apartments" },
                { id: "client", label: "🥂 Für Kunden & Paare: Tageszimmer (Day-Use) & 5★ Outcall" },
                { id: "provider", label: "🔑 Für Escorts & Gigolos: Work-Apartments & Self-Check-in Studios" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAudienceMode(tab.id as any)}
                  className={`px-4 py-2.5 rounded-xl text-xs font-black border transition-all ${
                    audienceMode === tab.id
                      ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D] shadow-lg"
                      : "bg-black/40 border-white/15 text-gray-300 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <select
              value={selectedCanton}
              onChange={(e) => setSelectedCanton(e.target.value)}
              className="rounded-xl bg-black/60 border border-[#C69C6D]/40 px-3.5 py-2 text-xs font-bold text-[#D5A021]"
            >
              <option value="ALL">📍 Alle Regionen (ZH, ZG, BS)</option>
              <option value="ZG">Zug & Cham (ZG)</option>
              <option value="ZH">Zürich City, Seefeld & Airport (ZH)</option>
              <option value="BS">Basel (BS)</option>
            </select>
          </div>
        </div>

        {/* Hotel & Apartment Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredHotels.map((hotel) => (
            <Card
              key={hotel.id}
              className="bg-[#09131E] border border-[#C69C6D]/45 rounded-2xl overflow-hidden text-white flex flex-col justify-between shadow-2xl"
            >
              <div>
                <div className="relative h-56">
                  <img src={hotel.image} alt={hotel.name} className="w-full h-full object-cover" />
                  <div className="absolute top-3 left-3 bg-emerald-600 text-white text-[11px] font-black px-2.5 py-1 rounded-full">
                    {hotel.category === "provider_apartment"
                      ? "🔑 ESCORT & GIGOLO WORK-APARTMENT"
                      : hotel.category === "dayuse_client"
                      ? "🕒 TAGESZIMMER (DAY-USE)"
                      : "👑 5★ VIP OUTCALL HOTEL"}
                  </div>
                  <div className="absolute top-3 right-3 bg-black/85 border border-[#C69C6D] text-[#D5A021] text-xs font-black px-2.5 py-1 rounded-lg">
                    Diskretion {hotel.discretionScore}/10
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-black/80 rounded-lg px-3 py-1.5 flex items-center justify-between text-xs">
                    <span className="text-gray-300">Day-Use Slot: <strong className="text-emerald-400">CHF {hotel.dayUseRateChf}</strong></span>
                    <span className="text-gray-400">Overnight: CHF {hotel.overnightRateChf}</span>
                  </div>
                </div>

                <div className="p-5 space-y-3">
                  <div>
                    <h2 className="text-xl font-serif font-black leading-snug">{hotel.name}</h2>
                    <p className="text-xs text-[#D5A021] font-semibold mt-0.5">
                      📍 {hotel.addressArea} ({hotel.canton})
                    </p>
                  </div>

                  <p className="text-xs text-gray-300 bg-black/40 p-3 rounded-xl border border-white/10 leading-relaxed">
                    {hotel.receptionPolicy}
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[11px]">
                    {hotel.highlights.map((hl) => (
                      <span
                        key={hl}
                        className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-gray-200"
                      >
                        ✓ {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0 space-y-2">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleSelectHotelForDate(hotel.name, hotel.city, hotel.dayUseRateChf)}
                    className="flex-1 bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black text-xs"
                  >
                    {reservedHotelId === hotel.name ? "✓ Für Date ausgewählt" : "Zimmer zum Date vormerken"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-white/20 text-white hover:bg-white/10 text-xs"
                    asChild
                  >
                    <Link href={`/search?q=${encodeURIComponent(hotel.city)}`}>
                      Escorts vor Ort →
                    </Link>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Live Firecrawl v2 Discovered Swiss Day-Use & Serviced Apartment Directory */}
        {Array.isArray(harvestedV2Hotels) && harvestedV2Hotels.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-1">
                  🌐 Live via Firecrawl v2 Hotel-Radar ({harvestedV2Hotels.length} weitere Adressen)
                </Badge>
                <h2 className="text-2xl font-serif font-black">
                  Weitere geprüfte Schweizer Tageszimmer, Boutique-Hotels & Serviced Apartments
                </h2>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
              {harvestedV2Hotels.slice(0, 12).map((item: any, idx: number) => (
                <Card
                  key={idx}
                  className="bg-[#09131E] border border-white/15 hover:border-[#C69C6D]/60 p-4 rounded-2xl text-white flex flex-col justify-between space-y-2"
                >
                  <div className="space-y-1">
                    <div className="text-[10px] text-[#D5A021] font-bold uppercase">
                      {String(item.query || "Schweiz Day-Use").replace("dayuse hotel ", "📍 ")}
                    </div>
                    <div className="font-bold text-sm text-white line-clamp-2">{item.title}</div>
                    <p className="text-gray-400 text-[11px] line-clamp-2">{item.description}</p>
                  </div>
                  <div className="pt-2 flex items-center justify-between border-t border-white/10">
                    <button
                      type="button"
                      onClick={() => handleSelectHotelForDate(item.title, "Zürich / Zug", 140)}
                      className="text-emerald-400 font-bold hover:underline text-[11px]"
                    >
                      + Für Date vormerken
                    </button>
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-400 hover:text-white underline text-[11px]"
                    >
                      Hotel-Info ↗
                    </a>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* B2B Partner Callout for Hotel & Apartment Owners */}
        <Card className="bg-gradient-to-r from-[#13263B] to-[#09131E] border-2 border-[#C69C6D] p-6 md:p-8 rounded-2xl text-white flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <Badge className="bg-[#C69C6D] text-[#0D1B2A] font-black">
              B2B Partner-Programm für Schweizer Hotels & Apartment-Vermieter
            </Badge>
            <h3 className="text-2xl font-serif font-black">
              Vermietest du diskrete Serviced Apartments, Day-Rooms oder Boutique-Suiten?
            </h3>
            <p className="text-xs sm:text-sm text-gray-300">
              Liste dein Haus als offiziellen <strong>Swiss Shield Treffpunkt</strong> für zahlungskräftige Tageszimmer-Gäste (Day-Use) und reisende High-Class-Begleiterinnen in Zürich, Zug, Basel & Genf.
            </p>
          </div>
          <Button className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs px-6 py-5 shrink-0" asChild>
            <Link href="/checkout?plan=vip_monthly">
              Als Partner-Hotel / Apartment bewerben →
            </Link>
          </Button>
        </Card>
      </main>
      <SeoSiloFooter />
    </div>
  );
}