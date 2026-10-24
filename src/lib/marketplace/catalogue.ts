export const catalogueCities = [
  { id: "zurich", label: "Zürich", canton: "ZH" },
  { id: "zug", label: "Zug", canton: "ZG" },
  { id: "winterthur", label: "Winterthur", canton: "ZH" },
  { id: "basel", label: "Basel", canton: "BS" },
  { id: "bern", label: "Bern", canton: "BE" },
  { id: "luzern", label: "Luzern", canton: "LU" },
  { id: "st-gallen", label: "St. Gallen", canton: "SG" },
  { id: "geneva", label: "Genève", canton: "GE" },
  { id: "lausanne", label: "Lausanne", canton: "VD" },
  { id: "lugano", label: "Lugano", canton: "TI" },
] as const;

export const catalogueCategories = [
  { id: "escort", label: "Escort" },
  { id: "companionship", label: "Begleitung" },
  { id: "massage", label: "Massage" },
] as const;

export const serviceOptions = [
  { id: "gfe", label: "Girlfriend Experience (GFE)" },
  { id: "dinner", label: "Dinner Date" },
  { id: "overnight", label: "Overnight" },
  { id: "outcall", label: "Hotel- & Hausbesuch (Outcall)" },
  { id: "wellness", label: "Wellness & Spa Begleitung" },
] as const;

export type CityId = typeof catalogueCities[number]["id"];
export type CategoryId = typeof catalogueCategories[number]["id"];
export type ServiceOptionId = typeof serviceOptions[number]["id"];

export interface PortalComparisonEntry {
  portalName: string;
  listedPriceChf: number;
  verifiedMatch: boolean;
  lastSeenHoursAgo: number;
}

export interface DemoListing {
  id: string;
  title: string;
  age?: number;
  city: CityId;
  serviceAreas?: CityId[];
  category: CategoryId;
  description: string;
  demo: true;
  verifiedIdentity?: boolean;
  freshnessMinutesAgo?: number;
  availableToday?: boolean;
  baseRatesChf?: {
    minutes30: number;
    minutes60: number;
    minutes120: number;
  };
  includedServices?: ServiceOptionId[];
  extraServicePricesChf?: Partial<Record<ServiceOptionId, number>>;
  portalSources?: PortalComparisonEntry[];
  rating?: number;
  reviewCount?: number;
  directEnquiryEnabled?: boolean;
}

