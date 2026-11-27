import {
  filterOffers, filtersFromQuery, getProfileId,
  type CatalogueFilters, type Offer, type ProfileState
} from './night-catalogue.ts';

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
};

export class InvalidCataloguePageRequest extends Error {
  constructor(reason: string) {
    super(reason);
    this.name = 'InvalidCataloguePageRequest';
  }
}

const SERVICES = new Set(['gfe','outcall','dinner','couples']);
const QUERY_KEYS = new Set([
  'canton','category','q','max','price','available','wa','sort',
  'offset','limit','count','service'
]);

export function matchesCatalogueService(offer: Offer, service?: string): boolean {
  if (!service) return true;
  if (Array.isArray(offer.services)) return offer.services.includes(service);
  if (service === 'outcall') return offer.outcall === true;
  const text = [offer.rawName,offer.bio,...(Array.isArray(offer.includedTags)?offer.includedTags:[])]
    .filter(Boolean).join(' ');
  if (service === 'gfe') return /\bgfe\b|girlfriend/i.test(text);
  if (service === 'dinner') return /dinner|abendbegleitung/i.test(text);
  if (service === 'couples') return /paare|couples|bisex/i.test(text);
  return false;
}

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
  const service = typeof query.service === 'string' ? query.service : '';
  if (service && !SERVICES.has(service)) throw new InvalidCataloguePageRequest('Ungültiger Bereich.');
  if (query.count !== undefined && query.count !== '1') {
    throw new InvalidCataloguePageRequest('Ungültige Zähloption.');
  }
  const offset = boundedInteger(query.offset, 0, 0, 10000);
  const limit = boundedInteger(query.limit, CATALOGUE_PAGE_SIZE, 1, MAX_CATALOGUE_PAGE_SIZE);
  return {filters,offset,limit,countOnly:query.count === '1',...(service?{service}:{})};
}

export function createPublicCataloguePage(
  snapshot: PublicSnapshot,
  options: PageOptions
): PublicCataloguePage {
  if (options.filters.invalid) {
    return {offers:[],states:{},total:0,offset:options.offset,limit:options.limit,nextOffset:null};
  }
  const matches = filterOffers(
    snapshot.offers,options.filters,snapshot.states,snapshot.blockedIds
  ).filter(item => matchesCatalogueService(item,options.service));
  const total = matches.length;
  if (options.countOnly) {
    return {offers:[],states:{},total,offset:0,limit:0,nextOffset:null};
  }
  const offers = matches.slice(options.offset,options.offset+options.limit);
  const states: Record<string, ProfileState> = {};
  for (const offer of offers) {
    const id = getProfileId(offer);
    if (snapshot.states[id]) states[id] = snapshot.states[id];
  }
  const nextOffset = options.offset + offers.length < total
    ? options.offset + offers.length : null;
  return {offers,states,total,offset:options.offset,limit:options.limit,nextOffset};
}
