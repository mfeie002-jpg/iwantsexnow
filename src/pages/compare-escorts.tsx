import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { CheckCircle2, Phone, Plus, X, ShieldCheck, Sparkles, Search, ArrowRight } from "lucide-react";

export default function CompareEscortsPage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [cantonFilter, setCantonFilter] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});
  }, []);

  const activeProfiles = useMemo(() => {
    const blocked = new Set(blockedIds);
    const raw = (offersData as any[]) || [];
    const list: any[] = [];

    for (const o of raw) {
      const pid = o.id || o.dedupClusterId;
      if (!pid || blocked.has(pid)) continue;
      const st = serverStates[pid] || {};
      if (st.paused || st.hidden) continue;

      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));

      list.push({
        ...o,
        id: pid,
        rate60Chf: r60,
        rate30Chf: r30,
        availabilityConfirmed: Boolean(st.availabilityConfirmed || o.availabilityConfirmed),
        identityVerified: Boolean(st.identityVerified || o.identityVerified),
      });
    }
    return list;
  }, [serverStates, blockedIds]);

  useEffect(() => {
    if (selectedIds.length === 0 && activeProfiles.length >= 3) {
      setSelectedIds(activeProfiles.slice(0, 3).map((p) => p.id));
    }
  }, [activeProfiles, selectedIds.length]);

  const filteredCandidates = useMemo(() => {
    return activeProfiles
      .filter((p) => {
        if (cantonFilter !== "ALL" && String(p.canton || "").toUpperCase() !== cantonFilter) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const hay = `${p.rawName || ""} ${p.city || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")}`.toLowerCase();
          if (!hay.includes(q)) return false;
        }
        return true;
      })
      .slice(0, 24);
  }, [activeProfiles, cantonFilter, searchQuery]);

  const comparedProfiles = useMemo(() => {
    return selectedIds
      .map((id) => activeProfiles.find((p) => p.id === id))
      .filter(Boolean);
  }, [selectedIds, activeProfiles]);

  const toggleProfile = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter((x) => x !== id));
    } else if (selectedIds.length < 4) {
      setSelectedIds([...selectedIds, id]);
    }
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer Escort- & Preis-Direktvergleich (30m / 60m CHF & Attribute) | iwantsexnow.ch"
        description="Vergleiche bis zu 4 Schweizer Escort-, Tantra- & Massage-Profile direkt nebeneinander: 30m/60m CHF-Honorare, 4h-Echtzeit-Verfügbarkeit, Körbchengrösse, Sprachen & +41 Direktkontakt."
        url="https://iwantsexnow.ch/compare-escorts"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold">
              INTERAKTIVER 4-PROFIL-DIREKTVERGLEICH · ECHTE CHF-TARIFE & DEEP-ATTRIBUTE
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Profile, 30m/60m Honorare & Attribute direkt vergleichen
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/pricing" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#C8A97E]">
              Kantonaler CHF-Kompass →
            </Link>
            <Link href="/search" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white">
              Deep-Filter Suche →
            </Link>
          </div>
        </section>

        {/* Vergleichs-Matrix (bis zu 4 Profile nebeneinander) */}
        <section className="bg-[#121722] border border-white/10 rounded-2xl p-5 overflow-x-auto">
          {comparedProfiles.length === 0 ? (
            <div className="py-10 text-center text-xs text-gray-400">
              Wähle unten bis zu 4 Profile aus, um sie direkt nebeneinander zu vergleichen.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-xs min-w-[680px]">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="py-3 px-3 text-gray-400 uppercase text-[10px] w-44">Kriterium</th>
                  {comparedProfiles.map((p: any) => (
                    <th key={p.id} className="py-3 px-3 align-top">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-sm font-bold text-white hover:text-[#C8A97E]">
                            {p.rawName}
                          </Link>
                          <div className="text-[11px] text-gray-400">{p.city} ({p.canton})</div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleProfile(p.id)}
                          className="p-1 rounded-lg bg-white/5 hover:bg-rose-500/20 text-gray-400 hover:text-rose-300 cursor-pointer"
                          title="Aus Vergleich entfernen"
                        >
                          <X size={13} />
                        </button>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                <tr>
                  <td className="py-3 px-3 font-bold text-gray-400">Honorar 30 Min. / 60 Min.</td>
                  {comparedProfiles.map((p: any) => (
                    <td key={p.id} className="py-3 px-3">
                      <span className="text-gray-300">CHF {p.rate30Chf}.–</span> /{" "}
                      <strong className="text-sm text-[#C8A97E]">CHF {p.rate60Chf}.–</strong>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-gray-400">Echtzeit-Status</td>
                  {comparedProfiles.map((p: any) => (
                    <td key={p.id} className="py-3 px-3">
                      {p.availabilityConfirmed ? (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold text-[11px]">
                          ● Jetzt für 4h verfügbar
                        </span>
                      ) : (
                        <span className="text-gray-400">Nach Terminvereinbarung</span>
                      )}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-gray-400">Alter · Grösse · Körbchen</td>
                  {comparedProfiles.map((p: any) => (
                    <td key={p.id} className="py-3 px-3 text-gray-200 font-semibold">
                      {p.age || 25} J. · {p.heightCm || 168} cm · Cup {p.cupSize || "C"} ({p.hairColor || "Brünett"})
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-gray-400">Sprachen</td>
                  {comparedProfiles.map((p: any) => (
                    <td key={p.id} className="py-3 px-3 text-gray-300">
                      {(p.languages || ["Deutsch", "Englisch"]).join(", ")}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-gray-400">Top-Services & Tags</td>
                  {comparedProfiles.map((p: any) => (
                    <td key={p.id} className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {(p.includedTags || ["Girlfriend Experience", "Incall & Outcall"]).slice(0, 4).map((t: string) => (
                          <span key={t} className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] text-gray-300">
                            {t}
                          </span>
                        ))}
                      </div>
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="py-3 px-3 font-bold text-gray-400">Direktkontakt & Profil</td>
                  {comparedProfiles.map((p: any) => (
                    <td key={p.id} className="py-3 px-3">
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/profile/${encodeURIComponent(p.id)}`}
                          className="px-3 py-2 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-[11px] inline-flex items-center gap-1"
                        >
                          <span>Profil öffnen</span>
                          <ArrowRight size={12} />
                        </Link>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          )}
        </section>

        {/* Auswahl-Pool nach Kanton */}
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#121722] p-4 rounded-2xl border border-white/10">
            <div className="flex flex-wrap items-center gap-1.5">
              {["ALL", "ZH", "ZG", "BS", "BE", "LU", "AG", "SG", "GE", "VD", "TI"].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCantonFilter(c)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                    cantonFilter === c ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] text-gray-300 border border-white/10"
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
                placeholder="Name, Ort oder Service..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#0D111A] border border-white/15 text-xs text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {filteredCandidates.map((p: any) => {
              const isSelected = selectedIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-2xl border transition flex flex-col justify-between gap-3 ${
                    isSelected ? "bg-[#192030] border-[#C8A97E]" : "bg-[#121722] border-white/10"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2 py-0.5 rounded bg-white/10 text-[10px] font-bold text-[#C8A97E]">
                        {p.canton} · {p.city}
                      </span>
                      <span className="text-xs font-extrabold text-white">CHF {p.rate60Chf}.–</span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-2">{p.rawName}</h3>
                    <p className="text-[11px] text-gray-400 mt-0.5">
                      {p.age || 25} J. · {p.heightCm || 168} cm · Cup {p.cupSize || "C"} · {p.hairColor || "Brünett"}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleProfile(p.id)}
                    className={`w-full py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                      isSelected
                        ? "bg-rose-500/20 border border-rose-500/40 text-rose-200"
                        : "bg-[#C8A97E] text-[#0D111A]"
                    }`}
                  >
                    {isSelected ? "✓ Im Vergleich (Entfernen)" : "+ Zum Vergleich hinzufügen"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
}