import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { Check, Bookmark, ArrowRight, X } from "lucide-react";

const FALLBACK_PORTRAITS = [
  "/profile-placeholder.svg",
  "/profile-placeholder.svg",
  "/profile-placeholder.svg",
  "/profile-placeholder.svg",
];

export default function CompareEscortsPage() {
  const [selectedCanton, setSelectedCanton] = useState("ALL");
  const [onlyWithPrice, setOnlyWithPrice] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const profiles = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    return raw.slice(0, 60).map((item: any, idx: number) => {
      const id = item.id;
      const geo = normalizeSwissGeo(item.city, item.canton);
      const rate = Number(item.advertisedBaseChf) || null;
      const durationLabel = rate && rate < 180 ? "30 Min. · laut Inserat" : "60 Min. · laut Inserat";
      const cleanName =
        String(item.rawName || "Profil")
          .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
          .trim()
          .slice(0, 26) || "Profil";
      return {
        ...item,
        id,
        cleanName,
        cleanCity: geo.cleanCity,
        canton: geo.trueCanton,
        rate,
        durationLabel,
        fallbackImg: FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length],
      };
    });
  }, []);

  const filtered = useMemo(() => {
    return profiles.filter((p) => {
      if (selectedCanton !== "ALL" && p.canton !== selectedCanton) return false;
      if (onlyWithPrice && !p.rate) return false;
      return true;
    });
  }, [profiles, selectedCanton, onlyWithPrice]);

  const toggleCompare = (id: string) => {
    setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev.slice(-2), id]));
  };

  const comparedList = useMemo(() => {
    return profiles.filter((p) => compareIds.includes(p.id));
  }, [profiles, compareIds]);

  return (
    <div className="min-h-screen bg-[#F7F4EE] text-[#181614] pb-28">
      <SEO
        title="Profile vergleichen – Quellen, Preise & Dauer gegenüberstellen | iwantsexnow.ch"
        description="Vergleiche Schweizer Profile nach Ort, veröffentlichtem Preis (60 Min. vs. 30 Min.) und Herkunft."
      />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-8 space-y-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#181614]">
            Profile vergleichen
          </h1>
          <p className="text-sm sm:text-base text-[#5C554B] mt-1">
            Quellen, Preise und Angaben übersichtlich gegenüberstellen.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#E6DFD3]">
          <div className="flex flex-wrap gap-1.5">
            {["ALL", "ZH", "ZG", "BS", "BE", "LU", "AG", "SG", "GE", "VD", "TI"].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCanton(c)}
                className={
                  selectedCanton === c
                    ? "px-3 py-1.5 rounded-lg text-xs font-bold bg-[#9E7B47] text-white cursor-pointer"
                    : "px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#F3EFE8] text-[#3D372E] cursor-pointer"
                }
              >
                {c === "ALL" ? "Alle Orte" : c}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-[#3D372E] cursor-pointer">
            <input
              type="checkbox"
              checked={onlyWithPrice}
              onChange={() => setOnlyWithPrice(!onlyWithPrice)}
              className="accent-[#9E7B47] w-4 h-4 rounded"
            />
            <span>Nur mit Preisangabe</span>
          </label>
        </div>

        <div className="bg-white rounded-2xl border border-[#E6DFD3] shadow-sm divide-y divide-[#E6DFD3] overflow-hidden">
          {filtered.slice(0, 30).map((p) => {
            const isCompared = compareIds.includes(p.id);
            return (
              <article
                key={p.id}
                className={
                  isCompared
                    ? "p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-[#F6F0E4]"
                    : "p-4 sm:p-5 grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-white hover:bg-[#FAF7F2]"
                }
              >
                <div className="md:col-span-6 flex items-center gap-4">
                  <img
                    src={p.thumbnail || p.fallbackImg}
                    alt={p.cleanName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = p.fallbackImg;
                    }}
                    className="w-20 h-20 rounded-xl object-cover object-top shrink-0 border border-[#C6A574]/40"
                  />
                  <div>
                    <Link href={"/profile/" + encodeURIComponent(p.id)} className="text-lg font-serif font-bold hover:underline">
                      {p.cleanName}
                    </Link>
                    <div className="text-xs text-[#5C554B]">{p.cleanCity} · {p.canton}</div>
                    <div className="text-xs text-[#8A642B] mt-0.5">
                      Quelle: {p.sourcePortal || "Verzeichnis"}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-3 md:border-l md:border-[#E6DFD3] md:pl-6">
                  {p.rate ? (
                    <>
                      <div className="text-base font-extrabold">CHF {p.rate}</div>
                      <div className="text-xs text-[#6E665B]">{p.durationLabel}</div>
                    </>
                  ) : (
                    <div className="text-sm font-extrabold text-[#6E665B]">Keine Preisangabe</div>
                  )}
                </div>

                <div className="md:col-span-3 flex sm:flex-col items-end justify-between md:justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => toggleCompare(p.id)}
                    className="inline-flex items-center gap-2 text-xs font-semibold cursor-pointer"
                  >
                    <span
                      className={
                        isCompared
                          ? "w-5 h-5 rounded flex items-center justify-center bg-[#9E7B47] text-white"
                          : "w-5 h-5 rounded border border-[#9C9283] bg-white"
                      }
                    >
                      {isCompared && <Check size={13} strokeWidth={3} />}
                    </span>
                    <span>Vergleichen</span>
                  </button>

                  <Link href={"/profile/" + encodeURIComponent(p.id)} className="text-xs font-bold text-[#7A5824] hover:underline inline-flex items-center gap-1">
                    <Bookmark size={13} />
                    <span>Profil ansehen →</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <CorporateFooter light />

      {comparedList.length > 0 && (
        <div className="fixed bottom-16 md:bottom-4 inset-x-0 px-4 z-50">
          <div className="max-w-4xl mx-auto p-3.5 rounded-2xl bg-[#14171F]/95 backdrop-blur-xl border border-[#C6A574]/60 shadow-2xl flex flex-wrap items-center justify-between gap-3 text-white">
            <div className="flex flex-wrap items-center gap-2 text-xs sm:text-sm">
              <strong className="pr-2.5 border-r border-white/15 font-serif text-base">
                {comparedList.length} ausgewählt
              </strong>
              {comparedList.map((cp) => (
                <span key={cp.id} className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-white/10 border border-white/15 text-xs">
                  <span>{cp.cleanName}</span>
                  <button onClick={() => toggleCompare(cp.id)} className="text-gray-400 hover:text-white cursor-pointer">✕</button>
                </span>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-[#C6A574] text-[#14171F] font-bold text-xs inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Auswahl vergleichen</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[80] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 text-white">
          <div className="max-w-4xl w-full rounded-2xl bg-[#1C2029] border border-[#C6A574] p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-serif font-bold">Ausgewählte Profile im direkten Vergleich</h3>
              <button onClick={() => setModalOpen(false)} className="p-1.5 rounded-lg bg-white/10"><X size={16} /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              {comparedList.map((cp) => (
                <div key={cp.id} className="p-4 rounded-xl bg-[#13161C] border border-white/10 space-y-2.5">
                  <img
                    src={cp.thumbnail || cp.fallbackImg}
                    alt={cp.cleanName}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = cp.fallbackImg; }}
                    className="w-full h-44 object-cover object-top rounded-lg"
                  />
                  <div className="text-base font-serif font-bold">{cp.cleanName}</div>
                  <div>• <strong>Ort:</strong> {cp.cleanCity} · {cp.canton}</div>
                  <div>• <strong>Preis:</strong> {cp.rate ? "CHF " + cp.rate + " (" + cp.durationLabel + ")" : "Keine Preisangabe"}</div>
                  <div>• <strong>Quelle:</strong> {cp.sourcePortal || "Verzeichnis"}</div>
                  <Link href={"/profile/" + encodeURIComponent(cp.id)} className="w-full py-2 rounded-lg bg-[#C6A574] text-[#13161C] font-bold text-center block">
                    Profil öffnen →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
