import React, { useEffect, useState } from "react";

interface BubbleSpec {
  id: number;
  left: string;
  top: number;
  size: number;
  speed: number;
  blur: number;
  opacity: number;
  depth: number;
}

const CHAMPAGNE_BOKEH: BubbleSpec[] = [
  { id: 1, left: "7%", top: 140, size: 95, speed: 0.38, blur: 18, opacity: 0.22, depth: 1.4 },
  { id: 2, left: "16%", top: 420, size: 22, speed: 0.62, blur: 2, opacity: 0.48, depth: 2.1 },
  { id: 3, left: "28%", top: 260, size: 44, speed: 0.48, blur: 6, opacity: 0.30, depth: 1.7 },
  { id: 4, left: "46%", top: 180, size: 130, speed: 0.24, blur: 28, opacity: 0.16, depth: 0.9 },
  { id: 5, left: "64%", top: 340, size: 28, speed: 0.58, blur: 3, opacity: 0.42, depth: 2.0 },
  { id: 6, left: "78%", top: 130, size: 76, speed: 0.34, blur: 14, opacity: 0.25, depth: 1.3 },
  { id: 7, left: "88%", top: 480, size: 34, speed: 0.66, blur: 4, opacity: 0.40, depth: 2.3 },
  { id: 8, left: "92%", top: 220, size: 110, speed: 0.29, blur: 22, opacity: 0.19, depth: 1.1 },
  { id: 9, left: "12%", top: 780, size: 54, speed: 0.52, blur: 8, opacity: 0.28, depth: 1.6 },
  { id: 10, left: "36%", top: 690, size: 18, speed: 0.72, blur: 1, opacity: 0.52, depth: 2.5 },
  { id: 11, left: "58%", top: 820, size: 88, speed: 0.36, blur: 16, opacity: 0.22, depth: 1.3 },
  { id: 12, left: "83%", top: 760, size: 26, speed: 0.64, blur: 2, opacity: 0.45, depth: 2.2 },
  { id: 13, left: "22%", top: 1120, size: 70, speed: 0.42, blur: 12, opacity: 0.24, depth: 1.5 },
  { id: 14, left: "72%", top: 1080, size: 32, speed: 0.59, blur: 3, opacity: 0.38, depth: 1.9 },
];

