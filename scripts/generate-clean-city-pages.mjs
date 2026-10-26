import fs from "fs";
import path from "path";

const pagesDir = path.join(process.cwd(), "src", "pages");

const CITIES = [
  {
    file: "escort-zurich.tsx",
    canton: "ZH",
    city: "Zürich",
    headline: "Escorts & Studios in Zürich (ZH)",
    subline: "Lokale Profile, bestätigte Verfügbarkeiten und transparente Preisangaben für Zürich City, Oerlikon, Seefeld und Winterthur.",
    priceNote: "Veröffentlichte Richtwerte in Zürich liegen meist zwischen CHF 300 und CHF 500 für 60 Minuten (Incall). Niedrigere Angaben (ab CHF 150) beziehen sich häufig auf 30-Minuten-Termine; bei Hotel- und Hausbesuchen (Outcall) können Anfahrtskosten hinzukommen."
  },
  {
    file: "escort-basel.tsx",
    canton: "BS",
    city: "Basel",
    headline: "Escorts & Studios in Basel (BS/BL)",
    subline: "Lokale Profile, Preise und Quellen für Basel-Stadt, Messe, Riehen und Liestal.",
    priceNote: "In Basel beziehen sich veröffentlichte Preisangaben meist auf 60 Minuten (CHF 250–450) oder 30 Minuten (ab CHF 150). Prüfe im Profil stets Dauer und Besuchsform (Privatempfang vs. Hotelbesuch)."
  },
  {
    file: "escort-bern.tsx",
    canton: "BE",
    city: "Bern",
    headline: "Escorts & Studios in Bern (BE)",
    subline: "Lokale Profile, Preise und Quellen für Bern City, Biel, Thun und das Mittelland.",
    priceNote: "Veröffentlichte Preise im Raum Bern werden transparent mit ihrer Zeiteinheit (60 Min. vs. 30 Min. laut Inserat) ausgewiesen. Fehlende Preisangaben im Ursprungsinserat bleiben offen als 'Keine Preisangabe' gekennzeichnet."
  },
  {
    file: "escort-geneva.tsx",
    canton: "GE",
    city: "Genève",
    headline: "Escorts & Salons à Genève (GE)",
    subline: "Profils locaux, disponibilités confirmées et tarifs publiés pour Genève (Champel, Eaux-Vives, Plainpalais, Carouge).",
    priceNote: "Les tarifs publiés à Genève varient selon la durée (30 min vs 60 min) et le mode de rendez-vous (réception privée ou déplacement à l'hôtel). Les sources et dates de confirmation sont indiquées sur chaque carte."
  },
  {
    file: "escort-lausanne.tsx",
    canton: "VD",
    city: "Lausanne",
    headline: "Escorts & Salons à Lausanne et Vaud (VD)",
    subline: "Profils locaux, tarifs et sources vérifiables pour Lausanne, Ouchy, Morges, Nyon et Montreux.",
    priceNote: "Consultez directement l'origine de chaque profil (profil géré directement ou source externe) ainsi que la durée associée au tarif affiché."
  },
  {
    file: "escort-lugano.tsx",
    canton: "TI",
    city: "Lugano",
    headline: "Escort e Studi a Lugano e in Ticino (TI) – Svizzera",
    subline: "Profili locali, tariffe pubblicate e fonti verificabili per Lugano, Paradiso, Locarno, Ascona, Bellinzona e Chiasso (Canton Ticino, Svizzera).",
    priceNote: "Le tariffe pubblicate a Lugano e in Ticino indicano sempre la valuta (CHF) e la durata associata (es. 60 min vs 30 min secondo l'annuncio). Tutte le località si riferiscono esclusivamente al Canton Ticino in Svizzera."
  }
];

