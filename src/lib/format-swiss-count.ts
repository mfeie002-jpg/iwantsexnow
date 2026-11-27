// Stable across Node/browser ICU versions: do not use locale-sensitive grouping in hydrated text.
export function formatSwissCount(value: number): string {
  if (!Number.isSafeInteger(value)) return String(value);
  return String(value).replace(/\B(?=(\d{3})+(?!\d))/g, '\u2019');
}
