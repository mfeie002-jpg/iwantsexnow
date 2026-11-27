// Mobile browser negative-path test; never submits a valid report.
import assert from "node:assert/strict";
const SITE = process.env.IWSN_BROWSER_SITE || "http://127.0.0.1:4253";
const DEBUG = process.env.IWSN_BROWSER_CDP || "http://127.0.0.1:9371";
const pause = (ms) => new Promise(resolve => setTimeout(resolve,ms));
const targets = await (await fetch(DEBUG+"/json",{signal:AbortSignal.timeout(10000)})).json();
const target = targets.find(t=>t.type==="page"&&t.webSocketDebuggerUrl);
assert.ok(target);
const ws = new WebSocket(target.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener("open",resolve,{once:true});ws.addEventListener("error",reject,{once:true});});
let seq=0;
const waiting=new Map(), posts=[], exceptions=[];
ws.addEventListener("message",({data})=>{
 const e=JSON.parse(data);
 if(e.id && waiting.has(e.id)){const {resolve,reject,timeout}=waiting.get(e.id);waiting.delete(e.id);clearTimeout(timeout);e.error?reject(new Error(e.error.message)):resolve(e.result);}
 if(e.method==="Network.requestWillBeSent" && e.params.request.url.includes("/api/vault/metrics") && e.params.request.method==="POST")posts.push(e.params.request.url);
 if(e.method==="Runtime.exceptionThrown")exceptions.push(e.params.exceptionDetails?.text||"Browser exception");
});
const send=(method,params={})=>new Promise((resolve,reject)=>{
 const id=++seq;const timeout=setTimeout(()=>{waiting.delete(id);reject(new Error("CDP timeout "+method));},12000);
 waiting.set(id,{resolve,reject,timeout});ws.send(JSON.stringify({id,method,params}));
});
const evalJs=async expression=>{
 const r=await send("Runtime.evaluate",{expression,returnByValue:true,awaitPromise:true});
 if(r.exceptionDetails)throw new Error("Browser evaluation failed");
 return r.result.value;
};
const wait=async (test,label)=>{
 for(let i=0;i<45;i++){if(await test())return;await pause(200);}
 throw new Error("Wait failed: "+label);
};
try{
 await send("Page.enable");await send("Network.enable");await send("Runtime.enable");
 await send("Emulation.setDeviceMetricsOverride",{width:390,height:844,deviceScaleFactor:1,mobile:true,screenWidth:390,screenHeight:844});
 await send("Page.navigate",{url:SITE+"/report"});
 await wait(async()=>await evalJs('document.readyState==="complete"'),"document");
 await pause(900);
 const initial=await evalJs("({h1:document.querySelectorAll('h1').length,footers:document.querySelectorAll('footer').length,width:document.documentElement.scrollWidth,viewport:innerWidth,form:Boolean(document.querySelector('form[aria-label=\"Vertrauliche Meldung einreichen\"]'))})");
 assert.equal(initial.h1,1);assert.equal(initial.footers,1);assert.ok(initial.form);assert.ok(initial.width<=initial.viewport+1);
 await evalJs("document.querySelector('form button[type=\"submit\"]').click()");
 await wait(async()=>await evalJs("Boolean(document.querySelector('#report-error'))"),"validation alert");
 const state=await evalJs("({text:document.querySelector('#report-error')?.textContent||'',focus:document.activeElement?.id,invalid:document.querySelector('#report-profile')?.getAttribute('aria-invalid')})");
 assert.match(state.text,/Profil-ID oder einen Link/);assert.equal(state.focus,"report-error");assert.equal(state.invalid,"true");
 assert.equal(posts.length,0,"No valid report is ever submitted");
 assert.equal(exceptions.length,0);
 console.log(JSON.stringify({outcome:"PASS",viewport:390,footerCount:1,clientValidation:true,accessibleFocus:true,invalidReportRequests:0,horizontalOverflow:false,browserExceptions:0,realReportsSubmitted:0},null,2));
} finally{ws.close();}
