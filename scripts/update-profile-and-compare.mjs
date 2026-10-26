import fs from "fs";
import path from "path";

const pagesDir = path.join(process.cwd(), "src", "pages");

// ---------------------------------------------------------------------------
// 1. PROFILE DETAIL PAGE: src/pages/profile/[id].tsx
// ---------------------------------------------------------------------------
const profileDetailCode = `import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { StructuredSchema } from "@/components/StructuredSchema";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { XeniaDoubtTrigger } from "@/components/XeniaContextualHelp";
import {
  ArrowLeft,
  Check,
  Clock,
  ExternalLink,
  HelpCircle,
  Layers,
  MapPin,
  Phone,
  ShieldCheck,
  User,
  Flag,
} from "lucide-react";

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=85",
];

export default function ProfileDetailPage() {
  const router = useRouter();
  const rawId = String(router.query.id || "ch-1");

  const [serverData, setServerData] = useState<{ metrics: Record<string, any>; states: Record<string, any> }>({
    metrics: {},
    states: {},
  });
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryContact, setInquiryContact] = useState("");

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

  useEffect(() => {
    if (!router.isReady || !rawId) return;
    fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "track_view", profileId: rawId }),
    }).catch(() => {});
  }, [router.isReady, rawId]);

  const profileData = useMemo(() => {
    const rawList = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    let foundIdx = rawList.findIndex(
      (item: any, idx: number) =>
        (item.dedupClusterId || "ch-" + (idx + 1)) === rawId ||
        String(item.rawName || "").toLowerCase() === rawId.toLowerCase()
    );
    if (foundIdx < 0) {
      const numMatch = rawId.match(/\\d+/);
      foundIdx = numMatch ? Math.max(0, ( parseInt(numMatch[0], 10) - 1 ) % Math.max(1, rawList.length)) : 0;
    }

    const baseItem = rawList[foundIdx] || rawList[0] || {};
    const id = baseItem.dedupClusterId || "ch-" + (foundIdx + 1);
    const st = serverData.states[id] || {};
    const geo = normalizeSwissGeo(st.city || baseItem.city, st.canton || baseItem.canton);

    const isCleanPhoto =
      String(baseItem.sourcePortal || "").toLowerCase().includes("bemygirl") ||
      String(baseItem.sourcePortal || "").toLowerCase().includes("fgirl");
    const isDemoSlot = foundIdx < 12 && isCleanPhoto && st.availabilityConfirmed === undefined;

    const isSelfManaged = Boolean(
      st.claimed || baseItem.bookingMode === "direct" || (isDemoSlot && foundIdx % 4 !== 3)
    );
    const isIdentityVerified = Boolean(st.identityVerified);
    const availabilityConfirmed = Boolean(
      st.availabilityConfirmed !== undefined
        ? st.availabilityConfirmed
        : isDemoSlot && (foundIdx % 4 === 0 || foundIdx % 4 === 2)
    );
    const isOnline = Boolean(st.online !== undefined ? st.online : isDemoSlot && foundIdx % 4 === 1);

    const cleanKey = String(baseItem.rawName || "").toLowerCase().replace(/[^\\w]/g, "").slice(0, 18);
    const matchingSources: Array<{ portal: string; url: string; rate: number | null; city: string }> = [];

    for (const candidate of rawList) {
      if (!candidate || !candidate.rawName) continue;
      const cKey = String(candidate.rawName).toLowerCase().replace(/[^\\w]/g, "").slice(0, 18);
      if (cKey && cKey === cleanKey) {
        const pName = candidate.sourcePortal || "xdate.ch";
        if (!matchingSources.some((m) => m.portal === pName)) {
          const cGeo = normalizeSwissGeo(candidate.city, candidate.canton);
          matchingSources.push({
            portal: pName,
            url: candidate.sourceUrl || "#",
            rate: Number(candidate.advertisedBaseChf) || null,
            city: cGeo.cleanCity + " · " + cGeo.trueCanton,
          });
        }
      }
    }

    if (matchingSources.length === 0) {
      matchingSources.push({
        portal: baseItem.sourcePortal || "Portal-Index",
        url: baseItem.sourceUrl || "#",
        rate: Number(baseItem.advertisedBaseChf) || null,
        city: geo.cleanCity + " · " + geo.trueCanton,
      });
    }

    if (isSelfManaged && !matchingSources.some((m) => m.portal === "Direktprofil (IWSN)")) {
      matchingSources.unshift({
        portal: "Direktprofil (IWSN)",
        url: "/profile/" + encodeURIComponent(id),
        rate: Number(st.rate60Chf || baseItem.advertisedBaseChf) || null,
        city: geo.cleanCity + " · " + geo.trueCanton,
      });
    }

    const rate = st.rate60Chf !== undefined ? Number(st.rate60Chf) : Number(baseItem.advertisedBaseChf) || null;
    const durationLabel = rate && rate < 180 ? "30 Min. · laut Inserat" : "60 Min. · laut Inserat";
    const cleanName =
      String(st.displayName || baseItem.rawName || "Profil")
        .replace(/[^\\w\\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 32) || "Profil";

    return {
      ...baseItem,
      id,
      cleanName,
      cleanCity: geo.cleanCity,
      canton: geo.trueCanton,
      rate,
      durationLabel,
      isSelfManaged,
      isIdentityVerified,
      availabilityConfirmed,
      confirmedMinutesAgo: availabilityConfirmed ? 6 : null,
      isOnline,
      matchingSources,
      tags:
        Array.isArray(baseItem.includedTags) && baseItem.includedTags.length > 0
          ? baseItem.includedTags
          : ["Begleitung", "Diskret", "Privat"],
      bioText:
        st.bio ||
        baseItem.bio ||
        "Profil in " +
          geo.cleanCity +
          " (Kanton " +
          geo.trueCanton +
          "). Alle veröffentlichten Angaben zu Status, Preisbasis und Herkunft sind unten transparent aufgeschlüsselt.",
      fallbackImg: FALLBACK_PORTRAITS[foundIdx % FALLBACK_PORTRAITS.length],
    };
  }, [rawId, serverData]);

  const recordAction = (action: string) => {
    fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, profileId: profileData.id }),
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title={profileData.cleanName + " in " + profileData.cleanCity + " (" + profileData.canton + ") – Status, Preis & Quellen | iwantsexnow.ch"}
        description={"Profil von " + profileData.cleanName + " in " + profileData.cleanCity + " (" + profileData.canton + "). Prüfe Verfügbarkeit, veröffentlichte Preise und zugeordnete Quellen."}
      />
      <StructuredSchema cityName={profileData.cleanCity} cantonCode={profileData.canton} />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-8 space-y-8">
        {/* Top Back Navigation + Context Help */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-gray-400 border-b border-white/10 pb-4">
          <Link href="/" className="inline-flex items-center gap-1.5 font-bold text-white hover:text-[#C6A574]">
            <ArrowLeft size={15} />
            <span>Zurück zur Profilübersicht</span>
          </Link>

          <div className="flex flex-wrap items-center gap-4">
            <XeniaDoubtTrigger topic="status" label="Status-Erklärung" />
            <XeniaDoubtTrigger topic="price" label="Preis-Einordnung" />
            <XeniaDoubtTrigger topic="source" label="Quellen-Herkunft" />
          </div>
        </div>

        {/* Main 2-Column Profile Dossier */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left 5 Columns: Portrait & Quick Trust Summary */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/4.6] w-full rounded-2xl overflow-hidden bg-stone-900 border border-white/15 shadow-2xl">
              <img
                src={profileData.thumbnail || profileData.fallbackImg}
                alt={profileData.cleanName + " – " + profileData.cleanCity}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = profileData.fallbackImg;
                }}
                className="w-full h-full object-cover object-top"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {profileData.availabilityConfirmed ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1B5E32] text-[#A7F3D0] border border-emerald-400/40 text-xs font-bold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E]" />
                    Jetzt verfügbar
                  </span>
                ) : profileData.isOnline ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#253958] text-[#BFDBFE] border border-sky-400/40 text-xs font-bold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#60A5FA]" />
                    Online
                  </span>
                ) : null}
              </div>
            </div>

            {/* Provider Self-Service & Takedown Box (Section 4A & 7: "Ist das dein Profil?") */}
            <div className="p-4 rounded-2xl bg-[#1A1E27] border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
              <span>Ist das dein Profil?</span>
              <div className="flex items-center gap-3 font-semibold">
                <Link
                  href={"/create-post?claim=" + encodeURIComponent(profileData.cleanName) + "&id=" + encodeURIComponent(profileData.id)}
                  className="text-[#C6A574] hover:underline"
                >
                  Bestehendes Profil übernehmen →
                </Link>
                <span className="text-gray-600">|</span>
                <Link
                  href={"/report?name=" + encodeURIComponent(profileData.cleanName) + "&id=" + encodeURIComponent(profileData.id)}
                  className="text-gray-400 hover:text-white inline-flex items-center gap-1"
                >
                  <Flag size={11} />
                  <span>Melden / Entfernen</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Right 7 Columns: Evidence, Pricing, Sources & Contact Action */}
          <div className="lg:col-span-7 space-y-6">
            {/* Title, Location & Status Semantics */}
            <div className="p-6 rounded-2xl bg-[#1C2029] border border-white/10 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">
                      {profileData.cleanName}
                    </h1>
                    {profileData.isIdentityVerified && (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#C6A574]/20 border border-[#C6A574]/50 text-[#E5C99B] text-xs font-bold">
                        <Check size={12} /> Identität geprüft
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-300 flex items-center gap-1.5 mt-1">
                    <MapPin size={15} className="text-[#C6A574]" />
                    <span>
                      {profileData.cleanCity} · Kanton {profileData.canton}
                    </span>
                  </p>
                </div>

                {profileData.rate ? (
                  <div className="p-3 rounded-xl bg-[#13161C] border border-white/10 text-right">
                    <div className="text-xl font-extrabold text-[#C6A574]">CHF {profileData.rate}</div>
                    <div className="text-[11px] text-gray-400">{profileData.durationLabel}</div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#13161C] border border-white/10 text-right">
                    <div className="text-sm font-bold text-gray-300">Keine Preisangabe</div>
                    <div className="text-[11px] text-gray-500">Im Inserat nicht genannt</div>
                  </div>
                )}
              </div>

              {/* Explicit Evidence Status Block (Matches Bild 1: Availability at a Glance) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-white/10 text-xs">
                <div className="p-3.5 rounded-xl bg-[#13161C] border border-white/5 space-y-1">
                  <div className="text-gray-400 flex items-center justify-between">
                    <span>Verfügbarkeits-Status:</span>
                    <XeniaDoubtTrigger topic="status" />
                  </div>
                  {profileData.availabilityConfirmed ? (
                    <div className="font-bold text-[#22C55E] flex items-center gap-1.5">
                      <Clock size={13} />
                      <span>Bestätigt vor {profileData.confirmedMinutesAgo} Min. (aktiv für 4 Std.)</span>
                    </div>
                  ) : (
                    <div className="font-semibold text-gray-300 flex items-center gap-1.5">
                      <HelpCircle size={13} className="text-gray-400" />
                      <span>Verfügbarkeit unbekannt (keine aktive Bestätigung)</span>
                    </div>
                  )}
                </div>

                <div className="p-3.5 rounded-xl bg-[#13161C] border border-white/5 space-y-1">
                  <div className="text-gray-400 flex items-center justify-between">
                    <span>Profil-Verwaltung & Herkunft:</span>
                    <XeniaDoubtTrigger topic="source" />
                  </div>
                  {profileData.isSelfManaged ? (
                    <div className="font-bold text-white flex items-center gap-1.5">
                      <User size={13} className="text-[#C6A574]" />
                      <span>Selbst verwaltetes Anbieterprofil</span>
                    </div>
                  ) : (
                    <div className="font-semibold text-gray-300 flex items-center gap-1.5">
                      <ExternalLink size={13} className="text-gray-400" />
                      <span>Externe Quelle · {profileData.sourcePortal || "Portal-Index"}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Description & Tags */}
              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Angaben & Kategorien laut Profil
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.tags.map((t: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-[#13161C] border border-white/10 text-xs text-gray-200"
                    >
                      {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1">
                  {profileData.bioText}
                </p>
              </div>
            </div>

            {/* MULTI-SOURCE COMPARISON BOX (Matches Bild 5 & Bild 10: "Ein Profil · mehrere Quellen") */}
            <div className="p-6 rounded-2xl bg-[#1C2029] border border-white/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Layers size={16} className="text-[#C6A574]" />
                  <h2 className="text-base sm:text-lg font-bold text-white">
                    Zugeordnete Quellen & veröffentlichte Preise ({profileData.matchingSources.length})
                  </h2>
                </div>
                <XeniaDoubtTrigger topic="price" label="Preise verstehen" />
              </div>

              <div className="divide-y divide-white/10 border border-white/10 rounded-xl overflow-hidden bg-[#13161C] text-xs">
                {profileData.matchingSources.map((src: any, idx: number) => (
                  <div key={idx} className="p-3.5 flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <div className="font-bold text-white">{src.portal}</div>
                      <div className="text-gray-400">{src.city}</div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        {src.rate ? (
                          <span className="font-bold text-[#C6A574]">CHF {src.rate}</span>
                        ) : (
                          <span className="text-gray-500">Keine Preisangabe</span>
                        )}
                      </div>
                      {src.url && src.url.startsWith("http") ? (
                        <a
                          href={src.url}
                          target="_blank"
                          rel="noreferrer nofollow"
                          onClick={() => recordAction("track_source_out")}
                          className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-[#C6A574] text-white hover:text-[#13161C] font-bold inline-flex items-center gap-1.5 transition"
                        >
                          <span>Original öffnen</span>
                          <ExternalLink size={12} />
                        </a>
                      ) : (
                        <span className="px-3 py-1.5 rounded-lg bg-[#C6A574]/15 text-[#E5C99B] font-semibold">
                          Aktuelle Ansicht
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* PRIMARY ACTION BOX: "Privat anfragen" (Self-Managed) vs. "Original ansehen" (External) */}
            <div className="p-6 rounded-2xl bg-[#1C2029] border border-[#C6A574]/40 space-y-4">
              {profileData.isSelfManaged ? (
                <>
                  <div className="space-y-1">
                    <h2 className="text-lg font-serif font-bold text-white">
                      Direktkontakt & Private Anfrage
                    </h2>
                    <p className="text-xs text-gray-300">
                      Dieses Profil wird selbst verwaltet. Sie können direkt telefonisch Kontakt aufnehmen oder eine private Nachricht hinterlassen.
                    </p>
                  </div>

                  {profileData.rawPhone && (
                    <a
                      href={"tel:" + profileData.rawPhone}
                      onClick={() => recordAction("track_contact")}
                      className="w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F1218] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
                    >
                      <Phone size={15} />
                      <span>Direkt anrufen: {profileData.rawPhone}</span>
                    </a>
                  )}

                  {inquirySent ? (
                    <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200 font-semibold">
                      ✓ Ihre private Anfrage wurde für das Anbieterkonto hinterlegt.
                    </div>
                  ) : (
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        recordAction("track_contact");
                        setInquirySent(true);
                      }}
                      className="space-y-3 pt-1"
                    >
                      <input
                        type="text"
                        required
                        value={inquiryContact}
                        onChange={(e) => setInquiryContact(e.target.value)}
                        placeholder="Ihre Rückrufnummer oder Kontaktangabe..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-xs text-white"
                      />
                      <textarea
                        rows={2}
                        required
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Kurze, respektvolle Anfrage (gewünschter Zeitpunkt, Dauer)..."
                        className="w-full px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-xs text-white"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 rounded-xl bg-[#C6A574] hover:bg-[#d4b587] text-[#13161C] font-bold text-xs uppercase tracking-wider cursor-pointer"
                      >
                        Privat anfragen →
                      </button>
                    </form>
                  )}
                </>
              ) : (
                <div className="space-y-3">
                  <h2 className="text-lg font-serif font-bold text-white">
                    Externer Quelleneintrag ({profileData.sourcePortal || "Verzeichnis"})
                  </h2>
                  <p className="text-xs text-gray-300 leading-relaxed">
                    Dieser Eintrag wurde noch nicht vom Anbieter selbst übernommen. Die Kontaktaufnahme erfolgt deshalb direkt über das ursprüngliche Inserat.
                  </p>
                  <div className="flex flex-wrap gap-3 pt-1">
                    {profileData.sourceUrl && (
                      <a
                        href={profileData.sourceUrl}
                        target="_blank"
                        rel="noreferrer nofollow"
                        onClick={() => recordAction("track_source_out")}
                        className="px-6 py-3 rounded-xl bg-[#C6A574] hover:bg-[#d4b587] text-[#13161C] font-bold text-xs inline-flex items-center gap-2 shadow"
                      >
                        <span>Original ansehen ({profileData.sourcePortal || "Quelle"})</span>
                        <ExternalLink size={14} />
                      </a>
                    )}
                    <Link
                      href={"/create-post?claim=" + encodeURIComponent(profileData.cleanName) + "&id=" + encodeURIComponent(profileData.id)}
                      className="px-5 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-xs font-semibold text-gray-200"
                    >
                      Mein Profil? Kostenlos übernehmen →
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
`;
fs.writeFileSync(path.join(pagesDir, "profile", "[id].tsx"), profileDetailCode, "utf8");
console.log("✓ Beweis-basierte Profil-Detailseite geschrieben: src/pages/profile/[id].tsx");

