import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import crypto from "crypto";

const CITY_MAP: Record<string, { city: string; canton: string }> = {
  zug: { city: "Zug", canton: "ZG" },
  baar: { city: "Baar", canton: "ZG" },
  cham: { city: "Cham", canton: "ZG" },
  rotkreuz: { city: "Rotkreuz", canton: "ZG" },
  zürich: { city: "Zürich", canton: "ZH" },
  zurich: { city: "Zürich", canton: "ZH" },
  winterthur: { city: "Winterthur", canton: "ZH" },
  kloten: { city: "Kloten", canton: "ZH" },
  dietikon: { city: "Dietikon", canton: "ZH" },
  luzern: { city: "Luzern", canton: "LU" },
  baden: { city: "Baden", canton: "AG" },
  aarau: { city: "Aarau", canton: "AG" },
  spreitenbach: { city: "Spreitenbach", canton: "AG" },
  basel: { city: "Basel", canton: "BS" },
  bern: { city: "Bern", canton: "BE" },
  "st. gallen": { city: "St. Gallen", canton: "SG" },
  genève: { city: "Genève", canton: "GE" },
  geneva: { city: "Genève", canton: "GE" },
  lausanne: { city: "Lausanne", canton: "VD" },
  lugano: { city: "Lugano", canton: "TI" },
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
  return { city: fallbackCanton === "ZG" ? "Zug" : "Zürich", canton: fallbackCanton };
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
  const blocked = new Set(fs.existsSync(dniPath) ? JSON.parse(fs.readFileSync(dniPath, "utf8")) : []);

  const body = req.body || {};
  const action = String(body.action || "scrape_url").trim();

  if (action === "scrape_url") {
    const targetUrl = String(body.url || "").trim();
    const fallbackCanton = String(body.canton || "ZG").toUpperCase();

    if (!targetUrl.startsWith("http")) {
      return res.status(400).json({ ok: false, error: "Bitte eine gültige http/https URL eingeben." });
    }

    const pid = "ch-" + crypto.createHash("sha1").update(targetUrl).digest("hex").slice(0, 12);
    if (blocked.has(pid)) {
      return res.status(403).json({ ok: false, error: "Diese URL/ID steht auf der Opt-Out-Sperrliste (do-not-import.json)." });
    }

    try {
      const resp = await fetch(targetUrl, {
        headers: {
          "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124.0 Safari/537.36",
          "Accept-Language": "de-CH,de;q=0.9,en;q=0.8",
        },
      });
      const html = await resp.text();

      const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
      const ogTitle = html.match(/property=["']og:title["']\s+content=["']([^"']+)["']/i);
      const ogDesc = html.match(/property=["']og:description["']\s+content=["']([^"']+)["']/i) || html.match(/name=["']description["']\s+content=["']([^"']+)["']/i);
      const ogImg = html.match(/property=["']og:image["']\s+content=["']([^"']+)["']/i);

      const stripHtml = html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");

      const rawTitle = String(ogTitle?.[1] || titleMatch?.[1] || body.customName || "Verifiziertes Schweizer Profil")
        .split(/[|\-–•]/)[0]
        .trim()
        .slice(0, 55);

      const bioText = String(ogDesc?.[1] || stripHtml.slice(0, 500)).trim().slice(0, 600);
      const loc = detectLocation(`${rawTitle} ${bioText} ${targetUrl}`, fallbackCanton);
      const phone = extractSwissPhone(`${html} ${body.customPhone || ""}`) || body.customPhone || null;
      const r60 = extractSafeRate60(`${bioText} ${stripHtml.slice(0, 1500)}`, Number(body.customRate60));
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

      const newOffer = {
        id: pid,
        dedupClusterId: pid,
        rawName: body.customName ? String(body.customName).trim() : rawTitle,
        city: loc.city,
        canton: loc.canton,
        rawPhone: phone,
        advertisedBaseChf: r60,
        rate30Chf: r30,
        priceLabel: `CHF ${r60} / 60 Min. (CHF ${r30} / 30 Min.)`,
        thumbnail: body.customImage || ogImg?.[1] || "/images/escort-portrait-1.jpg",
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

      const existingIdx = offers.findIndex((o: any) => (o.id || o.dedupClusterId) === pid);
      if (existingIdx >= 0) {
        offers[existingIdx] = { ...offers[existingIdx], ...newOffer };
      } else {
        offers.unshift(newOffer);
      }

      states[pid] = {
        ...(states[pid] || {}),
        profileId: pid,
        displayName: newOffer.rawName,
        city: newOffer.city,
        canton: newOffer.canton,
        phoneDisplay: newOffer.rawPhone,
        rate30Chf: newOffer.rate30Chf,
        rate60Chf: newOffer.advertisedBaseChf,
        thumbnail: newOffer.thumbnail,
        updatedAt: new Date().toISOString(),
      };

      fs.writeFileSync(offersPath, JSON.stringify(offers, null, 2), "utf8");
      fs.writeFileSync(
        offersTsPath,
        `import offers from "./harvested-offers.json";\nexport const HARVESTED_SWISS_OFFERS: any[] = offers as any[];\nexport default HARVESTED_SWISS_OFFERS;\n`,
        "utf8"
      );
      fs.writeFileSync(statesPath, JSON.stringify(states, null, 2), "utf8");

      return res.status(200).json({
        ok: true,
        profile: newOffer,
        totalProfiles: offers.length,
      });
    } catch (e: any) {
      return res.status(500).json({
        ok: false,
        error: `URL konnte nicht gelesen werden: ${e?.message || "Netzwerkfehler"}`,
      });
    }
  }

  return res.status(400).json({ ok: false, error: "Unbekannte Aktion" });
}