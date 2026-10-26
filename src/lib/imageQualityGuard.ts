export function resolveCleanPortrait(rawUrl: unknown): string {
  try { const url = new URL(String(rawUrl));
    return url.protocol === "https:" && !/unsplash|6navi|sexnavi|watermark|placeholder|default-avatar/i.test(url.href)
      ? url.href : "/profile-placeholder.svg";
  } catch { return "/profile-placeholder.svg"; }
}
