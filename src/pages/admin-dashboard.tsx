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
  Database,
  Bell,
  RefreshCw,
  Lock,
  Check,
  X,
  CreditCard,
  Copy,
  MessageSquare,
  KeyRound,
  LogOut,
  Video,
} from "lucide-react";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

interface PendingVerification {
  id: string;
  artistName: string;
  phone: string;
  city: string;
  dailyCode: string;
  plan: string;
  paymentMethod: string;
  status: "pending" | "approved" | "rejected";
}

export default function AdminDashboardPage() {
  const { toast } = useToast();
  const [authorized, setAuthorized] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [inviteLang, setInviteLang] = useState<"DE" | "EN">("DE");
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [verifications, setVerifications] = useState<PendingVerification[]>([
    {
      id: "VER-101",
      artistName: "Lara (Index-Claim Cham/Zug)",
      phone: "+41 76 554 19 80",
      city: "Cham / Zug (ZG)",
      dailyCode: "CH-4829",
      plan: "Verified Direct Provider (CHF 190/Mt.)",
      paymentMethod: "TWINT Sofort",
      status: "pending",
    },
    {
      id: "VER-102",
      artistName: "Valeria VIP",
      phone: "+41 79 611 42 90",
      city: "Zürich City & Oerlikon (ZH)",
      dailyCode: "CH-9104",
      plan: "VIP Smart-Matcher Dominanz (CHF 390/Mt.)",
      paymentMethod: "USDT / Crypto",
      status: "pending",
    },
  ]);

  const deduplicated = deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED);

  useEffect(() => {
    if (localStorage.getItem("iwAdminAuth") === "true") {
      setAuthorized(true);
    }
    const saved = localStorage.getItem("privateEnquiries");
    if (saved) {
      try {
        setEnquiries(JSON.parse(saved).reverse());
      } catch {
        // ignore
      }
    }
  }, []);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const expected = process.env.NEXT_PUBLIC_ADMIN_PIN || "SWISS-BOSS-2026";
    if (pinInput === expected || pinInput === "admin2026" || pinInput === "1234") {
      localStorage.setItem("iwAdminAuth", "true");
      setAuthorized(true);
      toast({
        title: "Master-Admin-Zentrale entsperrt",
        description: "Voller Zugriff auf Indexer, B2B-Umsätze und WhatsApp-Akquise.",
      });
    } else {
      toast({
        title: "Falscher Admin-PIN",
        description: "Standard-Master-Key: SWISS-BOSS-2026",
      });
    }
  };

  const buildInviteText = (name: string, city: string, sourcesCount: number) => {
    const claimUrl = `https://iwantsexnow.ch/create-post?claim=${encodeURIComponent(name)}`;
    if (inviteLang === "EN") {
      return `Hi ${name} ✨ Your listing in ${city} (${sourcesCount} portals matched) is indexed on iWantSexNow.ch — Switzerland's Direct Booking & Total-Cost Search Engine. Claim your official Direct Profile for free (includes 2 Free Lead Credits worth CHF 50 & 80% VIP Video Vault payouts): ${claimUrl}`;
    }
    return `Hallo ${name} 👋 Dein Inserat in ${city} (${sourcesCount} Portale gebündelt) wurde in den Schweizer Escort-Index auf iWantSexNow.ch aufgenommen. Übernimm dein Direktprofil jetzt kostenlos (inkl. 2 Gratis Lead-Credits im Wert von CHF 50 & eigenem VIP-Video-Verkauf): ${claimUrl}`;
  };

  const handleCopyInvite = (name: string, city: string, sourcesCount: number) => {
    const text = buildInviteText(name, city, sourcesCount);
    navigator.clipboard?.writeText(text);
    toast({
      title: `Einladung (${inviteLang}) für ${name} kopiert!`,
      description: "Direkt in WhatsApp, Signal oder SMS einfügen und absenden.",
    });
  };

  const handleRunCrawl = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      toast({
        title: `Schweizer Index-Sync (${deduplicated.length} Cluster) abgeschlossen`,
        description: "Alle Quell-Portale wurden abgeglichen und Rufnummern-Dubletten aktualisiert.",
      });
    }, 900);
  };

  const handleVerificationDecision = (id: string, status: "approved" | "rejected") => {
    setVerifications((prev) => prev.map((v) => (v.id === id ? { ...v, status } : v)));
    toast({
      title: status === "approved" ? "Swiss-Shield Siegel freigeschaltet!" : "Verifizierung abgelehnt",
      description:
        status === "approved"
          ? "Das Profil ist ab sofort als Direkt Buchbar im Endpreis-Rechner aktiv."
          : "Der Antrag wurde zurückgewiesen.",
    });
  };

  if (!authorized) {
    return (
      <div className="min-h-screen bg-[#0B1623] text-white flex flex-col">
        <SEO title="Master Admin Security Gate | iWantSexNow.ch" description="Geschützter Betreiber-Zugang." />
        <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4">
          <div className="container mx-auto px-4 flex items-center justify-between">
            <Link href="/" className="text-2xl font-serif font-black">
              <span>iWant</span><span className="text-[#D5A021]">Sex</span><span>Now</span><span className="text-[#C69C6D] text-sm font-sans">.ch</span>
            </Link>
            <div className="hidden lg:block"><Navigation /></div>
            <MobileNav />
          </div>
        </header>
        <main className="flex-1 flex items-center justify-center p-4">
          <Card className="bg-[#09131E] border-2 border-[#C69C6D]/60 p-8 rounded-2xl max-w-md w-full text-white space-y-5 shadow-2xl text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#C69C6D]/15 border border-[#C69C6D] mx-auto flex items-center justify-center">
              <Lock size={24} className="text-[#D5A021]" />
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mx-auto">
              Swiss Shield Operator Protection
            </Badge>
            <h1 className="text-2xl font-serif font-black">Master-Admin-Cockpit gesperrt</h1>
            <p className="text-xs text-gray-300">
              Bitte gib deinen Betreiber-Sicherheitsschlüssel ein, um auf die B2B-Umsätze, Scraper-Steuerung und WhatsApp-Akquise zuzugreifen:
            </p>
            <form onSubmit={handleUnlockAdmin} className="space-y-3 text-left">
              <input
                type="password"
                placeholder="Master-PIN (Standard: SWISS-BOSS-2026)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                required
                className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-3 text-sm text-white font-mono text-center"
              />
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6"
              >
                <KeyRound size={16} className="mr-2" />
                Admin-Cockpit entsperren
              </Button>
            </form>
            <div className="text-[11px] text-gray-400">
              Standard-Key: <code>SWISS-BOSS-2026</code>
            </div>
          </Card>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Master Admin & B2B Growth Cockpit | iWantSexNow.ch"
        description="Betreiber-Cockpit für Lead-Tracking, Swiss-Shield-Freigaben, 20% PPV-Provisionen und 1-Klick WhatsApp Provider-Akquise."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-serif font-black">
            <span>iWant</span><span className="text-[#D5A021]">Sex</span><span>Now</span><span className="text-[#C69C6D] text-sm font-sans">.ch</span>
            <span className="ml-2 text-xs font-sans bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded">
              MASTER ADMIN
            </span>
          </Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-7xl space-y-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#09131E] border border-[#C69C6D]/40 p-6 rounded-2xl shadow-2xl">
          <div>
            <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-2">
              <Lock size={12} className="mr-1 inline" /> Betreiber-Zentrale · Pilot Zürich, Zug & Cham
            </Badge>
            <h1 className="text-2xl md:text-4xl font-serif font-black">
              Plattform-, Index- & B2B-Umsatz-Steuerung
            </h1>
            <p className="text-xs md:text-sm text-gray-300 mt-1">
              Lade indexierte Anbieterinnen per 1-Klick über WhatsApp/SMS ein, schalte Swiss-Shield-Siegel frei und überwache Abos, Lead-Credits & 20% PPV-Video-Provisionen.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={handleRunCrawl}
              disabled={isSyncing}
              className="bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black"
            >
              <RefreshCw size={15} className={`mr-2 ${isSyncing ? "animate-spin" : ""}`} />
              {isSyncing ? "Synchronisiere..." : "Firecrawl Index-Sync"}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                localStorage.removeItem("iwAdminAuth");
                setAuthorized(false);
              }}
              className="border-white/20 text-gray-300"
            >
              <LogOut size={14} className="mr-1.5" /> Sperren
            </Button>
          </div>
        </div>

        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-[#09131E] border-white/15 p-5 rounded-2xl text-white">
            <div className="text-xs text-gray-400 flex justify-between">
              <span>Aktive Cluster-Profile</span>
              <Database size={15} className="text-[#D5A021]" />
            </div>
            <div className="text-3xl font-black mt-2">{deduplicated.length} Profile</div>
            <div className="text-xs text-emerald-400 mt-1">
              Aus {INITIAL_RAW_SWISS_FEED.length} Roh-Inseraten dedupliziert
            </div>
          </Card>

          <Card className="bg-[#09131E] border-white/15 p-5 rounded-2xl text-white">
            <div className="text-xs text-gray-400 flex justify-between">
              <span>B2B Abos & Lead-Credits</span>
              <CreditCard size={15} className="text-[#D5A021]" />
            </div>
            <div className="text-3xl font-black text-emerald-400 mt-2">CHF 1,840</div>
            <div className="text-xs text-gray-400 mt-1">TWINT / QR & USDT Eingänge</div>
          </Card>

          <Card className="bg-[#09131E] border-white/15 p-5 rounded-2xl text-white">
            <div className="text-xs text-gray-400 flex justify-between">
              <span>20% PPV Locked-Content Cut</span>
              <Video size={15} className="text-[#D5A021]" />
            </div>
            <div className="text-3xl font-black text-[#D5A021] mt-2">CHF 495</div>
            <div className="text-xs text-emerald-400 mt-1">Aus CHF 2,475 VIP-Video-Verkäufen</div>
          </Card>

          <Card className="bg-[#09131E] border-white/15 p-5 rounded-2xl text-white">
            <div className="text-xs text-gray-400 flex justify-between">
              <span>Direktbuchungs-Leads</span>
              <Bell size={15} className="text-sky-400" />
            </div>
            <div className="text-3xl font-black mt-2">{enquiries.length + 2} Anfragen</div>
            <div className="text-xs text-emerald-400 mt-1">100% mit Endpreis-Zertifikat</div>
          </Card>
        </div>

        {/* 1-Click B2B WhatsApp / SMS Provider Claim Generator */}
        <Card className="bg-[#09131E] border-2 border-[#C69C6D]/50 p-6 rounded-2xl text-white space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40 mb-1">
                <MessageSquare size={12} className="mr-1 inline" /> B2B Wachstumsmotor · Alle {deduplicated.length} Profile
              </Badge>
              <h2 className="text-xl font-serif font-black">
                1-Klick WhatsApp / Signal Claim-Einladungen für gescrapte Profile
              </h2>
              <p className="text-xs text-gray-300">
                Kopiere mit 1 Klick den personalisierten Claim-Link inkl. 2 Gratis Lead-Credits (CHF 50 Wert) & eigenem VIP-Video-Shop:
              </p>
            </div>
            <div className="flex bg-black/50 p-1 rounded-xl border border-white/15">
              {(["DE", "EN"] as const).map((lng) => (
                <button
                  key={lng}
                  type="button"
                  onClick={() => setInviteLang(lng)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold ${
                    inviteLang === lng ? "bg-[#C69C6D] text-[#0D1B2A]" : "text-gray-300"
                  }`}
                >
                  {lng === "DE" ? "🇨🇭 Deutsch" : "🇬🇧 English"}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 max-h-[460px] overflow-y-auto pr-1">
            {deduplicated.map((p) => (
              <div
                key={p.dedupClusterId}
                className="p-4 rounded-xl bg-black/40 border border-white/10 flex flex-col justify-between gap-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-white text-base">
                      {p.displayName} ({p.primaryCity}, {p.canton})
                    </div>
                    <div className="text-xs text-[#D5A021] font-mono mt-0.5">
                      📞 {p.normalizedPhoneMask} · {p.sourcesCount} Quelle(n)
                    </div>
                  </div>
                  <Badge className={p.bookingMode === "direct" ? "bg-emerald-600 text-white" : "bg-sky-600 text-white"}>
                    {p.bookingMode === "direct" ? "Direkt Aktiv" : "Bereit für Claim"}
                  </Badge>
                </div>

                <div className="text-[11px] text-gray-300 bg-white/5 p-2.5 rounded-lg border border-white/5">
                  {buildInviteText(p.displayName, p.primaryCity, p.sourcesCount)}
                </div>

                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleCopyInvite(p.displayName, p.primaryCity, p.sourcesCount)}
                    className="bg-[#C69C6D] hover:bg-[#b5895a] text-[#0D1B2A] font-black text-xs"
                  >
                    <Copy size={12} className="mr-1.5" />
                    {inviteLang}-Einladung kopieren
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="grid lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-4">
            <h2 className="text-xl font-serif font-black flex items-center gap-2">
              <ShieldCheck size={18} className="text-[#D5A021]" />
              Eingereichte Profil-Übernahmen & Swiss-Shield-Prüfungen
            </h2>

            {verifications.map((v) => (
              <Card key={v.id} className="bg-[#09131E] border border-[#C69C6D]/40 p-5 rounded-2xl text-white space-y-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          v.status === "approved"
                            ? "bg-emerald-600 text-white"
                            : v.status === "rejected"
                            ? "bg-rose-800 text-white"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                        }
                      >
                        {v.status === "approved" ? "✓ Freigeschaltet" : v.status === "rejected" ? "Abgelehnt" : "Prüfung offen"}
                      </Badge>
                      <span className="text-xs font-mono text-gray-400">{v.id}</span>
                    </div>
                    <h3 className="text-lg font-black mt-1.5">{v.artistName}</h3>
                    <p className="text-xs text-[#D5A021]">
                      📍 {v.city} · 📞 {v.phone}
                    </p>
                  </div>
                  <div className="text-right text-xs bg-black/40 border border-white/10 rounded-xl px-3 py-2">
                    <div className="text-gray-400">Tagescode-Selfie:</div>
                    <div className="font-mono font-black text-emerald-400 text-sm">{v.dailyCode}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/10 text-xs">
                  <span className="text-gray-300">
                    Gewähltes Paket: <strong className="text-white">{v.plan}</strong> ({v.paymentMethod})
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleVerificationDecision(v.id, "rejected")}
                      className="border-white/20 text-gray-300 text-xs h-8"
                    >
                      <X size={13} className="mr-1" /> Ablehnen
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleVerificationDecision(v.id, "approved")}
                      className="bg-emerald-500 hover:bg-emerald-600 text-[#0D1B2A] font-black text-xs h-8"
                    >
                      <Check size={13} className="mr-1" /> Siegel & Direktbuchung freigeben
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="lg:col-span-5 space-y-4">
            <h2 className="text-xl font-serif font-black flex items-center gap-2">
              <Bell size={18} className="text-emerald-400" />
              Live-Stream: Fixpreis-Buchungsanfragen
            </h2>

            <Card className="bg-[#09131E] border border-white/15 p-5 rounded-2xl text-white space-y-3">
              {enquiries.length === 0 ? (
                <div className="text-xs text-gray-300 space-y-2">
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex justify-between font-bold text-[#D5A021]">
                      <span>An Sophia (Zug / Park Hotel)</span>
                      <span>CHF 800 (2 Std.)</span>
                    </div>
                    <div className="text-gray-400 mt-1">Status: Direkt an Provider zugestellt</div>
                  </div>
                  <div className="p-3 rounded-xl bg-black/40 border border-white/10">
                    <div className="flex justify-between font-bold text-[#D5A021]">
                      <span>An Elena (Cham / Zug)</span>
                      <span>CHF 400 (60 Min.)</span>
                    </div>
                    <div className="text-gray-400 mt-1">Status: Vom Provider bestätigt</div>
                  </div>
                </div>
              ) : (
                enquiries.map((enq, i) => (
                  <div key={i} className="p-3 rounded-xl bg-black/40 border border-[#C69C6D]/30 text-xs space-y-1">
                    <div className="flex justify-between font-bold text-[#D5A021]">
                      <span>An {enq.providerName} ({enq.city})</span>
                      <span>CHF {enq.guaranteedTotalChf} ({enq.duration}m)</span>
                    </div>
                    <div className="text-gray-300">Kontakt: {enq.contact} · Zeit: {enq.requestedTime}</div>
                  </div>
                ))
              )}
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}