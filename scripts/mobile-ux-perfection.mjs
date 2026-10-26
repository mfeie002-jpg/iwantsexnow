import fs from "fs";
import path from "path";

const root = process.cwd();
const compDir = path.join(root, "src", "components");
const pagesDir = path.join(root, "src", "pages");
const stylesPath = path.join(root, "src", "styles", "globals.css");

// ---------------------------------------------------------------------------
// 1. MOBILE CSS HELPERS IN src/styles/globals.css (Safe-Area, No-Scrollbar,
//    iOS 16px Input Zoom Prevention & Touch-Action)
// ---------------------------------------------------------------------------
if (fs.existsSync(stylesPath)) {
  let css = fs.readFileSync(stylesPath, "utf8");
  const mobileCss = `
/* === MOBILE UX, SAFE-AREA & TOUCH PERFECTION === */
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

@media (max-width: 767px) {
  input[type="text"],
  input[type="search"],
  input[type="email"],
  input[type="password"],
  input[type="tel"],
  select,
  textarea {
    font-size: 16px !important; /* Verhindert iOS Safari Auto-Zoom beim Antippen */
  }
}

.pb-safe-bottom {
  padding-bottom: calc(5.25rem + env(safe-area-inset-bottom, 0px));
}
`;
  if (!css.includes("MOBILE UX, SAFE-AREA")) {
    fs.writeFileSync(stylesPath, css + "\n" + mobileCss, "utf8");
    console.log("OK: 1. Mobile Safe-Area, No-Scrollbar & iOS-Zoom-Schutz in globals.css ergänzt!");
  }
}

// ---------------------------------------------------------------------------
// 2. 60FPS MOBILE-OPTIMIERUNG IN VelvetBackdrop.tsx
//    Erkennt kleine Touch-Screens (<768px), reduziert dort die Bokeh-Anzahl
//    und deaktiviert unnötige Maus-Tilt-Berechnungen für 100% flüssiges Scrollen
// ---------------------------------------------------------------------------
const backdropPath = path.join(compDir, "VelvetBackdrop.tsx");
if (fs.existsSync(backdropPath)) {
  let bCode = fs.readFileSync(backdropPath, "utf8");
  if (!bCode.includes("const [isMobile, setIsMobile]")) {
    bCode = bCode.replace(
      "const [pointer, setPointer] = useState({ x: 0, y: 0 });",
      "const [pointer, setPointer] = useState({ x: 0, y: 0 });\n  const [isMobile, setIsMobile] = useState(false);"
    );
    bCode = bCode.replace(
      'window.addEventListener("mousemove", onMouseMove, { passive: true });',
      `const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    if (window.innerWidth >= 768) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }`
    );
    bCode = bCode.replace(
      "{CHAMPAGNE_BOKEH.map((b) => {",
      "{(isMobile ? CHAMPAGNE_BOKEH.slice(0, 6) : CHAMPAGNE_BOKEH).map((b) => {"
    );
    fs.writeFileSync(backdropPath, bCode, "utf8");
    console.log("OK: 2. VelvetBackdrop.tsx mit 60fps Mobile-GPU-Schonmodus ausgestattet!");
  }
}

