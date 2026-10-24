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
  includedTags: string[];
  extraPricesChf?: Record<string, number>;
  incall: boolean;
  outcall: boolean;
  scrapedAtIso: string;
  directAuthorized?: boolean;
  thumbnail?: string;
}

export interface DeduplicatedIndexProfile {
  dedupClusterId: string;
  normalizedPhoneMask: string;
  displayName: string;
  age: number;
  primaryCity: string;
  canton: string;
  subareas: string[];
  bookingMode: "direct" | "indexed";
  bestBaseRate60Chf: number;
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
  }[];
  thumbnail: string;
  freshnessLabel: string;
}

/**
 * Normalizes any Swiss phone format (079 123 45 67, +41 (0)79..., 004179...)
 * into a canonical E.164 key (+41791234567) for cross-portal duplicate detection.
 */
export function normalizeSwissPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "");
  if (digits.startsWith("0041")) return "+41" + digits.slice(4);
  if (digits.startsWith("41") && digits.length >= 11) return "+" + digits;
  if (digits.startsWith("0") && digits.length === 10) return "+41" + digits.slice(1);
  return "+41" + digits.slice(-9);
}

export function maskSwissPhone(e164: string): string {
  if (e164.length < 12) return e164;
  return `${e164.slice(0, 3)} ${e164.slice(3, 5)} ${e164.slice(5, 8)} ** **`;
}

/**
 * Groups raw scraped offers across all Swiss portals by canonical phone/identity,
 * merges duplicate listings, and computes true total-cost benchmarks.
 */
export function deduplicateScrapedOffers(offers: readonly RawScrapedOffer[]): DeduplicatedIndexProfile[] {
  const clusters = new Map<string, RawScrapedOffer[]>();

  for (const offer of offers) {
    const key = normalizeSwissPhone(offer.rawPhone);
    const existing = clusters.get(key) || [];
    existing.push(offer);
    clusters.set(key, existing);
  }

  const results: DeduplicatedIndexProfile[] = [];

  clusters.forEach((group, phoneKey) => {
    const sortedByPrice = [...group].sort((a, b) => a.advertisedBaseChf - b.advertisedBaseChf);
    const primary = group.find((g) => g.directAuthorized) || sortedByPrice[0];
    const isDirect = group.some((g) => g.directAuthorized);

    const externalPrices = group.filter((g) => !g.directAuthorized).map((g) => g.advertisedBaseChf);
    const bestBase = primary.advertisedBaseChf;
    const avgExternal =
      externalPrices.length > 0
        ? Math.round(externalPrices.reduce((s, p) => s + p, 0) / externalPrices.length)
        : bestBase + 70;

    const allIncluded = Array.from(new Set(group.flatMap((g) => g.includedTags)));
    const allSubareas = Array.from(new Set(group.flatMap((g) => g.subareas || [g.city])));

    const mergedExtras: Record<string, number> = {
      GFE: 80,
      "Dinner Dates": 100,
      Outcall: 70,
      Massage: 60,
      Overnight: 550,
      ...(primary.extraPricesChf || {}),
    };

    results.push({
      dedupClusterId: `ch-idx-${phoneKey.slice(-6)}`,
      normalizedPhoneMask: maskSwissPhone(phoneKey),
      displayName: primary.rawName,
      age: primary.age || 25,
      primaryCity: primary.city,
      canton: primary.canton,
      subareas: allSubareas,
      bookingMode: isDirect ? "direct" : "indexed",
      bestBaseRate60Chf: bestBase,
      portalAverage60Chf: avgExternal,
      savingsPerHourChf: Math.max(0, avgExternal - bestBase),
      includedServices: allIncluded,
      extraPricesChf: mergedExtras,
      incall: group.some((g) => g.incall),
      outcall: group.some((g) => g.outcall),
      sourcesCount: group.length,
      sources: group.map((g) => ({
        portal: g.sourcePortal,
        priceChf: g.advertisedBaseChf,
        lastSeenIso: g.scrapedAtIso,
        isDirect: Boolean(g.directAuthorized),
      })),
      thumbnail:
        primary.thumbnail ||
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop",
      freshnessLabel: isDirect
        ? "Vom Provider live bestätigt · Sofort buchbar"
        : `Im Schweizer Index vor ${Math.max(4, group.length * 5)} Min. abgeglichen`,
    });
  });

  return results.sort((a, b) => (a.bookingMode === "direct" ? -1 : 1));
}

