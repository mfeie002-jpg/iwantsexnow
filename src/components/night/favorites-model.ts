export type FavoriteOrder = 'saved' | 'name' | 'place';
export type FavoriteEntry = { id: string; name: string; city: string; canton: string };

export function favoriteRegionKey(canton: string): string {
  return canton.trim().toUpperCase() || 'unknown';
}

export function favoriteRegionCounts(entries: readonly FavoriteEntry[]): { key: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const entry of entries) {
    const key = favoriteRegionKey(entry.canton);
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return Array.from(counts, ([key, count]) => ({ key, count }));
}

/** Filtering and ordering never modify the saved ID list. Missing places sort last. */
export function selectFavorites<T extends FavoriteEntry>(entries: readonly T[], region: string, order: FavoriteOrder): T[] {
  const selected = entries.filter(entry => region === 'all' || favoriteRegionKey(entry.canton) === region);
  if (order === 'saved') return selected;
  const collator = new Intl.Collator('de-CH', { sensitivity: 'base', numeric: true });
  const field = order === 'name' ? 'name' : 'city';
  return selected.sort((a, b) => {
    const left = a[field].trim(), right = b[field].trim();
    if (!left || !right) return left ? -1 : right ? 1 : 0;
    return collator.compare(left, right);
  });
}
