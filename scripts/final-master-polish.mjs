throw new Error("Historical patch generator retired. Apply reviewed source changes through pull requests.");

import fs from "fs";
import path from "path";

const root = process.cwd();

// ---------------------------------------------------------------------------
// 1. IMAGE QUALITY GUARD (src/lib/imageQualityGuard.ts)
//    Verhindert Wasserzeichen-Thumbnails (6navi/sexnavi) & tote Bild-Links
// ---------------------------------------------------------------------------
const libDir = path.join(root, "src", "lib");
if (!fs.existsSync(libDir)) fs.mkdirSync(libDir, { recursive: true });

const imageGuardCode = `const CLEAN_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85",
];

export function resolveCleanPortrait(rawUrl: any, indexSeed = 0): string {
  const url = String(rawUrl || "").trim();
  const fallback = CLEAN_PORTRAITS[Math.abs(indexSeed) % CLEAN_PORTRAITS.length];
  if (!url || !url.startsWith("http")) return fallback;

  const low = url.toLowerCase();
  if (
    low.includes("6navi") ||
    low.includes("sexnavi") ||
    low.includes("watermark") ||
    low.includes("placeholder") ||
    low.includes("no-image") ||
    low.includes("default-avatar")
  ) {
    return fallback;
  }
  return url;
}
`;
fs.writeFileSync(path.join(libDir, "imageQualityGuard.ts"), imageGuardCode, "utf8");
console.log("✓ 1. Bild-Qualitäts-Wächter gespeichert: src/lib/imageQualityGuard.ts");

// ---------------------------------------------------------------------------
// 2. ECHTE 4-STUNDEN-ABLAUF-AUTOMATIK & SUPABASE-CLOUD-BRÜCKE
//    in src/pages/api/vault/metrics.ts
// ---------------------------------------------------------------------------
const apiVaultDir = path.join(root, "src", "pages", "api", "vault");
if (!fs.existsSync(apiVaultDir)) fs.mkdirSync(apiVaultDir, { recursive: true });

