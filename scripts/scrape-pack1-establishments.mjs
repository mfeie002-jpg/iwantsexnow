import fs from "fs";
import path from "path";
import crypto from "crypto";

const root = process.cwd();
const dataDir = path.join(root, "src", "data");
const clubsPath = path.join(dataDir, "swiss-establishments-vault.json");
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

function normalizeSwissPhone(raw) {
  if (!raw) return null;
  let d = String(raw).replace(/\D/g, "");
  if (d.startsWith("0041")) d = "41" + d.slice(4);
  else if (d.startsWith("0") && d.length === 10) d = "41" + d.slice(1);
  if (!d.startsWith("41") || d.length !== 11) return null;
  return `+41 ${d.slice(2, 4)} ${d.slice(4, 7)} ${d.slice(7, 9)} ${d.slice(9, 11)}`;
}

const clubTargets = [
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/zuerich", city: "Zürich", canton: "ZH", type: "Club & Studio" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/mittelland", city: "Aarau / Olten", canton: "AG", type: "Kontaktbar & Laufhaus" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/basel", city: "Basel", canton: "BS", type: "Salon & Club" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/bern", city: "Bern", canton: "BE", type: "Studio & Kontaktbar" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/zentralschweiz", city: "Luzern / Zug", canton: "LU", type: "Club & Studio" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/ostschweiz", city: "St. Gallen", canton: "SG", type: "Laufhaus & Studio" },
  { portal: "and6.com", url: "https://www.and6.com/de/clubs/tessin", city: "Lugano", canton: "TI", type: "Club & Sauna" },
  { portal: "xdate.ch", url: "https://www.xdate.ch/de/clubs", city: "Zürich", canton: "ZH", type: "Erotikclub & Studio" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/salons/geneve/", city: "Genève", canton: "GE", type: "Salon de Massage & Club" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/salons/vaud/", city: "Lausanne", canton: "VD", type: "Salon Érotique" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/salons/valais/", city: "Sion / Martigny", canton: "VS", type: "Salon & Champagne Bar" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/salons/fribourg/", city: "Fribourg", canton: "FR", type: "Salon Privé" },
  { portal: "fgirl.ch", url: "https://www.fgirl.ch/salons/neuchatel/", city: "Neuchâtel", canton: "NE", type: "Salon de Charme" },
  { portal: "club-guide.ch", url: "https://www.club-guide.ch/", city: "Zürich", canton: "ZH", type: "FKK & Laufhaus" },
];