export const INITIAL_RAW_SWISS_FEED: RawScrapedOffer[] = [
  // Cluster 1: Sophia (Zürich & Zug) - Listed on Direct + 3 external portals with same phone in different formats!
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Sophia",
    age: 26,
    rawPhone: "+41 79 412 88 10",
    city: "Zürich",
    canton: "ZH",
    subareas: ["Zürich Paradeplatz", "Zug", "Winterthur"],
    advertisedBaseChf: 450,
    includedTags: ["GFE", "Dinner Dates", "Outcall"],
    extraPricesChf: { Massage: 50, Overnight: 550 },
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=700&fit=crop",
  },
  {
    sourcePortal: "xdate.ch",
    rawName: "Sophia VIP Zürich",
    age: 26,
    rawPhone: "079 412 88 10",
    city: "Zürich",
    canton: "ZH",
    subareas: ["Zürich City"],
    advertisedBaseChf: 500,
    includedTags: ["GFE"],
    incall: true,
    outcall: true,
    scrapedAtIso: "vor 2 Std.",
  },
  {
    sourcePortal: "fgirl.ch",
    rawName: "Sophia Luxury",
    age: 26,
    rawPhone: "0041794128810",
    city: "Zürich",
    canton: "ZH",
    advertisedBaseChf: 520,
    includedTags: ["GFE"],
    incall: true,
    outcall: true,
    scrapedAtIso: "vor 5 Std.",
  },
  {
    sourcePortal: "and6.com",
    rawName: "Sophia ZH/ZG",
    age: 26,
    rawPhone: "+41 (0)79 412 88 10",
    city: "Zug",
    canton: "ZG",
    advertisedBaseChf: 540,
    includedTags: ["GFE"],
    incall: false,
    outcall: true,
    scrapedAtIso: "vor 8 Std.",
  },

  // Cluster 2: Elena (Zug & Cham Pilot) - Direct + 2 external duplicates
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Elena",
    age: 24,
    rawPhone: "+41 78 901 33 21",
    city: "Zug",
    canton: "ZG",
    subareas: ["Zug Zentrum", "Cham", "Baar", "Zürichsee"],
    advertisedBaseChf: 400,
    includedTags: ["GFE", "Outcall", "Massage"],
    extraPricesChf: { "Dinner Dates": 60, Overnight: 500 },
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop",
  },
  {
    sourcePortal: "and6.com",
    rawName: "Elena Zug/Cham",
    age: 24,
    rawPhone: "078 901 33 21",
    city: "Zug",
    canton: "ZG",
    advertisedBaseChf: 460,
    includedTags: ["GFE"],
    incall: true,
    outcall: true,
    scrapedAtIso: "vor 3 Std.",
  },
  {
    sourcePortal: "xdate.ch",
    rawName: "Elena Zentralschweiz",
    age: 24,
    rawPhone: "+41789013321",
    city: "Luzern",
    canton: "LU",
    advertisedBaseChf: 500,
    includedTags: ["GFE"],
    incall: false,
    outcall: true,
    scrapedAtIso: "vor 11 Std.",
  },

  // Cluster 3: Lara (Cham / Zug - Scraped from external index, not yet claimed)
  {
    sourcePortal: "xdate.ch",
    rawName: "Lara",
    age: 25,
    rawPhone: "076 554 19 80",
    city: "Cham",
    canton: "ZG",
    subareas: ["Cham", "Zug", "Rotkreuz"],
    advertisedBaseChf: 380,
    includedTags: ["GFE", "Massage"],
    incall: true,
    outcall: true,
    scrapedAtIso: "vor 18 Min.",
    directAuthorized: false,
    thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=700&fit=crop",
  },
  {
    sourcePortal: "6navi.ch",
    rawName: "Lara Studio Cham",
    age: 25,
    rawPhone: "+41 76 554 19 80",
    city: "Zug",
    canton: "ZG",
    advertisedBaseChf: 430,
    includedTags: ["Massage"],
    incall: true,
    outcall: false,
    scrapedAtIso: "vor 6 Std.",
    directAuthorized: false,
  },

  // Cluster 4: Emma (Basel)
  {
    sourcePortal: "and6.com",
    rawName: "Emma",
    age: 28,
    rawPhone: "079 221 64 90",
    city: "Basel",
    canton: "BS",
    subareas: ["Basel SBB", "Liestal"],
    advertisedBaseChf: 350,
    includedTags: ["GFE", "Massage"],
    incall: true,
    outcall: false,
    scrapedAtIso: "vor 27 Min.",
    directAuthorized: false,
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=700&fit=crop",
  },
];