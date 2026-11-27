import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');
const key = 'abcdef12-abcd-4abc-8abc-abcdef123456';
const anotherKey = '22222222-2222-4222-8222-222222222222';
const caseId = '33333333-3333-5333-8333-333333333333';
const fields = {profileId:'synthetic-profile',sourceUrl:'',reason:'Falsche Angabe',contact:''};

function load(file) {
  const source = fs.readFileSync(new URL('../src/lib/marketplace/' + file + '.ts', import.meta.url), 'utf8');
  const code = ts.transpileModule(source, {compilerOptions:{target:ts.ScriptTarget.ES2022,module:ts.ModuleKind.CommonJS}}).outputText;
  const context = {exports:{}, URL, AbortSignal, fetch(){throw Error('Unexpected external request');},
    require(name){if(name === './report-input')return load('report-input');throw Error('Unexpected dependency ' + name);}};
  vm.runInNewContext(code, context);
  return context.exports;
}
const session = load('report-session');
const client = load('provider-workspace-client');
function storage(initial = null) {
  let value = initial;
  const events = [];
  return {events, getItem(name){events.push(['read',name]);return value;},setItem(name,next){events.push(['write',name,next]);value=next;},removeItem(name){events.push(['remove',name]);value=null;}};
}
const response = (status=202, data={ok:true,status:'RECEIVED',caseId}) => ({status,json:async()=>data});

test('session stores only the key and read-back precedes the first report request', async()=>{
  const store = storage();
  assert.equal(session.readReportSubmissionKey(store),null);
  const submissionKey = session.ensureReportSubmissionKey(store,null,()=>key);
  await client.submitProviderReport({...fields,submissionKey},async(_url,init)=>{
    assert.deepEqual(store.events.at(-1),['read',session.REPORT_SESSION_KEY]);
    assert.deepEqual(store.events.filter(event=>event[0]==='write'),[['write',session.REPORT_SESSION_KEY,key]]);
    assert.equal(JSON.parse(init.body).submissionKey,key);
    assert.equal(init.credentials,'omit');assert.equal(init.cache,'no-store');
    return response();
  });
  assert.equal(session.readReportSubmissionKey(store),key);
});

test('timeouts, conflicts, success and reload never implicitly rotate a report key', async()=>{
  const store = storage();
  let generated = 0;
  const create = ()=>{generated++;return key;};
  const sent = [];
  for (const status of [0,503,409,202]) {
    const submissionKey = session.ensureReportSubmissionKey(store,null,create);
    const attempt = client.submitProviderReport({...fields,submissionKey}, async(_url,init)=>{
      sent.push(JSON.parse(init.body).submissionKey);
      if(status===0)throw Error('Response lost');
      return response(status);
    });
    if(status===202)assert.equal(await attempt,caseId);
    else await assert.rejects(attempt,error=>error instanceof client.WorkspaceError && error.status===status);
    assert.equal(load('report-session').readReportSubmissionKey(store),key);
  }
  assert.deepEqual(sent,[key,key,key,key]);assert.equal(generated,1);
  assert.equal(store.events.filter(event=>event[0]==='remove').length,0);
});

test('unavailable, corrupt or non-persisting storage aborts before a report can be sent', async()=>{
  for(const store of [
    {getItem(){throw Error('Denied');},setItem(){throw Error('Denied');}},
    {getItem(){return null;},setItem(){throw Error('Quota exceeded');}},
    {getItem(){return null;},setItem(){}},
    storage('not-a-uuid'), storage('11111111-1111-5111-8111-111111111111')
  ]) {
    let requests = 0;
    await assert.rejects(async()=>{
      const submissionKey=session.ensureReportSubmissionKey(store,null,()=>key);
      await client.submitProviderReport({...fields,submissionKey},async()=>{requests++;return response();});
    },error=>error instanceof session.ReportSessionError);
    assert.equal(requests,0);
    if(store.events) assert.equal(store.events.filter(event=>event[0]==='write').length,0);
  }
});

