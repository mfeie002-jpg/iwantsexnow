import fs from "fs";
import path from "path";

const filesToPatch = [
  path.join(process.cwd(), "src", "pages", "index.tsx"),
  path.join(process.cwd(), "src", "pages", "profile", "[id].tsx"),
  path.join(process.cwd(), "src", "pages", "search.tsx"),
];

for (const fp of filesToPatch) {
  if (!fs.existsSync(fp)) continue;
  let code = fs.readFileSync(fp, "utf8");
  if (!code.includes('referrerPolicy="no-referrer"')) {
    code = code.replace(/<img\s+/g, '<img referrerPolicy="no-referrer" ');
    fs.writeFileSync(fp, code, "utf8");
    console.log(`✓ referrerPolicy="no-referrer" (Anti-Hotlink-Sperre) aktiviert in: ${path.basename(fp)}`);
  }
}

// Zusätzlich in index.tsx: Sortierung bevorzugt immer Profile mit echtem Portal-Foto (hasRealPortalPhoto)
const idxPath = path.join(process.cwd(), "src", "pages", "index.tsx");
if (fs.existsSync(idxPath)) {
  let idxCode = fs.readFileSync(idxPath, "utf8");
  idxCode = idxCode.replace(
    "const scoreA = (a.isFeatured ? 800 : 0)",
    "const scoreA = (a.hasRealPortalPhoto ? 2000 : 0) + (a.isFeatured ? 800 : 0)"
  );
  idxCode = idxCode.replace(
    "const scoreB = (b.isFeatured ? 800 : 0)",
    "const scoreB = (b.hasRealPortalPhoto ? 2000 : 0) + (b.isFeatured ? 800 : 0)"
  );
  fs.writeFileSync(idxPath, idxCode, "utf8");
}