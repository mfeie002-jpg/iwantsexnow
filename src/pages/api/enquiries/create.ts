import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const payload = req.body || {};
  const referenceCode = `IW-${Math.floor(100000 + Math.random() * 900000)}`;

  return res.status(200).json({
    status: "ok",
    referenceCode,
    receivedAt: new Date().toISOString(),
    enquiry: {
      ...payload,
      referenceCode,
      status: "transmitted_to_provider",
    },
  });
}