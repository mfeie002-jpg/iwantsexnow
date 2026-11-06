import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { ShieldCheck, Lock, Heart, Sparkles, ArrowRight } from "lucide-react";

export default function MembersLoungePage() {
  const [unlockedIds, setUnlockedIds] = useState<string[]>([]);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem("ch_unlocked_vaults") || "[]");
      if (Array.isArray(saved)) setUnlockedIds(saved);
    } catch {}
  }, []);

  const unlockedProfiles = useMemo(() => {
    const raw = (offersData as any[]) || [];
    return raw.filter((o) => unlockedIds.includes(o.id || o.dedupClusterId));
  }, [unlockedIds]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Diskrete Schweizer Gentleman-Lounge & Freigeschaltete Tresore | iwantsexnow.ch"
        description="Deine lokal gespeicherten Paid-Vault-Zugänge, Merkliste und Direktvergleich-Werkzeuge ohne Passwort- oder Account-Zwang."
        url="https://iwantsexnow.ch/members"
      />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <ShieldCheck size={14} /> ZERO-TRACE PRIVACY · KEINE REGISTRIERUNG ERFORDERLICH
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Deine persönliche Schweizer Gentleman-Lounge
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Alle deine freigeschalteten Paid-Vaults und Favoriten werden ausschliesslich lokal auf deinem Gerät gespeichert – 100 % anonym.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/favorites" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white">
              ♥ Meine Favoriten →
            </Link>
            <Link href="/premium" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
              👑 VIP 5er-Vault-Pass →
            </Link>
          </div>
        </section>

        <section className="p-6 rounded-2xl bg-[#121722] border border-white/10 space-y-4">
          <h2 className="text-lg font-serif font-bold text-white">
            Deine auf diesem Gerät freigeschalteten Paid-Vaults ({unlockedProfiles.length})
          </h2>
          {unlockedProfiles.length === 0 ? (
            <div className="p-8 rounded-xl bg-[#0D111A] border border-white/5 text-center space-y-3">
              <p className="text-xs text-gray-400">
                Du hast auf diesem Gerät aktuell noch keinen privaten Foto-/Video-Tresor freigeschaltet.
              </p>
              <Link href="/live-cam" className="px-4 py-2 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold inline-block">
                Paid-Vaults & Video-Dates entdecken →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedProfiles.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  className="p-4 rounded-xl bg-[#0D111A] border border-emerald-500/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-white">{p.rawName}</div>
                    <div className="text-[11px] text-emerald-400">✓ Privater Tresor freigeschaltet ({p.city}, {p.canton})</div>
                  </div>
                  <ArrowRight size={14} className="text-[#C8A97E]" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}