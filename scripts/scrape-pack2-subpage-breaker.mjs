import fs from "fs";
import path from "path";
import crypto from "crypto";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const vaultPath = path.join(dataDir, "rosalon-scale-vault.jsonl");
const unlockedPath = path.join(dataDir, "unlocked-subpage-phones.json");
const offersPath = path.join(dataDir, "harvested-offers.json");
const claimsPath = path.join(dataDir, "ready-whatsapp-claims.json");
const statsPath = path.join(dataDir, "index-stats.json");
const auditPath = path.join(dataDir, "harvest-audit-report.json");

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
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const VALID_CH_PREFIXES = new Set([
  "75","76","77","78","79",
  "21","22","24","26","27",
  "31","32","33","34",
  "41","43","44",
  "52","55","56","58",
  "61","62","71","81","91"
]);

function validateSwissPhone(raw) {
  if (!raw) return null;
  const s = String(raw).trim();
  if (s.includes("07x") || s.includes("123456") || s.includes("000000")) return null;
  if (s.startsWith("+") && !s.startsWith("+41")) return null;

  let d = s.replace(/\D/g, "");
  if (d.startsWith("0041")) d = "41" + d.slice(4);
  else if (d.startsWith("0") && d.length === 10) d = "41" + d.slice(1);
  else if (d.length === 9 && VALID_CH_PREFIXES.has(d.slice(0, 2))) d = "41" + d;

  if (!d.startsWith("41") || d.length !== 11) return null;
  const prefix = d.slice(2, 4);
  const sub = d.slice(4);
  if (!VALID_CH_PREFIXES.has(prefix) || /^(\d)\1{5,}$/.test(sub) || sub === "1234567") return null;

  return {
    waDigits: d,
    formatted: `+41 ${prefix} ${sub.slice(0, 3)} ${sub.slice(3, 5)} ${sub.slice(5, 7)}`,
    isMobile: ["75","76","77","78","79"].includes(prefix),
  };
}

