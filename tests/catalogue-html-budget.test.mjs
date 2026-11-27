import test from 'node:test';
import assert from 'node:assert/strict';

const BASE = (process.env.IWSN_TEST_BASE_URL || 'http://127.0.0.1:4223').replace(/\/$/, '');
const routes = [
  { path: '/', budget: 250_000, maximumProfiles: 4 },
  { path: '/search', budget: 400_000, maximumProfiles: 24 },
  { path: '/escort-zurich', budget: 400_000, maximumProfiles: 24 },
  { path: '/orte/zug', budget: 400_000, maximumProfiles: 24 },
  { path: '/clubs', budget: 250_000, maximumProfiles: 0 },
  { path: '/profile/ch-76ccbbea1078', budget: 200_000, maximumProfiles: 1 },
  { path: '/favorites', budget: 150_000, maximumProfiles: 0 },
  { path: '/compare-escorts', budget: 150_000, maximumProfiles: 0 }
];

for (const { path, budget, maximumProfiles } of routes) {
  test(`SSR remains bounded and does not serialize the complete catalogue: ${path}`, async () => {
    const response = await fetch(BASE + path, {
      headers: { Accept: 'text/html' },
      signal: AbortSignal.timeout(20_000)
    });
    assert.equal(response.status, 200);
    const html = await response.text();
    const bytes = Buffer.byteLength(html, 'utf8');
    assert.ok(bytes <= budget, `${path}: ${bytes} bytes exceeds ${budget} budget`);

    const embedded = html.match(/<script id="__NEXT_DATA__" type="application\/json">([\s\S]*?)<\/script>/);
    assert.ok(embedded, `${path}: Next.js props are missing`);
    const props = JSON.parse(embedded[1]).props?.pageProps;
    assert.ok(props && typeof props === 'object');
    const serializedOffers = props.catalogue?.offers;
    assert.ok(Array.isArray(serializedOffers), `${path}: expected bounded catalogue array`);
    assert.ok(
      serializedOffers.length <= maximumProfiles,
      `${path}: rendered ${serializedOffers.length} offers; expected at most ${maximumProfiles}`
    );
    assert.equal((html.match(/<footer\b/g) || []).length, 1);
  });
}
