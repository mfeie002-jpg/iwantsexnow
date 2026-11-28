import React, { useEffect, useState } from "react";
import type { GetServerSideProps } from "next";
import Link from "next/link";
import * as Dialog from "@radix-ui/react-dialog";
import { ArrowLeft, ArrowRight, Heart, ImageIcon, MapPin, Phone, Scale, ExternalLink, Flag, Expand, X } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useCatalogue } from "@/components/night/CatalogueContext";
import { ProfileImage } from "@/components/night/ProfileImage";
import { stepPhotoIndex } from "@/components/night/profile-experience-model";
import { halfHourPriceLine, hourlyPriceLine } from "@/lib/honesty";
import { cleanSwissPhone, getProfileCity, getProfileId, getProfileName, getProfilePhotos, getProfileRate, isVisibleProfile, safeExternalUrl } from "@/lib/night-catalogue";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const id = typeof params?.id === "string" ? params.id : "";
  const { default: rawOffers } = await import("@/data/harvested-offers.json");
  const { getCatalogueSnapshot } = await import("@/lib/night-catalogue-server");
  const catalogue = await getCatalogueSnapshot();
  const offer = (rawOffers as any[]).find(item => getProfileId(item) === id);
  if (!offer || !isVisibleProfile(offer, catalogue.states, catalogue.blockedIds)) return { notFound: true };
  const hourly = Number(offer.advertisedBaseChf);
  const halfHour = Number(offer.rate30Chf);
  const scrapedAt = typeof offer.scrapedAtIso === "string" && offer.scrapedAtIso ? offer.scrapedAtIso : (typeof offer.scrapedAt === "string" ? offer.scrapedAt : "");
  const profile={id,rawName:offer.rawName||'',city:offer.city||'',canton:offer.canton||'',sourcePortal:offer.sourcePortal||'',sourceUrl:offer.sourceUrl||'',rawPhone:offer.rawPhone||'',bio:offer.bio||'',gallery:getProfilePhotos(offer,catalogue.states[id]),includedTags:offer.includedTags||[],languages:offer.languages||[],advertisedBaseChf:Number.isFinite(hourly)&&hourly>0?hourly:null,rate30Chf:Number.isFinite(halfHour)&&halfHour>0?halfHour:null,scrapedAt};
  const publicOffer = catalogue.offers.find(item => getProfileId(item) === id);
  if (!publicOffer) return {notFound:true};
  const state = catalogue.states[id];
  const scopedCatalogue = {
    states: state ? {[id]:state} : {},
    blockedIds: [],
    offers: [publicOffer],
    clubs: [],
    partial: true
  };
  return {props:{profileId:id,profile,catalogue:scopedCatalogue}};
};

