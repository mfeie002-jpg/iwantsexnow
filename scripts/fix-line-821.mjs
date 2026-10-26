import fs from "fs";

const p = "src/pages/index.tsx";
let code = fs.readFileSync(p, "utf8");
code = code.replace(
  /activeConcept !== "champagne_list"/g,
  '!String(activeConcept).includes("champagne")'
);
fs.writeFileSync(p, code, "utf8");
console.log("OK: Zeile 821 in src/pages/index.tsx korrigiert!");