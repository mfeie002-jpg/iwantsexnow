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

test('club projection removes blocked and hidden studios before serialization and exposes only public fields',async()=>{
 const clubs=[{id:'club-visible',name:'Public studio',ownerToken:'PRIVATE-TOKEN'}, {id:'club-hidden',name:'PRIVATE-HIDDEN-STUDIO'}, {id:'club-blocked',name:'PRIVATE-BLOCKED-STUDIO'}];
 const server=moduleAt('src/lib/night-catalogue-server.ts',{'@/data/harvested-offers.json':[],'@/data/swiss-establishments-vault.json':clubs,'./night-catalogue':catalogue,'@/lib/supabaseAdmin':{isSupabaseConfigured:()=>false,readSafeJson:(n,f)=>n==='managed-profile-states.json'?{'club-hidden':{paused:true}}:n==='do-not-import.json'?['club-blocked']:f}});
 const result=await server.getCatalogueSnapshot();
 assert.equal(result.clubs.length,1);assert.equal(result.clubs[0].id,'club-visible');assert.equal(JSON.stringify(result).includes('PRIVATE-'),false);
 assert.equal(fs.readFileSync(new URL('../src/pages/clubs.tsx',import.meta.url),'utf8').includes('swiss-establishments-vault.json'),false);
});
