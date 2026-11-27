import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
import {hasAdminReadAccess} from '../src/lib/marketplace/admin-read-auth.ts';
import * as catalogue from '../src/lib/night-catalogue.ts';
const require=createRequire(import.meta.url),ts=require('typescript');
const base=process.env.IWSN_TEST_BASE_URL||'http://127.0.0.1:4181';
function searchModule(snapshot){
 const source=fs.readFileSync(new URL('../src/lib/night-search-api.ts',import.meta.url),'utf8');
 const code=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022}}).outputText;
 const context={exports:{},require:n=>n==='./night-catalogue'?catalogue:n==='./night-catalogue-server'?{getCatalogueSnapshot:snapshot}:(()=>{throw Error(n);})()};
 vm.runInNewContext(code,context);return context.exports.publicSearchHandler;
}
async function run(handler,query={},method='GET'){
 const response={code:0,headers:{},setHeader(k,v){this.headers[k]=v;},status(c){this.code=c;return this;},json(body){this.body=body;return this;}};
 await handler({method,query},response);return response;
}
test('legacy search shares visibility and real price evidence with the public catalogue',async()=>{
 const handler=searchModule(async()=>({offers:[{id:'visible',rawName:'Public',city:'Zürich',canton:'ZH',rubric:'female'},{id:'hidden',rawName:'PRIVATE-HIDDEN'},{id:'blocked',rawName:'PRIVATE-BLOCKED'}],states:{visible:{rate60Chf:350},hidden:{hidden:true}},blockedIds:['blocked']}));
 const result=await run(handler,{q:'Zuerich'});
 assert.equal(result.code,200);assert.equal(result.body.results.length,1);assert.equal(result.body.results[0].advertisedBaseChf,null);assert.equal(result.body.results[0].availabilityConfirmed,false);assert.equal(JSON.stringify(result.body).includes('PRIVATE-'),false);assert.equal(result.headers['Cache-Control'],'no-store');
 assert.equal((await run(handler,{maxChf:'400'})).body.results.length,0);
});
test('legacy search rejects invalid requests and fails closed on a status outage',async()=>{
 let reads=0;const handler=searchModule(async()=>{reads++;throw Error('PRIVATE-ERROR');});
 assert.equal((await run(handler,{},'POST')).code,405);assert.equal((await run(handler,{canton:['ZH','BS']})).code,400);assert.equal(reads,0);
 const response=await run(handler);assert.equal(response.code,503);assert.equal(JSON.stringify(response.body).includes('PRIVATE-'),false);
});
test('admin read authentication rejects old PINs, missing secrets and alternate credentials',()=>{
 assert.equal(hasAdminReadAccess('1234','1234'),false);assert.equal(hasAdminReadAccess(undefined,'a'.repeat(24)),false);assert.equal(hasAdminReadAccess(['a'.repeat(24)],'a'.repeat(24)),false);assert.equal(hasAdminReadAccess('b'.repeat(24),'a'.repeat(24)),false);assert.equal(hasAdminReadAccess('a'.repeat(24),'a'.repeat(24)),true);
});
test('legacy routes redirect before shipping obsolete raw-data interfaces',async()=>{
 const routes={checkout:'/pricing',events:'/clubs',gifts:'/search','live-cam':'/search',members:'/favorites',matches:'/search',messages:'/favorites',notifications:'/favorites',rankings:'/search',stories:'/search','fantasy-preview':'/how-it-works'};
 for(const [route,destination] of Object.entries(routes)){
   const response=await fetch(base+'/'+route,{redirect:'manual'});assert.equal(response.status,307,route);assert.equal(response.headers.get('location'),destination,route);
   const source=fs.readFileSync(new URL('../src/pages/'+route+'.tsx',import.meta.url),'utf8');assert.doesNotMatch(source,/harvested-offers|harvestedOffers|swiss-establishments|localStorage/);
 }
});
test('anonymous admin endpoints reveal no records and the old admin page ships no pilot inventory',async()=>{
 for(const route of ['overview','health']){
  const response=await fetch(base+'/api/admin/'+route+'?pin=1234',{headers:{'x-admin-pin':'1234'}});assert.equal(response.status,403);assert.equal(response.headers.get('cache-control'),'no-store');assert.equal('profiles' in await response.json(),false);
 }
 const html=await (await fetch(base+'/admin-dashboard')).text();assert.match(html,/noindex/);assert.doesNotMatch(html,/pilot-20-cohort|copy-pilot|ch_unlocked_vaults/);
});
