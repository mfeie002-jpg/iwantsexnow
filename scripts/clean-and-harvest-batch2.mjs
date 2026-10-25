import fs from "fs";
import path from "path";

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const dataDir = path.join(process.cwd(), "src", "data");

const vaultPath = path.join(dataDir, "rosalon-scale-vault.jsonl");
const unlockedPath = path.join(dataDir, "unlocked-subpage-phones.json");
const claimsPath = path.join(dataDir, "ready-whatsapp-claims.json");
const offersPath = path.join(dataDir, "harvested-offers.json");
const statsPath = path.join(dataDir, "index-stats.json");

// Strikter Schweizer Vorwahl-Prüfer (Nur echte CH Mobile 75/76/77/78/79 & echte CH Festnetzvorwahlen)
const VALID_CH_PREFIXES = new Set([
  "75", "76", "77", "78", "79", // Swiss Mobile
  "21", "22", "24", "26", "27", // Romandie / VS
  "31", "32", "33", "34",       // Bern / Mittelland
  "41", "43", "44",             // Zentralschweiz (Zug/Luzern) & Zürich
  "52", "55", "56", "58",       // Winterthur / Rapperswil / Baden
  "61", "62", "71", "81", "91"  // Basel / Olten / St. Gallen / Chur / Tessin
]);

function normalizeAndValidateSwissPhone(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (s.includes("07x") || s.includes("123456") || s.includes("234567") || s.includes("000000") || s.includes("999999")) {
    return null;
  }
  if (s.startsWith("+") && !s.startsWith("+41")) return null;

  let d = s.replace(/\D/g, "");
  if (d.startsWith("0041")) d = "41" + d.slice(4);
  else if (d.startsWith("0") && d.length === 10) d = "41" + d.slice(1);
  else if (d.length === 9 && VALID_CH_PREFIXES.has(d.slice(0, 2))) d = "41" + d;

  // Echte Schweizer E.164 Nummer muss exakt 11 Ziffern haben: 41 + 2-stellige Vorwahl + 7 Ziffern
  if (!d.startsWith("41") || d.length !== 11) return null;

  const prefix = d.slice(2, 4);
  const subscriber = d.slice(4);
  if (!VALID_CH_PREFIXES.has(prefix)) return null;
  if (/^(\d)\1{5,}$/.test(subscriber) || subscriber === "1234567" || subscriber === "7654321") return null;

  const formatted = `+41 ${prefix} ${subscriber.slice(0, 3)} ${subscriber.slice(3, 5)} ${subscriber.slice(5, 7)}`;
  const isMobile = ["75", "76", "77", "78", "79"].includes(prefix);
  return { waDigits: d, formatted, isMobile, prefix };
}