export const demoListings: readonly DemoListing[] = [
  {
    id: "demo-zurich-escort",
    title: "Sophia",
    age: 26,
    city: "zurich",
    serviceAreas: ["zurich", "zug", "winterthur"],
    category: "escort",
    description: "Verifiziertes Direktprofil für Zürich, Zug & Winterthur. Transparente Konditionen ohne Agentur-Aufpreis.",
    demo: true,
    verifiedIdentity: true,
    freshnessMinutesAgo: 14,
    availableToday: true,
    baseRatesChf: { minutes30: 300, minutes60: 450, minutes120: 800 },
    includedServices: ["gfe", "dinner", "outcall"],
    extraServicePricesChf: { wellness: 100, overnight: 900 },
    portalSources: [
      { portalName: "Direktbuchung (iWantSexNow.ch)", listedPriceChf: 450, verifiedMatch: true, lastSeenHoursAgo: 0 },
      { portalName: "xdate.ch (Index-Fund)", listedPriceChf: 500, verifiedMatch: true, lastSeenHoursAgo: 6 },
      { portalName: "fgirl.ch (Index-Fund)", listedPriceChf: 520, verifiedMatch: true, lastSeenHoursAgo: 12 },
    ],
    rating: 4.9,
    reviewCount: 28,
    directEnquiryEnabled: true,
  },
  {
    id: "demo-zug-escort",
    title: "Elena",
    age: 24,
    city: "zug",
    serviceAreas: ["zug", "zurich", "luzern"],
    category: "escort",
    description: "Exklusive Begleitung im Raum Zug, Cham & Zürichsee. 100% bestätigte Originalfotos und Echtzeit-Verfügbarkeit.",
    demo: true,
    verifiedIdentity: true,
    freshnessMinutesAgo: 8,
    availableToday: true,
    baseRatesChf: { minutes30: 250, minutes60: 400, minutes120: 750 },
    includedServices: ["gfe", "outcall", "wellness"],
    extraServicePricesChf: { dinner: 50, overnight: 800 },
    portalSources: [
      { portalName: "Direktbuchung (iWantSexNow.ch)", listedPriceChf: 400, verifiedMatch: true, lastSeenHoursAgo: 0 },
      { portalName: "and6.com (Index-Fund)", listedPriceChf: 460, verifiedMatch: true, lastSeenHoursAgo: 19 },
    ],
    rating: 5.0,
    reviewCount: 19,
    directEnquiryEnabled: true,
  },
  {
    id: "demo-zurich-begleitung",
    title: "Camilla",
    age: 28,
    city: "zurich",
    serviceAreas: ["zurich", "zug"],
    category: "companionship",
    description: "Stilvolle Begleitung für Business-Dinner, Events und private Stunden in Zürich und Zug.",
    demo: true,
    verifiedIdentity: true,
    freshnessMinutesAgo: 32,
    availableToday: true,
    baseRatesChf: { minutes30: 250, minutes60: 380, minutes120: 700 },
    includedServices: ["dinner", "gfe"],
    extraServicePricesChf: { outcall: 50, wellness: 80, overnight: 750 },
    portalSources: [
      { portalName: "Direktbuchung (iWantSexNow.ch)", listedPriceChf: 380, verifiedMatch: true, lastSeenHoursAgo: 1 },
      { portalName: "xdate.ch (Index-Fund)", listedPriceChf: 450, verifiedMatch: true, lastSeenHoursAgo: 24 },
    ],
    rating: 4.8,
    reviewCount: 14,
    directEnquiryEnabled: true,
  },
  {
    id: "demo-basel-massage",
    title: "Alina",
    age: 25,
    city: "basel",
    serviceAreas: ["basel", "zurich"],
    category: "massage",
    description: "Sinnliche Tantra- und Wellness-Massage im privaten Studio in Basel.",
    demo: true,
    verifiedIdentity: true,
    freshnessMinutesAgo: 45,
    availableToday: true,
    baseRatesChf: { minutes30: 180, minutes60: 280, minutes120: 500 },
    includedServices: ["wellness"],
    extraServicePricesChf: { gfe: 70, outcall: 60 },
    portalSources: [
      { portalName: "Direktbuchung (iWantSexNow.ch)", listedPriceChf: 280, verifiedMatch: true, lastSeenHoursAgo: 1 },
      { portalName: "and6.com (Index-Fund)", listedPriceChf: 340, verifiedMatch: true, lastSeenHoursAgo: 14 },
    ],
    rating: 4.9,
    reviewCount: 22,
    directEnquiryEnabled: true,
  },
  {
    id: "demo-bern-escort",
    title: "Victoria",
    age: 27,
    city: "bern",
    serviceAreas: ["bern", "zurich"],
    category: "escort",
    description: "Diskreter High-Class Service in Bern mit transparentem Gesamtpreis-Versprechen.",
    demo: true,
    verifiedIdentity: true,
    freshnessMinutesAgo: 60,
    availableToday: false,
    baseRatesChf: { minutes30: 240, minutes60: 360, minutes120: 680 },
    includedServices: ["gfe", "dinner"],
    extraServicePricesChf: { outcall: 40, wellness: 80 },
    portalSources: [
      { portalName: "Direktbuchung (iWantSexNow.ch)", listedPriceChf: 360, verifiedMatch: true, lastSeenHoursAgo: 1 },
    ],
    rating: 4.7,
    reviewCount: 11,
    directEnquiryEnabled: true,
  },
  {
    id: "demo-luzern-begleitung",
    title: "Noemi",
    age: 23,
    city: "luzern",
    serviceAreas: ["luzern", "zug"],
    category: "companionship",
    description: "Charmante Schweizer Begleitung für Luzern, Zug und Zentralschweiz.",
    demo: true,
    verifiedIdentity: true,
    freshnessMinutesAgo: 21,
    availableToday: true,
    baseRatesChf: { minutes30: 220, minutes60: 350, minutes120: 650 },
    includedServices: ["gfe", "dinner", "outcall"],
    extraServicePricesChf: { wellness: 60 },
    portalSources: [
      { portalName: "Direktbuchung (iWantSexNow.ch)", listedPriceChf: 350, verifiedMatch: true, lastSeenHoursAgo: 0 },
      { portalName: "xdate.ch (Index-Fund)", listedPriceChf: 400, verifiedMatch: true, lastSeenHoursAgo: 9 },
    ],
    rating: 4.9,
    reviewCount: 16,
    directEnquiryEnabled: true,
  },
];

