import test from "node:test";
import assert from "node:assert/strict";
import { createRequire } from "node:module";
const require = createRequire(import.meta.url);
const tailwindRequire = createRequire(require.resolve("tailwindcss/package.json"));
const nestedRequire = createRequire(tailwindRequire.resolve("postcss-nested/package.json"));

test("Tailwind and nested CSS resolve the patched selector parser", () => {
  assert.equal(tailwindRequire("postcss-selector-parser/package.json").version, "7.1.6");
  assert.equal(nestedRequire("postcss-selector-parser/package.json").version, "7.1.6");
});

test("Tailwind retains responsive, hover, group, peer and arbitrary-value utilities", async () => {
  const postcss = require("postcss");
  const tailwind = require("tailwindcss");
  const result = await postcss([tailwind({ content: [{ raw: '<div class="md:flex hover:bg-yellow-500 group-hover:block peer-checked:block w-[37px]"></div>' }], corePlugins: { preflight: false } })]).process("@tailwind utilities;", { from: undefined });
  for (const expected of ["min-width: 768px", ".md\\:flex", ".hover\\:bg-yellow-500:hover", ".group:hover", ".group-hover\\:block", ".peer:checked", ".peer-checked\\:block", "width: 37px"]) assert.ok(result.css.includes(expected), expected);
  const nested = await postcss([tailwindRequire("postcss-nested")]).process(".gate { &:hover, &:focus { color: gold } }", { from: undefined });
  assert.match(nested.css, /\.gate:hover,\s*\.gate:focus/);
});

test("flat repeated-class selectors parse intact", () => {
  const parser = tailwindRequire("postcss-selector-parser");
  const selector = ".a".repeat(10000);
  assert.equal(parser().processSync(selector), selector);
});
