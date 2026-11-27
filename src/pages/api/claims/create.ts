import type { NextApiRequest, NextApiResponse } from "next";

// Security gate: legacy anonymous claim/self-registration cannot prove ownership.
// Re-enable only after verified session, durable storage and ownership checks exist.
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  return res.status(503).json({
    ok: false,
    code: "VERIFIED_PROVIDER_SESSION_REQUIRED",
    error: "Profilübernahme und Veröffentlichung benötigen eine verifizierte Anbietersitzung.",
    next: "/private/provider-draft"
  });
}
