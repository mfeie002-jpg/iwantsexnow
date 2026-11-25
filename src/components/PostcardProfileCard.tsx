import React from "react";
import Link from "next/link";

const FALLBACK_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80"
];

export function cleanPostcardName(raw: any, idx = 0): string {
  const str = String(raw || "")
    .replace(/[✨🔥💎👑💋❤️⭐️•|]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!str) return "Valentina";
  // Kürze reine Grossbuchstaben-Anzeigentitel in gut lesbare Titel-Schreibweise
  const words = str
    .split(" ")
    .filter((w) => w.length >= 2 && !/^(TOP|NEU|NEW|VIP|HOT|SEX|100%|CH)$/i.test(w))
    .slice(0, 4);
  const joined = (words.length ? words : str.split(" ").slice(0, 3)).join(" ");
  return joined
    .toLowerCase()
    .replace(/(^|\s|-)([a-zäöüéèà])/g, (m) => m.toUpperCase())
    .slice(0, 34);
}

export function getPostcardImage(offer: any, idx = 0): { imgSrc: string; fallbackImg: string } {
  const fallbackImg = FALLBACK_PORTRAITS[idx % FALLBACK_PORTRAITS.length];
  const rawCandidate = String(
    offer?.thumbnail ||
    offer?.photoUrl ||
    offer?.image ||
    (Array.isArray(offer?.galleryUrls) && offer.galleryUrls[0]) ||
    (Array.isArray(offer?.photos) && offer.photos[0]) ||
    ""
  )
    .trim()
    .replace(/[?&]iwsn_clean=1.*$/i, "");

  const isRealHttp =
    rawCandidate.startsWith("http") &&
    !rawCandidate.includes("placeholder") &&
    !rawCandidate.includes("escort-portrait") &&
    !rawCandidate.endsWith(".svg");

  return {
    imgSrc: isRealHttp ? `/api/img?s=${idx}&u=${encodeURIComponent(rawCandidate)}` : fallbackImg,
    fallbackImg
  };
}

interface PostcardProfileCardProps {
  offer: any;
  idx: number;
  isFav?: boolean;
  onToggleFav?: (id: string, e?: React.MouseEvent) => void;
}

