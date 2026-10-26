import { createHash } from "node:crypto";

/** Identity of a source listing, never an inferred identity of a person. */
export function sourceIdentity(raw: unknown): string | null {
  try {
    if (typeof raw !== "string") return null;
    const url = new URL(raw);
    if (!["https:", "http:"].includes(url.protocol) || url.username || url.password) return null;
    url.protocol = "https:";
    url.hash = "";
    for (const key of [...url.searchParams.keys()]) if (/^utm_|^(fbclid|gclid)$/i.test(key)) url.searchParams.delete(key);
    url.searchParams.sort();
    url.pathname = url.pathname.replace(/\/$/, "") || "/";
    return "src-" + createHash("sha256").update(url.toString()).digest("hex").slice(0, 24);
  } catch { return null; }
}
