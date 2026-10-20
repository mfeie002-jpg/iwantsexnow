import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const handler = require("../.next/server/pages/api/supabase-function.js").default;
const token = "a".repeat(130) + "." + "b".repeat(140) + "." + "c".repeat(140);
const jwt = "Bearer " + token;
const previousEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};
process.env.NEXT_PUBLIC_SUPABASE_URL = "https://example.supabase.co";
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = "test-anon-key-not-a-real-secret";

function response() {
  return {
    code: 200, body: null, headers: {},
    setHeader(name,value){this.headers[name.toLowerCase()]=value;return this;},
    status(code){this.code=code;return this;},
    json(data){this.body=data;return this;},
  };
}
function request() {
  return {method:"POST",headers:{authorization:jwt},
    body:{function:"fetch-html",payload:{url:"https://example.org"}}};
}
function json(body,status=200) {
  return new Response(JSON.stringify(body),{status,headers:{"Content-Type":"application/json"}});
}

test("expired Supabase JWT prevents any Edge action",async()=>{
 const actual=globalThis.fetch;
 const calls=[];
 globalThis.fetch=async url=>{calls.push(String(url));return json({error:"unauthorized"},401);};
 try{
   const res=response(); await handler(request(),res);
   assert.equal(res.code,401);
   assert.equal(calls.length,1);
   assert.match(calls[0],/\/auth\/v1\/user/);
 }finally{globalThis.fetch=actual;}
});
test("non-admin JWT is verified then denied, without any Edge call",async()=>{
 const actual=globalThis.fetch;const calls=[];
 globalThis.fetch=async(url,init)=>{
   calls.push({url:String(url),authorization:init?.headers?.Authorization});
   if(String(url).includes("/auth/v1/user"))return json({id:"c0d83d5e-8937-473e-80db-91a43d978ceb"});
   if(String(url).includes("/rest/v1/user_roles"))return json([]);
   throw Error("Unsafe Edge function invocation");
 };
 try{
   const res=response();await handler(request(),res);
   assert.equal(res.code,403);
   assert.equal(calls.length,2);
   assert.equal(calls[0].authorization,jwt);
   assert.equal(calls[1].authorization,jwt);
 }finally{globalThis.fetch=actual;}
});
test("authorized admin gets only an allowlisted Edge function with USER bearer",async()=>{
 const actual=globalThis.fetch;const calls=[];
 globalThis.fetch=async(url,init)=>{
   calls.push({url:String(url),authorization:init?.headers?.Authorization,apikey:init?.headers?.apikey});
   if(String(url).includes("/auth/v1/user"))return json({id:"c0d83d5e-8937-473e-80db-91a43d978ceb"});
   if(String(url).includes("/rest/v1/user_roles"))return json([{role:"admin"}]);
   if(String(url).includes("/functions/v1/fetch-html"))return json({html:"safe-data"});
   throw Error("Unexpected outbound call");
 };
 try{
   const res=response();await handler(request(),res);
   assert.equal(res.code,200);
   assert.deepEqual(res.body,{html:"safe-data"});
   assert.equal(calls.length,3);
   assert.equal(calls[2].authorization,jwt);
   assert.equal(calls[2].apikey,"test-anon-key-not-a-real-secret");
   assert.equal(res.headers["cache-control"],"no-store");
 }finally{globalThis.fetch=actual;}
});
test.after(()=>{
 for(const [key,value] of [["NEXT_PUBLIC_SUPABASE_URL",previousEnv.url],["NEXT_PUBLIC_SUPABASE_ANON_KEY",previousEnv.key]]){
   if(value===undefined)delete process.env[key];else process.env[key]=value;
 }
});
