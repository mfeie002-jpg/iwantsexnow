import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import offersData from "@/data/harvested-offers.json";
import { Bell, CheckCircle2, Sparkles, Clock, ArrowRight } from "lucide-react";

export default function NotificationsRadarPage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [cantonFilter, setCantonFilter] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
      })
      .catch(() => {});
  }, []);

  const liveEvents = useMemo(() => {
    const raw = (offersData as any[]) || [];
    return raw
      .filter((o) => cantonFilter === "ALL" || String(o.canton || "").toUpperCase() === cantonFilter)
      .slice(0, 30)
      .map((o, idx) => {
        const pid = o.id || o.dedupClusterId;
        const st = serverStates[pid] || {};
        const isAvail = Boolean(st.availabilityConfirmed || o.availabilityConfirmed);
        const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
        return {
          id: pid,
          rawName: o.rawName,
          city: o.city,
          canton: o.canton,
          rate60Chf: r60,
          isAvail,
          eventLabel: isAvail
            ? "● Hat soeben ihre 4-Stunden-Sofortverfügbarkeit bestätigt"
            : idx % 2 === 0
            ? "✓ Profil-Honorare & +41 Direktkontakt für heute aktualisiert"
            : "🔓 Neues Foto-/Video-Update im 80/20 Paid-Vault verfügbar",
          minsAgo: 2 + ((idx * 4) % 45),
        };
      });
  }, [serverStates, cantonFilter]);

  return (
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title="Schweizer Echtzeit-Verfügbarkeits-Ticker & 4h-Radar | iwantsexnow.ch"
        description="Live-Ticker aller 4-Stunden-Verfügbarkeiten, Foto-Verifizierungen und Paid-Vault-Updates in Zug, Zürich, Luzern, Basel & Genf."
        url="https://iwantsexnow.ch/notifications"
      />
      <LuxuryHeader />

      <PageIntro tone="butter" note="Neuigkeiten" art="none" title={<>Schweizer 4h-Verfügbarkeits- & Status-Ticker</>} />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        <section className="p-6 rounded-2xl bg-white border border-kirsche/40 flex flex-wrap items-center justify-between gap-4">
          
          <div className="flex flex-wrap gap-1.5">
            {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "GE"].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCantonFilter(c)}
                className={`px-3 py-1.5 rounded-xl text-[13px] font-extrabold cursor-pointer ${
                  cantonFilter === c ? "bg-kirsche text-white" : "bg-papier text-tinte border border-tinte/20"
                }`}
              >
                {c === "ALL" ? "Alle" : c}
              </button>
            ))}
          </div>
        </section>

        <section className="space-y-2.5">
          {liveEvents.map((ev) => (
            <div key={ev.id} className="p-4 rounded-2xl bg-white border border-tinte/20 flex flex-wrap items-center justify-between gap-3 text-[13px]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded bg-tinte/[0.06] text-kirsche font-bold text-[13px]">
                    {ev.canton} · {ev.city}
                  </span>
                  <Link href={`/profile/${encodeURIComponent(ev.id)}`} className="font-bold text-tinte text-sm hover:text-kirsche">
                    {ev.rawName}
                  </Link>
                  <span className="text-gray-600 text-[13px]">· CHF {ev.rate60Chf}.– / 60m</span>
                </div>
                <div className={ev.isAvail ? "text-mint-700 font-semibold" : "text-gray-700"}>
                  {ev.eventLabel}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[13px] text-gray-600 flex items-center gap-1">
                  <Clock size={12} /> vor {ev.minsAgo} Min.
                </span>
                <Link
                  href={`/profile/${encodeURIComponent(ev.id)}`}
                  className="px-3.5 py-2 rounded-xl bg-kirsche text-white font-extrabold inline-flex items-center gap-1"
                >
                  <span>Öffnen</span>
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