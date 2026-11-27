import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const crypto = require('node:crypto');

function load(file, dependencies = {}, extras = {}) {
  const source = fs.readFileSync(new URL('../' + file, import.meta.url), 'utf8');
  const code = ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS,esModuleInterop:true}}).outputText;
  const context = {exports:{},URL,Buffer,AbortSignal,performance,process:{env:{}},fetch(){throw Error('Unexpected external request');},
    require(name){if(name in dependencies)return dependencies[name];throw Error('Unexpected dependency '+name);},...extras};
  vm.runInNewContext(code, context, {filename:file});
  return context.exports;
}
const validation = load('src/lib/marketplace/report-input.ts');
const valid = {profileId:'synthetic-profile',sourceUrl:'',reason:'Falsche Angabe',contact:''};
const submissionKey = 'abcd1234-1111-4222-8333-123456789abc';

test('report validation preserves bounded text and supports a web reference without a profile ID',()=>{
  assert.deepEqual(JSON.parse(JSON.stringify(validation.validateReportInput({...valid,profileId:' synthetic-profile ',details:' Bitte prüfen '}))),{
    ok:true,value:{...valid,reason:'Falsche Angabe | Bitte prüfen'}
  });
  for(const sourceUrl of ['https://example.invalid/report?id=one#photo','http://example.invalid/path']) {
    const result=validation.validateReportInput({...valid,profileId:'',sourceUrl});
    assert.equal(result.ok,true);assert.equal(result.value.sourceUrl,sourceUrl);
  }
});

test('report input refuses wrong types and oversize fields instead of coercing or truncating',()=>{
  for(const [field,max] of [['profileId',150],['sourceUrl',500],['reason',500],['details',500],['contact',120]]) {
    for(const value of [null,42,true,{},[],['text'],'x'.repeat(max+1)]) {
      const result=validation.validateReportInput({...valid,[field]:value});
      assert.equal(result.ok,false,field+': '+typeof value);
    }
  }
  assert.equal(validation.validateReportInput({...valid,reason:'r'.repeat(490),details:'d'.repeat(10)}).ok,false);
  for(const body of [null,[],false,'report']) assert.equal(validation.validateReportInput(body).ok,false);
});

test('report URLs reject credentials, control characters and non-web schemes without network resolution',()=>{
  for(const sourceUrl of ['javascript:alert(1)','data:text/plain,private','file:///C:/private','ftp://example.invalid/file','//example.invalid/a','https:example.invalid','not a URL','https://user:secret@example.invalid','https://user@example.invalid','https://example.invalid/line\nbreak','https://example.invalid/\u0000','https://example.invalid/\u007f','\thttps://example.invalid']) {
    assert.equal(validation.validateReportInput({...valid,sourceUrl}).ok,false,JSON.stringify(sourceUrl));
  }
  assert.equal(validation.validateReportInput({...valid,profileId:'bad\nreference'}).ok,false);
  assert.equal(validation.validateReportInput({...valid,profileId:'',sourceUrl:''}).ok,false);
});

function handlerWith({configured=true,saveResult,readResult={ok:true,data:[]},fetcher,clock=performance,notificationError=false}={}) {
  const effects=[];
  const admin={isSupabaseConfigured:()=>configured,readSafeJson:(_name,fallback)=>fallback,
    writeSafeJson(){throw Error('Report must not write public/local data');},
    async supaFetch(table,options){
      effects.push({kind:options.method==='POST'?'save':'read',table,options});
      if(fetcher)return fetcher(table,options);
      if(options.method!=='POST')return readResult;
      return saveResult===undefined?{ok:true,data:[options.body]}:saveResult;
    },
    async sendTelegramPing(lines){effects.push({kind:'notify',lines});if(notificationError)throw Error('Notification unavailable');}
  };
  const handler=load('src/pages/api/vault/metrics.ts',{'crypto':crypto,'@/data/harvested-offers.json':[],'@/data/swiss-establishments-vault.json':[],
    '@/lib/supabaseAdmin':admin,'@/lib/marketplace/report-input':validation},{performance:clock}).default;
  return {handler,effects};
}
async function call(handler,body,query={}) {
  const res={headers:{},setHeader(key,value){this.headers[key]=value;},status(code){this.code=code;return this;},json(body){this.body=body;return this;}};
  await handler({method:'POST',headers:{},query,body:{submissionKey,...body}},res);return res;
}

