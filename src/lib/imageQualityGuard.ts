const CLEAN_PORTRAITS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=85",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=85",
];

export function resolveCleanPortrait(rawUrl: any, indexSeed = 0): string {
  const url = String(rawUrl || "").trim();
  const fallback = CLEAN_PORTRAITS[Math.abs(indexSeed) % CLEAN_PORTRAITS.length];
  if (!url || !url.startsWith("http")) return fallback;

  const low = url.toLowerCase();
  if (
    low.includes("6navi") ||
    low.includes("sexnavi") ||
    low.includes("watermark") ||
    low.includes("placeholder") ||
    low.includes("no-image") ||
    low.includes("default-avatar")
  ) {
    return fallback;
  }
  return url;
}
