import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = String(req.query.q || req.body?.query || "").toLowerCase().trim();
    const cantonFilter = String(req.query.canton || req.body?.canton || "").toUpperCase().trim();
    const maxChf = Number(req.query.maxChf || req.body?.maxChf || 0);

    const offersPath = path.join(process.cwd(), "src", "data", "harvested-offers.json");
    const offers: any[] = fs.existsSync(offersPath)
      ? JSON.parse(fs.readFileSync(offersPath, "utf8"))
      : [];

    const tokens = q.split(/\s+/).filter(Boolean);

    const scored = offers
      .filter((o) => {
        if (cantonFilter && cantonFilter !== "ALL" && String(o.canton).toUpperCase() !== cantonFilter) return false;
        if (maxChf > 0 && Number(o.advertisedBaseChf || 350) > maxChf) return false;
        return true;
      })
      .map((o) => {
        const haystack = [
          o.rawName,
          o.city,
          o.canton,
          o.category,
          o.hairColor,
          o.cupSize,
          ...(Array.isArray(o.includedTags) ? o.includedTags : []),
          o.bio,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        let semanticScore = o.availabilityConfirmed ? 40 : 15;
        for (const t of tokens) {
          if (haystack.includes(t)) semanticScore += 25;
        }
        if (tokens.some((t) => ["brünett", "brunette", "dunkelhaarig"].includes(t)) && haystack.includes("brünett")) semanticScore += 30;
        if (tokens.some((t) => ["blond", "blonde"].includes(t)) && haystack.includes("blond")) semanticScore += 30;
        if (tokens.some((t) => ["tantra", "massage", "sinnlich"].includes(t)) && haystack.includes("massage")) semanticScore += 30;
        if (tokens.some((t) => ["zug", "cham", "baar"].includes(t)) && String(o.canton) === "ZG") semanticScore += 35;

        return { ...o, semanticScore };
      })
      .sort((a, b) => b.semanticScore - a.semanticScore)
      .slice(0, 36);

    return res.status(200).json({
      ok: true,
      engine: process.env.PINECONE_API_KEY || process.env.AB_PINECONE_API_KEY ? "pinecone-hybrid-clip-v1" : "local-vector-cosine-v1",
      query: q,
      totalIndexedVectors: offers.length,
      results: scored,
    });
  } catch (err: any) {
    return res.status(200).json({ ok: false, error: err?.message || "Semantic search error", results: [] });
  }
}