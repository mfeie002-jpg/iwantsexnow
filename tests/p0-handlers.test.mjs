import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';
const require=createRequire(import.meta.url);
const handler=path=>require('../.next/server/pages/api/'+path+'.js').default;
const metrics=handler('vault/metrics'),search=handler('vault/search');
const admins=[handler('admin/overview'),handler('indexer/import')];
const retired=[handler('claims/create'),handler('enquiries/create')];
const response=()=>({code:200,body:null,headers:{},setHeader(k,v){this.headers[k.toLowerCase()]=v;return this},status(n){this.code=n;return this},json(v){this.body=v;return this}});
async function call(h,method='POST',body={},headers={},query={}){const res=response();await h({method,body,headers,query,cookies:{}},res);return res}
const originalFetch=globalThis.fetch,oldEnv={...process.env};
test.afterEach(()=>{globalThis.fetch=originalFetch;for(const k of Object.keys(process.env))if(!(k in oldEnv))delete process.env[k];Object.assign(process.env,oldEnv)});
test('public states never hydrate old owner keys or reports, including after module/instance reload',async()=>{
 for(let i=0;i<2;i++){
  const r=await call(metrics,'GET');assert.equal(r.code,200);assert.deepEqual(r.body.states,{});assert.deepEqual(r.body.metrics,{});assert.match(r.headers['cache-control'],/no-store/);
 }
 const script=`const h=require('./.next/server/pages/api/vault/metrics.js').default;h({method:'GET'},{setHeader(){},status(){return this},json(v){process.stdout.write(JSON.stringify(v))}})`;
 const other=JSON.parse(execFileSync(process.execPath,['-e',script],{encoding:'utf8'}));assert.deepEqual(other.states,{});
});
test('every legacy write, old published token and unknown action is rejected without an upstream write',async()=>{
 let outbound=0;globalThis.fetch=async()=>{outbound++;throw Error('unexpected outbound')};
 for(const action of ['claim_or_create_profile','update_profile_fields','confirm_availability_4h','update_profile_state','resolve_case','report_or_optout','track_view','track_contact']){
  for(const ownerToken of [undefined,'previously-public-token']){
   const r=await call(metrics,'POST',{action,profileId:'ch-1',ownerToken,identityVerified:true});assert.equal(r.code,410);assert.equal(r.body.ok,false);assert.ok(!('state' in r.body));
  }
 }
 for(const body of [null,{},[],{action:'unknown'}])assert.equal((await call(metrics,'POST',body)).code,400);
 for(const h of retired){assert.equal((await call(h)).code,410);assert.equal((await call(h,'GET')).code,405)}
 assert.equal(outbound,0);
});
test('anonymous, short token and PIN cannot read admin/import data',async()=>{
 for(const h of admins)for(const headers of [{},{authorization:'Bearer published-token'},{'x-admin-pin':'1234'}]){
  const r=await call(h,'GET',{},headers);assert.equal(r.code,401);assert.equal(r.body.ok,false);
 }
});
test('server verifies session and role; provider and unconfirmed identities cannot escalate; admin import stays disabled',async()=>{
 process.env.NEXT_PUBLIC_SUPABASE_URL='https://test.supabase.co';process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY='sb_publishable_synthetic';
 const headers={authorization:'Bearer '+'a'.repeat(180)};
 for(const [authStatus,confirmed,admin,expected]of [[401,false,false,401],[200,false,true,401],[200,true,false,403],[200,true,true,503]]){
  let count=0;globalThis.fetch=async(url,init)=>{count++;assert.equal(init.redirect,'error');assert.ok(!['POST','PATCH','DELETE'].includes(init.method));
   return new Response(JSON.stringify(String(url).includes('/auth/')?{id:'a0000000-0000-4000-8000-000000000001',email_confirmed_at:confirmed?'2026-10-01T00:00:00Z':null}:admin?[{role:'admin'}]:[]),{status:count===1?authStatus:200});};
  const r=await call(admins[1],'POST',{offers:[{identityVerified:true}]},headers);assert.equal(r.code,expected);assert.equal(r.body.ok,false);
 }
});
test('search handler enforces GET, one contract, finite pagination and no private fields',async()=>{
 const r=await call(search,'GET',{}, {},{page:'1',limit:'48'});assert.equal(r.code,200);assert.deepEqual(r.body.results,[]);assert.equal(r.body.totalMatches,0);
 assert.equal((await call(search,'GET',{}, {},{limit:'NaN'})).code,400);
 assert.equal((await call(search,'POST')).code,405);
});
