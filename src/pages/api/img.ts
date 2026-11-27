import type { NextApiRequest, NextApiResponse } from "next";

const IMAGE_HOSTS = new Set([
  "images.xdate.ch",
  "www.xdate.ch",
  "ww.xdate.ch",
  "www.fgirl.ch",
  "medias.fgirl.ch",
  "i.and6.com",
  "www.eurogirlsescort.com",
  "www.bemygirl.ch",
  "6navi.ch",
  "www.happyticino.ch",
  "s3.incontriticino.com",
  "sex4u.ch",
  "img-z.kaufmich.com",
  "api.quartier-rouge.ch",
  "3luofctb8jpyi3r229i0wjmt-wpengine.netdna-ssl.com",
  "www.lolla.ch",
  "www.massage123.ch"
]);

const BAD_IMAGE_TOKENS = [
  "bg_blur", "example.com", "placeholder", "spacer", "pixel",
  "no-image", "noimage"
];
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const IMAGE_TYPES = new Set([
  "image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"
]);

function unavailable(res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  return res.status(404).end();
}

function validateImageUrl(candidate: string): URL {
  const url = new URL(candidate);
  if (!["http:", "https:"].includes(url.protocol)) throw new Error("Invalid protocol");
  if (url.username || url.password || (url.port && !["80", "443"].includes(url.port))) {
    throw new Error("Credentials and nonstandard ports are forbidden");
  }
  if (!IMAGE_HOSTS.has(url.hostname.toLowerCase())) throw new Error("Host not on image-source allowlist");
  if (BAD_IMAGE_TOKENS.some((token) => url.href.toLowerCase().includes(token))) {
    throw new Error("Known placeholder image");
  }
  return url;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }

  const target = String(req.query.u || req.query.url || req.query.src || "").trim();
  let url: URL;
  try {
    url = validateImageUrl(target);
  } catch {
    return unavailable(res);
  }

  const ctrl = new AbortController();
  const timeout = setTimeout(() => ctrl.abort(), 4500);
  try {
    let upstream: Response | undefined;
    // Follow at most two redirects, validating each destination before making a request.
    for (let attempt = 0; attempt < 3; attempt++) {
      upstream = await fetch(url.href, {
        signal: ctrl.signal,
        redirect: "manual",
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36",
          Accept: "image/avif,image/webp,image/png,image/jpeg,image/gif",
          Referer: url.origin + "/"
        }
      });
      if ([301, 302, 303, 307, 308].includes(upstream.status)) {
        const location = upstream.headers.get("location");
        if (!location) return unavailable(res);
        url = validateImageUrl(new URL(location, url).href);
        continue;
      }
      break;
    }

    if (!upstream?.ok || [301, 302, 303, 307, 308].includes(upstream.status)) {
      return unavailable(res);
    }
    const contentType = String(upstream.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
    if (!IMAGE_TYPES.has(contentType)) return unavailable(res);

    const declaredLength = Number(upstream.headers.get("content-length") || "0");
    if (declaredLength > MAX_IMAGE_BYTES) return unavailable(res);
    if (!upstream.body) return unavailable(res);

    const reader = upstream.body.getReader();
    const chunks: Buffer[] = [];
    let size = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_IMAGE_BYTES) {
        await reader.cancel();
        return unavailable(res);
      }
      chunks.push(Buffer.from(value));
    }

    if (size < 3500) return unavailable(res);

    res.setHeader("Content-Type", contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", "public, max-age=86400, s-maxage=86400, stale-while-revalidate=604800");
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(Buffer.concat(chunks));
  } catch {
    return unavailable(res);
  } finally {
    clearTimeout(timeout);
  }
}
