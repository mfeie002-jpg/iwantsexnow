import assert from 'node:assert/strict';
import test from 'node:test';
import {filtersFromQuery, isVisibleProfile, searchHref} from '../src/lib/night-catalogue.ts';
import {createPublicCataloguePage, InvalidCataloguePageRequest, parseCataloguePageOptions} from '../src/lib/night-catalogue-page.ts';

const confirmation = {
  claimed: true, ownershipVerifiedAt: '2025-01-01T00:00:00Z', ownershipVerifiedBy: 'test',
  priceConfirmed: true, priceConfirmedAt: '2025-01-02T00:00:00Z'
};
const rates = {
  below: {...confirmation, rate60Chf: 299.95},
  boundary: {...confirmation, rate60Chf: 300},
  unknown: {...confirmation, rate30Chf: 100},
  unconfirmed: {rate60Chf: 120},
  outside: {...confirmation, rate60Chf: 150}
};
const snapshot = {
  states: rates, blockedIds: [], clubs: [],
  offers: Object.keys(rates).map(id => ({id, canton:id === 'outside' ? 'BE' : 'ZH'}))
};

test('strict and inclusive budgets produce the same catalogue count, page and share link for their own boundary', () => {
  for (const [query, ids] of [
    [{under60:'300'}, ['below']],
    [{max60:'300'}, ['below','boundary']],
    [{max:'300'}, ['below','boundary']]
  ]) {
    const input = {canton:'ZH', ...query};
    const filters = filtersFromQuery(input);
    const link = new URL(searchHref(filters),'https://catalogue.invalid');
    const canonical = Object.fromEntries(link.searchParams);
    assert.deepEqual(filtersFromQuery(canonical), filters);
    const guided = createPublicCataloguePage(snapshot, {filters, offset:0, limit:24});
    const shared = createPublicCataloguePage(snapshot, parseCataloguePageOptions(canonical));
    const count = createPublicCataloguePage(snapshot, parseCataloguePageOptions({...input,count:'1'}));
    assert.deepEqual(guided.offers.map(o=>o.id), ids);
    assert.deepEqual(shared.offers, guided.offers);
    assert.equal(count.total, ids.length);
    assert.deepEqual(count.offers, []);
  }
});

test('visitor links normalize time aliases and preserve every selected constraint', () => {
  const input = {canton:'ZH', category:'massage', q:'Zug & Baar', under60:'299.95', now:'1', wa:'1', sort:'price'};
  const href = searchHref(parseCataloguePageOptions(input).filters);
  const params = Object.fromEntries(new URL(href,'https://catalogue.invalid').searchParams);
  assert.deepEqual(params, {canton:'ZH',category:'massage',q:'Zug & Baar',under60:'299.95',available:'1',wa:'1',sort:'price'});
  for (const [now, expected] of [['1',true],['true',true],['0',false],['false',false]]) {
    assert.equal(parseCataloguePageOptions({now}).filters.available,expected);
  }
  assert.equal(parseCataloguePageOptions({max:'300',max60:'300.00'}).filters.max,300);
});

test('invalid or conflicting Xenia filters cannot widen SSR or API searches', () => {
  for (const query of [
    {under60:['200','300']},{under60:''},{under60:'0'},{under60:'2e2'},{under60:'299.999'},
    {under60:'100001'},{max60:'NaN'},{max60:'-1'},{under60:'300',max:'300'},
    {under60:'300',max60:'300'},{max:'300',max60:'200'},{price:'missing',under60:'300'},
    {now:'yes'},{now:'1',available:'0'},{now:['1','0']}
  ]) {
    const filters = filtersFromQuery(query);
    assert.equal(filters.invalid,true);
    assert.equal(createPublicCataloguePage(snapshot,{filters,offset:0,limit:24}).total,0);
    assert.throws(()=>parseCataloguePageOptions(query),InvalidCataloguePageRequest);
  }
});

test('only test IDs or the primary example.com source mark a listing as a fixture', () => {
  for (const sample of [
    {id:'w4-test'}, {id:'id-one',dedupClusterId:'W4-test'},
    {id:'id-two',sourceUrl:'https://ExAmPlE.CoM:443/entry/7'},
    {id:'id-three',sourceUrl:'//%65xample.com./entry/8'}
  ]) assert.equal(isVisibleProfile(sample),false);
  for (const listing of [
    {id:'real',thumbnail:'https://example.com/missing.jpg'},
    {id:'real',sourceUrl:'https://real.example.ch/link/example.com'},
    {id:'real',sourceUrl:'https://listing.example.com/offer'},
    {id:'real',sourceUrl:'https://example.com.listing.ch/'},
    {id:'real',sourceUrl:'https://example.com@real.example.ch/'},
    {id:'real',sourceUrl:'unparseable'}
  ]) assert.equal(isVisibleProfile(listing),true);
});
