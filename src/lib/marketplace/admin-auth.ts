import type { NextApiRequest, NextApiResponse } from "next";
import { readBearerToken } from "./analyzer-proxy-policy";
import { legacyHeaders } from "./legacy-boundary";

const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
/** Verify the user and role upstream. No PIN, browser role or service key fallback. */
export async function requireServerAdmin(req: NextApiRequest, res: NextApiResponse): Promise<boolean> {
  legacyHeaders(res);
  const token = readBearerToken(req.headers.authorization);
  if (!token) { res.status(401).json({ ok: false, error: "SESSION_REQUIRED" }); return false; }
  try {
    const base = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL || "");
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (base.protocol !== "https:" || base.username || base.password || base.pathname !== "/" || !publicKey) throw Error();
    const headers = { apikey: publicKey, Authorization: "Bearer " + token };
    const read = (url: URL) => fetch(url, { headers, redirect: "error", signal: AbortSignal.timeout(10000) });
    const auth = await read(new URL("/auth/v1/user", base));
    if (!auth.ok) { res.status(401).json({ ok: false, error: "SESSION_REQUIRED" }); return false; }
    const user = await auth.json();
    if (!uuid.test(user?.id || "") || !user.email_confirmed_at) {
      res.status(401).json({ ok: false, error: "SESSION_REQUIRED" }); return false;
    }
    const url = new URL("/rest/v1/user_roles", base);
    url.search = new URLSearchParams({ select: "role", user_id: "eq." + user.id, role: "eq.admin", limit: "1" }).toString();
    const roles = await read(url);
    const data = roles.ok ? await roles.json() : null;
    if (!Array.isArray(data) || !data.some(r => r?.role === "admin")) {
      res.status(403).json({ ok: false, error: "ADMIN_REQUIRED" }); return false;
    }
    return true;
  } catch {
    res.status(503).json({ ok: false, error: "AUTH_BACKEND_UNAVAILABLE" }); return false;
  }
}
