// Runs against an isolated Chrome CDP session and a local Next.js production build.
import assert from 'node:assert/strict';

const SITE = process.env.IWSN_BROWSER_SITE || 'http://127.0.0.1:4223';
const DEBUG = process.env.IWSN_BROWSER_CDP || 'http://127.0.0.1:9341';
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
const targets = await (await fetch(DEBUG + '/json', {signal: AbortSignal.timeout(10000)})).json();
const target = targets.find((x) => x.type === 'page' && x.webSocketDebuggerUrl);
assert.ok(target, 'Temporary Chrome CDP page is unavailable');

const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, {once: true});
  ws.addEventListener('error', reject, {once: true});
});
let id = 0;
const pending = new Map();
const requests = [];
const exceptions = [];
ws.addEventListener('message', ({data}) => {
  const event = JSON.parse(data);
  if (event.id && pending.has(event.id)) {
    const {resolve, reject, timeout} = pending.get(event.id);
    pending.delete(event.id);
    clearTimeout(timeout);
    event.error ? reject(new Error(event.error.message)) : resolve(event.result);
  }
  if (event.method === 'Network.requestWillBeSent') {
    try {
      const pathname = new URL(event.params.request.url).pathname;
      if (pathname.startsWith('/api/catalogue')) {
        requests.push({path: pathname, id: event.params.requestId, status: null});
      }
    } catch {}
  }
  if (event.method === 'Network.responseReceived') {
    const req = requests.find((entry) => entry.id === event.params.requestId);
    if (req) req.status = event.params.response.status;
  }
  if (event.method === 'Runtime.exceptionThrown') {
    exceptions.push(String(event.params.exceptionDetails?.text || 'Unexpected exception'));
  }
});
const send = (method, params = {}) => new Promise((resolve, reject) => {
  const call = ++id;
  const timeout = setTimeout(() => { pending.delete(call); reject(new Error('CDP timeout: ' + method)); }, 15000);
  pending.set(call, {resolve, reject, timeout});
  ws.send(JSON.stringify({id: call, method, params}));
});
const evaluate = async (expression) => {
  const result = await send('Runtime.evaluate', {expression, returnByValue: true, awaitPromise: true});
  if (result.exceptionDetails) throw new Error('Browser evaluation failed');
  return result.result.value;
};
const waitUntil = async (predicate, label, ms = 15000) => {
  const until = Date.now() + ms;
  while (Date.now() < until) {
    if (await predicate()) return;
    await sleep(200);
  }
  throw new Error('Timed out: ' + label);
};
const navigate = async (path) => {
  await send('Page.navigate', {url: SITE + path});
  await waitUntil(async () => await evaluate('document.readyState === "complete"'), path + ' ready');
};

try {
  await send('Page.enable');
  await send('Network.enable');
  await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390, height: 844, deviceScaleFactor: 1, mobile: true,
    screenWidth: 390, screenHeight: 844
  });
  await navigate('/search?canton=ZG');
  await waitUntil(async () => await evaluate('document.querySelectorAll(".night-profile-grid article").length') === 24,
    '24 SSR catalogue cards');
  await sleep(900);
  const initial = await evaluate("({viewport:innerWidth, scrollWidth:document.documentElement.scrollWidth, cards:document.querySelectorAll('.night-profile-grid article').length,footer:document.querySelectorAll('footer').length,h1:document.querySelectorAll('h1').length,more:[...document.querySelectorAll('.night-load-more button')].some(b=>b.textContent.includes('Weitere Einträge anzeigen'))})");
  assert.equal(initial.cards, 24);
  assert.equal(initial.footer, 1);
  assert.equal(initial.h1, 1);
  assert.ok(initial.scrollWidth <= initial.viewport + 1, 'Horizontal overflow in mobile viewport');
  assert.ok(initial.more, 'Load more button missing');
  assert.ok(!requests.some((r) => r.path === '/api/catalogue'), 'Full catalogue fetched without permission');
  await evaluate("[...document.querySelectorAll('.night-load-more button')].find(b=>b.textContent.includes('Weitere Einträge anzeigen')).click()");
  await waitUntil(async () => await evaluate('document.querySelectorAll(".night-profile-grid article").length') === 48,
    '48 cards after loading second page');
  const pages = requests.filter((r) => r.path === '/api/catalogue/page');
  assert.equal(pages.length, 1);
  assert.equal(pages[0].status, 200);
  await evaluate("document.querySelectorAll('.night-profile-grid article')[24].querySelector('button.night-save').click()");
  await evaluate("document.querySelectorAll('.night-profile-grid article')[24].querySelector('.night-profile-bottom button').click()");
  assert.equal(await evaluate("document.querySelectorAll('.night-profile-grid article')[24].querySelector('button.night-save').getAttribute('aria-pressed')"), 'true');
  assert.equal(await evaluate("document.querySelectorAll('.night-profile-grid article')[24].querySelector('.night-profile-bottom button').getAttribute('aria-pressed')"), 'true');
  await navigate('/favorites');
  await waitUntil(async () => await evaluate('document.querySelectorAll(".night-profile-card").length') >= 1,
    'Saved profile from second page appears');
  await navigate('/compare-escorts');
  await waitUntil(async () => await evaluate('document.body.textContent.includes("Nur Unterschiede")'),
    'Comparison controls visible');
  assert.ok(requests.some((r) => r.path === '/api/catalogue/selected' && r.status === 200),
    'Selected IDs must load through the bounded catalogue endpoint');
  assert.equal(exceptions.length, 0);
  console.log(JSON.stringify({
    outcome: 'PASS', viewport: 390, initialCards: 24, afterLoadMore: 48,
    pageApiRequests: pages.length, pageApiStatus: pages[0].status,
    savedAndComparedSecondPage: true, selectedEndpointUsed: true,
    footerCount: 1, horizontalOverflow: false, browserExceptions: exceptions.length
  }, null, 2));
} finally {
  try { await evaluate('localStorage.clear()'); } catch {}
  ws.close();
}
