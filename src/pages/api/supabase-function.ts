import type { NextApiRequest, NextApiResponse } from "next";
import { parseAnalyzerCall, readBearerToken } from "@/lib/marketplace/analyzer-proxy-policy";

export const config = { api: { bodyParser: { sizeLimit: "256kb" } } };

/** Admin-only internal Web Analyzer proxy. No service-role key. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");

  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });
  const operation = parseAnalyzerCall(req.body);
  if (!operation) return res.status(400).json({ error: "Invalid analyzer operation" });

  const token = readBearerToken(req.headers.authorization);
  if (!token) return res.status(401).json({ error: "Admin session required" });

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!rawUrl || !anonKey) return res.status(503).json({ error: "Analyzer backend unavailable" });
  let base: URL;
  try {
    base = new URL(rawUrl);
    if (base.protocol !== "https:" || base.username || base.password) throw new Error("Invalid URL");
  } catch {
    return res.status(503).json({ error: "Analyzer backend unavailable" });
  }
  const headers = { apikey: anonKey, Authorization: "Bearer " + token };
  try {
    // Verify the supplied JWT with Supabase Auth, not by trusting browser claims.
    const auth = await fetch(new URL("/auth/v1/user", base).toString(), {
      method: "GET", headers, signal: AbortSignal.timeout(15000),
    });
    if (!auth.ok) return res.status(401).json({ error: "Admin session expired or invalid" });
    const user: unknown = await auth.json();
    if (!user || typeof user !== "object" || !("id" in user) ||
        typeof user.id !== "string" || user.id.length < 20) {
      return res.status(401).json({ error: "Admin session expired or invalid" });
    }
    // RLS must allow this user to read their admin role, or the request is denied.
    const roleUrl = new URL("/rest/v1/user_roles", base);
    roleUrl.searchParams.set("select", "role");
    roleUrl.searchParams.set("user_id", "eq." + user.id);
    roleUrl.searchParams.set("role", "eq.admin");
    roleUrl.searchParams.set("limit", "1");
    const roleResponse = await fetch(roleUrl.toString(), {
      method: "GET", headers, signal: AbortSignal.timeout(15000),
    });
    if (!roleResponse.ok) return res.status(403).json({ error: "Admin access required" });
    const roles: unknown = await roleResponse.json();
    if (!Array.isArray(roles) ||
        !roles.some(role => role && typeof role === "object" && "role" in role && role.role === "admin")) {
      return res.status(403).json({ error: "Admin access required" });
    }
    const response = await fetch(
      new URL("/functions/v1/" + operation.functionName, base).toString(), {
        method: "POST",
        headers: { ...headers, "Content-Type": "application/json" },
        body: JSON.stringify(operation.payload),
        signal: AbortSignal.timeout(60000),
      }
    );
    if (!response.ok) return res.status(502).json({ error: "Analyzer function failed" });
    return res.status(200).json(await response.json());
  } catch {
    // Never leak upstream URLs, tokens or personal data via errors.
    return res.status(502).json({ error: "Analyzer upstream temporarily unavailable" });
  }
}
