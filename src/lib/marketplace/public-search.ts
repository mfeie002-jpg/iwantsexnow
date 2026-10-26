export type PublicListing = {
  id: string; rawName: string; city: string; canton: string;
  sourcePortal: string; sourceUrl: string; thumbnail?: string;
  advertisedBaseChf?: number; availabilityConfirmed?: boolean; isSelfManaged?: boolean;
};
export class SearchInputError extends Error {}
const cantons = new Set("ALL ZH BE LU UR SZ OW NW GL ZG FR SO BS BL SH AR AI SG GR AG TG TI VD VS NE GE JU".split(" "));
export function searchPublicListings(query: Record<string, unknown>, listings: readonly PublicListing[]) {
  const scalar = (key: string, fallback: string) => {
    const value = query[key];
    if (value === undefined) return fallback;
    if (typeof value !== "string" || value.length > 200) throw new SearchInputError();
    return value;
  };
  const integer = (key: string, fallback: string, max: number) => {
    const value = scalar(key, fallback);
    if (!/^[1-9][0-9]*$/.test(value) || Number(value) > max) throw new SearchInputError();
    return Number(value);
  };
  const flag = (key: string) => {
    const value = scalar(key, "false");
    if (value !== "true" && value !== "false") throw new SearchInputError();
    return value === "true";
  };
  if (Object.keys(query).some(k => !["q", "canton", "page", "limit", "available", "managed", "withPrice"].includes(k))) throw new SearchInputError();
  const q = scalar("q", "").trim().toLocaleLowerCase("de-CH");
  const canton = scalar("canton", "ALL").toUpperCase();
  if (!cantons.has(canton)) throw new SearchInputError();
  const page = integer("page", "1", 100000), limit = integer("limit", "48", 100);
  const available = flag("available"), managed = flag("managed"), withPrice = flag("withPrice");
  const matches = listings.filter(v =>
    (canton === "ALL" || v.canton === canton) &&
    (!available || v.availabilityConfirmed === true) && (!managed || v.isSelfManaged === true) &&
    (!withPrice || Number(v.advertisedBaseChf) > 0) &&
    (!q || `${v.rawName} ${v.city} ${v.canton} ${v.sourcePortal}`.toLocaleLowerCase("de-CH").includes(q))
  );
  const results = matches.slice((page - 1) * limit, page * limit).map(v => ({
    id: v.id, rawName: v.rawName, city: v.city, canton: v.canton,
    sourcePortal: v.sourcePortal, sourceUrl: v.sourceUrl,
    thumbnail: v.thumbnail || null, advertisedBaseChf: v.advertisedBaseChf || null,
    availabilityConfirmed: v.availabilityConfirmed === true, isSelfManaged: v.isSelfManaged === true,
  }));
  return { status: "ok" as const, results, totalMatches: matches.length, page, limit, totalPages: Math.ceil(matches.length / limit), inventoryStatus: "reviewed_only" };
}
