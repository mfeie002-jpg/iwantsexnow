import React from "react";
import Link from "next/link";
import { profilePhotoPlaceholder, profilePhotoSrc } from "@/components/night/profile-image-model";
import { halfHourPriceLine, hourlyPriceLine } from "@/lib/honesty";
import { getProfileRate } from "@/lib/night-catalogue";

export const CARD_FALLBACKS: string[] = [];

export function formatCleanName(raw: any): string {
  const s = String(raw || "").trim();
  if (!s) return "Sofia";
  const cleaned = s.replace(/[✨🔥💎👑💋❤️⭐️•|⚜️❗❕]/g, " ").replace(/\s+/g, " ").trim();
  return cleaned.length > 32 ? cleaned.slice(0, 32).trim() + "…" : cleaned;
}

export function resolveProfilePhoto(offer: any, _idx = 0): { primarySrc: string; backupSrc: string; photoCount: number } {
  const pid = String(offer?.id || offer?.dedupClusterId || "");
  const name = String(offer?.displayName || offer?.rawName || offer?.name || "");
  const backupSrc = profilePhotoPlaceholder(name);
  const list = [
    offer?.thumbnail,
    offer?.photoUrl,
    offer?.imageUrl,
    ...(Array.isArray(offer?.gallery) ? offer.gallery : []),
    ...(Array.isArray(offer?.galleryUrls) ? offer.galleryUrls : []),
  ].filter((u) => typeof u === "string" && u.trim().startsWith("http") && !/unsplash\.|pexels\.|pixabay\.|bg_blur|placeholder/i.test(u) && !u.endsWith(".svg"));
  return {
    primarySrc: pid ? profilePhotoSrc(pid) : backupSrc,
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
  const harvested60 = Number(liveState?.rate60Chf || offer?.rate60Chf || offer?.advertisedBaseChf);
  const harvested30 = Number(liveState?.rate30Chf || offer?.rate30Chf);
  const hourly = hourlyPriceLine({
    confirmed: getProfileRate(liveState, 60),
    harvested: Number.isFinite(harvested60) ? harvested60 : null,
    halfHour: Number.isFinite(harvested30) ? harvested30 : null,
  });
  const halfHour = halfHourPriceLine({
    confirmed: getProfileRate(liveState, 30),
    harvested: Number.isFinite(harvested30) ? harvested30 : null,
    hourly: Number.isFinite(harvested60) ? harvested60 : null,
  });

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

        <div className="absolute top-3 left-3 flex flex-wrap items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/15 text-white text-[10px] font-bold uppercase tracking-wider">
            {canton} · Status offen
          </span>
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
            <span className="text-xs font-extrabold text-[#C8A97E]">{hourly.amount === null ? "offen" : `CHF ${hourly.amount}${hourly.estimated ? " · geschätzt" : ""}`}</span>
          </div>
        </div>
      </Link>

      {/* Kompakter Aktions-Fuss */}
      <div className="p-3 bg-[#121621] flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[11px] text-gray-400">
          <span>{halfHour.amount === null ? "30 Min. nicht angegeben" : `30 Min. CHF ${halfHour.amount}${halfHour.estimated ? " · geschätzt" : ""}`}</span>
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