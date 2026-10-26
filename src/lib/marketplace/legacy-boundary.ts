import type { NextApiRequest, NextApiResponse } from "next";

/** Retired bearer links never authorize access, including tokens in Git history. */
export function legacyHeaders(res: NextApiResponse) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
}
export function retiredWrite(req: NextApiRequest, res: NextApiResponse) {
  legacyHeaders(res);
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ ok: false, error: "METHOD_NOT_ALLOWED" });
  }
  return res.status(410).json({ ok: false, error: "LEGACY_FLOW_RETIRED" });
}
