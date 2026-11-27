import fs from "fs";
import path from "path";

// Falls andere Seiten (z.B. search.tsx oder escort-zurich.tsx) eine alte dunkle Card aus src/components importieren:
const compDir = path.join(process.cwd(), "src", "components");
if (fs.existsSync(compDir)) {
  for (const f of fs.readdirSync(compDir)) {
    if (!f.endsWith(".tsx") || f === "VisualProfileCard.tsx" || f === "PostcardProfileCard.tsx") continue;
    const fp = path.join(compDir, f);
    const txt = fs.readFileSync(fp, "utf8");
    if (txt.includes("ELITE COMPANION") || txt.includes("STARTING AT") || txt.includes("VIEW PROFILE")) {
      const exports = Array.from(txt.matchAll(/export\s+(?:function|const)\s+([A-Za-z0-9_]+)/g)).map((m) => m[1]);
      let out = `import VisualProfileCard from "@/components/VisualProfileCard";\n`;
      for (const ex of exports) {
        if (ex !== "default") out += `export const ${ex} = VisualProfileCard;\n`;
      }
      out += `export default VisualProfileCard;\n`;
      fs.writeFileSync(fp, out, "utf8");
      console.log("✓ Alte dunkle Karten-Komponente ersetzt:", f);
    }
  }
}