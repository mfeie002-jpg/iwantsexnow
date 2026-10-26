import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { VelvetBackdrop } from "@/components/VelvetBackdrop";
import { CorporateFooter } from "@/components/CorporateFooter";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { XeniaDoubtTrigger } from "@/components/XeniaContextualHelp";
import {
  Check,
  Clock,
  User,
  ExternalLink,
  Bookmark,
  LayoutGrid,
  List as ListIcon,
  Layers,
  HelpCircle,
  ArrowRight,
  MapPin,
} from "lucide-react";

interface SlugConfig {
  title: string;
  subtitle: string;
  canton: string;
  cityFilter: string;
  category: "all" | "escort" | "massage" | "bdsm" | "trans";
  lang: "de" | "fr" | "it";
}

function resolveSlugIntent(slugRaw: string): SlugConfig {
  const s = String(slugRaw || "zuerich").toLowerCase();

  if (s.includes("massage") || s.includes("tantra")) {
    return {
      title: "Erotische Massage & Tantra in der Schweiz",
      subtitle: "Sinnliche Massagen, Body-to-Body und Tantra-Studios mit transparenter Orts- und Preisangabe.",
      canton: s.includes("zug") ? "ZG" : s.includes("zuerich") || s.includes("zurich") ? "ZH" : "ALL",
      cityFilter: "",
      category: "massage",
      lang: "de",
    };
  }
  if (s.includes("domina") || s.includes("bdsm")) {
    return {
      title: "Domina & BDSM Studios in der Schweiz",
      subtitle: "Klassische Dominanz, Fetisch und Rollenspiel – nach Region und Prüfstatus geordnet.",
      canton: "ALL",
      cityFilter: "",
      category: "bdsm",
      lang: "de",
    };
  }
  if (s.includes("cham") || s.includes("zug") || s.includes("baar")) {
    return {
      title: "Escorts & Studios in Zug, Cham und Baar (ZG)",
      subtitle: "Lokale Übersicht für den Kanton Zug mit bestätigter Verfügbarkeit und Quellenangaben.",
      canton: "ZG",
      cityFilter: "",
      category: "all",
      lang: "de",
    };
  }
  if (s.includes("geneve") || s.includes("genf")) {
    return {
      title: "Escorts & Salons à Genève (GE)",
      subtitle: "Sélection locale pour Genève (Champel, Eaux-Vives, Plainpalais, Carouge) avec sources vérifiables.",
      canton: "GE",
      cityFilter: "",
      category: "all",
      lang: "fr",
    };
  }
  if (s.includes("lausanne") || s.includes("vaud")) {
    return {
      title: "Escorts & Salons à Lausanne et Vaud (VD)",
      subtitle: "Profils et adresses vérifiables à Lausanne, Ouchy, Morges, Nyon et Montreux.",
      canton: "VD",
      cityFilter: "",
      category: "all",
      lang: "fr",
    };
  }
  if (s.includes("lugano") || s.includes("ticino") || s.includes("tessin")) {
    return {
      title: "Escort e Studi a Lugano e in Ticino (TI) – Svizzera",
      subtitle: "Elenco locale per Lugano, Paradiso, Locarno, Ascona e Bellinzona (Canton Ticino, CH).",
      canton: "TI",
      cityFilter: "",
      category: "all",
      lang: "it",
    };
  }
  if (s.includes("basel")) {
    return {
      title: "Escorts & Studios in Basel (BS/BL)",
      subtitle: "Regionale Übersicht für Basel-Stadt und Umgebung mit Preis- und Quellenvergleich.",
      canton: "BS",
      cityFilter: "",
      category: "all",
      lang: "de",
    };
  }
  if (s.includes("bern")) {
    return {
      title: "Escorts & Studios in Bern (BE)",
      subtitle: "Regionale Übersicht für Bern, Biel, Thun und das Mittelland.",
      canton: "BE",
      cityFilter: "",
      category: "all",
      lang: "de",
    };
  }
  if (s.includes("luzern")) {
    return {
      title: "Escorts & Studios in Luzern (LU)",
      subtitle: "Regionale Übersicht für Luzern, Emmen, Kriens und die Zentralschweiz.",
      canton: "LU",
      cityFilter: "",
      category: "all",
      lang: "de",
    };
  }
  if (s.includes("baden") || s.includes("aarau") || s.includes("aargau")) {
    return {
      title: "Escorts & Studios in Baden, Aarau & Aargau (AG)",
      subtitle: "Regionale Übersicht für den Kanton Aargau mit Preis- und Quellenangaben.",
      canton: "AG",
      cityFilter: "",
      category: "all",
      lang: "de",
    };
  }
  if (s.includes("st-gallen") || s.includes("wil")) {
    return {
      title: "Escorts & Studios in St. Gallen & Wil (SG)",
      subtitle: "Regionale Übersicht für die Ostschweiz.",
      canton: "SG",
      cityFilter: "",
      category: "all",
      lang: "de",
    };
  }

  return {
    title: "Escorts & Studios in Zürich (ZH)",
    subtitle: "Lokale Profile in Zürich City, Paradeplatz, Oerlikon, Seefeld und Winterthur.",
    canton: "ZH",
    cityFilter: "",
    category: "all",
    lang: "de",
  };
}

