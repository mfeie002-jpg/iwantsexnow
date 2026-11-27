import {formatSwissCount} from '@/lib/format-swiss-count';
import React,{createContext,useContext,useEffect,useRef,useState} from 'react';
import Link from 'next/link';
import {useRouter} from 'next/router';
import * as Dialog from '@radix-ui/react-dialog';
import {ArrowRight,Heart,House,MapPin,Menu,Search,SlidersHorizontal,Sparkles,UserRound,X} from 'lucide-react';
import {brandAsset,CANTONS,CATEGORIES,CATALOGUE_SERVICES,REGIONS,filtersFromQuery,searchHref,CatalogueFilters} from '@/lib/night-catalogue';
import {catalogueBudgetChoices,guideFilters,skipGuideStep} from '@/lib/night-guide-model';
import {NightTools,QuickActionsButton} from './NightTools';
export {QuickActionsButton} from './NightTools';
import {useCatalogue} from './CatalogueContext';
import {useAvailabilityRefresh} from './use-availability-refresh';
const GuideContext=createContext<{openGuide:(step?:number,filters?:CatalogueFilters)=>void}>({openGuide:()=>{}});
export const useNightGuide=()=>useContext(GuideContext);
function Wordmark(){return <Link href="/" className="night-wordmark" aria-label="iwantsexnow.ch Startseite"><X aria-hidden="true"/><span>iwantsexnow<span>.ch</span></span></Link>;}
const nav=[['/suche','Entdecken'],['/regionen','Regionen'],['/portalvergleich','Portale vergleichen'],['/ratgeber','Ratgeber'],['/anbieter','Für Anbieterinnen']];
export function NightShell({children,initialFilters}:{children:React.ReactNode;initialFilters?:CatalogueFilters}) {
 const router=useRouter();const {favorites,compareIds,selectionNotice,dismissSelectionNotice}=useCatalogue();
 const [open,setOpen]=useState(false),[menu,setMenu]=useState(false),[step,setStep]=useState(0);
 const [choice,setChoice]=useState<CatalogueFilters>({canton:'ALL',category:'all',max:0});
 const guideOpener=useRef<HTMLElement|null>(null);
 const menuOpener=useRef<HTMLElement|null>(null);
 const openGuide=(start=0,filters?:CatalogueFilters)=>{guideOpener.current=document.activeElement as HTMLElement;setChoice(guideFilters({...initialFilters ?? filtersFromQuery(router.query),...filters}));setStep(Math.min(3,Math.max(0,start)));setMenu(false);setOpen(true);};
 useEffect(()=>{setOpen(false);setMenu(false);},[router.asPath]);
 const select=(next:CatalogueFilters)=>{setChoice(c=>({...c,...next,invalid:false}));setStep(s=>Math.min(3,s+1));};
 const skip=()=>{setChoice(c=>skipGuideStep(c,step));setStep(s=>Math.min(3,s+1));};
 const choiceHref=searchHref(choice);
 const [countResult,setCountResult]=useState<{href:string;total:number;expiry?:number}|null>(null);
 const matchCount=countResult?.href===choiceHref ? countResult.total : null;
 const [countLoading,setCountLoading]=useState(false);
 const [countError,setCountError]=useState('');
 const [countRetry,setCountRetry]=useState(0);
 useAvailabilityRefresh(open && !!choice.available,choiceHref,
   countResult?.href===choiceHref ? countResult.expiry : undefined,()=>setCountRetry(n=>n+1));
 // The guide needs an accurate filtered count, not the first 24 visible cards.
 useEffect(()=>{
   if(!open)return;
   const controller=new AbortController();
   let active=true;
   setCountResult(null);setCountLoading(true);setCountError('');
   const timer=setTimeout(async()=>{
     const params=new URLSearchParams(choiceHref.split('?')[1]||'');
     params.set('count','1');
     try{
       const response=await fetch('/api/catalogue/page?'+params.toString(),{
         signal:controller.signal,cache:'no-store'
       });
       if(!response.ok)throw new Error('Catalogue unavailable');
       const answer=await response.json();
       if(!Number.isSafeInteger(answer.total)||answer.total<0)throw new Error('Invalid count');
       if(active){setCountResult({href:choiceHref,total:answer.total,
         expiry:Number.isSafeInteger(answer.nextAvailabilityExpiry)?answer.nextAvailabilityExpiry:undefined});setCountLoading(false);}
     }catch{
       if(active&&!controller.signal.aborted){
         setCountError('Die aktuelle Anzahl kann gerade nicht ermittelt werden.');
         setCountLoading(false);
       }
     }
   },120);
   return()=>{active=false;clearTimeout(timer);controller.abort();};
 },[open,choiceHref,countRetry]);
 const budget = catalogueBudgetChoices(choice);
 const retainedCriteria = [
   choice.q && `Stichwort «${choice.q}»`,
   choice.wa && 'Schweizer Kontaktnummer',
   choice.sort === 'region' && 'Sortierung nach Ort',
   choice.sort === 'price' && 'Sortierung nach Preis',
 ].filter(Boolean);
 const region=REGIONS.find(r=>r.canton===choice.canton)?.name||(choice.canton==='ALL'?'Ganze Schweiz':choice.canton);
 return <GuideContext.Provider value={{openGuide}}><NightTools onGuide={()=>openGuide()}><div className="swiss-night">
  <a className="night-skip" href="#main">Zum Inhalt</a>
  <header className="night-header"><div className="night-container night-header-inner"><Wordmark/>
   <nav className="night-desktop-nav" aria-label="Hauptnavigation">{nav.map(([url,label])=><Link key={url} href={url} aria-current={router.pathname===url?'page':undefined}>{label}</Link>)}</nav>
   <div className="night-header-actions"><button type="button" className="flagship-header-xenia night-desktop-only" onClick={()=>openGuide(0)}><Sparkles size={14}/> Xenia</button><Link href="/eintrag" className="flagship-header-insert night-desktop-only">+ Inserieren</Link><Link href="/login" className="flagship-header-login night-desktop-only">Anmelden</Link><button type="button" className="night-icon-button night-mobile-only" onClick={event=>{menuOpener.current=event.currentTarget;setMenu(true);}} aria-label="Menü öffnen"><Menu/></button></div>
  </div></header>
  {children}
  {selectionNotice&&<div className="night-selection-notice" role="status"><span>{selectionNotice}</span><button type="button" className="night-icon-button" aria-label="Auswahlhinweis schliessen" onClick={dismissSelectionNotice}><X size={18}/></button></div>}
  <footer className="night-footer"><div className="night-footer-scene"><img src={brandAsset('footer.webp')} alt="Illustrative Schweizer Abendlandschaft" loading="lazy"/><span>Die Schweiz. Dein Moment.</span></div><div className="night-container"><div className="night-footer-grid"><div><Wordmark/><p>Dein Moment. Deine Wahl.<br/>Das Schweizer Verzeichnis für einen selbstbestimmten Überblick.</p><span className="night-pill">Zugang ab 18 Jahren</span></div>{[
   ['Entdecken',['/search','Alle Profile'],['/escort-zurich','Zürich'],['/orte/zug','Zug & Umgebung'],['/clubs','Clubs & Studios'],['/favorites','Meine Merkliste']],
   ['Klarheit',['/how-it-works','So funktioniert es'],['/reviews','Portalvergleich'],['/pricing','Preise verstehen'],['/safety','Sicherheit & Vertrauen'],['/report','Eintrag melden']],
   ['Dein Auftritt',['/advertise','Für Anbieter'],['/register','Profil vorbereiten'],['/creator-dashboard','Arbeitsbereich'],['/privacy','Datenschutz'],['/imprint','Kontakt & Impressum'],['/terms','AGB']],
  ].map(([title,...links]:any)=><div key={title}><h2>{title}</h2>{links.map(([url,label]:string[])=><Link key={url} href={url}>{label}</Link>)}</div>)}</div><div className="night-footer-bottom"><span>© {new Date().getFullYear()} iwantsexnow.ch</span><span>Quellenangaben sind keine Identitätsprüfung.</span></div></div></footer>
  <nav className="night-bottom-nav" aria-label="Mobile Navigation"><Link href="/" aria-current={router.pathname==='/'?'page':undefined}><House size={21}/><span>Start</span></Link><Link href="/suche" aria-current={router.pathname==='/search'||router.pathname==='/suche'?'page':undefined}><Search size={21}/><span>Suche</span></Link><button type="button" className="flagship-mobile-xenia" onClick={()=>openGuide(0)}><Sparkles size={22}/><span>Xenia</span></button><Link href="/regionen"><MapPin size={21}/><span>Regionen</span></Link><Link href="/login"><UserRound size={21}/><span>Konto</span></Link></nav>
  <Dialog.Root open={open} onOpenChange={setOpen}><Dialog.Portal><Dialog.Overlay className="night-dialog-overlay"/><Dialog.Content className="night-dialog night-guide-2027" onCloseAutoFocus={event=>{event.preventDefault();if(guideOpener.current?.isConnected)guideOpener.current.focus();}}><Dialog.Close className="night-icon-button night-dialog-close" aria-label="Auswahl schliessen"><X/></Dialog.Close><p className="night-kicker">Mit Xenia entdecken</p><Dialog.Title>{['Deine Region.','Dein Bereich.','Deine Zeit.','Deine Auswahl steht.'][step]}</Dialog.Title><Dialog.Description>{['Wo beginnt dein Moment?','Was möchtest du näher kennenlernen?','Wann möchtest du dich umsehen?','Jeden Teil deiner Auswahl kannst du direkt bearbeiten.'][step]}</Dialog.Description>
   <nav className="night-guide-steps" aria-label="Auswahlschritte">{['Region','Bereich','Zeit'].map((label,i)=><button type="button" key={label} onClick={()=>setStep(i)} aria-current={step===i?'step':undefined}><span>{i+1}</span>{label}</button>)}</nav>
   {step===0&&<div className="night-options"><button onClick={()=>select({canton:'ALL'})}>Ganze Schweiz</button>{REGIONS.map(r=><button key={r.canton} onClick={()=>select({canton:r.canton})}>{r.name}</button>)}<details className="night-more-cantons"><summary>Weitere Kantone</summary><div className="night-options">{CANTONS.filter(c=>!REGIONS.some(r=>r.canton===c)).map(c=><button key={c} onClick={()=>select({canton:c})}>{c}</button>)}</div></details></div>}
   {step===1&&<div className="night-options">{CATEGORIES.map(c=><button key={c.id} onClick={()=>select({category:c.id})}>{c.label}</button>)}<Link href="/clubs" className="night-button-secondary">Clubs & Studios <ArrowRight size={16}/></Link></div>}
   {step===2&&<>
    <div className="night-options"><button type="button" aria-pressed={!choice.available} onClick={()=>select({available:false})}>Flexibel · Zeit offen</button><button type="button" aria-pressed={!!choice.available} onClick={()=>select({available:true})}>Jetzt bestätigte Zeitfenster</button></div>
    <p className="night-note">Ein Zeitwunsch ist keine Verfügbarkeitsbestätigung. „Jetzt“ zeigt nur Einträge mit einer ausdrücklichen, noch gültigen Anbieterbestätigung.</p>
   </>}
   {step===3&&<>
    <div className="night-guide-summary">{[['Region',region],['Bereich',CATEGORIES.find(c=>c.id===choice.category)?.label],['Zeit',choice.available?'Jetzt bestätigt':'Flexibel']].map(([label,value],i)=>(
      <button type="button" key={label} onClick={()=>setStep(i)}><span>{label}<strong>{value}</strong></span><span>Ändern <ArrowRight size={15}/></span></button>
    ))}</div>
    <details className="flagship-optional-budget"><summary>Preisrahmen zusätzlich wählen (optional)</summary><div className="night-options">{budget.options.map(option=><button type="button" key={option.value} aria-pressed={budget.current===option.value} onClick={()=>setChoice(c=>({...c,...option.changes}))}>{option.label}</button>)}</div><p className="night-note">Nur nachweislich bestätigte Honorare zählen für den Preisfilter.</p></details>
   </>}
   {choice.service&&<button type="button" className="night-chip" aria-label={`Filter entfernen: ${CATALOGUE_SERVICES[choice.service]}`} onClick={()=>setChoice(previous=>({...previous,service:''}))}>{CATALOGUE_SERVICES[choice.service]}<X size={14} aria-hidden="true"/></button>}
   {retainedCriteria.length>0&&<p className="night-note">Weitere Auswahl · {retainedCriteria.join(' · ')}</p>}
   <div className="night-guide-result" aria-live="polite"><span className="night-guide-result-number">{matchCount===null?(countLoading?'…':'—'):formatSwissCount(matchCount)}</span><span>{matchCount===null?'Katalogdaten noch nicht verfügbar':'Einträge in deiner Auswahl'}<small>{choice.available?'Mit aktuell bestätigtem Zeitfenster':'Zeitfenster offen'}</small></span></div>
   {countError&&<div className="night-row" role="alert"><p className="night-note">{countError}</p><button type="button" className="night-text-button" onClick={()=>setCountRetry(n=>n+1)}>Erneut versuchen</button></div>}
   {step===3?(matchCount!==null?<><Link href={searchHref(choice)} className="night-button night-guide-submit">{matchCount?'Auswahl ansehen':'Auswahl und Filter ansehen'} <ArrowRight size={18}/></Link>{matchCount===0&&<p className="night-note">Diese Kombination hat keine Treffer. Du kannst deine Filter bearbeiten.</p>}</>:<button type="button" disabled className="night-button night-guide-submit">{countLoading?'Katalog wird geprüft …':'Katalog derzeit nicht verfügbar'}</button>):<div className="night-row night-guide-controls">{step>0&&<button className="night-text-button" onClick={()=>setStep(s=>s-1)}>← Zurück</button>}<button className="night-text-button" onClick={skip}>Diesen Schritt offenlassen</button></div>}
   <p className="night-note">Für diese Auswahl brauchst du keine Standortfreigabe.</p>
  </Dialog.Content></Dialog.Portal></Dialog.Root>
  <Dialog.Root open={menu} onOpenChange={setMenu}><Dialog.Portal><Dialog.Overlay className="night-dialog-overlay"/><Dialog.Content className="night-dialog" onCloseAutoFocus={event=>{event.preventDefault();if(menuOpener.current?.isConnected)menuOpener.current.focus();}}><Dialog.Close className="night-icon-button night-dialog-close" aria-label="Menü schliessen"><X/></Dialog.Close><Dialog.Title>Dein Überblick.</Dialog.Title><Dialog.Description>Entdecken und deinen Auftritt verwalten.</Dialog.Description><nav className="night-menu-links">{[...nav,['/login','Anmelden'],['/advertise','Für Anbieter'],['/creator-dashboard','Arbeitsbereich']].map(([url,label])=><Link key={url} href={url}>{label}<ArrowRight size={18}/></Link>)}</nav></Dialog.Content></Dialog.Portal></Dialog.Root>
 </div></NightTools></GuideContext.Provider>;
}
export function TouchSearch({filters={}}:{filters?:CatalogueFilters}){const {openGuide}=useNightGuide();return <div className="night-touch-search" aria-label="Deine Auswahl"><button type="button" onClick={()=>openGuide(0,filters)}><span><MapPin size={15}/> Wo?</span><strong>{REGIONS.find(r=>r.canton===filters.canton)?.name||(filters.canton&&filters.canton!=='ALL'?filters.canton:'Ganze Schweiz')} ›</strong></button><button type="button" onClick={()=>openGuide(1,filters)}><span><Sparkles size={15}/> Was?</span><strong>{CATEGORIES.find(c=>c.id===filters.category)?.label||'Alle Angebote'} ›</strong></button><button type="button" onClick={()=>openGuide(2,filters)}><span><SlidersHorizontal size={15}/> Wann?</span><strong>{filters.available?'Jetzt bestätigt':'Flexibel'} ›</strong></button><Link href={searchHref(filters)} className="night-button"><Search size={18}/> Entdecken</Link></div>;}
export function GuideButton({children='Hilf mir beim Einstieg'}:{children?:React.ReactNode}){const {openGuide}=useNightGuide();return <button type="button" className="night-button" onClick={()=>openGuide()}><Sparkles size={19}/>{children}</button>;}