test('invalid reporting payloads cause no persistence or notification',async()=>{
  const {handler,effects}=handlerWith();
  for(const payload of [{...valid,profileId:[]},{...valid,profileId:'p'.repeat(151)},{...valid,sourceUrl:'https://user:secret@example.invalid'},
    {...valid,sourceUrl:'file:///private'}, {...valid,reason:{}},{...valid,contact:'x'.repeat(121)}, {...valid,profileId:'',sourceUrl:''}]) {
    const result=await call(handler,{action:'report_profile',...payload});
    assert.equal(result.code,400);assert.equal('caseId' in result.body,false);assert.equal(result.body.ok,false);
  }
  const invalidQuery=await call(handler,{action:'report_profile',...valid},{profileId:['one','two']});
  assert.equal(invalidQuery.code,400);assert.equal(effects.length,0);
});

test('all report aliases preserve legacy details and persist only private fields',async()=>{
  for(const action of ['submit_takedown','report_profile','opt_out','report_issue','dmca_takedown']) {
    const {handler,effects}=handlerWith();
    const result=await call(handler,{action,id:'synthetic-profile',details:'Legacy reason',contact:'synthetic@example.invalid',identityVerified:true,hidden:true});
    assert.equal(result.code,202);assert.equal(result.body.status,'RECEIVED');assert.equal(result.body.preliminarilyHidden,false);
    const record=effects[0].options.body;
    assert.equal(effects[0].table,'iwsn_report_cases?on_conflict=case_id');assert.equal(record.case_id,result.body.caseId);
    assert.equal(effects[0].options.prefer,'resolution=ignore-duplicates,return=representation');
    assert.equal(effects[0].options.timeoutMs,10000);
    assert.equal(record.profile_id,'synthetic-profile');assert.equal(record.reason,'Legacy reason');
    assert.deepEqual(Object.keys(record).sort(),['case_id','contact','profile_id','reason','source_url','status']);
    assert.equal(effects[1].lines.length,1);assert.equal(effects[1].lines[0],'Neuer IWSN-Meldefall: '+result.body.caseId);
    assert.equal(JSON.stringify(result.body).includes('synthetic@example.invalid'),false);
    assert.equal(JSON.stringify(effects[1]).includes('synthetic@example.invalid'),false);
    assert.equal(result.headers['Cache-Control'],'no-store');
  }
});

test('unconfigured reporting stores nothing and does not claim a receipt',async()=>{
  const {handler,effects}=handlerWith({configured:false});
  const result=await call(handler,{action:'report_profile',...valid});
  assert.equal(result.code,503);assert.equal('caseId' in result.body,false);assert.equal(effects.length,0);
});

test('database refusal or an unmatched write response never becomes a receipt',async()=>{
  for(const saveResult of [{ok:false,data:null},{ok:true,data:null},{ok:true,data:[]},{ok:true,data:[{case_id:'different',status:'RECEIVED'}]}]) {
    const {handler,effects}=handlerWith({saveResult});
    const result=await call(handler,{action:'report_profile',...valid});
    assert.equal(result.code,503);assert.equal('caseId' in result.body,false);
    assert.equal(effects.length,Array.isArray(saveResult.data)&&saveResult.data.length===0?2:1);assert.equal(effects[0].kind,'save');
  }
});

test('a notification failure cannot erase a confirmed stored receipt',async()=>{
  const {handler,effects}=handlerWith({notificationError:true});
  const result=await call(handler,{action:'report_profile',...valid});
  assert.equal(result.code,202);assert.equal(result.body.caseId,effects[0].options.body.case_id);
  assert.equal(effects.length,2);
});

