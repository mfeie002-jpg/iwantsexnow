import React, { useState, useEffect, useMemo } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { PageIntro } from "@/components/PageIntro";
import offersData from "@/data/harvested-offers.json";
import { ListingGrid } from "@/components/listing/ListingCard";
import { toListing } from "@/lib/listing";
import { ArrowUpDown, RotateCcw } from "lucide-react";

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
    <div className="min-h-screen bg-papier text-tinte pb-24">
      <SEO
        title={`${serviceTitle} in ${cityMeta.label} (${cityMeta.canton}) – Direktkontakt & CHF-Tarife | iwantsexnow.ch`}
        description={`${filteredAndSorted.length} geprüfte Profile für ${serviceTitle} in ${cityMeta.label} (${cityMeta.canton}). Ø Honorar CHF ${avgChf}.– / 60 Min.`}
        url={`https://iwantsexnow.ch/kategorie/${citySlug}/${serviceSlug}`}
      />
      <LuxuryHeader />

      <PageIntro tone="butter" note="Nach Wunsch" art="none" title={<>{serviceTitle} in {cityMeta.label}</>}
        lead={<><strong>{filteredAndSorted.length} aktive Profile</strong> · Ø Richtpreis 60 Min.: <strong className="text-kirsche">CHF {avgChf}.–</strong></>}>
        <div className="flex flex-wrap gap-2">
            <Link href={`/orte/${citySlug}`} className="px-3.5 py-2 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/25 text-[13px] font-bold text-tinte">
              Alle in {cityMeta.label} →
            </Link>
            <Link href="/compare-escorts" className="px-3.5 py-2 rounded-xl bg-kirsche text-white text-[13px] font-extrabold">
              4-Profil Direktvergleich →
            </Link>
          </div>
      </PageIntro>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        

        <section className="p-5 rounded-2xl bg-white border border-tinte/20 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-tinte/20 pb-3">
            <div className="flex items-center gap-2 text-[13px] font-extrabold text-tinte">
              <span>{filteredAndSorted.length} Treffer</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="flex items-center gap-1.5 bg-papier border border-tinte/25 rounded-xl px-3 py-1.5">
                <ArrowUpDown size={13} className="text-kirsche" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent text-[13px] font-bold text-tinte outline-none cursor-pointer"
                >
                  <option value="recommended" className="bg-white">Empfohlen & Kuratiert</option>
                  <option value="available" className="bg-white">● Jetzt 4h verfügbar zuerst</option>
                  <option value="price_asc" className="bg-white">CHF-Honorar: Günstigste zuerst</option>
                  <option value="price_desc" className="bg-white">CHF-Honorar: Exklusiv zuerst</option>
                  <option value="age_asc" className="bg-white">Alter: Jüngste zuerst</option>
                </select>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="px-3 py-1.5 rounded-xl bg-tinte/[0.04] hover:bg-tinte/[0.06] border border-tinte/20 text-[13px] font-bold text-gray-700 inline-flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw size={12} /> Reset
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setOnlyAvailable4h(!onlyAvailable4h)}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-extrabold cursor-pointer ${
                onlyAvailable4h ? "bg-mint-500 text-tinte" : "bg-papier border border-tinte/25 text-gray-700"
              }`}
            >
              ● Nur jetzt 4h verfügbar
            </button>
            <button
              type="button"
              onClick={() => setOnlyVerified(!onlyVerified)}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-extrabold cursor-pointer ${
                onlyVerified ? "bg-kirsche text-white" : "bg-papier border border-tinte/25 text-tinte"
              }`}
            >
              ✓ Nur geprüfte Identität
            </button>
            <button
              type="button"
              onClick={() => setOnlyWithPhone(!onlyWithPhone)}
              className={`px-3.5 py-2 rounded-xl text-[13px] font-extrabold cursor-pointer ${
                onlyWithPhone ? "bg-lake-500 text-white" : "bg-papier border border-tinte/25 text-tinte"
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
                  className={`px-2.5 py-1.5 rounded-lg text-[13px] font-bold cursor-pointer ${
                    maxRate60 === p.val ? "bg-kirsche text-white" : "bg-papier border border-tinte/20 text-gray-400"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
            <select value={ageGroup} onChange={(e) => setAgeGroup(e.target.value as any)} className="rounded-xl bg-papier border border-tinte/25 px-3 py-2 text-[13px] text-tinte">
              <option value="ALL">Altersgruppe: Alle (18–45+)</option>
              <option value="18-24">18 – 24 Jahre</option>
              <option value="25-30">25 – 30 Jahre</option>
              <option value="31+">31+ Jahre</option>
            </select>
            <select value={cupFilter} onChange={(e) => setCupFilter(e.target.value)} className="rounded-xl bg-papier border border-tinte/25 px-3 py-2 text-[13px] text-tinte">
              <option value="ALL">Körbchengrösse: Alle (A – DD)</option>
              <option value="AB">Cup A / B</option>
              <option value="C">Cup C</option>
              <option value="D+">Cup D / DD</option>
            </select>
            <select value={hairFilter} onChange={(e) => setHairFilter(e.target.value)} className="rounded-xl bg-papier border border-tinte/25 px-3 py-2 text-[13px] text-tinte">
              <option value="ALL">Haarfarbe: Alle</option>
              <option value="Blond">Blond</option>
              <option value="Brünett">Brünett</option>
              <option value="Schwarz">Schwarz</option>
            </select>
          </div>
        </section>

        <ListingGrid profiles={filteredAndSorted.map((p: any) => toListing(p)).filter((p): p is NonNullable<ReturnType<typeof toListing>> => Boolean(p))} />
      </main>
    </div>
  );
}
