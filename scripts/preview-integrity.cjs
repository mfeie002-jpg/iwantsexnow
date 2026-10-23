// Inspect the built public experience so copy/link regressions fail CI.
// Run after npm run build. No external service or production request is made.
const fs = require("node:fs");
const path = require("node:path");
const root = path.resolve(__dirname, "..");
const serverRoot = path.join(root, ".next/server");
const pageRoot = path.join(serverRoot, "pages");
const manifest = JSON.parse(fs.readFileSync(path.join(serverRoot, "pages-manifest.json"), "utf8"));
const routes = Object.keys(manifest);
const failures = [];
let assertions = 0;
let links = 0;
const destinations = new Set();
function assert(condition, message) {
  assertions++;
  if (!condition) failures.push(message);
}
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(file) : [file];
  });
}
function text(html) {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, " ")
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, " ")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]*>/g, " ").replace(/&#x27;|&#39;/g, "'")
    .replace(/&amp;/g, "&").replace(/\s+/g, " ");
}
function routePattern(route) {
  return new RegExp("^" + route.split("/").map(segment => segment.startsWith("[") ? "[^/]+" : segment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("/") + "$");
}
const publicPages = walk(pageRoot).filter(file => file.endsWith(".html"));
const prohibited = [
  /100%\s+Verified/i, /verified companions/i, /verified escorts/i,
  /ID verified and background checked/i, /privacy absolutely guaranteed/i,
  /Verified reviews from real clients/i, /Round-the-clock bookings/i,
  /Licensed, legal, and compliant/i, /\d+\s+escorts available/i,
  /\d+\s+bookings today/i, /White-glove booking assistance/i,
  /Live Support/i, /We're online/i, /Average response time:/i,
  /Message Sent Successfully/i, /We've received your inquiry/i,
  /Subscribed Successfully/i, /excellence guaranteed/i, /Available 24\/7/i,
  /Responds in/i, /SafeDate Certified/i,
];
for (const file of publicPages) {
  const name = path.relative(pageRoot, file).replace(/\\/g, "/");
  const html = fs.readFileSync(file, "utf8");
  const visible = text(html);
  for (const pattern of prohibited) assert(!pattern.test(visible), `${name}: unsupported claim ${pattern}`);
  for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
    const href = match[1].replace(/&amp;/g, "&");
    assert(!/^(tel:|mailto:)|wa\.me\//i.test(href), `${name}: unconfirmed contact destination ${href}`);
    if (!href.startsWith("/") && !href.startsWith("#")) continue;
    assert(href !== "#", `${name}: empty link target`);
    const currentPath = name.replace(/index\.html$/, "").replace(/\.html$/, "");
    const url = new URL(href, `http://preview.local/${currentPath}`);
    const pathname = url.pathname.replace(/\/$/, "") || "/";
    const targetRoute = routes.find(route => routePattern(route).test(pathname));
    const assetExists = fs.existsSync(path.join(root, "public", pathname));
    links++;
    destinations.add(pathname);
    assert(Boolean(targetRoute) || assetExists, `${name}: missing destination ${href}`);
    if (url.hash && targetRoute && manifest[targetRoute].endsWith(".html")) {
      const target = fs.readFileSync(path.join(serverRoot, manifest[targetRoute]), "utf8");
      assert(target.includes(`id="${decodeURIComponent(url.hash.slice(1))}"`), `${name}: missing anchor ${href}`);
    }
  }
}
const home = fs.readFileSync(path.join(pageRoot, "index.html"), "utf8");
assert(text(home).includes("Plattform noch nicht freigeschaltet"), "Homepage must remain inactive");
assert(!/<form\b/i.test(home), "Homepage exposes a contact/newsletter form without delivery");
assert(text(home).includes("keine persönlichen Angaben"), "Homepage missing contact status");
for (const [route, marker] of [["contact", "noch kein betreuter Kontakt"], ["imprint", "noch kein vollständiges Impressum"], ["faq", "keine Mitgliedschaften"], ["about", "noch keinen aktiven Vermittlungsbetrieb"]]) {
  const html = fs.readFileSync(path.join(pageRoot, route + ".html"), "utf8");
  assert(text(html).includes(marker), `${route}: missing honest preview information`);
  assert(!/<form\b/i.test(html), `${route}: preview information must not collect data`);
}
// The Radix mobile menu and help dialog render when opened, so also protect their sources.
const chat = fs.readFileSync(path.join(root, "src/components/LiveChatWidget.tsx"), "utf8");
assert(!/setTimeout|setMessages|<Input|<form|<Textarea|timestamp/.test(chat), "Preview help still simulates or collects messages");
assert(chat.includes('href="/faq"'), "Help must link to FAQ without collecting messages");
const profile = fs.readFileSync(path.join(root, "src/pages/profile/[id].tsx"), "utf8");
assert(!/wa\.me|tel:|profile\.phone|profile\.whatsapp/.test(profile), "Sample profile exposes unconfirmed direct contact");
for (const file of publicPages) {
 const html = fs.readFileSync(file, "utf8");
 assert(!/href="\/(?:profile|catalogue)\/[^"/]+/.test(html), "Retired fictional record link: " + file);
}
console.log(`Preview integrity: ${assertions - failures.length}/${assertions} assertions; ${publicPages.length} built pages; ${links} internal links to ${destinations.size} paths.`);
for (const failure of failures) console.error("FAIL " + failure);
if (failures.length) process.exitCode = 1;
