import fs from "fs";
import path from "path";

const indexPath = path.join(process.cwd(), "src", "pages", "index.tsx");
let code = fs.readFileSync(indexPath, "utf8");

// 1. Entferne das falsch platzierte <CorporateFooter /> direkt nach </main> im ternären Zweig
code = code.replace(/<\/main>\s*<CorporateFooter\s*\/>/g, "</main>");

// 2. Füge <CorporateFooter light={activeConcept === "champagne_list" || activeConcept === "light_directory"} />
//    sauber vor dem allerletzten schliessenden </div> der Komponente ein!
const lastDivIdx = code.lastIndexOf("</div>");
if (lastDivIdx !== -1 && !code.includes("<CorporateFooter")) {
  code =
    code.slice(0, lastDivIdx) +
    '      <CorporateFooter light={activeConcept === "champagne_list" || activeConcept === "light_directory"} />\n    ' +
    code.slice(lastDivIdx);
}

fs.writeFileSync(indexPath, code, "utf8");
console.log("✓ <CorporateFooter /> sitzt jetzt sauber im Haupt-Container von src/pages/index.tsx!");