export function VelvetBackdrop() {
  const [scrollY, setScrollY] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    let rafId = 0;

    const onScroll = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY || 0);
      });
    };

    const onMouseMove = (e: MouseEvent) => {
      const nx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      const ny = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      setPointer({ x: nx, y: ny });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile, { passive: true });
    if (window.innerWidth >= 768) {
      window.addEventListener("mousemove", onMouseMove, { passive: true });
    }
    onScroll();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Sanfte 3D-Verschiebungen je nach Tiefen-Ebene
  const farSkylineY = -(scrollY * 0.11);
  const midArchY = -(scrollY * 0.22);
  const nearGlowY = -(scrollY * 0.34);

  const tiltX = pointer.y * -4.5;
  const tiltY = pointer.x * 5.5;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden select-none"
      style={{ perspective: "1200px" }}
      aria-hidden="true"
    >
      {/* ================================================================= */}
      {/* EBENE 1 (FERNE): PENTHOUSE NIGHT SKYLINE & WARM LOUNGE AMBIENCE    */}
      {/* ================================================================= */}
      <div
        className="absolute -inset-16 will-change-transform transition-transform duration-150 ease-out"
        style={{
          transform: `translate3d(${pointer.x * -14}px, ${farSkylineY + pointer.y * -10}px, -120px) scale(1.12)`,
        }}
      >
        {/* Warm Golden Penthouse Lounge Glow Left */}
        <div
          className="absolute top-[-8%] left-[4%] w-[640px] h-[520px] rounded-full opacity-40 blur-[130px]"
          style={{
            background: "radial-gradient(circle, rgba(218,178,118,0.55) 0%, rgba(142,88,36,0.22) 52%, transparent 75%)",
          }}
        />
        {/* Sensual Velvet-Wine Chandelier Glow Right */}
        <div
          className="absolute top-[6%] right-[2%] w-[580px] h-[540px] rounded-full opacity-35 blur-[140px]"
          style={{
            background: "radial-gradient(circle, rgba(164,42,82,0.5) 0%, rgba(74,18,40,0.22) 58%, transparent 78%)",
          }}
        />

        {/* Distant Penthouse Horizon City Lights (Bokeh Skyline Band) */}
        <div
          className="absolute top-[34%] inset-x-0 h-[240px] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse 65% 50% at 50% 50%, rgba(229, 201, 155, 0.20) 0%, rgba(198, 165, 116, 0.06) 55%, transparent 80%)",
          }}
        />
      </div>

      {/* ================================================================= */}
      {/* EBENE 2 (MITTE): 3D PENTHOUSE ARCHITEKTUR-FENSTER & STENCIL-X     */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0 will-change-transform transition-transform duration-150 ease-out"
        style={{
          transform: `translate3d(${pointer.x * -24}px, ${midArchY + pointer.y * -16}px, 0px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`,
          transformStyle: "preserve-3d",
        }}
      >
        {/* Architectural Penthouse Floor-to-Ceiling Window Mullions & Arches */}
        <svg
          viewBox="0 0 1600 1000"
          className="w-full h-[125vh] opacity-[0.14]"
          preserveAspectRatio="xMidYMin slice"
          fill="none"
        >
          <defs>
            <linearGradient id="goldArch" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#F3E3C3" stopOpacity="0.65" />
              <stop offset="50%" stopColor="#C6A574" stopOpacity="0.28" />
              <stop offset="100%" stopColor="#C6A574" stopOpacity="0.0" />
            </linearGradient>
            <linearGradient id="floorGrid" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#C6A574" stopOpacity="0" />
              <stop offset="50%" stopColor="#C6A574" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#C6A574" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* 3 Tall Penthouse Window Arches in Perspective */}
          <path d="M 140,950 L 140,260 A 210,210 0 0,1 560,260 L 560,950" stroke="url(#goldArch)" strokeWidth="1.6" />
          <path d="M 590,950 L 590,220 A 210,210 0 0,1 1010,220 L 1010,950" stroke="url(#goldArch)" strokeWidth="2.2" />
          <path d="M 1040,950 L 1040,260 A 210,210 0 0,1 1460,260 L 1460,950" stroke="url(#goldArch)" strokeWidth="1.6" />

          {/* Subtle Horizontal Penthouse Terrace Balustrade Lines */}
          <line x1="80" y1="540" x2="1520" y2="540" stroke="url(#floorGrid)" strokeWidth="1" />
          <line x1="160" y1="680" x2="1440" y2="680" stroke="url(#floorGrid)" strokeWidth="0.8" />

          {/* 3D Perspective Ceiling & Terrace Rays */}
          <line x1="800" y1="-120" x2="120" y2="980" stroke="url(#goldArch)" strokeWidth="0.8" />
          <line x1="800" y1="-120" x2="460" y2="980" stroke="url(#goldArch)" strokeWidth="0.8" />
          <line x1="800" y1="-120" x2="1140" y2="980" stroke="url(#goldArch)" strokeWidth="0.8" />
          <line x1="800" y1="-120" x2="1480" y2="980" stroke="url(#goldArch)" strokeWidth="0.8" />
        </svg>

        {/* Floating 3D Golden Stencil-X Emblem in the Penthouse Center-Right */}
        <svg
          viewBox="0 0 200 200"
          className="hidden md:block absolute top-20 right-[7%] w-[420px] h-[420px] opacity-[0.075] drop-shadow-[0_0_40px_rgba(198,165,116,0.4)]"
          fill="none"
        >
          <path d="M24 20 L92 100 L24 180 L56 180 L108 118 L108 82 L56 20 Z" fill="#E5C99B" />
          <path d="M176 20 L108 100 L176 180 L144 180 L92 118 L92 82 L144 20 Z" fill="#C6A574" />
        </svg>
      </div>

      {/* ================================================================= */}
      {/* EBENE 3 (NAH): SCHWEBENDE 3D CHAMPAGNER-PERLEN & GOLDEN BOKEH     */}
      {/* Gleiten beim Scrollen unterschiedlich schnell nach oben!          */}
      {/* ================================================================= */}
      <div className="absolute inset-0">
        {(isMobile ? CHAMPAGNE_BOKEH.slice(0, 6) : CHAMPAGNE_BOKEH).map((b) => {
          const yOffset = ((b.top - scrollY * b.speed) % 1250 + 1250) % 1250 - 120;
          const xOffset = pointer.x * 18 * b.depth;
          return (
            <div
              key={b.id}
              className="absolute rounded-full will-change-transform"
              style={{
                left: b.left,
                top: 0,
                width: `${b.size}px`,
                height: `${b.size}px`,
                opacity: b.opacity,
                filter: `blur(${b.blur}px)`,
                transform: `translate3d(${xOffset}px, ${yOffset}px, 0px)`,
                background:
                  "radial-gradient(circle at 35% 35%, #FFFDF9 0%, #F3E3C3 32%, #C6A574 68%, rgba(198,165,116,0) 100%)",
                boxShadow: "0 0 24px rgba(229, 201, 155, 0.35)",
              }}
            />
          );
        })}
      </div>

      {/* ================================================================= */}
      {/* EBENE 4: SAMT-VIGNETTE FÜR PERFEKTE LESBARKEIT IM VORDERGRUND      */}
      {/* ================================================================= */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 28%, rgba(11, 13, 19, 0.15) 0%, rgba(11, 13, 19, 0.68) 72%, rgba(9, 11, 16, 0.92) 100%)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-44"
        style={{
          background: `linear-gradient(to top, #0B0D13 10%, transparent 100%)`,
          transform: `translate3d(0, ${nearGlowY * 0.05}px, 0)`,
        }}
      />
    </div>
  );
}

export default VelvetBackdrop;
