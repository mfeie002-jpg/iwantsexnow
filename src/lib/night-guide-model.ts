import type { CatalogueFilters } from './night-catalogue';

// An invalid link starts a fresh selection. Valid links retain their other
// search criteria, which the guide displays alongside its choices.
export function guideFilters(filters: CatalogueFilters = {}): CatalogueFilters {
  const selection: CatalogueFilters = {
    canton: filters.canton || 'ALL',
    category: filters.category || 'all',
    max: filters.price === 'missing' ? 0 : filters.max || 0,
    price: filters.price === 'missing' ? 'missing' : '',
  };
  if (filters.invalid) return selection;
  if (filters.under60 && !selection.max && !selection.price) selection.under60 = filters.under60;
  if (filters.available) selection.available = true;
  if (filters.q) selection.q = filters.q;
  if (filters.wa) selection.wa = true;
  if (filters.sort && filters.sort !== 'default') selection.sort = filters.sort;
  return selection;
}

export function catalogueBudgetChoices(filters: CatalogueFilters) {
  const current = filters.price === 'missing' ? 'missing'
    : filters.under60 ? 'under-' + filters.under60 : String(filters.max || 0);
  const lowerThan = (amount: number) => ({
    value: 'under-' + amount, label: `Unter CHF ${amount} / 60 Min.`,
    changes: {under60: amount, max: 0, price: ''},
  });
  const atMost = (amount: number) => ({
    value: String(amount), label: `Bis CHF ${amount} / 60 Min.`,
    changes: {under60: 0, max: amount, price: ''},
  });
  const options = [
    {value: '0', label: 'Budget offen', changes: {under60: 0, max: 0, price: ''}},
    {value: 'missing', label: 'Preis auf Anfrage', changes: {under60: 0, max: 0, price: 'missing'}},
    atMost(200), lowerThan(300), atMost(400),
  ];
  if (!options.some(option => option.value === current)) {
    options.push(filters.under60 ? lowerThan(filters.under60) : atMost(filters.max));
  }
  return {current, options, label: options.find(option => option.value === current)!.label};
}

export function skipGuideStep(filters: CatalogueFilters, step: number): CatalogueFilters {
  if (step === 0) return { ...filters, canton: 'ALL' };
  if (step === 1) return { ...filters, category: 'all' };
  if (step === 2) {
    const { under60, ...rest } = filters;
    return { ...rest, max: 0, price: '' };
  }
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
