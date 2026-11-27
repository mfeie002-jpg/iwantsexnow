import test from 'node:test';
import assert from 'node:assert/strict';
import { favoriteRegionCounts, selectFavorites } from '../src/components/night/favorites-model.ts';

const entries = [
  { id: 'first', name: 'Zoe', city: 'Zug', canton: 'zg' },
  { id: 'second', name: 'Anna', city: 'Basel', canton: 'BS' },
  { id: 'third', name: 'Béa', city: '', canton: ' ZG ' },
  { id: 'fourth', name: 'Alina', city: 'Bern', canton: '' },
];

test('regional quick filters count only the actual shortlist and group missing regions', () => {
  assert.deepEqual(favoriteRegionCounts(entries), [{ key: 'ZG', count: 2 }, { key: 'BS', count: 1 }, { key: 'unknown', count: 1 }]);
  assert.deepEqual(selectFavorites(entries, 'ZG', 'saved').map(entry => entry.id), ['first', 'third']);
  assert.deepEqual(selectFavorites(entries, 'unknown', 'saved').map(entry => entry.id), ['fourth']);
});

test('saved order survives filtering and other sorting does not mutate it', () => {
  assert.deepEqual(selectFavorites(entries, 'all', 'name').map(entry => entry.name), ['Alina', 'Anna', 'Béa', 'Zoe']);
  assert.deepEqual(selectFavorites(entries, 'all', 'saved').map(entry => entry.id), ['first', 'second', 'third', 'fourth']);
  assert.deepEqual(entries.map(entry => entry.id), ['first', 'second', 'third', 'fourth']);
});

test('place sorting keeps missing places last without inventing a location', () => {
  assert.deepEqual(selectFavorites(entries, 'all', 'place').map(entry => entry.id), ['second', 'fourth', 'first', 'third']);
});

test('removed last item in a region leaves an honest filtered empty state', () => {
  const remaining = entries.filter(entry => entry.id !== 'second');
  assert.deepEqual(selectFavorites(remaining, 'BS', 'saved'), []);
  assert.equal(selectFavorites(remaining, 'all', 'saved').length, 3);
});

test('equal sort values preserve the user saved order', () => {
  const same = [{ id: 'later-name', name: 'Anna', city: 'Zürich', canton: 'ZH' }, { id: 'earlier-name', name: 'Anna', city: 'Zürich', canton: 'ZH' }];
  assert.deepEqual(selectFavorites(same, 'all', 'name').map(entry => entry.id), ['later-name', 'earlier-name']);
  assert.deepEqual(selectFavorites(same, 'all', 'place').map(entry => entry.id), ['later-name', 'earlier-name']);
});
