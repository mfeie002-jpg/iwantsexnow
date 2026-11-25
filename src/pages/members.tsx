import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Diskrete Schweizer Gentleman-Lounge & Freigeschaltete Tresore | iwantsexnow.ch"
        description="Deine lokal gespeicherten Paid-Vault-Zugänge, Merkliste und Direktvergleich-Werkzeuge ohne Passwort- oder Account-Zwang."
        url="https://iwantsexnow.ch/members"
      />
      <LuxuryHeader />

      <PageIntro tone="flieder" note="Mitglieder" art="none" title={<>Deine persönliche Schweizer Gentleman-Lounge</>}
        lead={<>Alle deine freigeschalteten Paid-Vaults und Favoriten werden ausschliesslich lokal auf deinem Gerät gespeichert – 100 % anonym.</>}>
        <div className="flex gap-2">
            <Link href="/favorites" className="px-4 py-2.5 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-bold text-tinte">
              ♥ Meine Favoriten →
            </Link>
            <Link href="/premium" className="px-4 py-2.5 rounded-xl bg-kirsche text-white text-[13px] font-extrabold">
              👑 VIP 5er-Vault-Pass →
            </Link>
          </div>
      </PageIntro>

      <main className="guide">
        

        <section className="p-6 rounded-2xl bg-white border border-tinte/20 space-y-4">
          <h2 className="text-lg font-serif font-bold text-tinte">
            Deine auf diesem Gerät freigeschalteten Paid-Vaults ({unlockedProfiles.length})
          </h2>
          {unlockedProfiles.length === 0 ? (
            <div className="p-8 rounded-xl bg-papier border border-tinte/10 text-center space-y-3">
              <p className="text-[13px] text-gray-600">
                Du hast auf diesem Gerät aktuell noch keinen privaten Foto-/Video-Tresor freigeschaltet.
              </p>
              <Link href="/live-cam" className="px-4 py-2 rounded-xl bg-kirsche text-white text-[13px] font-extrabold inline-block">
                Paid-Vaults & Video-Dates entdecken →
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {unlockedProfiles.map((p: any) => (
                <Link
                  key={p.id}
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  className="p-4 rounded-xl bg-papier border border-mint-500/40 flex items-center justify-between gap-3"
                >
                  <div>
                    <div className="text-sm font-bold text-tinte">{p.rawName}</div>
                    <div className="text-[13px] text-mint-700">✓ Privater Tresor freigeschaltet ({p.city}, {p.canton})</div>
                  </div>
                  <ArrowRight size={14} className="text-kirsche" />
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}