import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { Gift, Sparkles, Heart, CheckCircle2 } from "lucide-react";

const GIFT_ITEMS = [
  { id: "gift-rose", title: "🌹 Überraschungs-Gruss & Kaffee-Tip", amountChf: 20, desc: "Direkte Aufmerksamkeit ins Cockpit der Anbieterin (CHF 16.– Netto an sie)." },
  { id: "gift-champagne", title: "🥂 Rosé-Champagner für unser Date", amountChf: 45, desc: "Perfekter Einstieg vor einem Apartment- oder Hotel-Date (CHF 36.– Netto an sie)." },
  { id: "gift-lingerie", title: "👙 Exklusiver Dessous- & High-Heels-Wunsch", amountChf: 80, desc: "Wunsch-Outfit für euren gemeinsamen Termin oder ein privates Foto-Set (CHF 64.– Netto an sie)." },
  { id: "gift-vip", title: "💎 Gentleman VIP-Tribut (100% Diskret)", amountChf: 150, desc: "Grosszügige Wertschätzung mit 80 % Sofort-Gutschrift (CHF 120.– Netto an sie)." },
];

export default function GiftsPage() {
  const profiles = useMemo(() => ((offersData as any[]) || []).slice(0, 50), []);
  const [selectedId, setSelectedId] = useState<string>(profiles[0]?.id || "rosalon-188");

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Diskrete Schweizer Aufmerksamkeiten & 80/20 Creator-Tips | iwantsexnow.ch"
        description="Sende verifizierten Schweizer Anbieterinnen diskret ein Trinkgeld, Champagner-Vorbestellung oder Wunsch-Geschenk per TWINT (80% direkte Ausschüttung)."
        url="https://iwantsexnow.ch/gifts"
      />
      <LuxuryHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-2">
          <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
            <Gift size={14} /> 80 % DIREKTE GUTSCHRIFT AN DIE ANBIETERIN · NEUTRALER TWINT-BELEG
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Schweizer Gentleman-Aufmerksamkeiten & Wunsch-Geschenke
          </h1>
          <p className="text-xs text-gray-300">
            Bereite deiner Favoritin vor einem Date eine Freude oder bedanke dich diskret – <strong>80 % des Betrags</strong> werden sofort ihrem Cockpit gutgeschrieben.
          </p>
        </section>

        <div className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-bold text-gray-300">Empfängerin auswählen:</span>
          <select
            value={selectedId}
            onChange={(e) => setSelectedId(e.target.value)}
            className="w-full sm:w-96 rounded-xl bg-[#0D111A] border border-white/15 px-3.5 py-2.5 text-xs text-white font-bold"
          >
            {profiles.map((p: any) => (
              <option key={p.id} value={p.id}>
                {p.rawName} ({p.city}, {p.canton})
              </option>
            ))}
          </select>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {GIFT_ITEMS.map((g) => (
            <div key={g.id} className="p-6 rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/50 flex flex-col justify-between gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h2 className="text-base font-serif font-bold text-white">{g.title}</h2>
                  <span className="text-lg font-extrabold text-[#C8A97E]">CHF {g.amountChf}.–</span>
                </div>
                <p className="text-xs text-gray-400">{g.desc}</p>
              </div>
              <Link
                href={`/checkout?profileId=${encodeURIComponent(selectedId)}&amount=${g.amountChf}`}
                className="w-full py-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider text-center block"
              >
                🎁 Jetzt für CHF {g.amountChf}.– senden (80 % direkt) →
              </Link>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}