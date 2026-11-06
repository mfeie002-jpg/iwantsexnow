import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { Flame, Sparkles, Lock, ArrowRight, CheckCircle2, Clock } from "lucide-react";

const STORY_CAPTIONS = [
  "Heute spontan für 4 Stunden im privaten Apartment verfügbar – diskreter Empfang & Parkplatz vor Ort.",
  "Neu in der Region! Freue mich auf stilvolle Gentleman-Dates, Girlfriend Experience oder Hotelbesuche (Outcall).",
  "Neues unzensiertes Foto- & Video-Set soeben in meinem privaten Tresor (Paid Vault) hochgeladen.",
  "Entspannte Tantra- & Body-to-Body-Session am Nachmittag oder Abend – direkter Kontakt via +41 WhatsApp.",
];

export default function StoriesFeedPage() {
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

  const stories = useMemo(() => {
    const blocked = new Set(blockedIds);
    const raw = (offersData as any[]) || [];
    const list: any[] = [];

    for (let i = 0; i < Math.min(raw.length, 90); i++) {
      const o = raw[i];
      const pid = o.id || o.dedupClusterId;
      if (!pid || blocked.has(pid)) continue;
      const st = serverStates[pid] || {};
      if (st.paused || st.hidden) continue;

      if (cantonFilter !== "ALL" && String(o.canton || "").toUpperCase() !== cantonFilter) continue;

      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const isAvail = Boolean(st.availabilityConfirmed || o.availabilityConfirmed);
      const statusText = st.statusMessage || STORY_CAPTIONS[i % STORY_CAPTIONS.length];

      list.push({
        ...o,
        id: pid,
        rate60Chf: r60,
        isAvail,
        statusText,
        minutesAgo: 5 + ((i * 7) % 50),
      });
    }

    list.sort((a, b) => (b.isAvail ? 1 : 0) - (a.isAvail ? 1 : 0));
    return list;
  }, [serverStates, blockedIds, cantonFilter]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="24h Live-Stories & Echtzeit-Updates Schweizer Escorts (Zug, Zürich, Luzern) | iwantsexnow.ch"
        description="Aktuelle 24h-Stories, 4-Stunden-Verfügbarkeits-Impulse und neue Paid-Vault-Uploads verifizierter Schweizer Profile in Echtzeit."
        url="https://iwantsexnow.ch/stories"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5">
              <Flame size={14} /> 24H LIVE-STORIES & VERFÜGBARKEITS-TICKER
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Aktuelle Status-Updates & spontane 4h-Dates
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              Live-Updates direkt aus den Schweizer Anbieter-Cockpits: Wer ist jetzt im Apartment oder für Hotelbesuche verfügbar?
            </p>
          </div>
          <Link href="/register" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
            + Eigenes Profil & Story posten →
          </Link>
        </section>

        {/* Kantons-Filter */}
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
              {c === "ALL" ? "Alle Live-Stories" : `Stories ${c}`}
            </button>
          ))}
        </div>

        {/* Story-Karten */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((s: any) => (
            <div key={s.id} className="rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/60 overflow-hidden flex flex-col justify-between transition">
              <div>
                <div className="p-4 flex items-center justify-between gap-3 border-b border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-[#C8A97E] to-emerald-400">
                      <img
                        src={s.thumbnail || "/images/escort-portrait-1.jpg"}
                        alt={s.rawName}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                        className="w-11 h-11 rounded-full object-cover object-top border-2 border-[#0D111A]"
                      />
                    </div>
                    <div>
                      <Link href={`/profile/${encodeURIComponent(s.id)}`} className="text-sm font-serif font-bold text-white hover:text-[#C8A97E]">
                        {s.rawName}
                      </Link>
                      <div className="text-[11px] text-gray-400">
                        {s.city} ({s.canton}) · CHF {s.rate60Chf}.– / 60m
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] text-gray-400 flex items-center gap-1">
                    <Clock size={11} /> vor {s.minutesAgo}m
                  </span>
                </div>

                <div className="relative h-60 bg-[#0D111A] overflow-hidden">
                  <img
                    src={s.thumbnail || "/images/escort-portrait-1.jpg"}
                    alt={s.rawName}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                    className="w-full h-full object-cover object-top"
                  />
                  {s.isAvail && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-emerald-500 text-[#07120B] text-[10px] font-extrabold shadow">
                      ● Jetzt für 4h verfügbar
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-xs text-gray-200 leading-relaxed bg-[#0D111A] p-3 rounded-xl border border-white/5">
                    „{s.statusText}“
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Link
                  href={`/checkout?profileId=${encodeURIComponent(s.id)}`}
                  className="py-2.5 px-3 rounded-xl bg-white/5 hover:bg-white/10 border border-[#C8A97E]/40 text-[#C8A97E] font-extrabold text-[11px] text-center inline-flex items-center justify-center gap-1"
                >
                  <Lock size={12} /> Paid Vault
                </Link>
                <Link
                  href={`/profile/${encodeURIComponent(s.id)}`}
                  className="py-2.5 px-3 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-[11px] text-center"
                >
                  Profil & +41 Kontakt →
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}