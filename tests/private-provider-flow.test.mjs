import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { configureFixture, fixtureBackend, owner, other, stranger, origin } from "./helpers/private-draft-backend.mjs";
const require = createRequire(import.meta.url);
const session = (await require("../.next/server/pages/api/private/provider-session.js")).default;
const drafts = (await require("../.next/server/pages/api/private/provider-drafts.js")).default;
const fields = { displayAlias: "Synthetic alias", city: "Zürich", description: "Synthetic description", photoRightsConfirmed: false };
const actualFetch = globalThis.fetch; const oldEnv = { ...process.env };
let backend;
test.beforeEach(() => { configureFixture(); backend = fixtureBackend(); globalThis.fetch = backend.fetch; });
test.afterEach(() => { globalThis.fetch = actualFetch; for (const k of Object.keys(process.env)) if (!(k in oldEnv)) delete process.env[k]; Object.assign(process.env, oldEnv); });
function req(method, body, uid = owner, query = {}) { return { method, body, query, cookies: uid ? { provider_draft_session: backend.tokens.get(uid) } : {}, headers: { origin, "content-type": "application/json" } }; }
async function call(handler, request) { const res = { code: 200, headers: {}, body: null, setHeader(k,v){this.headers[k.toLowerCase()]=v;return this;},status(n){this.code=n;return this;},json(v){this.body=v;return this;} }; await handler(request,res); return res; }
test("disabled or incomplete configuration returns 404 before any backend access", async () => {
  for (const [key,value] of [["PRIVATE_PROVIDER_DRAFTS_ENABLED","false"],["PRIVATE_PROVIDER_DRAFT_USER_IDS",""],["PRIVATE_PROVIDER_DRAFT_ORIGIN","https://evil.invalid/path"]]) {
    configureFixture(); process.env[key]=value;
    assert.equal((await call(drafts,req("POST",fields))).code,404);
    assert.equal((await call(session,req("POST",{email:"owner@example.invalid",password:"synthetic-test-password"}))).code,404);
  } assert.equal(backend.calls.length,0);
});
test("sign-in uses the existing auth backend and returns only a secure server cookie", async () => {
  process.env.PRIVATE_PROVIDER_DRAFT_ORIGIN = "https://private.example.invalid";
  const r=req("POST",{email:"owner@example.invalid",password:"synthetic-test-password"},null);r.headers.origin=process.env.PRIVATE_PROVIDER_DRAFT_ORIGIN;
  const response=await call(session,r);assert.equal(response.code,200);assert.deepEqual(response.body,{userId:owner});
  const c=response.headers["set-cookie"];for(const expected of ["HttpOnly","SameSite=Strict","Secure","Path=/api/private","Max-Age=1800"])assert.ok(c.includes(expected));
  assert.ok(!JSON.stringify(response.body).includes("token"));
});
test("wrong credentials, unconfirmed and non-allowlisted accounts cannot sign in", async () => {
  for(const [email,password,unconfirmed]of [["owner@example.invalid","wrong",false],["stranger@example.invalid","synthetic-test-password",false],["owner@example.invalid","synthetic-test-password",true]]){
    backend.unconfirmed=unconfirmed;const r=await call(session,req("POST",{email,password},null));assert.equal(r.code,401);assert.match(r.headers["set-cookie"],/Max-Age=0/);
  }
});
test("missing, expired and non-allowlisted sessions cannot access drafts", async () => {
  for(const uid of [null,stranger])assert.equal((await call(drafts,req("POST",fields,uid))).code,401);
  backend.expired=true;assert.equal((await call(drafts,req("POST",fields))).code,401);
  assert.equal(backend.rows.size,0);
});
test("owner creates, reloads and edits a private draft through the compiled API", async () => {
  const created=await call(drafts,req("POST",fields));assert.equal(created.code,201);const id=created.body.draft.id;
  const loaded=await call(drafts,req("GET",undefined,owner,{id}));assert.deepEqual(loaded.body.draft,created.body.draft);
  const changed=await call(drafts,req("PUT",{id,fields:{...fields,city:"Bern"}}));assert.equal(changed.code,200);assert.equal(changed.body.draft.city,"Bern");assert.equal(backend.rows.get(id).city,"Bern");
  assert.match(changed.headers["cache-control"],/no-store/);assert.match(changed.headers["x-robots-tag"],/noindex/);
});
test("foreign, missing and locked drafts share the same not-found response", async () => {
  const created=await call(drafts,req("POST",fields));const id=created.body.draft.id;
  for(const r of [req("GET",null,other,{id}),req("PUT",{id,fields},other),req("GET",null,owner,{id:"aaaaaaaa-aaaa-4aaa-8aaa-999999999999"})]){const out=await call(drafts,r);assert.equal(out.code,404);assert.deepEqual(out.body,{error:"NOT_FOUND"});}
  backend.rows.get(id).state="submitted";assert.equal((await call(drafts,req("PUT",{id,fields}))).code,404);
});
test("ownership/state injection, invalid IDs, arrays and extra fields are rejected", async () => {
  for(const b of [{...fields,ownerId:other},{...fields,state:"approved"},{...fields,description:"x".repeat(1001)},[]])assert.equal((await call(drafts,req("POST",b))).code,400);
  assert.equal((await call(drafts,req("PUT",{id:"bad",fields}))).code,400);
  assert.equal((await call(drafts,req("GET",null,owner,{id:["bad","bad"]}))).code,400);
  assert.equal(backend.rows.size,0);
});
test("cross-origin and unsupported requests fail before backend access", async () => {
  for(const r of [ {...req("POST",fields),headers:{origin:"https://evil.invalid","content-type":"application/json"}}, {...req("POST",fields),headers:{origin,"content-type":"text/plain"}},req("DELETE",null)])assert.ok([403,415,405].includes((await call(drafts,r)).code));
  assert.equal(backend.calls.length,0);
});
test("storage failures are sanitized and never reported as saved", async () => {
  backend.failStorage=true;const r=await call(drafts,req("POST",fields));assert.equal(r.code,503);assert.deepEqual(r.body,{error:"STORAGE_FAILURE"});
});
test("logout clears the cookie and invokes only local session sign-out", async () => {
  const r=await call(session,req("DELETE"));assert.equal(r.code,200);assert.match(r.headers["set-cookie"],/Max-Age=0/);assert.ok(backend.calls.some(c=>c.path==="/auth/v1/logout"&&c.query==="?scope=local"));
  assert.equal((await call(session,req("GET"))).code,401);
});

