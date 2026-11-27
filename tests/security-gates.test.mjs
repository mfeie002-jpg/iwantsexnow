import assert from "node:assert/strict";
import test from "node:test";

const BASE = (process.env.IWSN_TEST_BASE_URL || "http://127.0.0.1:3131").replace(/\/$/, "");

async function post(path, payload) {
  const res = await fetch(BASE + path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(15000)
  });
  return { status: res.status, data: await res.json() };
}

test("Public metrics cannot expose administrative or owner content", async () => {
  const res = await fetch(BASE + "/api/vault/metrics", { signal: AbortSignal.timeout(15000) });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.notEqual(data.isAdmin, true);
  assert.notEqual(data.isOwner, true);
  assert.equal(Array.isArray(data.enquiries), true);
  assert.equal(data.enquiries.length, 0);
  assert.equal("takedowns" in data, false);
  const serialized = JSON.stringify(data);
  assert.equal(serialized.includes("ownerToken"), false);
  assert.equal(serialized.includes("lastReport"), false);
});

test("Former hard-coded PIN must not grant administrative access", async () => {
  const res = await fetch(BASE + "/api/vault/metrics", {
    headers: { "x-admin-pin": "SWISS-BOSS-2026" }
  });
  assert.equal(res.status, 200);
  const data = await res.json();
  assert.notEqual(data.isAdmin, true);
  assert.equal("takedowns" in data, false);
});

test("Query-string credentials never grant owner/admin access", async () => {
  const res = await fetch(BASE + "/api/vault/metrics?profileId=not-real&token=public&adminPin=SWISS-BOSS-2026");
  const data = await res.json();
  assert.equal(res.status, 200);
  assert.notEqual(data.isOwner, true);
  assert.notEqual(data.isAdmin, true);
});

test("Anonymous legacy claim cannot create or reveal ownership token", async () => {
  const { status, data } = await post("/api/vault/metrics", {
    action: "login_or_claim", query: "test-nobody"
  });
  assert.equal(status, 403);
  assert.equal(data.ok, false);
  assert.equal("ownerToken" in data, false);
});

test("Anonymous direct profile changes are refused", async () => {
  const { status, data } = await post("/api/vault/metrics", {
    action: "update_profile_fields", profileId: "test-not-an-existing-profile",
    updates: { identityVerified: true, displayName: "FAKE" }
  });
  assert.equal(status, 403);
  assert.equal(data.ok, false);
});

test("Legacy self-registration cannot publish fabricated profile", async () => {
  const { status, data } = await post("/api/claims/create", {
    action: "self_register", displayName: "Security Test",
    city: "Test", phone: "079 000 00 00"
  });
  assert.equal(status, 503);
  assert.equal(data.ok, false);
});

test("Client-supplied payment receipt cannot unlock anything", async () => {
  const { status, data } = await post("/api/vault/unlock", {
    profileId: "test-not-an-existing-profile", amountChf: 499,
    transactionId: "FAKE_PAYMENT", orderType: "boost"
  });
  assert.equal(status, 503);
  assert.equal(data.ok, false);
});

test("Incomplete anonymous reports cannot create a case", async () => {
  const { status, data } = await post("/api/vault/metrics", {
    action: "submit_takedown", profileId: "test-not-an-existing-profile",
    reason: "x"
  });
  assert.equal(status, 400);
  assert.equal(data.ok, false);
  assert.equal("caseId" in data, false);
});

test("Report page cannot promise removal before confirmation", async () => {
  const res = await fetch(BASE + "/report");
  assert.equal(res.status, 200);
  const html = await res.text();
  assert.equal(html.includes("Eintrag jetzt sofort ausblenden & sperren"), false);
  assert.equal(html.includes("Vertrauliche Meldung einreichen"), true);
});
