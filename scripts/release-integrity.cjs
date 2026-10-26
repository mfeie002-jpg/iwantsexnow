const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),server=path.join(root,'.next/server');
const manifest=JSON.parse(fs.readFileSync(path.join(server,'pages-manifest.json'),'utf8'));
const patterns=Object.keys(manifest).map(r=>new RegExp('^'+r.split('/').map(p=>p.startsWith('[')?'[^/]+':p.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')).join('/')+'$'));
let checks=0;
for(const [route,file]of Object.entries(manifest)){
 if(!file.endsWith('.html'))continue;
 const html=fs.readFileSync(path.join(server,file),'utf8');
 for(const [,raw]of html.matchAll(/<a\b[^>]*href="(\/[^"#?]*)/g)){
  const target=new URL(raw,'https://iwantsexnow.ch');
  assert.ok(target.origin==='https://iwantsexnow.ch'&&(patterns.some(p=>p.test(target.pathname))||fs.existsSync(path.join(root,'public',target.pathname))),route+': missing internal destination '+raw);checks++;
 }
}
console.log(`Release integrity: ${checks}/${checks} internal route/asset destinations exist.`);
