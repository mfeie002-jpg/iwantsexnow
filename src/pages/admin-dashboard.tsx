import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import pilotData from "@/data/pilot-20-cohort.json";
import statsData from "@/data/index-stats.json";
import clubsData from "@/data/swiss-establishments-vault.json";
import { Lock, ExternalLink, Copy, CheckCircle2, Phone, Building2, Users, Inbox, LogOut } from "lucide-react";

export default function AdminDashboardPage() {
  const [pinInput, setPinInput] = useState("");
  const [activePin, setActivePin] = useState("");
  const [authorized, setAuthorized] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [serverMetrics, setServerMetrics] = useState<Record<string, any>>({});
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [takedowns, setTakedowns] = useState<any[]>([]);
  const [pilotLinks, setPilotLinks] = useState<Record<string, string>>({});

  const [copiedSlot, setCopiedSlot] = useState<number | null>(null);
  const [filterCanton, setFilterCanton] = useState<"ALL" | "ZG" | "ZH">("ALL");
  const [adminTab, setAdminTab] = useState<"pilots" | "verifications" | "leads" | "takedowns" | "scraper">("pilots");
  const [scrapeUrl, setScrapeUrl] = useState("");
  const [scrapeCanton, setScrapeCanton] = useState("ZG");
  const [scrapePhone, setScrapePhone] = useState("");
  const [scrapeRate60, setScrapeRate60] = useState("");
  const [scrapeLoading, setScrapeLoading] = useState(false);
  const [scrapedResult, setScrapedResult] = useState<any>(null);
  const [batchResults, setBatchResults] = useState<any[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const fetchAdminState = async (pinToUse: string) => {
    const res = await fetch("/api/vault/metrics", {
      headers: { "x-admin-pin": pinToUse },
    });
    const data = await res.json();
    if (data?.isAdmin) {
      setAuthorized(true);
      setActivePin(pinToUse);
      setServerStates(data.states || {});
      setServerMetrics(data.metrics || {});
      setEnquiries(data.enquiries || []);
      setTakedowns(data.takedowns || []);
      setPilotLinks(data.pilotCockpitLinks || {});
      return true;
    }
    return false;
  };

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    try {
      const ok = await fetchAdminState(pinInput.trim());
      if (!ok) {
        setErrorMsg("Zugriff verweigert: Ungültiger Server-Admin-Schlüssel (siehe PRIVATE-PILOT-20-LINKS.txt).");
      }
    } catch {
      setErrorMsg("Verbindungsfehler bei der Server-Authentifizierung.");
    }
  };

  const triggerAdminUpdate = async (profileId: string, updates: Record<string, any>, msg: string) => {
    await fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": activePin },
      body: JSON.stringify({ action: "update_profile_state", profileId, updates }),
    });
    setToast(msg);
    await fetchAdminState(activePin);
    setTimeout(() => setToast(null), 3000);
  };

  const trigger4hAvailability = async (profileId: string, name: string) => {
    await fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-admin-pin": activePin },
      body: JSON.stringify({ action: "confirm_availability_4h", profileId }),
    });
    setToast(`✓ 4h-Verfügbarkeit für ${name} live geschaltet!`);
    await fetchAdminState(activePin);
    setTimeout(() => setToast(null), 3000);
  };

  const pilots = useMemo(() => {
    const raw = (pilotData as any[]) || [];
    return raw.filter((p) => filterCanton === "ALL" || p.canton === filterCanton);
  }, [filterCanton]);

  const verificationRequests = useMemo(() => {
    return Object.values(serverStates).filter((st: any) => st.identityRequested && !st.identityVerified);
  }, [serverStates]);

  const copyCockpitLink = (slot: number, pathUrl: string) => {
    if (typeof window !== "undefined" && navigator.clipboard && pathUrl) {
      const fullUrl = `${window.location.origin}${pathUrl}`;
      navigator.clipboard.writeText(fullUrl);
      setCopiedSlot(slot);
      setTimeout(() => setCopiedSlot(null), 2500);
    }
  };

  return (
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO title="Geschützte Administration | iWantSexNow.ch" noindex={true} />
      <LuxuryHeader />

      {!authorized ? (
        <main className="max-w-md mx-auto px-6 py-16">
          <form onSubmit={handleUnlock} className="p-8 rounded-2xl bg-white border border-tinte/20 space-y-5">
            <div className="flex items-center gap-2 text-sun-700 text-[13px] font-bold ">
              <Lock size={15} /> Server-Authentifizierung erforderlich
            </div>
            <h1 className="text-2xl font-serif font-bold text-tinte">Master-Steuerpult gesperrt</h1>
            <p className="text-[13px] text-gray-600 leading-relaxed">
              Ohne gültigen Server-Admin-Schlüssel (<code>process.env.ADMIN_PIN</code>) werden keinerlei Tokens, Telefonnummern oder Kunden-Anfragen an den Browser ausgeliefert.
            </p>
            {errorMsg && (
              <div className="p-3 rounded-xl bg-glow-100/60 border border-glow-500/40 text-[13px] text-glow-800 font-semibold">
                {errorMsg}
              </div>
            )}
            <input
              type="password"
              required
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              placeholder="Privaten Admin-PIN eingeben..."
              className="w-full rounded-xl bg-papier border border-tinte/25 px-4 py-3 text-sm text-tinte focus:border-kirsche outline-none"
            />
            <button
              type="submit"
              className="w-full py-3.5 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] cursor-pointer"
            >
              Steuerpult entsperren →
            </button>
          </form>
          {adminTab === "scraper" && (
            <div className="bg-white border border-mint-500/40 rounded-2xl p-6 space-y-5">
              <div>
                <div className="text-[13px] text-mint-700 font-bold">
                  Direkter Schweizer LIVE-Harvester · MIT 5-STUFEN QUALITY-GATE (100–1200 CHF & Opt-Out-Schutz)
                </div>
                <h2 className="text-xl font-serif font-bold text-tinte mt-1">
                  Einzel-Inserat oder Studio-URL live scrapen & in den Index aufnehmen
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="url"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="https://... (Schweizer Inserate- oder Studio-URL)"
                  className="sm:col-span-2 rounded-xl bg-papier border border-tinte/25 px-4 py-3 text-[13px] text-tinte"
                />
                <select
                  value={scrapeCanton}
                  onChange={(e) => setScrapeCanton(e.target.value)}
                  className="rounded-xl bg-papier border border-tinte/25 px-3 py-3 text-[13px] text-tinte"
                >
                  {["ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
                    <option key={c} value={c}>Fallback-Kanton: {c}</option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={scrapeLoading || !scrapeUrl}
                  onClick={async () => {
                    setScrapeLoading(true);
                    setScrapedResult(null);
                    try {
                      const r = await fetch("/api/indexer/import", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "x-admin-pin": activePin },
                        body: JSON.stringify({
                          action: "scrape_url",
                          url: scrapeUrl,
                          canton: scrapeCanton,
                          customPhone: scrapePhone || undefined,
                          customRate60: scrapeRate60 ? Number(scrapeRate60) : undefined,
                        }),
                      });
                      const d = await r.json();
                      if (d?.ok) {
                        setScrapedResult(d.profile);
                        setToast(`✓ Profil "${d.profile.rawName}" (${d.profile.city}, ${d.profile.canton}) erfolgreich gescrapt & indexiert!`);
                        await fetchAdminState(activePin);
                      } else {
                        setToast(`⚠️ ${d?.error || "Scraping-Fehler"}`);
                      }
                    } catch {
                      setToast("⚠️ Netzwerkfehler beim URL-Scraping.");
                    }
                    setScrapeLoading(false);
                  }}
                  className="rounded-xl bg-mint-500 hover:bg-mint-400 text-tinte font-extrabold text-[13px] py-3 px-4 cursor-pointer"
                >
                  {scrapeLoading ? "Scrape läuft..." : "🕷️ Einzel-URL scrapen →"}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-papier border border-mint-500/30">
                <div className="text-[13px] text-gray-700">
                  <strong className="text-mint-700">🕸️ Multi-Profile Kategorieseiten-Crawler:</strong> Extrahiert automatisch bis zu 12 Profil-Unterseiten von einer Studio-/Team- oder Kantons-Übersichtsseite.
                </div>
                <button
                  type="button"
                  disabled={scrapeLoading || !scrapeUrl}
                  onClick={async () => {
                    setScrapeLoading(true);
                    setScrapedResult(null);
                    setBatchResults([]);
                    try {
                      const r = await fetch("/api/indexer/import", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "x-admin-pin": activePin },
                        body: JSON.stringify({
                          action: "crawl_directory",
                          url: scrapeUrl,
                          canton: scrapeCanton,
                          customPhone: scrapePhone || undefined,
                          customRate60: scrapeRate60 ? Number(scrapeRate60) : undefined,
                          limit: 12,
                        }),
                      });
                      const d = await r.json();
                      if (d?.ok) {
                        setBatchResults(d.harvestedProfiles || []);
                        setToast(`✓ Batch-Crawl fertig: ${d.batchCount} Profile von ${d.scannedUrls} Unterseiten importiert!`);
                        await fetchAdminState(activePin);
                      } else {
                        setToast(`⚠️ ${d?.error || "Batch-Crawl Fehler"}`);
                      }
                    } catch {
                      setToast("⚠️ Netzwerkfehler beim Batch-Crawl.");
                    }
                    setScrapeLoading(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] cursor-pointer"
                >
                  {scrapeLoading ? "Crawlt Unterseiten..." : "🕸️ Ganze Übersichtsseite crawlen (bis 12 Profile) →"}
                </button>
              </div>

              {batchResults.length > 0 && (
                <div className="p-4 rounded-xl bg-papier border border-kirsche/40 space-y-2 text-[13px]">
                  <div className="font-bold text-kirsche">
                    ✓ {batchResults.length} Profile per Batch-Crawl neu in den Live-Index aufgenommen:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {batchResults.map((bp: any) => (
                      <Link
                        key={bp.id}
                        href={`/profile/${encodeURIComponent(bp.id)}`}
                        className="p-2.5 rounded-lg bg-white border border-tinte/20 hover:border-kirsche flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-tinte truncate max-w-[180px]">{bp.rawName}</div>
                          <div className="text-[13px] text-gray-600">{bp.city} ({bp.canton}) · CHF {bp.advertisedBaseChf}.–</div>
                        </div>
                        <span className="text-kirsche font-bold">↗</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={scrapePhone}
                  onChange={(e) => setScrapePhone(e.target.value)}
                  placeholder="Optional: +41 79 ... manuell vorgeben (falls nicht im HTML)"
                  className="rounded-xl bg-papier border border-tinte/20 px-4 py-2.5 text-[13px] text-gray-800"
                />
                <input
                  type="number"
                  value={scrapeRate60}
                  onChange={(e) => setScrapeRate60(e.target.value)}
                  placeholder="Optional: 60-Min.-Preis in CHF (100–1200)"
                  className="rounded-xl bg-papier border border-tinte/20 px-4 py-2.5 text-[13px] text-gray-800"
                />
              </div>

              {scrapedResult && (
                <div className="p-4 rounded-xl bg-papier border border-mint-500/40 flex flex-wrap items-center justify-between gap-4 text-[13px]">
                  <div className="space-y-1">
                    <div className="font-bold text-tinte text-sm">
                      ✓ Neu im Index: {scrapedResult.rawName} ({scrapedResult.city}, {scrapedResult.canton})
                    </div>
                    <div className="text-gray-700">
                      ID: <code>{scrapedResult.id}</code> · Telefon: <strong className="text-mint-700">{scrapedResult.rawPhone || "k.A."}</strong> · Preis: <strong className="text-kirsche">{scrapedResult.priceLabel}</strong>
                    </div>
                    <div className="text-gray-600">
                      Attribute: {scrapedResult.age} J. · {scrapedResult.heightCm} cm · Cup {scrapedResult.cupSize} · Rubrik: {scrapedResult.rubric}
                    </div>
                  </div>
                  <Link
                    href={`/profile/${encodeURIComponent(scrapedResult.id)}`}
                    className="px-4 py-2.5 rounded-xl bg-kirsche text-white font-extrabold"
                  >
                    Live-Profil öffnen ↗
                  </Link>
                </div>
              )}
            </div>
          )}
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-6 py-8 space-y-6">
          {toast && (
            <div className="p-4 rounded-xl bg-mint-100/80 border border-mint-500/50 text-mint-800 text-[13px] font-bold flex items-center gap-2 shadow-xl">
              <CheckCircle2 size={16} className="text-mint-700" />
              <span>{toast}</span>
            </div>
          )}

          <div className="p-6 rounded-2xl bg-white border border-mint-500/40 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[13px] text-mint-700 font-bold">
                ● SERVER-AUTHENTIFIZIERT · 0 Tokens im Öffentlichen Code · 0 Automatische Nachrichten
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-tinte mt-1">
                iWantSexNow.ch Master-Backend & Admin-Zentrale
              </h1>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link href="/clubs" className="px-4 py-2.5 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-bold text-tinte">
                108 Clubs prüfen
              </Link>
              <Link href="/pricing" className="px-4 py-2.5 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-bold text-kirsche">
                CHF Preis-Kompass
              </Link>
              <button
                type="button"
                onClick={() => { setAuthorized(false); setActivePin(""); setPinInput(""); }}
                className="px-4 py-2.5 rounded-xl bg-glow-500/20 hover:bg-glow-500/30 border border-glow-500/40 text-[13px] font-bold text-glow-800 inline-flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut size={13} /> Sperren
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-white border border-tinte/20">
              <div className="text-[13px] text-gray-600 flex items-center gap-1.5"><Users size={14} className="text-kirsche" /> Schweizer Gesamt-Index</div>
              <div className="text-3xl font-extrabold text-tinte mt-1">{(statsData as any)?.uniqueFrontendProfiles || 2526}</div>
              <div className="text-[13px] text-mint-700 mt-1">Alle Preise 100–1200 CHF bereinigt</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-tinte/20">
              <div className="text-[13px] text-gray-600 flex items-center gap-1.5"><Phone size={14} className="text-mint-700" /> Echte +41 Rufnummern</div>
              <div className="text-3xl font-extrabold text-mint-700 mt-1">{(statsData as any)?.unlockedRealPhones || 995}</div>
              <div className="text-[13px] text-gray-600 mt-1">{(statsData as any)?.mobileWhatsappReadyPhones || 974} Handynummern (075–079)</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-tinte/20">
              <div className="text-[13px] text-gray-600 flex items-center gap-1.5"><Building2 size={14} className="text-kirsche" /> Bereinigte Clubs & Studios</div>
              <div className="text-3xl font-extrabold text-kirsche mt-1">{Array.isArray(clubsData) ? clubsData.length : 108}</div>
              <div className="text-[13px] text-gray-600 mt-1">0 Duplikate / 0 Einzelanzeigen</div>
            </div>
            <div className="p-5 rounded-2xl bg-white border border-tinte/20">
              <div className="text-[13px] text-gray-600 flex items-center gap-1.5"><Inbox size={14} className="text-lake-700" /> Kunden-Anfragen & Prüfungen</div>
              <div className="text-3xl font-extrabold text-lake-700 mt-1">{enquiries.length} Leads / {verificationRequests.length} Prüf.</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 bg-white p-2 rounded-2xl border border-tinte/20">
            <button type="button" onClick={() => setAdminTab("pilots")} className={`py-3 px-3 rounded-xl text-[13px] font-extrabold cursor-pointer ${adminTab === "pilots" ? "bg-kirsche text-white" : "text-gray-300 hover:bg-tinte/[0.04]"}`}>1. Pilot-20 & Live-Schalter (ZG/ZH)</button>
            <button type="button" onClick={() => setAdminTab("verifications")} className={`py-3 px-3 rounded-xl text-[13px] font-extrabold cursor-pointer ${adminTab === "verifications" ? "bg-kirsche text-white" : "text-gray-300 hover:bg-tinte/[0.04]"}`}>2. Identitäts-Prüfungen ({verificationRequests.length})</button>
            <button type="button" onClick={() => setAdminTab("leads")} className={`py-3 px-3 rounded-xl text-[13px] font-extrabold cursor-pointer ${adminTab === "leads" ? "bg-kirsche text-white" : "text-gray-300 hover:bg-tinte/[0.04]"}`}>3. Kunden-Anfragen / Leads ({enquiries.length})</button>
            <button type="button" onClick={() => setAdminTab("takedowns")} className={`py-3 px-3 rounded-xl text-[13px] font-extrabold cursor-pointer ${adminTab === "takedowns" ? "bg-kirsche text-white" : "text-gray-300 hover:bg-tinte/[0.04]"}`}>4. Opt-Outs ({takedowns.length})</button>
            <button type="button" onClick={() => setAdminTab("scraper")} className={`py-3 px-3 rounded-xl text-[13px] font-extrabold cursor-pointer ${adminTab === "scraper" ? "bg-mint-500 text-tinte" : "text-mint-700 hover:bg-tinte/[0.04]"}`}>5. 🕷️ Live-URL Scraper</button>
          </div>

          {adminTab === "pilots" && (
            <div className="bg-white border border-tinte/20 rounded-2xl p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg sm:text-xl font-serif font-bold text-tinte">Pilot-20 Live-Steuerung (10x Kanton Zug · 10x Kanton Zürich)</h2>
                <div className="flex gap-2">
                  {(["ALL", "ZG", "ZH"] as const).map((c) => (
                    <button key={c} type="button" onClick={() => setFilterCanton(c)} className={`px-3.5 py-1.5 rounded-xl text-[13px] font-bold cursor-pointer ${filterCanton === c ? "bg-kirsche text-white" : "bg-papier text-gray-300 border border-tinte/20"}`}>
                      {c === "ALL" ? "Alle 20 (ZG + ZH)" : `Nur ${c} (10)`}
                    </button>
                  ))}
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b border-tinte/20 text-gray-600 text-[13px]">
                      <th className="py-3 px-2">Slot</th>
                      <th className="py-3 px-2">Ort</th>
                      <th className="py-3 px-2">Name & Aufrufe</th>
                      <th className="py-3 px-2">+41 Handy</th>
                      <th className="py-3 px-2">CHF 30m/60m</th>
                      <th className="py-3 px-2">Admin Schnell-Schalter</th>
                      <th className="py-3 px-2 text-right">Cockpit & Profil</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-tinte/20">
                    {pilots.map((p) => {
                      const st = serverStates[p.profileId] || {};
                      const mt = serverMetrics[p.profileId] || {};
                      const isAvail = Boolean(st.availabilityConfirmed && st.availableUntil && new Date(st.availableUntil).getTime() > Date.now());
                      const isVerif = Boolean(st.identityVerified);
                      const isSpons = Boolean(st.sponsored);
                      const isPaused = Boolean(st.paused || st.hidden);
                      const cockpitPath = pilotLinks[p.profileId] || `/creator-dashboard?id=${encodeURIComponent(p.profileId)}`;

                      return (
                        <tr key={p.profileId} className="hover:bg-tinte/[0.04]">
                          <td className="py-3.5 px-2 font-bold text-kirsche">#{p.pilotSlot}</td>
                          <td className="py-3.5 px-2"><span className="px-2 py-0.5 rounded bg-tinte/[0.06] font-bold text-tinte mr-1">{p.canton}</span><span className="text-gray-700">{st.city || p.city}</span></td>
                          <td className="py-3.5 px-2"><div className="font-bold text-tinte">{st.displayName || p.name}</div><div className="text-[13px] text-gray-600">{p.profileId} · {mt.views || 0} Views · {mt.contactClicks || 0} Kontakte</div></td>
                          <td className="py-3.5 px-2 font-semibold text-mint-700">{st.phoneDisplay || p.phoneDisplay}</td>
                          <td className="py-3.5 px-2 text-gray-800">{st.rate30Chf || 200} / <strong className="text-kirsche">{st.rate60Chf || 350}</strong></td>
                          <td className="py-3.5 px-2">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <button type="button" onClick={() => trigger4hAvailability(p.profileId, st.displayName || p.name)} className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${isAvail ? "bg-mint-500 text-tinte" : "bg-papier border border-tinte/25 text-gray-700"}`}>{isAvail ? "● 4h Aktiv" : "+ 4h Verfügbar"}</button>
                              <button type="button" onClick={() => triggerAdminUpdate(p.profileId, { identityVerified: !isVerif }, `✓ Prüf-Status für ${st.displayName || p.name} geändert!`)} className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer ${isVerif ? "bg-kirsche text-white" : "bg-papier border border-tinte/25 text-gray-300"}`}>{isVerif ? "✓ Geprüft" : "✓ Prüfen"}</button>
                              <button type="button" onClick={() => triggerAdminUpdate(p.profileId, { sponsored: !isSpons }, `★ Top-Spot Status aktualisiert!`)} className={`px-2 py-1 rounded-lg font-bold cursor-pointer ${isSpons ? "bg-sun-500/30 border border-sun-400 text-sun-800" : "bg-papier border border-tinte/25 text-gray-600"}`}>★ Top</button>
                              <button type="button" onClick={() => triggerAdminUpdate(p.profileId, { paused: !isPaused }, isPaused ? "Profil wieder eingeblendet!" : "Profil ausgeblendet!")} className={`px-2 py-1 rounded-lg font-bold cursor-pointer ${isPaused ? "bg-glow-500/30 text-glow-700" : "bg-papier border border-tinte/25 text-gray-600"}`}>{isPaused ? "Pausiert" : "Aktiv"}</button>
                            </div>
                          </td>
                          <td className="py-3.5 px-2 text-right">
                            <div className="inline-flex items-center gap-1.5">
                              <Link href={cockpitPath} className="px-2.5 py-1.5 rounded-lg bg-kirsche text-white font-extrabold inline-flex items-center gap-1"><span>Cockpit</span><ExternalLink size={11} /></Link>
                              <Link href={`/profile/${encodeURIComponent(p.profileId)}`} className="px-2.5 py-1.5 rounded-lg bg-tinte/[0.06] text-tinte font-semibold">Profil ↗</Link>
                              <button type="button" onClick={() => copyCockpitLink(p.pilotSlot, cockpitPath)} className="px-2 py-1.5 rounded-lg bg-papier border border-tinte/25 text-gray-700 cursor-pointer">{copiedSlot === p.pilotSlot ? "✓" : <Copy size={11} />}</button>
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
            <div className="bg-white border border-tinte/20 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-serif font-bold text-tinte">Offene Anträge auf Dokumentierte Identitätsprüfung (✓)</h2>
              {verificationRequests.length === 0 ? (
                <p className="text-[13px] text-gray-600">Aktuell keine offenen Prüfanträge.</p>
              ) : (
                <div className="space-y-3">
                  {verificationRequests.map((req: any) => (
                    <div key={req.profileId} className="p-4 rounded-xl bg-papier border border-tinte/20 flex items-center justify-between gap-4">
                      <div><div className="font-bold text-tinte">{req.displayName} ({req.city}, {req.canton})</div><div className="text-[13px] text-gray-600">ID: {req.profileId} · Telefon: {req.phoneDisplay}</div></div>
                      <button type="button" onClick={() => triggerAdminUpdate(req.profileId, { identityVerified: true }, `✓ Identität für ${req.displayName} bestätigt!`)} className="px-4 py-2 rounded-xl bg-mint-500 text-tinte font-extrabold text-[13px] cursor-pointer">✓ Jetzt freischalten</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {adminTab === "leads" && (
            <div className="bg-white border border-tinte/20 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-serif font-bold text-tinte">Eingegangene Private Kunden-Anfragen ({enquiries.length})</h2>
              {enquiries.length === 0 ? (
                <p className="text-[13px] text-gray-600">Noch keine privaten Rückruf-Anfragen eingegangen.</p>
              ) : (
                <div className="space-y-3">
                  {enquiries.map((lead: any) => (
                    <div key={lead.id} className="p-4 rounded-xl bg-papier border border-tinte/20 flex flex-wrap items-center justify-between gap-4 text-[13px]">
                      <div>
                        <div className="font-bold text-tinte">Anfrage für <span className="text-kirsche">{lead.providerName}</span> ({lead.profileId})</div>
                        <div className="text-gray-700 mt-0.5">Kunden-Rückrufnummer: <strong className="text-mint-700">{lead.clientContact}</strong> · Wunschzeit: <strong>{lead.desiredTime}</strong></div>
                      </div>
                      <span className="text-gray-600">{new Date(lead.createdAt).toLocaleString("de-CH")}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {adminTab === "takedowns" && (
            <div className="bg-white border border-tinte/20 rounded-2xl p-6 space-y-4">
              <h2 className="text-lg font-serif font-bold text-tinte">Vertrauliche Meldungen & Opt-Out-Fälle ({takedowns.length})</h2>
              {takedowns.length === 0 ? (
                <p className="text-[13px] text-gray-600">Keine offenen Opt-Out-Meldungen vorliegend.</p>
              ) : (
                <div className="space-y-3">
                  {takedowns.map((t: any) => (
                    <div key={t.caseId} className="p-4 rounded-xl bg-papier border border-glow-500/30 flex items-center justify-between gap-4 text-[13px]">
                      <div><div className="font-bold text-glow-700">{t.caseId} · Profil: {t.profileId}</div><div className="text-gray-600">{t.reason} · {t.details}</div></div>
                      <span className="px-3 py-1 rounded-lg bg-glow-500/20 text-glow-700 font-bold">{t.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {adminTab === "scraper" && (
            <div className="bg-white border border-mint-500/40 rounded-2xl p-6 space-y-5">
              <div>
                <div className="text-[13px] text-mint-700 font-bold">
                  Direkter Schweizer LIVE-Harvester · MIT 5-STUFEN QUALITY-GATE (100–1200 CHF & Opt-Out-Schutz)
                </div>
                <h2 className="text-xl font-serif font-bold text-tinte mt-1">
                  Einzel-Inserat oder Studio-URL live scrapen & in den Index aufnehmen
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <input
                  type="url"
                  value={scrapeUrl}
                  onChange={(e) => setScrapeUrl(e.target.value)}
                  placeholder="https://... (Schweizer Inserate- oder Studio-URL)"
                  className="sm:col-span-2 rounded-xl bg-papier border border-tinte/25 px-4 py-3 text-[13px] text-tinte"
                />
                <select
                  value={scrapeCanton}
                  onChange={(e) => setScrapeCanton(e.target.value)}
                  className="rounded-xl bg-papier border border-tinte/25 px-3 py-3 text-[13px] text-tinte"
                >
                  {["ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
                    <option key={c} value={c}>Fallback-Kanton: {c}</option>
                  ))}
                </select>
                <button
                  type="button"
                  disabled={scrapeLoading || !scrapeUrl}
                  onClick={async () => {
                    setScrapeLoading(true);
                    setScrapedResult(null);
                    try {
                      const r = await fetch("/api/indexer/import", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "x-admin-pin": activePin },
                        body: JSON.stringify({
                          action: "scrape_url",
                          url: scrapeUrl,
                          canton: scrapeCanton,
                          customPhone: scrapePhone || undefined,
                          customRate60: scrapeRate60 ? Number(scrapeRate60) : undefined,
                        }),
                      });
                      const d = await r.json();
                      if (d?.ok) {
                        setScrapedResult(d.profile);
                        setToast(`✓ Profil "${d.profile.rawName}" (${d.profile.city}, ${d.profile.canton}) erfolgreich gescrapt & indexiert!`);
                        await fetchAdminState(activePin);
                      } else {
                        setToast(`⚠️ ${d?.error || "Scraping-Fehler"}`);
                      }
                    } catch {
                      setToast("⚠️ Netzwerkfehler beim URL-Scraping.");
                    }
                    setScrapeLoading(false);
                  }}
                  className="rounded-xl bg-mint-500 hover:bg-mint-400 text-tinte font-extrabold text-[13px] py-3 px-4 cursor-pointer"
                >
                  {scrapeLoading ? "Scrape läuft..." : "🕷️ Einzel-URL scrapen →"}
                </button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-papier border border-mint-500/30">
                <div className="text-[13px] text-gray-700">
                  <strong className="text-mint-700">🕸️ Multi-Profile Kategorieseiten-Crawler:</strong> Extrahiert automatisch bis zu 12 Profil-Unterseiten von einer Studio-/Team- oder Kantons-Übersichtsseite.
                </div>
                <button
                  type="button"
                  disabled={scrapeLoading || !scrapeUrl}
                  onClick={async () => {
                    setScrapeLoading(true);
                    setScrapedResult(null);
                    setBatchResults([]);
                    try {
                      const r = await fetch("/api/indexer/import", {
                        method: "POST",
                        headers: { "Content-Type": "application/json", "x-admin-pin": activePin },
                        body: JSON.stringify({
                          action: "crawl_directory",
                          url: scrapeUrl,
                          canton: scrapeCanton,
                          customPhone: scrapePhone || undefined,
                          customRate60: scrapeRate60 ? Number(scrapeRate60) : undefined,
                          limit: 12,
                        }),
                      });
                      const d = await r.json();
                      if (d?.ok) {
                        setBatchResults(d.harvestedProfiles || []);
                        setToast(`✓ Batch-Crawl fertig: ${d.batchCount} Profile von ${d.scannedUrls} Unterseiten importiert!`);
                        await fetchAdminState(activePin);
                      } else {
                        setToast(`⚠️ ${d?.error || "Batch-Crawl Fehler"}`);
                      }
                    } catch {
                      setToast("⚠️ Netzwerkfehler beim Batch-Crawl.");
                    }
                    setScrapeLoading(false);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-kirsche hover:bg-kirsche-tief text-white font-extrabold text-[13px] cursor-pointer"
                >
                  {scrapeLoading ? "Crawlt Unterseiten..." : "🕸️ Ganze Übersichtsseite crawlen (bis 12 Profile) →"}
                </button>
              </div>

              {batchResults.length > 0 && (
                <div className="p-4 rounded-xl bg-papier border border-kirsche/40 space-y-2 text-[13px]">
                  <div className="font-bold text-kirsche">
                    ✓ {batchResults.length} Profile per Batch-Crawl neu in den Live-Index aufgenommen:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {batchResults.map((bp: any) => (
                      <Link
                        key={bp.id}
                        href={`/profile/${encodeURIComponent(bp.id)}`}
                        className="p-2.5 rounded-lg bg-white border border-tinte/20 hover:border-kirsche flex items-center justify-between gap-2"
                      >
                        <div>
                          <div className="font-bold text-tinte truncate max-w-[180px]">{bp.rawName}</div>
                          <div className="text-[13px] text-gray-600">{bp.city} ({bp.canton}) · CHF {bp.advertisedBaseChf}.–</div>
                        </div>
                        <span className="text-kirsche font-bold">↗</span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={scrapePhone}
                  onChange={(e) => setScrapePhone(e.target.value)}
                  placeholder="Optional: +41 79 ... manuell vorgeben (falls nicht im HTML)"
                  className="rounded-xl bg-papier border border-tinte/20 px-4 py-2.5 text-[13px] text-gray-800"
                />
                <input
                  type="number"
                  value={scrapeRate60}
                  onChange={(e) => setScrapeRate60(e.target.value)}
                  placeholder="Optional: 60-Min.-Preis in CHF (100–1200)"
                  className="rounded-xl bg-papier border border-tinte/20 px-4 py-2.5 text-[13px] text-gray-800"
                />
              </div>

              {scrapedResult && (
                <div className="p-4 rounded-xl bg-papier border border-mint-500/40 flex flex-wrap items-center justify-between gap-4 text-[13px]">
                  <div className="space-y-1">
                    <div className="font-bold text-tinte text-sm">
                      ✓ Neu im Index: {scrapedResult.rawName} ({scrapedResult.city}, {scrapedResult.canton})
                    </div>
                    <div className="text-gray-700">
                      ID: <code>{scrapedResult.id}</code> · Telefon: <strong className="text-mint-700">{scrapedResult.rawPhone || "k.A."}</strong> · Preis: <strong className="text-kirsche">{scrapedResult.priceLabel}</strong>
                    </div>
                    <div className="text-gray-600">
                      Attribute: {scrapedResult.age} J. · {scrapedResult.heightCm} cm · Cup {scrapedResult.cupSize} · Rubrik: {scrapedResult.rubric}
                    </div>
                  </div>
                  <Link
                    href={`/profile/${encodeURIComponent(scrapedResult.id)}`}
                    className="px-4 py-2.5 rounded-xl bg-kirsche text-white font-extrabold"
                  >
                    Live-Profil öffnen ↗
                  </Link>
                </div>
              )}
            </div>
          )}
        </main>
      )}
    </div>
  );
}