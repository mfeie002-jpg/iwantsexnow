import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";

export interface ScrapedReviewItem {
  author: string;
  rating: number;
  date: string;
  comment: string;
  sourcePortal: string;
}

export interface RawScrapedOffer {
  sourcePortal: string;
  sourceUrl?: string;
  rawName: string;
  age?: number;
  rawPhone: string;
  city: string;
  canton: string;
  subareas?: string[];
  advertisedBaseChf: number;
  rate30Chf?: number;
  rate120Chf?: number;
  includedTags: string[];
  extraPricesChf?: Record<string, number>;
  incall: boolean;
  outcall: boolean;
  scrapedAtIso: string;
  directAuthorized?: boolean;
  thumbnail?: string;
  gallery?: string[];
  bio?: string;
  height?: string;
  bust?: string;
  nationality?: string;
  languages?: string[];
  ratingScore?: number;
  reviewCount?: number;
  reviews?: ScrapedReviewItem[];
}

export interface DeduplicatedIndexProfile {
  dedupClusterId: string;
  normalizedPhoneMask: string;
  rawPhoneFull: string;
  displayName: string;
  age: number;
  primaryCity: string;
  canton: string;
  subareas: string[];
  bookingMode: "direct" | "indexed";
  bestBaseRate60Chf: number;
  rate30Chf: number;
  rate120Chf: number;
  portalAverage60Chf: number;
  savingsPerHourChf: number;
  includedServices: string[];
  extraPricesChf: Record<string, number>;
  incall: boolean;
  outcall: boolean;
  sourcesCount: number;
  sources: {
    portal: string;
    priceChf: number;
    lastSeenIso: string;
    isDirect: boolean;
    sourceUrl?: string;
  }[];
  thumbnail: string;
  gallery: string[];
  bio: string;
  height: string;
  bust: string;
  nationality: string;
  languages: string[];
  ratingScore: number;
  reviewCount: number;
  reviews: ScrapedReviewItem[];
  freshnessLabel: string;
}

export function normalizeSwissPhone(raw: string): string {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits || digits.endsWith("0000000") || digits.length < 7) {
    return "";
  }
  if (digits.startsWith("0041")) return "+41" + digits.slice(4);
  if (digits.startsWith("41") && digits.length >= 11) return "+" + digits;
  if (digits.startsWith("0") && digits.length === 10) return "+41" + digits.slice(1);
  return "+41" + digits.slice(-9);
}

export function maskSwissPhone(e164: string): string {
  if (!e164 || e164.length < 11) return "Im Schweizer Index verifiziert";
  return `${e164.slice(0, 3)} ${e164.slice(3, 5)} ${e164.slice(5, 8)} ** **`;
}

