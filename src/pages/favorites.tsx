import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Heart, Scale, Undo2, X } from "lucide-react";
import { SEO } from "@/components/SEO";
import LuxuryPhotoCard from "@/components/LuxuryPhotoCard";
import { useCatalogue } from "@/components/night/CatalogueContext";
import { resolveSelectedProfiles } from "@/components/night/profile-image-model";
import { getProfileId, getProfileName } from "@/lib/night-catalogue";
export { getServerSideProps } from "@/lib/night-catalogue-server";

export default function FavoritesPage() {
  const catalogue = useCatalogue();
  const [removed, setRemoved] = useState<{ id: string; name: string } | null>(null);
  const saved = resolveSelectedProfiles(catalogue.visibleOffers, catalogue.favorites, getProfileId);
  const unavailableCount = catalogue.favorites.length - saved.length;
  const remove = (offer: any) => { const id = getProfileId(offer); catalogue.toggleFavorite(id); setRemoved({ id, name: getProfileName(offer, catalogue.states[id]) }); };
  return <main id="main" className="night-container night-section">
    <SEO title="Deine Merkliste | iwantsexnow.ch" description="Finde deine selbst gemerkten Profile wieder und wähle Einträge für einen nachvollziehbaren Vergleich." url="https://iwantsexnow.ch/favorites" />
    <div className="night-page-intro"><p className="night-eyebrow">Deine Auswahl bleibt deine.</p><h1>Alles, was du dir merken möchtest.</h1><p className="night-lead">Hier findest du die Profile wieder, die du selbst gespeichert hast. Merken und Vergleichen bleiben zwei getrennte Entscheidungen.</p></div>
    {catalogue.error && <p className="night-note" role="status">{catalogue.error}</p>}
    {removed && <div className="night-selection-bar" role="status"><span>{removed.name} wurde aus deiner Merkliste entfernt.</span><button type="button" className="night-text-button" onClick={() => { if (!catalogue.favorites.includes(removed.id)) catalogue.toggleFavorite(removed.id); setRemoved(null); }}><Undo2 size={16} /> Rückgängig</button></div>}
    {unavailableCount > 0 && !catalogue.loading && <p className="night-note">{unavailableCount} gemerkte {unavailableCount === 1 ? "Eintrag ist" : "Einträge sind"} derzeit nicht sichtbar.</p>}
    {saved.length ? <>
      <div className="night-selection-bar"><span>{saved.length} {saved.length === 1 ? "Profil" : "Profile"} in deiner Merkliste</span><Link href="/compare-escorts" className="night-button secondary"><Scale size={16} /> Vergleich öffnen ({catalogue.compareIds.length})</Link></div>
      <div className="night-profile-grid">{saved.map((offer, index) => <div className="night-favorite-item" key={getProfileId(offer)}><LuxuryPhotoCard offer={offer} idx={index} liveState={catalogue.states[getProfileId(offer)]} /><button type="button" className="night-text-button" onClick={() => remove(offer)}><X size={15} /> Aus Merkliste entfernen</button></div>)}</div>
    </> : <section className="night-empty"><Heart size={34} aria-hidden="true" /><h2>Deine Merkliste ist noch leer.</h2><p>Das Herz an einem Profil fügt es deiner Auswahl hinzu. Es werden keine Profile automatisch eingetragen.</p><Link href="/search" className="night-button">Profile entdecken <ArrowRight size={17} /></Link></section>}
    <p className="night-note">Die Merkliste wird in diesem Browser gespeichert. Auf gemeinsam genutzten Geräten können andere Personen darauf zugreifen.</p>
  </main>;
}
