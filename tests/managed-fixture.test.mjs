import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import http from 'node:http';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { withManagedFixture, listenLoopback } from '../scripts/lib/managed-fixture.mjs';

async function setup(t) {
  const parent = await fs.realpath(os.tmpdir());
  const base = await fs.mkdtemp(path.join(parent, 'iwant-fixture-safety-'));
  t.after(async () => {
    const relative = path.relative(parent, base);
    assert(relative.startsWith('iwant-fixture-safety-') && !relative.includes(path.sep) && !path.isAbsolute(relative));
    assert.equal(await fs.realpath(base), base);
    await fs.rm(base, { recursive: true, force: true });
  });
  const root = path.join(base, 'temporary');
  const cwd = path.join(root, 'checkout');
  const fixturePath = path.join(root, 'fixture.json');
  await fs.mkdir(cwd, { recursive: true });
  await fs.writeFile(fixturePath, JSON.stringify({ synthetic: true }), { mode: 0o600 });
  return { base, root, cwd, fixturePath, options: { enabled: '1', cwd, fixturePath, temporaryRoot: root } };
}
async function absent(file) {
  await assert.rejects(fs.stat(file), { code: 'ENOENT' });
}
async function symlinkOrSkip(t, target, link, type) {
  try { await fs.symlink(target, link, type); return true; }
  catch (error) {
    if (process.platform === 'win32' && error.code === 'EPERM') {
      t.skip('Windows symlink privilege unavailable; Linux CI covers this case');
      return false;
    }
    throw error;
  }
}

