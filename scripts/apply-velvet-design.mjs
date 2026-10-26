import fs from "fs";
import path from "path";

const root = process.cwd();

// ---------------------------------------------------------------------------
// 1. GLOBALE ATMOSPHÄREN-KLASSEN & KEYFRAMES IN src/styles/globals.css ERGÄNZEN
// ---------------------------------------------------------------------------
const globalsCssPath = path.join(root, "src", "styles", "globals.css");
if (fs.existsSync(globalsCssPath)) {
  let css = fs.readFileSync(globalsCssPath, "utf8");
  const customLuxuryCss = `
/* === IWSN VELVET PENTHOUSE & CHAMPAGNE GLOW ATMOSPHERE === */
.iwsn-velvet-bg {
  background-color: #0B0D13;
  background-image:
    radial-gradient(circle at 18% 12%, rgba(198, 165, 116, 0.19) 0%, rgba(198, 165, 116, 0.04) 28%, transparent 55%),
    radial-gradient(circle at 85% 18%, rgba(136, 34, 68, 0.18) 0%, rgba(136, 34, 68, 0.03) 32%, transparent 60%),
    radial-gradient(circle at 50% 65%, rgba(198, 165, 116, 0.09) 0%, transparent 60%),
    linear-gradient(180deg, #0E1017 0%, #12151E 45%, #0B0D13 100%);
  background-attachment: fixed;
}

.iwsn-gold-grid-overlay {
  background-size: 56px 56px;
  background-image:
    linear-gradient(to right, rgba(198, 165, 116, 0.045) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(198, 165, 116, 0.045) 1px, transparent 1px);
  mask-image: radial-gradient(ellipse 80% 60% at 50% 20%, black 35%, transparent 100%);
}

.iwsn-card-glow {
  transition: all 0.28s cubic-bezier(0.16, 1, 0.3, 1);
  box-shadow: 0 14px 34px -12px rgba(0, 0, 0, 0.7), inset 0 1px 0 0 rgba(255, 255, 255, 0.08);
}

.iwsn-card-glow:hover {
  transform: translateY(-4px);
  border-color: rgba(198, 165, 116, 0.55) !important;
  box-shadow:
    0 22px 45px -12px rgba(0, 0, 0, 0.85),
    0 0 28px -4px rgba(198, 165, 116, 0.22),
    inset 0 1px 0 0 rgba(229, 201, 155, 0.3);
}

.iwsn-champagne-text {
  background: linear-gradient(135deg, #FFFDF9 0%, #F3E3C3 48%, #C6A574 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}
`;
  if (!css.includes("IWSN VELVET PENTHOUSE")) {
    fs.writeFileSync(globalsCssPath, css + "\n" + customLuxuryCss, "utf8");
    console.log("✓ 1. Velvet-Penthouse & Champagne-Glow Effekte in src/styles/globals.css eingetragen!");
  }
}

// ---------------------------------------------------------------------------
// 2. HINTERGRUND-KULISSE KOMPONENTE (src/components/VelvetBackdrop.tsx)
//    Schafft sofort Tiefe: Gold- & Velvet-Rose-Leuchten + Stencil-X Aura
// ---------------------------------------------------------------------------
const compDir = path.join(root, "src", "components");
const backdropCode = `import React from "react";

export function VelvetBackdrop() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {/* Warm Champagne Top-Left Spotlight */}
      <div
        className="absolute -top-32 -left-24 w-[540px] h-[540px] rounded-full opacity-35 blur-[130px]"
        style={{ background: "radial-gradient(circle, #D4AF7A 0%, #8A5A2B 55%, transparent 75%)" }}
      />
      {/* Sensual Velvet-Burgundy Top-Right Ambient Light */}
      <div
        className="absolute top-12 -right-28 w-[520px] h-[520px] rounded-full opacity-30 blur-[140px]"
        style={{ background: "radial-gradient(circle, #9E2A52 0%, #4A1228 60%, transparent 80%)" }}
      />
      {/* Soft Golden Center-Bottom Glow */}
      <div
        className="absolute bottom-0 left-1/3 w-[620px] h-[420px] rounded-full opacity-20 blur-[150px]"
        style={{ background: "radial-gradient(circle, #C6A574 0%, transparent 70%)" }}
      />
      {/* Fine Architectural Gold Grid */}
      <div className="absolute inset-0 iwsn-gold-grid-overlay" />

      {/* Giant Subtle Architectural Stencil-X Watermark on the Right */}
      <svg
        viewBox="0 0 200 200"
        className="hidden lg:block absolute top-24 right-[6%] w-[440px] h-[440px] opacity-[0.045]"
        fill="none"
      >
        <path d="M24 20 L92 100 L24 180 L56 180 L108 118 L108 82 L56 20 Z" fill="#C6A574" />
        <path d="M176 20 L108 100 L176 180 L144 180 L92 118 L92 82 L144 20 Z" fill="#E5C99B" />
      </svg>
    </div>
  );
}

export default VelvetBackdrop;
`;
fs.writeFileSync(path.join(compDir, "VelvetBackdrop.tsx"), backdropCode, "utf8");
console.log("✓ 2. Atmosphärische Hintergrund-Komponente erstellt: src/components/VelvetBackdrop.tsx");

