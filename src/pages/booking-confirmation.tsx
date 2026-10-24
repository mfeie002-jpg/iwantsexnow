import { useState, useEffect } from "react";
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
  CheckCircle2,
  Copy,
  Send,
  Lock,
  ArrowLeft,
  QrCode,
  MessageSquare,
  Sparkles,
} from "lucide-react";

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const provider = String(router.query.provider || "Sophia");
  const city = String(router.query.city || "Zug / Zürich");
  const duration = Number(router.query.duration || 60);
  const total = Number(router.query.total || 450);
  const extras = String(router.query.extras || "GFE, Outcall");

  const [voucherCode] = useState(() => `IW-${Math.floor(100000 + Math.random() * 900000)}`);
  const [customerContact, setCustomerContact] = useState("");
  const [requestedTime, setRequestedTime] = useState("Heute, 20:30 Uhr");
  const [hotelOrSpot, setHotelOrSpot] = useState(city);
  const [dispatched, setDispatched] = useState(false);

  useEffect(() => {
    if (city) setHotelOrSpot(city);
  }, [city]);

  // Official branded message so the provider ALWAYS knows 100% this client came from iWantSexNow.ch!
  const officialWhatsAppText = `🛡️ iWantSexNow.ch Fixpreis-Zertifikat [${voucherCode}]\nHallo ${provider} ✨ Ich buche dich über deinen verifizierten Index-Eintrag auf iWantSexNow.ch:\n• Dauer: ${duration} Min.\n• Inklusive: ${extras}\n• Garantierter Komplettpreis: CHF ${total} (0% Nachverhandlung)\n• Wunschzeit & Ort: ${requestedTime} in ${hotelOrSpot}\nBitte bestätige mir kurz diesen Fixpreis-Code [${voucherCode}].`;

  const handleDispatchLead = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await fetch("/api/enquiries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerName: provider,
          duration,
          extras: extras.split(",").map((s) => s.trim()),
          guaranteedTotalChf: total,
          requestedTime,
          city: hotelOrSpot,
          contact: customerContact,
          notes: `Zertifikat: ${voucherCode} (Lead-Attribution aktiv)`,
        }),
      });
    } catch {}

    const saved = JSON.parse(localStorage.getItem("privateEnquiries") || "[]");
    saved.push({
      id: Date.now(),
      referenceCode: voucherCode,
      providerName: provider,
      duration,
      extras: extras.split(",").map((s) => s.trim()),
      guaranteedTotalChf: total,
      requestedTime,
      city: hotelOrSpot,
      contact: customerContact,
      notes: `Offizieller iWantSexNow.ch Lead-Code: ${voucherCode}`,
      createdAt: new Date().toISOString(),
    });
    localStorage.setItem("privateEnquiries", JSON.stringify(saved));

    setDispatched(true);
    toast({
      title: `Fixpreis-Zertifikat (${voucherCode}) aktiviert & im Lead-Tresor hinterlegt!`,
      description: `${provider} sieht deine Anfrage jetzt im iWantSexNow.ch Provider-Tresor.`,
      duration: 5000,
    });
  };

  const handleCopyVoucher = () => {
    navigator.clipboard?.writeText(officialWhatsAppText);
    toast({
      title: "Fixpreis-Zertifikat Text kopiert!",
      description: `Enthält deinen Prüfcode ${voucherCode}, damit ${provider} dir den iWantSexNow-Spezialpreis garantiert.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title={`Swiss Shield Fixpreis-Zertifikat (${voucherCode}) für ${provider} | iWantSexNow.ch`}
        description="Dein offizielles Schweizer Endpreis-Zertifikat ohne Nachverhandlung vor Ort."
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

      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-6">
        <Link href="/search" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> Zurück zur Übersicht
        </Link>

        <Card className="bg-[#09131E] border-2 border-[#C69C6D] p-6 md:p-8 rounded-3xl text-white space-y-6 shadow-[0_20px_60px_rgba(0,0,0,0.8)]">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10">
            <div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-1.5">
                <ShieldCheck size={13} className="mr-1 inline" /> Swiss Shield Endpreis-Garantie
              </Badge>
              <h1 className="text-2xl md:text-3xl font-serif font-black">
                Dein Fixpreis-Zertifikat für {provider}
              </h1>
            </div>
            <div className="bg-black/60 border border-[#C69C6D] rounded-2xl px-4 py-2.5 text-right">
              <div className="text-[10px] text-gray-400 uppercase">Offizieller Prüfcode</div>
              <div className="text-lg font-mono font-black text-[#D5A021]">{voucherCode}</div>
            </div>
          </div>

          {/* Why the client MUST use this code (Guarantees Lead Attribution!) */}
          <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-1.5">
            <div className="font-black text-emerald-300 uppercase flex items-center gap-1.5">
              <Sparkles size={14} /> Wichtig für deinen Preisvorteil vor Ort:
            </div>
            <p className="text-gray-200 leading-relaxed">
              Auf Drittportalen (`xdate`, `fgirl`, `and6`) liegen die Preise für <strong>{provider}</strong> inklusive Extras deutlich höher. Dein bereinigter Komplettpreis von <strong>CHF {total}</strong> gilt nur in Verbindung mit diesem <strong>iWantSexNow.ch Zertifikat ({voucherCode})</strong>!
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-3 bg-black/40 p-4 rounded-2xl border border-white/10 text-xs">
            <div>
              <span className="text-gray-400 block">Anbieterin & Ort:</span>
              <strong className="text-white text-sm">{provider} ({city})</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Dauer & Inklusive:</span>
              <strong className="text-[#D5A021] text-sm">{duration} Min. ({extras})</strong>
            </div>
            <div>
              <span className="text-gray-400 block">Garantierter Endpreis:</span>
              <strong className="text-emerald-400 text-xl font-black">CHF {total}.00</strong>
            </div>
          </div>

          {!dispatched ? (
            <form onSubmit={handleDispatchLead} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Gewünschte Uhrzeit</label>
                  <input
                    type="text"
                    value={requestedTime}
                    onChange={(e) => setRequestedTime(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Treffpunkt (Hotel / Studio in {city})</label>
                  <input
                    type="text"
                    value={hotelOrSpot}
                    onChange={(e) => setHotelOrSpot(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">
                  Deine Nummer / Threema-ID für die Terminbestätigung (wird im geschützten Lead-Tresor an {provider} übergeben)
                </label>
                <input
                  type="text"
                  placeholder="+41 79 ... oder Signal / Threema"
                  value={customerContact}
                  onChange={(e) => setCustomerContact(e.target.value)}
                  required
                  className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-base shadow-xl"
              >
                <Send size={16} className="mr-2" />
                Zertifikat ({voucherCode}) aktivieren & Anfrage an {provider} senden
              </Button>
            </form>
          ) : (
            <div className="space-y-4 p-5 rounded-2xl bg-black/50 border-2 border-emerald-400">
              <div className="flex items-center gap-2 text-emerald-400 font-black text-base">
                <CheckCircle2 size={22} />
                Anfrage im Provider-Tresor von {provider} hinterlegt!
              </div>
              <p className="text-xs text-gray-300">
                Zusätzlich kannst du dein offizielles Fixpreis-Zertifikat hier kopieren, falls du {provider} direkt auf deinen Code <strong>{voucherCode}</strong> hinweisen möchtest:
              </p>
              <div className="p-3 rounded-xl bg-white/5 border border-white/10 font-mono text-[11px] text-gray-200 whitespace-pre-line">
                {officialWhatsAppText}
              </div>
              <div className="flex flex-wrap gap-3">
                <Button
                  type="button"
                  onClick={handleCopyVoucher}
                  className="bg-[#C69C6D] text-[#0D1B2A] font-black text-xs"
                >
                  <Copy size={13} className="mr-1.5" /> Zertifikat-Text kopieren
                </Button>
                <Button variant="outline" className="border-white/20 text-white text-xs" asChild>
                  <Link href={`/live-cam?provider=${encodeURIComponent(provider)}`}>
                    Vorab 3-Min. Live-Cam Check starten →
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </Card>
      </main>
    </div>
  );
}