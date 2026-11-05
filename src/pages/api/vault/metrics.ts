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
const offersPath = path.join(dataDir, "harvested-offers.json");

const SECRET = process.env.CLAIM_TOKEN_SECRET || process.env.OWNER_TOKEN_SECRET || "iwsn-swiss-master-secret-2026";
const ADMIN_PIN = process.env.ADMIN_PIN || "SWISS-BOSS-2026";

export function makeOwnerToken(profileId: string): string {
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

  const now = Date.now();
  for (const pid of Object.keys(states)) {
    const st = states[pid];
    if (st.availableUntil && new Date(st.availableUntil).getTime() <= now) {
      st.availabilityConfirmed = false;
      st.online = false;
    }
  }

  const adminHeader = String(req.headers["x-admin-pin"] || req.query.adminPin || req.body?.adminPin || "").trim();
  const isAdmin = adminHeader === ADMIN_PIN;

  if (req.method === "GET") {
    const profileId = String(req.query.profileId || "").trim();
    const token = String(req.query.token || "").trim();
    const isOwner = Boolean(profileId && token && token === makeOwnerToken(profileId));

    const filteredEnquiries = isAdmin
      ? enquiries
      : isOwner
      ? enquiries.filter((e: any) => e.profileId === profileId)
      : [];

    return res.status(200).json({
      ok: true,
      states,
      metrics,
      enquiries: filteredEnquiries,
      takedowns: isAdmin ? takedowns : [],
      blockedIds: dniList,
      isAdmin,
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const body = req.body || {};
  const action = String(body.action || "").trim();
  const profileId = String(body.profileId || body.id || "").trim();
  const providedToken = String(body.ownerToken || body.token || "").trim();
  const expectedToken = profileId ? makeOwnerToken(profileId) : "";
  const isOwner = Boolean(profileId && providedToken && providedToken === expectedToken);

  if (["track_view", "track_click", "track_contact", "track_source_out"].includes(action) && profileId) {
    if (!metrics[profileId]) {
      metrics[profileId] = { startedAt: new Date().toISOString(), views: 0, detailOpens: 0, contactClicks: 0, sourceClicks: 0 };
    }
    if (action === "track_view") metrics[profileId].views = (metrics[profileId].views || 0) + 1;
    if (action === "track_click") metrics[profileId].detailOpens = (metrics[profileId].detailOpens || 0) + 1;
    if (action === "track_contact") metrics[profileId].contactClicks = (metrics[profileId].contactClicks || 0) + 1;
    if (action === "track_source_out") metrics[profileId].sourceClicks = (metrics[profileId].sourceClicks || 0) + 1;
    metrics[profileId].lastEventAt = new Date().toISOString();
    writeJson(metricsPath, metrics);
    return res.status(200).json({ ok: true, metrics: metrics[profileId] });
  }

  if (action === "create_enquiry" && profileId) {
    const newLead = {
      id: "lead-" + Date.now(),
      profileId,
      providerName: String(body.providerName || states[profileId]?.displayName || profileId),
      clientContact: String(body.clientContact || "").trim(),
      desiredTime: String(body.desiredTime || "").trim(),
      duration: String(body.duration || "60 Min.").trim(),
      status: "NEW",
      createdAt: new Date().toISOString(),
    };
    enquiries.unshift(newLead);
    writeJson(enquiriesPath, enquiries.slice(0, 500));

    if (!metrics[profileId]) {
      metrics[profileId] = { startedAt: new Date().toISOString(), views: 0, detailOpens: 0, contactClicks: 0, sourceClicks: 0 };
    }
    metrics[profileId].contactClicks = (metrics[profileId].contactClicks || 0) + 1;
    writeJson(metricsPath, metrics);
    return res.status(200).json({ ok: true, enquiry: newLead });
  }

  if (action === "login_or_claim" || action === "register_new_profile") {
    const offers = readJson(offersPath, []);
    const rawQuery = String(body.query || body.phone || body.displayName || profileId || "").trim();
    const cleanDigits = rawQuery.replace(/\D/g, "").replace(/^0041/, "41").replace(/^0/, "41");

    let matchedOffer = offers.find(
      (o: any) =>
        o.id === rawQuery ||
        o.dedupClusterId === rawQuery ||
        (cleanDigits.length >= 9 && String(o.rawPhone || "").replace(/\D/g, "").includes(cleanDigits.slice(-8))) ||
        String(o.rawName || "").toLowerCase() === rawQuery.toLowerCase()
    );

    const targetId = matchedOffer
      ? matchedOffer.id || matchedOffer.dedupClusterId
      : profileId || "ch-new-" + crypto.createHash("sha1").update(rawQuery + Date.now()).digest("hex").slice(0, 10);

    const token = makeOwnerToken(targetId);
    const existing = states[targetId] || {};
    const cleanName = String(body.displayName || existing.displayName || matchedOffer?.rawName || rawQuery || "Neues Profil")
      .replace(/\s+/g, " ")
      .trim();

    states[targetId] = {
      ...existing,
      profileId: targetId,
      displayName: cleanName,
      city: String(body.city || existing.city || matchedOffer?.city || "Zürich").trim(),
      canton: String(body.canton || existing.canton || matchedOffer?.canton || "ZH").toUpperCase().trim(),
      phoneDisplay: String(body.phoneDisplay || body.phone || existing.phoneDisplay || matchedOffer?.rawPhone || "").trim(),
      rate30Chf: Number(body.rate30Chf || existing.rate30Chf || matchedOffer?.rate30Chf || 200),
      rate60Chf: Number(body.rate60Chf || existing.rate60Chf || matchedOffer?.advertisedBaseChf || 350),
      bio: String(body.bio || existing.bio || matchedOffer?.bio || `${cleanName} – Direktkontakt ohne Agentur-Aufschlag.`).trim(),
      thumbnail: String(
        body.thumbnail ||
          existing.thumbnail ||
          matchedOffer?.thumbnail ||
          "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85"
      ),
      gallery: Array.isArray(body.gallery) && body.gallery.length > 0
        ? body.gallery
        : Array.isArray(existing.gallery) && existing.gallery.length > 0
        ? existing.gallery
        : Array.isArray(matchedOffer?.gallery) && matchedOffer.gallery.length > 0
        ? matchedOffer.gallery
        : ["https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85"],
      accountConfirmed: true,
      claimed: true,
      published: true,
      paused: false,
      updatedAt: new Date().toISOString(),
    };

    if (!matchedOffer && action === "register_new_profile") {
      offers.unshift({
        id: targetId,
        dedupClusterId: targetId,
        rawName: states[targetId].displayName,
        city: states[targetId].city,
        canton: states[targetId].canton,
        rawPhone: states[targetId].phoneDisplay,
        rate30Chf: states[targetId].rate30Chf,
        advertisedBaseChf: states[targetId].rate60Chf,
        priceLabel: `CHF ${states[targetId].rate60Chf} / 60 Min. (CHF ${states[targetId].rate30Chf} / 30 Min.)`,
        sourcePortal: "Direktprofil (IWSN)",
        sourceUrl: `/profile/${targetId}`,
        bookingMode: "direct",
        thumbnail: states[targetId].thumbnail,
        gallery: states[targetId].gallery,
        includedTags: Array.isArray(body.tags) && body.tags.length > 0 ? body.tags : ["Incall", "Outcall", "Direktkontakt"],
        bio: states[targetId].bio,
        updatedAt: new Date().toISOString(),
      });
      writeJson(offersPath, offers);
    }

    writeJson(statesPath, states);
    return res.status(200).json({
      ok: true,
      profileId: targetId,
      ownerToken: token,
      cockpitUrl: `/creator-dashboard?id=${encodeURIComponent(targetId)}&token=${encodeURIComponent(token)}`,
      state: states[targetId],
    });
  }

  if (action === "confirm_availability_4h" && profileId) {
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Ungültiger Eigentümer-Token für dieses Profil." });
    }
    const until = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    states[profileId] = {
      ...(states[profileId] || { profileId }),
      availabilityConfirmed: true,
      online: true,
      availableUntil: until,
      lastConfirmedAt: new Date().toISOString(),
      paused: false,
      hidden: false,
      claimed: true,
      updatedAt: new Date().toISOString(),
    };
    writeJson(statesPath, states);
    return res.status(200).json({ ok: true, state: states[profileId] });
  }

  if ((action === "update_profile_fields" || action === "update_profile_state") && profileId) {
    if (!isOwner && !isAdmin) {
      return res.status(403).json({ error: "Keine Berechtigung zum Ändern dieses Profils." });
    }
    const u = body.updates || body;
    const st = states[profileId] || { profileId };

    if (u.displayName !== undefined) st.displayName = String(u.displayName).trim().slice(0, 60);
    if (u.city !== undefined) st.city = String(u.city).trim().slice(0, 40);
    if (u.canton !== undefined) st.canton = String(u.canton).toUpperCase().trim().slice(0, 4);
    if (u.phoneDisplay !== undefined) st.phoneDisplay = String(u.phoneDisplay).trim().slice(0, 30);
    if (u.rate30Chf !== undefined) st.rate30Chf = Math.max(40, Math.min(3000, Number(u.rate30Chf) || 200));
    if (u.rate60Chf !== undefined) st.rate60Chf = Math.max(50, Math.min(5000, Number(u.rate60Chf) || 350));
    if (u.bio !== undefined) st.bio = String(u.bio).trim().slice(0, 2000);
    if (Array.isArray(u.tags)) st.tags = u.tags;
    if (u.thumbnail !== undefined) st.thumbnail = String(u.thumbnail).trim();
    if (Array.isArray(u.gallery)) st.gallery = u.gallery;
    if (u.videoUrl !== undefined) st.videoUrl = String(u.videoUrl).trim();
    if (Array.isArray(u.paidItems)) st.paidItems = u.paidItems;
    if (u.liveCamActive !== undefined) st.liveCamActive = Boolean(u.liveCamActive);
    if (u.liveCamChfPerMin !== undefined) st.liveCamChfPerMin = Number(u.liveCamChfPerMin) || 6;
    if (u.topSpotBidChf !== undefined) st.topSpotBidChf = Number(u.topSpotBidChf) || 0;
    if (u.paused !== undefined) {
      st.paused = Boolean(u.paused);
      st.hidden = Boolean(u.paused);
    }
    if (u.identityRequested !== undefined) {
      st.identityRequested = Boolean(u.identityRequested);
      st.verificationRequestedAt = new Date().toISOString();
    }

    if (isAdmin) {
      if (u.identityVerified !== undefined) {
        st.identityVerified = Boolean(u.identityVerified);
        st.verifiedAt = st.identityVerified ? new Date().toISOString() : null;
      }
      if (u.sponsored !== undefined) st.sponsored = Boolean(u.sponsored);
      if (u.hidden !== undefined) st.hidden = Boolean(u.hidden);
    }

    st.claimed = true;
    st.updatedAt = new Date().toISOString();
    states[profileId] = st;
    writeJson(statesPath, states);
    return res.status(200).json({ ok: true, state: st });
  }

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

  return res.status(400).json({ error: "Unbekannte Aktion: " + action });
}