export function PostcardProfileCard({ offer, idx, isFav = false, onToggleFav }: PostcardProfileCardProps) {
  const pid = String(offer?.id || offer?.dedupClusterId || `ch-${idx}`);
  const displayName = cleanPostcardName(offer?.rawName || offer?.name || offer?.title, idx);
  const city = offer?.city || "Zürich";
  const canton = offer?.canton || "ZH";
  const rate = Math.max(150, Math.min(1800, Number(offer?.advertisedBaseChf || offer?.rate60Chf || offer?.priceChf) || 300));
  const { imgSrc, fallbackImg } = getPostcardImage(offer, idx);

  const rawPhone = String(offer?.rawPhone || offer?.phone || offer?.unlockedPhone || "").trim();
  const cleanWa = rawPhone.replace(/[^0-9+]/g, "").replace(/^00/, "+").replace(/^0([1-9])/, "+41$1");
  const waHref = rawPhone
    ? `https://wa.me/${cleanWa.replace("+", "")}?text=${encodeURIComponent(`Hoi, ich habe dein Profil auf iwantsexnow.ch in ${city} gesehen.`)}`
    : `/profile/${encodeURIComponent(pid)}`;

  return (
    <article className="group relative flex flex-col bg-[#FFFDF9] rounded-[22px] border-2 border-[#1E2433] p-2.5 shadow-[0_6px_0_#1E2433] hover:-translate-y-1 hover:shadow-[0_10px_0_#1E2433] transition-all duration-200">
      {/* Kleiner Washi-Tape Streifen oben mittig im Postkarten-Look */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-[#FDE68A]/90 border border-[#1E2433]/25 rotate-[-2deg] rounded-sm z-20 pointer-events-none" />

      {/* Echtes Porträtfoto im weissen Polaroid-Rahmen */}
      <Link
        href={`/profile/${encodeURIComponent(pid)}`}
        className="relative aspect-[3/4] w-full overflow-hidden rounded-[15px] bg-[#F4EFE6] border border-[#1E2433]/15 block"
      >
        <img
          referrerPolicy="no-referrer"
          src={imgSrc}
          alt={displayName}
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src = fallbackImg;
          }}
          className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
        />

        {/* Sanfter Verlauf nur ganz unten für Orts-Stempel */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#1E2433]/75 via-[#1E2433]/20 to-transparent pointer-events-none" />

        {/* Oben links: Freundliches Mint-Verfügbarkeits-Badge */}
        <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#CCFBF1] text-[#0F5132] border border-[#1E2433] text-[10px] font-extrabold uppercase tracking-wide shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
          Heute frei
        </div>

        {/* Oben rechts: Merklisten-Herz */}
        {onToggleFav && (
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onToggleFav(pid, e);
            }}
            aria-label="Merken"
            className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full border border-[#1E2433] flex items-center justify-center text-xs font-bold transition cursor-pointer ${
              isFav ? "bg-[#E11D48] text-white" : "bg-white/95 text-[#1E2433] hover:bg-[#FFE4E6]"
            }`}
          >
            ♥
          </button>
        )}

        {/* Unten links auf dem Foto: Poststempel-Ort */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-white/95 text-[#1E2433] border border-[#1E2433] text-[11px] font-bold truncate">
            📍 {city} · {canton}
          </span>
        </div>
      </Link>

      {/* Heller Postkarten-Fuss statt schwarzem Kasten */}
      <div className="pt-3 px-1.5 pb-1 flex-1 flex flex-col justify-between gap-2.5 text-[#1E2433]">
        <div className="flex items-start justify-between gap-2">
          <Link
            href={`/profile/${encodeURIComponent(pid)}`}
            className="font-extrabold text-[15px] leading-snug text-[#1E2433] hover:text-[#E11D48] line-clamp-2 no-underline"
          >
            {displayName}
          </Link>
          <div className="shrink-0 px-2.5 py-1 rounded-lg bg-[#FEF08A] border border-[#1E2433] text-right leading-none shadow-[0_2px_0_#1E2433]">
            <span className="block text-[9px] font-bold uppercase text-[#1E2433]/70">ab</span>
            <span className="text-xs font-black text-[#1E2433]">CHF {rate}</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#475569] font-medium">
          <span className="truncate">{offer?.rubric || offer?.category || "Escort & Massage"}</span>
          {rawPhone ? (
            <span className="text-[#0F766E] font-bold shrink-0">✓ +41 Direkt</span>
          ) : (
            <span className="text-[#64748B] shrink-0">Geprüft</span>
          )}
        </div>

        {/* Zwei freundliche Buttons passend zum roten "Treffer anzeigen"-Button oben */}
        <div className="grid grid-cols-2 gap-2 pt-0.5">
          {rawPhone ? (
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="py-2 px-2.5 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white border border-[#1E2433] text-[11px] font-extrabold text-center no-underline shadow-[0_2px_0_#1E2433] transition"
            >
              WhatsApp
            </a>
          ) : (
            <Link
              href={`/profile/${encodeURIComponent(pid)}`}
              className="py-2 px-2.5 rounded-full bg-[#E11D48] hover:bg-[#BE123C] text-white border border-[#1E2433] text-[11px] font-extrabold text-center no-underline shadow-[0_2px_0_#1E2433] transition"
            >
              Kontakt
            </Link>
          )}
          <Link
            href={`/profile/${encodeURIComponent(pid)}`}
            className="py-2 px-2.5 rounded-full bg-[#F8FAFC] hover:bg-[#FEF08A] text-[#1E2433] border border-[#1E2433] text-[11px] font-extrabold text-center no-underline shadow-[0_2px_0_#1E2433] transition"
          >
            Profil →
          </Link>
        </div>
      </div>
    </article>
  );
}

export default PostcardProfileCard;
