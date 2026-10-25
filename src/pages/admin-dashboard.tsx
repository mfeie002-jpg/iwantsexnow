import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import readyClaimsData from "@/data/ready-whatsapp-claims.json";
import pilot20Data from "@/data/pilot-20-cohort.json";
import { Lock, Check, ExternalLink } from "lucide-react";

export default function RealMasterAdminDashboard() {
  const [unlocked, setUnlocked] = useState<boolean>(false);
  const [pinInput, setPinInput] = useState<string>("");
  const [authError, setAuthError] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"pilot20" | "cases" | "profiles" | "claims" | "audit">("pilot20");
  const [cantonFilter, setCantonFilter] = useState<string>("ALL");

  const [serverData, setServerData] = useState<{
    metrics: Record<string, any>;
    states: Record<string, any>;
    takedowns: any[];
    blocklist: string[];
    auditLog: any[];
  }>({
    metrics: {},
    states: {},
    takedowns: [],
    blocklist: [],
    auditLog: [],
  });

  const loadAdminData = async (pin: string) => {
    try {
      const res = await fetch("/api/vault/metrics", {
        headers: { "x-admin-pin": pin },
      });
      const data = await res.json();
      if (data.ok && Array.isArray(data.takedowns)) {
        setServerData({
          metrics: data.metrics || {},
          states: data.states || {},
          takedowns: data.takedowns || [],
          blocklist: data.blocklist || [],
          auditLog: data.auditLog || [],
        });
        setUnlocked(true);
        setAuthError("");
      } else {
        setAuthError("Ungültiger Admin-Schlüssel oder keine Berechtigung.");
      }
    } catch {
      setAuthError("Serverfehler bei der Admin-Authentifizierung.");
    }
  };

  const handleAdminAction = async (profileId: string, updates: Record<string, any>) => {
    await fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": pinInput },
      body: JSON.stringify({
        action: "update_profile_state",
        profileId,
        adminPin: pinInput,
        updates,
      }),
    });
    await loadAdminData(pinInput);
  };

  const handleResolveCase = async (caseId: string, resolutionStatus: string) => {
    await fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": pinInput },
      body: JSON.stringify({
        action: "resolve_case",
        caseId,
        resolutionStatus,
        adminPin: pinInput,
      }),
    });
    await loadAdminData(pinInput);
  };

  const claimsList = useMemo(() => {
    const arr = Array.isArray(readyClaimsData) ? readyClaimsData : [];
    if (cantonFilter === "ALL") return arr;
    return arr.filter((c: any) => String(c.canton || "").toUpperCase() === cantonFilter);
  }, [cantonFilter]);

  const pilotList = useMemo(() => {
    return Array.isArray(pilot20Data) ? pilot20Data : [];
  }, []);

  if (!unlocked) {
    return (
      <div className="min-h-screen bg-[#090A0F] text-white">
        <SEO title="Admin-Authentifizierung | iwantsexnow.ch" noindex />
        <LuxuryHeader />
        <div className="max-w-md mx-auto px-4 py-16">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              loadAdminData(pinInput.trim());
            }}
            className="p-7 rounded-2xl bg-[#11131C] border border-white/15 space-y-4 text-center"
          >
            <div className="w-12 h-12 rounded-xl bg-[#C8A97E]/15 border border-[#C8A97E]/40 flex items-center justify-center mx-auto text-[#C8A97E]">
              <Lock size={20} />
            </div>
            <h1 className="text-xl font-serif font-bold">Geschützte Administration</h1>
            <p className="text-xs text-gray-400">
              Zugriff auf Pilot-Kohorte, Fallakten, Prüfentscheidungen und Quellenverwaltung erfordert den serverseitig geprüften Admin-Schlüssel.
            </p>
            {authError && <div className="text-xs text-rose-400 font-semibold">{authError}</div>}
            <input
              type="password"
              required
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Admin-Schlüssel eingeben"
              className="w-full px-4 py-3 rounded-xl bg-[#090A0F] border border-white/15 text-center text-sm text-white"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#C8A97E] text-[#090A0F] font-bold text-xs uppercase tracking-wider cursor-pointer"
            >
              Sitzung autorisieren
            </button>
          </form>
        </div>
      </div>
    );
  }

  const profilesSample = (Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : []).slice(0, 40);

  return (
    <div className="min-h-screen bg-[#090A0F] text-white pb-20">
      <SEO title="Admin-Moderation & Pilot-Steuerung | iwantsexnow.ch" noindex />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#C8A97E]">
              VERBUNDENE BETRIEBS-, PILOT- & MODERATIONSZENTRALE
            </span>
            <h1 className="text-2xl font-serif font-bold mt-0.5">
              Pilot-20 Kohorte (ZG/ZH), Fälle, Prüfungen & Quellen
            </h1>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span className="px-3 py-1.5 rounded-lg bg-[#C8A97E]/15 border border-[#C8A97E]/40 text-[#C8A97E] font-semibold">
              Pilot-Kohorte: {pilotList.length} Profile
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold">
              Offene Meldungen: {serverData.takedowns.length}
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold">
              Importsperren: {serverData.blocklist.length}
            </span>
          </div>
        </div>

        {/* Admin Navigation */}
        <div className="flex flex-wrap gap-2 border-b border-white/10 pb-3">
          {[
            { id: "pilot20", label: `🎯 1. Pilot-20 Kohorte ZG & ZH (${pilotList.length})` },
            { id: "cases", label: `🛡️ 2. Vertrauliche Meldungen (${serverData.takedowns.length})` },
            { id: "profiles", label: "✓ 3. Profile & Identitätsprüfung" },
            { id: "claims", label: `📲 4. Alle +41 Kontakte (${claimsList.length})` },
            { id: "audit", label: `📋 5. Änderungsprotokoll (${serverData.auditLog.length})` },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setActiveTab(t.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeTab === t.id
                  ? "bg-[#C8A97E] text-[#090A0F]"
                  : "bg-[#11131C] text-gray-300 border border-white/10"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* TAB 1: PILOT-20 COHORT TRACKER (Arbeitspaket 10) */}
        {activeTab === "pilot20" && (
          <div className="p-6 rounded-2xl bg-[#11131C] border border-[#C8A97E]/40 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-serif font-bold text-white">
                  Betreuter Pilot (Arbeitspaket 10): Die ersten 20 Token-autorisierten Profile in Zug & Zürich
                </h2>
                <p className="text-xs text-gray-400 mt-0.5">
                  Jedes dieser 20 Profile besitzt einen eigenen kryptografischen Owner-Token. Mit 1 Klick kannst du das jeweilige Cockpit prüfen oder die sachliche Einladung zur kostenlosen Profilkontrolle senden.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="p-2.5"># & Pilot-ID</th>
                    <th className="p-2.5">Name & Ort</th>
                    <th className="p-2.5">Geprüfte +41 Handynummer</th>
                    <th className="p-2.5">Live-Status & Pflege</th>
                    <th className="p-2.5">Aktionen (Cockpit-Test & 1-Klick Einladung)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {pilotList.map((p: any) => {
                    const st = serverData.states[p.profileId] || {};
                    const mt = serverData.metrics[p.profileId] || { detailOpens: 0 };
                    return (
                      <tr key={p.profileId} className="hover:bg-white/5">
                        <td className="p-2.5 font-mono text-[#C8A97E] font-bold">
                          #{p.pilotSlot} · {p.profileId}
                        </td>
                        <td className="p-2.5 font-bold text-white">
                          {st.displayName || p.name}{" "}
                          <span className="text-gray-400 font-normal">
                            ({p.city}, {p.canton})
                          </span>
                        </td>
                        <td className="p-2.5 font-mono text-emerald-300">{p.phoneDisplay}</td>
                        <td className="p-2.5 space-x-1">
                          {st.availabilityConfirmed ? (
                            <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">
                              ● Verfügbar (4h)
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded bg-white/5 text-gray-400">Bereit</span>
                          )}
                          {st.identityVerified && (
                            <span className="px-2 py-0.5 rounded bg-[#C8A97E]/20 text-[#C8A97E] font-bold">
                              ✓ Geprüft
                            </span>
                          )}
                          <span className="text-gray-400 ml-1">({mt.detailOpens || 0} Aufrufe)</span>
                        </td>
                        <td className="p-2.5 flex flex-wrap items-center gap-2">
                          <a
                            href={p.waInviteUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="px-3 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-black font-bold inline-block"
                          >
                            📲 WhatsApp Pilot-Link senden
                          </a>
                          <Link
                            href={`/creator-dashboard?id=${encodeURIComponent(p.profileId)}&token=${encodeURIComponent(p.ownerToken)}`}
                            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 font-semibold inline-flex items-center gap-1"
                          >
                            <span>Cockpit öffnen</span>
                            <ExternalLink size={12} />
                          </Link>
                          <button
                            type="button"
                            onClick={() =>
                              handleAdminAction(p.profileId, {
                                identityVerified: !st.identityVerified,
                                claimed: true,
                              })
                            }
                            className="px-2.5 py-1.5 rounded-lg bg-[#C8A97E]/20 hover:bg-[#C8A97E] text-[#C8A97E] hover:text-black font-bold cursor-pointer"
                          >
                            {st.identityVerified ? "✓ Entziehen" : "✓ Prüfen"}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: CONFIDENTIAL TAKEDOWN & REPORT CASES */}
        {activeTab === "cases" && (
          <div className="p-6 rounded-2xl bg-[#11131C] border border-white/10 space-y-4">
            <h2 className="text-lg font-serif font-bold">Eingegangene Meldungen & Widersprüche (/report)</h2>
            {serverData.takedowns.length === 0 ? (
              <p className="text-xs text-gray-400">Aktuell liegen keine offenen Meldungen vor.</p>
            ) : (
              <div className="space-y-3">
                {serverData.takedowns.map((c: any) => (
                  <div
                    key={c.id}
                    className="p-4 rounded-xl bg-[#090A0F] border border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-[#C8A97E]">{c.id}</span>
                        <span className="px-2 py-0.5 rounded bg-white/10 text-white font-semibold">
                          Status: {c.status}
                        </span>
                        <span className="text-gray-400">{new Date(c.createdAt).toLocaleString("de-CH")}</span>
                      </div>
                      <div className="font-bold text-white">
                        Profil: {c.profileName || "Unbekannt"} (ID: {c.profileId || "keine ID"}) · Grund: {c.category}
                      </div>
                      <div className="text-gray-300">Nachricht: {c.reason}</div>
                      <div className="text-gray-400">Vertraulicher Rückkanal: {c.contact}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => handleResolveCase(c.id, "resolved_removed")}
                        className="px-3 py-1.5 rounded-lg bg-rose-500/20 border border-rose-500/40 text-rose-200 font-bold cursor-pointer"
                      >
                        Dauerhaft entfernen & sperren
                      </button>
                      <button
                        type="button"
                        onClick={() => handleResolveCase(c.id, "restored")}
                        className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-gray-200 font-semibold cursor-pointer"
                      >
                        Freigeben
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: PROFILE MODERATION */}
        {activeTab === "profiles" && (
          <div className="p-6 rounded-2xl bg-[#11131C] border border-white/10 overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-white/10 text-gray-400">
                  <th className="p-3">ID & Name</th>
                  <th className="p-3">Ort</th>
                  <th className="p-3">Echte Aufrufe</th>
                  <th className="p-3">Aktueller Zustand</th>
                  <th className="p-3">Admin-Entscheidung (Wirkt sofort öffentlich)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {profilesSample.map((p: any, idx: number) => {
                  const pid = p.dedupClusterId || `ch-${idx + 1}`;
                  const st = serverData.states[pid] || {};
                  const mt = serverData.metrics[pid] || { views: 0, detailOpens: 0 };

                  return (
                    <tr key={pid} className="hover:bg-white/5">
                      <td className="p-3 font-bold text-white">
                        <div>{st.displayName || p.rawName}</div>
                        <div className="text-[10px] text-gray-500 font-mono">{pid}</div>
                      </td>
                      <td className="p-3 text-gray-300">{st.city || p.city} ({p.canton})</td>
                      <td className="p-3 text-gray-300">{mt.detailOpens || 0} Aufrufe</td>
                      <td className="p-3 space-x-1">
                        {st.hidden ? (
                          <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">Gesperrt</span>
                        ) : (
                          <span className="px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300">Sichtbar</span>
                        )}
                        {st.identityVerified && (
                          <span className="px-2 py-0.5 rounded bg-[#C8A97E]/20 text-[#C8A97E] font-bold">
                            ✓ Geprüft
                          </span>
                        )}
                      </td>
                      <td className="p-3 flex flex-wrap gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleAdminAction(pid, { identityVerified: !st.identityVerified, claimed: true })}
                          className="px-2.5 py-1 rounded bg-[#C8A97E]/20 hover:bg-[#C8A97E] text-[#C8A97E] hover:text-black font-bold transition cursor-pointer"
                        >
                          {st.identityVerified ? "✓ Prüfung entziehen" : "✓ Identität bestätigen"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminAction(pid, { sponsored: !st.sponsored })}
                          className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-gray-200 cursor-pointer"
                        >
                          {st.sponsored ? "Anzeige beenden" : "Als Anzeige markieren"}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAdminAction(pid, { hidden: !st.hidden })}
                          className="px-2.5 py-1 rounded bg-rose-500/20 hover:bg-rose-500 text-rose-200 hover:text-black font-bold transition cursor-pointer"
                        >
                          {st.hidden ? "Wiederherstellen" : "Ausblenden"}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 4: ALL +41 CONTACTS (444 ZH + ZG etc.) */}
        {activeTab === "claims" && (
          <div className="p-6 rounded-2xl bg-[#11131C] border border-white/10 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-serif font-bold">
                Alle geprüften Schweizer +41 Kontakte ({claimsList.length})
              </h2>
              <div className="flex gap-1.5">
                {["ALL", "ZG", "ZH", "LU", "AG", "BS", "BE", "SG"].map((c) => (
                  <button
                    key={c}
                    onClick={() => setCantonFilter(c)}
                    className={`px-2.5 py-1 rounded text-xs font-bold cursor-pointer ${
                      cantonFilter === c ? "bg-[#C8A97E] text-black" : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400">
                    <th className="p-2.5">Name</th>
                    <th className="p-2.5">Ort</th>
                    <th className="p-2.5">Geprüfte +41 Nummer</th>
                    <th className="p-2.5">Quelle</th>
                    <th className="p-2.5">Kontaktaufnahme</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {claimsList.slice(0, 80).map((c: any, i: number) => (
                    <tr key={i} className="hover:bg-white/5">
                      <td className="p-2.5 font-bold text-white">{c.name}</td>
                      <td className="p-2.5 text-gray-300">{c.city} ({c.canton})</td>
                      <td className="p-2.5 font-mono text-emerald-300">{c.phoneDisplay}</td>
                      <td className="p-2.5 text-gray-400">{c.portal}</td>
                      <td className="p-2.5">
                        <a
                          href={c.waClickUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="px-3 py-1 rounded bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 font-bold inline-block"
                        >
                          Nachricht vorbereiten →
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 5: AUDIT HISTORY */}
        {activeTab === "audit" && (
          <div className="p-6 rounded-2xl bg-[#11131C] border border-white/10 space-y-3">
            <h2 className="text-lg font-serif font-bold">Nachvollziehbares Änderungsprotokoll (Audit-Log)</h2>
            {serverData.auditLog.length === 0 ? (
              <p className="text-xs text-gray-400">Noch keine administrativen Änderungen protokolliert.</p>
            ) : (
              <div className="space-y-2 text-xs">
                {serverData.auditLog.map((log: any) => (
                  <div key={log.id} className="p-3 rounded-xl bg-[#090A0F] border border-white/10 flex justify-between">
                    <div>
                      <span className="font-bold text-[#C8A97E]">[{log.actor}]</span>{" "}
                      <span className="text-white font-semibold">{log.profileId}:</span>{" "}
                      <span className="text-gray-300">{log.action}</span>
                    </div>
                    <span className="text-gray-500">{new Date(log.timestamp).toLocaleString("de-CH")}</span>
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