test('a timed-out report write remains unconfirmed and triggers no retry or notification',async()=>{
  const {handler,effects}=handlerWith({saveResult:{ok:false,data:null,error:'UPSTREAM_TIMEOUT'}});
  const result=await call(handler,{action:'report_profile',...valid});
  assert.equal(result.code,503);assert.equal(result.body.ok,false);
  assert.equal('caseId' in result.body,false);assert.equal('status' in result.body,false);
  assert.match(result.body.error,/konnte nicht bestätigt werden/);
  assert.equal(effects.length,1);assert.equal(effects[0].kind,'save');
  assert.equal(effects[0].options.timeoutMs,10000);
});

test('notification requests have a bounded abort signal and swallow network failures',async()=>{
  const deadlines=[],requests=[];
  const controller=new AbortController();controller.abort();
  const admin=load('src/lib/supabaseAdmin.ts',{fs:{},path:{},crypto}, {
    process:{env:{TELEGRAM_BOT_TOKEN:'synthetic-only',TELEGRAM_CHAT_ID:'synthetic-chat'}},
    AbortSignal:{timeout(ms){deadlines.push(ms);return controller.signal;}},
    async fetch(url,options){requests.push({url,options});options.signal.throwIfAborted();}
  });
  await assert.doesNotReject(admin.sendTelegramPing(['Synthetic case ID only']));
  assert.deepEqual(deadlines,[3000]);assert.equal(requests.length,1);
  assert.equal(requests[0].options.signal,controller.signal);
  assert.deepEqual(JSON.parse(requests[0].options.body),{chat_id:'synthetic-chat',text:'Synthetic case ID only'});
});

const reportBody = patch => ({action:'report_profile',...valid,...patch});
const plain = value => JSON.parse(JSON.stringify(value));
function deferred() {
  let resolve;
  const promise=new Promise(done=>{resolve=done;});
  return {promise,resolve};
}

// Models the database's PRIMARY KEY / INSERT ... ON CONFLICT DO NOTHING contract.
// These tests do not claim to validate a deployed PostgREST or PostgreSQL instance.
function privateStore({beforeInsert,afterInsert,readFailure}={}) {
  const rows=new Map();
  let attempts=0;
  async function fetcher(table,options) {
    if(options.method==='POST') {
      assert.equal(table,'iwsn_report_cases?on_conflict=case_id');
      assert.equal(options.prefer,'resolution=ignore-duplicates,return=representation');
      const attempt=++attempts;
      if(beforeInsert)await beforeInsert(attempt);
      const record=plain(options.body);
      if(rows.has(record.case_id))return {ok:true,data:[]};
      rows.set(record.case_id,record);
      return afterInsert?afterInsert(attempt,record):{ok:true,data:[plain(record)]};
    }
    assert.ok(options.method===undefined||options.method==='GET');
    const query=new URL('https://example.invalid/'+table).searchParams;
    const id=query.get('case_id');
    assert.match(id,/^eq\.[0-9a-f-]{36}$/);
    if(readFailure)return readFailure;
    const row=rows.get(id.slice(3));
    const fields=query.get('select').split(',');
    return {ok:true,data:row?[Object.fromEntries(fields.map(field=>[field,row[field]]))]:[]};
  }
  return {rows,fetcher,get attempts(){return attempts;}};
}

test('all reporting aliases require a valid random submission key before any side effects',async()=>{
  for(const action of ['submit_takedown','report_profile','opt_out','report_issue','dmca_takedown','report_receipt']) {
    for(const key of [undefined,null,'',{},[],42,'../../private','abcd1234-1111-1222-8333-123456789abc','abcd1234-1111-4222-7333-123456789abc',' abcd1234-1111-4222-8333-123456789abc']) {
      const {handler,effects}=handlerWith();
      const result=await call(handler,{action,...valid,submissionKey:key});
      assert.equal(result.code,400,action);assert.equal(result.body.ok,false);
      assert.equal('caseId' in result.body,false);assert.equal(effects.length,0);
    }
  }
});

