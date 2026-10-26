import fs from "fs";
import path from "path";

const root = process.cwd();
const compDir = path.join(root, "src", "components");
const stylesPath = path.join(root, "src", "styles", "globals.css");
const indexPath = path.join(root, "src", "pages", "index.tsx");

// ---------------------------------------------------------------------------
// 1. 60FPS GPU-KEYFRAMES FÜR PERMANENTE EIGENBEWEGUNG IN src/styles/globals.css
// ---------------------------------------------------------------------------
if (fs.existsSync(stylesPath)) {
  let css = fs.readFileSync(stylesPath, "utf8");

  const livingKeyframes = `
/* === LIVING 3D PENTHOUSE & CONTINUOUS CHAMPAGNE MOTION === */
@keyframes iwsnPenthouseBreathe {
  0% {
    transform: translate3d(0px, 0px, 0px) scale(1) rotateX(0deg) rotateY(0deg);
  }
  33% {
    transform: translate3d(-14px, -18px, 18px) scale(1.035) rotateX(1.8deg) rotateY(-2.2deg);
  }
  66% {
    transform: translate3d(14px, -9px, 10px) scale(1.02) rotateX(-1.4deg) rotateY(2.2deg);
  }
  100% {
    transform: translate3d(0px, 0px, 0px) scale(1) rotateX(0deg) rotateY(0deg);
  }
}

@keyframes iwsnSpotlightPulse {
  0%, 100% {
    opacity: 0.55;
    transform: scale(1) translate3d(0px, 0px, 0px);
  }
  50% {
    opacity: 0.82;
    transform: scale(1.12) translate3d(22px, -16px, 0px);
  }
}

@keyframes iwsnStencilFloat {
  0%, 100% {
    transform: translate3d(0px, 0px, 0px) rotate(-1.5deg) scale(1);
    opacity: 0.16;
  }
  50% {
    transform: translate3d(-16px, -22px, 24px) rotate(2deg) scale(1.05);
    opacity: 0.24;
  }
}

.iwsn-living-arch {
  animation: iwsnPenthouseBreathe 18s ease-in-out infinite;
  will-change: transform;
}

.iwsn-living-spotlight {
  animation: iwsnSpotlightPulse 11s ease-in-out infinite;
  will-change: transform, opacity;
}

.iwsn-living-stencil {
  animation: iwsnStencilFloat 14s ease-in-out infinite;
  will-change: transform, opacity;
}
`;

  if (!css.includes("iwsnPenthouseBreathe")) {
    fs.writeFileSync(stylesPath, css + "\n" + livingKeyframes, "utf8");
    console.log("OK: 1. Kontinuierliche 3D-Keyframes in src/styles/globals.css gespeichert!");
  }
}