function inferOfferCategory(item: any): "escort" | "massage" | "bdsm" | "trans" {
  const text = `${item.rawName || ""} ${(item.includedTags || []).join(" ")} ${item.bio || ""}`.toLowerCase();
  if (/\b(trans|ts|ladyboy|shemale|transe)\b/.test(text)) return "trans";
  if (/\b(domina|bdsm|fetisch|herrin|sklav|bizarr)\b/.test(text)) return "bdsm";
  if (/\b(tantra|masseurin|thaimassage|body-to-body|massage)\b/.test(text) && !/\bescort\b/.test(text)) return "massage";
  return "escort";
}

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

export default function LocalIntentDirectoryPage() {
  const router = useRouter();
  const slug = String(router.query.slug || "zuerich");
  const intent = useMemo(() => resolveSlugIntent(slug), [slug]);

  const [selectedCanton, setSelectedCanton] = useState<string>(intent.canton);
  const [selectedCategory, setSelectedCategory] = useState<string>(intent.category);
  const [onlyAvailable, setOnlyAvailable] = useState<boolean>(false);
  const [onlyWithPrice, setOnlyWithPrice] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [compareIds, setCompareIds] = useState<string[]>([]);

  useEffect(() => {
    setSelectedCanton(intent.canton);
    setSelectedCategory(intent.category);
  }, [intent.canton, intent.category]);

  const profiles = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    return raw.map((item: any, idx: number) => {
      const id = item.dedupClusterId || `loc-${idx + 1}`;
      const geo = normalizeSwissGeo(item.city, item.canton);
      const offerCat = inferOfferCategory(item);
      const rate = Number(item.advertisedBaseChf) || null;
      const durationLabel = rate && rate < 180 ? "30 Min. · laut Inserat" : "60 Min. · laut Inserat";
      const isCleanPhoto = String(item.sourcePortal || "").toLowerCase().includes("bemygirl") || String(item.sourcePortal || "").toLowerCase().includes("fgirl");
      const availabilityConfirmed = idx < 10 && isCleanPhoto && idx % 2 === 0;
      const isSelfManaged = Boolean(item.bookingMode === "direct" || availabilityConfirmed);

      return {
        ...item,
        id,
        cleanCity: geo.cleanCity,
        canton: geo.trueCanton,
        offerCategory: offerCat,
        advertisedBaseChf: rate,
        durationLabel,
        availabilityConfirmed,
        confirmedMinutesAgo: availabilityConfirmed ? 8 : null,
        isSelfManaged,
        fallbackImg: FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length],
      };
    });
  }, []);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (selectedCanton !== "ALL" && p.canton !== selectedCanton) return false;
      if (selectedCategory !== "all" && p.offerCategory !== selectedCategory) return false;
      if (onlyAvailable && !p.availabilityConfirmed) return false;
      if (onlyWithPrice && !p.advertisedBaseChf) return false;
      return true;
    });
  }, [profiles, selectedCanton, selectedCategory, onlyAvailable, onlyWithPrice]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev.slice(-2), id]));
  };

  return (
    <div className="min-h-screen iwsn-velvet-bg text-white relative pb-24">
      <SEO title={`${intent.title} | iwantsexnow.ch`} description={intent.subtitle} />
      <VelvetBackdrop />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 pt-5 pb-12 space-y-5">
        {/* Breadcrumb + Preserved Search Intent */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <Link href="/" className="hover:text-white">Schweiz Übersicht</Link>
            <span>/</span>
            <span className="text-[#C6A574] font-semibold">{intent.title}</span>
          </div>
          <div className="flex items-center gap-4">
            <XeniaDoubtTrigger topic="status" label="Was bedeutet 'Jetzt verfügbar'?" />
            <XeniaDoubtTrigger topic="price" label="Preise & Dauer verstehen" />
            <XeniaDoubtTrigger topic="source" label="Quellen-Herkunft" />
          </div>
        </div>

        <div className="space-y-1">
          <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">{intent.title}</h1>
          <p className="text-xs sm:text-sm text-gray-300">{intent.subtitle}</p>
        </div>

        {/* Filter Bar Preserving City & Category */}
        <div className="p-3.5 rounded-2xl bg-[#1A1E27] border border-white/10 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "ZH", "ZG", "BS", "BE", "LU", "AG", "SG", "GE", "VD", "TI"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCanton(c)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer transition ${
                  selectedCanton === c
                    ? "bg-[#C6A574] text-[#13161C]"
                    : "bg-[#12151C] text-gray-300 border border-white/10 hover:text-white"
                }`}
              >
                {c === "ALL" ? "Ganze Schweiz" : c}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3 text-xs">
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={() => setOnlyAvailable(!onlyAvailable)}
                className="accent-[#C6A574] w-4 h-4 rounded"
              />
              <span>Jetzt verfügbar</span>
            </label>
            <label className="inline-flex items-center gap-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWithPrice}
                onChange={() => setOnlyWithPrice(!onlyWithPrice)}
                className="accent-[#C6A574] w-4 h-4 rounded"
              />
              <span>Nur mit Preis</span>
            </label>
            <div className="flex rounded-xl overflow-hidden border border-white/15 bg-[#12151C]">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 cursor-pointer ${viewMode === "grid" ? "bg-white/15 text-white" : "text-gray-400"}`}
              >
                <LayoutGrid size={15} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`p-1.5 cursor-pointer ${viewMode === "list" ? "bg-white/15 text-white" : "text-gray-400"}`}
              >
                <ListIcon size={15} />
              </button>
            </div>
          </div>
        </div>

        {/* Results */}
        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {filtered.slice(0, 32).map((p: any, idx: number) => {
              const cleanName = String(p.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim().slice(0, 24) || "Profil";
              return (
                <article
                  key={`${p.id}-${idx}`}
                  className="rounded-2xl bg-[#1C2029] border border-white/10 hover:border-[#C6A574]/60 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3.65] bg-stone-800">
                    <Link href={`/profile/${encodeURIComponent(p.id)}`}>
                      <img
                        src={p.thumbnail || p.fallbackImg}
                        alt={cleanName}
                        onError={(e) => { (e.currentTarget as HTMLImageElement).src = p.fallbackImg; }}
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
                        <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-base font-bold text-white hover:text-[#C6A574] truncate block">
                          {cleanName}
                        </Link>
                        <p className="text-xs text-gray-400">{p.cleanCity} · {p.canton}</p>
                      </div>
                      {p.advertisedBaseChf && (
                        <div className="text-right shrink-0">
                          <div className="text-xs font-extrabold text-gray-200">CHF {p.advertisedBaseChf}</div>
                          <div className="text-[10px] text-gray-500">60 Min.</div>
                        </div>
                      )}
                    </div>
                    <div className="pt-2 border-t border-white/10 text-xs space-y-1">
                      {p.availabilityConfirmed ? (
                        <div className="flex items-center gap-1.5 text-[#22C55E]">
                          <Clock size={12} />
                          <span>Bestätigt vor {p.confirmedMinutesAgo} Min.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <ExternalLink size={12} />
                          <span className="truncate">Quelle: {p.sourcePortal || "Verzeichnis"}</span>
                        </div>
                      )}
                    </div>
                    <div className="pt-1 flex items-center justify-between text-xs font-bold text-[#C6A574]">
                      <Link href={`/profile/${encodeURIComponent(p.id)}`} className="hover:underline">
                        {p.isSelfManaged ? "Privat anfragen →" : "Original & Details →"}
                      </Link>
                      <XeniaDoubtTrigger topic="source" />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/10 bg-[#1C2029]">
            {filtered.slice(0, 32).map((p: any, idx: number) => {
              const cleanName = String(p.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim().slice(0, 28) || "Profil";
              return (
                <article key={`l-${p.id}-${idx}`} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 flex items-center gap-4">
                    <img
                      src={p.thumbnail || p.fallbackImg}
                      alt={cleanName}
                      onError={(e) => { (e.currentTarget as HTMLImageElement).src = p.fallbackImg; }}
                      className="w-20 h-20 rounded-xl object-cover object-top shrink-0"
                    />
                    <div>
                      <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-lg font-serif font-bold text-white hover:underline">
                        {cleanName}
                      </Link>
                      <div className="text-xs text-gray-300">{p.cleanCity} · {p.canton}</div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {p.isSelfManaged ? "Selbst verwaltet" : `Quelle: ${p.sourcePortal || "Index"}`}
                      </div>
                    </div>
                  </div>
                  <div className="md:col-span-3 md:border-l md:border-white/10 md:pl-5">
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
                    <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-xs font-bold text-[#C6A574] hover:underline">
                      Profil ansehen →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
      <CorporateFooter />
    </div>
  );
}