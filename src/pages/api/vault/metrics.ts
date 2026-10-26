import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const STATE_FILE = path.join(process.cwd(), "src", "data", "live-vault-state.json");
const PRIVATE_REPORTS_FILE = path.join(process.cwd(), "src", "data", "private-reports-log.json");
const FOUR_HOURS_MS = 4 * 60 * 60 * 1000;

interface VaultStore {
  metrics: Record<string, { views: number; detailOpens: number; sourceClicks: number; contactClicks: number }>;
  states: Record<string, any>;
}

let memoryStore: VaultStore | null = null;

function loadStore(): VaultStore {
  if (memoryStore) return memoryStore;
  try {
    if (fs.existsSync(STATE_FILE)) {
      const raw = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
      memoryStore = {
        metrics: raw.metrics || {},
        states: raw.states || {},
      };
      return memoryStore;
    }
  } catch {}
  memoryStore = { metrics: {}, states: {} };
  return memoryStore;
}

function saveStore(store: VaultStore): boolean {
  memoryStore = store;
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(store, null, 2), "utf8");
    return true;
  } catch {
    return false;
  }
}

function applyFourHourExpiry(states: Record<string, any>): Record<string, any> {
  const now = Date.now();
  const cleaned: Record<string, any> = {};

  for (const [id, st] of Object.entries(states)) {
    if (!st || typeof st !== "object") continue;
    const copy = { ...st };

    if (copy.availabilityConfirmed && copy.availabilityConfirmedAt) {
      const elapsedMs = now - Number(copy.availabilityConfirmedAt);
      if (elapsedMs > FOUR_HOURS_MS) {
        copy.availabilityConfirmed = false;
        copy.online = false;
        copy.confirmedMinutesAgo = null;
      } else {
        copy.confirmedMinutesAgo = Math.max(1, Math.round(elapsedMs / 60000));
      }
    } else if (!copy.availabilityConfirmed) {
      copy.online = false;
      copy.confirmedMinutesAgo = null;
    }
    cleaned[id] = copy;
  }
  return cleaned;
}

