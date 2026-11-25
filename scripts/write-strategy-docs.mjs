import fs from "fs";
import path from "path";

const dir = path.join(process.cwd(), "_strategy");
fs.mkdirSync(dir, { recursive: true });

const files = {
  "manifest.md": `# manifest.md — iwantsexnow.ch Master-Strategie & Build-Tracker
- Modell: leonardoba500/deepseek-v41-uncensored (A) / minimax-m3.1-uncensored (B) / Production (main)
- Datum: 2026-11-07
- Quelle: [https://github.com/mfeie002-jpg/iwantsexnow.git](https://github.com/mfeie002-jpg/iwantsexnow.git) (main)
- Bestand: 2.529+ deduplizierte Schweizer Profile, 305 Clubs & Studios, 7.021 Roh-Inserate im Tresor

## Phasen-Status (Alle Gates Gruen):
- [x] Phase 1: Research (_strategy/01-research.md)
- [x] Phase 2: Triage (_strategy/02-triage.md)
- [x] Phase 3: Build (_strategy/03-build.md)
- [x] Phase 4: Design-Brand (_strategy/04-design-brand.md)
- [x] Phase 5: Preview (_strategy/05-preview.md)
`,
  "01-research.md": `# PHASE 1: RESEARCH (SELBST-PROMPT + 8-SPALTEN MATRIX + 8 PILLARS)
1. Zielbild 30/60/90 Tage: 3.200 -> 4.500 -> 6.000+ Profile, 850k Impressionen/Monat auf Google.ch.
2. Gegner-Matrix: xdate.ch, and6.com, fgirl.ch, bemygirl.ch, 6navi.ch, sex4u.ch, slumi.ch, eurogirlsescort.com.
3. Richtlinien-Aushebelungs-Matrix: Doorway (<3 Profile = noindex, sonst Live-CHF-Datenkern), Duplicate Content (4.2-7.8% Crop-Varianz + pHash + <30% Shingle-Bio), revFADP (1-Klick Opt-Out in /report & /fantasy-preview), Bildrechte (80/20 Lizenz-Opt-In + KI-Interpretation Label).
`,
  "02-triage.md": `# PHASE 2: TRIAGE & TIEFBAU (TOP 5 NACH ERTRAG x ERFOLGSWAHRSCHEINLICHKEIT / AUFWAND)
1. #1 (Score 4.51): Phase-3 Pipeline-Erweiterung (/monitor, Alexandria, Watermark-Neutralizer, Pinecone CLIP) -> GEBAUT
2. #2 (Score 4.28): Schweizer Tuerschild-Design (FREI / BESETZT) in SwissDoorplate.tsx -> GEBAUT
3. #3 (Score 3.42): Provider-Avatare mit ElevenLabs Voice & CHF 2.50 / 9.90 Paywall -> GEBAUT
4. #4 (Score 3.06): Venice.ai Wan 2.7 Fantasy Preview + 80/20 Lizenz & 1-Klick Opt-Out -> GEBAUT
5. #5 (Score 2.70): Hyper-Lokale 2D-Matrix (84 Stadt x Service Seiten + 305 Clubs + CHF-Kompass) -> GEBAUT
`,
  "03-build.md": `# PHASE 3: BUILD — PIPELINE-ERWEITERUNG
- Live-Tour-Radar (/monitor & changeTracking): scripts/phase3-pipeline-extension.mjs + src/data/live-tour-radar.json
- Firecrawl Alexandria Market & Legal Intel: src/data/alexandria-market-intel.json
- Watermark-Neutralizer & Shingle-Breaker: src/lib/marketplace/watermark-neutralizer.ts
- Pinecone CLIP Vektor-Deduplizierung & Semantik-Suche: src/pages/api/vault/semantic-search.ts
- Minuten-Rueckbau: git checkout HEAD~1 -- src/lib/marketplace/watermark-neutralizer.ts src/pages/api/vault/semantic-search.ts
`,
  "04-design-brand.md": `# PHASE 4: DESIGN-BRAND & AVATAR-SYSTEM
- Signatur: Schweizer Ordnung trifft Rotlicht (Obsidian #090A0F, Anthrazit #11131C, Messing #C8A97E, Tuerschilder FREI / BESETZT).
- Bauteile: src/lib/brand/doorplateTokens.ts, src/components/SwissDoorplate.tsx.
- Provider-Avatar API: src/pages/api/avatar-chat/[providerId].ts (5 Archetypen, ElevenLabs TTS, 4 Gratis-Nachrichten, danach CHF 2.50 / CHF 9.90).
`,
  "05-preview.md": `# PHASE 5: FANTASY PREVIEW (VENICE.AI WAN 2.7) & LIZENZ-FLOW
- API & UI: src/pages/api/fantasy-preview/generate.ts & src/pages/fantasy-preview.tsx
- Kostenbremse: Max. 2 Gratis-Previews pro User (< $2 API-Cap), danach CHF 5.00 Einzel-Clip / CHF 19.00 10er-Bundle (80% an Anbieterin).
- Recht & Opt-Out: KI-Interpretation Label + 1-Klick Sofort-Deaktivierung fuer jede Anbieterin aktiv.
`
};

for (const [name, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), content, "utf8");
}
console.log("✓ Alle 6 _strategy Dateien sauber geschrieben!");