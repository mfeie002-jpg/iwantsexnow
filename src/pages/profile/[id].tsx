import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Heart, ImageIcon, MapPin, Phone, Scale, ExternalLink, Flag } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useCatalogue } from "@/components/night/CatalogueContext";
import { ProfileImage } from "@/components/night/ProfileImage";
import { cleanSwissPhone, getProfileCity, getProfileId, getProfileName, getProfilePhotos, getProfileRate, isVisibleProfile, safeExternalUrl } from "@/lib/night-catalogue";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = typeof params?.id === "string" ? params.id : "";
  const { default: rawOffers } = await import("@/data/harvested-offers.json");
  const { getCatalogueSnapshot } = await import("@/lib/night-catalogue-server");
  const catalogue = await getCatalogueSnapshot();
  const offer = (rawOffers as any[]).find(item => getProfileId(item) === id);
  if (!offer || !isVisibleProfile(offer, catalogue.states, catalogue.blockedIds)) return { notFound: true };
  const profile={id,rawName:offer.rawName||'',city:offer.city||'',canton:offer.canton||'',sourcePortal:offer.sourcePortal||'',sourceUrl:offer.sourceUrl||'',rawPhone:offer.rawPhone||'',bio:offer.bio||'',gallery:getProfilePhotos(offer,catalogue.states[id]),includedTags:offer.includedTags||[],languages:offer.languages||[]};
  return { props: { profileId: id, profile, catalogue } };
};

