import test from "node:test";
import assert from "node:assert/strict";
import { supabaseDraftDependencies } from "../src/lib/marketplace/supabase-drafts.ts";
import { createDraftService } from "../src/lib/marketplace/drafts.ts";
const owner = "00000000-0000-4000-8000-000000000001";
const id = "00000000-0000-4000-8000-000000000002";
const fields = { displayAlias: "Example", city: "Zürich", description: "Draft", photoRightsConfirmed: false };
const record = { id, owner_id: owner, state: "draft", display_alias: "Example", city: "Zürich",
  description: "Draft", photo_rights_attested: false };
const config = { url: "https://existing-project.example.invalid", publicKey: "sb_publishable_test", accessToken: "test-user-token" };
function setup(options = {}) {
  const requests = [];
  const transport = async (input, init = {}) => {
    const url = new URL(String(input)); requests.push({ url, ...init });
    if (url.pathname === "/auth/v1/user") return new Response(JSON.stringify(options.denied ? { message: "invalid JWT" } : { id: owner }),
      { status: options.denied ? 401 : 200, headers: { "Content-Type": "application/json" } });
    const payload = options.empty ? [] : [options.row ?? record];
    return new Response(JSON.stringify(init.method === "POST" ? payload[0] : payload), {
      status: options.databaseError ? 403 : 200, headers: { "Content-Type": "application/json" },
    });
  };
  const deps = supabaseDraftDependencies(config, transport);
  return { deps, service: createDraftService(deps), requests };
}
test("storage cannot be used before server verification", async () => {
  const f = setup(); await assert.rejects(f.deps.repository.create(owner, fields), /UNAUTHENTICATED/);
  assert.equal(f.requests.length, 0);
});
test("invalid session never reaches the database", async () => {
  const f = setup({ denied: true }); await assert.rejects(f.service.create(fields), /UNAUTHENTICATED/);
  assert.equal(f.requests.length, 1);
});
test("create maps fields and forwards verified user JWT, never approval fields", async () => {
  const f = setup(); assert.deepEqual(await f.service.create(fields), { id, ownerId: owner, state: "draft", ...fields });
  const request = f.requests[1]; assert.equal(request.url.pathname, "/rest/v1/marketplace_listing_drafts");
  assert.equal(new Headers(request.headers).get("Authorization"), "Bearer test-user-token");
  assert.deepEqual(JSON.parse(request.body), { owner_id: owner, display_alias: fields.displayAlias, city: fields.city,
    description: fields.description, photo_rights_attested: false });
});
test("read is constrained by id, verified owner and draft state", async () => {
  const f = setup(); await f.service.read(id);
  const query = f.requests[1].url.searchParams;
  assert.equal(query.get("id"), `eq.${id}`); assert.equal(query.get("owner_id"), `eq.${owner}`);
  assert.equal(query.get("state"), "eq.draft"); assert.doesNotMatch(query.get("select"), /\*/);
});
test("update atomically checks owner and draft state without pre-read", async () => {
  const f = setup(); await f.service.replace(id, fields);
  assert.equal(f.requests.length, 2); const request = f.requests[1]; assert.equal(request.method, "PATCH");
  assert.equal(request.url.searchParams.get("owner_id"), `eq.${owner}`);
  assert.equal(request.url.searchParams.get("state"), "eq.draft");
  assert.equal(request.url.searchParams.get("id"), `eq.${id}`);
  assert.deepEqual(Object.keys(JSON.parse(request.body)).sort(), ["display_alias", "city", "description", "photo_rights_attested"].sort());
});
test("missing or inaccessible records have the same response", async () => {
  const f = setup({ empty: true }); await assert.rejects(f.service.read(id), /NOT_FOUND/);
  await assert.rejects(f.service.replace(id, fields), /NOT_FOUND/);
});
test("foreign storage records are rejected even if RLS is misconfigured", async () => {
  const f = setup({ row: { ...record, owner_id: id } }); await assert.rejects(f.service.read(id), /STORAGE_FAILURE/);
});
test("database refusal fails closed", async () => {
  const f = setup({ databaseError: true }); await assert.rejects(f.service.create(fields), /STORAGE_FAILURE/);
});
test("reject service credentials and unsafe backend URLs", () => {
  const serviceKey = `x.${Buffer.from(JSON.stringify({ role: "service_role" })).toString("base64url")}.x`;
  for (const publicKey of [serviceKey, "sb_secret_bad", ""]) {
    assert.throws(() => supabaseDraftDependencies({ ...config, publicKey }), /INVALID_BACKEND_CONFIG/);
  }
  for (const url of ["http://example.invalid", "https://user:pass@example.invalid", "https://example.invalid/path"]) {
    assert.throws(() => supabaseDraftDependencies({ ...config, url }), /INVALID_BACKEND_CONFIG/);
  }
});
