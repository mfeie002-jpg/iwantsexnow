import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import pilotData from "@/data/pilot-20-cohort.json";
import statsData from "@/data/index-stats.json";
import clubsData from "@/data/swiss-establishments-vault.json";
import {
  ShieldCheck,
  ExternalLink,
  Copy,
  CheckCircle2,
  Phone,
  Clock,
  Building2,
  Users,
  Sparkles,
  Lock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [serverMetrics, setServerMetrics] = useState<Record<string, any>>({});
  const [copiedSlot, setCopiedSlot] = useState<number | null>(null);
  const [filterCanton, setFilterCanton] = useState<"ALL" | "ZG" | "ZH">("ALL");

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d) {
          setServerStates(d.states || {});
          setServerMetrics(d.metrics || {});
        }
      })
      .catch(() => {});
  }, []);

  const pilots = useMemo(() => {
    const raw = (pilotData as any[]) || [];
    return raw.filter((p) => filterCanton === "ALL" || p.canton === filterCanton);
  }, [filterCanton]);

  const cantonRows = useMemo(() => {
    const bd = (statsData as any)?.cantonBreakdown || {};
    return Object.entries(bd)
      .map(([canton, count]) => ({ canton, count: Number(count) }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const copyCockpitLink = (slot: number, url: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedSlot(slot);
      setTimeout(() => setCopiedSlot(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Master-Steuerpult: Pilot-20 (ZG/ZH) & Schweizer Gesamt-Index | iWantSexNow.ch"
        description="Interne Admin-Steuerung für die 20 vorautorisierten Pilot-Cockpits in Zug und Zürich."
        noindex={true}
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Top Banner: 100% Manuelle Kontrolle */}
        <div className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
              ● SICHERER TROCKENMODUS AKTIV · 0 AUTOMATISCHE NACHRICHTEN VERSENDET
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Schweizer Index- & Pilot-20 Master-Steuerpult (Zug & Zürich)
            </h1>
            <p className="text-xs text-gray-400 mt-1">
              Alle 20 Pilot-Cockpits sind vorbefüllt (Name, Ort, +41 Handy, 30m/60m CHF-Preise, Fotos & Paid-Content-Vault). Es wird niemand automatisch kontaktiert.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/compare-escorts"
              className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white"
            >
              Vergleichs-Matrix →
            </Link>
            <Link
              href="/"
              className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold"
            >
              Öffentliche Startseite ↗
            </Link>
          </div>
        </div>

        {/* 4 Haupt-Kennzahlen */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <Users size={14} className="text-[#C8A97E]" /> Deduplizierte Schweizer Profile
            </div>
            <div className="text-3xl font-extrabold text-white mt-1">
              {(statsData as any)?.uniqueFrontendProfiles || 2526}
            </div>
            <div className="text-[11px] text-emerald-400 mt-1">In 24 Schweizer Kantonen aktiv</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <Phone size={14} className="text-emerald-400" /> Echte +41 Rufnummern (Bereinigt)
            </div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">
              {(statsData as any)?.unlockedRealPhones || 998}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">
              Davon {(statsData as any)?.mobileWhatsappReadyPhones || 977} Handynummern (075–079)
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <Building2 size={14} className="text-[#C8A97E]" /> Stationäre Clubs & Laufhäuser
            </div>
            <div className="text-3xl font-extrabold text-[#C8A97E] mt-1">
              {Array.isArray(clubsData) ? clubsData.length : 305}
            </div>
            <div className="text-[11px] text-gray-400 mt-1">Inkl. extrahierter Tages-Anwesenheitslisten</div>
          </div>

          <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
            <div className="text-xs text-gray-400 flex items-center gap-1.5">
              <Sparkles size={14} className="text-sky-400" /> Vorautorisierte Pilot-Cockpits
            </div>
            <div className="text-3xl font-extrabold text-sky-300 mt-1">20</div>
            <div className="text-[11px] text-gray-400 mt-1">10x Kanton Zug (ZG) · 10x Kanton Zürich (ZH)</div>
          </div>
        </div>

        {/* Pilot-20 Tabelle mit Direkt-Links ins Anbieter-Cockpit */}
        <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">
                Deine 20 vorautorisierten Pilot-Cockpits (10x ZG · 10x ZH)
              </h2>
              <p className="text-xs text-gray-400">
                Klicke auf „Cockpit öffnen“, um das Profil aus Sicht der Anbieterin zu testen, oder kopiere den Magic-Link für deine manuelle 5er-Testgruppe.
              </p>
            </div>
            <div className="flex gap-2">
              {(["ALL", "ZG", "ZH"] as const).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilterCanton(c)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    filterCanton === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] text-gray-300 border border-white/10"
                  }`}
                >
                  {c === "ALL" ? "Alle 20 (ZG + ZH)" : `Nur ${c} (10)`}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                  <th className="py-3 px-3">Slot</th>
                  <th className="py-3 px-3">Kanton / Ort</th>
                  <th className="py-3 px-3">Name & ID</th>
                  <th className="py-3 px-3">Verifizierte +41 Handy-Nr.</th>
                  <th className="py-3 px-3">Tarif (30m / 60m)</th>
                  <th className="py-3 px-3">Live-Status</th>
                  <th className="py-3 px-3 text-right">Aktionen (Manuell)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {pilots.map((p) => {
                  const st = serverStates[p.profileId] || {};
                  const mt = serverMetrics[p.profileId] || {};
                  const isAvail = Boolean(
                    st.availabilityConfirmed || (st.availableUntil && new Date(st.availableUntil).getTime() > Date.now())
                  );
                  const cockpitPath = `/creator-dashboard?id=${encodeURIComponent(p.profileId)}&token=${encodeURIComponent(p.ownerToken)}`;

                  return (
                    <tr key={p.profileId} className="hover:bg-white/5">
                      <td className="py-3.5 px-3 font-bold text-[#C8A97E]">#{p.pilotSlot}</td>
                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-white/10 font-bold text-white mr-1.5">{p.canton}</span>
                        <span className="text-gray-300">{st.city || p.city}</span>
                      </td>
                      <td className="py-3.5 px-3">
                        <div className="font-bold text-white">{st.displayName || p.name}</div>
                        <div className="text-[10px] text-gray-500">{p.profileId} · {mt.views || 0} Aufrufe</div>
                      </td>
                      <td className="py-3.5 px-3 font-semibold text-emerald-400">{st.phoneDisplay || p.phoneDisplay}</td>
                      <td className="py-3.5 px-3 text-gray-200">
                        CHF {st.rate30Chf || p.rate30Chf} / <strong className="text-[#C8A97E]">CHF {st.rate60Chf || p.rate60Chf}</strong>
                      </td>
                      <td className="py-3.5 px-3">
                        {isAvail ? (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-bold inline-flex items-center gap-1">
                            <Clock size={11} /> 4h Verfügbar aktiv
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-gray-400">
                            Trockentest bereit
                          </span>
                        )}
                      </td>
                      <td className="py-3.5 px-3 text-right">
                        <div className="inline-flex items-center gap-2">
                          <Link
                            href={cockpitPath}
                            className="px-3 py-1.5 rounded-lg bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold inline-flex items-center gap-1"
                          >
                            <span>Cockpit öffnen</span>
                            <ExternalLink size={11} />
                          </Link>
                          <Link
                            href={`/profile/${encodeURIComponent(p.profileId)}`}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-white font-semibold"
                          >
                            Profil ↗
                          </Link>
                          <button
                            type="button"
                            onClick={() => copyCockpitLink(p.pilotSlot, p.directCockpitUrl)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#0D111A] border border-white/15 text-gray-300 hover:text-white inline-flex items-center gap-1 cursor-pointer"
                            title="Magic-Link in Zwischenablage kopieren (0 Nachrichten werden gesendet)"
                          >
                            {copiedSlot === p.pilotSlot ? (
                              <span className="text-emerald-400 font-bold">✓ Kopiert</span>
                            ) : (
                              <>
                                <Copy size={11} /> Link
                              </>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kantonsverteilung aller 24 Schweizer Kantone */}
        <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
          <h2 className="text-lg font-serif font-bold text-white">
            Schweizer Kantonsverteilung ({cantonRows.length} aktive Kantone · 2.526 Profile)
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3 text-xs">
            {cantonRows.map((r) => (
              <Link
                key={r.canton}
                href={`/?canton=${encodeURIComponent(r.canton)}`}
                className="p-3 rounded-xl bg-[#0D111A] border border-white/10 hover:border-[#C8A97E] flex items-center justify-between transition"
              >
                <span className="font-bold text-[#C8A97E]">{r.canton}</span>
                <span className="text-white font-semibold">{r.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}