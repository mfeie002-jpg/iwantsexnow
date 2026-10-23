// Verify actual localhost responses, including dynamic sample-profile links.
// Run after next build and next start; this refuses non-loopback destinations.
import fs from "node:fs";
import path from "node:path";
import assert from "node:assert/strict";
const origin = process.env.PREVIEW_SMOKE_ORIGIN || "http://127.0.0.1:43127";
assert(["127.0.0.1", "localhost", "[::1]"].includes(new URL(origin).hostname), "Preview tests must run on loopback only");
const manifest = JSON.parse(fs.readFileSync(".next/server/pages-manifest.json", "utf8"));
const prerendered = Object.keys(JSON.parse(fs.readFileSync(".next/prerender-manifest.json", "utf8")).routes);
const targets = new Set(Object.keys(manifest).filter(route => !route.startsWith("/_") && !route.startsWith("/api/")).map(route =>
  route.includes("[") ? prerendered.find(candidate => candidate.startsWith(route.split("[")[0])) || route.replace("[id]", "1") : route));
for (const file of Object.values(manifest).filter(file => file.endsWith(".html"))) {
  const html = fs.readFileSync(path.join(".next/server", file), "utf8");
  for (const [, href] of html.matchAll(/<a\b[^>]*\bhref="(\/[^"#?]*)/g)) {
    targets.add(href || "/");
  }
}
const gates = ["booking-confirmation", "create-post", "verify", "upload-photos", "messages", "premium", "boost", "gifts", "content-feed", "creator-dashboard", "profile", "account-settings"];
let passed = 0;
let gateCount = 0;
for (const route of targets) {
  const target = new URL(route, origin);
  assert.equal(target.origin, new URL(origin).origin, "Refusing an external link: " + route);
  const response = await fetch(target, { signal: AbortSignal.timeout(10000), redirect: "manual" });
  assert.equal(response.status, route === "/404" || route === "/private/provider-draft" ? 404 : route === "/500" ? 500 : 200, route + " has unexpected status");
  const html = await response.text();
  assert.match(html, /<meta(?=[^>]*name="robots")(?=[^>]*content="noindex, nofollow")[^>]*>/, route + " lost noindex");
  if (gates.includes(route.slice(1))) {
    assert.match(html.replace(/<[^>]*>/g, " "), /noch nicht freigeschaltet/, route + " lost its action gate");
    assert.doesNotMatch(html, /<form\b/i, route + " exposes a form");
    gateCount++;
  }
  if (["/", "/contact", "/imprint", "/faq"].includes(route)) assert.doesNotMatch(html, /<form\b/i, route + " collects data");
  passed++;
}
assert.equal(gateCount, gates.length, "Incomplete action-gate coverage");
console.log(`Preview HTTP smoke: ${passed}/${targets.size} routes; ${gateCount}/${gates.length} action gates; noindex preserved.`);
