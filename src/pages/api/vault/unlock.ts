import type { NextApiRequest, NextApiResponse } from "next";

// Never accept client-supplied amounts or transaction references as proof of payment.
// This legacy route stays closed pending server-side payment webhook verification.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  return res.status(503).json({
    ok: false,
    code: "VERIFIED_PAYMENT_REQUIRED",
    error: "Digitale Freischaltungen sind derzeit nicht verfügbar, da eine verifizierte Zahlungsbestätigung fehlt."
  });
}
