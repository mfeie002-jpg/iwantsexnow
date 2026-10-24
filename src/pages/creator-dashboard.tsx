import { useState, useEffect } from "react";
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
  Bell,
  TrendingUp,
  MapPin,
  Calculator,
  RefreshCw,
  Check,
  X,
  Globe,
  Lock,
  Unlock,
  Coins,
  Zap,
} from "lucide-react";

interface IncomingLead {
  id: number;
  providerName: string;
  duration: number;
  extras: string[];
  guaranteedTotalChf: number;
  requestedTime: string;
  city: string;
  contact: string;
  notes: string;
  createdAt: string;
  status?: "new" | "accepted" | "declined";
  unlocked?: boolean;
}

const DEFAULT_DEMO_LEADS: IncomingLead[] = [
  {
    id: 901,
    providerName: "Sophia",
    duration: 120,
    extras: ["GFE", "Dinner Dates", "Outcall"],
    guaranteedTotalChf: 800,
    requestedTime: "Heute, 20:30 Uhr",
    city: "Zug / Park Hotel",
    contact: "+41 79 812 44 19 (Signal / WhatsApp)",
    notes: "Diskreter Hotelbesuch in Zug, Rezeption informiert.",
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    status: "new",
    unlocked: false,
  },
  {
    id: 902,
    providerName: "Sophia",
    duration: 60,
    extras: ["GFE", "Massage"],
    guaranteedTotalChf: 500,
    requestedTime: "Morgen, 18:00 Uhr",
    city: "Zürich Paradeplatz (Incall)",
    contact: "Threema-ID: CH98K29A",
    notes: "Erstkontakt über Endpreis-Rechner.",
    createdAt: new Date(Date.now() - 95 * 60000).toISOString(),
    status: "accepted",
    unlocked: true,
  },
];

