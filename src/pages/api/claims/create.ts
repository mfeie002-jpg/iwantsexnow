import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import crypto from "crypto";

function normalizeSwissPhone(raw: string): string | null {
  const digits = String(raw || "").replace(/\D/g, "");
  if (!digits) return null;
  let local = "";
  if (digits.startsWith("41") && digits.length === 11) local = "0" + digits.slice(2);
  else if (digits.startsWith("0041") && digits.length === 13) local = "0" + digits.slice(4);
  else if (digits.startsWith("0") && digits.length === 10) local = digits;
  else return null;

  if (/(\d)\1{5,}|123456/.test(local)) return null;
  return `+41 ${local.slice(1, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`;
}

function makeOwnerToken(profileId: string): string {
  const secret = process.env.CLAIM_TOKEN_SECRET || process.env.OWNER_TOKEN_SECRET || "ch-vault-local-fallback-secret";
  return crypto.createHmac("sha256", secret).update(String(profileId)).digest("hex").slice(0, 24);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  try {
    const body = req.body || {};
    const dataDir = path.join(process.cwd(), "src", "data");
    const offersPath = path.join(dataDir, "harvested-offers.json");
    const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
    const statesPath = path.join(dataDir, "managed-profile-states.json");

    const offers = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf8")) : [];
    const states = fs.existsSync(statesPath) ? JSON.parse(fs.readFileSync(statesPath, "utf8")) : {};

    // Modus A: Komplett neues Schweizer Profil selbst anlegen (/register)
    if (body.action === "self_register") {
      const rawName = String(body.displayName || "").trim().slice(0, 50);
      const city = String(body.city || "Zug").trim().slice(0, 40);
      const canton = String(body.canton || "ZG").trim().toUpperCase().slice(0, 2);
      const cleanPhone = normalizeSwissPhone(body.phone || "");

      if (!rawName || rawName.length < 2) {
        return res.status(400).json({ ok: false, error: "Bitte einen gültigen Anzeigenamen (mind. 2 Zeichen) angeben." });
      }
      if (!cleanPhone) {
        return res.status(400).json({ ok: false, error: "Bitte eine gültige Schweizer +41 Telefonnummer eingeben (z.B. 079 123 45 67)." });
      }

      const r60 = Math.max(100, Math.min(1200, Math.round((Number(body.rate60Chf) || 350) / 10) * 10));
      const r30 = Math.max(80, Math.min(800, Math.round((Number(body.rate30Chf) || r60 * 0.6) / 10) * 10));
      const pid = "ch-self-" + crypto.randomBytes(5).toString("hex");

      const newProfile = {
        id: pid,
        dedupClusterId: pid,
        rawName,
        city,
        canton,
        rawPhone: cleanPhone,
        advertisedBaseChf: r60,
        rate30Chf: r30,
        priceLabel: `CHF ${r60} / 60 Min. (CHF ${r30} / 30 Min.)`,
        thumbnail: body.thumbnail || "/images/escort-portrait-1.jpg",
        bio: String(body.bio || `Unabhängiges Schweizer Profil in ${city} (${canton}). Direkter Kontakt via ${cleanPhone}.`).trim().slice(0, 600),
        rubric: String(body.rubric || "female"),
        age: Math.max(18, Math.min(55, Number(body.age) || 25)),
        heightCm: Math.max(150, Math.min(190, Number(body.heightCm) || 168)),
        cupSize: String(body.cupSize || "C").toUpperCase(),
        hairColor: String(body.hairColor || "Brünett"),
        languages: ["Deutsch", "Englisch"],
        includedTags: ["Direktkontakt", "Selbstverwaltet", "Diskreter Empfang"],
        availabilityConfirmed: true,
        curationScore: 94,
        createdAt: new Date().toISOString(),
      };

      offers.unshift(newProfile);
      states[pid] = {
        profileId: pid,
        displayName: rawName,
        city,
        canton,
        phoneDisplay: cleanPhone,
        rate30Chf: r30,
        rate60Chf: r60,
        availabilityConfirmed: true,
        availabilityExpiresAt: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
        claimed: true,
        identityRequested: true,
        verificationNote: "Neu registriertes Schweizer Selbstverwaltungs-Profil",
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
      fs.writeFileSync(
        offersTsPath,
        `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\nexport default HARVESTED_SWISS_OFFERS;\n`,
        "utf8"
      );
      fs.writeFileSync(statesPath, JSON.stringify(states, null, 2), "utf8");

      const token = makeOwnerToken(pid);
      return res.status(200).json({
        ok: true,
        profileId: pid,
        cockpitUrl: `/creator-dashboard?id=${encodeURIComponent(pid)}&token=${token}`,
        profileUrl: `/profile/${encodeURIComponent(pid)}`,
      });
    }

    // Modus B: Bestehendes Profil übernehmen / Verifizierung anfordern
    const profileId = String(body.profileId || "").trim();
    if (!profileId) {
      return res.status(400).json({ ok: false, error: "profileId fehlt." });
    }

    states[profileId] = {
      ...(states[profileId] || { profileId }),
      claimed: true,
      identityRequested: true,
      claimContact: String(body.contact || body.phone || "").trim().slice(0, 120),
      verificationNote: String(body.note || "Profil-Übernahme angefordert").trim().slice(0, 300),
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(statesPath, JSON.stringify(states, null, 2), "utf8");
    return res.status(200).json({ ok: true, profileId });
  } catch (e: any) {
    return res.status(500).json({ ok: false, error: e?.message || "Server error" });
  }
}