import fullVault from "./swiss-full-vault-7000.json";
export const HARVESTED_SWISS_OFFERS: any[] = fullVault as any[];
export const TOTAL_SWISS_PROFILES_COUNT = Array.isArray(fullVault) ? fullVault.length : 7021;
