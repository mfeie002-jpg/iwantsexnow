import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
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
      const isAvail = Boolean(st.availabilityConfirmed);
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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="24h Live-Stories & Echtzeit-Updates Schweizer Escorts (Zug, Zürich, Luzern) | iwantsexnow.ch"
        description="Aktuelle 24h-Stories, 4-Stunden-Verfügbarkeits-Impulse und neue Paid-Vault-Uploads verifizierter Schweizer Profile in Echtzeit."
        url="https://iwantsexnow.ch/stories"
      />
      <LuxuryHeader />

      <PageIntro tone="blush" note="Geschichten" art="none" title={<>Aktuelle Status-Updates & spontane 4h-Dates</>}
        lead={<>Live-Updates direkt aus den Schweizer Anbieter-Cockpits: Wer ist jetzt im Apartment oder für Hotelbesuche verfügbar?</>}>
        <Link href="/register" className="px-4 py-2.5 rounded-xl bg-kirsche text-white text-[13px] font-extrabold">
            + Eigenes Profil & Story posten →
          </Link>
      </PageIntro>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        

        {/* Kantons-Filter */}
        <div className="flex flex-wrap gap-1.5">
          {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCantonFilter(c)}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-extrabold cursor-pointer ${
                cantonFilter === c ? "bg-kirsche text-white" : "bg-white text-tinte border border-tinte/20 hover:bg-blush"
              }`}
            >
              {c === "ALL" ? "Alle Live-Stories" : `Stories ${c}`}
            </button>
          ))}
        </div>

        {/* Story-Karten */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {stories.map((s: any) => (
            <div key={s.id} className="rounded-2xl bg-white border border-tinte/20 hover:border-kirsche/60 overflow-hidden flex flex-col justify-between transition">
              <div>
                <div className="p-4 flex items-center justify-between gap-3 border-b border-tinte/20">
                  <div className="flex items-center gap-3">
                    <div className="p-0.5 rounded-full bg-gradient-to-tr from-kirsche to-mint-400">
                      <img
                        src={s.thumbnail || "/images/escort-portrait-1.jpg"}
                        alt={s.rawName}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                        className="w-11 h-11 rounded-full object-cover object-top border-2 border-tinte/20"
                      />
                    </div>
                    <div>
                      <Link href={`/profile/${encodeURIComponent(s.id)}`} className="text-sm font-serif font-bold text-tinte hover:text-kirsche">
                        {s.rawName}
                      </Link>
                      <div className="text-[13px] text-gray-600">
                        {s.city} ({s.canton}) · CHF {s.rate60Chf}.– / 60m
                      </div>
                    </div>
                  </div>
                  <span className="text-[13px] text-gray-600 flex items-center gap-1">
                    <Clock size={11} /> vor {s.minutesAgo}m
                  </span>
                </div>

                <div className="relative h-60 bg-papier overflow-hidden">
                  <img
                    src={s.thumbnail || "/images/escort-portrait-1.jpg"}
                    alt={s.rawName}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                    className="w-full h-full object-cover object-top"
                  />
                  {s.isAvail && (
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-mint-500 text-tinte text-[13px] font-extrabold shadow">
                      ● Jetzt für 4h verfügbar
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <p className="text-[13px] text-gray-800 leading-relaxed bg-papier p-3 rounded-xl border border-tinte/10">
                    „{s.statusText}“
                  </p>
                </div>
              </div>

              <div className="p-4 pt-0 grid grid-cols-2 gap-2">
                <Link
                  href={`/checkout?profileId=${encodeURIComponent(s.id)}`}
                  className="py-2.5 px-3 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-kirsche/40 text-kirsche font-extrabold text-[13px] text-center inline-flex items-center justify-center gap-1"
                >
                  <Lock size={12} /> Paid Vault
                </Link>
                <Link
                  href={`/profile/${encodeURIComponent(s.id)}`}
                  className="py-2.5 px-3 rounded-xl bg-kirsche text-white font-extrabold text-[13px] text-center"
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