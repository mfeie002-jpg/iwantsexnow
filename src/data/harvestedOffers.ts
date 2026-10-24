import rawOffers from "./harvested-offers.json";
export const HARVESTED_SWISS_OFFERS: any[] = Array.isArray(rawOffers) ? (rawOffers as any[]) : [];
