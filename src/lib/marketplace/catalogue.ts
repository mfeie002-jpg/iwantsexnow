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

// Public fixtures are empty; neutral synthetic test records live in tests only.
export const demoListings: readonly DemoListing[] = [];

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

export function filterCatalogue(filters: CatalogueFilters, inventory: readonly DemoListing[] = demoListings): readonly DemoListing[] {
  if (filters.invalid || filters.view !== "demo") return [];
  const terms = normalizeCatalogueText(filters.q).split(" ").filter(Boolean);
  return inventory.filter(item => {
    const areaLabels = "";
    const text = normalizeCatalogueText([item.title, cityLabel(item.city), areaLabels, categoryLabel(item.category), item.description].join(" "));
    const matchesCity = !filters.city || filters.city === item.city;
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
