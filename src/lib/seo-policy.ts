export const siteOrigin = "https://iwantsexnow.ch";
/** Canonicals are same-origin paths, stripped of query/fragment and trailing slash. */
export function canonicalUrl(path: string = "/"): string {
  try {
    const parsed = new URL(path, siteOrigin);
    if (parsed.origin !== siteOrigin) return siteOrigin;
    const clean = parsed.pathname.replace(/\/$/, "") || "/";
    return siteOrigin + (clean === "/" ? "" : clean);
  } catch { return siteOrigin; }
}
// Indexing is withheld until the data/rights, operator and release gates are accepted.
export const releaseIndexingApproved = false;
