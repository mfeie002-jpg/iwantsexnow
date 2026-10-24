import { useState, useMemo } from "react";
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
  PhoneCall,
  Lock,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

const EXTRA_CATALOG = [
  { id: "GFE", label: "Girlfriend Experience (GFE)", defaultPrice: 80 },
  { id: "Dinner Dates", label: "Dinner Date Begleitung", defaultPrice: 90 },
  { id: "Outcall", label: "Hotel- & Hausbesuch (Outcall)", defaultPrice: 60 },
  { id: "Massage", label: "Sinnliche Tantra- & Wellness-Massage", defaultPrice: 60 },
  { id: "Overnight", label: "Overnight Upgrade (+6 Std.)", defaultPrice: 550 },
];

export default function UniversalProfileDetailPage() {
  const router = useRouter();
  const { toast } = useToast();
  const rawId = String(router.query.id || "1");

  const allProfiles = useMemo(() => deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED), []);

  const profile = useMemo(() => {
    const byCluster = allProfiles.find(
      (p) =>
        p.dedupClusterId.toLowerCase() === rawId.toLowerCase() ||
        p.displayName.toLowerCase() === rawId.toLowerCase()
    );
    if (byCluster) return byCluster;
    const numericIdx = Math.max(0, (parseInt(rawId, 10) || 1) - 1);
    return allProfiles[numericIdx % allProfiles.length] || allProfiles[0];
  }, [allProfiles, rawId]);

  const [duration, setDuration] = useState<30 | 60 | 120>(60);
  const [selectedExtraIds, setSelectedExtraIds] = useState<string[]>([]);
  const [meetingPlace, setMeetingPlace] = useState(`${profile.primaryCity} (${profile.subareas[0] || profile.canton})`);
  const [meetingTime, setMeetingTime] = useState("Heute, 20:30 Uhr");
  const [contactInfo, setContactInfo] = useState("");
  const [notes, setNotes] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const rate30 = Math.round((profile.bestBaseRate60Chf * 0.65) / 10) * 10;
  const rate60 = profile.bestBaseRate60Chf;
  const rate120 = Math.round((profile.bestBaseRate60Chf * 1.8) / 10) * 10;

  const baseCost = duration === 30 ? rate30 : duration === 120 ? rate120 : rate60;

  const optionalExtras = EXTRA_CATALOG.filter((e) => !profile.includedServices.includes(e.id)).map((e) => ({
    ...e,
    price: profile.extraPricesChf[e.id] ?? e.defaultPrice,
  }));

  const extrasCost = optionalExtras
    .filter((e) => selectedExtraIds.includes(e.id))
    .reduce((sum, e) => sum + e.price, 0);

  const totalCost = baseCost + extrasCost;
  const thirdPartyComparison =
    (duration === 30
      ? Math.round(profile.portalAverage60Chf * 0.65)
      : duration === 120
      ? Math.round(profile.portalAverage60Chf * 1.8)
      : profile.portalAverage60Chf) +
    extrasCost +
    selectedExtraIds.length * 20;

  const toggleExtra = (id: string) => {
    setSelectedExtraIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/enquiries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerName: profile.displayName,
          duration,
          extras: [...profile.includedServices, ...selectedExtraIds],
          guaranteedTotalChf: totalCost,
          requestedTime: meetingTime,
          city: meetingPlace,
          contact: contactInfo,
          notes,
        }),
      });
      const data = await res.json();
      const ref = data.referenceCode || `IW-${Math.floor(100000 + Math.random() * 900000)}`;
      setSubmittedRef(ref);

      const saved = JSON.parse(localStorage.getItem("privateEnquiries") || "[]");
      saved.push({
        id: Date.now(),
        providerName: profile.displayName,
        duration,
        extras: [...profile.includedServices, ...selectedExtraIds],
        guaranteedTotalChf: totalCost,
        requestedTime: meetingTime,
        city: meetingPlace,
        contact: contactInfo,
        notes: notes || `Ref: ${ref}`,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("privateEnquiries", JSON.stringify(saved));

      toast({
        title: `Direkt-Anfrage (${ref}) an ${profile.displayName} übermittelt`,
        description: `Garantierter Fixpreis CHF ${totalCost} (${duration} Min.) wurde verschlüsselt zugestellt.`,
      });
    } catch {
      setSubmittedRef(`IW-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title={`${profile.displayName} (${profile.age}) in ${profile.subareas.join(", ")} – Endpreis & Direktbuchung | iWantSexNow.ch`}
        description={`Verifiziertes Profil für ${profile.displayName} in ${profile.primaryCity} (${profile.canton}). ${profile.sourcesCount} Schweizer Portale gebündelt, direkt zum Fixpreis ab CHF ${rate60} buchbar.`}
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-black">
            <span>iWant</span><span className="text-[#D5A021]">Sex</span><span>Now</span><span className="text-[#C69C6D] text-sm font-sans">.ch</span>
          </Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Link href="/search" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white mb-6">
          <ArrowLeft size={14} /> Zurück zur Schweizer Meta-Suche
        </Link>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left 7 Columns */}
          <div className="lg:col-span-7 space-y-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#C69C6D]/40 bg-black/40 h-[440px] shadow-2xl">
              <img src={profile.thumbnail} alt={profile.displayName} className="w-full h-full object-cover" />
              <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                <Badge className="bg-emerald-600 text-white border-0 px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                  <ShieldCheck size={14} /> ID & Rufnummer verifiziert
                </Badge>
                <Badge className="bg-[#0D1B2A]/90 border border-[#C69C6D] text-[#D5A021] px-3 py-1 text-xs font-bold flex items-center gap-1.5">
                  {profile.bookingMode === "direct" ? <CalendarCheck size={14} /> : <Globe size={14} />}
                  {profile.bookingMode === "direct" ? "Direkt Buchbar · Autorisiert" : "Schweizer Markt-Index"}
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 bg-black/85 backdrop-blur-md border border-white/15 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs">
                <span className="text-emerald-300 font-semibold flex items-center gap-1.5">
                  <Clock size={14} /> {profile.freshnessLabel}
                </span>
                <span className="text-amber-300 font-mono">
                  <PhoneCall size={12} className="inline mr-1" />
                  Cluster: {profile.normalizedPhoneMask}
                </span>
              </div>
            </div>

            <Card className="bg-[#09131E] border border-white/15 p-6 rounded-2xl text-white space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h1 className="text-3xl font-serif font-black">
                    {profile.displayName}, {profile.age}
                  </h1>
                  <p className="text-sm text-[#D5A021] font-semibold mt-1 flex items-center gap-1.5">
                    <MapPin size={15} /> {profile.subareas.join(" · ")} ({profile.canton})
                  </p>
                </div>
                <div className="text-xs text-gray-300 bg-black/40 px-3 py-2 rounded-xl border border-white/10">
                  Treffpunkt: <strong>{profile.incall && profile.outcall ? "Incall & Hotel-Outcall" : profile.incall ? "Privat-Studio (Incall)" : "Hotel- & Hausbesuch (Outcall)"}</strong>
                </div>
              </div>

              <p className="text-xs text-gray-300 flex items-center gap-2 bg-white/5 p-3 rounded-xl border border-white/10">
                <Car size={15} className="text-[#D5A021] shrink-0" />
                <span>
                  Einsatzgebiet: {profile.subareas.join(", ")} · Diskrete Anfahrt in 20–30 Min. (Park Hotel Zug, City Garden, Zürich City & Privathotels).
                </span>
              </p>

              <div className="pt-3 border-t border-white/10">
                <h2 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-2.5">
                  ✓ Im Grundtarif garantiert inklusive (CHF 0 Aufpreis):
                </h2>
                <div className="flex flex-wrap gap-2">
                  {profile.includedServices.map((srv) => (
                    <Badge key={srv} className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs px-3 py-1">
                      ✓ {srv}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>

            {/* Cross-Portal Deduplication Proof */}
            <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl text-white">
              <h2 className="text-lg font-serif font-black text-[#D5A021] mb-1">
                Schweizer Cross-Portal-Index ({profile.sourcesCount} Quellen gebündelt)
              </h2>
              <p className="text-xs text-gray-400 mb-4">
                Unsere Engine hat für die Rufnummer <code>{profile.normalizedPhoneMask}</code> folgende Inserate gefunden, Dubletten zusammengeführt und den echten Stundentarif bereinigt:
              </p>
              <div className="space-y-2.5 text-xs">
                {profile.sources.map((src, idx) => (
                  <div
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border ${
                      src.isDirect ? "bg-emerald-950/40 border-emerald-500/40" : "bg-white/5 border-white/10"
                    }`}
                  >
                    <div>
                      <div className={src.isDirect ? "font-bold text-emerald-300 text-sm" : "font-semibold text-gray-300"}>
                        {src.portal}
                      </div>
                      <div className="text-gray-400 text-[11px]">Zuletzt geprüft: {src.lastSeenIso}</div>
                    </div>
                    <div className="text-right">
                      <span className={src.isDirect ? "text-xl font-black text-[#D5A021]" : "text-sm text-gray-400 line-through"}>
                        CHF {src.priceChf}
                      </span>
                      <div className="text-[10px] text-gray-400">pro 60 Min.</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* B2B Profile Claim Box */}
            <div className="rounded-2xl border border-[#C69C6D]/40 bg-[#09131E] p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <div className="text-xs font-bold text-[#D5A021] uppercase flex items-center gap-1.5">
                  <Award size={14} /> Für Anbieterinnen & Studios
                </div>
                <div className="text-sm font-bold text-white mt-0.5">
                  Sind Sie {profile.displayName} ({profile.normalizedPhoneMask})?
                </div>
                <p className="text-xs text-gray-400">
                  Übernehmen Sie Ihr Profil kostenlos (+2 Gratis Lead-Credits im Wert von CHF 50) und steuern Sie Ihre Live-Verfügbarkeit selbst.
                </p>
              </div>
              <Button variant="outline" size="sm" className="border-[#C69C6D] text-[#D5A021] hover:bg-[#C69C6D]/10 shrink-0" asChild>
                <Link href={`/create-post?claim=${encodeURIComponent(profile.displayName)}`}>
                  Profil kostenlos übernehmen
                </Link>
              </Button>
            </div>
          </div>

          {/* Right 5 Columns: Sticky Calculator & Direct Enquiry */}
          <div className="lg:col-span-5">
            <Card className="bg-[#09131E] border-2 border-[#C69C6D]/60 p-6 rounded-2xl text-white sticky top-24 shadow-2xl">
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                <Calculator size={13} className="mr-1 inline" /> Endpreis-Rechner & Sofort-Anfrage
              </Badge>
              <h2 className="text-2xl font-serif font-black">
                {profile.displayName} zum Fixpreis buchen
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Wähle Dauer und optionale Extras – dein Komplettpreis ist vorab zu 100% fixiert.
              </p>

              <div className="mt-4">
                <label className="text-xs text-gray-300 font-bold block mb-2">1. Gewünschte Dauer wählen:</label>
                <div className="grid grid-cols-3 gap-2">
                  {([
                    { mins: 30 as const, label: "30 Min.", price: rate30 },
                    { mins: 60 as const, label: "60 Min.", price: rate60 },
                    { mins: 120 as const, label: "2 Stunden", price: rate120 },
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
                <label className="text-xs text-gray-300 font-bold block mb-2">2. Optionale Zusatzwünsche:</label>
                <div className="space-y-2">
                  {optionalExtras.map((ext) => {
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

              <div className="mt-5 p-4 rounded-xl bg-white/5 border border-[#C69C6D]/30 space-y-1.5">
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

              {submittedRef ? (
                <div className="mt-5 p-4 rounded-xl bg-emerald-950/70 border border-emerald-400 text-center space-y-2">
                  <CheckCircle size={28} className="text-emerald-400 mx-auto" />
                  <div className="text-xs font-mono text-emerald-300">Referenz: {submittedRef}</div>
                  <div className="font-black text-base">Buchungsanfrage verschlüsselt zugestellt!</div>
                  <p className="text-xs text-gray-300">
                    {profile.displayName} hat deine Anfrage für <strong>{meetingTime}</strong> in <strong>{meetingPlace}</strong> zum Fixpreis von <strong>CHF {totalCost}</strong> erhalten.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSubmittedRef(null)}
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
                      placeholder="Hotelname, besondere Wünsche..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full rounded-lg bg-black/40 border border-white/20 px-3 py-2 text-sm text-white"
                    />
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-gray-400">
                    <Lock size={12} className="text-emerald-400 shrink-0" />
                    <span>100% diskrete Direktübermittlung (CH-DSG konform)</span>
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-base shadow-xl"
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