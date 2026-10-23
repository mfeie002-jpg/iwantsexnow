import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("next/package.json"));

test("Next image dependency resizes and encodes WebP and AVIF", async () => {
  const sharp = nextRequire("sharp");
  const source = await sharp({ create: { width: 32, height: 24, channels: 3, background: "#f7b818" } }).png().toBuffer();
  for (const format of ["webp", "avif"]) {
    const output = await sharp(source).resize(16, 12).toFormat(format).toBuffer();
    const metadata = await sharp(output).metadata();
    assert.equal(metadata.width, 16);
    assert.equal(metadata.height, 12);
    assert.ok(output.length > 0);
  }
});

test("Next resolves patched PostCSS and preserves CSS processing", async () => {
  const postcss = nextRequire("postcss");
  assert.equal(nextRequire("postcss/package.json").version, "8.5.31");
  const output = await postcss([]).process("/* fixture */ :root { --accent: #f7b818; } .gate { color: var(--accent) }", { from: undefined });
  assert.ok(output.css.includes("var(--accent)"));
  assert.equal(output.warnings().length, 0);
});
