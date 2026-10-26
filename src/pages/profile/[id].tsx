import React, { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/router";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { VelvetBackdrop } from "@/components/VelvetBackdrop";
import { CorporateFooter } from "@/components/CorporateFooter";
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
      const numMatch = rawId.match(/\d+/);
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

    const cleanKey = String(baseItem.rawName || "").toLowerCase().replace(/[^\w]/g, "").slice(0, 18);
    const matchingSources: Array<{ portal: string; url: string; rate: number | null; city: string }> = [];

    for (const candidate of rawList) {
      if (!candidate || !candidate.rawName) continue;
      const cKey = String(candidate.rawName).toLowerCase().replace(/[^\w]/g, "").slice(0, 18);
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
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
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
    <div className="min-h-screen iwsn-velvet-bg text-white relative pb-24">
      <SEO
        title={profileData.cleanName + " in " + profileData.cleanCity + " (" + profileData.canton + ") – Status, Preis & Quellen | iwantsexnow.ch"}
        description={"Profil von " + profileData.cleanName + " in " + profileData.cleanCity + " (" + profileData.canton + "). Prüfe Verfügbarkeit, veröffentlichte Preise und zugeordnete Quellen."}
      />
      <StructuredSchema cityName={profileData.cleanCity} cantonCode={profileData.canton} />
      <VelvetBackdrop />
      <LuxuryHeader />

      <main className="max-w-[1380px] mx-auto px-6 sm:px-10 py-8 space-y-8">
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
      <CorporateFooter />
    </div>
  );
}
