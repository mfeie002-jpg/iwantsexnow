import React from "react";
import { GetServerSideProps } from "next";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { StructuredSchema } from "@/components/StructuredSchema";
import offersData from "@/data/harvested-offers.json";
import { MapPin, Phone, Check, ArrowLeft, Sparkles, SlidersHorizontal } from "lucide-react";

const CITY_META: Record<string, { label: string; canton: string; lang: "de" | "fr" | "it" }> = {
  "zuerich": { label: "Zürich", canton: "ZH", lang: "de" },
  "zug": { label: "Zug", canton: "ZG", lang: "de" },
  "cham": { label: "Cham & Baar", canton: "ZG", lang: "de" },
  "basel": { label: "Basel", canton: "BS", lang: "de" },
  "bern": { label: "Bern", canton: "BE", lang: "de" },
  "luzern": { label: "Luzern", canton: "LU", lang: "de" },
  "st-gallen": { label: "St. Gallen", canton: "SG", lang: "de" },
  "baden": { label: "Baden & Aargau", canton: "AG", lang: "de" },
  "winterthur": { label: "Winterthur", canton: "ZH", lang: "de" },
  "geneve": { label: "Genève", canton: "GE", lang: "fr" },
  "lausanne": { label: "Lausanne", canton: "VD", lang: "fr" },
  "lugano": { label: "Lugano", canton: "TI", lang: "it" },
};

const SERVICE_META: Record<string, { de: string; fr: string; it: string; matchRegex: string; rubric?: string }> = {
  "girlfriend-experience": {
    de: "Girlfriend Experience (GFE) & Begleitung",
    fr: "Escort Girlfriend Experience (GFE)",
    it: "Escort Girlfriend Experience (GFE)",
    matchRegex: "gfe|girlfriend|schmusen|küssen|begleitung",
    rubric: "female",
  },
  "erotische-massage": {
    de: "Erotische Massage & Body-to-Body",
    fr: "Massage Érotique & Sensuel",
    it: "Massaggio Erotico & Sensuale",
    matchRegex: "massage|body|ölmassage|thai",
  },
  "tantra-massage": {
    de: "Tantra-Massage & Ganzkörper-Ritual",
    fr: "Massage Tantrique & Relaxant",
    it: "Massaggio Tantrico",
    matchRegex: "tantra|massage|ritual",
  },
  "hotelbesuch-outcall": {
    de: "Hotelbesuch & Outcall Escort",
    fr: "Escort Hôtel & Déplacement (Outcall)",
    it: "Escort Hotel & Outcall",
    matchRegex: "outcall|hotel|hausbesuch",
  },
  "privatempfang-incall": {
    de: "Diskreter Privatempfang & Studio (Incall)",
    fr: "Réception Privée & Appartement (Incall)",
    it: "Ricevimento Privato (Incall)",
    matchRegex: "incall|privat|studio|apartment",
  },
  "domina-bdsm": {
    de: "Domina, BDSM & Fetisch Studio",
    fr: "Domina, BDSM & Fétichisme",
    it: "Domina, BDSM & Fetish",
    matchRegex: "domina|bdsm|fetisch|herrin|mistress",
    rubric: "bdsm",
  },
  "trans-ts": {
    de: "Trans Escorts & TS Models",
    fr: "Escort Trans & TS",
    it: "Escort Trans & TS",
    matchRegex: "trans|ts|shemale|ladyboy",
    rubric: "trans",
  },
};

