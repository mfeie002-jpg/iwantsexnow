// Run only after a confirmed Softgen Force Pull + redeploy.
// Read-only public check: validates exact release without making any account or booking.
const origin = process.env.PUBLIC_SITE_ORIGIN || "https://iwantsexnow.ch";
const checks = [
  { path: "/", text: ["DEMO / VORSCHAU"], not: ["50,000+", "Hello World"] },
  { path: "/register", text: ["Registrierung noch nicht freigeschaltet"], not: ["Create Your Account", "Hello World"] },
  { path: "/login", text: ["Anmeldung noch nicht freigeschaltet"], not: ["type=\"password\""] },
  { path: "/booking-confirmation", text: ["Buchungsanfrage noch nicht freigeschaltet"], not: ["Contact Information"] },
  { path: "/verify", text: ["Profilprüfung noch nicht freigeschaltet"], not: ["Upload Verification Photo"] },
  { path: "/create-post", text: ["Inserat veröffentlichen noch nicht freigeschaltet"], not: ["Post Published!"] },
  { path: "/privacy", text: ["Datenschutzinformationen", "keine abschliessende Datenschutzerklärung"], not: ["404 - Page Not Found"] },
  { path: "/terms", text: ["Nutzungsbedingungen", "kein fertiger Nutzungsvertrag"], not: ["404 - Page Not Found"] },
];
let passed = 0, failed = 0;
for (const c of checks) {
  const url = new URL(c.path, origin);
  url.searchParams.set("release_check", String(Date.now()));
  try {
    const response = await fetch(url, { headers: { "Cache-Control": "no-cache" }, signal: AbortSignal.timeout(15000) });
    const html = await response.text();
    const text = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
    const ok = response.status === 200 &&
      html.includes("noindex, nofollow") &&
      c.text.every(s => text.includes(s) || html.includes(s)) &&
      c.not.every(s => !html.includes(s));
    if (!ok) {
      console.error("FAIL", c.path, "http", response.status,
        "wanted", c.text.filter(s => !text.includes(s) && !html.includes(s)),
        "forbidden", c.not.filter(s => html.includes(s)),
        "noindex", html.includes("noindex, nofollow"));
      failed++;
    } else { console.log("PASS", c.path); passed++; }
  } catch (error) {
    failed++; console.error("FAIL", c.path, String(error));
  }
}
console.log("Live release QA:", passed + "/" + checks.length);
if (failed) process.exitCode = 1;
