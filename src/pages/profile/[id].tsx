import { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import {
  ShieldCheck,
  Clock,
  MapPin,
  CheckCircle,
  Send,
  ArrowLeft,
  Calculator,
  Car,
  Globe,
  CalendarCheck,
  Award,
} from "lucide-react";

const PROFILE_DATABASE: Record<string, any> = {
  "1": {
    id: 1,
    name: "Sophia",
    age: 26,
    bookingMode: "direct",
    bookingBadge: "Direkt Buchbar · Autorisiert",
    locations: ["Zürich City", "Zug / Baar", "Winterthur"],
    travelInfo: "Incall Zürich City (Paradeplatz/Enge) · Outcall nach Zug & Cham in 25 Min.",
    rating: 5.0,
    reviews: 127,
    rate30: 300,
    rate60: 450,
    rate120: 800,
    portalAvg60: 520,
    freshness: "Vor 12 Min. vom Provider bestätigt · Heute 18:00 – 23:30 Uhr verfügbar",
    languages: ["Deutsch", "English", "Français"],
    height: "168 cm",
    bodyType: "Sportlich-elegant",
    bio: "Verifiziertes Schweizer Direktprofil ohne Agentur-Aufschlag. Direkt über iWantSexNow.ch zum garantierten Endpreis buchbar.",
    includedServices: ["GFE", "Dinner Dates", "Outcall Zürich/Zug", "Events"],
    extraServices: [
      { id: "Massage", label: "Sinnliche Tantra-Massage", price: 50 },
      { id: "Wellness", label: "Private Spa / Hotel-Wellness Begleitung", price: 100 },
      { id: "Overnight", label: "Overnight Upgrade (+6 Std.)", price: 550 },
    ],
    portalSources: [
      { portal: "iWantSexNow.ch (Direktbuchung)", price: 450, status: "Garantierter Direktpreis · 0% Aufschlag", direct: true },
      { portal: "xdate.ch (Index-Abgleich)", price: 500, status: "Gleiche Telefonnummer · +CHF 50 Outcall", direct: false },
      { portal: "fgirl.ch (Index-Abgleich)", price: 520, status: "Agentur-Dublette erkannt", direct: false },
      { portal: "and6.com (Index-Abgleich)", price: 540, status: "Extras separat berechnet", direct: false },
    ],
    images: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=900&h=1200&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1200&fit=crop",
    ],
  },
  "2": {
    id: 2,
    name: "Elena",
    age: 24,
    bookingMode: "direct",
    bookingBadge: "Direkt Buchbar · Autorisiert",
    locations: ["Zug", "Cham", "Zürich", "Luzern"],
    travelInfo: "Diskretes Privat-Appartement in Zug/Cham · Outcall Zürichsee & Luzern (20 Min.)",
    rating: 4.9,
    reviews: 94,
    rate30: 260,
    rate60: 400,
    rate120: 750,
    portalAvg60: 480,
    freshness: "Vor 8 Min. vom Provider bestätigt · Sofort verfügbar in Zug / Zürich",
    languages: ["Deutsch", "English", "Italiano"],
    height: "165 cm",
    bodyType: "Schlank",
    bio: "Exklusive Begleitung im Raum Zug, Cham und Zürichsee mit 100% geprüften Originalbildern und Echtzeit-Kalender.",
    includedServices: ["GFE", "Outcall Zug/Zürich", "Massage"],
    extraServices: [
      { id: "Dinner Dates", label: "Dinner Date Begleitung", price: 60 },
      { id: "Overnight", label: "Overnight Upgrade (+6 Std.)", price: 500 },
    ],
    portalSources: [
      { portal: "iWantSexNow.ch (Direktbuchung)", price: 400, status: "Direktpreis inkl. GFE & Outcall Zug", direct: true },
      { portal: "and6.com (Index-Abgleich)", price: 460, status: "Aufpreis für Hotelbesuch", direct: false },
      { portal: "xdate.ch (Index-Abgleich)", price: 500, status: "Älteres Duplikat-Inserat", direct: false },
    ],
    images: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=900&h=1200&fit=crop",
    ],
  },
  "3": {
    id: 3,
    name: "Emma",
    age: 28,
    bookingMode: "indexed",
    bookingBadge: "Schweizer Markt-Index + Direkt-Anfrage",
    locations: ["Basel City", "Zürich"],
    travelInfo: "Privat-Studio Basel City (5 Min. ab Bahnhof SBB) · Eigene diskrete Parkplätze",
    rating: 4.8,
    reviews: 156,
    rate30: 230,
    rate60: 350,
    rate120: 650,
    portalAvg60: 420,
    freshness: "Vor 27 Min. im Schweizer Live-Index aktualisiert · Heute ab 19:00 Uhr",
    languages: ["Deutsch", "English"],
    height: "170 cm",
    bodyType: "Athletisch",
    bio: "Zertifizierte Tantra- & sinnliche Massage im privaten Studio. Automatisch im Schweizer Markt-Index preisbereinigt.",
    includedServices: ["GFE", "Massage"],
    extraServices: [
      { id: "Outcall", label: "Hotelbesuch (Outcall)", price: 60 },
      { id: "Dinner Dates", label: "Dinner Date Begleitung", price: 80 },
    ],
    portalSources: [
      { portal: "iWantSexNow.ch (Preisbereinigt)", price: 350, status: "Komplettpreis inkl. Tantra & GFE", direct: true },
      { portal: "and6.com (Index-Abgleich)", price: 420, status: "Basis-Inserat ohne Extras", direct: false },
    ],
    images: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=900&h=1200&fit=crop",
    ],
  },
  "4": {
    id: 4,
    name: "Mia",
    age: 25,
    bookingMode: "direct",
    bookingBadge: "Direkt Buchbar · VIP",
    locations: ["Bern", "Zürich", "Zug"],
    travelInfo: "Incall Bern & Zürich · Schweizweiter VIP Hotel-Outcall",
    rating: 5.0,
    reviews: 189,
    rate30: 350,
    rate60: 550,
    rate120: 1000,
    portalAvg60: 650,
    freshness: "Vor 19 Min. vom Provider bestätigt · Heute 17:00 – 23:00 Uhr",
    languages: ["Deutsch", "Français", "English"],
    height: "172 cm",
    bodyType: "Model-Figur",
    bio: "High-Class Dinner & Overnight Companion für Zürich, Zug und Bern. Auf 5 Schweizer Portalen gelistet – hier direkt ohne Vermittlungsgebühr buchbar.",
    includedServices: ["GFE", "Dinner Dates", "Outcall", "Overnight Prep"],
    extraServices: [
      { id: "Massage", label: "Private Wellness & Massage", price: 40 },
    ],
    portalSources: [
      { portal: "iWantSexNow.ch (Direktbuchung)", price: 550, status: "Verifizierter VIP-Direkttarif", direct: true },
      { portal: "xdate.ch (Index-Abgleich)", price: 650, status: "Agentur-Aufschlag +CHF 100", direct: false },
      { portal: "fgirl.ch (Index-Abgleich)", price: 650, status: "Duplikat-Profil", direct: false },
    ],
    images: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=900&h=1200&fit=crop",
    ],
  },
};

