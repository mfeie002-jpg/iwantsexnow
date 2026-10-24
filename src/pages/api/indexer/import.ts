import type { NextApiRequest, NextApiResponse } from "next";
import { deduplicateScrapedOffers, INITIAL_RAW_SWISS_FEED, RawScrapedOffer } from "@/lib/marketplace/indexer";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const incoming = Array.isArray(req.body?.offers) ? (req.body.offers as RawScrapedOffer[]) : [];
    const combined = [...incoming, ...INITIAL_RAW_SWISS_FEED];
    const deduplicated = deduplicateScrapedOffers(combined);
    return res.status(200).json({
      status: "ok",
      rawCount: combined.length,
      deduplicatedCount: deduplicated.length,
      duplicatesEliminated: combined.length - deduplicated.length,
      profiles: deduplicated,
    });
  }

  const deduplicated = deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED);
  return res.status(200).json({
    status: "ok",
    rawCount: INITIAL_RAW_SWISS_FEED.length,
    deduplicatedCount: deduplicated.length,
    duplicatesEliminated: INITIAL_RAW_SWISS_FEED.length - deduplicated.length,
    profiles: deduplicated,
  });
}