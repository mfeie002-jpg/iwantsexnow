import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { Search, MapPin, Check, RotateCcw } from "lucide-react";

const FALLBACK_IMG = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85";

export default function ConnectedSearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [canton, setCanton] = useState("ALL");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [onlyManaged, setOnlyManaged] = useState(false);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[]>([]);
  const [totalMatches, setTotalMatches] = useState(0);
  const [totalVault, setTotalVault] = useState(7021);

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.q) setQuery(String(router.query.q));
    if (router.query.canton) setCanton(String(router.query.canton).toUpperCase());
  }, [router.isReady, router.query]);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (canton !== "ALL") params.set("canton", canton);
    if (onlyAvailable) params.set("available", "true");
    if (onlyManaged) params.set("managed", "true");
    params.set("page", String(page));
    params.set("limit", "48");

    fetch(`/api/vault/search?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.status === "ok") {
          setResults(Array.isArray(d.results) ? d.results : []);
          setTotalMatches(Number(d.totalMatches) || 0);
          if (d.totalVaultSize) setTotalVault(Number(d.totalVaultSize));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [query, canton, onlyAvailable, onlyManaged, page]);

  const resetAll = () => {
    setQuery("");
    setCanton("ALL");
    setOnlyAvailable(false);
    setOnlyManaged(false);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-white pb-20">
      <SEO
        title="Suche & Filter über den Schweizer Profil-Index | iwantsexnow.ch"
        description="Durchsuchen Sie Schweizer Anbieterprofile und externe Quelleneinträge nach Kanton, Kategorie und Prüfstatus."
      />
      <LuxuryHeader />

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-6">
        <div className="p-6 rounded-2xl bg-[#11131C] border border-white/10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h1 className="text-2xl sm:text-3xl font-serif font-bold">
              Erweiterte Suche ({totalMatches.toLocaleString("de-CH")} Treffer aus {totalVault.toLocaleString("de-CH")} Einträgen)
            </h1>
            {(query || canton !== "ALL" || onlyAvailable || onlyManaged) && (
              <button
                type="button"
                onClick={resetAll}
                className="px-3.5 py-1.5 rounded-lg bg-white/10 hover:bg-white/15 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw size={13} />
                <span>Alle Filter zurücksetzen</span>
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
            <div className="md:col-span-6 flex items-center bg-[#090A0F] border border-white/15 rounded-xl px-3.5">
              <Search size={16} className="text-[#C8A97E] shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setPage(1);
                }}
                placeholder="Name, Stadt, Kategorie (z.B. GFE, Massage) oder +41 Nummer..."
                className="w-full py-2.5 px-2.5 bg-transparent text-xs sm:text-sm text-white focus:outline-none"
              />
            </div>

            <div className="md:col-span-2">
              <select
                value={canton}
                onChange={(e) => {
                  setCanton(e.target.value);
                  setPage(1);
                }}
                className="w-full h-full px-3 py-2.5 rounded-xl bg-[#090A0F] border border-white/15 text-xs text-white"
              >
                <option value="ALL">🇨🇭 Alle Kantone</option>
                {["ZH", "ZG", "BS", "BE", "LU", "AG", "SG", "GE", "VD", "TI", "SZ", "SO", "TG"].map((c) => (
                  <option key={c} value={c}>Kanton {c}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => {
                  setOnlyAvailable(!onlyAvailable);
                  setPage(1);
                }}
                className={`w-full h-full py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                  onlyAvailable
                    ? "bg-emerald-500 text-black border-emerald-400 font-bold"
                    : "bg-[#090A0F] border-white/15 text-gray-300"
                }`}
              >
                Verfügbarkeit bestätigt
              </button>
            </div>

            <div className="md:col-span-2">
              <button
                type="button"
                onClick={() => {
                  setOnlyManaged(!onlyManaged);
                  setPage(1);
                }}
                className={`w-full h-full py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer ${
                  onlyManaged
                    ? "bg-[#C8A97E] text-[#090A0F] border-[#C8A97E] font-bold"
                    : "bg-[#090A0F] border-white/15 text-gray-300"
                }`}
              >
                Selbst verwaltet
              </button>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center text-sm text-gray-400">Durchsuche Schweizer Datenbank...</div>
        ) : results.length === 0 ? (
          <div className="p-10 rounded-2xl bg-[#11131C] border border-white/10 text-center space-y-3">
            <h2 className="text-lg font-serif font-bold">Keine passenden Einträge für diese Auswahl</h2>
            <p className="text-xs text-gray-400">
               lockern Sie einzelne Filter oder setzen Sie die Auswahl zurück.
            </p>
            <button
              onClick={resetAll}
              className="px-5 py-2.5 rounded-xl bg-[#C8A97E] text-[#090A0F] font-bold text-xs cursor-pointer"
            >
              Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {results.map((p: any, idx: number) => {
              const cleanName = String(p.rawName || "Profil").slice(0, 26);
              const city = String(p.city || "Zürich").split("/")[0].trim();
              const img = p.thumbnail || FALLBACK_IMG;

              return (
                <article
                  key={`${p.id}-${idx}`}
                  className="rounded-xl overflow-hidden bg-[#11131C] border border-white/10 hover:border-white/25 transition flex flex-col justify-between"
                >
                  <div className="relative aspect-[3/4] bg-black">
                    <Link href={`/profile/${encodeURIComponent(p.id)}`}>
                      <img
                        src={img}
                        alt={cleanName}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = FALLBACK_IMG;
                        }}
                        className="w-full h-full object-cover object-top"
                        loading="lazy"
                      />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-black/25 pointer-events-none" />
                    <div className="absolute top-2.5 left-2.5">
                      {p.availabilityConfirmed ? (
                        <span className="px-2 py-0.5 rounded bg-black/85 border border-emerald-500/50 text-emerald-300 text-[10px] font-semibold">
                          ● Verfügbarkeit bestätigt
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-black/80 text-gray-300 text-[10px] border border-white/10">
                          Quelle: {p.sourcePortal || "Extern"}
                        </span>
                      )}
                    </div>
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between">
                      <div className="min-w-0">
                        <h2 className="text-sm font-serif font-bold text-white truncate">{cleanName}</h2>
                        <p className="text-[11px] text-gray-300 flex items-center gap-1 truncate">
                          <MapPin size={11} className="text-[#C8A97E]" /> {city} ({p.canton})
                        </p>
                      </div>
                      <div className="bg-black/85 px-2 py-1 rounded border border-white/15 text-xs font-bold text-[#C8A97E]">
                        CHF {p.advertisedBaseChf || 400}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 flex items-center justify-between text-[10px] text-gray-400">
                    <Link href={`/profile/${encodeURIComponent(p.id)}`} className="text-white font-semibold hover:text-[#C8A97E]">
                      Details & Quelle →
                    </Link>
                    <Link href={`/report?id=${encodeURIComponent(p.id)}&name=${encodeURIComponent(cleanName)}`} className="hover:text-gray-200">
                      Melden
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {totalMatches > 48 && (
          <div className="flex items-center justify-center gap-3 pt-4">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-4 py-2 rounded-lg bg-[#11131C] border border-white/15 text-xs disabled:opacity-40 cursor-pointer"
            >
              ← Vorherige Seite
            </button>
            <span className="text-xs text-gray-400">Seite {page}</span>
            <button
              disabled={page * 48 >= totalMatches}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs disabled:opacity-40 cursor-pointer"
            >
              Nächste Seite →
            </button>
          </div>
        )}
      </main>
    </div>
  );
}