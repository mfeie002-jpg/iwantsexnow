import rawOffers from "../data/harvested-offers.json";
import { buildPortalFacts, type PortalFact } from "./honesty";

export type { PortalFact };
export { COMPARISON_PORTALS, buildPortalFacts } from "./honesty";

type OfferLike = { sourcePortal?: unknown; sourceUrl?: unknown; scrapedAt?: unknown; scrapedAtIso?: unknown };

export function loadPortalFacts(): PortalFact[] {
  const offers = Array.isArray(rawOffers) ? (rawOffers as OfferLike[]) : [];
  return buildPortalFacts(offers);
}
