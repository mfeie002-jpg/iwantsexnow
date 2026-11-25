import React from "react";
import Link from "next/link";
import { chf, placePhoto, whatsAppHref, type ListingProfile } from "@/lib/listing";

export function ListingCard({
  profile,
  eager = false,
}: {
  profile: ListingProfile;
  eager?: boolean;
}) {
  const href = "/profile/" + encodeURIComponent(profile.id);
  const wa = whatsAppHref(profile.phone, profile.name, profile.city);
  const initial = profile.name.replace(/[^\p{L}\p{N}]/gu, "").slice(0, 1).toUpperCase() || "·";
  const [photoOk, setPhotoOk] = React.useState(Boolean(profile.photo));
  const photoRef = React.useRef<HTMLImageElement>(null);

  React.useEffect(() => {
    const img = photoRef.current;
    if (img && img.complete && img.naturalWidth === 0) setPhotoOk(false);
  }, [profile.photo]);

  return (
    <article className="listing-card">
      <Link href={href} className="listing-photo" aria-label={"Profil von " + profile.name}>
        {profile.photo && photoOk ? (
          <img
            ref={photoRef}
            src={profile.photo}
            alt=""
            referrerPolicy="no-referrer"
            loading={eager ? "eager" : "lazy"}
            decoding="async"
            onError={() => setPhotoOk(false)}
          />
        ) : (
          <span
            className="listing-fallback"
            style={{ backgroundImage: "url(" + placePhoto(profile.canton) + ")" }}
            aria-hidden="true"
          >
            <span>{profile.city}</span>
            <em>{initial}</em>
          </span>
        )}
      </Link>
      <div className="listing-copy">
        <p className="listing-place">
          {profile.city}
          <span> {profile.canton}</span>
          {profile.available ? <span className="listing-live"> · frei, 4 Std.</span> : null}
        </p>
        <h3>
          <Link href={href}>{profile.name}</Link>
        </h3>
        <p className="listing-prices">
          <span>
            30 Min. <strong>{chf(profile.rate30)}</strong>
          </span>
          <span>
            60 Min. <strong>{chf(profile.rate60)}</strong>
          </span>
        </p>
        <p className="listing-actions">
          {wa ? (
            <a href={wa} target="_blank" rel="noopener noreferrer">
              Schreiben
            </a>
          ) : (
            <Link href={href}>Kontakt im Profil</Link>
          )}
          <Link href={href}>Profil</Link>
        </p>
      </div>
    </article>
  );
}

export function ListingGrid({
  profiles,
  eagerCount = 4,
}: {
  profiles: ListingProfile[];
  eagerCount?: number;
}) {
  if (profiles.length === 0) {
    return (
      <p className="listing-empty">
        Keine Einträge für diese Auswahl. Filter lockern oder eine andere Stadt versuchen.
      </p>
    );
  }
  return (
    <div className="listing-grid">
      {profiles.map((profile, index) => (
        <ListingCard key={profile.id} profile={profile} eager={index < eagerCount} />
      ))}
    </div>
  );
}
