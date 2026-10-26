import assert from 'node:assert/strict';
const origin='http://127.0.0.1:43127';
for(const path of ['/catalogue/demo-zurich-escort','/catalogue/not-a-demo-id']){
 const r=await fetch(origin+path);assert.equal(r.status,404);assert.match(r.headers.get('x-robots-tag'),/noindex/);
}
console.log('Catalogue HTTP: 2/2; synthetic public fixtures are retired and no other record is substituted.');
