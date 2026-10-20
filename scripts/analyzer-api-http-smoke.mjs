// Read-only localhost check of the built Next.js API boundary.
// Start separately: npx next start --hostname 127.0.0.1 --port 43127
const endpoint = process.env.ANALYZER_SMOKE_URL || "http://127.0.0.1:43127/api/supabase-function";
const cases = [
  { name:"GET blocked", method:"GET", status:405 },
  { name:"invalid function rejected", method:"POST", data:{function:"../admin",payload:{}}, status:400 },
  { name:"arbitrary function rejected", method:"POST", data:{function:"scheduled-screenshots",payload:{}}, status:400 },
  { name:"valid function without JWT rejected", method:"POST", data:{function:"fetch-html",payload:{url:"https://example.org"}}, status:401 },
  { name:"valid function with malformed bearer rejected", method:"POST", data:{function:"firecrawl-map",payload:{}}, authorization:"Bearer bad",status:401 },
];
let passed=0;
for(const c of cases) {
 const response=await fetch(endpoint,{
   method:c.method,
   headers:{"Content-Type":"application/json", ...(c.authorization?{Authorization:c.authorization}:{})},
   body:c.data?JSON.stringify(c.data):undefined,
   signal:AbortSignal.timeout(5000),
 });
 const text=await response.text();
 const ok=response.status===c.status && response.headers.get("cache-control")?.includes("no-store");
 if(!ok) {console.error("FAIL",c.name,"expected",c.status,"got",response.status,text.slice(0,200));process.exitCode=1;}
 else {passed++; console.log("PASS",c.name, response.status);}
}
console.log("API HTTP smoke",passed+"/"+cases.length);
if(passed!==cases.length)process.exitCode=1;
