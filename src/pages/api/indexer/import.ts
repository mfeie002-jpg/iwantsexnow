import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CITY_MAP: Record<string, { city: string; canton: string }> = {
  zug: { city: "Zug", canton: "ZG" },
  baar: { city: "Baar", canton: "ZG" },
  cham: { city: "Cham", canton: "ZG" },
  rotkreuz: { city: "Rotkreuz", canton: "ZG" },
  steinhausen: { city: "Steinhausen", canton: "ZG" },
  zürich: { city: "Zürich", canton: "ZH" },
  zurich: { city: "Zürich", canton: "ZH" },
  winterthur: { city: "Winterthur", canton: "ZH" },
  kloten: { city: "Kloten", canton: "ZH" },
  dietikon: { city: "Dietikon", canton: "ZH" },
  uster: { city: "Uster", canton: "ZH" },
  luzern: { city: "Luzern", canton: "LU" },
  kriens: { city: "Kriens", canton: "LU" },
  sursee: { city: "Sursee", canton: "LU" },
  baden: { city: "Baden", canton: "AG" },
  wettingen: { city: "Wettingen", canton: "AG" },
  aarau: { city: "Aarau", canton: "AG" },
  spreitenbach: { city: "Spreitenbach", canton: "AG" },
  basel: { city: "Basel", canton: "BS" },
  bern: { city: "Bern", canton: "BE" },
  biel: { city: "Biel/Bienne", canton: "BE" },
  thun: { city: "Thun", canton: "BE" },
  olten: { city: "Olten", canton: "SO" },
  "st. gallen": { city: "St. Gallen", canton: "SG" },
  rapperswil: { city: "Rapperswil-Jona", canton: "SG" },
  genève: { city: "Genève", canton: "GE" },
  geneva: { city: "Genève", canton: "GE" },
  lausanne: { city: "Lausanne", canton: "VD" },
  lugano: { city: "Lugano", canton: "TI" },
  locarno: { city: "Locarno", canton: "TI" },
};

function detectLocation(text: string, fallbackCanton = "ZH") {
  const lower = String(text || "").toLowerCase();
  for (const [k, v] of Object.entries(CITY_MAP)) {
    if (lower.includes(k)) return v;
  }
  const plzMatch = lower.match(/\b([1-9]\d{3})\b/);
  if (plzMatch) {
    const plz = Number(plzMatch[1]);
    if (plz >= 6300 && plz <= 6349) return { city: "Zug", canton: "ZG" };
    if (plz >= 8000 && plz <= 8955) return { city: "Zürich", canton: "ZH" };
    if (plz >= 6000 && plz <= 6299) return { city: "Luzern", canton: "LU" };
    if (plz >= 5000 && plz <= 5799) return { city: "Baden", canton: "AG" };
    if (plz >= 4000 && plz <= 4099) return { city: "Basel", canton: "BS" };
    if (plz >= 3000 && plz <= 3099) return { city: "Bern", canton: "BE" };
    if (plz >= 1200 && plz <= 1299) return { city: "Genève", canton: "GE" };
    if (plz >= 1000 && plz <= 1099) return { city: "Lausanne", canton: "VD" };
    if (plz >= 6900 && plz <= 6999) return { city: "Lugano", canton: "TI" };
  }
  const defaultCityMap: Record<string, string> = {
    ZG: "Zug", ZH: "Zürich", LU: "Luzern", AG: "Baden", BS: "Basel", BE: "Bern", SG: "St. Gallen", GE: "Genève", VD: "Lausanne", TI: "Lugano"
  };
  return { city: defaultCityMap[fallbackCanton] || "Zürich", canton: fallbackCanton };
}

function extractSwissPhone(text: string): string | null {
  const matches = String(text || "").match(/(?:\+41|0041|0)\s*(?:7[5-9]|4[134]|31|61|2[12]|91|52|71)[\s.\-/]*\d{3}[\s.\-/]*\d{2}[\s.\-/]*\d{2}/g);
  if (!matches) return null;
  for (const m of matches) {
    const d = m.replace(/\D/g, "");
    let local = "";
    if (d.startsWith("41") && d.length === 11) local = "0" + d.slice(2);
    else if (d.startsWith("0041") && d.length === 13) local = "0" + d.slice(4);
    else if (d.startsWith("0") && d.length === 10) local = d;
    if (local && !/(\d)\1{5,}|123456/.test(local)) {
      return `+41 ${local.slice(1, 3)} ${local.slice(3, 6)} ${local.slice(6, 8)} ${local.slice(8, 10)}`;
    }
  }
  return null;
}

function extractSafeRate60(text: string, manualRate?: number): number {
  if (manualRate && manualRate >= 100 && manualRate <= 1200) return Math.round(manualRate / 10) * 10;
  const rx = /(?:chf|fr\.?|sfr\.?)\s*(\d{2,4})|(\d{2,4})\s*(?:chf|fr\.?|sfr\.?)/gi;
  let m;
  while ((m = rx.exec(String(text || ""))) !== null) {
    const n = Number(m[1] || m[2]);
    if (n >= 100 && n <= 1200 && !(n >= 1000 && n % 100 === 0)) {
      return Math.round(n / 10) * 10;
    }
  }
  return 350;
}

