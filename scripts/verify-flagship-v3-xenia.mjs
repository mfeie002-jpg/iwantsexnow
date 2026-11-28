// Xenia zero-typing three-choice browser journey. No database mutations or reports.
import assert from 'node:assert/strict';
const base=process.env.IWSN_BROWSER_SITE||'http://127.0.0.1:4317';
const cdp=process.env.IWSN_BROWSER_CDP||'http://127.0.0.1:9431';
const tabs=await (await fetch(cdp+'/json',{signal:AbortSignal.timeout(10000)})).json();
const tab=tabs.find(t=>t.type==='page'&&t.webSocketDebuggerUrl);assert.ok(tab);
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
let idx=0;const pending=new Map(),errors=[];
ws.addEventListener('message',({data})=>{
 const item=JSON.parse(data);
 if(item.id&&pending.has(item.id)){const {resolve,reject,timer}=pending.get(item.id);clearTimeout(timer);pending.delete(item.id);item.error?reject(new Error(item.error.message)):resolve(item.result);}
 if(item.method==='Runtime.exceptionThrown')errors.push(item.params.exceptionDetails?.text);

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
 const buttonText = (selector, text) => evalJs(
   `[...document.querySelectorAll(${JSON.stringify(selector)})].find(el=>el.textContent.trim()===${JSON.stringify(text)})?.click()`
 );
 await wait(()=>evalJs("Boolean(window.next?.router?.isReady)"),'hydration');
 await buttonText('button', 'Ja, ich bin 18 oder älter');
 await evalJs("document.querySelector('.flagship-hero-choices button').click()");
 for (const [title, label] of [['Ort wählen','Zug'], ['Kategorie wählen','Massage & Tantra'], ['Budget wählen','Budget offen']]) {
   await wait(()=>evalJs(`document.querySelector('.xenia-sheet h2')?.textContent===${JSON.stringify(title)}`),title);
   await buttonText('.xenia-sheet button', label);
 }
 await wait(()=>evalJs("location.pathname==='/search' && Boolean(document.querySelector('.night-count'))"),'filtered results');
 const state=await evalJs("({href:location.pathname+location.search,results:document.querySelector('.night-count').textContent})");
 assert.equal(state.href,'/search?canton=ZG&category=massage');
 assert.match(state.results,/^[0-9][0-9’']* Einträge$/);
 assert.equal(errors.length,0);
 console.log(JSON.stringify({status:'PASS', mobileWidth:390, ...state, uncaughtErrors:errors.length},null,2));
}finally{ws.close();}
