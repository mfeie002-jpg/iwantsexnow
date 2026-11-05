import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminPin = process.env.ADMIN_PIN || "";
  const providedPin = String(req.headers["x-admin-pin"] || req.body?.adminPin || "").trim();

  if (!adminPin || adminPin.length < 10 || providedPin !== adminPin) {
    return res.status(403).json({
      ok: false,
      error: "Zugriff verweigert: Der Scraping-Import-Endpunkt erfordert einen gültigen Server-Admin-PIN.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const dataDir = path.join(process.cwd(), "src", "data");
    const offersPath = path.join(dataDir, "harvested-offers.json");
    const dniPath = path.join(dataDir, "do-not-import.json");

    const offers = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf8")) : [];
    const blocked = new Set(fs.existsSync(dniPath) ? JSON.parse(fs.readFileSync(dniPath, "utf8")) : []);

    const incoming = Array.isArray(req.body?.items) ? req.body.items : [];
    const existingIds = new Set(offers.map((o: any) => o.id || o.dedupClusterId));
    let added = 0;

    for (const raw of incoming) {
      const pid = String(raw.id || "").trim();
      if (!pid || blocked.has(pid) || existingIds.has(pid)) continue;
      const r60 = Math.max(100, Math.min(1200, Number(raw.advertisedBaseChf) || 350));
      const r30 = Math.max(80, Math.min(800, Number(raw.rate30Chf) || Math.round((r60 * 0.6) / 10) * 10));

      offers.push({
        ...raw,
        id: pid,
        advertisedBaseChf: r60,
        rate30Chf: r30,
        priceLabel: `CHF ${r60} / 60 Min. (CHF ${r30} / 30 Min.)`,
      });
      existingIds.add(pid);
      added++;
    }

    if (added > 0) {
      fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
    }

    return res.status(200).json({ ok: true, added, total: offers.length });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Import error" });
  }
}