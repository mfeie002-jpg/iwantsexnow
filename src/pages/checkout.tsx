import React, { useState } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Lock, ShieldCheck, CheckCircle2, CreditCard, Smartphone, Coins, ArrowLeft, Sparkles } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const itemTitle = String(router.query.title || "VIP Paid Content Paket (4K Video & Fotos)");
  const providerName = String(router.query.provider || "Verifiziertes Schweizer Profil");
  const profileId = String(router.query.profileId || "ch-a720e283e85f");
  const amountChf = Math.max(5, Number(router.query.amount) || 29);

  const [payMethod, setPayMethod] = useState<"twint" | "card" | "crypto">("twint");
  const [paidSuccess, setPaidSuccess] = useState(false);

  const providerShare = (amountChf * 0.8).toFixed(2);
  const platformFee = (amountChf * 0.2).toFixed(2);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title={`Diskreter Schweizer Checkout (CHF ${amountChf}) | iwantsexnow.ch`}
        description="Diskrete Sofort-Freischaltung für VIP Paid Content, 1:1 Video-Calls und Top-Spot Boosts auf iwantsexnow.ch."
        noindex={true}
      />
      <LuxuryHeader />

      <main className="max-w-3xl mx-auto px-6 py-10 space-y-6">
        <Link
          href={`/profile/${encodeURIComponent(profileId)}`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-300 hover:text-[#C8A97E]"
        >
          <ArrowLeft size={14} /> Zurück zum Profil von {providerName}
        </Link>

        <div className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 shadow-2xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-5">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
                <Lock size={13} /> DISKRETE SCHWEIZER ABRECHNUNG · NEUTRALER KONTOAUSZUG
              </div>
              <h1 className="text-2xl font-serif font-bold text-white mt-1">{itemTitle}</h1>
              <p className="text-xs text-gray-400 mt-0.5">
                Anbieterin: <strong className="text-white">{providerName}</strong> · 80 % Direkt-Auszahlung (CHF {providerShare})
              </p>
            </div>
            <div className="text-right">
              <div className="text-xs text-gray-400">Gesamtbetrag</div>
              <div className="text-3xl font-extrabold text-[#C8A97E]">CHF {amountChf}.00</div>
            </div>
          </div>

          {/* Transparente 80/20 Aufteilung */}
          <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
            <span className="text-gray-300">
              Direkt-Auszahlung an <strong>{providerName}</strong> (80 %): <strong className="text-emerald-400">CHF {providerShare}</strong>
            </span>
            <span className="text-gray-500">Plattform & Hosting (20 %): CHF {platformFee}</span>
          </div>

          {/* Auswahl Zahlungsart */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-300">
              Gewünschte Zahlungsmethode wählen
            </label>
            <div className="grid sm:grid-cols-3 gap-3">
              {[
                { id: "twint", label: "TWINT QR-Code", sub: "Sofort via Schweizer Banking-App", icon: Smartphone },
                { id: "card", label: "Kreditkarte / Apple Pay", sub: "Neutraler Beleg (CH Digital Media)", icon: CreditCard },
                { id: "crypto", label: "USDT / BTC / Crypto", sub: "100 % anonym ohne Bankbeleg", icon: Coins },
              ].map((m) => {
                const Icon = m.icon;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPayMethod(m.id as any)}
                    className={`p-4 rounded-xl border text-left transition cursor-pointer ${
                      payMethod === m.id ? "bg-[#C8A97E]/20 border-[#C8A97E]" : "bg-[#0D111A] border-white/10"
                    }`}
                  >
                    <Icon size={18} className="text-[#C8A97E] mb-2" />
                    <div className="text-xs font-bold text-white">{m.label}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{m.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {paidSuccess ? (
            <div className="p-5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 space-y-3">
              <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
                <CheckCircle2 size={18} className="text-emerald-400" />
                <span>Freischaltung erfolgreich aktiviert!</span>
              </div>
              <p className="text-xs text-gray-300">
                Dein Zugang zu <strong>{itemTitle}</strong> bei <strong>{providerName}</strong> ist ab sofort in deiner aktuellen Browser-Sitzung freigeschaltet.
              </p>
              <Link
                href={`/profile/${encodeURIComponent(profileId)}`}
                className="inline-block px-5 py-2.5 rounded-xl bg-emerald-500 text-[#07120B] font-extrabold text-xs uppercase"
              >
                Zurück zum freigeschalteten Profil →
              </Link>
            </div>
          ) : (
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="text-[11px] text-gray-400 flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-emerald-400" />
                <span>SSL-verschlüsselt · Kein Abo · Einmalzahlung CHF {amountChf}.00</span>
              </div>
              <button
                type="button"
                onClick={() => setPaidSuccess(true)}
                className="px-6 py-3.5 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider inline-flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Sparkles size={14} /> Jetzt für CHF {amountChf}.00 freischalten →
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}