import test from "node:test";
import assert from "node:assert/strict";
import { mayPublishProvider, toPublicProviderCard } from "../src/lib/marketplace/publication.ts";
const now = new Date("2026-10-20T10:00:00Z");
const valid = {
  id:"p1", ownerId:"owner1", displayAlias:"Example", city:"Zürich",
  description:"Self-submitted example", origin:"first_party_opt_in",
  state:"approved", photoRightsConfirmed:true,
  moderation:{approvedBy:"reviewer2",approvedAt:"2026-10-18T12:00:00Z"},
  proof:{ageVerifiedAt:"2026-10-15T12:00:00Z",identityVerifiedAt:"2026-10-16T12:00:00Z",
    consentAt:"2026-10-17T12:00:00Z",consentVersion:"approved-v1"},
  privateEmail:"sensitive@example.invalid", identityDocument:"private_reference",
  realName:"not for public output",
};
const mod=(field,value)=>({...valid,[field]:value});
const cases=[
  ["no policy",valid,undefined],
  ["empty policy",valid,""],
  ["not an object",null,"approved-v1"],
  ["raw imported profile",mod("origin","imported"),"approved-v1"],
  ["fake demo profile",mod("origin","demo"),"approved-v1"],
  ["draft",mod("state","draft"),"approved-v1"],
  ["submitted",mod("state","submitted"),"approved-v1"],
  ["no media rights",mod("photoRightsConfirmed",false),"approved-v1"],
  ["owner self-approved",mod("moderation",{approvedBy:"owner1",approvedAt:"2026-10-18T12:00:00Z"}),"approved-v1"],
  ["missing moderation",mod("moderation",null),"approved-v1"],
  ["missing evidence",mod("proof",null),"approved-v1"],
  ["expired proof",mod("proof",{...valid.proof,ageVerifiedAt:"2024-01-01T00:00:00Z"}),"approved-v1"],
  ["future proof",mod("proof",{...valid.proof,identityVerifiedAt:"2026-12-01T00:00:00Z"}),"approved-v1"],
  ["old review",mod("moderation",{approvedBy:"reviewer2",approvedAt:"2025-01-01T00:00:00Z"}),"approved-v1"],
  ["wrong consent policy",mod("proof",{...valid.proof,consentVersion:"old-v0"}),"approved-v1"],
  ["missing public alias",mod("displayAlias",""),"approved-v1"],
  ["empty description",mod("description",""),"approved-v1"],
];
for(const [label,record,policy] of cases){
 test("reject "+label,()=>{assert.equal(mayPublishProvider(record,policy,now),false);
   assert.equal(toPublicProviderCard(record,policy,now),null);});
}
test("approved first-party record requires named legal version",()=>{
 assert.equal(mayPublishProvider(valid,"approved-v1",now),true);
});
test("projection never leaks personal records",()=>{
 assert.deepEqual(toPublicProviderCard(valid,"approved-v1",now),
   {id:"p1",displayAlias:"Example",city:"Zürich",description:"Self-submitted example"});
});
