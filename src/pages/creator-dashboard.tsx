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
  Clock,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Bell,
  MapPin,
  Calculator,
  RefreshCw,
  Check,
  X,
  PlusCircle,
  Globe,
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
    contact: "+41 79 812 ** ** (Signal / WhatsApp)",
    notes: "Diskreter Hotelbesuch in Zug, Rezeption informiert.",
    createdAt: new Date(Date.now() - 14 * 60000).toISOString(),
    status: "new",
  },
  {
    id: 902,
    providerName: "Sophia",
    duration: 60,
    extras: ["GFE", "Massage"],
    guaranteedTotalChf: 500,
    requestedTime: "Morgen, 18:00 Uhr",
    city: "Zürich Paradeplatz (Incall)",
    contact: "Threema-ID: CH98K2**",
    notes: "Erstkontakt über Endpreis-Rechner.",
    createdAt: new Date(Date.now() - 95 * 60000).toISOString(),
    status: "accepted",
  },
];

export default function CreatorDashboardPage() {
  const { toast } = useToast();
  const [liveStatus, setLiveStatus] = useState(true);
  const [activeZone, setActiveZone] = useState("Zürich City & Zug (Outcall)");
  const [lastConfirmedMins, setLastConfirmedMins] = useState(1);
  const [rate30, setRate30] = useState(300);
  const [rate60, setRate60] = useState(450);
  const [rate120, setRate120] = useState(800);
  const [includedServices, setIncludedServices] = useState<string[]>(["GFE", "Dinner Dates", "Outcall"]);
  const [leads, setLeads] = useState<IncomingLead[]>(DEFAULT_DEMO_LEADS);

  useEffect(() => {
    const stored = localStorage.getItem("privateEnquiries");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as IncomingLead[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setLeads([
            ...parsed.map((l) => ({ ...l, status: l.status || ("new" as const) })).reverse(),
            ...DEFAULT_DEMO_LEADS,
          ]);
        }
      } catch {
        // ignore malformed localStorage
      }
    }
  }, []);

  const handleConfirmFreshness = () => {
    setLastConfirmedMins(0);
    setLiveStatus(true);
    toast({
      title: "Echtzeit-Verfügbarkeit bestätigt!",
      description: `Dein Profil trägt jetzt den grünen Live-Zeitstempel für ${activeZone} und wird im Smart-Matcher ganz oben gerankt.`,
      duration: 3500,
    });
  };

  const handleLeadAction = (id: number, status: "accepted" | "declined") => {
    setLeads((prev) => prev.map((l) => (l.id === id ? { ...l, status } : l)));
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

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Provider Self-Service & Lead Dashboard | iWantSexNow.ch"
        description="Verwalte deine Echtzeit-Verfügbarkeit, Endpreis-Tarife, Portal-Deduplizierung und direkte Buchungsanfragen."
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
        {/* Top Header + 1-Click Freshness Ping */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#09131E] border border-[#C69C6D]/40 rounded-2xl p-6 shadow-2xl">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck size={13} className="mr-1 inline" /> Autorisiertes Direktprofil · ID & Fotos verifiziert
              </Badge>
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
                4 Schweizer Portale gebündelt
              </Badge>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-black">
              Provider Control Center & Lead-Engine
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Steuere deine Live-Sichtbarkeit in Zürich & Zug, pflege deinen echten Endpreis-Rechner und verwalte direkte Buchungsanfragen ohne Agentur-Provision.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <div className="bg-black/40 border border-white/10 rounded-xl px-4 py-2.5 text-xs">
              <div className="text-gray-400">Aktueller Freshness-Status:</div>
              <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                {lastConfirmedMins === 0 ? "Gerade eben bestätigt" : `Vor ${lastConfirmedMins} Min. bestätigt`}
              </div>
            </div>
            <Button
              onClick={handleConfirmFreshness}
              className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black px-5 py-6 h-auto shadow-xl"
            >
              <RefreshCw size={16} className="mr-2" />
              Jetzt für 4 Std. „Sofort Verfügbar“ pingen
            </Button>
          </div>
        </div>

        {/* KPI Row */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#09131E] border-white/15 p-5 text-white rounded-2xl">
            <div className="text-xs text-gray-400 flex items-center justify-between">
              <span>Qualifizierte Direkt-Anfragen</span>
              <Bell size={15} className="text-[#D5A021]" />
            </div>
            <div className="text-3xl font-black text-[#D5A021] mt-2">{leads.length} Leads</div>
            <div className="text-xs text-emerald-400 mt-1">100% mit vorab akzeptiertem Endpreis</div>
          </Card>

          <Card className="bg-[#09131E] border-white/15 p-5 text-white rounded-2xl">
            <div className="text-xs text-gray-400 flex items-center justify-between">
              <span>Smart-Matcher Impressionen</span>
              <TrendingUp size={15} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">1,420</div>
            <div className="text-xs text-gray-400 mt-1">Top-3 Platzierung in Zürich & Zug</div>
          </Card>

          <Card className="bg-[#09131E] border-white/15 p-5 text-white rounded-2xl">
            <div className="text-xs text-gray-400 flex items-center justify-between">
              <span>Eliminierte Fremd-Dubletten</span>
              <Globe size={15} className="text-sky-400" />
            </div>
            <div className="text-3xl font-black text-white mt-2">3 Portale</div>
            <div className="text-xs text-amber-300 mt-1">xdate, fgirl & and6 auf Direktprofil geleitet</div>
          </Card>

          <Card className="bg-[#09131E] border-white/15 p-5 text-white rounded-2xl">
            <div className="text-xs text-gray-400 flex items-center justify-between">
              <span>Aktive Einsatz-Region</span>
              <MapPin size={15} className="text-[#D5A021]" />
            </div>
            <input
              type="text"
              value={activeZone}
              onChange={(e) => setActiveZone(e.target.value)}
              className="mt-2 w-full rounded-lg bg-black/40 border border-white/15 px-2.5 py-1.5 text-sm font-bold text-white"
            />
            <div className="text-[11px] text-gray-400 mt-1">Steuert das Geo-Routing für Outcalls</div>
          </Card>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left 7 Cols: Live Private Enquiry Inbox */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-serif font-black flex items-center gap-2">
                <Bell size={18} className="text-[#D5A021]" />
                Eingegangene Direktbuchungs-Anfragen (Private Enquiries)
              </h2>
              <span className="text-xs text-gray-400">Echtzeit-Sync aktiv</span>
            </div>

            {leads.map((lead) => (
              <Card
                key={lead.id}
                className={`p-5 rounded-2xl border transition-all text-white ${
                  lead.status === "new"
                    ? "bg-[#09131E] border-[#C69C6D]/60 shadow-xl"
                    : "bg-white/5 border-white/10 opacity-85"
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      {lead.status === "new" && (
                        <Badge className="bg-emerald-500 text-[#0D1B2A] font-black text-[11px]">
                          NEUE ANFRAGE
                        </Badge>
                      )}
                      {lead.status === "accepted" && (
                        <Badge className="bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 text-[11px]">
                          ✓ Bestätigt
                        </Badge>
                      )}
                      {lead.status === "declined" && (
                        <Badge className="bg-rose-950 text-rose-300 text-[11px]">
                          Abgelehnt
                        </Badge>
                      )}
                      <span className="text-xs text-gray-400">
                        📍 {lead.city} · 🕒 {lead.requestedTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mt-2">
                      {lead.duration} Min. Direktbuchung · Wunsch-Optionen: {lead.extras.join(", ")}
                    </h3>
                  </div>

                  <div className="text-right bg-black/40 border border-[#C69C6D]/40 rounded-xl px-3.5 py-2">
                    <div className="text-[10px] text-gray-400 uppercase">Fixierter Endpreis</div>
                    <div className="text-2xl font-black text-[#D5A021]">CHF {lead.guaranteedTotalChf}</div>
                  </div>
                </div>

                <div className="mt-3 p-3 rounded-xl bg-black/30 border border-white/10 text-xs space-y-1">
                  <div>
                    <span className="text-gray-400">Verifizierter Kunden-Kontakt:</span>{" "}
                    <strong className="text-emerald-300">{lead.contact}</strong>
                  </div>
                  {lead.notes && (
                    <div>
                      <span className="text-gray-400">Nachricht / Hotel-Info:</span>{" "}
                      <span className="text-gray-200">{lead.notes}</span>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleLeadAction(lead.id, "declined")}
                    className="border-white/20 text-gray-300 hover:bg-white/10 text-xs"
                  >
                    <X size={14} className="mr-1" /> Ablehnen
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleLeadAction(lead.id, "accepted")}
                    className="bg-emerald-500 hover:bg-emerald-600 text-[#0D1B2A] font-black text-xs"
                  >
                    <Check size={14} className="mr-1" /> Termin zum Fixpreis bestätigen
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Right 5 Cols: Transparent Total Cost Tariff Configurator */}
          <div className="lg:col-span-5 space-y-6">
            <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl text-white space-y-5">
              <div>
                <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                  <Calculator size={13} className="mr-1 inline" /> Endpreis-Rechner Konfiguration
                </Badge>
                <h2 className="text-xl font-serif font-black">
                  Deine Direktbuchungs-Tarife & Inklusiv-Services
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Diese Werte speisen live den Endpreis-Rechner auf der Startseite und verhindern Preis-Missverständnisse vor dem Treffen.
                </p>
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
                  Im Grundtarif inklusive (CHF 0 Aufpreis im Rechner):
                </label>
                <div className="flex flex-wrap gap-2">
                  {["GFE", "Dinner Dates", "Outcall", "Massage", "Events"].map((srv) => {
                    const active = includedServices.includes(srv);
                    return (
                      <button
                        key={srv}
                        type="button"
                        onClick={() => toggleIncluded(srv)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${
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
                    title: "Tarife & Inklusiv-Leistungen gespeichert",
                    description: "Dein Endpreis-Rechner wurde im gesamten Schweizer Index aktualisiert.",
                  })
                }
                className="w-full bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black"
              >
                Tarife im Live-Index aktualisieren
              </Button>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}