export function calculateTransparentTotalCost(
  listing: DemoListing,
  durationMinutes: 30 | 60 | 120 = 60,
  selectedServices: readonly ServiceOptionId[] = []
): { baseChf: number; extrasChf: number; totalChf: number; thirdPartyAvgChf: number; savingsChf: number } {
  const rates = listing.baseRatesChf ?? { minutes30: 250, minutes60: 400, minutes120: 750 };
  const baseChf =
    durationMinutes === 30 ? rates.minutes30 : durationMinutes === 120 ? rates.minutes120 : rates.minutes60;

  let extrasChf = 0;
  const included = listing.includedServices ?? [];
  const extraMap = listing.extraServicePricesChf ?? {};

  for (const service of selectedServices) {
    if (!included.includes(service)) {
      extrasChf += extraMap[service] ?? 80;
    }
  }

  const totalChf = baseChf + extrasChf;
  const externalPortals = (listing.portalSources ?? []).filter(p => !p.portalName.startsWith("Direkt"));
  const thirdPartyBase =
    externalPortals.length > 0
      ? Math.round(externalPortals.reduce((sum, p) => sum + p.listedPriceChf, 0) / externalPortals.length)
      : baseChf + 60;
  const thirdPartyAvgChf = thirdPartyBase + extrasChf;

  return {
    baseChf,
    extrasChf,
    totalChf,
    thirdPartyAvgChf,
    savingsChf: Math.max(0, thirdPartyAvgChf - totalChf),
  };
}

export interface CatalogueFilters {
  city: CityId | "";
  category: CategoryId | "";
  q: string;
  view: "demo" | "approved";
  invalid: boolean;
}

type Query = Record<string, string | string[] | undefined>;

export function normalizeCatalogueText(value: string): string {
  return value.toLowerCase().replace(/ä/g, "a").replace(/ö/g, "o").replace(/ü/g, "u")
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/zuerich/g, "zurich")
    .replace(/\bgenf\b|\bgeneva\b/g, "geneve").replace(/\s+/g, " ").trim();
}

export function parseCatalogueFilters(query: Query): CatalogueFilters {
  let invalid = false;
  function scalar(key: string): string {
    const value = query[key];
    if (Array.isArray(value)) { invalid = true; return ""; }
    return value || "";
  }
  const city = scalar("city"), category = scalar("category"), view = scalar("view"), q = scalar("q");
  if (city && !catalogueCities.some(c => c.id === city)) invalid = true;
  if (category && !catalogueCategories.some(c => c.id === category)) invalid = true;
  if (view && view !== "demo" && view !== "approved") invalid = true;
  if (q.length > 100) invalid = true;
  return {
    city: catalogueCities.some(c => c.id === city) ? city as CityId : "",
    category: catalogueCategories.some(c => c.id === category) ? category as CategoryId : "",
    view: view === "approved" ? "approved" : "demo",
    q: q.trim().slice(0, 100),
    invalid,
  };
}

export function filterCatalogue(filters: CatalogueFilters): readonly DemoListing[] {
  if (filters.invalid) return [];
  const terms = normalizeCatalogueText(filters.q).split(" ").filter(Boolean);
  return demoListings.filter(item => {
    const areaLabels = (item.serviceAreas ?? [item.city]).map(c => cityLabel(c)).join(" ");
    const text = normalizeCatalogueText([item.title, cityLabel(item.city), areaLabels, categoryLabel(item.category), item.description].join(" "));
    const matchesCity = !filters.city || filters.city === item.city || (item.serviceAreas ?? []).includes(filters.city);
    const matchesCategory = !filters.category || filters.category === item.category;
    return matchesCity && matchesCategory && terms.every(term => text.includes(term));
  });
}

export function cityLabel(id: CityId): string {
  return catalogueCities.find(city => city.id === id)?.label ?? id;
}

export function categoryLabel(id: CategoryId): string {
  return catalogueCategories.find(category => category.id === id)?.label ?? id;
}

export function catalogueHref(filters: CatalogueFilters): string {
  const p = new URLSearchParams();
  if (filters.view === "approved") p.set("view", "approved");
  if (filters.city) p.set("city", filters.city);
  if (filters.category) p.set("category", filters.category);
  if (filters.q) p.set("q", filters.q);
  return "/search" + (p.size ? "?" + p.toString() : "");
}
