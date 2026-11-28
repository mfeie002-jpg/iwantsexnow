import React, { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, Scale, X } from "lucide-react";
import { SEO } from "@/components/SEO";
import { useCatalogue, useSelectedCatalogue } from "@/components/night/CatalogueContext";
import { ProfileImage } from "@/components/night/ProfileImage";
import { chooseComparisonProfile, reconcileComparisonPair, resolveSelectedProfiles } from "@/components/night/profile-image-model";
import { ComparisonValue, showComparisonRow } from "@/components/night/profile-experience-model";
import { getProfileId, getProfileName, getProfileRate, Offer } from "@/lib/night-catalogue";
import type {GetServerSideProps} from 'next';
export const getServerSideProps:GetServerSideProps=async()=>({props:{
 catalogue:{states:{},blockedIds:[],offers:[],clubs:[],partial:true}
}});

export default function CompareEscortsPage() {
  const catalogue = useCatalogue();
  const savedHydration = useSelectedCatalogue('compare');
  const selected = resolveSelectedProfiles(catalogue.visibleOffers, catalogue.compareIds, getProfileId).slice(0, 3);
  const ids = selected.map(getProfileId);
  const [pair, setPair] = useState<string[]>([]);
  const [differencesOnly, setDifferencesOnly] = useState(false);
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 760px)');
    const sync = () => setMobile(media.matches);
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  const identity = ids.join("\u0000");
  useEffect(() => setPair(current => reconcileComparisonPair(ids, current)), [identity]);
  const visiblePair = reconcileComparisonPair(ids, pair);
  const ordered = [...visiblePair,...ids.filter(id=>!visiblePair.includes(id))].map(id=>selected.find(offer=>getProfileId(offer)===id)!);
  const cellClass = (id: string) => visiblePair.includes(id) ? "" : "night-compare-mobile-hidden";
  const rawValue = (offer: Offer, field: string): ComparisonValue => {
    const state = catalogue.states[getProfileId(offer)] || {};
    if (field === "city") return String(state.city || offer.city || '').trim() || null;
    if (field === "source") return String(offer.sourcePortal || '').trim() || null;
    if (field === "languages") { const languages = Array.isArray(offer.languages) ? offer.languages.filter((language: unknown): language is string => typeof language === 'string' && Boolean(language.trim())).map((language: string) => language.trim()).sort() : []; return languages.length ? languages.join(", ") : null; }
    if (field === "availability") return null;
    return getProfileRate(state, field === "30" ? 30 : 60);
  };
  const value = (offer: Offer, field: string) => {
    const raw = rawValue(offer, field);
    if (field === 'availability') return 'Direkt abklären';
    if (field === '30' || field === '60') return typeof raw === 'number' ? `CHF ${raw.toLocaleString('de-CH')}` : 'Nicht bestätigt';
    return raw === null ? 'Nicht angegeben' : String(raw);
  };
  const criteria = [["city", "Ort"], ["30", "30 Minuten"], ["60", "60 Minuten"], ["availability", "Verfügbarkeit"], ["languages", "Sprachen laut Eintrag"], ["source", "Quelle"]];
  const comparedOffers = mobile ? ordered.filter(offer => visiblePair.includes(getProfileId(offer))) : ordered;
  const shownCriteria = criteria.filter(([field]) => showComparisonRow(comparedOffers.map(offer => rawValue(offer, field)), differencesOnly));
  return <main id="main" className="night-container night-section">
    <SEO title="Profile vergleichen · Deine Auswahl | iwantsexnow.ch" description="Vergleiche selbst ausgewählte Profile nach Ort, hinterlegten Quellen und bestätigten Preisangaben." url="https://iwantsexnow.ch/compare-escorts" />
    <div className="night-page-intro"><p className="night-eyebrow">Deine Auswahl. Ein gemeinsamer Blick.</p><h1>Was unterscheidet die Profile?</h1><p className="night-lead">Bis zu drei Einträge nebeneinander. Fehlende Angaben bleiben sichtbar, damit dein Vergleich nachvollziehbar bleibt.</p></div>
    {catalogue.error && <p className="night-note" role="status">{catalogue.error}</p>}
    {savedHydration.error && <p className="night-note" role="alert">{savedHydration.error} <button type="button" className="night-text-button" onClick={savedHydration.retry}>Erneut versuchen</button></p>}
    {!savedHydration.ready ? <section className="night-empty" role="status"><h2>Dein Vergleich wird abgeglichen …</h2></section> : savedHydration.error ? null : selected.length === 0 ? <section className="night-empty"><Scale size={32} aria-hidden="true" /><h2>{catalogue.compareIds.length?'Gespeicherte Vergleichseinträge sind derzeit nicht sichtbar.':'Dein Vergleich beginnt mit deiner Auswahl.'}</h2><p>Wähle bei einem Profil „Vergleichen“. Hier erscheinen nur die von dir ausgewählten, weiterhin sichtbaren Einträge.</p>{catalogue.compareIds.length>0&&<button type="button" className="night-text-button" onClick={()=>catalogue.compareIds.forEach(id=>catalogue.toggleCompare(id))}>Nicht sichtbare Vergleichsauswahl entfernen</button>}<Link href="/search" className="night-button">Profile ansehen <ArrowRight size={17} /></Link></section> : <>
      <div className="night-selection-bar"><span>{selected.length} von 3 Profilen ausgewählt</span><Link href="/search" className="night-text-button">Weiter auswählen <ArrowRight size={16} /></Link></div>
      <div className="night-comparison-tools"><label className="night-difference-switch"><input type="checkbox" checked={differencesOnly} disabled={selected.length < 2} onChange={event => setDifferencesOnly(event.target.checked)}/><span>Nur Unterschiede</span></label><p aria-live="polite">{shownCriteria.length} von {criteria.length} Kriterien sichtbar. Offene Angaben bleiben sichtbar.</p></div>
      {selected.length > 2 && <div className="night-compare-mobile-selectors">{[0, 1].map(slot => <label key={slot}><span>{slot === 0 ? "Linkes Profil" : "Rechtes Profil"}</span><select value={visiblePair[slot] || ""} onChange={event => setPair(current => chooseComparisonProfile(ids, current, slot, event.target.value))}>{ordered.map(offer => <option key={getProfileId(offer)} value={getProfileId(offer)}>{getProfileName(offer, catalogue.states[getProfileId(offer)])}</option>)}</select></label>)}</div>}
      <div className="night-compare-wrap"><table className="night-compare-table"><caption className="sr-only">Vergleich deiner ausgewählten Profile anhand vorhandener Angaben</caption><thead><tr><th scope="col">Deine Kriterien</th>{ordered.map(offer => { const id = getProfileId(offer), state = catalogue.states[id] || {}, name = getProfileName(offer, state); return <th scope="col" key={id} className={cellClass(id)}><div className="night-compare-image"><ProfileImage profileId={id} name={name} alt={`Profilfoto zu ${name}`} compact /><button type="button" className="night-icon-button" aria-label={`${name} aus dem Vergleich entfernen`} onClick={() => catalogue.toggleCompare(id)}><X size={16} /></button></div><Link href={`/profile/${encodeURIComponent(id)}`}>{name}</Link></th>; })}</tr></thead><tbody>
        {shownCriteria.map(([field, label]) => <tr key={field}><th scope="row">{label}</th>{ordered.map(offer => <td key={getProfileId(offer)} className={cellClass(getProfileId(offer))}>{value(offer, field)}</td>)}</tr>)}
        <tr><th scope="row">Details</th>{ordered.map(offer => <td key={getProfileId(offer)} className={cellClass(getProfileId(offer))}><Link href={`/profile/${encodeURIComponent(getProfileId(offer))}`} className="night-button secondary">Profil ansehen</Link></td>)}</tr>
      </tbody></table></div>
      <p className="night-note">Der Vergleich bewertet keine Personen. Ein fehlender Preis wird weder geschätzt noch als günstiger eingeordnet.</p>
    </>}
  </main>;
}
