import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminPin = process.env.ADMIN_PIN || "";
  const providedPin = String(req.headers["x-admin-pin"] || req.query.pin || "").trim();

  if (!adminPin || adminPin.length < 10 || providedPin !== adminPin) {
    return res.status(403).json({
      ok: false,
      error: "Zugriff verweigert: Gültiger ADMIN_PIN für den Harvester-Cron erforderlich.",
    });
  }

  try {
    const dataDir = path.join(process.cwd(), "src", "data");
    const statesPath = path.join(dataDir, "managed-profile-states.json");
    const offersPath = path.join(dataDir, "harvested-offers.json");
    const statsPath = path.join(dataDir, "index-stats.json");

    const states = fs.existsSync(statesPath) ? JSON.parse(fs.readFileSync(statesPath, "utf8")) : {};
    const offers = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf8")) : [];
    const stats = fs.existsSync(statsPath) ? JSON.parse(fs.readFileSync(statsPath, "utf8")) : {};

    const nowMs = Date.now();
    let expiredResetCount = 0;

    for (const [pid, st] of Object.entries<any>(states)) {
      if (st?.availabilityConfirmed && st?.availabilityExpiresAt) {
        const expMs = new Date(st.availabilityExpiresAt).getTime();
        if (Number.isFinite(expMs) && expMs < nowMs) {
          states[pid].availabilityConfirmed = false;
          expiredResetCount++;
        }
      }
    }

    if (expiredResetCount > 0) {
      fs.writeFileSync(statesPath, JSON.stringify(states, null, 2), "utf8");
    }

    stats.lastCronCheckAt = new Date().toISOString();
    stats.uniqueFrontendProfiles = offers.length;
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), "utf8");

    return res.status(200).json({
      ok: true,
      totalProfiles: offers.length,
      expiredAvailabilityReset: expiredResetCount,
      checkedAt: stats.lastCronCheckAt,
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Cron error" });
  }
}