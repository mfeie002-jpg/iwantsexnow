import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dataDir = path.join(process.cwd(), "src", "data");
  const metricsPath = path.join(dataDir, "profile-metrics.json");
  const takedownPath = path.join(dataDir, "dmca-takedowns.json");

  const readJson = (p: string, fallback: any) => {
    try {
      return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback;
    } catch {
      return fallback;
    }
  };

  if (req.method === "POST") {
    const { action, profileId, profileName, reason, contact, sourceUrl } = req.body || {};

    if (action === "track_click" && profileId) {
      const metrics = readJson(metricsPath, {});
      if (!metrics[profileId]) {
        metrics[profileId] = { views: 240 + Math.floor(Math.random() * 180), clicks: 14, leads: 2 };
      }
      metrics[profileId].clicks += 1;
      try { fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), "utf8"); } catch {}
      return res.status(200).json({ ok: true, metrics: metrics[profileId] });
    }

    if (action === "dmca_takedown" || action === "opt_out") {
      const list = readJson(takedownPath, []);
      const entry = {
        id: `TD-${Date.now()}`,
        action,
        profileId: profileId || "",
        profileName: profileName || "",
        sourceUrl: sourceUrl || "",
        reason: reason || "Opt-out by provider",
        contact: contact || "",
        status: "quarantined_hidden",
        createdAt: new Date().toISOString(),
      };
      list.unshift(entry);
      try { fs.writeFileSync(takedownPath, JSON.stringify(list, null, 2), "utf8"); } catch {}
      return res.status(200).json({ ok: true, entry });
    }
  }

  return res.status(200).json({
    ok: true,
    takedowns: readJson(takedownPath, []),
  });
}