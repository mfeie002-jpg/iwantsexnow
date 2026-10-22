import { readBearerToken } from "../marketplace/analyzer-proxy-policy";

/** Request-scoped verification only. No browser claims, cookies or service key fallback. */
export type ProviderSession = { subject: string; emailConfirmed: boolean };
export type SessionResult =
  | { ok: true; session: ProviderSession }
  | { ok: false; status: 401 | 503; error: string };

const uuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function verifyProviderSession(authorization: unknown): Promise<SessionResult> {
  const token = readBearerToken(authorization);
  if (!token) return { ok: false, status: 401, error: "Session required" };
  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  let base: URL;
  try {
    base = new URL(rawUrl || "");
    // Restrict the configured authority; never forward credentials through redirects.
    if (base.protocol !== "https:" || base.username || base.password ||
        base.pathname !== "/" || base.search || base.hash || !anonKey) throw new Error();
  } catch {
    return { ok: false, status: 503, error: "Authentication unavailable" };
  }
  try {
    const response = await fetch(new URL("/auth/v1/user", base), {
      method: "GET",
      headers: { apikey: anonKey, Authorization: "Bearer " + token },
      redirect: "error",
      cache: "no-store",
      signal: AbortSignal.timeout(10000),
    });
    if (response.status === 401 || response.status === 403) {
      return { ok: false, status: 401, error: "Session expired or invalid" };
    }
    if (!response.ok) throw new Error();
    const user: unknown = await response.json();
    if (!user || typeof user !== "object" || Array.isArray(user)) throw new Error();
    const u = user as Record<string, unknown>;
    if (typeof u.id !== "string" || !uuid.test(u.id) ||
        u.role !== "authenticated" || u.is_anonymous !== false) {
      return { ok: false, status: 401, error: "Registered user session required" };
    }
    // Email confirmation is an onboarding prerequisite, never identity or age proof.
    const confirmed = typeof u.email_confirmed_at === "string" &&
      Number.isFinite(Date.parse(u.email_confirmed_at)) &&
      Date.parse(u.email_confirmed_at) <= Date.now();
    return { ok: true, session: { subject: u.id, emailConfirmed: confirmed } };
  } catch {
    return { ok: false, status: 503, error: "Authentication unavailable" };
  }
}
