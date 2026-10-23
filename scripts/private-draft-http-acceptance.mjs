// Full loopback HTTP acceptance with real compiled routes/SDK and synthetic transport.
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
const origin="http://127.0.0.1:43128";
const server=spawn(process.execPath,["scripts/private-draft-fixture-server.mjs"],{env:{...process.env,PRIVATE_DRAFT_UI_FIXTURE:"1"},stdio:["ignore","pipe","pipe"],windowsHide:true});
let output="";server.stderr.on("data",b=>{output=(output+b).slice(-4000)});
try {
 await new Promise((resolve,reject)=>{const timer=setTimeout(()=>reject(Error("Fixture startup timeout: "+output)),30000);server.once("exit",c=>{clearTimeout(timer);reject(Error("Fixture exited "+c+": "+output))});server.stdout.on("data",b=>{if(String(b).includes("Synthetic private flow only")){clearTimeout(timer);resolve()}})});
 const api="/api/private/provider-drafts",session="/api/private/provider-session";
 const fields={displayAlias:"Synthetic HTTP fixture",city:"Zürich",description:"No real personal data",photoRightsConfirmed:false};
 async function call(path,method="GET",body,cookie="",extra={}){return fetch(origin+path,{method,headers:{Origin:origin,"Content-Type":"application/json",...(cookie?{Cookie:cookie}:{}),...extra},body:body===undefined?undefined:JSON.stringify(body),signal:AbortSignal.timeout(20000)})}
 async function login(email){const r=await call(session,"POST",{email,password:"synthetic-test-password"});assert.equal(r.status,200);const data=await r.json();assert.ok(!JSON.stringify(data).includes("token"));return r.headers.get("set-cookie").split(";")[0]}
 const page=await call("/private/provider-draft");assert.equal(page.status,200);assert.match(page.headers.get("x-robots-tag"),/noindex/);assert.match(await page.text(),/Privater Anbieter-Entwurf/);
 assert.equal((await call(api,"POST",fields)).status,401);
 const owner=await login("owner@example.invalid");const other=await login("other@example.invalid");
 let r=await call(api,"POST",fields,owner);assert.equal(r.status,201);const id=(await r.json()).draft.id;
 r=await call(api+"?id="+id,"GET",undefined,owner);assert.equal(r.status,200);assert.equal((await r.json()).draft.city,"Zürich");
 r=await call(api,"PUT",{id,fields:{...fields,city:"Bern"}},owner);assert.equal(r.status,200);
 r=await call(api+"?id="+id,"GET",undefined,owner);assert.equal((await r.json()).draft.city,"Bern");
 assert.equal((await call(api+"?id="+id,"GET",undefined,other)).status,404);
 assert.equal((await call(api,"PUT",{id,fields},other)).status,404);
 assert.equal((await call(api,"POST",{...fields,state:"approved"},owner)).status,400);
 assert.equal((await call(api,"POST",fields,owner,{Origin:"https://evil.invalid"})).status,403);
 assert.equal((await call(api,"POST",{...fields,description:"x".repeat(9000)},owner)).status,413);
 r=await call(session,"DELETE",undefined,owner);assert.equal(r.status,200);assert.match(r.headers.get("set-cookie"),/Max-Age=0/);
 assert.equal((await call(api+"?id="+id,"GET",undefined,owner)).status,401);
 console.log("PASS private flow HTTP: gated page, sessions, owner create/read/edit, second-user denial, spoof/CSRF/size rejection, logout; synthetic backend only.");
} finally {server.kill();}