test('explicit opt-in is checked before touching fixture paths', async () => {
  await assert.rejects(withManagedFixture({ cwd: 'missing', fixturePath: 'missing' }, () => {}), /opt-in required/);
});
test('relative credential paths are refused', async t => {
  const { options } = await setup(t);
  await assert.rejects(withManagedFixture({ ...options, fixturePath: 'fixture.json' }, () => {}), /Absolute temporary/);
});
test('valid fixture is available only during the callback and removed afterwards', async t => {
  const { options, fixturePath } = await setup(t);
  const value = await withManagedFixture(options, async data => {
    assert.deepEqual(data, { synthetic: true });
    assert((await fs.stat(fixturePath)).isFile());
    return 'completed';
  });
  assert.equal(value, 'completed');
  await absent(fixturePath);
});
test('invalid JSON is removed without disclosing its credential contents', async t => {
  const { options, fixturePath } = await setup(t);
  await fs.writeFile(fixturePath, '{"password":"do-not-log-this-secret", broken');
  await assert.rejects(withManagedFixture(options, () => assert.fail('must not run')), error => {
    assert.equal(error.message, 'Managed fixture is not valid JSON');
    assert(!error.message.includes('do-not-log-this-secret'));
    return true;
  });
  await absent(fixturePath);
});
test('callback failure still removes the fixture', async t => {
  const { options, fixturePath } = await setup(t);
  const failure = new Error('synthetic setup/build failure');
  await assert.rejects(withManagedFixture(options, () => { throw failure; }), error => error === failure);
  await absent(fixturePath);
});
test('a sibling checkout sharing a text prefix is refused', async t => {
  const { options, root, fixturePath } = await setup(t);
  const sibling = root + '-other';
  await fs.mkdir(sibling);
  await assert.rejects(withManagedFixture({ ...options, cwd: sibling }, () => {}), /real throwaway/);
  assert((await fs.stat(fixturePath)).isFile());
});
test('the temporary root itself is not a throwaway checkout', async t => {
  const { options, root } = await setup(t);
  await assert.rejects(withManagedFixture({ ...options, cwd: root }, () => {}), /real throwaway/);
});
test('fixture traversal outside the permitted root is refused and preserved', async t => {
  const { options, base, root } = await setup(t);
  const outside = path.join(base, 'outside.json');
  await fs.writeFile(outside, '{"unrelated":true}', { mode: 0o600 });
  await assert.rejects(withManagedFixture({ ...options, fixturePath: root + path.sep + '..' + path.sep + 'outside.json' }, () => {}), /resolve inside/);
  assert.equal(await fs.readFile(outside, 'utf8'), '{"unrelated":true}');
});
test('symlink fixture is refused without deleting its target', async t => {
  const { options, root, fixturePath } = await setup(t);
  const link = path.join(root, 'alias.json');
  if (!await symlinkOrSkip(t, fixturePath, link, 'file')) return;
  await assert.rejects(withManagedFixture({ ...options, fixturePath: link }, () => {}), /not a symlink/);
  assert((await fs.stat(fixturePath)).isFile());
});
test('checkout symlink resolving outside the temporary root is refused', async t => {
  const { options, root, base } = await setup(t);
  const outside = path.join(base, 'real-application');
  await fs.mkdir(outside);
  const link = path.join(root, 'checkout-alias');
  if (!await symlinkOrSkip(t, outside, link, process.platform === 'win32' ? 'junction' : 'dir')) return;
  await assert.rejects(withManagedFixture({ ...options, cwd: link }, () => {}), /real throwaway/);
});
test('fixture parent symlink cannot escape the temporary root', async t => {
  const { options, root, base } = await setup(t);
  const outside = path.join(base, 'external');
  await fs.mkdir(outside);
  await fs.writeFile(path.join(outside, 'fixture.json'), '{}', { mode: 0o600 });
  const link = path.join(root, 'external-alias');
  if (!await symlinkOrSkip(t, outside, link, process.platform === 'win32' ? 'junction' : 'dir')) return;
  await assert.rejects(withManagedFixture({ ...options, fixturePath: path.join(link, 'fixture.json') }, () => {}), /resolve inside/);
});
test('hard-linked fixture is refused', async t => {
  const { options, root, fixturePath } = await setup(t);
  const link = path.join(root, 'hard-link.json');
  await fs.link(fixturePath, link);
  await assert.rejects(withManagedFixture({ ...options, fixturePath: link }, () => {}), /hard link/);
  assert((await fs.stat(fixturePath)).isFile());
});
test('empty or oversized fixtures are refused before callback execution', async t => {
  const { options, fixturePath } = await setup(t);
  for (const content of ['', 'x'.repeat(65537)]) {
    await fs.writeFile(fixturePath, content);
    await assert.rejects(withManagedFixture(options, () => assert.fail('must not run')), /Fixture size/);
  }
});
test('readable-by-others fixture is refused on POSIX', { skip: process.platform === 'win32' }, async t => {
  const { options, fixturePath } = await setup(t);
  await fs.chmod(fixturePath, 0o644);
  await assert.rejects(withManagedFixture(options, () => {}), /permissions must be private/);
});
test('cleanup never deletes a replacement file', async t => {
  const { options, fixturePath, root } = await setup(t);
  await assert.rejects(withManagedFixture(options, async () => {
    await fs.rename(fixturePath, path.join(root, 'original.json'));
    await fs.writeFile(fixturePath, '{"replacement":true}', { mode: 0o600 });
  }), /Fixture was replaced/);
  assert.equal(await fs.readFile(fixturePath, 'utf8'), '{"replacement":true}');
});
test('loopback listener binds only to the loopback address', async () => {
  const server = http.createServer();
  try {
    await listenLoopback(server, 0);
    assert.equal(server.address().address, '127.0.0.1');
  } finally { if (server.listening) await new Promise(resolve => server.close(resolve)); }
});
test('occupied-port startup rejects and still removes credential fixture', async t => {
  const { options, fixturePath } = await setup(t);
  const occupied = http.createServer();
  const attempted = http.createServer();
  try {
    await listenLoopback(occupied, 0);
    await assert.rejects(withManagedFixture(options, () => listenLoopback(attempted, occupied.address().port)), { code: 'EADDRINUSE' });
    assert.equal(attempted.listening, false);
    await absent(fixturePath);
  } finally {
    if (attempted.listening) await new Promise(resolve => attempted.close(resolve));
    if (occupied.listening) await new Promise(resolve => occupied.close(resolve));
  }
});

test('the actual runner refuses execution without opt-in and leaves unrelated fixture intact', async t => {
  const { fixturePath } = await setup(t);
  const env = { ...process.env, PRIVATE_DRAFT_MANAGED_FIXTURE: fixturePath };
  delete env.PRIVATE_DRAFT_MANAGED_E2E;
  const result = spawnSync(process.execPath, [fileURLToPath(new URL('../scripts/private-draft-managed-e2e.mjs', import.meta.url))], {
    env, encoding: 'utf8', timeout: 10000, windowsHide: true,
  });
  assert.equal(result.error, undefined);
  assert.notEqual(result.status, 0);
  assert.match(result.stderr, /Explicit managed acceptance opt-in required/);
  assert.equal(await fs.readFile(fixturePath, 'utf8'), '{"synthetic":true}');
});
