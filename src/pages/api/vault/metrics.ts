import type { NextApiRequest, NextApiResponse } from "next";
import crypto from "crypto";
import harvestedOffers from "@/data/harvested-offers.json";
import establishments from "@/data/swiss-establishments-vault.json";
import { isSupabaseConfigured, supaFetch, readSafeJson, writeSafeJson, sendTelegramPing } from "@/lib/supabaseAdmin";
import { isReportSubmissionKey, validateReportInput } from "@/lib/marketplace/report-input";

const ADMIN_PIN = process.env.ADMIN_PIN || "";

function reportCaseId(submissionKey: string): string {
  // Domain-separated one-way mapping: knowing the public receipt does not grant
  // the capability to check or replay its submission. Keep this namespace stable.
  const bytes = crypto.createHash("sha256").update("iwsn-private-report-v1:" + submissionKey.toLowerCase()).digest();
  bytes[6] = (bytes[6] & 0x0f) | 0x80;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.subarray(0, 16).toString("hex");
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

function reportReceipt(caseId: string) {
  // Acknowledges initial intake, never the current moderation state.
  return { ok: true, caseId, status: "RECEIVED", preliminarilyHidden: false };
}

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

  if (action === "report_receipt") {
    if (!isReportSubmissionKey(body.submissionKey)) return res.status(400).json({ ok: false, error: "Die Meldekennung fehlt oder ist ungültig." });
    if (!isSupabaseConfigured()) return res.status(503).json({ ok: false, error: "Vertraulicher Meldeweg vorübergehend nicht verfügbar." });
    const caseId = reportCaseId(body.submissionKey);
    const found = await supaFetch(`iwsn_report_cases?case_id=eq.${caseId}&select=case_id`, { timeoutMs: 10000 });
    if (!found.ok || !Array.isArray(found.data)) return res.status(503).json({ ok: false, error: "Der Meldeeingang konnte nicht bestätigt werden." });
    if (found.data.length === 1 && found.data[0]?.case_id === caseId) return res.status(202).json(reportReceipt(caseId));
    // An earlier request may still commit later; absence is not proof of failure.
    return res.status(404).json({ ok: false, code: "REPORT_UNCONFIRMED", error: "Noch kein Eingang bestätigt. Bitte behalte die Meldekennung für einen erneuten Versuch." });
  }

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
    const reportProfileId = req.query.profileId !== undefined ? req.query.profileId : body.profileId !== undefined ? body.profileId : body.id;
    const parsed = validateReportInput({ ...body, profileId: reportProfileId });
    if (parsed.ok === false) return res.status(400).json({ ok: false, field: parsed.field, error: parsed.message });
    if (!isReportSubmissionKey(body.submissionKey)) return res.status(400).json({ ok: false, error: "Die Meldekennung fehlt oder ist ungültig. Bitte lade das Meldeformular erneut." });
    const { profileId: reportId, sourceUrl, reason, contact } = parsed.value;
    if (!isSupabaseConfigured()) {
      return res.status(503).json({ ok: false, error: "Vertraulicher Meldeweg vorübergehend nicht verfügbar.", next: "/contact" });
    }
    const caseId = reportCaseId(body.submissionKey);
    const record = {
      case_id: caseId,
      profile_id: reportId || null,
      source_url: sourceUrl || null,
      reason,
      contact,
      status: "RECEIVED"
    };
    // The existing primary key is the atomic concurrency guard. Never merge or
    // overwrite a previous report, including its later moderation state.
    const started = performance.now();
    const saved = await supaFetch("iwsn_report_cases?on_conflict=case_id", {
      method: "POST", body: record, prefer: "resolution=ignore-duplicates,return=representation", timeoutMs: 10000
    });
    const unconfirmed = () => res.status(503).json({ ok: false, error: "Der Meldeeingang konnte nicht bestätigt werden. Bitte prüfe den Eingang erneut oder sende dieselbe Meldung nochmals ab.", next: "/contact" });
    if (!saved.ok || !Array.isArray(saved.data)) return unconfirmed();
    let row = saved.data.length === 1 ? saved.data[0] : null;
    const created = saved.data.length === 1;
    if (saved.data.length === 0) {
      // Duplicate INSERT returns no row. Read the committed original within the
      // same total database budget; no automatic second write is attempted.
      const remaining = Math.floor(10000 - (performance.now() - started));
      if (remaining <= 0) return unconfirmed();
      const found = await supaFetch(`iwsn_report_cases?case_id=eq.${caseId}&select=case_id,profile_id,source_url,reason,contact`, { timeoutMs: remaining });
      if (!found.ok || !Array.isArray(found.data) || found.data.length !== 1) return unconfirmed();
      row = found.data[0];
    }
    if (!row || row.case_id !== caseId || (created && row.status !== "RECEIVED")) return unconfirmed();
    if (row.profile_id !== record.profile_id || row.source_url !== record.source_url || row.reason !== record.reason || row.contact !== record.contact) {
      if (created) return unconfirmed();
      return res.status(409).json({ ok: false, code: "REPORT_CONTENT_CONFLICT", error: "Diese Meldekennung gehört bereits zu anderen Angaben. Bitte prüfe den früheren Eingang. Die gespeicherte Meldung wurde nicht verändert." });
    }
    if (created) {
      try { await sendTelegramPing(["Neuer IWSN-Meldefall: " + caseId]); } catch {
        // A notification failure cannot invalidate the confirmed private receipt.
      }
    }
    return res.status(202).json(reportReceipt(caseId));
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