// ---------------------------------------------------------------------------
// 3. MOBILE BOTTOM NAVIGATION DOCK IN LuxuryHeader.tsx INTEGRIEREN
//    Damit auf JEDER Seite unten auf dem Smartphone eine edle Schwarz-Gold
//    Daumen-Leiste (Verzeichnis | Vergleich | Portalberichte | Cockpit) sitzt!
// ---------------------------------------------------------------------------
const headerPath = path.join(compDir, "LuxuryHeader.tsx");
if (fs.existsSync(headerPath)) {
  let hCode = fs.readFileSync(headerPath, "utf8");

  const mobileBottomBar = `
      {/* Fixed Mobile Thumb Navigation Bar (Only < md) */}
      <nav
        aria-label="Mobile Schnellnavigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-[#0E1017]/95 backdrop-blur-xl border-t border-[#C6A574]/30 px-2 pt-1.5 pb-[calc(0.4rem+env(safe-area-inset-bottom,0px))] shadow-[0_-10px_30px_rgba(0,0,0,0.75)]"
      >
        <div className="grid grid-cols-4 gap-1 max-w-md mx-auto">
          <Link
            href="/"
            className="min-h-[44px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-[#F3E3C3] hover:bg-white/5 active:scale-95 transition"
          >
            <span className="text-[#C6A574] text-xs">✦</span>
            <span>Profile</span>
          </Link>
          <Link
            href="/compare-escorts"
            className="min-h-[44px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-gray-300 hover:text-white hover:bg-white/5 active:scale-95 transition"
          >
            <span className="text-[#C6A574] text-xs">⇄</span>
            <span>Vergleich</span>
          </Link>
          <Link
            href="/reviews"
            className="min-h-[44px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-gray-300 hover:text-white hover:bg-white/5 active:scale-95 transition"
          >
            <span className="text-[#C6A574] text-xs">◎</span>
            <span>Portale</span>
          </Link>
          <Link
            href="/creator-dashboard"
            className="min-h-[44px] rounded-xl flex flex-col items-center justify-center gap-0.5 text-[10px] font-bold text-[#13161C] bg-[#C6A574] active:scale-95 transition shadow-md"
          >
            <span className="text-xs font-extrabold">●</span>
            <span>Cockpit</span>
          </Link>
        </div>
      </nav>
`;

  if (!hCode.includes('aria-label="Mobile Schnellnavigation"')) {
    const lastHeaderClose = hCode.lastIndexOf("</header>");
    if (lastHeaderClose !== -1) {
      hCode = hCode.replace("<header", "<>\n    <header");
      const newCloseIdx = hCode.lastIndexOf("</header>");
      hCode =
        hCode.slice(0, newCloseIdx + "</header>".length) +
        "\n" +
        mobileBottomBar +
        "\n    </>" +
        hCode.slice(newCloseIdx + "</header>".length);
      fs.writeFileSync(headerPath, hCode, "utf8");
      console.log("OK: 3. Feste Mobile-Daumen-Navigationsleiste (44px Touch-Targets) in LuxuryHeader.tsx aktiviert!");
    }
  }
}

// ---------------------------------------------------------------------------
// 4. STARTSEITE (src/pages/index.tsx) FÜR MOBILE KOMPAKTER & WISCHBAR MACHEN
// ---------------------------------------------------------------------------
const indexPath = path.join(pagesDir, "index.tsx");
if (fs.existsSync(indexPath)) {
  let idxCode = fs.readFileSync(indexPath, "utf8");

  // Mache die Städte-Schnellwahl im Hero-Banner auf Mobile horizontal wischbar (kein mehrzeiliger Umbruch)
  idxCode = idxCode.replace(
    '<div className="flex flex-wrap items-center gap-1.5 text-[11px]">',
    '<div className="flex items-center gap-1.5 text-[11px] overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0 sm:flex-wrap">'
  );

  // Sorge für kompaktere Innenabstände im Hero auf schmalen Handys (p-4 sm:p-8 statt p-6 sm:p-8)
  idxCode = idxCode.replace(
    'p-6 sm:p-8 rounded-3xl bg-gradient-to-br',
    'p-4 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br'
  );

  // Sorge dafür, dass die Hauptüberschrift auf schmalen Handys nicht zu riesig umbricht
  idxCode = idxCode.replace(
    'text-3xl sm:text-5xl font-serif font-bold tracking-tight iwsn-champagne-text',
    'text-2xl sm:text-5xl font-serif font-bold tracking-tight iwsn-champagne-text leading-tight'
  );

  fs.writeFileSync(indexPath, idxCode, "utf8");
  console.log("OK: 4. Startseite (index.tsx) für Smartphone-Screens (kompakter Hero + Swipe-Pills) optimiert!");
}