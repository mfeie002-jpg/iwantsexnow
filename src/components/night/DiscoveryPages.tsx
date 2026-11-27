import React,{useEffect,useMemo,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import {ArrowRight,Bookmark,Grid2X2,Info,LayoutGrid,MapPin,Trash2,X} from 'lucide-react';
import {SEO} from '@/components/SEO';
import LuxuryPhotoCard from '@/components/LuxuryPhotoCard';
import {useCatalogue} from './CatalogueContext';
import {TouchSearch} from './NightShell';
import {MAX_SAVED_SEARCHES,parseSavedSearches,removeSavedSearch,saveSearch,SAVED_SEARCH_KEY,SavedSearch} from './saved-searches';
import {brandAsset,CANTONS,CATEGORIES,REGIONS,CatalogueFilters,filterOffers,filtersFromQuery,getProfileId,searchHref,Offer} from '@/lib/night-catalogue';

export function RegionCards(){return <div className="night-region-grid">{REGIONS.map(r=><Link className="night-region-card" key={r.canton} href={r.href}><img src={brandAsset(r.image)} alt={`Illustration: ${r.name} am Abend`} loading="lazy"/><span><MapPin size={16}/>{r.name}</span></Link>)}</div>;}
export function ProfileGrid({offers,limit=24,density='detail'}:{offers:Offer[];limit?:number;density?:'detail'|'compact'}){
 const catalogue=useCatalogue();const [shown,setShown]=useState(limit);
 const key=offers.map(getProfileId).join(',');useEffect(()=>setShown(limit),[key,limit]);
 return <><div className={`night-profile-grid${density==='compact'?' night-profile-grid-compact':''}`}>{offers.slice(0,shown).map((o,index)=><LuxuryPhotoCard key={getProfileId(o)} offer={o} idx={index} liveState={catalogue.states[getProfileId(o)]||{}}/>)}</div>{shown<offers.length&&<div className="night-load-more"><button className="night-button-secondary" onClick={()=>setShown(n=>n+24)}>Weitere Profile anzeigen ({offers.length-shown})</button></div>}{catalogue.compareIds.length>0&&<div className="night-selection-bar"><span>{catalogue.compareIds.length} von 3 Profilen für den Vergleich</span><Link className="night-button" href="/compare-escorts">Vergleichen <ArrowRight size={16}/></Link></div>}</>;
}
export type DiscoveryConfig={title:string;description:string;canton?:string;category?:string;q?:string;image?:string;service?:string};
export const cityConfigs:Record<string,{name:string;canton:string;image:string;q?:string}>={
 ...Object.fromEntries(REGIONS.map(r=>[r.slug,{name:r.name,canton:r.canton,image:r.image}])),
 zurich:{name:'Zürich',canton:'ZH',image:'city-zuerich.webp'},baden:{name:'Baden & Aargau',canton:'AG',image:'city-aargau.webp'},winterthur:{name:'Winterthur',canton:'ZH',image:'city-zuerich.webp',q:'Winterthur'},
};
export const serviceConfigs:Record<string,{name:string;category?:string;service?:string;image:string}>={
 'girlfriend-experience':{name:'Girlfriend Experience',service:'gfe',image:'category-escort.webp'},
 'tantra-massage':{name:'Massage & Tantra',category:'massage',image:'category-tantra.webp'},
 'haus-und-hotelbesuche':{name:'Haus- & Hotelbesuche',service:'outcall',image:'category-vip.webp'},
 'domina-bdsm':{name:'Domina & BDSM',category:'bdsm',image:'category-bdsm.webp'},
 'dinner-date':{name:'Dinner & Begleitung',service:'dinner',image:'category-escort.webp'},
 'trans-escort':{name:'Trans Escort',category:'trans',image:'category-trans.webp'},
 'paare-und-bisex':{name:'Begleitung für Paare',service:'couples',image:'category-clubs.webp'},
};
export function serviceMatches(o:Offer,service?:string){
 if(!service)return true;
 if(Array.isArray(o.services))return o.services.includes(service);
 const terms=[o.rawName,o.bio,...(Array.isArray(o.includedTags)?o.includedTags:[])].filter(Boolean).join(' ');
 if(service==='outcall')return o.outcall===true;
 if(service==='gfe')return /\bgfe\b|girlfriend/i.test(terms);
 if(service==='dinner')return /dinner|abendbegleitung/i.test(terms);
 if(service==='couples')return /paare|couples|bisex/i.test(terms);
 return false;
}
export function DiscoveryPage({config}:{config?:DiscoveryConfig}){
 const router=useRouter();const {visibleOffers,states,blockedIds,loading,error}=useCatalogue();
 const [density,setDensity]=useState<'detail'|'compact'>('detail');
 const [savedSearches,setSavedSearches]=useState<SavedSearch[]>([]),[storageMessage,setStorageMessage]=useState('');
 useEffect(()=>{
  const read=()=>{try{setSavedSearches(parseSavedSearches(localStorage.getItem(SAVED_SEARCH_KEY)));}catch{setStorageMessage('Dein Browser erlaubt hier keinen lokalen Speicher. Die Suche funktioniert weiterhin.');}};
  const sync=(event:StorageEvent)=>{if(event.key===SAVED_SEARCH_KEY||event.key===null)read();};
  read();window.addEventListener('storage',sync);return()=>window.removeEventListener('storage',sync);
 },[]);
 const queryFilters=filtersFromQuery(router.query);
 const filters:CatalogueFilters={...queryFilters,...(config?.canton?{canton:config.canton}:{}),...(config?.category?{category:config.category}:{}),...(config?.q?{q:config.q}:{})};
 const results=useMemo(()=>filterOffers(visibleOffers,filters,states,blockedIds).filter(o=>serviceMatches(o,config?.service)),[visibleOffers,states,blockedIds,JSON.stringify(filters),config?.service]);
 const change=(next:Partial<CatalogueFilters>)=>router.push(searchHref({...filters,...next,invalid:false}));
 const activeFilters:{id:string;label:string;reset:Partial<CatalogueFilters>}[]=[];
 if(filters.canton&&filters.canton!=='ALL')activeFilters.push({id:'canton',label:REGIONS.find(r=>r.canton===filters.canton)?.name||filters.canton,reset:{canton:'ALL'}});
 if(filters.category&&filters.category!=='all')activeFilters.push({id:'category',label:CATEGORIES.find(c=>c.id===filters.category)?.label||filters.category,reset:{category:'all'}});
 if(filters.max)activeFilters.push({id:'max',label:`Bis CHF ${filters.max} / 60 Min.`,reset:{max:0}});
 if(filters.price==='missing')activeFilters.push({id:'price',label:'Preis auf Anfrage',reset:{price:''}});
 if(filters.available)activeFilters.push({id:'available',label:'Bestätigte Verfügbarkeit',reset:{available:false}});
 if(filters.wa)activeFilters.push({id:'wa',label:'Schweizer Kontaktnummer',reset:{wa:false}});
 if(filters.q)activeFilters.push({id:'q',label:`Suche: ${filters.q}`,reset:{q:''}});
 const saveCurrent=()=>{
  const href=config?.service?router.asPath:searchHref(filters);
  const label=[...(config?.service?[config.title]:[]),...activeFilters.map(filter=>filter.label),filters.sort==='region'?'Nach Ort':filters.sort==='price'?'Preis aufsteigend':''].filter(Boolean).join(' · ')||'Ganze Schweiz · Alle Bereiche';
  try{const result=saveSearch(localStorage,{href,label});setSavedSearches(result.entries);setStorageMessage({saved:'Auswahl auf diesem Gerät gespeichert.',exists:'Diese Auswahl ist bereits auf diesem Gerät gespeichert.',full:'Fünf Suchen sind gespeichert. Entferne zuerst eine Auswahl.',invalid:'Diese Auswahl konnte nicht gespeichert werden. Setze ungültige Filter zuerst zurück.'}[result.outcome]);}catch{setStorageMessage('Speichern nicht möglich: Dein Browser hat den lokalen Speicher abgelehnt. Es wurde nichts als gespeichert bestätigt.');}
 };
 const removeSaved=(href:string)=>{try{setSavedSearches(removeSavedSearch(localStorage,href));setStorageMessage('Gespeicherte Auswahl von diesem Gerät entfernt.');}catch{setStorageMessage('Entfernen nicht möglich: Dein Browser hat den lokalen Speicher abgelehnt.');}};
 const title=config?.title||'Deine Auswahl. Dein Moment.';
 return <main id="main" className="night-page"><SEO title={`${title} | iwantsexnow.ch`} description={config?.description||'Schweizer Profile nach Region und Bereich entdecken. Quellen und bestätigte Preisangaben transparent vergleichen.'}/>
 {config?<section className="night-region-hero"><img src={brandAsset(config.image||'hero-tram.webp')} alt="Illustratives regionales Abendmotiv"/><div className="night-container night-section"><div className="night-breadcrumb"><Link href="/">Start</Link><span>/</span><Link href="/search">Entdecken</Link><span>/ {config.canton}</span></div><p className="night-kicker">Dein regionaler Überblick</p><h1>{title}</h1><p className="night-lead">{config.description}</p><span className="night-note">Regionale Auswahl im Kanton {config.canton} · Titelbild: KI-Illustration</span></div></section>:<div className="night-container night-page-intro"><p className="night-kicker">Entdecken · Schweiz</p><h1>{title}</h1><p>Wähle, was dir wichtig ist. Der nächste Schritt gehört dir.</p></div>}
 <section className="night-container night-section"><TouchSearch filters={filters}/>
 <div className="night-discovery-utility"><div><span className="night-kicker">Dein persönlicher Einstieg</span><p>Weniger suchen. Schneller wiederfinden.</p><small>Speichert deine Filter nur auf diesem Gerät.</small></div><button type="button" className="night-button-secondary" onClick={saveCurrent} disabled={!!filters.invalid}><Bookmark size={17} aria-hidden="true"/> Auswahl speichern</button></div>
 <details className="night-saved-searches"><summary><Bookmark size={16} aria-hidden="true"/> Gespeicherte Suchen <span>{savedSearches.length} / {MAX_SAVED_SEARCHES}</span></summary><p className="night-note">Nur nach deinem Klick, nur in diesem Browser. Auf gemeinsam genutzten Geräten können andere diese Auswahl sehen. Du kannst sie hier einzeln entfernen.</p>{savedSearches.length?<ul>{savedSearches.map(entry=><li key={entry.href}><Link href={entry.href}><span>{entry.label}</span><ArrowRight size={17} aria-hidden="true"/></Link><button type="button" className="night-icon-button" aria-label={`Gespeicherte Suche entfernen: ${entry.label}`} onClick={()=>removeSaved(entry.href)}><Trash2 size={17} aria-hidden="true"/></button></li>)}</ul>:<p className="night-note">Noch keine Auswahl gespeichert. Mit „Auswahl speichern“ nimmst du deine aktuellen Filter hier auf.</p>}</details>
 {storageMessage&&<p className="night-storage-message" role="status"><Info size={16} aria-hidden="true"/>{storageMessage}</p>}
 <div className="night-filter-panel"><div className="night-row" role="group" aria-label="Bereich wählen">{CATEGORIES.map(c=><button className="night-chip" type="button" key={c.id} aria-pressed={filters.category===c.id} onClick={()=>change({category:c.id})}>{c.label}</button>)}</div><div className="night-row">
 <label>Region<select aria-label="Region filtern" value={filters.canton} onChange={e=>change({canton:e.target.value})}><option value="ALL">Ganze Schweiz</option>{CANTONS.map(c=><option key={c} value={c}>{REGIONS.find(r=>r.canton===c)?.name||c} ({c})</option>)}</select></label>
 <label>Preisrahmen<select aria-label="Preis filtern" value={filters.price==='missing'?'missing':String(filters.max||0)} onChange={e=>change({price:e.target.value==='missing'?'missing':'',max:Number(e.target.value)||0})}><option value="0">Alle Preisangaben</option><option value="missing">Preis auf Anfrage</option><option value="200">Bis CHF 200 / 60 Min.</option><option value="400">Bis CHF 400 / 60 Min.</option></select></label>
 <label>Reihenfolge<select value={filters.sort} onChange={e=>change({sort:e.target.value})}><option value="default">Reihenfolge im Verzeichnis</option><option value="region">Nach Ort</option><option value="price">Bestätigter Preis aufsteigend</option></select></label></div>
 <div className="night-row"><label style={{display:'flex',alignItems:'center',gap:10,flex:'none'}}><input type="checkbox" checked={!!filters.available} onChange={e=>change({available:e.target.checked})}/> Nur zeitlich bestätigte Verfügbarkeit</label><Link className="night-text-button" href="/search">Filter zurücksetzen</Link></div>
 <details><summary className="night-note" style={{cursor:'pointer'}}>Namen oder Ort eingeben (optional)</summary><form className="night-row" onSubmit={e=>{e.preventDefault();const d=new FormData(e.currentTarget);change({q:String(d.get('q')||'')});}}><label>Name oder Ort<input name="q" type="search" defaultValue={filters.q} key={filters.q} maxLength={150} placeholder="Zum Beispiel Zürich"/></label><button className="night-button-secondary" type="submit">Anwenden</button></form></details></div>
 {(activeFilters.length>0||config?.service)&&<div className="night-active-filters" role="group" aria-label="Aktive Filter entfernen"><span>Deine Auswahl</span>{activeFilters.map(filter=><button type="button" className="night-chip" key={filter.id} onClick={()=>change(filter.reset)} aria-label={`Filter entfernen: ${filter.label}`}>{filter.label}<X size={14} aria-hidden="true"/></button>)}{config?.service&&<Link className="night-chip" href={searchHref(filters)} aria-label={`Bereich entfernen: ${config.title}`}>{config.title}<X size={14} aria-hidden="true"/></Link>}<Link href="/search" className="night-text-button">Alles öffnen</Link></div>}
 <div className="night-section-title night-results-heading"><div><h2>{config?'Profile in deiner Auswahl':'Profile entdecken'}</h2><p className="night-count" aria-live="polite">{loading&&!results.length?'Einträge werden geladen …':`${results.length.toLocaleString('de-CH')} Einträge`}</p></div><div className="night-density-control" role="group" aria-label="Profildarstellung"><button type="button" aria-pressed={density==='detail'} onClick={()=>setDensity('detail')}><Grid2X2 size={17} aria-hidden="true"/><span>Detail</span></button><button type="button" aria-pressed={density==='compact'} onClick={()=>setDensity('compact')}><LayoutGrid size={17} aria-hidden="true"/><span>Kompakt</span></button></div></div>
 {error&&<p className="night-note" role="status">{error}</p>}
 {filters.invalid&&<p role="alert">Diese Filteradresse enthält eine ungültige oder mehrfache Auswahl. Wähle die Filter neu oder setze sie zurück.</p>}
 {!loading&&!results.length?<div className="night-empty"><h2>Hier ist die Auswahl noch leer.</h2><p>Für diese Kombination liegen keine passenden Angaben vor. Du kannst den Preisrahmen öffnen oder eine andere Region wählen.</p><Link className="night-button" href={searchHref({canton:filters.canton,category:filters.category})}>Preis und Verfügbarkeit offenlassen</Link><p className="night-note" style={{marginTop:16}}>Unbestätigte Preise und Statusangaben werden nicht ergänzt.</p></div>:<ProfileGrid offers={results} density={density}/>}
 </section><section className="night-container night-section"><div className="night-section-title"><h2>Ein anderer Ort. Neue Möglichkeiten.</h2></div><RegionCards/></section></main>;
}
