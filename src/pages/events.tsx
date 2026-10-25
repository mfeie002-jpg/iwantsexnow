import { BrandLogo } from "@/components/BrandLogo";
import { useState } from "react";
import Link from "next/link";
import SEO from "@/components/SEO";
import { Navigation } from "@/components/Navigation";
import { MobileNav } from "@/components/MobileNav";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Sparkles, ShieldCheck, Send, CheckCircle2, Lock, Crown } from "lucide-react";
import { SeoSiloFooter } from "@/components/marketplace/SeoSiloFooter";

export default function VipConciergeEventsPage() {
  const { toast } = useToast();
  const [city, setCity] = useState("Zug / Park Hotel (oder Zürich)");
  const [when, setWhen] = useState("Heute Abend, ab 20:00 Uhr");
  const [category, setCategory] = useState("Female Escort (oder Duo / Gigolo)");
  const [budgetChf, setBudgetChf] = useState(800);
  const [wishes, setWishes] = useState("Suche diskrete, gepflegte Begleitung für 2 Stunden inkl. Dinner/Drinks im Hotel.");
  const [contact, setContact] = useState("");
  const [sent, setSent] = useState(false);

  const handleBroadcastVipRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/enquiries/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          providerName: `VIP-Broadcast (${category})`,
          duration: 120,
          extras: ["VIP Concierge Gesuch", wishes],
          guaranteedTotalChf: budgetChf,
          requestedTime: when,
          city,
          contact,
          notes: wishes,
        }),
      });
    } catch {}

    setSent(true);
    toast({
      title: "VIP Concierge-Gesuch an verifizierte Profile gesendet!",
      description: `Passende Anbieter/innen in ${city} können sich jetzt diskret bei dir melden.`,
    });
  };

  return (
    <div className="min-h-screen bg-[#0B1623] text-white">
      <SEO
        title="VIP Concierge & Diskretes Wunsch-Gesuch (Zürich, Zug & Schweiz) | iWantSexNow.ch"
        description="Keine Lust lange zu suchen? Poste dein anonymes VIP-Date-Gesuch mit deinem Fixpreis-Budget und lass passende Escorts oder Gigolos auf dich zukommen."
      />
      <header className="border-b border-[#C69C6D]/25 bg-[#07101A] py-4 sticky top-0 z-50">
        <div className="container mx-auto px-4 flex items-center justify-between">
          <Link href="/"><BrandLogo compact /></Link>
          <div className="hidden lg:block"><Navigation /></div>
          <MobileNav />
        </div>
      </header>

      <main className="container mx-auto px-4 py-10 max-w-4xl space-y-8">
        <div className="text-center space-y-3">
          <Badge className="bg-[#C69C6D]/20 text-[#D5A021] border border-[#C69C6D]/40">
            <Crown size={13} className="mr-1.5 inline" /> Swiss VIP Concierge · Umgekehrte Ausschreibung
          </Badge>
          <h1 className="text-3xl md:text-5xl font-serif font-black">
            Lass dich finden: Dein anonymes VIP-Wunsch-Gesuch
          </h1>
          <p className="text-gray-300 text-sm md:text-base max-w-2xl mx-auto">
            Du bist geschäftlich in <strong>Zürich, Zug, Cham, Basel oder Genf</strong> und möchtest nicht selbst 50 Profile durchklicken? Hinterlege hier anonym dein Wunsch-Date & Budget – nur geprüfte, sofort verfügbare Direktprofile erhalten deine Ausschreibung!
          </p>
        </div>

        <Card className="bg-[#09131E] border-2 border-[#C69C6D] p-6 md:p-8 rounded-3xl text-white shadow-2xl">
          {sent ? (
            <div className="text-center py-8 space-y-4">
              <CheckCircle2 size={44} className="text-emerald-400 mx-auto" />
              <h2 className="text-2xl font-serif font-black">
                Dein VIP-Gesuch (Budget: CHF {budgetChf}) ist im geschützten Provider-Radar aktiv!
              </h2>
              <p className="text-xs sm:text-sm text-gray-300 max-w-lg mx-auto">
                Deine Kontaktdaten sind im geschützten Lead-Tresor hinterlegt und nur für verifizierte Anbieter/innen sichtbar, die deinen Fixpreis von <strong>CHF {budgetChf}</strong> zu 100% akzeptieren.
              </p>
              <Button onClick={() => setSent(false)} className="bg-[#C69C6D] text-[#0D1B2A] font-black">
                Weiteres Gesuch aufgeben
              </Button>
            </div>
          ) : (
            <form onSubmit={handleBroadcastVipRequest} className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Wen suchst du?</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  >
                    <option value="Female Escort (High-Class)">👩 Female Escort (Einzeln)</option>
                    <option value="Duo (2 Damen)">👩‍❤️‍👩 Duo (2 Escorts gemeinsam)</option>
                    <option value="Gigolo / Male Companion (Für Dame oder Paar)">🤵 Gigolo / Callboy (Für Dame oder Paar)</option>
                    <option value="Trans VIP Companion">🏳️‍⚧️ Trans VIP Companion</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-gray-300 block mb-1">Dein garantiertes Fixpreis-Budget (CHF)</label>
                  <input
                    type="number"
                    min={300}
                    max={5000}
                    step={50}
                    value={budgetChf}
                    onChange={(e) => setBudgetChf(Number(e.target.value))}
                    className="w-full rounded-xl bg-black/50 border border-[#C69C6D]/50 px-3.5 py-2.5 text-base font-black text-[#D5A021]"
                  />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Stadt / Hotel / Treffpunkt</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
                <div>
                  <label className="text-xs text-gray-300 block mb-1">Gewünschte Zeit & Dauer</label>
                  <input
                    type="text"
                    value={when}
                    onChange={(e) => setWhen(e.target.value)}
                    required
                    className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">Deine Wünsche (Optik, Kleidung, Services, Diskretion)</label>
                <textarea
                  rows={3}
                  value={wishes}
                  onChange={(e) => setWishes(e.target.value)}
                  className="w-full rounded-xl bg-black/50 border border-white/20 px-3.5 py-2.5 text-sm text-white"
                />
              </div>

              <div>
                <label className="text-xs text-gray-300 block mb-1">
                  Dein diskreter Kontakt für Rückmeldungen (WhatsApp / Signal / Threema / SMS)
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

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C69C6D] via-[#F6E27A] to-[#C69C6D] text-[#0D1B2A] font-black py-6 text-base shadow-xl"
              >
                <Send size={16} className="mr-2" />
                Anonymes VIP-Gesuch (CHF {budgetChf}) an geprüfte Profile senden
              </Button>
            </form>
          )}
        </Card>
      </main>
      <SeoSiloFooter />
    </div>
  );
}