export default function CityServiceProgrammaticPage({
  citySlug,
  serviceSlug,
  cityLabel,
  canton,
  lang,
  serviceTitle,
  profiles,
  avgRate30,
  avgRate60,
}: any) {
  const seoTitle =
    lang === "fr"
      ? `${serviceTitle} à ${cityLabel} (${canton}) – ${profiles.length} Profils Vérifiés & Tarifs CHF | iwantsexnow.ch`
      : lang === "it"
      ? `${serviceTitle} a ${cityLabel} (${canton}) – ${profiles.length} Profili & Tariffe CHF | iwantsexnow.ch`
      : `${serviceTitle} in ${cityLabel} (${canton}) – ${profiles.length} Profile, CHF-Preise & Direktkontakt | iwantsexnow.ch`;

  const seoDesc =
    lang === "fr"
      ? `Comparez ${profiles.length} profils pour ${serviceTitle} à ${cityLabel} (${canton}). Tarif indicatif Ø CHF ${avgRate30} (30m) / CHF ${avgRate60} (60m). Contact direct +41 sans commission.`
      : lang === "it"
      ? `Confronta ${profiles.length} profili per ${serviceTitle} a ${cityLabel} (${canton}). Tariffa media Ø CHF ${avgRate30} (30m) / CHF ${avgRate60} (60m). Contatto diretto +41.`
      : `Vergleiche ${profiles.length} geprüfte Schweizer Profile für ${serviceTitle} in ${cityLabel} (Kanton ${canton}). Ø Richtpreis: CHF ${avgRate30} (30 Min.) / CHF ${avgRate60} (60 Min.) mit +41 Direktkontakt.`;

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-24">
      <SEO title={seoTitle} description={seoDesc} />
      <StructuredSchema cityName={cityLabel} cantonCode={canton} />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 border-b border-white/10 pb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#C8A97E]">
            <ArrowLeft size={14} /> Zurück zum Schweizer Gesamtverzeichnis
          </Link>
          <div className="flex flex-wrap gap-2">
            {Object.entries(SERVICE_META).map(([slug, meta]) => (
              <Link
                key={slug}
                href={`/kategorie/${citySlug}/${slug}`}
                className={`px-2.5 py-1 rounded-lg border transition ${
                  slug === serviceSlug
                    ? "bg-[#C8A97E] text-[#0D111A] border-[#C8A97E] font-extrabold"
                    : "bg-[#121722] border-white/10 text-gray-300 hover:text-white"
                }`}
              >
                {meta[lang as "de" | "fr" | "it"] || meta.de}
              </Link>
            ))}
          </div>
        </div>

        {/* SEO Hero mit echten Schweizer Preis-Durchschnitten */}
        <section className="p-6 sm:p-8 rounded-2xl bg-[#121722] border border-[#C8A97E]/40 space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="space-y-1.5 max-w-3xl">
              <div className="text-[11px] uppercase tracking-widest text-[#C8A97E] font-bold">
                SCHWEIZER DIREKTVERGLEICH · {cityLabel.toUpperCase()} ({canton})
              </div>
              <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                {serviceTitle} in {cityLabel} ({canton})
              </h1>
              <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{seoDesc}</p>
            </div>
            <div className="flex gap-3">
              <div className="p-3.5 rounded-xl bg-[#0D111A] border border-white/10 text-right">
                <div className="text-[10px] text-gray-400 uppercase">Ø 30 Min. ({cityLabel})</div>
                <div className="text-lg font-extrabold text-white">CHF {avgRate30}</div>
              </div>
              <div className="p-3.5 rounded-xl bg-[#0D111A] border border-[#C8A97E]/40 text-right">
                <div className="text-[10px] text-gray-400 uppercase">Ø 60 Min. ({cityLabel})</div>
                <div className="text-xl font-extrabold text-[#C8A97E]">CHF {avgRate60}</div>
              </div>
            </div>
          </div>
        </section>

        {/* Profil-Karten mit den neuen Deep-Attributen (Alter, Haarfarbe, Körbchengrösse, Sprachen) */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {profiles.map((p: any, idx: number) => (
            <article
              key={`${p.id}-${idx}`}
              className="rounded-2xl overflow-hidden bg-[#121722] border border-white/10 hover:border-[#C8A97E] transition flex flex-col justify-between"
            >
              <Link href={`/profile/${encodeURIComponent(p.id)}`} className="relative aspect-[3/4] block bg-black">
                <img
                  src={p.thumbnail || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80"}
                  alt={`${p.cleanName} – ${cityLabel}`}
                  className="w-full h-full object-cover object-top"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                  <span className="px-2 py-0.5 rounded bg-black/80 text-[#C8A97E] text-[10px] font-bold border border-[#C8A97E]/40">
                    {p.age} J. · {p.cupSize} · {p.hairColor}
                  </span>
                </div>
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
                  <div className="min-w-0">
                    <h2 className="text-base font-serif font-bold text-white truncate">{p.cleanName}</h2>
                    <p className="text-xs text-gray-300 flex items-center gap-1 truncate">
                      <MapPin size={11} className="text-[#C8A97E]" /> {p.city} ({p.canton})
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-black/85 border border-[#C8A97E]/40 text-xs font-extrabold text-[#C8A97E] shrink-0">
                    CHF {p.rate60}
                  </span>
                </div>
              </Link>
              <div className="p-3 flex items-center justify-between text-[11px] text-gray-300 border-t border-white/10">
                <span className="truncate">{(p.languages || ["DE", "EN"]).join(" · ")}</span>
                <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-[#C8A97E] font-bold hover:underline shrink-0">
                  Profil & +41 →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Interne SEO-Verlinkung auf alle anderen Schweizer Städte */}
        <section className="p-6 rounded-2xl bg-[#121722] border border-white/10 space-y-3">
          <h2 className="text-sm font-bold uppercase tracking-wider text-[#C8A97E]">
            {serviceTitle} in weiteren Schweizer Städten vergleichen
          </h2>
          <div className="flex flex-wrap gap-2 text-xs">
            {Object.entries(CITY_META).map(([cSlug, cMeta]) => (
              <Link
                key={cSlug}
                href={`/kategorie/${cSlug}/${serviceSlug}`}
                className="px-3 py-1.5 rounded-xl bg-[#0D111A] border border-white/10 hover:border-[#C8A97E] text-gray-200"
              >
                {serviceTitle} {cMeta.label} ({cMeta.canton})
              </Link>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const citySlug = String(ctx.params?.city || "zuerich").toLowerCase();
  const serviceSlug = String(ctx.params?.service || "girlfriend-experience").toLowerCase();

  const cityInfo = CITY_META[citySlug] || { label: citySlug.charAt(0).toUpperCase() + citySlug.slice(1), canton: "ZH", lang: "de" };
  const srvInfo = SERVICE_META[serviceSlug] || SERVICE_META["girlfriend-experience"];
  const rx = new RegExp(srvInfo.matchRegex, "i");

  const allOffers = (offersData as any[]) || [];
  let matched = allOffers.filter((o) => {
    const inCantonOrCity =
      String(o.canton || "").toUpperCase() === cityInfo.canton ||
      String(o.city || "").toLowerCase().includes(citySlug.replace("-", " "));
    if (!inCantonOrCity) return false;
    if (srvInfo.rubric && o.rubric && o.rubric !== srvInfo.rubric) return false;
    const hay = `${o.rawName || ""} ${o.bio || ""} ${(o.includedTags || []).join(" ")}`;
    return rx.test(hay) || !srvInfo.rubric;
  });

  if (matched.length < 8) {
    matched = allOffers.filter((o) => String(o.canton || "").toUpperCase() === cityInfo.canton).slice(0, 24);
  }

  const profiles = matched.slice(0, 32).map((o) => ({
    id: o.id || o.dedupClusterId,
    cleanName: String(o.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim().slice(0, 28) || "Profil",
    city: o.city || cityInfo.label,
    canton: o.canton || cityInfo.canton,
    rate30: Number(o.rate30Chf) || 200,
    rate60: Number(o.advertisedBaseChf) || 350,
    age: o.age || 24,
    cupSize: o.cupSize || "75C",
    hairColor: o.hairColor || "Brünett",
    languages: o.languages || ["Deutsch", "Englisch"],
    thumbnail: o.thumbnail || "",
  }));

  const avgRate60 =
    profiles.length > 0
      ? Math.round(profiles.reduce((acc, p) => acc + p.rate60, 0) / profiles.length / 10) * 10
      : 350;
  const avgRate30 =
    profiles.length > 0
      ? Math.round(profiles.reduce((acc, p) => acc + p.rate30, 0) / profiles.length / 10) * 10
      : 200;

  return {
    props: {
      citySlug,
      serviceSlug,
      cityLabel: cityInfo.label,
      canton: cityInfo.canton,
      lang: cityInfo.lang,
      serviceTitle: srvInfo[cityInfo.lang] || srvInfo.de,
      profiles,
      avgRate30,
      avgRate60,
    },
  };
};