import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const q = String(req.query.q || "").trim().toLowerCase();
    const canton = String(req.query.canton || "ALL").toUpperCase();
    const page = Math.max(1, Number(req.query.page || 1));
    const limit = Math.min(100, Math.max(12, Number(req.query.limit || 48)));

    const dataDir = path.join(process.cwd(), "src", "data");
    const jsonlPath = path.join(dataDir, "rosalon-scale-vault.jsonl");
    const clubsPath = path.join(dataDir, "swiss-establishments-vault.json");
    const statsPath = path.join(dataDir, "index-stats.json");

    let stats = {
      portalsIndexed: 27,
      totalRawListingsInVault: 4200,
      establishmentsIndexed: 180,
    };
    if (fs.existsSync(statsPath)) {
      try {
        stats = JSON.parse(fs.readFileSync(statsPath, "utf8"));
      } catch {}
    }

    const allItems: any[] = [];
    if (fs.existsSync(jsonlPath)) {
      const lines = fs.readFileSync(jsonlPath, "utf8").split("\n").filter(Boolean);
      stats.totalRawListingsInVault = Math.max(stats.totalRawListingsInVault, lines.length);

      for (const line of lines) {
        try {
          const parsed = JSON.parse(line);
          if (!parsed || !parsed.rawName) continue;
          // Clean placeholder "+41/07x" if not yet enriched
          if (parsed.rawPhone && String(parsed.rawPhone).includes("07x")) {
            parsed.rawPhone = "";
          }
          allItems.push(parsed);
        } catch {}
      }
    }

    let clubs: any[] = [];
    if (fs.existsSync(clubsPath)) {
      try {
        clubs = JSON.parse(fs.readFileSync(clubsPath, "utf8"));
        stats.establishmentsIndexed = Math.max(stats.establishmentsIndexed, clubs.length);
      } catch {}
    }

    const filtered = allItems.filter((item) => {
      if (canton !== "ALL" && String(item.canton || "").toUpperCase() !== canton) return false;
      if (!q) return true;
      const hay = `${item.rawName} ${item.city} ${item.canton} ${item.sourcePortal} ${item.rawPhone || ""} ${item.bio || ""}`.toLowerCase();
      return hay.includes(q);
    });

    const start = (page - 1) * limit;
    const paged = filtered.slice(start, start + limit);

    res.status(200).json({
      ok: true,
      stats: {
        ...stats,
        totalRawListingsInVault: allItems.length,
        totalMatching: filtered.length,
        establishmentsIndexed: clubs.length,
      },
      page,
      limit,
      totalPages: Math.ceil(filtered.length / limit),
      listings: paged,
      establishments: clubs.slice(0, 60),
    });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.message || "Vault API error" });
  }
}