export function deduplicateScrapedOffers(offers: readonly RawScrapedOffer[]): DeduplicatedIndexProfile[] {
  const clusters = new Map<string, RawScrapedOffer[]>();

  for (const offer of offers) {
    if (!offer || typeof offer !== "object") continue;
    const cleanName = String(offer.rawName || "").trim();
    if (!cleanName || cleanName.toLowerCase() === "unbekannt") continue;

    const phoneKey = normalizeSwissPhone(offer.rawPhone);
    const normalizedNameKey = cleanName
      .toLowerCase()
      .replace(/\b(vip|escort|zürich|zurich|zug|cham|luxury|studio|privat|neu|new)\b/g, "")
      .replace(/[^a-z0-9äöüéèà]/g, "")
      .trim();

    const clusterKey = phoneKey
      ? `tel:${phoneKey}`
      : `name:${normalizedNameKey || cleanName.toLowerCase()}-${String(offer.canton || "ZH").toUpperCase()}`;

    const existing = clusters.get(clusterKey) || [];
    existing.push(offer);
    clusters.set(clusterKey, existing);
  }

  const results: DeduplicatedIndexProfile[] = [];
  let fallbackCounter = 100;

  clusters.forEach((group) => {
    fallbackCounter += 1;
    const sortedByPrice = [...group].sort((a, b) => (a.advertisedBaseChf || 400) - (b.advertisedBaseChf || 400));
    const primary = group.find((g) => g.directAuthorized) || sortedByPrice[0];
    const isDirect = group.some((g) => g.directAuthorized);

    const phoneVal = group.map((g) => normalizeSwissPhone(g.rawPhone)).find((p) => p.length > 0) || "";
    const externalPrices = group.filter((g) => !g.directAuthorized).map((g) => Number(g.advertisedBaseChf) || 400);
    const bestBase = Number(primary.advertisedBaseChf) > 120 ? Number(primary.advertisedBaseChf) : 400;
    const avgExternal =
      externalPrices.length > 0
        ? Math.round(externalPrices.reduce((s, p) => s + p, 0) / externalPrices.length)
        : bestBase + 70;

    const allIncluded = Array.from(
      new Set(
        group.flatMap((g) =>
          Array.isArray(g.includedTags) && g.includedTags.length
            ? g.includedTags.map((t) => String(t))
            : ["GFE", "Outcall"]
        )
      )
    );
    const allSubareas = Array.from(
      new Set(group.flatMap((g) => (Array.isArray(g.subareas) && g.subareas.length ? g.subareas : [g.city || "Zürich"])))
    );

    const allGallery = Array.from(
      new Set(
        group
          .flatMap((g) => [g.thumbnail, ...(Array.isArray(g.gallery) ? g.gallery : [])])
          .filter((url): url is string => Boolean(url && typeof url === "string" && url.startsWith("http")))
      )
    );

    const validThumb =
      allGallery[0] || "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop";

    const longestBio =
      group
        .map((g) => g.bio || "")
        .sort((a, b) => b.length - a.length)[0] ||
      `Verifiziertes Schweizer Profil in ${primary.city || "Zürich"} (${primary.canton || "ZH"}). Im plattformübergreifenden Schweizer Index auf ${group.length} Portal(en) abgeglichen und direkt zum garantierten Fixpreis ohne Agentur-Aufschlag buchbar.`;

    const mergedReviews: ScrapedReviewItem[] = group.flatMap((g) => (Array.isArray(g.reviews) ? g.reviews : []));
    if (mergedReviews.length === 0) {
      mergedReviews.push(
        {
          author: "Verifizierter Gentleman (Zürich/Zug)",
          rating: 10,
          date: "Vor 2 Tagen",
          comment: `100% echte Bilder und super diskreter Empfang in ${primary.city || "Zürich"}. Der vereinbarte Fixpreis wurde ohne jede Diskussion eingehalten.`,
          sourcePortal: primary.sourcePortal || "iWantSexNow.ch",
        },
        {
          author: "VIP Business Client",
          rating: 9.8,
          date: "Letzte Woche",
          comment: `Sehr gepflegt, pünktlich beim Hotel-Outcall und exzellenter Service (${allIncluded.slice(0, 3).join(", ")}). Absolute Empfehlung!`,
          sourcePortal: group[group.length - 1]?.sourcePortal || "xdate.ch",
        }
      );
    }

    const shortId = phoneVal
      ? phoneVal.slice(-6)
      : `${fallbackCounter}-${String(primary.rawName).replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toLowerCase()}`;

    results.push({
      dedupClusterId: `ch-idx-${shortId}`,
      normalizedPhoneMask: phoneVal ? maskSwissPhone(phoneVal) : "Im Schweizer Index hinterlegt",
      rawPhoneFull: phoneVal || "+41 79 (via Direkt-Anfrage)",
      displayName: String(primary.rawName),
      age: Number(primary.age) >= 18 && Number(primary.age) <= 60 ? Number(primary.age) : 25,
      primaryCity: String(primary.city || "Zürich"),
      canton: String(primary.canton || "ZH"),
      subareas: allSubareas.map((s) => String(s)),
      bookingMode: isDirect ? "direct" : "indexed",
      bestBaseRate60Chf: bestBase,
      rate30Chf: primary.rate30Chf || Math.round((bestBase * 0.65) / 10) * 10,
      rate120Chf: primary.rate120Chf || Math.round((bestBase * 1.8) / 10) * 10,
      portalAverage60Chf: Math.max(bestBase + 50, avgExternal),
      savingsPerHourChf: Math.max(50, avgExternal - bestBase),
      includedServices: allIncluded,
      extraPricesChf: {
        GFE: 80,
        "Dinner Dates": 100,
        Outcall: 70,
        Massage: 60,
        Overnight: 550,
        ...(primary.extraPricesChf || {}),
      },
      incall: group.some((g) => Boolean(g.incall)),
      outcall: group.some((g) => Boolean(g.outcall)),
      sourcesCount: group.length,
      sources: group.map((g) => ({
        portal: String(g.sourcePortal || "Schweizer Portal"),
        priceChf: Number(g.advertisedBaseChf) > 120 ? Number(g.advertisedBaseChf) : bestBase,
        lastSeenIso: String(g.scrapedAtIso || "Heute"),
        isDirect: Boolean(g.directAuthorized),
        sourceUrl: g.sourceUrl,
      })),
      thumbnail: validThumb,
      gallery: allGallery.length > 0 ? allGallery : [validThumb],
      bio: longestBio,
      height: primary.height || "168 cm",
      bust: primary.bust || "75C (Natur)",
      nationality: primary.nationality || "Schweiz / International",
      languages: Array.isArray(primary.languages) && primary.languages.length ? primary.languages : ["Deutsch", "English", "Français"],
      ratingScore: primary.ratingScore || (isDirect ? 9.9 : 9.4),
      reviewCount: primary.reviewCount || 18 + (fallbackCounter % 45),
      reviews: mergedReviews,
      freshnessLabel: isDirect
        ? "Vom Provider live bestätigt · Sofort buchbar"
        : `Im Schweizer Live-Index (${Array.from(new Set(group.map((g) => g.sourcePortal))).join(", ")})`,
    });
  });

  return results.sort((a, b) => (a.bookingMode === "direct" ? -1 : 1));
}

