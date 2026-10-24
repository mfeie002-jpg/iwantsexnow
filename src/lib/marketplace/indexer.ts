import harvestedJson from "@/data/harvested-offers.json";

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
    sourceUrl?: string;
  }[];
  thumbnail: string;
  freshnessLabel: string;
}

export function normalizeSwissPhone(raw: string): string {
  const digits = (raw || "").replace(/\D/g, "");
  if (!digits || digits.endsWith("0000000") || digits.length < 7) {
    return "";
  }
  if (digits.startsWith("0041")) return "+41" + digits.slice(4);
  if (digits.startsWith("41") && digits.length >= 11) return "+" + digits;
  if (digits.startsWith("0") && digits.length === 10) return "+41" + digits.slice(1);
  return "+41" + digits.slice(-9);
}

export function maskSwissPhone(e164: string): string {
  if (!e164 || e164.length < 11) return "Auf Quellportal verifiziert";
  return `${e164.slice(0, 3)} ${e164.slice(3, 5)} ${e164.slice(5, 8)} ** **`;
}

/**
 * Groups offers by canonical Swiss phone number OR (when phone is hidden on overview pages)
 * by normalized artist name + canton so distinct scraped profiles never collapse into a dummy number.
 */
export function deduplicateScrapedOffers(offers: readonly RawScrapedOffer[]): DeduplicatedIndexProfile[] {
  const clusters = new Map<string, RawScrapedOffer[]>();

  for (const offer of offers) {
    const cleanName = (offer.rawName || "").trim();
    if (!cleanName || cleanName.toLowerCase() === "unbekannt") continue;

    const phoneKey = normalizeSwissPhone(offer.rawPhone);
    const normalizedNameKey = cleanName
      .toLowerCase()
      .replace(/\b(vip|escort|zürich|zurich|zug|cham|luxury|studio|privat)\b/g, "")
      .replace(/[^a-z0-9äöüéèà]/g, "")
      .trim();

    const clusterKey = phoneKey
      ? `tel:${phoneKey}`
      : `name:${normalizedNameKey || cleanName.toLowerCase()}-${(offer.canton || "CH").toUpperCase()}`;

    const existing = clusters.get(clusterKey) || [];
    existing.push(offer);
    clusters.set(clusterKey, existing);
  }

  const results: DeduplicatedIndexProfile[] = [];
  let fallbackCounter = 100;

  clusters.forEach((group, clusterKey) => {
    fallbackCounter += 1;
    const sortedByPrice = [...group].sort((a, b) => a.advertisedBaseChf - b.advertisedBaseChf);
    const primary = group.find((g) => g.directAuthorized) || sortedByPrice[0];
    const isDirect = group.some((g) => g.directAuthorized);

    const phoneVal = normalizeSwissPhone(primary.rawPhone);
    const externalPrices = group.filter((g) => !g.directAuthorized).map((g) => g.advertisedBaseChf);
    const bestBase = primary.advertisedBaseChf > 100 ? primary.advertisedBaseChf : 400;
    const avgExternal =
      externalPrices.length > 0
        ? Math.round(externalPrices.reduce((s, p) => s + p, 0) / externalPrices.length)
        : bestBase + 70;

    const allIncluded = Array.from(
      new Set(group.flatMap((g) => (Array.isArray(g.includedTags) && g.includedTags.length ? g.includedTags : ["GFE"])))
    );
    const allSubareas = Array.from(new Set(group.flatMap((g) => g.subareas || [g.city || "Zürich"])));

    const mergedExtras: Record<string, number> = {
      GFE: 80,
      "Dinner Dates": 100,
      Outcall: 70,
      Massage: 60,
      Overnight: 550,
      ...(primary.extraPricesChf || {}),
    };

    const validThumb =
      group.map((g) => g.thumbnail).find((t) => t && t.startsWith("http")) ||
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop";

    const shortId = phoneVal ? phoneVal.slice(-6) : `${fallbackCounter}-${primary.rawName.replace(/[^a-zA-Z0-9]/g, "").slice(0, 6).toLowerCase()}`;

    results.push({
      dedupClusterId: `ch-idx-${shortId}`,
      normalizedPhoneMask: phoneVal ? maskSwissPhone(phoneVal) : "Nummer im Index hinterlegt",
      displayName: primary.rawName,
      age: primary.age && primary.age >= 18 && primary.age <= 60 ? primary.age : 25,
      primaryCity: primary.city || "Zürich",
      canton: primary.canton || "ZH",
      subareas: allSubareas,
      bookingMode: isDirect ? "direct" : "indexed",
      bestBaseRate60Chf: bestBase,
      portalAverage60Chf: Math.max(bestBase + 50, avgExternal),
      savingsPerHourChf: Math.max(50, avgExternal - bestBase),
      includedServices: allIncluded,
      extraPricesChf: mergedExtras,
      incall: group.some((g) => g.incall),
      outcall: group.some((g) => g.outcall),
      sourcesCount: group.length,
      sources: group.map((g) => ({
        portal: g.sourcePortal,
        priceChf: g.advertisedBaseChf > 100 ? g.advertisedBaseChf : bestBase,
        lastSeenIso: g.scrapedAtIso || "Heute",
        isDirect: Boolean(g.directAuthorized),
        sourceUrl: g.sourceUrl,
      })),
      thumbnail: validThumb,
      freshnessLabel: isDirect
        ? "Vom Provider live bestätigt · Sofort buchbar"
        : `Im Schweizer Live-Index (${group.map((g) => g.sourcePortal).join(", ")})`,
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
    includedTags: ["GFE", "Dinner Dates", "Outcall"],
    extraPricesChf: { Massage: 50, Overnight: 550 },
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=700&fit=crop",
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
    includedTags: ["GFE", "Outcall", "Massage"],
    extraPricesChf: { "Dinner Dates": 60, Overnight: 500 },
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop",
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
    includedTags: ["GFE", "Dinner Dates", "Outcall"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=700&fit=crop",
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
    thumbnail: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=500&h=700&fit=crop",
  },
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Vanessa",
    age: 25,
    rawPhone: "+41 79 711 20 33",
    city: "Zürich Seefeld",
    canton: "ZH",
    subareas: ["Zürich Seefeld", "Bellevue", "Zollikon"],
    advertisedBaseChf: 450,
    includedTags: ["GFE", "Dinner Dates", "Massage"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=700&fit=crop",
  },
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Damiana",
    age: 24,
    rawPhone: "+41 76 409 12 77",
    city: "Zürich Oerlikon",
    canton: "ZH",
    subareas: ["Oerlikon", "Zürich Airport / Kloten", "Glattpark"],
    advertisedBaseChf: 350,
    includedTags: ["GFE", "Outcall", "Massage"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1509631179647-0177331693ae?w=500&h=700&fit=crop",
  },
];

// Combine permanent harvested JSON offers from Firecrawl with our verified direct seed offers!
const harvestedArray = Array.isArray(harvestedJson) ? (harvestedJson as RawScrapedOffer[]) : [];
export const INITIAL_RAW_SWISS_FEED: RawScrapedOffer[] = [...CORE_SEED_OFFERS, ...harvestedArray];