export default function ProfileDetailPage({ profileId, profile }: { profileId: string; profile:any }) {
  const catalogue = useCatalogue();
  const offer = catalogue.visibleOffers.some(item => getProfileId(item) === profileId) ? profile : null;
  const [activePhoto, setActivePhoto] = useState(0);
  const [galleryOpen, setGalleryOpen] = useState(false);
  useEffect(() => { setActivePhoto(0); setGalleryOpen(false); }, [profileId]);
  if (!offer) return <section className="night-container night-section"><SEO title="Profil nicht verfügbar | iwantsexnow.ch" /><div className="night-empty"><h1>Profil nicht verfügbar</h1><p>Dieser Eintrag kann zurzeit nicht angezeigt werden.</p><Link href="/search" className="night-button">Zur Übersicht</Link></div></section>;

  const state = catalogue.states[profileId] || {};
  const name = getProfileName(offer, state), city = getProfileCity(offer, state);
  const photos = getProfilePhotos(offer, state);
  const rate30 = halfHourPriceLine({ confirmed: getProfileRate(state, 30), harvested: typeof offer.rate30Chf === "number" ? offer.rate30Chf : null, hourly: typeof offer.advertisedBaseChf === "number" ? offer.advertisedBaseChf : null });
  const rate60 = hourlyPriceLine({ confirmed: getProfileRate(state, 60), harvested: typeof offer.advertisedBaseChf === "number" ? offer.advertisedBaseChf : null, halfHour: typeof offer.rate30Chf === "number" ? offer.rate30Chf : null });
  const source = safeExternalUrl(offer.sourceUrl);
  const digits = cleanSwissPhone(state.phoneDisplay || offer.rawPhone);
  const hasPhone = /^41(?:7[5-9]|[2-6]\d)\d{7}$/.test(digits);
  const saved = catalogue.favorites.includes(profileId), compared = catalogue.compareIds.includes(profileId);
  const comparisonFull = !compared && catalogue.compareIds.length >= 3;
  const tags = Array.isArray(offer.includedTags) ? offer.includedTags.filter((tag: unknown) => typeof tag === "string" && tag.trim()).slice(0, 16) : [];
  const languages = Array.isArray(offer.languages) ? offer.languages.filter((value: unknown) => typeof value === "string" && value.trim()) : [];
  const description = typeof state.bio === "string" && state.bio.trim() ? state.bio.trim() : typeof offer.bio === "string" ? offer.bio.trim() : "";
  const canonical = `https://iwantsexnow.ch/profile/${encodeURIComponent(profileId)}`;
  return <main id="main" className="night-container night-section night-profile-page">
    <SEO title={`${name} · ${city} | iwantsexnow.ch`} description={`Informationen zu ${name}: Standort, vorhandene Bildquellen und Kontaktangaben im Schweizer Verzeichnis.`} url={canonical} />
    <div className="night-row night-profile-breadcrumb"><Link href="/search" className="night-text-button"><ArrowLeft size={16} /> Zur Übersicht</Link><Link href={`/report?id=${encodeURIComponent(profileId)}`} className="night-text-button"><Flag size={15} /> Eintrag melden</Link></div>
    <nav className="night-profile-jump" aria-label="Auf dieser Profilseite"><a href="#profile-photos">Bilder</a><a href="#profile-details">Angaben</a><a href="#contact-title">Kontakt</a></nav>
    {catalogue.error && <p className="night-note" role="status">{catalogue.error}</p>}
    <div className="night-profile-layout">
      <section className="night-gallery" id="profile-photos" aria-label="Profilbilder">
        <Dialog.Root open={galleryOpen} onOpenChange={setGalleryOpen}>
          <div className="night-gallery-main"><ProfileImage key={`${profileId}-${activePhoto}`} profileId={profileId} name={name} photoIndex={photos.length ? Math.min(activePhoto, photos.length - 1) : 0} alt={`Profilfoto zu ${name}`} eager />{photos.length > 0 && <Dialog.Trigger asChild><button type="button" className="night-gallery-expand"><Expand size={17} aria-hidden="true" /> Bilder gross ansehen <span>{photos.length}</span></button></Dialog.Trigger>}</div>
          <Dialog.Portal><Dialog.Overlay className="night-gallery-overlay"/><Dialog.Content className="night-gallery-dialog" onKeyDown={event => { if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') { event.preventDefault(); setActivePhoto(current => stepPhotoIndex(current, event.key === 'ArrowLeft' ? -1 : 1, photos.length)); } }}>
            <div className="night-gallery-dialog-heading"><div><Dialog.Title>Profilbilder</Dialog.Title><Dialog.Description>{name} · Bilder aus hinterlegten Quellen</Dialog.Description></div><Dialog.Close className="night-icon-button" aria-label="Bilderansicht schliessen"><X aria-hidden="true"/></Dialog.Close></div>
            <div className="night-gallery-stage"><ProfileImage key={`expanded-${profileId}-${activePhoto}`} profileId={profileId} name={name} photoIndex={photos.length ? Math.min(activePhoto, photos.length - 1) : 0} alt={`Profilfoto ${Math.min(activePhoto + 1, photos.length)} zu ${name}`} eager/></div>
            <div className="night-gallery-controls"><button type="button" className="night-icon-button" disabled={photos.length < 2} aria-label="Vorheriges Bild" onClick={() => setActivePhoto(current => stepPhotoIndex(current, -1, photos.length))}><ArrowLeft aria-hidden="true"/></button><p aria-live="polite" aria-atomic="true">Bild <strong>{Math.min(activePhoto + 1, photos.length)}</strong> von {photos.length}</p><button type="button" className="night-icon-button" disabled={photos.length < 2} aria-label="Nächstes Bild" onClick={() => setActivePhoto(current => stepPhotoIndex(current, 1, photos.length))}><ArrowRight aria-hidden="true"/></button></div>
            <p className="night-gallery-disclaimer">Die Bildzuordnung ist keine Identitätsprüfung. Nicht erreichbare Bilder bleiben als fehlend gekennzeichnet.</p>
          </Dialog.Content></Dialog.Portal>
        </Dialog.Root>
        {photos.length > 1 && <div className="night-gallery-thumbs">{photos.map((url, index) => <button type="button" key={`${url}-${index}`} className={index === activePhoto ? "active" : ""} onClick={() => setActivePhoto(index)} aria-pressed={index === activePhoto} aria-label={`Bild ${index + 1} ansehen`}><ProfileImage profileId={profileId} name={name} photoIndex={index} alt="" compact /></button>)}</div>}
        <p className="night-note"><ImageIcon size={14} aria-hidden="true" /> {photos.length ? "Bilder aus den hinterlegten Quellen. Die Zuordnung ist keine Identitätsprüfung." : "Für diesen Eintrag steht derzeit kein zugeordnetes Profilfoto bereit."}</p>
      </section>
      <section className="night-profile-details">
        <p className="night-eyebrow"><MapPin size={14} aria-hidden="true" /> {city}{state.canton || offer.canton ? ` · ${String(state.canton || offer.canton).toUpperCase()}` : ""}</p>
        <h1>{name}</h1>
        <p className="night-lead">Eintrag aus {String(offer.sourcePortal || "dem Quellenindex")}.</p>
        <div className="night-row night-profile-actions">
          <button type="button" className={`night-button ${saved ? "" : "secondary"}`} aria-pressed={saved} onClick={() => catalogue.toggleFavorite(profileId)}><Heart size={17} fill={saved ? "currentColor" : "none"} /> {saved ? "Gemerkt" : "Merken"}</button>
          <button type="button" className="night-button secondary" aria-pressed={compared} disabled={comparisonFull} aria-describedby={comparisonFull ? 'profile-comparison-limit' : undefined} onClick={() => catalogue.toggleCompare(profileId)}><Scale size={17} /> {compared ? "Im Vergleich" : "Vergleichen"}</button>
        </div>
        {comparisonFull && <p className="night-comparison-limit" id="profile-comparison-limit"><span>3/3 Profile ausgewählt. Entferne zuerst ein Profil.</span><Link href="/compare-escorts">Vergleich bearbeiten <ArrowRight size={14} aria-hidden="true" /></Link></p>}
        <div className="night-profile-facts">
          <div><span>30 Minuten</span><strong>{rate30.label}</strong></div>
          <div><span>60 Minuten</span><strong>{rate60.label}</strong></div>
          <div><span>Verfügbarkeit</span><strong>Direkt abklären</strong></div>
          <div><span>Quelle</span><strong>{String(offer.sourcePortal || "Nicht angegeben")}</strong></div>
        </div>
        <p className="night-note">Geschätzte Beträge sind aus einem Standardwert oder aus der anderen Dauer abgeleitet. Ein Portal-Eintrag ist keine Live-Meldung und kein Freigabe-Status.</p>
        <section className="night-surface night-contact-panel" aria-labelledby="contact-title"><h2 id="contact-title">Kontakt laut Eintrag</h2><p className="night-note">Prüfe die aktuellen Angaben in der Quelle, bevor du Kontakt aufnimmst.</p><div className="night-stack">
          {source && <a href={source} target="_blank" rel="noopener noreferrer" className="night-button">Original-Inserat prüfen <ExternalLink size={16} /></a>}
          {hasPhone && <a href={`tel:+${digits}`} className="night-button secondary"><Phone size={16} /> +{digits}</a>}
          {hasPhone && <a href={`https://wa.me/${digits}`} target="_blank" rel="noopener noreferrer" className="night-button secondary">WhatsApp öffnen <ArrowRight size={16} /></a>}
          {!source && !hasPhone && <p>Kein nutzbarer Kontaktweg im Eintrag hinterlegt.</p>}
        </div></section>
      </section>
    </div>
    <div className="night-profile-information" id="profile-details">
      <section className="night-surface"><p className="night-eyebrow">Hinterlegte Angaben</p><h2>Beschreibung & Einordnung</h2><p className="night-description">{description || "Für diesen Eintrag ist keine Beschreibung hinterlegt."}</p><p className="night-note">Importierte Angaben können sich ändern. Massgeblich ist die aktuelle Auskunft der Anbieterin oder des Anbieters.</p>{tags.length > 0 && <div className="night-chips">{tags.map((tag: string) => <span className="night-chip" key={tag}>{tag}</span>)}</div>}</section>
      <section className="night-surface"><p className="night-eyebrow">Auf einen Blick</p><h2>Weitere Angaben</h2><dl className="night-detail-list"><div><dt>Ort</dt><dd>{city}</dd></div><div><dt>Sprachen laut Eintrag</dt><dd>{languages.length ? languages.join(", ") : "Nicht angegeben"}</dd></div><div><dt>Identitätsprüfung</dt><dd>Kein bestätigter Nachweis angezeigt</dd></div></dl><Link href={`/report?id=${encodeURIComponent(profileId)}`} className="night-text-button">Eine Angabe korrigieren <ArrowRight size={16} /></Link></section>
    </div>
  </main>;
}
