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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Diskreter Schweizer Paid-Vault Checkout (80/20 Fair-Split) | iwantsexnow.ch"
        description="Schalte private Foto- und Video-Tresore verifizierter Schweizer Anbieterinnen diskret frei. 80% direkte Ausschüttung an die Anbieterin."
        url="https://iwantsexnow.ch/checkout"
      />
      <LuxuryHeader />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <Link
          href={selectedProfile?.id ? `/profile/${encodeURIComponent(selectedProfile.id)}` : "/search"}
          className="inline-flex items-center gap-1.5 text-[13px] font-bold text-kirsche hover:underline"
        >
          <ArrowLeft size={14} /> Zurück zum Profil
        </Link>

        {receipt ? (
          <section className="p-8 rounded-2xl bg-white border border-mint-500/50 space-y-5 text-center">
            <div className="w-12 h-12 rounded-full bg-mint-500/20 text-mint-700 flex items-center justify-center mx-auto">
              <CheckCircle2 size={26} />
            </div>
            <div className="text-[13px] text-mint-700 font-bold">
              FREISCHALTUNG BESTÄTIGT · BELEG {receipt.receiptId}
            </div>
            <h1 className="text-2xl font-serif font-bold text-tinte">
              Privater Tresor von {selectedProfile.rawName} ist freigeschaltet!
            </h1>
            <p className="text-[13px] text-gray-700 max-w-md mx-auto">
              Betrag: <strong>CHF {receipt.amountChf}.–</strong> ({receipt.paymentMethod}) · Davon wurden{" "}
              <strong className="text-mint-700">CHF {receipt.creatorShareChf} (80 %)</strong> direkt dem Cockpit von{" "}
              {selectedProfile.rawName} gutgeschrieben.
            </p>
            <div className="pt-2">
              <Link
                href={`/profile/${encodeURIComponent(selectedProfile.id || selectedProfile.dedupClusterId)}`}
                className="px-6 py-3 rounded-xl bg-kirsche text-white font-extrabold text-[13px] inline-block"
              >
                Freigeschaltetes Profil & Galerie öffnen →
              </Link>
            </div>
          </section>
        ) : (
          <section className="p-6 sm:p-8 rounded-2xl bg-white border border-kirsche/40 space-y-6">
            <div className="flex items-start justify-between gap-4 border-b border-tinte/20 pb-5">
              <div>
                <div className="text-[13px] text-kirsche font-bold flex items-center gap-1.5">
                  <Lock size={13} /> Diskrete Schweizer Sofort-Freischaltung (Neutraler Beleg)
                </div>
                <h1 className="text-2xl font-serif font-bold text-tinte mt-1">
                  Paid-Vault Zugang: {selectedProfile.rawName} ({selectedProfile.city}, {selectedProfile.canton})
                </h1>
              </div>
              <div className="text-right">
                <div className="text-2xl font-extrabold text-kirsche">CHF {vaultPriceChf}.–</div>
                <div className="text-[13px] text-gray-600">Einmalig · Kein Abo</div>
              </div>
            </div>

            {/* Transparenter 80/20 Fair-Split Nachweis */}
            <div className="p-4 rounded-xl bg-papier border border-tinte/20 grid grid-cols-1 sm:grid-cols-3 gap-3 text-[13px]">
              <div>
                <div className="text-gray-600 text-[13px]">Gesamtbetrag (Einmalig)</div>
                <div className="font-bold text-tinte text-sm mt-0.5">CHF {vaultPriceChf}.00</div>
              </div>
              <div>
                <div className="text-gray-600 text-[13px]">Direkt an {selectedProfile.rawName} (80 %)</div>
                <div className="font-bold text-mint-700 text-sm mt-0.5">CHF {creator80.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-gray-600 text-[13px]">Plattform & Hosting (20 %)</div>
                <div className="font-bold text-kirsche text-sm mt-0.5">CHF {platform20.toFixed(2)}</div>
              </div>
            </div>

            {/* Zahlungsart wählen */}
            <div className="space-y-2">
              <label className="text-[13px] font-bold text-gray-700 ">
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
                        ? "bg-white border-kirsche text-tinte"
                        : "bg-papier border-tinte/20 text-gray-600"
                    }`}
                  >
                    <div className="text-[13px] font-extrabold">{m.label}</div>
                    <div className="text-[13px] text-gray-600 mt-0.5">{m.sub}</div>
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              disabled={processing}
              onClick={handleUnlock}
              className="w-full py-4 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] cursor-pointer shadow-lg"
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