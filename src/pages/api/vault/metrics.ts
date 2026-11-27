import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import harvestedOffers from "@/data/harvested-offers.json";
import { isSupabaseConfigured, supaFetch, readSafeJson, writeSafeJson, hashSwissPhone, sendTelegramPing } from "@/lib/supabaseAdmin";

const SECRET = process.env.CLAIM_TOKEN_SECRET || process.env.OWNER_TOKEN_SECRET || "iwsn-swiss-secret-2026";
const ADMIN_PIN = process.env.ADMIN_PIN || "SWISS-BOSS-2026";

export function makeOwnerToken(profileId: string): string {
  return crypto.createHmac("sha256", SECRET).update(String(profileId).trim().toLowerCase()).digest("hex").slice(0, 28);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminHeader = String(req.headers["x-admin-pin"] || req.query.adminPin || req.body?.adminPin || "").trim();
  const isAdmin = Boolean(ADMIN_PIN && adminHeader === ADMIN_PIN);

  const profileId = String(req.query.profileId || req.body?.profileId || req.body?.id || "").trim();
  const providedToken = String(req.headers["x-owner-token"] || req.query.token || req.body?.ownerToken || req.body?.token || "").trim();
  const isOwner = Boolean(profileId && providedToken && providedToken === makeOwnerToken(profileId));

  const states = readSafeJson<Record<string, any>>("managed-profile-states.json", {});
  const metrics = readSafeJson<Record<string, any>>("profile-metrics.json", {});
  const enquiries = readSafeJson<any[]>("private-enquiries.json", []);
  const takedowns = readSafeJson<any[]>("dmca-takedowns.json", []);
  const blockedList = readSafeJson<any[]>("do-not-import.json", []);

  const now = Date.now();
  for (const [pid, st] of Object.entries<any>(states)) {
    if (st?.availabilityConfirmed && st?.availableUntil && new Date(st.availableUntil).getTime() < now) {
      states[pid].availabilityConfirmed = false;
      states[pid].online = false;
    }
  }

  if (req.method === "GET") {
    if (isSupabaseConfigured()) {
      const dbStates = await supaFetch<any[]>("managed_profile_states?select=*");
      for (const r of dbStates.data || []) {
        states[r.profile_id] = {
          ...(states[r.profile_id] || {}),
          profileId: r.profile_id,
          displayName: r.display_name,
          city: r.city,
          canton: r.canton,
          rate30Chf: r.rate30_chf,
          rate60Chf: r.rate60_chf,
          claimed: r.claimed,
          identityVerified: r.identity_verified,
          aiOptIn: r.ai_opt_in,
          availabilityConfirmed: Boolean(r.availability_confirmed && r.available_until && new Date(r.available_until).getTime() > now),
          hidden: Boolean(r.hidden || r.paused || r.removed_by_report),
          paused: Boolean(r.paused || r.hidden),
        };
      }
    }

    const publicStates: Record<string, any> = {};
    for (const [pid, st] of Object.entries<any>(states)) {
      publicStates[pid] = {
        profileId: pid,
        displayName: st.displayName,
        city: st.city,
        canton: st.canton,
        rate30Chf: st.rate30Chf,
        rate60Chf: st.rate60Chf,
        thumbnail: st.thumbnail,
        claimed: Boolean(st.claimed),
        identityVerified: Boolean(st.identityVerified),
        aiOptIn: Boolean(st.aiOptIn),
        sponsored: Boolean(st.sponsored),
        availabilityConfirmed: Boolean(st.availabilityConfirmed),
        online: Boolean(st.availabilityConfirmed),
        availableUntil: st.availableUntil || null,
        paused: Boolean(st.paused || st.hidden),
        hidden: Boolean(st.hidden || st.paused),
      };
    }

    const blockedIds = blockedList.map((b: any) => (typeof b === "string" ? b : b?.profileId)).filter(Boolean);
    if (isAdmin) return res.status(200).json({ ok: true, isAdmin: true, states, metrics, enquiries, takedowns, blockedIds });
    if (isOwner) {
      return res.status(200).json({
        ok: true,
        isOwner: true,
        states: { [profileId]: states[profileId] || { profileId } },
        metrics: { [profileId]: metrics[profileId] || { views: 0, detailOpens: 0, contactClicks: 0, sourceClicks: 0 } },
        enquiries: enquiries.filter((e: any) => e.profileId === profileId),
        blockedIds,
      });
    }
    return res.status(200).json({ ok: true, states: publicStates, metrics: {}, enquiries: [], blockedIds });
  }

  if (req.method !== "POST") return res.status(405).json({ ok: false, error: "Method not allowed" });

  const body = req.body || {};
  const action = String(body.action || "").trim();

  if (["track_view", "track_click", "track_contact", "track_source_out"].includes(action) && profileId) {
    const cur = metrics[profileId] || { views: 0, detailOpens: 0, contactClicks: 0, sourceClicks: 0 };
    if (action === "track_view") cur.views += 1;
    if (action === "track_click") cur.detailOpens += 1;
    if (action === "track_contact") cur.contactClicks = (cur.contactClicks || 0) + 1;
    if (action === "track_source_out") cur.sourceClicks += 1;
    cur.lastEventAt = new Date().toISOString();
    metrics[profileId] = cur;
    writeSafeJson("profile-metrics.json", metrics);
    return res.status(200).json({ ok: true, metrics: cur });
  }

  if (action === "create_enquiry" && profileId) {
    const newLead = {
      id: "lead-" + Date.now(),
      profileId,
      providerName: String(body.providerName || profileId).trim(),
      clientContact: String(body.clientContact || "").trim(),
      desiredTime: String(body.desiredTime || "").trim(),
      duration: String(body.duration || "60 Min.").trim(),
      status: "NEW",
      createdAt: new Date().toISOString(),
    };
    enquiries.unshift(newLead);
    writeSafeJson("private-enquiries.json", enquiries);
    await sendTelegramPing([`📬 Neue Anfrage: ${newLead.providerName} (${profileId})`, `Kontakt: ${newLead.clientContact} · ${newLead.desiredTime}`]);
    return res.status(200).json({ ok: true, enquiry: newLead });
  }

  if (["submit_takedown", "report_profile", "opt_out", "report_issue", "dmca_takedown"].includes(action)) {
    const caseId = "CASE-" + Date.now().toString().slice(-6);
    const offers = (harvestedOffers as any[]) || [];
    const matched = offers.find((o: any) => o.id === profileId);
    const phoneHash = hashSwissPhone(body.phone || matched?.rawPhone || "");

    const entry = {
      caseId,
      profileId: profileId || null,
      reason: String(body.reason || "Opt-Out").slice(0, 500),
      contact: String(body.contact || "").slice(0, 120),
      status: "HIDDEN_IMMEDIATELY",
      createdAt: new Date().toISOString(),
    };
    takedowns.unshift(entry);
    writeSafeJson("dmca-takedowns.json", takedowns);

    if (profileId) {
      states[profileId] = { ...(states[profileId] || {}), paused: true, hidden: true, removedByReport: true, aiOptIn: false, updatedAt: new Date().toISOString() };
      writeSafeJson("managed-profile-states.json", states);
      blockedList.push({ profileId, phoneHash, reason: "opt-out", createdAt: new Date().toISOString() });
      writeSafeJson("do-not-import.json", blockedList);
    }
    await sendTelegramPing([`🛡️ Opt-Out / Takedown (${caseId})`, `Profil: ${profileId}`, `Kontakt: ${entry.contact}`]);
    return res.status(200).json({ ok: true, caseId, caseNumber: caseId, preliminarilyHidden: Boolean(profileId) });
  }

  if (["login_or_claim", "register_new_profile", "request_claim"].includes(action)) {
    const offers = (harvestedOffers as any[]) || [];
    const rawQuery = String(body.query || body.phone || body.displayName || profileId || "").trim();
    const cleanDigits = rawQuery.replace(/\D/g, "").replace(/^0041/, "41").replace(/^0/, "41");
    const matchedOffer = offers.find(
      (o: any) =>
        o.id === rawQuery ||
        o.dedupClusterId === rawQuery ||
        (cleanDigits.length >= 9 && String(o.rawPhone || "").replace(/\D/g, "").includes(cleanDigits.slice(-8)))
    );

    const targetId = matchedOffer
      ? matchedOffer.id || matchedOffer.dedupClusterId
      : profileId || "ch-new-" + crypto.createHash("sha1").update(rawQuery + Date.now()).digest("hex").slice(0, 10);

    const token = makeOwnerToken(targetId);
    if (states[targetId]?.claimed && providedToken && providedToken !== token && !isAdmin) {
      return res.status(403).json({ ok: false, error: "Dieses Profil ist bereits geschützt." });
    }

    const cleanName = String(body.displayName || matchedOffer?.rawName || rawQuery || "Direktprofil").trim();
    states[targetId] = {
      ...(states[targetId] || {}),
      profileId: targetId,
      displayName: cleanName,
      city: String(body.city || matchedOffer?.city || "Zürich").trim(),
      canton: String(body.canton || matchedOffer?.canton || "ZH").toUpperCase().trim(),
      phoneDisplay: String(body.phoneDisplay || body.phone || matchedOffer?.rawPhone || "").trim(),
      rate30Chf: Math.max(80, Math.min(800, Number(body.rate30Chf || matchedOffer?.rate30Chf || 200))),
      rate60Chf: Math.max(100, Math.min(1200, Number(body.rate60Chf || matchedOffer?.advertisedBaseChf || 350))),
      bio: String(body.bio || matchedOffer?.bio || `${cleanName} – Direktkontakt.`).trim(),
      thumbnail: String(body.thumbnail || matchedOffer?.thumbnail || "").trim(),
      claimed: true,
      updatedAt: new Date().toISOString(),
    };
    writeSafeJson("managed-profile-states.json", states);

    return res.status(200).json({
      ok: true,
      profileId: targetId,
      ownerToken: token,
      cockpitUrl: `/creator-dashboard?id=${encodeURIComponent(targetId)}&token=${encodeURIComponent(token)}`,
      state: states[targetId],
    });
  }

  if (!isOwner && !isAdmin) return res.status(403).json({ ok: false, error: "Zugriff verweigert." });

  if (action === "confirm_availability_4h" && profileId) {
    const until = new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString();
    states[profileId] = { ...(states[profileId] || {}), profileId, availabilityConfirmed: true, online: true, availableUntil: until, paused: false, hidden: false, updatedAt: new Date().toISOString() };
    writeSafeJson("managed-profile-states.json", states);
    return res.status(200).json({ ok: true, availableUntil: until, state: states[profileId] });
  }

  if ((action === "update_profile_fields" || action === "update_profile_state") && profileId) {
    const u = body.updates || body;
    const next = { ...(states[profileId] || { profileId }), updatedAt: new Date().toISOString() };
    if (u.displayName !== undefined) next.displayName = String(u.displayName).trim().slice(0, 60);
    if (u.city !== undefined) next.city = String(u.city).trim().slice(0, 40);
    if (u.canton !== undefined) next.canton = String(u.canton).toUpperCase().trim().slice(0, 4);
    if (u.phoneDisplay !== undefined) next.phoneDisplay = String(u.phoneDisplay).trim().slice(0, 30);
    if (u.rate30Chf !== undefined) next.rate30Chf = Math.max(80, Math.min(800, Number(u.rate30Chf) || 200));
    if (u.rate60Chf !== undefined) next.rate60Chf = Math.max(100, Math.min(1200, Number(u.rate60Chf) || 350));
    if (u.bio !== undefined) next.bio = String(u.bio).trim().slice(0, 2000);
    if (u.aiOptIn !== undefined) next.aiOptIn = Boolean(u.aiOptIn);
    if (u.paused !== undefined) {
      next.paused = Boolean(u.paused);
      next.hidden = Boolean(u.paused);
    }
    if (isAdmin) {
      if (u.identityVerified !== undefined) next.identityVerified = Boolean(u.identityVerified);
      if (u.sponsored !== undefined) next.sponsored = Boolean(u.sponsored);
      if (u.hidden !== undefined) next.hidden = Boolean(u.hidden);
    }
    states[profileId] = next;
    writeSafeJson("managed-profile-states.json", states);
    return res.status(200).json({ ok: true, state: next });
  }

  return res.status(400).json({ ok: false, error: "Unbekannte Aktion: " + action });
}