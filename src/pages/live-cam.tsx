import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { Video, Sparkles, Lock, Phone, ShieldCheck, CheckCircle2, Search } from "lucide-react";

export default function LiveCamPage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [cantonFilter, setCantonFilter] = useState<string>("ALL");
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});
  }, []);

  const camProfiles = useMemo(() => {
    const blocked = new Set(blockedIds);
    const raw = (offersData as any[]) || [];
    const list: any[] = [];

    for (const o of raw.slice(0, 120)) {
      const pid = o.id || o.dedupClusterId;
      if (!pid || blocked.has(pid)) continue;
      const st = serverStates[pid] || {};
      if (st.paused || st.hidden) continue;

      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const cam15Chf = Math.max(40, Math.min(180, Math.round((r60 * 0.22) / 5) * 5));
      const vaultChf = Number(st.vaultPriceChf || o.vaultPriceChf) || 29;
      const isOnline = Boolean(st.availabilityConfirmed || o.availabilityConfirmed);

      if (cantonFilter !== "ALL" && String(o.canton || "").toUpperCase() !== cantonFilter) continue;
      if (onlyOnline && !isOnline) continue;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const hay = `${o.rawName || ""} ${o.city || ""} ${o.canton || ""}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }

      list.push({
        ...o,
        id: pid,
        rate60Chf: r60,
        cam15Chf,
        vaultChf,
        isOnline,
        identityVerified: Boolean(st.identityVerified || o.identityVerified),
      });
    }

    list.sort((a, b) => (b.isOnline ? 1 : 0) - (a.isOnline ? 1 : 0));
    return list;
  }, [serverStates, blockedIds, cantonFilter, onlyOnline, searchQuery]);

  return (
    <div className="min-h-screen bg-[#07141a] text-[#f2f7f6] pb-24">
      <SEO
        title="Schweizer Live-Cam, Video-Dates & Private 80/20 Paid-Vaults | iwantsexnow.ch"
        description="Diskrete Schweizer 1:1 Video-Dates per WhatsApp/Telegram und sofort freischaltbare Foto-/Video-Tresore (80% Ausschüttung direkt an die Anbieterin)."
        url="https://iwantsexnow.ch/live-cam"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#0d1f27] border border-[#ff6b5e]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-mint-400 font-bold flex items-center gap-1.5">
              <Video size={14} /> DISKRETE 1:1 VIDEO-CALLS & PRIVATE CREATOR-TRESORE (80/20 SPLIT)
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Schweizer Live-Video-Dates & Paid-Vault Freischaltung
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Direkte 1:1 Video-Sessions mit echten Schweizer Profilen oder sofortige Freischaltung privater Foto-/Video-Galerien via TWINT & Karte.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setOnlyOnline(!onlyOnline)}
              className={`px-4 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer transition ${
                onlyOnline ? "bg-mint-500 text-[#07141a]" : "bg-[#07141a] border border-mint-500/40 text-mint-300"
              }`}
            >
              ● Nur jetzt live verfügbar
            </button>
          </div>
        </section>

        {/* Kantons- & Suchleiste */}
        <section className="p-4 rounded-2xl bg-[#0d1f27] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-1.5">
            {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCantonFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-extrabold cursor-pointer ${
                  cantonFilter === c ? "bg-[#ff6b5e] text-[#07141a]" : "bg-[#07141a] text-gray-300 border border-white/10"
                }`}
              >
                {c === "ALL" ? "Alle Kantone" : c}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Name oder Ort suchen..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#07141a] border border-white/15 text-xs text-white"
            />
          </div>
        </section>

        {/* Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {camProfiles.map((p: any) => (
            <div key={p.id} className="rounded-2xl bg-[#0d1f27] border border-white/10 hover:border-[#ff6b5e]/60 overflow-hidden flex flex-col justify-between transition group">
              <div>
                <div className="relative h-64 bg-[#07141a] overflow-hidden">
                  <img
                    src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                    alt={p.rawName}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {p.isOnline ? (
                      <span className="px-2.5 py-1 rounded-full bg-mint-500 text-[#07141a] text-[10px] font-extrabold shadow">
                        ● Live für Video & Treffen
                      </span>
                    ) : (
                      <span className="px-2.5 py-1 rounded-full bg-black/75 text-gray-200 border border-white/15 text-[10px] font-bold">
                        Video nach Anfrage
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/80 border border-white/15 text-xs font-extrabold text-[#ff6b5e]">
                    15m Video: CHF {p.cam15Chf}.–
                  </div>
                </div>

                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#ff6b5e]">{p.canton} · {p.city}</span>
                    <span className="text-gray-400">Reales Treffen: CHF {p.rate60Chf}.– / 60m</span>
                  </div>
                  <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block text-base font-serif font-bold text-white hover:text-[#ff6b5e] truncate">
                    {p.rawName}
                  </Link>
                  <div className="text-xs text-gray-300">
                    {p.age || 25} J. · {p.heightCm || 168} cm · Cup {p.cupSize || "C"} · {p.hairColor || "Brünett"}
                  </div>
                </div>
              </div>

              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Link
                  href={`/checkout?profileId=${encodeURIComponent(p.id)}&amount=${p.vaultChf}`}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#ff6b5e]/40 text-[#ff6b5e] font-extrabold text-[11px] text-center inline-flex items-center justify-center gap-1"
                >
                  <Lock size={12} /> Vault CHF {p.vaultChf}.–
                </Link>
                <Link
                  href={`/profile/${encodeURIComponent(p.id)}`}
                  className="py-2.5 px-3 rounded-xl bg-[#ff6b5e] hover:bg-[#e8564a] text-[#07141a] font-extrabold text-[11px] text-center"
                >
                  Profil & +41 Call →
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}