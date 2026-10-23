import assert from "node:assert/strict";
const origin = "http://127.0.0.1:43127";
let count=0;
for(const [path,method]of [["/private/provider-draft","GET"],["/api/private/provider-session","GET"],["/api/private/provider-session","POST"],["/api/private/provider-drafts","GET"],["/api/private/provider-drafts","POST"],["/api/private/provider-drafts","PUT"]]){
 const r=await fetch(origin+path,{method,headers:{Origin:origin,"Content-Type":"application/json"},body:method==="GET"?undefined:JSON.stringify({}),signal:AbortSignal.timeout(10000)});
 assert.equal(r.status,404,path+method);assert.match(r.headers.get("cache-control"),/no-store/);assert.match(r.headers.get("x-robots-tag"),/noindex/);
 const text=await r.text();if(path==="/private/provider-draft")assert.doesNotMatch(text,/<form\b/i);count++;
}
console.log(`Private flow disabled HTTP: ${count}/6; no editor or API activation.`);
