import assert from "node:assert/strict";
for (const route of ["/search", "/search?view=demo", "/search?city=zurich&category=escort"]) {
 const response=await fetch("http://127.0.0.1:43127"+route);
 assert.equal(response.status,200);
 const html=(await response.text()).replace(/<!--[\s\S]*?-->/g, "");
 assert.match(html,/Inserate noch nicht freigeschaltet/);
 assert.doesNotMatch(html,/<form\b|href="\/catalogue\//i);
 assert.match(html,/<meta(?=[^>]*name="robots")(?=[^>]*content="noindex, nofollow")[^>]*>/);
}
for (const route of ["/catalogue/demo-zurich-escort","/profile/1","/profile/2"]) {
 const response=await fetch("http://127.0.0.1:43127"+route);
 assert.equal(response.status,404);
 assert.match(response.headers.get("x-robots-tag"),/noindex/);
}
console.log("Retired catalogue HTTP: 6/6; no fictional records or links, noindex preserved.");
