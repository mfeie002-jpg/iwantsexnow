import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Scale, X } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useCatalogue } from "@/components/night/CatalogueContext";
import { ProfileImage } from "@/components/night/ProfileImage";
import { chooseComparisonProfile, reconcileComparisonPair, resolveSelectedProfiles } from "@/components/night/profile-image-model";
import { getProfileCity, getProfileId, getProfileName, getProfilePhotos, getProfileRate } from "@/lib/night-catalogue";
export { getServerSideProps } from "@/lib/night-catalogue-server";

export default function CompareEscortsPage() {
  const catalogue = useCatalogue();
  const selected = resolveSelectedProfiles(catalogue.visibleOffers, catalogue.compareIds, getProfileId).slice(0, 3);
  const ids = selected.map(getProfileId);
  const [pair, setPair] = useState<string[]>([]);
  const identity = ids.join("\u0000");
  useEffect(() => setPair(current => reconcileComparisonPair(ids, current)), [identity]);
  const visiblePair = reconcileComparisonPair(ids, pair);
  const ordered = [...visiblePair,...ids.filter(id=>!visiblePair.includes(id))].map(id=>selected.find(offer=>getProfileId(offer)===id)!);
  const cellClass = (id: string) => visiblePair.includes(id) ? "" : "night-compare-mobile-hidden";
  const value = (offer: any, field: string) => {
    const state = catalogue.states[getProfileId(offer)] || {};
    if (field === "city") return getProfileCity(offer, state);
    if (field === "source") return String(offer.sourcePortal || "Nicht angegeben");
    if (field === "languages") return Array.isArray(offer.languages) && offer.languages.length ? offer.languages.join(", ") : "Nicht angegeben";
    if (field === "availability") return "Direkt abklären";
    const rate = getProfileRate(state, field === "30" ? 30 : 60);
    return rate === null ? "Nicht bestätigt" : `CHF ${rate.toLocaleString("de-CH")}`;
  };
  return <main id="main" className="night-container night-section">
    <SEO title="Profile vergleichen · Deine Auswahl | iwantsexnow.ch" description="Vergleiche selbst ausgewählte Profile nach Ort, hinterlegten Quellen und bestätigten Preisangaben." url="https://iwantsexnow.ch/compare-escorts" />
    <div className="night-page-intro"><p className="night-eyebrow">Deine Auswahl. Ein gemeinsamer Blick.</p><h1>Was unterscheidet die Profile?</h1><p className="night-lead">Bis zu drei Einträge nebeneinander. Fehlende Angaben bleiben sichtbar, damit dein Vergleich nachvollziehbar bleibt.</p></div>
    {catalogue.error && <p className="night-note" role="status">{catalogue.error}</p>}
    {selected.length === 0 ? <section className="night-empty"><Scale size={32} aria-hidden="true" /><h2>Dein Vergleich beginnt mit deiner Auswahl.</h2><p>Wähle bei einem Profil „Vergleichen“. Hier erscheinen nur die von dir ausgewählten, weiterhin sichtbaren Einträge.</p><Link href="/search" className="night-button">Profile ansehen <ArrowRight size={17} /></Link></section> : <>
      <div className="night-selection-bar"><span>{selected.length} von 3 Profilen ausgewählt</span><Link href="/search" className="night-text-button">Weiter auswählen <ArrowRight size={16} /></Link></div>
      {selected.length > 2 && <div className="night-compare-mobile-selectors">{[0, 1].map(slot => <label key={slot}><span>{slot === 0 ? "Linkes Profil" : "Rechtes Profil"}</span><select value={visiblePair[slot] || ""} onChange={event => setPair(current => chooseComparisonProfile(ids, current, slot, event.target.value))}>{ordered.map(offer => <option key={getProfileId(offer)} value={getProfileId(offer)}>{getProfileName(offer, catalogue.states[getProfileId(offer)])}</option>)}</select></label>)}</div>}
      <div className="night-compare-wrap"><table className="night-compare-table"><caption className="sr-only">Vergleich deiner ausgewählten Profile anhand vorhandener Angaben</caption><thead><tr><th scope="col">Deine Kriterien</th>{ordered.map(offer => { const id = getProfileId(offer), state = catalogue.states[id] || {}, name = getProfileName(offer, state); return <th scope="col" key={id} className={cellClass(id)}><div className="night-compare-image"><ProfileImage photos={getProfilePhotos(offer, state)} alt={`Profilfoto zu ${name}`} compact /><button type="button" className="night-icon-button" aria-label={`${name} aus dem Vergleich entfernen`} onClick={() => catalogue.toggleCompare(id)}><X size={16} /></button></div><Link href={`/profile/${encodeURIComponent(id)}`}>{name}</Link></th>; })}</tr></thead><tbody>
        {[["city", "Ort"], ["30", "30 Minuten"], ["60", "60 Minuten"], ["availability", "Verfügbarkeit"], ["languages", "Sprachen laut Eintrag"], ["source", "Quelle"]].map(([field, label]) => <tr key={field}><th scope="row">{label}</th>{ordered.map(offer => <td key={getProfileId(offer)} className={cellClass(getProfileId(offer))}>{value(offer, field)}</td>)}</tr>)}
        <tr><th scope="row">Details</th>{ordered.map(offer => <td key={getProfileId(offer)} className={cellClass(getProfileId(offer))}><Link href={`/profile/${encodeURIComponent(getProfileId(offer))}`} className="night-button secondary">Profil ansehen</Link></td>)}</tr>
      </tbody></table></div>
      <p className="night-note">Der Vergleich bewertet keine Personen. Ein fehlender Preis wird weder geschätzt noch als günstiger eingeordnet.</p>
    </>}
  </main>;
}
