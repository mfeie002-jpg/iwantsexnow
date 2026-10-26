import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import { HARVESTED_SWISS_OFFERS } from "@/data/harvestedOffers";
import { normalizeSwissGeo } from "@/lib/swissGeoNormalizer";

const STATE_FILE = path.join(process.cwd(), "src", "data", "live-vault-state.json");
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

function loadStates(): Record<string, any> {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      return raw.states || {};
    }
  } catch {}
  return {};
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ ok: false, status: "error", error: "Method not allowed" });
  }

  const q = String(req.query.q || req.query.query || "").toLowerCase().trim();
  const cantonFilter = String(req.query.canton || "ALL").toUpperCase().trim();
  const cityFilter = String(req.query.city || "").toLowerCase().trim();
  const portalFilter = String(req.query.portal || "").toLowerCase().trim();
  const onlyAvailable = req.query.available === "true";
  const onlyManaged = req.query.managed === "true" || req.query.verifiedOnly === "true";
  const page = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
  const limit = Math.min(200, Math.max(1, parseInt(String(req.query.limit || "48"), 10) || 48));

  const states = loadStates();
  const now = Date.now();
  const rawList = Array.isArray(HARVESTED_SWISS_OFFERS) ? HARVESTED_SWISS_OFFERS : [];

  const projected = [];
  for (let i = 0; i < rawList.length; i++) {
    const item = rawList[i];
    if (!item) continue;
    const id = String(item.dedupClusterId || item.id || "ch-" + (i + 1));
    const st = states[id] || {};

    // Globale Sperr- und Pausen-Durchsetzung (IWSN-010)
    if (st.hidden || st.paused) continue;

    const geo = normalizeSwissGeo(st.city || item.city, st.canton || item.canton);
    const isSelfManaged = Boolean(st.claimed || item.bookingMode === "direct");

    let availabilityConfirmed = Boolean(st.availabilityConfirmed);
    let confirmedMinutesAgo: number | null = null;
    if (availabilityConfirmed && st.availabilityConfirmedAt) {
      const elapsed = now - Number(st.availabilityConfirmedAt);
      if (elapsed > FOUR_HOURS_MS) {
        availabilityConfirmed = false;
      } else {
        confirmedMinutesAgo = Math.max(1, Math.round(elapsed / 60000));
      }
    }

    const rate = st.rate60Chf !== undefined ? Number(st.rate60Chf) : Number(item.advertisedBaseChf) || null;
    const displayName = String(st.displayName || item.rawName || "Profil").trim();

    projected.push({
      ...item,
      id,
      dedupClusterId: id,
      rawName: displayName,
      city: geo.cleanCity,
      cleanCity: geo.cleanCity,
      canton: geo.trueCanton,
      advertisedBaseChf: rate,
      isSelfManaged,
      availabilityConfirmed,
      confirmedMinutesAgo,
      identityVerified: Boolean(st.identityVerified),
    });
  }

  const matched = projected.filter((p) => {
    if (cantonFilter && cantonFilter !== "ALL" && p.canton !== cantonFilter) return false;
    if (cityFilter && !String(p.cleanCity || "").toLowerCase().includes(cityFilter)) return false;
    if (portalFilter && !String(p.sourcePortal || "").toLowerCase().includes(portalFilter)) return false;
    if (onlyAvailable && !p.availabilityConfirmed) return false;
    if (onlyManaged && !p.isSelfManaged) return false;
    if (q) {
      const hay = [
        p.rawName,
        p.cleanCity,
        p.canton,
        p.sourcePortal,
        p.rawPhone,
        ...(Array.isArray(p.includedTags) ? p.includedTags : []),
      ]
        .join(" ")
        .toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });

  const totalMatches = matched.length;
  const start = (page - 1) * limit;
  const sliced = matched.slice(start, start + limit);

  // Erfüllt gleichzeitig den neuen Client-Vertrag (status/results/totalMatches)
  // UND den bestehenden CI-Testvertrag (ok/listings/stats.totalMatching)!
  return res.status(200).json({
    ok: true,
    status: "ok",
    page,
    limit,
    totalMatches,
    results: sliced,
    listings: sliced,
    stats: {
      totalMatching: totalMatches,
      returnedCount: sliced.length,
      page,
      limit,
    },
  });
}
