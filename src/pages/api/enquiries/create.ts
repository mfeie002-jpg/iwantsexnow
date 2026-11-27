import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  return res.status(503).json({ ok: false, code: "VERIFIED_ENQUIRY_DELIVERY_REQUIRED",
    error: "Interne Anfragen sind derzeit nicht verfügbar. Eine bestätigte Zustellung an die zuständige Anbieterin ist noch nicht eingerichtet." });
}
