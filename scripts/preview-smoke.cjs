// Run after: npm run build
// Exact pre-launch checks for demonstrational marketplace content and metadata.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const pageRoot = path.join(root, ".next/server/pages");

if (!fs.existsSync(pageRoot)) {
  console.error("Missing Next.js build output. Run npm run build first.");
  process.exit(1);
}

const critical = [
  { file: "index.html", must: ["DEMO / VORSCHAU", "Beispielprofile"], mustNot: ["50,000+", "Join FREE today"] },
  { file: "escort-zurich.html", must: ["Demo-Profile", "Keine echten Buchungen"], mustNot: ["bookings today", "100% Verified"] },
  { file: "register.html", must: ["Registrierung noch nicht freigeschaltet"], mustNot: ["type=\"password\"", "Create Your Account"] },
  { file: "login.html", must: ["Anmeldung noch nicht freigeschaltet"], mustNot: ["type=\"password\""] },
  { file: "forgot-password.html", must: ["Passwort zurücksetzen noch nicht freigeschaltet"], mustNot: ["type=\"email\""] },
  { file: "pricing.html", must: ["Geplantes Preismodell", "kein Kauf möglich"], mustNot: ["Hello World"] },
  { file: "demo-accounts.html", must: ["reine Testdaten", "Design-Vorschau"], mustNot: ["Hello World"] },
  { file: "privacy.html", must: ["Datenschutzinformationen", "keine abschliessende Datenschutzerklärung", "nicht für echte Registrierungen"], mustNot: ["<form", "Hello World"] },
  { file: "terms.html", must: ["Nutzungsbedingungen", "kein fertiger Nutzungsvertrag", "Keine kostenpflichtige Leistung"], mustNot: ["<form", "Hello World"] },
];

const blockedPreview = [
  ["booking-confirmation.html", "Buchungsanfrage"],
  ["create-post.html", "Inserat veröffentlichen"],
  ["verify.html", "Profilprüfung"],
  ["upload-photos.html", "Foto-Upload"],
  ["messages.html", "Nachrichten"],
  ["premium.html", "Premium-Mitgliedschaft"],
  ["boost.html", "Bezahlte Promotion"],
  ["gifts.html", "Geschenke"],
  ["content-feed.html", "Bezahlte Inhalte"],
  ["creator-dashboard.html", "Creator-Dashboard"],
  ["profile.html", "Benutzerprofil"],
  ["account-settings.html", "Kontoeinstellungen"],
];

const failures = [];
let assertions = 0;
function assert(file, condition, description) {
  assertions += 1;
  if (!condition) failures.push(file + ": " + description);
}
function inspect(file) {
  const html = fs.readFileSync(path.join(pageRoot, file), "utf8");
  const text = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ");
  const title = (html.match(/<title[^>]*>([^<]*)<\/title>/i) || [])[1] || "";
  assert(file, title.length > 4 && !title.includes("Hello World"), "missing or placeholder title");
  assert(file, /<meta(?=[^>]*name="robots")(?=[^>]*content="noindex, nofollow")[^>]*>/i.test(html), "missing preview noindex");
  return { html, text, title };
}
const all = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".html")) all.push(path.relative(pageRoot, full));
  }
}
walk(pageRoot);
assert("build", all.length >= 40, "incomplete prerendered route inventory");
for (const file of all) inspect(file);
for (const row of critical) {
  const html = fs.readFileSync(path.join(pageRoot, row.file), "utf8");
  const normalized = html.replace(/<!--[\s\S]*?-->/g, "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ");
  for (const phrase of row.must) assert(row.file, normalized.includes(phrase) || html.includes(phrase), "missing: " + phrase);
  for (const phrase of row.mustNot) assert(row.file, !html.includes(phrase), "prohibited: " + phrase);
}
for (const [file, feature] of blockedPreview) {
  const html = fs.readFileSync(path.join(pageRoot, file), "utf8");
  const plain = html.replace(/<!--[^]*?-->/g, "").replace(/<[^>]*>/g, " ").replace(/\\s+/g, " ");
  assert(file, plain.includes(feature + " noch nicht freigeschaltet"), "missing preview-only placeholder");
  assert(file, !/<form(?:\\s|>)/i.test(html), "page still exposes an interactive submission form");
  assert(file, !/Your booking request has been sent|Submit for Verification|Confirm Booking/.test(plain), "legacy fake-success text visible");
}
for (const file of ["register.tsx", "login.tsx", "forgot-password.tsx"]) {
  const source = fs.readFileSync(path.join(root, "src/pages", file), "utf8");
  assert(file, !source.includes("localStorage") && !source.includes("type=\"password\""), "browser-only password path still active");
}
console.log("Preview smoke: " + (assertions - failures.length) + "/" + assertions + " assertions pass; " + all.length + " static pages checked.");
for (const failure of failures) console.error("FAIL " + failure);
if (failures.length) process.exit(1);
