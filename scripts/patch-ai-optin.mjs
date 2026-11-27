import fs from "fs";
for (const file of ["src/pages/api/avatar-chat/[providerId].ts", "src/pages/api/fantasy-preview/generate.ts"]) {
  if (!fs.existsSync(file)) continue;
  let src = fs.readFileSync(file, "utf8");
  if (!src.includes("assertVerifiedAiOptIn")) {
    src = `import { assertVerifiedAiOptIn } from "@/lib/supabaseAdmin";\n` + src;
    src = src.replace(
      /export default async function handler\s*\(([^)]*)\)\s*\{/,
      `export default async function handler($1) {\n  const targetPid = String(req.query?.providerId || req.body?.providerId || req.body?.profileId || "").trim();\n  if (req.method === "POST" && req.body?.action !== "toggle_opt_out") {\n    const optCheck = await assertVerifiedAiOptIn(targetPid);\n    if (!optCheck.allowed) return res.status(403).json({ ok: false, locked: true, error: optCheck.reason });\n  }`
    );
    fs.writeFileSync(file, src, "utf8");
    console.log("✓ KI-Opt-In Gate aktiviert in:", file);
  }
}