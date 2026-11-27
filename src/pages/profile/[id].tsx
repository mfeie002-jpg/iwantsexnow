import React, { useState, useEffect, useMemo } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import rawOffers from "@/data/harvested-offers.json";
import { extractPhotoUrls, toProxiedImg, getSeedFallback, cleanSwissDigits } from "@/components/LuxuryPhotoCard";

export default function ProfileDetailPage() {
  const router = useRouter();
  const id = String(router.query.id || "").trim();

  const allOffers: any[] = useMemo(() => (Array.isArray(rawOffers) ? (rawOffers as any[]) : []), []);
  const offer = useMemo(
    () => allOffers.find((o) => String(o?.id || o?.dedupClusterId) === id) || null,
    [allOffers, id]
  );

  const [liveState, setLiveState] = useState<any>(null);
  const [activePhoto, setActivePhoto] = useState<number>(0);

  useEffect(() => {
    setActivePhoto(0);
    if (!id) return;
    fetch("/api/vault/metrics")
      .then((r) => r.json())
      .then((d) => {
        if (d?.states?.[id]) setLiveState(d.states[id]);
      })
      .catch(() => {});
  }, [id]);

  if (!router.isReady) {
    return <div className="min-h-screen bg-[#0B0E14] text-white flex items-center justify-center">Profil wird geladen…</div>;
  }

  if (!offer || liveState?.hidden) {
    return (
      <div className="min-h-screen bg-[#0B0E14] text-white flex flex-col items-center justify-center p-6 text-center space-y-4">
        <h1 className="text-2xl font-serif font-bold">Profil nicht verfügbar</h1>
        <p className="text-sm text-gray-400">Dieser Eintrag existiert nicht mehr oder wurde per Opt-Out ausgeblendet.</p>
        <Link href="/" className="px-5 py-2.5 rounded-xl bg-[#C8A97E] text-black font-bold text-xs no-underline">← Zurück zu allen Profilen</Link>
      </div>
    );
  }

  const pid = String(offer.id || offer.dedupClusterId);
  const name = String(liveState?.displayName || offer.rawName || "Profil").trim();
  const city = String(liveState?.city || offer.city || "Zürich");
  const canton = String(liveState?.canton || offer.canton || "ZH").toUpperCase();
  const rate60 = Math.max(120, Math.min(1200, Number(liveState?.rate60Chf || offer.advertisedBaseChf) || 350));
  const rate30 = Math.max(80, Number(liveState?.rate30Chf || offer.rate30Chf) || Math.round((rate60 * 0.6) / 10) * 10);

  const rawGallery = extractPhotoUrls(liveState?.thumbnail ? { ...offer, thumbnail: liveState.thumbnail } : offer);
  const fallback = getSeedFallback(pid);
  const gallery = rawGallery.length > 0 ? rawGallery.map((u, i) => toProxiedImg(u, `${pid}-${i}`)) : [fallback];
  const currentImg = gallery[activePhoto] || gallery[0];

  const phoneRaw = String(liveState?.phoneDisplay || offer.rawPhone || "").trim();
  const digits = cleanSwissDigits(phoneRaw);
  const tags: string[] = Array.isArray(offer.includedTags) ? offer.includedTags : ["GFE", "Incall", "Outcall"];

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#F5F2EB] pb-16">
      <Head>
        <title>{`${name} in ${city} (${canton}) · CHF ${rate60} | iwantsexnow.ch`}</title>
      </Head>

      <header className="bg-[#0B0E14]/95 border-b border-white/10 px-4 sm:px-6 h-16 flex items-center justify-between max-w-6xl mx-auto">
        <Link href="/" className="text-sm font-bold text-[#C8A97E] no-underline">← Alle Schweizer Profile</Link>
        <Link href={`/report?id=${encodeURIComponent(pid)}&name=${encodeURIComponent(name)}`} className="text-xs text-gray-400 hover:text-rose-300 no-underline">
          Opt-Out / Profil melden
        </Link>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-6 grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Linke Spalte: Grosse Foto-Galerie */}
        <div className="lg:col-span-6 space-y-3">
          <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#151A26] border border-white/10">
            <img
              referrerPolicy="no-referrer"
              src={currentImg}
              alt={name}
              onError={(e) => {
                const el = e.currentTarget as HTMLImageElement;
                if (el.src !== fallback) el.src = fallback;
              }}
              className="w-full h-full object-cover object-top"
            />
          </div>

          {gallery.length > 1 && (
            <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
              {gallery.map((g, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setActivePhoto(i)}
                  className={`aspect-[3/4] rounded-xl overflow-hidden border cursor-pointer ${activePhoto === i ? "border-2 border-[#C8A97E]" : "border-white/15 opacity-75 hover:opacity-100"}`}
                >
                  <img
                    referrerPolicy="no-referrer"
                    src={g}
                    alt={`${name} ${i + 1}`}
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = fallback; }}
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Rechte Spalte: Schweizer Honorartafel, Attribute & Direktkontakt */}
        <div className="lg:col-span-6 space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/15 text-xs text-emerald-300 font-bold">
              📍 {city} ({canton}) · Quelle: {offer.sourcePortal || "CH-Direkt"}
            </div>
            <h1 className="text-2xl sm:text-4xl font-serif font-bold text-white">{name}</h1>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-2xl bg-[#141926] border border-white/10">
              <div className="text-xs text-gray-400">30 Minuten Richtwert</div>
              <div className="text-2xl font-extrabold text-white mt-1">CHF {rate30}</div>
            </div>
            <div className="p-4 rounded-2xl bg-[#141926] border border-[#C8A97E]/50">
              <div className="text-xs text-[#C8A97E]">60 Minuten Honorar (0% Provision)</div>
              <div className="text-2xl font-extrabold text-[#C8A97E] mt-1">CHF {rate60}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {offer.age && <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-gray-400 block">Alter</span><strong>{offer.age} Jahre</strong></div>}
            {offer.heightCm && <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-gray-400 block">Grösse</span><strong>{offer.heightCm} cm</strong></div>}
            {offer.cupSize && <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-gray-400 block">Körbchen</span><strong>Cup {offer.cupSize}</strong></div>}
            {offer.hairColor && <div className="p-3 rounded-xl bg-white/5 border border-white/10"><span className="text-gray-400 block">Haare</span><strong>{offer.hairColor}</strong></div>}
          </div>

          <div className="space-y-2.5">
            {digits.length >= 10 && (
              <a
                href={`https://wa.me/${digits}?text=${encodeURIComponent(`Hoi ${name}, ich habe dein Profil in ${city} auf iwantsexnow.ch gesehen. Hast du heute Zeit?`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-4 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] text-[#05140B] font-extrabold text-sm text-center no-underline shadow-lg"
              >
                💬 Direkt per WhatsApp schreiben ({phoneRaw})
              </a>
            )}
            {digits.length >= 10 && (
              <a
                href={`tel:+${digits}`}
                className="block w-full py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/15 text-white font-bold text-sm text-center no-underline"
              >
                📞 Direkt anrufen ({phoneRaw})
              </a>
            )}
            {offer.sourceUrl && (
              <a
                href={offer.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full py-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold text-center no-underline"
              >
                Original-Inserat auf {offer.sourcePortal || "Quellportal"} prüfen ↗
              </a>
            )}
          </div>

          <div className="p-5 rounded-2xl bg-[#141926] border border-white/10 space-y-3">
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#C8A97E]">Beschreibung & Services</h2>
            <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-line">
              {liveState?.bio || offer.bio || `${name} in ${city} (${canton}). Direkte Terminvereinbarung ohne Plattform-Provision.`}
            </p>
            <div className="flex flex-wrap gap-1.5 pt-2">
              {tags.map((t, i) => (
                <span key={i} className="px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-200">{t}</span>
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-gray-300">Bist du {name}? Übernimm dein Profil kostenlos (Live-Status & 80/20 Vault).</span>
            <Link href={`/login?claim=${encodeURIComponent(pid)}`} className="px-4 py-2 rounded-xl bg-[#C8A97E] text-black font-extrabold no-underline">
              Profil gratis übernehmen →
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}