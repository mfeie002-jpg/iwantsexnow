import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { Sparkles, Heart, CheckCircle2, ArrowRight, RotateCcw, MapPin } from "lucide-react";

export default function MatchesFinderPage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [canton, setCanton] = useState<string>("ZG");
  const [rubric, setRubric] = useState<string>("ALL");
  const [maxBudget, setMaxBudget] = useState<number>(400);
  const [hairPref, setHairPref] = useState<string>("ALL");

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});
  }, []);

  const topMatches = useMemo(() => {
    const blocked = new Set(blockedIds);
    const raw = (offersData as any[]) || [];
    const scored: any[] = [];

    for (const o of raw) {
      const pid = o.id || o.dedupClusterId;
      if (!pid || blocked.has(pid)) continue;
      const st = serverStates[pid] || {};
      if (st.paused || st.hidden) continue;

      if (canton !== "ALL" && String(o.canton || "").toUpperCase() !== canton) continue;

      const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      if (r60 > maxBudget) continue;

      const itemRubric = o.rubric || "female";
      if (rubric !== "ALL" && itemRubric !== rubric) continue;
      if (hairPref !== "ALL" && String(o.hairColor || "").toLowerCase() !== hairPref.toLowerCase()) continue;

      const isAvail = Boolean(st.availabilityConfirmed || o.availabilityConfirmed);
      const isVerif = Boolean(st.identityVerified || o.identityVerified);
      const matchPercent = Math.min(99, 84 + (isAvail ? 8 : 0) + (isVerif ? 5 : 0) + (o.rawPhone ? 2 : 0));

      scored.push({
        ...o,
        id: pid,
        rate60Chf: r60,
        rate30Chf: r30,
        isAvail,
        isVerif,
        matchPercent,
      });
    }

    scored.sort((a, b) => b.matchPercent - a.matchPercent || a.rate60Chf - b.rate60Chf);
    return scored.slice(0, 12);
  }, [serverStates, blockedIds, canton, rubric, maxBudget, hairPref]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title="Schweizer Escort Quick-Matcher (Kanton, Service & CHF-Budget) | iwantsexnow.ch"
        description="Finde in 10 Sekunden die besten verifizierten Profile in deinem Kanton passend zu deinem Wunsch-Service (GFE, Tantra, Outcall, BDSM) und deinem CHF-Budget."
        url="https://iwantsexnow.ch/matches"
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
                <Sparkles size={14} /> INTERAKTIVER SCHWEIZER QUICK-MATCHER
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                Deine persönlichen Top-Matches nach Kanton, Stil & CHF-Budget
              </h1>
            </div>
            <Link href="/compare-escorts" className="px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-[#C8A97E]">
              4-Profil Direktvergleich →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">1. Dein Kanton</label>
              <select value={canton} onChange={(e) => setCanton(e.target.value)} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3 py-2.5 text-xs text-white font-bold">
                <option value="ALL">🇨🇭 Ganze Schweiz</option>
                {["ZG", "ZH", "LU", "AG", "BS", "BE", "SG", "GE", "VD", "TI"].map((c) => (
                  <option key={c} value={c}>Kanton {c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">2. Wunsch-Erlebnis</label>
              <select value={rubric} onChange={(e) => setRubric(e.target.value)} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3 py-2.5 text-xs text-white font-bold">
                <option value="ALL">Alle Services (GFE, Tantra, Outcall)</option>
                <option value="female">Girlfriend Experience & Begleitung</option>
                <option value="massage">Tantra & Erotische Massage</option>
                <option value="bdsm">Domina, BDSM & Fetisch</option>
                <option value="trans">Trans & TS Escort</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">3. Max. Budget (60 Min.)</label>
              <select value={maxBudget} onChange={(e) => setMaxBudget(Number(e.target.value))} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3 py-2.5 text-xs text-white font-bold">
                <option value={250}>Bis CHF 250.– / 60 Min.</option>
                <option value={350}>Bis CHF 350.– / 60 Min.</option>
                <option value={400}>Bis CHF 400.– / 60 Min.</option>
                <option value={600}>Bis CHF 600.– / 60 Min.</option>
                <option value={1200}>Alle Preisklassen (bis CHF 1200.–)</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-1">4. Typ / Haarfarbe</label>
              <select value={hairPref} onChange={(e) => setHairPref(e.target.value)} className="w-full rounded-xl bg-[#0D111A] border border-white/15 px-3 py-2.5 text-xs text-white font-bold">
                <option value="ALL">Alle Typen</option>
                <option value="Blond">Blond</option>
                <option value="Brünett">Brünett</option>
                <option value="Schwarz">Schwarz</option>
              </select>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {topMatches.map((p: any) => (
            <div key={p.id} className="rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/60 overflow-hidden flex flex-col justify-between transition group">
              <div>
                <div className="relative h-64 bg-[#0D111A] overflow-hidden">
                  <img
                    src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                    alt={p.rawName}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-[#C8A97E] text-[#0D111A] text-[10px] font-extrabold shadow">
                    ★ {p.matchPercent}% Match
                  </div>
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/80 border border-white/15 text-xs font-extrabold text-[#C8A97E]">
                    CHF {p.rate60Chf}.– / 60m
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#C8A97E]">{p.canton} · {p.city}</span>
                    <span className="text-gray-400">30 Min.: CHF {p.rate30Chf}.–</span>
                  </div>
                  <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block text-base font-serif font-bold text-white hover:text-[#C8A97E] truncate">
                    {p.rawName}
                  </Link>
                  <div className="text-xs text-gray-300">
                    {p.age || 25} J. · {p.heightCm || 168} cm · Cup {p.cupSize || "C"} · {p.hairColor || "Brünett"}
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block w-full py-2.5 px-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs text-center">
                  Match öffnen & +41 Kontakt →
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}