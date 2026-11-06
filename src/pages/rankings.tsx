import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { Trophy, Sparkles, CheckCircle2, ArrowRight, Flame } from "lucide-react";

export default function RankingsPage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [cantonFilter, setCantonFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});
  }, []);

  const rankedList = useMemo(() => {
    const blocked = new Set(blockedIds);
    const raw = (offersData as any[]) || [];
    const items: any[] = [];

    for (const o of raw) {
      const pid = o.id || o.dedupClusterId;
      if (!pid || blocked.has(pid)) continue;
      const st = serverStates[pid] || {};
      if (st.paused || st.hidden) continue;

      if (cantonFilter !== "ALL" && String(o.canton || "").toUpperCase() !== cantonFilter) continue;

      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      const isAvail = Boolean(st.availabilityConfirmed || o.availabilityConfirmed);
      const isVerif = Boolean(st.identityVerified || o.identityVerified);
      const isFeatured = Boolean(st.featured);
      const unlocks = Number(st.vaultUnlockCount || 0);

      const rankScore =
        (isFeatured ? 600 : 0) +
        (isAvail ? 400 : 0) +
        (isVerif ? 250 : 0) +
        unlocks * 80 +
        (o.rawPhone ? 100 : 0) +
        Number(o.curationScore || 75);

      items.push({
        ...o,
        id: pid,
        rate60Chf: r60,
        rate30Chf: r30,
        isAvail,
        isVerif,
        isFeatured,
        rankScore,
      });
    }

    items.sort((a, b) => b.rankScore - a.rankScore);
    return items.slice(0, 50);
  }, [serverStates, blockedIds, cantonFilter]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer Escort Top-50 Ranking & Kantonale Bestenliste (Zug, Zürich, Luzern) | iwantsexnow.ch"
        description="Tagesaktuelles Schweizer Top-50 Ranking unabhängiger Escort-, Tantra- & GFE-Profile nach Kanton (ZG, ZH, LU, BS, BE, GE), Echtzeit-Verfügbarkeit und Echtheits-Prüfung."
        url="https://iwantsexnow.ch/rankings"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <Trophy size={14} /> TAGESAKTUELLES SCHWEIZER KANTONS-RANKING (TOP 50)
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Gefragteste Profile nach Echtzeit-Status & Verifizierung
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Berechnet aus aktiver 4h-Verfügbarkeit, bestätigter Foto-Echtheit, Direktkontakt-Quote und Paid-Vault-Nachfrage.
            </p>
          </div>
          <Link href="/compare-escorts" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
            Top-Profile direkt vergleichen →
          </Link>
        </section>

        {/* Kantons-Umschalter */}
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCantonFilter(c)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                cantonFilter === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#121722] text-gray-300 border border-white/10"
              }`}
            >
              {c === "ALL" ? "🇨🇭 Gesamte Schweiz (Top 50)" : `Top Kanton ${c}`}
            </button>
          ))}
        </div>

        {/* Ranking-Liste */}
        <section className="space-y-3">
          {rankedList.map((p: any, idx: number) => (
            <div
              key={p.id}
              className="p-4 rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/50 flex flex-wrap items-center justify-between gap-4 transition"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm ${
                    idx < 3 ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] text-gray-400 border border-white/10"
                  }`}
                >
                  #{idx + 1}
                </div>
                <img
                  src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                  alt={p.rawName}
                  onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                  className="w-14 h-14 rounded-xl object-cover object-top border border-white/15"
                />
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-base font-serif font-bold text-white hover:text-[#C8A97E]">
                      {p.rawName}
                    </Link>
                    <span className="px-2 py-0.5 rounded bg-white/10 text-[#C8A97E] text-[10px] font-bold">
                      {p.canton} · {p.city}
                    </span>
                    {p.isAvail && (
                      <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-bold">
                        ● 4h Live
                      </span>
                    )}
                    {p.isVerif && (
                      <span className="px-2 py-0.5 rounded bg-[#C8A97E]/20 text-[#C8A97E] text-[10px] font-bold">
                        ✓ Geprüft
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    {p.age || 25} J. · {p.heightCm || 168} cm · Cup {p.cupSize || "C"} · {p.hairColor || "Brünett"} · Score:{" "}
                    <strong className="text-gray-200">{p.rankScore} Pkt.</strong>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 ml-auto">
                <div className="text-right">
                  <div className="text-sm font-extrabold text-[#C8A97E]">CHF {p.rate60Chf}.– / 60m</div>
                  <div className="text-[11px] text-gray-400">30 Min.: CHF {p.rate30Chf}.–</div>
                </div>
                <Link
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs inline-flex items-center gap-1"
                >
                  <span>Profil</span>
                  <ArrowRight size={12} />
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}