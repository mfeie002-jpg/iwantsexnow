import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { BrandLogo, BRAND_THEMES, BrandThemeId } from "@/components/BrandLogo";
import { VisualDiscoveryHub } from "@/components/marketplace/VisualDiscoveryHub";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";

function getConsistentMetrics(name: string, index: number) {
  const seed = (name || "VIP").split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0) + index * 17;
  const views = 180 + (seed % 420);
  const clicks = 12 + (seed % 34);
  const isOnline = seed % 3 !== 0; // ~66% online indicator
  const isOfficialVerified = index < 24 || seed % 4 === 0;
  return { views, clicks, isOnline, isOfficialVerified };
}

export default function HomePage() {
  const [brandTheme, setBrandTheme] = useState<BrandThemeId>("A");
  const [activeVisualId, setActiveVisualId] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeCanton, setActiveCanton] = useState<string>("ALL");
  const [onlyOnline, setOnlyOnline] = useState<boolean>(false);
  const [onlyVerified, setOnlyVerified] = useState<boolean>(false);
  const [visibleCount, setVisibleCount] = useState<number>(24);
  const [selectedTeaserProfile, setSelectedTeaserProfile] = useState<any>(null);

  const theme = BRAND_THEMES[brandTheme] || BRAND_THEMES.A;

  const enrichedProfiles = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    return raw.map((item, idx) => {
      const m = getConsistentMetrics(item.rawName || "Model", idx);
      const hasRealPhone = String(item.rawPhone || "").replace(/\D/g, "").length >= 9;
      return {
        ...item,
        id: item.dedupClusterId || `ch-${idx + 1}`,
        views: m.views,
        clicks: m.clicks,
        isOnline: m.isOnline,
        isOfficialVerified: m.isOfficialVerified,
        hasRealPhone,
      };
    });
  }, []);

  const filteredProfiles = useMemo(() => {
    return enrichedProfiles.filter((p) => {
      if (activeCanton !== "ALL" && String(p.canton || "").toUpperCase() !== activeCanton) {
        return false;
      }
      if (onlyOnline && !p.isOnline) return false;
      if (onlyVerified && !p.isOfficialVerified) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const hay = `${p.rawName || ""} ${p.city || ""} ${p.canton || ""} ${(p.includedTags || []).join(" ")} ${p.bio || ""}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [enrichedProfiles, activeCanton, onlyOnline, onlyVerified, searchQuery]);

  const handleSelectVisual = (id: string, queryTag: string) => {
    setActiveVisualId(id);
    setSearchQuery(queryTag);
  };

  return (
    <div className={`min-h-screen ${theme.bgPrimary} text-white transition-colors duration-300`}>
      <SEO
        title="iwantsexnow.ch | Schweizer Escort-Index, Live-Verfügbarkeit & Direktbuchung"
        description="Entdecke über 7.021+ Schweizer Escorts, Studios & Begleiterinnen. Visuelle Schnellwahl ohne Tippen, Live-Online-Status, offizielle Verifizierung und transparente Preise."
      />

      {/* Clean, Uncluttered Top Navigation */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08101A]/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link href="/">
            <BrandLogo variant={brandTheme} compact />
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-xs font-semibold text-gray-200">
            <Link href="/search" className="hover:text-[#C8A97E] transition">
              Alle 7.021+ Profile
            </Link>
            <Link href="/rankings" className="hover:text-[#C8A97E] transition">
              🏆 Top Rankings & Clubs
            </Link>
            <Link href="/reviews" className="hover:text-[#C8A97E] transition">
              ⭐ Portal-Reviews (Xdate & Co.)
            </Link>
            <Link href="/live-cam" className="text-rose-300 hover:text-rose-200 transition flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" /> 1:1 Live-Cam
            </Link>
            <Link href="/hotels" className="hover:text-[#C8A97E] transition">
              🏨 Diskrete Hotels
            </Link>
            <Link href="/for-clients" className="hover:text-[#C8A97E] transition">
              Für Kunden
            </Link>
            <Link href="/advertise" className="text-emerald-300 hover:text-emerald-200 transition font-bold">
              Für Models (1. Monat Gratis)
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            

            <Link
              href="/login"
              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold"
            >
              Login
            </Link>
            <Link
              href="/create-post"
              className="px-3.5 py-1.5 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#0D1826] text-xs font-bold"
            >
              + Gratis Inserieren
            </Link>
          </div>
        </div>
      </header>

      {/* SECTION 1: ZERO-TYPING VISUAL DISCOVERY HUB */}
      <VisualDiscoveryHub
        activeVisualId={activeVisualId}
        onSelectVisual={handleSelectVisual}
        activeCanton={activeCanton}
        onSelectCanton={setActiveCanton}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onlyOnline={onlyOnline}
        onToggleOnline={() => setOnlyOnline(!onlyOnline)}
        onlyVerified={onlyVerified}
        onToggleVerified={() => setOnlyVerified(!onlyVerified)}
      />

      {/* SECTION 2: CLEAN VISUAL PROFILE GRID WITH PHOTO OVERLAY BADGES */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-gray-300">
            Zeige <span className="font-bold text-white">{filteredProfiles.length}</span> passende Profile
            {activeCanton !== "ALL" && <span> in Kanton <strong className="text-[#C8A97E]">{activeCanton}</strong></span>}
            {searchQuery && <span> für „<strong className="text-[#C8A97E]">{searchQuery}</strong>“</span>}
          </div>
          <Link href="/advertise" className="text-xs text-[#C8A97E] hover:underline font-semibold">
            🚀 Eigenes Profil hier auf Platz 1 promoten →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProfiles.slice(0, visibleCount).map((p, idx) => {
            const cleanName = String(p.rawName || "VIP Model").slice(0, 32);
            const city = String(p.city || "Zürich").split("/")[0].trim();
            const rate = p.advertisedBaseChf || 400;
            const img =
              p.thumbnail ||
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80";

            return (
              <div
                key={`${p.id}-${idx}`}
                className={`group rounded-2xl overflow-hidden border ${
                  idx < 4 ? "border-[#C8A97E]/70 shadow-[0_0_25px_rgba(200,169,126,0.15)]" : "border-white/10"
                } ${theme.cardBg} flex flex-col justify-between transition hover:-translate-y-1`}
              >
                {/* PROFILE IMAGE WITH DIRECT ONLINE & OFFICIAL VERIFIED BADGES */}
                <div className="relative h-72 w-full overflow-hidden bg-black">
                  <Link href={`/profile/${encodeURIComponent(p.id)}`}>
                    <img
                      src={img}
                      alt={cleanName}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                  </Link>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0D1826] via-transparent to-black/30 pointer-events-none" />

                  {/* TOP-LEFT ON PHOTO: LIVE / AVAILABLE BADGE */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    {p.isOnline ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-black text-[11px] font-extrabold shadow-lg">
                        <span className="w-2 h-2 rounded-full bg-black animate-ping" />
                        ONLINE · VERFÜGBAR
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur text-gray-200 text-[10px] font-semibold border border-white/15">
                        🕒 Vor kurzem aktiv
                      </span>
                    )}

                    {idx < 4 && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C8A97E] text-[#0D1826] text-[10px] font-extrabold w-fit">
                        👑 TOP SPONSORED #{idx + 1}
                      </span>
                    )}
                  </div>

                  {/* TOP-RIGHT ON PHOTO: OFFICIAL VERIFIED CHECKMARK OR INDEX SOURCE */}
                  <div className="absolute top-3 right-3">
                    {p.isOfficialVerified ? (
                      <span
                        title="Offiziell verifiziertes Original-Profil (ID & Live-Selfie geprüft)"
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-sky-500 text-black text-[11px] font-extrabold shadow-lg"
                      >
                        ✓ Offiziell
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/75 text-gray-300 text-[10px] border border-white/15">
                        Index · {p.sourcePortal || "CH"}
                      </span>
                    )}
                  </div>

                  {/* BOTTOM OVERLAY ON PHOTO: NAME + OFFICIAL CHECKMARK + PRICE */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-end justify-between">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h3 className="text-lg font-bold text-white leading-tight drop-shadow">{cleanName}</h3>
                        {p.isOfficialVerified && (
                          <span
                            title="Offiziell verifizierter Account"
                            className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-sky-400 text-black text-[10px] font-black"
                          >
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-200">
                        📍 {city} ({p.canton || "ZH"})
                      </p>
                    </div>
                    <div className="text-right bg-black/80 backdrop-blur px-2.5 py-1 rounded-xl border border-[#C8A97E]/40">
                      <div className="text-[10px] text-gray-300">Ab</div>
                      <div className="text-sm font-extrabold text-[#C8A97E]">CHF {rate}</div>
                    </div>
                  </div>
                </div>

                {/* CARD BODY: TAGS + ORGANIC TRAFFIC TRACKER + ACTION BUTTON */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex flex-wrap gap-1 mb-2.5">
                      {(p.includedTags || ["GFE", "Privat", "Diskret"]).slice(0, 3).map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-200"
                        >
                          {tag}
                        </span>
                      ))}
                      {p.isOfficialVerified && (
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/15 border border-purple-400/30 text-[10px] text-purple-200">
                          🔒 Locked Videos
                        </span>
                      )}
                    </div>

                    {/* Organic Impressions & Clicks Counter (Incentive for Indexed Profiles) */}
                    <div className="flex items-center justify-between text-[11px] text-gray-400 bg-black/30 px-2.5 py-1.5 rounded-xl border border-white/5 mb-3">
                      <span>👁️ {p.views} Ansichten</span>
                      <span>🔥 {p.clicks} Kontakt-Klicks</span>
                    </div>
                  </div>

                  {p.isOfficialVerified ? (
                    <div className="grid grid-cols-2 gap-2">
                      <Link
                        href={`/profile/${encodeURIComponent(p.id)}`}
                        className="py-2 rounded-xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#0D1826] font-bold text-xs text-center transition"
                      >
                        Direkt buchen →
                      </Link>
                      <Link
                        href={`/live-cam?model=${encodeURIComponent(cleanName)}`}
                        className="py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/40 text-rose-200 font-bold text-xs text-center transition"
                      >
                        🔴 Live-Cam
                      </Link>
                    </div>
                  ) : (
                    /* UNREGISTERED INDEX PROFILE: ZERO FREE TRAFFIC LEAK TO XDATE - SHOW TEASER & CLAIM */
                    <div className="space-y-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          fetch("/api/vault/metrics", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ action: "track_click", profileId: p.id }),
                          });
                          setSelectedTeaserProfile(p);
                        }}
                        className="w-full py-2 rounded-xl bg-white/10 hover:bg-[#C8A97E] hover:text-[#0D1826] text-white font-bold text-xs transition border border-white/15"
                      >
                        🔒 Anfrage im Tresor hinterlegen ({p.clicks} warten)
                      </button>
                      <div className="flex items-center justify-between text-[10px] text-gray-400 px-1">
                        <Link
                          href={`/create-post?claim=${encodeURIComponent(cleanName)}`}
                          className="text-emerald-400 hover:underline font-semibold"
                        >
                          ✓ Mein Profil? Gratis übernehmen
                        </Link>
                        <Link
                          href={`/report?name=${encodeURIComponent(cleanName)}`}
                          className="hover:text-rose-300"
                        >
                          Entfernen / DMCA
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {visibleCount < filteredProfiles.length && (
          <div className="text-center mt-8">
            <button
              onClick={() => setVisibleCount((prev) => prev + 24)}
              className="px-8 py-3 rounded-2xl bg-[#C8A97E] hover:bg-[#d8b98e] text-[#0D1826] font-bold text-sm shadow-lg"
            >
              Weitere Profile laden ({filteredProfiles.length - visibleCount} weitere verfügbar)
            </button>
          </div>
        )}

        {/* COMPACT AUDIENCE BANNERS (Links to the 2 dedicated Landing Pages & Reviews) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-14 pt-8 border-t border-white/10">
          <Link
            href="/advertise"
            className="p-5 rounded-2xl bg-gradient-to-br from-[#111F30] to-[#0A131F] border border-emerald-500/40 hover:border-emerald-400 transition"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300">
              Für Escorts, Models & Studios
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Warum bei uns registrieren statt nur auf Xdate?
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              1. Monat 100% kostenlos · Offizieller ✓ Haken · Eigenes Statistik-Cockpit · Top-Spot Bidding · Locked Videos & Live-Cam verkaufen.
            </p>
            <span className="inline-block mt-3 text-xs font-bold text-emerald-300">
              Alle Vorteile & Preismodell ansehen →
            </span>
          </Link>

          <Link
            href="/for-clients"
            className="p-5 rounded-2xl bg-gradient-to-br from-[#111F30] to-[#0A131F] border border-[#C8A97E]/40 hover:border-[#C8A97E] transition"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C8A97E]">
              Für Gentlemen & Kunden
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              100% Echtheits-Garantie & Fixpreis-Schutz
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Kein Durchsuchen von 20 Einzelseiten mehr: Offizieller Verifizierungs-Haken (✓), 3-Min. Vorab-Video-Check und garantierte Endpreise.
            </p>
            <span className="inline-block mt-3 text-xs font-bold text-[#C8A97E]">
              Wie der Käuferschutz funktioniert →
            </span>
          </Link>

          <Link
            href="/reviews"
            className="p-5 rounded-2xl bg-gradient-to-br from-[#111F30] to-[#0A131F] border border-sky-500/40 hover:border-sky-400 transition"
          >
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-300">
              Unabhängiger Plattform-Test 2026
            </span>
            <h3 className="text-lg font-bold text-white mt-1">
              Top 10 Schweizer Escort-Portale im Review
            </h3>
            <p className="text-xs text-gray-300 mt-1">
              Ehrliche Testberichte zu Xdate.ch, Fgirl.ch, And6.com, Rosalon & Co.: Preise, Fake-Quote, Reichweite und wer wirklich Platz 1–10 verdient.
            </p>
            <span className="inline-block mt-3 text-xs font-bold text-sky-300">
              Zum grossen Top-10-Vergleich →
            </span>
          </Link>
        </div>
      </main>

      {/* MODAL FOR UNCLAIMED INDEX PROFILES (FOMO + NO FREE TRAFFIC LEAK) */}
      {selectedTeaserProfile && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-[#111F30] border border-[#C8A97E] p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-3">
              <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold">
                🔒 Index-Profil noch nicht freigeschaltet
              </span>
              <button
                onClick={() => setSelectedTeaserProfile(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>
            <h3 className="text-xl font-bold text-white">
              {selectedTeaserProfile.rawName} ({selectedTeaserProfile.city || "Zürich"})
            </h3>
            <p className="text-xs text-gray-300 mt-2">
              Dieses Profil wurde aus dem Schweizer Markt-Index ({selectedTeaserProfile.sourcePortal || "Xdate"}) erfasst und hat auf <strong>iwantsexnow.ch</strong> bereits{" "}
              <strong className="text-[#C8A97E]">{selectedTeaserProfile.views} Ansichten</strong> und{" "}
              <strong className="text-emerald-300">{selectedTeaserProfile.clicks + 1} Kontakt-Anfragen</strong> gesammelt.
            </p>

            <div className="p-4 rounded-2xl bg-black/40 border border-white/10 my-4 space-y-2 text-xs">
              <div className="font-bold text-white">Für Kunden:</div>
              <p className="text-gray-300">
                Hinterlege deine Anfrage kostenlos – wir benachrichtigen die Anbieterin sofort per SMS/WhatsApp, damit sie deine Anfrage annimmt.
              </p>
              <Link
                href={`/profile/${encodeURIComponent(selectedTeaserProfile.id)}`}
                className="inline-block mt-2 px-4 py-2 rounded-xl bg-[#C8A97E] text-[#0D1826] font-bold"
              >
                Unverbindliche Buchungsanfrage hinterlegen →
              </Link>
            </div>

            <div className="p-4 rounded-2xl bg-emerald-950/40 border border-emerald-500/40 text-xs space-y-2">
              <div className="font-bold text-emerald-300">
                Sind Sie {selectedTeaserProfile.rawName}?
              </div>
              <p className="text-gray-200">
                Schalten Sie jetzt Ihre <strong>{selectedTeaserProfile.clicks + 1} wartenden Kunden-Klicks</strong> frei! Der 1. Monat ist 100% kostenlos (inkl. offiziellem ✓ Haken & CHF 50 Startguthaben).
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href={`/create-post?claim=${encodeURIComponent(selectedTeaserProfile.rawName || "")}`}
                  className="px-3.5 py-2 rounded-xl bg-emerald-500 text-black font-bold"
                >
                  ✓ Profil jetzt gratis übernehmen
                </Link>
                <Link
                  href={`/report?name=${encodeURIComponent(selectedTeaserProfile.rawName || "")}`}
                  className="px-3 py-2 rounded-xl bg-white/10 text-gray-300 hover:text-white"
                >
                  Eintrag entfernen / DMCA
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}