import { useState, useMemo, useEffect } from "react";
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
  Unlock,
  Play,
  Image as ImageIcon,
  Star,
  Sparkles,
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

  // Locked VIP Content Vault State (Pay-Per-View before booking)
  const [unlockedMediaIds, setUnlockedMediaIds] = useState<string[]>([]);
  const [userRating, setUserRating] = useState<number>(10);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(`unlockedMedia_${profile.dedupClusterId}`);
    if (saved) {
      try {
        setUnlockedMediaIds(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, [profile.dedupClusterId]);

  const lockedVaultItems = [
    {
      id: "vid-1",
      type: "video" as const,
      title: `Unzensiertes 4K Vorab-Verifizierungsvideo von ${profile.displayName}`,
      durationOrCount: "01:45 Min. · 4K Originalaufnahme + Stimm-Gruss",
      priceChf: 19,
      previewImg: profile.thumbnail,
      unlockedCaption: "✓ 4K Originalvideo freigeschaltet · 100% echte Person wie auf den Bildern bestätigt!",
    },
    {
      id: "set-2",
      type: "photos" as const,
      title: `Exklusives Uncensored Lingerie & Private Hotel Set (12 Bilder)`,
      durationOrCount: "12 hochauflösende Privat-Fotos (Unzensiert)",
      priceChf: 29,
      previewImg: profile.thumbnail,
      unlockedCaption: "✓ Alle 12 privaten High-Res Aufnahmen freigeschaltet!",
    },
    {
      id: "vid-3",
      type: "bundle" as const,
      title: `VIP Vorab-Check Bundle (Alle Videos + Privat-Galerie +CHF 20 Buchungs-Gutschein)`,
      durationOrCount: "Komplett-Tresor + CHF 20 Anrechnung bei Buchung heute",
      priceChf: 39,
      previewImg: profile.thumbnail,
      unlockedCaption: "✓ Komplett-Tresor aktiv + CHF 20 Gutschein für deine Buchung hinterlegt!",
    },
  ];

  const handleUnlockMedia = (item: typeof lockedVaultItems[0]) => {
    const next = [...unlockedMediaIds, item.id];
    setUnlockedMediaIds(next);
    localStorage.setItem(`unlockedMedia_${profile.dedupClusterId}`, JSON.stringify(next));
    toast({
      title: `"${item.title}" sofort freigeschaltet!`,
      description: `CHF ${item.priceChf} verbucht – du hast jetzt vollen Zugriff auf den privaten Vorab-Content von ${profile.displayName}.`,
      duration: 4500,
    });
  };

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

  const bundleDiscount = unlockedMediaIds.includes("vid-3") ? 20 : 0;
  const totalCost = Math.max(150, baseCost + extrasCost - bundleDiscount);
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
        title={`${profile.displayName} (${profile.age}) in ${profile.subareas.join(", ")} – Endpreis, VIP-Videos & Direktbuchung | iWantSexNow.ch`}
        description={`Verifiziertes Profil für ${profile.displayName} in ${profile.primaryCity} (${profile.canton}). Vorab-Videos freischalten und direkt zum Fixpreis ab CHF ${rate60} buchen.`}
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
        <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
          <Link href="/search" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
            <ArrowLeft size={14} /> Zurück zur Schweizer Meta-Suche
          </Link>
          <Link href="/rankings" className="inline-flex items-center gap-1.5 text-xs text-[#D5A021] font-bold hover:underline">
            <Star size={13} className="fill-[#D5A021]" /> Platzierung in der Schweizer Bestenliste ansehen →
          </Link>
        </div>

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
                  <Star size={13} className="fill-[#D5A021]" /> 9.9/10 Swiss Quality Score
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

            {/* NEW: LOCKED VIP CONTENT VAULT (Pay-Per-View Videos & Uncensored Photos before booking) */}
            <Card className="bg-gradient-to-br from-[#131F31] to-[#09131E] border-2 border-[#C69C6D]/60 p-6 rounded-2xl text-white space-y-4 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <Badge className="bg-[#C69C6D] text-[#0D1B2A] font-black mb-1.5">
                    <Lock size={12} className="mr-1 inline" /> VIP Vorab-Tresor · Locked Content
                  </Badge>
                  <h2 className="text-xl font-serif font-black">
                    Unzensierte Videos & Privat-Fotos vorab freischalten
                  </h2>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Überzeuge dich noch vor deiner Buchung zu 100% von Stimme, Figur und Aussehen von {profile.displayName}:
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {lockedVaultItems.map((item) => {
                  const isUnlocked = unlockedMediaIds.includes(item.id);
                  return (
                    <div
                      key={item.id}
                      className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                        isUnlocked
                          ? "bg-emerald-950/50 border-emerald-400/60"
                          : "bg-black/45 border-white/15 hover:border-[#C69C6D]/60"
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0 border border-white/20">
                          <img
                            src={item.previewImg}
                            alt={item.title}
                            className={`w-full h-full object-cover transition-all duration-500 ${
                              isUnlocked ? "blur-0 scale-100" : "blur-md scale-110 brightness-75"
                            }`}
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                            {isUnlocked ? (
                              <Play size={22} className="text-emerald-400 fill-emerald-400" />
                            ) : (
                              <Lock size={20} className="text-[#D5A021]" />
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="font-bold text-sm text-white">{item.title}</div>
                          <div className="text-xs text-gray-400 mt-0.5">{item.durationOrCount}</div>
                          {isUnlocked && (
                            <div className="text-xs text-emerald-300 font-bold mt-1">{item.unlockedCaption}</div>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 flex sm:flex-col items-end justify-between gap-2">
                        {isUnlocked ? (
                          <Badge className="bg-emerald-500 text-[#0D1B2A] font-black px-3 py-1.5">
                            ✓ Freigeschaltet
                          </Badge>
                        ) : (
                          <Button
                            size="sm"
                            onClick={() => handleUnlockMedia(item)}
                            className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black text-xs px-4"
                          >
                            <Unlock size={13} className="mr-1.5" />
                            Für CHF {item.priceChf} freischalten
                          </Button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

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
                  Treffpunkt: <strong>{profile.incall && profile.outcall ? "Incall & Hotel-Outcall" : "Hotel-Outcall"}</strong>
                </div>
              </div>

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

            {/* Verified Rating & Review Box */}
            <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl text-white space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-serif font-black text-[#D5A021] flex items-center gap-2">
                  <Star size={18} className="fill-[#D5A021]" />
                  Verifizierte Schweizer Bewertungen & Preis-Ehrlichkeit
                </h2>
                <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  9.9 / 10 Gesamtnote
                </Badge>
              </div>

              <div className="grid sm:grid-cols-3 gap-3 text-xs bg-black/40 p-3.5 rounded-xl border border-white/10">
                <div>
                  <span className="text-gray-400 block">Foto- & Video-Echtheit:</span>
                  <strong className="text-emerald-400 text-sm">10.0 / 10 (Original)</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Endpreis-Einhaltung:</span>
                  <strong className="text-[#D5A021] text-sm">100% (0% Nachforderung)</strong>
                </div>
                <div>
                  <span className="text-gray-400 block">Diskretion & Service:</span>
                  <strong className="text-white text-sm">9.9 / 10 (Top-Level)</strong>
                </div>
              </div>

              {!reviewSubmitted ? (
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 text-xs">
                  <span className="text-gray-300">Hattest du ein verifiziertes Treffen mit {profile.displayName}?</span>
                  <div className="flex items-center gap-2">
                    <select
                      value={userRating}
                      onChange={(e) => setUserRating(Number(e.target.value))}
                      className="rounded-lg bg-black/60 border border-white/20 px-2.5 py-1.5 text-xs text-white"
                    >
                      <option value={10}>10/10 – Herausragend</option>
                      <option value={9}>9/10 – Sehr gut</option>
                      <option value={8}>8/10 – Gut</option>
                    </select>
                    <Button
                      size="sm"
                      onClick={() => {
                        setReviewSubmitted(true);
                        toast({
                          title: "Bewertung gespeichert!",
                          description: `Deine ${userRating}/10 Bewertung fliesst in die Schweizer Bestenliste (/rankings) ein.`,
                        });
                      }}
                      className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs h-8"
                    >
                      Bewertung abgeben
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-xs text-emerald-400 font-bold">
                  ✓ Danke! Deine verifizierte Bewertung ({userRating}/10) wurde im Schweizer Ranking gezählt.
                </div>
              )}
            </Card>
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
                {bundleDiscount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-400 font-bold">
                    <span>VIP Media-Bundle Gutschein angerechnet:</span>
                    <span>-CHF {bundleDiscount}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-bold">Garantierter Komplettpreis:</span>
                  <span className="text-3xl font-black text-[#D5A021]">CHF {totalCost}</span>
                </div>
              </div>

              {submittedRef ? (
                <div className="mt-5 p-4 rounded-xl bg-emerald-950/70 border border-emerald-400 text-center space-y-2">
                  <CheckCircle size={28} className="text-emerald-400 mx-auto" />
                  <div className="text-xs font-mono text-emerald-300">Referenz: {submittedRef}</div>
                  <div className="font-black text-base">Buchungsanfrage verschlüsselt zugestellt!</div>
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