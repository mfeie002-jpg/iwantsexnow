import type { NextApiRequest, NextApiResponse } from "next";
import { INITIAL_RAW_SWISS_FEED, deduplicateScrapedOffers } from "@/lib/marketplace/indexer";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const deduplicated = deduplicateScrapedOffers(INITIAL_RAW_SWISS_FEED);
  return res.status(200).json({
    status: "ok",
    metrics: {
      totalRawScraped: INITIAL_RAW_SWISS_FEED.length,
      deduplicatedProfiles: deduplicated.length,
      duplicatesRemoved: INITIAL_RAW_SWISS_FEED.length - deduplicated.length,
      directVerifiedCount: deduplicated.filter((p) => p.bookingMode === "direct").length,
      activePilotRegions: ["Zürich (ZH)", "Zug & Cham (ZG)", "Basel (BS)", "Bern (BE)", "Genève (GE)"],
    },
    profiles: deduplicated,
  });
}