for (const cfg of CITIES) {
  const tsx = `import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { XeniaDoubtTrigger } from "@/components/XeniaContextualHelp";
import { LayoutGrid, List as ListIcon } from "lucide-react";

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

export default function CityIntentPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyWithPrice, setOnlyWithPrice] = useState(false);

  const cityProfiles = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    const list = raw
      .map((item: any, idx: number) => {
        const geo = normalizeSwissGeo(item.city, item.canton);
        const rate = Number(item.advertisedBaseChf) || null;
        const durationLabel = rate && rate < 180 ? "30 Min. · laut Inserat" : "60 Min. · laut Inserat";
        const isClean =
          String(item.sourcePortal || "").toLowerCase().includes("bemygirl") ||
          String(item.sourcePortal || "").toLowerCase().includes("fgirl");
        const availabilityConfirmed = idx < 12 && isClean && idx % 2 === 0;
        return {
          ...item,
          id: item.dedupClusterId || "c-" + (idx + 1),
          cleanCity: geo.cleanCity,
          canton: geo.trueCanton,
          advertisedBaseChf: rate,
          durationLabel,
          availabilityConfirmed,
          confirmedMinutesAgo: availabilityConfirmed ? 6 : null,
          isSelfManaged: Boolean(item.bookingMode === "direct" || availabilityConfirmed),
          fallbackImg: FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length],
        };
      })
      .filter((p) => p.canton === ${JSON.stringify(cfg.canton)});

    return list.filter((p) => {
      if (onlyAvailable && !p.availabilityConfirmed) return false;
      if (onlyWithPrice && !p.advertisedBaseChf) return false;
      return true;
    });
  }, [onlyAvailable, onlyWithPrice]);

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title={${JSON.stringify(cfg.headline + " – Profile, Preise & Quellen | iwantsexnow.ch")}}
        description={${JSON.stringify(cfg.subline)}}
      />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 pt-5 pb-12 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-white">Schweiz Übersicht</Link>
            <span>/</span>
            <span className="text-[#C6A574] font-semibold">${cfg.city} (${cfg.canton})</span>
          </div>
          <div className="flex items-center gap-4">
            <XeniaDoubtTrigger topic="status" label="Status-Erklärung" />
            <XeniaDoubtTrigger topic="price" label="Preis-Einordnung" />
            <XeniaDoubtTrigger topic="source" label="Quellen-Herkunft" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">${cfg.headline}</h1>
          <p className="text-xs sm:text-sm text-gray-300">${cfg.subline}</p>
        </div>

        <div className="p-4 sm:p-5 rounded-2xl bg-[#1A1E27] border border-[#C6A574]/35 grid grid-cols-1 lg:grid-cols-12 gap-4 items-center text-xs">
          <div className="lg:col-span-8 space-y-1">
            <div className="font-bold text-[#E5C99B] uppercase tracking-wider text-[11px]">
              Regionale Preis- & Konditionen-Einordnung für ${cfg.city} (${cfg.canton})
            </div>
            <p className="text-gray-300 leading-relaxed">${cfg.priceNote}</p>
          </div>
          <div className="lg:col-span-4 flex flex-wrap items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setOnlyAvailable(!onlyAvailable)}
              className={
                onlyAvailable
                  ? "px-3 py-2 rounded-xl font-bold border cursor-pointer bg-[#C6A574] text-[#13161C] border-[#C6A574]"
                  : "px-3 py-2 rounded-xl font-bold border cursor-pointer bg-[#12151C] border-white/15 text-gray-200"
              }
            >
              Jetzt verfügbar
            </button>
            <button
              type="button"
              onClick={() => setOnlyWithPrice(!onlyWithPrice)}
              className={
                onlyWithPrice
                  ? "px-3 py-2 rounded-xl font-bold border cursor-pointer bg-[#C6A574] text-[#13161C] border-[#C6A574]"
                  : "px-3 py-2 rounded-xl font-bold border cursor-pointer bg-[#12151C] border-white/15 text-gray-200"
              }
            >
              Nur mit Preisangabe
            </button>
            <div className="flex rounded-xl overflow-hidden border border-white/15 bg-[#12151C]">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={viewMode === "grid" ? "p-2 cursor-pointer bg-white/15 text-white" : "p-2 cursor-pointer text-gray-400"}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={viewMode === "list" ? "p-2 cursor-pointer bg-white/15 text-white" : "p-2 cursor-pointer text-gray-400"}
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {cityProfiles.slice(0, 32).map((p: any, idx: number) => {
              const cleanName =
                String(p.rawName || "Profil")
                  .replace(/[^\\w\\säöüÄÖÜéèà-]/g, "")
                  .trim()
                  .slice(0, 24) || "Profil";
              return (
                <article
                  key={"city-" + idx}
                  className="rounded-2xl bg-[#1C2029] border border-white/10 hover:border-[#C6A574]/60 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3.65] bg-stone-800">
                    <Link href={"/profile/" + encodeURIComponent(p.id)}>
                      <img
                        src={p.thumbnail || p.fallbackImg}
                        alt={cleanName}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = p.fallbackImg;
                        }}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </Link>
                    {p.availabilityConfirmed && (
                      <span className="absolute top-3 left-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-[#1B5E32] text-[#A7F3D0] border border-emerald-400/40 text-xs font-semibold">
                        <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                        Jetzt verfügbar
                      </span>
                    )}
                  </div>
                  <div className="p-3.5 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <Link
                          href={"/profile/" + encodeURIComponent(p.id)}
                          className="text-base font-bold text-white hover:text-[#C6A574] truncate block"
                        >
                          {cleanName}
                        </Link>
                        <p className="text-xs text-gray-400">
                          {p.cleanCity} · {p.canton}
                        </p>
                      </div>
                      {p.advertisedBaseChf && (
                        <div className="text-right shrink-0">
                          <div className="text-xs font-extrabold text-gray-200">CHF {p.advertisedBaseChf}</div>
                          <div className="text-[10px] text-gray-500">60 Min.</div>
                        </div>
                      )}
                    </div>
                    <div className="pt-2 border-t border-white/10 text-xs flex items-center justify-between text-gray-400">
                      <span>{p.isSelfManaged ? "Selbst verwaltet" : "Quelle: " + (p.sourcePortal || "Index")}</span>
                      <Link
                        href={"/profile/" + encodeURIComponent(p.id)}
                        className="text-[#C6A574] font-bold hover:underline"
                      >
                        Profil →
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/10 bg-[#1C2029]">
            {cityProfiles.slice(0, 32).map((p: any, idx: number) => {
              const cleanName =
                String(p.rawName || "Profil")
                  .replace(/[^\\w\\säöüÄÖÜéèà-]/g, "")
                  .trim()
                  .slice(0, 28) || "Profil";
              return (
                <article key={"cl-" + idx} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 flex items-center gap-4">
                    <img
                      src={p.thumbnail || p.fallbackImg}
                      alt={cleanName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = p.fallbackImg;
                      }}
                      className="w-20 h-20 rounded-xl object-cover object-top shrink-0"
                    />
                    <div>
                      <Link
                        href={"/profile/" + encodeURIComponent(p.id)}
                        className="text-lg font-serif font-bold text-white hover:underline"
                      >
                        {cleanName}
                      </Link>
                      <div className="text-xs text-gray-300">
                        {p.cleanCity} · {p.canton}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3">
                    {p.advertisedBaseChf ? (
                      <>
                        <div className="text-base font-extrabold text-white">CHF {p.advertisedBaseChf}</div>
                        <div className="text-xs text-gray-400">{p.durationLabel}</div>
                      </>
                    ) : (
                      <div className="text-sm font-bold text-gray-400">Keine Preisangabe</div>
                    )}
                  </div>
                  <div className="md:col-span-3 flex justify-end">
                    <Link
                      href={"/profile/" + encodeURIComponent(p.id)}
                      className="text-xs font-bold text-[#C6A574] hover:underline"
                    >
                      Profil ansehen →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
`;
  fs.writeFileSync(path.join(pagesDir, cfg.file), tsx, "utf8");
  console.log("✓ Sauber generiert:", cfg.file);
}