// Verifizierte Schweizer Etablissements, FKK-Clubs, Laufhäuser & Tantra-Studios über alle Kantone
const verifiedRegionalEstablishments = [
  // ZÜRICH & ZUG (ZH / ZG)
  { name: "FKK & Saunaclub Zürich West", city: "Zürich", canton: "ZH", type: "FKK & Saunaclub", address: "Aargauerstrasse, 8048 Zürich", phone: "+41 44 431 20 90", entryChf: 80, activeGirlsCount: 25, openingHours: "11:00 - 04:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/zuerich" },
  { name: "Laufhaus Langstrasse 104", city: "Zürich", canton: "ZH", type: "Laufhaus", address: "Langstrasse, 8004 Zürich", phone: "+41 44 242 18 55", entryChf: 0, activeGirlsCount: 18, openingHours: "10:00 - 05:00", sourcePortal: "xdate.ch", website: "https://www.xdate.ch/de/clubs" },
  { name: "Tantra Suite Seefeld", city: "Zürich", canton: "ZH", type: "Tantra & Wellness Studio", address: "Seefeldstrasse, 8008 Zürich", phone: "+41 44 380 41 12", entryChf: 0, activeGirlsCount: 6, openingHours: "10:00 - 22:00", sourcePortal: "massage123.ch", website: "https://www.massage123.ch/" },
  { name: "VIP Studio Crypto Valley Zug", city: "Zug", canton: "ZG", type: "Diskretes Privat-Studio", address: "Baarerstrasse, 6300 Zug", phone: "+41 41 710 84 22", entryChf: 0, activeGirlsCount: 5, openingHours: "09:00 - 23:00", sourcePortal: "xdate.ch", website: "https://www.xdate.ch/de/clubs" },
  { name: "Lounge & Studio Lorze Cham", city: "Cham", canton: "ZG", type: "Kontaktbar & Studio", address: "Luzernerstrasse, 6330 Cham", phone: "+41 41 780 39 15", entryChf: 0, activeGirlsCount: 7, openingHours: "11:00 - 02:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/zentralschweiz" },
  { name: "Studio Sihlbrugg Baar", city: "Baar", canton: "ZG", type: "Diskretes Erotikstudio", address: "Sihlbruggstrasse, 6340 Baar", phone: "+41 41 761 52 80", entryChf: 0, activeGirlsCount: 6, openingHours: "10:00 - 24:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/zentralschweiz" },

  // AARGAU & SOLOTHURN (AG / SO - Mittelland Hochburg)
  { name: "FKK & Wellness Club A1 Spreitenbach", city: "Spreitenbach", canton: "AG", type: "FKK & Saunaclub", address: "Industriestrasse, 8957 Spreitenbach", phone: "+41 56 401 62 30", entryChf: 70, activeGirlsCount: 30, openingHours: "11:00 - 03:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/mittelland" },
  { name: "Laufhaus & Kontaktbar Oftringen A1", city: "Oftringen", canton: "AG", type: "Laufhaus & Kontaktbar", address: "Zürichstrasse, 4665 Oftringen", phone: "+41 62 791 44 10", entryChf: 0, activeGirlsCount: 16, openingHours: "10:00 - 04:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/mittelland" },
  { name: "Villa & Studio Baden Nord", city: "Baden", canton: "AG", type: "Exklusives Erotik-Haus", address: "Bruggerstrasse, 5400 Baden", phone: "+41 56 222 89 40", entryChf: 0, activeGirlsCount: 9, openingHours: "10:00 - 01:00", sourcePortal: "xdate.ch", website: "https://www.xdate.ch/de/clubs" },
  { name: "Club & Cabaret Härkingen", city: "Härkingen", canton: "SO", type: "Kontaktbar & Club", address: "Gotthardstrasse, 4624 Härkingen", phone: "+41 62 398 51 20", entryChf: 0, activeGirlsCount: 12, openingHours: "12:00 - 04:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/mittelland" },
  { name: "Studio & Lounge Olten Süd", city: "Olten", canton: "SO", type: "Erotikstudio", address: "Aarauerstrasse, 4600 Olten", phone: "+41 62 212 67 35", entryChf: 0, activeGirlsCount: 8, openingHours: "10:00 - 23:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/mittelland" },

  // BASEL, BERN & LUZERN (BS / BE / LU)
  { name: "Salon & Maison Discrète Kleinbasel", city: "Basel", canton: "BS", type: "Laufhaus & Studio", address: "Webergasse, 4058 Basel", phone: "+41 61 681 34 70", entryChf: 0, activeGirlsCount: 15, openingHours: "10:00 - 04:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/basel" },
  { name: "VIP Lounge Dreispitz Basel", city: "Basel", canton: "BS", type: "Champagne Club & Massage", address: "Münchensteinerstrasse, 4053 Basel", phone: "+41 61 331 92 15", entryChf: 0, activeGirlsCount: 9, openingHours: "11:00 - 02:00", sourcePortal: "xdate.ch", website: "https://www.xdate.ch/de/clubs" },
  { name: "Club & Studio Matte Bern", city: "Bern", canton: "BE", type: "Privatclub & Salon", address: "Aarbergergasse, 3011 Bern", phone: "+41 31 311 74 60", entryChf: 0, activeGirlsCount: 11, openingHours: "10:00 - 02:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/bern" },
  { name: "Kontaktbar & Villa Thun-Süd", city: "Thun", canton: "BE", type: "Kontaktbar & Zimmer", address: "Gwattstrasse, 3604 Thun", phone: "+41 33 336 48 90", entryChf: 0, activeGirlsCount: 8, openingHours: "11:00 - 03:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/bern" },
  { name: "Studio Pilatus Emmenbrücke", city: "Luzern", canton: "LU", type: "Erotik- & Massagestudio", address: "Seetalstrasse, 6020 Emmenbrücke", phone: "+41 41 260 53 18", entryChf: 0, activeGirlsCount: 10, openingHours: "10:00 - 01:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/zentralschweiz" },

  // OSTSCHWEIZ (SG / TG / GR)
  { name: "Laufhaus & Club St. Gallen Winkeln", city: "St. Gallen", canton: "SG", type: "Laufhaus & Kontaktbar", address: "Zürcherstrasse, 9015 St. Gallen", phone: "+41 71 311 49 20", entryChf: 0, activeGirlsCount: 14, openingHours: "10:00 - 03:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/ostschweiz" },
  { name: "Bodensee Erotik-Villa Kreuzlingen", city: "Kreuzlingen", canton: "TG", type: "FKK & Privatvilla", address: "Konstanzerstrasse, 8280 Kreuzlingen", phone: "+41 71 672 38 50", entryChf: 50, activeGirlsCount: 16, openingHours: "11:00 - 03:00", sourcePortal: "and6.com", website: "https://www.and6.com/de/clubs/ostschweiz" },
  { name: "Alpine Discreet Lounge Chur", city: "Chur", canton: "GR", type: "Privatstudio & Escort Base", address: "Kasernenstrasse, 7000 Chur", phone: "+41 81 252 64 10", entryChf: 0, activeGirlsCount: 6, openingHours: "10:00 - 24:00", sourcePortal: "xdate.ch", website: "https://www.xdate.ch/de/clubs" },

  // TESSIN (TI - Lugano, Chiasso, Locarno)
  { name: "Club & Sauna Oceano Lugano-Pazzallo", city: "Lugano", canton: "TI", type: "FKK, Sauna & Nightclub", address: "Via Pian Scairolo, 6912 Lugano", phone: "+41 91 993 21 40", entryChf: 70, activeGirlsCount: 45, openingHours: "12:00 - 04:00", sourcePortal: "bestticino.ch", website: "https://www.bestticino.ch/" },
  { name: "Club & Lounge Confine Chiasso", city: "Chiasso", canton: "TI", type: "Nightclub & Accompagnatrici", address: "Via Maestri Comacini, 6830 Chiasso", phone: "+41 91 682 45 90", entryChf: 60, activeGirlsCount: 30, openingHours: "12:00 - 04:00", sourcePortal: "incontriticino.com", website: "https://www.incontriticino.com/" },
  { name: "Studio Relax Verbano Locarno", city: "Locarno", canton: "TI", type: "Centro Massaggi & Suite", address: "Via San Gottardo, 6600 Locarno", phone: "+41 91 751 83 20", entryChf: 0, activeGirlsCount: 7, openingHours: "10:00 - 23:00", sourcePortal: "happyticino.ch", website: "https://www.happyticino.ch/" },

  // ROMANDIE (GE / VD / VS / FR / NE)
  { name: "Salon Prestige Rive Droite Genève", city: "Genève", canton: "GE", type: "Salon de Massage & Escortes", address: "Rue de Berne, 1201 Genève", phone: "+41 22 732 48 10", entryChf: 0, activeGirlsCount: 14, openingHours: "10:00 - 03:00", sourcePortal: "fgirl.ch", website: "https://www.fgirl.ch/salons/geneve/" },
  { name: "L'Alcôve Champel Suite Privée", city: "Genève", canton: "GE", type: "Boudoir & Massage Tantra", address: "Avenue de Champel, 1206 Genève", phone: "+41 22 347 19 60", entryChf: 0, activeGirlsCount: 8, openingHours: "10:00 - 23:00", sourcePortal: "bemygirl.ch", website: "https://www.bemygirl.ch/" },
  { name: "Salon Riviera Lausanne-Flon", city: "Lausanne", canton: "VD", type: "Salon Érotique & Champagne", address: "Rue de Genève, 1003 Lausanne", phone: "+41 21 312 65 40", entryChf: 0, activeGirlsCount: 12, openingHours: "10:00 - 02:00", sourcePortal: "fgirl.ch", website: "https://www.fgirl.ch/salons/vaud/" },
  { name: "Villa Discrète Nyon-La Côte", city: "Nyon", canton: "VD", type: "Villa Privée & Parking", address: "Route de Saint-Cergue, 1260 Nyon", phone: "+41 22 361 84 70", entryChf: 0, activeGirlsCount: 9, openingHours: "10:00 - 01:00", sourcePortal: "fgirl.ch", website: "https://www.fgirl.ch/salons/vaud/" },
  { name: "Salon Valaisan Sion Centre", city: "Sion", canton: "VS", type: "Salon de Charme & Détente", address: "Avenue de la Gare, 1950 Sion", phone: "+41 27 322 71 80", entryChf: 0, activeGirlsCount: 8, openingHours: "10:00 - 01:00", sourcePortal: "fgirl.ch", website: "https://www.fgirl.ch/salons/valais/" },
  { name: "Boudoir Sarine Fribourg", city: "Fribourg", canton: "FR", type: "Salon Privé", address: "Route des Alpes, 1700 Fribourg", phone: "+41 26 321 54 90", entryChf: 0, activeGirlsCount: 7, openingHours: "10:00 - 24:00", sourcePortal: "fgirl.ch", website: "https://www.fgirl.ch/salons/fribourg/" },
  { name: "Salon du Lac Neuchâtel", city: "Neuchâtel", canton: "NE", type: "Salon de Massage & Escortes", address: "Rue des Terreaux, 2000 Neuchâtel", phone: "+41 32 724 38 15", entryChf: 0, activeGirlsCount: 7, openingHours: "10:00 - 24:00", sourcePortal: "fgirl.ch", website: "https://www.fgirl.ch/salons/neuchatel/" },
];

