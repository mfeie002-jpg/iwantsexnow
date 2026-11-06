import React, { useState, useEffect, useMemo } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import { SlidersHorizontal, ArrowUpDown, MapPin, RotateCcw } from "lucide-react";

const CITY_CONFIG: Record<string, { label: string; canton: string; lang: "de" | "fr" | "it" }> = {
  zuerich: { label: "Zürich", canton: "ZH", lang: "de" },
  zurich: { label: "Zürich", canton: "ZH", lang: "de" },
  zug: { label: "Zug", canton: "ZG", lang: "de" },
  luzern: { label: "Luzern", canton: "LU", lang: "de" },
  basel: { label: "Basel", canton: "BS", lang: "de" },
  bern: { label: "Bern", canton: "BE", lang: "de" },
  baden: { label: "Baden & Aargau", canton: "AG", lang: "de" },
  "st-gallen": { label: "St. Gallen", canton: "SG", lang: "de" },
  winterthur: { label: "Winterthur", canton: "ZH", lang: "de" },
  geneve: { label: "Genève", canton: "GE", lang: "fr" },
  lausanne: { label: "Lausanne", canton: "VD", lang: "fr" },
  lugano: { label: "Lugano", canton: "TI", lang: "it" },
};

const SERVICE_CONFIG: Record<string, { de: string; fr: string; it: string }> = {
  "girlfriend-experience": { de: "Girlfriend Experience (GFE)", fr: "Girlfriend Experience (GFE)", it: "Girlfriend Experience (GFE)" },
  "tantra-massage": { de: "Tantra & Erotische Massage", fr: "Massage Tantra & Érotique", it: "Massaggio Tantra & Erotico" },
  "haus-und-hotelbesuche": { de: "Haus- & Hotelbesuche (Outcall)", fr: "Escort Hôtel & Domicile (Outcall)", it: "Escort Hotel & Domicilio (Outcall)" },
  "domina-bdsm": { de: "Domina, BDSM & Fetisch", fr: "Domina, BDSM & Fétiche", it: "Domina, BDSM & Fetish" },
  "dinner-date": { de: "High-Class Dinner Date & Begleitung", fr: "High-Class Dinner Date & Accompagnement", it: "High-Class Dinner Date & Accompagnamento" },
  "trans-escort": { de: "Trans & TS Escort", fr: "Escort Trans & TS", it: "Trans & TS Escort" },
  "paare-und-bisex": { de: "Bisexuell & Begleitung für Paare", fr: "Bisexuel & Couples", it: "Bisessuale & Coppie" },
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const citySlug = String(ctx.params?.city || "zug").toLowerCase();
  const serviceSlug = String(ctx.params?.service || "girlfriend-experience").toLowerCase();

  const cityMeta = CITY_CONFIG[citySlug] || { label: citySlug.charAt(0).toUpperCase() + citySlug.slice(1), canton: "ZH", lang: "de" };
  const serviceMeta = SERVICE_CONFIG[serviceSlug] || SERVICE_CONFIG["girlfriend-experience"];

  const rawOffers = (offersData as any[]) || [];
  const cantonMatches = rawOffers.filter((o) => String(o.canton || "").toUpperCase() === cityMeta.canton);
  const pool = cantonMatches.length >= 6 ? cantonMatches : rawOffers.slice(0, 80);

  const sanitizedPool = pool.slice(0, 60).map((o) => {
    const r60 = Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350));
    const r30 = Math.max(80, Math.min(800, Number(o.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
    return {
      id: o.id || o.dedupClusterId,
      rawName: o.rawName || "Verifiziertes Profil",
      city: o.city || cityMeta.label,
      canton: o.canton || cityMeta.canton,
      rawPhone: o.rawPhone || null,
      rate60Chf: r60,
      rate30Chf: r30,
      thumbnail: o.thumbnail || "/images/escort-portrait-1.jpg",
      age: Number(o.age) || 25,
      heightCm: Number(o.heightCm) || 168,
      cupSize: o.cupSize || "C",
      hairColor: o.hairColor || "Brünett",
      rubric: o.rubric || "female",
      curationScore: Number(o.curationScore) || 80,
    };
  });

  return {
    props: {
      citySlug,
      serviceSlug,
      cityMeta,
      serviceTitle: serviceMeta[cityMeta.lang] || serviceMeta.de,
      initialProfiles: sanitizedPool,
    },
  };
};

export default function Category2DPage({ citySlug, serviceSlug, cityMeta, serviceTitle, initialProfiles }: any) {
  const [serverStates, setServerStates] = useState<Record<string, any>>({});
  const [blockedIds, setBlockedIds] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<"recommended" | "available" | "price_asc" | "price_desc" | "age_asc">("recommended");
  const [onlyAvailable4h, setOnlyAvailable4h] = useState(false);
  const [onlyVerified, setOnlyVerified] = useState(false);
  const [onlyWithPhone, setOnlyWithPhone] = useState(false);
  const [maxRate60, setMaxRate60] = useState<number>(1200);
  const [cupFilter, setCupFilter] = useState<string>("ALL");
  const [hairFilter, setHairFilter] = useState<string>("ALL");
  const [ageGroup, setAgeGroup] = useState<"ALL" | "18-24" | "25-30" | "31+">("ALL");

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states) setServerStates(d.states);
        if (Array.isArray(d?.blockedIds)) setBlockedIds(d.blockedIds);
      })
      .catch(() => {});
  }, []);

  const filteredAndSorted = useMemo(() => {
    const blocked = new Set(blockedIds);
    const list: any[] = [];

    for (const p of initialProfiles || []) {
      if (!p.id || blocked.has(p.id)) continue;
      const st = serverStates[p.id] || {};
      if (st.paused || st.hidden) continue;

      const isAvail = Boolean(st.availabilityConfirmed);
      const isVerif = Boolean(st.identityVerified);
      const hasPhone = Boolean(p.rawPhone);
      const r60 = Math.max(100, Math.min(1200, Number(p.rate60Chf) || 350));

      if (onlyAvailable4h && !isAvail) continue;
      if (onlyVerified && !isVerif) continue;
      if (onlyWithPhone && !hasPhone) continue;
      if (r60 > maxRate60) continue;

      if (cupFilter !== "ALL") {
        if (cupFilter === "AB" && !["A", "B"].includes(p.cupSize)) continue;
        if (cupFilter === "C" && p.cupSize !== "C") continue;
        if (cupFilter === "D+" && !["D", "DD", "E"].includes(p.cupSize)) continue;
      }
      if (hairFilter !== "ALL" && String(p.hairColor || "").toLowerCase() !== hairFilter.toLowerCase()) continue;
      if (ageGroup !== "ALL") {
        const a = Number(p.age) || 25;
        if (ageGroup === "18-24" && (a < 18 || a > 24)) continue;
        if (ageGroup === "25-30" && (a < 25 || a > 30)) continue;
        if (ageGroup === "31+" && a < 31) continue;
      }

      list.push({ ...p, rate60Chf: r60, availabilityConfirmed: isAvail, identityVerified: isVerif });
    }

    list.sort((a, b) => {
      if (sortBy === "available") {
        if (a.availabilityConfirmed !== b.availabilityConfirmed) return a.availabilityConfirmed ? -1 : 1;
        return a.rate60Chf - b.rate60Chf;
      }
      if (sortBy === "price_asc") return a.rate60Chf - b.rate60Chf;
      if (sortBy === "price_desc") return b.rate60Chf - a.rate60Chf;
      if (sortBy === "age_asc") return (a.age || 25) - (b.age || 25);

      const scoreA = (a.availabilityConfirmed ? 500 : 0) + (a.identityVerified ? 250 : 0) + (a.rawPhone ? 100 : 0) + (a.curationScore || 0);
      const scoreB = (b.availabilityConfirmed ? 500 : 0) + (b.identityVerified ? 250 : 0) + (b.rawPhone ? 100 : 0) + (b.curationScore || 0);
      return scoreB - scoreA;
    });

    return list;
  }, [initialProfiles, serverStates, blockedIds, sortBy, onlyAvailable4h, onlyVerified, onlyWithPhone, maxRate60, cupFilter, hairFilter, ageGroup]);

  const avgChf = useMemo(() => {
    if (filteredAndSorted.length === 0) return 320;
    const sum = filteredAndSorted.reduce((acc, item) => acc + Number(item.rate60Chf || 350), 0);
    return Math.round(sum / filteredAndSorted.length / 10) * 10;
  }, [filteredAndSorted]);

  const resetFilters = () => {
    setSortBy("recommended");
    setOnlyAvailable4h(false);
    setOnlyVerified(false);
    setOnlyWithPhone(false);
    setMaxRate60(1200);
    setCupFilter("ALL");
    setHairFilter("ALL");
    setAgeGroup("ALL");
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO
        title={`${serviceTitle} in ${cityMeta.label} (${cityMeta.canton}) – Direktkontakt & CHF-Tarife | iwantsexnow.ch`}
        description={`${filteredAndSorted.length} geprüfte Profile für ${serviceTitle} in ${cityMeta.label} (${cityMeta.canton}). Ø Honorar CHF ${avgChf}.– / 60 Min.`}
        url={`https://iwantsexnow.ch/kategorie/${citySlug}/${serviceSlug}`}
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <section className="p-6 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold flex items-center gap-1.5">
              <MapPin size={13} /> KANTON {cityMeta.canton} · 2D-KATEGORIE & ECHTZEIT-FILTER
            </div>
            <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
              {serviceTitle} in {cityMeta.label}
            </h1>
            <p className="text-xs text-gray-300 mt-1">
              <strong>{filteredAndSorted.length} aktive Profile</strong> · Ø Richtpreis 60 Min.: <strong className="text-[#C8A97E]">CHF {avgChf}.–</strong>
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link href={`/orte/${citySlug}`} className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-bold text-white">
              Alle in {cityMeta.label} →
            </Link>
            <Link href="/compare-escorts" className="px-3.5 py-2 rounded-xl bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold">
              4-Profil Direktvergleich →
            </Link>
          </div>
        </section>

        <section className="p-5 rounded-2xl bg-[#121722] border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
            <div className="flex items-center gap-2 text-xs font-extrabold text-white">
              <SlidersHorizontal size={15} className="text-[#C8A97E]" />
              <span>Sofort-Filter & 5-Wege-Sortierung ({filteredAndSorted.length} Treffer)</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-[#0D111A] border border-white/15 rounded-xl px-3 py-1.5">
                <ArrowUpDown size={13} className="text-[#C8A97E]" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-xs font-bold text-white outline-none cursor-pointer"
                >
                  <option value="recommended" className="bg-[#121722]">Empfohlen & Kuratiert</option>
                  <option value="available" className="bg-[#121722]">● Jetzt 4h verfügbar zuerst</option>
                  <option value="price_asc" className="bg-[#121722]">CHF-Honorar: Günstigste zuerst</option>
                  <option value="price_desc" className="bg-[#121722]">CHF-Honorar: Exklusiv zuerst</option>
                  <option value="age_asc" className="bg-[#121722]">Alter: Jüngste zuerst</option>
                </select>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] font-bold text-gray-300 inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyAvailable4h(!onlyAvailable4h)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                onlyAvailable4h ? "bg-emerald-500 text-[#07120B]" : "bg-[#0D111A] border border-white/15 text-gray-300"
              }`}
            >
              ● Nur jetzt 4h verfügbar
            </button>
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                onlyVerified ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] border border-white/15 text-gray-300"
              }`}
            >
              ✓ Nur geprüfte Identität
            </button>
            <button
              type="button"
              onClick={() => setOnlyWithPhone(!onlyWithPhone)}
              className={`px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer ${
                onlyWithPhone ? "bg-sky-500 text-[#07120B]" : "bg-[#0D111A] border border-white/15 text-gray-300"
              }`}
            >
              📞 Nur mit +41 Nummer
            </button>

            <div className="flex items-center gap-1 ml-auto">
              {[
                { label: "Alle CHF", val: 1200 },
                { label: "≤ CHF 250", val: 250 },
                { label: "≤ CHF 350", val: 350 },
                { label: "≤ CHF 500", val: 500 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => setMaxRate60(p.val)}
                  className={`px-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer ${
                    maxRate60 === p.val ? "bg-[#C8A97E] text-[#0D111A]" : "bg-[#0D111A] border border-white/10 text-gray-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as any)} className="rounded-xl bg-[#0D111A] border border-white/15 px-3 py-2 text-xs text-white">
              <option value="ALL">Altersgruppe: Alle (18–45+)</option>
              <option value="18-24">18 – 24 Jahre</option>
              <option value="25-30">25 – 30 Jahre</option>
              <option value="31+">31+ Jahre</option>
            </select>
            <select value={cupFilter} onChange={(e) => setCupFilter(e.target.value)} className="rounded-xl bg-[#0D111A] border border-white/15 px-3 py-2 text-xs text-white">
              <option value="ALL">Körbchengrösse: Alle (A – DD)</option>
              <option value="AB">Cup A / B</option>
              <option value="C">Cup C</option>
              <option value="D+">Cup D / DD</option>
            </select>
            <select value={hairFilter} onChange={(e) => setHairFilter(e.target.value)} className="rounded-xl bg-[#0D111A] border border-white/15 px-3 py-2 text-xs text-white">
              <option value="ALL">Haarfarbe: Alle</option>
              <option value="Blond">Blond</option>
              <option value="Brünett">Brünett</option>
              <option value="Schwarz">Schwarz</option>
            </select>
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredAndSorted.map((p: any) => (
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
                  <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-xl bg-black/80 border border-white/15 text-xs font-extrabold text-[#C8A97E]">
                    CHF {p.rate60Chf}.– <span className="text-[10px] text-gray-400 font-normal">/ 60m</span>
                  </div>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between gap-2 text-[11px]">
                    <span className="font-bold text-[#C8A97E]">{p.canton} · {p.city}</span>
                    <span className="text-gray-400">30 Min.: CHF {p.rate30Chf}.–</span>
                  </div>
                  <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block text-base font-serif font-bold text-white hover:text-[#C8A97E] truncate">
                    {p.rawName}
                  </Link>
                  <div className="text-xs text-gray-300">
                    {p.age} J. · {p.heightCm} cm · Cup {p.cupSize} · {p.hairColor}
                  </div>
                </div>
              </div>
              <div className="p-4 pt-0">
                <Link href={`/profile/${encodeURIComponent(p.id)}`} className="block w-full py-2.5 px-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs text-center">
                  Profil & Kontakt öffnen →
                </Link>
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}