import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const dataDir = path.join(process.cwd(), "src", "data");
const statesPath = path.join(dataDir, "managed-profile-states.json");
const metricsPath = path.join(dataDir, "profile-metrics.json");
const enquiriesPath = path.join(dataDir, "private-enquiries.json");
const takedownsPath = path.join(dataDir, "takedown-cases.json");
const dniPath = path.join(dataDir, "do-not-import.json");

const SECRET = process.env.CLAIM_TOKEN_SECRET || process.env.OWNER_TOKEN_SECRET || "";
const ADMIN_PIN = process.env.ADMIN_PIN || "";

export function makeOwnerToken(profileId: string): string {
  if (!SECRET || SECRET.length < 16) return "";
  return crypto.createHmac("sha256", SECRET).update(String(profileId).trim().toLowerCase()).digest("hex").slice(0, 28);
}

function readJson(filePath: string, fallback: any) {
  try {
    if (fs.existsSync(filePath)) return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch {}
  return fallback;
}

function writeJson(filePath: string, data: any) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const states = readJson(statesPath, {});
  const metrics = readJson(metricsPath, {});
  const enquiries = readJson(enquiriesPath, []);
  const takedowns = readJson(takedownsPath, []);
  const dniList = readJson(dniPath, []);

  const adminHeader = String(req.headers["x-admin-pin"] || req.body?.adminPin || "").trim();
  const isAdmin = Boolean(ADMIN_PIN && ADMIN_PIN.length >= 10 && adminHeader === ADMIN_PIN);

  const profileId = String(req.query.profileId || req.body?.profileId || req.body?.id || "").trim();
  const providedToken = String(req.headers["x-owner-token"] || req.query.token || req.body?.ownerToken || req.body?.token || "").trim();
  const expectedToken = profileId ? makeOwnerToken(profileId) : "";
  const isOwner = Boolean(profileId && expectedToken && providedToken && providedToken === expectedToken);

  if (req.method === "GET") {
    // Öffentliche Ansicht erhält NUR sichere Sichtbarkeits-/Sperr-Flags (damit Opt-Outs niemals wieder auftauchen!)
    const publicStates: Record<string, any> = {};
    const now = Date.now();
    for (const pid of Object.keys(states)) {
      const st = states[pid] || {};
      const isAvail = Boolean(st.availabilityConfirmed && st.availableUntil && new Date(st.availableUntil).getTime() > now);
      publicStates[pid] = {
        profileId: pid,
        paused: Boolean(st.paused || st.hidden || st.removedByReport),
        hidden: Boolean(st.paused || st.hidden || st.removedByReport),
        availabilityConfirmed: isAvail,
        identityVerified: Boolean(st.identityVerified),
        claimed: Boolean(st.claimed),
      };
    }

    if (isAdmin) {
      const pilotsPath = path.join(dataDir, "pilot-20-cohort.json");
      const pilots = readJson(pilotsPath, []);
      const pilotCockpitLinks: Record<string, string> = {};
      for (const p of pilots) {
        const tok = makeOwnerToken(p.profileId);
        if (tok) {
          pilotCockpitLinks[p.profileId] = `/creator-dashboard?id=${encodeURIComponent(p.profileId)}&token=${encodeURIComponent(tok)}`;
        }
      }
      return res.status(200).json({
        ok: true,
        isAdmin: true,
        states,
        metrics,
        enquiries,
        takedowns,
        blockedIds: dniList,
        pilotCockpitLinks,
      });
    }

    if (isOwner) {
      return res.status(200).json({
        ok: true,
        isOwner: true,
        states: { [profileId]: states[profileId] || { profileId } },
        metrics: { [profileId]: metrics[profileId] || { views: 0, detailOpens: 0, contactClicks: 0, sourceClicks: 0 } },
        enquiries: enquiries.filter((e: any) => e.profileId === profileId),
        blockedIds: dniList,
      });
    }

    return res.status(200).json({
      ok: true,
      isAdmin: false,
      isOwner: false,
      states: publicStates,
      metrics: {},
      enquiries: [],
      takedowns: [],
      blockedIds: dniList,
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const action = String(body.action || "").trim();

  // 1. Öffentliches Opt-Out (/report) bleibt jederzeit aktiv, damit Betroffene sofort ausblenden können
  if (action === "submit_takedown" || action === "report_profile") {
    const target = String(body.profileId || body.targetUrl || body.name || "").trim();
    const newCase = {
      caseId: "CASE-" + Date.now().toString().slice(-6),
      profileId: profileId || target,
      reason: String(body.reason || "Opt-Out / Entfernungswunsch").trim(),
      contact: String(body.contact || "").trim(),
      details: String(body.details || "").trim(),
      status: "HIDDEN_IMMEDIATELY",
      createdAt: new Date().toISOString(),
    };
    takedowns.unshift(newCase);
    writeJson(takedownsPath, takedowns);

    if (profileId) {
      states[profileId] = {
        ...(states[profileId] || { profileId }),
        paused: true,
        hidden: true,
        removedByReport: true,
        updatedAt: new Date().toISOString(),
      };
      writeJson(statesPath, states);
      if (!dniList.includes(profileId)) {
        dniList.push(profileId);
        writeJson(dniPath, dniList);
      }
    }
    return res.status(200).json({ ok: true, caseId: newCase.caseId });
  }

  // 2. Alle Cockpit- & Admin-Schreibaktionen erfordern zwingend isOwner oder isAdmin
  if (!isOwner && !isAdmin) {
    return res.status(403).json({
      ok: false,
      error: "Zugriff verweigert: Gültige Authentifizierung erforderlich.",
    });
  }

  if (action === "request_verification" && profileId) {
    states[profileId] = {
      ...(states[profileId] || { profileId }),
      identityRequested: true,
      verificationNote: String(body.verificationNote || "Selfie-Prüfung im Cockpit angefordert").trim().slice(0, 300),
      updatedAt: new Date().toISOString(),
    };
    writeJson(statesPath, states);
    return res.status(200).json({ ok: true, state: states[profileId] });
  }

  if (action === "confirm_availability_4h" && profileId) {
    const until = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    states[profileId] = {
      ...(states[profileId] || { profileId }),
      availabilityConfirmed: true,
      online: true,
      availableUntil: until,
      paused: false,
      hidden: false,
      updatedAt: new Date().toISOString(),
    };
    writeJson(statesPath, states);
    return res.status(200).json({ ok: true, state: states[profileId] });
  }

  if ((action === "update_profile_fields" || action === "update_profile_state") && profileId) {
    const u = body.updates || body;
    const st = states[profileId] || { profileId };

    if (u.displayName !== undefined) st.displayName = String(u.displayName).trim().slice(0, 60);
    if (u.city !== undefined) st.city = String(u.city).trim().slice(0, 40);
    if (u.canton !== undefined) st.canton = String(u.canton).toUpperCase().trim().slice(0, 4);
    if (u.rate30Chf !== undefined) st.rate30Chf = Math.max(80, Math.min(800, Number(u.rate30Chf) || 200));
    if (u.rate60Chf !== undefined) st.rate60Chf = Math.max(100, Math.min(1200, Number(u.rate60Chf) || 350));
    if (u.bio !== undefined) st.bio = String(u.bio).trim().slice(0, 2000);
    if (u.paused !== undefined) {
      st.paused = Boolean(u.paused);
      st.hidden = Boolean(u.paused);
    }

    if (isAdmin) {
      if (u.identityVerified !== undefined) st.identityVerified = Boolean(u.identityVerified);
      if (u.sponsored !== undefined) st.sponsored = Boolean(u.sponsored);
      if (u.hidden !== undefined) st.hidden = Boolean(u.hidden);
    }

    st.updatedAt = new Date().toISOString();
    states[profileId] = st;
    writeJson(statesPath, states);
    return res.status(200).json({ ok: true, state: st });
  }

  return res.status(403).json({ ok: false, error: "Aktion gesperrt." });
}