async function scrapeSingleProfileUrl(targetUrl: string, fallbackCanton: string, blocked: Set<string>, customOpts: any = {}) {
  const pid = "ch-" + crypto.createHash("sha1").update(targetUrl).digest("hex").slice(0, 12);
  if (blocked.has(pid)) return null;

  const resp = await fetch(targetUrl, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
      "Accept-Language": "de-CH,de;q=0.9,en;q=0.8",
    },
  });
  if (!resp.ok) return null;
  const html = await resp.text();

  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const ogTitle = html.match(/property=["']og:title["']\s+content=["']([^"']+)["']/i);
  const ogDesc = html.match(/property=["']og:description["']\s+content=["']([^"']+)["']/i) || html.match(/name=["']description["']\s+content=["']([^"']+)["']/i);
  const ogImg = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);

  const stripHtml = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

  const rawTitle = String(ogTitle?.[1] || titleMatch?.[1] || customOpts.customName || "Verifiziertes Schweizer Profil")
    .split(/[|\-–•]/)[0]
    .trim()
    .slice(0, 55);

  const bioText = String(ogDesc?.[1] || stripHtml.slice(0, 500)).trim().slice(0, 600);
  const loc = detectLocation(`${rawTitle} ${bioText} ${targetUrl}`, fallbackCanton);
  const phone = extractSwissPhone(`${html} ${customOpts.customPhone || ""}`) || customOpts.customPhone || null;
  const r60 = extractSafeRate60(`${bioText} ${stripHtml.slice(0, 1500)}`, Number(customOpts.customRate60));
  const r30 = Math.round((r60 * 0.6) / 10) * 10;

  const txtLower = `${rawTitle} ${bioText}`.toLowerCase();
  const rubric = /\b(trans|ts|shemale)\b/.test(txtLower)
    ? "trans"
    : /\b(domina|bdsm|fetisch)\b/.test(txtLower)
    ? "bdsm"
    : /\b(tantra|massage)\b/.test(txtLower)
    ? "massage"
    : "female";

  const ageMatch = `${rawTitle} ${bioText}`.match(/\b(19|2\d|3\d|4[0-5])\s*(?:jahre|j\.|ans|anni|yo)\b/i);
  const heightMatch = `${rawTitle} ${bioText}`.match(/\b(1[5-8]\d)\s*cm\b/i);
  const cupMatch = `${rawTitle} ${bioText}`.match(/\b(?:cup|körbchen|bh)\s*([a-d]{1,2})\b/i);

  return {
    id: pid,
    dedupClusterId: pid,
    rawName: customOpts.customName ? String(customOpts.customName).trim() : rawTitle,
    city: loc.city,
    canton: loc.canton,
    rawPhone: phone,
    advertisedBaseChf: r60,
    rate30Chf: r30,
    priceLabel: `CHF ${r60} / 60 Min. (CHF ${r30} / 30 Min.)`,
    thumbnail: customOpts.customImage || ogImg?.[1] || "/images/escort-portrait-1.jpg",
    bio: bioText,
    sourceUrl: targetUrl,
    rubric,
    age: ageMatch ? Number(ageMatch[1]) : 25,
    heightCm: heightMatch ? Number(heightMatch[1]) : 168,
    cupSize: cupMatch ? cupMatch[1].toUpperCase() : "C",
    hairColor: "Brünett",
    languages: ["Deutsch", "Englisch"],
    includedTags: ["Direktkontakt", "Diskreter Empfang", rubric === "massage" ? "Erotische Massage" : "Girlfriend Experience"],
    curationScore: 92,
    scrapedAt: new Date().toISOString(),
  };
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const adminPin = process.env.ADMIN_PIN || "";
  const providedPin = String(req.headers["x-admin-pin"] || req.body?.adminPin || "").trim();

  if (!adminPin || adminPin.length < 10 || providedPin !== adminPin) {
    return res.status(403).json({
      ok: false,
      error: "Zugriff verweigert: Gültiger Server-Admin-PIN erforderlich.",
    });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const dataDir = path.join(process.cwd(), "src", "data");
  const offersPath = path.join(dataDir, "harvested-offers.json");
  const offersTsPath = path.join(dataDir, "harvestedOffers.ts");
  const statesPath = path.join(dataDir, "managed-profile-states.json");
  const dniPath = path.join(dataDir, "do-not-import.json");

  const offers = fs.existsSync(offersPath) ? JSON.parse(fs.readFileSync(offersPath, "utf8")) : [];
  const states = fs.existsSync(statesPath) ? JSON.parse(fs.readFileSync(statesPath, "utf8")) : {};
  const blocked = new Set<string>(fs.existsSync(dniPath) ? JSON.parse(fs.readFileSync(dniPath, "utf8")) : []);

  const body = req.body || {};
  const action = String(body.action || "scrape_url").trim();
  const fallbackCanton = String(body.canton || "ZG").toUpperCase();

  const saveOfferList = (newItems: any[]) => {
    for (const newOffer of newItems) {
      const existingIdx = offers.findIndex((o: any) => (o.id || o.dedupClusterId) === newOffer.id);
      if (existingIdx >= 0) {
        offers[existingIdx] = { ...offers[existingIdx], ...newOffer };
      } else {
        offers.unshift(newOffer);
      }
      states[newOffer.id] = {
        ...(states[newOffer.id] || {}),
        profileId: newOffer.id,
        displayName: newOffer.rawName,
        city: newOffer.city,
        canton: newOffer.canton,
        phoneDisplay: newOffer.rawPhone,
        rate30Chf: newOffer.rate30Chf,
        rate60Chf: newOffer.advertisedBaseChf,
        thumbnail: newOffer.thumbnail,
        updatedAt: new Date().toISOString(),
      };
    }
    fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
    fs.writeFileSync(
      offersTsPath,
      `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\nexport default HARVESTED_SWISS_OFFERS;\n`,
      "utf8"
    );
    fs.writeFileSync(statesPath, JSON.stringify(states, null, 2), "utf8");
  };

  if (action === "scrape_url") {
    const targetUrl = String(body.url || "").trim();
    if (!targetUrl.startsWith("http")) {
      return res.status(400).json({ ok: false, error: "Bitte eine gültige http/https URL eingeben." });
    }
    try {
      const prof = await scrapeSingleProfileUrl(targetUrl, fallbackCanton, blocked, body);
      if (!prof) {
        return res.status(400).json({ ok: false, error: "Profil ist auf der Sperrliste oder URL nicht erreichbar." });
      }
      saveOfferList([prof]);
      return res.status(200).json({ ok: true, profile: prof, totalProfiles: offers.length });
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: e?.message || "Netzwerkfehler" });
    }
  }

  // NEU: Ganze Übersichtsseite oder Liste von URLs im Batch crawlen
  if (action === "crawl_directory") {
    const rawInput = String(body.url || body.urlsText || "").trim();
    const maxLimit = Math.min(20, Math.max(1, Number(body.limit) || 12));

    try {
      let candidateUrls: string[] = [];

      // Falls mehrere Zeilen eingegeben wurden -> als URL-Batch behandeln
      const lines = rawInput.split(/[\r\n,\s]+/).map((s) => s.trim()).filter((s) => s.startsWith("http"));
      if (lines.length > 1) {
        candidateUrls = Array.from(new Set(lines)).slice(0, maxLimit);
      } else if (lines.length === 1) {
        const seedUrl = lines[0];
        const parsedSeed = new URL(seedUrl);
        const resp = await fetch(seedUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
          },
        });
        const html = await resp.text();
        const hrefRx = /href=["']([^"'#]+)["']/gi;
        const found = new Set<string>();
        let m;
        while ((m = hrefRx.exec(html)) !== null) {
          try {
            const abs = new URL(m[1], parsedSeed.origin).toString();
            if (!abs.startsWith(parsedSeed.origin)) continue;
            if (abs === seedUrl) continue;
            // Typische Nicht-Profil-Links ignorieren
            if (/\.(css|js|png|jpg|jpeg|svg|webp|pdf|xml|ico)(\?|$)/i.test(abs)) continue;
            if (/\/(login|register|imprint|impressum|privacy|datenschutz|terms|agb|contact|kontakt|faq|search|tag|category)(\/|$)/i.test(abs)) continue;

            // Bevorzuge Links mit Profil-/Girl-/Escort-/Detail-Mustern oder tieferen Pfaden
            const pathSegs = new URL(abs).pathname.split("/").filter(Boolean);
            if (pathSegs.length >= 1) {
              found.add(abs);
            }
          } catch {}
        }
        candidateUrls = Array.from(found).slice(0, maxLimit);
      }

      if (candidateUrls.length === 0) {
        return res.status(400).json({ ok: false, error: "Keine crawlbaren Profil-Unterseiten auf dieser URL gefunden." });
      }

      const harvested: any[] = [];
      for (const u of candidateUrls) {
        try {
          const item = await scrapeSingleProfileUrl(u, fallbackCanton, blocked, body);
          if (item && item.rawName && item.rawName.length >= 2) {
            harvested.push(item);
          }
        } catch {}
      }

      if (harvested.length > 0) {
        saveOfferList(harvested);
      }

      return res.status(200).json({
        ok: true,
        batchCount: harvested.length,
        scannedUrls: candidateUrls.length,
        harvestedProfiles: harvested,
        totalProfiles: offers.length,
      });
    } catch (e: any) {
      return res.status(500).json({ ok: false, error: `Batch-Crawl Fehler: ${e?.message || "Unbekannt"}` });
    }
  }

  return res.status(400).json({ ok: false, error: "Unbekannte Aktion" });
}