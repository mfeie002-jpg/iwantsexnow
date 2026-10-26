import type { NextApiRequest, NextApiResponse } from "next";
import { legacyHeaders } from "@/lib/marketplace/legacy-boundary";
export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };
const retired = new Set(["claim_or_create_profile", "confirm_availability_4h", "update_profile_fields",
  "update_profile_state", "resolve_case", "report_or_optout", "track_view", "track_click", "track_source_out", "track_contact"]);
export default function handler(req: NextApiRequest, res: NextApiResponse) {
  legacyHeaders(res);
  if (req.method === "GET") return res.status(200).json({ ok: true, metrics: {}, states: {}, measurementStatus: "unavailable" });
  if (req.method !== "POST") {
    res.setHeader("Allow", "GET, POST");
    return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
  }
  if (!req.body || typeof req.body !== "object" || Array.isArray(req.body) || !retired.has(req.body.action)) {
    return res.status(400).json({ ok: false, error: "UNKNOWN_ACTION" });
  }
  // No legacy token, file, PIN or self-asserted role can restore authorization.
  return res.status(410).json({ ok: false, error: "LEGACY_FLOW_RETIRED" });
}