test('a committed report whose response is lost is recovered by retry with one stored row',async()=>{
  const db=privateStore({afterInsert:()=>({ok:false,data:null,error:'UPSTREAM_TIMEOUT'})});
  const first=handlerWith({fetcher:db.fetcher}),retry=handlerWith({fetcher:db.fetcher});
  const uncertain=await call(first.handler,reportBody());
  assert.equal(uncertain.code,503);assert.equal('caseId' in uncertain.body,false);
  assert.equal(db.rows.size,1);
  const confirmed=await call(retry.handler,reportBody());
  assert.equal(confirmed.code,202);assert.equal(confirmed.body.caseId,[...db.rows.keys()][0]);
  assert.equal(db.rows.size,1);assert.equal(db.attempts,2);
  assert.equal([...first.effects,...retry.effects].filter(effect=>effect.kind==='notify').length,0);
  assert.deepEqual(retry.effects.map(effect=>effect.kind),['save','read']);
});

test('twenty concurrent handlers create one report and at most one notification',async()=>{
  const db=privateStore();
  const runs=Array.from({length:20},()=>handlerWith({fetcher:db.fetcher}));
  const responses=await Promise.all(runs.map(run=>call(run.handler,reportBody())));
  assert.equal(db.rows.size,1);assert.equal(db.attempts,20);
  assert.ok(responses.every(result=>result.code===202));
  assert.equal(new Set(responses.map(result=>result.body.caseId)).size,1);
  assert.equal(runs.flatMap(run=>run.effects).filter(effect=>effect.kind==='notify').length,1);
});

test('an original request arriving late cannot create another row after a retry commits',async()=>{
  const firstStarted=deferred(),releaseFirst=deferred();
  const db=privateStore({beforeInsert:async attempt=>{if(attempt===1){firstStarted.resolve();await releaseFirst.promise;}}});
  const first=handlerWith({fetcher:db.fetcher}),retry=handlerWith({fetcher:db.fetcher});
  const original=call(first.handler,reportBody());
  await firstStarted.promise;
  const retried=await call(retry.handler,reportBody());
  assert.equal(retried.code,202);assert.equal(db.rows.size,1);
  releaseFirst.resolve();
  const late=await original;
  assert.equal(late.code,202);assert.equal(late.body.caseId,retried.body.caseId);assert.equal(db.rows.size,1);
  assert.equal([...first.effects,...retry.effects].filter(effect=>effect.kind==='notify').length,1);
});

test('normalization and key letter casing preserve a report identity across action aliases',async()=>{
  const db=privateStore();const {handler,effects}=handlerWith({fetcher:db.fetcher});
  const first=await call(handler,reportBody({profileId:' synthetic-profile ',reason:' Falsche Angabe ',contact:' contact@example.invalid '}));
  const repeat=await call(handler,reportBody({action:'submit_takedown',contact:'contact@example.invalid',submissionKey:submissionKey.toUpperCase()}));
  assert.equal(first.code,202);assert.equal(repeat.code,202);assert.equal(first.body.caseId,repeat.body.caseId);
  assert.equal(db.rows.size,1);assert.equal(effects.filter(effect=>effect.kind==='notify').length,1);
  assert.notEqual(first.body.caseId,submissionKey);assert.equal(JSON.stringify(first.body).includes(submissionKey),false);
});

test('a new deliberate submission key remains a distinct report even for identical content',async()=>{
  const db=privateStore();const {handler}=handlerWith({fetcher:db.fetcher});
  const first=await call(handler,reportBody());
  const separate=await call(handler,reportBody({submissionKey:'abcd1234-1111-4222-8333-123456789abd'}));
  assert.equal(first.code,202);assert.equal(separate.code,202);
  assert.notEqual(first.body.caseId,separate.body.caseId);assert.equal(db.rows.size,2);
});

