import React, { useState, useMemo, useEffect } from "react";
import { GetServerSideProps } from "next";
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
  User,
  Flag,
  Lock,
  Unlock,
  Video,
  Radio,
  Image as ImageIcon,
  Sparkles,
} from "lucide-react";

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=900&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=900&q=85",
];

export default function ProfileDetailPage({ initialProfileId }: { initialProfileId?: string }) {
  const router = useRouter();
  const rawId = String(router.query.id || initialProfileId || "ch-a720e283e85f");

  const [serverData, setServerData] = useState<{ metrics: Record<string, any>; states: Record<string, any> }>({
    metrics: {},
    states: {},
  });
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);
  const [unlockedVaultIds, setUnlockedVaultIds] = useState<string[]>([]);
  const [inquirySent, setInquirySent] = useState(false);
  const [inquiryMessage, setInquiryMessage] = useState("");
  const [inquiryContact, setInquiryContact] = useState("");

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d) {
          setServerData({ metrics: d.metrics || {}, states: d.states || {} });
        }
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!rawId) return;
    setActivePhotoIdx(0);
    fetch("/api/vault/metrics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "track_view", profileId: rawId }),
    }).catch(() => {});
  }, [rawId]);

  const profileData = useMemo(() => {
    const rawList = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];
    let foundIdx = rawList.findIndex(
      (item: any, idx: number) =>
        item.id === rawId ||
        (item.dedupClusterId || "ch-" + (idx + 1)) === rawId ||
        String(item.rawName || "").toLowerCase() === rawId.toLowerCase()
    );
    if (foundIdx < 0) {
      const numMatch = rawId.match(/\d+/);
      foundIdx = numMatch ? Math.max(0, (parseInt(numMatch[0], 10) - 1) % Math.max(1, rawList.length)) : 0;
    }

    const baseItem = rawList[foundIdx] || rawList[0] || {};
    const id = baseItem.id || baseItem.dedupClusterId || "ch-" + (foundIdx + 1);
    const st = serverData.states[id] || {};
    const geo = normalizeSwissGeo(st.city || baseItem.city, st.canton || baseItem.canton);

    const isSelfManaged = Boolean(st.claimed || st.accountConfirmed || baseItem.bookingMode === "direct");
    const isIdentityVerified = Boolean(st.identityVerified || st.identityRequested);
    const availabilityConfirmed = Boolean(
      st.availabilityConfirmed || (st.availableUntil && new Date(st.availableUntil).getTime() > Date.now())
    );

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

    const rate60 = st.rate60Chf !== undefined ? Number(st.rate60Chf) : Number(baseItem.advertisedBaseChf) || 350;
    const rate30 = st.rate30Chf !== undefined ? Number(st.rate30Chf) : Number(baseItem.rate30Chf) || Math.round((rate60 * 0.6) / 10) * 10;
    const phone = st.phoneDisplay || baseItem.rawPhone || "";

    const rawGal =
      Array.isArray(st.gallery) && st.gallery.length > 0
        ? st.gallery
        : Array.isArray(baseItem.gallery) && baseItem.gallery.length > 0
        ? baseItem.gallery
        : [];
    const mainThumb = st.thumbnail || baseItem.thumbnail || FALLBACK_PORTRAITS[foundIdx % FALLBACK_PORTRAITS.length];
    const gallery = Array.from(new Set([mainThumb, ...rawGal])).filter((u) => String(u).startsWith("http"));

    const defaultPaidItems = [
      {
        id: "ppv-1",
        title: "Private 4K Backstage & Lingerie Video (Uncensored)",
        type: "video",
        priceChf: 29,
        mediaCount: "1x 4K Video (6:40 Min.)",
        active: true,
      },
      {
        id: "ppv-2",
        title: "Exklusives VIP Foto-Set (12 High-Res Aufnahmen)",
        type: "photoset",
        priceChf: 19,
        mediaCount: "12 Fotos",
        active: true,
      },
    ];
    const paidItems = (Array.isArray(st.paidItems) && st.paidItems.length > 0 ? st.paidItems : defaultPaidItems).filter(
      (it: any) => it.active !== false
    );

    const cleanName =
      String(st.displayName || baseItem.rawName || "Profil")
        .replace(/[^\w\säöüÄÖÜéèà-]/g, "")
        .trim()
        .slice(0, 36) || "Profil";

    return {
      ...baseItem,
      id,
      cleanName,
      cleanCity: geo.cleanCity,
      canton: geo.trueCanton,
      rate30,
      rate60,
      phone,
      age: baseItem.age || 24,
      heightCm: baseItem.heightCm || 168,
      cupSize: baseItem.cupSize || "75C",
      hairColor: baseItem.hairColor || "Brünett",
      languages: Array.isArray(baseItem.languages) ? baseItem.languages : ["Deutsch", "Englisch"],
      gallery: gallery.length > 0 ? gallery : [FALLBACK_PORTRAITS[foundIdx % FALLBACK_PORTRAITS.length]],
      videoUrl: st.videoUrl || "",
      paidItems,
      liveCamActive: Boolean(st.liveCamActive),
      liveCamChfPerMin: Number(st.liveCamChfPerMin) || 6,
      isSelfManaged,
      isIdentityVerified,
      availabilityConfirmed,
      matchingSources,
      tags:
        Array.isArray(st.tags) && st.tags.length > 0
          ? st.tags
          : Array.isArray(baseItem.includedTags) && baseItem.includedTags.length > 0
          ? baseItem.includedTags
          : ["Incall", "Outcall", "Direktkontakt"],
      bioText:
        st.bio ||
        baseItem.bio ||
        `Verifiziertes Profil in ${geo.cleanCity} (Kanton ${geo.trueCanton}). Direktkontakt und veröffentlichte Konditionen ohne Agentur-Aufschlag.`,
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

  const activePhoto = profileData.gallery[activePhotoIdx] || profileData.gallery[0] || profileData.fallbackImg;

  return (
    <div className="min-h-screen bg-[#13161C] text-white pb-24">
      <SEO
        title={`${profileData.cleanName} (${profileData.age}) in ${profileData.cleanCity} (${profileData.canton}) – CHF ${profileData.rate30}/${profileData.rate60} & +41 Direktkontakt | iwantsexnow.ch`}
        description={`Profil von ${profileData.cleanName} (${profileData.age} J., ${profileData.cupSize}, ${profileData.hairColor}) in ${profileData.cleanCity} (${profileData.canton}). CHF ${profileData.rate30} (30m) / CHF ${profileData.rate60} (60m), Foto-Galerie, VIP Paid Content & Direktkontakt.`}
      />
      <StructuredSchema cityName={profileData.cleanCity} cantonCode={profileData.canton} />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-6 sm:px-10 py-8 space-y-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Linke Spalte: Foto-Galerie & 4K-Video */}
          <div className="lg:col-span-5 space-y-4">
            <div className="relative aspect-[4/4.6] w-full rounded-2xl overflow-hidden bg-stone-900 border border-white/15 shadow-2xl">
              <img
                src={activePhoto}
                alt={`${profileData.cleanName} – ${profileData.cleanCity}`}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = profileData.fallbackImg;
                }}
                className="w-full h-full object-cover object-top transition-all duration-300"
              />

              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {profileData.availabilityConfirmed && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1B5E32] text-[#A7F3D0] border border-emerald-400/40 text-xs font-bold shadow-lg">
                    <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-ping" />
                    Jetzt verfügbar (4h bestätigt)
                  </span>
                )}
                {profileData.liveCamActive && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-rose-600/95 text-white border border-rose-400/50 text-xs font-bold shadow-lg">
                    <Radio size={13} />
                    1:1 Live-Cam aktiv (CHF {profileData.liveCamChfPerMin}/Min.)
                  </span>
                )}
              </div>

              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/75 border border-white/15 text-[11px] font-semibold text-gray-200 flex items-center gap-1.5">
                <ImageIcon size={12} className="text-[#C6A574]" />
                <span>Foto {activePhotoIdx + 1} / {profileData.gallery.length}</span>
              </div>
            </div>

            {profileData.gallery.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {profileData.gallery.map((imgUrl: string, i: number) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setActivePhotoIdx(i)}
                    className={`relative aspect-square rounded-xl overflow-hidden border-2 transition cursor-pointer ${
                      activePhotoIdx === i ? "border-[#C6A574] scale-[1.03]" : "border-white/10 opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {profileData.videoUrl && (
              <div className="p-4 rounded-2xl bg-[#1C2029] border border-[#C6A574]/40 space-y-2">
                <div className="text-xs font-bold text-[#C6A574] flex items-center gap-1.5">
                  <Video size={14} /> 4K-Vorstellungsvideo von {profileData.cleanName}
                </div>
                <video src={profileData.videoUrl} controls className="w-full rounded-xl bg-black max-h-64" />
              </div>
            )}

            <div className="p-4 rounded-2xl bg-[#1A1E27] border border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-300">
              <span>Ist das dein Profil?</span>
              <div className="flex items-center gap-3 font-semibold">
                <Link href={`/creator-dashboard?id=${encodeURIComponent(profileData.id)}`} className="text-[#C6A574] hover:underline">
                  Im Anbieter-Cockpit bearbeiten →
                </Link>
                <span className="text-gray-600">|</span>
                <Link
                  href={`/report?name=${encodeURIComponent(profileData.cleanName)}&id=${encodeURIComponent(profileData.id)}`}
                  className="text-gray-400 hover:text-white inline-flex items-center gap-1"
                >
                  <Flag size={11} />
                  <span>Opt-out</span>
                </Link>
              </div>
            </div>
          </div>

          {/* Rechte Spalte: Preise, Deep-Attribute, Direktkontakt & Paid-Vault */}
          <div className="lg:col-span-7 space-y-6">
            <div className="p-6 rounded-2xl bg-[#1C2029] border border-white/10 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
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
                    <span>{profileData.cleanCity} · Kanton {profileData.canton}</span>
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-3 rounded-xl bg-[#13161C] border border-white/10 text-right">
                    <div className="text-sm font-bold text-gray-200">CHF {profileData.rate30}</div>
                    <div className="text-[10px] text-gray-400">30 Min. Richtpreis</div>
                  </div>
                  <div className="p-3 rounded-xl bg-[#13161C] border border-[#C6A574]/40 text-right">
                    <div className="text-xl font-extrabold text-[#C6A574]">CHF {profileData.rate60}</div>
                    <div className="text-[10px] text-gray-400">60 Min. Richtpreis</div>
                  </div>
                </div>
              </div>

              {/* Deep Physical & Language Attributes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 text-xs">
                <div className="p-2.5 rounded-xl bg-[#13161C] border border-white/5">
                  <div className="text-[10px] text-gray-400">Alter & Grösse</div>
                  <div className="font-bold text-white">{profileData.age} Jahre · {profileData.heightCm} cm</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#13161C] border border-white/5">
                  <div className="text-[10px] text-gray-400">Oberweite</div>
                  <div className="font-bold text-[#C6A574]">Körbchen {profileData.cupSize}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#13161C] border border-white/5">
                  <div className="text-[10px] text-gray-400">Haarfarbe</div>
                  <div className="font-bold text-white">{profileData.hairColor}</div>
                </div>
                <div className="p-2.5 rounded-xl bg-[#13161C] border border-white/5">
                  <div className="text-[10px] text-gray-400">Sprachen</div>
                  <div className="font-bold text-white truncate">{profileData.languages.join(", ")}</div>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Angebotene Services & Rahmenbedingungen
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {profileData.tags.map((t: string, i: number) => (
                    <span key={i} className="px-3 py-1 rounded-lg bg-[#13161C] border border-white/10 text-xs text-gray-200">
                      ✓ {t}
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed pt-1 whitespace-pre-line">
                  {profileData.bioText}
                </p>
              </div>
            </div>

            {/* DIREKTKONTAKT */}
            <div className="p-6 rounded-2xl bg-[#1C2029] border border-[#C6A574]/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-lg font-serif font-bold text-white">
                    Direktkontakt & Sofort-Termin ({profileData.cleanCity})
                  </h2>
                  <p className="text-xs text-gray-300">
                    0 % Agentur-Aufschlag – kontaktiere {profileData.cleanName} direkt telefonisch oder per Nachricht.
                  </p>
                </div>
                {profileData.liveCamActive && (
                  <Link
                    href={`/live-cam?provider=${encodeURIComponent(profileData.cleanName)}`}
                    className="px-3.5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-extrabold inline-flex items-center gap-1.5"
                  >
                    <Radio size={13} /> 1:1 Video-Call starten (CHF {profileData.liveCamChfPerMin}/Min.)
                  </Link>
                )}
              </div>

              {profileData.phone && (
                <div className="grid sm:grid-cols-2 gap-3">
                  <a
                    href={`tel:${profileData.phone}`}
                    onClick={() => recordAction("track_contact")}
                    className="py-3.5 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#0F1218] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition"
                  >
                    <Phone size={15} />
                    <span>Anrufen: {profileData.phone}</span>
                  </a>
                  <a
                    href={`https://wa.me/${String(profileData.phone).replace(/\D/g, "")}?text=${encodeURIComponent(
                      `Hallo ${profileData.cleanName}, ich habe dein Profil in ${profileData.cleanCity} auf iwantsexnow.ch gesehen und möchte gerne einen Termin anfragen.`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => recordAction("track_contact")}
                    className="py-3.5 px-4 rounded-xl bg-[#25D366]/20 hover:bg-[#25D366]/30 border border-[#25D366]/50 text-emerald-300 font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2 transition"
                  >
                    <span>WhatsApp Direkt-Chat öffnen ↗</span>
                  </a>
                </div>
              )}

              {inquirySent ? (
                <div className="p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200 font-semibold">
                  ✓ Deine private Rückruf-Anfrage wurde im Posteingang von {profileData.cleanName} hinterlegt!
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    fetch("/api/vault/metrics", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({
                        action: "create_enquiry",
                        profileId: profileData.id,
                        providerName: profileData.cleanName,
                        clientContact: inquiryContact,
                        desiredTime: inquiryMessage,
                      }),
                    }).catch(() => {});
                    setInquirySent(true);
                  }}
                  className="grid sm:grid-cols-3 gap-2.5 pt-1"
                >
                  <input
                    type="text"
                    required
                    value={inquiryContact}
                    onChange={(e) => setInquiryContact(e.target.value)}
                    placeholder="Deine Rückrufnummer (+41...)"
                    className="px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-xs text-white"
                  />
                  <input
                    type="text"
                    required
                    value={inquiryMessage}
                    onChange={(e) => setInquiryMessage(e.target.value)}
                    placeholder="Wunschzeit & Dauer (z.B. Heute 20 Uhr, 60m)"
                    className="px-3.5 py-2.5 rounded-xl bg-[#13161C] border border-white/15 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="py-2.5 px-4 rounded-xl bg-[#C6A574] hover:bg-[#d4b587] text-[#13161C] font-extrabold text-xs uppercase tracking-wider cursor-pointer"
                  >
                    Privat anfragen →
                  </button>
                </form>
              )}
            </div>

            {/* PAID CONTENT / VIP-TRESOR */}
            {profileData.paidItems.length > 0 && (
              <div className="p-6 rounded-2xl bg-[#1C2029] border border-[#C6A574]/40 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#C6A574] flex items-center gap-1">
                      <Sparkles size={12} /> EXKLUSIVER VIP-CONTENT VON {profileData.cleanName.toUpperCase()}
                    </span>
                    <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                      Private 4K-Videos & Uncensored Foto-Sets (Sofort-Freischaltung)
                    </h2>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold">
                    80 % Direkt-Support an {profileData.cleanName}
                  </span>
                </div>

                <div className="space-y-3">
                  {profileData.paidItems.map((item: any) => {
                    const isUnlocked = unlockedVaultIds.includes(item.id);
                    return (
                      <div
                        key={item.id}
                        className="p-4 rounded-xl bg-[#13161C] border border-white/10 flex flex-wrap items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-11 h-11 rounded-xl flex items-center justify-center border ${
                              isUnlocked
                                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                                : "bg-[#C6A574]/15 border-[#C6A574]/40 text-[#C6A574]"
                            }`}
                          >
                            {isUnlocked ? <Unlock size={18} /> : <Lock size={18} />}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-white">{item.title}</div>
                            <div className="text-xs text-gray-400">
                              {item.mediaCount} · Sofortiger Zugriff im Browser (Twint / Karte)
                            </div>
                          </div>
                        </div>

                        <Link
                          href={`/checkout?profileId=${encodeURIComponent(profileData.id)}&provider=${encodeURIComponent(
                            profileData.cleanName
                          )}&title=${encodeURIComponent(item.title)}&amount=${item.priceChf}`}
                          className="px-4 py-2.5 rounded-xl bg-[#C6A574] hover:bg-[#d4b587] text-[#13161C] font-extrabold text-xs uppercase tracking-wider"
                        >
                          Für CHF {item.priceChf} freischalten →
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* MULTI-SOURCE COMPARISON BOX */}
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
                          <span className="text-gray-500">Richtpreis siehe oben</span>
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
          </div>
        </div>
      </main>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      initialProfileId: String(context.params?.id || "ch-a720e283e85f"),
    },
  };
};