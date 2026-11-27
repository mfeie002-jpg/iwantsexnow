import React from "react";
import Link from "next/link";

const BAD_IMG_TOKENS = ["bg_blur", "example.com", "placeholder", "escort-portrait", ".svg"];

export function getLocalAiPortrait(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return `/images/ai/portraits/p${(h % 8) + 1}.webp`;
}

export function extractPhotoUrls(offer: any): string[] {
  const raw = [
    offer?.thumbnail,
    offer?.photoUrl,
    offer?.imageUrl,
    ...(Array.isArray(offer?.gallery) ? offer.gallery : []),
    ...(Array.isArray(offer?.galleryUrls) ? offer.galleryUrls : [])
  ];
  const out: string[] = [];
  for (const item of raw) {
    if (typeof item !== "string") continue;
    let s = item.trim();
    const qIdx = s.indexOf("?iwsn_clean=");
    if (qIdx > 0) s = s.slice(0, qIdx);
    if (!s) continue;
    const low = s.toLowerCase();
    if (BAD_IMG_TOKENS.some((b) => low.includes(b))) continue;
    if (s.startsWith("/images/ai/") || s.startsWith("http://") || s.startsWith("https://")) {
      if (!out.includes(s)) out.push(s);
    }
  }
  return out;
}

export function toProxiedImg(url: string, seed: string): string {
  if (!url) return getLocalAiPortrait(seed);
  if (url.startsWith("/images/")) return url;
  if (!url.startsWith("http")) return getLocalAiPortrait(seed);
  return `/api/img?s=${encodeURIComponent(seed)}&u=${encodeURIComponent(url)}`;
}

