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
        : `Im Schweizer Index vor ${Math.max(4, group.length * 4)} Min. abgeglichen`,
    });
  });

  return results.sort((a, b) => (a.bookingMode === "direct" ? -1 : 1));
}

export const INITIAL_RAW_SWISS_FEED: RawScrapedOffer[] = [
  // 1. Sophia (Zürich Paradeplatz & Zug) - 4 Portale
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
  { sourcePortal: "and6.com", rawName: "Sophia ZH/ZG", age: 26, rawPhone: "+41 (0)79 412 88 10", city: "Zug", canton: "ZG", advertisedBaseChf: 540, includedTags: ["GFE"], incall: false, outcall: true, scrapedAtIso: "vor 6 Std." },

  // 2. Elena (Zug Zentrum & Cham) - 3 Portale
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
  { sourcePortal: "xdate.ch", rawName: "Elena Zentralschweiz", age: 24, rawPhone: "+41789013321", city: "Cham", canton: "ZG", advertisedBaseChf: 500, includedTags: ["GFE"], incall: false, outcall: true, scrapedAtIso: "vor 7 Std." },

  // 3. Lara (Cham & Rotkreuz, ZG) - 2 Portale
  {
    sourcePortal: "xdate.ch",
    rawName: "Lara",
    age: 25,
    rawPhone: "076 554 19 80",
    city: "Cham",
    canton: "ZG",
    subareas: ["Cham Lorzenpark", "Rotkreuz", "Zug"],
    advertisedBaseChf: 380,
    includedTags: ["GFE", "Massage"],
    incall: true,
    outcall: true,
    scrapedAtIso: "vor 14 Min.",
    directAuthorized: false,
    thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=700&fit=crop",
  },
  { sourcePortal: "6navi.ch", rawName: "Lara Studio Cham", age: 25, rawPhone: "+41 76 554 19 80", city: "Cham", canton: "ZG", advertisedBaseChf: 430, includedTags: ["Massage"], incall: true, outcall: false, scrapedAtIso: "vor 5 Std." },

  // 4. Katja (Baar & Zug, ZG) - 3 Portale
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
  { sourcePortal: "xdate.ch", rawName: "Katja Baar Privat", age: 27, rawPhone: "079 334 71 22", city: "Baar", canton: "ZG", advertisedBaseChf: 480, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 4 Std." },
  { sourcePortal: "and6.com", rawName: "Katja VIP Zug", age: 27, rawPhone: "0041793347122", city: "Zug", canton: "ZG", advertisedBaseChf: 500, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 9 Std." },

  // 5. Céline (Rotkreuz / Risch & Cham, ZG) - 2 Portale
  {
    sourcePortal: "fgirl.ch",
    rawName: "Céline",
    age: 23,
    rawPhone: "+41 78 602 91 44",
    city: "Rotkreuz / Cham",
    canton: "ZG",
    subareas: ["Rotkreuz", "Cham", "Luzern"],
    advertisedBaseChf: 360,
    includedTags: ["GFE", "Outcall"],
    incall: false,
    outcall: true,
    scrapedAtIso: "vor 22 Min.",
    directAuthorized: false,
    thumbnail: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=700&fit=crop",
  },
  { sourcePortal: "xdate.ch", rawName: "Celine ZG Outcall", age: 23, rawPhone: "078 602 91 44", city: "Zug", canton: "ZG", advertisedBaseChf: 420, includedTags: ["GFE"], incall: false, outcall: true, scrapedAtIso: "vor 6 Std." },

  // 6. Aurelia (Zug & Walchwil, ZG) - 2 Portale
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
  { sourcePortal: "xdate.ch", rawName: "Aurelia High Class Zug", age: 29, rawPhone: "079 881 55 09", city: "Zug", canton: "ZG", advertisedBaseChf: 600, includedTags: ["Dinner Dates"], incall: true, outcall: true, scrapedAtIso: "vor 5 Std." },

  // 7. Vanessa (Zürich Seefeld & Bellevue, ZH) - 3 Portale
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
  { sourcePortal: "and6.com", rawName: "Vanessa Seefeld", age: 25, rawPhone: "079 711 20 33", city: "Zürich", canton: "ZH", advertisedBaseChf: 520, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 2 Std." },
  { sourcePortal: "xdate.ch", rawName: "Vanessa VIP ZH", age: 25, rawPhone: "+41797112033", city: "Zürich", canton: "ZH", advertisedBaseChf: 550, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 8 Std." },

  // 8. Damiana (Zürich Oerlikon & Airport, ZH) - 2 Portale
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
  { sourcePortal: "and6.com", rawName: "Damiana Airport Hotel", age: 24, rawPhone: "076 409 12 77", city: "Kloten", canton: "ZH", advertisedBaseChf: 420, includedTags: ["Outcall"], incall: true, outcall: true, scrapedAtIso: "vor 3 Std." },

  // 9. Aschley (Zürich West / Escher-Wyss, ZH) - 2 Portale
  {
    sourcePortal: "xdate.ch",
    rawName: "Aschley",
    age: 26,
    rawPhone: "078 312 65 90",
    city: "Zürich West",
    canton: "ZH",
    subareas: ["Zürich West", "Hardbrücke", "Altstetten"],
    advertisedBaseChf: 380,
    includedTags: ["GFE", "Massage"],
    incall: true,
    outcall: true,
    scrapedAtIso: "vor 19 Min.",
    directAuthorized: false,
    thumbnail: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=500&h=700&fit=crop",
  },
  { sourcePortal: "6navi.ch", rawName: "Aschley Studio ZH", age: 26, rawPhone: "+41 78 312 65 90", city: "Zürich", canton: "ZH", advertisedBaseChf: 440, includedTags: ["Massage"], incall: true, outcall: false, scrapedAtIso: "vor 7 Std." },

  // 10. Alina (Winterthur & Schaffhausen, ZH) - 2 Portale
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Alina",
    age: 25,
    rawPhone: "+41 79 502 84 11",
    city: "Winterthur",
    canton: "ZH",
    subareas: ["Winterthur Bahnhof", "Zürich Airport", "Frauenfeld"],
    advertisedBaseChf: 340,
    includedTags: ["GFE", "Massage", "Outcall"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=700&fit=crop",
  },
  { sourcePortal: "and6.com", rawName: "Alina Winterthur", age: 25, rawPhone: "079 502 84 11", city: "Winterthur", canton: "ZH", advertisedBaseChf: 400, includedTags: ["Massage"], incall: true, outcall: false, scrapedAtIso: "vor 5 Std." },

  // 11. Chiara (Zürich Glattpark / Opfikon, ZH) - 2 Portale
  {
    sourcePortal: "fgirl.ch",
    rawName: "Chiara",
    age: 27,
    rawPhone: "076 819 30 45",
    city: "Zürich Glattpark",
    canton: "ZH",
    subareas: ["Glattpark", "Oerlikon", "Wallisellen"],
    advertisedBaseChf: 400,
    includedTags: ["GFE", "Dinner Dates"],
    incall: true,
    outcall: true,
    scrapedAtIso: "vor 31 Min.",
    directAuthorized: false,
    thumbnail: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&h=700&fit=crop",
  },
  { sourcePortal: "xdate.ch", rawName: "Chiara Bella ZH", age: 27, rawPhone: "+41 76 819 30 45", city: "Zürich", canton: "ZH", advertisedBaseChf: 470, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 8 Std." },

  // 12. Emma (Basel SBB, BS) - 2 Portale
  {
    sourcePortal: "and6.com",
    rawName: "Emma",
    age: 28,
    rawPhone: "079 221 64 90",
    city: "Basel",
    canton: "BS",
    subareas: ["Basel SBB", "Claraplatz", "Liestal"],
    advertisedBaseChf: 350,
    includedTags: ["GFE", "Massage"],
    incall: true,
    outcall: false,
    scrapedAtIso: "vor 27 Min.",
    directAuthorized: false,
    thumbnail: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&h=700&fit=crop",
  },
  { sourcePortal: "xdate.ch", rawName: "Emma Tantra Basel", age: 28, rawPhone: "+41 79 221 64 90", city: "Basel", canton: "BS", advertisedBaseChf: 420, includedTags: ["Massage"], incall: true, outcall: false, scrapedAtIso: "vor 6 Std." },

  // 13. Mia (Bern & Zürich, BE) - 3 Portale
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Mia",
    age: 25,
    rawPhone: "+41 79 994 10 20",
    city: "Bern",
    canton: "BE",
    subareas: ["Bern Bellevue", "Thun", "Zürich"],
    advertisedBaseChf: 550,
    includedTags: ["GFE", "Dinner Dates", "Outcall", "Overnight"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=500&h=700&fit=crop",
  },
  { sourcePortal: "xdate.ch", rawName: "Mia VIP Bern", age: 25, rawPhone: "079 994 10 20", city: "Bern", canton: "BE", advertisedBaseChf: 650, includedTags: ["Dinner Dates"], incall: true, outcall: true, scrapedAtIso: "vor 4 Std." },
  { sourcePortal: "fgirl.ch", rawName: "Mia Escort BE", age: 25, rawPhone: "0041799941020", city: "Bern", canton: "BE", advertisedBaseChf: 650, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 9 Std." },

  // 14. Noemi (Luzern & Zug, LU) - 2 Portale
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Noemi",
    age: 23,
    rawPhone: "+41 78 441 92 10",
    city: "Luzern",
    canton: "LU",
    subareas: ["Luzern KKL", "Zug", "Cham"],
    advertisedBaseChf: 360,
    includedTags: ["GFE", "Dinner Dates", "Outcall"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=500&h=700&fit=crop",
  },
  { sourcePortal: "xdate.ch", rawName: "Noemi Luzern/Zug", age: 23, rawPhone: "078 441 92 10", city: "Luzern", canton: "LU", advertisedBaseChf: 420, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 5 Std." },

  // 15. Mely (Genève Centre, GE) - 2 Portale
  {
    sourcePortal: "iWantSexNow.ch (Direktbuchung)",
    rawName: "Mely",
    age: 26,
    rawPhone: "+41 79 601 88 70",
    city: "Genève",
    canton: "GE",
    subareas: ["Genève Rue du Rhône", "Eaux-Vives", "Airport"],
    advertisedBaseChf: 500,
    includedTags: ["GFE", "Dinner Dates", "Outcall"],
    incall: true,
    outcall: true,
    scrapedAtIso: "Gerade eben",
    directAuthorized: true,
    thumbnail: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=500&h=700&fit=crop",
  },
  { sourcePortal: "fgirl.ch", rawName: "Mely VIP Geneve", age: 26, rawPhone: "079 601 88 70", city: "Genève", canton: "GE", advertisedBaseChf: 600, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 3 Std." },

  // 16. Chloé (Lausanne Ouchy, VD) - 2 Portale
  {
    sourcePortal: "fgirl.ch",
    rawName: "Chloé",
    age: 24,
    rawPhone: "078 773 19 55",
    city: "Lausanne",
    canton: "VD",
    subareas: ["Lausanne Ouchy", "Flon", "Montreux"],
    advertisedBaseChf: 420,
    includedTags: ["GFE", "Massage", "Outcall"],
    incall: true,
    outcall: true,
    scrapedAtIso: "vor 24 Min.",
    directAuthorized: false,
    thumbnail: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=500&h=700&fit=crop",
  },
  { sourcePortal: "xdate.ch", rawName: "Chloe Lausanne", age: 24, rawPhone: "+41 78 773 19 55", city: "Lausanne", canton: "VD", advertisedBaseChf: 480, includedTags: ["GFE"], incall: true, outcall: true, scrapedAtIso: "vor 7 Std." },
];