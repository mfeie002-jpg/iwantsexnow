import type { NextApiRequest, NextApiResponse } from "next";
import { createClient } from "@supabase/supabase-js";
import { createDraftService, DraftError } from "./drafts";
import { supabaseDraftDependencies } from "./supabase-drafts";

const cookieName = "provider_draft_session";
const uuid = /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export class PrivateFlowError extends Error {
  constructor(public status: number, public code: string) { super(code); }
}
export function privateDraftConfig() {
  if (process.env.PRIVATE_PROVIDER_DRAFTS_ENABLED !== "true") return null;
  try {
    const origin = new URL(process.env.PRIVATE_PROVIDER_DRAFT_ORIGIN || "");
    const loopback = ["localhost", "127.0.0.1", "[::1]"].includes(origin.hostname);
    if ((origin.protocol !== "https:" && !(loopback && origin.protocol === "http:")) ||
      origin.username || origin.password || origin.pathname !== "/" || origin.search || origin.hash) return null;
    const users = (process.env.PRIVATE_PROVIDER_DRAFT_USER_IDS || "").split(",").map(v => v.trim()).filter(Boolean);
    if (!users.length || users.some(id => !uuid.test(id))) return null;
    return { origin: origin.origin, secure: origin.protocol === "https:", users: new Set(users) };
  } catch { return null; }
}
export function privateHeaders(res: { setHeader: (name: string, value: string) => unknown }) {
  res.setHeader("Cache-Control", "private, no-store, max-age=0");
  res.setHeader("X-Robots-Tag", "noindex, nofollow, noarchive");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Vary", "Cookie");
  res.setHeader("X-Frame-Options", "DENY");
}
export function requirePrivateFlow(req: NextApiRequest, res: NextApiResponse, methods: string[]) {
  privateHeaders(res);
  const config = privateDraftConfig();
  if (!config) throw new PrivateFlowError(404, "NOT_FOUND");
  if (!methods.includes(req.method || "")) {
    res.setHeader("Allow", methods.join(", "));
    throw new PrivateFlowError(405, "METHOD_NOT_ALLOWED");
  }
  if (req.headers["sec-fetch-site"] === "cross-site") throw new PrivateFlowError(403, "REQUEST_DENIED");
  if (req.method !== "GET") {
    if (req.headers.origin !== config.origin) throw new PrivateFlowError(403, "REQUEST_DENIED");
    if (req.method !== "DELETE" && req.headers["content-type"]?.split(";")[0] !== "application/json") {
      throw new PrivateFlowError(415, "JSON_REQUIRED");
    }
  }
  return config;
}
export function sessionToken(req: NextApiRequest) {
  const token = req.cookies?.[cookieName];
  return typeof token === "string" && token.length < 8192 && /^[A-Za-z0-9_.-]+$/.test(token) ? token : null;
}
export function sessionCookie(res: NextApiResponse, token: string, seconds: number) {
  const secure = privateDraftConfig()?.secure ? "; Secure" : "";
  res.setHeader("Set-Cookie", `${cookieName}=${token}; HttpOnly; SameSite=Strict; Path=/api/private; Max-Age=${seconds}${secure}`);
}
export function backendConfig() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
  // Reuse the accepted adapter's URL/public-key validation, without a request.
  try { supabaseDraftDependencies({ url, publicKey, accessToken: "config-validation" }); }
  catch { throw new PrivateFlowError(503, "BACKEND_UNAVAILABLE"); }
  return { url, publicKey };
}
export function authClient() {
  const { url, publicKey } = backendConfig();
  return createClient(url, publicKey, { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false },
    global: { fetch: timedFetch } });
}
export function privateDraftService(req: NextApiRequest) {
  const token = sessionToken(req);
  if (!token) throw new PrivateFlowError(401, "SESSION_REQUIRED");
  const config = privateDraftConfig();
  const deps = supabaseDraftDependencies({ ...backendConfig(), accessToken: token }, timedFetch);
  return createDraftService({ ...deps, resolveUser: async () => {
    const user = await deps.resolveUser();
    if (user && !config?.users.has(user.id)) throw new Error("DENIED");
    return user;
  } });
}
export const timedFetch: typeof fetch = (url, init) => fetch(url, { ...init, signal: AbortSignal.timeout(15000) });
export async function verifiedPrivateUser(req: NextApiRequest) {
  const token = sessionToken(req);
  if (!token) throw new PrivateFlowError(401, "SESSION_REQUIRED");
  const client = authClient();
  const { data, error } = await client.auth.getUser(token);
  if (error || !data.user || !data.user.email_confirmed_at || !privateDraftConfig()?.users.has(data.user.id)) {
    throw new PrivateFlowError(401, "SESSION_REQUIRED");
  }
  return data.user.id;
}
export function privateError(res: NextApiResponse, error: unknown) {
  if (error instanceof PrivateFlowError) return res.status(error.status).json({ error: error.code });
  if (error instanceof DraftError) {
    const status = { UNAUTHENTICATED: 401, INVALID_INPUT: 400, NOT_FOUND: 404, STORAGE_FAILURE: 503 }[error.code];
    return res.status(status).json({ error: error.code });
  }
  return res.status(503).json({ error: "TEMPORARILY_UNAVAILABLE" });
}
// Conservative per-process backstop for an internal pilot, not a distributed quota.
const windows = new Map<string, { until: number; count: number }>();
export function limitPrivateRequests(key: string, max: number) {
  const now = Date.now();
  for (const [k, value] of windows) if (value.until < now) windows.delete(k);
  const value = windows.get(key) || { until: now + 60000, count: 0 };
  if (windows.size >= 1000 && !windows.has(key)) throw new PrivateFlowError(429, "TRY_LATER");
  windows.set(key, value);
  if (++value.count > max) throw new PrivateFlowError(429, "TRY_LATER");
}
