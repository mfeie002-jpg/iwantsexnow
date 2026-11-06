import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const dataDir = path.join(process.cwd(), "src", "data");
    const offersPath = path.join(dataDir, "harvested-offers.json");
    const clubsPath = path.join(dataDir, "swiss-establishments-vault.json");
    const statesPath = path.join(dataDir, "managed-profile-states.json");
    const dniPath = path.join(dataDir, "do-not-import.json");

    const offers = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf8")) : [];
    const clubs = fs.existsSync(clubsPath) ? JSON.parse(fs.readFileSync(clubsPath, "utf8")) : [];
    const states = fs.existsSync(statesPath) ? JSON.parse(fs.readFileSync(statesPath, "utf8")) : {};
    const blocked = new Set(fs.existsSync(dniPath) ? JSON.parse(fs.readFileSync(dniPath, "utf8")) : []);

    let priceOutliers = 0;
    let blockedLeaks = 0;
    let withSwissPhone = 0;
    const cantons: Record<string, number> = {};

    for (const o of offers) {
      const pid = o.id || o.dedupClusterId;
      if (blocked.has(pid)) blockedLeaks++;
      const r60 = Number(o.advertisedBaseChf);
      if (!Number.isFinite(r60) || r60 < 100 || r60 > 1200) priceOutliers++;
      if (o.rawPhone && String(o.rawPhone).startsWith("+41")) withSwissPhone++;
      const c = String(o.canton || "ZH").toUpperCase();
      cantons[c] = (cantons[c] || 0) + 1;
    }

    const active4hCount = Object.values<any>(states).filter((s) => s?.availabilityConfirmed).length;
    const verifiedCount = Object.values<any>(states).filter((s) => s?.identityVerified).length;

    return res.status(200).json({
      ok: priceOutliers === 0 && blockedLeaks === 0 && offers.length > 2000,
      timestamp: new Date().toISOString(),
      metrics: {
        totalProfiles: offers.length,
        totalClubs: clubs.length,
        profilesWithSwissPhone: withSwissPhone,
        active4hProfiles: active4hCount,
        verifiedProfiles: verifiedCount,
        priceOutliers,
        blockedLeaks,
        blockedOptOutTotal: blocked.size,
      },
      cantonBreakdown: cantons,
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Healthcheck error" });
  }
}