async function runCleanAndNextBatch(batchSize = 120) {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  const unlockedMap = fs.existsSync(unlockedPath) ? JSON.parse(fs.readFileSync(unlockedPath, "utf8")) : {};

  // 1. Bereinige zuerst alle bisherigen Einträge in unlocked-subpage-phones.json
  let removedFakes = 0;
  for (const [url, entry] of Object.entries(unlockedMap)) {
    if (entry && entry.realPhone) {
      const check = normalizeAndValidateSwissPhone(entry.realPhone);
      if (!check) {
        unlockedMap[url] = { checkedNoPhone: true, invalidRemoved: entry.realPhone };
        removedFakes++;
      } else {
        unlockedMap[url].realPhone = check.formatted;
        unlockedMap[url].waDigits = check.waDigits;
        unlockedMap[url].isMobile = check.isMobile;
      }
    }
  }
  console.log(`✓ Qualitäts-Filter: ${removedFakes} ungültige/ausländische/Fake-Nummern (+852, 1234567, +41 20 etc.) aussortiert!`);

  // 2. Lade alle 7.021 Listings aus dem Tresor
  const lines = fs.existsSync(vaultPath) ? fs.readFileSync(vaultPath, "utf8").split("\n").filter(Boolean) : [];
  const all = [];
  for (const l of lines) {
    try { all.push(JSON.parse(l)); } catch {}
  }

  // 3. Knacke die nächsten 120 ungeprüften Schweizer Einzelprofile mit Firecrawl
  if (apiKey) {
    const candidates = all.filter((r) => {
      const u = String(r.sourceUrl || "").trim();
      if (!u.startsWith("http") || u.includes("?page=")) return false;
      if (unlockedMap[u]) return false;
      if (normalizeAndValidateSwissPhone(r.rawPhone)) return false;
      return u.includes("xdate.ch/de/") || u.includes("fgirl.ch/") || u.includes("and6.com/");
    });

    const batch = candidates.slice(0, batchSize);
    console.log(`-> Starte Firecrawl Subpage-Entschlüsselung für die nächsten ${batch.length} Profile (von ${candidates.length} verbleibenden)...`);

    let step = 0;
    let validNewHits = 0;

    for (const item of batch) {
      step++;
      try {
        const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            url: item.sourceUrl,
            formats: ["extract"],
            actions: [
              { type: "wait", milliseconds: 800 },
              { type: "scroll", direction: "down", amount: 600 },
            ],
            extract: {
              schema: {
                type: "object",
                properties: {
                  realSwissPhone: { type: "string" },
                  rate60Chf: { type: "number" },
                  galleryUrls: { type: "array", items: { type: "string" } },
                },
              },
              prompt: "Extract the real Swiss phone number (+41 or 079/078/077/076/044/041) on this page as realSwissPhone, 1h CHF rate as rate60Chf, and gallery image URLs.",
            },
          }),
        });
        const data = await res.json();
        const ext = data?.data?.extract;
        const checked = normalizeAndValidateSwissPhone(ext?.realSwissPhone);

        if (checked) {
          unlockedMap[item.sourceUrl] = {
            rawName: item.rawName,
            city: item.city,
            canton: item.canton,
            sourcePortal: item.sourcePortal,
            sourceUrl: item.sourceUrl,
            realPhone: checked.formatted,
            waDigits: checked.waDigits,
            isMobile: checked.isMobile,
            rate60Chf: ext.rate60Chf || item.advertisedBaseChf || 400,
            gallery: Array.isArray(ext.galleryUrls) ? ext.galleryUrls.slice(0, 6) : [],
            unlockedAt: new Date().toISOString(),
          };
          validNewHits++;
          console.log(`   [${step}/${batch.length}] 🔓 ECHTE CH-NR #${validNewHits}: ${item.rawName} (${item.city}) -> ${checked.formatted}`);
          if (validNewHits % 5 === 0) {
            fs.writeFileSync(unlockedPath, JSON.stringify(unlockedMap, null, 2), "utf8");
          }
        } else {
          unlockedMap[item.sourceUrl] = { checkedNoPhone: true, unlockedAt: new Date().toISOString() };
          console.log(`   [${step}/${batch.length}] - Kein gültiges +41 Format (${item.rawName})`);
        }
      } catch {}
      await sleep(300);
    }
    fs.writeFileSync(unlockedPath, JSON.stringify(unlockedMap, null, 2), "utf8");
  }

  // 4. Synchronisiere alle gültigen +41 Nummern zurück in den 7.021 Vault & die Frontend-Angebote
  for (const r of all) {
    const u = String(r.sourceUrl || "").trim();
    if (unlockedMap[u] && unlockedMap[u].realPhone) {
      r.rawPhone = unlockedMap[u].realPhone;
    }
    const valid = normalizeAndValidateSwissPhone(r.rawPhone);
    r.rawPhone = valid ? valid.formatted : "";
  }
  fs.writeFileSync(vaultPath, all.map((r) => JSON.stringify(r)).join("\n") + "\n", "utf8");

  // 5. Baue die 100% saubere ready-whatsapp-claims.json (Mobile-Nummern 079/078/077/076/075 zuerst!)
  const seenDigits = new Set();
  const cleanClaims = [];

  for (const r of all) {
    const valid = normalizeAndValidateSwissPhone(r.rawPhone);
    if (!valid) continue;
    if (seenDigits.has(valid.waDigits)) continue;
    seenDigits.add(valid.waDigits);

    const cleanName = String(r.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim() || "Profil";
    const city = String(r.city || "Zürich").split("/")[0].trim();
    const claimUrl = `https://iwantsexnow.ch/create-post?claim=${encodeURIComponent(cleanName)}`;
    const msg = `Hallo ${cleanName} 👋 Dein Eintrag in ${city} ist im neuen Schweizer Vergleichs- & Suchverzeichnis iwantsexnow.ch gelistet. Du kannst dein Profil hier kostenlos selbst verwalten, korrigieren oder den 30-Tage-Gründungszugang aktivieren: ${claimUrl} (oder jederzeit ohne Anmeldung ausblenden unter iwantsexnow.ch/report)`;

    cleanClaims.push({
      name: cleanName,
      rawTitle: r.rawName,
      city,
      canton: r.canton || "ZH",
      phoneDisplay: valid.formatted,
      waDigits: valid.waDigits,
      isMobile: valid.isMobile,
      waClickUrl: `https://wa.me/${valid.waDigits}?text=${encodeURIComponent(msg)}`,
      claimUrl,
      portal: r.sourcePortal || "xdate.ch",
      rateChf: r.advertisedBaseChf || 400,
      sourceUrl: r.sourceUrl,
    });
  }

  // Sortiere: 1. Echte Mobilnummern (079/078/077/076/075), 2. Kanton ZG & ZH zuerst!
  cleanClaims.sort((a, b) => {
    const aMob = a.isMobile ? 20 : 0;
    const bMob = b.isMobile ? 20 : 0;
    const aLoc = a.canton === "ZG" ? 10 : a.canton === "ZH" ? 7 : 0;
    const bLoc = b.canton === "ZG" ? 10 : b.canton === "ZH" ? 7 : 0;
    return (bMob + bLoc) - (aMob + aLoc);
  });

  fs.writeFileSync(claimsPath, JSON.stringify(cleanClaims, null, 2), "utf8");

  const mobileOnlyCount = cleanClaims.filter((c) => c.isMobile).length;
  console.log("\n==================================================================");
  console.log(`✓ BEREINIGTE ECHTE +41 NUMMERN GESAMT: ${cleanClaims.length}`);
  console.log(`✓ DAVON ECHTE SCHWEIZER HANDYNUMMERN (075-079 für WhatsApp): ${mobileOnlyCount}`);
  console.log("==================================================================\n");
}

runCleanAndNextBatch(100);