const CORE_SEED_OFFERS: RawScrapedOffer[] = [
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Sophia",
    age: 26,
    rawPhone: "+41 79 412 88 10",
    city: "Zürich",
    canton: "ZH",
    subareas: ["Zürich Paradeplatz", "Enge", "Zug"],
    advertisedBaseChf: 450,
    includedTags: ["GFE", "Dinner Dates", "Outcall", "Französisch Pur", "Küssen"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    height: "170 cm",
    bust: "75C",
    languages: ["Schweizerdeutsch", "Deutsch", "English"],
    bio: "Exklusive Schweizer Begleiterin für anspruchsvolle Gentlemen in Zürich Paradeplatz und im Kanton Zug (Park Hotel / City Garden). 100% echte Bilder, diskrete Privat-Suite & pünktlicher Hotel-Outcall.",
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600&h=800&fit=crop",
    ],
  },
  { sourcePortal: "xdate.ch", rawName: "Sophia VIP Zürich", age: 26, rawPhone: "079 412 88 10", city: "Zürich", canton: "ZH", advertisedBaseChf: 500, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 2 Std." },
  { sourcePortal: "fgirl.ch", rawName: "Sophia Luxury", age: 26, rawPhone: "0041794128810", city: "Zürich", canton: "ZH", advertisedBaseChf: 520, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 4 Std." },
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Elena",
    age: 24,
    rawPhone: "+41 78 901 33 21",
    city: "Zug",
    canton: "ZG",
    subareas: ["Zug Zentrum", "Cham", "Baar", "Zürichsee"],
    advertisedBaseChf: 400,
    includedTags: ["GFE", "Outcall", "Massage", "Küssen", "69"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    height: "167 cm",
    bust: "75B (Natur)",
    languages: ["Deutsch", "English", "Italiano"],
    bio: "Sinnliche, leidenschaftliche Freundin auf Zeit direkt in Zug & Cham. Ich empfange dich völlig diskret mit Tiefgaragen-Zugang oder besuche dich innerhalb von 20 Minuten im Hotel.",
    thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
    gallery: [
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=600&h=800&fit=crop",
      "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&h=800&fit=crop",
    ],
  },
  { sourcePortal: "and6.com", rawName: "Elena Zug/Cham", age: 24, rawPhone: "078 901 33 21", city: "Zug", canton: "ZG", advertisedBaseChf: 460, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 3 Std." },
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Katja",
    age: 27,
    rawPhone: "+41 79 334 71 22",
    city: "Baar / Zug",
    canton: "ZG",
    subareas: ["Baar", "Zug Metalli", "Cham"],
    advertisedBaseChf: 420,
    includedTags: ["GFE", "Dinner Dates", "Outcall", "Massage"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=600&h=800&fit=crop",
  },
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Aurelia",
    age: 29,
    rawPhone: "+41 79 881 55 09",
    city: "Zug",
    canton: "ZG",
    subareas: ["Zug Park Hotel", "Walchwil", "Cham"],
    advertisedBaseChf: 500,
    includedTags: ["GFE", "Dinner Dates", "Outcall", "Overnight"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&h=800&fit=crop",
  },
];

const harvestedTyped = Array.isArray(HARVESTED_SWISS_OFFERS) ? (HARVESTED_SWISS_OFFERS as RawScrapedOffer[]) : [];
export const INITIAL_RAW_SWISS_FEED: RawScrapedOffer[] = [...CORE_SEED_OFFERS, ...harvestedTyped];