import stats from "../data/index-stats.json";
import establishments from "../data/swiss-establishments-vault.json";
import { countEstablishments, formatStandDate, latestDataStandIso } from "./honesty";

export type PublicCatalogueFacts = {
  clubCount: number;
  standIso: string | null;
  standLabel: string;
};

export function publicCatalogueFacts(): PublicCatalogueFacts {
  const standIso = latestDataStandIso(stats as Record<string, unknown>);
  return {
    clubCount: countEstablishments(establishments),
    standIso,
    standLabel: formatStandDate(standIso),
  };
}
