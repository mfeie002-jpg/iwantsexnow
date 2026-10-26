export function resolveCleanPortrait(rawUrl: any, _indexSeed = 0): string {
  const url = String(rawUrl || "").trim();
  if (!url || !url.startsWith("http")) return "/placeholder-profile.svg";

  const low = url.toLowerCase();
  if (
    low.includes("images.unsplash.com") ||
    low.includes("6navi") ||
    low.includes("sexnavi") ||
    low.includes("watermark") ||
    low.includes("placeholder") ||
    low.includes("no-image") ||
    low.includes("default-avatar") ||
    low.includes("example.com")
  ) {
    return "/placeholder-profile.svg";
  }
  return url;
}