test('changed fields with the same key conflict without changing or disclosing the original report',async()=>{
  const db=privateStore();const {handler,effects}=handlerWith({fetcher:db.fetcher});
  const original=await call(handler,reportBody({contact:'private@example.invalid'}));
  const stored=plain(db.rows.get(original.body.caseId));
  for(const patch of [{profileId:'another-profile'},{sourceUrl:'https://example.invalid/other'},{reason:'Changed reason'},{contact:'different@example.invalid'}]) {
    const response=await call(handler,reportBody({contact:'private@example.invalid',...patch}));
    assert.equal(response.code,409);assert.equal(response.body.code,'REPORT_CONTENT_CONFLICT');
    assert.equal('caseId' in response.body,false);assert.equal('reason' in response.body,false);
    assert.equal(JSON.stringify(response.body).includes('private@example.invalid'),false);
    assert.deepEqual(db.rows.get(original.body.caseId),stored);
  }
  assert.equal(db.rows.size,1);assert.equal(effects.filter(effect=>effect.kind==='notify').length,1);
});

test('replay acknowledges intake without resetting or exposing later moderation status',async()=>{
  const db=privateStore();const {handler,effects}=handlerWith({fetcher:db.fetcher});
  const first=await call(handler,reportBody());
  const row=db.rows.get(first.body.caseId);row.status='REVIEWED_PRIVATE';row.updated_at='2026-11-27T12:34:00Z';
  const repeated=await call(handler,reportBody());
  assert.equal(repeated.code,202);assert.equal(repeated.body.status,'RECEIVED');
  assert.equal(repeated.body.caseId,first.body.caseId);assert.equal(row.status,'REVIEWED_PRIVATE');
  assert.equal(row.updated_at,'2026-11-27T12:34:00Z');assert.equal(effects.filter(effect=>effect.kind==='notify').length,1);
  assert.equal(JSON.stringify(repeated.body).includes('REVIEWED_PRIVATE'),false);
});

test('failed, empty or malformed duplicate read-backs never produce a receipt or notification',async()=>{
  for(const readResult of [{ok:false,data:null,error:'UPSTREAM_TIMEOUT'},{ok:true,data:null},{ok:true,data:[]},{ok:true,data:{}},{ok:true,data:[{}]},{ok:true,data:[null]},{ok:true,data:[{},{}]}]) {
    const {handler,effects}=handlerWith({saveResult:{ok:true,data:[]},readResult});
    const result=await call(handler,reportBody());
    assert.equal(result.code,503);assert.equal('caseId' in result.body,false);
    assert.deepEqual(effects.map(effect=>effect.kind),['save','read']);
  }
});

test('duplicate read-back uses only the remaining part of the shared ten-second database budget',async()=>{
  let now=0;
  const db=privateStore();const initial=handlerWith({fetcher:db.fetcher});
  await call(initial.handler,reportBody());
  const {handler,effects}=handlerWith({clock:{now:()=>now},fetcher:async(table,options)=>{
    const result=await db.fetcher(table,options);if(options.method==='POST')now=7625.75;return result;
  }});
  const result=await call(handler,reportBody());
  assert.equal(result.code,202);assert.equal(effects[0].options.timeoutMs,10000);
  assert.equal(effects[1].options.timeoutMs,2374);assert.equal(effects.length,2);
});

test('an exhausted duplicate-write budget does not start an additional database read',async()=>{
  for(const elapsed of [10000,10001]) {
    let now=0;
    const {handler,effects}=handlerWith({clock:{now:()=>now},fetcher:async()=>{now=elapsed;return {ok:true,data:[]};}});
    const result=await call(handler,reportBody());
    assert.equal(result.code,503);assert.equal('caseId' in result.body,false);
    assert.equal(effects.length,1);assert.equal(effects[0].kind,'save');
  }
});

