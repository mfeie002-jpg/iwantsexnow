// Explicitly invoked in the existing Softgen runtime only. Never a default CI test.
// Fixture contains two temporary synthetic app identities, not real user accounts.
import fs from "node:fs/promises";
import assert from "node:assert/strict";
import { createClient } from "@supabase/supabase-js";
import { createDraftService } from "../src/lib/marketplace/drafts.ts";
import { supabaseDraftDependencies } from "../src/lib/marketplace/supabase-drafts.ts";

assert.equal(process.env.MARKETPLACE_DRAFT_LIVE, "1", "Explicit live-test opt-in required");
const fixturePath = process.env.MARKETPLACE_DRAFT_FIXTURE;
assert(fixturePath?.startsWith("/tmp/"), "Use a temporary runtime fixture");
const fixture = JSON.parse(await fs.readFile(fixturePath, "utf8"));
const envFile = await fs.readFile(".env.local", "utf8");
const managed = Object.fromEntries(envFile.split(/\r?\n/).flatMap(line => {
  const match = line.match(/^(NEXT_PUBLIC_SUPABASE_URL|NEXT_PUBLIC_SUPABASE_ANON_KEY)=(.*)$/);
  return match ? [[match[1], match[2].trim().replace(/^(["'])(.*)\1$/, "$2")]] : [];
}));
const url = managed.NEXT_PUBLIC_SUPABASE_URL;
const publicKey = managed.NEXT_PUBLIC_SUPABASE_ANON_KEY;
assert(url && publicKey, "Managed runtime configuration missing");
assert(/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(url), "Expected the platform-managed project URL");
const authOptions = { auth: { persistSession: false, autoRefreshToken: false, detectSessionInUrl: false } };
const first = createClient(url, publicKey, authOptions);
const second = createClient(url, publicKey, authOptions);
const anonymous = createClient(url, publicKey, authOptions);
const checks = [];
const created = [];
try {
  assert(fixture.ownerEmail.endsWith("@example.invalid") && fixture.otherEmail.endsWith("@example.invalid"));
  const a = await first.auth.signInWithPassword({ email: fixture.ownerEmail, password: fixture.password });
  const b = await second.auth.signInWithPassword({ email: fixture.otherEmail, password: fixture.password });
  if (a.error || b.error || !a.data.session || !b.data.session) throw new Error("Synthetic session sign-in failed");
  assert.equal(a.data.user.id, fixture.ownerId); assert.equal(b.data.user.id, fixture.otherId);
  checks.push("two real synthetic sessions established");
  const owner = createDraftService(supabaseDraftDependencies({ url, publicKey, accessToken: a.data.session.access_token }));
  const other = createDraftService(supabaseDraftDependencies({ url, publicKey, accessToken: b.data.session.access_token }));
  const input = { displayAlias: "Synthetic SDK test", city: "Zürich", description: "Synthetic storage acceptance", photoRightsConfirmed: false };
  const draft = await owner.create(input); created.push(draft.id);
  assert.deepEqual(await owner.read(draft.id), draft); checks.push("owner draft persists across requests");
  await owner.replace(draft.id, { ...input, description: "Updated synthetic acceptance" });
  assert.equal((await owner.read(draft.id)).description, "Updated synthetic acceptance");
  checks.push("owner update persists across requests");
  await assert.rejects(other.read(draft.id), error => error.code === "NOT_FOUND");
  await assert.rejects(other.replace(draft.id, input), error => error.code === "NOT_FOUND");
  checks.push("other authenticated user cannot read or modify draft");
  const spoof = await second.from("marketplace_listing_drafts").insert({ owner_id: fixture.ownerId, display_alias: "Spoof", city: "Zürich" });
  assert.equal(spoof.error?.code, "42501"); checks.push("direct owner spoof denied by database");
  for (const payload of [{ state: "approved" }, { owner_id: fixture.otherId }]) {
    const result = await first.from("marketplace_listing_drafts").update(payload).eq("id", draft.id);
    assert.equal(result.error?.code, "42501");
  }
  checks.push("direct approval and ownership changes denied by database");
  const anonRead = await anonymous.from("marketplace_listing_drafts").select("id,display_alias");
  const anonWrite = await anonymous.from("marketplace_listing_drafts").insert({ owner_id: fixture.ownerId, display_alias: "Anon", city: "Zürich" });
  assert.equal(anonRead.error?.code, "42501"); assert.equal(anonWrite.error?.code, "42501");
  checks.push("anonymous direct read and insert denied");
  console.log(JSON.stringify({ status: "PASS", checks, createdDraftIds: created }));
} finally {
  await Promise.allSettled([first.auth.signOut(), second.auth.signOut()]);
  await fs.unlink(fixturePath).catch(() => {});
}
// Retire the synthetic accounts and draft through the managed SQL console after
// the run. Do not grant user-level DELETE or expose an administrative cleanup API.
