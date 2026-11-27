/** Keep gallery movement bounded even when a profile's image list changes. */
export function stepPhotoIndex(current: number, direction: number, count: number): number {
  if (!Number.isInteger(count) || count < 1) return 0;
  const index = Number.isInteger(current) ? Math.max(0, Math.min(current, count - 1)) : 0;
  const delta = Number.isInteger(direction) ? direction : 0;
  return ((index + delta) % count + count) % count;
}

export type ComparisonValue = string | number | null;

/** Missing evidence stays visible, even in the differences-only view. */
export function showComparisonRow(values: readonly ComparisonValue[], differencesOnly: boolean): boolean {
  if (!differencesOnly || values.length < 2 || values.some(value => value === null)) return true;
  return new Set(values.map(value => typeof value === 'string' ? value.trim().toLocaleLowerCase('de-CH') : value)).size > 1;
}
