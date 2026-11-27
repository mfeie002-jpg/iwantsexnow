import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {formatSwissCount} from '../src/lib/format-swiss-count.ts';

test('Swiss count uses a fixed U+2019 separator for hydration', () => {
  assert.equal(formatSwissCount(2578), '2\u2019578');
  assert.equal(formatSwissCount(999), '999');
  assert.equal(formatSwissCount(1000), '1\u2019000');
  assert.equal(formatSwissCount(1000000), '1\u2019000\u2019000');
  assert.equal(formatSwissCount(0), '0');
  assert.equal(formatSwissCount(-2578), '-2\u2019578');
});

test('count formatting never depends on locale APIs', () => {
  const original = Number.prototype.toLocaleString;
  try {
    Number.prototype.toLocaleString = () => { throw new Error('locale API called'); };
    assert.equal(formatSwissCount(2578), '2\u2019578');
  } finally { Number.prototype.toLocaleString = original; }
});

test('the affected server-rendered count displays use the shared formatter', () => {
  for (const path of ['src/pages/index.tsx', 'src/components/night/DiscoveryPages.tsx', 'src/components/night/NightShell.tsx']) {
    const source = readFileSync(new URL('../' + path, import.meta.url), 'utf8');
    assert.match(source, /formatSwissCount\(/);
    assert.doesNotMatch(source, /\.toLocaleString\(['\x22]de-CH['\x22]\)/);
  }
});
