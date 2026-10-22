import type { NextApiRequest, NextApiResponse } from "next";
import { verifyProviderSession } from "@/lib/server/provider-session";
import { providerReadiness } from "@/lib/marketplace/provider-readiness";

/** Read-only current-user readiness. Never accepts a listing, owner or verification claims. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("Vary", "Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Robots-Tag", "noindex, nofollow");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  if (Object.keys(req.query).length || (req.body != null && req.body !== "")) {
    return res.status(400).json({ error: "Parameters are not accepted" });
  }
  const result = await verifyProviderSession(req.headers.authorization);
  if (result.ok === false) return res.status(result.status).json({ error: result.error });
  return res.status(200).json(providerReadiness(result.session));
}
