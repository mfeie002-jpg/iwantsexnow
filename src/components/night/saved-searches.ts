import {filtersFromQuery,searchHref} from '../../lib/night-catalogue.ts';

export type SavedSearch = { href: string; label: string };
export type SearchStorage = { getItem: (key: string) => string | null; setItem: (key: string, value: string) => void };
export const SAVED_SEARCH_KEY = 'ch_saved_searches_v1';
export const MAX_SAVED_SEARCHES = 5;

// Saved routes must remain inside the public discovery flow.
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
    const keys = ['canton','category','service','q','max','max60','under60','price','available','now','wa','sort'];
    for (const key of url.searchParams.keys()) {
      if (!keys.includes(key) || url.searchParams.getAll(key).length !== 1) return null;
    }
    const query = Object.fromEntries(url.searchParams);
    if (/[\u0000-\u001f\u007f]/.test(query.q || '')) return null;
    if (query.max && (!/^(?:0|[1-9]\d*)(?:\.\d+)?$/.test(query.max) || Number(query.max) > Number.MAX_SAFE_INTEGER)) return null;
    const filters = filtersFromQuery(query);
    if (filters.invalid) return null;
    const canonical = new URLSearchParams(searchHref(filters).split('?')[1]);
    canonical.sort();
    return url.pathname + (canonical.size ? '?' + canonical.toString() : '');
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
