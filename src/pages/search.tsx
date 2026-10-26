import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { CorporateFooter } from "@/components/CorporateFooter";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { XeniaDoubtTrigger } from "@/components/XeniaContextualHelp";
import {
  Search,
  Clock,
  User,
  ExternalLink,
  HelpCircle,
  Bookmark,
  LayoutGrid,
  List as ListIcon,
  RotateCcw,
  ArrowRight,
  Check,
} from "lucide-react";

const FALLBACK_IMG = "/profile-placeholder.svg";

export default function HarmonizedSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [canton, setCanton] = useState("ALL");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyManaged, setOnlyManaged] = useState(false);
  const [onlyWithPrice, setOnlyWithPrice] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [searchError, setSearchError] = useState(false);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.q) setQuery(String(router.query.q));
    if (router.query.canton) setCanton(String(router.query.canton).toUpperCase());
  }, [router.isReady, router.query]);

  useEffect(() => {
    setLoading(true);
    setSearchError(false);
    const controller = new AbortController();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (canton !== "ALL") params.set("canton", canton);
    if (onlyAvailable) params.set("available", "true");
    if (onlyManaged) params.set("managed", "true");
    if (onlyWithPrice) params.set("withPrice", "true");
    params.set("page", String(page));
    params.set("limit", "48");

    fetch("/api/vault/search?" + params.toString(), { signal: controller.signal })
      .then((r) => { if (!r.ok) throw new Error("SEARCH_FAILED"); return r.json(); })
      .then((d) => {
        if (d && d.status === "ok") {
          const normalized = (Array.isArray(d.results) ? d.results : []).map((item: any, idx: number) => {
            const geo = normalizeSwissGeo(item.city, item.canton);
            const rate = Number(item.advertisedBaseChf) || null;
            const durationLabel = rate && rate < 180 ? "30 Min. · laut Inserat" : "60 Min. · laut Inserat";
            return {
              ...item,
              cleanCity: geo.cleanCity,
              canton: geo.trueCanton,
              advertisedBaseChf: rate,
              durationLabel,
              confirmedMinutesAgo: null,
            };
          });
          setResults(
            onlyWithPrice ? normalized.filter((x: any) => Boolean(x.advertisedBaseChf)) : normalized
          );
          setTotalMatches(Number(d.totalMatches) || 0);
        }
      })
      .catch(() => { if (!controller.signal.aborted) { setSearchError(true); setResults([]); } })
      .finally(() => { if (!controller.signal.aborted) setLoading(false); });
    return () => controller.abort();
  }, [query, canton, onlyAvailable, onlyManaged, onlyWithPrice, page]);

  const resetAll = () => {
    setQuery("");
    setCanton("ALL");
    setOnlyAvailable(false);
    setOnlyManaged(false);
    setOnlyWithPrice(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title="Profile durchsuchen & gezielt filtern | iwantsexnow.ch"
        description="Durchsuchen Sie Schweizer Profile nach Ort, Kategorie, bestätigter Verfügbarkeit und veröffentlichten Preisangaben."
      />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-7 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Erweiterte Profilsuche ({totalMatches.toLocaleString("de-CH")} Ergebnisse)
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Filtere nach Kanton, Stichwort, bestätigter Verfügbarkeit oder Preisangabe.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <XeniaDoubtTrigger topic="status" label="Status-Hilfe" />
            <XeniaDoubtTrigger topic="price" label="Preis-Hilfe" />
            <XeniaDoubtTrigger topic="source" label="Quellen-Hilfe" />
          </div>
        </div>

        {searchError && <p role="alert">Suche vorübergehend nicht verfügbar. Bitte erneut versuchen.</p>}
        {!loading && !searchError && results.length === 0 && <p role="status">Noch keine zur Veröffentlichung freigegebenen Einträge.</p>}
        {/* Unified Search Toolbar */}
        <div className="p-4 rounded-2xl bg-[#1A1E27] border border-white/10 space-y-3.5 shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 flex items-center bg-[#12151C] border border-white/15 rounded-xl px-3.5">
              <Search size={16} className="text-[#C6A574] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Name, Stadt, Kategorie (z.B. Massage, GFE) oder +41 Nummer..."
                className="w-full py-2.5 px-2.5 bg-transparent text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-3">
              <select
                value={canton}
                onChange={(e) => {
                  setCanton(e.target.value);
                  setPage(1);
                }}
                className="w-full h-full px-3.5 py-2.5 rounded-xl bg-[#12151C] border border-white/15 text-xs sm:text-sm font-semibold text-white"
              >
                <option value="ALL">Ganze Schweiz (Alle Kantone)</option>
                {["ZH", "ZG", "BS", "BE", "LU", "AG", "SG", "GE", "VD", "TI", "SZ", "SO", "TG"].map((c) => (
                  <option key={c} value={c}>
                    Kanton {c}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-3 flex items-center justify-end gap-2">
              {(query || canton !== "ALL" || onlyAvailable || onlyManaged || onlyWithPrice) && (
                <button
                  type="button"
                  onClick={resetAll}
                  className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Zurücksetzen</span>
                </button>
              )}
              <div className="flex rounded-xl overflow-hidden border border-white/15 bg-[#12151C]">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={viewMode === "grid" ? "p-2.5 bg-white/15 text-white cursor-pointer" : "p-2.5 text-gray-400 cursor-pointer"}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  className={viewMode === "list" ? "p-2.5 bg-white/15 text-white cursor-pointer" : "p-2.5 text-gray-400 cursor-pointer"}
                >
                  <ListIcon size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-gray-200">
            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyAvailable}
                onChange={() => {
                  setOnlyAvailable(!onlyAvailable);
                  setPage(1);
                }}
                className="accent-[#C6A574] w-4 h-4 rounded"
              />
              <span>Jetzt verfügbar (aktiv bestätigt)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyManaged}
                onChange={() => {
                  setOnlyManaged(!onlyManaged);
                  setPage(1);
                }}
                className="accent-[#C6A574] w-4 h-4 rounded"
              />
              <span>Direkt anfragbar (selbst verwaltet)</span>
            </label>

            <label className="inline-flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyWithPrice}
                onChange={() => setOnlyWithPrice(!onlyWithPrice)}
                className="accent-[#C6A574] w-4 h-4 rounded"
              />
              <span>Nur mit veröffentlichter Preisangabe</span>
            </label>
          </div>
        </div>

        {/* Results */}
        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">Lade passende Schweizer Profile...</div>
        ) : results.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#1C2029] border border-white/10 text-center space-y-3">
            <h2 className="text-lg font-bold">Keine Profile für diese Filterauswahl</h2>
            <button
              onClick={resetAll}
              className="px-5 py-2.5 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {results.map((p: any, idx: number) => {
              const cleanName =
                String(p.rawName || "Profil")
                  .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
                  .trim()
                  .slice(0, 24) || "Profil";
              return (
                <article
                  key={p.id + "-" + idx}
                  className="rounded-2xl bg-[#1C2029] border border-white/10 hover:border-[#C6A574]/60 overflow-hidden flex flex-col justify-between"
                >
                  <div className="relative aspect-[4/3.65] bg-stone-800">
                    <Link href={"/profile/" + encodeURIComponent(p.id)}>
                      <img
                        src={p.thumbnail || FALLBACK_IMG}
                        alt={cleanName}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
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

                  <div className="p-3.5 space-y-2.5">
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

                    <div className="pt-2 border-t border-white/10 space-y-1 text-xs">
                      {p.availabilityConfirmed ? (
                        <div className="flex items-center gap-1.5 text-[#22C55E]">
                          <Clock size={12} />
                          <span>Bestätigt vor {p.confirmedMinutesAgo || 6} Min.</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-gray-400">
                          <ExternalLink size={12} />
                          <span className="truncate">Externe Quelle · {p.sourcePortal || "Index"}</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-0.5 flex items-center justify-between text-xs font-bold text-[#C6A574]">
                      <Link href={"/profile/" + encodeURIComponent(p.id)} className="hover:underline inline-flex items-center gap-1">
                        <span>{p.isSelfManaged ? "Privat anfragen" : "Original & Details"}</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl overflow-hidden border border-white/10 divide-y divide-white/10 bg-[#1C2029]">
            {results.map((p: any, idx: number) => {
              const cleanName =
                String(p.rawName || "Profil")
                  .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
                  .trim()
                  .slice(0, 28) || "Profil";
              return (
                <article key={"sl-" + idx} className="p-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  <div className="md:col-span-6 flex items-center gap-4">
                    <img
                      src={p.thumbnail || FALLBACK_IMG}
                      alt={cleanName}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                      }}
                      className="w-20 h-20 rounded-xl object-cover object-top shrink-0"
                    />
                    <div>
                      <Link href={"/profile/" + encodeURIComponent(p.id)} className="text-lg font-serif font-bold text-white hover:underline">
                        {cleanName}
                      </Link>
                      <div className="text-xs text-gray-300">
                        {p.cleanCity} · {p.canton}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {p.isSelfManaged ? "Selbst verwaltet" : "Quelle: " + (p.sourcePortal || "Index")}
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
                    <Link href={"/profile/" + encodeURIComponent(p.id)} className="text-xs font-bold text-[#C6A574] hover:underline">
                      Profil ansehen →
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {totalMatches > 48 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-xl bg-[#1C2029] border border-white/15 text-xs disabled:opacity-40 cursor-pointer"
            >
              ← Vorherige Seite
            </button>
            <span className="text-xs text-gray-400">Seite {page}</span>
            <button
              disabled={page * 48 >= totalMatches}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs disabled:opacity-40 cursor-pointer"
            >
              Nächste Seite →
            </button>
          </div>
        )}
      </main>
      <CorporateFooter />
    </div>
  );
}
