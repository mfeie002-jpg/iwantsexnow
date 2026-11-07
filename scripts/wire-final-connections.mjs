import fs from "fs";
import path from "path";

const root = process.cwd();

const fpPath = path.join(root, "src", "pages", "fantasy-preview.tsx");
if (fs.existsSync(fpPath)) {
  let fp = fs.readFileSync(fpPath, "utf8");
  if (!fp.includes("useRouter")) {
    fp = fp.replace(
      'import React, { useState } from "react";',
      'import React, { useState, useEffect } from "react";\nimport { useRouter } from "next/router";'
    );
    fp = fp.replace(
      "export default function FantasyPreviewAndAvatarPage() {",
      "export default function FantasyPreviewAndAvatarPage() {\n  const router = useRouter();"
    );
    fp = fp.replace(
      'const [optOutNotice, setOptOutNotice] = useState<string>("");',
      'const [optOutNotice, setOptOutNotice] = useState<string>("");\n  useEffect(() => {\n    const qId = String(router.query.id || "").trim();\n    if (qId && Array.isArray(HARVESTED_SWISS_OFFERS)) {\n      const found = HARVESTED_SWISS_OFFERS.find((x: any) => (x.id || x.dedupClusterId) === qId);\n      if (found) setSelectedProfile(found);\n    }\n  }, [router.query.id]);'
    );
    fs.writeFileSync(fpPath, fp, "utf8");
    console.log("✓ /pages/fantasy-preview.tsx liest jetzt ?id=... aus der URL!");
  }
}

for (const smName of ["sitemap.xml.ts", "sitemap.xml.tsx"]) {
  const smPath = path.join(root, "src", "pages", smName);
  if (fs.existsSync(smPath)) {
    let sm = fs.readFileSync(smPath, "utf8");
    if (!sm.includes("/fantasy-preview")) {
      sm = sm.replace('"/search"', '"/search", "/fantasy-preview", "/clubs", "/pricing"');
      fs.writeFileSync(smPath, sm, "utf8");
    }
  }
}

const navPath = path.join(root, "src", "components", "MobileBottomNav.tsx");
if (fs.existsSync(navPath)) {
  let nv = fs.readFileSync(navPath, "utf8");
  if (!nv.includes("/fantasy-preview")) {
    nv = nv.replace('href="/live-cam"', 'href="/fantasy-preview"');
    fs.writeFileSync(navPath, nv, "utf8");
  }
}