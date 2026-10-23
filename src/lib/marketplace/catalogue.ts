/** Public preview fixtures only. Never import private drafts or credentials here. */
export const catalogueCities = [
  { id: "zurich", label: "Zürich" }, { id: "basel", label: "Basel" },
  { id: "bern", label: "Bern" }, { id: "luzern", label: "Luzern" },
  { id: "winterthur", label: "Winterthur" }, { id: "st-gallen", label: "St. Gallen" },
  { id: "geneva", label: "Genève" }, { id: "lausanne", label: "Lausanne" },
  { id: "lugano", label: "Lugano" },
] as const;
export const catalogueCategories = [
  { id: "escort", label: "Escort" }, { id: "companionship", label: "Begleitung" },
  { id: "massage", label: "Massage" },
] as const;
export type CityId = typeof catalogueCities[number]["id"];
export type CategoryId = typeof catalogueCategories[number]["id"];
export interface DemoListing {
  id: string;
  title: string;
  city: CityId;
  category: CategoryId;
  description: string;
  demo: true;
}
export const demoListings: readonly DemoListing[] = [
  { id: "demo-zurich-escort", title: "Demo Zürich 01", city: "zurich", category: "escort", description: "Fiktives Inserat zum Testen der Kategorie Escort in Zürich.", demo: true },
  { id: "demo-zurich-begleitung", title: "Demo Zürich 02", city: "zurich", category: "companionship", description: "Fiktives Inserat zum Testen der Kategorie Begleitung in Zürich.", demo: true },
  { id: "demo-basel-massage", title: "Demo Basel 01", city: "basel", category: "massage", description: "Fiktives Inserat zum Testen der Kategorie Massage in Basel.", demo: true },
  { id: "demo-bern-escort", title: "Demo Bern 01", city: "bern", category: "escort", description: "Fiktives Inserat zum Testen der Kategorie Escort in Bern.", demo: true },
  { id: "demo-luzern-begleitung", title: "Demo Luzern 01", city: "luzern", category: "companionship", description: "Fiktives Inserat zum Testen der Kategorie Begleitung in Luzern.", demo: true },
  { id: "demo-geneva-escort", title: "Demo Genève 01", city: "geneva", category: "escort", description: "Fiktives Inserat für Genève / Genf. Keine reale Person.", demo: true },
  { id: "demo-lausanne-massage", title: "Demo Lausanne 01", city: "lausanne", category: "massage", description: "Fiktives Inserat zum Testen der Kategorie Massage in Lausanne.", demo: true },
  { id: "demo-lugano-begleitung", title: "Demo Lugano 01", city: "lugano", category: "companionship", description: "Fiktives Inserat zum Testen der Kategorie Begleitung in Lugano.", demo: true },
];
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
    view: view === "approved" ? "approved" : "demo", q: q.trim().slice(0, 100), invalid,
  };
}
export function filterCatalogue(filters: CatalogueFilters): readonly DemoListing[] {
  // Approved inventory is deliberately empty until a separate public-data release.
  if (filters.invalid || filters.view !== "demo") return [];
  const terms = normalizeCatalogueText(filters.q).split(" ").filter(Boolean);
  return demoListings.filter(item => {
    const text = normalizeCatalogueText([item.title, cityLabel(item.city), categoryLabel(item.category), item.description].join(" "));
    return (!filters.city || filters.city === item.city) &&
      (!filters.category || filters.category === item.category) && terms.every(term => text.includes(term));
  });
}
export function cityLabel(id: CityId): string {
  return catalogueCities.find(city => city.id === id)!.label;
}
export function categoryLabel(id: CategoryId): string {
  return catalogueCategories.find(category => category.id === id)!.label;
}
export function catalogueHref(filters: CatalogueFilters): string {
  const p = new URLSearchParams();
  if (filters.view === "approved") p.set("view", "approved");
  if (filters.city) p.set("city", filters.city);
  if (filters.category) p.set("category", filters.category);
  if (filters.q) p.set("q", filters.q);
  return "/search" + (p.size ? "?" + p.toString() : "");
}
