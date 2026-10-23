import test from "node:test";
import assert from "node:assert/strict";
import { createDraftService } from "../src/lib/marketplace/drafts.ts";
const alice = "00000000-0000-4000-8000-000000000001";
const bob = "00000000-0000-4000-8000-000000000002";
const id = "00000000-0000-4000-8000-000000000003";
const input = { displayAlias: " Example ", city: " Zürich ", description: "", photoRightsConfirmed: false };
function fixture() {
  let actor = alice, record = null, writes = 0;
  const repository = {
    async create(ownerId, fields) { writes++; record = { id, ownerId, state: "draft", ...fields }; return record; },
    async readOwn(key, ownerId) { return record?.id === key && record.ownerId === ownerId ? record : null; },
    async replaceOwnDraft(key, ownerId, fields) {
      if (record?.id !== key || record.ownerId !== ownerId || record.state !== "draft") return null;
      writes++; record = { ...record, ...fields }; return record;
    },
  };
  const service = createDraftService({ resolveUser: async () => actor ? { id: actor } : null, repository });
  return { service, repository, actor: v => { actor = v; }, record: v => { record = v; }, writes: () => writes };
}
const rejects = (promise, code) => assert.rejects(promise, error => error.message === code && error.code === code);
test("verified owner creates, reads and edits a private draft", async () => {
  const f = fixture(); const draft = await f.service.create(input);
  assert.equal(draft.ownerId, alice); assert.equal(draft.displayAlias, "Example");
  assert.equal(draft.state, "draft"); assert.equal(draft.photoRightsConfirmed, false);
  assert.deepEqual(await f.service.read(id), draft);
  assert.equal((await f.service.replace(id, { ...input, description: "Draft description" })).description, "Draft description");
});
test("anonymous actor cannot read or write", async () => {
  const f = fixture(); f.actor(null);
  await rejects(f.service.create(input), "UNAUTHENTICATED");
  await rejects(f.service.read(id), "UNAUTHENTICATED");
  await rejects(f.service.replace(id, input), "UNAUTHENTICATED"); assert.equal(f.writes(), 0);
});
test("another user cannot read or modify a draft", async () => {
  const f = fixture(); await f.service.create(input); f.actor(bob);
  await rejects(f.service.read(id), "NOT_FOUND"); await rejects(f.service.replace(id, input), "NOT_FOUND");
  await rejects(f.service.read("00000000-0000-4000-8000-000000000004"), "NOT_FOUND");
  assert.equal(f.writes(), 1);
});
for (const key of ["ownerId", "id", "state", "proof", "moderation", "consentVersion", "consentAt", "is_live"]) {
  test(`reject client-controlled ${key}`, async () => {
    const f = fixture(); await rejects(f.service.create({ ...input, [key]: "spoofed" }), "INVALID_INPUT");
    await rejects(f.service.replace(id, { ...input, [key]: "spoofed" }), "INVALID_INPUT"); assert.equal(f.writes(), 0);
  });
}
for (const state of ["submitted", "approved", "rejected"]) {
  test(`cannot overwrite ${state} listing`, async () => {
    const f = fixture(); const draft = await f.service.create(input); f.record({ ...draft, state });
    await rejects(f.service.replace(id, input), "NOT_FOUND"); assert.equal(f.writes(), 1);
  });
}
test("invalid input never reaches storage", async () => {
  const f = fixture();
  for (const bad of [null, [], {}, { ...input, city: " " }, { ...input, displayAlias: "x".repeat(81) },
    { ...input, description: "x".repeat(1001) }, { ...input, photoRightsConfirmed: "true" }, { ...input, city: "x\u0000" }]) {
    await rejects(f.service.create(bad), "INVALID_INPUT");
  }
  await rejects(f.service.read("not-a-uuid"), "INVALID_INPUT"); assert.equal(f.writes(), 0);
});
test("storage errors expose no secrets or record contents", async () => {
  const f = fixture(); f.repository.create = async () => { throw new Error("private token or database details"); };
  await rejects(f.service.create(input), "STORAGE_FAILURE");
});
test("faulty storage cannot leak foreign rows or internal columns", async () => {
  const f = fixture(); const draft = await f.service.create(input);
  f.repository.readOwn = async () => ({ ...draft, ownerId: bob });
  await rejects(f.service.read(id), "STORAGE_FAILURE");
  f.repository.readOwn = async () => ({ ...draft, identityDocument: "private", email: "private" });
  assert.deepEqual(Object.keys(await f.service.read(id)).sort(), ["id", "ownerId", "state", ...Object.keys(input)].sort());
});
test("session verification failures fail closed", async () => {
  const f = fixture(); const service = createDraftService({ repository: f.repository,
    resolveUser: async () => { throw new Error("JWT details"); } });
  await rejects(service.create(input), "UNAUTHENTICATED"); assert.equal(f.writes(), 0);
});
