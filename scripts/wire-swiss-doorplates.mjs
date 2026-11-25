import fs from "fs";
import path from "path";

const root = process.cwd();

// A. LuxuryHeader.tsx: Füge XeniaDoorplateTeaser unter dem Header hinzu & verlinke /fantasy-preview
const headerPath = path.join(root, "src", "components", "LuxuryHeader.tsx");
if (fs.existsSync(headerPath)) {
  let hCode = fs.readFileSync(headerPath, "utf8");
  if (!hCode.includes("SwissDoorplate")) {
    hCode = `import { SwissDoorplate, XeniaDoorplateTeaser } from "@/components/SwissDoorplate";\n` + hCode;
  }
  if (!hCode.includes("/fantasy-preview")) {
    hCode = hCode.replace(
      'href="/live-cam"',
      'href="/fantasy-preview" className="hidden xl:inline-flex items-center mr-2"><SwissDoorplate state="FREI" customLabel="🔮 AVATAR & PREVIEW" size="sm" /></a><a href="/live-cam"'
    );
  }
  fs.writeFileSync(headerPath, hCode, "utf8");
  console.log("✓ LuxuryHeader.tsx mit Türschild-Badge aktualisiert!");
}

// B. ProfileCard.tsx: Ersetze/ergänze den oberen Live-Status durch das mechanische SwissDoorplate
const cardPath = path.join(root, "src", "components", "ProfileCard.tsx");
if (fs.existsSync(cardPath)) {
  let cCode = fs.readFileSync(cardPath, "utf8");
  if (!cCode.includes("SwissDoorplate")) {
    cCode = `import { SwissDoorplate } from "@/components/SwissDoorplate";\n` + cCode;
    cCode = cCode.replace(
      /●\s*4h\s*Live/g,
      "FREI · 4H LIVE"
    );
    fs.writeFileSync(cardPath, cCode, "utf8");
    console.log("✓ ProfileCard.tsx auf Türschild-Signatur (FREI · 4H LIVE) aktualisiert!");
  }
}