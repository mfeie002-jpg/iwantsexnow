// Xenia zero-typing three-choice browser journey. No database mutations or reports.
import assert from 'node:assert/strict';
const base=process.env.IWSN_BROWSER_SITE||'http://127.0.0.1:4317';
const cdp=process.env.IWSN_BROWSER_CDP||'http://127.0.0.1:9431';
const tabs=await (await fetch(cdp+'/json',{signal:AbortSignal.timeout(10000)})).json();
const tab=tabs.find(t=>t.type==='page'&&t.webSocketDebuggerUrl);assert.ok(tab);
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
let idx=0;const pending=new Map(),errors=[],requests=[];
ws.addEventListener('message',({data})=>{
 const item=JSON.parse(data);
 if(item.id&&pending.has(item.id)){const {resolve,reject,timer}=pending.get(item.id);clearTimeout(timer);pending.delete(item.id);item.error?reject(new Error(item.error.message)):resolve(item.result);}
 if(item.method==='Runtime.exceptionThrown')errors.push(item.params.exceptionDetails?.text);
 if(item.method==='Network.responseReceived'){
  try{const u=new URL(item.params.response.url);if(u.pathname==='/api/catalogue/page')requests.push(item.params.response.status)}catch{}
 }
});
const cmd=(method,params={})=>new Promise((resolve,reject)=>{
 const id=++idx,timer=setTimeout(()=>{pending.delete(id);reject(new Error('CDP timeout: '+method));},15000);
 pending.set(id,{resolve,reject,timer});ws.send(JSON.stringify({id,method,params}));
});
const evalJs=async expression=>{
 const r=await cmd('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});if(r.exceptionDetails)throw Error('Browser JavaScript error');return r.result.value;
};
const wait=async (test,label)=>{for(let n=0;n<60;n++){if(await test())return;await new Promise(r=>setTimeout(r,180));}throw new Error('Timeout '+label);};
try{
 await cmd('Page.enable');await cmd('Runtime.enable');await cmd('Network.enable');
 await cmd('Emulation.setDeviceMetricsOverride',{width:390,height:844,deviceScaleFactor:1,mobile:true,screenWidth:390,screenHeight:844});
 await cmd('Page.navigate',{url:base+'/'});
 await wait(()=>evalJs('document.readyState==="complete"'),'homepage');
 await evalJs("document.querySelector('.flagship-hero-choices button').click()");
 await wait(()=>evalJs("document.querySelector('[role=\"dialog\"]')?.textContent?.includes('Deine Region.')===true"),'step region');
 assert.equal(await evalJs("document.querySelector('[role=\"dialog\"] h2')?.textContent?.trim()"),'Deine Region.');
 await evalJs("[...document.querySelectorAll('.night-guide-2027 .night-options button')].find(b=>b.textContent.trim()==='Zug').click()");
 await wait(()=>evalJs("document.querySelector('[role=\"dialog\"]')?.textContent?.includes('Dein Bereich.')===true"),'step category');
 await evalJs("[...document.querySelectorAll('.night-guide-2027 .night-options button')].find(b=>b.textContent.trim()==='Massage & Tantra').click()");
 await wait(()=>evalJs("document.querySelector('[role=\"dialog\"]')?.textContent?.includes('Deine Zeit.')===true"),'step time');
 await evalJs("[...document.querySelectorAll('.night-guide-2027 .night-options button')].find(b=>b.textContent.includes('Flexibel')).click()");
 await wait(()=>evalJs("document.querySelector('[role=\"dialog\"]')?.textContent?.includes('Deine Auswahl steht.')===true"),'step summary');
 await wait(()=>evalJs("Boolean(document.querySelector('.night-guide-submit[href]'))"),'matching link');
 const state=await evalJs("({href:document.querySelector('.night-guide-submit[href]')?.getAttribute('href'),summary:document.querySelector('.night-guide-summary')?.textContent})");
 assert.equal(state.href,'/search?canton=ZG&category=massage');
 assert.ok(state.summary.includes('Zug'));assert.ok(state.summary.includes('Flexibel'));
 assert.ok(requests.includes(200),'Guide count should be backed by working count-only API');
 assert.equal(errors.length,0);
 console.log(JSON.stringify({status:'PASS',mobileWidth:390,steps:'Zug → Massage & Tantra → Flexibel',href:state.href,countApiHttp200:true,uncaughtErrors:errors.length},null,2));
}finally{ws.close();}
