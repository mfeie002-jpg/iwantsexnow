import test from 'node:test';
import assert from 'node:assert/strict';
import {
  parseCataloguePageOptions,createPublicCataloguePage,
  InvalidCataloguePageRequest,MAX_CATALOGUE_PAGE_SIZE
} from '../src/lib/night-catalogue-page.ts';

const offers=[
 {id:'zh-one',canton:'ZH',rubric:'female',rawName:'Alpha',services:['gfe']},
 {id:'zg-one',canton:'ZG',rubric:'massage',rawName:'Bravo',services:['outcall']},
 {id:'zg-two',canton:'ZG',rubric:'female',rawName:'Charlie',services:['gfe']},
 {id:'zg-hidden',canton:'ZG',rubric:'female',rawName:'Secret',services:['gfe']},
 {id:'zg-blocked',canton:'ZG',rubric:'female',rawName:'Removed',services:['gfe']}
];
const snapshot={
 offers,clubs:[],blockedIds:['zg-blocked'],
 states:{
  'zg-one':{rate60Chf:300,priceConfirmed:true,priceConfirmedAt:'2026-11-27T00:00:00Z'},
  'zg-hidden':{hidden:true,displayName:'PRIVATE VALUE'},
  'zg-blocked':{displayName:'SHOULD BE BLOCKED'}
 }
};

test('parser accepts bounded offset and count-only selectors',()=>{
 const a=parseCataloguePageOptions({canton:'ZG',category:'female',offset:'2',limit:'1'});
 assert.equal(a.filters.canton,'ZG'); assert.equal(a.offset,2); assert.equal(a.limit,1);
 const count=parseCataloguePageOptions({count:'1',canton:'ZG'});
 assert.equal(count.countOnly,true);assert.equal(count.limit,24);
 assert.equal(MAX_CATALOGUE_PAGE_SIZE,48);
});

test('parser rejects duplicate, malformed, unsupported, and oversized selectors',()=>{
 for(const q of [
  {canton:['ZH','ZG']},{offset:'-1'},{offset:'Infinity'},{offset:'9999999'},
  {limit:'49'},{limit:'0'},{limit:'2.5'},{count:'2'}, {service:'unknown'},
  {category:'not-a-category'},{q:['abc']},{who:'anything'},{max:'Infinity'}
 ]){
  assert.throws(()=>parseCataloguePageOptions(q),InvalidCataloguePageRequest);
 }
});

test('pagination preserves ordering and truthful total across matching filters',()=>{
 const opts={filters:{canton:'ZG'},offset:0,limit:1};
 const first=createPublicCataloguePage(snapshot,opts);
 assert.equal(first.total,2);
 assert.equal(first.offers.length,1);
 assert.equal(first.offers[0].id,'zg-one');
 assert.equal(first.nextOffset,1);
 assert.ok(!JSON.stringify(first).includes('PRIVATE VALUE'));
 const second=createPublicCataloguePage(snapshot,{...opts,offset:1});
 assert.equal(second.offers[0].id,'zg-two');
 assert.equal(second.nextOffset,null);
 assert.deepEqual(Object.keys(second.states),[]);
});

test('count-only returns no profiles, no contact data and correct filtered count',()=>{
 const a=createPublicCataloguePage(snapshot,{filters:{canton:'ZG',category:'female'},offset:0,limit:24,countOnly:true});
 assert.equal(a.total,1);assert.deepEqual(a.offers,[]);assert.deepEqual(a.states,{});assert.equal(a.nextOffset,null);
});

test('service and price filtering apply before server-side slicing',()=>{
 const services=createPublicCataloguePage(snapshot,{filters:{canton:'ZG'},offset:0,limit:24,service:'gfe'});
 assert.deepEqual(services.offers.map(o=>o.id),['zg-two']);
 const priced=createPublicCataloguePage(snapshot,{filters:{max:350},offset:0,limit:24});
 assert.deepEqual(priced.offers.map(o=>o.id),['zg-one']);
 const unknown=createPublicCataloguePage(snapshot,{filters:{max:250},offset:0,limit:24});
 assert.equal(unknown.total,0);
});

test('negative and invalid filters cannot expand visibility',()=>{
 const invalid=createPublicCataloguePage(snapshot,{filters:{invalid:true},offset:0,limit:24});
 assert.equal(invalid.total,0);assert.deepEqual(invalid.offers,[]);
});

test('paged HTTP API is private, constrained, and keeps a consistent count',async()=>{
 const base=(process.env.IWSN_TEST_BASE_URL||'http://127.0.0.1:4181').replace(/\/$/,'');
 const response=await fetch(base+'/api/catalogue/page?canton=ZG&limit=2',{signal:AbortSignal.timeout(30000)});
 assert.equal(response.status,200);
 assert.match(response.headers.get('cache-control')||'',/no-store/);
 const body=await response.json();
 assert.ok(body.total>=body.offers.length);
 assert.ok(body.offers.length<=2);
 assert.ok(body.nextOffset===2||body.nextOffset===null);
 const count=await(await fetch(base+'/api/catalogue/page?canton=ZG&count=1')).json();
 assert.equal(count.total,body.total);
 assert.deepEqual(count.offers,[]);
 assert.deepEqual(count.states,{});
 const invalid=await fetch(base+'/api/catalogue/page?canton=ZG&canton=ZH');
 assert.equal(invalid.status,400);
 const oversized=await fetch(base+'/api/catalogue/page?limit=1000');
 assert.equal(oversized.status,400);
 const method=await fetch(base+'/api/catalogue/page',{method:'POST'});
 assert.equal(method.status,405);
});

test('selected catalogue API returns only requested, still-visible IDs',async()=>{
 const base=(process.env.IWSN_TEST_BASE_URL||'http://127.0.0.1:4181').replace(/\/$/,'');
 const first=await(await fetch(base+'/api/catalogue/page?limit=2')).json();
 assert.equal(first.offers.length,2);
 const id=first.offers[0].id;
 const options={
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({ids:[id,'definitely-unknown-id',id]})
 };
 const r=await fetch(base+'/api/catalogue/selected',options);
 assert.equal(r.status,200);
 assert.match(r.headers.get('cache-control')||'',/no-store/);
 const data=await r.json();
 assert.equal(data.requested,2);
 assert.deepEqual(data.offers.map(o=>o.id),[id]);
 assert.ok(!JSON.stringify(data).includes('ownerToken'));
 assert.ok(!JSON.stringify(data).includes('lastReport'));
 const invalid=await fetch(base+'/api/catalogue/selected',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({ids:['../secret']})
 });
 assert.equal(invalid.status,400);
 const oversized=await fetch(base+'/api/catalogue/selected',{
  method:'POST',headers:{'content-type':'application/json'},
  body:JSON.stringify({ids:Array.from({length:101},(_,i)=>'ch-'+i)})
 });
 assert.equal(oversized.status,400);
 const wrongOrigin=await fetch(base+'/api/catalogue/selected',{
  method:'POST',headers:{'content-type':'application/json',origin:'https://attacker.example'},
  body:JSON.stringify({ids:[id]})
 });
 assert.equal(wrongOrigin.status,403);
 const method=await fetch(base+'/api/catalogue/selected');
 assert.equal(method.status,405);
});
