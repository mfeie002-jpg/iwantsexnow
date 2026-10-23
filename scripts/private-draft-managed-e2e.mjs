// Opt-in real-backend acceptance in a throwaway checkout on the existing managed host.
// Reads only existing public backend configuration. Never enables the production process.
import fs from 'node:fs/promises';
import http from 'node:http';
import next from 'next';
import { spawn } from 'node:child_process';
import assert from 'node:assert/strict';
const run=process.env.PRIVATE_DRAFT_MANAGED_E2E;
assert.equal(run,'1','Explicit managed acceptance opt-in required');
const fixturePath=process.env.PRIVATE_DRAFT_MANAGED_FIXTURE;
assert(fixturePath?.startsWith('/tmp/'),'Temporary fixture required');
assert(process.cwd().startsWith('/tmp/'),'Run only in a throwaway checkout, never /app');
const fixture=JSON.parse(await fs.readFile(fixturePath,'utf8'));
assert(fixture.users.length===3&&fixture.users.every(u=>u.email.endsWith('@example.invalid')));
const file=await fs.readFile('/app/.env.local','utf8');
for(const key of ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY']){
 const line=file.split(/\r?\n/).find(l=>l.startsWith(key+'='));assert(line,'Existing managed configuration required');
 process.env[key]=line.slice(key.length+1).trim().replace(/^(["'])(.*)\1$/,'$2');
}
assert(/^https:\/\/[a-z0-9]+\.supabase\.co\/?$/.test(process.env.NEXT_PUBLIC_SUPABASE_URL));
const port=43129,origin=`http://127.0.0.1:${port}`;
delete process.env.PRIVATE_PROVIDER_DRAFTS_ENABLED;
delete process.env.PRIVATE_PROVIDER_DRAFT_USER_IDS;
delete process.env.PRIVATE_PROVIDER_DRAFT_ORIGIN;
const buildLog=await fs.open('/tmp/private-managed-build.log','w',0o600);
const build=spawn(process.execPath,['node_modules/next/dist/bin/next','build'],{env:process.env,stdio:['ignore',buildLog.fd,buildLog.fd]});
await new Promise((resolve,reject)=>{build.once('exit',c=>c===0?resolve():reject(Error('Isolated build failed; inspect private-managed-build.log')));build.once('error',reject)});
await buildLog.close();
process.env.PRIVATE_PROVIDER_DRAFTS_ENABLED='true';
process.env.PRIVATE_PROVIDER_DRAFT_ORIGIN=origin;
process.env.PRIVATE_PROVIDER_DRAFT_USER_IDS=fixture.users.slice(0,2).map(u=>u.id).join(',');
const app=next({dev:false,hostname:'127.0.0.1',port});await app.prepare();
const server=http.createServer(app.getRequestHandler());await new Promise(resolve=>server.listen(port,'127.0.0.1',resolve));
const createdDraftIds=[],checks=[],cookies=[];
async function call(path,method='GET',body,cookie=''){
 return fetch(origin+path,{method,headers:{Origin:origin,'Content-Type':'application/json',...(cookie?{Cookie:cookie}:{})},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(25000)});
}
const session='/api/private/provider-session',drafts='/api/private/provider-drafts';
try{
 const page=await call('/private/provider-draft');assert.equal(page.status,200);assert.match(page.headers.get('x-robots-tag'),/noindex/);checks.push('isolated editor available on loopback only with noindex');
 assert.equal((await call(drafts,'POST',{})).status,401);
 for(const u of fixture.users.slice(0,2)){
  const r=await call(session,'POST',{email:u.email,password:fixture.password});assert.equal(r.status,200,'Managed sign-in failed');assert.deepEqual(await r.json(),{userId:u.id});
  const raw=r.headers.get('set-cookie');assert.match(raw,/HttpOnly/);assert.match(raw,/SameSite=Strict/);assert.match(raw,/Max-Age=1800/);cookies.push(raw.split(';')[0]);
 }
 checks.push('two real managed Auth sessions via compiled cookie API');
 const excluded=await call(session,'POST',{email:fixture.users[2].email,password:fixture.password});assert.equal(excluded.status,401);checks.push('real non-allowlisted account denied');
 const fields={displayAlias:'Synthetic managed HTTP acceptance 20261024',city:'Zürich',description:'Synthetic data only',photoRightsConfirmed:false};
 let r=await call(drafts,'POST',fields,cookies[0]);assert.equal(r.status,201);const record=(await r.json()).draft;createdDraftIds.push(record.id);
 r=await call(drafts+'?id='+record.id,'GET',undefined,cookies[0]);assert.equal(r.status,200);assert.deepEqual((await r.json()).draft,record);
 r=await call(drafts,'PUT',{id:record.id,fields:{...fields,city:'Bern'}},cookies[0]);assert.equal(r.status,200);
 r=await call(drafts+'?id='+record.id,'GET',undefined,cookies[0]);assert.equal((await r.json()).draft.city,'Bern');checks.push('owner create/read/edit persists through real SDK and database across HTTP requests');
 assert.equal((await call(drafts+'?id='+record.id,'GET',undefined,cookies[1])).status,404);
 assert.equal((await call(drafts,'PUT',{id:record.id,fields},cookies[1])).status,404);checks.push('second real account cannot read or edit owner draft');
 assert.equal((await call(drafts,'POST',{...fields,ownerId:fixture.users[1].id},cookies[0])).status,400);
 assert.equal((await call(drafts,'POST',{...fields,state:'approved'},cookies[0])).status,400);checks.push('ownership and approval spoofing denied at HTTP boundary');
 const csrf=await fetch(origin+drafts,{method:'POST',headers:{Origin:'https://evil.invalid','Content-Type':'application/json',Cookie:cookies[0]},body:JSON.stringify(fields)});assert.equal(csrf.status,403);checks.push('cross-origin write denied');
 r=await call(session,'DELETE',undefined,cookies[0]);assert.equal(r.status,200);assert.match(r.headers.get('set-cookie'),/Max-Age=0/);
 assert.equal((await call(drafts+'?id='+record.id)).status,401);checks.push('logout clears browser cookie and no-cookie read is denied');
 const replay=await call(drafts+'?id='+record.id,'GET',undefined,cookies[0]);
 checks.push('captured pre-logout cookie replay status '+replay.status+' (vendor JWT lifetime checked separately)');
 const receipt={status:'PASS',backend:'existing platform-managed resource; no replacement',listener:origin,checks,createdDraftIds,fixtureUserIds:fixture.users.map(u=>u.id)};
 await fs.writeFile('/tmp/private-managed-e2e-receipt.json',JSON.stringify(receipt,null,2),{mode:0o600});console.log(JSON.stringify(receipt));
}catch(e){await fs.writeFile('/tmp/private-managed-e2e-receipt.json',JSON.stringify({status:'FAIL',error:e.message,checks,createdDraftIds,fixtureUserIds:fixture.users.map(u=>u.id)}),{mode:0o600});throw e;}
finally{
 for(const cookie of cookies)await call(session,'DELETE',undefined,cookie).catch(()=>{});
 await new Promise(resolve=>server.close(resolve));await app.close();await fs.unlink(fixturePath).catch(()=>{});
}
