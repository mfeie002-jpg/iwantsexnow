import type { NextApiRequest, NextApiResponse } from "next";
import { limitPrivateRequests, privateDraftService, privateError, PrivateFlowError,
  requirePrivateFlow, verifiedPrivateUser } from "@/lib/marketplace/private-draft-http";

export const config = { api: { bodyParser: { sizeLimit: "8kb" } } };
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    requirePrivateFlow(req, res, ["GET", "POST", "PUT"]);
    const owner = await verifiedPrivateUser(req);
    limitPrivateRequests("draft:" + owner, 60);
    const service = privateDraftService(req);
    let draft;
    if (req.method === "GET") {
      if (Object.keys(req.query).join(",") !== "id") throw new PrivateFlowError(400, "INVALID_INPUT");
      draft = await service.read(req.query.id);
    } else if (req.method === "POST") draft = await service.create(req.body);
    else {
      const body = req.body;
      if (!body || typeof body !== "object" || Array.isArray(body) || Object.keys(body).sort().join(",") !== "fields,id") {
        throw new PrivateFlowError(400, "INVALID_INPUT");
      }
      draft = await service.replace(body.id, body.fields);
    }
    return res.status(req.method === "POST" ? 201 : 200).json({ draft });
  } catch (error) { return privateError(res, error); }
}
