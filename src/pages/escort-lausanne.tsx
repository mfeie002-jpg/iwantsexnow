import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { MapPin, ArrowUpDown } from "lucide-react";

const TARGET_CANTON = "VD";
const CITY_NAME = "Lausanne";
const CITY_SLUG = "lausanne";
const ROUTE_NAME = "escort-lausanne";

export default function CityEscortHubPage() {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [onlyAvailable4h, setOnlyAvailable4h] = useState(false);
  const [maxRate60, setMaxRate60] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<"recommended" | "available" | "price_asc" | "price_desc">("recommended");

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
      })
      .catch(() => {});
  }, []);

  const profiles = useMemo(() => {
    const raw = (offersData as any[]) || [];
    const list: any[] = [];

    for (const o of raw) {
      if (String(o.canton || "").toUpperCase() !== TARGET_CANTON) continue;
      const pid = o.id || o.dedupClusterId;
      const st = serverStates[pid] || {};
      if (st.paused || st.hidden) continue;

      const r60 = Math.max(100, Math.min(1200, Number(st.rate60Chf || o.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(st.rate30Chf || o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
      const isAvail = Boolean(st.availabilityConfirmed || o.availabilityConfirmed);

      if (onlyAvailable4h && !isAvail) continue;
      if (r60 > maxRate60) continue;

      list.push({ ...o, id: pid, rate60Chf: r60, rate30Chf: r30, isAvail });
    }

    list.sort((a, b) => {
      if (sortBy === "available") return (b.isAvail ? 1 : 0) - (a.isAvail ? 1 : 0) || a.rate60Chf - b.rate60Chf;
      if (sortBy === "price_asc") return a.rate60Chf - b.rate60Chf;
      if (sortBy === "price_desc") return b.rate60Chf - a.rate60Chf;
      return (b.curationScore || 80) - (a.curationScore || 80);
    });

    return list.slice(0, 48);
  }, [serverStates, onlyAvailable4h, maxRate60, sortBy]);

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title={`Escort ${CITY_NAME} (${TARGET_CANTON}) - ${profiles.length} geprüfte Profile & +41 Direktkontakt | iwantsexnow.ch`}
        description={`Unabhängige Escorts, Girlfriend Experience, Tantra & Hotelbesuche (Outcall) in ${CITY_NAME} (Kanton ${TARGET_CANTON}). Transparente 30m/60m CHF-Tarife ohne Provision.`}
        url={`https://iwantsexnow.ch/${ROUTE_NAME}`}
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <MapPin size={13} /> KANTON {TARGET_CANTON} · REGIONALES DIREKTVERZEICHNIS
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              Escort, Tantra & Begleitung in {CITY_NAME} ({profiles.length} Profile)
            </h1>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/kategorie/${CITY_SLUG}/girlfriend-experience`} className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white">
              GFE {CITY_NAME} →
            </Link>
            <Link href={`/kategorie/${CITY_SLUG}/tantra-massage`} className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white">
              Tantra {CITY_NAME} →
            </Link>
            <Link href={`/kategorie/${CITY_SLUG}/haus-und-hotelbesuche`} className="px-3.5 py-2 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
              Hotel-Outcall {CITY_NAME} →
            </Link>
          </div>
        </section>

        <section className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setOnlyAvailable4h(!onlyAvailable4h)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                onlyAvailable4h ? "bg-emerald-500 text-[#07120B]" : "bg-[#0D111A] border border-white/15 text-gray-300"
              }`}
            >
              ● Nur 4h verfügbar
            </button>
            {[
              { label: "Alle CHF", val: 1200 },
              { label: "≤ CHF 300", val: 300 },
              { label: "≤ CHF 400", val: 400 },
            ].map((p) => (
              <button
                key={p.val}
                type="button"
                onClick={() => setMaxRate60(p.val)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer ${
                  maxRate60 === p.val ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] border border-white/10 text-gray-400"
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 bg-[#0D111A] border border-white/15 rounded-xl px-3 py-1.5">
            <ArrowUpDown size={13} className="text-[#C8A97E]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
            >
              <option value="recommended" className="bg-[#121722]">Empfohlen in {CITY_NAME}</option>
              <option value="available" className="bg-[#121722]">● Jetzt 4h verfügbar zuerst</option>
              <option value="price_asc" className="bg-[#121722]">CHF-Honorar: Aufsteigend</option>
              <option value="price_desc" className="bg-[#121722]">CHF-Honorar: Absteigend</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {profiles.map((p: any) => (
            <div key={p.id} className="rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E]/60 overflow-hidden flex flex-col justify-between transition">
              <div>
                <div className="relative h-60 bg-[#0D111A]">
                  <img
                    src={p.thumbnail || "/images/escort-portrait-1.jpg"}
                    alt={p.rawName}
                    loading="lazy"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg"; }}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/85 border border-white/15 text-xs font-extrabold text-[#C8A97E]">
                    CHF {p.rate60Chf}.– / 60m
                  </div>
                </div>
                <div className="p-4 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-[#C8A97E]">{p.canton} · {p.city}</span>
                    <span className="text-gray-400">30m: CHF {p.rate30Chf}.–</span>
                  </div>
                  <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block text-base font-serif font-bold text-white hover:text-[#C8A97E] truncate">
                    {p.rawName}
                  </Link>
                  <div className="text-xs text-gray-300">
                    {p.age || 25} J. · {p.heightCm || 168} cm · Cup {p.cupSize || "C"}
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block w-full py-2.5 rounded-xl bg-[#C8A97E] text-[#0D111A] font-extrabold text-xs text-center">
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