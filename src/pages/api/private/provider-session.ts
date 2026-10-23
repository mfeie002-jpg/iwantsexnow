import type { NextApiRequest, NextApiResponse } from "next";
import { authClient, backendConfig, limitPrivateRequests, privateError, PrivateFlowError,
  requirePrivateFlow, sessionCookie, sessionToken, timedFetch, verifiedPrivateUser } from "@/lib/marketplace/private-draft-http";

export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const flow = requirePrivateFlow(req, res, ["GET", "POST", "DELETE"]);
    if (req.method === "DELETE") {
      sessionCookie(res, "", 0);
      const token = sessionToken(req);
      if (token) {
        try {
          const { url, publicKey } = backendConfig();
          const result = await timedFetch(new URL("/auth/v1/logout?scope=local", url), {
            method: "POST", headers: { apikey: publicKey, Authorization: `Bearer ${token}` },
          });
          if (!result.ok && result.status !== 401) return res.status(503).json({ error: "SIGNED_OUT_LOCALLY" });
        } catch { return res.status(503).json({ error: "SIGNED_OUT_LOCALLY" }); }
      }
      return res.status(200).json({ signedOut: true });
    }
    if (req.method === "GET") return res.status(200).json({ userId: await verifiedPrivateUser(req) });
    limitPrivateRequests("login", 20);
    const b = req.body;
    if (!b || typeof b !== "object" || Array.isArray(b) || Object.keys(b).sort().join(",") !== "email,password" ||
      typeof b.email !== "string" || b.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(b.email) ||
      typeof b.password !== "string" || !b.password || b.password.length > 1024) throw new PrivateFlowError(400, "INVALID_INPUT");
    sessionCookie(res, "", 0);
    const client = authClient();
    const { data, error } = await client.auth.signInWithPassword({ email: b.email, password: b.password });
    if (error || !data.session || !data.user?.email_confirmed_at || !flow.users.has(data.user.id)) {
      if (data.session) await client.auth.signOut({ scope: "local" });
      throw new PrivateFlowError(401, "SIGN_IN_FAILED");
    }
    // No refresh token is kept or returned. Reauthentication after at most 30 minutes.
    sessionCookie(res, data.session.access_token, Math.max(0, Math.min(1800, data.session.expires_in)));
    return res.status(200).json({ userId: data.user.id });
  } catch (error) { return privateError(res, error); }
}
