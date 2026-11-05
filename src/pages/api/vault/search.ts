import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dataDir = path.join(process.cwd(), "src", "data");
    const offersPath = path.join(dataDir, "harvested-offers.json");
    const statesPath = path.join(dataDir, "managed-profile-states.json");
    const dniPath = path.join(dataDir, "do-not-import.json");

    const offers = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf8")) : [];
    const states = fs.existsSync(statesPath) ? JSON.parse(fs.readFileSync(statesPath, "utf8")) : {};
    const blocked = new Set(fs.existsSync(dniPath) ? JSON.parse(fs.readFileSync(dniPath, "utf8")) : []);

    const q = String(req.query.q || "").toLowerCase().trim();
    const canton = String(req.query.canton || "ALL").toUpperCase().trim();
    const rubric = String(req.query.rubric || "ALL").toLowerCase().trim();
    const page = Math.max(1, parseInt(String(req.query.page || "1"), 10) || 1);
    const limit = Math.min(100, Math.max(12, parseInt(String(req.query.limit || "48"), 10) || 48));

    const merged = [];
    for (const o of offers) {
      const pid = o.id || o.dedupClusterId;
      if (blocked.has(pid)) continue;
      const st = states[pid] || {};
      if (st.paused || st.hidden || st.removedByReport) continue;

      const item = {
        ...o,
        id: pid,
        rawName: st.displayName || o.rawName,
        city: st.city || o.city,
        canton: st.canton || o.canton,
        rawPhone: st.phoneDisplay || o.rawPhone,
        rate30Chf: st.rate30Chf || o.rate30Chf || 200,
        advertisedBaseChf: st.rate60Chf || o.advertisedBaseChf || 350,
        thumbnail: st.thumbnail || o.thumbnail,
        availabilityConfirmed: Boolean(
          st.availabilityConfirmed || (st.availableUntil && new Date(st.availableUntil).getTime() > Date.now())
        ),
        identityVerified: Boolean(st.identityVerified),
        claimed: Boolean(st.claimed),
      };

      if (canton !== "ALL" && String(item.canton || "").toUpperCase() !== canton) continue;
      if (rubric !== "ALL" && String(item.rubric || "female").toLowerCase() !== rubric) continue;
      if (q) {
        const hay = `${item.rawName || ""} ${item.city || ""} ${item.canton || ""} ${(item.includedTags || []).join(" ")} ${item.bio || ""} ${item.rawPhone || ""}`.toLowerCase();
        if (!hay.includes(q)) continue;
      }
      merged.push(item);
    }

    const start = (page - 1) * limit;
    return res.status(200).json({
      status: "ok",
      totalMatches: merged.length,
      page,
      limit,
      results: merged.slice(start, start + limit),
    });
  } catch (e: any) {
    return res.status(200).json({ status: "ok", totalMatches: 0, results: [] });
  }
}