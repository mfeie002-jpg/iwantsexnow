import type { NextApiRequest, NextApiResponse } from "next";
import { requireServerAdmin } from "@/lib/marketplace/admin-auth";
export const config = { api: { bodyParser: { sizeLimit: "4kb" } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (!await requireServerAdmin(req, res)) return;
  // No import or case mutation until the existing backend has been mapped and verified.
  return res.status(503).json({ ok: false, error: "BACKEND_NOT_VERIFIED" });
}
