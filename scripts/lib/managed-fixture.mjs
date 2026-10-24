import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { constants } from 'node:fs';
import path from 'node:path';

function inside(root, target) {
  const relative = path.relative(root, target);
  return relative !== '' && relative !== '..' &&
    !relative.startsWith('..' + path.sep) && !path.isAbsolute(relative);
}

/** Resolve actual paths before reading credentials; a /tmp string prefix is insufficient. */
async function checkedFixture({ enabled, cwd, fixturePath, temporaryRoot = '/tmp' }) {
  assert.equal(enabled, '1', 'Explicit managed acceptance opt-in required');
  assert(typeof fixturePath === 'string' && path.isAbsolute(fixturePath), 'Absolute temporary fixture required');
  const root = await fs.realpath(temporaryRoot);
  const work = await fs.realpath(cwd);
  assert(inside(root, work), 'Run only in a real throwaway directory');
  const file = await fs.realpath(fixturePath);
  assert(inside(root, file), 'Fixture must resolve inside the temporary directory');
  const stat = await fs.lstat(fixturePath);
  assert(stat.isFile() && !stat.isSymbolicLink(), 'Fixture must be a regular file, not a symlink');
  assert.equal(stat.nlink, 1, 'Fixture must not share a hard link');
  assert(stat.size > 0 && stat.size <= 65536, 'Fixture size is invalid');
  if (process.platform !== 'win32') {
    assert.equal(stat.mode & 0o077, 0, 'Fixture permissions must be private');
  }
  return { root, file, stat };
}

async function removeOriginal({ root, file, stat }) {
  let current;
  try {
    const resolved = await fs.realpath(file);
    assert(resolved === file && inside(root, resolved), 'Fixture path changed; refusing cleanup');
    current = await fs.lstat(file);
  } catch (error) {
    if (error.code === 'ENOENT') return;
    throw error;
  }
  assert(current.isFile() && current.dev === stat.dev && current.ino === stat.ino,
    'Fixture was replaced; refusing to remove another file');
  await fs.unlink(file);
}

/** Includes JSON parsing in the cleanup boundary. Never logs fixture data. */
export async function withManagedFixture(options, run) {
  const fixture = await checkedFixture(options);
  let handle;
  try {
    handle = await fs.open(fixture.file, constants.O_RDONLY | (constants.O_NOFOLLOW || 0));
    const opened = await handle.stat();
    assert(opened.dev === fixture.stat.dev && opened.ino === fixture.stat.ino,
      'Fixture changed before it could be read');
    let data;
    try {
      data = JSON.parse(await handle.readFile('utf8'));
    } catch {
      throw new Error('Managed fixture is not valid JSON');
    }
    return await run(data);
  } finally {
    try { await handle?.close(); }
    finally { await removeOriginal(fixture); }
  }
}

/** Reject listener failures instead of leaving an unresolved promise or uncaught error. */
export function listenLoopback(server, port) {
  return new Promise((resolve, reject) => {
    const cleanup = () => {
      server.removeListener('error', failed);
      server.removeListener('listening', ready);
    };
    const failed = error => { cleanup(); reject(error); };
    const ready = () => { cleanup(); resolve(); };
    server.once('error', failed);
    server.once('listening', ready);
    try { server.listen(port, '127.0.0.1'); }
    catch (error) { failed(error); }
  });
}
