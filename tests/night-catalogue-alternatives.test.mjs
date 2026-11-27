import assert from 'node:assert/strict';
import test from 'node:test';
import {createPublicCataloguePage} from '../src/lib/night-catalogue-page.ts';

const filters = {canton:'ZH', category:'massage', q:'atelier', under60:300, available:true, sort:'region'};
const options = {filters, offset:0, limit:1, service:'outcall'};
const now = Date.now();
const iso = milliseconds => new Date(milliseconds).toISOString();
const price = amount => ({ priceConfirmed:true, priceConfirmedAt:iso(now-3600000), rate60Chf:amount });
const current = {
  availabilityConfirmed:true, availabilityConfirmedAt:iso(now-600000), availableUntil:iso(now+3600000)
};
const row = (id, fields={}) => ({id, canton:'ZH', rubric:'massage', rawName:'Atelier', services:['outcall'], ...fields});
const snapshot = {
  offers:[
    row('below'), row('also-below'), row('at-limit'), row('outside',{canton:'BE'}), row('hidden'),
    row('unrelated',{rawName:'Andere Auswahl'}), row('unavailable-service',{services:[]}), row('blocked')
  ],
  states:{
    below:price(240), 'also-below':price(280), 'at-limit':{...current,...price(300)},
    outside:current, hidden:{hidden:true, ...current}, unrelated:current, 'unavailable-service':current
  },
  clubs:[], blockedIds:['blocked']
};

test('each one-condition choice leads to exactly its advertised total in the same search scope', () => {
  const empty = createPublicCataloguePage(snapshot,options);
  assert.equal(empty.total,0);
  assert.deepEqual(empty.alternatives.map(a=>[a.label,a.total]), [
    ['Zeitfenster offen lassen',2], ['Budget offen lassen',1]
  ]);
  for (const choice of empty.alternatives) {
    assert.equal(choice.filters.canton,'ZH');
    assert.equal(choice.filters.q,'atelier');
    assert.equal(choice.filters.category,'massage');
    assert.equal(choice.filters.sort,'region');
    assert.equal(createPublicCataloguePage(snapshot,{...options,filters:choice.filters}).total,choice.total);
  }
});

test('offers the combined change only if both single changes still return zero', () => {
  const noEvidence = {...snapshot,states:{hidden:{hidden:true}}};
  const empty = createPublicCataloguePage(noEvidence,options);
  assert.deepEqual(empty.alternatives.map(a=>[a.label,a.total]),[['Budget und Zeitfenster offen lassen',3]]);
  assert.equal(empty.alternatives[0].filters.available,false);
  assert.equal(empty.alternatives[0].filters.under60,0);
  for (const query of [{...filters,canton:'TI'}, {...filters,invalid:true}]) {
    assert.equal(createPublicCataloguePage(noEvidence,{...options,filters:query}).alternatives,undefined);
  }
});

test('count-only, nonempty and subsequent pages contain no recovery suggestions', () => {
  assert.equal(createPublicCataloguePage(snapshot,{...options,countOnly:true}).alternatives,undefined);
  assert.equal(createPublicCataloguePage(snapshot,{...options,offset:5}).alternatives,undefined);
  assert.equal(createPublicCataloguePage(snapshot,{...options,filters:{...filters,under60:350}}).alternatives,undefined);
});

test('availability deadline covers matching rows beyond the first page and counted alternatives', () => {
  const firstExpiry = now + 12 * 60_000;
  const laterExpiry = now + 30 * 60_000;
  const active = expiry => ({...current,availableUntil:iso(expiry)});
  const sample = {
    offers:[row('a-later'),row('b-sooner'),row('other',{canton:'BE'}),row('hidden')],
    states:{'a-later':active(laterExpiry),'b-sooner':active(firstExpiry),
      other:active(now+2000),hidden:{...active(now+1000),hidden:true}},
    clubs:[],blockedIds:[]
  };
  const available = {filters:{canton:'ZH',available:true},offset:0,limit:1};
  const first = createPublicCataloguePage(sample,available);
  assert.deepEqual(first.offers.map(o=>o.id),['a-later']);
  assert.equal(first.nextAvailabilityExpiry,firstExpiry);
  const count = createPublicCataloguePage(sample,{...available,countOnly:true});
  assert.deepEqual(count.states,{});assert.deepEqual(count.offers,[]);
  assert.equal(count.total,2);assert.equal(count.nextAvailabilityExpiry,firstExpiry);
  const zero = createPublicCataloguePage(sample,{...available,filters:{...available.filters,under60:200}});
  assert.equal(zero.total,0);
  assert.equal(zero.alternatives[0].total,2);
  assert.equal(zero.nextAvailabilityExpiry,firstExpiry);
  assert.equal(createPublicCataloguePage(sample,{...available,filters:{canton:'ZH'}}).nextAvailabilityExpiry,undefined);
  assert.equal(createPublicCataloguePage(sample,{...available,filters:{canton:'BE',under60:100}}).nextAvailabilityExpiry,undefined);
});