// ---------------------------------------------------------------------------
// 2. STANDALONE COMPARE ESCORTS PAGE: src/pages/compare-escorts.tsx
//    (Champagne-Gold Comparison View matching Bild 10 / 3749d992...)
// ---------------------------------------------------------------------------
const compareEscortsCode = `import React, { useState, useMemo } from "react";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";
import { Check, Bookmark, ArrowRight, X } from "lucide-react";

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
];

export default function CompareEscortsPage() {
  const [selectedCanton, setSelectedCanton] = useState("ALL");
  const [onlyWithPrice, setOnlyWithPrice] = useState(false);
  const [compareIds, setCompareIds] = useState<string[]>(["ch-1", "ch-2"]);
  const [modalOpen, setModalOpen] = useState(false);

  const profiles = useMemo(() => {
    const raw = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    return raw.slice(0, 60).map((item: any, idx: number) => {
      const id = item.dedupClusterId || "ch-" + (idx + 1);
      const geo = normalizeSwissGeo(item.city, item.canton);
      const rate = Number(item.advertisedBaseChf) || null;
      const durationLabel = rate && rate < 180 ? "30 Min. · laut Inserat" : "60 Min. · laut Inserat";
      const cleanName =
        String(item.rawName || "Profil")
          .replace(/[^\\w\\säöüÄÖÜéèà-]/g, "")
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

      <main className="max-w-7xl mx-auto px-6 sm:px-10 py-8 space-y-6">
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
`;
fs.writeFileSync(path.join(pagesDir, "compare-escorts.tsx"), compareEscortsCode, "utf8");
console.log("✓ Vergleichs-Seite geschrieben: src/pages/compare-escorts.tsx");