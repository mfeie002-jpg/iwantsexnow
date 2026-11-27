import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const BLOCKED_SUBSTRINGS = [
  "bg_blur",
  "example.com",
  "placeholder",
  "spacer",
  "pixel",
  "no-image",
  "noimage",
  "default"
];

function serveLocalPortrait(res: NextApiResponse, seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const slot = (h % 8) + 1;
  const localFile = path.join(process.cwd(), "public", "images", "ai", "portraits", `p${slot}.webp`);
  if (fs.existsSync(localFile)) {
    const buf = fs.readFileSync(localFile);
    res.setHeader("Content-Type", "image/webp");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400");
    return res.status(200).send(buf);
  }
  return res.redirect(302, `/images/ai/portraits/p${slot}.webp`);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const rawTarget = String(req.query.u || req.query.url || req.query.src || "").trim();
  const seed = String(req.query.s || rawTarget || "1");

  if (!rawTarget.startsWith("http://") && !rawTarget.startsWith("https://")) {
    return serveLocalPortrait(res, seed);
  }

  const low = rawTarget.toLowerCase();
  for (const bad of BLOCKED_SUBSTRINGS) {
    if (low.includes(bad)) return serveLocalPortrait(res, seed);
  }

  try {
    const parsed = new URL(rawTarget);
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 4500);

    const upstream = await fetch(rawTarget, {
      signal: ctrl.signal,
      headers: {
        "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
        Accept: "image/avif,image/webp,image/apng,image/*,*/*;q=0.8",
        Referer: parsed.protocol + "//" + parsed.host + "/"
      }
    });
    clearTimeout(timer);

    const ct = String(upstream.headers.get("content-type") || "").toLowerCase();
    if (!upstream.ok || !ct.startsWith("image/")) {
      return serveLocalPortrait(res, seed);
    }

    const buf = Buffer.from(await upstream.arrayBuffer());
    // Schutz gegen 1x1 Tracking-Pixel oder leere Platzhalter-Grafiken (< 3.5 KB)
    if (buf.length < 3500) {
      return serveLocalPortrait(res, seed);
    }

    res.setHeader("Content-Type", ct);
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
    return res.status(200).send(buf);
  } catch {
    return serveLocalPortrait(res, seed);
  }
}