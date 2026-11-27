import type { NextApiRequest, NextApiResponse } from "next";

const FALLBACKS = [
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85",
  "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=700&q=85"
];

function getFallback(seed: string): string {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return FALLBACKS[h % FALLBACKS.length];
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawTarget = String(req.query.u || req.query.url || req.query.src || "").trim();
  const seed = String(req.query.s || rawTarget || "0");
  const fallback = getFallback(seed);

  if (!rawTarget.startsWith("http")) {
    return res.redirect(302, fallback);
  }

  try {
    const u = new URL(rawTarget);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4500);
    const upstream = await fetch(rawTarget, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: u.protocol + "//" + u.host + "/",
      },
    });
    clearTimeout(timer);

    const ct = String(upstream.headers.get("content-type") || "").toLowerCase();
    if (!upstream.ok || !ct.startsWith("image/")) {
      return res.redirect(302, fallback);
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    if (buf.length < 1000) return res.redirect(302, fallback);

    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).send(buf);
  } catch {
    return res.redirect(302, fallback);
  }
}