import React from "react";
import Link from "next/link";

const BACKUP_PHOTOS = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=85"
];

export function extractPhotoUrls(offer: any): string[] {
  const raw = [
    offer?.thumbnail,
    offer?.photoUrl,
    offer?.imageUrl,
    ...(Array.isArray(offer?.gallery) ? offer.gallery : []),
    ...(Array.isArray(offer?.galleryUrls) ? offer.galleryUrls : []),
  ];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    let s = item.trim();
    const qIdx = s.indexOf("?iwsn_clean=");
    if (qIdx > 0) s = s.slice(0, qIdx);
    if (s.startsWith("http") && !s.includes("placeholder") && !s.endsWith(".svg")) {
      if (!out.includes(s)) out.push(s);
    }
  }
  return out;
}

export function toProxiedImg(url: string, seed: string): string {
  if (!url || !url.startsWith("http")) return getSeedFallback(seed);
  if (url.includes("images.unsplash.com")) return url;
  return `/api/img?s=${encodeURIComponent(seed)}&u=${encodeURIComponent(url)}`;
}

export function getSeedFallback(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return BACKUP_PHOTOS[h % BACKUP_PHOTOS.length];
}

export function cleanSwissDigits(rawPhone: string): string {
  const s = String(rawPhone || "");
  let d = "";
  for (let i = 0; i < s.length; i++) {
    const c = s.charCodeAt(i);
    if (c >= 48 && c <= 57) d += s[i];
  }
  if (d.startsWith("0041")) d = "41" + d.slice(4);
  else if (d.startsWith("0")) d = "41" + d.slice(1);
  return d;
}

export default function LuxuryPhotoCard({ offer, idx = 0, liveState }: { offer: any; idx?: number; liveState?: any }) {
  const pid = String(offer?.id || offer?.dedupClusterId || `ch-${idx}`);
  const rawTitle = String(liveState?.displayName || offer?.displayName || offer?.rawName || "Sofia").trim();
  const name = rawTitle.length > 34 ? rawTitle.slice(0, 34).trim() + "…" : rawTitle;
  const city = String(liveState?.city || offer?.city || "Zürich").split("/")[0].trim() || "Zürich";
  const canton = String(liveState?.canton || offer?.canton || "ZH").slice(0, 2).toUpperCase();
  const rate60 = Math.max(120, Math.min(1200, Number(liveState?.rate60Chf || offer?.advertisedBaseChf || offer?.rate60Chf) || 350));
  const rate30 = Math.max(80, Number(liveState?.rate30Chf || offer?.rate30Chf) || Math.round((rate60 * 0.6) / 10) * 10);

  const photos = extractPhotoUrls(liveState?.thumbnail ? { ...offer, thumbnail: liveState.thumbnail } : offer);
  const backupSrc = getSeedFallback(pid);
  const imgSrc = photos.length > 0 ? toProxiedImg(photos[0], pid) : backupSrc;

  const digits = cleanSwissDigits(liveState?.phoneDisplay || offer?.rawPhone || "");
  const isAvailable = Boolean(liveState?.availabilityConfirmed || offer?.availabilityConfirmed);
  const isDirect = Boolean(liveState?.claimed || offer?.directAuthorized);
  const portal = String(offer?.sourcePortal || "CH-Index").replace("www.", "");

  const waLink =
    digits.length >= 10
      ? `https://wa.me/${digits}?text=${encodeURIComponent(`Hoi ${name}, ich habe dein Profil in ${city} auf iwantsexnow.ch gesehen. Hast du heute Zeit?`)}`
      : `/profile/${encodeURIComponent(pid)}`;

  return (
    <article className="group flex flex-col rounded-2xl overflow-hidden bg-[#121621] border border-white/10 hover:border-[#C8A97E]/75 shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/profile/${encodeURIComponent(pid)}`} className="relative aspect-[3/4] w-full block overflow-hidden bg-[#191F2E] no-underline">
        <img
          referrerPolicy="no-referrer"
          src={imgSrc}
          alt={`${name} – ${city}`}
          loading={idx < 8 ? "eager" : "lazy"}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            if (el.src !== backupSrc) el.src = backupSrc;
          }}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-black/20 to-black/20 pointer-events-none" />

        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          {isAvailable ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500 text-black text-[10px] font-extrabold uppercase tracking-wider">
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

        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-semibold">
          📸 {Math.max(1, photos.length)}
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-white leading-tight truncate drop-shadow">{name}</h3>
            <p className="text-xs text-gray-200 mt-0.5 truncate">
              📍 {city} ({canton}) · <span className="text-[#C8A97E]">{isDirect ? "Direktprofil" : portal}</span>
            </p>
          </div>
          <div className="shrink-0 px-2.5 py-1 rounded-xl bg-black/85 border border-[#C8A97E]/50 text-right">
            <span className="block text-[9px] uppercase text-gray-400 leading-none">60 Min.</span>
            <span className="text-xs font-extrabold text-[#C8A97E]">CHF {rate60}</span>
          </div>
        </div>
      </Link>

      <div className="p-3 bg-[#121621] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>30 Min. ab CHF {rate30}</span>
          <span>{ offer?.age ? `${offer.age} J.` : "" }{ offer?.cupSize ? ` · Cup ${offer.cupSize}` : "" }</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {digits.length >= 10 ? (
            <a
              href={waLink}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-[#05140B] font-extrabold text-xs text-center no-underline"
            >
              WhatsApp
            </a>
          ) : (
            <Link
              href={`/profile/${encodeURIComponent(pid)}`}
              className="py-2 px-3 rounded-xl bg-[#C8A97E] text-black font-extrabold text-xs text-center no-underline"
            >
              Kontakt
            </Link>
          )}
          <Link
            href={`/profile/${encodeURIComponent(pid)}`}
            className="py-2 px-3 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white font-bold text-xs text-center no-underline"
          >
            Fotos & Details →
          </Link>
        </div>
      </div>
    </article>
  );
}