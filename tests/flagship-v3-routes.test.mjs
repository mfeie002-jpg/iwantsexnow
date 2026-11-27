import test from 'node:test';
import assert from 'node:assert/strict';

const base = (process.env.IWSN_TEST_BASE_URL || 'http://127.0.0.1:4317').replace(/\/$/, '');
const routes = [
  '/', '/suche', '/profil/beispiel', '/regionen', '/regionen/zuerich',
  '/kategorien', '/massage', '/tantra', '/studios', '/high-class',
  '/jetzt-frei', '/portalvergleich', '/ratgeber', '/preise', '/sicherheit',
  '/anbieter', '/login', '/eintrag', '/melden', '/ueber-uns'
];
const redirects = new Map([
 ['/suche','/search'],['/regionen/zuerich','/escort-zurich'],['/studios','/clubs'],
 ['/portalvergleich','/reviews'],['/preise','/pricing'],['/sicherheit','/safety'],
 ['/anbieter','/advertise'],['/eintrag','/create-post'],['/melden','/report'],
 ['/ueber-uns','/about']
]);

for(const route of routes) test('flagship route renders real Next.js page: '+route, async()=>{
 const res=await fetch(base+route,{redirect:'follow',signal:AbortSignal.timeout(15000)});
 const html=await res.text();
 assert.equal(res.status,200,route+' HTTP '+res.status);
 assert.match(res.headers.get('content-type')||'',/text\/html/);
 assert.match(html,/<header\b[^>]*class="[^"]*night-header/);
 assert.match(html,/<footer\b[^>]*class="[^"]*night-footer/);
 assert.equal((html.match(/<h1\b/g)||[]).length,1,'Exactly one H1 on '+route);
 assert.equal((html.match(/<main\b/g)||[]).length,1,'Exactly one main on '+route);
 if(redirects.has(route)) assert.equal(new URL(res.url).pathname,redirects.get(route),'Canonical redirect must preserve route provenance');
 if(route==='/') {
  assert.match(html,/Finde, was/);
  assert.match(html,/flagship-hero-choices/);
 }
});

test('public locale-alias search preserves query filters across canonical redirect', async()=>{
 const url=base+'/suche?canton=ZG&category=massage';
 const response=await fetch(url,{redirect:'follow',signal:AbortSignal.timeout(15000)});
 assert.equal(response.status,200);
 const final=new URL(response.url);
 assert.equal(final.pathname,'/search');
 assert.equal(final.searchParams.get('canton'),'ZG');
 assert.equal(final.searchParams.get('category'),'massage');
});

test('illustrative example profile is marked noindex rather than passed off as a person',async()=>{
 const res=await fetch(base+'/profil/beispiel',{signal:AbortSignal.timeout(15000)});
 const html=await res.text();
 assert.equal(res.status,200);
 assert.match(html,/<meta[^>]*name="robots"[^>]*noindex/i);
 assert.match(html,/kein erfundenes Anbieterprofil|kein echtes Angebot|kein echter Eintrag/i);
});
