import assert from "node:assert/strict";
import test from "node:test";

const BASE = (process.env.IWSN_TEST_BASE_URL || "http://127.0.0.1:3130").replace(/\/$/, "");

test("Homepage renders a single footer", async () => {
  const response = await fetch(BASE + "/", { signal: AbortSignal.timeout(15000) });
  assert.equal(response.status, 200);
  const html = await response.text();
  const footers = [...html.matchAll(/<footer\b/g)].length;
  assert.equal(footers, 1, `expected exactly one footer, got ${footers}`);
});

test("Image proxy denies missing, unknown and private targets", async () => {
  const cases = [
    "",
    "?u=" + encodeURIComponent("https://example.com/image.jpg"),
    "?u=" + encodeURIComponent("http://127.0.0.1:3130/"),
    "?u=" + encodeURIComponent("http://169.254.169.254/latest/meta-data/"),
    "?u=" + encodeURIComponent("https://link_to_image_1.com/fake.jpg")
  ];
  for (const query of cases) {
    const response = await fetch(BASE + "/api/img" + query, { signal: AbortSignal.timeout(15000) });
    assert.equal(response.status, 404, "unexpected proxy acceptance for case " + query.slice(0, 20));
  }
});

test("Image proxy denies unsupported methods", async () => {
  const response = await fetch(BASE + "/api/img", { method: "POST" });
  assert.equal(response.status, 405);
});
