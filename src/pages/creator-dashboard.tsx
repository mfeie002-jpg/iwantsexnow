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
  Calculator,
  RefreshCw,
  Check,
  X,
  Unlock,
  Coins,
  Zap,
  Lock,
  Video,
  PlusCircle,
  Wallet,
  Radio,
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

interface VaultMediaItem {
  id: string;
  title: string;
  type: "video" | "photos" | "bundle";
  priceChf: number;
  unlockCount: number;
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

const INITIAL_VAULT_ITEMS: VaultMediaItem[] = [
  { id: "vid-1", title: "Unzensiertes 4K Vorab-Verifizierungsvideo (01:45 Min.)", type: "video", priceChf: 19, unlockCount: 14 },
  { id: "set-2", title: "Uncensored Lingerie & Private Hotel Set (12 Fotos)", type: "photos", priceChf: 29, unlockCount: 9 },
  { id: "vid-3", title: "VIP Vorab-Check Bundle (Alle Videos + CHF 20 Gutschein)", type: "bundle", priceChf: 39, unlockCount: 11 },
];

export default function CreatorDashboardPage() {
  const { toast } = useToast();
  const [providerName, setProviderName] = useState("Sophia");
  const [activeZone] = useState("Zürich City & Zug (Outcall)");
  const [rate30, setRate30] = useState(300);
  const [rate60, setRate60] = useState(450);
  const [rate120, setRate120] = useState(800);
  const [includedServices, setIncludedServices] = useState<string[]>(["GFE", "Dinner Dates", "Outcall"]);
  const [leads, setLeads] = useState<IncomingLead[]>(DEFAULT_DEMO_LEADS);
  const [leadCredits, setLeadCredits] = useState<number>(2);

  // 1:1 Live-Cam & Vibe-Check Controls
  const [camOnline, setCamOnline] = useState<boolean>(true);
  const [camRate3Min, setCamRate3Min] = useState<number>(29);
  const [camRate10Min, setCamRate10Min] = useState<number>(59);
  const [camRate20Min, setCamRate20Min] = useState<number>(99);
  const [camVoucherChf, setCamVoucherChf] = useState<number>(20);
  const [completedCamCalls] = useState<number>(8);

  // PPV Locked Content Manager State
  const [vaultItems, setVaultItems] = useState<VaultMediaItem[]>(INITIAL_VAULT_ITEMS);
  const [newMediaTitle, setNewMediaTitle] = useState("");
  const [newMediaPrice, setNewMediaPrice] = useState(25);
  const [newMediaType, setNewMediaType] = useState<"video" | "photos">("video");

  useEffect(() => {
    const loggedUser = localStorage.getItem("iwProviderAuth");
    if (loggedUser) setProviderName(loggedUser);

    const savedCredits = localStorage.getItem("providerLeadCredits");
    if (savedCredits) setLeadCredits(Number(savedCredits));

    const savedCamSettings = localStorage.getItem("providerCamSettings");
    if (savedCamSettings) {
      try {
        const parsed = JSON.parse(savedCamSettings);
        if (typeof parsed.camOnline === "boolean") setCamOnline(parsed.camOnline);
        if (parsed.camRate3Min) setCamRate3Min(Number(parsed.camRate3Min));
        if (parsed.camRate10Min) setCamRate10Min(Number(parsed.camRate10Min));
        if (parsed.camRate20Min) setCamRate20Min(Number(parsed.camRate20Min));
        if (parsed.camVoucherChf) setCamVoucherChf(Number(parsed.camVoucherChf));
      } catch {
        // ignore
      }
    }

    const storedLeads = localStorage.getItem("privateEnquiries");
    if (storedLeads) {
      try {
        const parsed = JSON.parse(storedLeads) as IncomingLead[];
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

    const storedVault = localStorage.getItem("providerVaultItems");
    if (storedVault) {
      try {
        setVaultItems(JSON.parse(storedVault));
      } catch {
        // ignore
      }
    }
  }, []);

  const handleSaveCamSettings = (nextOnlineState?: boolean) => {
    const targetOnline = typeof nextOnlineState === "boolean" ? nextOnlineState : camOnline;
    setCamOnline(targetOnline);
    const payload = {
      camOnline: targetOnline,
      camRate3Min,
      camRate10Min,
      camRate20Min,
      camVoucherChf,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem("providerCamSettings", JSON.stringify(payload));
    toast({
      title: targetOnline
        ? "🟢 1:1 Live-Cam & Video-Check ist jetzt LIVE!"
        : "⚫ Live-Cam Status auf Offline gesetzt",
      description: targetOnline
        ? `Kunden sehen deinen roten Live-Punkt (3 Min. Check: CHF ${camRate3Min} inkl. CHF ${camVoucherChf} Date-Gutschein).`
        : "Du empfängst aktuell keine neuen Live-Kamera-Anrufe.",
    });
  };

  const grossVaultRevenue =
    vaultItems.reduce((sum, item) => sum + item.priceChf * item.unlockCount, 0) +
    completedCamCalls * camRate10Min;
  const netProviderPayout = Math.round(grossVaultRevenue * 0.8);
  const platformFee = grossVaultRevenue - netProviderPayout;

  const handleAddVaultItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaTitle.trim()) return;
    const item: VaultMediaItem = {
      id: `custom-${Date.now()}`,
      title: newMediaTitle.trim(),
      type: newMediaType,
      priceChf: Number(newMediaPrice) || 25,
      unlockCount: 1,
    };
    const updated = [item, ...vaultItems];
    setVaultItems(updated);
    localStorage.setItem("providerVaultItems", JSON.stringify(updated));
    setNewMediaTitle("");
    toast({
      title: "Neuer Locked-Content im Profil-Tresor veröffentlicht!",
      description: `"${item.title}" ist ab sofort für CHF ${item.priceChf} auf deinem Profil freischaltbar (80% Direkt-Auszahlung an dich).`,
    });
  };

  const handleRequestPayout = () => {
    toast({
      title: `Auszahlung von CHF ${netProviderPayout} angefordert!`,
      description: "Dein 80% VIP-Medien- & Live-Cam-Erlös wird per TWINT / USDT auf dein hinterlegtes Konto überwiesen.",
      duration: 4500,
    });
  };

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
      description: `1 Lead-Credit eingelöst (Restguthaben: ${nextCredits} Credits).`,
    });
  };

  const handleConfirmFreshness = () => {
    toast({
      title: "Echtzeit-Verfügbarkeit bestätigt!",
      description: `Dein Profil (${providerName}) trägt jetzt den grünen Live-Zeitstempel für ${activeZone}.`,
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
        title="Provider Self-Service, 1:1 Live-Cam & VIP Media Manager | iWantSexNow.ch"
        description="Verwalte deine Echtzeit-Verfügbarkeit, 1:1 Live-Cam-Tarife, gesperrte VIP-Videos (Locked Content) und Direktbuchungen."
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
        {/* Top Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-[#09131E] border border-[#C69C6D]/40 rounded-2xl p-6 shadow-2xl">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <ShieldCheck size={13} className="mr-1 inline" /> Eingeloggt als: {providerName}
              </Badge>
              <Badge className={camOnline ? "bg-rose-600 text-white border-0 animate-pulse" : "bg-white/10 text-gray-400 border-0"}>
                <Radio size={12} className="mr-1 inline" />
                {camOnline ? "1:1 LIVE-CAM EMPFANG BEREIT" : "LIVE-CAM OFFLINE"}
              </Badge>
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
                <Coins size={12} className="mr-1 inline" /> Lead-Credits: {leadCredits}
              </Badge>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Wallet size={12} className="mr-1 inline" /> 80% Netto-Guthaben: CHF {netProviderPayout}
              </Badge>
            </div>
            <h1 className="text-2xl md:text-4xl font-serif font-black">
              Provider Control Center · Live-Cam & VIP Tresor
            </h1>
            <p className="text-sm text-gray-300 mt-1">
              Steuere deine Fixpreis-Buchungen, deine 1:1 Live-Kamera-Tarife und verkaufe gesperrte Vorab-Videos (80% Sofort-Anteil).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              onClick={() => handleSaveCamSettings(!camOnline)}
              className={
                camOnline
                  ? "bg-rose-600 hover:bg-rose-700 text-white font-black shadow-lg"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-lg"
              }
            >
              <Video size={15} className="mr-2" />
              {camOnline ? "🔴 Live-Cam aktiv (Ausschalten)" : "🟢 Jetzt für 1:1 Live-Cam online gehen"}
            </Button>
            <Button
              onClick={handleConfirmFreshness}
              className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black shadow-xl"
            >
              <RefreshCw size={15} className="mr-2" />
              4 Std. „Sofort Verfügbar“ pingen
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          {/* Left 7 Cols: Pay-Per-Lead Inbox + Locked Content Vault Manager */}
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-4">
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

            {/* LOCKED CONTENT VAULT MANAGER (80% Provider / 20% Platform Split) */}
            <Card className="bg-gradient-to-br from-[#131F31] to-[#09131E] border-2 border-[#C69C6D]/60 p-6 rounded-2xl text-white space-y-5 shadow-2xl">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <Badge className="bg-[#C69C6D] text-[#0D1B2A] font-black mb-1.5">
                    <Lock size={12} className="mr-1 inline" /> Passives Einkommen · Locked VIP Content Tresor
                  </Badge>
                  <h2 className="text-xl font-serif font-black">
                    Gesperrte Vorab-Videos & Uncensored Foto-Sets verkaufen
                  </h2>
                  <p className="text-xs text-gray-300 mt-0.5">
                    Kunden können deine privaten Videos & Fotos vor der Buchung freischalten. Du erhältst <strong>80% Direkt-Auszahlung</strong> (20% Plattform-Gebühr).
                  </p>
                </div>
                <div className="bg-black/50 border border-emerald-500/40 rounded-xl p-3 text-right">
                  <div className="text-[10px] text-gray-400 uppercase">Dein 80% Netto-Erlös (inkl. Cam)</div>
                  <div className="text-2xl font-black text-emerald-400">CHF {netProviderPayout}</div>
                  <div className="text-[10px] text-gray-400">Brutto: CHF {grossVaultRevenue} (Plattform: CHF {platformFee})</div>
                </div>
              </div>

              <div className="space-y-2.5">
                {vaultItems.map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 rounded-xl bg-black/40 border border-white/15 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="font-bold text-white text-sm flex items-center gap-1.5">
                        <Video size={14} className="text-[#D5A021]" />
                        {item.title}
                      </div>
                      <div className="text-gray-400 mt-0.5">
                        Verkaufspreis: <strong className="text-[#D5A021]">CHF {item.priceChf}</strong> · Bereits{" "}
                        <strong className="text-emerald-400">{item.unlockCount}x von Kunden gekauft</strong>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-black text-sm text-emerald-400">
                        +CHF {Math.round(item.priceChf * item.unlockCount * 0.8)}
                      </span>
                      <span className="block text-[10px] text-gray-400">dein 80% Anteil</span>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleAddVaultItem} className="pt-3 border-t border-white/10 space-y-3">
                <div className="text-xs font-bold text-[#D5A021] uppercase">
                  + Neues gesperrtes Video oder Foto-Set hinzufügen:
                </div>
                <div className="grid sm:grid-cols-12 gap-2.5">
                  <input
                    type="text"
                    placeholder="Titel (z.B. 4K Hotel-Video heute Abend oder 15 Uncensored Fotos)"
                    value={newMediaTitle}
                    onChange={(e) => setNewMediaTitle(e.target.value)}
                    required
                    className="sm:col-span-6 rounded-xl bg-black/50 border border-white/20 px-3 py-2 text-xs text-white"
                  />
                  <select
                    value={newMediaType}
                    onChange={(e) => setNewMediaType(e.target.value as "video" | "photos")}
                    className="sm:col-span-3 rounded-xl bg-black/50 border border-white/20 px-2.5 py-2 text-xs text-white"
                  >
                    <option value="video">4K Video</option>
                    <option value="photos">Foto-Serie</option>
                  </select>
                  <input
                    type="number"
                    min={10}
                    max={250}
                    value={newMediaPrice}
                    onChange={(e) => setNewMediaPrice(Number(e.target.value))}
                    required
                    className="sm:col-span-3 rounded-xl bg-black/50 border border-white/20 px-3 py-2 text-xs font-bold text-[#D5A021]"
                  />
                </div>
                <div className="flex flex-wrap justify-between gap-2 pt-1">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRequestPayout}
                    className="border-emerald-500/50 text-emerald-300 hover:bg-emerald-500/10 text-xs font-bold"
                  >
                    <Wallet size={14} className="mr-1.5" />
                    CHF {netProviderPayout} per TWINT / USDT auszahlen
                  </Button>
                  <Button type="submit" className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs">
                    <PlusCircle size={14} className="mr-1.5" />
                    Im Profil-Tresor veröffentlichen
                  </Button>
                </div>
              </form>
            </Card>
          </div>

          {/* Right 5 Cols: 1:1 Live-Cam Configurator + Real Date Tariff Configurator */}
          <div className="lg:col-span-5 space-y-6">
            {/* NEW: 1:1 LIVE-CAM & VIBE-CHECK MINUTE RATE CONFIGURATOR */}
            <Card className="bg-gradient-to-br from-[#24101C] to-[#09131E] border-2 border-rose-500/50 p-6 rounded-2xl text-white space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <Badge className="bg-rose-600 text-white border-0 font-black">
                  ● 1:1 LIVE-CAM & VIDEO-CHECK STUDIO
                </Badge>
                <span className="text-xs font-bold text-emerald-400">80% Sofort-Auszahlung</span>
              </div>

              <h2 className="text-xl font-serif font-black">
                Deine 1:1 Kamera-Tarife & Date-Gutschein
              </h2>
              <p className="text-xs text-gray-300">
                Bestimme selbst, was Kunden für deinen <strong>3-Minuten Vorab-Echtheits-Check</strong> oder eine private 1:1 Cam-Session zahlen:
              </p>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-gray-300 block mb-1">3 Min. Vibe-Check (CHF)</label>
                  <input
                    type="number"
                    value={camRate3Min}
                    onChange={(e) => setCamRate3Min(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3 py-2 text-sm font-black text-[#D5A021]"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">Davon Date-Gutschein (CHF)</label>
                  <input
                    type="number"
                    value={camVoucherChf}
                    onChange={(e) => setCamVoucherChf(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/50 border border-emerald-500/40 px-3 py-2 text-sm font-black text-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">10 Min. Private Cam (CHF)</label>
                  <input
                    type="number"
                    value={camRate10Min}
                    onChange={(e) => setCamRate10Min(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3 py-2 text-sm font-black text-[#D5A021]"
                  />
                </div>
                <div>
                  <label className="text-gray-300 block mb-1">20 Min. VIP Cam-Date (CHF)</label>
                  <input
                    type="number"
                    value={camRate20Min}
                    onChange={(e) => setCamRate20Min(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3 py-2 text-sm font-black text-[#D5A021]"
                  />
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => handleSaveCamSettings(true)}
                  className="flex-1 bg-rose-600 hover:bg-rose-700 text-white font-black text-xs"
                >
                  Cam-Tarife speichern & LIVE schalten
                </Button>
                <Button
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 text-xs"
                  asChild
                >
                  <Link href={`/live-cam?provider=${encodeURIComponent(providerName)}`}>
                    1:1 Cam-Raum öffnen →
                  </Link>
                </Button>
              </div>
            </Card>

            <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl text-white space-y-5">
              <div>
                <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-2">
                  <Calculator size={13} className="mr-1 inline" /> Endpreis-Rechner Konfiguration
                </Badge>
                <h2 className="text-xl font-serif font-black">
                  Deine Direktbuchungs-Tarife (Reales Treffen)
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

            <Card className="bg-[#09131E] border border-emerald-500/40 p-6 rounded-2xl text-white space-y-3">
              <div className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                <ShieldCheck size={14} /> B2B Schutz · Schweizer No-Show & Fake-Radar
              </div>
              <h3 className="text-lg font-serif font-black">
                Kunden-Rufnummer vor dem Termin prüfen
              </h3>
              <p className="text-xs text-gray-300">
                Alle eingehenden Anfragen auf iWantSexNow.ch werden automatisch gegen bekannte Zeitverschwender- und No-Show-Nummern abgeglichen (Status: <strong className="text-emerald-400">0 Warnungen · Vertrauenswürdig</strong>).
              </p>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}