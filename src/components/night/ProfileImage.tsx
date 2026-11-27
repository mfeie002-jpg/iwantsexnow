import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ImageOff } from "lucide-react";
import { nextProfileImage, profileImageCandidates } from "./profile-image-model";

type Props = { photos: readonly string[]; alt: string; className?: string; eager?: boolean; compact?: boolean };

export function ProfileImage({ photos, alt, className = "", eager = false, compact = false }: Props) {
  const candidates = useMemo(() => profileImageCandidates(photos), [photos]);
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const src = nextProfileImage(candidates, failed);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const markFailed = useCallback(() => {
    if (!src) return;
    setFailed(previous => previous.has(src) ? previous : new Set([...previous, src]));
  }, [src]);
  useEffect(() => {
    // SSR images can fail before React attaches onError. Inspect the existing
    // DOM state too; a pending lazy image has complete=false and must keep loading.
    const image = imageRef.current;
    if (src && image?.complete && image.naturalWidth === 0) markFailed();
  }, [src, markFailed]);
  if (!src) {
    return <div className={`night-image-unavailable ${compact ? "compact" : ""} ${className}`} role="img" aria-label="Profilfoto derzeit nicht verfügbar">
      <ImageOff size={compact ? 22 : 34} aria-hidden="true" />
      {!compact && <span>Profilfoto derzeit<br />nicht verfügbar</span>}
    </div>;
  }
  return <img key={src} ref={imageRef} src={src} alt={alt} className={`night-image ${className}`} loading={eager ? "eager" : "lazy"} decoding="async" referrerPolicy="no-referrer"
    onError={markFailed} />;
}

export default ProfileImage;