export function getSeedFallback(seed: string): string {
  return getLocalAiPortrait(seed);
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
  const rawTitle = String(liveState?.displayName || offer?.displayName || offer?.rawName || "Begleiterin").trim();
  const cleanTitle = rawTitle.split("|")[0].trim();
  const name = cleanTitle.length > 30 ? cleanTitle.slice(0, 30).trim() + "…" : cleanTitle;

  const city = String(liveState?.city || offer?.city || "Zürich").split("/")[0].trim() || "Zürich";
  const canton = String(liveState?.canton || offer?.canton || "ZH").slice(0, 2).toUpperCase();
  const rate60 = Math.max(150, Math.min(1200, Number(liveState?.rate60Chf || offer?.advertisedBaseChf || offer?.rate60Chf) || 350));
  const rate30 = Math.max(100, Number(liveState?.rate30Chf || offer?.rate30Chf) || Math.round((rate60 * 0.6) / 10) * 10);

  const photos = extractPhotoUrls(liveState?.thumbnail ? { ...offer, thumbnail: liveState.thumbnail } : offer);
  const backupSrc = getLocalAiPortrait(pid);
  const primarySrc = photos.length > 0 ? toProxiedImg(photos[0], pid) : backupSrc;

  const digits = cleanSwissDigits(liveState?.phoneDisplay || offer?.rawPhone || "");
  const isLiveConfirmed = Boolean(liveState?.availabilityConfirmed || offer?.availabilityConfirmed);
  const isVerified = Boolean(liveState?.identityVerified || offer?.verified);
  const isDirect = Boolean(liveState?.claimed || offer?.directAuthorized);
  const portalName = String(offer?.sourcePortal || "CH-Index").replace("www.", "");
  const sourceCount = Array.isArray(offer?.sources) ? Math.max(1, offer.sources.length) : 1;

  const waHref =
    digits.length >= 10
      ? `https://wa.me/${digits}?text=${encodeURIComponent(`Hoi ${name}, ich habe dein Profil in ${city} auf iwantsexnow.ch gesehen. Hast du heute Zeit?`)}`
      : `/profile/${encodeURIComponent(pid)}`;

  return (
    <article className="group relative flex flex-col rounded-2xl overflow-hidden bg-[#140D13] border border-white/10 hover:border-[#E2B887]/75 shadow-[0_14px_34px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1">
      <Link href={`/profile/${encodeURIComponent(pid)}`} className="relative aspect-[3/4] w-full block overflow-hidden bg-[#1D121B] no-underline">
        <img
          referrerPolicy="no-referrer"
          src={primarySrc}
          alt={`${name} – ${city}`}
          loading={idx < 8 ? "eager" : "lazy"}
          onError={(e) => {
            const el = e.currentTarget as HTMLImageElement;
            if (el.src !== window.location.origin + backupSrc && !el.src.endsWith(backupSrc)) {
              el.src = backupSrc;
            }
          }}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500 contrast-[1.03] saturate-[1.04]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D070C] via-[#0D070C]/20 to-black/20 pointer-events-none" />

        {/* Schweizer Türschild Status oben links */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5">
          {isLiveConfirmed ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gradient-to-r from-[#E2B887] to-[#C69660] text-[#0D070C] text-[10px] font-black uppercase tracking-wider shadow-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-900 animate-ping" />
              FREI · 4H LIVE
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/75 backdrop-blur-md border border-[#E2B887]/35 text-[#F5E6D3] text-[10px] font-bold uppercase tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              {canton} · {isDirect ? "Direkt" : "Index"}
            </span>
          )}
          {isVerified && (
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/90 text-black text-[10px] font-extrabold">
              ✓ Geprüft
            </span>
          )}
        </div>

        {/* Foto-Zähler oben rechts */}
        <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-black/75 backdrop-blur-md border border-white/15 text-white/90 text-[10px] font-semibold">
          📸 {Math.max(1, photos.length)}
        </div>

        {/* Name, Stadt & 60m CHF unten im Bild */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h3 className="text-[15px] font-bold text-white leading-tight truncate drop-shadow">{name}</h3>
            <p className="text-[11px] text-[#E6D8DC] mt-0.5 truncate">
              📍 {city} ({canton}) · <span className="text-[#E2B887]">{isDirect ? "0% Direktprofil" : portalName}</span>
            </p>
          </div>
          <div className="shrink-0 px-2.5 py-1 rounded-xl bg-[#0D070C]/90 border border-[#E2B887]/55 text-right">
            <span className="block text-[9px] uppercase text-[#C7B4BA] leading-none">60 Min.</span>
            <span className="text-xs font-extrabold text-[#E2B887]">CHF {rate60}</span>
          </div>
        </div>
      </Link>

      {/* Point-of-Doubt Transparenzzeile + 1-Tap Kontakt */}
      <div className="p-3 bg-[#140D13] flex flex-col gap-2">
        <div className="flex items-center justify-between text-[11px] text-[#B9A5AD]">
          <span>30 Min. ~ CHF {rate30}</span>
          <span className="truncate">
            {sourceCount > 1 ? `⚡ ${sourceCount} Portale gebündelt` : digits.length >= 10 ? "✓ +41 Direkt" : "Quellen-Dossier"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          {digits.length >= 10 ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-xl bg-[#25D366] hover:bg-[#1ebe5d] text-[#05150B] font-extrabold text-xs text-center no-underline transition"
            >
              WhatsApp
            </a>
          ) : (
            <Link
              href={`/profile/${encodeURIComponent(pid)}`}
              className="py-2 px-2.5 rounded-xl bg-gradient-to-r from-[#E11D48] to-[#BE123C] text-white font-extrabold text-xs text-center no-underline transition"
            >
              Anfragen
            </Link>
          )}
          <Link
            href={`/profile/${encodeURIComponent(pid)}`}
            className="py-2 px-2.5 rounded-xl bg-white/5 hover:bg-white/15 border border-white/15 text-white font-semibold text-xs text-center no-underline transition"
          >
            Dossier →
          </Link>
        </div>
      </div>
    </article>
  );
}