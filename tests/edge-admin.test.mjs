import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { requireEdgeAdmin } from '../supabase/functions/_shared/admin.ts';
const actualFetch=globalThis.fetch;
const token='Bearer '+'a'.repeat(180);
const request=authorization=>new Request('https://edge.invalid',{method:'POST',headers:authorization?{authorization}:{}});
test.afterEach(()=>{globalThis.fetch=actualFetch;delete globalThis.Deno});
test('Edge calls deny missing/old short tokens before network and configuration access',async()=>{
 let calls=0;globalThis.fetch=async()=>{calls++;throw Error()};
 for(const h of [undefined,'Bearer public-pilot-token'])assert.equal((await requireEdgeAdmin(request(h))).status,401);
 assert.equal(calls,0);
});
test('Edge user and role verified with user bearer; anonymous key alone never grants admin',async()=>{
 globalThis.Deno={env:{get:n=>n==='SUPABASE_URL'?'https://test.supabase.co':'synthetic-public-key'}};
 for(const [confirmed,admin,status]of [[false,true,401],[true,false,403],[true,true,null]]){
  globalThis.fetch=async(url,init)=>{assert.equal(init.headers.Authorization,token);assert.equal(init.redirect,'error');
   return Response.json(String(url).includes('/auth/')?{id:'a0000000-0000-4000-8000-000000000001',email_confirmed_at:confirmed?'2026-10-01':null}:admin?[{role:'admin'}]:[])};
  const denied=await requireEdgeAdmin(request(token));assert.equal(denied?.status??null,status);
 }
 globalThis.fetch=async()=>{throw Error('backend failure')};assert.equal((await requireEdgeAdmin(request(token))).status,503);
});
test('all eight Edge entrypoints call guard before work and require JWT verification',()=>{
 const config=fs.readFileSync('supabase/config.toml','utf8');
 const dirs=fs.readdirSync('supabase/functions').filter(v=>!v.startsWith('_'));
 assert.equal(dirs.length,8);
 for(const name of dirs){const src=fs.readFileSync('supabase/functions/'+name+'/index.ts','utf8');assert.match(src,/serve\(async \(req\) => \{\s*const denied = await requireEdgeAdmin\(req\);\s*if \(denied\) return denied;/);assert.ok(config.includes('[functions.'+name+']\nverify_jwt = true'))}
});
