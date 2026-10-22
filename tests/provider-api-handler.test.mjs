import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const names = ["session", "provider-status"];
const handlers = Object.fromEntries(names.map(name => [name, require("../.next/server/pages/api/marketplace/" + name + ".js").default]));
const token = "a".repeat(80) + "." + "b".repeat(80) + "." + "c".repeat(80);
const user = { id: "cfb85629-8e50-42f4-a6f1-f504850fd735", role: "authenticated", is_anonymous: false, email_confirmed_at: "2026-01-01T00:00:00Z" };
const saved = { ...process.env };
const actualFetch = globalThis.fetch;
function req(extra = {}) { return { method: "GET", query: {}, headers: { authorization: "Bearer " + token }, ...extra }; }
function res() { return { code: 200, body: null, headers: {}, setHeader(k,v){this.headers[k.toLowerCase()]=v;return this;}, status(c){this.code=c;return this;}, json(b){this.body=b;return this;} }; }
function json(body,status=200) { return new Response(JSON.stringify(body),{status}); }
test.after(() => {
  globalThis.fetch = actualFetch;
  for (const key of ["NEXT_PUBLIC_SUPABASE_URL","NEXT_PUBLIC_SUPABASE_ANON_KEY","MARKETPLACE_PUBLISH_ENABLED"]) {
    if (saved[key] === undefined) delete process.env[key]; else process.env[key] = saved[key];
  }
});
for (const name of names) {
  async function run(request, upstream = () => json(user), setup = () => {}) {
    process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-public-key";
    setup();
    const calls = [];
    globalThis.fetch = async (url,init) => { calls.push({url:String(url),init}); return upstream(url,init); };
    const response = res();
    await handlers[name](request,response);
    assert.equal(response.headers["cache-control"],"private, no-store, max-age=0");
    assert.equal(response.headers.vary,"Authorization");
    assert.equal(response.headers["x-robots-tag"],"noindex, nofollow");
    assert(!JSON.stringify(response.body).includes(token));
    return { response,calls };
  }
  test(name + ": only GET; writes never reach Auth", async () => {
    for (const method of ["POST","PUT","PATCH","DELETE","OPTIONS","HEAD"]) {
      const {response,calls}=await run(req({method,body:{state:"approved"}}));
      assert.equal(response.code,405); assert.equal(response.headers.allow,"GET"); assert.equal(calls.length,0);
    }
  });
  test(name + ": no cookie, browser identity or public key substitutes", async () => {
    for (const headers of [{},{cookie:"session=forged"},{authorization:"Bearer short"},{authorization:["Bearer "+token]}]) {
      const {response,calls}=await run(req({headers}));
      assert.equal(response.code,401); assert.equal(calls.length,0);
    }
  });
  test(name + ": rejects caller owner, evidence and listing parameters", async () => {
    for (const extra of [{query:{ownerId:user.id}},{query:{listingId:"other"}},{body:{proof:{identityVerifiedAt:"2026-01-01"}}}]) {
      const {response,calls}=await run(req(extra)); assert.equal(response.code,400); assert.equal(calls.length,0);
    }
  });
  test(name + ": configuration fails closed without outbound fetch", async () => {
    for (const url of ["","http://example.supabase.co","https://u:p@example.supabase.co","https://example.supabase.co/path","https://example.supabase.co/?x=1","https://example.supabase.co/#secret"]) {
      const {response,calls}=await run(req(),undefined,()=>{process.env.NEXT_PUBLIC_SUPABASE_URL=url;});
      assert.equal(response.code,503); assert.equal(calls.length,0);
    }
    const {response,calls}=await run(req(),undefined,()=>{delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;});
    assert.equal(response.code,503); assert.equal(calls.length,0);
  });
  test(name + ": expired, revoked or anonymous-key bearer denied by Auth", async () => {
    for (const code of [401,403]) {
      const {response,calls}=await run(req(),()=>json({message:"secret upstream diagnostic"},code));
      assert.equal(response.code,401); assert.equal(calls.length,1);
      assert(!JSON.stringify(response.body).includes("diagnostic"));
    }
  });
  test(name + ": anonymous, service role and malformed subjects denied", async () => {
    for (const payload of [{...user,is_anonymous:true},{...user,is_anonymous:undefined},{...user,role:"service_role"},{...user,id:"not-a-uuid"},{...user,role:undefined}]) {
      const {response,calls}=await run(req(),()=>json(payload)); assert.equal(response.code,401); assert.equal(calls.length,1);
    }
  });
  test(name + ": outages, redirects and malformed responses fail safely", async () => {
    for (const upstream of [()=>json({},500),()=>{throw Error("credential in upstream error");},()=>new Response("invalid json"),()=>json(null),()=>json([]),()=>json({},302)]) {
      const {response,calls}=await run(req(),upstream); assert.equal(response.code,503); assert.equal(calls.length,1);
      assert.deepEqual(response.body,{error:"Authentication unavailable"});
    }
  });
  test(name + ": verified session uses only Auth GET and minimal projection", async () => {
    const {response,calls}=await run(req(),()=>json({...user,email:"private@example.invalid",user_metadata:{role:"admin",age_verified:true}}));
    assert.equal(response.code,200); assert.equal(calls.length,1);
    const call=calls[0]; assert.equal(call.url,"https://example.supabase.co/auth/v1/user");
    assert.equal(call.init.method,"GET"); assert.equal(call.init.redirect,"error"); assert.equal(call.init.cache,"no-store");
    assert.equal(call.init.headers.Authorization,"Bearer "+token); assert.equal(call.init.headers.apikey,"test-public-key");
    assert(call.init.signal instanceof AbortSignal);
    assert(!JSON.stringify(response.body).includes("private@example"));
    if(name==="session") assert.deepEqual(response.body,{authenticated:true,subject:user.id,emailConfirmed:true});
    else { assert.equal(response.body.onboarding.canSubmit,false); assert.equal(response.body.publication.eligible,false); }
  });
  test(name + ": email confirmation never means verified adult/provider", async () => {
    for (const email_confirmed_at of [null,"not-a-date","2999-01-01T00:00:00Z"]) {
      const {response}=await run(req(),()=>json({...user,email_confirmed_at,user_metadata:{email_confirmed:true,age_verified:true}}));
      assert.equal(response.code,200);
      if(name==="session") assert.equal(response.body.emailConfirmed,false);
      else { assert(response.body.onboarding.blockers.includes("email_confirmation_required")); assert.equal(response.body.publication.eligible,false); }
    }
  });
}
test("provider status: env cannot activate collection or publication",async()=>{
  process.env.MARKETPLACE_PUBLISH_ENABLED="true";
  globalThis.fetch=async()=>json(user);
  const response=res(); await handlers["provider-status"](req(),response);
  assert.equal(response.code,200); assert.equal(response.body.mode,"demo");
  assert.equal(response.body.onboarding.canSubmit,false); assert.equal(response.body.publication.eligible,false);
  assert(response.body.onboarding.blockers.includes("identity_age_and_consent_unverified"));
});
