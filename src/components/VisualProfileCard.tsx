import React from "react";
import Link from "next/link";

export const CARD_FALLBACKS = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1526510747491-58f928ec870f?auto=format&fit=crop&w=700&q=85"
];

export function formatCleanName(raw: any): string {
  const s = String(raw || "").trim();
  if (!s) return "Sofia";
  const cleaned = s.replace(/[✨🔥💎👑💋❤️⭐️•|⚜️❗❕]/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.length > 32 ? cleaned.slice(0, 32).trim() + "…" : cleaned;
}

export function resolveProfilePhoto(offer: any, idx = 0): { primarySrc: string; backupSrc: string; photoCount: number } {
  const pid = String(offer?.id || offer?.dedupClusterId || idx);
  let hash = 0;
  for (let i = 0; i < pid.length; i++) hash = (hash * 31 + pid.charCodeAt(i)) >>> 0;
  const backupSrc = CARD_FALLBACKS[(hash + idx) % CARD_FALLBACKS.length];

  const list = [
    offer?.thumbnail,
    offer?.photoUrl,
    offer?.imageUrl,
    ...(Array.isArray(offer?.gallery) ? offer.gallery : []),
    ...(Array.isArray(offer?.galleryUrls) ? offer.galleryUrls : []),
  ].filter((u) => typeof u === "string" && u.trim().startsWith("http") && !u.includes("placeholder") && !u.endsWith(".svg"));

  if (list.length === 0) {
    return { primarySrc: backupSrc, backupSrc, photoCount: 1 };
  }

  const first = list[0].trim();
  const isDirectUnsplash = first.includes("unsplash.com");
  return {
    primarySrc: isDirectUnsplash ? first : `/api/img?s=${encodeURIComponent(pid)}&u=${encodeURIComponent(first)}`,
    backupSrc,
    photoCount: Math.max(1, list.length),
  };
}

export function VisualProfileCard(props: any) {
  const offer = props?.offer || props?.profile || props?.item || props || {};
  const idx = Number(props?.idx ?? props?.index ?? 0) || 0;
  const liveState = props?.liveState || {};

  const pid = String(offer?.id || offer?.dedupClusterId || `ch-${idx}`);
  const name = formatCleanName(liveState?.displayName || offer?.displayName || offer?.rawName || offer?.name);
  const city = String(liveState?.city || offer?.city || "Zürich").split("/")[0].trim() || "Zürich";
  const canton = String(liveState?.canton || offer?.canton || "ZH").slice(0, 2).toUpperCase();
  const rate60 = Math.max(150, Math.min(1500, Number(liveState?.rate60Chf || offer?.rate60Chf || offer?.advertisedBaseChf) || 350));
  const rate30 = Math.max(100, Number(liveState?.rate30Chf || offer?.rate30Chf) || Math.round((rate60 * 0.6) / 10) * 10);

  const { primarySrc, backupSrc, photoCount } = resolveProfilePhoto(
    liveState?.thumbnail ? { ...offer, thumbnail: liveState.thumbnail } : offer,
    idx
  );

  const rawPhone = String(liveState?.phoneDisplay || offer?.rawPhone || offer?.phone || "").trim();
  let digits = "";
  for (let i = 0; i < rawPhone.length; i++) {
    const c = rawPhone.charCodeAt(i);
    if (c >= 48 && c <= 57) digits += rawPhone[i];
  }
  if (digits.startsWith("0041")) digits = "41" + digits.slice(4);
  else if (digits.startsWith("0")) digits = "41" + digits.slice(1);

  const waHref =
    digits.length >= 10
      ? `https://wa.me/${digits}?text=${encodeURIComponent(`Hoi ${name}, ich habe dein Profil in ${city} auf iwantsexnow.ch gesehen. Hast du heute Zeit?`)}`
      : `/profile/${encodeURIComponent(pid)}`;

  const isLiveConfirmed = Boolean(liveState?.availabilityConfirmed || offer?.availabilityConfirmed);
  const isClaimed = Boolean(liveState?.claimed || offer?.directAuthorized);
  const portalLabel = String(offer?.sourcePortal || "CH-Index").replace(/^www\./, "");

  return (
    <article className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#121621] border border-white/10 hover:border-[#C8A97E]/70 shadow-xl hover:-translate-y-1 transition-all duration-300">
      <Link href={`/profile/${encodeURIComponent(pid)}`} className="relative aspect-[3/4] w-full overflow-hidden bg-[#1A2030] block no-underline">
        <img
          referrerPolicy="no-referrer"
          src={primarySrc}
          alt={`${name} – ${city}`}
          loading={idx < 8 ? "eager" : "lazy"}
          onError={(e) => {
            const img = e.currentTarget as HTMLImageElement;
            if (img.src !== backupSrc) img.src = backupSrc;
          }}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E16] via-[#0B0E16]/20 to-black/25 pointer-events-none" />

        {/* Oben links: Live / Kanton Türschild-Badge */}
        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          {isLiveConfirmed ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-wider shadow">
              <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping" />
              FREI · 4H LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-emerald-300 text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {canton} · Aktiv
            </span>
          )}
        </div>

        {/* Oben rechts: Foto-Zähler & Quelle */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold">
            📸 {photoCount}
          </span>
        </div>

        {/* Unten im Bild: Name, Ort & Honorar */}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-white leading-tight truncate drop-shadow">{name}</h3>
            <p className="text-xs text-gray-200 mt-0.5 truncate">
              📍 {city} ({canton}) · <span className="text-[#C8A97E]">{isClaimed ? "Direktprofil" : portalLabel}</span>
            </p>
          </div>
          <div className="shrink-0 px-2.5 py-1 rounded-xl bg-black/85 border border-[#C8A97E]/50 text-right">
            <span className="block text-[9px] uppercase text-gray-400 leading-none">60 Min.</span>
            <span className="text-xs font-extrabold text-[#C8A97E]">CHF {rate60}</span>
          </div>
        </div>
      </Link>

      {/* Kompakter Aktions-Fuss */}
      <div className="p-3 bg-[#121621] flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>30 Min. ab CHF {rate30}</span>
          {digits.length >= 10 ? (
            <span className="text-emerald-400 font-semibold">✓ +41 WhatsApp direkt</span>
          ) : (
            <span className="text-gray-300">Geprüfter Index</span>
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {digits.length >= 10 ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-[#06130B] font-extrabold text-xs text-center no-underline transition"
            >
              WhatsApp
            </a>
          ) : (
            <Link
              href={`/profile/${encodeURIComponent(pid)}`}
              className="py-2 px-3 rounded-xl bg-[#C8A97E] hover:bg-[#b89668] text-black font-extrabold text-xs text-center no-underline transition"
            >
              Kontakt
            </Link>
          )}
          <Link
            href={`/profile/${encodeURIComponent(pid)}`}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white font-bold text-xs text-center no-underline transition"
          >
            Fotos & Profil →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default VisualProfileCard;