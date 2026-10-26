import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { test } from 'node:test';
import ts from 'typescript';

const root = process.cwd();

function fixture() {
  const reads = [], writes = [];
  const disk = {
    existsSync: () => true,
    readFileSync(file) {
      reads.push(file);
      return file.endsWith('private-reports-log.json') ? '[]' : JSON.stringify({
        metrics: { 'synthetic-record': { views: 3 } },
        states: { 'synthetic-record': {
          ownerToken: 'synthetic-retired-token',
          lastReport: { details: 'synthetic confidential evidence' },
          displayName: 'synthetic private draft', hidden: true,
        } },
      });
    },
    writeFileSync(file) {
      writes.push(file);
      throw new Error('synthetic storage failure');
    },
  };
  const cache = new Map();
  function load(file) {
    if (cache.has(file)) return cache.get(file).exports;
    const module = { exports: {} };
    cache.set(file, module);
    const source = ts.transpileModule(fs.readFileSync(file, 'utf8'), {
      fileName: file,
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true },
    }).outputText;
    const scopedRequire = (id) => {
      if (id === 'fs') return disk;
      if (id === 'path') return path;
      if (id === 'crypto') return { randomBytes: (n) => Buffer.alloc(n, 1) };
      if (id.startsWith('@/')) return load(path.join(root, 'src', id.slice(2)) + '.ts');
      if (id.startsWith('.')) return load(path.resolve(path.dirname(file), id) + '.ts');
      throw new Error('Unexpected runtime dependency: ' + id);
    };
    vm.runInNewContext(source, { module, exports: module.exports, require: scopedRequire, process: { cwd: () => root }, console, Buffer }, { filename: file });
    return module.exports;
  }
  const api = load(path.join(root, 'src/pages/api/vault/metrics.ts'));
  async function call(method, body) {
    const response = { code: 0, headers: {}, body: undefined,
      setHeader(name, value) { this.headers[name.toLowerCase()] = value; },
      status(code) { this.code = code; return this; },
      json(value) { this.body = JSON.parse(JSON.stringify(value)); return this; },
    };
    await api.default({ method, body, headers: {} }, response);
    return response;
  }
  return { call, api, reads, writes };
}

test('public read never loads legacy files or exposes private state', async () => {
  const f = fixture();
  const r = await f.call('GET');
  assert.equal(r.code, 200);
  assert.deepEqual(r.body, { ok: true, metrics: {}, states: {}, measurementStatus: 'unavailable' });
  assert.deepEqual(f.reads, []);
  assert.deepEqual(f.writes, []);
  assert.match(r.headers['cache-control'], /no-store/);
  assert.equal(r.headers['referrer-policy'], 'no-referrer');
});

for (const [action, profileId, extra] of [
  ['claim_or_create_profile', 'unowned-synthetic-record', {}],
  ['claim_or_create_profile', 'synthetic-record', { ownerToken: 'synthetic-retired-token' }],
  ['update_profile_fields', 'synthetic-record', { ownerToken: 'synthetic-retired-token', identityVerified: true }],
  ['confirm_availability_4h', 'synthetic-record', { ownerToken: 'synthetic-retired-token' }],
  ['update_profile_state', 'synthetic-record', { role: 'admin' }],
  ['resolve_case', 'synthetic-record', { role: 'admin' }],
]) {
  test('retired action cannot establish authority: ' + action + '/' + profileId, async () => {
    const f = fixture();
    const r = await f.call('POST', { action, profileId, ...extra });
    assert.equal(r.code, 410);
    assert.deepEqual(r.body, { ok: false, error: 'LEGACY_FLOW_RETIRED' });
    assert.deepEqual(f.reads, []);
    assert.deepEqual(f.writes, []);
    assert.match(r.headers['cache-control'], /no-store/);
  });
}

test('failed/unavailable report storage never returns success or a case number', async () => {
  const f = fixture();
  const r = await f.call('POST', { action: 'report_or_optout', profileId: 'synthetic-record',
    reason: 'remove_own_entry', details: 'synthetic confidential evidence' });
  assert.equal(r.code, 410);
  assert.equal(r.body.ok, false);
  assert.equal(r.body.caseId, undefined);
  assert.deepEqual(f.reads, []);
  assert.deepEqual(f.writes, []);
});

test('retired counters cannot acknowledge unsaved events', async () => {
  for (const action of ['track_view', 'track_click', 'track_source_out', 'track_contact']) {
    const f = fixture();
    const r = await f.call('POST', { action, profileId: 'synthetic-record' });
    assert.equal(r.code, 410);
    assert.equal(r.body.ok, false);
    assert.deepEqual(f.writes, []);
  }
});

test('invalid input and unsupported methods fail explicitly with bounded input', async () => {
  const f = fixture();
  for (const body of [undefined, null, [], '{invalid-json', {}, { action: 'unknown', profileId: 'synthetic-record' }]) {
    assert.equal((await f.call('POST', body)).code, 400);
  }
  const r = await f.call('PUT', {});
  assert.equal(r.code, 405);
  assert.equal(r.headers.allow, 'GET, POST');
  assert.equal(f.api.config.api.bodyParser.sizeLimit, '4kb');
  assert.deepEqual(f.writes, []);
});
