// Reject committed merge-conflict markers in tracked code/assets before compilation.
// Never prints matching contents: archived records may contain private source observations.
const fs = require("node:fs");
const { execFileSync } = require("node:child_process");

const paths = execFileSync("git", [
  "ls-files", "-z", "--", "src", "public", "supabase", "scripts", ".github", "next.config.*",
], { encoding: "utf8" }).split("\0").filter(Boolean);

const marker = /^(?:<{7} .+|={7}|>{7} .+)\r?$/m;
const failures = [];
for (const path of paths) {
  const bytes = fs.readFileSync(path);
  if (bytes.includes(0)) continue;
  if (marker.test(bytes.toString("utf8"))) failures.push(path);
}
if (failures.length) {
  console.error("Unresolved merge markers in tracked files:\n" + failures.join("\n"));
  process.exitCode = 1;
} else {
  console.log("Tracked source/assets contain no unresolved merge markers.");
}
