import offers from "../data/harvested-offers.json";
import establishments from "../data/swiss-establishments-vault.json";
import { countEstablishments, formatStandDate, latestOfferHarvestIso } from "./honesty";

export type PublicCatalogueFacts = {
  clubCount: number;
  standIso: string | null;
  standLabel: string;
};

export function publicCatalogueFacts(): PublicCatalogueFacts {
  const standIso = latestOfferHarvestIso(offers as { scrapedAt?: unknown; scrapedAtIso?: unknown }[]);
  return {
    clubCount: countEstablishments(establishments),
    standIso,
    standLabel: formatStandDate(standIso),
  };
}