export default function ProfileDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const rawId = String(router.query.id || "1");
  const profile = PROFILE_DATABASE[rawId] || PROFILE_DATABASE["1"];

  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [meetingPlace, setMeetingPlace] = useState(profile.locations[0]);
  const [meetingTime, setMeetingTime] = useState("Heute, 20:30 Uhr");
  const [contactInfo, setContactInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const baseCost = duration === 30 ? profile.rate30 : duration === 120 ? profile.rate120 : profile.rate60;
  const extrasCost = profile.extraServices
    .filter((e: any) => selectedExtraIds.includes(e.id))
    .reduce((sum: number, e: any) => sum + e.price, 0);
  const totalCost = baseCost + extrasCost;
  const thirdPartyComparison =
    (duration === 30 ? Math.round(profile.portalAvg60 * 0.65) : duration === 120 ? Math.round(profile.portalAvg60 * 1.8) : profile.portalAvg60) +
    extrasCost;

  const toggleExtra = (id: string) => {
    setSelectedExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast({
      title: `Direkt-Anfrage an ${profile.name} gesendet`,
      description: `Garantierter Fixpreis CHF ${totalCost} (${duration} Min.) wurde verschlüsselt übermittelt.`,
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-[#0D1B2A] text-white">
      <SEO
        title={`${profile.name} (${profile.age}) in ${profile.locations.join(", ")} – Endpreis & Direktbuchung | iWantSexNow.ch`}
        description={profile.bio}
      />
      <header className="border-b border-white/10 bg-[#09131E] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-black">
            <span>iWant</span><span className="text-[#D5A021]">Sex</span><span>Now</span><span className="text-gray-400 text-sm">.ch</span>
          </Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={14} /> Zurück zur Schweizer Suche & Preisübersicht
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-black/40 h-[440px]">
              <img src={profile.images[0]} alt={profile.name} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge className="bg-emerald-600 text-white border-0 px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} /> ID & Originalfotos geprüft
                </Badge>
                <Badge className="bg-[#0D1B2A]/90 border border-[#C69C6D] text-[#D5A021] px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                  {profile.bookingMode === "direct" ? <CalendarCheck size={14} /> : <Globe size={14} />}
                  {profile.bookingBadge}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md border border-white/15 rounded-xl p-3 flex items-center justify-between text-xs">
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Clock size={14} /> {profile.freshness}
                </span>
                <span className="text-yellow-400 font-bold">★ {profile.rating.toFixed(1)} ({profile.reviews})</span>
              </div>
            </div>

            <Card className="bg-white/5 border-white/15 p-6 rounded-2xl text-white space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h1 className="text-3xl font-black">{profile.name}, {profile.age}</h1>
                  <p className="text-sm text-[#D5A021] font-semibold mt-1 flex items-center gap-1.5">
                    <MapPin size={15} /> {profile.locations.join(" · ")}
                  </p>
                </div>
                <div className="text-xs text-gray-300 bg-black/30 px-3 py-2 rounded-xl border border-white/10">
                  Sprachen: <strong>{profile.languages.join(", ")}</strong> · {profile.height}
                </div>
              </div>

              <p className="text-xs text-gray-300 flex items-center gap-2 bg-white/5 p-3 rounded-xl">
                <Car size={15} className="text-[#D5A021] shrink-0" />
                <span>{profile.travelInfo}</span>
              </p>

              <p className="text-gray-200 text-sm leading-relaxed">{profile.bio}</p>

              <div className="pt-3 border-t border-white/10">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5">
                  ✓ Im Grundtarif garantiert inklusive (CHF 0 Aufpreis):
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.includedServices.map((srv: string) => (
                    <Badge key={srv} className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs px-3 py-1">
                      ✓ {srv}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            <Card className="bg-[#09131E] border-[#C69C6D]/40 p-6 rounded-2xl text-white">
              <h2 className="text-lg font-black text-[#D5A021] mb-1">
                Schweizer Cross-Portal-Index & Preisabgleich
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Unsere Suchmaschine hat für {profile.name} folgende Inserate im Schweizer Netz gefunden, auf Dubletten geprüft und den echten Stundentarif verglichen:
              </p>
              <div className="space-y-2.5 text-xs">
                {profile.portalSources.map((src: any, idx: number) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      src.direct ? "bg-emerald-950/40 border-emerald-500/40" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div>
                      <div className={src.direct ? "font-bold text-emerald-300 text-sm" : "font-semibold text-gray-300"}>
                        {src.portal}
                      </div>
                      <div className="text-gray-400 text-[11px]">{src.status}</div>
                    </div>
                    <div className="text-right">
                      <span className={src.direct ? "text-xl font-black text-[#D5A021]" : "text-sm text-gray-400 line-through"}>
                        CHF {src.price}
                      </span>
                      <div className="text-[10px] text-gray-400">pro 60 Min.</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            <div className="rounded-2xl border border-white/15 bg-white/5 p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#D5A021] uppercase flex items-center gap-1.5">
                  <Award size={14} /> Für Anbieterinnen & Studios
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Sind Sie {profile.name} oder vertreten Sie dieses Profil?
                </div>
                <p className="text-xs text-gray-400">
                  Übernehmen Sie Ihr indexiertes Profil kostenlos, um Live-Verfügbarkeiten und Direktbuchungen selbst zu steuern.
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-[#C69C6D] text-[#D5A021] hover:bg-[#C69C6D]/10 shrink-0" asChild>
                <Link href="/verify">Profil verifizieren & übernehmen</Link>
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Card className="bg-[#09131E] border-2 border-[#C69C6D]/60 p-6 rounded-2xl text-white sticky top-24 shadow-2xl">
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                <Calculator size={13} className="mr-1 inline" /> Endpreis-Rechner & Sofort-Anfrage
              </Badge>
              <h2 className="text-2xl font-black">
                Direkt buchen zum Fixpreis
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Wähle Dauer und optionale Extras – dein Preis ist vorab zu 100% transparent fixiert.
              </p>

              <div className="mt-4">
                <label className="text-xs text-gray-300 font-bold block mb-2">1. Gewünschte Dauer wählen:</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { mins: 30 as const, label: "30 Min.", price: profile.rate30 },
                    { mins: 60 as const, label: "60 Min.", price: profile.rate60 },
                    { mins: 120 as const, label: "2 Stunden", price: profile.rate120 },
                  ]).map((d) => (
                    <button
                      key={d.mins}
                      type="button"
                      onClick={() => setDuration(d.mins)}
                      className={`p-2.5 rounded-xl border text-center transition-all ${
                        duration === d.mins
                          ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D] font-black"
                          : "bg-white/5 border-white/15 text-gray-300 hover:border-white/30"
                      }`}
                    >
                      <div className="text-xs">{d.label}</div>
                      <div className="text-sm font-black">CHF {d.price}</div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs text-gray-300 font-bold block mb-2">2. Optionale Zusatzwünsche (falls gewünscht):</label>
                <div className="space-y-2">
                  {profile.extraServices.map((ext: any) => {
                    const active = selectedExtraIds.includes(ext.id);
                    return (
                      <button
                        key={ext.id}
                        type="button"
                        onClick={() => toggleExtra(ext.id)}
                        className={`w-full p-2.5 rounded-xl border text-xs flex items-center justify-between transition-all ${
                          active
                            ? "bg-emerald-500/20 border-emerald-400 text-white"
                            : "bg-white/5 border-white/10 text-gray-300"
                        }`}
                      >
                        <span className="flex items-center gap-2 font-medium">
                          <CheckCircle size={14} className={active ? "text-emerald-400" : "text-gray-500"} />
                          {ext.label}
                        </span>
                        <span className="font-bold text-[#D5A021]">+CHF {ext.price}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-white/5 border border-white/15 space-y-1.5">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Vergleichspreis auf Drittportalen:</span>
                  <span className="line-through">CHF {thirdPartyComparison}</span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold">Garantierter Komplettpreis:</span>
                  <span className="text-3xl font-black text-[#D5A021]">CHF {totalCost}</span>
                </div>
                <div className="text-[11px] text-emerald-400 font-semibold">
                  ✓ Du sparst CHF {Math.max(0, thirdPartyComparison - totalCost)} gegenüber Einzelportalen
                </div>
              </div>

              {submitted ? (
                <div className="mt-5 p-4 rounded-xl bg-emerald-950/70 border border-emerald-400 text-center space-y-2">
                  <CheckCircle size={28} className="text-emerald-400 mx-auto" />
                  <div className="font-black text-base">Buchungsanfrage verschlüsselt übermittelt!</div>
                  <p className="text-xs text-gray-300">
                    {profile.name} hat deine Anfrage für <strong>{meetingTime}</strong> in <strong>{meetingPlace}</strong> zum Fixpreis von <strong>CHF {totalCost}</strong> erhalten.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="border-white/20 text-white mt-2"
                  >
                    Weitere Anfrage senden
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleBookingSubmit} className="mt-4 space-y-3">
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Treffpunkt (Ort / Hotel / Studio)</label>
                    <input
                      type="text"
                      value={meetingPlace}
                      onChange={(e) => setMeetingPlace(e.target.value)}
                      required
                      className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Wunschzeitpunkt</label>
                    <input
                      type="text"
                      value={meetingTime}
                      onChange={(e) => setMeetingTime(e.target.value)}
                      required
                      className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Kontakt für Rückbestätigung (WhatsApp / Signal / SMS / Threema)</label>
                    <input
                      type="text"
                      placeholder="+41 79 ... oder Threema-ID"
                      value={contactInfo}
                      onChange={(e) => setContactInfo(e.target.value)}
                      required
                      className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-300 block mb-1">Diskrete Notiz (optional)</label>
                    <textarea
                      rows={2}
                      placeholder="Besondere Wünsche oder Fragen..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black py-6 text-base shadow-xl"
                  >
                    <Send size={16} className="mr-2" />
                    Jetzt zum Fixpreis (CHF {totalCost}) anfragen
                  </Button>
                </form>
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}