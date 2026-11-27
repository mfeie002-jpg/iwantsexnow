import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const BASE=(process.env.IWSN_TEST_BASE_URL||'http://127.0.0.1:4181').replace(/\/$/,'');
const inventory=JSON.parse(fs.readFileSync(new URL('../src/data/harvested-offers.json',import.meta.url),'utf8'));
const id=inventory[0].id;
export const pages=['/','/search','/escort-zurich','/orte/zug','/escort-geneva','/clubs',`/profile/${id}`,'/compare-escorts','/favorites','/reviews','/reviews/and6','/pricing','/safety','/how-it-works','/advertise','/register','/login','/creator-dashboard','/create-post','/report'];
for(const path of pages)test(`Swiss Night route ${path}: accessible, single shell, canonical`,async()=>{
 const r=await fetch(BASE+path,{signal:AbortSignal.timeout(30000)});assert.equal(r.status,200);
 const html=await r.text();assert.equal([...html.matchAll(/<footer\b/g)].length,1);assert.equal([...html.matchAll(/<header\b/g)].length,1);
 assert.match(html,/night-header/);assert.match(html,/night-footer/);assert.ok(/<title[^>]*>[^<]+<\/title>/.test(html), "page title is present");assert.match(html,/rel="canonical"/);
 assert.ok(!/design-preview|Designstudie/.test(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"")), "no prototype labels");
});
test('real profile preserves ID, name, index permission and source; no invented verified claim',async()=>{
 const html=await (await fetch(BASE+`/profile/${id}`)).text();
 assert.ok(html.includes(id));assert.match(html,/index,follow/);assert.ok(html.includes('name="robots"'));
 assert.ok(!/VERIFIZIERT|FREI · LIVE|100% echte Bilder/.test(html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi,"")), "no manufactured badges");
});
test('unknown profile and geographic slugs are 404 instead of invented Zurich content',async()=>{
 for(const path of ['/profile/not-a-real-profile','/orte/nonexistent-town','/kategorie/zug/not-a-service','/reviews/not-a-portal'])assert.equal((await fetch(BASE+path)).status,404,path);
});
test('existing regional and category URLs still return indexable pages',async()=>{
 for(const path of ['/escort-basel','/escort-bern','/escort-lausanne','/escort-lugano','/orte/luzern','/orte/winterthur','/kategorie/zug/tantra-massage']){const r=await fetch(BASE+path);assert.equal(r.status,200);assert.match(await r.text(),/index,follow/);}
});
test('robots preserves public crawling and sitemap retains all real profiles',async()=>{
 const robots=await(await fetch(BASE+'/robots.txt')).text();assert.match(robots,/Allow: \/profile\//);assert.doesNotMatch(robots,/Disallow: \/\s*\n/);
 const xml=await(await fetch(BASE+'/sitemap.xml')).text();
 const urls=[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
 assert.equal(new Set(urls).size,urls.length);
 const fixtures=inventory.filter(offer=>[offer.id,offer.dedupClusterId].some(id=>/^w4-/i.test(id)) || new URL(offer.sourceUrl).hostname==='example.com');
 const fixtureIds=new Set(fixtures.map(offer=>offer.id));
 const expected=inventory.filter(offer=>!fixtureIds.has(offer.id)).map(offer=>offer.id);
 const actual=urls.filter(url=>new URL(url).pathname.startsWith('/profile/')).map(url=>decodeURIComponent(new URL(url).pathname.slice('/profile/'.length)));
 assert.deepEqual(actual.sort(),expected.sort());
 assert.equal((await fetch(BASE+'/profile/'+encodeURIComponent(fixtures[0].id))).status,404);
});
