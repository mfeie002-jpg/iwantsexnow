import type { CatalogueFilters } from './night-catalogue';

// The three-step guide starts a fresh, explicit selection. Hidden text, phone
// and availability filters must not silently constrain its displayed count.
export function guideFilters(filters: CatalogueFilters = {}): CatalogueFilters {
  return {
    canton: filters.canton || 'ALL',
    category: filters.category || 'all',
    max: filters.price === 'missing' ? 0 : filters.max || 0,
    price: filters.price === 'missing' ? 'missing' : '',
  };
}

export function skipGuideStep(filters: CatalogueFilters, step: number): CatalogueFilters {
  if (step === 0) return { ...filters, canton: 'ALL' };
  if (step === 1) return { ...filters, category: 'all' };
  if (step === 2) return { ...filters, max: 0, price: '' };
  return { ...filters };
}

export const QUICK_ROUTES = [
  { href: '/search', label: 'Profile entdecken', detail: 'Region und Bereich auswählen', keywords: 'suche filter escort massage entdecken' },
  { href: '/favorites', label: 'Meine Merkliste', detail: 'Deine gespeicherten Profile', keywords: 'favoriten merken saved' },
  { href: '/compare-escorts', label: 'Profile vergleichen', detail: 'Bis zu drei Einträge nebeneinander', keywords: 'vergleich comparison compare' },
  { href: '/clubs', label: 'Clubs & Studios', detail: 'Vorhandene Einrichtungen erkunden', keywords: 'salon studio club' },
  { href: '/reviews', label: 'Portale vergleichen', detail: 'Quellen und Unterschiede', keywords: 'portal review bewertung and6' },
  { href: '/safety', label: 'Sicherheit & Vertrauen', detail: 'Angaben einordnen', keywords: 'hilfe sicherheit vertrauen' },
  { href: '/pricing', label: 'Preise verstehen', detail: 'Bestätigte und offene Angaben', keywords: 'preis budget kosten honorar' },
  { href: '/advertise', label: 'Für Anbieter', detail: 'Deinen Auftritt vorbereiten', keywords: 'inserieren anbieter profil erstellen' },
  { href: '/login', label: 'Anmelden', detail: 'Dein Zugang', keywords: 'login konto account anmelden' },
  { href: '/report', label: 'Meldung & Korrektur', detail: 'Einen Eintrag prüfen lassen', keywords: 'melden report korrektur entfernen' },
] as const;

export function quickRoutes(query: string) {
  const words = query.trim().toLocaleLowerCase('de-CH').split(/\s+/).filter(Boolean);
  return QUICK_ROUTES.filter(route => words.every(word => `${route.label} ${route.detail} ${route.keywords}`.toLocaleLowerCase('de-CH').includes(word)));
}
