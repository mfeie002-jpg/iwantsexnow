import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require=createRequire(import.meta.url),ts=require('typescript');
function moduleAt(file,dependencies={}){
 const code=ts.transpileModule(fs.readFileSync(new URL('../'+file,import.meta.url),'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;
 const context={exports:{},URL,URLSearchParams,require:n=>{if(n in dependencies)return dependencies[n];throw Error('Unexpected dependency '+n);}};
 vm.runInNewContext(code,context);return context.exports;
}
const catalogue=moduleAt('src/lib/night-catalogue.ts');
test('hidden, blocked and orphan states cannot expose private edits through public snapshots',async()=>{
 const source=[{id:'visible',rawName:'Public name'},{id:'hidden',rawName:'Hidden public history'},{id:'blocked',rawName:'Blocked public history'}];
 const states={visible:{displayName:'Public correction'},hidden:{hidden:true,displayName:'PRIVATE-NAME',city:'PRIVATE-CITY',thumbnail:'https://example.invalid/PRIVATE-IMAGE.jpg',ownerToken:'PRIVATE-TOKEN'},blocked:{displayName:'PRIVATE-BLOCKED-NAME'},orphan:{displayName:'PRIVATE-ORPHAN'}};
 const server=moduleAt('src/lib/night-catalogue-server.ts',{'@/data/harvested-offers.json':source,'@/data/swiss-establishments-vault.json':[],'./night-catalogue':catalogue,'@/lib/supabaseAdmin':{isSupabaseConfigured:()=>false,readSafeJson:(n,f)=>n==='managed-profile-states.json'?states:n==='do-not-import.json'?['blocked']:f}});
 const result=await server.getCatalogueSnapshot(),json=JSON.stringify(result);
 assert.equal(json.includes('PRIVATE-'),false);assert.equal(result.offers.length,1);assert.equal(result.offers[0].id,'visible');assert.equal(result.states.hidden.hidden,true);assert.equal(result.states.blocked.hidden,true);assert.equal('orphan' in result.states,false);assert.equal(result.states.visible.displayName,'Public correction');
});
test('database failure rejects the public snapshot rather than publishing stale local records',async()=>{
 const server=moduleAt('src/lib/night-catalogue-server.ts',{'@/data/harvested-offers.json':[],'@/data/swiss-establishments-vault.json':[],'./night-catalogue':catalogue,'@/lib/supabaseAdmin':{isSupabaseConfigured:()=>true,readSafeJson:()=>({}),supaFetch:async()=>({ok:false,data:null})}});
 await assert.rejects(server.getCatalogueSnapshot(),/Catalogue status unavailable/);
});

test('a managed correction on an excluded test record never reaches the visitor snapshot', async () => {
 const server = moduleAt('src/lib/night-catalogue-server.ts', {
   '@/data/harvested-offers.json':[{id:'sample',sourceUrl:'https://example.com/sample'}, {id:'real'}],
   '@/data/swiss-establishments-vault.json':[],'./night-catalogue':catalogue,
   '@/lib/supabaseAdmin':{isSupabaseConfigured:()=>false,readSafeJson:(name,fallback)=>
     name==='managed-profile-states.json'?{sample:{displayName:'fixture correction'}}:fallback}
 });
 const snapshot = await server.getCatalogueSnapshot();
 assert.deepEqual(Array.from(snapshot.offers, o=>o.id),['real']);
 assert.equal('sample' in snapshot.states,false);
});

test('the visitor snapshot honours withdrawals and reads every page of managed confirmations', async () => {
 const time = Date.now();
 const iso = minutes => new Date(time + minutes * 60_000).toISOString();
 const ids = ['first','future','hidden','late','stale','withdrawn'];
 const source = ids.map(id => ({id,rawName:id}));
 const local = {hidden:{paused:true},stale:{priceConfirmed:true,priceConfirmedAt:iso(-60),rate60Chf:125,
   availabilityConfirmed:true,availableUntil:iso(40)}};
 const initial = {availability_confirmed:true,availability_confirmed_at:iso(-20),available_until:iso(40),
   price_confirmed:true,price_confirmed_at:iso(-60),rate60_chf:275};
 const pages = [
   [{...initial,profile_id:'first'}, {...initial,profile_id:'future',price_confirmed_at:iso(5),availability_confirmed_at:iso(5)}],
   [{...initial,profile_id:'hidden'}, {...initial,profile_id:'late',availability_withdrawn_at:iso(-30)}],
   [{...initial,profile_id:'withdrawn',availability_withdrawn_at:iso(-2)}], []
 ];
 const requests = [];
 const server = moduleAt('src/lib/night-catalogue-server.ts', {
   '@/data/harvested-offers.json':source,'@/data/swiss-establishments-vault.json':[],'./night-catalogue':catalogue,
   '@/lib/supabaseAdmin':{isSupabaseConfigured:()=>true,readSafeJson:(name,fallback)=>name==='managed-profile-states.json'?local:fallback,
     supaFetch: async query => {requests.push(query);return {ok:true,data:pages.shift()};}}
 });
 const result = await server.getCatalogueSnapshot();
 assert.equal(requests.length,4);
 assert.match(requests[1],/profile_id=gt\.future/);
 assert.match(requests[3],/profile_id=gt\.withdrawn/);
 assert.equal(result.states.first.rate60Chf,275);
 assert.equal(result.states.first.availabilityConfirmed,true);
 assert.equal(result.states.future?.rate60Chf,undefined);
 assert.equal(result.states.future?.availabilityConfirmed,undefined);
 assert.equal(result.states.late.availabilityConfirmed,true);
 assert.equal(result.states.withdrawn.availabilityConfirmed,undefined);
 assert.equal(result.states.withdrawn.rate60Chf,275);
 assert.equal(result.states.stale?.rate60Chf,undefined);
 assert.equal(result.states.stale?.availabilityConfirmed,undefined);
 assert.equal(result.offers.some(o=>o.id==='stale'),true);
 assert.equal(result.offers.some(o=>o.id==='hidden'),false);
});

test('the visitor catalogue validates confirmation dates, withdrawal ordering and the four-hour window', () => {
 const now = Date.parse('2026-01-10T12:00:00Z');
 const iso = minutes => new Date(now + minutes * 60_000).toISOString();
 const active = {availabilityConfirmed:true,availabilityConfirmedAt:iso(-60),availableUntil:iso(180)};
 assert.equal(catalogue.isConfirmedAvailable(active,now),true);
 for (const change of [{availableUntil:iso(181)},{availableUntil:iso(0)},{availabilityConfirmedAt:iso(1)},
   {availabilityWithdrawnAt:iso(-60)},{availabilityWithdrawnAt:'invalid'},{removedByReport:true}]) {
   assert.equal(catalogue.isConfirmedAvailable({...active,...change},now),false);
 }
 assert.equal(catalogue.isConfirmedAvailable({...active,availabilityWithdrawnAt:iso(-61)},now),true);
 assert.equal(catalogue.isConfirmedAvailable({availabilityConfirmed:true,availableUntil:iso(60)},now),true);
 assert.equal(catalogue.isConfirmedAvailable({availabilityConfirmed:true,availableUntil:iso(60),availabilityWithdrawnAt:iso(-5)},now),false);
 assert.equal(catalogue.getProfileRate({priceConfirmed:true,priceConfirmedAt:iso(1),rate60Chf:175},60,now),null);
 assert.equal(catalogue.getProfileRate({rateConfirmed:true,rateUpdatedAt:iso(-1),rate60Chf:'175.50'},60,now),175.5);
 assert.equal(catalogue.getProfileRate({priceConfirmed:true,priceConfirmedAt:iso(-1),rate60Chf:true},60,now),null);
});

test('club projection removes blocked and hidden studios before serialization and exposes only public fields',async()=>{
 const clubs=[{id:'club-visible',name:'Public studio',ownerToken:'PRIVATE-TOKEN'}, {id:'club-hidden',name:'PRIVATE-HIDDEN-STUDIO'}, {id:'club-blocked',name:'PRIVATE-BLOCKED-STUDIO'}];
 const server=moduleAt('src/lib/night-catalogue-server.ts',{'@/data/harvested-offers.json':[],'@/data/swiss-establishments-vault.json':clubs,'./night-catalogue':catalogue,'@/lib/supabaseAdmin':{isSupabaseConfigured:()=>false,readSafeJson:(n,f)=>n==='managed-profile-states.json'?{'club-hidden':{paused:true}}:n==='do-not-import.json'?['club-blocked']:f}});
 const result=await server.getCatalogueSnapshot();
 assert.equal(result.clubs.length,1);assert.equal(result.clubs[0].id,'club-visible');assert.equal(JSON.stringify(result).includes('PRIVATE-'),false);
 assert.equal(fs.readFileSync(new URL('../src/pages/clubs.tsx',import.meta.url),'utf8').includes('swiss-establishments-vault.json'),false);
});
