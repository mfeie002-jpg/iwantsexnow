import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';
import {createRequire} from 'node:module';
const require = createRequire(import.meta.url);
const ts = require('typescript');

function loadAdmin(fetcher, abortSignal) {
  const source = fs.readFileSync(new URL('../src/lib/supabaseAdmin.ts', import.meta.url), 'utf8');
  const code = ts.transpileModule(source, {compilerOptions: {target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS, esModuleInterop: true}}).outputText;
  const context = {
    exports: {}, fetch: fetcher, AbortSignal: abortSignal,
    process: {env: {SUPABASE_URL: 'https://example.invalid', SUPABASE_SERVICE_ROLE_KEY: 'synthetic-test-key'}},
    require(name) { if (['fs', 'path', 'crypto'].includes(name)) return {}; throw Error('Unexpected dependency ' + name); }
  };
  vm.runInNewContext(code, context);
  return context.exports;
}
function deferred() {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return {promise, resolve};
}
function untilAborted(signal) {
  return new Promise((_resolve, reject) => {
    if (signal.aborted) reject(signal.reason);
    else signal.addEventListener('abort', () => reject(signal.reason), {once: true});
  });
}
const plain = value => JSON.parse(JSON.stringify(value));

test('report database deadline aborts a stalled connection without retry or success', async () => {
  const controller = new AbortController(), started = deferred(), deadlines = [];
  let calls = 0;
  const admin = loadAdmin(async (_url, options) => {
    calls++; started.resolve(); return untilAborted(options.signal);
  }, {timeout(ms) { deadlines.push(ms); return controller.signal; }});
  const pending = admin.supaFetch('iwsn_report_cases', {method: 'POST', body: {case_id: 'synthetic'}, timeoutMs: 10000});
  await started.promise;
  controller.abort(new Error('Private upstream transport detail'));
  assert.deepEqual(plain(await pending), {ok: false, data: null, error: 'UPSTREAM_TIMEOUT'});
  assert.deepEqual(deadlines, [10000]);
  assert.equal(calls, 1);
});

test('report deadline remains active while reading successful or failed response bodies', async () => {
  for (const ok of [true, false]) {
    const controller = new AbortController(), readingBody = deferred();
    let calls = 0;
    const admin = loadAdmin(async (_url, options) => {
      calls++;
      return {ok, text() { readingBody.resolve(); return untilAborted(options.signal); }};
    }, {timeout() { return controller.signal; }});
    const pending = admin.supaFetch('iwsn_report_cases', {method: 'POST', timeoutMs: 10000});
    await readingBody.promise;
    controller.abort(new Error('Body stalled'));
    assert.deepEqual(plain(await pending), {ok: false, data: null, error: 'UPSTREAM_TIMEOUT'});
    assert.equal(calls, 1);
  }
});

test('a completed report write retains its confirmed response and request contract', async () => {
  const controller = new AbortController();
  const row = {case_id: 'synthetic-case', status: 'RECEIVED'};
  let request;
  const admin = loadAdmin(async (url, options) => {
    request = {url, options};
    return {ok: true, text: async () => JSON.stringify([row])};
  }, {timeout(ms) { assert.equal(ms, 10000); return controller.signal; }});
  assert.deepEqual(plain(await admin.supaFetch('iwsn_report_cases', {method: 'POST', body: row, timeoutMs: 10000})), {ok: true, data: [row]});
  assert.equal(request.url, 'https://example.invalid/rest/v1/iwsn_report_cases');
  assert.equal(request.options.signal, controller.signal);
  assert.equal(request.options.method, 'POST');
  assert.equal(request.options.headers.Prefer, 'return=representation');
  assert.deepEqual(JSON.parse(request.options.body), row);
});

test('unmodified database callers do not opt in to a deadline or change their request', async () => {
  let request;
  const admin = loadAdmin(async (_url, options) => {
    request = options;
    return {ok: true, text: async () => '[]'};
  }, {timeout() { throw Error('Unexpected deadline for existing caller'); }});
  assert.deepEqual(plain(await admin.supaFetch('managed_profile_states?select=*')), {ok: true, data: []});
  assert.equal('signal' in request, false);
  assert.equal(request.method, 'GET');
  assert.equal(request.body, undefined);
});
