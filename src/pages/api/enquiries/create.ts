import type { NextApiRequest, NextApiResponse } from "next";
import { persistEnquiryAndNotify } from "@/lib/supabaseServer";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const referenceCode = `IW-${Math.floor(100000 + Math.random() * 900000)}`;

  const record = {
    referenceCode,
    providerName: String(body.providerName || "Sophia"),
    duration: Number(body.duration || 60),
    extras: Array.isArray(body.extras) ? body.extras : ["GFE"],
    guaranteedTotalChf: Number(body.guaranteedTotalChf || 450),
    requestedTime: String(body.requestedTime || "Heute, 20:30 Uhr"),
    city: String(body.city || "Zürich / Zug"),
    contact: String(body.contact || "Nicht angegeben"),
    notes: String(body.notes || ""),
  };

  const delivery = await persistEnquiryAndNotify(record);

  return res.status(200).json({
    status: "ok",
    referenceCode,
    receivedAt: new Date().toISOString(),
    delivery,
    enquiry: {
      ...record,
      status: "transmitted_to_provider",
    },
  });
}