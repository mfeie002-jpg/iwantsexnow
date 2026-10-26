import fs from "fs";
import path from "path";

const pagesDir = path.join(process.cwd(), "src", "pages");

// 1. Ersetze class='...' durch className='...' in den 5 Info-Seiten
for (const file of ["about.tsx", "contact.tsx", "faq.tsx", "imprint.tsx", "privacy.tsx", "terms.tsx"]) {
  const fullPath = path.join(pagesDir, file);
  if (fs.existsSync(fullPath)) {
    let content = fs.readFileSync(fullPath, "utf8");
    content = content.replace(/class='/g, "className='").replace(/class="/g, 'className="');
    fs.writeFileSync(fullPath, content, "utf8");
    console.log("✓ className korrigiert in:", file);
  }
}

// 2. Korrigiere den ConceptView-Typvergleich in src/pages/index.tsx Zeile 1926
const indexPath = path.join(pagesDir, "index.tsx");
if (fs.existsSync(indexPath)) {
  let idxContent = fs.readFileSync(indexPath, "utf8");
  idxContent = idxContent.replace(
    /light=\{activeConcept === "champagne_list" \|\| activeConcept === "light_directory"\}/g,
    'light={String(activeConcept).includes("champagne") || String(activeConcept).includes("light")}'
  );
  fs.writeFileSync(indexPath, idxContent, "utf8");
  console.log("✓ CorporateFooter light-Prop Typvergleich in src/pages/index.tsx korrigiert!");
}