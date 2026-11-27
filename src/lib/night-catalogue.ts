export type Offer = Record<string, any>;
export type ProfileState = Record<string, any>;
export type CatalogueFilters = { canton?: string; category?: string; service?: string; q?: string; max?: number; under60?: number; price?: string; available?: boolean; wa?: boolean; sort?: string; invalid?: boolean };

export const CATALOGUE_SERVICES: Record<string,string> = {
  gfe: 'Girlfriend Experience', outcall: 'Haus- & Hotelbesuche',
  dinner: 'Dinner & Begleitung', couples: 'Begleitung für Paare',
};

export const REGIONS = [
  { name: 'Zürich', canton: 'ZH', slug: 'zuerich', image: 'city-zuerich.webp', href: '/escort-zurich' },
  { name: 'Zug', canton: 'ZG', slug: 'zug', image: 'city-zug.webp', href: '/orte/zug' },
  { name: 'Basel', canton: 'BS', slug: 'basel', image: 'city-basel.webp', href: '/escort-basel' },
  { name: 'Bern', canton: 'BE', slug: 'bern', image: 'city-bern.webp', href: '/escort-bern' },
  { name: 'Genève', canton: 'GE', slug: 'geneve', image: 'city-geneve.webp', href: '/escort-geneva' },
  { name: 'Luzern', canton: 'LU', slug: 'luzern', image: 'city-luzern.webp', href: '/orte/luzern' },
  { name: 'Lausanne', canton: 'VD', slug: 'lausanne', image: 'city-lausanne.webp', href: '/escort-lausanne' },
  { name: 'St. Gallen', canton: 'SG', slug: 'st-gallen', image: 'city-st-gallen.webp', href: '/orte/st-gallen' },
  { name: 'Lugano', canton: 'TI', slug: 'lugano', image: 'city-lugano.webp', href: '/escort-lugano' },
  { name: 'Aargau', canton: 'AG', slug: 'aargau', image: 'city-aargau.webp', href: '/orte/aargau' },
];
export const CANTONS = ['ZH','BE','LU','UR','SZ','OW','NW','GL','ZG','FR','SO','BS','BL','SH','AR','AI','SG','GR','AG','TG','TI','VD','VS','NE','GE','JU'];
export const CATEGORIES = [
  { id: 'all', label: 'Alle Bereiche', image: 'category-escort.webp' },
  { id: 'female', label: 'Escort & Begleitung', image: 'category-escort.webp' },
  { id: 'massage', label: 'Massage & Tantra', image: 'category-tantra.webp' },
  { id: 'bdsm', label: 'Domina & BDSM', image: 'category-bdsm.webp' },
  { id: 'trans', label: 'Trans', image: 'category-trans.webp' },
  { id: 'callboy', label: 'Männliche Begleitung', image: 'category-vip.webp' },
];
export const brandAsset = (name: string) => '/images/brand/v2/' + name;
export const getProfileId = (offer: Offer) => String(offer?.id || offer?.dedupClusterId || '');
export const getProfileName = (offer: Offer, state: ProfileState = {}) => String(state.displayName || offer?.displayName || offer?.rawName || 'Profil ohne Namen').trim();
export const getProfileCity = (offer: Offer, state: ProfileState = {}) => String(state.city || offer?.city || 'Ort nicht angegeben').trim();
export function safeExternalUrl(value: unknown): string | null {
  try { const u = new URL(String(value || '')); return ['http:', 'https:'].includes(u.protocol) && !u.username && !u.password ? u.href : null; } catch { return null; }
}
export function getProfilePhotos(offer: Offer, state: ProfileState = {}): string[] {
  const candidates = [state.thumbnail, ...(Array.isArray(state.gallery) ? state.gallery : []), offer?.thumbnail, offer?.photoUrl, offer?.imageUrl, ...(Array.isArray(offer?.gallery) ? offer.gallery : []), ...(Array.isArray(offer?.galleryUrls) ? offer.galleryUrls : []), ...(Array.isArray(offer?.originalGallery) ? offer.originalGallery : [])];
  const excluded = /(?:bg_blur|unsplash\.|pexels\.|pixabay\.|example\.com|placeholder|escort-portrait|\/images\/(?:ai|brand)\/|\.svg(?:[?#]|$)|no[-_]?image|spacer|favicon|(?:avatar[-_]default|default[-_]avatar)|(?:^|[/_-])logo(?:[._/-]|$))/i;
  return Array.from(new Set(candidates.filter((v): v is string => typeof v === 'string').map(v => v.trim()).filter(v => {
    let decoded:string;try{decoded=decodeURIComponent(v);}catch{return false;}
    if(excluded.test(decoded)||decoded.includes('\\'))return false;
    if(v.startsWith('/'))return /^\/(?:uploads|images\/(?:profiles|uploads))\//.test(decoded)&&!decoded.split('/').includes('..')&&/\.(?:jpe?g|png|webp|avif|gif)(?:[?#]|$)/i.test(decoded);
    return !!safeExternalUrl(v);
  })));
}
export function getProfileRate(state: ProfileState = {}, duration: 30 | 60, now = Date.now()): number | null {
  // Legacy import scripts populated rates. Only a dated, explicit price confirmation qualifies.
  const confirmed = state.priceConfirmed === true || state.rateConfirmed === true;
  const date = Date.parse(String(state.priceConfirmedAt || state.rateUpdatedAt || ''));
  const value = state[duration === 30 ? 'rate30Chf' : 'rate60Chf'];
  const rate = typeof value === 'number' || typeof value === 'string' ? Number(value) : NaN;
  return confirmed && date <= now && Number.isFinite(rate) && rate > 0 ? rate : null;
}
export function isConfirmedAvailable(state: ProfileState = {}, now = Date.now()): boolean {
  const until = Date.parse(String(state.availableUntil || ''));
  if (state.availabilityConfirmed !== true || !(until > now) || state.hidden || state.paused || state.removedByReport) return false;
  const fourHours = 4 * 60 * 60 * 1000;
  // Earlier managed records have only a flag and an expiry. A withdrawal
  // needs a later, dated confirmation before it can be superseded.
  if (state.availabilityConfirmedAt == null) return state.availabilityWithdrawnAt == null && until - now <= fourHours;
  const start = Date.parse(String(state.availabilityConfirmedAt));
  if (!(start <= now && until - start <= fourHours)) return false;
  return state.availabilityWithdrawnAt == null || Date.parse(String(state.availabilityWithdrawnAt)) < start;
}
export function isVisibleProfile(offer: Offer, states: Record<string, ProfileState> = {}, blockedIds: string[] = []): boolean {
  const id = getProfileId(offer), state = states[id] || {};
  if (/^w4-/i.test(id) || /^w4-/i.test(String(offer?.dedupClusterId || ''))) return false;
  if (typeof offer?.sourceUrl === 'string' && offer.sourceUrl) {
    try {
      if (new URL(offer.sourceUrl, 'https://catalogue.invalid').hostname.replace(/\.$/, '') === 'example.com') return false;
    } catch {
      // An unparseable source is not evidence that the listing is a test record.
    }
  }
  return !!id && !blockedIds.includes(id) && !state.hidden && !state.paused && !state.removedByReport && !offer?.hidden && !offer?.paused;
}
export function matchesCatalogueService(offer: Offer, service?: string): boolean {
  if (!service) return true;
  if (!Object.hasOwn(CATALOGUE_SERVICES, service)) return false;
  if (Array.isArray(offer.services)) return offer.services.includes(service);
  if (service === 'outcall') return offer.outcall === true;
  const text = [offer.rawName,offer.bio,...(Array.isArray(offer.includedTags)?offer.includedTags:[])]
    .filter(Boolean).join(' ');
  if (service === 'gfe') return /\bgfe\b|girlfriend/i.test(text);
  if (service === 'dinner') return /dinner|abendbegleitung/i.test(text);
  return /paare|couples|bisex/i.test(text);
}

export function filterOffers(offers: Offer[], filters: CatalogueFilters = {}, states: Record<string, ProfileState> = {}, blockedIds: string[] = []): Offer[] {
  if (filters.invalid) return [];
  const tokens = normalizeCatalogueText(filters.q || '').split(/\s+/).filter(Boolean);
  const category = filters.category || 'all';
  const list = offers.filter(o => {
    const id = getProfileId(o), st = states[id] || {};
    if (!isVisibleProfile(o, states, blockedIds)) return false;
    if (filters.canton && filters.canton !== 'ALL' && String(st.canton || o.canton || '').toUpperCase() !== filters.canton.toUpperCase()) return false;
    if (category !== 'all' && category !== 'ALL' && String(o.rubric || '') !== category) return false;
    if (filters.service && !matchesCatalogueService(o, filters.service)) return false;
    if (filters.available && !isConfirmedAvailable(st)) return false;
    if (filters.wa && !/^41(?:7[5-9]|[2-6]\d)\d{7}$/.test(cleanSwissPhone(st.phoneDisplay || o.rawPhone))) return false;
    const rate = getProfileRate(st, 60);
    if (filters.max && (!rate || rate > filters.max)) return false;
    if (filters.under60 && (rate === null || rate >= filters.under60)) return false;
    if (filters.price === 'missing' && rate !== null) return false;
    const text = normalizeCatalogueText([getProfileName(o, st), getProfileCity(o, st), st.canton || o.canton, o.rubric, ...(Array.isArray(o.includedTags) ? o.includedTags : [])].join(' '));
    if (!tokens.every(token => text.includes(token))) return false;
    return true;
  });
  if (filters.sort === 'region') list.sort((a,b) => getProfileCity(a,states[getProfileId(a)]).localeCompare(getProfileCity(b,states[getProfileId(b)]),'de-CH'));
  if (filters.sort === 'price') list.sort((a,b) => (getProfileRate(states[getProfileId(a)],60) ?? Infinity) - (getProfileRate(states[getProfileId(b)],60) ?? Infinity));
  return list;
}
export function normalizeCatalogueText(value: string): string {
  return value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLocaleLowerCase('de-CH')
    .replace(/\bzuerich\b/g, 'zurich').replace(/\b(?:genf|geneva)\b/g, 'geneve').trim();
}
export function cleanSwissPhone(input: unknown): string {
  let d = String(input || '').replace(/\D/g, '');
  if (d.startsWith('0041')) d = d.slice(2); else if (d.startsWith('0')) d = '41' + d.slice(1);
  return d;
}
export function searchHref(filters: CatalogueFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.invalid) params.set('invalid','1');
  if (filters.canton && filters.canton !== 'ALL') params.set('canton',filters.canton);
  if (filters.category && !['all','ALL'].includes(filters.category)) params.set('category',filters.category);
  if (filters.service) params.set('service',filters.service);
  if (filters.q) params.set('q',filters.q);
  if (filters.max && filters.max > 0) params.set('max',String(filters.max));
  if (filters.under60 && filters.under60 > 0) params.set('under60',String(filters.under60));
  if (filters.price === 'missing') params.set('price','missing');
  if (filters.available) params.set('available','1');
  if (filters.wa) params.set('wa','1');
  if (filters.sort && filters.sort !== 'default') params.set('sort',filters.sort);
  return '/search' + (params.size ? '?' + params.toString() : '');
}
export function filtersFromQuery(query: Record<string, string | string[] | undefined>): CatalogueFilters {
  const str = (key: string) => typeof query[key] === 'string' ? String(query[key]) : '';
  const maxAlias = str('max60');
  const strict = str('under60');
  const max = Number(str('max') || maxAlias);
  const validHourlyAmount = (value: string) =>
    /^\d+(?:\.\d{1,2})?$/.test(value) && Number(value) > 0 && Number(value) <= 100000;
  const timeAlias = str('now');
  const timeSelected = timeAlias === '1' || timeAlias === 'true';
  const canton = str('canton').toUpperCase();
  const service = str('service');
  const invalid = ['canton','category','service','q','max','max60','under60','price','available','now','wa','sort','invalid'].some(key=>Array.isArray(query[key]))
    || (!!canton && canton !== 'ALL' && !CANTONS.includes(canton))
    || (!!str('category') && !['ALL',...CATEGORIES.map(c=>c.id)].includes(str('category')))
    || (!!service && !Object.hasOwn(CATALOGUE_SERVICES, service))
    || str('q').length > 150 || !Number.isFinite(max) || max < 0
    || (query.under60 !== undefined && !validHourlyAmount(strict))
    || (query.max60 !== undefined && !validHourlyAmount(maxAlias))
    || (!!maxAlias && !!str('max') && Number(maxAlias) !== max)
    || (!!strict && (!!maxAlias || !!str('max')))
    || ((!!strict || !!maxAlias) && str('price') === 'missing')
    || !['','missing'].includes(str('price')) || !['','0','1'].includes(str('available'))
    || !['','0','1','true','false'].includes(timeAlias)
    || (!!str('available') && !!timeAlias && (str('available') === '1') !== timeSelected)
    || !['','0','1'].includes(str('wa')) || !['','default','region','price'].includes(str('sort'))
    || !!str('invalid');
  return {
    canton: CANTONS.includes(canton) ? canton : 'ALL',
    category: CATEGORIES.some(c => c.id === str('category')) ? str('category') : 'all',
    ...(service && Object.hasOwn(CATALOGUE_SERVICES, service) ? {service} : {}),
    q: str('q').slice(0,150),
    max: Number.isFinite(max) && max > 0 ? max : 0,
    ...(validHourlyAmount(strict) ? {under60:Number(strict)} : {}),
    price: str('price') === 'missing' ? 'missing' : '',
    available: str('available') === '1' || timeSelected,
    wa: str('wa') === '1',
    sort: ['region','price'].includes(str('sort')) ? str('sort') : 'default',
    ...(invalid ? {invalid:true} : {})
  };
}

/** Next puts the regional page's [service] slug in query.service. Only the explicit query string is a visitor selection. */
export function discoveryFiltersFromRoute(
  query: Record<string, string | string[] | undefined>, forced: CatalogueFilters = {}, asPath = ''
): CatalogueFilters {
  if (asPath.startsWith('/kategorie/')) {
    const url = new URL(asPath, 'https://catalogue.invalid');
    const selections = url.searchParams.getAll('service');
    query = {...query, service:selections.length > 1 ? selections : selections[0]};
  }
  const selected = filtersFromQuery(query);
  const contradictoryService = forced.service && selected.service && forced.service !== selected.service;
  return {...selected, ...forced, ...(contradictoryService ? {invalid:true} : {})};
}