// ---------------------------------------------------------------------------
// 2. SELBST-ANIMIERTE + SCROLL-BESCHLEUNIGTE VelvetBackdrop.tsx KOMPONENTE
//    Läuft kontinuierlich mit 60fps (auch im Stillstand!) und bewegt sich
//    beim Scrollen oder Maus-Bewegen noch schneller/tiefer im 3D-Raum!
// ---------------------------------------------------------------------------
const backdropPath = path.join(compDir, "VelvetBackdrop.tsx");
const livingBackdropCode = `import React, { useEffect, useRef, useState } from "react";

interface BubbleSpec {
  id: number;
  left: number;
  initialY: number;
  size: number;
  idleSpeed: number;
  scrollMultiplier: number;
  swayAmp: number;
  swayFreq: number;
  blur: number;
  opacity: number;
  depth: number;
}

const CHAMPAGNE_BOKEH: BubbleSpec[] = [
  { id: 1, left: 6, initialY: 120, size: 105, idleSpeed: 22, scrollMultiplier: 0.45, swayAmp: 18, swayFreq: 0.7, blur: 14, opacity: 0.34, depth: 1.4 },
  { id: 2, left: 14, initialY: 420, size: 20, idleSpeed: 46, scrollMultiplier: 0.85, swayAmp: 12, swayFreq: 1.3, blur: 1, opacity: 0.72, depth: 2.2 },
  { id: 3, left: 24, initialY: 260, size: 46, idleSpeed: 34, scrollMultiplier: 0.62, swayAmp: 15, swayFreq: 0.9, blur: 4, opacity: 0.48, depth: 1.7 },
  { id: 4, left: 35, initialY: 680, size: 16, idleSpeed: 54, scrollMultiplier: 0.95, swayAmp: 10, swayFreq: 1.5, blur: 0, opacity: 0.78, depth: 2.5 },
  { id: 5, left: 46, initialY: 190, size: 135, idleSpeed: 18, scrollMultiplier: 0.32, swayAmp: 24, swayFreq: 0.5, blur: 22, opacity: 0.28, depth: 1.0 },
  { id: 6, left: 57, initialY: 540, size: 28, idleSpeed: 42, scrollMultiplier: 0.76, swayAmp: 14, swayFreq: 1.1, blur: 2, opacity: 0.64, depth: 2.0 },
  { id: 7, left: 66, initialY: 310, size: 64, idleSpeed: 28, scrollMultiplier: 0.54, swayAmp: 18, swayFreq: 0.8, blur: 8, opacity: 0.40, depth: 1.5 },
  { id: 8, left: 76, initialY: 140, size: 82, idleSpeed: 25, scrollMultiplier: 0.48, swayAmp: 20, swayFreq: 0.6, blur: 12, opacity: 0.36, depth: 1.3 },
  { id: 9, left: 84, initialY: 490, size: 24, idleSpeed: 48, scrollMultiplier: 0.88, swayAmp: 12, swayFreq: 1.4, blur: 1, opacity: 0.70, depth: 2.3 },
  { id: 10, left: 92, initialY: 240, size: 96, idleSpeed: 21, scrollMultiplier: 0.40, swayAmp: 16, swayFreq: 0.7, blur: 14, opacity: 0.32, depth: 1.2 },
  { id: 11, left: 11, initialY: 860, size: 52, idleSpeed: 32, scrollMultiplier: 0.65, swayAmp: 16, swayFreq: 1.0, blur: 5, opacity: 0.46, depth: 1.6 },
  { id: 12, left: 42, initialY: 940, size: 22, idleSpeed: 50, scrollMultiplier: 0.90, swayAmp: 11, swayFreq: 1.3, blur: 1, opacity: 0.68, depth: 2.2 },
  { id: 13, left: 62, initialY: 880, size: 78, idleSpeed: 26, scrollMultiplier: 0.52, swayAmp: 19, swayFreq: 0.75, blur: 10, opacity: 0.38, depth: 1.4 },
  { id: 14, left: 88, initialY: 820, size: 30, idleSpeed: 44, scrollMultiplier: 0.80, swayAmp: 13, swayFreq: 1.2, blur: 2, opacity: 0.62, depth: 2.0 },
  { id: 15, left: 29, initialY: 1090, size: 38, idleSpeed: 38, scrollMultiplier: 0.70, swayAmp: 14, swayFreq: 1.1, blur: 3, opacity: 0.54, depth: 1.8 },
  { id: 16, left: 73, initialY: 1060, size: 18, idleSpeed: 56, scrollMultiplier: 0.96, swayAmp: 9, swayFreq: 1.6, blur: 0, opacity: 0.76, depth: 2.4 },
];

export function VelvetBackdrop() {
  const [isMobile, setIsMobile] = useState(false);
  const farLayerRef = useRef<HTMLDivElement>(null);
  const archLayerRef = useRef<HTMLDivElement>(null);
  const bubbleRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    let rafId = 0;
    let currentScroll = window.scrollY || 0;
    let targetScroll = currentScroll;
    let ptrX = 0;
    let ptrY = 0;
    let targetPtrX = 0;
    let targetPtrY = 0;
    const startTime = performance.now();

    const checkViewport = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkViewport();

    const onScroll = () => {
      targetScroll = window.scrollY || 0;
    };

    const onMouseMove = (e: MouseEvent) => {
      targetPtrX = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      targetPtrY = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
    };

    window.addEventListener("resize", checkViewport, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    const animate = (now: number) => {
      const elapsedSec = (now - startTime) / 1000;

      // Sanfte Interpolation (Butterweiches Nachgleiten beim Scrollen & Bewegen)
      currentScroll += (targetScroll - currentScroll) * 0.12;
      ptrX += (targetPtrX - ptrX) * 0.08;
      ptrY += (targetPtrY - ptrY) * 0.08;

      // Permanente 3D-Eigenbewegung (Idle Camera Drift), auch wenn niemand scrollt!
      const idleDriftX = Math.sin(elapsedSec * 0.55) * 18;
      const idleDriftY = Math.cos(elapsedSec * 0.42) * 14;
      const idleTiltX = Math.cos(elapsedSec * 0.48) * 2.4;
      const idleTiltY = Math.sin(elapsedSec * 0.52) * 3.2;

      if (farLayerRef.current) {
        const fy = -((currentScroll * 0.14) % 900) + idleDriftY * 0.7 + ptrY * -12;
        const fx = idleDriftX * 0.8 + ptrX * -16;
        farLayerRef.current.style.transform = \`translate3d(\${fx.toFixed(1)}px, \${fy.toFixed(1)}px, -90px) scale(1.14)\`;
      }

      if (archLayerRef.current) {
        const ay = -((currentScroll * 0.28) % 950) + idleDriftY + ptrY * -20;
        const ax = idleDriftX + ptrX * -28;
        const rx = idleTiltX + ptrY * -5.5;
        const ry = idleTiltY + ptrX * 6.5;
        archLayerRef.current.style.transform = \`translate3d(\${ax.toFixed(1)}px, \${ay.toFixed(1)}px, 0px) rotateX(\${rx.toFixed(2)}deg) rotateY(\${ry.toFixed(2)}deg)\`;
      }

      // Jede Champagner-Perle steigt kontinuierlich von selbst auf + beschleunigt stark beim Scrollen!
      const wrapHeight = 1280;
      for (let i = 0; i < CHAMPAGNE_BOKEH.length; i++) {
        const el = bubbleRefs.current[i];
        if (!el) continue;
        const b = CHAMPAGNE_BOKEH[i];

        const totalRise = elapsedSec * b.idleSpeed + currentScroll * b.scrollMultiplier;
        const yPos = (((b.initialY - totalRise) % wrapHeight) + wrapHeight) % wrapHeight - 110;
        const swayX = Math.sin(elapsedSec * b.swayFreq + b.id) * b.swayAmp + ptrX * 22 * b.depth;

        el.style.transform = \`translate3d(\${swayX.toFixed(1)}px, \${yPos.toFixed(1)}px, 0px)\`;
      }

      rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", checkViewport);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  const visibleBubbles = isMobile ? CHAMPAGNE_BOKEH.slice(0, 10) : CHAMPAGNE_BOKEH;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{ perspective: "1100px" }}
      aria-hidden="true"
    >
      {/* ================================================================= */}
      {/* EBENE 1 (FERNE): LEUCHTENDE PENTHOUSE-LOUNGE & SKYLINE-HORIZONT    */}
      {/* ================================================================= */}
      <div ref={farLayerRef} className="absolute -inset-24 will-change-transform">
        {/* Kräftiges Champagner-Gold Penthouse-Spotlight Oben Links */}
        <div
          className="absolute top-[-4%] left-[2%] w-[680px] h-[580px] rounded-full blur-[110px] iwsn-living-spotlight"
          style={{
            background:
              "radial-gradient(circle, rgba(235, 198, 138, 0.62) 0%, rgba(182, 128, 56, 0.28) 48%, transparent 74%)",
          }}
        />
        {/* Sinnliches Velvet-Rose / Bordeaux Chandelier-Licht Rechts */}
        <div
          className="absolute top-[8%] right-[-2%] w-[640px] h-[600px] rounded-full blur-[120px] iwsn-living-spotlight"
          style={{
            animationDelay: "-4.5s",
            background:
              "radial-gradient(circle, rgba(190, 48, 92, 0.56) 0%, rgba(96, 20, 48, 0.26) 54%, transparent 76%)",
          }}
        />
        {/* Warmer Goldener Penthouse-Boden-Schein Unten Mitte */}
        <div
          className="absolute bottom-[-8%] left-[22%] w-[760px] h-[460px] rounded-full blur-[125px] iwsn-living-spotlight"
          style={{
            animationDelay: "-7s",
            background:
              "radial-gradient(circle, rgba(212, 175, 122, 0.42) 0%, rgba(140, 96, 42, 0.16) 55%, transparent 78%)",
          }}
        />

        {/* Warmer Skyline-Lichtstreifen am Horizont */}
        <div
          className="absolute top-[36%] inset-x-0 h-[260px]"
          style={{
            background:
              "radial-gradient(ellipse 75% 50% at 50% 50%, rgba(243, 227, 195, 0.26) 0%, rgba(198, 165, 116, 0.10) 58%, transparent 85%)",
          }}
        />
      </div>

      {/* ================================================================= */}
      {/* EBENE 2 (MITTE): 3D PENTHOUSE-BOGENFENSTER, KRONLEUCHTER & X      */}
      {/* Deutlich sichtbarer (opacity 0.34) + kontinuierlicher 3D-Drift!   */}
      {/* ================================================================= */}
      <div
        ref={archLayerRef}
        className="absolute inset-0 will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg
          viewBox="0 0 1600 1200"
          className="w-full h-[145vh] opacity-[0.34]"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
        >
          <defs>
            <linearGradient id="goldArchBright" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#FFF6E5" stopOpacity="0.95" />
              <stop offset="45%" stopColor="#D8B784" stopOpacity="0.58" />
              <stop offset="100%" stopColor="#C6A574" stopOpacity="0.08" />
            </linearGradient>
            <linearGradient id="terraceLine" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C6A574" stopOpacity="0.0" />
              <stop offset="25%" stopColor="#E5C99B" stopOpacity="0.55" />
              <stop offset="50%" stopColor="#FFF6E5" stopOpacity="0.85" />
              <stop offset="75%" stopColor="#E5C99B" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#C6A574" stopOpacity="0.0" />
            </linearGradient>
            <radialGradient id="chandelierGlow" cx="50%" cy="30%" r="50%">
              <stop offset="0%" stopColor="#FFFDF9" stopOpacity="0.85" />
              <stop offset="45%" stopColor="#E5C99B" stopOpacity="0.32" />
              <stop offset="100%" stopColor="#C6A574" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Penthouse Chandelier Warm Halo in the Center Arch */}
          <circle cx="800" cy="240" r="220" fill="url(#chandelierGlow)" />

          {/* 3 Große 3D-Penthouse-Panoramabögen (Doppelrahmen für echten Architektur-Look) */}
          <path d="M 110,1150 L 110,270 A 220,220 0 0,1 550,270 L 550,1150" stroke="url(#goldArchBright)" strokeWidth="2.4" />
          <path d="M 130,1150 L 130,278 A 200,200 0 0,1 530,278 L 530,1150" stroke="url(#goldArchBright)" strokeWidth="1.0" strokeDasharray="6 6" />

          <path d="M 580,1150 L 580,210 A 220,220 0 0,1 1020,210 L 1020,1150" stroke="url(#goldArchBright)" strokeWidth="3.2" />
          <path d="M 602,1150 L 602,220 A 198,198 0 0,1 998,220 L 998,1150" stroke="url(#goldArchBright)" strokeWidth="1.2" />

          <path d="M 1050,1150 L 1050,270 A 220,220 0 0,1 1490,270 L 1490,1150" stroke="url(#goldArchBright)" strokeWidth="2.4" />
          <path d="M 1070,1150 L 1070,278 A 200,200 0 0,1 1470,278 L 1470,1150" stroke="url(#goldArchBright)" strokeWidth="1.0" strokeDasharray="6 6" />

          {/* Horizontale Penthouse-Galerie-Balustraden */}
          <line x1="60" y1="490" x2="1540" y2="490" stroke="url(#terraceLine)" strokeWidth="1.6" />
          <line x1="120" y1="660" x2="1480" y2="660" stroke="url(#terraceLine)" strokeWidth="1.3" />
          <line x1="180" y1="830" x2="1420" y2="830" stroke="url(#terraceLine)" strokeWidth="1.0" />

          {/* 3D-Perspektiv-Strahlen (Decke & Marmorboden) */}
          <line x1="800" y1="-140" x2="80" y2="1150" stroke="url(#goldArchBright)" strokeWidth="1.2" />
          <line x1="800" y1="-140" x2="420" y2="1150" stroke="url(#goldArchBright)" strokeWidth="1.2" />
          <line x1="800" y1="-140" x2="800" y2="1150" stroke="url(#goldArchBright)" strokeWidth="1.4" />
          <line x1="800" y1="-140" x2="1180" y2="1150" stroke="url(#goldArchBright)" strokeWidth="1.2" />
          <line x1="800" y1="-140" x2="1520" y2="1150" stroke="url(#goldArchBright)" strokeWidth="1.2" />
        </svg>

        {/* Schwebendes 3D Stencil-X Emblem im Penthouse-Raum */}
        <svg
          viewBox="0 0 200 200"
          className="absolute top-16 right-[4%] sm:right-[7%] w-[260px] h-[260px] sm:w-[440px] sm:h-[440px] iwsn-living-stencil drop-shadow-[0_0_55px_rgba(229,201,155,0.55)]"
          fill="none"
        >
          <path d="M24 20 L92 100 L24 180 L56 180 L108 118 L108 82 L56 20 Z" fill="#FFF3D6" />
          <path d="M176 20 L108 100 L176 180 L144 180 L92 118 L92 82 L144 20 Z" fill="#C6A574" />
        </svg>
      </div>

      {/* ================================================================= */}
      {/* EBENE 3 (VORDERGRUND-BOKEH): PERMANENT AUFSTEIGENDE CHAMPAGNER-   */}
      {/* PERLEN (Bewegen sich im Stillstand UND beschleunigen beim Scroll) */}
      {/* ================================================================= */}
      <div className="absolute inset-0">
        {visibleBubbles.map((b, idx) => (
          <div
            key={b.id}
            ref={(el) => {
              bubbleRefs.current[idx] = el;
            }}
            className="absolute rounded-full will-change-transform"
            style={{
              left: \`\${b.left}%\`,
              top: 0,
              width: \`\${b.size}px\`,
              height: \`\${b.size}px\`,
              opacity: b.opacity,
              filter: b.blur > 0 ? \`blur(\${b.blur}px)\` : undefined,
              background:
                "radial-gradient(circle at 32% 32%, #FFFFFF 0%, #FFF3D6 35%, #D8B784 68%, rgba(198,165,116,0) 100%)",
              boxShadow: "0 0 28px rgba(243, 227, 195, 0.55)",
            }}
          />
        ))}
      </div>

      {/* ================================================================= */}
      {/* EBENE 4: SANFTE KONTRAST-VIGNETTE (Lässt das Penthouse-Licht       */}
      {/* klar durchscheinen, schützt aber die weisse Schrift zu 100%!)     */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 24%, rgba(11, 13, 19, 0.04) 0%, rgba(11, 13, 19, 0.42) 68%, rgba(9, 11, 16, 0.78) 100%)",
        }}
      />
    </div>
  );
}

export default VelvetBackdrop;
`;

