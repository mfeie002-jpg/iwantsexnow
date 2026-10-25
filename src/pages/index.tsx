import React, { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { VisualDiscoveryHub } from "@/components/marketplace/VisualDiscoveryHub";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { Check, MapPin, Video, ArrowUpRight, ShieldAlert, ExternalLink } from "lucide-react";

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

export default function HomePage() {
  const [activeVisualId, setActiveVisualId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCanton, setActiveCanton] = useState<string>("ALL");
  const [onlyConfirmedAvailable, setOnlyConfirmedAvailable] = useState<boolean>(false);
  const [onlySelfManaged, setOnlySelfManaged] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(28);
  const [selectedIndexProfile, setSelectedIndexProfile] = useState<any>(null);
  const [serverData, setServerData] = useState<{ metrics: Record<string, any>; states: Record<string, any> }>({
    metrics: {},
    states: {},
  });

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d && d.ok) {
          setServerData({ metrics: d.metrics || {}, states: d.states || {} });
        }
      })
      .catch(() => {});
  }, []);

  const enrichedProfiles = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    return raw
      .map((item: any, idx: number) => {
        const id = item.dedupClusterId || `ch-${idx + 1}`;
        const st = serverData.states[id] || {};
        const mt = serverData.metrics[id] || { views: 0, detailOpens: 0, sourceClicks: 0 };

        // Echte Trennung: Nur explizit autorisierte/übernommene Profile gelten als selbst verwaltet
        const isSelfManaged = Boolean(st.claimed || item.bookingMode === "direct");
        const isIdentityVerified = Boolean(st.identityVerified);
        const availabilityConfirmed = Boolean(st.availabilityConfirmed);
        const isSponsored = Boolean(st.sponsored);

        return {
          ...item,
          id,
          hidden: Boolean(st.hidden),
          isSelfManaged,
          isIdentityVerified,
          availabilityConfirmed,
          isSponsored,
          realViews: mt.views || 0,
          realDetailOpens: mt.detailOpens || 0,
          fallbackImg: FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length],
        };
      })
      .filter((p: any) => !p.hidden);
  }, [serverData]);

  const filteredProfiles = useMemo(() => {
    return enrichedProfiles.filter((p: any) => {
      if (activeCanton !== "ALL" && String(p.canton || "").toUpperCase() !== activeCanton) {
        return false;
      }
      if (onlyConfirmedAvailable && !p.availabilityConfirmed) return false;
      if (onlySelfManaged && !p.isSelfManaged) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = `${p.rawName || ""} ${p.city || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enrichedProfiles, activeCanton, onlyConfirmedAvailable, onlySelfManaged, searchQuery]);

  const recordEvent = (profileId: string, action: string) => {
    fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, profileId }),
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#090A0F] text-white pb-20 lg:pb-10">
      <SEO
        title="iwantsexnow.ch | Schweizer Suche, Plattformvergleich & Anbieterprofile"
        description="Vergleiche Schweizer Plattformen, entdecke regionale Profile nach klaren Kriterien und verwalte dein eigenes Anbieterprofil kostenlos."
      />

      <LuxuryHeader />

      <VisualDiscoveryHub
        activeVisualId={activeVisualId}
        onSelectVisual={(id: string, tag: string) => {
          setActiveVisualId(id);
          setSearchQuery(tag);
        }}
        activeCanton={activeCanton}
        onSelectCanton={setActiveCanton}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onlyOnline={onlyConfirmedAvailable}
        onToggleOnline={() => setOnlyConfirmedAvailable(!onlyConfirmedAvailable)}
        onlyVerified={onlySelfManaged}
        onToggleVerified={() => setOnlySelfManaged(!onlySelfManaged)}
      />

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* Transparent Legend of Status Badges (As recommended in the audit) */}
        <div className="mb-5 p-3.5 rounded-xl bg-[#11131C] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs text-gray-300">
          <div className="flex flex-wrap items-center gap-4">
            <span className="font-bold text-white">Bedeutung der Kennzeichnungen:</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <strong>Verfügbarkeit bestätigt:</strong> Vom Anbieter selbst aktiv gesetzt
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Check size={13} className="text-[#C8A97E]" />
              <strong>Selbst verwaltet / Geprüft:</strong> Autorisiertes Anbieterkonto
            </span>
            <span className="inline-flex items-center gap-1.5 text-gray-400">
              <strong>Externe Quelle:</strong> Öffentlicher Index-Datensatz (Status auf Quellportal prüfen)
            </span>
          </div>
          <Link href="/report" className="text-[#C8A97E] hover:underline shrink-0">
            Profil oder Inhalt melden / Entfernen →
          </Link>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 mb-5">
          <div className="text-xs sm:text-sm text-gray-300">
            <strong className="text-white">{filteredProfiles.length} Einträge</strong> in{" "}
            {activeCanton === "ALL" ? "der ganzen Schweiz" : `Kanton ${activeCanton}`}
            {searchQuery && <span className="text-[#C8A97E]"> · Auswahl: „{searchQuery}“</span>}
          </div>
          {searchQuery || activeCanton !== "ALL" || onlyConfirmedAvailable || onlySelfManaged ? (
            <button
              type="button"
              onClick={() => {
                setActiveVisualId("all");
                setSearchQuery("");
                setActiveCanton("ALL");
                setOnlyConfirmedAvailable(false);
                setOnlySelfManaged(false);
              }}
              className="text-xs text-[#C8A97E] underline cursor-pointer"
            >
              Alle Filter zurücksetzen
            </button>
          ) : null}
        </div>

        {filteredProfiles.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#11131C] border border-white/10 text-center space-y-3">
            <h3 className="text-lg font-serif font-bold">Keine Einträge für diese Filterkombination</h3>
            <p className="text-xs text-gray-400">
              Setze einzelne Filter zurück oder wähle „Ganze Schweiz“, um alle verfügbaren Einträge zu sehen.
            </p>
            <button
              onClick={() => {
                setActiveVisualId("all");
                setSearchQuery("");
                setActiveCanton("ALL");
                setOnlyConfirmedAvailable(false);
                setOnlySelfManaged(false);
              }}
              className="px-5 py-2.5 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs"
            >
              Alle Filter zurücksetzen
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {filteredProfiles.slice(0, visibleCount).map((p: any, idx: number) => {
              const cleanName =
                String(p.rawName || "Eintrag")
                  .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
                  .trim()
                  .slice(0, 24) || "Profil";
              const city = String(p.city || "Zürich").split("/")[0].trim();
              const rate = p.advertisedBaseChf || null;
              const img = p.thumbnail || p.fallbackImg;

              return (
                <article
                  key={`${p.id}-${idx}`}
                  className={`group rounded-xl overflow-hidden bg-[#11131C] border transition-all duration-300 flex flex-col justify-between ${
                    p.isSponsored ? "border-[#C8A97E]/60" : "border-white/10 hover:border-white/25"
                  }`}
                >
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#07080C]">
                    <Link
                      href={`/profile/${encodeURIComponent(p.id)}`}
                      onClick={() => recordEvent(p.id, "track_click")}
                    >
                      <img
                        src={img}
                        alt={`${cleanName} – ${city}`}
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = p.fallbackImg;
                        }}
                        className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                        loading="lazy"
                      />
                    </Link>
                    <div className="absolute inset-0 bg-gradient-to-t from-[#090A0F] via-transparent to-black/25 pointer-events-none" />

                    {/* Top-Left: Maximum 1 clear activity/source indicator */}
                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
                      {p.availabilityConfirmed ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-black/85 border border-emerald-500/50 text-emerald-300 text-[10px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                          Verfügbarkeit bestätigt
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/80 text-gray-300 text-[10px] border border-white/10">
                          Quelle: {p.sourcePortal || "Extern"}
                        </span>
                      )}
                      {p.isSponsored && (
                        <span className="px-2 py-0.5 rounded bg-[#C8A97E] text-[#090A0F] text-[9px] font-bold uppercase w-fit">
                          Anzeige
                        </span>
                      )}
                    </div>

                    {/* Top-Right: Honest Management / Verification Status */}
                    <div className="absolute top-2.5 right-2.5">
                      {p.isIdentityVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 border border-[#C8A97E]/60 text-[#E5C99B] text-[10px] font-semibold">
                          <Check size={11} className="text-[#C8A97E]" /> Identität geprüft
                        </span>
                      ) : p.isSelfManaged ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-black/85 border border-sky-400/40 text-sky-200 text-[10px] font-semibold">
                          Selbst verwaltet
                        </span>
                      ) : null}
                    </div>

                    {/* Bottom Info */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-1">
                      <div className="min-w-0">
                        <h2 className="text-sm sm:text-base font-serif font-bold text-white truncate">
                          {cleanName}
                        </h2>
                        <p className="text-[11px] text-gray-300 flex items-center gap-1 truncate">
                          <MapPin size={11} className="text-[#C8A97E] shrink-0" />
                          <span>{city} ({p.canton || "CH"})</span>
                        </p>
                      </div>
                      {rate && (
                        <div className="shrink-0 bg-black/85 px-2 py-1 rounded border border-white/15 text-right">
                          <div className="text-[9px] text-gray-400 leading-none">Richtwert</div>
                          <div className="text-xs font-bold text-[#C8A97E]">CHF {rate}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-2.5 sm:p-3.5 flex-1 flex flex-col justify-between gap-2.5">
                    <div className="flex flex-wrap gap-1">
                      {(p.includedTags || ["Eintrag"]).slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded bg-white/5 text-[10px] text-gray-300 border border-white/5"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {p.isSelfManaged ? (
                      <Link
                        href={`/profile/${encodeURIComponent(p.id)}`}
                        onClick={() => recordEvent(p.id, "track_click")}
                        className="py-2 rounded-lg bg-[#C8A97E] hover:bg-[#d8b98e] text-[#090A0F] font-bold text-[11px] text-center transition block"
                      >
                        Direktprofil öffnen →
                      </Link>
                    ) : (
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            recordEvent(p.id, "track_click");
                            setSelectedIndexProfile(p);
                          }}
                          className="w-full py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 font-semibold text-[11px] transition border border-white/10 cursor-pointer"
                        >
                          Quellenangabe & Details
                        </button>
                        <div className="flex items-center justify-between text-[9px] text-gray-500 px-0.5">
                          <Link
                            href={`/create-post?claim=${encodeURIComponent(cleanName)}`}
                            className="text-[#C8A97E] hover:underline"
                          >
                            Mein Eintrag? Verwalten
                          </Link>
                          <Link
                            href={`/report?name=${encodeURIComponent(cleanName)}&id=${encodeURIComponent(p.id)}`}
                            className="hover:text-gray-300"
                          >
                            Melden / Entfernen
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Transparent Source & Claim Modal */}
      {selectedIndexProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-md w-full rounded-2xl bg-[#11131C] border border-white/20 p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#C8A97E]">
                Externer Index-Eintrag · Quelle: {selectedIndexProfile.sourcePortal || "Drittportal"}
              </span>
              <button
                onClick={() => setSelectedIndexProfile(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <h3 className="text-xl font-serif font-bold text-white">
              {selectedIndexProfile.rawName} ({selectedIndexProfile.city || "Schweiz"})
            </h3>
            <p className="text-xs text-gray-300 leading-relaxed">
              Dieser Datensatz stammt aus einer öffentlich zugänglichen externen Quelle ({selectedIndexProfile.sourcePortal || "Portal-Index"}) und wird noch nicht direkt durch die betreffende Person auf iwantsexnow.ch verwaltet.
            </p>
            <div className="p-3 rounded-xl bg-black/40 border border-white/10 text-[11px] text-gray-400 space-y-1">
              <div>• Herkunft: Externer Index ({selectedIndexProfile.sourcePortal || "CH"})</div>
              <div>• Identitätsprüfung durch uns: Noch nicht durchgeführt</div>
              <div>• Bestätigte Aufrufe auf unserer Plattform: {selectedIndexProfile.realDetailOpens + 1}</div>
            </div>
            <div className="flex flex-col gap-2 pt-1">
              <Link
                href={`/profile/${encodeURIComponent(selectedIndexProfile.id)}`}
                className="py-2.5 rounded-lg bg-[#C8A97E] text-[#090A0F] font-bold text-xs text-center"
              >
                Vollständige Vergleichsansicht öffnen →
              </Link>
              {selectedIndexProfile.sourceUrl && (
                <a
                  href={selectedIndexProfile.sourceUrl}
                  target="_blank"
                  rel="noreferrer nofollow"
                  onClick={() => recordEvent(selectedIndexProfile.id, "track_source_out")}
                  className="py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-200 font-semibold text-xs text-center border border-white/10 flex items-center justify-center gap-1.5"
                >
                  <span>Originalquelle ({selectedIndexProfile.sourcePortal || "Extern"}) öffnen</span>
                  <ExternalLink size={12} />
                </a>
              )}
              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                <Link
                  href={`/create-post?claim=${encodeURIComponent(selectedIndexProfile.rawName || "")}`}
                  className="py-2 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-semibold text-[11px] text-center"
                >
                  Eintrag kostenlos übernehmen
                </Link>
                <Link
                  href={`/report?name=${encodeURIComponent(selectedIndexProfile.rawName || "")}&id=${encodeURIComponent(selectedIndexProfile.id)}`}
                  className="py-2 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-300 font-semibold text-[11px] text-center"
                >
                  Melden / Sofort entfernen
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}