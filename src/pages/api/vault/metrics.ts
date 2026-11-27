import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import harvestedOffers from "@/data/harvested-offers.json";
import establishments from "@/data/swiss-establishments-vault.json";
import { isSupabaseConfigured, supaFetch, readSafeJson, writeSafeJson, sendTelegramPing } from "@/lib/supabaseAdmin";

const ADMIN_PIN = process.env.ADMIN_PIN || "";

function secureAdminMatch(provided: string): boolean {
  // Legacy hard-coded PINs and credentials in URLs are never accepted.
  if (!ADMIN_PIN || ADMIN_PIN.length < 16 || !provided) return false;
  const a = Buffer.from(ADMIN_PIN);
  const b = Buffer.from(provided);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  res.setHeader("Cache-Control", "no-store");
  const adminHeader = String(req.headers["x-admin-pin"] || "").trim();
  const isAdmin = secureAdminMatch(adminHeader);
  const profileId = String(req.query.profileId || req.body?.profileId || req.body?.id || "").trim();

  // Legacy deterministic owner tokens and URL query credentials may have been exposed.
  // Owner actions remain disabled here until verified sessions replace the legacy flow.
  const isOwner = false;

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
      if (!dbStates.ok || !Array.isArray(dbStates.data)) {
        return res.status(503).json({ ok: false, code: "PROFILE_STATE_UNAVAILABLE", error: "Aktueller Profilstatus ist vorübergehend nicht verfügbar." });
      }
      for (const r of dbStates.data || []) {
        states[r.profile_id] = {
          ...(states[r.profile_id] || {}),
          profileId: r.profile_id,
          displayName: r.display_name,
          city: r.city,
          canton: r.canton,
          rate30Chf: r.rate30_chf,
          rate60Chf: r.rate60_chf,
          priceConfirmed: r.price_confirmed === true,
          rateConfirmed: r.rate_confirmed === true,
          priceConfirmedAt: typeof r.price_confirmed_at === "string" ? r.price_confirmed_at : null,
          rateUpdatedAt: typeof r.rate_updated_at === "string" ? r.rate_updated_at : null,
          claimed: r.claimed,
          identityVerified: r.identity_verified,
          aiOptIn: r.ai_opt_in,
          availabilityConfirmed: Boolean(r.availability_confirmed && r.available_until && new Date(r.available_until).getTime() > now),
          availableUntil: typeof r.available_until === "string" ? r.available_until : null,
          hidden: Boolean(r.hidden || r.paused || r.removed_by_report),
          paused: Boolean(r.paused || r.hidden),
        };
      }
    }

    const publicStates: Record<string, any> = {};
    const publicIds = new Set([...harvestedOffers,...establishments].map((o:any)=>o.id||o.dedupClusterId));
    const excludedIds = new Set(blockedList.map((b:any)=>typeof b==='string'?b:b?.profileId));
    for (const [pid, st] of Object.entries<any>(states)) {
      if(!publicIds.has(pid))continue;
      if(st.hidden||st.paused||st.removedByReport||excludedIds.has(pid)){publicStates[pid]={profileId:pid,hidden:true,paused:true};continue;}
      publicStates[pid] = {
        profileId: pid,
        displayName: st.displayName,
        city: st.city,
        canton: st.canton,
        rate30Chf: st.rate30Chf,
        rate60Chf: st.rate60Chf,
        priceConfirmed: st.priceConfirmed === true,
        rateConfirmed: st.rateConfirmed === true,
        priceConfirmedAt: typeof st.priceConfirmedAt === "string" ? st.priceConfirmedAt : null,
        rateUpdatedAt: typeof st.rateUpdatedAt === "string" ? st.rateUpdatedAt : null,
        thumbnail: st.thumbnail,
        claimed: Boolean(st.claimed),
        identityVerified: false, // existing legacy flags lack auditable verification evidence
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
    return res.status(503).json({ ok: false, code: "VERIFIED_ENQUIRY_DELIVERY_REQUIRED",
      error: "Interne Anfragen sind derzeit nicht verfügbar. Eine bestätigte Zustellung an die zuständige Anbieterin ist noch nicht eingerichtet." });
  }

  if (["submit_takedown", "report_profile", "opt_out", "report_issue", "dmca_takedown"].includes(action)) {
    const reason = [body.reason, body.details].filter(Boolean).map((x) => String(x).trim()).join(" | ").slice(0, 500);
    const contact = String(body.contact || "").trim().slice(0, 120);
    const sourceUrl = String(body.sourceUrl || "").trim().slice(0, 500);
    if (!reason || reason.length < 5 || (!profileId && !sourceUrl)) {
      return res.status(400).json({ ok: false, error: "Bitte Grund und Profilbezug angeben." });
    }
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ ok: false, error: "Vertraulicher Meldeweg vorübergehend nicht verfügbar.", next: "/contact" });
    }
    const caseId = crypto.randomUUID();
    const record = {
      case_id: caseId,
      profile_id: profileId || null,
      source_url: sourceUrl || null,
      reason,
      contact,
      status: "RECEIVED"
    };
    const saved = await supaFetch("iwsn_report_cases", { method: "POST", body: record });
    if (!saved.ok) {
      return res.status(503).json({ ok: false, error: "Meldung nicht gespeichert. Bitte erneut versuchen.", next: "/contact" });
    }
    await sendTelegramPing(["Neuer IWSN-Meldefall: " + caseId]);
    return res.status(202).json({ ok: true, caseId, status: "RECEIVED", preliminarilyHidden: false });
  }

  if (["login_or_claim", "register_new_profile", "request_claim"].includes(action)) {
    return res.status(403).json({
      ok: false,
      code: "VERIFIED_PROVIDER_SESSION_REQUIRED",
      error: "Profilübernahme und Anmeldung erfordern eine verifizierte Anbietersitzung.",
      next: "/private/provider-draft"
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
