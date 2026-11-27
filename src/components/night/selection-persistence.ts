export const FAVORITES_KEY = 'ch_favorite_profiles';
export const COMPARISON_KEY = 'ch_compare_profiles';
export const isSelectionId = (id: unknown): id is string => typeof id === 'string' && /^[A-Za-z0-9][A-Za-z0-9_-]{0,127}$/.test(id);

export function parseSelectionIds(raw: string | null): string[] {
  if (raw === null) return [];
  const value: unknown = JSON.parse(raw);
  if (!Array.isArray(value)) throw new Error('Invalid saved selection');
  const ids = value.map(entry => typeof entry === 'string' ? entry : entry && typeof entry === 'object' ? entry.id : null);
  return Array.from(new Set(ids.filter(isSelectionId)));
}

export function readSelection(storage: Pick<Storage, 'getItem'>, key: string): { ok: true; ids: string[] } | { ok: false } {
  try { return { ok: true, ids: parseSelectionIds(storage.getItem(key)) }; }
  catch { return { ok: false }; }
}

export function writeSelection(storage: Pick<Storage, 'setItem'>, key: string, ids: string[]): boolean {
  try { storage.setItem(key, JSON.stringify(ids)); return true; }
  catch { return false; }
}

export function toggleSelection(previous: string[], id: string, visibleIds: ReadonlySet<string>, maximum = Infinity): { ids: string[]; outcome: 'added' | 'removed' | 'full' | 'unavailable' } {
  if (!isSelectionId(id)) return { ids: previous, outcome: 'unavailable' };
  if (previous.includes(id)) return { ids: previous.filter(item => item !== id), outcome: 'removed' };
  if (!visibleIds.has(id)) return { ids: previous, outcome: 'unavailable' };
  if (previous.length >= maximum) return { ids: previous, outcome: 'full' };
  return { ids: [...previous, id], outcome: 'added' };
}
