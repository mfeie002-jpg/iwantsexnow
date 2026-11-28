import type { NextApiRequest, NextApiResponse } from "next";
import { getPhotoCatalog, ipCheckDisabled, resolveProfilePhoto } from "@/lib/profile-image-proxy";

function parseId(value: unknown): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  if (typeof raw !== "string") return null;
  const id = raw.trim();
  return /^[A-Za-z0-9][A-Za-z0-9_.:-]{0,127}$/.test(id) ? id : null;
}

function parseIndex(value: unknown): number | undefined {
  const raw = Array.isArray(value) ? value[0] : value;
  if (raw === undefined) return undefined;
  if (typeof raw !== "string" || !/^\d{1,2}$/.test(raw)) return undefined;
  const index = Number(raw);
  return index <= 40 ? index : undefined;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return res.status(405).end();
  }
  const id = parseId(req.query.id);
  if (!id) {
    res.setHeader("Cache-Control", "no-store");
    return res.status(404).end();
  }
  try {
    const result = await resolveProfilePhoto({
      id,
      index: parseIndex(req.query.n),
      catalog: await getPhotoCatalog(),
      skipIpCheck: ipCheckDisabled()
    });
    if (result.status !== 200) {
      res.setHeader("Cache-Control", result.cacheControl);
      return res.status(result.status).end();
    }
    res.setHeader("Content-Type", result.contentType);
    res.setHeader("X-Content-Type-Options", "nosniff");
    res.setHeader("Cache-Control", result.cacheControl);
    res.setHeader("Referrer-Policy", "no-referrer");
    if (result.contentType.startsWith("image/svg+xml")) {
      res.setHeader("Content-Security-Policy", "default-src 'none'; sandbox");
    }
    if (req.method === "HEAD") return res.status(200).end();
    return res.status(200).send(result.body);
  } catch {
    res.setHeader("Cache-Control", "no-store");
    return res.status(404).end();
  }
}