test('storage cleared during an open report restores the same key and conflicting storage is preserved',()=>{
  const empty = storage();
  assert.equal(session.ensureReportSubmissionKey(empty,key,()=>{throw Error('Must not generate another identity');}),key);
  const conflicting = storage(anotherKey);
  assert.throws(()=>session.ensureReportSubmissionKey(conflicting,key),session.ReportSessionError);
  assert.equal(session.readReportSubmissionKey(conflicting),anotherKey);
  assert.equal(conflicting.events.filter(event=>event[0]==='write').length,0);
});

test('a denied storage property or failed persistence read-back prevents sending',async()=>{
  const deniedHost = {get sessionStorage(){throw Error('Storage access denied');}};
  let reads = 0, requests = 0;
  const readBackFailure = {getItem(){if(++reads>1)throw Error('Read-back denied');return null;},setItem(){}};
  for(const getStore of [()=>deniedHost.sessionStorage,()=>readBackFailure]) {
    await assert.rejects(async()=>{
      const submissionKey=session.ensureReportSubmissionKey(getStore(),null,()=>key);
      await client.submitProviderReport({...fields,submissionKey},async()=>{requests++;return response();});
    });
  }
  assert.equal(requests,0);
});

test('valid uppercase stored identities and current keys canonicalize without rotation',()=>{
  const store = storage(key.toUpperCase());
  assert.equal(session.readReportSubmissionKey(store),key);
  assert.equal(session.ensureReportSubmissionKey(store,key.toUpperCase(),()=>{throw Error('No new key');}),key);
  assert.equal(store.events.filter(event=>event[0]==='write').length,0);
  session.clearReportSubmissionKey(store,key.toUpperCase());
  assert.equal(session.readReportSubmissionKey(store),null);
});

test('only an explicit matching reset permits a new report identity',()=>{
  const store = storage(key);
  assert.throws(()=>session.clearReportSubmissionKey(store,anotherKey),session.ReportSessionError);
  assert.equal(session.readReportSubmissionKey(store),key);
  session.clearReportSubmissionKey(store,key);
  assert.equal(session.readReportSubmissionKey(store),null);
  assert.equal(session.ensureReportSubmissionKey(store,null,()=>anotherKey),anotherKey);
  const denied = {getItem(){return key;},removeItem(){}};
  assert.throws(()=>session.clearReportSubmissionKey(denied,key),session.ReportSessionError);
});

test('receipt check sends only a normalized key in a private POST and requires a confirmed receipt',async()=>{
  let request;
  assert.equal(await client.checkProviderReportReceipt(key.toUpperCase(),async(url,options)=>{request={url,options};return response();}),caseId);
  assert.equal(request.url,'/api/vault/metrics');assert.equal(request.options.method,'POST');
  assert.equal(request.options.credentials,'omit');assert.equal(request.options.cache,'no-store');
  assert.deepEqual(JSON.parse(request.options.body),{action:'report_receipt',submissionKey:key});
  for(const status of [200,400,404,409,503]) await assert.rejects(client.checkProviderReportReceipt(key,async()=>response(status)),error=>error instanceof client.WorkspaceError && error.status===status);
  for(const data of [{ok:true,status:'RECEIVED',caseId:'invented'},{ok:false,status:'RECEIVED',caseId},{ok:true,status:'CLOSED',caseId},null]) {
    await assert.rejects(client.checkProviderReportReceipt(key,async()=>response(202,data)),error=>error instanceof client.WorkspaceError && error.status===502);
  }
});

test('missing and invalid submission keys never reach the network on either client operation',async()=>{
  let requests = 0;
  for(const submissionKey of [undefined,null,'',[],{},'11111111-1111-5111-8111-111111111111','11111111-1111-4111-7111-111111111111']) {
    const fetcher=async()=>{requests++;return response();};
    await assert.rejects(client.submitProviderReport({...fields,submissionKey},fetcher),error=>error instanceof client.WorkspaceError && error.status===400);
    await assert.rejects(client.checkProviderReportReceipt(submissionKey,fetcher),error=>error instanceof client.WorkspaceError && error.status===400);
  }
  assert.equal(requests,0);
});
