import fs from "fs";
import path from "path";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const vaultPath = path.join(dataDir, "rosalon-scale-vault.jsonl");
const unlockedPath = path.join(dataDir, "unlocked-subpage-phones.json");
const offersPath = path.join(dataDir, "harvested-offers.json");
const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
const claimsPath = path.join(dataDir, "ready-whatsapp-claims.json");
const statsPath = path.join(dataDir, "index-stats.json");

for (const envFile of [".env.local", ".env"]) {
  const p = path.join(root, envFile);
  if (fs.existsSync(p)) {
    for (const l of fs.readFileSync(p, "utf8").split(/\r?\n/)) {
      const m = l.match(/^([A-Z0-9_]+)=(.*)$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
    }
  }
}

const apiKey = process.env.FIRECRAWL_API_KEY || "";
const VALID_CH = new Set(["75","76","77","78","79","21","22","24","26","27","31","32","33","34","41","43","44","52","55","56","58","61","62","71","81","91"]);
const FAKES = new Set(["1234567","1234570","2345678","3456789","4567890","4567891","9876543","8765432","7654321","8124590","6421890","4312090","4210000"]);

function checkPhone(raw) {
  if (!raw) return null;
  let d = String(raw).replace(/\D/g, "");
  if (d.startsWith("0041")) d = "41" + d.slice(4);
  else if (d.startsWith("0") && d.length === 10) d = "41" + d.slice(1);
  else if (d.length === 9 && VALID_CH.has(d.slice(0, 2))) d = "41" + d;
  if (!d.startsWith("41") || d.length !== 11) return null;
  const pref = d.slice(2, 4);
  const sub = d.slice(4);
  if (!VALID_CH.has(pref) || FAKES.has(sub) || /^(\d)\1{4,}/.test(sub)) return null;
  if (/12345|23456|34567|45678|56789|98765|87654|89012/.test(sub)) return null;
  return {
    waDigits: d,
    formatted: `+41 ${pref} ${sub.slice(0, 3)} ${sub.slice(3, 5)} ${sub.slice(5, 7)}`,
    isMobile: ["75","76","77","78","79"].includes(pref),
  };
}

async function runRegionalBoost() {
  const offers = JSON.parse(fs.readFileSync(offersPath, "utf8"));
  const unlocked = fs.existsSync(unlockedPath) ? JSON.parse(fs.readFileSync(unlockedPath, "utf8")) : {};

  // Übertrage bereits in unlocked-subpage-phones.json vorhandene echte Nummern auf Romandie/Tessin-Profile ohne Nummer
  let matchedFromCache = 0;
  for (const o of offers) {
    if (!o.rawPhone && o.sourceUrl && unlocked[o.sourceUrl]?.realPhone) {
      const chk = checkPhone(unlocked[o.sourceUrl].realPhone);
      if (chk) {
        o.rawPhone = chk.formatted;
        matchedFromCache++;
      }
    }
  }

  // Wenn Firecrawl-Key aktiv: Prüfe bis zu 25 offene Romandie/Tessin-Profile (xdate/and6/bemygirl)
  const regionalTargets = offers.filter(
    (o) =>
      ["TI", "GE", "VD", "VS", "FR", "NE", "BE", "BS"].includes(o.canton) &&
      !o.rawPhone &&
      o.sourceUrl &&
      String(o.sourceUrl).startsWith("http") &&
      !String(o.sourceUrl).includes("?page=") &&
      !unlocked[o.sourceUrl]
  ).slice(0, 25);

  let liveHits = 0;
  if (apiKey && regionalTargets.length > 0) {
    console.log(`• Prüfe ${regionalTargets.length} offene Regional-Unterseiten (TI/GE/VD/VS/BE/BS)...`);
    for (const item of regionalTargets) {
      try {
        const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            url: item.sourceUrl,
            formats: ["extract"],
            actions: [{ type: "wait", milliseconds: 750 }],
            extract: {
              schema: {
                type: "object",
                properties: {
                  realSwissPhone: { type: "string" },
                  rate60Chf: { type: "number" },
                  galleryUrls: { type: "array", items: { type: "string" } },
                },
              },
              prompt: "Extract realSwissPhone (+41 or 079/078/077/076/091/022/021), rate60Chf and galleryUrls.",
            },
          }),
        });
        const data = await res.json();
        const ext = data?.data?.extract;
        const chk = checkPhone(ext?.realSwissPhone);
        if (chk) {
          item.rawPhone = chk.formatted;
          unlocked[item.sourceUrl] = {
            rawName: item.rawName,
            city: item.city,
            canton: item.canton,
            realPhone: chk.formatted,
            waDigits: chk.waDigits,
            isMobile: chk.isMobile,
            unlockedAt: new Date().toISOString(),
          };
          liveHits++;
          console.log(`   🔓 +41 Regional-Treffer: ${item.rawName} (${item.city}, ${item.canton}) -> ${chk.formatted}`);
        } else {
          unlocked[item.sourceUrl] = { checkedNoPhone: true, unlockedAt: new Date().toISOString() };
        }
      } catch {}
    }
    fs.writeFileSync(unlockedPath, JSON.stringify(unlocked, null, 2), "utf8");
  }

  fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
  fs.writeFileSync(offersTsPath, `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\nexport default HARVESTED_SWISS_OFFERS;\n`, "utf8");

  // Claims-Liste aktualisieren
  const seen = new Set();
  const claims = [];
  for (const o of offers) {
    const chk = checkPhone(o.rawPhone);
    if (!chk || seen.has(chk.waDigits)) continue;
    seen.add(chk.waDigits);
    const cleanName = String(o.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim() || "Profil";
    claims.push({
      id: o.id,
      name: cleanName,
      city: o.city,
      canton: o.canton,
      phoneDisplay: chk.formatted,
      waDigits: chk.waDigits,
      isMobile: chk.isMobile,
      rate30Chf: o.rate30Chf || 200,
      rate60Chf: o.advertisedBaseChf || 350,
      portal: o.sourcePortal || "xdate.ch",
      sourceUrl: o.sourceUrl || "",
      claimUrl: `https://iwantsexnow.ch/create-post?claim=${encodeURIComponent(cleanName)}`,
    });
  }
  fs.writeFileSync(claimsPath, JSON.stringify(claims, null, 2), "utf8");

  if (fs.existsSync(statsPath)) {
    const st = JSON.parse(fs.readFileSync(statsPath, "utf8"));
    st.unlockedRealPhones = claims.length;
    st.mobileWhatsappReadyPhones = claims.filter((c) => c.isMobile).length;
    st.updatedAt = new Date().toISOString();
    fs.writeFileSync(statsPath, JSON.stringify(st, null, 2), "utf8");
  }

  console.log(`✓ Regional-Sync fertig (+${matchedFromCache} aus Cache, +${liveHits} live) -> Gesamt: ${claims.length} echte +41 Nummern (${claims.filter(c=>c.isMobile).length} Handy)!`);
}

runRegionalBoost();