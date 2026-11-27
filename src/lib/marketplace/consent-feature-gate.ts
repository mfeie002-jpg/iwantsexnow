import type { NextApiRequest, NextApiResponse } from "next";

/** No request/body flag can substitute for verified ownership, purpose-specific
 * consent and a server-side entitlement. Legacy generators stay closed. */
export function denyUnverifiedAiFeature(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }
  return res.status(503).json({ ok: false, code: "VERIFIED_AI_CONSENT_REQUIRED",
    error: "KI-Avatar, Stimme und Video sind derzeit nicht verfügbar. Zuerst müssen Kontozugang, konkrete Einwilligung und Berechtigung serverseitig geprüft werden.",
    next: "/creator-dashboard" });
}
