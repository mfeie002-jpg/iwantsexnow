import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { sourceIdentity } from '../src/lib/marketplace/source-identity.ts';
import { searchPublicListings } from '../src/lib/marketplace/public-search.ts';
import { canonicalUrl } from '../src/lib/seo-policy.ts';
import { normalizeSwissGeo } from '../src/lib/swissGeoNormalizer.ts';
const fixture = [
 {id:'src-test-a',rawName:'Synthetic A',city:'Testort',canton:'ZH',sourcePortal:'test.invalid',sourceUrl:'https://test.invalid/a',ownerToken:'must-never-leak',lastReport:{details:'private'},advertisedBaseChf:100},
 {id:'src-test-b',rawName:'Synthetic B',city:'Testort',canton:'BE',sourcePortal:'test.invalid',sourceUrl:'https://test.invalid/b'},
];
test('source identity survives reorder, tracking changes and query order; distinct listing queries remain distinct',()=>{
 assert.equal(sourceIdentity('http://example.invalid/a/?id=2&utm_source=x#photo'),sourceIdentity('https://example.invalid/a?id=2'));
 assert.equal(sourceIdentity('https://example.invalid/a?b=2&a=1'),sourceIdentity('https://example.invalid/a?a=1&b=2'));
 assert.notEqual(sourceIdentity('https://example.invalid/a?id=1'),sourceIdentity('https://example.invalid/a?id=2'));
 for(const url of ['javascript:alert(1)','https://user:password@example.invalid','bad',null])assert.equal(sourceIdentity(url),null);
});
test('search has one contract, applies filters before pagination and never projects secrets',()=>{
 const result=searchPublicListings({page:'2',limit:'1'},fixture);
 assert.deepEqual(result.results.map(v=>v.id),['src-test-b']);assert.equal(result.totalMatches,2);
 assert.equal(searchPublicListings({canton:'ZH',withPrice:'true'},fixture).totalMatches,1);
 assert.equal(searchPublicListings({available:'true'},fixture).totalMatches,0);
 const all=JSON.stringify(searchPublicListings({},fixture));assert.ok(!/must-never-leak|lastReport|ownerToken/.test(all));
 assert.deepEqual(searchPublicListings({},[]).results,[]);
});
test('search rejects malformed and repeated values rather than returning a false empty success',()=>{
 for(const q of [{page:'NaN'},{page:'1.5'},{page:'0'},{limit:'101'},{limit:'-2'},{q:['a','b']},{available:'yes'},{canton:'invalid'},{unknown:'x'}])assert.throws(()=>searchPublicListings(q,fixture));
});
test('canonicals use the actual path and never carry query, fragment, cross-origin URLs or wrong language cities',()=>{
 for(const path of ['/search','/escort-zurich','/orte/cham','/reviews/xdate-review','/profile/src-synthetic'])assert.equal(canonicalUrl(path+'?q=x#part'),'https://iwantsexnow.ch'+path);
 assert.equal(canonicalUrl('https://iwantsexnow.ch/search/?q=x#y'),'https://iwantsexnow.ch/search');
 assert.equal(canonicalUrl('https://other.invalid/search'),'https://iwantsexnow.ch');
});
test('Swiss geography does not turn unknown places into Zürich or substring wil into SG',()=>{
 for(const [city,inputCanton,expected] of [['Winterthur','ZH','ZH'],['Adliswil','ZH','ZH'],['Muri bei Bern','BE','BE'],['Allschwil','BL','BL'],['Reinach','BL','BL'],['Wil','SG','SG'],['Lausanne','VD','VD']])assert.equal(normalizeSwissGeo(city,inputCanton).trueCanton,expected,city);
 assert.deepEqual(normalizeSwissGeo('',null),{cleanCity:'Ort unbekannt',trueCanton:'',languageRegion:'de'});
});
test('public build input excludes unapproved raw imports and all public pilot credentials',()=>{
 assert.deepEqual(JSON.parse(fs.readFileSync('src/data/approved-public-offers.json','utf8')),[]);
 const raw=JSON.parse(fs.readFileSync('src/data/harvested-offers.json','utf8'));
 assert.equal(raw.length,650);assert.ok(!raw.some(v=>String(v.dedupClusterId||'').startsWith('w4-')));
 assert.deepEqual(JSON.parse(fs.readFileSync('src/data/pilot-20-cohort.json','utf8')),[]);
 for(const file of ['managed-profile-states.json','real-profile-metrics.json'])assert.deepEqual(JSON.parse(fs.readFileSync('src/data/'+file,'utf8')),{});
});
