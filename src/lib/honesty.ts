/** Honest labels for harvested prices. Confirmed rates stay separate in getProfileRate. */

export function formatChf(amount: number): string {
  const negative = amount < 0;
  const digits = String(Math.round(Math.abs(amount)));
  const grouped = digits.replace(/\B(?=(\d{3})+(?!\d))/g, "\u2019");
  return negative ? `-${grouped}` : grouped;
}

export function isDerivedHalfHour(hourly: number, halfHour: number): boolean {
  if (!Number.isFinite(hourly) || !Number.isFinite(halfHour) || hourly <= 0 || halfHour <= 0) return false;
  return [0.6, 0.65].some((ratio) => {
    const scaled = Math.round((hourly * ratio) / 10) * 10;
    const plain = Math.round(hourly * ratio);
    return halfHour === scaled || halfHour === plain;
  });
}

/** Missing or sub-150 hourly figures are stored as CHF 400, usually with a derived 30-minute companion. */
export function isDefaultHourly(hourly: number, halfHour?: number | null): boolean {
  if (hourly !== 400) return false;
  if (halfHour == null || !Number.isFinite(halfHour)) return true;
  return isDerivedHalfHour(400, halfHour);
}

export type PriceLine = {
  amount: number | null;
  estimated: boolean;
  confirmed: boolean;
  label: string;
};

function finitePositive(value: number | null | undefined): number | null {
  return typeof value === "number" && Number.isFinite(value) && value > 0 ? value : null;
}

export function hourlyPriceLine(input: {
  confirmed?: number | null;
  harvested?: number | null;
  halfHour?: number | null;
}): PriceLine {
  const confirmed = finitePositive(input.confirmed);
  if (confirmed !== null) {
    return { amount: confirmed, estimated: false, confirmed: true, label: `CHF ${formatChf(confirmed)} / 60 Min. · bestätigt` };
  }
  const harvested = finitePositive(input.harvested);
  if (harvested === null) {
    return { amount: null, estimated: false, confirmed: false, label: "Honorar nicht angegeben" };
  }
  const estimated = isDefaultHourly(harvested, input.halfHour);
  return {
    amount: harvested,
    estimated,
    confirmed: false,
    label: estimated
      ? `CHF ${formatChf(harvested)} / 60 Min. · geschätzt`
      : `CHF ${formatChf(harvested)} / 60 Min. · aus dem Inserat, nicht bestätigt`,
  };
}

export function halfHourPriceLine(input: {
  confirmed?: number | null;
  harvested?: number | null;
  hourly?: number | null;
}): PriceLine {
  const confirmed = finitePositive(input.confirmed);
  if (confirmed !== null) {
    return { amount: confirmed, estimated: false, confirmed: true, label: `CHF ${formatChf(confirmed)} / 30 Min. · bestätigt` };
  }
  const harvested = finitePositive(input.harvested);
  if (harvested === null) {
    return { amount: null, estimated: false, confirmed: false, label: "Nicht angegeben" };
  }
  const hourly = finitePositive(input.hourly);
  const estimated = hourly !== null && isDerivedHalfHour(hourly, harvested);
  return {
    amount: harvested,
    estimated,
    confirmed: false,
    label: estimated
      ? `CHF ${formatChf(harvested)} / 30 Min. · geschätzt`
      : `CHF ${formatChf(harvested)} / 30 Min. · aus dem Inserat, nicht bestätigt`,
  };
}

export function countEstablishments(rows: unknown): number {
  if (!Array.isArray(rows)) return 0;
  return rows.filter((row) => {
    if (!row || typeof row !== "object") return false;
    const id = (row as { id?: unknown }).id;
    return typeof id === "string" && id.trim().length > 0;
  }).length;
}

export function latestOfferHarvestIso(rows: readonly { scrapedAt?: unknown; scrapedAtIso?: unknown }[] | null | undefined): string | null {
  if (!Array.isArray(rows)) return null;
  const stamps = rows
    .map((row) => Date.parse(String(row?.scrapedAtIso || row?.scrapedAt || "")))
    .filter((value) => Number.isFinite(value));
  if (!stamps.length) return null;
  return new Date(Math.max(...stamps)).toISOString();
}

export const COMPARISON_PORTALS = [
  { id: "and6", name: "and6", domains: ["and6.com"] },
  { id: "6navi", name: "6navi", domains: ["6navi.ch"] },
  { id: "sexch", name: "sex.ch", domains: ["sex.ch"] },
  { id: "ladies", name: "ladies.ch", domains: ["ladies.ch"] },
  { id: "saferchoice", name: "saferchoice", domains: ["saferchoice.ch"] },
  { id: "lolla", name: "Lolla", domains: ["lolla.ch"] },
  { id: "megaescort", name: "Megaescort", domains: ["megaescort.ch"] },
  { id: "target", name: "Target Escorts", domains: ["targetescorts.com"] },
  { id: "ladama", name: "Ladama", domains: ["ladama-escort.ch"] },
  { id: "girlsdeluxe", name: "Girls Deluxe", domains: ["girls-deluxe.ch"] },
] as const;

export type PortalFact = {
  id: string;
  name: string;
  domains: string[];
  status: "in Prüfung";
  rating: null;
  datedCount: number;
  latestScrapedAt: string | null;
  latestLabel: string;
  statement: string | null;
};

type OfferLike = { sourcePortal?: unknown; sourceUrl?: unknown; scrapedAt?: unknown; scrapedAtIso?: unknown };

function hostOf(value: unknown): string {
  try {
    return new URL(String(value || "")).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return "";
  }
}

function matchesDomain(offer: OfferLike, domains: readonly string[]): boolean {
  const portal = String(offer.sourcePortal || "").toLowerCase().replace(/^www\./, "");
  const host = hostOf(offer.sourceUrl);
  return domains.some((domain) => portal === domain || host === domain);
}

export function buildPortalFacts(offers: readonly OfferLike[]): PortalFact[] {
  return COMPARISON_PORTALS.map((slot) => {
    const dated = offers.flatMap((offer) => {
      if (!matchesDomain(offer, slot.domains)) return [];
      const stamp = Date.parse(String(offer.scrapedAtIso || offer.scrapedAt || ""));
      return Number.isFinite(stamp) ? [stamp] : [];
    });
    const latestScrapedAt = dated.length ? new Date(Math.max(...dated)).toISOString() : null;
    const latestLabel = formatStandDate(latestScrapedAt);
    const statement = dated.length && latestLabel
      ? `${dated.length} Einträge nennen ${slot.domains[0]} als Quelle und tragen einen Erfassungszeitstempel. Jüngster Zeitstempel: ${latestLabel}.`
      : null;
    return {
      id: slot.id,
      name: slot.name,
      domains: [...slot.domains],
      status: "in Prüfung",
      rating: null,
      datedCount: dated.length,
      latestScrapedAt,
      latestLabel,
      statement,
    };
  });
}

export function formatStandDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  const parts = new Intl.DateTimeFormat("de-CH", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/Zurich",
  }).formatToParts(date);
  const day = parts.find((part) => part.type === "day")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const year = parts.find((part) => part.type === "year")?.value;
  return day && month && year ? `${day}. ${month} ${year}` : "";
}
