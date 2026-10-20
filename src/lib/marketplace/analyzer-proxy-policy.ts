/**
 * Public requests must never select arbitrary Supabase Edge functions.
 * This is an internal Web Analyzer feature only, not a marketplace API.
 */
export const ALLOWED_ANALYZER_FUNCTIONS = [
  "capture-screenshot",
  "fetch-html",
  "ai-website-analyze",
  "firecrawl-map",
  "capture-rendered-html",
] as const;
export type AnalyzerFunction = (typeof ALLOWED_ANALYZER_FUNCTIONS)[number];
export type AnalyzerCall = { functionName: AnalyzerFunction; payload: Record<string, unknown> };

const plainObject = (value: unknown): value is Record<string, unknown> =>
  value !== null && typeof value === "object" && !Array.isArray(value);

export function parseAnalyzerCall(input: unknown): AnalyzerCall | null {
  if (!plainObject(input) || typeof input.function !== "string") return null;
  const name = input.function;
  if (!(ALLOWED_ANALYZER_FUNCTIONS as readonly string[]).includes(name)) return null;
  const payload = input.payload === undefined ? {} : input.payload;
  if (!plainObject(payload)) return null;
  const encoded = JSON.stringify(payload);
  if (!encoded || encoded.length > 240_000) return null;
  return { functionName: name as AnalyzerFunction, payload };
}

export function readBearerToken(authorization: unknown): string | null {
  if (typeof authorization !== "string") return null;
  const match = /^Bearer ([A-Za-z0-9._~+/-]+)$/.exec(authorization);
  // Avoid accepting anon public keys or truncated fragments as authenticated sessions.
  if (!match || match[1].length < 50 || match[1].length > 5000) return null;
  return match[1];
}