const metricsApiCode = `import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const STATE_FILE = path.join(process.cwd(), "src", "data", "live-vault-state.json");
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

function saveStore(store: VaultStore) {
  memoryStore = store;
  try {
    fs.writeFileSync(STATE_FILE, JSON.stringify(store, null, 2), "utf8");
  } catch {}
}

// Prüft bei jedem Abruf, ob eine 4h-Verfügbarkeits-Bestätigung abgelaufen ist,
// und berechnet live die verstrichenen Minuten ("Bestätigt vor X Min.")
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
        copy.confirmedMinutesAgo = null;
      } else {
        copy.confirmedMinutesAgo = Math.max(1, Math.round(elapsedMs / 60000));
      }
    }
    cleaned[id] = copy;
  }
  return cleaned;
}

// Optionale Cloud-Synchronisation zu Supabase (falls ENV gesetzt), niemals blockierend
async function syncEventToSupabaseIfConfigured(eventType: string, profileId: string, payload: any) {
  const sbUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const sbKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!sbUrl || !sbKey) return;

  try {
    await fetch(sbUrl.replace(/\\/$/, "") + "/rest/v1/iwsn_profile_events", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: sbKey,
        Authorization: "Bearer " + sbKey,
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        event_type: eventType,
        profile_id: profileId,
        payload,
        created_at: new Date().toISOString(),
      }),
    });
  } catch {}
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const store = loadStore();
  store.states = applyFourHourExpiry(store.states);

  if (req.method === "GET") {
    return res.status(200).json({
      ok: true,
      metrics: store.metrics,
      states: store.states,
      serverTime: new Date().toISOString(),
    });
  }

  if (req.method === "POST") {
    const body = typeof req.body === "string" ? JSON.parse(req.body || "{}") : req.body || {};
    const action = String(body.action || "");
    const profileId = String(body.profileId || "ch-1").trim();

    if (!store.metrics[profileId]) {
      store.metrics[profileId] = { views: 0, detailOpens: 0, sourceClicks: 0, contactClicks: 0 };
    }
    if (!store.states[profileId]) {
      store.states[profileId] = {};
    }

    const mt = store.metrics[profileId];
    const st = store.states[profileId];

    if (action === "track_view") mt.views += 1;
    else if (action === "track_click") mt.detailOpens += 1;
    else if (action === "track_source_out") mt.sourceClicks += 1;
    else if (action === "track_contact") mt.contactClicks += 1;
    else if (action === "claim_or_create_profile") {
      if (st.ownerToken && body.ownerToken && st.ownerToken !== body.ownerToken) {
        return res.status(403).json({
          ok: false,
          error: "Dieses Profil wird bereits von einem bestätigten Konto verwaltet.",
        });
      }
      const token = st.ownerToken || "iwsn_" + crypto.randomBytes(12).toString("hex");
      st.claimed = true;
      st.ownerToken = token;
      if (body.displayName) st.displayName = String(body.displayName).trim();
      if (body.city) st.city = String(body.city).trim();
      if (body.canton) st.canton = String(body.canton).trim().toUpperCase();
      if (body.rate60Chf) st.rate60Chf = Number(body.rate60Chf);
      if (body.category) st.category = String(body.category);
      st.updatedAt = new Date().toISOString();

      saveStore(store);
      syncEventToSupabaseIfConfigured(action, profileId, { displayName: st.displayName, city: st.city, canton: st.canton });

      return res.status(200).json({
        ok: true,
        profileId,
        ownerToken: token,
        state: st,
      });
    } else if (action === "confirm_availability_4h") {
      const nextAvailable = body.availabilityConfirmed !== undefined ? Boolean(body.availabilityConfirmed) : true;
      st.availabilityConfirmed = nextAvailable;
      st.availabilityConfirmedAt = nextAvailable ? Date.now() : null;
      st.confirmedMinutesAgo = nextAvailable ? 1 : null;
      st.online = nextAvailable;
      st.claimed = true;
      st.updatedAt = new Date().toISOString();
    } else if (action === "update_profile_fields") {
      if (body.displayName !== undefined) st.displayName = String(body.displayName).trim();
      if (body.city !== undefined) st.city = String(body.city).trim();
      if (body.canton !== undefined) st.canton = String(body.canton).trim().toUpperCase();
      if (body.rate60Chf !== undefined) st.rate60Chf = Number(body.rate60Chf);
      if (body.bio !== undefined) st.bio = String(body.bio).trim();
      if (body.paused !== undefined) st.paused = Boolean(body.paused);
      if (body.identityVerified !== undefined) st.identityVerified = Boolean(body.identityVerified);
      st.claimed = true;
      st.updatedAt = new Date().toISOString();
    } else if (action === "report_or_optout") {
      if (body.reason === "remove_own_entry") {
        st.hidden = true;
        st.paused = true;
      }
      st.lastReport = {
        reason: body.reason || "report",
        details: body.details || "",
        reportedAt: new Date().toISOString(),
      };
    }

    saveStore(store);
    syncEventToSupabaseIfConfigured(action, profileId, body);

    return res.status(200).json({
      ok: true,
      profileId,
      metrics: mt,
      state: st,
    });
  }

  return res.status(405).json({ ok: false, error: "Method not allowed" });
}
`;
fs.writeFileSync(path.join(apiVaultDir, "metrics.ts"), metricsApiCode, "utf8");
console.log("✓ 2. API mit 4h-Auto-Expiry & Live-Minuten-Berechnung aktualisiert: src/pages/api/vault/metrics.ts");

// ---------------------------------------------------------------------------
// 3. VERBINDE LIVE-MINUTEN-BERECHNUNG MIT DER STARTSEITE (src/pages/index.tsx)
//    Sorgt dafür, dass ein im Cockpit bestätigter Status sofort "Bestätigt vor 1 Min." zeigt!
// ---------------------------------------------------------------------------
const indexPath = path.join(root, "src", "pages", "index.tsx");
if (fs.existsSync(indexPath)) {
  let idxContent = fs.readFileSync(indexPath, "utf8");
  idxContent = idxContent.replace(
    "if (availabilityConfirmed) {\n        confirmedMinutesAgo = idx % 2 === 0 ? 6 : 12;\n      }",
    "if (availabilityConfirmed) {\n        confirmedMinutesAgo = st.confirmedMinutesAgo || (idx % 2 === 0 ? 6 : 12);\n      }"
  );
  fs.writeFileSync(indexPath, idxContent, "utf8");
  console.log("✓ 3. Live-Minuten-Anzeige in src/pages/index.tsx verknüpft.");
}