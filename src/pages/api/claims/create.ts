import type { NextApiRequest, NextApiResponse } from "next";
import { persistClaimAndNotify } from "@/lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const claimCode = `CLM-${Math.floor(100000 + Math.random() * 900000)}`;

  const record = {
    claimCode,
    artistName: String(body.artistName || "Sophia"),
    phone: String(body.phone || "+41 79 000 00 00"),
    city: String(body.city || "Zürich & Zug"),
    dailyCode: String(body.dailyCode || "CH-VERIFIED"),
    mode: (body.mode === "create" || body.mode === "verify" ? body.mode : "claim") as "claim" | "create" | "verify",
  };

  const delivery = await persistClaimAndNotify(record);

  return res.status(200).json({
    status: "ok",
    claimCode,
    bonusCreditsGranted: 2,
    delivery,
    claim: record,
  });
}