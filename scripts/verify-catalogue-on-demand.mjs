// Optional browser regression: requires Next.js on 4188 and temporary local Chrome CDP on 9327.
import assert from 'node:assert/strict';
const site = process.env.IWSN_PERF_SITE || 'http://127.0.0.1:4188';
const debuggerUrl = process.env.IWSN_PERF_CDP || 'http://127.0.0.1:9327';
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const pages = await (await fetch(debuggerUrl + '/json')).json();
const page = pages.find(item => item.type === 'page');
assert.ok(page?.webSocketDebuggerUrl, 'Headless Chrome page not reachable');
const ws = new WebSocket(page.webSocketDebuggerUrl);
await new Promise((resolve, reject) => {
  ws.addEventListener('open', resolve, {once:true});
  ws.addEventListener('error', reject, {once:true});
});
let seq = 0;
const pending = new Map(), requests = [], problems = [];
ws.addEventListener('message', e => {
  const message = JSON.parse(e.data);
  if (message.id && pending.has(message.id)) {
    const {resolve,reject,timeout} = pending.get(message.id);
    pending.delete(message.id); clearTimeout(timeout);
    return message.error ? reject(new Error(message.error.message)) : resolve(message.result);
  }
  if (message.method === 'Network.requestWillBeSent') {
    if (new URL(message.params.request.url).pathname === '/api/catalogue') {
      requests.push({url:'/api/catalogue', type:message.params.type, requestId:message.params.requestId, status:null, bytes:null});
    }
  }
  if (message.method === 'Network.responseReceived') {
    const match = requests.find(r => r.requestId === message.params.requestId);
    if (match) match.status = message.params.response.status;
  }
  if (message.method === 'Network.loadingFinished') {
    const match = requests.find(r => r.requestId === message.params.requestId);
    if (match) match.bytes = message.params.encodedDataLength;
  }
  if (message.method === 'Runtime.exceptionThrown') problems.push(String(message.params.exceptionDetails?.text || 'Runtime exception'));
});
const send = (method, params={}) => new Promise((resolve,reject) => {
  const id = ++seq;
  const timeout = setTimeout(() => {pending.delete(id); reject(new Error('CDP timeout: '+method));}, 15000);
  pending.set(id,{resolve,reject,timeout});
  ws.send(JSON.stringify({id,method,params}));
});
try {
  await send('Page.enable');await send('Network.enable');await send('Runtime.enable');
  await send('Emulation.setDeviceMetricsOverride',{width:1440,height:1000,deviceScaleFactor:1,mobile:false});
  await send('Page.navigate',{url:site+'/'});
  await sleep(3200);
  assert.equal(requests.length,0,'SSR homepage must not duplicate /api/catalogue');
  const home = await send('Runtime.evaluate',{expression:'document.querySelectorAll("footer").length',returnByValue:true});
  assert.equal(home.result.value,1,'Homepage footer count');
  await send('Page.navigate',{url:site+'/safety'});
  await sleep(2200);
  assert.equal(requests.length,0,'Info page must not download the catalogue by default');
  const opened=await send('Runtime.evaluate',{expression:'Boolean(document.querySelector(".night-desktop-nav button"))',returnByValue:true});
  assert.equal(opened.result.value,true,'Xenia trigger must be present');
  await send('Runtime.evaluate',{expression:'document.querySelector(".night-desktop-nav button").click()',returnByValue:true});
  await sleep(3000);
  assert.equal(requests.length,1,'Xenia from info page must fetch once, only on request');
  assert.equal(requests[0].status,200,'Xenia catalogue request must succeed');
  const guide=await send('Runtime.evaluate',{expression:'document.querySelector(".night-guide-result-number")?.textContent || ""',returnByValue:true});
  assert.ok(guide.result.value.trim().length>0,'Xenia displays catalogue results');
  console.log(JSON.stringify({
    outcome:'PASS', homepageExtraCatalogueRequests:0, infoPageBeforeGuide:0,
    guideCatalogueRequests:1, guideHttpStatus:requests[0].status,
    guideTransferBytes:requests[0].bytes,
    footerCount:home.result.value, uncaughtRuntimeErrors:problems.length
  },null,2));
  assert.equal(problems.length,0,'No unhandled runtime exceptions');
} finally { ws.close(); }
