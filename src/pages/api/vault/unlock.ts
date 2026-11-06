import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import crypto from "crypto";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const profileId = String(body.profileId || "").trim();
    const amountChf = Math.max(10, Math.min(500, Number(body.amountChf) || 29));
    const paymentMethod = String(body.paymentMethod || "TWINT / Karte").trim();

    if (!profileId) {
      return res.status(400).json({ ok: false, error: "profileId fehlt." });
    }

    const dataDir = path.join(process.cwd(), "src", "data");
    const statesPath = path.join(dataDir, "managed-profile-states.json");
    const states = fs.existsSync(statesPath) ? JSON.parse(fs.readFileSync(statesPath, "utf8")) : {};

    const creatorShareChf = Math.round(amountChf * 0.8 * 100) / 100;
    const platformShareChf = Math.round(amountChf * 0.2 * 100) / 100;
    const receiptId = "CH-VLT-" + crypto.randomBytes(4).toString("hex").toUpperCase();

    const prev = states[profileId] || { profileId };
    const prevUnlocks = Number(prev.vaultUnlockCount || 0);
    const prevGross = Number(prev.vaultGrossChf || 0);
    const prevNet80 = Number(prev.vaultNetCreatorChf || 0);

    states[profileId] = {
      ...prev,
      vaultUnlockCount: prevUnlocks + 1,
      vaultGrossChf: Math.round((prevGross + amountChf) * 100) / 100,
      vaultNetCreatorChf: Math.round((prevNet80 + creatorShareChf) * 100) / 100,
      lastVaultUnlockAt: new Date().toISOString(),
    };

    fs.writeFileSync(statesPath, JSON.stringify(states, null, 2), "utf8");

    return res.status(200).json({
      ok: true,
      receiptId,
      profileId,
      amountChf,
      creatorShareChf,
      platformShareChf,
      paymentMethod,
      unlockedAt: new Date().toISOString(),
    });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Unlock error" });
  }
}