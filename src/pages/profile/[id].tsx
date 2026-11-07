import React, { useState, useEffect, useMemo } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import { SwissDoorplate } from "@/components/SwissDoorplate";
import offersData from "@/data/harvested-offers.json";
import {
  MapPin,
  Lock,
  Heart,
  Scale,
  ArrowLeft,
  Sparkles,
  PhoneCall,
  MessageCircle,
  ExternalLink,
  Crown,
  ShieldCheck,
} from "lucide-react";

function normalizeSwissPhone(raw: any): string | null {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return null;
  let local = "";
  if (digits.startsWith("41") && digits.length === 11) local = "0" + digits.slice(2);
  else if (digits.startsWith("0041") && digits.length === 13) local = "0" + digits.slice(4);
  else if (digits.startsWith("0") && digits.length === 10) local = digits;
  else return null;
  if (/(\d)\1{5,}|123456/.test(local)) return null;
  return "+41 " + local.slice(1, 3) + " " + local.slice(3, 6) + " " + local.slice(6, 8) + " " + local.slice(8, 10);
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const rawId = String(ctx.params?.id || "").trim();
  const allOffers = (offersData as any[]) || [];

  const found =
    allOffers.find((o) => String(o.id || o.dedupClusterId) === rawId) ||
    allOffers.find((o) => String(o.id || "").toLowerCase() === rawId.toLowerCase()) ||
    allOffers[0];

  if (!found) {
    return { notFound: true };
  }

  const pid = String(found.id || found.dedupClusterId || rawId);
  const r60 = Math.max(100, Math.min(1200, Number(found.advertisedBaseChf) || 350));
  const r30 = Math.max(80, Math.min(800, Number(found.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));
  const cleanPhone = normalizeSwissPhone(found.rawPhone || found.phone);

  const related = allOffers
    .filter((o) => (o.id || o.dedupClusterId) !== pid && o.canton === found.canton)
    .slice(0, 4)
    .map((o) => ({
      id: o.id || o.dedupClusterId,
      rawName: o.rawName || "Verifiziertes Profil",
      city: o.city || "Zürich",
      canton: o.canton || "ZH",
      rate60Chf: Math.max(100, Math.min(1200, Number(o.advertisedBaseChf) || 350)),
      rate30Chf: Math.max(80, Math.min(800, Number(o.rate30Chf) || 200)),
      thumbnail: String(o.thumbnail || "/images/escort-portrait-1.jpg").replace(/[?&]iwsn_clean=1.*$/i, ""),
      age: Number(o.age) || 25,
    }));

  return {
    props: {
      profile: {
        ...found,
        id: pid,
        rawName: found.rawName || "Verifiziertes Schweizer Dossier",
        city: found.city || "Zug",
        canton: found.canton || "ZG",
        rate60Chf: r60,
        rate30Chf: r30,
        cleanPhone,
        thumbnail: String(found.thumbnail || "/images/escort-portrait-1.jpg").replace(/[?&]iwsn_clean=1.*$/i, ""),
        age: Number(found.age) || 25,
        heightCm: Number(found.heightCm) || 168,
        cupSize: found.cupSize || "C",
        hairColor: found.hairColor || "Brünett",
        includedTags: Array.isArray(found.includedTags)
          ? found.includedTags
          : ["Direktkontakt", "Diskreter Empfang", "Girlfriend Experience"],
      },
      relatedProfiles: related,
    },
  };
};

export default function ProfileDetailPage({ profile, relatedProfiles }: any) {
  const [liveState, setLiveState] = useState<any>({});
  const [isFav, setIsFav] = useState(false);
  const [vaultUnlocked, setVaultUnlocked] = useState(false);
  const [activePhotoIdx, setActivePhotoIdx] = useState(0);

  useEffect(() => {
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states && d.states[profile.id]) {
          setLiveState(d.states[profile.id]);
        }
      })
      .catch(() => {});

    try {
      const favs = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      setIsFav(Array.isArray(favs) && favs.includes(profile.id));
      const unlocked = JSON.parse(localStorage.getItem("ch_unlocked_vaults") || "[]");
      setVaultUnlocked(Array.isArray(unlocked) && unlocked.includes(profile.id));
    } catch {}
  }, [profile.id]);

  const toggleFav = () => {
    try {
      const favs = JSON.parse(localStorage.getItem("ch_favorite_profiles") || "[]");
      const list = Array.isArray(favs) ? favs : [];
      const next = list.includes(profile.id) ? list.filter((x: string) => x !== profile.id) : [profile.id, ...list];
      localStorage.setItem("ch_favorite_profiles", JSON.stringify(next));
      setIsFav(next.includes(profile.id));
      window.dispatchEvent(new Event("ch-favorites-updated"));
    } catch {}
  };

  const rate60 = Math.max(100, Math.min(1200, Number(liveState.rate60Chf || profile.rate60Chf) || 350));
  const rate30 = Math.max(80, Math.min(800, Number(liveState.rate30Chf || profile.rate30Chf) || Math.round((rate60 * 0.6) / 10) * 10));
  const rate120 = Math.round((rate60 * 1.85) / 10) * 10;
  const cleanPhone = normalizeSwissPhone(liveState.phoneDisplay || profile.cleanPhone || profile.rawPhone);
  const isAvailable4h = Boolean(liveState.availabilityConfirmed || profile.availabilityConfirmed);
  const vaultPriceChf = Number(liveState.vaultPriceChf || 29);

  const galleryPhotos: string[] = useMemo(() => {
    const custom = Array.isArray(liveState.customPhotos) ? liveState.customPhotos : [];
    const gal = Array.isArray(profile.gallery) ? profile.gallery : [];
    const base = [
      profile.thumbnail,
      ...gal,
      ...custom,
      "/images/escort-portrait-1.jpg",
    ]
      .filter(Boolean)
      .map((u: string) => String(u).replace(/[?&]iwsn_clean=1.*$/i, ""));
    return Array.from(new Set(base)).slice(0, 6);
  }, [profile.thumbnail, profile.gallery, liveState.customPhotos]);

  const sourcesList = useMemo(() => {
    if (Array.isArray(profile.sources) && profile.sources.length > 0) return profile.sources;
    return [
      {
        portal: profile.sourcePortal || "xdate.ch",
        url: profile.sourceUrl || "https://www.xdate.ch",
        priceChf: rate60,
      },
    ];
  }, [profile.sources, profile.sourcePortal, profile.sourceUrl, rate60]);

  const favBtnCls = isFav
    ? "px-4 py-2 rounded-full border border-rose-500 bg-rose-500/20 text-rose-300 text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer"
    : "px-4 py-2 rounded-full border border-[#C8A97E]/35 bg-[#120E0C] text-[#EAD2AA] text-xs font-mono font-bold inline-flex items-center gap-1.5 cursor-pointer hover:border-[#EAD2AA]";

  return (
    <div className="min-h-screen bg-[#070606] text-[#F5EFE6] pb-36">
      <SEO
        title={profile.rawName + " in " + profile.city + " (" + profile.canton + ") · CHF " + rate60 + " / 60m | iwantsexnow.ch"}
        description={
          profile.rawName +
          " in " +
          profile.city +
          " (" +
          profile.canton +
          "). Schweizer Richtpreis: CHF " +
          rate60 +
          " / 60 Min. (CHF " +
          rate30 +
          " / 30 Min.). Direkter +41 WhatsApp-Kontakt."
        }
        url={"https://iwantsexnow.ch/profile/" + encodeURIComponent(profile.id)}
        image={profile.thumbnail}
      />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Top Breadcrumb & Dossier Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs font-mono text-[#B6A48E]">
            <Link href="/" className="hover:text-[#EAD2AA] inline-flex items-center gap-1.5">
              <ArrowLeft size={13} className="text-[#DEC393]" />
              <span>ZURÜCK ZU DEN SUITEN</span>
            </Link>
            <span>·</span>
            <Link
              href={"/orte/" + String(profile.city || "zug").toLowerCase()}
              className="text-[#DEC393] font-bold hover:underline uppercase"
            >
              KANTON {profile.canton} ({profile.city})
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button type="button" onClick={toggleFav} className={favBtnCls}>
              <Heart size={13} className={isFav ? "fill-rose-400 text-rose-400" : "text-[#DEC393]"} />
              <span>{isFav ? "GEMERKT" : "SUITE MERKEN"}</span>
            </button>
            <Link
              href="/compare-escorts"
              className="px-4 py-2 rounded-full bg-[#120E0C] border border-[#C8A97E]/35 hover:border-[#EAD2AA] text-xs font-mono font-bold text-[#EAD2AA] inline-flex items-center gap-1.5"
            >
              <Scale size={13} className="text-[#DEC393]" />
              <span>VERGLEICHEN</span>
            </Link>
          </div>
        </div>

        {/* Main Dossier Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-7">
          {/* LEFT: Luxury Darkroom Portrait Gallery + 3D Doorplate (lg) */}
          <div className="lg:col-span-5 space-y-3.5">
            <div className="valentina-outer-card rounded-[26px] p-2.5">
              <div className="darkroom-stage relative rounded-[20px] border border-[#C8A97E]/40 aspect-[3/4] w-full">
                <img
                  referrerPolicy="no-referrer"
                  src={galleryPhotos[activePhotoIdx] || galleryPhotos[0]}
                  alt={profile.rawName}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg";
                  }}
                  className="darkroom-img"
                />
                <div className="darkroom-vignette" />
                <div className="darkroom-floor" />

                <div className="absolute top-4 left-4 z-10">
                  <SwissDoorplate
                    state={isAvailable4h ? "FREI" : "RESERVIERT"}
                    roomNumber={"SUITE · " + profile.canton}
                    customLabel={isAvailable4h ? "FREI · 4H LIVE" : "AUF ANFRAGE"}
                    size="lg"
                  />
                </div>

                <div className="absolute inset-x-0 bottom-3 z-10 px-5 text-center">
                  <div className="text-[9px] font-mono tracking-[0.28em] uppercase text-[#C8B69E]">
                    STARTING AT
                  </div>
                  <div className="font-serif font-mono text-3xl text-[#EAD2AA] tracking-wider">
                    CHF {rate60}.–
                  </div>
                  <div className="text-[9px] font-mono tracking-[0.2em] uppercase text-[#A89882]">
                    60 MIN. STANDARD · (30 MIN: CHF {rate30}.–)
                  </div>
                </div>
              </div>
            </div>

            {galleryPhotos.length > 1 && (
              <div className="grid grid-cols-5 gap-2">
                {galleryPhotos.slice(0, 5).map((imgUrl, i) => {
                  const isAct = i === activePhotoIdx;
                  const thumbCls = isAct
                    ? "relative aspect-[3/4] rounded-xl overflow-hidden border-2 border-[#DEC393] cursor-pointer"
                    : "relative aspect-[3/4] rounded-xl overflow-hidden border border-white/15 opacity-70 hover:opacity-100 cursor-pointer";
                  return (
                    <button key={i} type="button" onClick={() => setActivePhotoIdx(i)} className={thumbCls}>
                      <img
                        referrerPolicy="no-referrer"
                        src={imgUrl}
                        alt=""
                        className="w-full h-full object-cover object-top"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* RIGHT: Penthouse Dossier Details, CHF Rate Matrix, Multi-Portal Proof & Vault */}
          <div className="lg:col-span-7 space-y-5">
            <div className="penthouse-panel p-6 sm:p-7 rounded-[24px] border border-[#C8A97E]/35 space-y-6">
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[#C8A97E]/20 pb-4">
                <div>
                  <div className="text-[11px] font-mono font-bold uppercase tracking-[0.22em] text-[#DEC393] flex items-center gap-1.5">
                    <MapPin size={13} />
                    <span>KANTON {profile.canton} · {profile.city}</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-serif font-normal tracking-[0.08em] text-[#EAD2AA] mt-1">
                    {profile.rawName}
                  </h1>
                </div>
                <span className="px-3 py-1 rounded-full bg-black/60 border border-[#C8A97E]/30 text-[10px] text-[#C8B9A6] font-mono">
                  DOSSIER #{String(profile.id).slice(0, 10)}
                </span>
              </div>

              {/* Schweizer Honorar-Tafel (Monospace Chronographen-Stil) */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-black/60 border border-[#C8A97E]/25">
                  <div className="text-[10px] font-mono text-[#A89882] uppercase tracking-widest">
                    30 Min. Express
                  </div>
                  <div className="text-xl font-mono font-extrabold text-[#F5EFE6] mt-1">
                    CHF {rate30}.–
                  </div>
                </div>
                <div
                  style={{
                    background: "linear-gradient(135deg, rgba(222,195,147,0.16) 0%, rgba(135,102,51,0.08) 100%)",
                  }}
                  className="p-4 rounded-2xl border border-[#DEC393]/65"
                >
                  <div className="text-[10px] font-mono text-[#DEC393] uppercase tracking-widest font-bold">
                    60 Min. Standard
                  </div>
                  <div className="text-2xl font-mono font-extrabold text-[#EAD2AA] mt-1">
                    CHF {rate60}.–
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-black/60 border border-[#C8A97E]/25">
                  <div className="text-[10px] font-mono text-[#A89882] uppercase tracking-widest">
                    2 Std. Dinner / Outcall
                  </div>
                  <div className="text-xl font-mono font-extrabold text-[#F5EFE6] mt-1">
                    CHF {rate120}.–
                  </div>
                </div>
              </div>

              {/* Körper- & Dossier-Attribute */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs font-mono">
                <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                  <span className="text-[#9E8C74] block text-[9px] uppercase tracking-wider">Alter</span>
                  <strong className="text-[#EAD2AA]">{profile.age} Jahre</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                  <span className="text-[#9E8C74] block text-[9px] uppercase tracking-wider">Grösse</span>
                  <strong className="text-[#EAD2AA]">{profile.heightCm} cm</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                  <span className="text-[#9E8C74] block text-[9px] uppercase tracking-wider">Oberweite</span>
                  <strong className="text-[#EAD2AA]">Cup {profile.cupSize}</strong>
                </div>
                <div className="p-3 rounded-xl bg-black/50 border border-white/10">
                  <span className="text-[#9E8C74] block text-[9px] uppercase tracking-wider">Haarfarbe</span>
                  <strong className="text-[#EAD2AA]">{profile.hairColor}</strong>
                </div>
              </div>

              {/* Direkte +41 Buchungs- & KI-Preview-Konsole */}
              <div className="p-5 rounded-2xl bg-black/70 border border-[#C8A97E]/45 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-extrabold flex items-center gap-1.5">
                    <ShieldCheck size={14} />
                    <span>DIREKTER +41 KONTAKT (0 % AGENTUR-AUFSCHLAG)</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#EAD2AA]">
                    {cleanPhone || "+41 Direkt-Verbindung"}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {cleanPhone ? (
                    <>
                      <a
                        href={"https://wa.me/" + cleanPhone.replace(/\D/g, "")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="brass-3d py-3 px-4 rounded-full border border-[#F5E3B8]/65 font-sans font-extrabold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2 transition"
                      >
                        <MessageCircle size={14} />
                        <span>WHATSAPP DIREKT</span>
                      </a>
                      <a
                        href={"tel:" + cleanPhone.replace(/\s+/g, "")}
                        className="py-3 px-4 rounded-full bg-white/10 hover:bg-white/15 border border-[#C8A97E]/40 text-[#EAD2AA] font-mono font-bold text-xs tracking-wider uppercase flex items-center justify-center gap-2 transition"
                      >
                        <PhoneCall size={14} />
                        <span>ANRUFEN</span>
                      </a>
                    </>
                  ) : (
                    <Link
                      href={"/messages?profileId=" + encodeURIComponent(profile.id)}
                      className="brass-3d sm:col-span-2 py-3 px-4 rounded-full font-sans font-extrabold text-xs tracking-[0.15em] uppercase flex items-center justify-center gap-2"
                    >
                      <MessageCircle size={14} />
                      <span>DISKRETE TERMIN-ANFRAGE</span>
                    </Link>
                  )}

                  <Link
                    href={"/fantasy-preview?id=" + encodeURIComponent(profile.id)}
                    className="emerald-3d py-3 px-4 rounded-full border border-[#C8A97E]/55 font-sans font-extrabold text-xs tracking-[0.14em] uppercase flex items-center justify-center gap-1.5 transition"
                  >
                    <Sparkles size={14} className="text-[#DEC393]" />
                    <span>🔮 VOICE & PREVIEW</span>
                  </Link>
                </div>
              </div>

              {/* Bio & Services */}
              <div className="space-y-3">
                <div className="flex flex-wrap gap-1.5">
                  {(profile.includedTags || []).map((tag: string, i: number) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-full bg-black/60 border border-[#C8A97E]/30 text-[10px] font-mono uppercase tracking-wider text-[#EAD2AA]"
                    >
                      ✦ {tag}
                    </span>
                  ))}
                </div>
                <p className="text-xs sm:text-sm text-[#D5C7B2] leading-relaxed">
                  {profile.bio ||
                    "Exklusives Schweizer Dossier in " +
                      profile.city +
                      " (Kanton " +
                      profile.canton +
                      "). Diskreter Empfang nach Vereinbarung (30 Min. CHF " +
                      rate30 +
                      ".– / 60 Min. CHF " +
                      rate60 +
                      ".–) oder Begleitung im 5-Sterne-Hotel."}
                </p>
              </div>

              {/* Multi-Portal-Quellenvergleich (Meta-Comparison Box) */}
              <div className="p-4 rounded-2xl bg-black/55 border border-white/10 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-[0.18em] text-[#C8A97E] font-bold">
                  SCHWEIZER META-QUELLENVERGLEICH (VERIFIZIERTE HERKUNFT)
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs font-mono">
                  {sourcesList.slice(0, 3).map((s: any, idx: number) => (
                    <a
                      key={idx}
                      href={s.url || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 hover:border-[#C8A97E]/50 text-[#EAD2AA]"
                    >
                      <span>{s.portal || "xdate.ch"}</span>
                      <span className="text-[#DEC393]">CHF {s.priceChf || rate60}</span>
                      <ExternalLink size={11} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* 80/20 Paid-Vault Box */}
            <div className="penthouse-panel p-6 rounded-[24px] border border-[#DEC393]/55 flex flex-wrap items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-[10px] font-mono uppercase tracking-[0.22em] text-[#DEC393] font-extrabold flex items-center gap-1.5">
                  <Lock size={13} />
                  <span>PRIVATER 80/20 CREATOR-TRESOR ({profile.rawName})</span>
                </div>
                <h2 className="text-lg font-serif text-[#EAD2AA]">
                  {vaultUnlocked
                    ? "✓ Tresor-Galerie auf diesem Gerät freigeschaltet"
                    : "Unzensierte Privat-Galerie & 4K-Loops für CHF " + vaultPriceChf + ".– öffnen (80% an Anbieterin)"}
                </h2>
              </div>
              <Link
                href={"/checkout?profileId=" + encodeURIComponent(profile.id) + "&amount=" + vaultPriceChf}
                className="brass-3d px-6 py-3 rounded-full border border-[#F5E3B8]/65 font-mono font-extrabold text-xs uppercase tracking-[0.16em]"
              >
                🔓 TRESOR ÖFFNEN (CHF {vaultPriceChf}.–) →
              </Link>
            </div>
          </div>
        </section>

        {/* Related Suites in same Canton */}
        {Array.isArray(relatedProfiles) && relatedProfiles.length > 0 && (
          <section className="space-y-4 pt-4">
            <h2 className="text-lg font-serif tracking-[0.12em] uppercase text-[#EAD2AA]">
              Weitere Suiten im Kanton {profile.canton}
            </h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProfiles.map((rel: any) => (
                <Link
                  key={rel.id}
                  href={"/profile/" + encodeURIComponent(rel.id)}
                  className="valentina-outer-card rounded-[20px] p-2 block group"
                >
                  <div className="darkroom-stage relative aspect-[3/4] rounded-[14px] overflow-hidden">
                    <img
                      referrerPolicy="no-referrer"
                      src={rel.thumbnail}
                      alt={rel.rawName}
                      className="darkroom-img"
                    />
                    <div className="darkroom-vignette" />
                    <div className="darkroom-floor" />
                    <div className="absolute inset-x-0 bottom-2 px-3 text-center">
                      <div className="font-serif text-sm text-[#EAD2AA] truncate uppercase tracking-wider">
                        {rel.rawName}
                      </div>
                      <div className="font-mono text-xs text-[#DEC393] font-bold">
                        CHF {rel.rate60Chf}.– / 60M
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* Fixierte Mobile-Thumb-Zone Conversion Bar */}
      <div
        style={{
          background: "linear-gradient(180deg, rgba(16,13,11,0.97) 0%, rgba(7,6,6,0.99) 100%)",
        }}
        className="fixed bottom-[58px] lg:bottom-0 inset-x-0 z-40 backdrop-blur-xl border-t border-[#C8A97E]/45 px-3 py-2.5 shadow-2xl"
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="hidden sm:flex items-center gap-2.5 min-w-0">
            <Crown size={15} className="text-[#DEC393] shrink-0" />
            <div className="truncate">
              <div className="text-xs font-serif font-bold text-[#EAD2AA] truncate">
                {profile.rawName} ({profile.city}, {profile.canton})
              </div>
              <div className="text-[10px] font-mono text-[#DEC393]">
                CHF {rate60}.– / 60M · CHF {rate30}.– / 30M
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {cleanPhone && (
              <a
                href={"https://wa.me/" + cleanPhone.replace(/\D/g, "")}
                target="_blank"
                rel="noopener noreferrer"
                className="brass-3d flex-1 sm:flex-initial px-4 py-2.5 rounded-full border border-[#F5E3B8]/65 font-sans font-extrabold text-[11px] tracking-[0.14em] uppercase text-center"
              >
                💬 WHATSAPP
              </a>
            )}
            <Link
              href={"/fantasy-preview?id=" + encodeURIComponent(profile.id)}
              className="emerald-3d flex-1 sm:flex-initial px-4 py-2.5 rounded-full border border-[#C8A97E]/50 font-sans font-bold text-[11px] tracking-[0.14em] uppercase text-center"
            >
              🔮 5S PREVIEW
            </Link>
            <Link
              href={"/checkout?profileId=" + encodeURIComponent(profile.id) + "&amount=" + vaultPriceChf}
              className="px-3.5 py-2.5 rounded-full bg-black/80 border border-[#C8A97E]/50 text-[#EAD2AA] font-mono font-bold text-[11px] shrink-0"
            >
              🔓 CHF {vaultPriceChf}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}