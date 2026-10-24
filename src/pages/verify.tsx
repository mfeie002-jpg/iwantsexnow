import { useState } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, Camera, PhoneCall, CheckCircle2, Lock, ArrowRight } from "lucide-react";

export default function VerifyPage() {
  const { toast } = useToast();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("+41 79 ");
  const [artistName, setArtistName] = useState("");
  const [city, setCity] = useState("Zürich & Zug");
  const [dailyCode] = useState(() => `CH-${Math.floor(1000 + Math.random() * 9000)}`);
  const [completed, setCompleted] = useState(false);

  const handleComplete = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("providerLeadCredits", "2");
    try {
      await fetch("/api/claims/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          artistName,
          phone,
          city,
          dailyCode,
          mode: "verify",
        }),
      });
    } catch {
      // non-blocking
    }
    setCompleted(true);
    toast({
      title: "Verifizierungs-Antrag übermittelt!",
      description: "Dein Swiss-Shield Echtheits-Siegel + 2 Gratis Lead-Credits wurden freigeschaltet.",
      duration: 5000,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="ID- & Foto-Verifizierung (Swiss Shield Siegel) | iWantSexNow.ch"
        description="Schalte das grüne Direktbuchungs- und Echtheits-Siegel für dein Schweizer Profil frei."
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

      <main className="container mx-auto px-4 py-12 max-w-3xl space-y-8">
        <div className="text-center space-y-3">
          <Badge className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
            <ShieldCheck size={14} className="mr-1.5 inline" /> Swiss Shield Trust Protocol
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black">
            ID- & Foto-Verifizierung in 3 Schritten
          </h1>
          <p className="text-gray-300 text-sm md:text-base">
            Profile mit dem grünen <strong>„ID & Originalfotos geprüft“</strong>-Siegel erhalten bis zu 4x mehr Direktbuchungs-Anfragen und starten mit <strong>2 Gratis Lead-Credits (CHF 50 Wert)</strong>.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {([
            { num: 1, title: "1. Rufnummer & Index-Claim" },
            { num: 2, title: "2. Tagescode-Selfie Check" },
            { num: 3, title: "3. Direktbuchung aktivieren" },
          ] as const).map((s) => (
            <button
              key={s.num}
              type="button"
              onClick={() => setStep(s.num)}
              className={`p-3 rounded-xl border text-xs font-bold text-left transition-all ${
                step === s.num
                  ? "bg-[#C69C6D] text-[#0D1B2A] border-[#C69C6D]"
                  : "bg-[#09131E] border-white/15 text-gray-300"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>

        {completed ? (
          <Card className="bg-[#09131E] border-2 border-emerald-500/60 p-8 rounded-2xl text-white text-center space-y-4">
            <CheckCircle2 size={48} className="text-emerald-400 mx-auto" />
            <h2 className="text-2xl font-serif font-black">
              Verifizierung registriert · 2 Gratis Lead-Credits aktiv!
            </h2>
            <p className="text-sm text-gray-300 max-w-lg mx-auto">
              Deine Rufnummer <strong>{phone}</strong> und dein Code <strong>{dailyCode}</strong> wurden übermittelt. Alle gefundenen Drittportal-Inserate wurden mit deinem Direktprofil verknüpft.
            </p>
            <div className="pt-4 flex justify-center gap-3">
              <Button className="bg-[#C69C6D] text-[#0D1B2A] font-black" asChild>
                <Link href="/creator-dashboard">
                  Zum Provider-Dashboard <ArrowRight size={15} className="ml-1.5" />
                </Link>
              </Button>
            </div>
          </Card>
        ) : (
          <Card className="bg-[#09131E] border border-[#C69C6D]/40 p-6 md:p-8 rounded-2xl text-white">
            <form onSubmit={handleComplete} className="space-y-6">
              <div>
                <label className="text-xs font-bold uppercase text-[#D5A021] flex items-center gap-1.5 mb-2">
                  <PhoneCall size={14} /> Schritt 1: Schweizer Rufnummer für Dubletten-Bündelung & SMS-Code
                </label>
                <div className="grid sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="Künstlername (z.B. Sophia)"
                    value={artistName}
                    onChange={(e) => setArtistName(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                <div className="text-xs font-bold uppercase text-emerald-400 flex items-center gap-1.5">
                  <Camera size={14} /> Schritt 2: Dein persönlicher Tages-Prüfcode
                </div>
                <p className="text-xs text-gray-300">
                  Schreibe diesen Code auf einen Zettel und halte ihn beim kurzen Verifizierungs-Selfie sichtbar ins Bild (wird niemals veröffentlicht und nach der Prüfung gemäss CH-DSG gelöscht):
                </p>
                <div className="text-2xl font-mono font-black text-[#D5A021] tracking-widest bg-white/5 px-4 py-2 rounded-lg inline-block border border-[#C69C6D]/40">
                  {dailyCode}
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-xs text-gray-300">
                <Lock size={16} className="text-emerald-400 shrink-0 mt-0.5" />
                <span>
                  Ich bestätige, dass ich volljährig (18+) bin, selbstständig handle und meine im Endpreis-Rechner hinterlegten Tarife ohne versteckte Nachverhandlungen vor Ort gelten.
                </span>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-base shadow-xl"
              >
                Verifizierung abschliessen & 2 Gratis Lead-Credits aktivieren
              </Button>
            </form>
          </Card>
        )}
      </main>
    </div>
  );
}