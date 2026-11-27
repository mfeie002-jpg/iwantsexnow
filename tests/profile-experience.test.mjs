import test from 'node:test';
import assert from 'node:assert/strict';
import { stepPhotoIndex, showComparisonRow } from '../src/components/night/profile-experience-model.ts';

test('gallery wraps both ways and supports a single photo', () => {
  assert.equal(stepPhotoIndex(5, 1, 6), 0);
  assert.equal(stepPhotoIndex(0, -1, 6), 5);
  assert.equal(stepPhotoIndex(2, -1, 6), 1);
  assert.equal(stepPhotoIndex(0, 1, 1), 0);
});

test('gallery safely reconciles a changed or absent photo list', () => {
  assert.equal(stepPhotoIndex(5, 1, 2), 0);
  assert.equal(stepPhotoIndex(0, 1, 0), 0);
  assert.equal(stepPhotoIndex(NaN, 1, 3), 1);
  assert.equal(stepPhotoIndex(0, 1, -1), 0);
});

test('differences view removes equal known facts but keeps different values', () => {
  assert.equal(showComparisonRow(['Zürich', ' zürich '], true), false);
  assert.equal(showComparisonRow([200, 200], true), false);
  assert.equal(showComparisonRow([200, 300], true), true);
  assert.equal(showComparisonRow(['Zürich', 'Zug'], true), true);
  assert.equal(showComparisonRow(['Zürich', 'Zürich', 'Zug'], true), true);
});

test('missing evidence stays visible instead of being treated as equivalent facts', () => {
  assert.equal(showComparisonRow([null, null], true), true);
  assert.equal(showComparisonRow([null, 200], true), true);
  assert.equal(showComparisonRow(['Zürich'], true), true);
  assert.equal(showComparisonRow([200, 200], false), true);
});

test('mobile differences are evaluated against the currently displayed pair', () => {
  const values = new Map([['one', 'Zürich'], ['two', 'Zürich'], ['three', 'Zug']]);
  assert.equal(showComparisonRow(['one', 'two'].map(id => values.get(id)), true), false);
  assert.equal(showComparisonRow(['one', 'three'].map(id => values.get(id)), true), true);
});
