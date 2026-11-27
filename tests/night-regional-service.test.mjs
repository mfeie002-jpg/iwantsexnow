import test from 'node:test';
import assert from 'node:assert/strict';
import {discoveryFiltersFromRoute, filterOffers, filtersFromQuery, searchHref} from '../src/lib/night-catalogue.ts';
import {createPublicCataloguePage, parseCataloguePageOptions} from '../src/lib/night-catalogue-page.ts';

const regionalPath = '/kategorie/zuerich/dinner-date';
const routeQuery = {city:'zuerich', service:'dinner-date'};
const forced = {canton:'ZH', service:'dinner'};
const snapshot = {
  offers:[
    {id:'d1', canton:'ZH', rawName:'Atelier', services:['dinner']},
    {id:'d2', canton:'ZH', rawName:'Atelier Dinner'},
    {id:'local-other', canton:'ZH', rawName:'Atelier', services:['outcall']},
    {id:'other-region', canton:'BE', rawName:'Atelier', services:['dinner']}
  ],
  states:{}, blockedIds:[], clubs:[]
};

test('the regional page, shared URL, API count and pagination use the same service', () => {
  const f = discoveryFiltersFromRoute({...routeQuery, q:'Atelier'}, forced, regionalPath + '?q=Atelier');
  const url = new URL(searchHref(f),'https://test.invalid');
  const query = Object.fromEntries(url.searchParams);
  assert.equal(query.service,'dinner');
  assert.equal(query.canton,'ZH');
  assert.equal(query.q,'Atelier');
  const parsed = filtersFromQuery(query);
  assert.deepEqual(filterOffers(snapshot.offers,parsed).map(o=>o.id),['d1','d2']);
  for (const offset of [0,1]) {
    const options = parseCataloguePageOptions({...query,offset:String(offset),limit:'1'});
    const page = createPublicCataloguePage(snapshot,options);
    assert.equal(page.total,2);
    assert.equal(page.offers[0].id,'d'+(offset+1));
  }
  const count = createPublicCataloguePage(snapshot,parseCataloguePageOptions({...query,count:'1'}));
  assert.equal(count.total,2);
  assert.deepEqual(count.offers,[]);
});

test('category slugs and explicit service filters have separate meanings', () => {
  const noService = discoveryFiltersFromRoute(
    {service:'tantra-massage'}, {canton:'ZH',category:'massage'}, '/kategorie/zuerich/tantra-massage'
  );
  assert.equal(noService.service,undefined);
  assert.ok(!noService.invalid);
  const explicit = service => discoveryFiltersFromRoute(routeQuery, forced, regionalPath + service);
  assert.ok(!explicit('?service=dinner').invalid);
  for (const query of ['?service=outcall','?service=dinner&service=dinner','?service=missing']) {
    assert.equal(explicit(query).invalid,true);
  }
  for (const service of [['dinner','outcall'],'dinner-date','constructor']) {
    assert.throws(()=>parseCataloguePageOptions({service}));
    assert.equal(filtersFromQuery({service}).invalid,true);
  }
});

test('older page callers retain the service in alternative links and conflicting scopes stay empty', () => {
  const options = {filters:{canton:'ZH', under60:300, available:true},service:'dinner',offset:0,limit:24};
  const empty = createPublicCataloguePage(snapshot,options);
  assert.equal(empty.alternatives.length,1);
  const alternative = empty.alternatives[0];
  assert.equal(alternative.filters.service,'dinner');
  assert.equal(alternative.total,2);
  const query = Object.fromEntries(new URL(searchHref(alternative.filters),'https://test.invalid').searchParams);
  assert.equal(createPublicCataloguePage(snapshot,parseCataloguePageOptions(query)).total,2);
  const conflicting = createPublicCataloguePage(snapshot,{...options,filters:{service:'outcall'}});
  assert.equal(conflicting.total,0);
});