// ---------------------------------------------------------------------------
// 3. VEREDLE DIE STARTSEITE (src/pages/index.tsx) MIT FARBTIEFE, HERO-AURA,
//    VISUELLEN REGIONEN-PILLEN & LEUCHTENDEN PROFILKARTEN
// ---------------------------------------------------------------------------
const indexPath = path.join(root, "src", "pages", "index.tsx");
if (fs.existsSync(indexPath)) {
  let code = fs.readFileSync(indexPath, "utf8");

  // Importiere VelvetBackdrop
  if (!code.includes("VelvetBackdrop")) {
    code = code.replace(
      'import { LuxuryHeader } from "@/components/LuxuryHeader";',
      'import { LuxuryHeader } from "@/components/LuxuryHeader";\nimport { VelvetBackdrop } from "@/components/VelvetBackdrop";'
    );
  }

  // Ersetze das triste bg-[#13161C] auf dem Haupt-Wrapper durch unsere neue Velvet-Kulisse
  code = code.replace(
    'bg-[#13161C] text-white',
    'iwsn-velvet-bg text-white relative selection:bg-[#C6A574] selection:text-[#12151C]'
  );

  // Füge <VelvetBackdrop /> direkt vor <LuxuryHeader /> im dunklen Modus ein
  if (!code.includes("<VelvetBackdrop />")) {
    code = code.replace(
      "<LuxuryHeader />",
      '{activeConcept !== "champagne_list" && <VelvetBackdrop />}\n      <LuxuryHeader />'
    );
  }

  // Mache den Hero-Container auf der Startseite zu einem edlen, hinterleuchteten Showcase-Banner
  const oldHeroHeader = '<section className="space-y-3">';
  const newHeroHeader = `<section className="relative z-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1B1F2B]/90 via-[#151822]/90 to-[#231722]/85 border border-[#C6A574]/30 shadow-[0_20px_50px_rgba(0,0,0,0.65)] backdrop-blur-xl space-y-5 overflow-hidden">
            <div className="pointer-events-none absolute -top-24 -right-24 w-72 h-72 rounded-full bg-[#C6A574]/15 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-24 w-72 h-72 rounded-full bg-rose-500/10 blur-3xl" />
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C6A574]/15 border border-[#C6A574]/40 text-[#F3E3C3] text-[11px] font-bold uppercase tracking-widest">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>SWISS CURATED DIRECTORY · DIREKT & VERIFIZIERT</span>
              </div>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <a href="/escort-zurich" className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C6A574]/20 border border-white/10 hover:border-[#C6A574]/50 text-[#E5C99B] font-semibold transition">Zürich</a>
                <a href="/orte/cham" className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C6A574]/20 border border-white/10 hover:border-[#C6A574]/50 text-[#E5C99B] font-semibold transition">Zug & Cham</a>
                <a href="/escort-basel" className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C6A574]/20 border border-white/10 hover:border-[#C6A574]/50 text-[#E5C99B] font-semibold transition">Basel</a>
                <a href="/escort-bern" className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C6A574]/20 border border-white/10 hover:border-[#C6A574]/50 text-[#E5C99B] font-semibold transition">Bern</a>
                <a href="/escort-geneva" className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C6A574]/20 border border-white/10 hover:border-[#C6A574]/50 text-[#E5C99B] font-semibold transition">Genève</a>
                <a href="/escort-lugano" className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-[#C6A574]/20 border border-white/10 hover:border-[#C6A574]/50 text-[#E5C99B] font-semibold transition">Lugano</a>
              </div>
            </div>`;

  if (code.includes(oldHeroHeader)) {
    code = code.replace(oldHeroHeader, newHeroHeader);
  }

  // Veredle die Haupt-Überschrift mit dem warmen Champagner-Verlauf
  code = code.replace(
    'className="text-2xl sm:text-4xl font-serif font-bold tracking-tight text-white"',
    'className="text-3xl sm:text-5xl font-serif font-bold tracking-tight iwsn-champagne-text drop-shadow-xs"'
  );

  // Veredle alle Profilkarten im Grid mit dem neuen iwsn-card-glow und edlerem Rahmen
  code = code.replace(
    /rounded-2xl bg-\[#1C2029\] border border-white\/10 overflow-hidden flex flex-col justify-between hover:border-\[#C6A574\]\/50 transition shadow-xl/g,
    "rounded-2xl bg-gradient-to-b from-[#1E222D]/95 to-[#151821]/95 border border-[#C6A574]/25 overflow-hidden flex flex-col justify-between iwsn-card-glow backdrop-blur-md"
  );

  fs.writeFileSync(indexPath, code, "utf8");
  console.log("✓ 3. Startseite (src/pages/index.tsx) mit Hero-Showcase, Farb-Aura & Card-Glow ausgestattet!");
}

// ---------------------------------------------------------------------------
// 4. VERPASSE AUCH DEM LUXURY-HEADER EINEN EDLEN CHAMPAGNER-GLANZ-STREIFEN
// ---------------------------------------------------------------------------
const headerPath = path.join(compDir, "LuxuryHeader.tsx");
if (fs.existsSync(headerPath)) {
  let hCode = fs.readFileSync(headerPath, "utf8");
  hCode = hCode.replace(
    'className="sticky top-0 z-40 bg-[#12151C]/95 backdrop-blur-md border-b border-white/10 text-white"',
    'className="sticky top-0 z-40 bg-[#0E1017]/90 backdrop-blur-xl border-b border-[#C6A574]/25 shadow-[0_10px_30px_rgba(0,0,0,0.5)] text-white"'
  );
  fs.writeFileSync(headerPath, hCode, "utf8");
  console.log("✓ 4. LuxuryHeader mit edler Champagner-Unterkante & Tiefen-Glas-Effekt aktualisiert.");
}