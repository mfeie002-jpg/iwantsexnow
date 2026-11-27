import {
  filterOffers, filtersFromQuery, getProfileId,
  type CatalogueFilters, type Offer, type ProfileState
} from './night-catalogue.ts';
export { matchesCatalogueService } from './night-catalogue.ts';

export const CATALOGUE_PAGE_SIZE = 24;
export const MAX_CATALOGUE_PAGE_SIZE = 48;

export type PublicSnapshot = {
  states: Record<string, ProfileState>;
  blockedIds: string[];
  offers: Offer[];
  clubs: Offer[];
};

export type PageOptions = {
  filters: CatalogueFilters;
  offset: number;
  limit: number;
  countOnly?: boolean;
  service?: string;
};

export type PublicCataloguePage = {
  offers: Offer[];
  states: Record<string, ProfileState>;
  total: number;
  offset: number;
  limit: number;
  nextOffset: number | null;
  nextAvailabilityExpiry?: number;
  alternatives?: CatalogueAlternative[];
};

export type CatalogueAlternative = { label: string; filters: CatalogueFilters; total: number };

function earliestExpiry(offers: Offer[], states: Record<string, ProfileState>): number | undefined {
  let earliest = Infinity;
  for (const offer of offers) {
    const expiry = Date.parse(states[getProfileId(offer)]?.availableUntil);
    if (expiry < earliest) earliest = expiry;
  }
  return Number.isFinite(earliest) ? earliest : undefined;
}

function findAlternatives(snapshot: PublicSnapshot, filters: CatalogueFilters) {
  const hasBudget = Boolean(filters.max || filters.under60);
  const alternatives: CatalogueAlternative[] = [];
  let nextAvailabilityExpiry: number | undefined;
  const openBudget = { max: 0, under60: 0 };
  function offerChoice(label: string, change: Partial<CatalogueFilters>) {
    const next = { ...filters, ...change };
    const matches = filterOffers(snapshot.offers, next, snapshot.states, snapshot.blockedIds);
    if (!matches.length) return;
    alternatives.push({ label, filters: next, total: matches.length });
    if (next.available) nextAvailabilityExpiry = earliestExpiry(matches, snapshot.states);
  }

  if (filters.available) offerChoice('Zeitfenster offen lassen', { available: false });
  if (hasBudget) offerChoice('Budget offen lassen', openBudget);
  if (!alternatives.length && hasBudget && filters.available) {
    offerChoice('Budget und Zeitfenster offen lassen', { ...openBudget, available: false });
  }
  return {
    ...(alternatives.length ? { alternatives } : {}),
    ...(nextAvailabilityExpiry !== undefined ? { nextAvailabilityExpiry } : {})
  };
}

export class InvalidCataloguePageRequest extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = 'InvalidCataloguePageRequest';
  }
}

const QUERY_KEYS = new Set([
  'canton','category','q','max','max60','under60','price','available','now','wa','sort',
  'offset','limit','count','service'
]);

function boundedInteger(input: unknown, fallback: number, min: number, max: number): number {
  if (input === undefined || input === '') return fallback;
  if (typeof input !== 'string' || !/^\d+$/.test(input)) {
    throw new InvalidCataloguePageRequest('Ungültige Seitenangabe.');
  }
  const number = Number(input);
  if (!Number.isSafeInteger(number) || number < min || number > max) {
    throw new InvalidCataloguePageRequest('Seitenangabe ausserhalb des erlaubten Bereichs.');
  }
  return number;
}

export function parseCataloguePageOptions(
  query: Record<string, string | string[] | undefined>
): PageOptions {
  for (const [key, value] of Object.entries(query)) {
    if (!QUERY_KEYS.has(key) || Array.isArray(value)) {
      throw new InvalidCataloguePageRequest('Unbekannte oder mehrfache Auswahl.');
    }
  }
  const filters = filtersFromQuery(query);
  if (filters.invalid) throw new InvalidCataloguePageRequest('Ungültiger Suchfilter.');
  if (query.count !== undefined && query.count !== '1') {
    throw new InvalidCataloguePageRequest('Ungültige Zähloption.');
  }
  const offset = boundedInteger(query.offset, 0, 0, 10000);
  const limit = boundedInteger(query.limit, CATALOGUE_PAGE_SIZE, 1, MAX_CATALOGUE_PAGE_SIZE);
  return {filters,offset,limit,countOnly:query.count === '1',...(filters.service?{service:filters.service}:{})};
}

export function createPublicCataloguePage(
  snapshot: PublicSnapshot,
  options: PageOptions
): PublicCataloguePage {
  const filters = options.service ? {...options.filters, service:options.service} : options.filters;
  if (filters.invalid || (options.service && options.filters.service && options.service !== options.filters.service)) {
    return {offers:[],states:{},total:0,offset:options.offset,limit:options.limit,nextOffset:null};
  }
  const matches = filterOffers(snapshot.offers, filters, snapshot.states, snapshot.blockedIds);
  const total = matches.length;
  const expiry = filters.available ? earliestExpiry(matches, snapshot.states) : undefined;
  const timing = expiry === undefined ? {} : {nextAvailabilityExpiry:expiry};
  if (options.countOnly) {
    return {offers:[],states:{},total,offset:0,limit:0,nextOffset:null,...timing};
  }
  if (!total && options.offset === 0) {
    return { offers: [], states: {}, total: 0, offset: 0, limit: options.limit, nextOffset: null,
      ...findAlternatives(snapshot, filters) };
  }
  const offers = matches.slice(options.offset,options.offset+options.limit);
  const states: Record<string, ProfileState> = {};
  for (const offer of offers) {
    const id = getProfileId(offer);
    if (snapshot.states[id]) states[id] = snapshot.states[id];
  }
  const nextOffset = options.offset + offers.length < total
    ? options.offset + offers.length : null;
  return {offers,states,total,offset:options.offset,limit:options.limit,nextOffset,...timing};
}
