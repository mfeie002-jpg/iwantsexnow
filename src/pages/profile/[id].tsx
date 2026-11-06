import React, { useState, useEffect, useMemo } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { SEO } from "@/components/SEO";
import { LuxuryHeader } from "@/components/LuxuryHeader";
import offersData from "@/data/harvested-offers.json";
import {
  MapPin,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Heart,
  Scale,
  Sparkles,
  MessageSquare,
  AlertTriangle,
  ArrowLeft,
  ExternalLink,
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
  return `+41 ${local.slice(1, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`;
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
      thumbnail: o.thumbnail || "/images/escort-portrait-1.jpg",
      age: Number(o.age) || 25,
      cupSize: o.cupSize || "C",
    }));

  return {
    props: {
      profile: {
        ...found,
        id: pid,
        rawName: found.rawName || "Verifiziertes Schweizer Profil",
        city: found.city || "Zug",
        canton: found.canton || "ZG",
        rate60Chf: r60,
        rate30Chf: r30,
        cleanPhone,
        thumbnail: found.thumbnail || "/images/escort-portrait-1.jpg",
        age: Number(found.age) || 25,
        heightCm: Number(found.heightCm) || 168,
        cupSize: found.cupSize || "C",
        hairColor: found.hairColor || "Brünett",
        languages: Array.isArray(found.languages) ? found.languages : ["Deutsch", "Englisch"],
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
  const [claimContact, setClaimContact] = useState("");
  const [claimSent, setClaimSent] = useState(false);

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

  const handleClaimRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!claimContact.trim()) return;
    try {
      const r = await fetch("/api/claims/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          profileId: profile.id,
          contact: claimContact,
          note: `Schnell-Übernahme angefordert auf /profile/${profile.id}`,
        }),
      });
      const d = await r.json();
      if (d?.ok) setClaimSent(true);
    } catch {}
  };

  const rate60 = Math.max(100, Math.min(1200, Number(liveState.rate60Chf || profile.rate60Chf) || 350));
  const rate30 = Math.max(80, Math.min(800, Number(liveState.rate30Chf || profile.rate30Chf) || Math.round((rate60 * 0.6) / 10) * 10));
  const rate120 = Math.round((rate60 * 1.85) / 10) * 10;
  const cleanPhone = normalizeSwissPhone(liveState.phoneDisplay || profile.cleanPhone || profile.rawPhone);
  const isAvailable4h = Boolean(liveState.availabilityConfirmed || profile.availabilityConfirmed);
  const isVerified = Boolean(liveState.identityVerified || profile.identityVerified);
  const vaultPriceChf = Number(liveState.vaultPriceChf || 29);

  const galleryPhotos: string[] = useMemo(() => {
    const custom = Array.isArray(liveState.customPhotos) ? liveState.customPhotos : [];
    const base = [
      profile.thumbnail || "/images/escort-portrait-1.jpg",
      ...custom,
      "/images/escort-portrait-2.jpg",
      "/images/escort-portrait-3.jpg",
    ];
    return Array.from(new Set(base.filter(Boolean))).slice(0, 6);
  }, [profile.thumbnail, liveState.customPhotos]);

  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${profile.rawName} — Escort & Begleitung in ${profile.city} (${profile.canton})`,
    description: profile.bio || `Verifiziertes Schweizer Profil in ${profile.city} (${profile.canton}).`,
    areaServed: { "@type": "City", name: profile.city },
    offers: {
      "@type": "Offer",
      priceCurrency: "CHF",
      price: String(rate60),
      availability: isAvailable4h ? "https://schema.org/InStock" : "https://schema.org/PreOrder",
    },
  };

  return (
    <div className="min-h-screen bg-[#0D111A] text-[#F5F2EB] pb-36">
      <SEO
        title={`${profile.rawName} in ${profile.city} (${profile.canton}) · CHF ${rate60}.– / 60m & +41 Direktkontakt | iwantsexnow.ch`}
        description={`${profile.rawName} (${profile.age} J., ${profile.heightCm} cm, Cup ${profile.cupSize}) in ${profile.city} (${profile.canton}). Honorar: CHF ${rate60}.– / 60 Min. (CHF ${rate30}.– / 30 Min.). Direkter +41 Kontakt ohne Provision.`}
        url={`https://iwantsexnow.ch/profile/${encodeURIComponent(profile.id)}`}
        image={profile.thumbnail}
        schemaJson={personSchema}
      />
      <LuxuryHeader />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* Top Breadcrumb & Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-gray-400">
            <Link href="/search" className="hover:text-white inline-flex items-center gap-1">
              <ArrowLeft size={13} /> Zurück zur Suche
            </Link>
            <span>·</span>
            <Link href={`/orte/${String(profile.city || "zug").toLowerCase()}`} className="text-[#C8A97E] font-bold hover:underline">
              Kanton {profile.canton} ({profile.city})
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleFav}
              className={`px-3.5 py-2 rounded-xl border text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer transition ${
                isFav ? "bg-rose-500/20 border-rose-500 text-rose-300" : "bg-[#121722] border-white/15 text-gray-200 hover:border-[#C8A97E]"
              }`}
            >
              <Heart size={13} className={isFav ? "fill-rose-400 text-rose-400" : ""} />
              <span>{isFav ? "Auf deiner Merkliste" : "Merken"}</span>
            </button>
            <Link
              href="/compare-escorts"
              className="px-3.5 py-2 rounded-xl bg-[#121722] border border-white/15 hover:border-[#C8A97E] text-xs font-bold text-gray-200 inline-flex items-center gap-1.5"
            >
              <Scale size={13} className="text-[#C8A97E]" /> Vergleichen
            </Link>
          </div>
        </div>

        {/* Haupt-Profil-Grid */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Linke Spalte: Porträt & Foto-Galerie */}
          <div className="lg:col-span-5 space-y-3">
            <div className="relative rounded-2xl overflow-hidden bg-[#121722] border border-[#C8A97E]/40 h-96 sm:h-[460px]">
              <img
                src={galleryPhotos[0]}
                alt={profile.rawName}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg";
                }}
                className="w-full h-full object-cover object-top"
              />
              <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                {isAvailable4h && (
                  <span className="px-3 py-1 rounded-full bg-emerald-500 text-[#07120B] text-xs font-extrabold shadow">
                    ● Jetzt für 4h verfügbar
                  </span>
                )}
                {isVerified && (
                  <span className="px-3 py-1 rounded-full bg-[#C8A97E] text-[#0D111A] text-xs font-extrabold shadow">
                    ✓ Geprüfte Originalfotos
                  </span>
                )}
              </div>
              <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-black/85 border border-white/15 text-sm font-extrabold text-[#C8A97E]">
                CHF {rate60}.– <span className="text-[11px] text-gray-300 font-normal">/ 60 Min.</span>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5">
              {galleryPhotos.slice(1, 4).map((imgUrl, idx) => (
                <div key={idx} className="h-28 rounded-xl overflow-hidden bg-[#121722] border border-white/10">
                  <img
                    src={imgUrl}
                    alt={`${profile.rawName} Foto ${idx + 2}`}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg";
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Rechte Spalte: Details, CHF-Tarife, +41 Kontakt & 80/20 Paid-Vault */}
          <div className="lg:col-span-7 space-y-5">
            <div className="p-6 rounded-2xl bg-[#121722] border border-white/10 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="text-xs font-extrabold uppercase tracking-wider text-[#C8A97E] flex items-center gap-1.5">
                    <MapPin size={14} /> KANTON {profile.canton} · {profile.city}
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white mt-1">
                    {profile.rawName}
                  </h1>
                </div>
                <span className="px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-[11px] text-gray-300 font-mono">
                  ID: {profile.id}
                </span>
              </div>

              {liveState.statusMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-emerald-200 font-medium">
                  <strong>Aktueller Live-Status:</strong> „{liveState.statusMessage}“
                </div>
              )}

              {/* Transparente Schweizer CHF-Honorar-Matrix */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#0D111A] border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">30 Min. Express</div>
                  <div className="text-lg font-extrabold text-white mt-0.5">CHF {rate30}.–</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D111A] border border-[#C8A97E]/60">
                  <div className="text-[10px] text-[#C8A97E] uppercase font-bold">60 Min. Standard</div>
                  <div className="text-lg font-extrabold text-[#C8A97E] mt-0.5">CHF {rate60}.–</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D111A] border border-white/10">
                  <div className="text-[10px] text-gray-400 uppercase font-bold">2 Std. Dinner / Outcall</div>
                  <div className="text-lg font-extrabold text-white mt-0.5">CHF {rate120}.–</div>
                </div>
              </div>

              {/* Physische Attribute & Sprachen */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                <div className="p-3 rounded-xl bg-[#0D111A] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Alter</span>
                  <strong className="text-white">{profile.age} Jahre</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#0D111A] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Grösse</span>
                  <strong className="text-white">{profile.heightCm} cm</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#0D111A] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Körbchengrösse</span>
                  <strong className="text-white">Cup {profile.cupSize}</strong>
                </div>
                <div className="p-3 rounded-xl bg-[#0D111A] border border-white/5">
                  <span className="text-gray-400 block text-[10px]">Haarfarbe</span>
                  <strong className="text-white">{profile.hairColor}</strong>
                </div>
              </div>

              {/* Direkter +41 Kontakt-Block */}
              <div className="p-4 rounded-2xl bg-[#0D111A] border border-emerald-500/40 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold">
                      DIREKTER SCHWEIZER +41 KONTAKT (0 % VERMITTLUNGSPROVISION)
                    </div>
                    <div className="text-base font-extrabold text-white mt-0.5">
                      {cleanPhone || "Diskrete Termin-Anfrage über Direkt-Messenger"}
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-bold">
                    Bar / TWINT vor Ort
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {cleanPhone ? (
                    <>
                      <a
                        href={`tel:${cleanPhone.replace(/\s+/g, "")}`}
                        className="py-3 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-extrabold text-xs text-center"
                      >
                        📞 Direkt anrufen ({cleanPhone})
                      </a>
                      <a
                        href={`https://wa.me/${cleanPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                          `Hallo ${profile.rawName}, ich habe dein Profil auf iwantsexnow.ch (${profile.city}) gesehen und möchte gerne einen Termin anfragen.`
                        )}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="py-3 px-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07120B] font-extrabold text-xs text-center shadow"
                      >
                        💬 WhatsApp Direkt-Chat starten →
                      </a>
                    </>
                  ) : (
                    <Link
                      href={`/messages?profileId=${encodeURIComponent(profile.id)}`}
                      className="sm:col-span-2 py-3 px-4 rounded-xl bg-emerald-500 text-[#07120B] font-extrabold text-xs text-center"
                    >
                      📨 Diskrete Termin-Anfrage senden →
                    </Link>
                  )}
                </div>
              </div>

              {/* Beschreibung & Inklusiv-Tags */}
              <div className="space-y-2 pt-1">
                <h2 className="text-sm font-serif font-bold text-white">Über {profile.rawName} & Service-Details</h2>
                <p className="text-xs text-gray-300 leading-relaxed whitespace-pre-line">
                  {liveState.bioOverride ||
                    profile.bio ||
                    `Willkommen auf meinem unabhängigen Schweizer Profil in ${profile.city} (${profile.canton}). Ich empfange dich diskret nach Terminvereinbarung (30 Min. CHF ${rate30}.– / 60 Min. CHF ${rate60}.–) oder besuche dich im Hotel (Outcall).`}
                </p>
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {(profile.includedTags || []).map((t: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-[#0D111A] border border-white/10 text-[11px] text-[#C8A97E] font-semibold">
                      ✓ {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* 80/20 Paid-Vault Tresor-Modul */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#171E2E] to-[#121722] border border-[#C8A97E]/50 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <div className="text-[10px] uppercase tracking-widest text-[#C8A97E] font-extrabold flex items-center gap-1.5">
                    <Lock size={13} /> PRIVATER FOTO- & VIDEO-TRESOR (80 % DIREKT AN {profile.rawName.toUpperCase()})
                  </div>
                  <h2 className="text-lg font-serif font-bold text-white mt-0.5">
                    {vaultUnlocked
                      ? `✓ Tresor von ${profile.rawName} ist auf deinem Gerät freigeschaltet`
                      : `Exklusive unzensierte Galerie & Clips von ${profile.rawName} freischalten`}
                  </h2>
                </div>
                <span className="text-xl font-extrabold text-[#C8A97E]">CHF {vaultPriceChf}.–</span>
              </div>

              {vaultUnlocked ? (
                <div className="grid grid-cols-3 gap-3 pt-1">
                  {galleryPhotos.map((u, idx) => (
                    <div key={idx} className="h-32 rounded-xl overflow-hidden border border-emerald-500/40">
                      <img src={u} alt="Vault Unlocked" className="w-full h-full object-cover object-top" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                  <p className="text-xs text-gray-300 max-w-md">
                    Einmalige Freischaltung ohne Abo via TWINT, Karte oder Krypto. <strong>CHF {(vaultPriceChf * 0.8).toFixed(2)} (80 %)</strong> gehen direkt an {profile.rawName}.
                  </p>
                  <Link
                    href={`/checkout?profileId=${encodeURIComponent(profile.id)}&amount=${vaultPriceChf}`}
                    className="px-5 py-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs uppercase tracking-wider"
                  >
                    🔓 Tresor für CHF {vaultPriceChf}.– öffnen →
                  </Link>
                </div>
              )}
            </div>

            {/* Selbstverwaltungs-Claim & Sofort-Opt-Out */}
            <div className="p-4 rounded-2xl bg-[#121722] border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <strong className="text-white">Bist du {profile.rawName}?</strong>{" "}
                <span className="text-gray-400">Übernimm dein Profil kostenlos (Preise, Fotos & 80% Vault selbst steuern):</span>
              </div>
              {claimSent ? (
                <span className="text-emerald-400 font-bold">✓ Anfrage im Admin-Cockpit hinterlegt!</span>
              ) : (
                <form onSubmit={handleClaimRequest} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={claimContact}
                    onChange={(e) => setClaimContact(e.target.value)}
                    placeholder="Deine +41 WhatsApp-Nr."
                    className="rounded-xl bg-[#0D111A] border border-white/15 px-3 py-1.5 text-xs text-white"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/15 text-[#C8A97E] font-bold cursor-pointer"
                  >
                    Profil übernehmen
                  </button>
                </form>
              )}
              <Link href={`/report?profileId=${encodeURIComponent(profile.id)}`} className="text-rose-400/80 hover:text-rose-300 underline ml-auto">
                1-Klick Opt-Out / Melden
              </Link>
            </div>
          </div>
        </section>

        {/* Ähnliche Profile im selben Kanton */}
        {Array.isArray(relatedProfiles) && relatedProfiles.length > 0 && (
          <section className="space-y-4 pt-6 border-t border-white/10">
            <h2 className="text-lg font-serif font-bold text-white">
              Weitere geprüfte Profile im Kanton {profile.canton}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProfiles.map((rp: any) => (
                <Link
                  key={rp.id}
                  href={`/profile/${encodeURIComponent(rp.id)}`}
                  className="p-3.5 rounded-2xl bg-[#121722] border border-white/10 hover:border-[#C8A97E] flex items-center gap-3 transition"
                >
                  <img
                    src={rp.thumbnail || "/images/escort-portrait-1.jpg"}
                    alt={rp.rawName}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/images/escort-portrait-1.jpg";
                    }}
                    className="w-14 h-14 rounded-xl object-cover object-top shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="text-sm font-bold text-white truncate">{rp.rawName}</div>
                    <div className="text-[11px] text-gray-400">
                      {rp.city} ({rp.canton}) · {rp.age} J.
                    </div>
                    <div className="text-xs font-extrabold text-[#C8A97E]">CHF {rp.rate60Chf}.– / 60m</div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* mobile-sticky-cta-bar: Fester Daumen-Kontaktbalken für +41 Anruf, WhatsApp & Paid-Vault */}
      <div className="fixed bottom-[58px] lg:bottom-0 inset-x-0 z-40 bg-[#121722]/95 backdrop-blur-md border-t border-[#C8A97E]/40 px-3 py-2.5 shadow-2xl">
        <div className="max-w-5xl mx-auto flex items-center justify-between gap-2">
          <div className="hidden sm:block min-w-0">
            <div className="text-xs font-extrabold text-white truncate">
              {profile.rawName} ({profile.city}, {profile.canton})
            </div>
            <div className="text-[11px] text-[#C8A97E] font-bold">
              CHF {rate60}.– / 60 Min. · CHF {rate30}.– / 30 Min.
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {cleanPhone ? (
              <>
                <a
                  href={`tel:${cleanPhone.replace(/\s+/g, "")}`}
                  className="flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-extrabold text-xs text-center"
                >
                  📞 Anrufen
                </a>
                <a
                  href={`https://wa.me/${cleanPhone.replace(/\D/g, "")}?text=${encodeURIComponent(
                    `Hallo ${profile.rawName}, ich habe dein Profil auf iwantsexnow.ch (${profile.city}) gesehen und möchte gerne einen Termin anfragen.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-[#07120B] font-extrabold text-xs text-center shadow"
                >
                  💬 WhatsApp Direkt
                </a>
              </>
            ) : (
              <Link
                href={`/messages?profileId=${encodeURIComponent(profile.id)}`}
                className="flex-1 sm:flex-initial px-4 py-2.5 rounded-xl bg-emerald-500 text-[#07120B] font-extrabold text-xs text-center"
              >
                📨 Termin anfragen
              </Link>
            )}

            <Link
              href={`/checkout?profileId=${encodeURIComponent(profile.id)}&amount=${vaultPriceChf}`}
              className="px-3.5 py-2.5 rounded-xl bg-[#C8A97E] hover:bg-[#b89566] text-[#0D111A] font-extrabold text-xs text-center shrink-0"
            >
              🔓 Vault (80%)
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}