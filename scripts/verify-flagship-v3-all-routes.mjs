// Visually verify all twenty selected URL concepts at real Desktop/Mobile viewports.
// Read-only browser test: no bookings, reports, logins, payments, or provider updates.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const base=process.env.IWSN_BROWSER_SITE||'http://127.0.0.1:4317';
const debug=process.env.IWSN_BROWSER_CDP||'http://127.0.0.1:9431';
const all=[
 ['01-start','/'],['02-search','/suche'],['03-profile-example','/profil/beispiel'],
 ['04-regions','/regionen'],['05-zurich','/regionen/zuerich'],['06-categories','/kategorien'],
 ['07-massage','/massage'],['08-tantra','/tantra'],['09-studios','/studios'],
 ['10-high-class','/high-class'],['11-available','/jetzt-frei'],
 ['12-portal-comparison','/portalvergleich'],['13-guide','/ratgeber'],
 ['14-pricing','/preise'],['15-safety','/sicherheit'],['16-provider','/anbieter'],
 ['17-login','/login'],['18-entry','/eintrag'],['19-report','/melden'],['20-about','/ueber-uns']
];
const tabs=await (await fetch(debug+'/json',{signal:AbortSignal.timeout(10000)})).json();
const tab=tabs.find(x=>x.type==='page'&&x.webSocketDebuggerUrl);
assert.ok(tab,'headless Chrome is not available');
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((res,rej)=>{ws.addEventListener('open',res,{once:true});ws.addEventListener('error',rej,{once:true});});
let seq=0;
const waits=new Map(),uncaught=[];
ws.addEventListener('message',({data})=>{
 const msg=JSON.parse(data);
 if(msg.id&&waits.has(msg.id)){const {resolve,reject,timer}=waits.get(msg.id);clearTimeout(timer);waits.delete(msg.id);msg.error?reject(new Error(msg.error.message)):resolve(msg.result);}
 if(msg.method==='Runtime.exceptionThrown')uncaught.push(msg.params.exceptionDetails?.text||'Browser error');
});
const cmd=(method,params={})=>new Promise((resolve,reject)=>{
 const id=++seq,timer=setTimeout(()=>{waits.delete(id);reject(new Error('CDP command timed out: '+method));},18000);
 waits.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}));
});
const evaluate=async expression=>{
 const result=await cmd('Runtime.evaluate',{expression,awaitPromise:true,returnByValue:true});
 if(result.exceptionDetails)throw new Error('Browser evaluation failed');
 return result.result.value;
};
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
const poll=async predicate=>{for(let i=0;i<80;i++){if(await predicate())return;await sleep(100);}throw new Error('Page not ready');};
const out=path.resolve('output/flagship-v3/40-screens');
fs.mkdirSync(out,{recursive:true});
const summary=[];
try{
 await cmd('Page.enable');await cmd('Runtime.enable');await cmd('Network.enable');
 for(const [viewport,width,height,mobile] of [['desktop',1440,900,false],['mobile',390,844,true]]){
  await cmd('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile,screenWidth:width,screenHeight:height});
  for(const [file,route] of all){
   const response=await fetch(base+route,{signal:AbortSignal.timeout(15000),redirect:'follow'});
   assert.equal(response.status,200,'HTTP status '+route);
   await cmd('Page.navigate',{url:base+route});
   await poll(()=>evaluate('document.readyState==="complete"'));
   await sleep(180);
   const data=await evaluate("({title:document.title,headers:document.querySelectorAll('header.night-header').length,footers:document.querySelectorAll('footer.night-footer').length,h1:document.querySelectorAll('h1').length,main:document.querySelectorAll('main').length,viewport:innerWidth,scrollWidth:document.documentElement.scrollWidth,broken:[...document.images].filter(im=>im.complete&&im.naturalWidth===0).length})");
   const row={route,variant:viewport,width,...data};
   summary.push(row);
   if(data.h1!==1||data.main!==1||data.headers!==1||data.footers!==1||data.scrollWidth>data.viewport+1||data.broken!==0){
    throw new Error('Visual structure failed '+JSON.stringify(row));
   }
   const shot=await cmd('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
   fs.writeFileSync(path.join(out,file+'-'+viewport+'.png'),Buffer.from(shot.data,'base64'));
  }
 }
 const result={status:'PASS',screens:summary.length,errors:uncaught.length,views:summary};
 assert.equal(uncaught.length,0,'Uncaught browser errors');
 fs.writeFileSync(path.join(out,'manifest.json'),JSON.stringify(result,null,2));
 console.log(JSON.stringify({status:result.status,screens:result.screens,errors:result.errors,desktop:summary.filter(x=>x.variant==='desktop').length,mobile:summary.filter(x=>x.variant==='mobile').length}));
}finally{ws.close();}
