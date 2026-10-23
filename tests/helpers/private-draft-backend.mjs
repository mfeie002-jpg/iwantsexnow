// Synthetic transport fixture only; never contacts a real backend.
export const owner = "11111111-1111-4111-8111-111111111111";
export const other = "22222222-2222-4222-8222-222222222222";
export const stranger = "33333333-3333-4333-8333-333333333333";
export const origin = "http://127.0.0.1:43128";
export function fixtureBackend() {
  const rows = new Map(); const calls = []; let nextId = 0;
  const revoked = new Set();
  const tokens = new Map();
  for (const [email, id] of [["owner@example.invalid", owner], ["other@example.invalid", other], ["stranger@example.invalid", stranger]]) {
    tokens.set(id, Buffer.from(JSON.stringify({ alg: "HS256" })).toString("base64url") + "." + Buffer.from(JSON.stringify({ sub: id, exp: Math.floor(Date.now()/1000)+3600 })).toString("base64url") + ".synthetic-signature");
  }
  const json = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
  const backend = { rows, calls, tokens, failStorage: false, expired: false, unconfirmed: false,
    async fetch(input, init) {
      const request = new Request(input, init); const url = new URL(request.url);
      if (url.origin !== "https://draft-fixture.invalid") throw Error("Fixture refuses external network");
      const body = request.method === "GET" ? null : await request.text();
      calls.push({ path: url.pathname, method: request.method, query: url.search, body });
      const token = request.headers.get("authorization")?.replace(/^Bearer /, "");
      const id = [...tokens].find(([, value]) => value === token)?.[0];
      const user = uid => ({ id: uid, aud: "authenticated", role: "authenticated", email: "synthetic@example.invalid", email_confirmed_at: backend.unconfirmed ? null : "2026-01-01T00:00:00Z" });
      if (url.pathname === "/auth/v1/token") {
        const value = JSON.parse(body); const uid = { "owner@example.invalid": owner, "other@example.invalid": other, "stranger@example.invalid": stranger }[value.email];
        if (!uid || value.password !== "synthetic-test-password") return json({ message: "Invalid login credentials" }, 400);
        revoked.delete(tokens.get(uid));
        return json({ access_token: tokens.get(uid), token_type: "bearer", expires_in: 3600, refresh_token: "synthetic-refresh-never-returned", user: user(uid) });
      }
      if (url.pathname === "/auth/v1/logout") { revoked.add(token); return new Response(null, { status: 204 }); }
      if (url.pathname === "/auth/v1/user") return id && !revoked.has(token) && !backend.expired ? json(user(id)) : json({ message: "Invalid session" }, 401);
      if (url.pathname !== "/rest/v1/marketplace_listing_drafts") throw Error("Unexpected fixture call");
      if (!id || revoked.has(token)) return json({ message: "denied" }, 401);
      if (backend.failStorage) return json({ message: "private upstream detail must never escape" }, 500);
      if (request.method === "POST") {
        const v = JSON.parse(body); if (v.owner_id !== id) return json({ message: "RLS denied" }, 403);
        const row = { ...v, id: `aaaaaaaa-aaaa-4aaa-8aaa-${String(++nextId).padStart(12,"0")}`, state: "draft" };
        rows.set(row.id, row); return json(row, 201);
      }
      const selected = [...rows.values()].filter(row => row.owner_id === id && row.id === url.searchParams.get("id")?.slice(3) && row.owner_id === url.searchParams.get("owner_id")?.slice(3) && row.state === "draft" && url.searchParams.get("state") === "eq.draft");
      if (request.method === "PATCH") for (const row of selected) Object.assign(row, JSON.parse(body));
      return json(selected);
    }
  }; return backend;
}
export function configureFixture() {
  process.env.PRIVATE_PROVIDER_DRAFTS_ENABLED = "true";
  process.env.PRIVATE_PROVIDER_DRAFT_ORIGIN = origin;
  process.env.PRIVATE_PROVIDER_DRAFT_USER_IDS = owner + "," + other;
  process.env.NEXT_PUBLIC_SUPABASE_URL = "https://draft-fixture.invalid";
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "sb_publishable_synthetic_fixture";
}
