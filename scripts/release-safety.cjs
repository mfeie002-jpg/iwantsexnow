// Current goal policy: containment, correct metadata and no unverified public records.
// Replaces obsolete assertions about exact starter-template text. No gate is skipped.
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),pages=path.join(root,'.next/server/pages');
const policy=JSON.parse(fs.readFileSync(path.join(root,'docs/goal/release-policy.json'),'utf8'));
let checks=0;
const check=(value,label)=>{checks++;assert.ok(value,label)};
function walk(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(v=>v.isDirectory()?walk(path.join(dir,v.name)):[path.join(dir,v.name)])}
const htmlFiles=walk(pages).filter(v=>v.endsWith('.html'));
check(htmlFiles.length>=40,'build route inventory must be complete');
for(const file of htmlFiles){
 const html=fs.readFileSync(file,'utf8'),name=path.relative(pages,file);
 check(/<title[^>]*>[^<]+<\/title>/.test(html),name+': title');
 check(/<meta(?=[^>]*name="robots")(?=[^>]*content="noindex, nofollow")[^>]*>/.test(html),name+': noindex');
 check((html.match(/rel="canonical"/g)||[]).length===1,name+': exactly one canonical');
 check(!/hreflang=/i.test(html),name+': no unrelated cities as translations');
 check(!/ownerToken&quot;|"ownerToken"\s*:\s*"[a-z0-9_]+"|"lastReport"\s*:/.test(html),name+': private state');
}
for(const route of policy.gatedRoutes){
 const html=fs.readFileSync(path.join(pages,route+'.html'),'utf8');
 check(html.includes('noch nicht freigeschaltet'),route+': honest action gate');
 check(!/<form\b|type="password"/i.test(html),route+': no unverified collection');
}
check(JSON.parse(fs.readFileSync(path.join(root,'src/data/approved-public-offers.json'),'utf8')).length===0,'unapproved imports must stay quarantined');
const dataModule=fs.readFileSync(path.join(root,'src/data/harvestedOffers.ts'),'utf8');
check(!dataModule.includes('"./harvested-offers.json"'),'raw archive must not enter browser data module');
for(const name of ['report','privacy','contact','imprint'])check(!/<form\b/i.test(fs.readFileSync(path.join(pages,name+'.html'),'utf8')),name+': no unconfigured collection');
for(const route of ['search','escort-zurich','escort-basel','reviews']){
 const html=fs.readFileSync(path.join(pages,route+'.html'),'utf8');
 check(html.includes('rel="canonical" href="https://iwantsexnow.ch/'+route+'"'),route+': route canonical in initial HTML');
}
const home=fs.readFileSync(path.join(pages,'index.html'),'utf8');
check(home.includes('keine importierten Einträge zur Veröffentlichung freigegeben'),'honest empty home inventory');
console.log(`Release safety: ${checks}/${checks} assertions, ${htmlFiles.length} built pages; policy ${policy.phase}.`);
