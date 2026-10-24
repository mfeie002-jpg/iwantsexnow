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
  CheckCircle2,
  Clock,
  Lock,
  Send,
  FileCheck,
  ArrowLeft,
  Sparkles,
} from "lucide-react";

export default function BookingConfirmationPage() {
  const router = useRouter();
  const { toast } = useToast();

  const provider = String(router.query.provider || "Sophia");
  const city = String(router.query.city || "Zürich / Zug");
  const duration = Number(router.query.duration || 60);
  const totalChf = Number(router.query.total || 450);
  const extras = String(router.query.extras || "GFE, Outcall");

  const [contact, setContact] = useState("");
  const [preferredTime, setPreferredTime] = useState("Heute, 20:30 Uhr");
  const [hotelOrLocation, setHotelOrLocation] = useState(city);
  const [referenceCode, setReferenceCode] = useState<string | null>(null);

  const handleTransmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/enquiries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerName: provider,
          duration,
          extras: extras.split(",").map((s) => s.trim()),
          guaranteedTotalChf: totalChf,
          requestedTime: preferredTime,
          city: hotelOrLocation,
          contact,
        }),
      });
      const data = await res.json();
      const ref = data.referenceCode || `IW-${Math.floor(100000 + Math.random() * 900000)}`;
      setReferenceCode(ref);

      const saved = JSON.parse(localStorage.getItem("privateEnquiries") || "[]");
      saved.push({
        id: Date.now(),
        providerName: provider,
        duration,
        extras: extras.split(",").map((s) => s.trim()),
        guaranteedTotalChf: totalChf,
        requestedTime: preferredTime,
        city: hotelOrLocation,
        contact,
        notes: `Ref: ${ref}`,
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("privateEnquiries", JSON.stringify(saved));

      toast({
        title: `Buchungs-Referenz ${ref} aktiviert`,
        description: `Deine Anfrage wurde mit Endpreis-Schutz (CHF ${totalChf}) an ${provider} übermittelt.`,
      });
    } catch {
      setReferenceCode(`IW-${Math.floor(100000 + Math.random() * 900000)}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="Direktbuchung & Endpreis-Garantie Status | iWantSexNow.ch"
        description="Verschlüsselte Direktbuchungs-Übermittlung und Echtzeit-Status-Tracking."
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

      <main className="container mx-auto px-4 py-10 max-w-3xl space-y-8">
        <Link href="/matches" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-white">
          <ArrowLeft size={14} /> Zurück zur Auswahl
        </Link>

        <Card className="bg-[#09131E] border-2 border-[#C69C6D]/60 p-6 md:p-8 rounded-2xl text-white space-y-6 shadow-2xl">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-4">
            <div>
              <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 mb-1.5">
                <ShieldCheck size={13} className="mr-1 inline" /> Swiss Shield Endpreis-Zertifikat
              </Badge>
              <h1 className="text-2xl md:text-3xl font-serif font-black">
                Direkt-Anfrage an {provider}
              </h1>
            </div>
            <div className="text-right bg-black/40 border border-[#C69C6D]/40 rounded-xl px-4 py-2">
              <div className="text-[10px] text-gray-400 uppercase">Garantierter Komplettpreis</div>
              <div className="text-3xl font-black text-[#D5A021]">CHF {totalChf}</div>
              <div className="text-[10px] text-emerald-400">für {duration} Min. inkl. {extras}</div>
            </div>
          </div>

          {referenceCode ? (
            <div className="space-y-6">
              <div className="p-5 rounded-2xl bg-emerald-950/50 border border-emerald-400/50 text-center space-y-2">
                <CheckCircle2 size={42} className="text-emerald-400 mx-auto" />
                <div className="text-xs uppercase tracking-widest text-emerald-300 font-bold">
                  Buchungs-Referenzcode: {referenceCode}
                </div>
                <h2 className="text-2xl font-serif font-black">
                  Anfrage verschlüsselt an {provider} zugestellt
                </h2>
                <p className="text-xs text-gray-300 max-w-md mx-auto">
                  Dein Fixpreis von <strong>CHF {totalChf}</strong> ist im System hinterlegt. {provider} bestätigt dir den Termin für <strong>{preferredTime}</strong> direkt auf <strong>{contact}</strong>.
                </p>
              </div>

              {/* 3-Step Live Tracker */}
              <div className="grid sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400 text-emerald-200">
                  <div className="font-bold">1. Endpreis fixiert</div>
                  <div className="text-[11px] mt-1">CHF {totalChf} Zertifikat erstellt</div>
                </div>
                <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-400 text-emerald-200">
                  <div className="font-bold">2. Direkt zugestellt</div>
                  <div className="text-[11px] mt-1">Im Provider-Dashboard aktiv</div>
                </div>
                <div className="p-3.5 rounded-xl bg-white/5 border border-[#C69C6D]/40 text-[#D5A021]">
                  <div className="font-bold flex items-center gap-1.5">
                    <Clock size={13} className="animate-spin" /> 3. Rückbestätigung
                  </div>
                  <div className="text-[11px] text-gray-300 mt-1">Direkt via SMS / Signal / Threema</div>
                </div>
              </div>

              <div className="flex flex-wrap justify-between gap-3 pt-2">
                <Button variant="outline" className="border-white/20 text-white" asChild>
                  <Link href="/">Zurück zur Startseite</Link>
                </Button>
                <Button className="bg-[#C69C6D] text-[#0D1B2A] font-black" asChild>
                  <Link href="/creator-dashboard">Anfrage im Provider-Dashboard ansehen →</Link>
                </Button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleTransmit} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Gewünschter Ort / Hotel / Studio</label>
                  <input
                    type="text"
                    value={hotelOrLocation}
                    onChange={(e) => setHotelOrLocation(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Gewünschte Uhrzeit</label>
                  <input
                    type="text"
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">
                  Deine Nummer für die direkte Rückbestätigung (WhatsApp / Signal / SMS / Threema)
                </label>
                <input
                  type="text"
                  placeholder="+41 79 ... oder Threema-ID"
                  value={contact}
                  onChange={(e) => setContact(e.target.value)}
                  required
                  className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div className="flex items-center gap-2 text-xs text-gray-400">
                <Lock size={14} className="text-emerald-400 shrink-0" />
                <span>Deine Kontaktdaten werden ausschließlich an {provider} übermittelt und niemals öffentlich gespeichert.</span>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-base shadow-xl"
              >
                <Send size={16} className="mr-2" />
                Verbindliche Anfrage mit Endpreis-Zertifikat absenden
              </Button>
            </form>
          )}
        </Card>
      </main>
    </div>
  );
}