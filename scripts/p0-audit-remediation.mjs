import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const root = process.cwd();

// ---------------------------------------------------------------------------
// 1. IWSN-006: SEO.tsx — Echte Seiten-Canonicals aus router?.asPath ableiten
// ---------------------------------------------------------------------------
const seoPath = path.join(root, "src", "components", "SEO.tsx");
const seoFixedCode = `import React from "react";
import Head from "next/head";
import { useRouter } from "next/router";

export interface SEOProps {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string | string[];
  structuredData?: Record<string, any> | Array<Record<string, any>>;
  schema?: Record<string, any> | Array<Record<string, any>>;
  noindex?: boolean;
  canonicalPath?: string;
  children?: React.ReactNode;
  [key: string]: any;
}

function resolveCanonicalUrl(canonicalPath?: string, url?: string, routerAsPath?: string): string {
  if (url && url.startsWith("http")) {
    return url.split("?")[0].split("#")[0];
  }
  const rawSource = canonicalPath || url || routerAsPath || "/";
  const clean = String(rawSource)
    .replace("https://iwantsexnow.ch", "")
    .replace("http://iwantsexnow.ch", "")
    .split("?")[0]
    .split("#")[0]
    .trim();

  if (!clean || clean === "/") return "https://iwantsexnow.ch";
  return "https://iwantsexnow.ch" + (clean.startsWith("/") ? clean : "/" + clean);
}

export function SEO({
  title = "iwantsexnow.ch | Schweizer Profilverzeichnis & Portalvergleich",
  description = "Profile finden, Verfügbarkeit erkennen und veröffentlichte Preise & Quellen in der ganzen Schweiz übersichtlich vergleichen.",
  image = "https://iwantsexnow.ch/og-cover.jpg",
  url,
  type = "website",
  structuredData,
  schema,
  noindex = false,
  canonicalPath,
  children,
}: SEOProps) {
  const router = useRouter();
  const canonicalUrl = resolveCanonicalUrl(canonicalPath, url, router?.asPath);
  const jsonLdPayload = structuredData || schema;

  return (
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content={noindex ? "noindex, nofollow" : "index, follow"} />
      <link rel="canonical" href={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="iwantsexnow.ch" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {jsonLdPayload && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPayload) }}
        />
      )}
      {children}
    </Head>
  );
}

export default SEO;
`;
fs.writeFileSync(seoPath, seoFixedCode, "utf8");
console.log("✓ IWSN-006: SEO.tsx leitet Canonicals wieder sauber pro Route (router?.asPath) ab.");

// ---------------------------------------------------------------------------
// 2. IWSN-002, IWSN-003 & IWSN-015: /api/vault/metrics.ts absichern
//    - Öffentliches GET gibt NIEMALS ownerToken oder lastReport aus!
//    - Schreibaktionen (confirm_availability_4h, update_profile_fields) prüfen
//      zwingend das ownerToken!
//    - identityVerified kann NICHT über das ungeschützte Formular gesetzt werden!
//    - Unbekannte Aktionen liefern HTTP 400 (ok: false) statt ok: true!
//    - 4h-Expiry setzt sowohl availabilityConfirmed = false ALS AUCH online = false!
// ---------------------------------------------------------------------------
const metricsPath = path.join(root, "src", "pages", "api", "vault", "metrics.ts");
const secureMetricsCode = `import type { NextApiRequest, NextApiResponse } from "next";
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
`;
fs.writeFileSync(metricsPath, secureMetricsCode, "utf8");
console.log("✓ IWSN-002/003/015: /api/vault/metrics.ts vollständig gegen Token-/Report-Leaks & unbefugte Schreibzugriffe gehärtet.");

// ---------------------------------------------------------------------------
// 3. IWSN-004: Echten 650er-Rohbestand ohne künstliche Seed-Duplikate wiederherstellen
//    & öffentliche Pilot-Tokens aus ready-whatsapp-claims.json neutralisieren
// ---------------------------------------------------------------------------
const offersPath = path.join(root, "src", "data", "harvested-offers.json");
const offersTsPath = path.join(root, "src", "data", "harvestedOffers.ts");
const full7000Path = path.join(root, "src", "data", "swiss-full-vault-7000.json");

if (fs.existsSync(full7000Path)) {
  fs.rmSync(full7000Path, { force: true });
}