test('receipt lookup uses only the private capability and returns no report content or status',async()=>{
  const db=privateStore();const initial=handlerWith({fetcher:db.fetcher});
  const first=await call(initial.handler,reportBody({contact:'private@example.invalid'}));
  db.rows.get(first.body.caseId).status='REVIEWED_PRIVATE';
  const {handler,effects}=handlerWith({fetcher:db.fetcher});
  const receipt=await call(handler,{action:'report_receipt',submissionKey:submissionKey.toUpperCase()});
  assert.equal(receipt.code,202);assert.equal(receipt.body.caseId,first.body.caseId);
  assert.deepEqual(Object.keys(receipt.body).sort(),['caseId','ok','preliminarilyHidden','status']);
  assert.equal(receipt.body.status,'RECEIVED');assert.equal(receipt.headers['Cache-Control'],'no-store');
  assert.equal(effects.length,1);assert.equal(effects[0].kind,'read');assert.equal(effects[0].options.timeoutMs,10000);
  assert.equal(effects[0].table,'iwsn_report_cases?case_id=eq.'+first.body.caseId+'&select=case_id');
  assert.equal(JSON.stringify(receipt.body).includes('private@example.invalid'),false);
  const publicId=await call(handler,{action:'report_receipt',submissionKey:first.body.caseId});
  assert.equal(publicId.code,400);assert.equal(effects.length,1);
});

test('receipt lookup remains unconfirmed when missing, unavailable or mismatched without a write',async()=>{
  const cases=[
    {configured:false,expected:503},
    {readResult:{ok:false,data:null,error:'UPSTREAM_TIMEOUT'},expected:503},
    {readResult:{ok:true,data:null},expected:503},
    {readResult:{ok:true,data:[]},expected:404},
    {readResult:{ok:true,data:[{case_id:'different'}]},expected:404},
    {readResult:{ok:true,data:[null]},expected:404}
  ];
  for(const {expected,...options} of cases) {
    const {handler,effects}=handlerWith(options);
    const result=await call(handler,{action:'report_receipt'});
    assert.equal(result.code,expected);assert.equal('caseId' in result.body,false);
    assert.ok(effects.every(effect=>effect.kind==='read'));
    if(expected===404)assert.equal(result.body.code,'REPORT_UNCONFIRMED');
  }
});

function reportApplication({abortSignal=AbortSignal}={}) {
  const dependencies={'./report-input':validation};
  return {
    session:load('src/lib/marketplace/report-session.ts',dependencies),
    client:load('src/lib/marketplace/provider-workspace-client.ts',dependencies,{AbortSignal:abortSignal})
  };
}
function tabStorage() {
  const values=new Map(),events=[];
  return {values,events,
    getItem(key){events.push({kind:'read',key});return values.has(key)?values.get(key):null;},
    setItem(key,value){events.push({kind:'write',key,value});values.set(key,value);},
    removeItem(key){events.push({kind:'remove',key});values.delete(key);}
  };
}
function endpointFetch(handler,{afterResponse}={}) {
  return async (url,options)=>{
    assert.equal(url,'/api/vault/metrics');assert.equal(options.method,'POST');
    assert.equal(options.credentials,'omit');assert.equal(options.cache,'no-store');
    const body=JSON.parse(options.body);
    const result=await call(handler,body);
    if(afterResponse)await afterResponse(result,options);
    return {status:result.code,ok:result.code>=200&&result.code<300,json:async()=>plain(result.body)};
  };
}

test('application contract: persisted identity survives a committed write with lost DB response and reload retry',async()=>{
  const store=tabStorage(),db=privateStore({afterInsert:()=>({ok:false,data:null,error:'UPSTREAM_TIMEOUT'})});
  const first=reportApplication(),firstEndpoint=handlerWith({fetcher:db.fetcher});
  const key=first.session.ensureReportSubmissionKey(store,null,()=>submissionKey);
  assert.deepEqual(store.events.at(-1),{kind:'read',key:first.session.REPORT_SESSION_KEY});
  await assert.rejects(first.client.submitProviderReport({...valid,contact:'private@example.invalid',submissionKey:key},endpointFetch(firstEndpoint.handler)),
    error=>error instanceof first.client.WorkspaceError && error.status===503);
  assert.equal(db.rows.size,1);
  const expectedCaseId=[...db.rows.keys()][0];
  const reloaded=reportApplication(),retryEndpoint=handlerWith({fetcher:db.fetcher});
  const restored=reloaded.session.readReportSubmissionKey(store);
  assert.equal(restored,key);
  const retryKey=reloaded.session.ensureReportSubmissionKey(store,restored,()=>{throw Error('Reload must not create a new identity');});
  const recovered=await reloaded.client.submitProviderReport({...valid,contact:'private@example.invalid',submissionKey:retryKey},endpointFetch(retryEndpoint.handler));
  assert.equal(recovered,expectedCaseId);assert.equal(db.rows.size,1);assert.equal(db.attempts,2);
  assert.equal(reloaded.session.readReportSubmissionKey(store),key);
  assert.deepEqual([...store.values],[[first.session.REPORT_SESSION_KEY,key]]);
  assert.equal([...firstEndpoint.effects,...retryEndpoint.effects].filter(effect=>effect.kind==='notify').length,0);
});

