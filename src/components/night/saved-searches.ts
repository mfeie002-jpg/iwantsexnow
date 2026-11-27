export type SavedSearch = { href: string; label: string };
export type SearchStorage = { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };
export const SAVED_SEARCH_KEY = 'ch_saved_searches_v1';
export const MAX_SAVED_SEARCHES = 5;

// Bounded public route/filter allowlists. Keep this storage boundary independent
// of React and the catalogue payload; restoration never needs a raw profile.
const savedCantons = new Set(['ZH','BE','LU','UR','SZ','OW','NW','GL','ZG','FR','SO','BS','BL','SH','AR','AI','SG','GR','AG','TG','TI','VD','VS','NE','GE','JU']);
const savedCategories = new Set(['all','female','massage','bdsm','trans','callboy']);
const savedRegions = new Set(['zuerich','zug','basel','bern','geneve','luzern','lausanne','st-gallen','lugano','aargau','zurich','baden','winterthur']);
const savedServices = new Set(['girlfriend-experience','tantra-massage','haus-und-hotelbesuche','domina-bdsm','dinner-date','trans-escort','paare-und-bisex']);
const savedStaticRoutes = new Set(['/search','/escort-zurich','/escort-basel','/escort-bern','/escort-geneva','/escort-lausanne','/escort-lugano']);

function isSavedDiscoveryPath(path: string): boolean {
  if (savedStaticRoutes.has(path)) return true;
  const segments = path.split('/');
  if (segments.length === 3 && segments[1] === 'orte') return savedRegions.has(segments[2]);
  return segments.length === 4 && segments[1] === 'kategorie' && savedRegions.has(segments[2]) && savedServices.has(segments[3]);
}

// Only relative discovery destinations may be restored from browser storage.
export function safeSavedSearchHref(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > 900 || !value.startsWith('/') || value.startsWith('//') || /[\\#\u0000-\u0020]/.test(value)) return null;
  try {
    const url = new URL(value, 'https://local.invalid');
    if (url.origin !== 'https://local.invalid' || value.split('?')[0] !== url.pathname || !isSavedDiscoveryPath(url.pathname)) return null;
    const keys = ['canton', 'category', 'q', 'max', 'price', 'available', 'wa', 'sort'];
    for (const key of url.searchParams.keys()) if (!keys.includes(key) || url.searchParams.getAll(key).length !== 1) return null;
    const get = (key: string) => url.searchParams.get(key) || '';
    const canton = get('canton').toUpperCase();
    const category = get('category') === 'ALL' ? 'all' : get('category');
    const maximum = get('max');
    if (canton && canton !== 'ALL' && !savedCantons.has(canton)) return null;
    if (category && !savedCategories.has(category)) return null;
    if (maximum && (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(maximum) || !Number.isFinite(Number(maximum)) || Number(maximum) > Number.MAX_SAFE_INTEGER)) return null;
    if (!['','missing'].includes(get('price')) || !['','0','1'].includes(get('available')) || !['','0','1'].includes(get('wa')) || !['','default','region','price'].includes(get('sort'))) return null;
    if (get('q').length > 150 || /[\u0000-\u001f\u007f]/.test(get('q'))) return null;
    // Normalize aliases/defaults so the same search occupies only one slot.
    if (canton && canton !== 'ALL') url.searchParams.set('canton',canton); else url.searchParams.delete('canton');
    if (category && category !== 'all') url.searchParams.set('category',category); else url.searchParams.delete('category');
    if (Number(maximum) > 0) url.searchParams.set('max',String(Number(maximum))); else url.searchParams.delete('max');
    for (const key of ['available','wa']) if (get(key) !== '1') url.searchParams.delete(key);
    if (get('sort') === 'default') url.searchParams.delete('sort');
    for (const key of ['price','sort','q']) if (!get(key)) url.searchParams.delete(key);
    url.searchParams.sort();
    return url.pathname + (url.search ? url.search : '');
  } catch { return null; }
}

export function parseSavedSearches(value: string | null): SavedSearch[] {
  try {
    const data: unknown = JSON.parse(value || '[]');
    if (!Array.isArray(data)) return [];
    const result: SavedSearch[] = [];
    for (const item of data) {
      const href = safeSavedSearchHref(item?.href);
      if (!href || typeof item?.label !== 'string' || !item.label.trim() || result.some(entry => entry.href === href)) continue;
      result.push({ href, label: item.label.trim().slice(0, 180) });
      if (result.length === MAX_SAVED_SEARCHES) break;
    }
    return result;
  } catch { return []; }
}

export function saveSearch(storage: SearchStorage, entry: SavedSearch): { entries: SavedSearch[]; outcome: 'saved' | 'exists' | 'full' | 'invalid' } {
  const entries = parseSavedSearches(storage.getItem(SAVED_SEARCH_KEY));
  const href = safeSavedSearchHref(entry.href);
  if (!href || !entry.label.trim()) return { entries, outcome: 'invalid' };
  if (entries.some(item => item.href === href)) return { entries, outcome: 'exists' };
  if (entries.length >= MAX_SAVED_SEARCHES) return { entries, outcome: 'full' };
  const next = [{ href, label: entry.label.trim().slice(0, 180) }, ...entries];
  // Callers only display success after the browser confirms this write.
  storage.setItem(SAVED_SEARCH_KEY, JSON.stringify(next));
  return { entries: next, outcome: 'saved' };
}

export function removeSavedSearch(storage: SearchStorage, href: string): SavedSearch[] {
  const entries = parseSavedSearches(storage.getItem(SAVED_SEARCH_KEY)).filter(entry => entry.href !== href);
  storage.setItem(SAVED_SEARCH_KEY, JSON.stringify(entries));
  return entries;
}
