import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const dataDir = path.join(process.cwd(), "src", "data");
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

  const metricsPath = path.join(dataDir, "real-profile-metrics.json");
  const statePath = path.join(dataDir, "managed-profile-states.json");
  const takedownPath = path.join(dataDir, "dmca-takedowns.json");

  const readJson = (p: string, fallback: any) => {
    try {
      return fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, "utf8")) : fallback;
    } catch {
      return fallback;
    }
  };

  const metrics = readJson(metricsPath, {});
  const states = readJson(statePath, {});
  const takedowns = readJson(takedownPath, []);

  if (req.method === "POST") {
    const { action, profileId, profileName, sourceUrl, contact, reason, updates } = req.body || {};

    // Echte Messung: Zählt nur tatsächlich ausgelöste Aufrufe & Quellen-Klicks
    if ((action === "track_view" || action === "track_click" || action === "track_source_out") && profileId) {
      if (!metrics[profileId]) {
        metrics[profileId] = { views: 0, detailOpens: 0, sourceClicks: 0, updatedAt: new Date().toISOString() };
      }
      if (action === "track_view") metrics[profileId].views += 1;
      if (action === "track_click") metrics[profileId].detailOpens += 1;
      if (action === "track_source_out") metrics[profileId].sourceClicks += 1;
      metrics[profileId].updatedAt = new Date().toISOString();
      try { fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2), "utf8"); } catch {}
      return res.status(200).json({ ok: true, metrics: metrics[profileId] });
    }

    // Echte Profil-Steuerung durch Anbieter oder Admin (Status, Verfügbarkeit mit Ablaufzeit, Pausieren)
    if (action === "update_profile_state" && profileId && updates) {
      states[profileId] = {
        ...(states[profileId] || {}),
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      try { fs.writeFileSync(statePath, JSON.stringify(states, null, 2), "utf8"); } catch {}
      return res.status(200).json({ ok: true, state: states[profileId] });
    }

    // Meldung, Widerspruch oder Entfernung (ohne Login-Pflicht + Do-Not-Import Sperre)
    if (action === "dmca_takedown" || action === "opt_out" || action === "report_issue") {
      const caseId = `CASE-${Date.now()}`;
      const entry = {
        id: caseId,
        action,
        profileId: profileId || "",
        profileName: profileName || "",
        sourceUrl: sourceUrl || "",
        reason: reason || "Entfernung / Widerspruch durch betroffene Person",
        contact: contact || "",
        status: "hidden_and_blocked",
        createdAt: new Date().toISOString(),
      };
      takedowns.unshift(entry);
      if (profileId) {
        states[profileId] = { ...(states[profileId] || {}), hidden: true, blockedFromImport: true };
        try { fs.writeFileSync(statePath, JSON.stringify(states, null, 2), "utf8"); } catch {}
      }
      try { fs.writeFileSync(takedownPath, JSON.stringify(takedowns, null, 2), "utf8"); } catch {}
      return res.status(200).json({ ok: true, entry });
    }
  }

  return res.status(200).json({
    ok: true,
    metrics,
    states,
    takedowns,
  });
}