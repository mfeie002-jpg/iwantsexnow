#!/usr/bin/env node
/**
 * Report profile photo URLs that are usable, skipped, or broken.
 *
 *   node scripts/check-image-health.mjs
 *   node scripts/check-image-health.mjs --probe --limit=40
 *
 * Without --probe the script only classifies URLs already stored in the
 * catalogue. With --probe it requests up to --limit unique candidate URLs.
 */
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const offers = JSON.parse(fs.readFileSync(path.join(root, "src/data/harvested-offers.json"), "utf8"));
const states = JSON.parse(fs.readFileSync(path.join(root, "src/data/managed-profile-states.json"), "utf8"));
const args = process.argv.slice(2);
const probe = args.includes("--probe");
const limitFlag = args.find((arg) => arg.startsWith("--limit="));
const limit = limitFlag ? Number(limitFlag.slice("--limit=".length)) : 20;

function photoValues(record) {
  const values = [];
  for (const key of ["thumbnail", "photoUrl", "imageUrl", "image", "gallery", "galleryUrls", "originalGallery", "photos"]) {
    const value = record?.[key];
    if (typeof value === "string") values.push(value);
    else if (Array.isArray(value)) values.push(...value.filter((item) => typeof item === "string"));
  }
  return values;
}

function classify(value) {
  const raw = String(value || "").trim();
  if (!raw) return "empty";
  let decoded = raw;
  try { decoded = decodeURIComponent(raw); } catch { /* keep the raw value */ }
  if (/bg_blur/i.test(decoded)) return "blur";
  if (/unsplash\.|pexels\.|pixabay\./i.test(decoded)) return "stock";
  if (raw.startsWith("/")) return "local";
  try {
    const url = new URL(raw);
    if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) return "invalid";
    return "candidate";
  } catch {
    return "invalid";
  }
}

const counts = { blur: 0, stock: 0, local: 0, candidate: 0, invalid: 0, empty: 0 };
const candidates = new Set();
let profilesWithOnlyBlur = 0;
let profiles = 0;

for (const offer of offers) {
  const id = String(offer.id || offer.dedupClusterId || "");
  const values = [...photoValues(offer), ...photoValues(states[id])];
  if (!values.length) continue;
  profiles += 1;
  const kinds = values.map(classify);
  for (const kind of kinds) counts[kind] += 1;
  if (kinds.some((kind) => kind === "blur") && !kinds.some((kind) => kind === "candidate" || kind === "local")) profilesWithOnlyBlur += 1;
  for (const value of values) if (classify(value) === "candidate") candidates.add(value.trim());
}

console.log(JSON.stringify({
  profiles,
  profilesWithBlurAndNoOtherPhoto: profilesWithOnlyBlur,
  urls: counts,
  uniqueCandidates: candidates.size
}, null, 2));

if (!probe) {
  console.log("Keine Netzprüfung. Starte mit --probe, um echte HTTP-Status zu sehen.");
  process.exit(0);
}

const sample = [...candidates].slice(0, Number.isFinite(limit) && limit > 0 ? limit : 20);
const outcome = { working: 0, broken: 0, details: [] };
let cursor = 0;
async function worker() {
  while (cursor < sample.length) {
    const url = sample[cursor++];
    try {
      const response = await fetch(url, {
        method: "GET",
        redirect: "manual",
        signal: AbortSignal.timeout(5000),
        headers: { Accept: "image/*", "Accept-Encoding": "identity" }
      });
      const type = String(response.headers.get("content-type") || "").split(";")[0].trim().toLowerCase();
      const working = response.status === 200 && type.startsWith("image/") && type !== "image/svg+xml";
      if (!working) await response.arrayBuffer().catch(() => {});
      else await response.body?.cancel();
      outcome[working ? "working" : "broken"] += 1;
      outcome.details.push({ url, status: response.status, type: type || null, working });
    } catch (error) {
      outcome.broken += 1;
      outcome.details.push({ url, status: 0, type: null, working: false, error: error.name || "error" });
    }
  }
}
await Promise.all(Array.from({ length: Math.min(6, sample.length) }, worker));
console.log(JSON.stringify({
  probed: sample.length,
  working: outcome.working,
  broken: outcome.broken,
  details: outcome.details
}, null, 2));
