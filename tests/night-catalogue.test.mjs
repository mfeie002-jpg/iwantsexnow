import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {filterOffers,filtersFromQuery,searchHref,getProfilePhotos,getProfileRate,isConfirmedAvailable} from '../src/lib/night-catalogue.ts';
const offers=[{id:'one',rawName:'Zürich A',canton:'ZH',city:'Zürich',rubric:'female',thumbnail:'https://images.xdate.ch/original-one.jpg'}, {id:'two',canton:'BS',city:'Basel',rubric:'female'}, {id:'three',canton:'ZH',rubric:'massage'}];
test('region and category intersect; empty selections never import unrelated profiles',()=>{
 assert.deepEqual(filterOffers(offers,{canton:'ZH',category:'female'}).map(x=>x.id),['one']);
 assert.deepEqual(filterOffers(offers,{canton:'BS',category:'massage'}),[]);
 assert.deepEqual(filterOffers(offers,{q:'nicht vorhanden'}),[]);
});
test('hidden, paused, removed and blocked profiles never appear',()=>{
 for(const state of [{hidden:true},{paused:true},{removedByReport:true}])assert.equal(filterOffers(offers,{}, {one:state}).some(o=>o.id==='one'),false);
 assert.equal(filterOffers(offers,{}, {},['one']).some(o=>o.id==='one'),false);
});
test('seeded prices do not become confirmed prices or fit a budget',()=>{
 const seeded={rate30Chf:100,rate60Chf:200};assert.equal(getProfileRate(seeded,60),null);
 assert.equal(getProfileRate({...seeded,priceConfirmed:true},60),null);
 assert.equal(getProfileRate({...seeded,priceConfirmed:true,priceConfirmedAt:'invalid'},60),null);
 assert.equal(getProfileRate({...seeded,priceConfirmed:true,priceConfirmedAt:'2026-11-27T10:00:00Z'},60),200);
 assert.equal(filterOffers(offers,{max:400},{one:seeded}).length,0);
 assert.equal(filterOffers(offers,{price:'missing'},{one:seeded}).length,3);
});
test('availability requires an explicit flag and future expiry',()=>{
 const now=Date.parse('2026-11-27T11:00:00Z');
 assert.equal(isConfirmedAvailable({availabilityConfirmed:true},now),false);
 assert.equal(isConfirmedAvailable({availabilityConfirmed:true,availableUntil:'2026-11-27T10:59:00Z'},now),false);
 assert.equal(isConfirmedAvailable({availabilityConfirmed:true,availableUntil:'2026-11-27T12:00:00Z'},now),true);
 assert.equal(isConfirmedAvailable({availabilityConfirmed:true,availableUntil:'2026-11-27T12:00:00Z',hidden:true},now),false);
});
test('touch choices survive URL navigation with safe encoding',()=>{
 const choice={canton:'ZG',category:'massage',max:400,q:'Baar & Cham'};
 const url=new URL(searchHref(choice),'https://preview.invalid');
 const back=filtersFromQuery(Object.fromEntries(url.searchParams));
 for(const key of Object.keys(choice))assert.equal(back[key],choice[key]);
 assert.equal(filtersFromQuery({max:'Infinity',q:['a','b']}).max,0);
 assert.equal(searchHref({}),'/search');
});
test('profile media excludes AI, stock and blurred placeholders while retaining real galleries',()=>{
 const input={thumbnail:'/images/ai/portraits/p1.webp',gallery:['https://images.unsplash.com/photo.jpg','https://images.xdate.ch/bg_blur_a.jpg','https://images.xdate.ch/real-a.jpg','https://images.xdate.ch/real-a.jpg']};
 assert.deepEqual(getProfilePhotos(input),['https://images.xdate.ch/real-a.jpg']);
});
test('existing source inventory retains all IDs; seeded states produce no false price or live promises',()=>{
 const original=JSON.parse(fs.readFileSync(new URL('../src/data/harvested-offers.json',import.meta.url),'utf8'));
 const states=JSON.parse(fs.readFileSync(new URL('../src/data/managed-profile-states.json',import.meta.url),'utf8'));
 assert.equal(original.length,2589);assert.equal(new Set(original.map(o=>o.id||o.dedupClusterId)).size,2589);
 assert.equal(Object.values(states).filter(s=>getProfileRate(s,60)!==null).length,0);
 assert.equal(Object.values(states).filter(s=>isConfirmedAvailable(s)).length,0);
});