export default function ProfileDetailPage({ profileId, profile }: { profileId: string; profile:any }) {
  const catalogue = useCatalogue();
  const offer = catalogue.visibleOffers.some(item => getProfileId(item) === profileId) ? profile : null;
  const [activePhoto, setActivePhoto] = useState(0);
  useEffect(() => setActivePhoto(0), [profileId]);
  if (!offer) return <section className="night-container night-section"><SEO title="Profil nicht verfügbar | iwantsexnow.ch" /><div className="night-empty"><h1>Profil nicht verfügbar</h1><p>Dieser Eintrag kann zurzeit nicht angezeigt werden.</p><Link href="/search" className="night-button">Zur Übersicht</Link></div></section>;

  const state = catalogue.states[profileId] || {};
  const name = getProfileName(offer, state), city = getProfileCity(offer, state);
  const photos = getProfilePhotos(offer, state);
  const photo = photos[Math.min(activePhoto, Math.max(0, photos.length - 1))];
  const rate30 = getProfileRate(state, 30), rate60 = getProfileRate(state, 60);
  const source = safeExternalUrl(offer.sourceUrl);
  const digits = cleanSwissPhone(state.phoneDisplay || offer.rawPhone);
  const hasPhone = /^41(?:7[5-9]|[2-6]\d)\d{7}$/.test(digits);
  const saved = catalogue.favorites.includes(profileId), compared = catalogue.compareIds.includes(profileId);
  const tags = Array.isArray(offer.includedTags) ? offer.includedTags.filter((tag: unknown) => typeof tag === "string" && tag.trim()).slice(0, 16) : [];
  const languages = Array.isArray(offer.languages) ? offer.languages.filter((value: unknown) => typeof value === "string" && value.trim()) : [];
  const description = typeof state.bio === "string" && state.bio.trim() ? state.bio.trim() : typeof offer.bio === "string" ? offer.bio.trim() : "";
  const canonical = `https://iwantsexnow.ch/profile/${encodeURIComponent(profileId)}`;
  return <main id="main" className="night-container night-section night-profile-page">
    <SEO title={`${name} · ${city} | iwantsexnow.ch`} description={`Informationen zu ${name}: Standort, vorhandene Bildquellen und Kontaktangaben im Schweizer Verzeichnis.`} url={canonical} />
    <div className="night-row night-profile-breadcrumb"><Link href="/search" className="night-text-button"><ArrowLeft size={16} /> Zur Übersicht</Link><Link href={`/report?id=${encodeURIComponent(profileId)}`} className="night-text-button"><Flag size={15} /> Eintrag melden</Link></div>
    {catalogue.error && <p className="night-note" role="status">{catalogue.error}</p>}
    <div className="night-profile-layout">
      <section className="night-gallery" aria-label="Profilbilder">
        <div className="night-gallery-main"><ProfileImage key={`${profileId}-${photo || "none"}`} photos={photo ? [photo, ...photos.filter(candidate => candidate !== photo)] : []} alt={`Profilfoto zu ${name}`} eager /></div>
        {photos.length > 1 && <div className="night-gallery-thumbs">{photos.map((url, index) => <button type="button" key={url} className={index === activePhoto ? "active" : ""} onClick={() => setActivePhoto(index)} aria-pressed={index === activePhoto} aria-label={`Bild ${index + 1} ansehen`}><ProfileImage photos={[url]} alt="" compact /></button>)}</div>}
        <p className="night-note"><ImageIcon size={14} aria-hidden="true" /> {photos.length ? "Bilder aus den hinterlegten Quellen. Die Zuordnung ist keine Identitätsprüfung." : "Für diesen Eintrag steht derzeit kein zugeordnetes Profilfoto bereit."}</p>
      </section>
      <section className="night-profile-details">
        <p className="night-eyebrow"><MapPin size={14} aria-hidden="true" /> {city}{state.canton || offer.canton ? ` · ${String(state.canton || offer.canton).toUpperCase()}` : ""}</p>
        <h1>{name}</h1>
        <p className="night-lead">Eintrag aus {String(offer.sourcePortal || "dem Quellenindex")}.</p>
        <div className="night-row night-profile-actions">
          <button type="button" className={`night-button ${saved ? "" : "secondary"}`} aria-pressed={saved} onClick={() => catalogue.toggleFavorite(profileId)}><Heart size={17} fill={saved ? "currentColor" : "none"} /> {saved ? "Gemerkt" : "Merken"}</button>
          <button type="button" className="night-button secondary" aria-pressed={compared} disabled={!compared && catalogue.compareIds.length >= 3} onClick={() => catalogue.toggleCompare(profileId)}><Scale size={17} /> {compared ? "Im Vergleich" : "Vergleichen"}</button>
        </div>
        <div className="night-profile-facts">
          <div><span>30 Minuten</span><strong>{rate30 === null ? "Nicht bestätigt" : `CHF ${rate30.toLocaleString("de-CH")}`}</strong></div>
          <div><span>60 Minuten</span><strong>{rate60 === null ? "Nicht bestätigt" : `CHF ${rate60.toLocaleString("de-CH")}`}</strong></div>
          <div><span>Verfügbarkeit</span><strong>Direkt abklären</strong></div>
          <div><span>Quelle</span><strong>{String(offer.sourcePortal || "Nicht angegeben")}</strong></div>
        </div>
        <p className="night-note">Fehlende Preise und aktuelle Verfügbarkeit werden nicht geschätzt.</p>
        <section className="night-surface night-contact-panel" aria-labelledby="contact-title"><h2 id="contact-title">Kontakt laut Eintrag</h2><p className="night-note">Prüfe die aktuellen Angaben in der Quelle, bevor du Kontakt aufnimmst.</p><div className="night-stack">
          {source && <a href={source} target="_blank" rel="noopener noreferrer" className="night-button">Original-Inserat prüfen <ExternalLink size={16} /></a>}
          {hasPhone && <a href={`tel:+${digits}`} className="night-button secondary"><Phone size={16} /> +{digits}</a>}
          {hasPhone && <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className="night-button secondary">WhatsApp öffnen <ArrowRight size={16} /></a>}
          {!source && !hasPhone && <p>Kein nutzbarer Kontaktweg im Eintrag hinterlegt.</p>}
        </div></section>
      </section>
    </div>
    <div className="night-profile-information">
      <section className="night-surface"><p className="night-eyebrow">Hinterlegte Angaben</p><h2>Beschreibung & Einordnung</h2><p className="night-description">{description || "Für diesen Eintrag ist keine Beschreibung hinterlegt."}</p><p className="night-note">Importierte Angaben können sich ändern. Massgeblich ist die aktuelle Auskunft der Anbieterin oder des Anbieters.</p>{tags.length > 0 && <div className="night-chips">{tags.map((tag: string) => <span className="night-chip" key={tag}>{tag}</span>)}</div>}</section>
      <section className="night-surface"><p className="night-eyebrow">Auf einen Blick</p><h2>Weitere Angaben</h2><dl className="night-detail-list"><div><dt>Ort</dt><dd>{city}</dd></div><div><dt>Sprachen laut Eintrag</dt><dd>{languages.length ? languages.join(", ") : "Nicht angegeben"}</dd></div><div><dt>Identitätsprüfung</dt><dd>Kein bestätigter Nachweis angezeigt</dd></div></dl><Link href={`/report?id=${encodeURIComponent(profileId)}`} className="night-text-button">Eine Angabe korrigieren <ArrowRight size={16} /></Link></section>
    </div>
  </main>;
}