async function runPack2(batchSize = 80) {
  const unlockedMap = fs.existsSync(unlockedPath) ? JSON.parse(fs.readFileSync(unlockedPath, "utf8")) : {};
  const offers = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf8")) : [];
  const vaultLines = fs.existsSync(vaultPath) ? fs.readFileSync(vaultPath, "utf8").split(/\r?\n/).filter(Boolean) : [];
  const vault = [];
  for (const l of vaultLines) {
    try { vault.push(JSON.parse(l)); } catch {}
  }

  console.log(`• Roh-Listings im Tresor: ${vault.length}`);
  console.log(`• Bisher geprüfte Unterseiten: ${Object.keys(unlockedMap).length}`);

  const candidates = vault.filter((r) => {
    const u = String(r.sourceUrl || "").trim();
    if (!u.startsWith("http") || u.includes("?page=")) return false;
    if (unlockedMap[u]) return false;
    if (validateSwissPhone(r.rawPhone)) return false;
    return (
      u.includes("xdate.ch/") ||
      u.includes("fgirl.ch/") ||
      u.includes("and6.com/") ||
      u.includes("bemygirl.ch/") ||
      u.includes("bestticino.ch/") ||
      u.includes("incontriticino.com/")
    );
  });

  // Priorisiere ZG, TI, GE, VD, ZH, BS, BE, LU
  const prioOrder = { ZG: 30, TI: 25, GE: 22, VD: 20, ZH: 18, BS: 15, BE: 15, LU: 14, AG: 12, SG: 12 };
  candidates.sort((a, b) => (prioOrder[b.canton] || 5) - (prioOrder[a.canton] || 5));

  const batch = candidates.slice(0, batchSize);
  let newPhoneHits = 0;

  if (apiKey && batch.length > 0) {
    console.log(`\n--- [1/2] Starte Firecrawl Subpage-Entschlüsselung für ${batch.length} Einzelprofile ---`);
    let step = 0;
    for (const item of batch) {
      step++;
      try {
        const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            url: item.sourceUrl,
            formats: ["extract"],
            actions: [{ type: "wait", milliseconds: 850 }, { type: "scroll", direction: "down", amount: 650 }],
            extract: {
              schema: {
                type: "object",
                properties: {
                  realSwissPhone: { type: "string" },
                  rate30Chf: { type: "number" },
                  rate60Chf: { type: "number" },
                  galleryUrls: { type: "array", items: { type: "string" } },
                  services: { type: "array", items: { type: "string" } },
                  fullBio: { type: "string" },
                },
              },
              prompt: "Extract the real Swiss mobile or landline phone (+41 or 079/078/077/076/044/041/022/021/091) as realSwissPhone, 30min CHF rate as rate30Chf, 60min CHF rate as rate60Chf, gallery image URLs, services list, and full bio.",
            },
          }),
        });
        const data = await res.json();
        const ext = data?.data?.extract;
        const chk = validateSwissPhone(ext?.realSwissPhone);

        if (chk) {
          unlockedMap[item.sourceUrl] = {
            rawName: item.rawName,
            city: item.city,
            canton: item.canton,
            sourcePortal: item.sourcePortal,
            sourceUrl: item.sourceUrl,
            realPhone: chk.formatted,
            waDigits: chk.waDigits,
            isMobile: chk.isMobile,
            rate30Chf: Number(ext?.rate30Chf) >= 100 ? Number(ext.rate30Chf) : null,
            rate60Chf: Number(ext?.rate60Chf) >= 150 ? Number(ext.rate60Chf) : item.advertisedBaseChf || 350,
            gallery: Array.isArray(ext?.galleryUrls) ? ext.galleryUrls.filter((u) => String(u).startsWith("http")).slice(0, 6) : [],
            services: Array.isArray(ext?.services) ? ext.services.slice(0, 8) : [],
            bio: ext?.fullBio || item.bio || "",
            unlockedAt: new Date().toISOString(),
          };
          newPhoneHits++;
          console.log(`   [${step}/${batch.length}] 🔓 +41 TREFFER (+${newPhoneHits}): ${item.rawName} (${item.city}, ${item.canton}) -> ${chk.formatted}`);
        } else {
          unlockedMap[item.sourceUrl] = { checkedNoPhone: true, unlockedAt: new Date().toISOString() };
          console.log(`   [${step}/${batch.length}] - Geprüft (${item.rawName}, ${item.canton})`);
        }

        if (step % 10 === 0) {
          fs.writeFileSync(unlockedPath, JSON.stringify(unlockedMap, null, 2), "utf8");
        }
      } catch (e) {
        console.log(`   [${step}/${batch.length}] [Info] Übersprungen (${e.message})`);
      }
      await sleep(280);
    }
    fs.writeFileSync(unlockedPath, JSON.stringify(unlockedMap, null, 2), "utf8");
  }

  console.log("\n--- [2/2] Synchronisiere neu entschlüsselte +41 Profile in harvested-offers.json & ready-whatsapp-claims.json ---");
  const offerMap = new Map();
  for (const o of offers) {
    const key = o.sourceUrl || o.id;
    offerMap.set(key, o);
  }

  for (const [url, val] of Object.entries(unlockedMap)) {
    if (!val || !val.realPhone) continue;
    const chk = validateSwissPhone(val.realPhone);
    if (!chk) continue;

    const base60 = Number(val.rate60Chf) || 350;
    const rate30 = Number(val.rate30Chf) || Math.round((base60 * 0.6) / 10) * 10;

    if (offerMap.has(url)) {
      const ex = offerMap.get(url);
      ex.rawPhone = chk.formatted;
      ex.advertisedBaseChf = base60;
      ex.rate30Chf = rate30;
      if (Array.isArray(val.gallery) && val.gallery.length > 0) {
        ex.gallery = val.gallery;
        if (!ex.thumbnail || ex.thumbnail.includes("placeholder")) ex.thumbnail = val.gallery[0];
      }
      if (val.bio && val.bio.length > 30) ex.bio = val.bio;
    } else if (val.rawName) {
      const shaId = crypto.createHash("sha1").update(`phone:${chk.waDigits}`).digest("hex").slice(0, 12);
      offerMap.set(url, {
        id: `ch-${shaId}`,
        rawName: val.rawName,
        city: val.city || "Zürich",
        canton: val.canton || "ZH",
        sourcePortal: val.sourcePortal || "xdate.ch",
        sourceUrl: url,
        rawPhone: chk.formatted,
        rate30Chf: rate30,
        advertisedBaseChf: base60,
        priceLabel: `CHF ${base60} / 60 Min. (CHF ${rate30} / 30 Min.)`,
        thumbnail: Array.isArray(val.gallery) && val.gallery[0] ? val.gallery[0] : "/placeholder-profile.svg",
        gallery: val.gallery || [],
        includedTags: val.services && val.services.length ? val.services : ["Incall", "Outcall", "GFE"],
        bio: val.bio || "",
        sources: [{ portal: val.sourcePortal || "xdate.ch", url, priceChf: base60, lastSeen: val.unlockedAt }],
        updatedAt: new Date().toISOString(),
      });
    }
  }

  const finalOffers = Array.from(offerMap.values());
  fs.writeFileSync(offersPath, JSON.stringify(finalOffers, null, 2), "utf8");

  // Aktualisiere ready-whatsapp-claims.json mit allen echten +41 Nummern
  const seenDigits = new Set();
  const readyClaims = [];
  for (const o of finalOffers) {
    const chk = validateSwissPhone(o.rawPhone);
    if (!chk || seenDigits.has(chk.waDigits)) continue;
    seenDigits.add(chk.waDigits);
    const cleanName = String(o.rawName || "Profil").replace(/[^\w\säöüÄÖÜéèà-]/g, "").trim() || "Profil";
    const city = String(o.city || "Zürich").split("/")[0].trim();
    const claimUrl = `https://iwantsexnow.ch/create-post?claim=${encodeURIComponent(cleanName)}`;
    readyClaims.push({
      name: cleanName,
      city,
      canton: o.canton || "ZH",
      phoneDisplay: chk.formatted,
      waDigits: chk.waDigits,
      isMobile: chk.isMobile,
      claimUrl,
      portal: o.sourcePortal || "xdate.ch",
      rate30Chf: o.rate30Chf || 200,
      rate60Chf: o.advertisedBaseChf || 350,
      sourceUrl: o.sourceUrl || "",
    });
  }
  fs.writeFileSync(claimsPath, JSON.stringify(readyClaims, null, 2), "utf8");

  if (fs.existsSync(statsPath)) {
    const st = JSON.parse(fs.readFileSync(statsPath, "utf8"));
    st.uniqueFrontendProfiles = finalOffers.length;
    st.unlockedRealPhones = readyClaims.length;
    st.mobileWhatsappReadyPhones = readyClaims.filter((c) => c.isMobile).length;
    st.updatedAt = new Date().toISOString();
    fs.writeFileSync(statsPath, JSON.stringify(st, null, 2), "utf8");
  }

  console.log("\n==============================================================");
  console.log("   ✅ PAKET 2/4 (+41 SUBPAGE BREAKER) ABGESCHLOSSEN");
  console.log("==============================================================");
  console.log(`• Neu entschlüsselte +41 Unterseiten in diesem Lauf: +${newPhoneHits}`);
  console.log(`• Deduplizierte Profile in harvested-offers.json:    ${finalOffers.length}`);
  console.log(`• Eindeutige +41 Kontakte (ready-whatsapp-claims):   ${readyClaims.length} (davon ${readyClaims.filter((c) => c.isMobile).length} Handy 075-079)`);
  console.log("==============================================================\n");
}

runPack2(80);