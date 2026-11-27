import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const origin=process.env.IWSN_BROWSER_SITE||'http://127.0.0.1:4317';
const debuggerUrl=process.env.IWSN_BROWSER_CDP||'http://127.0.0.1:9431';
const tabs=await (await fetch(debuggerUrl+'/json',{signal:AbortSignal.timeout(10000)})).json();
const tab=tabs.find(x=>x.type==='page'&&x.webSocketDebuggerUrl);
assert.ok(tab,'Browser not connected');
const ws=new WebSocket(tab.webSocketDebuggerUrl);
await new Promise((resolve,reject)=>{ws.addEventListener('open',resolve,{once:true});ws.addEventListener('error',reject,{once:true});});
let id=0;
const waiting=new Map(),errors=[];
ws.addEventListener('message',({data})=>{
 const msg=JSON.parse(data);
 if(msg.id&&waiting.has(msg.id)){const {resolve,reject,timer}=waiting.get(msg.id);clearTimeout(timer);waiting.delete(msg.id);msg.error?reject(new Error(msg.error.message)):resolve(msg.result);}
 if(msg.method==='Runtime.exceptionThrown')errors.push(msg.params.exceptionDetails?.text||'JavaScript exception');
});
const send=(method,params={})=>new Promise((resolve,reject)=>{
 const key=++id,timer=setTimeout(()=>{waiting.delete(key);reject(new Error('CDP timeout '+method));},18000);
 waiting.set(key,{resolve,reject,timer});ws.send(JSON.stringify({id:key,method,params}));
});
const evaluate=async expression=>{
 const response=await send('Runtime.evaluate',{expression,returnByValue:true,awaitPromise:true});
 if(response.exceptionDetails)throw Error('Browser evaluation failed');
 return response.result.value;
};
const pause=ms=>new Promise(r=>setTimeout(r,ms));
const wait=async(pred,name)=>{for(let i=0;i<60;i++){if(await pred())return;await pause(180);}throw Error('Timeout waiting: '+name);};
const dir=path.resolve('output/flagship-v3');
fs.mkdirSync(dir,{recursive:true});
const targets=[
 ['home','/',1440,900,false],
 ['home-mobile','/',390,844,true],
 ['regions-mobile','/regionen',390,844,true],
 ['categories-mobile','/kategorien',390,844,true],
 ['search-mobile','/search',390,844,true],
 ['massage-desktop','/massage',1440,900,false]
];
const output=[];
try{
 await send('Page.enable');await send('Runtime.enable');await send('Network.enable');
 for(const [name,route,width,height,mobile] of targets){
  await send('Emulation.setDeviceMetricsOverride',{width,height,deviceScaleFactor:1,mobile,screenWidth:width,screenHeight:height});
  await send('Page.navigate',{url:origin+route});
  await wait(()=>evaluate('document.readyState==="complete"'),route+' document');
  await pause(420);
  const data=await evaluate("({title:document.title,h1:document.querySelectorAll('h1').length,header:document.querySelectorAll('header.night-header').length,footer:document.querySelectorAll('footer.night-footer').length,bodyWidth:document.documentElement.scrollWidth,viewport:innerWidth,links:document.querySelectorAll('a[href]').length,hero:Boolean(document.querySelector('.flagship-hero')),xeniaButtons:document.querySelectorAll('.flagship-hero-choices button').length,imageFailed:[...document.querySelectorAll('img')].filter(i=>i.complete&&i.naturalWidth===0).length})");
  const screenshot=await send('Page.captureScreenshot',{format:'png',captureBeyondViewport:false});
  fs.writeFileSync(path.join(dir,name+'.png'),Buffer.from(screenshot.data,'base64'));
  const row={route,width,...data};
  output.push(row);
  assert.equal(data.h1,1,route+' should have one H1');
  assert.equal(data.header,1,route+' should have one header');
  assert.equal(data.footer,1,route+' should have one footer');
  assert.ok(data.bodyWidth<=data.viewport+1,route+' horizontal overflow '+data.bodyWidth+' > '+data.viewport);
  assert.equal(data.imageFailed,0,route+' contains broken images');
  if(name==='home-mobile')assert.equal(data.xeniaButtons,3);
 }
 assert.equal(errors.length,0,'Uncaught browser errors');
 console.log(JSON.stringify({result:'PASS',screens:output.length,errors:errors.length,output},null,2));
} finally{ws.close();}
