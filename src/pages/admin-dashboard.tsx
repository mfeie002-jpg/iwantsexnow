import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import pilotData from "@/data/pilot-20-cohort.json";
import statsData from "@/data/index-stats.json";
import clubsData from "@/data/swiss-establishments-vault.json";
import { ExternalLink, Copy, CheckCircle2, Phone, Building2, Users, Inbox } from "lucide-react";

export default function AdminDashboardPage() {
  const [adminPin] = useState("SWISS-BOSS-2026");
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [serverMetrics, setServerMetrics] = useState<Record<string, any>>({});
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [takedowns, setTakedowns] = useState<any[]>([]);
  const [copiedSlot, setCopiedSlot] = useState<number | null>(null);
  const [filterCanton, setFilterCanton] = useState<"ALL" | "ZG" | "ZH">("ALL");
  const [adminTab, setAdminTab] = useState<"pilots" | "verifications" | "leads" | "takedowns">("pilots");
  const [toast, setToast] = useState<string | null>(null);

  const loadBackendState = () => {
    fetch(`/api/vault/metrics?adminPin=${encodeURIComponent(adminPin)}`, {
      headers: { "x-admin-pin": adminPin },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d) {
          setServerStates(d.states || {});
          setServerMetrics(d.metrics || {});
          setEnquiries(d.enquiries || []);
          setTakedowns(d.takedowns || []);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadBackendState();
  }, []);

  const triggerAdminUpdate = async (profileId: string, updates: Record<string, any>, msg: string) => {
    await fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
      body: JSON.stringify({ action: "update_profile_state", profileId, adminPin, updates }),
    });
    setToast(msg);
    loadBackendState();
    setTimeout(() => setToast(null), 3000);
  };

  const trigger4hAvailability = async (profileId: string, name: string) => {
    await fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": adminPin },
      body: JSON.stringify({ action: "confirm_availability_4h", profileId, adminPin }),
    });
    setToast(`✓ 4h-Verfügbarkeit für ${name} live geschaltet!`);
    loadBackendState();
    setTimeout(() => setToast(null), 3000);
  };

  const pilots = useMemo(() => {
    const raw = (pilotData as any[]) || [];
    return raw.filter((p) => filterCanton === "ALL" || p.canton === filterCanton);
  }, [filterCanton]);

  const verificationRequests = useMemo(() => {
    return Object.values(serverStates).filter((st: any) => st.identityRequested && !st.identityVerified);
  }, [serverStates]);

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
      <SEO title="Master-Steuerpult (Backend-Zentrale) | iWantSexNow.ch" description="Vollständige Backend-Steuerung für Profile, Identitätsprüfungen, Kunden-Anfragen und Meldungen." noindex={true} />
      <LuxuryHeader />
      <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
        {toast && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 shadow-xl">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span>{toast}</span>
          </div>
        )}

        <div className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-emerald-400 font-bold">
              ● BACKEND KOMPLETT VERBUNDEN · 0 AUTOMATISCHE NACHRICHTEN (100% MANUELLE KONTROLLE)
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              iWantSexNow.ch Master-Backend & Admin-Zentrale
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Link href="/create-post" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white">+ Neues Profil anlegen</Link>
            <Link href="/login" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#C8A97E]">Login-Seite testen</Link>
            <Link href="/" className="px-4 py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">Öffentliche Startseite ↗</Link>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
            <div className="text-xs text-gray-400 flex items-center gap-1.5"><Users size={14} className="text-[#C8A97E]" /> Schweizer Gesamt-Index</div>
            <div className="text-3xl font-extrabold text-white mt-1">{(statsData as any)?.uniqueFrontendProfiles || 2526}</div>
            <div className="text-[11px] text-emerald-400 mt-1">In {cantonRows.length} Kantonen aktiv</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
            <div className="text-xs text-gray-400 flex items-center gap-1.5"><Phone size={14} className="text-emerald-400" /> Echte +41 Rufnummern</div>
            <div className="text-3xl font-extrabold text-emerald-400 mt-1">{(statsData as any)?.unlockedRealPhones || 995}</div>
            <div className="text-[11px] text-gray-400 mt-1">{(statsData as any)?.mobileWhatsappReadyPhones || 974} Handynummern (075–079)</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
            <div className="text-xs text-gray-400 flex items-center gap-1.5"><Building2 size={14} className="text-[#C8A97E]" /> Stationäre Clubs & Studios</div>
            <div className="text-3xl font-extrabold text-[#C8A97E] mt-1">{Array.isArray(clubsData) ? clubsData.length : 305}</div>
          </div>
          <div className="p-5 rounded-2xl bg-[#121722] border border-white/10">
            <div className="text-xs text-gray-400 flex items-center gap-1.5"><Inbox size={14} className="text-sky-400" /> Kunden-Anfragen & Prüfungen</div>
            <div className="text-3xl font-extrabold text-sky-300 mt-1">{enquiries.length} Leads / {verificationRequests.length} Prüf.</div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-[#121722] p-2 rounded-2xl border border-white/10">
          <button type="button" onClick={() => setAdminTab("pilots")} className={`py-3 px-3 rounded-xl text-xs font-extrabold cursor-pointer ${adminTab === "pilots" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-300 hover:bg-white/5"}`}>1. Pilot-20 & Live-Schalter (ZG/ZH)</button>
          <button type="button" onClick={() => setAdminTab("verifications")} className={`py-3 px-3 rounded-xl text-xs font-extrabold cursor-pointer ${adminTab === "verifications" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-300 hover:bg-white/5"}`}>2. Identitäts-Prüfungen ({verificationRequests.length})</button>
          <button type="button" onClick={() => setAdminTab("leads")} className={`py-3 px-3 rounded-xl text-xs font-extrabold cursor-pointer ${adminTab === "leads" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-300 hover:bg-white/5"}`}>3. Kunden-Anfragen / Leads ({enquiries.length})</button>
          <button type="button" onClick={() => setAdminTab("takedowns")} className={`py-3 px-3 rounded-xl text-xs font-extrabold cursor-pointer ${adminTab === "takedowns" ? "bg-[#C8A97E] text-[#0D111A]" : "text-gray-300 hover:bg-white/5"}`}>4. Opt-Outs & Meldungen ({takedowns.length})</button>
        </div>

        {adminTab === "pilots" && (
          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg sm:text-xl font-serif font-bold text-white">Pilot-20 Live-Steuerung (10x Kanton Zug · 10x Kanton Zürich)</h2>
              <div className="flex gap-2">
                {(["ALL", "ZG", "ZH"] as const).map((c) => (
                  <button key={c} type="button" onClick={() => setFilterCanton(c)} className={`px-3.5 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${filterCanton === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] text-gray-300 border border-white/10"}`}>
                    {c === "ALL" ? "Alle 20 (ZG + ZH)" : `Nur ${c} (10)`}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 uppercase text-[10px]">
                    <th className="py-3 px-2">Slot</th>
                    <th className="py-3 px-2">Ort</th>
                    <th className="py-3 px-2">Name & Aufrufe</th>
                    <th className="py-3 px-2">+41 Handy</th>
                    <th className="py-3 px-2">CHF 30m/60m</th>
                    <th className="py-3 px-2">Admin Schnell-Schalter</th>
                    <th className="py-3 px-2 text-right">Cockpit & Profil</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {pilots.map((p) => {
                    const st = serverStates[p.profileId] || {};
                    const mt = serverMetrics[p.profileId] || {};
                    const isAvail = Boolean(st.availabilityConfirmed || (st.availableUntil && new Date(st.availableUntil).getTime() > Date.now()));
                    const isVerif = Boolean(st.identityVerified);
                    const isSpons = Boolean(st.sponsored);
                    const isPaused = Boolean(st.paused || st.hidden);
                    const cockpitPath = `/creator-dashboard?id=${encodeURIComponent(p.profileId)}&token=${encodeURIComponent(p.ownerToken)}`;

                    return (
                      <tr key={p.profileId} className="hover:bg-white/5">
                        <td className="py-3.5 px-2 font-bold text-[#C8A97E]">#{p.pilotSlot}</td>
                        <td className="py-3.5 px-2"><span className="px-2 py-0.5 rounded bg-white/10 font-bold text-white mr-1">{p.canton}</span><span className="text-gray-300">{st.city || p.city}</span></td>
                        <td className="py-3.5 px-2"><div className="font-bold text-white">{st.displayName || p.name}</div><div className="text-[10px] text-gray-500">{p.profileId} · {mt.views || 0} Views · {mt.contactClicks || 0} Kontakte</div></td>
                        <td className="py-3.5 px-2 font-semibold text-emerald-400">{st.phoneDisplay || p.phoneDisplay}</td>
                        <td className="py-3.5 px-2 text-gray-200">{st.rate30Chf || p.rate30Chf} / <strong className="text-[#C8A97E]">{st.rate60Chf || p.rate60Chf}</strong></td>
                        <td className="py-3.5 px-2">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <button type="button" onClick={() => trigger4hAvailability(p.profileId, st.displayName || p.name)} className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${isAvail ? "bg-emerald-500 text-[#07120B]" : "bg-[#0D111A] border border-white/15 text-gray-300"}`}>{isAvail ? "● 4h Aktiv" : "+ 4h Verfügbar"}</button>
                            <button type="button" onClick={() => triggerAdminUpdate(p.profileId, { identityVerified: !isVerif }, `✓ Prüf-Status für ${st.displayName || p.name} geändert!`)} className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${isVerif ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] border border-white/15 text-gray-300"}`}>{isVerif ? "✓ Geprüft" : "✓ Prüfen"}</button>
                            <button type="button" onClick={() => triggerAdminUpdate(p.profileId, { sponsored: !isSpons }, `★ Top-Spot Status aktualisiert!`)} className={`px-2 py-1 rounded-lg font-bold cursor-pointer ${isSpons ? "bg-amber-500/30 border border-amber-400 text-amber-200" : "bg-[#0D111A] border border-white/15 text-gray-400"}`}>★ Top</button>
                            <button type="button" onClick={() => triggerAdminUpdate(p.profileId, { paused: !isPaused }, isPaused ? "Profil wieder eingeblendet!" : "Profil ausgeblendet!")} className={`px-2 py-1 rounded-lg font-bold cursor-pointer ${isPaused ? "bg-rose-500/30 text-rose-300" : "bg-[#0D111A] border border-white/15 text-gray-400"}`}>{isPaused ? "Pausiert" : "Aktiv"}</button>
                          </div>
                        </td>
                        <td className="py-3.5 px-2 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <Link href={cockpitPath} className="px-2.5 py-1.5 rounded-lg bg-[#C8A97E] text-[#0D111A] font-extrabold inline-flex items-center gap-1"><span>Cockpit</span><ExternalLink size={11} /></Link>
                            <Link href={`/profile/${encodeURIComponent(p.profileId)}`} className="px-2.5 py-1.5 rounded-lg bg-white/10 text-white font-semibold">Profil ↗</Link>
                            <button type="button" onClick={() => copyCockpitLink(p.pilotSlot, p.directCockpitUrl)} className="px-2 py-1.5 rounded-lg bg-[#0D111A] border border-white/15 text-gray-300 cursor-pointer">{copiedSlot === p.pilotSlot ? "✓" : <Copy size={11} />}</button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {adminTab === "verifications" && (
          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-serif font-bold text-white">Offene Anträge auf Dokumentierte Identitätsprüfung (✓)</h2>
            {verificationRequests.length === 0 ? (
              <p className="text-xs text-gray-400">Aktuell keine offenen Prüfanträge.</p>
            ) : (
              <div className="space-y-3">
                {verificationRequests.map((req: any) => (
                  <div key={req.profileId} className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex items-center justify-between gap-4">
                    <div><div className="font-bold text-white">{req.displayName} ({req.city}, {req.canton})</div><div className="text-xs text-gray-400">ID: {req.profileId} · Telefon: {req.phoneDisplay}</div></div>
                    <button type="button" onClick={() => triggerAdminUpdate(req.profileId, { identityVerified: true }, `✓ Identität für ${req.displayName} bestätigt!`)} className="px-4 py-2 rounded-xl bg-emerald-500 text-[#07120B] font-extrabold text-xs cursor-pointer">✓ Jetzt freischalten</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {adminTab === "leads" && (
          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-serif font-bold text-white">Eingegangene Private Kunden-Anfragen ({enquiries.length})</h2>
            {enquiries.length === 0 ? (
              <p className="text-xs text-gray-400">Noch keine privaten Rückruf-Anfragen eingegangen.</p>
            ) : (
              <div className="space-y-3">
                {enquiries.map((lead: any) => (
                  <div key={lead.id} className="p-4 rounded-xl bg-[#0D111A] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs">
                    <div>
                      <div className="font-bold text-white">Anfrage für <span className="text-[#C8A97E]">{lead.providerName}</span> ({lead.profileId})</div>
                      <div className="text-gray-300 mt-0.5">Kunden-Rückrufnummer: <strong className="text-emerald-400">{lead.clientContact}</strong> · Wunschzeit: <strong>{lead.desiredTime}</strong></div>
                    </div>
                    <span className="text-gray-500">{new Date(lead.createdAt).toLocaleString("de-CH")}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {adminTab === "takedowns" && (
          <div className="bg-[#121722] border border-white/10 rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-serif font-bold text-white">Vertrauliche Meldungen & Opt-Out-Fälle ({takedowns.length})</h2>
            {takedowns.length === 0 ? (
              <p className="text-xs text-gray-400">Keine offenen Opt-Out-Meldungen vorliegend.</p>
            ) : (
              <div className="space-y-3">
                {takedowns.map((t: any) => (
                  <div key={t.caseId} className="p-4 rounded-xl bg-[#0D111A] border border-rose-500/30 flex items-center justify-between gap-4 text-xs">
                    <div><div className="font-bold text-rose-300">{t.caseId} · Profil: {t.profileId}</div><div className="text-gray-400">{t.reason} · {t.details}</div></div>
                    <span className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 font-bold">{t.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}