export default function CreatorDashboardPage() {
  const { toast } = useToast();
  const [activeZone, setActiveZone] = useState("Zürich City & Zug (Outcall)");
  const [lastConfirmedMins, setLastConfirmedMins] = useState(1);
  const [rate30, setRate30] = useState(300);
  const [rate60, setRate60] = useState(450);
  const [rate120, setRate120] = useState(800);
  const [includedServices, setIncludedServices] = useState<string[]>(["GFE", "Dinner Dates", "Outcall"]);
  const [leads, setLeads] = useState<IncomingLead[]>(DEFAULT_DEMO_LEADS);
  const [leadCredits, setLeadCredits] = useState<number>(2);

  useEffect(() => {
    const savedCredits = localStorage.getItem("providerLeadCredits");
    if (savedCredits) {
      setLeadCredits(Number(savedCredits));
    }
    const stored = localStorage.getItem("privateEnquiries");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as IncomingLead[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeads([
            ...parsed.map((l) => ({ ...l, status: l.status || ("new" as const), unlocked: false })).reverse(),
            ...DEFAULT_DEMO_LEADS,
          ]);
        }
      } catch {
        // ignore
      }
    }
  }, []);

  const handleUnlockLead = (id: number) => {
    if (leadCredits <= 0) {
      toast({
        title: "Keine Lead-Credits mehr verfügbar",
        description: "Bitte lade dein Lead-Guthaben per TWINT, Swiss QR oder USDT auf.",
      });
      return;
    }
    const nextCredits = leadCredits - 1;
    setLeadCredits(nextCredits);
    localStorage.setItem("providerLeadCredits", String(nextCredits));
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, unlocked: true } : l)));
    toast({
      title: "Kunden-Kontakt erfolgreich freigeschaltet!",
      description: `1 Lead-Credit eingelöst (Restguthaben: ${nextCredits} Credits). Du siehst jetzt die volle Rufnummer / Threema-ID.`,
      duration: 4000,
    });
  };

  const handleConfirmFreshness = () => {
    setLastConfirmedMins(0);
    toast({
      title: "Echtzeit-Verfügbarkeit bestätigt!",
      description: `Dein Profil trägt jetzt den grünen Live-Zeitstempel für ${activeZone}.`,
      duration: 3500,
    });
  };

  const handleLeadAction = (id: number, status: "accepted" | "declined") => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status, unlocked: true } : l)));
    toast({
      title: status === "accepted" ? "Buchungsanfrage bestätigt" : "Anfrage abgelehnt",
      description:
        status === "accepted"
          ? "Der Kunde erhält deine diskrete Terminbestätigung zum vereinbarten Fixpreis."
          : "Die Anfrage wurde archiviert.",
      duration: 2500,
    });
  };

  const toggleIncluded = (srv: string) => {
    setIncludedServices((prev) =>
      prev.includes(srv) ? prev.filter((x) => x !== srv) : [...prev, srv]
    );
  };

  const maskContactString = (raw: string) => {
    if (raw.length <= 6) return "••••••";
    return raw.slice(0, 8) + " •• •• (Gesperrt)";
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Provider Self-Service & Lead-Tresor | iWantSexNow.ch"
        description="Verwalte deine Echtzeit-Verfügbarkeit, Lead-Credits und direkte Fixpreis-Buchungsanfragen."
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

      <main className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
        {/* Top Bar with Credit Balance & 24h Boost Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#09131E] border border-[#C69C6D]/40 rounded-2xl p-6 shadow-2xl">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck size={13} className="mr-1 inline" /> Autorisiertes Direktprofil
              </Badge>
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
                <Coins size={12} className="mr-1 inline" /> Verfügbare Lead-Credits: {leadCredits}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-black">
              Provider Control Center & Lead-Tresor
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Schalte eingehende Fixpreis-Buchungen frei, pinge deine Echtzeit-Verfügbarkeit und verwalte deine Tarife.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              variant="outline"
              className="border-[#C69C6D] text-[#D5A021] hover:bg-[#C69C6D]/10 font-bold"
              asChild
            >
              <Link href="/checkout?plan=credits_5">
                <Coins size={15} className="mr-1.5" /> Lead-Credits / VIP aufladen
              </Link>
            </Button>
            <Button
              onClick={handleConfirmFreshness}
              className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black shadow-xl"
            >
              <RefreshCw size={15} className="mr-2" />
              Jetzt für 4 Std. „Sofort Verfügbar“ pingen
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left 7 Cols: Pay-Per-Lead Inbox */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-black flex items-center gap-2">
                <Bell size={18} className="text-[#D5A021]" />
                Eingegangene Fixpreis-Buchungsanfragen ({leads.length})
              </h2>
              <Link href="/checkout?plan=vip_monthly" className="text-xs text-[#D5A021] underline font-bold">
                Mit VIP-Paket alle Leads automatisch freischalten →
              </Link>
            </div>

            {leads.map((lead) => (
              <Card
                key={lead.id}
                className="p-5 rounded-2xl bg-[#09131E] border border-[#C69C6D]/50 text-white shadow-xl space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-emerald-500 text-[#0D1B2A] font-black text-[11px]">
                        FIXPREIS AKZEPTIERT
                      </Badge>
                      <span className="text-xs text-gray-300">
                        📍 {lead.city} · 🕒 {lead.requestedTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mt-2">
                      {lead.duration} Min. Direktbuchung · Extras: {lead.extras.join(", ")}
                    </h3>
                  </div>

                  <div className="text-right bg-black/40 border border-[#C69C6D]/40 rounded-xl px-3.5 py-2">
                    <div className="text-[10px] text-gray-400 uppercase">Dein Honorar (0% Abzug)</div>
                    <div className="text-2xl font-black text-[#D5A021]">CHF {lead.guaranteedTotalChf}</div>
                  </div>
                </div>

                {/* Contact Unlock Vault */}
                <div className="p-3.5 rounded-xl bg-black/40 border border-white/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block">Hinterlegter Kunden-Kontakt (SMS / WhatsApp / Signal / Threema):</span>
                    {lead.unlocked ? (
                      <strong className="text-emerald-400 text-sm font-mono">{lead.contact}</strong>
                    ) : (
                      <strong className="text-amber-300 text-sm font-mono">{maskContactString(lead.contact)}</strong>
                    )}
                    {lead.notes && <div className="text-gray-300 mt-1">Notiz: {lead.notes}</div>}
                  </div>

                  {!lead.unlocked && (
                    <Button
                      size="sm"
                      onClick={() => handleUnlockLead(lead.id)}
                      className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black text-xs shrink-0"
                    >
                      <Unlock size={13} className="mr-1.5" />
                      Kontakt freischalten (1 Credit)
                    </Button>
                  )}
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLeadAction(lead.id, "declined")}
                    className="border-white/20 text-gray-300 text-xs"
                  >
                    <X size={13} className="mr-1" /> Ablehnen
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleLeadAction(lead.id, "accepted")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-[#0D1B2A] font-black text-xs"
                  >
                    <Check size={13} className="mr-1" /> Termin bestätigen
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Right 5 Cols: Tariff Configurator & 24h Radar Boost */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl text-white space-y-5">
              <div>
                <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                  <Calculator size={13} className="mr-1 inline" /> Endpreis-Rechner Konfiguration
                </Badge>
                <h2 className="text-xl font-serif font-black">
                  Deine Direktbuchungs-Tarife
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-gray-400 block mb-1">30 Min. (CHF)</label>
                  <input
                    type="number"
                    value={rate30}
                    onChange={(e) => setRate30(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-base font-black text-[#D5A021]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">60 Min. (CHF)</label>
                  <input
                    type="number"
                    value={rate60}
                    onChange={(e) => setRate60(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-base font-black text-[#D5A021]"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-400 block mb-1">2 Std. (CHF)</label>
                  <input
                    type="number"
                    value={rate120}
                    onChange={(e) => setRate120(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/40 border border-white/20 px-3 py-2 text-base font-black text-[#D5A021]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 font-bold block mb-2">
                  Im Grundtarif inklusive (CHF 0 Aufpreis):
                </label>
                <div className="flex flex-wrap gap-2">
                  {["GFE", "Dinner Dates", "Outcall", "Massage", "Events"].map((srv) => {
                    const active = includedServices.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => toggleIncluded(srv)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${
                          active
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                            : "bg-black/30 border-white/10 text-gray-400"
                        }`}
                      >
                        {active ? "✓ " : "+ "}{srv}
                      </button>
                    );
                  })}
                </div>
              </div>

              <Button
                onClick={() =>
                  toast({
                    title: "Tarife im Live-Index gespeichert",
                    description: "Dein Endpreis-Rechner wurde aktualisiert.",
                  })
                }
                className="w-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black"
              >
                Tarife speichern
              </Button>
            </Card>

            <Card className="bg-gradient-to-br from-[#16283E] to-[#09131E] border border-[#C69C6D]/50 p-6 rounded-2xl text-white space-y-3">
              <div className="text-xs font-bold uppercase text-[#D5A021] flex items-center gap-1.5">
                <Zap size={14} /> Sofort mehr Buchungen heute Abend?
              </div>
              <h3 className="text-lg font-serif font-black">
                24h „Heute direkt buchbar“ Radar-Boost (CHF 29)
              </h3>
              <p className="text-xs text-gray-300">
                Platziert dein Profil für 24 Stunden ganz vorne im Live-Story-Radar und auf Platz 1 für Suchanfragen in Zürich & Zug.
              </p>
              <Button className="w-full bg-white text-[#0D1B2A] hover:bg-gray-200 font-black text-xs" asChild>
                <Link href="/checkout?plan=boost_24h">24h Radar-Boost aktivieren (CHF 29) →</Link>
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}