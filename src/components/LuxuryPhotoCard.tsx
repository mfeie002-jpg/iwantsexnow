import React from "react";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Scale } from "lucide-react";
import { useCatalogue } from "@/components/night/CatalogueContext";
import { ProfileImage } from "@/components/night/ProfileImage";
import { NEUTRAL_PROFILE_IMAGE, profileImageSource, profilePhotoPlaceholder, profilePhotoSrc } from "@/components/night/profile-image-model";
import { hourlyPriceLine } from "@/lib/honesty";
import { cleanSwissPhone, getProfileCity, getProfileId, getProfileName, getProfilePhotos, getProfileRate } from "@/lib/night-catalogue";

// Compatibility exports for older routes; every fallback is deliberately non-personal.
export const extractPhotoUrls = (offer: any): string[] => getProfilePhotos(offer);
export const cleanSwissDigits = cleanSwissPhone;
export const getSeedFallback = (_seed: string): string => NEUTRAL_PROFILE_IMAGE;
export const getLocalAiPortrait = getSeedFallback;
export const toProxiedImg = (url: string, seed = ""): string => seed ? profilePhotoSrc(seed) : profileImageSource(url) || profilePhotoPlaceholder("");

export default function LuxuryPhotoCard({ offer, idx = 0, liveState }: { offer: any; idx?: number; liveState?: any }) {
  const catalogue = useCatalogue();
  const id = getProfileId(offer);
  if (!id) return null;
  const state = liveState || catalogue.states[id] || {};
  const name = getProfileName(offer, state);
  const city = getProfileCity(offer, state);
  const hourly = hourlyPriceLine({
    confirmed: getProfileRate(state, 60),
    harvested: typeof offer.advertisedBaseChf === "number" ? offer.advertisedBaseChf : null,
    halfHour: typeof offer.rate30Chf === "number" ? offer.rate30Chf : null,
  });
  const saved = catalogue.favorites.includes(id);
  const compared = catalogue.compareIds.includes(id);
  const comparisonFull = !compared && catalogue.compareIds.length >= 3;
  const href = `/profile/${encodeURIComponent(id)}`;
  return <article className="night-profile-card">
    <div className="night-profile-media">
      <Link href={href} aria-label={`Profil ansehen: ${name}`}>
        <ProfileImage key={id} profileId={id} name={name} alt={`Profilfoto zu ${name}`} eager={idx < 4} />
      </Link>
      <button type="button" className={`night-icon-button night-save ${saved ? "active" : ""}`} aria-pressed={saved} aria-label={saved ? `${name} aus der Merkliste entfernen` : `${name} merken`} onClick={() => catalogue.toggleFavorite(id)}>
        <Heart size={19} fill={saved ? "currentColor" : "none"} aria-hidden="true" />
      </button>
      <span className="night-profile-source">{String(offer.sourcePortal || "Quellenindex")}</span>
    </div>
    <div className="night-profile-meta">
      <p className="night-eyebrow"><MapPin size={12} aria-hidden="true" /> {city}</p>
      <h3><Link href={href}>{name}</Link></h3>
      <p className="night-note">{hourly.label}</p>
      <div className="night-profile-bottom">
        <button type="button" className={`night-text-button ${compared ? "active" : ""}`} aria-pressed={compared} disabled={comparisonFull} aria-describedby={comparisonFull ? `comparison-limit-${id}` : undefined} onClick={() => catalogue.toggleCompare(id)}>
          <Scale size={15} aria-hidden="true" /> {compared ? "Im Vergleich" : "Vergleichen"}
        </button>
        <Link href={href} className="night-text-button">Details <ArrowRight size={15} aria-hidden="true" /></Link>
      </div>
      {comparisonFull && <p className="night-comparison-limit" id={`comparison-limit-${id}`}><span>3/3 ausgewählt</span><Link href="/compare-escorts">Auswahl ändern <ArrowRight size={13} aria-hidden="true" /></Link></p>}
    </div>
  </article>;
}
