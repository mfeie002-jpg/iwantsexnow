import React from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Crown, Lock, ShieldCheck, CheckCircle2, Sparkles } from "lucide-react";

export default function PremiumVipPage() {
  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer VIP Vault-Pass & Diskreter Concierge-Zugang | iwantsexnow.ch"
        description="Schalte private Paid-Vault-Galerien im Vorteilspaket frei und erhalte Echtzeit-Verfügbarkeits-Signale für verifizierte Profile in Zug, Zürich, Luzern & Genf."
        url="https://iwantsexnow.ch/premium"
      />
      <LuxuryHeader />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <section className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-3">
          <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
            <Crown size={14} /> DISKRETER SCHWEIZER VIP-PASS · 100% NEUTRALE ABRECHNUNG
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            VIP Vault-Bundles & Echtzeit-Verfügbarkeits-Radar
          </h1>
          <p className="text-xs text-gray-300 max-w-2xl">
            Unterstütze unabhängige Schweizer Anbieterinnen direkt (<strong>80 % Fair-Split</strong>) und erhalte sofortigen Zugang zu privaten Foto- & Video-Tresoren ohne Einzelabrechnung.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-[#121722] border border-white/10 flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded bg-white/10 text-[#C8A97E] text-[10px] font-extrabold uppercase">
                Einzel-Freischaltung
              </span>
              <h2 className="text-xl font-serif font-bold text-white">1x Paid-Vault Direktzugang</h2>
              <div className="text-3xl font-extrabold text-white">CHF 29.–</div>
              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Sofortige Freischaltung eines Profil-Tresors</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 80 % (CHF 23.20) gehen direkt an die Anbieterin</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Zahlbar per TWINT, Karte oder Krypto</li>
              </ul>
            </div>
            <Link href="/checkout?amount=29" className="w-full py-3 rounded-xl bg-white/10 hover:bg-white/15 text-white font-extrabold text-xs uppercase tracking-wider text-center block">
              Einzel-Vault freischalten →
            </Link>
          </div>

          <div className="p-6 rounded-2xl bg-[#171E2E] border border-[#C8A97E] flex flex-col justify-between gap-6">
            <div className="space-y-3">
              <span className="px-2.5 py-1 rounded bg-[#C8A97E] text-[#0D111A] text-[10px] font-extrabold uppercase">
                VIP 5er-Bundle (CHF 46.– sparen)
              </span>
              <h2 className="text-xl font-serif font-bold text-white">5x Schweizer Paid-Vault All-Access Pass</h2>
              <div className="text-3xl font-extrabold text-[#C8A97E]">CHF 99.–</div>
              <ul className="space-y-2 text-xs text-gray-300 pt-2 border-t border-white/10">
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 5 freie Tresor-Freischaltungen in allen Kantonen</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> Priorisierter Zugriff auf 1:1 Live-Cam & Video-Dates</li>
                <li className="flex items-center gap-2"><CheckCircle2 size={14} className="text-emerald-400" /> 100 % diskreter Einmalbetrag ohne Abo-Verlängerung</li>
              </ul>
            </div>
            <Link href="/checkout?profileId=vip-bundle-5&amount=99" className="w-full py-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider text-center block">
              👑 VIP 5er-Pass für CHF 99.– sichern →
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}