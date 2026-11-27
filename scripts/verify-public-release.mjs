// Read-only public release smoke check. No login, POST, private data or write actions.
// Usage: IWSN_RELEASE_ORIGIN=https://iwantsexnow.ch node scripts/verify-public-release.mjs
import assert from 'node:assert/strict';

const origin = (process.env.IWSN_RELEASE_ORIGIN || 'http://127.0.0.1:4253').replace(/\/$/, '');
const pages = [
  {path:'/', maxBytes:250000},
  {path:'/search', maxBytes:400000},
  {path:'/report', maxBytes:200000}
];
const summary = [];
let errorCount = 0;
const get = async (path) => fetch(origin + path, {
  method:'GET', redirect:'follow', headers:{Accept:'text/html'},
  signal: AbortSignal.timeout(15000)
});
for (const page of pages) {
  try {
    const response = await get(page.path);
    const html = await response.text();
    const bytes = Buffer.byteLength(html, 'utf8');
    const footers = (html.match(/<footer\b/g) || []).length;
    const headers = (html.match(/<header\b/g) || []).length;
    const main = (html.match(/<main\b/g) || []).length;
    const correctShell = html.includes('night-header') && html.includes('night-footer');
    const isSmall = bytes <= page.maxBytes;
    const safe = response.ok && correctShell && footers === 1 && headers === 1 && main === 1 && isSmall;
    summary.push({
      path:page.path,http:response.status,bytes,headerCount:headers,
      footerCount:footers,mainCount:main,correctShell,withinHtmlBudget:isSmall,
      result:safe?'PASS':'FAIL'
    });
    if (!safe) errorCount++;
  } catch (error) {
    summary.push({path:page.path,error:error?.name||'REQUEST_ERROR',result:'FAIL'});
    errorCount++;
  }
}
try {
  const response = await fetch(origin+'/api/catalogue/page?canton=ZG&count=1',{
    method:'GET', redirect:'manual',headers:{Accept:'application/json'},
    signal:AbortSignal.timeout(15000)
  });
  const data = await response.json();
  const correct = response.status===200 &&
    typeof data.total==='number' && Number.isSafeInteger(data.total) &&
    Array.isArray(data.offers) && data.offers.length===0 &&
    data.states && Object.keys(data.states).length===0;
  summary.push({
    path:'/api/catalogue/page?canton=ZG&count=1',
    http:response.status,
    totalIsValid:Number.isSafeInteger(data.total),
    countOnlyHasNoProfiles:Array.isArray(data.offers)&&data.offers.length===0,
    result:correct?'PASS':'FAIL'
  });
  if (!correct) errorCount++;
} catch (error) {
  summary.push({path:'/api/catalogue/page?canton=ZG&count=1',error:error?.name||'REQUEST_ERROR',result:'FAIL'});
  errorCount++;
}
console.log(JSON.stringify({origin,checks:summary,errors:errorCount,outcome:errorCount===0?'PASS':'FAIL'},null,2));
assert.equal(errorCount,0,'Public release drift or failure detected');
