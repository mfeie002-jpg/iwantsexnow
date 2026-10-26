// Current built-candidate policy. Never makes a request to production.
import fs from 'node:fs';
import assert from 'node:assert/strict';
const origin=process.env.PREVIEW_SMOKE_ORIGIN||'http://127.0.0.1:43127';
assert(['127.0.0.1','localhost','[::1]'].includes(new URL(origin).hostname));
const policy=JSON.parse(fs.readFileSync('docs/goal/release-policy.json','utf8'));
let checks=0;
async function get(path,status=200){const r=await fetch(origin+path,{redirect:'manual'});assert.equal(r.status,status,path);checks++;return r}
for(const path of ['/','/search','/escort-zurich','/escort-basel','/orte/cham','/reviews','/reviews/xdate-review','/report','/privacy','/contact','/imprint']){
 const r=await get(path);assert.match(r.headers.get('x-robots-tag'),/noindex/);const html=await r.text();
 const expected='https://iwantsexnow.ch'+(path==='/'?'':path);
 assert.ok(html.includes('rel="canonical" href="'+expected+'"'),path+' canonical');
 assert.ok(html.includes('property="og:url" content="'+expected+'"'),path+' og:url');
 assert.doesNotMatch(html,/hreflang=/i);
}
for(const route of policy.gatedRoutes){const r=await get('/'+route);const html=await r.text();assert.ok(html.includes('noch nicht freigeschaltet'),route);assert.doesNotMatch(html,/<form\b|type="password"/i)}
for(const path of ['/profile/does-not-exist','/profile/ch-9999999','/profile/pilot-zh-1','/profile/w4-1','/orte/not-a-place','/reviews/not-a-report','/guides/not-a-guide'])await get(path,404);
for(const path of ['/api/admin/overview','/api/indexer/import'])await get(path,401);
const publicState=await(await get('/api/vault/metrics')).json();assert.deepEqual(publicState.states,{});assert.deepEqual(publicState.metrics,{});
for(const [path,body,code]of [
 ['/api/vault/metrics',{action:'unknown'},400],
 ['/api/vault/metrics',{action:'claim_or_create_profile',profileId:'ch-1',ownerToken:'revoked-public-token'},410],
 ['/api/vault/metrics',{action:'update_profile_fields',profileId:'ch-1',identityVerified:true},410],
 ['/api/vault/metrics',{action:'report_or_optout',details:'synthetic confidential report'},410],
 ['/api/claims/create',{},410],['/api/enquiries/create',{},410],
]){const r=await fetch(origin+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});assert.equal(r.status,code,path);const data=await r.json();assert.equal(data.ok,false);checks++}
const search=await(await get('/api/vault/search?page=1&limit=48')).json();assert.deepEqual(search.results,[]);assert.equal(search.totalMatches,0);assert.equal(search.status,'ok');
await get('/api/vault/search?page=NaN',400);
await get('/api/vault/search?q=a&q=b',400);
const xml=await(await get('/sitemap.xml')).text();assert.doesNotMatch(xml,/<loc>|<lastmod>/);
console.log(`P0 HTTP acceptance: ${checks}/${checks} cases; SSR metadata, private boundaries, invalid identities, retired tokens, honest errors and quarantined inventory.`);
