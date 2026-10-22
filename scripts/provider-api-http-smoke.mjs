import assert from "node:assert/strict";
const origin = process.env.PREVIEW_SMOKE_ORIGIN || "http://127.0.0.1:43127";
assert(["127.0.0.1","localhost","[::1]"].includes(new URL(origin).hostname));
let count=0;
for(const name of ["session","provider-status"]) {
  for(const [method,query,status] of [["GET","",401],["GET","?ownerId=other",400],["POST","",405],["PATCH","",405],["DELETE","",405]]) {
    const response=await fetch(new URL("/api/marketplace/"+name+query,origin),{method,redirect:"error"});
    assert.equal(response.status,status);
    assert.match(response.headers.get("cache-control"),/no-store/);
    assert.equal(response.headers.get("x-robots-tag"),"noindex, nofollow");
    assert.equal(response.headers.get("set-cookie"),null);
    if(status===405) assert.equal(response.headers.get("allow"),"GET");
    count++;
  }
}
console.log("Marketplace HTTP rejection: "+count+"/"+count+" passed; no account or database writes.");
