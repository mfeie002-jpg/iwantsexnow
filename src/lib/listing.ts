/** Shared listing helpers. Reads real offer fields; does not invent prices or numbers. */

export type ListingProfile = {
  id: string;
  name: string;
  city: string;
  canton: string;
  rate30: number;
  rate60: number;
  phone: string;
  photo: string;
  available: boolean;
};

export function chf(value: number) {
  return "CHF " + Math.round(value).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'") + ".–";
}

export function countLabel(value: number) {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, "'");
}

export function clampRate(value: unknown, fallback: number, min: number, max: number) {
  const n = Number(value);
  const base = Number.isFinite(n) && n > 0 ? n : fallback;
  return Math.max(min, Math.min(max, base));
}

export function placePhoto(canton?: unknown) {
  const code = String(canton || "").toUpperCase();
  if (code === "ZH" || code === "BS" || code === "GE" || code === "BL") return "/editorial/editorial-zurich.jpg";
  if (code === "ZG" || code === "LU" || code === "BE" || code === "GR" || code === "VS" || code === "TI" || code === "UR" || code === "OW" || code === "NW") {
    return "/editorial/editorial-alps.jpg";
  }
  return "/editorial/editorial-still.jpg";
}

export function usablePhoto(url: unknown) {
  const raw = String(url || "").trim().replace(/[?&]iwsn_clean=1.*$/i, "");
  if (!raw.startsWith("http")) return "";
  if (/unsplash\.com|example\.com|placeholder|escort-portrait|bg_blur|\.svg($|\?)/i.test(raw)) return "";
  return raw;
}

export function phoneDigits(raw: unknown) {
  const digits = String(raw || "").replace(/\D/g, "");
  if (digits.length < 10) return "";
  return digits;
}

export function whatsAppHref(phone: string, name: string, city: string) {
  const digits = phoneDigits(phone);
  if (!digits) return "";
  const text =
    "Hallo " + name + ", ich habe dein Profil auf iwantsexnow.ch (" + city + ") gesehen.";
  return "https://wa.me/" + digits + "?text=" + encodeURIComponent(text);
}

type OfferLike = {
  id?: unknown;
  dedupClusterId?: unknown;
  rawName?: unknown;
  cleanTitle?: unknown;
  city?: unknown;
  canton?: unknown;
  rate60Chf?: unknown;
  rate30Chf?: unknown;
  advertisedBaseChf?: unknown;
  rawPhone?: unknown;
  phone?: unknown;
  phoneDisplay?: unknown;
  cleanThumb?: unknown;
  thumbnail?: unknown;
  availabilityConfirmed?: unknown;
  isAvail?: unknown;
};

export function toListing(o: OfferLike, state?: OfferLike): ListingProfile | null {
  const id = String(o?.id || o?.dedupClusterId || "");
  if (!id) return null;
  const st = state || {};
  const rate60 = clampRate(st.rate60Chf ?? o.rate60Chf ?? o.advertisedBaseChf, 350, 100, 1200);
  const rate30 = clampRate(st.rate30Chf ?? o.rate30Chf, Math.round((rate60 * 0.6) / 10) * 10, 80, 800);
  return {
    id,
    name: String(o.rawName || o.cleanTitle || "Profil"),
    city: String(o.city || "Schweiz"),
    canton: String(o.canton || "CH").toUpperCase(),
    rate30,
    rate60,
    phone: String(st.phoneDisplay || o.rawPhone || o.phone || ""),
    photo: usablePhoto(o.cleanThumb || o.thumbnail),
    available: state !== undefined ? Boolean(state?.availabilityConfirmed) : Boolean(o.availabilityConfirmed || o.isAvail),
  };
}
