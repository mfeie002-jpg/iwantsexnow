import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { profilePhotoPlaceholder, profilePhotoSvg } from '../src/components/night/profile-image-model.ts';
import { cityTileSources } from '../src/lib/city-tiles.ts';
import {
  clearDeadUrlCache, collectPhotoHosts, containsBlurPlaceholder, DEAD_URL_TTL_MS,
  ipCheckDisabled, isPrivateOrInternalIp, resolveProfilePhoto
} from '../src/lib/profile-image-proxy.ts';

const jpeg = Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...Array(32).fill(0)]);
const allow = new Set(['images.xdate.ch', 'www.xdate.ch']);

function catalog(photos, name = 'Aline') {
  return { allow, profiles: new Map([['ch-1', { name, photos }]]) };
}

function okImage(addresses) {
  return { status: 200, headers: { get: (name) => name === 'content-type' ? 'image/jpeg' : null }, body: jpeg, addresses };
}

test('private and internal addresses are blocked, public addresses are not', () => {
  for (const ip of ['127.0.0.1', '10.1.2.3', '172.16.4.4', '192.168.1.9', '169.254.169.254', '0.0.0.8', '::1', 'fc00::1', 'fe80::1', '::ffff:127.0.0.1', 'not-an-ip']) {
    assert.equal(isPrivateOrInternalIp(ip), true, ip);
  }
  assert.equal(isPrivateOrInternalIp('8.8.8.8'), false);
  assert.equal(isPrivateOrInternalIp('2001:4860:4860::8888'), false);
});

test('photo hosts come only from profile records and skip stock CDNs', () => {
  const hosts = collectPhotoHosts([
    { thumbnail: 'https://images.xdate.ch/a.jpg', gallery: ['https://images.unsplash.com/photo.jpg', 'https://www.xdate.ch/img/bg_blur.jpg'] },
    { imageUrl: 'http://127.0.0.1/secret.jpg' },
    { thumbnail: 'notaurl' }
  ]);
  assert.deepEqual([...hosts].sort(), ['127.0.0.1', 'images.xdate.ch', 'www.xdate.ch']);
  assert.equal(containsBlurPlaceholder('https://www.xdate.ch/img/%62g_blur.jpg'), true);
});

test('the proxy tries a profile photo list, skips blur, and refuses private targets', async () => {
  clearDeadUrlCache();
  const seen = [];
  const result = await resolveProfilePhoto({
    id: 'ch-1',
    catalog: catalog(['https://www.xdate.ch/img/bg_blur.jpg', 'https://images.xdate.ch/real.jpg', 'https://evil.example/a.jpg']),
    now: 1_000,
    resolveHost: async () => ['8.8.8.8'],
    request: async (url, init) => { seen.push([url.href, init.addresses]); return okImage(init.addresses); }
  });
  assert.equal(result.contentType, 'image/jpeg');
  assert.deepEqual(seen, [['https://images.xdate.ch/real.jpg', ['8.8.8.8']]]);
});

test('a private DNS answer is not fetched', async () => {
  clearDeadUrlCache();
  const result = await resolveProfilePhoto({
    id: 'ch-1',
    catalog: catalog(['https://images.xdate.ch/real.jpg']),
    now: 2_000,
    resolveHost: async () => ['169.254.169.254'],
    request: async () => { throw new Error('private target was fetched'); }
  });
  assert.match(result.body.toString(), /Foto folgt/);
  assert.match(result.body.toString(), />A</);
});

test('redirects to a host outside the profile allowlist are not followed', async () => {
  clearDeadUrlCache();
  const seen = [];
  const result = await resolveProfilePhoto({
    id: 'ch-1',
    catalog: catalog(['https://images.xdate.ch/start.jpg']),
    now: 3_000,
    resolveHost: async () => ['8.8.8.8'],
    request: async (url) => {
      seen.push(url.hostname);
      return { status: 302, headers: { get: () => 'https://evil.example/secret.jpg' }, body: Buffer.alloc(0) };
    }
  });
  assert.deepEqual(seen, ['images.xdate.ch']);
  assert.match(result.body.toString(), /Foto folgt/);
});

test('dead image URLs stay cached for six hours', async () => {
  clearDeadUrlCache();
  let calls = 0;
  const input = {
    id: 'ch-1',
    catalog: catalog(['https://images.xdate.ch/missing.jpg']),
    resolveHost: async () => ['8.8.8.8'],
    request: async () => { calls += 1; return { status: 404, headers: { get: () => 'text/plain' }, body: Buffer.from('no') }; }
  };
  await resolveProfilePhoto({ ...input, now: 10_000 });
  await resolveProfilePhoto({ ...input, now: 10_000 + 1000 });
  assert.equal(calls, 1);
  await resolveProfilePhoto({ ...input, now: 10_000 + DEAD_URL_TTL_MS + 1 });
  assert.equal(calls, 2);
});

test('IMG_PROXY_ALLOW_FAKE_IP skips the address check and still uses the allowlist', async () => {
  clearDeadUrlCache();
  assert.equal(ipCheckDisabled({ IMG_PROXY_ALLOW_FAKE_IP: '1' }), true);
  assert.equal(ipCheckDisabled({}), false);
  let called = false;
  const result = await resolveProfilePhoto({
    id: 'ch-1',
    skipIpCheck: true,
    catalog: catalog(['https://images.xdate.ch/real.jpg']),
    now: 4_000,
    resolveHost: async () => { throw new Error('DNS should not run'); },
    request: async (_url, init) => { called = true; assert.equal(init.addresses, null); return okImage(null); }
  });
  assert.equal(called, true);
  assert.equal(result.status, 200);
});

test('an unknown profile is not an open image fetch', async () => {
  const result = await resolveProfilePhoto({
    id: 'missing',
    catalog: catalog([]),
    request: async () => { throw new Error('unknown id was fetched'); }
  });
  assert.equal(result.status, 404);
});

test('the placeholder is a dark tile with the gold initial and Foto folgt', () => {
  const svg = profilePhotoSvg('élodie Example');
  assert.match(svg, /#0D111A/);
  assert.match(svg, /#C8A97E/);
  assert.match(svg, />É</);
  assert.match(svg, /Foto folgt/);
  assert.match(profilePhotoPlaceholder('élodie Example'), /^data:image\/svg\+xml,/);
});

test('Genève and Bern use the local city files only when they exist', () => {
  const empty = fs.mkdtempSync(path.join(os.tmpdir(), 'city-tiles-'));
  assert.deepEqual(cityTileSources(empty), { GE: null, BE: null });
  fs.writeFileSync(path.join(empty, 'city-ge_500x400.webp'), 'webp');
  assert.equal(cityTileSources(empty).GE, '/images/cities/city-ge_500x400.webp');
  assert.equal(cityTileSources(empty).BE, null);
});

test('profile cards and the home page do not point at stock portraits or a second footer', () => {
  const root = new URL('..', import.meta.url);
  const read = (name) => fs.readFileSync(new URL(name, root), 'utf8');
  const home = read('src/pages/index.tsx');
  assert.equal(home.includes('<footer'), false);
  assert.equal(home.includes('bg_blur'), false);
  assert.equal(home.includes('unsplash.com'), false);
  for (const file of ['src/components/PostcardProfileCard.tsx', 'src/components/VisualProfileCard.tsx', 'src/components/LuxuryPhotoCard.tsx', 'src/pages/profile/[id].tsx']) {
    assert.equal(read(file).includes('unsplash.com'), false, file);
  }
  assert.match(read('src/pages/api/img.ts'), /query\.id/);
  assert.doesNotMatch(read('src/pages/api/img.ts'), /query\.u/);
});
