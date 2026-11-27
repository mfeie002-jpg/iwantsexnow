import test from 'node:test';
import assert from 'node:assert/strict';
import { guideFilters, skipGuideStep, quickRoutes, QUICK_ROUTES } from '../src/lib/night-guide-model.ts';
import { filterOffers, searchHref } from '../src/lib/night-catalogue.ts';

test('a fresh guide includes only visible region, category and price choices', () => {
  const result = guideFilters({ canton:'ZG', category:'massage', max:400, q:'hidden text', available:true, wa:true, sort:'price', invalid:true });
  assert.deepEqual(result, { canton:'ZG', category:'massage', max:400, price:'' });
  assert.equal(searchHref(result), '/search?canton=ZG&category=massage&max=400');
});

test('price on request clears an incompatible inherited maximum', () => {
  assert.deepEqual(guideFilters({ max:200, price:'missing' }), { canton:'ALL', category:'all', max:0, price:'missing' });
});

test('skipping a populated step clears its actual restriction without clearing other steps', () => {
  const input = { canton:'ZG', category:'massage', max:400, price:'missing' };
  assert.deepEqual(skipGuideStep(input,0), { ...input, canton:'ALL' });
  assert.deepEqual(skipGuideStep(input,1), { ...input, category:'all' });
  assert.deepEqual(skipGuideStep(input,2), { ...input, max:0, price:'' });
  assert.equal(input.canton, 'ZG');
});

test('opening the price step restores real matches without fabricating confirmed prices', () => {
  const offers = [{id:'ch-one',canton:'ZG',rubric:'massage'},{id:'ch-two',canton:'ZH',rubric:'massage'},{id:'ch-three',canton:'ZG',rubric:'female'}];
  const filtered = guideFilters({canton:'ZG',category:'massage',max:400});
  assert.equal(filterOffers(offers,filtered).length,0);
  assert.equal(filterOffers(offers,skipGuideStep(filtered,2)).length,1);
});

test('palette search matches all words and all no-input navigation targets are internal', () => {
  assert.equal(quickRoutes('').length,QUICK_ROUTES.length);
  assert.deepEqual(quickRoutes('profile vergleichen').map(r=>r.href),['/compare-escorts']);
  assert.deepEqual(quickRoutes('MERKLISTE').map(r=>r.href),['/favorites']);
  assert.equal(quickRoutes('does not exist').length,0);
  assert.ok(QUICK_ROUTES.every(r=>r.href.startsWith('/')&&!r.href.startsWith('//')));
  assert.equal(new Set(QUICK_ROUTES.map(r=>r.href)).size,QUICK_ROUTES.length);
});