test('application contract: lost browser response after server receipt is recovered after reload by read-only check',async()=>{
  const store=tabStorage(),db=privateStore(),controller=new AbortController(),deadlines=[];
  const first=reportApplication({abortSignal:{timeout(ms){deadlines.push(ms);return controller.signal;}}});
  const firstEndpoint=handlerWith({fetcher:db.fetcher});
  const key=first.session.ensureReportSubmissionKey(store,null,()=>submissionKey);
  let serverReceipt;
  const lostResponse=endpointFetch(firstEndpoint.handler,{afterResponse(result,options){
    assert.equal(result.code,202);serverReceipt=result.body.caseId;
    // Deterministic simulation of the configured 20-second browser deadline,
    // after the real handler returned202. No wall-clock wait or network call.
    controller.abort(new Error('Simulated browser deadline after committed receipt'));
    options.signal.throwIfAborted();
  }});
  await assert.rejects(first.client.submitProviderReport({...valid,submissionKey:key},lostResponse),
    error=>error instanceof first.client.WorkspaceError && error.status===0);
  assert.deepEqual(deadlines,[20000]);assert.equal(db.rows.size,1);assert.equal(db.attempts,1);
  const reloaded=reportApplication(),checkEndpoint=handlerWith({fetcher:db.fetcher});
  const recovered=await reloaded.client.checkProviderReportReceipt(reloaded.session.readReportSubmissionKey(store),endpointFetch(checkEndpoint.handler));
  assert.equal(recovered,serverReceipt);assert.equal(db.rows.size,1);assert.equal(db.attempts,1);
  assert.deepEqual(checkEndpoint.effects.map(effect=>effect.kind),['read']);
  assert.equal(firstEndpoint.effects.filter(effect=>effect.kind==='notify').length,1);
  assert.equal(checkEndpoint.effects.filter(effect=>effect.kind==='notify').length,0);
  assert.equal(reloaded.session.readReportSubmissionKey(store),key);
});

test('application contract: edited retry conflicts and read-only recovery keeps original data and identity',async()=>{
  const store=tabStorage(),db=privateStore(),app=reportApplication(),endpoint=handlerWith({fetcher:db.fetcher});
  const key=app.session.ensureReportSubmissionKey(store,null,()=>submissionKey);
  const original=await app.client.submitProviderReport({...valid,contact:'private@example.invalid',submissionKey:key},endpointFetch(endpoint.handler));
  const originalRow=plain(db.rows.get(original));
  await assert.rejects(app.client.submitProviderReport({...valid,reason:'A changed explanation',contact:'private@example.invalid',submissionKey:key},endpointFetch(endpoint.handler)),
    error=>error instanceof app.client.WorkspaceError && error.status===409);
  assert.deepEqual(db.rows.get(original),originalRow);assert.equal(db.rows.size,1);
  const beforeCheckWrites=db.attempts;
  const receipt=await app.client.checkProviderReportReceipt(app.session.readReportSubmissionKey(store),endpointFetch(endpoint.handler));
  assert.equal(receipt,original);assert.equal(db.attempts,beforeCheckWrites);
  assert.equal(app.session.readReportSubmissionKey(store),key);
  assert.equal(endpoint.effects.filter(effect=>effect.kind==='notify').length,1);
  assert.deepEqual([...store.values],[[app.session.REPORT_SESSION_KEY,key]]);
});
