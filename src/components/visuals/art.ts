// Shared helpers for the illustrated poster system (pure, deterministic — SSR safe).

export const PAL = {
  nacht: "#1E2247",
  tiefsee: "#3A3F7A",
  fels: "#2B2F6B",
  linie: "#C9C9DB",
  gletscher: "#FFFFFF",
  nebel: "#9C9DBA",
  glueh: "#D92B52",
  rose: "#FFD3DC",
  bernstein: "#FFD34D",
  lago: "#5EC59B",
  papier: "#FBFAF8",
  tinte: "#1E2247",
};

function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Angular alpine ridge line, closed down to the bottom edge. */
export function ridgePath(
  seed: number,
  width: number,
  height: number,
  baseY: number,
  amp: number,
  steps = 36,
): string {
  const r = mulberry32(seed);
  const p1 = r() * 6;
  const p2 = r() * 6;
  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const x = (width / steps) * i;
    const peaks = Math.pow(Math.abs(Math.sin((x / width) * (4.2 + r() * 0.8) + p1)), 0.85);
    const mid = Math.abs(Math.sin((x / width) * 11 + p2));
    const y = baseY - amp * (0.52 * peaks + 0.28 * mid + 0.2 * r());
    pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }
  return `M0,${height} L${pts.join(" L")} L${width},${height} Z`;
}

/** Deterministic scatter of small circles (stars / bokeh / window lights). */
export function scatter(seed: number, n: number, w: number, h: number, rMin: number, rMax: number) {
  const r = mulberry32(seed);
  return Array.from({ length: n }, () => ({
    x: r() * w,
    y: r() * h,
    r: rMin + r() * (rMax - rMin),
    o: 0.25 + r() * 0.75,
  }));
}

export function uid(raw: string) {
  return raw.replace(/[^a-zA-Z0-9]/g, "");
}