test("public-key validation refuses service credentials and headers cannot replace the cookie", async () => {
  const r=req("POST",fields,null);r.headers.authorization="Bearer "+backend.tokens.get(owner);assert.equal((await call(drafts,r)).code,401);
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY="sb_secret_synthetic_rejected";
  assert.equal((await call(drafts,req("POST",fields))).code,503);assert.equal(backend.calls.length,0);
});
test("session errors, logout failure and text payloads never expose secrets or saved status", async () => {
  const r=req("POST",fields);r.headers["sec-fetch-site"]="cross-site";assert.equal((await call(drafts,r)).code,403);
  assert.equal((await call(session,req("POST",{email:"owner@example.invalid",password:"synthetic-test-password",ownerId:other},null))).code,400);
  globalThis.fetch=async()=>{throw Error("synthetic upstream detail")};
  const out=await call(session,req("DELETE"));assert.equal(out.code,503);assert.deepEqual(out.body,{error:"SIGNED_OUT_LOCALLY"});assert.match(out.headers["set-cookie"],/Max-Age=0/);
});
test("login attempt backstop stops outbound requests when exhausted", async () => {
  let limited=false;
  for(let i=0;i<22;i++){
    const before=backend.calls.length;
    const out=await call(session,req("POST",{email:"owner@example.invalid",password:"wrong"},null));
    if(out.code===429){assert.equal(backend.calls.length,before);limited=true;break}
  }
  assert.ok(limited);
});
