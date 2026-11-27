import fs from "fs";
import path from "path";
import crypto from "crypto";

const SUPABASE_URL = (process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "").replace(/\/$/, "");
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SERVICE_KEY);
}

export function hashSwissPhone(rawPhone: string): string | null {
  const digits = String(rawPhone || "").replace(/\D/g, "").replace(/^0041/, "41").replace(/^0/, "41");
  if (digits.length < 9) return null;
  return crypto.createHash("sha256").update(digits).digest("hex");
}

export async function sendTelegramPing(lines: string[]): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return;
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: chatId, text: lines.join("\n") }),
      signal: AbortSignal.timeout(3000),
    });
  } catch {
    // non-blocking
  }
}

export function readSafeJson<T>(filename: string, fallback: T): T {
  const tmpFile = path.join("/tmp", filename);
  const repoFile = path.join(process.cwd(), "src", "data", filename);
  try {
    if (fs.existsSync(tmpFile)) return JSON.parse(fs.readFileSync(tmpFile, "utf8")) as T;
    if (fs.existsSync(repoFile)) return JSON.parse(fs.readFileSync(repoFile, "utf8")) as T;
  } catch {
    // ignore
  }
  return fallback;
}

export function writeSafeJson(filename: string, data: any): void {
  const repoFile = path.join(process.cwd(), "src", "data", filename);
  const tmpFile = path.join("/tmp", filename);
  const payload = JSON.stringify(data, null, 2);
  try {
    fs.writeFileSync(repoFile, payload, "utf8");
  } catch {
    try {
      fs.writeFileSync(tmpFile, payload, "utf8");
    } catch {
      // ignore
    }
  }
}

export async function supaFetch<T = any>(
  tableAndQuery: string,
  options: { method?: "GET" | "POST" | "PATCH" | "DELETE"; body?: any; prefer?: string; timeoutMs?: number } = {}
): Promise<{ ok: boolean; data: T | null; error?: string }> {
  if (!isSupabaseConfigured()) return { ok: false, data: null, error: "HYBRID_LOCAL_MODE" };
  let deadline: AbortSignal | undefined;
  try {
    // Opt-in only: the reporting path bounds both connection and response-body reads.
    deadline = options.timeoutMs === undefined ? undefined : AbortSignal.timeout(options.timeoutMs);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/${tableAndQuery}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: SERVICE_KEY,
        Authorization: `Bearer ${SERVICE_KEY}`,
        Prefer: options.prefer || "return=representation",
      },
      body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
      ...(deadline ? { signal: deadline } : {}),
    });
    if (!res.ok) return { ok: false, data: null, error: await res.text() };
    const text = await res.text();
    return { ok: true, data: text ? (JSON.parse(text) as T) : null };
  } catch (e: any) {
    return { ok: false, data: null, error: deadline?.aborted ? "UPSTREAM_TIMEOUT" : e?.message || "Supabase error" };
  }
}

export async function assertVerifiedAiOptIn(providerId: string): Promise<{ allowed: boolean; reason?: string }> {
  if (!providerId) return { allowed: false, reason: "Profil-ID fehlt." };
  if (isSupabaseConfigured()) {
    const check = await supaFetch<any[]>(
      `managed_profile_states?profile_id=eq.${encodeURIComponent(providerId)}&select=claimed,identity_verified,ai_opt_in,hidden,removed_by_report`
    );
    const row = check.data?.[0];
    if (row?.claimed && row?.identity_verified && row?.ai_opt_in && !row?.hidden && !row?.removed_by_report) return { allowed: true };
  }
  // Legacy local flags do not establish verified identity; deny consent-sensitive AI by default.
  return {
    allowed: false,
    reason: "KI-Voice & Fantasy-Preview sind exklusiv bei verifizierten Direkt-Profilen mit aktiver Anbieter-Freigabe (Opt-In) verfügbar.",
  };
}