fs.writeFileSync(backdropPath, livingBackdropCode, "utf8");
console.log("OK: 2. Selbst-animierte 3D-Penthouse & Champagner-Kulisse in VelvetBackdrop.tsx aktiviert!");

// ---------------------------------------------------------------------------
// 3. MACHE DIE PROFILKARTEN & DEN HERO-BEREICH LEICHT GLAS-TRANSPARENT,
//    DAMIT MAN DIE VORBEIZIEHENDEN CHAMPAGNER-LICHTER DAHINTER SPÜRT!
// ---------------------------------------------------------------------------
if (fs.existsSync(indexPath)) {
  let idxCode = fs.readFileSync(indexPath, "utf8");

  // Hero-Banner etwas durchscheinender machen, damit die 3D-Penthouse-Bögen dahinter sichtbar schimmern
  idxCode = idxCode.replace(
    /from-\[#1B1F2B\]\/90 via-\[#151822\]\/90 to-\[#231722\]\/85/g,
    "from-[#1B1F2B]/75 via-[#151822]/75 to-[#261623]/75"
  );

  // Karten mit edlem Semi-Glas-Look versehen
  idxCode = idxCode.replace(
    /from-\[#1E222D\]\/95 to-\[#151821\]\/95/g,
    "from-[#1E222D]/85 to-[#141720]/88"
  );

  fs.writeFileSync(indexPath, idxCode, "utf8");
  console.log("OK: 3. Glas-Transparenz auf Hero & Karten feinabgestimmt (3D-Hintergrund schimmert edel durch)!");
}