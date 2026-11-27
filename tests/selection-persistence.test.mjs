import test from 'node:test';
import assert from 'node:assert/strict';
import { FAVORITES_KEY, parseSelectionIds, readSelection, writeSelection, toggleSelection } from '../src/components/night/selection-persistence.ts';

test('both real catalogue ID families survive saving and reloading', () => {
  const values = new Map();
  const storage = { getItem: key => values.get(key) ?? null, setItem: (key, value) => values.set(key, value) };
  const ids = ['ch-f62306bf1ed6', 'xdate-live-544f502053'];
  assert.equal(writeSelection(storage, FAVORITES_KEY, ids), true);
  assert.deepEqual(readSelection(storage, FAVORITES_KEY), { ok: true, ids });
});
test('legacy objects are supported, duplicates and unsafe identifiers are excluded', () => {
  assert.deepEqual(parseSelectionIds(JSON.stringify(['ch-one', { id: 'xdate-live-two' }, 'ch-one', '../private', 'https://example.com', null, 15, { id: {} }, 'x'.repeat(129)])), ['ch-one', 'xdate-live-two']);
});
test('missing selections are empty, corrupt or inaccessible selections are not mistaken for empty', () => {
  assert.deepEqual(readSelection({ getItem: () => null }, FAVORITES_KEY), { ok: true, ids: [] });
  for (const raw of ['{', '{}', 'null']) assert.deepEqual(readSelection({ getItem: () => raw }, FAVORITES_KEY), { ok: false });
  assert.deepEqual(readSelection({ getItem: () => { throw new Error('Denied'); } }, FAVORITES_KEY), { ok: false });
  assert.equal(writeSelection({ setItem: () => { throw new Error('Quota'); } }, FAVORITES_KEY, ['ch-one']), false);
});
test('full comparison blocks a fourth addition but permits removal and replacement', () => {
  const ids = ['ch-one', 'ch-two', 'xdate-live-three'];
  const visible = new Set([...ids, 'ch-four']);
  assert.equal(toggleSelection(ids, 'ch-four', visible, 3).outcome, 'full');
  const removed = toggleSelection(ids, 'ch-two', visible, 3);
  assert.equal(removed.outcome, 'removed');
  assert.deepEqual(toggleSelection(removed.ids, 'ch-four', visible, 3).ids, ['ch-one', 'xdate-live-three', 'ch-four']);
  assert.deepEqual(ids, ['ch-one', 'ch-two', 'xdate-live-three']);
});
test('unavailable profiles cannot be newly selected but can be removed from a saved list', () => {
  assert.equal(toggleSelection([], 'ch-hidden', new Set()).outcome, 'unavailable');
  assert.equal(toggleSelection(['ch-hidden'], 'ch-hidden', new Set()).outcome, 'removed');
  assert.deepEqual(parseSelectionIds('["ch-no-longer-visible"]'), ['ch-no-longer-visible']);
});
