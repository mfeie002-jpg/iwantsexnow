import type { NextApiRequest, NextApiResponse } from "next";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { legacyHeaders } from "@/lib/marketplace/legacy-boundary";
import { searchPublicListings, SearchInputError } from "@/lib/marketplace/public-search";
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  legacyHeaders(res);
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ status: "error", error: "METHOD_NOT_ALLOWED" });
  }
  try { return res.status(200).json(searchPublicListings(req.query, HARVESTED_SWISS_OFFERS)); }
  catch (error) {
    return res.status(error instanceof SearchInputError ? 400 : 503).json({ status: "error", error: error instanceof SearchInputError ? "INVALID_QUERY" : "SEARCH_UNAVAILABLE" });
  }
}
