import type { NextApiRequest, NextApiResponse } from "next";

const FALLBACKS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=80",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=80"
];

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawUrl = typeof req.query.u === "string" ? req.query.u.trim() : "";
  const seed = Number(req.query.s ?? req.query.f ?? 0) || 0;
  const fallbackUrl = FALLBACKS[Math.abs(seed) % FALLBACKS.length];
  const target = rawUrl.startsWith("http") ? rawUrl : fallbackUrl;

  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 6500);
    const upstream = await fetch(target, {
      signal: controller.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Accept": "image/avif,image/webp,image/apng,image/*,*/*;q=0.8"
      }
    });
    clearTimeout(timer);

    const cType = upstream.headers.get("content-type") || "";
    if (!upstream.ok || cType.includes("text/html")) {
      return res.redirect(302, fallbackUrl);
    }

    const buffer = Buffer.from(await upstream.arrayBuffer());
    res.setHeader("Content-Type", cType || "image/jpeg");
    res.setHeader("Cache-Control", "public, max-age=86400, stale-while-revalidate=604800");
    return res.status(200).send(buffer);
  } catch {
    return res.redirect(302, fallbackUrl);
  }
}