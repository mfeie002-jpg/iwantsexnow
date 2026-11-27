import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, MapPin, Scale, Undo2, X } from "lucide-react";
import { SEO } from "@/components/SEO";
import LuxuryPhotoCard from "@/components/LuxuryPhotoCard";
import { useCatalogue, useSelectedCatalogue } from "@/components/night/CatalogueContext";
import { resolveSelectedProfiles } from "@/components/night/profile-image-model";
import { FavoriteOrder, favoriteRegionCounts, selectFavorites } from "@/components/night/favorites-model";
import { CANTONS, REGIONS, getProfileId, getProfileName, Offer } from "@/lib/night-catalogue";
import type {GetServerSideProps} from 'next';
export const getServerSideProps:GetServerSideProps=async()=>({props:{
 catalogue:{states:{},blockedIds:[],offers:[],clubs:[],partial:true}
}});

const regionLabel = (key: string) => key === 'unknown' ? 'Ohne Regionsangabe' : REGIONS.find(region => region.canton === key)?.name || key;

export default function FavoritesPage() {
  const catalogue = useCatalogue();
  const savedHydration = useSelectedCatalogue('favorites');
  const [removed, setRemoved] = useState<{ id: string; name: string } | null>(null);
  const [region, setRegion] = useState('all');
  const [order, setOrder] = useState<FavoriteOrder>('saved');
  const undoButton = useRef<HTMLButtonElement>(null);
  const saved = resolveSelectedProfiles(catalogue.visibleOffers, catalogue.favorites, getProfileId);
  const entries = saved.map(offer => {
    const id = getProfileId(offer), state = catalogue.states[id] || {};
    const canton = String(state.canton || offer.canton || '').trim().toUpperCase();
    return { id, offer, name: getProfileName(offer, state), city: String(state.city || offer.city || '').trim(), canton: CANTONS.includes(canton) ? canton : '' };
  });
  const regions = favoriteRegionCounts(entries).sort((a, b) => regionLabel(a.key).localeCompare(regionLabel(b.key), 'de-CH'));
  const shown = selectFavorites(entries, region, order);
  const unavailableCount = catalogue.favorites.length - saved.length;
  const canRestore = removed && catalogue.visibleOffers.some(offer => getProfileId(offer) === removed.id);
  const remove = (offer: Offer) => {
    const id = getProfileId(offer);
    if (!catalogue.favorites.includes(id)) return;
    catalogue.toggleFavorite(id);
    setRemoved({ id, name: getProfileName(offer, catalogue.states[id]) });
  };
  useEffect(() => { if (removed) undoButton.current?.focus({ preventScroll: true }); }, [removed]);

  return <main id="main" className="night-container night-section night-favorites-page">
    <SEO title="Deine Merkliste | iwantsexnow.ch" description="Finde deine selbst gemerkten Profile wieder und wähle Einträge für einen nachvollziehbaren Vergleich." url="https://iwantsexnow.ch/favorites" />
    <div className="night-page-intro"><p className="night-eyebrow">Deine Auswahl bleibt deine.</p><h1>Deine Favoriten. Dein Überblick.</h1><p className="night-lead">Nach Region ordnen, in Ruhe wiederfinden und selbst vergleichen.</p></div>
    <p className="night-favorites-privacy"><Heart size={15} aria-hidden="true" /> In diesem Browser gespeichert. Auf gemeinsam genutzten Geräten für andere sichtbar.</p>
    {catalogue.error && <p className="night-note" role="status">{catalogue.error}</p>}
    {savedHydration.error && <p className="night-note" role="alert">{savedHydration.error} <button type="button" className="night-text-button" onClick={savedHydration.retry}>Erneut versuchen</button></p>}
    {removed && !catalogue.favorites.includes(removed.id) && <div className="night-favorite-undo"><p role="status">{removed.name} wurde aus deiner Merkliste entfernt.{!canRestore && ' Dieser Eintrag ist derzeit nicht sichtbar.'}</p><button ref={undoButton} type="button" className="night-text-button" disabled={!canRestore} onClick={() => { if (canRestore && !catalogue.favorites.includes(removed.id)) catalogue.toggleFavorite(removed.id); setRemoved(null); }}><Undo2 size={16} aria-hidden="true" /> Rückgängig</button></div>}
    {unavailableCount > 0 && savedHydration.ready && !savedHydration.error && <p className="night-note">{unavailableCount} gemerkte {unavailableCount === 1 ? "Eintrag ist" : "Einträge sind"} derzeit nicht sichtbar.</p>}
    {!savedHydration.ready ? <section className="night-empty" role="status"><h2>Deine Merkliste wird abgeglichen …</h2></section> : savedHydration.error ? null : saved.length ? <>
      <section className="night-favorites-tools" aria-label="Merkliste ordnen">
        <div className="night-favorites-tools-top"><div><span className="night-kicker">Deine persönliche Auswahl</span><p role="status">{shown.length} von {saved.length} {saved.length === 1 ? 'gespeichertem Profil' : 'gespeicherten Profilen'}</p></div><Link href="/compare-escorts" className="night-button secondary"><Scale size={16} aria-hidden="true" /> Vergleich öffnen ({catalogue.compareIds.length})</Link></div>
        <div className="night-favorites-regions" role="group" aria-label="Merkliste nach Region filtern"><button type="button" className="night-chip" aria-pressed={region === 'all'} onClick={() => setRegion('all')}>Alle Regionen <span>{saved.length}</span></button>{regions.map(item => <button type="button" className="night-chip" key={item.key} aria-pressed={region === item.key} onClick={() => setRegion(item.key)}><MapPin size={14} aria-hidden="true" /> {regionLabel(item.key)} <span>{item.count}</span></button>)}</div>
        <div className="night-favorites-order"><label htmlFor="favorite-order">Reihenfolge<select id="favorite-order" value={order} onChange={event => setOrder(event.target.value as FavoriteOrder)}><option value="saved">Wie gemerkt</option><option value="name">Nach Name</option><option value="place">Nach Ort</option></select></label><span className="night-note">Filtern und Sortieren ändern deine gespeicherte Auswahl nicht.</span></div>
      </section>
      {shown.length ? <div className="night-profile-grid">{shown.map(({ offer, id }, index) => <div className="night-favorite-item" key={id}><LuxuryPhotoCard offer={offer} idx={index} liveState={catalogue.states[id]} /><button type="button" className="night-text-button" aria-label={`${getProfileName(offer, catalogue.states[id])} entfernen und Rückgängig anbieten`} onClick={() => remove(offer)}><X size={15} aria-hidden="true" /> Aus Merkliste entfernen</button></div>)}</div> : <section className="night-empty"><MapPin size={30} aria-hidden="true" /><h2>Hier ist gerade nichts gemerkt.</h2><p>Für {regionLabel(region)} enthält deine sichtbare Merkliste keinen Eintrag. Deine übrigen Favoriten bleiben erhalten.</p><button type="button" className="night-button" onClick={() => setRegion('all')}>Alle Favoriten anzeigen <ArrowRight size={17} aria-hidden="true" /></button></section>}
    </> : <section className="night-empty"><Heart size={34} aria-hidden="true" /><h2>{unavailableCount ? 'Deine gemerkten Profile sind derzeit nicht sichtbar.' : 'Deine Merkliste ist noch leer.'}</h2><p>{unavailableCount ? 'Deine Auswahl bleibt erhalten. Du kannst weitere Profile entdecken.' : 'Das Herz an einem Profil fügt es deiner Auswahl hinzu. Es werden keine Profile automatisch eingetragen.'}</p><Link href="/search" className="night-button">Profile entdecken <ArrowRight size={17} aria-hidden="true" /></Link></section>}
  </main>;
}
