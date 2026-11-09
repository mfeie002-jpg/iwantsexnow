import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import { Crown, Lock, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

export default function PremiumVipPage() {
  return (
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Schweizer VIP Vault-Pass & Diskreter Concierge-Zugang | iwantsexnow.ch"
        description="Schalte private Paid-Vault-Galerien im Vorteilspaket frei und erhalte Echtzeit-Verfügbarkeits-Signale für verifizierte Profile in Zug, Zürich, Luzern & Genf."
        url="https://iwantsexnow.ch/premium"
      />
      <LuxuryHeader />

      <PageIntro tone="butter" note="Mehr sehen, mehr sein" art="category:vip" title={<>VIP Vault-Bundles & Echtzeit-Verfügbarkeits-Radar</>}
        lead={<>Unterstütze unabhängige Schweizer Anbieterinnen direkt (<strong>80 % Fair-Split</strong>) und erhalte sofortigen Zugang zu privaten Foto- & Video-Tresoren ohne Einzelabrechnung.</>} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-tinte/20 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded bg-tinte/[0.06] text-kirsche text-[13px] font-extrabold ">
                Einzel-Freischaltung
              </span>
              <h2 className="text-xl font-serif font-bold text-tinte">1x Paid-Vault Direktzugang</h2>
              <div className="text-3xl font-extrabold text-tinte">CHF 29.–</div>
              <ul className="space-y-2 text-[13px] text-gray-700 pt-2 border-t border-tinte/20">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-mint-700" /> Sofortige Freischaltung eines Profil-Tresors</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-mint-700" /> 80 % (CHF 23.20) gehen direkt an die Anbieterin</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-mint-700" /> Zahlbar per TWINT, Karte oder Krypto</li>
              </ul>
            </div>
            <Link href="/checkout?amount=29" className="w-full py-3 rounded-xl bg-tinte/[0.06] hover:bg-tinte/[0.08] text-tinte font-extrabold text-[13px] text-center block">
              Einzel-Vault freischalten →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-kirsche flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded bg-kirsche text-white text-[13px] font-extrabold ">
                VIP 5er-Bundle (CHF 46.– sparen)
              </span>
              <h2 className="text-xl font-serif font-bold text-tinte">5x Schweizer Paid-Vault All-Access Pass</h2>
              <div className="text-3xl font-extrabold text-kirsche">CHF 99.–</div>
              <ul className="space-y-2 text-[13px] text-gray-700 pt-2 border-t border-tinte/20">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-mint-700" /> 5 freie Tresor-Freischaltungen in allen Kantonen</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-mint-700" /> Priorisierter Zugriff auf 1:1 Live-Cam & Video-Dates</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-mint-700" /> 100 % diskreter Einmalbetrag ohne Abo-Verlängerung</li>
              </ul>
            </div>
            <Link href="/checkout?profileId=vip-bundle-5&amount=99" className="w-full py-3 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] text-center block">
              👑 VIP 5er-Pass für CHF 99.– sichern →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}