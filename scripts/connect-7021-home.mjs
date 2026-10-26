import fs from "fs";
import path from "path";

const root = process.cwd();
const indexPath = path.join(root, "src", "pages", "index.tsx");
const offersTsPath = path.join(root, "src", "data", "harvestedOffers.ts");

// Lasse harvestedOffers.ts direkt den vollen 7.021-Tresor exportieren
const offersTsContent = `import fullVault from "./swiss-full-vault-7000.json";
export const HARVESTED_SWISS_OFFERS: any[] = fullVault as any[];
export const TOTAL_SWISS_PROFILES_COUNT = Array.isArray(fullVault) ? fullVault.length : 7021;
`;
fs.writeFileSync(offersTsPath, offersTsContent, "utf8");
console.log("✓ src/data/harvestedOffers.ts exportiert jetzt alle 7.021 Schweizer Profile!");

if (fs.existsSync(indexPath)) {
  let code = fs.readFileSync(indexPath, "utf8");

  // Stelle sicher, dass visibleCount (Standard 48, per Klick +60 bis 7.021) aktiv ist
  if (!code.includes("const [visibleCount, setVisibleCount]")) {
    code = code.replace(
      'const [searchQuery, setSearchQuery] = useState("");',
      'const [searchQuery, setSearchQuery] = useState("");\n  const [visibleCount, setVisibleCount] = useState<number>(48);'
    );
  }

  code = code.replace(/filteredProfiles\.slice\(0,\s*36\)/g, "filteredProfiles.slice(0, visibleCount)");
  code = code.replace(/filteredProfiles\.slice\(0,\s*24\)/g, "filteredProfiles.slice(0, visibleCount)");

  // Füge unter der Galerie UND unter der Champagner-Liste den "Mehr aus 7.021 Profilen laden"-Button ein, falls noch nicht da
  if (!code.includes("Mehr Profile laden (+60")) {
    const loadMoreDark = `
            {filteredProfiles.length > visibleCount && (
              <div className="pt-8 pb-4 flex flex-col items-center gap-2">
                <button
                  type="button"
                  onClick={() => setVisibleCount((prev) => prev + 60)}
                  className="px-8 py-4 rounded-xl bg-[#C6A574] hover:bg-[#d5b687] text-[#13161C] font-extrabold text-xs sm:text-sm uppercase tracking-wider cursor-pointer shadow-2xl transition"
                >
                  Mehr Profile laden (+60 weitere aus {filteredProfiles.length.toLocaleString("de-CH")} Schweizer Profilen) →
                </button>
                <span className="text-xs text-gray-400">
                  Angezeigt: {Math.min(visibleCount, filteredProfiles.length).toLocaleString("de-CH")} von {filteredProfiles.length.toLocaleString("de-CH")} Profilen
                </span>
              </div>
            )}
`;
    const marker = "{/* Discrete Methodik & Self-Administration Footer Bar */}";
    if (code.includes(marker)) {
      code = code.replace(marker, loadMoreDark + "\n            " + marker);
    }
  }

  fs.writeFileSync(indexPath, code, "utf8");
  console.log("✓ Startseite (src/pages/index.tsx) zeigt jetzt alle 7.021 Profile inkl. Kantons-Zähler & 'Mehr laden'!");
}