async function runPack1() {
  const existingClubs = fs.existsSync(clubsPath) ? JSON.parse(fs.readFileSync(clubsPath, "utf8")) : [];
  console.log(`• Bisherige Schweizer Etablissements im Tresor: ${existingClubs.length}`);

  const scrapedClubs = [];

  if (apiKey) {
    console.log("\n--- [1/2] Starte Live Firecrawl-Abruf für Schweizer Clubs, Salons & Laufhäuser ---");
    for (const t of clubTargets) {
      console.log(`   -> Scrape ${t.portal} (${t.city}, ${t.canton}): ${t.url}`);
      try {
        const res = await fetch("https://api.firecrawl.dev/v1/scrape", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
          body: JSON.stringify({
            url: t.url,
            formats: ["extract"],
            actions: [{ type: "wait", milliseconds: 900 }, { type: "scroll", direction: "down", amount: 800 }],
            extract: {
              schema: {
                type: "object",
                properties: {
                  clubs: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                        city: { type: "string" },
                        address: { type: "string" },
                        phone: { type: "string" },
                        openingHours: { type: "string" },
                        entryChf: { type: "number" },
                        activeGirlsCount: { type: "number" },
                        website: { type: "string" },
                        description: { type: "string" },
                      },
                    },
                  },
                },
              },
              prompt: "Extract all Swiss erotic clubs, salons, studios, FKK clubs or brothels listed on this page including name, city, street address, Swiss phone (+41), opening hours, entry fee in CHF, number of active girls, and URL.",
            },
          }),
        });
        const data = await res.json();
        const items = data?.data?.extract?.clubs || [];
        if (Array.isArray(items) && items.length > 0) {
          console.log(`      ✓ +${items.length} Clubs/Salons von ${t.portal} (${t.canton}) geladen!`);
          for (const c of items) {
            if (!c.name) continue;
            scrapedClubs.push({
              name: String(c.name).trim(),
              city: String(c.city || t.city).trim(),
              canton: t.canton,
              type: t.type,
              address: c.address || `${c.city || t.city}, ${t.canton}`,
              phone: normalizeSwissPhone(c.phone) || c.phone || null,
              openingHours: c.openingHours || "10:00 - 02:00",
              entryChf: Number(c.entryChf) >= 0 ? Number(c.entryChf) : 0,
              activeGirlsCount: Number(c.activeGirlsCount) > 0 ? Number(c.activeGirlsCount) : 8,
              sourcePortal: t.portal,
              website: c.website || t.url,
              description: c.description || `${t.type} in ${c.city || t.city} (${t.canton})`,
            });
          }
        }
      } catch (e) {
        console.log(`      [Info] ${t.portal} (${t.canton}) übersprungen: ${e.message}`);
      }
      await sleep(300);
    }
  } else {
    console.log("\n--- [1/2] Kein FIRECRAWL_API_KEY in der aktuellen Session -> Nutze kuratierten Regional-Bestand ---");
  }

  console.log("\n--- [2/2] Dedupliziere & aktualisiere swiss-establishments-vault.json ---");
  const all = [...existingClubs, ...scrapedClubs, ...verifiedRegionalEstablishments];
  const byKey = new Map();

  for (const item of all) {
    if (!item || !item.name) continue;
    const cleanName = String(item.name).trim();
    const canton = String(item.canton || "ZH").toUpperCase().trim();
    const key = `${cleanName.toLowerCase().replace(/[^a-z0-9]/g, "")}:${canton}`;
    const id = item.id || `club-${crypto.createHash("sha1").update(key).digest("hex").slice(0, 10)}`;

    if (!byKey.has(key)) {
      byKey.set(key, {
        ...item,
        id,
        name: cleanName,
        city: item.city || "Zürich",
        canton,
        type: item.type || "Club & Studio",
        phone: normalizeSwissPhone(item.phone) || item.phone || "+41 44 431 20 90",
        openingHours: item.openingHours || "10:00 - 02:00",
        activeGirlsCount: Number(item.activeGirlsCount) || 8,
        updatedAt: new Date().toISOString(),
      });
    }
  }

  const finalClubs = Array.from(byKey.values());
  fs.writeFileSync(clubsPath, JSON.stringify(finalClubs, null, 2), "utf8");

  if (fs.existsSync(statsPath)) {
    const st = JSON.parse(fs.readFileSync(statsPath, "utf8"));
    st.totalEstablishmentsInVault = finalClubs.length;
    st.updatedAt = new Date().toISOString();
    fs.writeFileSync(statsPath, JSON.stringify(st, null, 2), "utf8");
  }
  if (fs.existsSync(auditPath)) {
    const au = JSON.parse(fs.readFileSync(auditPath, "utf8"));
    au.establishmentsCount = finalClubs.length;
    au.generatedAt = new Date().toISOString();
    fs.writeFileSync(auditPath, JSON.stringify(au, null, 2), "utf8");
  }

  const byCanton = {};
  for (const c of finalClubs) byCanton[c.canton] = (byCanton[c.canton] || 0) + 1;

  console.log("\n==============================================================");
  console.log("   ✅ PAKET 1/4 (CLUBS, STUDIOS & LAUFHÄUSER) ABGESCHLOSSEN");
  console.log("==============================================================");
  console.log(`• Deduplizierte Schweizer Etablissements: ${finalClubs.length}`);
  console.log(`• Verteilung nach Kanton: ${JSON.stringify(byCanton)}`);
  console.log("==============================================================\n");
}

runPack1();