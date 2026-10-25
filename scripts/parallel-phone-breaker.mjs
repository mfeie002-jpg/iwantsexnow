import fs from "fs";
import path from "path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const SUBPAGE_SCHEMA = {
  type: "object",
  properties: {
    realSwissPhone: {
      type: "string",
      description: "Exact Swiss mobile or landline phone number (+41 or 079/078/077/076/044/041) visible on this page. Empty string if none.",
    },
    whatsappAvailable: { type: "boolean" },
    rate60Chf: { type: "number" },
    galleryUrls: { type: "array", items: { type: "string" } },
  },
};

async function runParallelPhoneBreaker() {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) {
    console.error("FEHLER: Bitte zuerst $env:FIRECRAWL_API_KEY='fc-...' in diesem Fenster setzen!");
    process.exit(1);
  }

  const dataDir = path.join(process.cwd(), "src", "data");
  const vaultPath = path.join(dataDir, "rosalon-scale-vault.jsonl");
  const outPath = path.join(dataDir, "unlocked-subpage-phones.json");

  // 1. Read-Only Snapshot der bisherigen 5.979+ Listings
  const lines = fs.existsSync(vaultPath) ? fs.readFileSync(vaultPath, "utf8").split("\n").filter(Boolean) : [];
  const all = [];
  for (const l of lines) {
    try { all.push(JSON.parse(l)); } catch {}
  }

  // Lade bereits entschlüsselte Nummern, falls vorhanden
  const unlockedMap = fs.existsSync(outPath) ? JSON.parse(fs.readFileSync(outPath, "utf8")) : {};

  // Priorisiere Zürich (ZH), Zug (ZG), Aargau (AG), Luzern (LU), Basel (BS), Bern (BE)
  const priorityCantons = new Set(["ZH", "ZG", "AG", "LU", "BS", "BE", "SG", "GE", "VD"]);

  const candidates = all.filter((r) => {
    const u = String(r.sourceUrl || "").trim();
    if (!u.startsWith("http") || u.includes("?page=")) return false;
    if (unlockedMap[u]) return false;
    const digits = String(r.rawPhone || "").replace(/\D/g, "");
    if (digits.length >= 9) return false;
    // Muss wie eine echte Profil-Unterseite aussehen
    return u.split("/").filter(Boolean).length >= 3;
  });

  // Sortiere so, dass ZH & ZG zuerst geknackt werden
  candidates.sort((a, b) => {
    const aScore = (a.canton === "ZH" || a.canton === "ZG" ? 10 : priorityCantons.has(a.canton) ? 5 : 1);
    const bScore = (b.canton === "ZH" || b.canton === "ZG" ? 10 : priorityCantons.has(b.canton) ? 5 : 1);
    return bScore - aScore;
  });

  const batch = candidates.slice(0, 150);
  console.log(`✓ ${all.length} Listings gelesen -> Starte +41 Subpage-Entschlüsselung für ${batch.length} Top-Einzelprofile...`);

  let step = 0;
  let foundCount = Object.keys(unlockedMap).length;

  for (const item of batch) {
    step++;
    console.log(`[Subpage ${step}/${batch.length}] ${item.rawName} (${item.city}, ${item.canton}) -> ${item.sourceUrl}`);
    try {
      const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          url: item.sourceUrl,
          formats: ["extract"],
          actions: [
            { type: "wait", milliseconds: 900 },
            { type: "scroll", direction: "down", amount: 650 },
          ],
          extract: {
            schema: SUBPAGE_SCHEMA,
            prompt: "Extract the real Swiss phone number (+41 or 079/078/077/076) on this escort profile page as realSwissPhone, 1h CHF rate, and gallery image URLs. Never output '+41/07x'.",
          },
        }),
      });
      const data = await res.json();
      const ext = data?.data?.extract;
      const digits = String(ext?.realSwissPhone || "").replace(/\D/g, "");

      if (digits.length >= 9 && !String(ext.realSwissPhone).includes("07x")) {
        unlockedMap[item.sourceUrl] = {
          rawName: item.rawName,
          city: item.city,
          canton: item.canton,
          sourcePortal: item.sourcePortal,
          sourceUrl: item.sourceUrl,
          realPhone: String(ext.realSwissPhone).trim(),
          rate60Chf: ext.rate60Chf || item.advertisedBaseChf || 400,
          gallery: Array.isArray(ext.galleryUrls) ? ext.galleryUrls.slice(0, 6) : [],
          unlockedAt: new Date().toISOString(),
        };
        foundCount++;
        console.log(`   🔓 TREFFER #${foundCount}: ${item.rawName} (${item.city}) -> ${ext.realSwissPhone}`);
        fs.writeFileSync(outPath, JSON.stringify(unlockedMap, null, 2), "utf8");
      }
    } catch {}
    await sleep(400);
  }

  console.log(`\n=== PARALLEL PHONE-BREAKER FERTIG: ${foundCount} echte +41 Nummern in unlocked-subpage-phones.json gespeichert! ===`);
}

runParallelPhoneBreaker();