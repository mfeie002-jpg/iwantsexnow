import { profilePhotoPlaceholder } from "@/components/night/profile-image-model";

const BLOCKED = /(?:unsplash\.|pexels\.|pixabay\.|bg_blur|6navi|sexnavi|watermark|placeholder|no-image|default-avatar)/i;

/** Keep a real source photo. Stock portraits of unknown people are never a substitute. */
export function resolveCleanPortrait(rawUrl: unknown, _indexSeed = 0): string {
  const url = String(rawUrl || "").trim();
  if (!url.startsWith("http") || BLOCKED.test(url)) return profilePhotoPlaceholder("Profil");
  return url;
}
