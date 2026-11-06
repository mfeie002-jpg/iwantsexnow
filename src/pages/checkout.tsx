import React, { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { ShieldCheck, Lock, CheckCircle2, Sparkles, CreditCard, ArrowLeft } from "lucide-react";

export default function CheckoutPage() {
  const router = useRouter();
  const profileId = String(router.query.profileId || router.query.id || "").trim();
  const [paymentMethod, setPaymentMethod] = useState<"TWINT" | "CARD" | "CRYPTO">("TWINT");
  const [processing, setProcessing] = useState(false);
  const [receipt, setReceipt] = useState<any>(null);

  const selectedProfile = useMemo(() => {
    const raw = (offersData as any[]) || [];
    if (profileId) {
      const found = raw.find((o) => (o.id || o.dedupClusterId) === profileId);
      if (found) return found;
    }
    return raw[0] || { id: "demo-zug", rawName: "Verifiziertes Schweizer Profil", city: "Zug", canton: "ZG", advertisedBaseChf: 350 };
  }, [profileId]);

  const vaultPriceChf = Number(router.query.amount) || Number(selectedProfile?.vaultPriceChf) || 29;
  const creator80 = Math.round(vaultPriceChf * 0.8 * 100) / 100;
  const platform20 = Math.round(vaultPriceChf * 0.2 * 100) / 100;

  const handleUnlock = async () => {
    setProcessing(true);
    try {
      const pid = selectedProfile.id || selectedProfile.dedupClusterId;
      const r = await fetch("/api/vault/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: pid,
          amountChf: vaultPriceChf,
          paymentMethod,
        }),
      });
      const d = await r.json();
      if (d?.ok) {
        try {
          const unlocked = JSON.parse(localStorage.getItem("ch_unlocked_vaults") || "[]");
          if (!unlocked.includes(pid)) unlocked.push(pid);
          localStorage.setItem("ch_unlocked_vaults", JSON.stringify(unlocked));
        } catch {}
        setReceipt(d);
      }
    } catch {}
    setProcessing(false);
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Diskreter Schweizer Paid-Vault Checkout (80/20 Fair-Split) | iwantsexnow.ch"
        description="Schalte private Foto- und Video-Tresore verifizierter Schweizer Anbieterinnen diskret frei. 80% direkte Ausschüttung an die Anbieterin."
        url="https://iwantsexnow.ch/checkout"
      />
      <LuxuryHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link
          href={selectedProfile?.id ? `/profile/${encodeURIComponent(selectedProfile.id)}` : "/search"}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C8A97E] hover:underline"
        >
          <ArrowLeft size={14} /> Zurück zum Profil
        </Link>

        {receipt ? (
          <section className="p-8 rounded-2xl bg-[#121722] border border-emerald-500/50 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
              <CheckCircle2 size={26} />
            </div>
            <div className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
              FREISCHALTUNG BESTÄTIGT · BELEG {receipt.receiptId}
            </div>
            <h1 className="text-2xl font-serif font-bold text-white">
              Privater Tresor von {selectedProfile.rawName} ist freigeschaltet!
            </h1>
            <p className="text-xs text-gray-300 max-w-md mx-auto">
              Betrag: <strong>CHF {receipt.amountChf}.–</strong> ({receipt.paymentMethod}) · Davon wurden{" "}
              <strong className="text-emerald-400">CHF {receipt.creatorShareChf} (80 %)</strong> direkt dem Cockpit von{" "}
              {selectedProfile.rawName} gutgeschrieben.
            </p>
            <div className="pt-2">
              <Link
                href={`/profile/${encodeURIComponent(selectedProfile.id || selectedProfile.dedupClusterId)}`}
                className="px-6 py-3 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider inline-block"
              >
                Freigeschaltetes Profil & Galerie öffnen →
              </Link>
            </div>
          </section>
        ) : (
          <section className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-white/10 pb-5">
              <div>
                <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
                  <Lock size={13} /> DISKRETE SCHWEIZER SOFORT-FREISCHALTUNG (NEUTRALER BELEG)
                </div>
                <h1 className="text-2xl font-serif font-bold text-white mt-1">
                  Paid-Vault Zugang: {selectedProfile.rawName} ({selectedProfile.city}, {selectedProfile.canton})
                </h1>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-[#C8A97E]">CHF {vaultPriceChf}.–</div>
                <div className="text-[10px] text-gray-400">Einmalig · Kein Abo</div>
              </div>
            </div>

            {/* Transparenter 80/20 Fair-Split Nachweis */}
            <div className="p-4 rounded-xl bg-[#0D111A] border border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div>
                <div className="text-gray-400 text-[11px]">Gesamtbetrag (Einmalig)</div>
                <div className="font-bold text-white text-sm mt-0.5">CHF {vaultPriceChf}.00</div>
              </div>
              <div>
                <div className="text-gray-400 text-[11px]">Direkt an {selectedProfile.rawName} (80 %)</div>
                <div className="font-bold text-emerald-400 text-sm mt-0.5">CHF {creator80.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-400 text-[11px]">Plattform & Hosting (20 %)</div>
                <div className="font-bold text-[#C8A97E] text-sm mt-0.5">CHF {platform20.toFixed(2)}</div>
              </div>
            </div>

            {/* Zahlungsart wählen */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider">
                Diskrete Zahlungsmethode wählen (neutrale Abrechnung):
              </label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { id: "TWINT", label: "🇨🇭 TWINT Express", sub: "Sofort & Diskret" },
                  { id: "CARD", label: "💳 Kredit-/Debitkarte", sub: "Visa / Mastercard" },
                  { id: "CRYPTO", label: "⚡ USDT / BTC", sub: "100% Anonym" },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-3.5 rounded-xl border text-left cursor-pointer transition ${
                      paymentMethod === m.id
                        ? "bg-[#192030] border-[#C8A97E] text-white"
                        : "bg-[#0D111A] border-white/10 text-gray-400"
                    }`}
                  >
                    <div className="text-xs font-extrabold">{m.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5">{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={processing}
              onClick={handleUnlock}
              className="w-full py-4 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider cursor-pointer shadow-lg"
            >
              {processing
                ? "Freischaltung wird verschlüsselt..."
                : `🔓 Jetzt für CHF ${vaultPriceChf}.– diskret freischalten (80 % an ${selectedProfile.rawName}) →`}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}