import fs from "fs";
import path from "path";

const envRaw = fs.existsSync(".env.local") ? fs.readFileSync(".env.local", "utf8") : "";
let VENICE_KEY = "";
for (const line of envRaw.split(/\r?\n/)) {
  const t = line.trim();
  if (t.startsWith("VENICE_API_KEY=")) VENICE_KEY = t.slice("VENICE_API_KEY=".length).trim().replace(/^"(.*)"$/, "$1");
}

const STYLE = "ultra-high-end editorial photography, rich warm velvet night lighting, subtle crimson and brushed champagne gold accents, sharp focus, cinematic depth of field, luxury Swiss magazine aesthetic, no text, no watermark, no letters";

const ASSETS = [
  // Hero & Xenia AI Guide
  ["hero-swiss-night.webp", 1280, 720, `Glamorous young European woman in black silk evening attire on a candlelit luxury penthouse terrace overlooking Zurich Grossmuenster riverlights and snow-dusted Swiss Alps at twilight, ${STYLE}`, "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=1400&q=85"],
  ["xenia-avatar.webp", 640, 640, `Close-up editorial portrait of a charismatic, warm, intelligent Swiss concierge woman in her late 20s, dark espresso hair, subtle gold earrings, warm welcoming smile, dark velvet lounge bokeh background, ${STYLE}`, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=85"],

  // 10 Schweizer Regionen
  ["regions/zurich.webp", 640, 480, `Zurich Grossmuenster and Limmat river illuminated at golden twilight with Swiss Alps on horizon, ${STYLE}`, "https://images.unsplash.com/photo-1515488764276-beab7607c1e6?auto=format&fit=crop&w=700&q=80"],
  ["regions/zug.webp", 640, 480, `Lake Zug sunset promenade with historic old town tower and alpine reflections, ${STYLE}`, "https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=700&q=80"],
  ["regions/geneva.webp", 640, 480, `Geneva Jet d'Eau fountain and luxury lakeside hotels glowing at dusk, ${STYLE}`, "https://images.unsplash.com/photo-1574068468668-a05a11f871da?auto=format&fit=crop&w=700&q=80"],
  ["regions/basel.webp", 640, 480, `Basel Rhine river bridge and red sandstone cathedral illuminated at night, ${STYLE}`, "https://images.unsplash.com/photo-1573108037329-37aa135a142e?auto=format&fit=crop&w=700&q=80"],
  ["regions/bern.webp", 640, 480, `Bern Zytglogge clock tower and old town arcades in warm evening light, ${STYLE}`, "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=700&q=80"],
  ["regions/luzern.webp", 640, 480, `Lucerne Chapel Bridge and water tower glowing at dusk before Mount Pilatus, ${STYLE}`, "https://images.unsplash.com/photo-1527668752968-14dc70a27c95?auto=format&fit=crop&w=700&q=80"],
  ["regions/lausanne.webp", 640, 480, `Lausanne Lake Geneva Riviera terrace and mountains at sunset, ${STYLE}`, "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=700&q=80"],
  ["regions/stgallen.webp", 640, 480, `St. Gallen baroque abbey quarter illuminated in warm twilight, ${STYLE}`, "https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=700&q=80"],
  ["regions/lugano.webp", 640, 480, `Lugano palm-lined lakeside promenade with warmlights and Monte San Salvatore at dusk, ${STYLE}`, "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=700&q=80"],
  ["regions/aargau.webp", 640, 480, `Baden thermal spa quarter and historic Swiss castle overlooking river at dusk, ${STYLE}`, "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=700&q=80"],

  // 6 Erlebnis-Kategorien ("Worauf hast du Lust?")
  ["vibes/escort.webp", 640, 800, `Sensual luxury woman seen from behind in delicate black lace evening gown beside warm bedside lamp in 5-star hotel suite, ${STYLE}`, "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85"],
  ["vibes/massage.webp", 640, 800, `Sensual tantra spa atmosphere with warm golden massage oil,rolled white towels, orchid flower and glowing candles, ${STYLE}`, "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=700&q=85"],
  ["vibes/clubs.webp", 640, 800, `Intimate luxury velvet VIP lounge with crimson curtains, champagne cooler and warm ambient lighting, ${STYLE}`, "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=700&q=85"],
  ["vibes/private.webp", 640, 800, `Romantic silk bedsheets, two crystal champagne glasses and warm candlelight in discreet private apartment, ${STYLE}`, "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85"],
  ["vibes/bdsm.webp", 640, 800, `Confident elegant woman in tailored black leather couture corset in dramatic chiaroscuro studio lighting, ${STYLE}`, "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=85"],
  ["vibes/vip.webp", 640, 800, `Faceted sparkling diamond resting on deep crimson velvet cushion with warm golden rim light, ${STYLE}`, "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85"],

  // 10 Konkurrenz-Portale Kartenhintergründe & Vergleichs-Visual
  ["portals/compare-hero.webp", 960, 540, `Sleek luxury binoculars resting on alpine rock overlooking glowing Swiss mountain valley at twilight, ${STYLE}`, "https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?auto=format&fit=crop&w=900&q=80"],
  ["portals/and6.webp", 640, 400, `Glamorous woman silhouette in warm amber bedroom lighting, luxury editorial, ${STYLE}`, "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=600&q=80"],
  ["portals/6navi.webp", 640, 400, `Elegant woman in black lace bodysuit in moody champagne-lit suite, ${STYLE}`, "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80"],
  ["portals/sexch.webp", 640, 400, `Sensual glossy red lips and cocktail glass in warm neon-velvet bar light, ${STYLE}`, "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=600&q=80"],
  ["portals/ladies.webp", 640, 400, `Elegant woman in silk evening gown in luxury Swiss hotel corridor, ${STYLE}`, "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=600&q=80"],
  ["portals/saferchoice.webp", 640, 400, `Brushed gold padlock on dark obsidian marble symbolizing Swiss discretion and verification, ${STYLE}`, "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80"],
  ["portals/lolla.webp", 640, 400, `Chic French-Swiss woman at Geneva lakeside lounge at twilight, ${STYLE}`, "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=600&q=80"],
  ["portals/megaescort.webp", 640, 400, `Golden crown motif and luxury evening silhouette in warm candlelight, ${STYLE}`, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80"],
  ["portals/target.webp", 640, 400, `International high-fashion woman stepping out of black limousine at Zurich luxury hotel, ${STYLE}`, "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=600&q=80"],
  ["portals/ladama.webp", 640, 400, `Candlelit fine dining table with champagne flutes overlooking Swiss lake, ${STYLE}`, "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=600&q=80"],
  ["portals/girlsdeluxe.webp", 640, 400, `Modern luxury penthouse apartment interior with warm indirect lighting, ${STYLE}`, "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=600&q=80"],

  // Creator CTA Visual
  ["cta-creator.webp", 768, 768, `Brass hotel door handle with elegant cream card hanging in warm luxury hallway with candlelight, ${STYLE}`, "https://images.unsplash.com/photo-1519699047748-de8e457a634e?auto=format&fit=crop&w=700&q=80"],

  // 8 Lokale KI-Porträt-Fallbacks (damit 0 Karten jemals schwarz sind!)
  ["portraits/p1.webp", 640, 832, `Editorial portrait of a stunning 25-year-old European brunette woman in black silk slip dress, warm hotel suite lighting, natural skin texture, ${STYLE}`, "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=700&q=85"],
  ["portraits/p2.webp", 640, 832, `Editorial portrait of a gorgeous 26-year-old blonde Swiss woman in champagne satin top, soft golden evening light, natural look, ${STYLE}`, "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=700&q=85"],
  ["portraits/p3.webp", 640, 832, `Editorial portrait of an alluring 24-year-old Latina woman with wavy dark hair in off-shoulder evening wear, warm bokeh, ${STYLE}`, "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=700&q=85"],
  ["portraits/p4.webp", 640, 832, `Editorial portrait of a graceful 27-year-old Mediterranean woman with hazel eyes in velvet lounge setting, ${STYLE}`, "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=700&q=85"],
  ["portraits/p5.webp", 640, 832, `Editorial portrait of an elegant 25-year-old East Asian woman in black evening attire, luxury Zurich hotel lounge lighting, ${STYLE}`, "https://images.unsplash.com/photo-1534751516642-a1af1ef26a56?auto=format&fit=crop&w=700&q=85"],
  ["portraits/p6.webp", 640, 832, `Editorial portrait of a captivating 28-year-old auburn-haired woman in dark emerald silk blouse, warm candlelight, ${STYLE}`, "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=700&q=85"],
  ["portraits/p7.webp", 640, 832, `Editorial portrait of a radiant 24-year-old Slavic blonde model in black tailored blazer, luxury penthouse night bokeh, ${STYLE}`, "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=700&q=85"],
  ["portraits/p8.webp", 640, 832, `Editorial portrait of a sophisticated 26-year-old Italian woman with dark eyes and soft smile in warm amber hotel bar light, ${STYLE}`, "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=700&q=85"]
];

const MODELS = ["flux-dev", "fluently-xl", "lustify-sdxl"];

async function generateVenice(prompt, width, height) {
  if (!VENICE_KEY) return null;
  for (const model of MODELS) {
    try {
      const ctrl = new AbortController();
      const t = setTimeout(() => ctrl.abort(), 28000);
      const res = await fetch("https://api.venice.ai/api/v1/image/generate", {
        method: "POST",
        signal: ctrl.signal,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${VENICE_KEY}`
        },
        body: JSON.stringify({
          model,
          prompt,
          width,
          height,
          format: "webp",
          steps: 24,
          hide_watermark: true,
          safe_mode: false
        })
      });
      clearTimeout(t);
      if (!res.ok) continue;
      const data = await res.json();
      const b64 = data && data.images && data.images[0];
      if (b64 && typeof b64 === "string") {
        const buf = Buffer.from(b64, "base64");
        if (buf.length > 3000) return buf;
      }
    } catch {}
  }
  return null;
}

async function fetchBackupBuffer(url) {
  try {
    const r = await fetch(url);
    if (!r.ok) return null;
    const b = Buffer.from(await r.arrayBuffer());
    return b.length > 2000 ? b : null;
  } catch {
    return null;
  }
}

async function runPool() {
  const baseDir = path.join("public", "images", "ai");
  let idx = 0;
  let veniceCount = 0;
  let cachedCount = 0;
  let backupCount = 0;

  async function worker() {
    while (idx < ASSETS.length) {
      const current = ASSETS[idx++];
      const [relPath, w, h, prompt, backupUrl] = current;
      const outPath = path.join(baseDir, relPath);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });

      if (fs.existsSync(outPath) && fs.statSync(outPath).size > 3500) {
        cachedCount++;
        continue;
      }

      let buf = await generateVenice(prompt, w, h);
      if (buf) {
        fs.writeFileSync(outPath, buf);
        veniceCount++;
        console.log(`  🎨 [Venice KI] ${relPath} (${Math.round(buf.length / 1024)} KB)`);
      } else {
        const fb = await fetchBackupBuffer(backupUrl);
        if (fb) {
          fs.writeFileSync(outPath, fb);
          backupCount++;
          console.log(`  🛡️ [Fallback-Stream] ${relPath} (${Math.round(fb.length / 1024)} KB)`);
        }
      }
    }
  }

  await Promise.all([worker(), worker(), worker(), worker()]);
  console.log(`✓ Visual-Suite komplett: ${veniceCount} neu per Venice.ai generiert, ${cachedCount} bereits vorhanden, ${backupCount} lokal gepuffert.`);
}

await runPool();