// Erstellt eine sichere öffentliche Projektion OHNE ownerToken, OHNE private Meldetexte
function toPublicStates(states: Record<string, any>): Record<string, any> {
  const pub: Record<string, any> = {};
  for (const [id, st] of Object.entries(states)) {
    if (!st || typeof st !== "object") continue;
    pub[id] = {
      claimed: Boolean(st.claimed),
      displayName: st.displayName || undefined,
      city: st.city || undefined,
      canton: st.canton || undefined,
      rate60Chf: st.rate60Chf !== undefined ? Number(st.rate60Chf) : undefined,
      category: st.category || undefined,
      bio: st.bio || undefined,
      availabilityConfirmed: Boolean(st.availabilityConfirmed),
      confirmedMinutesAgo: st.confirmedMinutesAgo || null,
      online: Boolean(st.online),
      paused: Boolean(st.paused),
      hidden: Boolean(st.hidden),
      identityVerified: Boolean(st.identityVerified),
      updatedAt: st.updatedAt || null,
    };
  }
  return pub;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const store = loadStore();
  store.states = applyFourHourExpiry(store.states);

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      metrics: store.metrics,
      states: toPublicStates(store.states),
      takedowns: [],
      serverTime: new Date().toISOString(),
    });
  }

  if (req.method === "POST") {
    let body: any = {};
    try {
      body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    } catch {
      return res.status(400).json({ ok: false, error: "Ungültiges JSON-Format." });
    }

    const action = String(body.action || "").trim();
    const profileId = String(body.profileId || "").trim();
    if (!action || !profileId) {
      return res.status(400).json({ ok: false, error: "Parameter action und profileId sind erforderlich." });
    }

    if (!store.metrics[profileId]) {
      store.metrics[profileId] = { views: 0, detailOpens: 0, sourceClicks: 0, contactClicks: 0 };
    }
    if (!store.states[profileId]) {
      store.states[profileId] = {};
    }

    const mt = store.metrics[profileId];
    const st = store.states[profileId];

    if (action === "track_view") {
      mt.views += 1;
      saveStore(store);
      return res.status(200).json({ ok: true, profileId, metrics: mt });
    }

    if (action === "track_click") {
      mt.detailOpens += 1;
      saveStore(store);
      return res.status(200).json({ ok: true, profileId, metrics: mt });
    }

    if (action === "track_source_out") {
      mt.sourceClicks += 1;
      saveStore(store);
      return res.status(200).json({ ok: true, profileId, metrics: mt });
    }

    if (action === "track_contact") {
      mt.contactClicks += 1;
      saveStore(store);
      return res.status(200).json({ ok: true, profileId, metrics: mt });
    }

    if (action === "claim_or_create_profile") {
      const providedToken = String(body.ownerToken || "").trim();
      // Wenn das Profil bereits ein ownerToken besitzt, MUSS das korrekte Token mitgeliefert werden!
      if (st.ownerToken && st.ownerToken !== providedToken) {
        return res.status(403).json({
          ok: false,
          error: "Dieses Profil ist bereits einem geschützten Anbieterkonto zugeordnet. Bitte verwende deinen persönlichen Zugangsschlüssel.",
        });
      }
      const token = st.ownerToken || "iwsn_" + crypto.randomBytes(16).toString("hex");
      st.claimed = true;
      st.ownerToken = token;
      if (body.displayName) st.displayName = String(body.displayName).trim().slice(0, 60);
      if (body.city) st.city = String(body.city).trim().slice(0, 60);
      if (body.canton) st.canton = String(body.canton).trim().toUpperCase().slice(0, 4);
      if (body.rate60Chf) st.rate60Chf = Number(body.rate60Chf);
      if (body.category) st.category = String(body.category).slice(0, 60);
      st.updatedAt = new Date().toISOString();

      const saved = saveStore(store);
      if (!saved) {
        return res.status(500).json({ ok: false, error: "Speicherfehler auf dem Server." });
      }
      return res.status(200).json({
        ok: true,
        profileId,
        ownerToken: token,
        state: toPublicStates({ [profileId]: st })[profileId],
      });
    }

    if (action === "confirm_availability_4h" || action === "update_profile_fields") {
      const providedToken = String(body.ownerToken || "").trim();
      if (!st.ownerToken || !providedToken || st.ownerToken !== providedToken) {
        return res.status(403).json({
          ok: false,
          error: "Nicht autorisiert: Gültiger Owner-Schlüssel für dieses Profil erforderlich.",
        });
      }

      if (action === "confirm_availability_4h") {
        const nextAvailable = body.availabilityConfirmed !== undefined ? Boolean(body.availabilityConfirmed) : true;
        st.availabilityConfirmed = nextAvailable;
        st.availabilityConfirmedAt = nextAvailable ? Date.now() : null;
        st.confirmedMinutesAgo = nextAvailable ? 1 : null;
        st.online = nextAvailable;
        st.updatedAt = new Date().toISOString();
      } else {
        if (body.displayName !== undefined) st.displayName = String(body.displayName).trim().slice(0, 60);
        if (body.city !== undefined) st.city = String(body.city).trim().slice(0, 60);
        if (body.canton !== undefined) st.canton = String(body.canton).trim().toUpperCase().slice(0, 4);
        if (body.rate60Chf !== undefined) st.rate60Chf = Number(body.rate60Chf);
        if (body.bio !== undefined) st.bio = String(body.bio).trim().slice(0, 800);
        if (body.paused !== undefined) st.paused = Boolean(body.paused);
        // WICHTIG: identityVerified darf NIEMALS durch den Client selbst gesetzt werden!
        st.updatedAt = new Date().toISOString();
      }

      const saved = saveStore(store);
      if (!saved) {
        return res.status(500).json({ ok: false, error: "Speicherfehler auf dem Server." });
      }
      return res.status(200).json({
        ok: true,
        profileId,
        state: toPublicStates({ [profileId]: st })[profileId],
      });
    }

    if (action === "report_or_optout") {
      const caseId = "CASE-" + Date.now().toString(36).toUpperCase();
      // Speichere vertrauliche Details NIEMALS im öffentlichen State!
      try {
        const existingCases = fs.existsSync(PRIVATE_REPORTS_FILE)
          ? JSON.parse(fs.readFileSync(PRIVATE_REPORTS_FILE, "utf8"))
          : [];
        existingCases.push({
          caseId,
          profileId,
          reason: String(body.reason || "report"),
          details: String(body.details || "").slice(0, 1000),
          contact: String(body.contact || "").slice(0, 200),
          status: "received_pending_review",
          createdAt: new Date().toISOString(),
        });
        fs.writeFileSync(PRIVATE_REPORTS_FILE, JSON.stringify(existingCases, null, 2), "utf8");
      } catch {}

      if (body.reason === "remove_own_entry") {
        st.hidden = true;
        st.paused = true;
        saveStore(store);
      }

      return res.status(200).json({
        ok: true,
        caseId,
        status: "received_pending_review",
      });
    }

    // Alle unbekannten Aktionen explizit mit Fehler abweisen (statt blind ok:true!)
    return res.status(400).json({
      ok: false,
      error: "Unbekannte oder nicht unterstützte Aktion: " + action,
    });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