if (fs.existsSync(offersPath)) {
  const rawOffers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
  // Entferne die synthetischen w4-* und ch-v7k-* Seed-Einträge
  const authenticOffers = rawOffers.filter((item) => {
    const id = String(item?.dedupClusterId || "");
    return !id.startsWith("w4-") && !id.startsWith("ch-v7k-");
  });
  fs.writeFileSync(offersPath, JSON.stringify(authenticOffers, null, 2), "utf8");
  fs.writeFileSync(
    offersTsPath,
    `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\n`,
    "utf8"
  );
  console.log(`✓ IWSN-004: Synthetische Seed-Zeilen entfernt (${authenticOffers.length} reale Basis-Einträge verbleiben).`);
}

// Entferne etwaige öffentliche ownerTokens aus ready-whatsapp-claims.json
const claimsFile = path.join(root, "src", "data", "ready-whatsapp-claims.json");
if (fs.existsSync(claimsFile)) {
  try {
    const claims = JSON.parse(fs.readFileSync(claimsFile, "utf8"));
    const sanitized = Array.isArray(claims)
      ? claims.map((c) => {
          const copy = { ...c };
          delete copy.ownerToken;
          delete copy.claimUrl;
          delete copy.cockpitUrl;
          return copy;
        })
      : [];
    fs.writeFileSync(claimsFile, JSON.stringify(sanitized, null, 2), "utf8");
    console.log("✓ IWSN-003: Öffentliche Pilot-Tokens aus ready-whatsapp-claims.json entfernt.");
  } catch {}
}

// ---------------------------------------------------------------------------
// 4. IWSN-005: Keine falsche Ersatzperson bei unbekannter ID in /profile/[id].tsx
// ---------------------------------------------------------------------------
const profileDetailPath = path.join(root, "src", "pages", "profile", "[id].tsx");
if (fs.existsSync(profileDetailPath)) {
  let pCode = fs.readFileSync(profileDetailPath, "utf8");
  // Entferne den gefährlichen Modulo-Fallback, der eine fremde Person anzeigt!
  pCode = pCode.replace(
    /if \(foundIdx < 0\) \{\s*const numMatch = rawId\.match\(\/\\d\+\/\);\s*foundIdx = numMatch \? Math\.max\(0, \( parseInt\(numMatch\[0\], 10\) - 1 \) % Math\.max\(1, rawList\.length\)\) : 0;\s*\}/g,
    'if (foundIdx < 0) {\n      return null;\n    }'
  );

  // Falls profileData null ist (oder hidden/paused), zeige einen ehrlichen "Profil nicht gefunden"-Zustand!
  const notFoundGuard = `  if (!profileData || profileData.hidden || profileData.paused) {
    return (
      <div className="min-h-screen bg-[#13161C] text-white flex flex-col justify-between">
        <SEO title="Profil nicht gefunden | iwantsexnow.ch" noindex />
        <LuxuryHeader />
        <main className="max-w-xl mx-auto px-6 py-20 text-center space-y-4">
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-white">
            Dieser Eintrag ist nicht (mehr) verfügbar
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
            Unter der angefragten Kennung wurde kein aktives öffentliches Profil gefunden. Es wird aus Sicherheitsgründen kein Ersatzprofil angezeigt.
          </p>
          <Link href="/" className="inline-block px-6 py-3 rounded-xl bg-[#C6A574] text-[#13161C] font-bold text-xs uppercase tracking-wider">
            Zurück zur Übersicht →
          </Link>
        </main>
        <CorporateFooter />
      </div>
    );
  }
`;

  if (!pCode.includes("Dieser Eintrag ist nicht (mehr) verfügbar")) {
    pCode = pCode.replace(
      "  const recordAction = (action: string) => {",
      notFoundGuard + "\n  const recordAction = (action: string) => {"
    );
  }
  fs.writeFileSync(profileDetailPath, pCode, "utf8");
  console.log("✓ IWSN-005: Modulo-Ersatzperson aus src/pages/profile/[id].tsx entfernt (zeigt echten Nicht-gefunden-Zustand).");
}

// ---------------------------------------------------------------------------
// 5. IWSN-012: Such-API-Vertrag (/api/vault/search.ts) mit Client synchronisieren
// ---------------------------------------------------------------------------
const searchApiPath = path.join(root, "src", "pages", "api", "vault", "search.ts");
if (fs.existsSync(searchApiPath)) {
  let sCode = fs.readFileSync(searchApiPath, "utf8");
  sCode = sCode.replace(/swiss-full-vault-7000\.json/g, "harvested-offers.json");
  fs.writeFileSync(searchApiPath, sCode, "utf8");
}