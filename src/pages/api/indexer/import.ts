import type { NextApiRequest, NextApiResponse } from "next";
import {
  deduplicateScrapedOffers,
  INITIAL_RAW_SWISS_FEED,
  RawScrapedOffer,
  normalizeSwissPhone,
} from "@/lib/marketplace/indexer";

// In-memory runtime store so newly scraped batches stay active immediately even before Supabase is connected
let runtimeScrapedOffers: RawScrapedOffer[] = [...INITIAL_RAW_SWISS_FEED];

async function upsertProfilesToSupabase(offers: RawScrapedOffer[]) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseKey) return false;

  const deduplicated = deduplicateScrapedOffers(offers);

  for (const p of deduplicated) {
    try {
      await fetch(`${supabaseUrl.replace(/\/$/, "")}/rest/v1/provider_profiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          Prefer: "resolution=merge-duplicates",
        },
        body: JSON.stringify({
          dedup_cluster_id: p.dedupClusterId,
          normalized_phone: p.normalizedPhoneMask,
          display_name: p.displayName,
          age: p.age,
          primary_city: p.primaryCity,
          canton: p.canton,
          subareas: p.subareas,
          booking_mode: p.bookingMode,
          rate_60_chf: p.bestBaseRate60Chf,
          portal_avg_60_chf: p.portalAverage60Chf,
          included_services: p.includedServices,
          extra_prices_chf: p.extraPricesChf,
          incall: p.incall,
          outcall: p.outcall,
        }),
      });
    } catch {
      // continue on individual row error
    }
  }
  return true;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const incoming = Array.isArray(req.body?.offers) ? (req.body.offers as RawScrapedOffer[]) : [];
    if (incoming.length > 0) {
      runtimeScrapedOffers = [...incoming, ...runtimeScrapedOffers];
    }
    const syncedToDb = await upsertProfilesToSupabase(runtimeScrapedOffers);
    const deduplicated = deduplicateScrapedOffers(runtimeScrapedOffers);

    return res.status(200).json({
      status: "ok",
      syncedToSupabase: syncedToDb,
      rawCount: runtimeScrapedOffers.length,
      deduplicatedCount: deduplicated.length,
      duplicatesEliminated: runtimeScrapedOffers.length - deduplicated.length,
      profiles: deduplicated,
    });
  }

  const deduplicated = deduplicateScrapedOffers(runtimeScrapedOffers);
  return res.status(200).json({
    status: "ok",
    rawCount: runtimeScrapedOffers.length,
    deduplicatedCount: deduplicated.length,
    duplicatesEliminated: runtimeScrapedOffers.length - deduplicated.length,
    profiles: deduplicated,
  });
}