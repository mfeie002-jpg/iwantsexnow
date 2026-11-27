const EXCLUDED_MEDIA = /(?:bg_blur|unsplash\.|pexels\.|pixabay\.|example\.com|placeholder|escort-portrait|\/images\/(?:ai|brand)\/|(?:avatar[-_]default|default[-_]avatar)|no[-_]?image|spacer|favicon|(?:^|[/_-])logo(?:[._/-]|$))/i;
const RASTER_PATH = /\.(?:jpe?g|png|webp|avif|gif)(?:$|[?#])/i;

/** Profile media and brand illustration are separate namespaces. Never synthesize a face. */
export function profileImageSource(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) return null;
  let raw = value.trim();
  if (raw.startsWith("/api/img?")) {
    const request = new URL(raw, "https://iwantsexnow.ch");
    raw = request.searchParams.get("u") || request.searchParams.get("url") || request.searchParams.get("src") || "";
  }
  let decoded: string;
  try { decoded = decodeURIComponent(raw); } catch { return null; }
  if (EXCLUDED_MEDIA.test(decoded) || /\.svg(?:$|[?#])/i.test(decoded) || raw.includes("\\")) return null;
  if (raw.startsWith("/")) {
    if (raw.startsWith("//")) return null;
    const local = new URL(raw, "https://iwantsexnow.ch");
    return /^\/(?:uploads|images\/(?:profiles|uploads))\//.test(local.pathname) && RASTER_PATH.test(local.pathname) ? local.pathname + local.search : null;
  }
  try {
    const url = new URL(raw);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password || url.port) return null;
    const host = url.hostname.toLowerCase();
    if (host === "localhost" || host.endsWith(".local") || /^[\d.]+$/.test(host) || host.includes(":")) return null;
    if (url.searchParams.has("iwsn_clean")) {
      url.searchParams.delete("iwsn_clean");
      url.searchParams.delete("mask");
      url.searchParams.delete("crop");
    }
    url.hash = "";
    return "/api/img?u=" + encodeURIComponent(url.href);
  } catch { return null; }
}

export function profileImageCandidates(values: readonly unknown[]): string[] {
  return Array.from(new Set(values.map(profileImageSource).filter((source): source is string => Boolean(source))));
}

export function nextProfileImage(candidates: readonly string[], failed: ReadonlySet<string>): string | null {
  return candidates.find(source => !failed.has(source)) || null;
}

export function resolveSelectedProfiles<T>(offers: readonly T[], ids: readonly string[], getId: (offer: T) => string): T[] {
  const byId = new Map(offers.map(offer => [getId(offer), offer]));
  return Array.from(new Set(ids)).map(id => byId.get(id)).filter((offer): offer is T => offer !== undefined);
}

export function reconcileComparisonPair(ids: readonly string[], current: readonly string[]): string[] {
  return Array.from(new Set([...current.filter(id => ids.includes(id)), ...ids])).slice(0, 2);
}

export function chooseComparisonProfile(ids: readonly string[], current: readonly string[], slot: number, next: string): string[] {
  const pair = reconcileComparisonPair(ids, current);
  if (!ids.includes(next) || ![0, 1].includes(slot)) return pair;
  const other = slot === 0 ? 1 : 0;
  if (pair[other] === next) pair[other] = pair[slot];
  pair[slot] = next;
  return reconcileComparisonPair(ids, pair.filter(Boolean));
}

export const NEUTRAL_PROFILE_IMAGE = "data:image/svg+xml," + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 640"><rect width="480" height="640" fill="#211722"/><rect x="175" y="240" width="130" height="100" rx="12" fill="none" stroke="#a57b91" stroke-width="3"/><path d="m190 320 35-35 24 22 27-38 18 51" fill="none" stroke="#a57b91" stroke-width="3"/><text x="240" y="385" text-anchor="middle" fill="#d8bdcc" font-family="Arial,sans-serif" font-size="17">Profilfoto nicht verfügbar</text></svg>');
