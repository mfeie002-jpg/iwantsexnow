import test from "node:test";
import assert from "node:assert/strict";
import { parseAnalyzerCall, readBearerToken, ALLOWED_ANALYZER_FUNCTIONS } from "../src/lib/marketplace/analyzer-proxy-policy.ts";

test("only narrowly allowed internal analyzer functions can be invoked", () => {
  for (const name of ALLOWED_ANALYZER_FUNCTIONS) {
    assert.deepEqual(parseAnalyzerCall({function:name,payload:{url:"https://example.org"}}),
      {functionName:name,payload:{url:"https://example.org"}});
  }
});
for (const [description,input] of [
  ["no input",null], ["empty body",{}],
  ["malformed name",{function:"../admin"}],
  ["unknown function",{function:"scheduled-screenshots"}],
  ["path injection",{function:"capture-screenshot/../../admin"}],
  ["array payload",{function:"firecrawl-map",payload:[]}],
  ["null payload",{function:"firecrawl-map",payload:null}],
  ["huge payload",{function:"fetch-html",payload:{text:"x".repeat(250000)}}],
]) {
  test("rejects "+description,()=>assert.equal(parseAnalyzerCall(input),null));
}
test("payload can be omitted and becomes an empty object",()=>{
  assert.deepEqual(parseAnalyzerCall({function:"fetch-html"}),{functionName:"fetch-html",payload:{}});
});
test("missing or malformed Authorization is never interpreted as a bearer",()=>{
  for(const input of [undefined,null,"","Basic abc","Bearer abc","Bearer ","bearer a".repeat(200),"Bearer hello.world\nfoo"]){
    assert.equal(readBearerToken(input),null);
  }
});
test("long bearer token is parsed without trimming or expansion",()=>{
 const token="a".repeat(150)+"."+ "b".repeat(151)+"."+ "c".repeat(152);
 assert.equal(readBearerToken("Bearer "+token),token);
});
