import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(path.join(process.env.IWSN_TEST_PACKAGE_ROOT || root, 'package.json'));
const ts = require('typescript');
const crypto = require('node:crypto');
const owner = '11111111-1111-4111-8111-111111111111';
const other = '22222222-2222-4222-8222-222222222222';
const id = '33333333-3333-4333-8333-333333333333';
const fields = { displayAlias:'Eigener Entwurf', city:'Zug', description:'Eigene Worte', photoRightsConfirmed:false };
function load(relative) {
  const source = fs.readFileSync(path.join(root, relative), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { target:ts.ScriptTarget.ES2022, module:ts.ModuleKind.CommonJS } });
  const context = { exports:{}, AbortSignal, URL, fetch(){throw Error('Unexpected live request');}, require(name){if(name==='./report-input')return load('src/lib/marketplace/report-input.ts');throw Error('Unexpected dependency '+name);} };
  vm.runInNewContext(compiled.outputText, context, { filename:relative });
  return context.exports;
}
const lib = load('src/lib/marketplace/provider-workspace-client.ts');
const response = (data, status=200) => ({ ok:status>=200&&status<300,status,json:async()=>data });
const row = overrides => ({ ...fields,id,ownerId:owner,state:'draft',...overrides });
test('session accepts only a server-confirmed UUID, not a success-looking response', async()=>{
  for(const data of [{ok:true},{userId:''},{userId:'local-owner'},null]) await assert.rejects(lib.createProviderWorkspaceClient(async()=>response(data)).session());
  assert.equal(await lib.createProviderWorkspaceClient(async()=>response({userId:owner})).session(),owner);
});
test('sign-in uses private same-origin POST and returns no token', async()=>{
  let request;const client=lib.createProviderWorkspaceClient(async(url,init)=>{request={url,init};return response({userId:owner});});
  assert.equal(await client.signIn('test@example.invalid','synthetic-only'),owner);
  assert.equal(request.url,'/api/private/provider-session');assert.equal(request.init.method,'POST');assert.equal(request.init.credentials,'same-origin');
  assert.deepEqual(JSON.parse(request.init.body),{email:'test@example.invalid',password:'synthetic-only'});assert.equal(request.init.cache,'no-store');
});
test('save sends only allowed draft fields, never ownership or approval', async()=>{
  const calls=[];const client=lib.createProviderWorkspaceClient(async(url,init)=>{calls.push({url,init});return response({draft:row({})},201);});
  const saved=await client.save(owner,{...fields,ownerId:other,state:'approved',identityVerified:true});
  assert.equal(saved.ownerId,owner);assert.deepEqual(JSON.parse(calls[0].init.body),fields);assert.equal(calls[0].url,'/api/private/provider-drafts');
  await client.save(owner,fields,id);assert.deepEqual(JSON.parse(calls[1].init.body),{id,fields});assert.equal(calls[1].init.method,'PUT');
});
test('missing session and invalid fields cause no save request',async()=>{
  let calls=0;const client=lib.createProviderWorkspaceClient(async()=>{calls++;throw Error('must not call');});
  for(const [uid,f,draftId]of [['',fields], [owner,{...fields,displayAlias:''}], [owner,{...fields,description:'x'.repeat(1001)}], [owner,fields,'invalid']]) await assert.rejects(client.save(uid,f,draftId));
  assert.equal(calls,0);
});
test('foreign, published, mismatched and malformed records cannot become a saved state',async()=>{
  for(const draft of [row({ownerId:other}),row({state:'approved'}),row({id:other}),row({city:42}),null]) {
    const client=lib.createProviderWorkspaceClient(async()=>response({draft}));await assert.rejects(client.save(owner,fields,id));
  }
});
test('backend failure is never a successful save or logout',async()=>{
  for(const status of [401,404,429,503]) {
    const client=lib.createProviderWorkspaceClient(async()=>response({draft:row({}),signedOut:true},status));
    await assert.rejects(client.save(owner,fields));await assert.rejects(client.signOut());
  }
  await assert.rejects(lib.createProviderWorkspaceClient(async()=>response({ok:true})).signOut());
});
test('opening requires a valid draft ID and preserves its identity',async()=>{
  let called='';const client=lib.createProviderWorkspaceClient(async(url)=>{called=url;return response({draft:row({})});});
  assert.equal((await client.open(owner,id)).id,id);assert.equal(called,'/api/private/provider-drafts?id='+id);
  await assert.rejects(client.open(owner,'../../admin'));assert.equal(called,'/api/private/provider-drafts?id='+id);
});
test('local draft parsing does not restore forged tokens or account evidence',()=>{
  const draft=lib.safeDraftFields({...fields,ownerToken:'forged',userId:owner,identityVerified:true});
  assert.deepEqual(JSON.parse(JSON.stringify(draft)),fields);assert.equal(lib.safeDraftFields([]),null);assert.equal(lib.safeDraftFields({...fields,photoRightsConfirmed:'yes'}),null);
});
test('reports require the backend 202 receipt and a valid case ID',async()=>{
  const body={submissionKey:id,profileId:'catalogue-id',sourceUrl:'',reason:'Falsche Angabe',contact:''};
  for(const status of [200,400,503]) await assert.rejects(lib.submitProviderReport(body,async()=>response({ok:true,status:'RECEIVED',caseId:id},status)));
  await assert.rejects(lib.submitProviderReport(body,async()=>response({ok:true,status:'RECEIVED',caseId:'invented'},202)));
  assert.equal(await lib.submitProviderReport(body,async()=>response({ok:true,status:'RECEIVED',caseId:id},202)),id);
  let calls=0;await assert.rejects(lib.submitProviderReport({...body,profileId:''},async()=>{calls++;}));assert.equal(calls,0);
});
test('report client rejects invalid references and oversize text without sending or truncating them',async()=>{
  const body={submissionKey:id,profileId:'synthetic',sourceUrl:'',reason:'Falsche Angabe',contact:''};
  let calls=0;
  for(const patch of [{profileId:'x'.repeat(151)},{sourceUrl:'https://user:secret@example.invalid'},{sourceUrl:'file:///private'},{reason:'x'.repeat(501)},{contact:'x'.repeat(121)},{profileId:[]}]) {
    await assert.rejects(lib.submitProviderReport({...body,...patch},async()=>{calls++;}),error=>error instanceof lib.WorkspaceError&&error.status===400);
  }
  assert.equal(calls,0);
});
test('report client omits account credentials and treats malformed receipts as unconfirmed',async()=>{
  const body={submissionKey:id,profileId:' synthetic ',sourceUrl:'',reason:' Falsche Angabe ',contact:''};
  let request;
  assert.equal(await lib.submitProviderReport(body,async(url,options)=>{request={url,options};return response({ok:true,status:'RECEIVED',caseId:id},202);}),id);
  assert.equal(request.options.credentials,'omit');assert.equal(request.options.cache,'no-store');
  assert.deepEqual(JSON.parse(request.options.body),{action:'report_profile',submissionKey:id,profileId:'synthetic',sourceUrl:'',reason:'Falsche Angabe',contact:''});
  await assert.rejects(lib.submitProviderReport(body,async()=>({status:202,json:async()=>{throw Error('Malformed JSON');}})),error=>error instanceof lib.WorkspaceError&&error.status===502);
});
test('AI gate rejects spoofed consent, paid flags and opt-in mutations before any effects',()=>{
  const {denyUnverifiedAiFeature}=load('src/lib/marketplace/consent-feature-gate.ts');
  for(const body of [{action:'toggle_opt_out',optOut:false},{wantVoice:true,unlocked:true},{hasPaidCredit:true,freePreviewsUsed:0,aiOptIn:true}]) {
    const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(s){this.code=s;return this;},json(v){this.body=v;return this;}};
    denyUnverifiedAiFeature({method:'POST',body},res);assert.equal(res.code,503);assert.equal(res.body.ok,false);assert.equal(res.headers['Cache-Control'],'no-store');
  }
  for(const file of ['src/pages/api/avatar-chat/[providerId].ts','src/pages/api/fantasy-preview/generate.ts']) {
    const text=fs.readFileSync(path.join(root,file),'utf8');assert.match(text,/export default denyUnverifiedAiFeature/);assert.doesNotMatch(text,/fetch\(|writeFile|process\.env|assertVerifiedAiOptIn/);
  }
});
test('provider UI contains no legacy claim, URL token or fabricated payment flow',()=>{
  const text=fs.readFileSync(path.join(root,'src/components/NightProviderWorkspace.tsx'),'utf8');
  assert.doesNotMatch(text,/iwsn_creator_session|ownerToken|router\.query\.token|claims\/create|vault\/unlock|login_or_claim/);
  assert.match(text,/noindex/);assert.match(text,/client\.signIn/);assert.match(text,/client\.save/);assert.match(text,/localStorage\.setItem\(LOCAL_DRAFT_KEY/);
});
test('legacy enquiry route cannot send personal data or claim delivery',()=>{
  const handler=load('src/pages/api/enquiries/create.ts').default;
  const res={setHeader(){},status(n){this.code=n;return this;},json(v){this.body=v;return this;}};
  handler({method:'POST',body:{contact:'synthetic@example.invalid'}},res);
  assert.equal(res.code,503);assert.equal(res.body.ok,false);assert.doesNotMatch(JSON.stringify(res.body),/transmitted|referenceCode/);
});
function metricsHandler({configured=true,db={ok:false,data:null}}={}) {
  const effects=[];
  const admin={isSupabaseConfigured:()=>configured,supaFetch:async()=>db,
    readSafeJson:(name,fallback)=>name==='managed-profile-states.json'?{synthetic:{profileId:'synthetic',ownerToken:'must-stay-private',rate60Chf:350,availabilityConfirmed:true}}:fallback,
    writeSafeJson:()=>effects.push('write'),sendTelegramPing:async()=>effects.push('message')};
  const source=fs.readFileSync(path.join(root,'src/pages/api/vault/metrics.ts'),'utf8');
  const compiled=ts.transpileModule(source,{compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
  const context={exports:{},process:{env:{}},Buffer,require(name){if(name==='crypto')return crypto;if(name==='@/lib/supabaseAdmin')return admin;if(name==='@/lib/marketplace/report-input')return load('src/lib/marketplace/report-input.ts');if(name==='@/data/harvested-offers.json')return [{id:'synthetic'}];if(name==='@/data/swiss-establishments-vault.json')return [];throw Error('Unexpected dependency '+name);}};
  vm.runInNewContext(compiled,context);return{handler:context.exports.default,effects};
}
async function metricsCall(handler,method='GET',body={}) {
  const res={headers:{},setHeader(k,v){this.headers[k]=v;},status(n){this.code=n;return this;},json(v){this.body=v;return this;}};
  await handler({method,headers:{},query:{},body},res);return res;
}
test('configured DB failure never publishes stale local states',async()=>{
  const {handler,effects}=metricsHandler();const res=await metricsCall(handler);
  assert.equal(res.code,503);assert.equal(res.body.ok,false);assert.equal('states'in res.body,false);assert.equal(res.headers['Cache-Control'],'no-store');assert.equal(effects.length,0);
});
test('metrics exposes only explicit price evidence and carries DB expiry',async()=>{
  const expiry=new Date(Date.now()+60000).toISOString();
  const {handler}=metricsHandler({db:{ok:true,data:[{profile_id:'synthetic',rate60_chf:420,price_confirmed:true,price_confirmed_at:'2026-11-27T12:00:00Z',rate_confirmed:false,rate_updated_at:null,available_until:expiry,availability_confirmed:true,owner_token:'private'}]}});
  const res=await metricsCall(handler);assert.equal(res.code,200);const row=res.body.states.synthetic;
  assert.equal(row.priceConfirmed,true);assert.equal(row.priceConfirmedAt,'2026-11-27T12:00:00Z');assert.equal(row.availableUntil,expiry);assert.equal(row.identityVerified,false);assert.equal('ownerToken'in row,false);assert.equal('owner_token'in row,false);
});
test('anonymous metrics enquiry has no storage or notification side effect',async()=>{
  const {handler,effects}=metricsHandler({configured:false});const res=await metricsCall(handler,'POST',{action:'create_enquiry',profileId:'synthetic',clientContact:'synthetic@example.invalid'});
  assert.equal(res.code,503);assert.equal(res.body.ok,false);assert.equal(effects.length,0);
});
test('all five provider pages and shared component parse as TSX',()=>{
  for(const file of ['src/pages/register.tsx','src/pages/login.tsx','src/pages/creator-dashboard.tsx','src/pages/create-post.tsx','src/pages/report.tsx','src/components/NightProviderWorkspace.tsx']){
    const output=ts.transpileModule(fs.readFileSync(path.join(root,file),'utf8'),{fileName:file,reportDiagnostics:true,compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,jsx:ts.JsxEmit.ReactJSX}});
    assert.equal(output.diagnostics.filter(d=>d.category===ts.DiagnosticCategory.Error).length,0,file);
  }
});
